"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MessageSquare, PenTool, CodeXml, Rocket } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

const icons = [MessageSquare, PenTool, CodeXml, Rocket];

export function ProcessSection() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as { title: string; description: string }[];

  return (
    <section id="process" className="scroll-mt-20 py-20 lg:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="outline" className="mb-4">
            {t("title")}
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("subtitle")}
          </h2>
        </motion.div>

        <div className="relative mt-16">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent rtl:left-auto rtl:right-6 lg:block" />

          <div className="space-y-8 lg:space-y-12">
            {steps.map((step, i) => {
              const Icon = icons[i] || MessageSquare;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex gap-6"
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-background text-primary shadow-lg shadow-primary/10">
                      <Icon className="size-6" />
                    </div>
                    <span className="mt-2 text-xs font-bold text-muted-foreground/60">
                      0{i + 1}
                    </span>
                  </div>

                  <div className="flex-1 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
                    <h3 className="text-lg font-semibold sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
