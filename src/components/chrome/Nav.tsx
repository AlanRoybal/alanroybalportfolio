"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { profile } from "@/content";
import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/cn";

const LINKS: [string, string][] = [
  ["about", "/#about"],
  ["experience", "/#experience"],
  ["projects", "/#projects"],
  ["contact", "/#contact"],
];

/**
 * In-page anchor clicks: Lenis owns the scroll position, so a native hash jump
 * just updates the URL without moving (the bug on the "alan roybal." logo). Drive
 * the scroll through Lenis when it's running, and fall back to the native smooth
 * scroll under reduced motion / before mount.
 */
function scrollToHash(href: string) {
  const hash = href.slice(href.indexOf("#") + 1);
  const target =
    hash === "top" ? 0 : document.getElementById(hash) ?? undefined;
  if (target === undefined) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target as 0 | HTMLElement, { offset: 0 });
  } else if (typeof target === "number") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

const SECTION_IDS = ["about", "experience", "projects", "contact"];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Track scroll position for backdrop
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section with IntersectionObserver
  const observeSections = useCallback(() => {
    const observers: IntersectionObserver[] = [];
    const visible = new Map<string, number>();

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) visible.set(id, e.intersectionRatio);
            else visible.delete(id);
          }
          let best: string | null = null;
          let bestRatio = 0;
          visible.forEach((ratio, key) => {
            if (ratio > bestRatio) { best = key; bestRatio = ratio; }
          });
          setActiveSection(best);
        },
        { threshold: [0, 0.2, 0.4, 0.6], rootMargin: "-80px 0px -20% 0px" },
      );
      io.observe(el);
      observers.push(io);
    }
    return () => observers.forEach((io) => io.disconnect());
  }, []);

  useEffect(() => observeSections(), [observeSections]);

  const onNavClick =
    (href: string, after?: () => void) => (e: React.MouseEvent) => {
      // Only intercept same-page hash links; let modified clicks behave natively.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      scrollToHash(href);
      // Keep the URL hash in sync without triggering a native jump.
      history.replaceState(null, "", href.replace(/^\//, "") || "/");
      after?.();
    };

  // Lock body scroll while the mobile sheet is open; close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[65] flex items-center justify-between gap-4 px-[clamp(16px,3vw,34px)] py-4 transition-[background-color,backdrop-filter] duration-300",
        scrolled && "bg-bg/80 backdrop-blur-md",
      )}
    >
      <Link
        href="/#top"
        onClick={onNavClick("/#top")}
        className="font-display text-[length:var(--text-sm)] lowercase tracking-tight text-text-strong transition-colors hover:text-accent"
      >
        alan roybal<span className="text-accent">.</span>
      </Link>

      <nav className="hidden items-center gap-7 md:flex">
        {LINKS.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            onClick={onNavClick(href)}
            className={cn(
              "label transition-colors duration-[var(--dur-quick)] hover:text-accent",
              activeSection === href.replace("/#", "") ? "text-accent" : "text-text-muted",
            )}
          >
            {label}
          </Link>
        ))}
        <a
          href={profile.resumeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="label rounded-[var(--radius-full)] border border-line px-3.5 py-1.5 text-text-muted transition-colors duration-[var(--dur-quick)] hover:border-accent hover:text-accent"
        >
          resume
        </a>
      </nav>

      {/* mobile trigger */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="label flex items-center gap-2 rounded-[var(--radius-full)] border border-line px-3.5 py-1.5 text-text-muted transition-colors hover:border-accent hover:text-accent md:hidden"
      >
        {open ? "close" : "menu"}
      </button>

      {/* mobile sheet */}
      {open ? (
        <div className="fixed inset-0 md:hidden">
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
          />
          <nav className="absolute inset-x-3 top-20 flex flex-col gap-1 rounded-[var(--radius-xl)] border border-line bg-surface-0 p-3 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
            {LINKS.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={onNavClick(href, () => setOpen(false))}
                className="rounded-[var(--radius-md)] px-4 py-3 font-display text-[length:var(--text-lg)] font-light lowercase text-text-strong transition-colors hover:bg-surface-1 hover:text-accent"
              >
                {label}
              </Link>
            ))}
            <a
              href={profile.resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-[var(--radius-md)] bg-accent px-4 py-3 text-center text-sm font-medium text-on-accent"
            >
              résumé ↓
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
