import type { ExperienceItem } from "./types";

/** Roles, most recent first. */
export const experience: ExperienceItem[] = [
  {
    id: "northmark",
    company: "NorthMark Compute and Cloud",
    role: "AI Engineering Intern",
    type: "Internship",
    location: "Dallas, TX",
    start: "Jun 2026",
    end: "Present",
    summary:
      "Built an MCP gateway brokering secure model access for 12+ internal tools and an eval harness validating LLMs across 30+ benchmark suites before launch.",
    metric: "12+",
    metricLabel: "tools on the gateway",
    stack: ["MCP", "LLM Evals", "On-prem Inference"],
  },
  {
    id: "townes",
    company: "Townes & Co.",
    role: "Founding Engineer",
    type: "Full-time",
    location: "Dallas, TX",
    start: "Apr 2026",
    end: "Present",
    summary:
      "Shipped an AI platform end to end, from ingestion to deploy, with data integrations processing 5M+ records/day for the primary enterprise customer.",
    metric: "5M+",
    metricLabel: "records/day ingested",
    stack: ["AI Platform", "Data Ingestion", "Full-stack"],
  },
  {
    id: "gm-financial",
    company: "General Motors Financial",
    role: "Software Engineering Intern",
    type: "Internship",
    location: "Arlington, TX",
    start: "May 2025",
    end: "May 2026",
    summary:
      "Built test automation for 50+ API endpoints and a sub-50ms MCP agent, then was promoted to lead a 7-person team, lifting velocity ~25%.",
    metric: "7→15",
    metricLabel: "teams adopting AI",
    stack: ["Python", "C#", "Azure DevOps", "MCP"],
  },
];

/** Leadership & community. */
export const leadership: ExperienceItem[] = [
  {
    id: "hackutd",
    company: "HackUTD · ACM",
    role: "Director",
    type: "Nonprofit",
    location: "Dallas, TX",
    start: "Jan 2024",
    end: "Present",
    summary:
      "Directing a 40+ volunteer team behind North America's largest 24-hour hackathon on a six-figure budget, and shipping the open-source Jury platform to 10 organizations.",
    metric: "1,000+",
    metricLabel: "participants",
    stack: ["Open Source", "Leadership", "Community"],
  },
];
