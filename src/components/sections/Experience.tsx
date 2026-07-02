import { experience, leadership, type ExperienceItem } from "@/content";
import { CountUp } from "@/components/effects/CountUp";
import { ScrambleText } from "@/components/effects/ScrambleText";
import { Tilt } from "@/components/effects/Tilt";
import { Section } from "./Section";

/** The always-visible teaser: the headline metric (accented) plus a couple of keywords. */
function MetricStrip({ job }: { job: ExperienceItem }) {
  const keywords = job.stack?.slice(0, 2) ?? [];
  return (
    <p className="label flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className="font-display text-[length:var(--text-md)] font-light leading-none text-glow">
        <CountUp value={job.metric} />
      </span>
      <span className="text-text-muted">{job.metricLabel}</span>
      {keywords.map((k) => (
        <span
          key={k}
          className="text-text-muted before:mr-2 before:text-text-faint before:content-['·']"
        >
          {k}
        </span>
      ))}
    </p>
  );
}

function Row({ job }: { job: ExperienceItem }) {
  return (
    // z-45 lifts the card above the flying charm (z-40) — it passes behind,
    // which is what makes the page read as layered rather than flat.
    <Tilt className="z-[45] rounded-[var(--radius-xl)]">
    <details
      data-reveal
      className="group rounded-[var(--radius-xl)] border border-line bg-surface-0 p-7 md:p-8 [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer list-none flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="label text-text-faint">at</span>
            <h3 className="mt-1 font-display text-[length:var(--text-xl)] font-light leading-tight text-text-strong">
              {job.company}
            </h3>
            <p className="font-display text-[length:var(--text-lg)] font-light italic text-text-muted">
              {job.role}
            </p>
            <p className="label mt-2 text-text-faint">
              {job.type} · {job.location} · {job.start}–{job.end}
            </p>
          </div>
          <span className="label mt-1 shrink-0 text-text-faint transition-colors group-hover:text-accent">
            <span className="group-open:hidden">+ details</span>
            <span className="hidden group-open:inline">less</span>
          </span>
        </div>
        <MetricStrip job={job} />
      </summary>

      <div className="mt-6 border-t border-line pt-6">
        <p className="max-w-[62ch] text-text-muted">{job.summary}</p>
        {job.stack ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {job.stack.map((s) => (
              <li
                key={s}
                className="label rounded-[var(--radius-sm)] bg-surface-1 px-2.5 py-1 text-text-muted"
              >
                {s}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </details>
    </Tilt>
  );
}

export function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      label="experience"
      title={
        <>
          places i&apos;ve{" "}
          <em>
            <ScrambleText text="worked" trigger="view" />
          </em>
          .
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {experience.map((j) => (
          <Row key={j.id} job={j} />
        ))}
      </div>

      <div className="mt-14 border-t border-line pt-10">
        <span className="label text-text-faint">leadership &amp; community</span>
        <div className="mt-6 flex flex-col gap-5">
          {leadership.map((j) => (
            <Row key={j.id} job={j} />
          ))}
        </div>
      </div>
    </Section>
  );
}
