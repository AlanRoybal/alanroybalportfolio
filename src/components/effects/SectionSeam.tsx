/**
 * Section seams — four unique full-bleed transitions, one per joint, built
 * from photographed folded-paper cutouts (public/paper/*) placed inside an
 * SVG stage so the code-drawn amber signal layer (pulses, blinks, trails)
 * can weave through them:
 *
 *   `cores`     — hero → about: origami peaks on a ridgeline; the signal
 *                 pulse travels the trail between them.
 *   `monoliths` — about → experience: terraced paper mesas, their amber
 *                 halos breathing.
 *   `terminal`  — experience → projects: the origami pine grove with its
 *                 paper stream; a lantern blinks like the site's caret.
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

const GREY = "#b9b5a7";
const AMBER = "#b97d22";
const AMBER_HI = "#e9a23b";
const KRAFT_DARK = "#5c4530";
const TRAIL = "rgba(46,30,14,0.3)";

// image aspect ratios (height/width) of the paper cutouts
const AR = {
  peak: 600 / 600,
  mesa: 461 / 800,
  grove: 445 / 900,
  crane: 373 / 500,
  pine: 298 / 240,
};

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

/** A paper cutout dropped onto the stage, casting the diorama shadow. */
function Cutout({
  href,
  x,
  y,
  h,
  ar,
  uid,
  muted,
}: {
  href: string;
  x: number;
  y: number;
  h: number;
  ar: number;
  uid: string;
  muted?: boolean;
}) {
  return (
    <image
      href={href}
      x={x}
      y={y}
      width={h / ar}
      height={h}
      filter={muted ? `url(#mute-${uid})` : `url(#ds-${uid})`}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}

function StageDefs({ uid }: { uid: string }) {
  return (
    <defs>
      <filter id={`ds-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx={3} dy={7} stdDeviation={5} floodColor="#3f2f1c" floodOpacity={0.32} />
      </filter>
      {/* pulls the grove's greens toward the paper palette, then shadows */}
      <filter id={`mute-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
        <feColorMatrix type="saturate" values="0.62" />
        <feDropShadow dx={3} dy={7} stdDeviation={5} floodColor="#3f2f1c" floodOpacity={0.32} />
      </filter>
      <radialGradient id={`halo-${uid}`}>
        <stop offset="0" stopColor={AMBER} stopOpacity="0.3" />
        <stop offset="1" stopColor={AMBER} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/* ------------------------------------------------------------------ */
/* cores — origami peaks; the signal pulse walks the ridge trail       */
/* ------------------------------------------------------------------ */

function Cores({ uid }: { uid: string }) {
  const trail = "M190 200 L420 232 L720 238 L1040 234 L1270 204";
  return (
    <>
      <g className="seam-breathe">
        <circle cx="420" cy="180" r="80" fill={`url(#halo-${uid})`} />
        <circle cx="720" cy="140" r="120" fill={`url(#halo-${uid})`} />
        <circle cx="1040" cy="160" r="95" fill={`url(#halo-${uid})`} />
      </g>
      <path d={trail} stroke={TRAIL} strokeWidth="1" fill="none" />
      {/* left peak mirrored so the trio doesn't read as a repeated stamp */}
      <g transform="translate(838 0) scale(-1 1)">
        <Cutout uid={uid} href="/paper/peak.png" x={335} y={96} h={168} ar={AR.peak} />
      </g>
      <Cutout uid={uid} href="/paper/peak.png" x={588} y={8} h={262} ar={AR.peak} />
      <Cutout uid={uid} href="/paper/peak.png" x={942} y={66} h={198} ar={AR.peak} />
      <Cutout uid={uid} href="/paper/pine.png" x={288} y={186} h={52} ar={AR.pine} />
      <Cutout uid={uid} href="/paper/pine.png" x={1116} y={192} h={44} ar={AR.pine} />
      {/* the pulse travels the trail over the peaks' feet */}
      <path
        d={trail}
        pathLength={100}
        className="seam-signal"
        stroke={AMBER}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="190" cy="200" r="2" fill="#6f6c63" opacity="0.8" />
      <circle cx="1270" cy="204" r="2" fill="#6f6c63" opacity="0.8" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* monoliths — terraced paper mesas, halos breathing                   */
/* ------------------------------------------------------------------ */

function Monoliths({ uid }: { uid: string }) {
  return (
    <>
      <g className="seam-breathe">
        <ellipse cx="300" cy="266" rx="120" ry="22" fill={`url(#halo-${uid})`} />
        <ellipse cx="720" cy="272" rx="170" ry="26" fill={`url(#halo-${uid})`} />
        <ellipse cx="1150" cy="268" rx="140" ry="24" fill={`url(#halo-${uid})`} />
      </g>
      <Cutout uid={uid} href="/paper/mesa-cluster.png" x={196} y={148} h={122} ar={AR.mesa} />
      <Cutout uid={uid} href="/paper/mesa-cluster.png" x={571} y={98} h={176} ar={AR.mesa} />
      <Cutout uid={uid} href="/paper/mesa-cluster.png" x={1028} y={128} h={144} ar={AR.mesa} />
      <line x1="180" y1="272" x2="1260" y2="272" stroke={TRAIL} strokeWidth="1" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* terminal — the pine grove and its stream; a lantern blinks          */
/* ------------------------------------------------------------------ */

function Terminal({ uid }: { uid: string }) {
  return (
    <>
      <line x1="240" y1="254" x2="1220" y2="254" stroke={TRAIL} strokeWidth="1" />
      <ellipse cx="700" cy="252" rx="220" ry="26" fill={`url(#halo-${uid})`} />
      <Cutout uid={uid} href="/paper/grove.png" x={488} y={68} h={198} ar={AR.grove} muted />
      {/* outlying pines grounded on the trail line */}
      <ellipse cx="330" cy="254" rx="58" ry="7" fill="rgba(63,47,28,0.14)" />
      <ellipse cx="1122" cy="254" rx="62" ry="7" fill="rgba(63,47,28,0.14)" />
      <Cutout uid={uid} href="/paper/pine.png" x={296} y={178} h={78} ar={AR.pine} />
      <Cutout uid={uid} href="/paper/pine.png" x={356} y={204} h={52} ar={AR.pine} />
      <Cutout uid={uid} href="/paper/pine.png" x={1082} y={168} h={88} ar={AR.pine} />
      <Cutout uid={uid} href="/paper/pine.png" x={1150} y={206} h={50} ar={AR.pine} />
      {/* paper lantern hanging into the grove, blinking like the caret */}
      <g className="seam-blink" transform="translate(760 108)">
        <path d="M0,-24 C 1,-16 1,-10 0,-4" fill="none" stroke={KRAFT_DARK} strokeWidth="1.2" />
        <circle cx="0" cy="6" r="16" fill={`url(#halo-${uid})`} />
        <polygon points="0,-4 7,4 0,12 -7,4" fill={AMBER_HI} />
        <polygon points="0,-4 7,4 0,4" fill={AMBER} />
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
  h,
}: {
  uid: string;
  x: number;
  y: number;
  h: number;
}) {
  const w = h / AR.crane;
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* trail streaming off the tail */}
      <path
        d={`M${-w * 0.42} ${h * 0.1} C ${-w * 0.42 - 56} ${h * 0.1 + 10}, ${-w * 0.42 - 106} ${h * 0.1 - 10}, ${-w * 0.42 - 164} ${h * 0.1 + 2}`}
        className="seam-drift"
        stroke={AMBER}
        strokeWidth="1.5"
        fill="none"
        opacity="0.55"
      />
      <circle r={h * 0.34} fill={`url(#halo-${uid})`} />
      <Cutout uid={uid} href="/paper/crane.png" x={-w / 2} y={-h / 2} h={h} ar={AR.crane} />
    </g>
  );
}

function Planes({ uid }: { uid: string }) {
  return (
    <>
      <g transform="rotate(-6 520 168)">
        <Crane uid={uid} x={520} y={168} h={104} />
      </g>
      <g transform="rotate(4 880 226)">
        <Crane uid={uid} x={880} y={226} h={80} />
      </g>
      <g transform="rotate(-3 1190 140)">
        <Crane uid={uid} x={1190} y={140} h={62} />
      </g>
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
          <StageDefs uid={variant} />
          <Piece uid={variant} />
        </svg>
      </div>
    </div>
  );
}
