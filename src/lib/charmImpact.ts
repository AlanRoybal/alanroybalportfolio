// Tiny imperative pub/sub carrying the charm's "impact" progress (0 = wordmark
// fully scrambled, 1 = fully resolved). ScrollCharm writes it each scroll frame;
// CharmWordmark subscribes and re-renders its glyphs imperatively (no React
// re-render per frame). Decouples the page-level overlay from the footer wordmark.

type Listener = (v: number) => void;

let value = 0;
const listeners = new Set<Listener>();

export function setCharmImpact(v: number): void {
  if (v === value) return;
  value = v;
  for (const fn of listeners) fn(v);
}

export function subscribeCharmImpact(fn: Listener): () => void {
  listeners.add(fn);
  fn(value);
  return () => {
    listeners.delete(fn);
  };
}
