// Shared helpers for driving @chenglou/pretext from React effects.
//
// pretext measures and breaks text with zero DOM reflow, but it needs two
// things synced with the real CSS: a canvas-shorthand `font` string and a
// numeric `lineHeight`. Every consumer (ScrambleText, AsciiPortrait, and the
// new FlowAround/TypeReveal effects) derive those the same way — so the
// boilerplate lives here once.

export {
  prepare,
  prepareWithSegments,
  layout,
  layoutWithLines,
  layoutNextLineRange,
  materializeLineRange,
  walkLineRanges,
  measureLineStats,
  measureNaturalWidth,
} from "@chenglou/pretext";
export type { LayoutCursor, LayoutLine } from "@chenglou/pretext";

/**
 * Build the canvas-shorthand `font` string pretext expects from an element's
 * computed style, plus the parsed `letterSpacing` option (pretext takes it as a
 * px value). Mirrors the pattern in ScrambleText/AsciiPortrait so all measured
 * text stays in lockstep with its CSS.
 */
export function fontStringFrom(el: HTMLElement): {
  font: string;
  fontSizePx: number;
  opts?: { letterSpacing: number };
} {
  const cs = getComputedStyle(el);
  const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const fontSizePx = parseFloat(cs.fontSize) || 16;
  const ls = parseFloat(cs.letterSpacing);
  return {
    font,
    fontSizePx,
    opts: Number.isFinite(ls) && ls !== 0 ? { letterSpacing: ls } : undefined,
  };
}

/**
 * Resolve an element's computed `line-height` to a pixel value. pretext takes
 * lineHeight as a layout-time input, and CSS `normal` doesn't resolve to a
 * number — fall back to the typographic ~1.2× the font size in that case.
 */
export function lineHeightPx(el: HTMLElement, fontSizePx: number): number {
  const raw = getComputedStyle(el).lineHeight;
  const n = parseFloat(raw);
  if (Number.isFinite(n) && raw.endsWith("px")) return n;
  // `normal` (or a unitless multiple that didn't resolve to px)
  if (Number.isFinite(n) && !raw.endsWith("px")) return n * fontSizePx;
  return fontSizePx * 1.2;
}
