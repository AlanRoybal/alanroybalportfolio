/**
 * Section seams — four unique full-bleed transitions, one per joint, all in
 * the same low-poly faceted style but built from the site's own world (no
 * borrowed imagery). Each seam is a deep-ink band with the constellation on
 * a far parallax plane and a faceted centerpiece cluster on the near plane:
 *
 *   `cores`     — hero → about: the signal made solid. Three faceted neural
 *                 cores with glowing amber hearts, linked; a pulse fires
 *                 along the link route.
 *   `monoliths` — about → experience: production systems. Angular server
 *                 monoliths with amber status windows, breathing.
 *   `terminal`  — experience → projects: an extruded prompt chevron and a
 *                 blinking amber cursor block, foreshadowing the spec cards.
 *   `planes`    — projects → contact: folded ink darts gliding out on amber
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

// far-plane constellation — the connective tissue behind every seam
const FAR_NODES: [number, number][] = [
  [140, 150], [300, 70], [480, 140], [640, 60], [820, 120], [1000, 50],
  [1180, 110], [1340, 60],
];
const FAR_LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
];

const READOUTS: Record<Variant, [string, string]> = {
  cores: ["sig ▸ 0.97", "link · stable"],
  monoliths: ["uptime 99.98", "load · nominal"],
  terminal: ["zsh · 3 jobs", "tty ▸ live"],
  planes: ["ack ▸ sent", "inbox · open"],
};

const EDGE = "rgba(28,24,16,0.16)";

/* ------------------------------------------------------------------ */
/* cores — faceted neural polyhedra with amber hearts                  */
/* ------------------------------------------------------------------ */

function Core({ x, y, r }: { x: number; y: number; r: number }) {
  const h = 0.866 * r;
  return (
    <g transform={`translate(${x} ${y})`} className="seam-breathe">
      <circle r={r * 2.1} fill="url(#seam-halo)" />
      <polygon
        points={`0,${-r} ${h},${-r / 2} ${h},${r / 2} 0,${r} ${-h},${r / 2} ${-h},${-r / 2}`}
        fill="#e5decb"
        stroke={EDGE}
        strokeWidth="1"
      />
      <polygon points={`0,${-r} ${h},${-r / 2} 0,0`} fill="#ede8da" />
      <polygon points={`0,${-r} ${-h},${-r / 2} 0,0`} fill="#dcd3bd" />
      <polygon points={`${h},${r / 2} 0,${r} 0,0`} fill="#d7ceb7" />
      <polygon
        points={`0,${-0.45 * r} ${0.4 * r},${0.25 * r} ${-0.4 * r},${0.25 * r}`}
        fill="#b97d22"
        opacity="0.9"
      />
      <polygon
        points={`0,${-0.45 * r} ${0.4 * r},${0.25 * r} 0,${0.35 * r}`}
        fill="#e9a23b"
        opacity="0.5"
      />
    </g>
  );
}

function Cores() {
  return (
    <>
      <g stroke="#b5a888" strokeWidth="1">
        <line x1="420" y1="212" x2="720" y2="182" />
        <line x1="720" y1="182" x2="1040" y2="216" />
        <line x1="420" y1="212" x2="190" y2="150" />
        <line x1="1040" y1="216" x2="1270" y2="160" />
      </g>
      <path
        d="M190 150 L420 212 L720 182 L1040 216 L1270 160"
        pathLength={100}
        className="seam-signal"
        stroke="#b97d22"
        strokeWidth="1.5"
        fill="none"
      />
      <Core x={420} y={212} r={26} />
      <Core x={720} y={182} r={40} />
      <Core x={1040} y={216} r={30} />
      <circle cx="190" cy="150" r="2" fill="#6f6c63" opacity="0.8" />
      <circle cx="1270" cy="160" r="2" fill="#6f6c63" opacity="0.8" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* monoliths — angular server slabs with amber status windows          */
/* ------------------------------------------------------------------ */

function Slab({
  x,
  y,
  w,
  h,
  windows = 2,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  windows?: number;
}) {
  const lean = w * 0.18;
  const side = w * 0.28;
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* front face, leaning slightly like a cut slab */}
      <polygon
        points={`${-w / 2},0 ${-w / 2 + lean},${-h} ${w / 2 + lean},${-h + w * 0.2} ${w / 2},0`}
        fill="#e5decb"
        stroke={EDGE}
        strokeWidth="1"
      />
      {/* side face */}
      <polygon
        points={`${w / 2},0 ${w / 2 + lean},${-h + w * 0.2} ${w / 2 + lean + side},${-h + w * 0.34} ${w / 2 + side},0`}
        fill="#d3c9b1"
      />
      {/* top facet */}
      <polygon
        points={`${-w / 2 + lean},${-h} ${w / 2 + lean},${-h + w * 0.2} ${w / 2 + lean + side},${-h + w * 0.34} ${-w / 2 + lean + side},${-h + w * 0.14}`}
        fill="#f5f2e9"
      />
      {/* amber status windows */}
      <g className="seam-breathe">
        {Array.from({ length: windows }, (_, i) => (
          <polygon
            key={i}
            points={`${-w * 0.22},${-h * 0.72 + i * h * 0.22} ${w * 0.26},${-h * 0.66 + i * h * 0.22} ${w * 0.26},${-h * 0.6 + i * h * 0.22} ${-w * 0.22},${-h * 0.66 + i * h * 0.22}`}
            fill="#b97d22"
            opacity={0.75 - i * 0.2}
          />
        ))}
      </g>
    </g>
  );
}

