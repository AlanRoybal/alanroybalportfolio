"use client";

import { useEffect, useRef } from "react";

/**
 * A dithered "dot artwork" city skyline — a procedural skyline rendered as a
 * halftone field of dots (ordered Bayer dithering, denser toward the base, fading
 * to sparse near the rooftops). Asset-free and drawn in code, it closes the page
 * the way the reference site does. Static (no animation), so reduced-motion safe.
 */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16));

const CELL = 3; // px between dots
const DOT = 1.5; // dot size

export function DitherSkyline({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    // tiny seeded RNG so the skyline is stable across renders/resizes
    const makeRng = (seed: number) => () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    type Building = { x0: number; x1: number; top: number };
    let buildings: Building[] = [];

    const generate = () => {
      const rng = makeRng(20260629);
      buildings = [];
      let x = -20;
      while (x < w + 20) {
        const bw = 16 + Math.floor(rng() * 58);
        const tall = rng() < 0.18;
        const hh = (tall ? 0.62 + rng() * 0.34 : 0.22 + rng() * 0.42) * h;
        buildings.push({ x0: x, x1: x + bw, top: h - hh });
        x += bw + (rng() < 0.25 ? 2 + Math.floor(rng() * 6) : 0);
      }
    };

    const topAt = (px: number): number => {
      for (const b of buildings) if (px >= b.x0 && px < b.x1) return b.top;
      return h; // gap → no building
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(199,191,176,0.7)";
      for (let cy = 0; cy < h; cy += CELL) {
        const yFrac = cy / h;
        // density: sparse near the rooftops/top, solid near the base
        const density = Math.max(0, Math.min(1, (yFrac - 0.08) * 1.7));
        if (density <= 0) continue;
        for (let cx = 0; cx < w; cx += CELL) {
          if (cy < topAt(cx)) continue; // above this column's building
          const threshold = BAYER[(cy / CELL) & 3][(cx / CELL) & 3];
          if (density > threshold) ctx.fillRect(cx, cy, DOT, DOT);
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      generate();
      draw();
    };

    resize();
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(resize);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
