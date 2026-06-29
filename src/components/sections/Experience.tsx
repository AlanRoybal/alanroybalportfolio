import { experience, leadership, type ExperienceItem } from "@/content";
import { CountUp } from "@/components/effects/CountUp";
import { ScrambleText } from "@/components/effects/ScrambleText";
import { Section } from "./Section";

function Row({ job }: { job: ExperienceItem }) {
  return (
    <article
      data-reveal
      className="rounded-[var(--radius-xl)] border border-line bg-surface-0 p-7 transition-colors duration-[var(--dur-base)] hover:border-line-strong md:p-8"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-[62ch]">
          <span className="label text-text-faint">at</span>
          <h3 className="mt-1 font-display text-[length:var(--text-xl)] font-light leading-tight text-text-strong">
            {job.company}
          </h3>
          <p className="font-display text-[length:var(--text-lg)] font-light italic text-glow">
            {job.role}
          </p>
          <p className="label mt-2 text-text-faint">
            {job.type} · {job.location} · {job.start} — {job.end}
          </p>
          <p className="mt-4 text-text-muted">{job.summary}</p>
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

        <div className="shrink-0 md:pl-8 md:text-right">
          <p className="font-display text-[length:var(--text-2xl)] font-light leading-none text-glow">
            <CountUp value={job.metric} />
          </p>
          <p className="label mt-2 text-text-faint">{job.metricLabel}</p>
        </div>
      </div>
    </article>
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

      <p className="label mb-5 mt-12 text-text-faint">leadership &amp; community</p>
      <div className="flex flex-col gap-5">
        {leadership.map((j) => (
          <Row key={j.id} job={j} />
        ))}
      </div>
    </Section>
  );
}
