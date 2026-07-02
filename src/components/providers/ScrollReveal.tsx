"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Centralized motion layer. Server-rendered sections stay declarative and tag
 * elements with:
 *   `data-hero`     — load-time cascade (timed to land as the intro veil wipes)
 *   `data-reveal`   — rise + fade on scroll-in
 *   `data-parallax` — slow counter-scroll drift (depth between layers)
 *   `data-kinetic`  — scroll-velocity skew on the big display type
 * All motion is gated behind prefers-reduced-motion via gsap.matchMedia — under
 * reduced motion nothing animates and everything renders in its natural,
 * visible state (also the no-JS fallback).
 */
export function ScrollReveal() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Hero cascade — held until the intro veil starts its wipe (1.5s), so the
      // hero rises into view as the veil clears rather than sitting fully
      // formed behind it.
      const heroEls = gsap.utils.toArray<HTMLElement>("[data-hero]");
      if (heroEls.length) {
        gsap.from(heroEls, {
          autoAlpha: 0,
          y: 26,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          delay: document.querySelector(".intro-veil") ? 2.65 : 0.15,
          // leave no inline transform behind — a leftover identity matrix
          // creates a stacking context that would trap the cards' z-index
          // (they must sit above the flying charm for the occlusion effect)
          clearProps: "transform,opacity,visibility",
        });
      }

      // Everything else: rise + fade as it enters the frame.
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 30,
          duration: 0.9,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });

      // Parallax: tagged layers drift against the scroll, so headings and the
      // portrait sit on a visibly different plane than the content over them.
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const depth = Number(el.dataset.parallax) || 32;
        gsap.fromTo(
          el,
          { y: depth },
          {
            y: -depth,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // Kinetic type: scroll velocity leans the big serif headings, springing
      // back upright when the page settles. Transform-only — no reflow.
      const kinetics = gsap.utils.toArray<HTMLElement>("[data-kinetic]");
      if (kinetics.length) {
        const skews = kinetics.map((el) =>
          gsap.quickTo(el, "skewY", { duration: 0.45, ease: "power3.out" }),
        );
        const clampSkew = gsap.utils.clamp(-3.2, 3.2);
        const velocityTrigger = ScrollTrigger.create({
          onUpdate: (self) => {
            const v = clampSkew(self.getVelocity() / -420);
            skews.forEach((s) => s(v));
          },
        });
        const settle = () => skews.forEach((s) => s(0));
        ScrollTrigger.addEventListener("scrollEnd", settle);

        ScrollTrigger.refresh();
        return () => {
          ScrollTrigger.removeEventListener("scrollEnd", settle);
          velocityTrigger.kill();
        };
      }

      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  });

  return null;
}
