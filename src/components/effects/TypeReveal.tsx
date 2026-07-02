"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  prepareWithSegments,
  layoutWithLines,
  fontStringFrom,
  lineHeightPx,
} from "@/lib/pretext";

/**
 * Scroll-scrubbed "typesetting": a paragraph resolves line by line as it scrubs
 * into view, each real wrapped line rising into focus with an amber underline
 * that grows to *exactly that line's measured width*.
 *
 * The line widths come from pretext's `layoutWithLines`, which returns the
 * actual wrapped lines + each line's width without a DOM reflow. Reading those
 * break points from the DOM would need `Range.getClientRects()` — a reflow we
 * must not trigger while a GSAP scrub is running.
 *
 * Degrades cleanly: under reduced motion the `matchMedia` branch never runs, so
 * the lines simply render fully visible (no animation, no underline). No-JS gets
 * the plain server-rendered paragraph.
 */
export function TypeReveal({
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

    let cancelled = false;
    let raf = 0;
    let mm: ReturnType<typeof gsap.matchMedia> | undefined;

    const build = () => {
      if (cancelled) return;
      mm?.revert();
      el.textContent = text;
      const width = el.clientWidth;
      if (!width) return;

      const { font, fontSizePx, opts } = fontStringFrom(el);
      const lh = lineHeightPx(el, fontSizePx);

      let lines;
      try {
        const prepared = prepareWithSegments(text, font, opts);
        lines = layoutWithLines(prepared, width, lh).lines;
      } catch {
        el.textContent = text;
        return;
      }
      if (!lines.length) {
        el.textContent = text;
        return;
      }

      el.textContent = "";
      const rows: HTMLSpanElement[] = [];
      const unders: HTMLSpanElement[] = [];
      for (const ln of lines) {
        const row = document.createElement("span");
        row.style.display = "block";
        row.style.position = "relative";
        row.style.width = "fit-content";
        row.style.maxWidth = "100%";

        const txt = document.createElement("span");
        txt.textContent = ln.text;

        const under = document.createElement("span");
        under.setAttribute("aria-hidden", "true");
        under.style.position = "absolute";
        under.style.left = "0";
        under.style.bottom = "-0.12em";
        under.style.height = "2px";
        under.style.width = `${Math.ceil(ln.width)}px`;
        under.style.maxWidth = "100%";
        under.style.background = "var(--color-accent)";
        under.style.transformOrigin = "left center";
        under.style.transform = "scaleX(0)";

        row.append(txt, under);
        el.appendChild(row);
        rows.push(row);
        unders.push(under);
      }

      mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(rows, { opacity: 0.32, y: 12 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            end: "top 38%",
            scrub: true,
          },
        });
        tl.to(rows, { opacity: 1, y: 0, ease: "none", stagger: 0.4 }, 0);
        tl.to(unders, { scaleX: 1, ease: "none", stagger: 0.4 }, 0.1);
        ScrollTrigger.refresh();
      });
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
      mm?.revert();
    };
  }, [text]);

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
}
