"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { charmSprite } from "@/content/charmSprite";

/**
 * "The charm" — a small isolated ASCII sprite (src/content/charmSprite.ts,
 * downsampled from the hero portrait) that flies through the whole page as you
 * scroll:
 *   1. diagonally side-to-side down the page (hero → experience),
 *   2. streaking along the side while the projects section pans horizontally,
 *   3. homing into the "alan roybal" wordmark, where it lands with an amber
 *      shockwave and the wordmark jolts — then the charm vanishes.
 *
 * Everything is a pure function of scroll position, so it scrubs both ways:
 * scrolling back up rewinds the flight and un-hits the wordmark. Disabled under
 * prefers-reduced-motion (the sprite simply never shows).
 */
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

export function ScrollCharm() {
  const charmRef = useRef<HTMLPreElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const charm = charmRef.current;
    const ring = ringRef.current;
    if (!charm || !ring) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // cached layout (recomputed on refresh/resize — never per scroll frame)
    let vw = 0;
    let vh = 0;
    let total = 0;
    let projTop = 0;
    let projBottom = 0;
    let impactScroll = 0; // scroll position at which the charm lands the hit
    let hitX = 0; // viewport-stable x of the impact point on the wordmark
    let hitDocY = 0; // document y of the impact point
    let wordmark: HTMLElement | null = null;

    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      // maxScroll can read stale during pin/font settling — take the larger of
      // ScrollTrigger's value and the live document height.
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
        // read the wordmark's resting position (ignore any jolt transform)
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
      // Land the hit when the wordmark sits ~58% down the viewport, but always
      // keep runway after so the charm can finish vanishing. The footer reserves
      // ~42vh of scroll space below the wordmark for exactly this.
      impactScroll = clamp(hitDocY - vh * 0.58, projBottom + 1, total - vh * 0.2);
      render();
    };

    const render = () => {
      const s = window.scrollY;
      let x: number;
      let y: number;
      let rot = 0;
      let scale = 1;
      let opacity = 1;

      if (s < projTop) {
        // 1) diagonal side-to-side descent
        const a = clamp(s / Math.max(1, projTop), 0, 1);
        x = vw * (0.5 + 0.33 * Math.sin(a * Math.PI * 3));
        y = vh * (0.16 + 0.62 * a) + Math.sin(a * Math.PI * 6) * vh * 0.03;
        rot = Math.cos(a * Math.PI * 3) * 10;
        opacity = smooth(clamp(s / (vh * 0.35), 0, 1));
      } else if (s < projBottom) {
        // 2) streak along the bottom side while projects pans
        const b = clamp((s - projTop) / Math.max(1, projBottom - projTop), 0, 1);
        x = vw * (0.1 + 0.8 * b);
        y = vh * (0.8 + 0.05 * Math.sin(b * Math.PI * 4));
        rot = 6;
      } else {
        // 3) home into the wordmark's position at the moment of impact
        const c = smooth(clamp((s - projBottom) / Math.max(1, impactScroll - projBottom), 0, 1));
        const sx = vw * 0.9;
        const sy = vh * 0.82;
        const ty = hitDocY - impactScroll; // wordmark viewport y at impact
        x = sx + (hitX - sx) * c;
        y = sy + (ty - sy) * c;
        rot = (1 - c) * 6;
      }

      // impact envelope, centred on the moment the charm reaches the wordmark
      const half = vh * 0.16;
      const k = clamp((s - (impactScroll - half)) / (2 * half), 0, 1);
      const pulse = Math.sin(k * Math.PI); // 0 → 1 → 0 (jolt, then settle)
      if (s >= projBottom) {
        scale = 1 + pulse * 0.5; // pops on contact
        opacity = 1 - smooth(clamp((k - 0.5) / 0.5, 0, 1)); // fades after the hit
      }

      charm.style.opacity = String(opacity);
      charm.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`;

      // wordmark jolt + glow + amber shock ring
      if (wordmark) {
        if (pulse > 0.001) {
          const tx = pulse * Math.sin(k * Math.PI * 9) * 8;
          const ty = pulse * Math.cos(k * Math.PI * 7) * 5;
          const wr = pulse * Math.sin(k * Math.PI * 11) * 1.6;
          wordmark.style.transform = `translate(${tx}px, ${ty}px) rotate(${wr}deg) scale(${1 + pulse * 0.02})`;
          wordmark.style.textShadow = `0 0 ${pulse * 34}px rgba(233,162,59,${pulse * 0.8})`;
        } else {
          wordmark.style.transform = "";
          wordmark.style.textShadow = "";
        }
      }
      const ringX = hitX;
      const ringY = hitDocY - s;
      ring.style.opacity = String(pulse * 0.7);
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${0.3 + pulse * 2.2})`;
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
    // safety re-measure once async layout (honeycomb, pins) has settled
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 900);

    return () => {
      st.kill();
      window.removeEventListener("load", onLoad);
      window.clearTimeout(settle);
      if (wordmark) {
        wordmark.style.transform = "";
        wordmark.style.textShadow = "";
      }
    };
  }, []);

  return (
    <>
      <pre
        ref={charmRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[55] m-0 select-none font-mono leading-[1] opacity-0"
        style={{
          fontSize: "clamp(7px, 1.05vw, 11px)",
          color: "var(--color-accent)",
          textShadow: "0 0 9px rgba(233,162,59,0.5)",
          willChange: "transform, opacity",
        }}
      >
        {charmSprite}
      </pre>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[45] h-24 w-24 rounded-full border border-accent opacity-0"
        style={{ willChange: "transform, opacity" }}
      />
    </>
  );
}
