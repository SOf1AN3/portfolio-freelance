"use client";

import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

type MagneticProps = {
  /** Intensité de l'attraction (0.3 ≈ 12px de déplacement maximum). */
  strength?: number;
  className?: string;
  children: ReactNode;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Wrappé magnétique : l'élément suit légèrement le curseur puis revient
 * élastiquement au repos au départ du pointeur.
 *
 * - Désactivé sur pointeur « coarse » (mobile/tablette) : la détection se fait
 *   dans un `useEffect`, jamais pendant le render (pas de mismatch d'hydratation).
 * - `prefers-reduced-motion: reduce` → élément immobile, aucune transformation.
 *
 * @example
 * <Magnetic strength={0.4}><Button>Contact</Button></Magnetic>
 */
export function Magnetic({ strength = 0.3, className, children }: MagneticProps) {
  const prefersReduced = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const active = finePointer && prefersReduced !== true;

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const sync = () => {
      setFinePointer(!query.matches);
    };
    sync();
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
    };
  }, []);

  // Si l'activation est coupée (mobile détecté, reduced motion), on repart au repos.
  useEffect(() => {
    if (active) return;
    x.set(0);
    y.set(0);
  }, [active, x, y]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!active || event.pointerType === "touch") return;

    const rect = event.currentTarget.getBoundingClientRect();
    const limit = strength * 40;
    const ratioX = rect.width > 0
      ? (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
      : 0;
    const ratioY = rect.height > 0
      ? (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
      : 0;

    x.set(clamp(ratioX * limit, -limit, limit));
    y.set(clamp(ratioY * limit, -limit, limit));
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </motion.div>
  );
}
