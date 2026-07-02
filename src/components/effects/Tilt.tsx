"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Gives a card physical presence: it tilts toward the cursor in perspective,
 * a specular sheen tracks the pointer across its face, and its shadow shifts
 * opposite the tilt (globals.css `.tilt` / `.tilt-sheen`). Server children
 * pass straight through, so static sections stay server-rendered.
 *
 * Pass the card's border radius in `className` so the sheen clips to it.
 * Pointer-fine devices only; inert on touch and under reduced motion.
 */
export function Tilt({
  children,
  className,
  max = 4.5,
}: {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    )
      return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const rx = -py * max;
      const ry = px * max;
      // short transition while tracking = light smoothing without lag
      el.style.transitionDuration = "120ms";
      el.style.transform = `perspective(950px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      el.style.setProperty("--shx", `${(px + 0.5) * 100}%`);
      el.style.setProperty("--shy", `${(py + 0.5) * 100}%`);
      el.style.setProperty("--sx", `${(-ry * 1.8).toFixed(1)}px`);
      el.style.setProperty("--sy", `${(14 + rx * 1.8).toFixed(1)}px`);
    };
    const onLeave = () => {
      el.style.transitionDuration = "";
      el.style.transform = "perspective(950px)";
      el.style.setProperty("--sx", "0px");
      el.style.setProperty("--sy", "14px");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={cn("tilt", className)}>
      {children}
      <span aria-hidden="true" className="tilt-sheen" />
    </div>
  );
}
