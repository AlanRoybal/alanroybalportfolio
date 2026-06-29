import type { SkillGroup } from "./types";

/** Skill clusters, straight from the résumé. */
export const skillGroups: SkillGroup[] = [
  {
    id: "ai",
    title: "AI & Large Language Models",
    items: [
      "Anthropic Claude",
      "Model Context Protocol (MCP)",
      "Agent Frameworks",
      "Evaluation Harnesses (Evals)",
      "Retrieval-Augmented Generation (RAG)",
      "Prompt Engineering",
    ],
  },
  {
    id: "languages",
    title: "Languages",
    items: ["Python", "TypeScript", "Rust", "Swift", "C++", "C#", "Java", "SQL", "Zig"],
  },
  {
    id: "frameworks",
    title: "Frameworks",
    items: ["React", "Next.js", "Node.js", "FastAPI", "Flask", "Django", "Spring Boot"],
  },
  {
    id: "cloud",
    title: "Cloud & Infrastructure",
    items: ["AWS", "Google Cloud", "Azure", "Docker", "PostgreSQL", "Git"],
  },
];

/** Certifications. */
export const certifications: string[] = [
  "AWS Machine Learning Specialist",
  "AWS Solutions Architect Associate",
  "NVIDIA GenAI & LLM Engineer",
];
