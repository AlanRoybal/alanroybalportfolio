# Alan Roybal — Portfolio (Theme: "Ink & Signal")

A fast, editorial, **asset-free** portfolio for new-grad software roles in **AI/ML** and **backend/systems**. The previous film-camera concept (3D rangefinder, turntable, Portra LUT, film grain) has been removed — it depended on photography and 3D files that didn't exist. This version needs **zero imported assets**: the only graphic on the site is generated in code.

## The idea

Alan is a systems/AI engineer, so the site *is* an engineering artifact: hand-built, prerendered, and drawn in code. The one signature visual — a generative **signal field** in the hero — doubles as proof of craft, not decoration.

## Design system

- **Palette — "ink":** a warm-neutral near-black base (`--bg: #0c0d0f`) through a tinted gray ramp, with **one** accent: warm amber/gold (`--accent: #e9a23b`). No second hue anywhere. (Tokens in `src/app/globals.css`.)
- **Type — three voices, one ladder:** Fraunces (editorial serif display), Hanken Grotesk (body), IBM Plex Mono (HUD micro-labels + terminal cards). All self-hosted via `next/font`, sized off one tokenized scale.
- **Signature graphic:** `src/components/sections/Hero.tsx` — a 2D-canvas flow field. Particles are advected through smooth value-noise; trails fade by compositing a translucent fill. DPR capped at 2, particle count scaled to viewport. Renders a single still frame under `prefers-reduced-motion`.
- **Projects:** each project = an overview panel + a **terminal "spec card"** (code-drawn, prints the real stack/metrics/status) — no screenshots required.
- **Motion:** Lenis + GSAP share one ticker (no desync); everything gated behind `prefers-reduced-motion`.

## Structure

Hero → About (+ skills, education, certs) → Experience (+ leadership) → Projects (horizontal, pinned on desktop / swipe on mobile) → Contact. Plus `/colophon` — the build writeup. Mobile nav is a real sheet menu. Résumé is one click from anywhere.

## SEO / AEO

- `metadata` with canonical, keywords, robots, OpenGraph (`profile`) + Twitter card.
- Build-time **OG image** (`app/opengraph-image.tsx`, `next/og` — no asset).
- **JSON-LD** Person + WebSite (`src/lib/site.ts`) for rich results and answer engines.
- `app/sitemap.ts` + `app/robots.ts`.
- Targets: name searches ("Alan Roybal") and "new grad software engineer / AI engineer" intent.

## Hard gates

LCP < 2.5s, INP < 200ms, CLS < 0.1 · full `prefers-reduced-motion` · no-JS readable · no image payload on the landing page.

## Open items

- Real GitHub repo + live demo URLs per project (currently `todo` in `src/content/projects.ts`).
- Confirm LinkedIn slug and preferred contact email.
