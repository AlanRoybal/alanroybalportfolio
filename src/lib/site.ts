/** Canonical site metadata — single source of truth for SEO, structured data,
 *  the sitemap, robots, and the generated OG image. */
export const SITE = {
  url: "https://alanroybal.com",
  name: "Alan Roybal",
  title: "Alan Roybal — AI & Systems Engineer",
  role: "AI & Systems Engineer",
  description:
    "Alan Roybal is an AI & systems software engineer and CS senior at UT Dallas, open to new-grad roles. He builds MCP gateways, LLM evaluation harnesses, and real-time, GPU-rendered systems — including work featured in the Google Gemini Developer Spotlight.",
  shortDescription:
    "AI & systems engineer. New-grad software engineer building MCP gateways, LLM evals, and real-time GPU-rendered systems.",
  locality: "Dallas",
  region: "TX",
  country: "US",
  email: "alanroybal05@gmail.com",
  github: "https://github.com/alanroybal",
  linkedin: "https://linkedin.com/in/alan-roybal",
  university: "The University of Texas at Dallas",
  award: "Google Gemini Developer Spotlight",
  keywords: [
    "Alan Roybal",
    "new grad software engineer",
    "new grad software engineer 2026",
    "entry level software engineer",
    "AI engineer",
    "AI systems engineer",
    "machine learning engineer new grad",
    "LLM engineer",
    "MCP gateway",
    "model context protocol",
    "LLM evaluation harness",
    "UT Dallas computer science",
    "software engineer portfolio",
    "backend systems engineer",
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Large Language Models",
    "Model Context Protocol (MCP)",
    "LLM Evaluation",
    "Retrieval-Augmented Generation (RAG)",
    "Distributed Systems",
    "Backend Engineering",
    "GPU Rendering",
    "Python",
    "TypeScript",
    "Rust",
    "Cloud Infrastructure",
  ],
} as const;

/** Rich structured data (Person + WebSite + ProfilePage) for search rich
 *  results, the Knowledge Graph, and answer engines (AEO). The dense Person
 *  entity is what ties the name "Alan Roybal" to this site. */
export function jsonLd() {
  const personId = `${SITE.url}/#person`;

  const person = {
    "@type": "Person",
    "@id": personId,
    name: SITE.name,
    alternateName: "Alan Roybal",
    url: SITE.url,
    image: `${SITE.url}/opengraph-image`,
    jobTitle: SITE.role,
    description: SITE.description,
    disambiguatingDescription:
      "Software engineer (AI & systems); new-grad candidate; UT Dallas computer science; Director of HackUTD.",
    email: `mailto:${SITE.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.locality,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    homeLocation: {
      "@type": "Place",
      name: "Dallas, Texas",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: SITE.university,
      sameAs: "https://www.utdallas.edu/",
    },
    worksFor: [
      { "@type": "Organization", name: "Townes & Co." },
      { "@type": "Organization", name: "NorthMark Compute and Cloud" },
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Software Engineer",
      occupationalCategory: "15-1252.00", // O*NET: Software Developers
      skills: SITE.knowsAbout.join(", "),
    },
    knowsAbout: SITE.knowsAbout,
    knowsLanguage: "en",
    award: SITE.award,
    sameAs: [SITE.github, SITE.linkedin],
    seeks: {
      "@type": "Demand",
      name: "New-grad software engineering roles in AI and systems",
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.title,
    description: SITE.shortDescription,
    publisher: { "@id": personId },
    about: { "@id": personId },
    mainEntity: { "@id": personId },
    inLanguage: "en-US",
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${SITE.url}/#webpage`,
    url: SITE.url,
    name: SITE.title,
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": personId },
    mainEntity: { "@id": personId },
    inLanguage: "en-US",
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, profilePage],
  };
}
