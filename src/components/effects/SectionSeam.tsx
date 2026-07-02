/**
 * Section seams — four unique full-bleed transitions, one per joint, all in
 * the same origami-cliffside style as the side gutters, rendered to read as
 * REAL folded paper: crumple relief (feTurbulence → feDiffuseLighting
 * multiplied over the fills), ragged accordion strata with seeded jitter
 * (never a straight rule), crease highlights with shadow tucked under each
 * lip, and a soft warm cast shadow dropping every piece onto the band.
 *
 *   `cores`     — hero → about: crumpled peaks on a ridgeline; the signal
 *                 pulse travels the trail between them (the one amber
 *                 thread through the landscape).
 *   `monoliths` — about → experience: terraced mesas of pleated strata,
 *                 their sunlit terrace edges breathing.
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
const CREASE_HI = "rgba(255,252,240,0.4)";
const CREASE_LO = "rgba(46,30,14,0.3)";

const TAN_RAMP = {
  crest: ["#dcc6a2", "#d7bf98", "#e3cfae"],
  valley: ["#a5805a", "#9b7752", "#b08a62"],
  deep: ["#7d5e41", "#6f5238"],
};
const GREY_RAMP = {
  crest: ["#d5d1c3", "#dcd8cb", "#cfcaba"],
  valley: ["#b9b5a7", "#b1ac9d"],
  deep: ["#9c9789", "#948f81"],
};
type Ramp = typeof TAN_RAMP;

/* deterministic PRNG — same jitter on server and client render */
const mkRng = (seed: number) => {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const foldEdge = (
  r: () => number,
  x0: number,
  x1: number,
  y: number,
  amp: number,
): [number, number][] => {
  const pts: [number, number][] = [];
  for (let x = x0; ; x += 16 + r() * 12) {
    const last = x >= x1;
    const xx = last ? x1 + (r() - 0.5) * 5 : x + (r() - 0.5) * 4;
    pts.push([
      Math.round(xx * 10) / 10,
      Math.round((y + (r() - 0.5) * 2 * amp) * 10) / 10,
    ]);
    if (last) break;
  }
  return pts;
};

const toPoints = (pts: [number, number][]) => pts.map((p) => p.join(",")).join(" ");

/** Pleated strata block — ragged bands over a fold-shadow base. */
function Strata({
  seed,
  x0,
  x1,
  y0,
  y1,
  ramp,
}: {
  seed: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  ramp: Ramp;
}) {
  const r = mkRng(seed);
  const n = Math.max(4, Math.round((y1 - y0) / 13));
  const bh = (y1 - y0) / n;
  const bands: React.ReactNode[] = [
    <polygon
      key="base"
      points={toPoints([[x0 - 2, y0 + 3], [x1 + 2, y0 + 3], [x1 + 3, y1], [x0 - 3, y1]])}
      fill={ramp.deep[0]}
    />,
  ];
  let prev = foldEdge(r, x0, x1, y0, 4);
  for (let i = 0; i < n; i++) {
    const next = foldEdge(r, x0, x1, y0 + (i + 1) * bh, 4);
    const pool = i % 4 === 3 ? ramp.deep : i % 2 ? ramp.valley : ramp.crest;
    bands.push(
      <polygon
        key={i}
        points={toPoints([...prev, ...[...next].reverse()])}
        fill={pool[(r() * pool.length) | 0]}
      />,
    );
    if (i % 2 === 0) {
      bands.push(
        <polyline key={`h${i}`} points={toPoints(prev)} fill="none" stroke={CREASE_HI} strokeWidth="0.8" />,
        <polyline
          key={`s${i}`}
          points={toPoints(next.map(([x, y]) => [x, y - 1.2] as [number, number]))}
          fill="none"
          stroke={CREASE_LO}
          strokeWidth="1"
        />,
      );
    }
    prev = next;
  }
  return <>{bands}</>;
}

/** The origami pine — jittered fold tiers with a lit/shadow split. */
function Pine({ seed, x, y, s = 1 }: { seed: number; x: number; y: number; s?: number }) {
  const r = mkRng(seed);
  const tiers: React.ReactNode[] = [];
  for (let i = 0; i < 3; i++) {
    const w = 16 - i * 4 + (r() - 0.5) * 2;
    const yb = -i * 7 + (r() - 0.5) * 1.5;
    const yt = yb - 14 + (r() - 0.5) * 2;
    const lean = (r() - 0.5) * 2.4;
    tiers.push(
      <polygon key={`l${i}`} points={`${-w},${yb} ${lean},${yt} ${lean},${yb}`} fill="#7a5a3d" />,
      <polygon key={`r${i}`} points={`${lean},${yt} ${w},${yb} ${lean},${yb}`} fill="#4e3a27" />,
      <polyline
        key={`c${i}`}
        points={`${lean},${yt} ${lean},${yb}`}
        stroke={CREASE_HI}
        strokeWidth="0.7"
        fill="none"
      />,
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2" y="0" width="4" height="6" fill="#43301f" />
      {tiers}
    </g>
  );
}

/** Crumple + shadow filter defs, id-scoped per seam variant. */
function PaperDefs({ uid, seed, scale }: { uid: string; seed: number; scale: number }) {
  return (
    <defs>
      <filter id={`cr-${uid}`} x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.014 0.026" numOctaves={4} seed={seed} result="n" />
        <feDiffuseLighting in="n" lightingColor="#ffffff" surfaceScale={scale} diffuseConstant={1.05} result="l">
          <feDistantLight azimuth={235} elevation={55} />
        </feDiffuseLighting>
        <feComposite in="l" in2="SourceGraphic" operator="arithmetic" k1={1} k2={0} k3={0} k4={0} />
        <feComposite in2="SourceAlpha" operator="in" />
      </filter>
      <filter id={`ds-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx={3} dy={7} stdDeviation={5} floodColor="#3f2f1c" floodOpacity={0.3} />
      </filter>
      <radialGradient id={`halo-${uid}`}>
        <stop offset="0" stopColor={AMBER} stopOpacity="0.3" />
        <stop offset="1" stopColor={AMBER} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/** A crumpled paper piece: cast shadow outside, crumple relief inside. */
function Paper({ uid, children }: { uid: string; children: React.ReactNode }) {
  return (
    <g filter={`url(#ds-${uid})`}>
      <g filter={`url(#cr-${uid})`}>{children}</g>
    </g>
  );
}

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
/* cores — crumpled peaks; the signal pulse walks the ridge trail      */
/* ------------------------------------------------------------------ */

function Peak({
  uid,
  seed,
  x,
  y,
  w,
  h,
}: {
  uid: string;
  seed: number;
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  const r = mkRng(seed);
  // ragged base and a slightly off-centre summit
  const apex: [number, number] = [(r() - 0.5) * w * 0.16, -h];
  const base = foldEdge(r, -w, w, 0, 3);
  // triangulated facets fanning from the summit, lit left → shadowed right
  const fills = [TAN_LIGHT, SAND, TAN, KRAFT, KRAFT_DARK];
  const step = Math.max(1, Math.floor(base.length / 4));
  const corners: [number, number][] = [];
  for (let i = 0; i < base.length; i += step) corners.push(base[i]);
  if (corners[corners.length - 1] !== base[base.length - 1]) corners.push(base[base.length - 1]);
  return (
    <g transform={`translate(${x} ${y})`} className="seam-breathe">
      <circle r={w * 1.4} cy={-h * 0.4} fill={`url(#halo-${uid})`} />
      <Paper uid={uid}>
        {corners.slice(0, -1).map((c, i) => (
          <polygon
            key={i}
            points={toPoints([apex, c, corners[i + 1]])}
            fill={fills[Math.min(i, fills.length - 1)]}
          />
        ))}
        {/* crease ridges radiating from the summit */}
        {corners.slice(1, -1).map((c, i) => (
          <polyline
            key={`c${i}`}
            points={toPoints([apex, c])}
            fill="none"
            stroke={i < 2 ? CREASE_HI : CREASE_LO}
            strokeWidth="0.9"
          />
        ))}
        {/* ragged sand cap catching the light */}
        <polygon
          points={toPoints([
            apex,
            [apex[0] + w * 0.22, -h * 0.74],
            [apex[0] + w * 0.08, -h * 0.68],
            [apex[0] - w * 0.1, -h * 0.72],
            [apex[0] - w * 0.24, -h * 0.7],
          ])}
          fill={SAND}
        />
        {/* alpenglow crease — the one amber facet */}
        <polygon
          points={toPoints([apex, [apex[0] + w * 0.22, -h * 0.74], [apex[0] + w * 0.09, -h * 0.66]])}
          fill={AMBER_HI}
          opacity="0.7"
        />
      </Paper>
    </g>
  );
}

function Cores({ uid }: { uid: string }) {
  return (
    <>
      <path
        d="M190 200 L420 228 L720 224 L1040 230 L1270 204"
        stroke={CREASE_LO}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M190 200 L420 228 L720 224 L1040 230 L1270 204"
        pathLength={100}
        className="seam-signal"
        stroke={AMBER}
        strokeWidth="1.5"
        fill="none"
      />
      <Peak uid={uid} seed={101} x={420} y={228} w={72} h={92} />
      <Peak uid={uid} seed={102} x={720} y={224} w={110} h={138} />
      <Peak uid={uid} seed={103} x={1040} y={230} w={84} h={104} />
      <Paper uid={uid}>
        <Pine seed={104} x={330} y={230} s={0.7} />
        <Pine seed={105} x={1122} y={232} s={0.6} />
      </Paper>
      <circle cx="190" cy="200" r="2" fill="#6f6c63" opacity="0.8" />
      <circle cx="1270" cy="204" r="2" fill="#6f6c63" opacity="0.8" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* monoliths — terraced mesas of pleated strata                        */
/* ------------------------------------------------------------------ */

function Mesa({
  uid,
  seed,
  x,
  w,
  h,
  terraces = 2,
}: {
  uid: string;
  seed: number;
  x: number;
  w: number;
  h: number;
  terraces?: number;
}) {
  const side = w * 0.26;
  return (
    <g transform={`translate(${x} 0)`}>
      <Paper uid={uid}>
        {/* pleated front face */}
        <Strata seed={seed} x0={-w / 2} x1={w / 2} y0={-h} y1={0} ramp={TAN_RAMP} />
        {/* shadow side */}
        <polygon
          points={toPoints([
            [w / 2, 0],
            [w / 2 + 3, -h + 6],
            [w / 2 + 3 + side, -h + 13],
            [w / 2 + side, 0],
          ])}
          fill={KRAFT}
        />
        {/* sand table top */}
        <polygon
          points={toPoints([
            [-w / 2 + 4, -h],
            [w / 2 + 3, -h + 6],
            [w / 2 + 3 + side, -h + 13],
            [-w / 2 + 4 + side, -h + 7],
          ])}
          fill={SAND}
        />
      </Paper>
      {/* thin sunlit terrace lips, breathing */}
      <g className="seam-breathe">
        {Array.from({ length: terraces }, (_, i) => (
          <polygon
            key={i}
            points={toPoints([
              [-w * 0.42, -h * 0.68 + i * h * 0.26],
              [w * 0.44, -h * 0.62 + i * h * 0.26],
              [w * 0.44, -h * 0.605 + i * h * 0.26],
              [-w * 0.42, -h * 0.665 + i * h * 0.26],
            ])}
            fill={AMBER_HI}
            opacity={0.4 - i * 0.11}
          />
        ))}
      </g>
    </g>
  );
}

function MesaCluster({ uid, seed, x, s = 1 }: { uid: string; seed: number; x: number; s?: number }) {
  return (
    <g transform={`translate(${x} 268) scale(${s})`}>
      <ellipse cx="0" cy="4" rx="130" ry="20" fill={`url(#halo-${uid})`} />
      <Mesa uid={uid} seed={seed} x={-62} w={44} h={64} terraces={2} />
      <Mesa uid={uid} seed={seed + 1} x={4} w={58} h={108} terraces={3} />
      <Mesa uid={uid} seed={seed + 2} x={72} w={38} h={46} terraces={1} />
      <Paper uid={uid}>
        <Pine seed={seed + 3} x={-104} y={2} s={0.65} />
        <Pine seed={seed + 4} x={116} y={2} s={0.55} />
      </Paper>
      <line x1="-130" y1="0" x2="130" y2="0" stroke={CREASE_LO} strokeWidth="1" />
    </g>
  );
}

function Monoliths({ uid }: { uid: string }) {
  return (
    <>
      <MesaCluster uid={uid} seed={201} x={300} s={0.75} />
      <MesaCluster uid={uid} seed={211} x={720} s={1.05} />
      <MesaCluster uid={uid} seed={221} x={1150} s={0.85} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* terminal — a pine grove around a folded stream; a lantern blinks    */
/* ------------------------------------------------------------------ */

function Terminal({ uid }: { uid: string }) {
  return (
    <>
      <g transform="translate(660 226)">
        <ellipse cx="30" cy="34" rx="170" ry="24" fill={`url(#halo-${uid})`} />
        <Paper uid={uid}>
          {/* folded ground — two paper shelves */}
          <polygon points="-150,30 -120,4 60,-4 150,18 130,34 -120,38" fill={TAN_LIGHT} />
          <polygon points="-120,4 60,-4 52,-14 -96,-8" fill={SAND} />
          <polyline points="-120,4 60,-4" fill="none" stroke={CREASE_HI} strokeWidth="0.8" />
          {/* the stream — a grey paper ribbon folding through */}
          <polygon points="-64,32 -30,-6 -12,-6 -40,32" fill={GREY_LIGHT} />
          <polygon points="-40,32 -12,-6 -2,-6 -22,32" fill={GREY} opacity="0.6" />
          {/* the grove */}
          <Pine seed={301} x={-92} y={6} s={1.25} />
          <Pine seed={302} x={-116} y={14} s={0.85} />
          <Pine seed={303} x={26} y={-2} s={1.05} />
          <Pine seed={304} x={58} y={8} s={1.4} />
          <Pine seed={305} x={92} y={16} s={0.9} />
        </Paper>
        {/* paper lantern hanging off the tall pine, blinking like the caret */}
        <g className="seam-blink" transform="translate(34 -14)">
          <path d="M0,14 C 2,8 6,4 12,2" fill="none" stroke={KRAFT_DARK} strokeWidth="1.2" />
          <polygon points="0,6 7,14 0,22 -7,14" fill={AMBER_HI} />
          <polygon points="0,6 7,14 0,14" fill={AMBER} />
          <circle cx="0" cy="14" r="12" fill={`url(#halo-terminal)`} />
        </g>
      </g>
      {/* outlying rises so the band doesn't read empty */}
      <g transform="translate(320 244)">
        <Paper uid={uid}>
          <Strata seed={311} x0={-42} x1={44} y0={-26} y1={16} ramp={GREY_RAMP} />
          <Pine seed={312} x={4} y={-24} s={0.7} />
        </Paper>
      </g>
      <g transform="translate(1090 240)">
        <Paper uid={uid}>
          <Strata seed={321} x0={-46} x1={48} y0={-28} y1={18} ramp={TAN_RAMP} />
          <Pine seed={322} x={16} y={-26} s={0.8} />
        </Paper>
      </g>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* planes — paper cranes gliding out on amber signal trails            */
/* ------------------------------------------------------------------ */

function Crane({
  uid,
  x,
  y,
  s = 1,
  rot = 0,
}: {
  uid: string;
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
      <circle cx="4" cy="0" r="26" fill={`url(#halo-${uid})`} />
      <Paper uid={uid}>
        {/* raised wing, lit face and shadow fold */}
        <polygon points="-4,-2 12,-34 22,-4" fill={SAND} />
        <polygon points="12,-34 22,-4 14,-8" fill={TAN_LIGHT} />
        {/* body fold */}
        <polygon points="-18,2 -2,-6 26,0 4,10" fill="#e9dcbd" />
        <polygon points="-2,-6 26,0 4,10" fill={SAND} />
        {/* tail point */}
        <polygon points="-18,2 -36,-8 -6,-5" fill={TAN} />
        {/* neck and head */}
        <polygon points="26,0 44,-14 34,-1" fill={TAN} />
        <polygon points="44,-14 51,-11 44,-8" fill={KRAFT_DARK} />
        {/* wing crease */}
        <polyline points="-4,-2 12,-34" fill="none" stroke={CREASE_HI} strokeWidth="0.8" />
        <polyline points="-2,-6 4,10" fill="none" stroke={CREASE_LO} strokeWidth="0.8" />
      </Paper>
    </g>
  );
}

function Planes({ uid }: { uid: string }) {
  return (
    <>
      <Crane uid={uid} x={520} y={168} s={1.1} rot={-7} />
      <Crane uid={uid} x={880} y={226} s={0.85} rot={5} />
      <Crane uid={uid} x={1190} y={140} s={0.65} rot={-4} />
    </>
  );
}

/* ------------------------------------------------------------------ */

const CENTERPIECES: Record<Variant, (props: { uid: string }) => React.ReactNode> = {
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

      {/* near plane — this seam's folded-paper centerpiece */}
      <div data-parallax="8" className="absolute -inset-y-10 inset-x-0">
        <svg className="h-full w-full" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMid slice">
          <PaperDefs uid={variant} seed={7} scale={2.6} />
          <Piece uid={variant} />
        </svg>
      </div>
    </div>
  );
}
