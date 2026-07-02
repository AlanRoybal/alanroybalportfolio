"use client";

import { useEffect, useRef } from "react";

/**
 * Generative "neural constellation" — the hero's signature graphic, drawn
 * entirely in code (no images, no 3D, no video).
 *
 * A slowly drifting graph of nodes; nearby nodes link up, and signals
 * periodically *fire* along the links — a nod to the AI/ML systems Alan builds.
 * One amber accent over a neutral mesh. DPR and node count are capped so it
 * stays light on laptops and phones; the pointer gently tugs the mesh. Under
 * prefers-reduced-motion it paints a single still frame instead of animating.
 */
export function NeuralField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    const pointer = { x: 0, y: 0, active: false };

    type Node = { x: number; y: number; vx: number; vy: number; hot: boolean; r: number };
    type Pulse = { a: number; b: number; t: number; sp: number };
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];

    const LINK = 132; // px — max distance at which two nodes link
    const LINK2 = LINK * LINK;

    const build = () => {
      const target = Math.round(Math.min(96, Math.max(24, (w * h) / 14000)));
      nodes = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        hot: Math.random() < 0.16, // a few amber accent nodes
        r: 1.1 + Math.random() * 1.5,
      }));
      pulses = [];
    };

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    // Fire a signal from a random node toward a nearby linked neighbor.
    const spawnPulse = () => {
      if (nodes.length < 2) return;
      const ai = (Math.random() * nodes.length) | 0;
      const a = nodes[ai];
      let best = -1;
      let bestD = LINK2;
      for (let bi = 0; bi < nodes.length; bi++) {
        if (bi === ai) continue;
        const b = nodes[bi];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = dx * dx + dy * dy;
        if (d < bestD && Math.random() < 0.5) {
          best = bi;
          bestD = d;
        }
      }
      if (best >= 0) pulses.push({ a: ai, b: best, t: 0, sp: 0.012 + Math.random() * 0.02 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            const o = (1 - Math.sqrt(d2) / LINK) * 0.22;
            ctx.strokeStyle = `rgba(111,108,99,${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (const n of nodes) {
        if (n.hot) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(185,125,34,0.12)";
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.hot ? "rgba(185,125,34,0.9)" : "rgba(111,108,99,0.5)";
        ctx.fill();
      }
      // firing signals
      for (const p of pulses) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(185,125,34,0.18)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(185,125,34,0.95)";
        ctx.fill();
      }
    };

    const update = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (pointer.active) {
          const dx = pointer.x * w - n.x;
          const dy = pointer.y * h - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 22000 && d2 > 1) {
            n.vx += dx * 0.00006;
            n.vy += dy * 0.00006;
          }
        }
        n.vx *= 0.995;
        n.vy *= 0.995;
        if (n.x < -20) n.x = w + 20;
        else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        else if (n.y > h + 20) n.y = -20;
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        pulses[k].t += pulses[k].sp;
        if (pulses[k].t >= 1) pulses.splice(k, 1);
      }
    };

    let raf = 0;
    let last = 0;
    let acc = 0;
    const loop = (t: number) => {
      const dt = last ? t - last : 16;
      last = t;
      update();
      acc += dt;
      if (acc > 520 && pulses.length < 14) {
        acc = 0;
        spawnPulse();
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    size();
    if (reduced) {
      draw(); // single still frame
    } else {
      raf = requestAnimationFrame(loop);
    }

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        size();
        if (reduced) draw();
      });
    };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / rect.width;
      pointer.y = (e.clientY - rect.top) / rect.height;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    window.addEventListener("resize", onResize);
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
