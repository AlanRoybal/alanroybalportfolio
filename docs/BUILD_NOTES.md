# Build Notes — load-bearing decisions

Concept, structure, and phases live in `PLAN.md`. Asset capture spec in `ASSET_BRIEF.md`.
Full verified research output: see the workflow result (persisted in the session task output).

## Stack (verified mid-2026, pinned)
- Next **16.2.9** (App Router, Turbopack default) · React **19.2.x** · TypeScript · Tailwind **v4** (CSS-first `@theme`, no config file).
- three **0.184.0** (NOT 0.185 — `postprocessing@6.39.1` peer requires `< 0.185`), @react-three/fiber **9.6.1**, drei **10.7.7**, @react-three/postprocessing **3.0.4**, @types/three 0.184.1.
- gsap **3.15** (+ @gsap/react `useGSAP`), lenis **1.3.24**, motion **12.42** (import from `motion/react`).
- `@chenglou/pretext` **0.0.8** (pin exact; client-only; feature-detect `Intl.Segmenter`; `await document.fonts.ready`; ~27KB gz, lazy-load).
- utils: clsx, tailwind-merge (`cn`). dev: sharp (asset gen).

## Critical gotchas
- `next/dynamic({ssr:false})` is ILLEGAL in a Server Component in Next 16 → wrap the dynamic Canvas import in a `'use client'` loader component.
- R3F v9 = React 19 generation; must use drei@10 + postprocessing@3 (don't mix v8/v2). Don't bump React past 19.2.x (fiber peer `<19.3`).
- GSAP fully free now — plain `gsap` from npm, no Club registry.
- React 19 StrictMode double-invokes effects → use `useGSAP({scope})`, not raw useEffect, for GSAP.
- Lenis↔ScrollTrigger: `autoRaf:false` + feed `lenis.raf(time*1000)` from `gsap.ticker` + `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.lagSmoothing(0)`. Implemented in `src/components/providers/SmoothScroll.tsx`.
- Don't enable React Compiler over the R3F tree.

## Design system (in `globals.css`)
- PRIMARY theme = dark **darkroom**; secondary `[data-theme="day"]` daylight. Never pure #000/#fff.
- Fonts: **Fraunces** (display, opsz/SOFT/WONK axes), **Hanken Grotesk** (body), **IBM Plex Mono** (EXIF/HUD). Wired via next/font in `layout.tsx`.
- Tokens generate utilities: `text-text-strong`, `bg-surface-1`, `text-portra-300`, `text-accent`, etc. Semantic colors switch with theme via `@theme inline` → `var(--bg)` etc.
- Signature utilities: `.exif` (mono HUD), `.halate`/`.halate-box` (warm halation glow), `.aberrate` (chromatic fringe), `.film-grain`, `.film-vignette`.
- Motion easings: `ease-shutter`, `ease-detent`, `ease-advance`, `ease-aperture`, `ease-focus`. Durations `--dur-tick…--dur-load`.
- Film-look params (grain/halation/vignette/CA) are CSS vars; halation tint is film red-orange `#e8543b`, vignette deep teal `#0b1112`.

## Signature element
Whole viewport framed like the X100VI optical viewfinder: thin bright-line frame + machined corner ticks (CSS, no SVG) + persistent corner EXIF HUD in Plex Mono whose values are real project metadata; frame counter tracks scroll. Headings get `.halate`; hero word alone gets `.aberrate`.

## Scroll choreography (P3)
- Pinned stage: GSAP ScrollTrigger, pin stage + animate children, `end:()=>"+="+N*innerHeight`, `scrub`, `snap:{snapTo:"labels"}`, `invalidateOnRefresh`.
- Video scrub: re-encode `-g 2 -movflags +faststart`; drive `currentTime` via a proxy obj with `scrub`; guard `!video.seeking`; iOS prime with muted play(). Image-sequence canvas fallback is the bulletproof option.
- Gradient text wipe: `background-clip:text` + animate `background-position-x` with scrub. Per-word via SplitText.
- Reduced motion: `gsap.matchMedia()` — build animations only when motionOK; else set end states. Lenis disabled, pinning skipped, video shows last frame, wipes fully revealed.

## Content
`src/content/` — projects (Earth2Echo featured: Gemini Spotlight; CoTTY; Lyria Studio), experience, leadership, skills (as dials), profile, education. TODO: real per-project GitHub/demo URLs from Alan.
