"use client";

import { useEffect, type JSX, type ReactNode } from "react";
import Lenis from "lenis";

/** Sticky navbar height: anchor targets are scrolled below it. */
const HEADER_OFFSET = -96;

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
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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
