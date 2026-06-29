"use client";

import { ScrambleText } from "@/components/effects/ScrambleText";
import { AsciiPortrait } from "@/components/effects/AsciiPortrait";
import { FlowAround } from "@/components/effects/FlowAround";
import { NeuralField } from "@/components/effects/NeuralField";

export function Hero() {
  return (
    <section
      id="top"
      data-snap
      className="relative flex min-h-dvh items-center overflow-hidden"
    >
      {/* generative neural constellation */}
      <NeuralField />
      {/* warm accent wash + bottom fade into the page */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[14%] top-[38%] h-[64vmin] w-[64vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--color-accent)_0%,transparent_70%)] opacity-[0.08] blur-3xl" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg"
      />

      <div className="relative mx-auto grid w-full max-w-[var(--container-wide)] grid-cols-1 items-center gap-x-14 gap-y-12 px-[clamp(20px,5vw,72px)] lg:grid-cols-[minmax(0,1fr)_auto]">
       <div>
        <p data-hero className="label mb-6 text-text-faint">
          Alan Roybal · AI &amp; Systems Engineer · Dallas, TX
        </p>
        <h1
          data-hero
          className="font-display font-light lowercase tracking-[var(--tracking-tightest)] text-text-strong"
        >
          <span className="block text-[length:clamp(1.4rem,3.2vw,2.4rem)] text-text-muted">
            i&apos;m alan —
          </span>
          <span className="mt-1 block text-[length:clamp(2.7rem,8vw,7rem)] leading-[0.92]">
            i build{" "}
            <em className="italic text-accent">
              <ScrambleText text="intelligent systems" durationMs={1100} />
            </em>
            .
          </span>
        </h1>

        <FlowAround
          data-hero
          className="relative z-10 mt-8 max-w-[46ch] text-[length:var(--text-md)] leading-relaxed text-text-muted lg:max-w-none"
          text="Founding engineer shipping production AI. CS senior at UT Dallas, open to new-grad AI & software roles."
        />

        <div data-hero className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-[var(--radius-full)] bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-colors duration-[var(--dur-quick)] ease-[var(--ease-out-soft)] hover:bg-accent-hi"
          >
            see projects <span aria-hidden="true">→</span>
          </a>
          <a
            href="/Alan_Roybal_Resume_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-line px-5 py-2.5 text-sm text-text-muted transition-colors duration-[var(--dur-quick)] hover:border-accent hover:text-accent"
          >
            résumé <span aria-hidden="true">↓</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-3 py-2.5 text-sm text-text-muted transition-colors duration-[var(--dur-quick)] hover:text-accent"
          >
            get in touch
          </a>
        </div>
       </div>

        {/* ASCII portrait — Alan's avatar, drawn in text and continuously animated */}
        <div
          data-hero
          data-flow-portrait
          role="img"
          aria-label="An animated ASCII clip blowing a kiss"
          className="relative z-0 mx-auto w-[min(94vw,600px)] justify-self-center lg:mx-0 lg:w-[clamp(440px,44vw,760px)] lg:justify-self-end"
        >
          <AsciiPortrait className="select-none font-mono text-[length:clamp(4px,0.8vw,8px)]" />
        </div>
      </div>

      {/* scroll cue */}
      <div
        aria-hidden="true"
        className="label absolute inset-x-0 bottom-6 mx-auto hidden w-fit text-text-faint motion-safe:block"
      >
        scroll ↓
      </div>
    </section>
  );
}
