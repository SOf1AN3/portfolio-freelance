"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/animations/Reveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { EASE } from "@/lib/motion";

/** Structure verrouillée par `process.steps[]` dans `src/messages/*.json`. */
type ProcessStep = {
  phase: string;
  deliverable: string;
  title: string;
  description: string;
};

export function ProcessSection() {
  const t = useTranslations("process");
  // `t.raw()` renvoie `unknown` : la forme des données est garantie par les messages i18n.
  const steps = t.raw("steps") as ProcessStep[];
  const prefersReduced = useReducedMotion();

  return (
    <section id="process" className="scroll-mt-24 py-24 lg:py-32">
      <Container>
        <Reveal>
          <SectionHeader
            index={t("index")}
            title={t("title")}
            lead={t("subtitle")}
          />
        </Reveal>

        <div className="mt-14">
          {/*
            Lien visuel entre les 4 phases : filet tracé au scroll.
            `origin-left` + variante `rtl:` (aucun left/right en dur).
            `prefers-reduced-motion` : tracé instantané (durée 0), HTML identique.
          */}
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: prefersReduced === true ? 0 : 1,
              ease: EASE,
            }}
            className="mb-8 hidden h-px origin-left bg-hairline lg:block rtl:origin-right"
          />

          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
            {steps.map((step, stepIndex) => (
              <StaggerItem key={step.title} className="h-full">
                <ul className="h-full">
                  <li className="group flex h-full flex-col rounded-md border border-hairline bg-card p-6 transition-colors duration-300 hover:border-emerald/40">
                    <div className="flex items-center justify-between gap-3 border-b border-hairline pb-3">
                      <span className="font-display text-3xl leading-none text-platinum">
                        {String(stepIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald">
                        {step.phase}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-lg leading-snug text-platinum transition-colors duration-300 group-hover:text-emerald">
                      {step.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">
                      {step.description}
                    </p>

                    <div className="mt-5 border-t border-hairline pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-fog">
                      {step.deliverable}
                    </div>
                  </li>
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