function MonolithCluster({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} 268) scale(${s})`}>
      <ellipse cx="0" cy="4" rx="130" ry="20" fill="url(#seam-halo)" />
      <Slab x={-58} y={0} w={34} h={78} windows={2} />
      <Slab x={0} y={0} w={44} h={128} windows={3} />
      <Slab x={62} y={0} w={30} h={58} windows={1} />
      <line x1="-120" y1="0" x2="120" y2="0" stroke="#c8bda2" strokeWidth="1" />
    </g>
  );
}

function Monoliths() {
  return (
    <>
      <MonolithCluster x={300} s={0.75} />
      <MonolithCluster x={720} s={1.05} />
      <MonolithCluster x={1150} s={0.85} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* terminal — extruded prompt chevron + blinking amber cursor block    */
/* ------------------------------------------------------------------ */

function Keycap({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="8" cy="30" rx="70" ry="14" fill="url(#seam-halo)" />
      <polygon points="-28,-20 36,-20 46,-30 -18,-30" fill="#f5f2e9" />
      <polygon points="36,-20 46,-30 46,16 36,26" fill="#d7ceb7" />
      <polygon points="-28,-20 36,-20 36,26 -28,26" fill="#e5decb" stroke={EDGE} strokeWidth="1" />
      <polygon points="-10,-2 18,-2 18,8 -10,8" fill="#8a5c14" opacity="0.5" />
    </g>
  );
}

function Terminal() {
  return (
    <>
      <g transform="translate(660 200)">
        <ellipse cx="50" cy="66" rx="150" ry="22" fill="url(#seam-halo)" />
        {/* extruded chevron ❯ */}
        <g stroke={EDGE} strokeWidth="1">
          <polygon points="0,-56 40,-22 40,-4 0,-38" fill="#ede8da" />
          <polygon points="0,-38 40,-4 40,14 0,-20" fill="#dcd3bd" />
          <polygon points="40,-22 40,-4 0,30 0,12" fill="#eae4d4" />
          <polygon points="0,12 40,-4 40,14 0,30" fill="#d7ceb7" />
        </g>
        {/* cursor block — front, top and side faces, blinking */}
        <g className="seam-blink" transform="translate(72 -46)">
          <polygon points="0,0 12,-10 40,-10 28,0" fill="#e9a23b" />
          <polygon points="28,0 40,-10 40,96 28,106" fill="#8a5c14" />
          <rect x="0" y="0" width="28" height="106" fill="#b97d22" />
        </g>
      </g>
      <Keycap x={340} y={230} s={0.9} />
      <Keycap x={1080} y={224} s={1.05} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* planes — folded ink darts gliding out on amber signal trails        */
/* ------------------------------------------------------------------ */

function Dart({
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
        d="M-74 -4 C -130 6, -180 -14, -238 -2"
        className="seam-drift"
        stroke="#b97d22"
        strokeWidth="1.5"
        fill="none"
        opacity="0.55"
      />
      <circle cx="4" cy="0" r="26" fill="url(#seam-halo)" />
      {/* upper wing */}
      <polygon points="0,0 -76,-30 -34,-3" fill="#f1ede1" stroke={EDGE} strokeWidth="1" />
      {/* lower wing */}
      <polygon points="0,0 -70,26 -30,5" fill="#d7ceb7" stroke={EDGE} strokeWidth="1" />
      {/* fuselage fold */}
      <polygon points="0,0 -34,-3 -30,5" fill="#c8bda2" />
      {/* nose catching the signal */}
      <polygon points="0,0 -12,-2 -11,2" fill="#b97d22" opacity="0.9" />
    </g>
  );
}

function Planes() {
  return (
    <>
      <Dart x={520} y={168} s={1.1} rot={-7} />
      <Dart x={880} y={226} s={0.85} rot={5} />
      <Dart x={1190} y={140} s={0.65} rot={-4} />
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

      {/* far plane — dim constellation, honeycomb outlines, mono readouts */}
      <div data-parallax="18" className="absolute -inset-y-10 inset-x-0">
        <svg className="h-full w-full" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMid slice">
          <g stroke="#c8bda2" strokeWidth="1">
            {FAR_LINKS.map(([a, b]) => (
              <line
                key={`${a}-${b}`}
                x1={FAR_NODES[a][0]} y1={FAR_NODES[a][1]}
                x2={FAR_NODES[b][0]} y2={FAR_NODES[b][1]}
              />
            ))}
          </g>
          {FAR_NODES.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.6" fill="#6f6c63" opacity="0.7" />
          ))}
          <g stroke="#16181b" strokeOpacity="0.1" fill="none" strokeWidth="1">
            <path d="M170 236 217 263v54l-47 27-47-27v-54Z" />
            <path d="M1290 210l30 17v34l-30 17-30-17v-34Z" />
          </g>
          <g fill="#5d5a50" fillOpacity="0.34" fontFamily="ui-monospace,monospace" fontSize="11" letterSpacing="2">
            <text x="384" y="272">{readL}</text>
            <text x="1030" y="292">{readR}</text>
          </g>
        </svg>
      </div>

      {/* near plane — this seam's faceted centerpiece */}
      <div data-parallax="8" className="absolute -inset-y-10 inset-x-0">
        <svg className="h-full w-full" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="seam-halo">
              <stop offset="0" stopColor="#b97d22" stopOpacity="0.35" />
              <stop offset="1" stopColor="#b97d22" stopOpacity="0" />
            </radialGradient>
          </defs>
          <Piece />
        </svg>
      </div>
    </div>
  );
}
