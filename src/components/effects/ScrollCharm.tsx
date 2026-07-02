"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { charmSpriteFrames, charmSpriteCols } from "@/content/charmSprite";
import {
  prepareWithSegments,
  measureNaturalWidth,
  fontStringFrom,
} from "@/lib/pretext";
import { setCharmImpact } from "@/lib/charmImpact";

/**
 * "The charm" — the pink-hearts clip rasterised to white ASCII
 * (src/content/charmSprite.ts) — flies across the page as you scroll:
 *   1. diagonally side-to-side down the page (hero → experience),
 *   2. streaking along the side while the projects section pans horizontally,
 *   3. homing into the "alan roybal" wordmark at a shallow angle, whose impact
 *      resolves it (the wordmark un-scrambles via pretext — see CharmWordmark)
 *      with a small jolt; the charm then vanishes.
 *
 * The flight only reads as ornament while the page is moving. At rest the charm
 * would just be parked on top of whatever text is under it (it scrubs with
 * scroll, so it CAN stop mid-paragraph) — so it dims to near-invisible when
 * scrolling goes idle and brightens back the moment the page moves.
 *
 * The clip is drawn facing right (its left→right travel direction); when the
 * charm flies leftward it is mirrored. pretext pins the sprite's box width so
 * its varying-length frames never reflow as they animate. The flight is a pure
 * function of scroll position, so it scrubs both ways: scrolling back up rewinds
 * it and re-scrambles the wordmark. Disabled under prefers-reduced-motion.
 */
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const FRAME_MS = 46; // ~the clip's native frame rate
const SWEEPS = 4.5; // zigzag sweeps across the journey (ends off the right edge)
const OFF = 0.62; // x amplitude in vw — large enough to carry the charm fully off-screen
const IDLE_MS = 850; // no scroll for this long → the charm rests
const IDLE_DIM = 0.14; // resting opacity multiplier (won't fight text underneath)
const DIM_EASE = 0.08; // per-frame easing toward the active/resting multiplier

