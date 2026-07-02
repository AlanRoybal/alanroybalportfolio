"use client";

import { useEffect, useRef } from "react";

/**
 * Flanking depth layers — the page's side gutters as an origami cliffside
 * diorama built from photographed folded-paper cutouts (public/paper/*).
 *
 * Each side carries three LONG CONTINUOUS strips (no tiling): a chain of
 * kraft crags in the foreground, pleated strata cliffs in the midground,
 * and the same cliffs washed pale by a haze filter as the background. Each
 * strip is mapped onto the whole page: its top shows at the top of the
 * site and its bottom arrives exactly at the end of the last section, so
 * scrolling travels down one uninterrupted mountainside. The three strips
 * are different lengths, which is what produces the back/mid/foreground
 * parallax — longer strip, faster plane.
 *
 * The right flank mirrors the artwork so the two sides don't read as a
 * duplicated stamp. Desktop-only; under prefers-reduced-motion the planes
 * hold still at their page-mapped positions... which for zero motion means
 * the top of each strip.
 */

type Layer = {
  src: string;
  /** rendered strip width in px (fixed so the strip height is exact) */
  w: number;
  /** image aspect ratio height/width */
  ar: number;
  opacity: number;
  filter?: string;
};

const SHADOW = "drop-shadow(2px 6px 7px rgba(63,47,28,0.35))";
const AR_NEAR = 5028 / 320;
const AR_MID = 3961 / 320;

const LAYERS: Layer[] = [
  {
    // background — the mid cliffs pushed back into warm haze
    src: "/paper/strip-mid.png",
    w: 150,
    ar: AR_MID,
    opacity: 0.45,
    filter: "grayscale(0.5) sepia(0.18) brightness(1.5) contrast(0.72)",
  },
  {
    // midground
    src: "/paper/strip-mid.png",
    w: 180,
    ar: AR_MID,
    opacity: 0.8,
    filter: SHADOW,
  },
  {
    // foreground
    src: "/paper/strip-near.png",
    w: 210,
    ar: AR_NEAR,
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
      {/* mirror the artwork itself; the mask above stays side-correct */}
      <div className="absolute inset-0" style={mirror ? { transform: "scaleX(-1)" } : undefined}>
        {LAYERS.map((l, i) => {
          const h = Math.round(l.w * l.ar);
          return (
            <div
              key={i}
              data-strip
              data-h={h}
              className="absolute inset-x-0 top-0 bg-no-repeat"
              style={{
                height: `${h}px`,
                backgroundImage: `url(${l.src})`,
                backgroundSize: "auto 100%",
                backgroundPosition: `${mirror ? "right" : "left"} ${8 + i * 6}px top`,
                opacity: l.opacity,
                filter: l.filter,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function EdgeDepth() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const strips = Array.from(root.querySelectorAll<HTMLElement>("[data-strip]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      for (const el of strips) {
        const h = Number(el.dataset.h);
        // map the strip onto the full page: top at page top, bottom at page end
        const f = Math.max(0, (h - vh) / maxScroll);
        el.style.transform = `translate3d(0, ${-(y * f)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
