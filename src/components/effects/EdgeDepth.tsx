"use client";

import { useEffect, useRef } from "react";

/**
 * Flanking depth layers — the page's side gutters as an origami cliffside
 * diorama, rendered to read as REAL folded paper:
 *
 *   - crumple relief: feTurbulence noise driven through feDiffuseLighting,
 *     multiplied over the fills — the same one light source as the rest of
 *     the page — so every surface picks up the dents and creases of
 *     hand-crumpled kraft paper;
 *   - accordion strata: each cliff is a stack of ragged horizontal bands
 *     (seeded jitter, never straight rules) alternating fold-crest and
 *     fold-valley tones, like the pleated rock shelves in the reference;
 *   - cast shadows: every block drops a soft warm shadow onto the plane
 *     behind it, selling the diorama as physical layers;
 *   - atmospheric perspective: the far plane is soft and barely textured,
 *     the near plane is dark, crisp and heavily crumpled.
 *
 * Three planes per side scroll at different speeds via a wrapped translateY
 * (composited, no repaint). Desktop-only; under prefers-reduced-motion the
 * planes hold still.
 */

const svg = (s: string) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

/* the origami-cliff paper ramps (sampled from the diorama reference) */
const GREY = "#b9b5a7";
const GREY_LIGHT = "#d5d1c3";
const AMBER = "#b97d22";

const TAN_RAMP = {
  crest: ["#dcc6a2", "#d7bf98", "#e3cfae"],
  valley: ["#a5805a", "#9b7752", "#b08a62"],
  deep: ["#7d5e41", "#6f5238"],
};
const KRAFT_RAMP = {
  crest: ["#b08a62", "#a5805a", "#bb9670"],
  valley: ["#7d5e41", "#75573c", "#86653f"],
  deep: ["#5c4530", "#523d2a"],
};
const GREY_RAMP = {
  crest: ["#d5d1c3", "#dcd8cb", "#cfcaba"],
  valley: ["#b9b5a7", "#b1ac9d"],
  deep: ["#9c9789", "#948f81"],
};
type Ramp = typeof TAN_RAMP;

