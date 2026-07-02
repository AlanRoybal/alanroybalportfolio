/**
 * Section seams — four unique full-bleed transitions, one per joint, all in
 * the same origami-cliffside style as the side gutters (folded paper facets:
 * a lit face, a shadow face, a crease). Each seam is a recessed paper band
 * with faint ridgelines on a far parallax plane and a folded centerpiece
 * scene on the near plane:
 *
 *   `cores`     — hero → about: faceted peaks on a ridgeline; the signal
 *                 pulse travels the trail between them (the one amber thread
 *                 through the landscape).
 *   `monoliths` — about → experience: terraced mesas, strata stacked like
 *                 pressed paper, their sunlit terrace edges breathing.
 *   `terminal`  — experience → projects: an origami pine grove around a
 *                 folded grey stream, a paper lantern blinking like the
 *                 site's terminal caret.
 *   `planes`    — projects → contact: paper cranes gliding out on amber
 *                 signal trails. The page starts saying goodbye.
 *
 * `prev`/`next` name the adjoining sections' surface colours so the band
 * fades out of one and seals into the other. All decorative; pulses, blinks
 * and trails hide under prefers-reduced-motion (breathing is killed by the
 * global reduced-motion rule).
 */

type Tone = "base" | "tint";
type Variant = "cores" | "monoliths" | "terminal" | "planes";

const TONES: Record<Tone, string> = {
  base: "#f5f1e8", // --bg
  tint: "#efeadd", // --surface-0
};

/* the origami-cliff paper ramp (shared with EdgeDepth) */
const KRAFT_DARK = "#5c4530";
const KRAFT = "#7d5e41";
const TAN = "#a5805a";
const TAN_LIGHT = "#c6a37b";
const SAND = "#dcc6a2";
const GREY = "#b9b5a7";
const GREY_LIGHT = "#d5d1c3";
const AMBER = "#b97d22";
const AMBER_HI = "#e9a23b";
const CREASE = "rgba(46,34,20,0.2)";

// far-plane ridgelines — the horizon behind every seam
const FAR_RIDGES = [
  "M-20 150 L120 92 L230 138 L360 70 L470 126 L610 84 L730 128 L880 76 L1010 122 L1150 88 L1290 130 L1460 96",
  "M-20 196 L160 150 L330 188 L520 140 L700 182 L900 144 L1090 180 L1280 148 L1460 178",
];

const READOUTS: Record<Variant, [string, string]> = {
  cores: ["alt ▸ 2,130 m", "ridge · clear"],
  monoliths: ["strata 04/04", "erosion · slow"],
  terminal: ["grove · 3 pines", "wind ▸ 2 kt"],
  planes: ["migration ▸ south", "sky · open"],
};

/* ------------------------------------------------------------------ */
/* shared mark — the origami pine (three fold tiers, lit/shadow split) */
/* ------------------------------------------------------------------ */

