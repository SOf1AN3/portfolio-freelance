"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "framer-motion";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  /** Durée d'un cycle complet, en secondes. */
  speed?: number;
  /** Sens du défilement (par défaut : vers la gauche). */
  reverse?: boolean;
  /** Met le défilement en pause au survol et au focus clavier. */
  pauseOnHover?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Rail de défilement infini horizontal. Le contenu est dupliqué une fois
 * (la copie est masquée aux technologies d'assistance) et le rail est animé de
 * `0%` → `-50%` (soit exactement une largeur de copie) : la boucle est sans couture.
 *
 * - Animation pilotée par framer-motion (`animate`) avec `pause()` / `play()` :
 *   la pause fige le rail à sa position exacte, aucun clignotement au reprise.
 * - `prefers-reduced-motion: reduce` → aucun défilement, contenu statique.
 * - Le rail est `overflow-hidden` par défaut : passez votre propre
 *   `overflow-*` dans `className` pour le surcharger (tailwind-merge).
 * - Le contenu dupliqué est `aria-hidden` + `inert` : aucun focus clavier ne
 *   peut atterrir sur la copie. Évitez les `id` dans le contenu (dupliqué).
 *   Pensez à un espacement régulier (`gap` / `pr`) dans le contenu : la couture
 *   entre la fin du rail et sa copie doit être invisible.
 *
 * @example
 * <Marquee className="border-y py-6"><TechLogos /></Marquee>
 */
export function Marquee({
  speed = 40,
  reverse = false,
  pauseOnHover = true,
  className,
  children,
}: MarqueeProps) {
  const prefersReduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReduced === true) return;

    const rail = railRef.current;
    if (!rail) return;

    const controls = animate(
      rail,
      { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] },
      { duration: speed, repeat: Infinity, ease: "linear" },
    );
    controlsRef.current = controls;
    if (pausedRef.current) controls.pause();

    return () => {
      controls.stop();
      controlsRef.current = null;
    };
  }, [prefersReduced, reverse, speed]);

  useEffect(() => {
    pausedRef.current = paused;
    const controls = controlsRef.current;
    if (!controls) return;

    if (paused) controls.pause();
    else controls.play();
  }, [paused]);

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      onPointerEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onPointerLeave={pauseOnHover ? () => setPaused(false) : undefined}
      onFocusCapture={pauseOnHover ? () => setPaused(true) : undefined}
      onBlurCapture={pauseOnHover ? () => setPaused(false) : undefined}
    >
      <div ref={railRef} className="flex w-max items-center">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
