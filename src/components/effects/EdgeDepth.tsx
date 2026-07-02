"use client";

import { useEffect, useRef } from "react";

/**
 * Flanking depth layers — the page's side gutters as an origami cliffside.
 * Three planes per side scroll at different speeds, modelled on a folded-paper
 * diorama: hazy grey ridgelines far away, tan strata terraces in the middle
 * distance, and dark kraft crags with origami pines up close. Everything is
 * faceted paper — a lit face, a shadow face, a crease — in the site's warm
 * paper ramp, with a rare amber spark for continuity with the signal accent.
 *
 * Everything is a repeating SVG tile moved by a wrapped translateY (composited,
 * no repaint). Desktop-only (the gutters don't exist below lg); under
 * prefers-reduced-motion the planes hold still.
 */

const svg = (s: string) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

/* the origami-cliff paper ramp (sampled from the diorama reference) */
const KRAFT_DARK = "#5c4530";
const KRAFT = "#7d5e41";
const TAN = "#a5805a";
const TAN_LIGHT = "#c6a37b";
const SAND = "#dcc6a2";
const GREY = "#b9b5a7";
const GREY_LIGHT = "#d5d1c3";
const AMBER = "#b97d22";
const CREASE = "rgba(46,34,20,0.2)";

/**
 * The signature mark: an origami pine — three stacked fold tiers, each split
 * into a lit half and a shadow half, on a stub trunk. `s` scales, `tone`
 * swaps the paper (kraft up close, grey in the haze).
 */
const pine = (x: number, y: number, s: number, tone: "kraft" | "grey" = "kraft") => {
  const lit = tone === "kraft" ? "#7a5a3d" : GREY;
  const shadow = tone === "kraft" ? KRAFT_DARK : "#a19d8f";
  const trunk = tone === "kraft" ? "#4a3624" : "#8f8b7e";
  return (
    `<g transform='translate(${x} ${y}) scale(${s})'>` +
    `<rect x='-2' y='0' width='4' height='6' fill='${trunk}'/>` +
    `<polygon points='-16,0 0,-14 0,0' fill='${lit}'/>` +
    `<polygon points='0,-14 16,0 0,0' fill='${shadow}'/>` +
    `<polygon points='-12,-8 0,-20 0,-8' fill='${lit}'/>` +
    `<polygon points='0,-20 12,-8 0,-8' fill='${shadow}'/>` +
    `<polygon points='-8,-16 0,-28 0,-16' fill='${lit}'/>` +
    `<polygon points='0,-28 8,-16 0,-16' fill='${shadow}'/>` +
    `</g>`
  );
};

// far plane — pale ridgelines dissolving into the paper haze
const FAR = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='420'>` +
    `<polygon points='0,120 34,64 58,92 96,36 134,84 166,58 200,104 200,150 0,150' fill='${GREY_LIGHT}'/>` +
    `<polygon points='96,36 134,84 112,96 78,60' fill='${GREY}' opacity='0.5'/>` +
    pine(150, 300, 0.55, "grey") +
    pine(38, 236, 0.45, "grey") +
    `</svg>`,
);

// mid plane — a folded strata terrace (the crumpled shelves of the cliff face)
const MID = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='520'>` +
    `<g transform='translate(64 150)'>` +
    `<polygon points='-44,64 -48,-12 -22,-48 26,-54 48,-16 44,64' fill='${TAN}' stroke='${CREASE}'/>` +
    `<polygon points='26,-54 48,-16 44,64 24,64' fill='${KRAFT}' opacity='0.45'/>` +
    `<polygon points='-48,-12 48,-16 48,-7 -48,-3' fill='${SAND}'/>` +
    `<polygon points='-44,16 44,10 44,19 -44,25' fill='${TAN_LIGHT}'/>` +
    `<polygon points='-42,38 42,34 42,42 -42,46' fill='${SAND}' opacity='0.7'/>` +
    `</g>` +
    pine(64, 96, 0.75) +
    pine(36, 106, 0.55) +
    `<g transform='translate(160 396)'>` +
    `<polygon points='0,-26 20,10 -16,14' fill='${GREY}' stroke='${CREASE}'/>` +
    `<polygon points='0,-26 20,10 4,-2' fill='${GREY_LIGHT}'/>` +
    `</g>` +
    `</svg>`,
);

// near plane — a dark kraft crag crowned with origami pines
const NEAR = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='620'>` +
    `<g transform='translate(88 190)'>` +
    `<polygon points='-52,72 -58,-28 -26,-62 32,-56 54,-6 48,72' fill='${KRAFT}' stroke='${CREASE}'/>` +
    `<polygon points='-58,-28 -26,-62 32,-56 54,-6 26,-16 -30,-10' fill='${TAN}'/>` +
    `<polygon points='32,-56 54,-6 48,72 28,72 26,-16' fill='${KRAFT_DARK}'/>` +
    `<polygon points='-56,4 26,-2 26,6 -56,12' fill='${SAND}' opacity='0.55'/>` +
    `<polygon points='-54,34 24,30 24,38 -54,42' fill='${TAN_LIGHT}' opacity='0.5'/>` +
    `</g>` +
    pine(74, 122, 1.15) +
    pine(108, 132, 0.85) +
    pine(42, 134, 0.7) +
    `<g transform='translate(150 470)'>` +
    `<polygon points='-38,26 -30,-18 8,-34 34,-4 28,26' fill='${KRAFT_DARK}' stroke='${CREASE}'/>` +
    `<polygon points='-30,-18 8,-34 34,-4 4,-10' fill='${KRAFT}'/>` +
    pine(-6, -30, 0.8) +
    `</g>` +
    `<circle cx='60' cy='560' r='2' fill='${AMBER}' opacity='0.55'/>` +
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