function Pine({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2" y="0" width="4" height="6" fill="#4a3624" />
      <polygon points="-16,0 0,-14 0,0" fill="#7a5a3d" />
      <polygon points="0,-14 16,0 0,0" fill={KRAFT_DARK} />
      <polygon points="-12,-8 0,-20 0,-8" fill="#7a5a3d" />
      <polygon points="0,-20 12,-8 0,-8" fill={KRAFT_DARK} />
      <polygon points="-8,-16 0,-28 0,-16" fill="#7a5a3d" />
      <polygon points="0,-28 8,-16 0,-16" fill={KRAFT_DARK} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* cores — faceted peaks; the signal pulse walks the ridge trail       */
/* ------------------------------------------------------------------ */

function Peak({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="seam-breathe">
      <circle r={w * 1.4} cy={-h * 0.4} fill="url(#seam-halo)" />
      <polygon points={`${-w},0 0,${-h} 0,0`} fill={TAN_LIGHT} stroke={CREASE} strokeWidth="1" />
      <polygon points={`0,${-h} ${w},0 0,0`} fill={TAN} stroke={CREASE} strokeWidth="1" />
      {/* sand cap catching the light */}
      <polygon points={`${-w * 0.28},${-h * 0.72} 0,${-h} ${w * 0.24},${-h * 0.76} 0,${-h * 0.62}`} fill={SAND} />
      {/* alpenglow crease — the one amber facet */}
      <polygon points={`0,${-h} ${w * 0.24},${-h * 0.76} ${w * 0.1},${-h * 0.66}`} fill={AMBER_HI} opacity="0.7" />
    </g>
  );
}

function Cores() {
  return (
    <>
      <g stroke={CREASE} strokeWidth="1">
        <line x1="420" y1="228" x2="720" y2="224" />
        <line x1="720" y1="224" x2="1040" y2="230" />
        <line x1="420" y1="228" x2="190" y2="200" />
        <line x1="1040" y1="230" x2="1270" y2="204" />
      </g>
      <path
        d="M190 200 L420 228 L720 224 L1040 230 L1270 204"
        pathLength={100}
        className="seam-signal"
        stroke={AMBER}
        strokeWidth="1.5"
        fill="none"
      />
      <Peak x={420} y={228} w={72} h={92} />
      <Peak x={720} y={224} w={110} h={138} />
      <Peak x={1040} y={230} w={84} h={104} />
      <Pine x={330} y={230} s={0.7} />
      <Pine x={1122} y={232} s={0.6} />
      <circle cx="190" cy="200" r="2" fill="#6f6c63" opacity="0.8" />
      <circle cx="1270" cy="204" r="2" fill="#6f6c63" opacity="0.8" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* monoliths — terraced mesas, strata pressed like folded paper        */
/* ------------------------------------------------------------------ */

function Mesa({
  x,
  y,
  w,
  h,
  terraces = 2,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  terraces?: number;
}) {
  const side = w * 0.26;
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* front face — a slightly leaning slab of strata */}
      <polygon
        points={`${-w / 2},0 ${-w / 2 + 6},${-h} ${w / 2 + 4},${-h + 8} ${w / 2},0`}
        fill={TAN}
        stroke={CREASE}
        strokeWidth="1"
      />
      {/* shadow side */}
      <polygon
        points={`${w / 2},0 ${w / 2 + 4},${-h + 8} ${w / 2 + 4 + side},${-h + 16} ${w / 2 + side},0`}
        fill={KRAFT}
      />
      {/* sand table top */}
      <polygon
        points={`${-w / 2 + 6},${-h} ${w / 2 + 4},${-h + 8} ${w / 2 + 4 + side},${-h + 16} ${-w / 2 + 6 + side},${-h + 8}`}
        fill={SAND}
      />
      {/* sunlit terrace edges, breathing */}
      <g className="seam-breathe">
        {Array.from({ length: terraces }, (_, i) => (
          <polygon
            key={i}
            points={`${-w * 0.42},${-h * 0.68 + i * h * 0.26} ${w * 0.44},${-h * 0.62 + i * h * 0.26} ${w * 0.44},${-h * 0.57 + i * h * 0.26} ${-w * 0.42},${-h * 0.63 + i * h * 0.26}`}
            fill={AMBER_HI}
            opacity={0.6 - i * 0.16}
          />
        ))}
      </g>
    </g>
  );
}

function MesaCluster({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} 268) scale(${s})`}>
      <ellipse cx="0" cy="4" rx="130" ry="20" fill="url(#seam-halo)" />
      <Mesa x={-62} y={0} w={44} h={64} terraces={2} />
      <Mesa x={4} y={0} w={58} h={108} terraces={3} />
      <Mesa x={72} y={0} w={38} h={46} terraces={1} />
      <Pine x={-104} y={2} s={0.65} />
      <Pine x={116} y={2} s={0.55} />
      <line x1="-130" y1="0" x2="130" y2="0" stroke={CREASE} strokeWidth="1" />
    </g>
  );
}

function Monoliths() {
  return (
    <>
      <MesaCluster x={300} s={0.75} />
      <MesaCluster x={720} s={1.05} />
      <MesaCluster x={1150} s={0.85} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* terminal — a pine grove around a folded stream; a lantern blinks    */
/* ------------------------------------------------------------------ */

function Terminal() {
  return (
    <>
      <g transform="translate(660 226)">
        <ellipse cx="30" cy="34" rx="170" ry="24" fill="url(#seam-halo)" />
        {/* folded ground — two paper shelves */}
        <polygon points="-150,30 -120,4 60,-4 150,18 130,34 -120,38" fill={TAN_LIGHT} stroke={CREASE} strokeWidth="1" />
        <polygon points="-120,4 60,-4 52,-14 -96,-8" fill={SAND} />
        {/* the stream — a grey paper ribbon folding through */}
        <polygon points="-64,32 -30,-6 -12,-6 -40,32" fill={GREY_LIGHT} />
        <polygon points="-40,32 -12,-6 -2,-6 -22,32" fill={GREY} opacity="0.6" />
        {/* the grove */}
        <Pine x={-92} y={6} s={1.25} />
        <Pine x={-116} y={14} s={0.85} />
        <Pine x={26} y={-2} s={1.05} />
        <Pine x={58} y={8} s={1.4} />
        <Pine x={92} y={16} s={0.9} />
        {/* paper lantern — blinks like the site's terminal caret */}
        <g className="seam-blink" transform="translate(-4 -34)">
          <line x1="0" y1="10" x2="0" y2="22" stroke={KRAFT_DARK} strokeWidth="1.5" />
          <polygon points="0,-10 9,0 0,10 -9,0" fill={AMBER_HI} />
          <polygon points="0,-10 9,0 0,0" fill={AMBER} />
        </g>
      </g>
      {/* outlying rises so the band doesn't read empty */}
      <g transform="translate(320 244)">
        <polygon points="-40,16 -14,-24 34,-14 44,16" fill={GREY_LIGHT} stroke={CREASE} strokeWidth="1" />
        <polygon points="-14,-24 34,-14 8,-6" fill={GREY} opacity="0.6" />
        <Pine x={4} y={-20} s={0.7} />
      </g>
      <g transform="translate(1090 240)">
        <polygon points="-44,18 -20,-20 30,-26 48,18" fill={TAN} stroke={CREASE} strokeWidth="1" />
        <polygon points="-20,-20 30,-26 36,-8 -8,-4" fill={TAN_LIGHT} />
        <Pine x={16} y={-22} s={0.8} />
      </g>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* planes — paper cranes gliding out on amber signal trails            */
/* ------------------------------------------------------------------ */

function Crane({
  x,
  y,
  s = 1,
  rot = 0,
}: {
  x: number;
  y: number;
  s?: number;
  rot?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* trail streaming off the tail */}
      <path
        d="M-34 2 C -90 12, -140 -8, -198 4"
        className="seam-drift"
        stroke={AMBER}
        strokeWidth="1.5"
        fill="none"
        opacity="0.55"
      />
      <circle cx="4" cy="0" r="26" fill="url(#seam-halo)" />
      {/* raised wing */}
      <polygon points="-4,-2 12,-34 22,-4" fill={TAN_LIGHT} stroke={CREASE} strokeWidth="1" />
      {/* body fold */}
      <polygon points="-18,2 -2,-6 26,0 4,10" fill={SAND} stroke={CREASE} strokeWidth="1" />
      {/* tail point */}
      <polygon points="-18,2 -36,-8 -6,-5" fill={TAN} />
      {/* neck and head */}
      <polygon points="26,0 44,-14 34,-1" fill={TAN} />
      <polygon points="44,-14 51,-11 44,-8" fill={KRAFT_DARK} />
    </g>
  );
}

function Planes() {
  return (
    <>
      <Crane x={520} y={168} s={1.1} rot={-7} />
      <Crane x={880} y={226} s={0.85} rot={5} />
      <Crane x={1190} y={140} s={0.65} rot={-4} />
    </>
  );
}

/* ------------------------------------------------------------------ */

const CENTERPIECES: Record<Variant, () => React.ReactNode> = {
  cores: Cores,
  monoliths: Monoliths,
  terminal: Terminal,
  planes: Planes,
};

export function SectionSeam({
  variant,
  prev = "base",
  next = "base",
}: {
  variant: Variant;
  prev?: Tone;
  next?: Tone;
}) {
  const Piece = CENTERPIECES[variant];
  const [readL, readR] = READOUTS[variant];
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative -my-px h-[clamp(230px,28vh,340px)] overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${TONES[prev]}, #e0d7c2 38%, #e0d7c2 62%, ${TONES[next]})`,
      }}
    >
      {/* warm ambience pooling in the middle of the break */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(52% 60% at 50% 55%, rgba(185,125,34,0.1), transparent 70%)",
        }}
      />

      {/* far plane — hazy ridgelines, a few stars, mono field notes */}
      <div data-parallax="18" className="absolute -inset-y-10 inset-x-0">
        <svg className="h-full w-full" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMid slice">
          <g stroke={GREY} strokeWidth="1" fill="none" opacity="0.55">
            {FAR_RIDGES.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <g fill="#6f6c63" opacity="0.6">
            <circle cx="260" cy="60" r="1.6" />
            <circle cx="640" cy="44" r="1.4" />
            <circle cx="980" cy="66" r="1.6" />
            <circle cx="1310" cy="50" r="1.4" />
          </g>
          <g fill="#5d5a50" fillOpacity="0.34" fontFamily="ui-monospace,monospace" fontSize="11" letterSpacing="2">
            <text x="384" y="272">{readL}</text>
            <text x="1030" y="292">{readR}</text>
          </g>
        </svg>
      </div>

      {/* near plane — this seam's folded centerpiece */}
      <div data-parallax="8" className="absolute -inset-y-10 inset-x-0">
        <svg className="h-full w-full" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="seam-halo">
              <stop offset="0" stopColor={AMBER} stopOpacity="0.3" />
              <stop offset="1" stopColor={AMBER} stopOpacity="0" />
            </radialGradient>
          </defs>
          <Piece />
        </svg>
      </div>
    </div>
  );
}
