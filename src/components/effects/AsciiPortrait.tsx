"use client";

import { useEffect, useRef } from "react";
import { prepareWithSegments, measureNaturalWidth } from "@chenglou/pretext";
import { charmFrames, charmCols } from "@/content/charmFrames";

const COLS = charmCols;
const LEADING = 1.1;
const MS_PER_FRAME = 83; // ~12 fps — matches the source video sampling

/**
 * An ASCII-video animation: every frame of Alan's own generated clip is
 * rasterised to text (see scripts/gen-charm-from-video.mjs) and played back, so
 * each frame is genuinely distinct art with real motion — not one image + overlay.
 *
 * pretext drives the animation's layout: it measures the monospace advance with
 * zero DOM reflow, so the font is sized to fill the container at any width AND the
 * block is pinned to the full grid width — meaning frames of different line
 * lengths never shift the surrounding layout as they play. Reduced-motion / no-JS:
 * the first frame (the server-rendered child) is shown, unmoving.
 */
export function AsciiPortrait({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const pre = preRef.current;
    if (!wrap || !pre) return;

    let ratio = 0.6;
    const measureRatio = () => {
      const cs = getComputedStyle(pre);
      const font = `${cs.fontStyle} ${cs.fontWeight} 100px ${cs.fontFamily}`;
      try {
        const prepared = prepareWithSegments("0".repeat(COLS), font);
        const w100 = measureNaturalWidth(prepared);
        if (w100 > 0) ratio = w100 / (COLS * 100);
      } catch {
        /* keep fallback */
      }
    };
    const fit = () => {
      const avail = wrap.clientWidth || pre.clientWidth;
      const fs = Math.max(5, Math.min(22, avail / (COLS * ratio)));
      pre.style.fontSize = `${fs}px`;
      // pin to the full grid width so frames of varying length never reflow
      pre.style.width = `${Math.ceil(COLS * ratio * fs)}px`;
    };

    let cancelled = false;
    measureRatio();
    fit();
    document.fonts?.ready
      .then(() => {
        if (cancelled) return;
        measureRatio();
        fit();
      })
      .catch(() => {});
    window.addEventListener("resize", fit);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let i = 0;

    const tick = (now: number) => {
      if (cancelled) return;
      if (now - last >= MS_PER_FRAME) {
        last = now;
        i = (i + 1) % charmFrames.length;
        pre.textContent = charmFrames[i];
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
      else running = false;
    };
    const ensure = () => {
      if (!cancelled && !reduce && visible && !document.hidden && !running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    let io: IntersectionObserver | undefined;
    if (!reduce) {
      io = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? true;
          ensure();
        },
        { threshold: 0 },
      );
      io.observe(wrap);
      document.addEventListener("visibilitychange", ensure);
      ensure();
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io?.disconnect();
      document.removeEventListener("visibilitychange", ensure);
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full">
      <pre
        ref={preRef}
        aria-hidden="true"
        className={className}
        style={{
          color: "var(--text-strong)",
          fontVariantLigatures: "none",
          lineHeight: LEADING,
          margin: 0,
        }}
      >
        {charmFrames[0]}
      </pre>
    </div>
  );
}
