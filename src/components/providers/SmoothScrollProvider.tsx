"use client";

import { useEffect, type JSX, type ReactNode } from "react";
import Lenis from "lenis";

/** Sticky navbar height: anchor targets are scrolled below it. */
const HEADER_OFFSET = -96;

/**
 * Courbe de défilement : départ réactif → accélération → freinage doux.
 * Variante resserrée (plus de répondant que la courbe lente de landonorris.com)
 * qui garde le profil « ça accélère puis ça ralentit » sans phases molles.
 * Résolution par Newton-Raphson sur la composante x, puis évaluation en y.
 */
function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const a = (a1: number, b1: number) => 1 - 3 * b1 + 3 * a1;
  const b = (a1: number, b1: number) => 3 * b1 - 6 * a1;
  const c = (a1: number) => 3 * a1;
  const calc = (t: number, a1: number, b1: number) => ((a(a1, b1) * t + b(a1, b1)) * t + c(a1)) * t;
  const slope = (t: number, a1: number, b1: number) => 3 * a(a1, b1) * t * t + 2 * b(a1, b1) * t + c(a1);

  return (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const s = slope(t, x1, x2);
      if (Math.abs(s) < 1e-6) break;
      const error = calc(t, x1, x2) - x;
      if (Math.abs(error) < 1e-6) break;
      t -= error / s;
    }
    return calc(t, y1, y2);
  };
}

const easeGliding = cubicBezier(0.3, 0.1, 0.2, 1);

/** Single Lenis instance shared with the imperative `scrollToId` helper. */
let lenisInstance: Lenis | null = null;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function handleAnchorClick(event: MouseEvent, instance: Lenis): void {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Element)) return;

  const anchor = target.closest<HTMLAnchorElement>("a[href]");
  if (!anchor) return;
  if (anchor.origin !== window.location.origin) return;

  const url = new URL(anchor.href);
  // Another page: let Next.js handle the navigation.
  if (url.pathname !== window.location.pathname) return;
  if (!url.hash || url.hash.length < 2) return;

  // Native behaviour when the target does not exist.
  const element = document.getElementById(url.hash.slice(1));
  if (!element) return;

  // Capture phase: stop React/Next from doing an instant jump on the same page.
  event.preventDefault();
  event.stopPropagation();
  history.replaceState(null, "", url.hash);
  instance.scrollTo(element, { offset: HEADER_OFFSET });
}

export function SmoothScrollProvider({ children }: { children: ReactNode }): JSX.Element {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) return;

    const instance = new Lenis({
      duration: 1,
      easing: easeGliding,
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
    });

    let rafId = 0;
    const raf = (time: number): void => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onClick = (event: MouseEvent): void => handleAnchorClick(event, instance);
    // Capture phase: pre-empts Next.js' instant jump on same-page hash links.
    document.addEventListener("click", onClick, true);

    lenisInstance = instance;

    return () => {
      document.removeEventListener("click", onClick, true);
      cancelAnimationFrame(rafId);
      instance.destroy();
      if (lenisInstance === instance) {
        lenisInstance = null;
      }
    };
  }, []);

  return <>{children}</>;
}

/**
 * Scrolls to an in-page anchor, preferring the Lenis instance when it is
 * active and falling back to the native smooth scroll otherwise.
 */
export function scrollToId(id: string, offset: number = HEADER_OFFSET): void {
  const element = document.getElementById(id);
  if (!element) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(element, { offset });
    return;
  }

  element.scrollIntoView({ behavior: "smooth" });
}
