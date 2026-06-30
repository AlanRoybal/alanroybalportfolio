"use client";

import { useEffect, useRef } from "react";
import {
  prepareWithSegments,
  measureNaturalWidth,
  fontStringFrom,
} from "@/lib/pretext";
import { subscribeCharmImpact } from "@/lib/charmImpact";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz01<>/{}#*+=".split("");

/**
 * The giant "alan roybal" wordmark, held in a scrambled state until the charm
 * lands on it — then the impact resolves it. The resolve is driven by the shared
 * charm-impact progress (0 → scrambled, 1 → resolved), so it scrubs both ways
 * with scroll.
 *
 * pretext is what makes it "render properly": each word is measured with
 * `prepareWithSegments` + `measureNaturalWidth` and pinned to its true width, so
 * the scrambling glyphs never reflow the giant type and it lays out cleanly —
 * the phrase still wraps at the space between words. No-JS / reduced motion shows
 * the plain resolved wordmark.
 */
export function CharmWordmark({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cancelled = false;
    let unsub: (() => void) | undefined;
    let raf = 0;

    const setup = async () => {
      try {
        await document.fonts?.ready;
      } catch {
        /* best-effort */
      }
      if (cancelled) return;

      const { font, opts } = fontStringFrom(el);
      const words = text.split(" ");

      // Build one width-pinned inline-block span per word so scrambling glyphs
      // never reflow the wordmark; spaces between words still allow wrapping.
      el.textContent = "";
      const parts: { node: HTMLSpanElement; chars: string[] }[] = [];
      words.forEach((w, wi) => {
        if (wi > 0) el.appendChild(document.createTextNode(" "));
        const span = document.createElement("span");
        span.style.display = "inline-block";
        span.style.whiteSpace = "nowrap";
        try {
          const prepared = prepareWithSegments(w, font, opts);
          const width = measureNaturalWidth(prepared);
          if (width > 0) span.style.width = `${Math.ceil(width)}px`;
        } catch {
          /* best-effort */
        }
        span.textContent = w;
        el.appendChild(span);
        parts.push({ node: span, chars: Array.from(w) });
      });

      // amber glow period — kept out of the scramble
      const dot = document.createElement("span");
      dot.className = "text-glow";
      dot.textContent = ".";
      el.appendChild(dot);

      const total = parts.reduce((a, p) => a + p.chars.length, 0);

      if (reduced) return; // leave fully resolved, no scramble

      // Render the wordmark at a given resolve amount (0..1).
      const draw = (p: number) => {
        const revealed = p * total;
        let idx = 0;
        const seed = Math.floor(performance.now() / 40);
        for (const part of parts) {
          let out = "";
          for (let i = 0; i < part.chars.length; i++) {
            if (idx < revealed - 0.001) out += part.chars[i];
            else out += GLYPHS[(seed + idx * 7) % GLYPHS.length];
            idx++;
          }
          part.node.textContent = out;
          idx += 0; // keep counter continuous across words
        }
      };

      let current = 0;
      draw(0);
      unsub = subscribeCharmImpact((v) => {
        current = v;
      });
      // A light rAF so the unresolved glyphs keep flickering while scrambled,
      // and the wordmark tracks the latest resolve value.
      const tick = () => {
        if (cancelled) return;
        draw(current);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    setup();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      unsub?.();
    };
  }, [text]);

  return (
    <p ref={ref} aria-hidden="true" data-charm-target className={className}>
      {text}
      <span className="text-glow">.</span>
    </p>
  );
}
