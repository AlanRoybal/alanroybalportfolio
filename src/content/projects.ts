import type { Project } from "./types";

/**
 * Selected work, written to show the interesting engineering, not to restate
 * the resume. Details are pulled from the real repos.
 */
export const projects: Project[] = [
  {
    id: "earth2echo",
    title: "Earth2Echo",
    tagline:
      "Turns the planet's live signals into real-time generative audio through a multimodal LLM pipeline.",
    badge: "Google Gemini Developer Spotlight",
    status: "Gemini Developer Spotlight",
    stack: ["Python", "FastAPI", "React", "WebSockets", "Gemini", "Multimodal LLM"],
    metrics: [
      { label: "End-to-end latency", value: "<400ms" },
      { label: "Latency cut", value: "−50%" },
      { label: "Recognition", value: "Gemini Spotlight" },
    ],
    features: [
      {
        title: "An agent layer holds the pipeline together",
        body: "Orchestrates tool calls and model state across a multimodal LLM so the stream never stalls mid-generation.",
      },
      {
        title: "WebSocket streaming kept in lock-step",
        body: "Generated media stays synced to the model output, sub-400ms end to end, half the latency I started with.",
      },
      {
        title: "Shipped, then spotlighted",
        body: "Selected for the Google Gemini Developer Spotlight and running in a production generative-audio model.",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/AlanRoybal/earth2echo" },
    ],
    featured: true,
  },
  {
    id: "cotty",
    title: "CoTTY",
    tagline:
      "A real macOS shell you share over a link. Everyone types into the same prompt at once, conflict-free, each with their own cursor.",
    status: "open source · macOS",
    stack: ["Zig", "Swift", "Metal", "CRDT", "PTY", "bore"],
    metrics: [
      { label: "Terminal renderer", value: "60fps Metal" },
      { label: "Shared input", value: "CRDT-merged" },
      { label: "Transport", value: "E2E encrypted" },
    ],
    features: [
      {
        title: "One prompt, many cursors",
        body: "At the shell prompt every participant edits the same command line; keystrokes merge conflict-free via a CRDT and Enter from anyone runs it.",
      },
      {
        title: "Tools run only on the host",
        body: "Claude Code, vim, htop run in a real PTY on the host and stream to every peer, so collaborators never install a thing. Raw/alt-screen modes are auto-detected.",
      },
      {
        title: "GPU terminal + a live editor",
        body: "A from-scratch Metal renderer with a CoreText glyph atlas, plus a built-in /edit editor (RGA CRDT, syntax highlighting, remote cursors) and a bundled encrypted tunnel.",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/AlanRoybal/CoTTY" },
    ],
    featured: true,
  },
  {
    id: "lyria-studio",
    title: "Lyria Studio",
    tagline:
      "A node-graph music IDE for Google's Lyria. Wire prompts, instruments and vocals into a patch, go live, and arrange what you capture.",
    status: "live · open source",
    stack: ["Electron", "React", "TypeScript", "Vite", "Zustand", "XY Flow", "Google GenAI"],
    metrics: [
      { label: "Generation", value: "Lyria Realtime" },
      { label: "Editor", value: "node graph" },
      { label: "Export", value: "WAV" },
    ],
    features: [
      {
        title: "Steer the model with a patch, not a prompt box",
        body: "Prompt, Instrument, Vocals and Output nodes with weighted connections, so you shape the mix instead of retyping prompts.",
      },
      {
        title: "Go live, then capture",
        body: "Stream generation in real time from Google Lyria, then grab instrumentals and vocals straight onto a multi-track timeline.",
      },
      {
        title: "Arrange and export",
        body: "Clip splitting, volume and pitch automation lanes, and mix export to WAV. A focused desktop tool, shipped as an Electron app with tagged releases.",
      },
    ],
    links: [
      { label: "Live demo", href: "https://lyria-studio-web.vercel.app/" },
      { label: "GitHub", href: "https://github.com/AlanRoybal/lyria-studio" },
    ],
    featured: true,
  },
];
