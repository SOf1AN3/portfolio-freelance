"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Abonnement inutilisé : requis par `useSyncExternalStore`. */
const subscribeToNothing = (): (() => void) => () => undefined;
/** Snapshot client : l'hydratation est terminée. */
const getHydratedSnapshot = (): boolean => true;
/** Snapshot serveur : pas encore hydraté (HTML identique serveur/client). */
const getServerSnapshot = (): boolean => false;

type RevealProps = {
  /** Délai avant le début de l'animation, en secondes. */
  delay?: number;
  /** Décalage vertical initial, en pixels. */
  y?: number;
  /** Flou initial, en pixels. */
  blur?: number;
  /** Joue l'animation une seule fois (défaut) ou à chaque entrée dans le viewport. */
  once?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Bloc révélé au scroll : fondu + translation verticale + dé-flou.
 *
 * `prefers-reduced-motion: reduce` → rendu statique (aucun transform, aucun blur).
 *
 * La branche « reduced » est activée uniquement après l'hydratation :
 * `useReducedMotion()` lit la préférence système dès le premier render client,
 * ce qui créerait sinon un mismatch avec le HTML servi par le serveur.
 *
 * @example
 * <Reveal delay={0.1}><h2>Titre</h2></Reveal>
 */
export function Reveal({
  delay = 0,
  y = 24,
  blur = 6,
  once = true,
  className,
  children,
}: RevealProps) {
  const prefersReduced = useReducedMotion();
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    getHydratedSnapshot,
    getServerSnapshot,
  );

  if (hydrated && prefersReduced === true) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
