import { profile } from "@/content";
import { ScrambleText } from "@/components/effects/ScrambleText";
import { CharmWordmark } from "@/components/effects/CharmWordmark";
import { DitherSkyline } from "@/components/effects/DitherSkyline";

export function Contact() {
  return (
    <footer
      id="contact"
      data-snap
      className="relative w-full overflow-hidden scroll-mt-16 bg-surface-0 pb-16 pt-[var(--space-section)]"
    >
      {/* dithered dot-art skyline closing the page */}
      <DitherSkyline className="pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(150px,24vh,300px)] w-full [mask-image:linear-gradient(to_top,#000_55%,transparent)]" />
      <div className="relative z-10 mx-auto w-full max-w-[var(--container-content)] px-[var(--space-gutter)]">
        <div data-reveal className="border-t border-line pt-14">
          <span className="label text-text-faint">04 / contact</span>
          <h2 className="mt-4 max-w-[18ch] font-display text-[length:var(--text-3xl)] font-light lowercase leading-[1.02] tracking-tight text-text-strong [&_em]:italic [&_em]:text-glow">
            let&apos;s build{" "}
            <em>
              <ScrambleText text="something good" trigger="view" />
            </em>
            .
          </h2>
          <p className="mt-5 max-w-[48ch] text-[length:var(--text-md)] text-text-muted">
            I&apos;m looking for new-grad software roles in AI and systems. The inbox is open — say hi.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-[var(--radius-full)] bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-colors duration-[var(--dur-quick)] ease-[var(--ease-out-soft)] hover:bg-accent-hi"
            >
              {profile.email} <span aria-hidden="true">→</span>
            </a>
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-line px-5 py-2.5 text-sm text-text-muted transition-colors duration-[var(--dur-quick)] hover:border-accent hover:text-accent"
              >
                {s.label.toLowerCase()}
              </a>
            ))}
            <a
              href={profile.resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-line px-5 py-2.5 text-sm text-text-muted transition-colors duration-[var(--dur-quick)] hover:border-accent hover:text-accent"
            >
              resume <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        {/* giant wordmark — held scrambled until the charm lands and resolves it
            (CharmWordmark, via pretext). It is the charm's landing target. */}
        <CharmWordmark
          text="alan roybal"
          className="mt-24 font-display text-[length:clamp(3rem,17vw,15rem)] font-light lowercase leading-[0.85] tracking-[var(--tracking-tightest)] text-text-strong [will-change:transform]"
        />

        <div className="label mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line-faint pt-6 text-text-faint">
          <span>© 2026 Alan Roybal</span>
          <span>Dallas, TX · open to new-grad roles</span>
        </div>
      </div>
      {/* small scroll runway so the charm can land on the wordmark and settle (ScrollCharm) */}
      <div aria-hidden="true" className="h-[14vh]" />
    </footer>
  );
}
