"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { JsonLd } from "@/components/SEO/JsonLd";
import { Reveal } from "@/components/animations/Reveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type FaqItem = { question: string; answer: string };

type FaqSectionProps = {
  /**
   * Filets `border-y` de la section (défaut : `true`).
   *
   * Passé à `false` quand la section est encadrée par deux sections qui portent
   * déjà leur propre `border` : sans cela, deux filets de 1px voisins s'empilent
   * et donnent un trait de 2px.
   */
  bordered?: boolean;
};

/** Micro-index ledger : « 01 », « 02 », … */
const ledgerIndex = (position: number): string =>
  String(position).padStart(2, "0");

export function FaqSection({ bordered = true }: FaqSectionProps) {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];
  /** Une seule question ouverte à la fois (`null` = tout replié). */
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section
      id="faq"
      className={cn(
        "scroll-mt-24 bg-canvas py-24 lg:py-32",
        // `bordered={false}` : la section voisine porte déjà son propre filet.
        bordered && "border-y border-hairline",
      )}
    >
      <JsonLd data={structuredData} />

      <Container>
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <Reveal>
            <SectionHeader
              index={t("index")}
              title={t("title")}
              lead={t("subtitle")}
            />
          </Reveal>

          <Stagger className="flex flex-col gap-4">
            {items.map((item, i) => {
              const isOpen = openIndex === i;
              const questionId = `faq-question-${i}`;
              const panelId = `faq-panel-${i}`;

              return (
                <StaggerItem key={item.question}>
                  <div
                    className={cn(
                      "rounded-md border bg-card transition-colors duration-300",
                      isOpen ? "border-emerald/40" : "border-hairline",
                    )}
                  >
                    <h3>
                      <button
                        type="button"
                        id={questionId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenIndex(isOpen ? null : i)}
                        className="flex w-full cursor-pointer items-start gap-3 px-5 py-5 text-start transition-colors duration-200 hover:bg-elevated/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald sm:px-6"
                      >
                        <span
                          aria-hidden="true"
                          className="w-7 shrink-0 pt-1 font-mono text-xs tracking-widest text-emerald"
                        >
                          {ledgerIndex(i + 1)}
                        </span>

                        <span className="flex-1 text-base font-medium leading-snug text-platinum sm:text-lg">
                          {item.question}
                        </span>

                        <span
                          data-open={isOpen ? "" : undefined}
                          className="shrink-0 pt-1 text-emerald transition-transform duration-300 data-[open]:rotate-180"
                        >
                          <ChevronDown aria-hidden="true" className="size-4" />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          key="panel"
                          id={panelId}
                          role="region"
                          aria-labelledby={questionId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 sm:px-6">
                            <p className="border-t border-hairline pt-4 text-sm leading-relaxed text-mist sm:ms-10 sm:text-base">
                              {item.answer}
                            </p>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
