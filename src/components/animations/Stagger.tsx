"use client";

import { useMemo, useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type StaggerProps = {
  className?: string;
  children: ReactNode;
  /** Délai entre chaque enfant, en secondes. */
  stagger?: number;
};

type StaggerItemProps = {
  className?: string;
  children: ReactNode;
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

/** Abonnement inutilisé : requis par `useSyncExternalStore`. */
const subscribeToNothing = (): (() => void) => () => undefined;
/** Snapshot client : l'hydratation est terminée. */
const getHydratedSnapshot = (): boolean => true;
/** Snapshot serveur : pas encore hydraté (HTML identique serveur/client). */
const getServerSnapshot = (): boolean => false;

/**
 * `useReducedMotion()` lit la préférence système dès le premier render client :
 * on attend la fin de l'hydratation avant de basculer sur le rendu statique,
 * pour garder un HTML serveur/client strictement identique.
 */
function useReducedMotionAfterMount(): boolean {
  const prefersReduced = useReducedMotion();
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    getHydratedSnapshot,
    getServerSnapshot,
  );

  return hydrated && prefersReduced === true;
}

/**
 * Conteneur de liste animé en cascade. Chaque enfant doit être un `<StaggerItem>`.
 *
 * `prefers-reduced-motion: reduce` → conteneur statique, les items s'affichent
 * directement (aucun transform).
 *
 * @example
 * <Stagger className="grid gap-6 md:grid-cols-3">
 *   <StaggerItem>…</StaggerItem>
 * </Stagger>
 */
export function Stagger({ className, children, stagger = 0.08 }: StaggerProps) {
  const reduced = useReducedMotionAfterMount();

  const containerVariants = useMemo<Variants>(
    () => ({
      hidden: {},
      visible: { transition: { staggerChildren: stagger } },
    }),
    [stagger],
  );

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

/**
 * Élément d'un `<Stagger>` : apparaît en cascade (fondu + montée de 16px).
 * Sans parent `Stagger`, il s'affiche simplement en statique.
 */
export function StaggerItem({ className, children }: StaggerItemProps) {
  const reduced = useReducedMotionAfterMount();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
