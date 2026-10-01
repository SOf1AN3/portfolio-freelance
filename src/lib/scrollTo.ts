import { useEffect } from "react";

export function getHeaderOffset() {
  return 72;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: reduce ? "auto" : "smooth",
  });

  if (window.location.hash !== `#${id}`) {
    history.pushState(null, "", `#${id}`);
  }
}

export function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  if (!id) return;
  scrollToId(id);
}

export function useSmoothAnchors(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      if (!document.getElementById(id)) return;

      event.preventDefault();
      scrollToId(id);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [enabled]);
}
