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

      // wordmark resolve (0 → scrambled, 1 → resolved), completing on contact
      const resolve =
        s >= projBottom
          ? smooth(clamp((s - projBottom) / Math.max(1, impactScroll - projBottom), 0, 1))
          : 0;
      setCharmImpact(resolve);

      // impact envelope (jolt), centred on contact
      const half = vh * 0.08;
      const k = clamp((s - (impactScroll - half)) / (2 * half), 0, 1);
      const pulse = Math.sin(k * Math.PI);
      if (s >= projBottom) {
        scale = 1 + pulse * 0.45;
        opacity = 1 - smooth(clamp((k - 0.35) / 0.4, 0, 1));
      }

      charm.style.opacity = String(opacity);
      charm.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rot}deg) scale(${facing * scale}, ${scale})`;

      if (wordmark) {
        if (pulse > 0.001) {
          const tx = pulse * Math.sin(k * Math.PI * 9) * 7;
          const tyy = pulse * Math.cos(k * Math.PI * 7) * 5;
          const wr = pulse * Math.sin(k * Math.PI * 11) * 1.4;
          wordmark.style.transform = `translate(${tx}px, ${tyy}px) rotate(${wr}deg) scale(${1 + pulse * 0.02})`;
          wordmark.style.textShadow = `0 0 ${pulse * 26}px rgba(255,255,255,${pulse * 0.45})`;
        } else {
          wordmark.style.transform = "";
          wordmark.style.textShadow = "";
        }
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
      if (t - lastF >= FRAME_MS) {
        lastF = t;
        fi = (fi + 1) % charmSpriteFrames.length;
        charm.textContent = charmSpriteFrames[fi];
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
      setCharmImpact(0);
      if (wordmark) {
        wordmark.style.transform = "";
        wordmark.style.textShadow = "";
      }
    };
  }, []);

  return (
    <pre
      ref={charmRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[55] m-0 select-none font-mono leading-[1] opacity-0"
      style={{
        fontSize: "clamp(5px, 0.72vw, 9px)",
        color: "var(--color-text-strong)",
        textShadow: "0 0 6px rgba(255,255,255,0.16)",
        willChange: "transform, opacity",
      }}
    >
      {charmSpriteFrames[0]}
    </pre>
  );
}
