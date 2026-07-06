/**
 * Content model for the portfolio. The content layer is typed data, not markup,
 * so the resume stays a single source of truth.
 */

/** A headline metric shown prominently in a project's detail view. */
export interface Metric {
  label: string;
  value: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  /** Marks links we still need real URLs for (GitHub repo, live demo). */
  todo?: boolean;
}

/** A real product screenshot, served from /public/projects. */
export interface Screenshot {
  src: string;
  alt: string;
  /** Short caption shown under the image in the expanded terminal view. */
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  /** One-line hook: the interesting angle, not a resume bullet. */
  tagline: string;
  /** Optional accolade, e.g. "Google Gemini Developer Spotlight". */
  badge?: string;
  /** Short status shown in the terminal spec card, e.g. "live · open source". */
  status?: string;
  stack: string[];
  /** Headline metrics (big amber values on the overview panel). */
  metrics: Metric[];
  /** "How it works" highlights for the showcase panel. */
  features: { title: string; body: string }[];
  /** Real app screenshots; the first one fronts the showcase card. */
  screenshots?: Screenshot[];
  links: ProjectLink[];
  featured: boolean;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  /** Employment type, e.g. "Internship", "Full-time". */
  type: string;
  start: string;
  end: string;
  /** 1-2 sentence summary (the card body). */
  summary: string;
  /** Headline metric shown large on the right, e.g. "5M+". */
  metric: string;
  /** Small label under the metric, e.g. "records/day". */
  metricLabel: string;
  stack?: string[];
}

/** A skill cluster. */
export interface SkillGroup {
  id: string;
  title: string;
  items: string[];
}

export interface Education {
  school: string;
  degree: string;
  graduation: string;
  gpa: string;
  coursework: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}

export interface Profile {
  name: string;
  /** Role line for the hero. */
  title: string;
  /** Short positioning statement. */
  blurb: string;
  location: string;
  email: string;
  phone: string;
  socials: SocialLink[];
  resumeHref: string;
}
