// Procedurally renders an original ASCII parody of a fox-girl's "charm": she
// sways, brings a hand to her lips, blows a kiss, and a heart projectile launches
// forward and grows — the recognisable beats of the in-game ability, drawn as
// ORIGINAL art. Every one of the NUM frames is redrawn from a parametric skeleton
// (no single image + overlay).
import { writeFileSync } from "fs";

const W = 58;
const H = 38;
const NUM = 20;

const newGrid = () => Array.from({ length: H }, () => Array(W).fill(" "));
const set = (g, x, y, c) => {
  x = Math.round(x);
  y = Math.round(y);
  if (x >= 0 && x < W && y >= 0 && y < H) g[y][x] = c;
};
const line = (g, x0, y0, x1, y1, c) => {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1) * 2;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    set(g, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, c);
  }
};
const fillEllipse = (g, cx, cy, rx, ry, c) => {
  for (let y = -Math.ceil(ry); y <= Math.ceil(ry); y++)
    for (let x = -Math.ceil(rx); x <= Math.ceil(rx); x++)
      if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) set(g, cx + x, cy + y, c);
};
// implicit heart curve ((x^2+y^2-1)^3 - x^2 y^3 <= 0), aspect-corrected for cells
const fillHeart = (g, cx, cy, s, c) => {
  for (let dy = -Math.ceil(s * 1.4); dy <= Math.ceil(s * 1.4); dy++)
    for (let dx = -Math.ceil(s * 1.3); dx <= Math.ceil(s * 1.3); dx++) {
      const X = dx / s;
      const Y = -((dy - s * 0.3) * 1.9) / s;
      if (Math.pow(X * X + Y * Y - 1, 3) - X * X * Y * Y * Y <= 0) set(g, cx + dx, cy + dy, c);
    }
};
const triEar = (g, tipx, tipy, baseW, c) => {
  for (let r = 0; r <= 3; r++) {
    const w = (baseW * r) / 3;
    line(g, tipx - w, tipy + r, tipx + w, tipy + r, c);
  }
};
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const kf = (frames, f) => {
  for (let i = 0; i < frames.length - 1; i++) {
    const [f0, v0] = frames[i];
    const [f1, v1] = frames[i + 1];
    if (f >= f0 && f <= f1) return lerp(v0, v1, smooth((f - f0) / (f1 - f0 || 1)));
  }
  return frames[frames.length - 1][1];
};

const CX = 22; // figure centre (left-of-centre so the heart can fly right)
// kissing arm (hand): idle -> lips -> follow-through forward/right
const HAND_X = [[0, 31], [5, 28], [9, 26], [11, 26], [14, 33], [17, 38], [20, 31]];
const HAND_Y = [[0, 24], [5, 18], [9, 9], [11, 9], [14, 11], [17, 12], [20, 24]];
const ELB_X = [[0, 30], [5, 29], [9, 29], [11, 29], [14, 31], [17, 34], [20, 30]];
const ELB_Y = [[0, 18], [5, 15], [9, 12], [11, 12], [14, 12], [17, 12], [20, 18]];
const SWAY = [[0, 0], [5, -0.8], [10, 0.6], [15, 1.4], [20, 0]]; // hip sway
const LEAN = [[0, 0], [7, 0], [10, 1.5], [15, 1.2], [18, 0], [20, 0]];

