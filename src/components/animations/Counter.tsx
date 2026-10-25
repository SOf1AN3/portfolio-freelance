"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

type CounterProps = {
  /** Valeur finale atteinte lors du comptage. */
  to: number;
  /** Texte inséré avant le nombre (ex. "+", "<"). */
  prefix?: string;
  /** Texte inséré après le nombre (ex. "h", "ans"). */
  suffix?: string;
  /** Durée du comptage, en secondes. */
  duration?: number;
  /** Nombre de décimales affichées. */
  decimals?: number;
  className?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT_MARGIN = "-10% 0px";

/**
 * `useLayoutEffect` côté navigateur (application avant le paint), `useEffect`
 * côté serveur : évite le warning React « useLayoutEffect does nothing on the
 * server » pendant le SSR.
 */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Formatage déterministe (aucune dépendance à la locale du navigateur côté SSR).
 * `toLocaleString("fr-FR")` uniquement pour les grands entiers, afin d'éviter
 * les artefacts de séparation de milliers sur les petites valeurs.
 */
function formatValue(value: number, decimals: number, useLocale: boolean): string {
  if (useLocale) return Math.round(value).toLocaleString("fr-FR");
  if (decimals > 0) return value.toFixed(decimals).replace(".", ",");
  return Math.round(value).toString();
}

/**
 * Compteur animé, déclenché à l'entrée dans le viewport (équivalent
 * `whileInView`) et joué une seule fois.
 *
 * - Valeur initiale (SSR) déterministe : `prefix` + valeur à 0 + `suffix`,
 *   aucun `Math.random` → HTML serveur/client identique.
 * - `prefers-reduced-motion: reduce` → valeur finale affichée immédiatement,
 *   sans comptage.
 * - Les grands nombres sont groupés : `1000` → `1 000` (locale fr) uniquement
 *   quand `decimals === 0` et `to >= 100`.
 *
 * @example <Counter to={24} suffix=" ans" />
 * @example <Counter to={1000} prefix="+" suffix="h" />
 */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1.6,
  decimals = 0,
  className,
}: CounterProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const useLocale = decimals === 0 && to >= 100;

  const display = useTransform(motionValue, (value) =>
    `${prefix}${formatValue(value, decimals, useLocale)}${suffix}`,
  );
  const inView = useInView(ref, { once: true, margin: VIEWPORT_MARGIN });

  useIsomorphicLayoutEffect(() => {
    if (prefersReduced === true) {
      motionValue.set(to);
      return;
    }

    if (!inView) return;

    motionValue.set(0);
    const controls = animate(motionValue, to, { duration, ease: EASE });
    return () => controls.stop();
  }, [prefersReduced, inView, to, duration, motionValue]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
