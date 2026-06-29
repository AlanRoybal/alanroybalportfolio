"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { projects, type Project } from "@/content";
import { ScrambleText } from "@/components/effects/ScrambleText";
import { cn } from "@/lib/cn";

const DESKTOP_MOTION = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const FALLBACK = "(max-width: 767.98px), (prefers-reduced-motion: reduce)";

// Per-project warm wash (rgb): amber, warm sand, deep amber — all within the
// single-accent family so the page never picks up a second hue.
const TINTS = ["233,162,59", "199,191,176", "185,125,34"];
const pad = (n: number) => String(n).padStart(2, "0");

type Panel = { project: Project; pi: number; kind: "overview" | "showcase" };

// Each project spans two panels: an overview and a showcase.
const PANELS: Panel[] = projects.flatMap((project, pi) => [
  { project, pi, kind: "overview" as const },
  { project, pi, kind: "showcase" as const },
]);

/**
 * A code-drawn "spec card" standing in for a product screenshot — a faux terminal
 * session printing the project's real stack and metrics. Asset-free, on-theme,
 * and always populated with true data.
 */
function SpecCard({ project, tint }: { project: Project; tint: string }) {
  const slug = project.id;
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface-sunken font-mono text-[length:var(--text-sm)] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] ring-1 ring-inset ring-line-faint">
      <div className="flex items-center gap-2 border-b border-line-faint bg-surface-0/70 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-positive/70" />
        <span className="label ml-3 truncate text-text-faint">{slug} — zsh</span>
      </div>
      <div
        className="relative p-5 leading-relaxed"
        style={{
          backgroundImage: `radial-gradient(120% 120% at 100% 0%, rgba(${tint},0.10), transparent 60%)`,
        }}
      >
        <p className="text-text-faint">
          <span className="text-accent">~/{slug}</span> $ cat stack
        </p>
        <p className="mt-1 text-text">{project.stack.join(" · ")}</p>

        <p className="mt-4 text-text-faint">
          <span className="text-accent">~/{slug}</span> $ run --metrics
        </p>
        <div className="mt-1 flex flex-col gap-1">
          {project.metrics.map((m) => (
            <div key={m.label} className="flex justify-between gap-4">
              <span className="text-text-muted">{m.label.toLowerCase()}</span>
              <span className="tabular-nums text-text-strong">{m.value}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-text-faint">
          <span className="text-accent">~/{slug}</span> $ status
        </p>
        <p className="mt-1 text-positive">
          ✓ {project.status ?? project.badge ?? "shipped"}
          <span className="ml-1 inline-block w-2 animate-pulse text-accent">▍</span>
        </p>
      </div>
    </div>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {project.links.map((l) =>
        l.href !== "#" ? (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="label inline-flex items-center gap-1.5 text-text-muted transition-colors duration-[var(--dur-quick)] hover:text-accent focus-visible:text-accent"
          >
            {l.label} <span aria-hidden="true">→</span>
          </a>
        ) : (
          <span key={l.label} className="label text-text-faint">
            {l.label} · soon
          </span>
        ),
      )}
    </div>
  );
}

function OverviewPanel({ project, pi, total }: { project: Project; pi: number; total: number }) {
  return (
    <div className="relative mx-auto w-full max-w-[var(--container-content)] px-[clamp(20px,6vw,90px)]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[clamp(20px,6vw,90px)] font-display text-[length:clamp(7rem,20vw,18rem)] font-light leading-none text-text-strong opacity-[0.05]"
      >
        {pad(pi + 1)}
      </span>
      <div className="flex flex-wrap items-center gap-3">
        <span className="label text-text-faint">
          {pad(pi + 1)} / {pad(total)} · overview
        </span>
        {project.badge ? (
          <span className="shimmer label rounded-[var(--radius-full)] border border-glow/40 px-2.5 py-1 text-glow">
            {project.badge}
          </span>
        ) : null}
      </div>
      <h3 className="mt-5 font-display text-[length:clamp(2.5rem,5vw,4.75rem)] font-light leading-[0.98] tracking-tight text-text-strong">
        {project.title}
      </h3>
      <p className="mt-5 max-w-[42ch] font-display text-[length:clamp(1.3rem,2.4vw,1.9rem)] font-light leading-snug text-text">
        {project.tagline}
      </p>
      <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-5">
        {project.metrics.slice(0, 3).map((m) => (
          <div key={m.label}>
            <dt className="label text-text-faint">{m.label}</dt>
            <dd className="mt-1 font-display text-[length:var(--text-2xl)] font-light text-glow">
              {m.value}
            </dd>
          </div>
        ))}
      </dl>
      <ul className="mt-8 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <li
            key={s}
            className="label rounded-[var(--radius-sm)] bg-surface-1 px-2.5 py-1 text-text-muted"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShowcasePanel({ project, pi, total }: { project: Project; pi: number; total: number }) {
  return (
    <div className="mx-auto grid w-full max-w-[var(--container-content)] grid-cols-1 items-center gap-10 px-[clamp(20px,6vw,90px)] md:grid-cols-2 md:gap-16">
      <div>
        <span className="label text-text-faint">
          {pad(pi + 1)} / {pad(total)} · how it works
        </span>
        <h3 className="mt-4 font-display text-[length:clamp(2rem,3.6vw,3rem)] font-light leading-tight tracking-tight text-text-strong">
          {project.title}
        </h3>
        <ul className="mt-7 flex flex-col divide-y divide-line-faint">
          {project.features.map((f) => (
            <li key={f.title} className="py-4">
              <p className="font-display text-[length:var(--text-lg)] font-light text-text-strong">
                {f.title}
              </p>
              <p className="mt-1 max-w-[44ch] text-text-muted">{f.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-7">
          <ProjectLinks project={project} />
        </div>
      </div>
      <SpecCard project={project} tint={TINTS[pi % TINTS.length]} />
    </div>
  );
}

export function ProjectsHorizontal() {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0); // active PANEL index
  const total = projects.length;
  const project = PANELS[active].pi;
  const kind = PANELS[active].kind;

  useGSAP(
    () => {
      const track = trackRef.current!;
      const pin = pinRef.current!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", track);
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const tween = gsap.to(track, { x: () => -distance(), ease: "none" });

        const st = ScrollTrigger.create({
          animation: tween,
          trigger: pin,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          anticipatePin: 1,
          scrub: true,
          invalidateOnRefresh: true,
          // Snap to every panel — advancing to the next feels deliberate.
          snap: {
            snapTo: (value) => {
              const d = distance();
              if (d <= 0) return 0;
              const pts = cards.map((c) => gsap.utils.clamp(0, 1, c.offsetLeft / d));
              return pts.reduce((a, b) => (Math.abs(b - value) < Math.abs(a - value) ? b : a));
            },
            duration: { min: 0.25, max: 0.6 },
            delay: 0.05,
            ease: "power2.inOut",
            directional: true,
          },
          onUpdate: (self) => {
            const i = Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)));
            setActive((prev) => (prev === i ? prev : i));
            if (fillRef.current) fillRef.current.style.transform = `scaleX(${self.progress})`;
          },
        });

        const onFocusIn = (e: FocusEvent) => {
          const card = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
          const d = distance();
          if (!card || d <= 0) return;
          const p = gsap.utils.clamp(0, 1, card.offsetLeft / d);
          const target = st.start + p * (st.end - st.start);
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(target, { lock: true });
          else window.scrollTo({ top: target });
        };
        track.addEventListener("focusin", onFocusIn);
        return () => track.removeEventListener("focusin", onFocusIn);
      });

      mm.add(FALLBACK, () => {
        const io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                const i = cards.indexOf(e.target as HTMLElement);
                if (i >= 0) setActive(i);
              }
            }
          },
          { root: track, threshold: 0.6 },
        );
        cards.forEach((c) => io.observe(c));
        return () => io.disconnect();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="projects"
      data-snap
      aria-roledescription="carousel"
      aria-label="Selected projects"
      className="relative w-full overflow-x-clip"
    >
      <div className="mx-auto w-full max-w-[var(--container-content)] px-[var(--space-gutter)] pt-[var(--space-section)]">
        <header className="relative mb-2 border-b border-line pb-7">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-8 right-0 font-display text-[length:clamp(4rem,12vw,9rem)] font-light leading-none text-text-strong opacity-[0.05]"
          >
            03
          </span>
          <span className="label text-text-faint">03 / projects</span>
          <h2 className="mt-4 max-w-[20ch] font-display text-[length:var(--text-3xl)] font-light lowercase leading-[1.02] tracking-tight text-text-strong [&_em]:italic [&_em]:text-glow">
            things i&apos;ve{" "}
            <em>
              <ScrambleText text="built" trigger="view" />
            </em>
            .
          </h2>
          <p className="mt-5 max-w-[60ch] text-[length:var(--text-md)] text-text-muted">
            Two panels each — the what, then the how.
            <span className="ml-2 hidden text-text-faint motion-safe:md:inline">
              Keep scrolling to advance →
            </span>
          </p>
        </header>
      </div>

      <div ref={pinRef} className="relative w-full motion-safe:md:h-screen motion-safe:md:overflow-hidden">
        <ul
          ref={trackRef}
          role="list"
          className={cn(
            "no-scrollbar flex list-none",
            "overflow-x-auto snap-x snap-mandatory overscroll-x-contain",
            "motion-safe:md:h-full motion-safe:md:items-stretch",
            "motion-safe:md:overflow-visible motion-safe:md:snap-none",
          )}
        >
          {PANELS.map((panel, i) => (
            <li
              key={`${panel.project.id}-${panel.kind}`}
              data-card
              aria-label={`Project ${panel.pi + 1} of ${total}: ${panel.project.title} — ${panel.kind}`}
              style={{
                backgroundImage: `radial-gradient(100% 80% at 100% 0%, rgba(${TINTS[panel.pi % TINTS.length]},0.10), transparent 55%)`,
              }}
              className={cn(
                "relative flex w-screen shrink-0 snap-center flex-col justify-center",
                "min-h-[82vh] py-16 motion-safe:md:h-full motion-safe:md:min-h-0 motion-safe:md:py-0",
                i > 0 && "md:border-l md:border-line/60",
              )}
            >
              {panel.kind === "overview" ? (
                <OverviewPanel project={panel.project} pi={panel.pi} total={total} />
              ) : (
                <ShowcasePanel project={panel.project} pi={panel.pi} total={total} />
              )}
            </li>
          ))}
        </ul>

        {/* progress: project number + which panel + scrubbed bar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 left-[var(--space-gutter)] right-[var(--space-gutter)] hidden items-center gap-4 motion-safe:md:flex"
        >
          <span className="label tabular-nums text-text-strong">{pad(project + 1)}</span>
          <span className="label text-text-faint">{kind}</span>
          <span className="relative h-px flex-1 bg-line">
            <span ref={fillRef} className="absolute inset-0 origin-left scale-x-0 bg-accent" />
          </span>
          <span className="label tabular-nums text-text-faint">{pad(total)}</span>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Project {project + 1} of {total}: {PANELS[active].project.title}, {kind} panel
      </p>
    </section>
  );
}
