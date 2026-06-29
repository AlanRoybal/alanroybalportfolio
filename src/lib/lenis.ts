import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

/** Current Lenis instance, or null under reduced-motion / before mount. */
export function getLenis(): Lenis | null {
  return instance;
}
