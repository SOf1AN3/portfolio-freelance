"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/** Abonnement inutilisé : requis par `useSyncExternalStore`. */
const subscribeToNothing = (): (() => void) => () => undefined;
/** Snapshot client : l'hydratation est terminée. */
const getHydratedSnapshot = (): boolean => true;
/** Snapshot serveur : pas encore hydraté (HTML identique serveur/client). */
const getServerSnapshot = (): boolean => false;

/**
 * Barre de progression du scroll, fixée en haut de page (2px, émeraude).
 *
 * - Pilotée par `useScroll().scrollYProgress` via un `scaleX` amorti (spring).
 * - `prefers-reduced-motion: reduce` → aucune barre rendue (aucun mouvement).
 *   La barre n'est pas du contenu essentiel : elle est purement décorative.
 *
 * @example <ScrollProgress />
 */
export function ScrollProgress({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    getHydratedSnapshot,
    getServerSnapshot,
  );

  // Bascule « reduced » après l'hydratation pour conserver un HTML
  // serveur/client identique lors du premier render.
  const reduced = hydrated && prefersReduced === true;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  if (reduced) return null;

  return (
    <motion.div
      className={cn(
        "fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-emerald rtl:origin-right",
        className,
      )}
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
