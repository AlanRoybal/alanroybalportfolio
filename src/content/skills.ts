import type { SkillGroup } from "./types";

/** Skill clusters, straight from the resume. */
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
export interface Certification {
  name: string;
  provider: "aws" | "nvidia";
  badge: string;
}

export const certifications: Certification[] = [
  { name: "AWS Machine Learning Specialist", provider: "aws", badge: "/badges/aws-ml-specialty.png" },
  { name: "AWS Solutions Architect Associate", provider: "aws", badge: "/badges/aws-sa-associate.png" },
  { name: "NVIDIA GenAI & LLM Engineer", provider: "nvidia", badge: "/badges/nvidia-genai.png" },
];
