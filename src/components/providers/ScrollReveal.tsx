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

      // Everything else: rise + fade as it enters the frame.
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 30,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });

      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  });

  return null;
}