function drawFrame(f) {
  const g = newGrid();
  const breathe = 0.4 * Math.sin((f / NUM) * Math.PI * 2);
  const sway = kf(SWAY, f);
  const lean = kf(LEAN, f);
  const cx = CX + sway;
  const hy = 9 + breathe;
  const hx = cx + 1 + lean * 0.7;
  const kissing = f >= 9 && f <= 14;

  // ---- hair (back mass) + long side hair ----
  fillEllipse(g, hx, hy + 2, 8, 6, "%");
  for (let y = hy; y < 27; y++) {
    const spread = 7 + (y - hy) * 0.12;
    set(g, hx - spread, y, "%");
    set(g, hx - spread + 1, y, "%");
    set(g, hx + spread - 1, y, "%");
    set(g, hx + spread, y, "%");
  }

  // ---- fox ears ----
  triEar(g, hx - 4, hy - 6, 2, "%");
  triEar(g, hx + 4, hy - 6, 2, "%");
  set(g, hx - 4, hy - 4, "@");
  set(g, hx + 4, hy - 4, "@");

  // ---- dress / body (lean the upper half) ----
  const shY = 14 + breathe;
  const hipY = 31;
  for (let y = Math.round(shY); y <= hipY; y++) {
    const t = (y - shY) / (hipY - shY);
    const half = lerp(3.5, 8.5, t);
    const bx = cx + lean * (1 - t);
    for (let x = -half; x <= half; x++) set(g, bx + x, y, "#");
  }

  // ---- head + face ----
  fillEllipse(g, hx, hy, 4, 2.4, "@");
  set(g, hx - 2, hy, ".");
  set(g, hx + 2, hy, kissing ? "-" : "."); // wink on the kiss
  set(g, hx - 4.5, hy, "="); // whisker marks
  set(g, hx + 4.5, hy, "=");
  set(g, hx, hy + 1.4, kissing ? "o" : "-"); // pucker

  // ---- off-hand foxfire orb ----
  const orbY = shY + 7 + breathe;
  fillEllipse(g, cx - 9, orbY, 2.2, 1.4, "o");
  set(g, cx - 9, orbY, "O");
  line(g, cx - 5, shY + 1, cx - 8, orbY - 1, "+"); // off-arm to orb

  // ---- kissing arm: shoulder -> elbow -> hand ----
  const sh = [cx + 4, shY + 0.5];
  const el = [kf(ELB_X, f) - 22 + cx, kf(ELB_Y, f) + breathe];
  const ha = [kf(HAND_X, f) - 22 + cx, kf(HAND_Y, f) + breathe];
  line(g, sh[0], sh[1], el[0], el[1], "+");
  line(g, el[0], el[1], ha[0], ha[1], "+");
  set(g, ha[0], ha[1], f >= 11 ? "<" : "o");

  // ---- the charm: a heart projectile launches from the lips and grows ----
  if (f >= 10) {
    const p = (f - 10) / (NUM - 10); // 0..1 across the launch
    const startX = hx + 3;
    const startY = hy + 1;
    const hxh = lerp(startX, startX + 26, smooth(p));
    const hyh = lerp(startY, startY - 5, smooth(p));
    const s = lerp(1.4, 3.6, p);
    fillHeart(g, hxh, hyh, s, "<");
  }

  return g.map((row) => row.join("").replace(/\s+$/, "")).join("\n");
}

const frames = [];
for (let f = 0; f < NUM; f++) frames.push(drawFrame(f));

if (process.argv.includes("--preview")) {
  const which = process.argv.includes("--all")
    ? frames.map((_, i) => i)
    : [0, 5, 9, 12, 15, 18];
  for (const i of which) {
    console.log(`\n===== frame ${i} =====`);
    console.log(frames[i]);
  }
}

const out =
  `// AUTO-GENERATED by scripts/gen-charm.mjs — ${NUM} hand-rendered ASCII frames of\n` +
  `// an original fox-girl "charm" (blow a kiss, heart projectile flies). Each frame\n` +
  `// is distinct art drawn from a parametric skeleton.\n` +
  `export const charmCols = ${W};\n` +
  `export const charmFrames: string[] = [\n` +
  frames.map((fr) => "  `\n" + fr + "\n`").join(",\n") +
  `\n];\n`;
writeFileSync("src/content/charmFrames.ts", out);
console.log(`wrote src/content/charmFrames.ts (${NUM} frames, ${W}x${H})`);
