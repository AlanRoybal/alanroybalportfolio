"use client";

import { useEffect, useRef, useState } from "react";
import {
  siClaude,
  siPerplexity,
  siPython,
  siTypescript,
  siRust,
  siGo,
  siSwift,
  siCplusplus,
  siZig,
  siReact,
  siNextdotjs,
  siNodedotjs,
  siFastapi,
  siFlask,
  siDjango,
  siSpringboot,
  siGooglecloud,
  siDocker,
  siPostgresql,
  siGit,
} from "simple-icons";

type SimpleIcon = { path: string; hex: string; title: string };

/**
 * The tech stack as a honeycomb of brand icons "piled together." Brands that
 * simple-icons no longer ships (C#, Java, AWS, Azure — pulled for brand-policy
 * reasons) fall back to an amber monogram tile so nothing is missing.
 *
 * Layout is computed in code (hex grid, responsive column count) — server-render
 * / no-JS falls back to a plain readable chip list.
 */
type Tile = { name: string; icon?: SimpleIcon; mono?: string };

const TILES: Tile[] = [
  { name: "Claude", icon: siClaude },
  { name: "Codex", mono: "Cx" },
  { name: "Devin", mono: "Dv" },
  { name: "Perplexity", icon: siPerplexity },
  { name: "Python", icon: siPython },
  { name: "TypeScript", icon: siTypescript },
  { name: "Rust", icon: siRust },
  { name: "Go", icon: siGo },
  { name: "Swift", icon: siSwift },
  { name: "C++", icon: siCplusplus },
  { name: "C#", mono: "C#" },
  { name: "Java", mono: "Jv" },
  { name: "SQL", mono: "SQL" },
  { name: "Zig", icon: siZig },
  { name: "React", icon: siReact },
  { name: "Next.js", icon: siNextdotjs },
  { name: "Node.js", icon: siNodedotjs },
  { name: "FastAPI", icon: siFastapi },
  { name: "Flask", icon: siFlask },
  { name: "Django", icon: siDjango },
  { name: "Spring Boot", icon: siSpringboot },
  { name: "AWS", mono: "AWS" },
  { name: "Google Cloud", icon: siGooglecloud },
  { name: "Azure", mono: "Az" },
  { name: "Docker", icon: siDocker },
  { name: "PostgreSQL", icon: siPostgresql },
  { name: "Git", icon: siGit },
];

/** Brands with near-black logos would vanish on the dark theme — lift to ink. */
function iconColor(hex: string): string {
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum < 0.22 ? "var(--color-text-strong)" : `#${hex}`;
}

const HEX_CLIP = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";
const GAP_X = 8;
const GAP_Y = 8;

function colsFor(w: number): number {
  if (w < 380) return 3;
  if (w < 560) return 4;
  if (w < 780) return 5;
  if (w < 1040) return 6;
  return 7;
}

type Placed = { tile: Tile; x: number; y: number };

export function HoneycombSkills({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{
    placed: Placed[];
    hexW: number;
    hexH: number;
    height: number;
  } | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const compute = () => {
      const w = wrap.clientWidth;
      if (!w) return;
      const cols = colsFor(w);
      // reserve half a tile + gaps for the offset rows so they never overflow
      const hexW = (w - (cols - 0.5) * GAP_X) / (cols + 0.5);
      const hexH = (hexW * 2) / Math.sqrt(3); // pointy-top corner-to-corner
      const step = hexW + GAP_X;
      const rowPitch = hexH * 0.75 + GAP_Y;

      const raw = TILES.map((tile, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        return {
          tile,
          x: col * step + (row % 2) * (step / 2),
          y: row * rowPitch,
        };
      });
      const minX = Math.min(...raw.map((p) => p.x));
      const maxX = Math.max(...raw.map((p) => p.x + hexW));
      const shift = (w - (maxX - minX)) / 2 - minX;
      const placed = raw.map((p) => ({ ...p, x: p.x + shift }));
      const maxY = Math.max(...placed.map((p) => p.y));

      setLayout({ placed, hexW, hexH, height: maxY + hexH });
    };

    compute();
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      {layout === null ? (
        // Server / no-JS fallback: plain, readable list.
        <ul className="flex flex-wrap gap-2">
          {TILES.map((t) => (
            <li
              key={t.name}
              className="label rounded-[var(--radius-full)] border border-line px-3.5 py-1.5 text-text-muted"
            >
              {t.name}
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div
            className="relative mx-auto"
            style={{ height: layout.height }}
            onMouseLeave={() => setHovered(null)}
          >
            {layout.placed.map((p, i) => {
              const isHot = hovered === i;
              const iconSize = Math.round(layout.hexW * 0.42);
              return (
                <div
                  key={p.tile.name}
                  title={p.tile.name}
                  onMouseEnter={() => setHovered(i)}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: p.x,
                    top: p.y,
                    width: layout.hexW,
                    height: layout.hexH,
                    clipPath: HEX_CLIP,
                    background: isHot
                      ? "color-mix(in oklab, var(--color-accent) 16%, var(--color-surface-1))"
                      : "var(--color-surface-1)",
                    transform: isHot ? "scale(1.07)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "transform .18s ease, background .18s ease",
                    zIndex: isHot ? 2 : 1,
                  }}
                >
                  {p.tile.icon ? (
                    <svg
                      width={iconSize}
                      height={iconSize}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d={p.tile.icon.path}
                        fill={iconColor(p.tile.icon.hex)}
                      />
                    </svg>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="font-mono font-semibold text-accent"
                      style={{ fontSize: Math.round(layout.hexW * 0.26) }}
                    >
                      {p.tile.mono}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p
            aria-hidden="true"
            className="label mt-3 text-center text-text-faint transition-colors"
          >
            {hovered === null ? "the stack" : layout.placed[hovered].tile.name}
          </p>
        </>
      )}
    </div>
  );
}