export function ScrollCharm() {
  const charmRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const charm = charmRef.current;
    if (!charm) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let vw = 0;
    let vh = 0;
    let total = 0;
    let projTop = 0;
    let projBottom = 0;
    let impactScroll = 0;
    let hitX = 0;
    let hitDocY = 0;
    let wordmark: HTMLElement | null = null;
    let lastX: number | null = null;
    let facing = 1; // 1 = drawn orientation (moving right), -1 = mirrored
    let envOpacity = 0; // flight envelope opacity (set by render)
    let dim = 1; // eased activity multiplier (1 scrolling → IDLE_DIM at rest)
    let lastScrollAt = 0;
    let lastS = -1;
    // the landing is a one-shot: hitstop → burst → hidden, re-armed on rewind
    let armed = true;
    let burstDone = false;
    let frozenUntil = 0;
    let burstTimer = 0;

    // pretext-pin the sprite's box width so varying-length frames never reflow.
    const pinWidth = () => {
      try {
        const { font, opts } = fontStringFrom(charm);
        const prepared = prepareWithSegments("0".repeat(charmSpriteCols), font, opts);
        const w = measureNaturalWidth(prepared);
        if (w > 0) charm.style.width = `${Math.ceil(w)}px`;
      } catch {
        /* best-effort */
      }
    };

    const measure = () => {
      pinWidth();
      vw = window.innerWidth;
      vh = window.innerHeight;
      total = Math.max(
        ScrollTrigger.maxScroll(window),
        document.documentElement.scrollHeight - vh,
      );
      const sY = window.scrollY;

      const proj = document.getElementById("projects");
      if (proj) {
        const r = proj.getBoundingClientRect();
        projTop = r.top + sY;
        projBottom = projTop + proj.offsetHeight - vh;
      } else {
        projTop = total * 0.45;
        projBottom = total * 0.7;
      }
      projTop = clamp(projTop, 0, total);
      projBottom = clamp(projBottom, projTop + 1, total);

      wordmark = document.querySelector<HTMLElement>("[data-charm-target]");
      if (wordmark) {
        const prevT = wordmark.style.transform;
        wordmark.style.transform = "";
        const r = wordmark.getBoundingClientRect();
        wordmark.style.transform = prevT;
        hitX = r.left + r.width * 0.26;
        hitDocY = r.top + sY + r.height * 0.5;
      } else {
        hitX = vw * 0.3;
        hitDocY = total + vh * 0.5;
      }
      impactScroll = clamp(hitDocY - vh * 0.85, projBottom + 1, total - vh * 0.14);
      render();
    };

    const render = () => {
      const s = window.scrollY;
      if (s !== lastS) {
        lastS = s;
        lastScrollAt = performance.now();
      }
      let x: number;
      let y: number;
      let rot = 0;
      let scale = 1;
      let opacity = 1;

      if (s < projBottom) {
        // one continuous zigzag down the page; each sweep carries the charm fully
        // off-screen and back. Ends off the right edge (sin(SWEEPS*pi) = 1).
        const g = clamp(s / Math.max(1, projBottom), 0, 1);
        x = vw * 0.5 + vw * OFF * Math.sin(g * Math.PI * SWEEPS);
        y = vh * (0.16 + 0.66 * g);
        rot = Math.cos(g * Math.PI * SWEEPS) * 8;
        opacity = smooth(clamp(s / (vh * 0.35), 0, 1));
      } else {
        // re-enter from the right and home into the wordmark at a SHALLOW angle:
        // settle to its height early, then travel horizontally into it.
        const c = smooth(clamp((s - projBottom) / Math.max(1, impactScroll - projBottom), 0, 1));
        const startX = vw * (0.5 + OFF); // continuous with the journey's end (off right)
        const startY = vh * 0.82;
        const ty = hitDocY - impactScroll; // wordmark viewport y at impact
        const cy = smooth(clamp(c / 0.5, 0, 1)); // reach target height by ~50%
        x = startX + (hitX - startX) * c;
        y = startY + (ty - startY) * cy;
        rot = (1 - c) * 3;
      }

      // mirror the sprite to face its travel direction (drawn facing right)
      if (lastX !== null) {
        if (x < lastX - 0.5) facing = -1;
        else if (x > lastX + 0.5) facing = 1;
      }
      lastX = x;

      // impact gate: the wordmark stays fully scrambled until the charm LANDS —
      // the whole flight is anticipation, the contact is the payoff
      const impacted = s >= impactScroll;
      setCharmImpact(impacted ? 1 : 0);

      if (impacted) {
        if (armed) {
          // hitstop: freeze the sprite for a beat, then it bursts into glyphs
          armed = false;
          frozenUntil = performance.now() + 90;
          burstTimer = window.setTimeout(() => {
            burstDone = true;
            burst();
          }, 90);
        }
        if (burstDone) opacity = 0; // the charm became the burst
      } else if (!armed && s < impactScroll - vh * 0.05) {
        // rewound above the landing — re-scramble happened, re-arm the moment
        armed = true;
        burstDone = false;
      }

      envOpacity = opacity;
      charm.style.opacity = String(envOpacity * dim);
      charm.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rot}deg) scale(${facing * scale}, ${scale})`;
    };

    /** The charm scatters into its own glyphs and hearts, rings echo outward,
     *  and a mono field note stamps the delivery. */
    const BURST_GLYPHS = ["@", "#", "%", "*", "=", "+", "~", ":"];
    const burst = () => {
      const yv = hitDocY - window.scrollY;
      // echo rings — the hit propagating outward and dying off
      for (const [size, dur, op] of [
        [440, 620, 0.7],
        [720, 950, 0.35],
      ] as const) {
        const ring = document.createElement("div");
        ring.style.cssText = `position:fixed;left:${hitX}px;top:${yv}px;width:24px;height:24px;margin:-12px 0 0 -12px;border:1.5px solid var(--color-accent);border-radius:9999px;pointer-events:none;z-index:44;`;
        document.body.appendChild(ring);
        ring
          .animate(
            [
              { transform: "scale(0.2)", opacity: op },
              { transform: `scale(${size / 24})`, opacity: 0 },
            ],
            { duration: dur, easing: "cubic-bezier(0.16,1,0.3,1)" },
          )
          .addEventListener("finish", () => ring.remove());
      }
      // glyph + heart shrapnel, fanned upward from the point of contact
      for (let i = 0; i < 18; i++) {
        const heart = i < 6;
        const span = document.createElement("span");
        span.textContent = heart ? "<3" : BURST_GLYPHS[i % BURST_GLYPHS.length];
        span.style.cssText = `position:fixed;left:${hitX}px;top:${yv}px;z-index:45;pointer-events:none;font-family:var(--font-mono);font-weight:600;font-size:${heart ? 15 : 13}px;color:${heart ? "var(--color-accent)" : "var(--color-text)"};text-shadow:0 0 10px rgba(233,162,59,0.5);`;
        document.body.appendChild(span);
        const ang = -Math.PI * (0.1 + 0.8 * Math.random());
        const dist = 50 + Math.random() * 130;
        const dx = Math.cos(ang) * dist;
        const dy = Math.sin(ang) * dist;
        span
          .animate(
            [
              { transform: "translate(-50%,-50%) scale(0.6) rotate(0deg)", opacity: 1 },
              {
                transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${0.9 + Math.random() * 0.5}) rotate(${(Math.random() - 0.5) * 140}deg)`,
                opacity: 0,
              },
            ],
            { duration: 700 + Math.random() * 350, easing: "cubic-bezier(0.16,1,0.3,1)" },
          )
          .addEventListener("finish", () => span.remove());
      }
    };

    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: render,
      onRefresh: measure,
    });

    measure();
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 900);

    // the sprite animates on its own clock (the hearts drift)
    let cancelled = false;
    let fi = 0;
    let lastF = 0;
    let rafA = 0;
    const animate = (t: number) => {
      if (cancelled) return;
      if (t < frozenUntil) {
        // hitstop — the sprite holds its frame for a beat at contact
        rafA = requestAnimationFrame(animate);
        return;
      }
      if (t - lastF >= FRAME_MS) {
        lastF = t;
        fi = (fi + 1) % charmSpriteFrames.length;
        charm.textContent = charmSpriteFrames[fi];
      }
      // rest when scrolling goes idle; wake instantly on movement
      const target = t - lastScrollAt > IDLE_MS ? IDLE_DIM : 1;
      const next = dim + (target - dim) * DIM_EASE;
      if (Math.abs(next - dim) > 0.0005) {
        dim = next;
        charm.style.opacity = String(envOpacity * dim);
      }
      rafA = requestAnimationFrame(animate);
    };
    rafA = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafA);
      st.kill();
      window.removeEventListener("load", onLoad);
      window.clearTimeout(settle);
      window.clearTimeout(burstTimer);
      setCharmImpact(0);
    };
  }, []);

  return (
    <pre
      ref={charmRef}
      aria-hidden="true"
      // z-40: above text and section backgrounds, but BELOW the lifted cards
      // (z-45) — the charm dips behind them as it sweeps, which is what sells
      // the page as a stack of planes instead of one surface.
      className="pointer-events-none fixed left-0 top-0 z-40 m-0 select-none font-mono leading-[1] opacity-0"
      style={{
        fontSize: "clamp(5px, 0.72vw, 9px)",
        color: "var(--color-text-strong)",
        textShadow: "0 0 6px rgba(185,125,34,0.22)",
        willChange: "transform, opacity",
      }}
    >
      {charmSpriteFrames[0]}
    </pre>
  );
}
