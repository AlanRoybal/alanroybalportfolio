"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";
import { charmFrames, charmCols } from "@/content/charmFrames";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  prepareWithSegments,
  layoutNextLineRange,
  materializeLineRange,
  fontStringFrom,
  lineHeightPx,
  type LayoutCursor,
} from "@/lib/pretext";

/**
 * Text that flows around the ASCII portrait's silhouette.
 *
 * Each line gets a *different* max-width: its right edge is insetted to follow
 * the left contour of the portrait so the copy hugs the face. That per-line
 * variable width is exactly what `layoutNextLineRange` does — and it's the one
 * thing CSS can't: `shape-outside` can't track a code-drawn silhouette, and
 * reading real wrap points otherwise costs a DOM reflow. pretext computes the
 * breaks from cached canvas widths, no reflow.
 *
 * Progressive enhancement only: the server renders a plain, rectangular block
 * (the no-JS / reduced-motion / mobile fallback). The contour is applied in an
 * effect on `lg+`, where the portrait actually sits beside the text.
 */

// --- left silhouette of the portrait, sampled once from frame 0 -------------
// For each grid row, the fraction (0..1 of width) at which the portrait's
// drawn pixels begin. Blank rows → 1 (no intrusion). A running-min smooth makes
// the contour track the dense face edge and ignore sparse stray glyphs to its
// right.
const SILHOUETTE: number[] = (() => {
  const rows = charmFrames[0].split("\n");
  const raw = rows.map((row) => {
    const i = row.search(/\S/);
    return i < 0 ? 1 : Math.min(1, i / charmCols);
  });
  const smoothed = raw.map((_, i) => {
    let min = 1;
    for (let k = Math.max(0, i - 3); k <= Math.min(raw.length - 1, i + 3); k++) {
      if (raw[k] < min) min = raw[k];
    }
    // Clamp so the column never gets unreadably narrow or pointlessly wide.
    return Math.max(0.16, Math.min(0.62, min));
  });
  return smoothed;
})();

const ROWS = SILHOUETTE.length;

/** Left-silhouette fraction at vertical fraction `f` (0 = top, 1 = bottom). */
function silhouetteAt(f: number): number {
  if (f <= 0) return SILHOUETTE[0];
  if (f >= 1) return SILHOUETTE[ROWS - 1];
  return SILHOUETTE[Math.min(ROWS - 1, Math.floor(f * ROWS))];
}

const LG = 1024; // Tailwind `lg` breakpoint — below this it's one column.
const GUTTER = 18; // px breathing room kept between text and the face.

export function FlowAround({
  text,
  className,
  portraitSelector = "[data-flow-portrait]",
  ...rest
}: {
  text: string;
  className?: string;
  portraitSelector?: string;
} & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let raf = 0;

    const toPlain = () => {
      el.textContent = text;
      el.style.removeProperty("min-height");
    };

    const build = () => {
      if (cancelled) return;
      // Below lg the portrait is stacked above the text — no contour to follow.
      if (reduced || window.innerWidth < LG) {
        toPlain();
        return;
      }
      const portrait = document.querySelector(portraitSelector);
      if (!(portrait instanceof HTMLElement)) {
        toPlain();
        return;
      }

      // Measure once per build (mount / debounced resize) — never per frame.
      const pr = portrait.getBoundingClientRect();
      // Anchor measurements off the wrapper while it still holds plain text.
      el.textContent = text;
      el.style.removeProperty("min-height");
      const wr = el.getBoundingClientRect();
      if (pr.width === 0 || wr.width === 0) {
        toPlain();
        return;
      }

      const { font, fontSizePx, opts } = fontStringFrom(el);
      const lh = lineHeightPx(el, fontSizePx);

      // Width available on a line whose vertical center is `y` (viewport px):
      // run the text up to the portrait's left silhouette at that height.
      const widthAt = (y: number) => {
        const f = (y - pr.top) / pr.height;
        const silX = pr.left + silhouetteAt(f) * pr.width;
        const avail = silX - wr.left - GUTTER;
        return Math.max(120, avail);
      };

      let prepared;
      try {
        prepared = prepareWithSegments(text, font, opts);
      } catch {
        toPlain();
        return;
      }

      const lines: { text: string; width: number }[] = [];
      let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
      for (let i = 0; i < 60; i++) {
        const w = widthAt(wr.top + i * lh + lh / 2);
        const range = layoutNextLineRange(prepared, cursor, w);
        if (range === null) break;
        const line = materializeLineRange(prepared, range);
        lines.push({ text: line.text, width: w });
        cursor = range.end;
      }
      if (cancelled || lines.length === 0) {
        toPlain();
        return;
      }

      // Reserve height before painting lines → no layout shift.
      el.style.minHeight = `${Math.ceil(lines.length * lh)}px`;
      el.textContent = "";
      for (const ln of lines) {
        const row = document.createElement("span");
        row.style.display = "block";
        row.style.width = `${Math.ceil(ln.width)}px`;
        row.textContent = ln.text;
        el.appendChild(row);
      }
    };

    const run = async () => {
      try {
        await document.fonts?.ready;
      } catch {
        /* best-effort */
      }
      build();
    };
    run();

    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [text, reduced, portraitSelector]);

  return (
    <div ref={ref} className={className} {...rest}>
      {text}
    </div>
  );
}
