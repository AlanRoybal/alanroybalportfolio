"use client";

import { useEffect, useRef } from "react";

/**
 * Flanking depth layers — the page's side gutters, populated. Three planes of
 * low-poly faceted objects per side (neural cores far, honeycomb pillars mid,
 * chip dies and ink shards near — the same faceted style as the seam
 * centerpieces) scroll at different speeds and fade toward the centre, so the
 * margins recede and the eye is pulled into the lit middle column.
 *
 * Everything is a repeating SVG tile moved by a wrapped translateY (composited,
 * no repaint). Desktop-only (the gutters don't exist below lg); under
 * prefers-reduced-motion the planes hold still.
 */

const svg = (s: string) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

const EDGE = "rgba(245,241,232,0.09)";

// far plane — a small faceted neural core and a drifting ink shard
const FAR = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='420'>` +
    `<g transform='translate(60 90)'>` +
    `<polygon points='0,-20 17,-10 17,10 0,20 -17,10 -17,-10' fill='#14171a' stroke='${EDGE}'/>` +
    `<polygon points='0,-20 17,-10 0,0' fill='#1a1e22'/>` +
    `<polygon points='17,10 0,20 0,0' fill='#101317'/>` +
    `<polygon points='0,-8 7,4 -7,4' fill='#b97d22' opacity='0.5'/>` +
    `</g>` +
    `<g transform='translate(150 300)'>` +
    `<polygon points='0,-16 10,8 -8,10' fill='#171a1e' stroke='${EDGE}'/>` +
    `<polygon points='0,-16 10,8 2,-2' fill='#1e2226'/>` +
    `</g>` +
    `<circle cx='40' cy='230' r='1.5' fill='#e9a23b' opacity='0.45'/>` +
    `</svg>`,
);

// mid plane — a faceted hex column (honeycomb pillar) and a shard pair
const MID = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='520'>` +
    `<g transform='translate(70 150)'>` +
    `<polygon points='0,-55 18,-45 18,45 0,55 -18,45 -18,-45' fill='#181c20' stroke='${EDGE}'/>` +
    `<polygon points='0,-55 18,-45 6,-38 -12,-48' fill='#232830'/>` +
    `<polygon points='18,-45 18,45 8,50 8,-40' fill='#121518'/>` +
    `<polygon points='-4,-18 4,-16 4,18 -4,16' fill='#b97d22' opacity='0.45'/>` +
    `</g>` +
    `<g transform='translate(160 390)'>` +
    `<polygon points='0,-24 14,10 -12,14' fill='#1c2024' stroke='${EDGE}'/>` +
    `<polygon points='0,-24 14,10 4,-4' fill='#242930'/>` +
    `<polygon points='-24,4 -8,20 -26,26' fill='#171a1e'/>` +
    `</g>` +
    `<circle cx='50' cy='300' r='1.8' fill='#e9a23b' opacity='0.5'/>` +
    `</svg>`,
);

// near plane — a faceted chip die with pins and a large shard cluster
const NEAR = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='620'>` +
    `<g transform='translate(85 170)'>` +
    `<polygon points='0,-34 34,0 0,34 -34,0' fill='#1c2024' stroke='${EDGE}'/>` +
    `<polygon points='0,-34 34,0 0,0' fill='#262b30'/>` +
    `<polygon points='0,34 -34,0 0,0' fill='#14171a'/>` +
    `<polygon points='0,-11 11,0 0,11 -11,0' fill='#e9a23b' opacity='0.8'/>` +
    `<g stroke='#3a3f44' stroke-width='1.5'>` +
    `<path d='M0,-34 L0,-48 M34,0 L48,0 M0,34 L0,48 M-34,0 L-48,0'/>` +
    `</g>` +
    `</g>` +
    `<g transform='translate(150 450)'>` +
    `<polygon points='0,-40 22,16 -18,22' fill='#1f2429' stroke='${EDGE}'/>` +
    `<polygon points='0,-40 22,16 6,-6' fill='#282e34'/>` +
    `<polygon points='-34,8 -12,30 -38,38' fill='#171a1e'/>` +
    `<polygon points='0,-40 6,-6 -8,-2' fill='#b97d22' opacity='0.4'/>` +
    `</g>` +
    `<circle cx='60' cy='560' r='2' fill='#e9a23b' opacity='0.55'/>` +
    `</svg>`,
);

// factor = scroll speed of the plane; tile = pattern period for seamless wrap
const LAYERS = [
  { image: FAR, tile: 420, factor: 0.05, opacity: 0.5 },
  { image: MID, tile: 520, factor: 0.12, opacity: 0.6 },
  { image: NEAR, tile: 620, factor: 0.24, opacity: 0.75 },
] as const;

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
      {LAYERS.map((l, i) => (
        <div
          key={i}
          data-depth={mirror ? l.factor * 1.15 : l.factor}
          data-tile={l.tile}
          className="absolute inset-x-0 top-0 bg-repeat-y"
          style={{
            height: `calc(100% + ${l.tile}px)`,
            backgroundImage: l.image,
            // desync the two sides so they don't read as a mirrored stamp
            backgroundPosition: `${mirror ? 90 + i * 37 : i * 53}px 0`,
            opacity: l.opacity,
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
