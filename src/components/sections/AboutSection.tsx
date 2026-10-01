"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/images";

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
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-violet-500/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 opacity-20 blur-lg" />
                  <div className="relative size-32 overflow-hidden rounded-full border-2 border-primary/30 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl">
                    <Image
                      src={images.sofiane}
                      alt="Sofiane ASMA"
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Sofiane ASMA</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Full-Stack Developer
                  </p>
                </div>
                <div className="grid w-full grid-cols-3 gap-4">
                  <div className="rounded-xl bg-muted/60 p-4">
                    <div className="text-2xl font-bold text-primary">Next.js</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Expert
                    </div>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-4">
                    <div className="text-2xl font-bold text-primary">React</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Expert
                    </div>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-4">
                    <div className="text-2xl font-bold text-primary">Node</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Expert
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
