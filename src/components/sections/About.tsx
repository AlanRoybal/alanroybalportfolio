import { ScrambleText } from "@/components/effects/ScrambleText";
import { TypeReveal } from "@/components/effects/TypeReveal";
import { HoneycombSkills } from "@/components/effects/HoneycombSkills";
import { EducationCard } from "./EducationCard";
import { Section } from "./Section";

const HIGHLIGHTS: { what: string; how: string }[] = [
  { what: "MCP gateways", how: "secure model access for internal tools." },
  { what: "LLM eval harnesses", how: "validating models before they launch." },
  { what: "A CRDT and Metal renderer", how: "under a collaborative terminal." },
];

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
          className="flex flex-col gap-6 md:col-span-7"
        >
          <TypeReveal
            className="text-[length:var(--text-lg)] font-light leading-relaxed text-text"
            text="The connective tissue between a model and a product people can rely on — that's the part I like building."
          />

          <ul className="flex flex-col gap-3">
            {HIGHLIGHTS.map((h) => (
              <li
                key={h.what}
                className="border-l border-line pl-4 text-[length:var(--text-md)] leading-relaxed"
              >
                <span className="font-medium text-text-strong">{h.what}</span>{" "}
                <span className="text-text-muted">{h.how}</span>
              </li>
            ))}
          </ul>

          <p className="text-[length:var(--text-md)] text-text-muted">
            Selected for the Google Gemini Developer Spotlight. I direct HackUTD,
            North America&apos;s largest hackathon.
          </p>
        </div>

        <aside data-reveal className="md:col-span-5">
          <EducationCard />
        </aside>
      </div>

      <div data-reveal className="mt-16">
        <span className="label text-text-faint">what i work with</span>
        <HoneycombSkills className="mt-8" />
        <p className="mt-6 max-w-2xl text-[length:var(--text-sm)] text-text-muted">
          also deep in MCP · agent frameworks · evals · RAG · prompt engineering
        </p>
      </div>
    </Section>
  );
}
