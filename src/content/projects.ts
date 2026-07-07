import type { Project } from "./types";

/**
 * Selected work, written to show the interesting engineering, not to restate
 * the resume. Details and screenshots are pulled from the real repos.
 */
export const projects: Project[] = [
  {
    id: "earth2echo",
    title: "Earth2Echo",
    tagline:
      "Live video in, live soundtrack out. Gemini watches a stream and composes music for it in real time, streamed to everyone in the room.",
    badge: "Google Gemini Developer Spotlight",
    status: "Gemini Developer Spotlight",
    stack: ["Next.js", "FastAPI", "Python", "WebSockets", "Gemini", "Lyria RealTime"],
    metrics: [
      { label: "End-to-end latency", value: "<400ms" },
      { label: "Latency cut", value: "−50%" },
      { label: "Recognition", value: "Gemini Spotlight" },
    ],
    features: [
      {
        title: "The video is the prompt",
        body: "A multimodal pipeline feeds live video frames to Gemini, which continuously describes the scene and steers a generative-music model — the soundtrack shifts as the stream does. A text prompt is optional seasoning, not the input.",
      },
      {
        title: "Live rooms, streamed audio",
        body: "Viewers join live streams through a Discover/Trending/Library UI; generated audio arrives as WebSocket chunks kept in lock-step with the video, sub-400ms end to end — half the latency I started with.",
      },
      {
        title: "Won, then spotlighted",
        body: "Won MLH's Best Use of Gemini API at HackTX 2025, then selected for the Google Gemini Developer Spotlight. Bonus mode: an ambient piano scored by live NOAA space-weather data.",
      },
    ],
    screenshots: [
      {
        src: "/projects/earth2echo-app.jpg",
        alt: "Earth2Echo live stream view: a live video feed with real-time generated audio stats and an optional music prompt box",
        caption: "a live stream scored in real time — audio chunks stream in as Gemini watches the feed",
      },
      {
        src: "/projects/earth2echo-demo.jpg",
        alt: "Demoing Earth2Echo to attendees at an MLH hackathon",
        caption: "demoing live at the hackathon (MLH)",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/emw8105/hacktx-25" },
      { label: "Devpost", href: "https://devpost.com/software/minions-6-7" },
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
    screenshots: [
      {
        src: "/projects/cotty-terminal.png",
        alt: "CoTTY's Metal-rendered terminal running a shared shell session",
        caption: "the from-scratch Metal terminal",
      },
      {
        src: "/projects/cotty-session.png",
        alt: "A shared CoTTY session with multiple participants' colored cursors on one command line",
        caption: "one command line, per-user colored cursors",
      },
    ],
    links: [{ label: "GitHub", href: "https://github.com/AlanRoybal/CoTTY" }],
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
        body: "Clip splitting, volume and pitch automation lanes, and mix export to WAV. A focused desktop tool, shipped as an Electron app with tagged releases for macOS, Windows and Linux.",
      },
    ],
    screenshots: [
      {
        src: "/projects/lyria-canvas.png",
        alt: "Lyria Studio's node-graph canvas: prompt, instrument and vocals nodes wired into an output node above a multi-track timeline",
        caption: "the patch canvas — weighted nodes into an output, timeline below",
      },
      {
        src: "/projects/lyria-timeline.png",
        alt: "Lyria Studio's timeline with captured clips and automation controls",
        caption: "captured takes arranged on the timeline",
      },
    ],
    links: [
      { label: "Live demo", href: "https://lyria-studio-web.vercel.app/" },
      { label: "GitHub", href: "https://github.com/AlanRoybal/lyria-studio" },
    ],
    featured: true,
  },
  {
    id: "autopsy",
    title: "Autopsy",
    tagline:
      "Forensic memory for AI coding agents. A blackbox recorder that turns every failure into a guardrail, so the next run doesn't make the same mistake.",
    badge: "2nd overall · LA Hacks 2026",
    status: "2nd overall + Cognition Challenge @ LA Hacks 2026",
    stack: ["Python", "FastAPI", "Postgres", "pgvector", "Next.js", "opencode"],
    metrics: [
      { label: "Placement", value: "2nd overall" },
      { label: "Preflight", value: "ANN + 3-hop graph" },
      { label: "Install", value: "one command" },
    ],
    features: [
      {
        title: "Record every failure",
        body: "A plugin wraps the opencode runtime and records every tool call, edit, rejection and postflight check, classifying failures into a graph in Postgres + pgvector.",
      },
      {
        title: "Warn before it happens again",
        body: "Before a new task runs, its text is embedded and matched against the failure graph — ANN search plus a 3-hop traversal — injecting a system addendum and, when warranted, hard-blocking tool calls.",
      },
      {
        title: "One command, zero config",
        body: "curl | bash brings up the whole stack: Postgres, the FastAPI service, and a Next.js dashboard for exploring the failure graph. Won 2nd overall and the Cognition Company Challenge at LA Hacks 2026.",
      },
    ],
    screenshots: [
      {
        src: "/projects/autopsy-graph.jpg",
        alt: "Autopsy's dashboard showing the failure graph: classified failure nodes connected by edges, with filters",
        caption: "the failure graph — every recorded mistake, classified and connected",
      },
      {
        src: "/projects/autopsy-timeline.jpg",
        alt: "Autopsy's timeline view comparing agent runs side by side",
        caption: "run timelines, side by side",
      },
    ],
    links: [
      { label: "Site", href: "https://autopsy.surf" },
      { label: "GitHub", href: "https://github.com/balebbae/autopsy" },
      { label: "Devpost", href: "https://devpost.com/software/autopsy-zq5d84" },
    ],
    featured: true,
  },
  {
    id: "vibecloud",
    title: "VibeCloud",
    tagline:
      "Sketch an AWS architecture on a shared whiteboard, vote, and Claude redraws it as a typed infra graph — vote again and it deploys.",
    badge: "Best Use of AWS · Hook 'Em Hacks",
    status: "Best Use of AWS @ Hook 'Em Hacks",
    stack: ["React", "Vite", "Fastify", "Hocuspocus", "Claude", "AWS CDK", "LocalStack"],
    metrics: [
      { label: "Award", value: "Best Use of AWS" },
      { label: "Sketch → graph", value: "Claude vision" },
      { label: "Deploy", value: "CDK, one vote" },
    ],
    features: [
      {
        title: "Whiteboard first, types later",
        body: "Phase 1 is a freeform collaborative whiteboard. When 80% of the room votes, Claude vision reconstructs the sketch into a typed node graph of real AWS resources.",
      },
      {
        title: "An agent in the room",
        body: "Phase 2 pairs the graph with a shared chat where the agent critiques the architecture and edits the graph directly via tool-use, live in front of everyone.",
      },
      {
        title: "Vote to ship",
        body: "A second 80% vote compiles the graph with AWS CDK and deploys it to LocalStack. Won Best Use of AWS at Hook 'Em Hacks (UT Austin).",
      },
    ],
    screenshots: [
      {
        src: "/projects/vibecloud-graph.jpg",
        alt: "VibeCloud Phase 2: a typed AWS architecture node graph beside the architect agent chat",
        caption: "the sketch, reconstructed as a typed AWS graph — agent chat alongside",
      },
      {
        src: "/projects/vibecloud-landing.jpg",
        alt: "VibeCloud landing page: design cloud systems together",
        caption: "design cloud systems together",
      },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/anishalle/hookemhacks26" },
      { label: "Devpost", href: "https://devpost.com/software/vibe-cloud" },
    ],
    featured: true,
  },
  {
    id: "openscreen-studio",
    title: "OpenScreen Studio",
    tagline:
      "A free, open-source screen recorder and editor for polished product demos — Screen-Studio-style auto-zoom, a re-rendered cursor, and on-device AI voice cleanup.",
    status: "open source · macOS (Apple Silicon)",
    stack: ["TypeScript", "Electron", "React", "PixiJS", "ScreenCaptureKit", "VideoToolbox", "Whisper", "DeepFilterNet"],
    metrics: [
      { label: "Voice cleanup", value: "~37dB, 25× realtime" },
      { label: "Export", value: "60fps HEVC" },
      { label: "Cloud calls", value: "zero" },
    ],
    features: [
      {
        title: "The cursor is data, not pixels",
        body: "Recording captures the screen and a separate high-frequency cursor/click telemetry stream. Because the cursor is never baked in, zooms are generated from your clicks after the fact and a smoothed synthetic cursor is re-rendered at export.",
      },
      {
        title: "An editor that starts working before you do",
        body: "Open a recording and zoom regions are already suggested at each click position, with cinematic easing. Trim, crop, per-segment speed, backgrounds, motion blur — every effect stays editable until export.",
      },
      {
        title: "Studio in a box, all on-device",
        body: "DeepFilterNet voice enhancement (~37dB noise reduction at 25× realtime), on-device Whisper captions in 13 languages, one-click silence and filler-word removal, and hardware HEVC/H.264 export via VideoToolbox. No accounts, no uploads, no telemetry.",
      },
    ],
    screenshots: [
      {
        src: "/projects/openscreen-editor.png",
        alt: "OpenScreen Studio editor with auto-suggested zoom regions on the timeline at each click position",
        caption: "zoom regions auto-suggested at the exact clicks from the recording",
      },
      {
        src: "/projects/openscreen-export.png",
        alt: "OpenScreen Studio export panel with H.264/HEVC codec selection and the Studio Sound toggle",
        caption: "hardware-encoded export with Studio Sound voice cleanup",
      },
    ],
    links: [{ label: "GitHub", href: "https://github.com/AlanRoybal/openscreen-studio" }],
    featured: true,
  },
  {
    id: "flowlocal",
    title: "FlowLocal",
    tagline:
      "Hold a key, speak, and cleaned-up text appears wherever your cursor is — in any app. Wispr Flow, rebuilt to run entirely on your Mac.",
    status: "open source · macOS 14+",
    stack: ["Swift 6", "WhisperKit", "Ollama", "AVAudioEngine", "Accessibility API", "SwiftUI"],
    metrics: [
      { label: "Speech-to-text", value: "on-device ANE" },
      { label: "Cloud traffic", value: "zero" },
      { label: "Works in", value: "any app" },
    ],
    features: [
      {
        title: "Push-to-talk, streaming as you speak",
        body: "Hold Right ⌥ and a floating HUD shows the partial transcript live — WhisperKit runs on the Apple Neural Engine, so nothing leaves the machine and audio is never written to disk.",
      },
      {
        title: "An LLM tidies what you said",
        body: "On release, a local Ollama model strips fillers and fixes grammar, punctuation and tone at four intensity levels — from raw passthrough to full polish. The only network traffic is to localhost.",
      },
      {
        title: "Types into whatever is focused",
        body: "The cleaned text lands at your cursor via the Accessibility API (clipboard-paste fallback), with voice commands ('scratch that', 'new line'), custom vocabulary and per-app formatting.",
      },
    ],
    screenshots: [
      {
        src: "/projects/flowlocal-menu.png",
        alt: "FlowLocal's menu bar dropdown showing dictation status and settings",
        caption: "lives in the menu bar — hold a key anywhere to dictate",
      },
    ],
    links: [{ label: "GitHub", href: "https://github.com/AlanRoybal/FlowLocal" }],
    featured: true,
  },
  {
    id: "neurolytics",
    title: "Neurolytics",
    tagline:
      "Upload a brain MRI, get an AI diagnostic read in seconds, then interrogate it in plain English — grounded in the scan, not vibes.",
    badge: "2nd place overall · HackDartmouth 2025",
    status: "2nd place @ HackDartmouth 2025",
    stack: ["Next.js", "Gemini Vision", "AWS S3", "TypeScript"],
    metrics: [
      { label: "Placement", value: "2nd overall" },
      { label: "Analysis", value: "seconds" },
      { label: "Interface", value: "one page" },
    ],
    features: [
      {
        title: "MRI in, structured read out",
        body: "Upload any T1/T2 slice and Gemini Vision returns a diagnostic summary — tumor type, grey-matter loss, abnormalities — in seconds instead of a radiology queue.",
      },
      {
        title: "Chat grounded in the scan",
        body: "Follow-up questions are answered against the structured JSON context from the analysis, so the model talks about this scan, not brain MRIs in general.",
      },
      {
        title: "Every run archived",
        body: "Each analysis is persisted to S3 and surfaced in a History tab — built, demoed and placed 2nd overall in one weekend at Dartmouth.",
      },
    ],
    screenshots: [
      {
        src: "/projects/neurolytics-landing.png",
        alt: "Neurolytics landing page with brain MRI upload",
        caption: "upload a slice, get a read",
      },
      {
        src: "/projects/neurolytics-chat.png",
        alt: "Neurolytics chat view answering follow-up questions about an analyzed MRI scan",
        caption: "follow-up Q&A grounded in the analysis",
      },
    ],
    links: [{ label: "GitHub", href: "https://github.com/AlanRoybal/HackDartmouth2025" }],
    featured: false,
  },
];
