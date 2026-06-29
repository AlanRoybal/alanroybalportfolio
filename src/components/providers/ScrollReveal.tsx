"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Centralized motion layer. Server-rendered sections stay declarative and tag
 * elements with `data-hero` (load-time cascade) or `data-reveal` (reveal on
 * scroll-in). All motion is gated behind prefers-reduced-motion via
 * gsap.matchMedia — under reduced motion nothing animates and everything renders
 * in its natural, visible state (also the no-JS fallback).
 */
export function ScrollReveal() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Hero: a deliberate load cascade.
      const heroEls = gsap.utils.toArray<HTMLElement>("[data-hero]");
      if (heroEls.length) {
        gsap.from(heroEls, {
          autoAlpha: 0,
          y: 26,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          delay: 0.15,
        });
      }

      // Everything else: a clip-wipe + rise so each block "falls into place" as
      // it enters the frame — content settles upward out of a soft mask.
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 38,
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.05,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Direct children of [data-reveal-stagger] cascade in one after another.
      gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
        gsap.from(group.children, {
          autoAlpha: 0,
          y: 28,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: "top 84%", once: true },
        });
      });

      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  });

  return null;
}
