import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// GSAP + ScrollTrigger are fully free as of 2025. Register the plugin once,
// browser-side only (ScrollTrigger touches window/document).
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
