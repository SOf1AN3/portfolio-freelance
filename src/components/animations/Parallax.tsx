"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/** Abonnement inutilisé : requis par `useSyncExternalStore`. */
const subscribeToNothing = (): (() => void) => () => undefined;
/** Snapshot client : l'hydratation est terminée. */
const getHydratedSnapshot = (): boolean => true;
/** Snapshot serveur : pas encore hydraté (HTML identique serveur/client). */
const getServerSnapshot = (): boolean => false;

type ParallaxProps = {
  /** Amplitude du déplacement vertical, en px (de `+amount` à `-amount`). */
  amount?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Défilement parallaxe : le contenu se déplace de `+amount` à `-amount` px
 * pendant que le wrapper traverse le viewport.
 *
 * - Wrapper = élément portant `className` et `ref` (il ne bouge pas) ; seul le
 *   contenu interne translate. Passez `overflow-hidden` dans `className` si le
 *   contenu peut déborder.
 * - `prefers-reduced-motion: reduce` → contenu immobile (transform neutralisé).
 *
 * @example
 * <Parallax amount={60} className="h-[420px] overflow-hidden rounded-2xl">
 *   <Image … className="h-full w-full object-cover" />
 * </Parallax>
 */
export function Parallax({ amount = 40, className, children }: ParallaxProps) {
  const prefersReduced = useReducedMotion();
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    getHydratedSnapshot,
    getServerSnapshot,
  );
  const ref = useRef<HTMLDivElement>(null);

  // Bascule « reduced » après l'hydratation : le HTML serveur contient déjà le
  // transform initial, on évite ainsi tout mismatch de rendu.
  const reduced = hydrated && prefersReduced === true;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: reduced ? 0 : y }}>{children}</motion.div>
    </div>
  );
}
