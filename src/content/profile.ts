import type { Profile, Education } from "./types";

export const profile: Profile = {
  name: "Alan Roybal",
  title: "AI & Systems Engineer",
  blurb:
    "I build AI platforms and low-latency systems, from MCP gateways and evaluation harnesses to real-time, GPU-rendered software. Currently shipping production AI as a founding engineer.",
  location: "Dallas, TX",
  email: "alanroybal05@gmail.com",
  phone: "214-742-0157",
  resumeHref: "/Alan_Roybal_Resume_2026.pdf",
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/alanroybal",
      handle: "github.com/alanroybal",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/alan-roybal",
      handle: "linkedin.com/in/alan-roybal",
    },
  ],
};

export const education: Education = {
  school: "The University of Texas at Dallas",
  degree: "B.S. in Computer Science",
  graduation: "December 2026",
  gpa: "3.7 / 4.0",
  coursework: [
    "Data Structures & Algorithms",
    "Operating Systems",
    "Databases",
    "Machine Learning",
    "Data Analysis",
  ],
};
