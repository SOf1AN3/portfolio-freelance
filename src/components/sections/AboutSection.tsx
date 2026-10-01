"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, ArrowRight, Globe, Monitor, Smartphone } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/images";

const expertise = [
  { key: "web", icon: Globe },
  { key: "desktop", icon: Monitor },
  { key: "mobile", icon: Smartphone },
] as const;

export function AboutSection() {
  const t = useTranslations("about");
  const highlights = t.raw("highlights") as string[];

  return (
    <section id="about" className="scroll-mt-20 py-20 lg:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4">
              {t("title")}
            </Badge>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("subtitle")}
            </h2>
            <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
              {t("description")}
            </p>

            <ul className="mt-8 space-y-3">
              {highlights.map((highlight, i) => (
                <motion.li
                  key={highlight}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="size-5 shrink-0 text-[#22c55e]" />
                  <span className="text-sm sm:text-base">{highlight}</span>
                </motion.li>
              ))}
            </ul>

            <Button asChild size="lg" className="mt-8">
              <a href="#contact">
                {t("cta")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-blue-500/25 via-indigo-500/10 to-violet-500/25 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-8 backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/15 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              <div className="relative flex flex-col items-center gap-6 text-center">
                <div className="relative">
                  <div className="absolute -inset-2.5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-30 blur-xl" />
                  <div className="relative size-32 overflow-hidden rounded-full border-2 border-primary/40 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-primary/20">
                    <Image
                      src={images.sofiane}
                      alt="Sofiane ASMA"
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-1 end-1 size-5 rounded-full border-[3px] border-card bg-emerald-500" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    Sofiane ASMA
                  </h3>
                  <p className="mt-2 inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {t("role")}
                  </p>
                </div>

                <div className="grid w-full grid-cols-3 gap-3">
                  {expertise.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.key}
                        className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-background/50 p-3 transition-colors hover:border-primary/40 hover:bg-background/70"
                      >
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                          <Icon className="size-4" />
                        </div>
                        <span className="text-sm font-semibold">
                          {t(`expertise.${item.key}`)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
