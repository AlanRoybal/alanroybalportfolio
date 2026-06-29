"use client";

import { useEffect, useRef } from "react";

/**
 * Counts a metric up to its value when it scrolls into view — draws the eye to
 * the numbers that matter (12+ tools, 5M+ records/day, 1,000+ participants).
 * Parses the last integer in the string and animates it while keeping any
 * prefix/suffix ("5" + "M+", "7→" + "15"). Reduced-motion / no-JS: the real
 * value is the server-rendered child, shown as-is.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const matches = [...value.matchAll(/[\d,]*\d/g)];
    const last = matches[matches.length - 1];
    if (!last || last.index === undefined) return;

    const numStr = last[0];
    const target = parseInt(numStr.replace(/,/g, ""), 10);
    if (!Number.isFinite(target) || target <= 1) return;

    const hasComma = numStr.includes(",");
    const before = value.slice(0, last.index);
    const after = value.slice(last.index + numStr.length);
    const fmt = (n: number) => (hasComma ? n.toLocaleString("en-US") : String(n));
    const render = (n: number) => before + fmt(n) + after;

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.disconnect();
          const dur = 1100;
          const ease = (t: number) => 1 - Math.pow(1 - t, 3);
          const start = performance.now();
          el.textContent = render(0);
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / dur);
            el.textContent = render(Math.round(ease(t) * target));
            if (t < 1) raf = requestAnimationFrame(tick);
            else el.textContent = value;
          };
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
