"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import Snap from "lenis/snap";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Smooth scroll via a directly-instantiated Lenis driven by GSAP's single ticker
 * (so Lenis + ScrollTrigger never desync). Also wires gentle section snapping
 * (lenis/snap, proximity) and re-measures after pins/fonts so the horizontal
 * projects track is sized correctly. Fully disabled under prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000); // GSAP secs -> Lenis ms
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Pins add spacers that change document height; re-measure after layout/fonts
    // settle so the horizontal track width is correct.
    ScrollTrigger.refresh();
    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // Gentle section snap — proximity (nudges into place only once you've nearly
    // stopped near a boundary), not mandatory. Skipped on touch/coarse pointers.
    let snap: Snap | undefined;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (!coarse) {
      snap = new Snap(lenis, {
        type: "proximity",
        duration: 0.6,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        // Wide catch so every section top "grabs" as you arrive, while still
        // letting you rest mid-section (proximity only acts once you've stopped).
        distanceThreshold: "40%",
        debounce: 200,
      });
      document
        .querySelectorAll<HTMLElement>("[data-snap]")
        .forEach((el) => snap!.addElement(el, { align: ["start"] }));
    }

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(onTick);
      snap?.destroy();
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <>{children}</>;
}
