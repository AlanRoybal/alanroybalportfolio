"use client";

import { useEffect, useRef } from "react";

const EASE = 0.14; // per-frame chase toward the pointer
const HEARTS = ["<3", "<3", "♥"];

/**
 * The charm's warmth on the interaction layer: a soft amber light that trails
 * the pointer (blend-mode soft-light, so it reads as illumination on the ink
 * surface, not a spotlight painted over it), and a small puff of mono hearts —
 * the charm's kiss — on every click. Pointer-fine devices only; no-op under
 * reduced motion and on touch.
 */
export function CursorAura() {
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const aura = auraRef.current;
    if (!aura) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    )
      return;

    let tx = 0;
    let ty = 0;
    let x = -1;
    let y = -1;
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (x < 0) {
        x = tx;
        y = ty;
      }
      if (!visible) {
        visible = true;
        aura.style.opacity = "0.5";
      }
    };
    const onLeave = () => {
      visible = false;
      aura.style.opacity = "0";
    };

    const onClick = (e: PointerEvent) => {
      // small, cheap, self-cleaning: 2–3 hearts drift up and fade
      const n = 2 + ((e.clientX + e.clientY) & 1);
      for (let i = 0; i < n; i++) {
        const h = document.createElement("span");
        h.className = "aura-heart";
        h.textContent = HEARTS[(e.clientX + i) % HEARTS.length];
        h.style.left = `${e.clientX}px`;
        h.style.top = `${e.clientY}px`;
        h.style.setProperty("--dx", `${(i - (n - 1) / 2) * 26}px`);
        h.style.setProperty("--tilt", `${(i - (n - 1) / 2) * 14}deg`);
        h.style.animationDelay = `${i * 45}ms`;
        h.addEventListener("animationend", () => h.remove());
        document.body.appendChild(h);
      }
    };

    const tick = () => {
      x += (tx - x) * EASE;
      y += (ty - y) * EASE;
      aura.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onClick, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onClick);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={auraRef} aria-hidden="true" className="aura" />;
}
