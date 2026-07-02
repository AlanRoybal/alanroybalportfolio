"use client";

import { useEffect, useRef } from "react";

/**
 * Flanking depth layers — the page's side gutters as an origami cliffside
 * diorama built from photographed folded-paper cutouts (public/paper/*):
 * kraft crags with origami pines up close, pleated strata cliffs in the
 * middle distance, and the same cliffs washed out by a haze filter far
 * away (atmospheric perspective for free, and the silhouettes match).
 *
 * Each plane is a vertically repeating image strip moved by a wrapped
 * translateY (composited, no repaint). The strip width is fixed per plane
 * so the repeat period stays exact while the gutter flexes. Desktop-only;
 * under prefers-reduced-motion the planes hold still.
 */

type Layer = {
  src: string;
  /** rendered strip width in px (fixed so the tile period is exact) */
  w: number;
  /** image aspect ratio height/width */
  ar: number;
  factor: number;
  opacity: number;
  filter?: string;
};

const SHADOW = "drop-shadow(2px 6px 7px rgba(63,47,28,0.35))";

const LAYERS: Layer[] = [
  {
    // far — the mid cliffs pushed back into pale haze
    src: "/paper/gutter-mid.png",
    w: 150,
    ar: 943 / 400,
    factor: 0.05,
    opacity: 0.45,
    filter: "grayscale(0.5) sepia(0.18) brightness(1.5) contrast(0.72)",
  },
  {
    src: "/paper/gutter-mid.png",
    w: 180,
    ar: 943 / 400,
    factor: 0.12,
    opacity: 0.8,
    filter: SHADOW,
  },
  {
    src: "/paper/gutter-near.png",
    w: 210,
    ar: 1196 / 460,
    factor: 0.24,
    opacity: 0.95,
    filter: SHADOW,
  },
];

function Flank({ side }: { side: "left" | "right" }) {
  const mirror = side === "right";
  return (
    <div
      className="pointer-events-none absolute inset-y-0 hidden w-[clamp(120px,13vw,230px)] overflow-hidden lg:block"
      style={{
        [side]: 0,
        maskImage: `linear-gradient(to ${mirror ? "left" : "right"}, black 30%, transparent)`,
        WebkitMaskImage: `linear-gradient(to ${mirror ? "left" : "right"}, black 30%, transparent)`,
      }}
    >
      {LAYERS.map((l, i) => {
        const tile = l.w * l.ar;
        return (
          <div
            key={i}
            data-depth={mirror ? l.factor * 1.15 : l.factor}
            data-tile={tile}
            className="absolute inset-x-0 top-0 bg-repeat-y"
            style={{
              height: `calc(100% + ${tile}px)`,
              backgroundImage: `url(${l.src})`,
              backgroundSize: `${l.w}px auto`,
              // desync the two sides (and the far/mid pair, which share an
              // image) so they don't read as a mirrored or duplicated stamp
              backgroundPosition: `${mirror ? 60 + i * 31 : i * 43}px ${i * 173}px`,
              opacity: l.opacity,
              filter: l.filter,
            }}
          />
        );
      })}
    </div>
  );
}

export function EdgeDepth() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      for (const el of layers) {
        const f = Number(el.dataset.depth);
        const tile = Number(el.dataset.tile);
        el.style.transform = `translate3d(0, ${-((y * f) % tile)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
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
