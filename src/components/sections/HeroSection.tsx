"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, MessageCircle, Sparkles, Clock, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/utils";
import { images } from "@/lib/images";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden pb-16 pt-28 lg:pb-24 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#020617]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(30,64,175,0.45),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_60%,rgba(79,70,229,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,#020617_85%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      </div>

      <Container>
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center lg:text-start"
          >
            <motion.div variants={item} className="flex justify-center lg:justify-start">
              <Badge variant="success" className="px-4 py-1.5 text-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#22c55e]" />
                </span>
                {t("badge")}
              </Badge>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-5xl xl:text-6xl"
            >
              <span className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-400 bg-clip-text text-transparent">
                {t("title")}
              </span>
              <span className="mt-2 block bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
                {t("highlight")}
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mx-auto mt-6 max-w-2xl text-pretty text-base text-blue-200/70 sm:text-lg lg:mx-0 lg:text-xl"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href="#contact">
                  {t("ctaPrimary")}
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </a>
              </Button>
              <Button asChild variant="whatsapp" size="lg" className="w-full sm:w-auto">
                <a
                  href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" />
                  {t("ctaSecondary")}
                </a>
              </Button>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              {(t.raw("reassurance") as string[]).map((text, i) => {
                const icons = [Sparkles, Clock, ShieldCheck];
                const Icon = icons[i] || Sparkles;
                return (
                  <span
                    key={text}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-950/40 px-4 py-2 text-sm text-blue-200/80 backdrop-blur"
                  >
                    <Icon className="size-4 text-blue-400" />
                    {text}
                  </span>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-sm lg:max-w-none"
          >
            <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-blue-600/30 via-indigo-500/10 to-sky-400/20 blur-2xl" />

            <div className="relative mx-auto w-fit">
              <div className="absolute -inset-1.5 rounded-[1.75rem] bg-gradient-to-br from-blue-400 via-indigo-400 to-sky-400 opacity-70" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-blue-400/30 bg-[#020617] shadow-2xl shadow-blue-900/40">
                <Image
                  src={images.sofiane}
                  alt="Sofiane ASMA"
                  width={480}
                  height={560}
                  priority
                  className="h-auto w-full object-cover object-top"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
              </div>
            </div>

            <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-blue-400/25 bg-[#020617]/90 px-4 py-2 text-sm font-medium text-blue-200 shadow-lg backdrop-blur sm:-bottom-5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-[#22c55e]" />
              </span>
              Sofiane ASMA
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