/* deterministic PRNG so tiles are stable across renders */
const mkRng = (seed: number) => {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

/* a ragged horizontal fold edge — never a straight rule */
const foldEdge = (
  r: () => number,
  x0: number,
  x1: number,
  y: number,
  amp: number,
): [number, number][] => {
  const pts: [number, number][] = [];
  for (let x = x0; ; x += 16 + r() * 10) {
    const last = x >= x1;
    const xx = last ? x1 + (r() - 0.5) * 5 : x + (r() - 0.5) * 4;
    pts.push([
      Math.round(xx * 10) / 10,
      Math.round((y + (r() - 0.5) * 2 * amp) * 10) / 10,
    ]);
    if (last) break;
  }
  return pts;
};

/**
 * A crumpled strata cliff: a base silhouette in the valley tone (fills any
 * tear gaps as fold shadow), then stacked ragged bands alternating crest /
 * valley, with a deep fold-shadow band every few pleats.
 */
function strata(seed: number, x0: number, x1: number, y0: number, y1: number, ramp: Ramp): string {
  const r = mkRng(seed);
  const n = Math.max(5, Math.round((y1 - y0) / 13));
  const bh = (y1 - y0) / n;
  const poly = (pts: [number, number][], fill: string, o = 1) =>
    `<polygon points='${pts.map((p) => p.join(",")).join(" ")}' fill='${fill}'${o < 1 ? ` opacity='${o}'` : ""}/>`;
  // base silhouette — shadow tone showing through the torn band edges
  let out = poly(
    [[x0 - 2, y0 + 3], [x1 + 2, y0 + 3], [x1 + 3, y1], [x0 - 3, y1]],
    ramp.deep[0],
  );
  let prev = foldEdge(r, x0, x1, y0, 4);
  for (let i = 0; i < n; i++) {
    const next = foldEdge(r, x0, x1, y0 + (i + 1) * bh, 4);
    const pool = i % 4 === 3 ? ramp.deep : i % 2 ? ramp.valley : ramp.crest;
    const fill = pool[(r() * pool.length) | 0];
    out += poly([...prev, ...[...next].reverse()], fill);
    // crease highlight along the crest lip, shadow tucked under it
    if (i % 2 === 0) {
      out += `<polyline points='${prev.map((p) => p.join(",")).join(" ")}' fill='none' stroke='rgba(255,252,240,0.4)' stroke-width='0.8'/>`;
      out += `<polyline points='${next.map((p) => `${p[0]},${p[1] - 1.2}`).join(" ")}' fill='none' stroke='rgba(46,30,14,0.3)' stroke-width='1'/>`;
    }
    prev = next;
  }
  return out;
}

/** The origami pine — fold tiers with a lit/shadow split, tips jittered. */
const pine = (
  seed: number,
  x: number,
  y: number,
  s: number,
  tone: "kraft" | "grey" = "kraft",
) => {
  const r = mkRng(seed);
  const lit = tone === "kraft" ? "#7a5a3d" : GREY;
  const shadow = tone === "kraft" ? "#4e3a27" : "#a19d8f";
  const trunk = tone === "kraft" ? "#43301f" : "#8f8b7e";
  let tiers = "";
  for (let i = 0; i < 3; i++) {
    const w = 16 - i * 4 + (r() - 0.5) * 2;
    const yb = -i * 7 + (r() - 0.5) * 1.5;
    const yt = yb - 14 + (r() - 0.5) * 2;
    const lean = (r() - 0.5) * 2.4;
    tiers +=
      `<polygon points='${-w},${yb} ${lean},${yt} ${lean},${yb}' fill='${lit}'/>` +
      `<polygon points='${lean},${yt} ${w},${yb} ${lean},${yb}' fill='${shadow}'/>` +
      `<polyline points='${lean},${yt} ${lean},${yb}' stroke='rgba(255,252,240,0.35)' stroke-width='0.7' fill='none'/>`;
  }
  return (
    `<g transform='translate(${x} ${y}) scale(${s})'>` +
    `<rect x='-2' y='0' width='4' height='6' fill='${trunk}'/>` +
    tiers +
    `</g>`
  );
};

/**
 * Shared filter defs per tile:
 *  `cr`  — crumple relief (turbulence → diffuse lighting → multiply, clipped)
 *  `crs` — softer variant for distant surfaces
 *  `ds`  — the warm cast shadow every paper piece throws
 */
const defs = (seed: number, scale: number) =>
  `<defs>` +
  `<filter id='cr' x='-15%' y='-15%' width='130%' height='130%'>` +
  `<feTurbulence type='fractalNoise' baseFrequency='0.016 0.028' numOctaves='4' seed='${seed}' result='n'/>` +
  `<feDiffuseLighting in='n' lighting-color='#ffffff' surfaceScale='${scale}' diffuseConstant='1.05' result='l'>` +
  `<feDistantLight azimuth='235' elevation='55'/>` +
  `</feDiffuseLighting>` +
  `<feComposite in='l' in2='SourceGraphic' operator='arithmetic' k1='1' k2='0' k3='0' k4='0'/>` +
  `<feComposite in2='SourceAlpha' operator='in'/>` +
  `</filter>` +
  `<filter id='crs' x='-15%' y='-15%' width='130%' height='130%'>` +
  `<feTurbulence type='fractalNoise' baseFrequency='0.02 0.03' numOctaves='3' seed='${seed + 5}' result='n'/>` +
  `<feDiffuseLighting in='n' lighting-color='#ffffff' surfaceScale='1.2' diffuseConstant='1.02' result='l'>` +
  `<feDistantLight azimuth='235' elevation='62'/>` +
  `</feDiffuseLighting>` +
  `<feComposite in='l' in2='SourceGraphic' operator='arithmetic' k1='1' k2='0' k3='0' k4='0'/>` +
  `<feComposite in2='SourceAlpha' operator='in'/>` +
  `</filter>` +
  `<filter id='ds' x='-40%' y='-40%' width='180%' height='180%'>` +
  `<feDropShadow dx='3' dy='6' stdDeviation='4' flood-color='#3f2f1c' flood-opacity='0.32'/>` +
  `</filter>` +
  `</defs>`;

// far plane — soft, barely-textured ridge haze (atmospheric perspective)
const FAR = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='420'>` +
    defs(31, 1.4) +
    `<g filter='url(#crs)'>` +
    `<polygon points='0,122 30,68 52,94 92,38 128,86 162,60 200,106 200,152 0,152' fill='${GREY_LIGHT}'/>` +
    `<polygon points='92,38 128,86 106,98 72,62' fill='${GREY}' opacity='0.5'/>` +
    `</g>` +
    `<g filter='url(#crs)'>` +
    pine(41, 150, 300, 0.55, "grey") +
    pine(42, 38, 236, 0.45, "grey") +
    `</g>` +
    `</svg>`,
);

// mid plane — a pleated strata terrace with pines on the shelf
const MID = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='520'>` +
    defs(17, 2.4) +
    `<g filter='url(#ds)'><g filter='url(#cr)'>` +
    strata(7, 16, 118, 82, 252, TAN_RAMP) +
    pine(51, 62, 84, 0.8) +
    pine(52, 34, 92, 0.6) +
    `</g></g>` +
    `<g filter='url(#ds)'><g filter='url(#cr)'>` +
    strata(21, 132, 204, 360, 436, GREY_RAMP) +
    pine(53, 168, 362, 0.6, "grey") +
    `</g></g>` +
    `</svg>`,
);

// near plane — dark kraft crags, heavily crumpled, crowned with pines
const NEAR = svg(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='620'>` +
    defs(9, 3) +
    `<g filter='url(#ds)'><g filter='url(#cr)'>` +
    strata(3, 14, 152, 124, 300, KRAFT_RAMP) +
    pine(61, 74, 126, 1.15) +
    pine(62, 112, 134, 0.85) +
    pine(63, 40, 136, 0.7) +
    `</g></g>` +
    `<g filter='url(#ds)'><g filter='url(#cr)'>` +
    strata(9, 100, 214, 436, 542, KRAFT_RAMP) +
    pine(64, 152, 438, 0.85) +
    `</g></g>` +
    `<circle cx='60' cy='580' r='2' fill='${AMBER}' opacity='0.55'/>` +
    `</svg>`,
);

// factor = scroll speed of the plane; tile = pattern period for seamless wrap
const LAYERS = [
  { image: FAR, tile: 420, factor: 0.05, opacity: 0.55 },
  { image: MID, tile: 520, factor: 0.12, opacity: 0.7 },
  { image: NEAR, tile: 620, factor: 0.24, opacity: 0.85 },
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
