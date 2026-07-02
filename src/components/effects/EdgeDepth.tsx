"use client";

import { useEffect, useRef } from "react";

/**
 * Flanking depth layers — each side gutter is a stack of three LONG
 * CONTINUOUS origami cliff paintings (public/paper/side-*), layered like a
 * paper-cut lightbox:
 *
 *   background  — pale hazy wall, at the bottom of the pile, reaching
 *                 furthest into the page;
 *   midground   — tan strata cliff covering it except a sliver of edge;
 *   foreground  — dark kraft crags on top, covering the midground except
 *                 the same sliver.
 *
 * Every layer spans the site in ONE pass — its top shows at the top of the
 * page and its bottom arrives exactly at the end of the last section (the
 * layer heights are computed from the page's real scroll length, no
 * repeating). The foreground travels fastest, the background barely moves.
 * Left and right sides carry their own artwork. Desktop-only; under
 * prefers-reduced-motion the stack holds still.
 */

type Depth = "bg" | "mid" | "fg";

const PLANES: {
  depth: Depth;
  /** scroll speed — also the extra length of the strip beyond one viewport */
  speed: number;
  /** how far the layer's inner silhouette edge is pulled back from the
   *  gutter's inner boundary — the stagger that reveals the layer beneath */
  inset: number;
  opacity: number;
  filter?: string;
}[] = [
  // slower speeds keep the strips shorter, which renders them narrower —
  // that's what lets the artwork's detail fit inside the gutter instead of
  // showing only its silhouette edge
  { depth: "bg", speed: 0.03, inset: 0, opacity: 0.8 },
  {
    depth: "mid",
    speed: 0.08,
    inset: 30,
    opacity: 0.95,
    filter: "drop-shadow(2px 5px 6px rgba(63,47,28,0.3))",
  },
  {
    depth: "fg",
    speed: 0.16,
    inset: 64,
    opacity: 1,
    filter: "drop-shadow(3px 7px 8px rgba(63,47,28,0.35))",
  },
];

function Flank({ side }: { side: "left" | "right" }) {
  const inner = side === "left" ? "right" : "left";
  return (
    <div
      className="pointer-events-none absolute inset-y-0 hidden w-[clamp(240px,21vw,420px)] overflow-hidden lg:block"
      style={{
        [side]: 0,
        maskImage: `linear-gradient(to ${side === "right" ? "left" : "right"}, black 65%, transparent)`,
        WebkitMaskImage: `linear-gradient(to ${side === "right" ? "left" : "right"}, black 65%, transparent)`,
      }}
    >
      {PLANES.map((p) => (
        <div
          key={p.depth}
          data-strip
          data-speed={p.speed}
          className="absolute inset-x-0 top-0 bg-no-repeat"
          style={{
            backgroundImage: `url(/paper/side-${side}-${p.depth}.png)`,
            // full strip height, width follows; the outer bleed crops away
            backgroundSize: "auto 100%",
            // anchor the silhouette edge toward the page, staggered so each
            // layer beneath peeks past the one on top
            backgroundPosition: `${inner} ${p.inset}px top`,
            opacity: p.opacity,
            filter: p.filter,
          }}
        />
      ))}
    </div>
  );
}

export function EdgeDepth() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const strips = Array.from(root.querySelectorAll<HTMLElement>("[data-strip]"));
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let lastMax = -1;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      if (maxScroll !== lastMax) {
        // page length changed (load, resize, pinned sections measured) —
        // resize every strip so its bottom lands exactly at the page end
        lastMax = maxScroll;
        for (const el of strips) {
          const speed = Number(el.dataset.speed);
          el.style.height = `${Math.round(vh + maxScroll * speed)}px`;
        }
      }
      if (still) return;
      const y = window.scrollY;
      for (const el of strips) {
        el.style.transform = `translate3d(0, ${-(y * Number(el.dataset.speed))}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    // pinned sections settle their added scroll length after mount
    const settle = window.setTimeout(update, 1200);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(settle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[30]">
      <Flank side="left" />
      <Flank side="right" />
    </div>
  );
}
