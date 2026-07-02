"use client";

import { useEffect, useRef } from "react";
import { charmSpriteFrames, charmSpriteCols } from "@/content/charmSprite";
import {
  prepareWithSegments,
  measureNaturalWidth,
  fontStringFrom,
} from "@/lib/pretext";

const NAME = "alan roybal";
const GLYPHS = "abcdefghijklmnopqrstuvwxyz01<>/{}#*+=";
const FLIGHT_MS = 2200; // charm crossing time; the CSS veil wipe starts at 2.6s
const FRAME_MS = 46;

/**
 * The load sequence: on a bg-coloured veil, the ASCII charm streaks left→right
 * straight through the wordmark, resolving its scrambled glyphs as it passes —
 * the same gesture that ends the page (ScrollCharm → CharmWordmark), played
 * forward as an overture. The veil then wipes up into the hero.
 *
 * The wipe is a CSS animation on `.intro-veil` (globals.css), so the veil
 * clears on a fixed clock even without JS — the server-rendered fallback is the
 * resolved name, briefly shown, then revealed page. Reduced motion: the veil is
 * display:none and nothing plays.
 */
export function IntroCharm() {
  const charmRef = useRef<HTMLPreElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const charm = charmRef.current;
    const name = nameRef.current;
    if (!charm || !name) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Pin the sprite's width so its varying-length frames don't wobble.
    try {
      const { font, opts } = fontStringFrom(charm);
      const prepared = prepareWithSegments("0".repeat(charmSpriteCols), font, opts);
      const w = measureNaturalWidth(prepared);
      if (w > 0) charm.style.width = `${Math.ceil(w)}px`;
    } catch {
      /* best-effort */
    }

    const chars = Array.from(NAME);
    let raf = 0;
    let fi = 0;
    let lastF = 0;
    const t0 = performance.now();

    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / FLIGHT_MS);
      // ease-in-out: the charm accelerates in, glides readably through the
      // name at mid-flight (where the resolve happens), and eases off-screen
      const e = p * p * (3 - 2 * p);

      // flight: from off-left to off-right, through the name's centreline
      const vw = window.innerWidth;
      const x = -0.18 * vw + e * 1.36 * vw;
      charm.style.transform = `translate3d(${x}px, -50%, 0)`;
      charm.style.opacity = p > 0.88 ? String(1 - (p - 0.88) / 0.12) : "1";

      if (t - lastF >= FRAME_MS) {
        lastF = t;
        fi = (fi + 1) % charmSpriteFrames.length;
        charm.textContent = charmSpriteFrames[fi];
      }

      // resolve glyphs the charm has already passed
      const rect = name.getBoundingClientRect();
      const seed = Math.floor(t / 40);
      let out = "";
      for (let i = 0; i < chars.length; i++) {
        const cx = rect.left + (rect.width * (i + 0.5)) / chars.length;
        out +=
          x >= cx || chars[i] === " "
            ? chars[i]
            : GLYPHS[(seed + i * 7) % GLYPHS.length];
      }
      name.textContent = out;

      if (p < 1) raf = requestAnimationFrame(step);
      else name.textContent = NAME;
    };
    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden="true" className="intro-veil">
      <p className="relative whitespace-nowrap font-display text-[length:clamp(1.9rem,6vw,4.2rem)] font-light lowercase tracking-[var(--tracking-tightest)] text-text-strong">
        <span ref={nameRef}>{NAME}</span>
        <span className="text-glow">.</span>
      </p>
      <pre
        ref={charmRef}
        className="pointer-events-none absolute left-0 top-1/2 m-0 select-none font-mono leading-[1] text-text-strong"
        style={{
          fontSize: "clamp(5px, 0.72vw, 9px)",
          textShadow: "0 0 6px rgba(255,255,255,0.16)",
          willChange: "transform, opacity",
        }}
      >
        {charmSpriteFrames[0]}
      </pre>
    </div>
  );
}
