import Image from "next/image";
import { education, certifications } from "@/content";
import { Tilt } from "@/components/effects/Tilt";

/**
 * Education highlight that stays a one-liner by default (degree · school · GPA)
 * and expands to reveal coursework and certifications. Uses a native <details>
 * so it works without JS and stays crawlable; no client state needed.
 */
export function EducationCard() {
  return (
    <Tilt className="z-[45] rounded-[var(--radius-xl)]">
    <details className="lit group rounded-[var(--radius-xl)] border border-line bg-surface-0 p-6 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
        <div>
          <span className="label text-text-faint">education</span>
          <p className="mt-3 font-display text-[length:var(--text-lg)] font-light text-text-strong">
            {education.degree}
          </p>
          <p className="mt-1 text-[length:var(--text-sm)] text-text-muted">
            UT Dallas · {education.graduation} · GPA {education.gpa}
          </p>
        </div>
        <span className="label mt-1 shrink-0 text-text-faint transition-colors group-hover:text-accent">
          <span className="group-open:hidden">show more</span>
          <span className="hidden group-open:inline">show less</span>
        </span>
      </summary>

      <div className="mt-5 border-t border-line pt-5">
        <span className="label text-text-faint">coursework</span>
        <ul className="mt-3 flex flex-wrap gap-2">
          {education.coursework.map((c) => (
            <li
              key={c}
              className="label rounded-[var(--radius-sm)] bg-surface-1 px-2.5 py-1 text-text-muted"
            >
              {c}
            </li>
          ))}
        </ul>

        <span className="label mt-6 block text-text-faint">certifications</span>
        <ul className="mt-3 flex flex-col gap-2">
          {certifications.map((c) => (
            <li
              key={c.name}
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-accent/20 bg-surface-1 px-4 py-3"
            >
              <Image src={c.badge} alt={c.name} width={32} height={32} className="shrink-0" />
              <span className="text-sm font-medium text-text-strong">{c.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
    </Tilt>
  );
}
