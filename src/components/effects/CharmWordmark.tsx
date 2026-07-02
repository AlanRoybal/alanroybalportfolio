"use client";

import { useEffect, useRef } from "react";
import {
  prepareWithSegments,
  measureNaturalWidth,
  fontStringFrom,
} from "@/lib/pretext";
import { subscribeCharmImpact } from "@/lib/charmImpact";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz01<>/{}#*+=".split("");
const CASCADE_MS = 260;

/**
 * The giant "alan roybal" wordmark, held FULLY scrambled while the charm is
 * in flight — the whole approach is anticipation. The shared charm-impact
 * value is now a gate (0 = in flight, 1 = the charm has landed): on impact
 * the letters resolve in a fast left→right cascade, each one hopping as the
 * wave passes through it, an amber hairline draws itself out from the point
 * of impact, and the period — delivered by the charm — turns amber for good.
 * Scrolling back above the impact point re-scrambles everything and re-arms
 * the moment.
 *
 * pretext pins each word to its true width so the scrambling glyphs never
 * reflow the giant type. No-JS / reduced motion shows the plain resolved
 * wordmark (amber period included).
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

      // One width-pinned inline-block span per word (so scrambling glyphs
      // never reflow the wordmark), one span per LETTER inside it (so the
      // impact wave can ripple through the characters individually).
      el.textContent = "";
      el.style.position = "relative";
      const charSpans: HTMLSpanElement[] = [];
      const realChars: string[] = [];
      words.forEach((w, wi) => {
        if (wi > 0) el.appendChild(document.createTextNode(" "));
        const word = document.createElement("span");
        word.style.display = "inline-block";
        word.style.whiteSpace = "nowrap";
        try {
          const prepared = prepareWithSegments(w, font, opts);
          const width = measureNaturalWidth(prepared);
          if (width > 0) word.style.width = `${Math.ceil(width)}px`;
        } catch {
          /* best-effort */
        }
        for (const ch of Array.from(w)) {
          const cs = document.createElement("span");
          cs.style.display = "inline-block";
          cs.textContent = ch;
          word.appendChild(cs);
          charSpans.push(cs);
          realChars.push(ch);
        }
        el.appendChild(word);
      });

      // the period — the charm delivers it; amber only after impact
      const dot = document.createElement("span");
      dot.className = "text-glow";
      dot.textContent = ".";
      el.appendChild(dot);

      if (reduced) return; // fully resolved, amber period, no theatrics

      dot.style.color = "inherit"; // ink until the charm lands

      const total = realChars.length;
      const draw = (p: number) => {
        const revealed = p * total;
        const seed = Math.floor(performance.now() / 40);
        for (let i = 0; i < total; i++) {
          charSpans[i].textContent =
            i < revealed - 0.001 ? realChars[i] : GLYPHS[(seed + i * 7) % GLYPHS.length];
        }
      };

      let impacted = false;
      let cascadeStart = 0;
      let underline: HTMLSpanElement | null = null;

      const strike = () => {
        cascadeStart = performance.now();
        // the wave hops through the letters as they resolve
        charSpans.forEach((cs, i) => {
          cs.animate(
            [
              { transform: "translateY(0)" },
              { transform: "translateY(-0.09em)" },
              { transform: "translateY(0)" },
            ],
            {
              duration: 320,
              delay: (i / total) * CASCADE_MS,
              easing: "cubic-bezier(0.34, 1.56, 0.5, 1)",
            },
          );
        });
        // one soft amber flare on the whole mark
        el.animate(
          [
            { textShadow: "0 0 0 rgba(185,125,34,0)" },
            { textShadow: "0 0 30px rgba(185,125,34,0.5)" },
            { textShadow: "0 0 0 rgba(185,125,34,0)" },
          ],
          { duration: 520, easing: "ease-out" },
        );
        // the delivered period turns amber and pops
        dot.style.color = "";
        dot.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.45)" },
            { transform: "scale(1)" },
          ],
          { duration: 380, easing: "cubic-bezier(0.34, 1.56, 0.5, 1)" },
        );
        // an amber hairline draws itself out from the point of impact
        underline?.remove();
        underline = document.createElement("span");
        underline.setAttribute("aria-hidden", "true");
        Object.assign(underline.style, {
          position: "absolute",
          left: "0",
          right: "0",
          bottom: "-0.05em",
          height: "2px",
          background: "var(--color-accent)",
          transformOrigin: "26% 50%",
          pointerEvents: "none",
        } as CSSStyleDeclaration);
        el.appendChild(underline);
        const draw_ = underline.animate(
          [
            { transform: "scaleX(0)", opacity: 0.9 },
            { transform: "scaleX(1.04)", opacity: 0.8, offset: 0.7 },
            { transform: "scaleX(1)", opacity: 0.3 },
          ],
          { duration: 520, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" },
        );
        draw_.onfinish = () => {
          if (underline) underline.style.opacity = "0.3";
        };
      };

      const reset = () => {
        dot.style.color = "inherit";
        underline?.remove();
        underline = null;
      };

      draw(0);
      unsub = subscribeCharmImpact((v) => {
        const hit = v >= 1;
        if (hit === impacted) return;
        impacted = hit;
        if (hit) strike();
        else reset();
      });

      // rAF keeps the scrambled glyphs flickering and runs the resolve cascade
      const tick = () => {
        if (cancelled) return;
        const p = impacted
          ? Math.min(1, (performance.now() - cascadeStart) / CASCADE_MS)
          : 0;
        draw(p);
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
