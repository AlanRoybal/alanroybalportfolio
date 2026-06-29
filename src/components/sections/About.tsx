import { education, certifications } from "@/content";
import { ScrambleText } from "@/components/effects/ScrambleText";
import { TypeReveal } from "@/components/effects/TypeReveal";
import { HoneycombSkills } from "@/components/effects/HoneycombSkills";
import { Section } from "./Section";

export function About() {
  return (
    <Section
      id="about"
      index="01"
      label="about"
      tint
      title={
        <>
          i build the layers{" "}
          <em>
            <ScrambleText text="most people skip" trigger="view" />
          </em>
          .
        </>
      }
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <div
          data-reveal
          className="flex flex-col gap-5 text-[length:var(--text-lg)] font-light leading-relaxed text-text md:col-span-7"
        >
          <TypeReveal text="CS senior at UT Dallas and a founding engineer shipping production AI. I work the layer most people skip — MCP gateways, LLM eval harnesses, a CRDT and Metal renderer under a collaborative terminal." />

          <p className="text-[length:var(--text-md)] text-text-muted">
            My work was selected for the Google Gemini Developer Spotlight, and I direct
            HackUTD — North America&apos;s largest hackathon.
          </p>
        </div>

        <aside data-reveal className="md:col-span-5">
          <div className="rounded-[var(--radius-xl)] border border-line bg-surface-0 p-6">
            <span className="label text-text-faint">education</span>
            <p className="mt-3 font-display text-[length:var(--text-lg)] font-light text-text-strong">
              {education.degree}
            </p>
            <p className="mt-1 text-text-muted">
              UT Dallas · {education.graduation} · GPA {education.gpa}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {education.coursework.map((c) => (
                <li
                  key={c}
                  className="label rounded-[var(--radius-sm)] bg-surface-1 px-2.5 py-1 text-text-muted"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div data-reveal className="mt-16">
        <span className="label text-text-faint">what i work with</span>
        <HoneycombSkills className="mt-8" />
        <p className="mx-auto mt-6 max-w-2xl text-center text-[length:var(--text-sm)] text-text-muted">
          also deep in MCP · agent frameworks · evals · RAG · prompt engineering
        </p>

        <div className="mt-12">
          <span className="label text-text-faint">certifications</span>
          <ul className="mt-4 flex flex-wrap gap-2">
            {certifications.map((c) => (
              <li
                key={c}
                className="label rounded-[var(--radius-full)] border border-line px-4 py-2 text-text-muted"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
