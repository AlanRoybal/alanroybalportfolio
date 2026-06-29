import { cn } from "@/lib/cn";

interface SectionProps {
  id: string;
  /** Two-digit index, e.g. "01". */
  index: string;
  /** Eyebrow label, e.g. "experience". */
  label: string;
  /** Display title (lowercase; wrap the accent word in <em> for italic glow). */
  title: React.ReactNode;
  /** Optional supporting line under the title. */
  intro?: React.ReactNode;
  /** Lift the section onto a slightly raised surface for alternation. */
  tint?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Full-bleed section shell with a watermark index number, numbered eyebrow, and
 * a big lowercase serif title with an italic accent word. `data-snap` marks the
 * top as a gentle snap target (handled by SmoothScroll).
 */
export function Section({ id, index, label, title, intro, tint, className, children }: SectionProps) {
  return (
    <section
      id={id}
      data-snap
      className={cn(
        // transparent so the charm (ScrollCharm) flies behind the text; the body
        // provides the base color. `tint` keeps a faint lift on alternating sections.
        "relative w-full scroll-mt-16 py-[var(--space-section)]",
        tint ? "bg-surface-0/40" : "bg-transparent",
      )}
    >
      <div className="mx-auto w-full max-w-[var(--container-content)] px-[var(--space-gutter)]">
        <header data-reveal className="relative mb-14 border-b border-line pb-7">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-8 right-0 font-display text-[length:clamp(4rem,12vw,9rem)] font-light leading-none text-text-strong opacity-[0.05]"
          >
            {index}
          </span>
          <span className="label text-text-faint">
            {index} / {label}
          </span>
          <h2 className="mt-4 max-w-[20ch] font-display text-[length:var(--text-3xl)] font-light lowercase leading-[1.02] tracking-tight text-text-strong [&_em]:italic [&_em]:text-glow">
            {title}
          </h2>
          {intro ? (
            <p className="mt-5 max-w-[60ch] text-[length:var(--text-md)] text-text-muted">{intro}</p>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}
