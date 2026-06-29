"use client";

import { useEffect, useRef } from "react";
import { prepareWithSegments, measureNaturalWidth } from "@chenglou/pretext";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz01<>/{}#*+=".split("");

/**
 * A "decode" animation: text resolves out of scrambled glyphs, left to right —
 * the site's nod to what Alan builds (systems that compute an answer).
 *
 * Scrambling changes glyph widths every frame, which normally makes the line
 * jitter. We use **pretext** to measure each *word's* natural width with zero DOM
 * reflow and pin each word to it — so the resolve is steady, while the phrase
 * still wraps naturally at the spaces *between* words (multi-line headings render
 * correctly). Reduced-motion / no-JS: the real text is the server-rendered child.
 */
export function ScrambleText({
  text,
  className,
  durationMs = 1000,
  trigger = "mount",
}: {
  text: string;
  className?: string;
  durationMs?: number;
  /** "mount" runs on load; "view" runs when scrolled into frame. */
  trigger?: "mount" | "view";
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let raf = 0;
    let io: IntersectionObserver | undefined;
    const words = text.split(" ");

    const run = async () => {
      try {
        await document.fonts?.ready;
      } catch {
        /* no-op */
      }
      if (cancelled) return;

      const cs = getComputedStyle(el);
      const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const ls = parseFloat(cs.letterSpacing);
      const opts = Number.isFinite(ls) ? { letterSpacing: ls } : undefined;

      // Build one inline-block span per word, each pinned to its measured width
      // (so glyph scrambling can't reflow it), separated by normal spaces so the
      // phrase still wraps between words.
      el.textContent = "";
      const parts: { node: HTMLSpanElement; chars: string[] }[] = [];
      words.forEach((w, wi) => {
        if (wi > 0) el.appendChild(document.createTextNode(" "));
        const s = document.createElement("span");
        s.style.display = "inline-block";
        s.style.whiteSpace = "nowrap";
        try {
          const prepared = prepareWithSegments(w, font, opts);
          const ww = measureNaturalWidth(prepared);
          if (ww > 0) s.style.width = `${Math.ceil(ww)}px`;
        } catch {
          /* best-effort */
        }
        s.textContent = w;
        el.appendChild(s);
        parts.push({ node: s, chars: Array.from(w) });
      });

      const totalChars = parts.reduce((a, p) => a + p.chars.length, 0);
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / durationMs);
        const revealed = t * totalChars;
        let idx = 0;
        for (const p of parts) {
          let out = "";
          for (let i = 0; i < p.chars.length; i++) {
            if (idx < revealed - 0.001) out += p.chars[i];
            else out += GLYPHS[(Math.floor(now / 36) + idx * 7) % GLYPHS.length];
            idx++;
          }
          p.node.textContent = out;
        }
        if (t < 1) raf = requestAnimationFrame(tick);
        else el.textContent = text; // restore plain text -> fully natural layout
      };
      raf = requestAnimationFrame(tick);
    };

    if (trigger === "view") {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              io?.disconnect();
              run();
            }
          }
        },
        { threshold: 0.55 },
      );
      io.observe(el);
    } else {
      run();
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [text, durationMs, trigger]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
