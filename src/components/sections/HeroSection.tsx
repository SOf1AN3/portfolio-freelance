"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/utils";
import { images } from "@/lib/images";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

type Stat = {
  value: string;
  label: string;
};

export function HeroSection() {
  const t = useTranslations("hero");
  const stats = t.raw("stats.items") as Stat[];

  return (
    <section className="relative flex min-h-[88dvh] items-center overflow-hidden pb-16 pt-28 lg:pb-20 lg:pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#020617]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(30,64,175,0.4),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,#020617_90%)]" />
      </div>

      <Container>
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
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
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-3 text-pretty text-lg text-blue-300/85 sm:text-xl"
            >
              {t("highlight")}
            </motion.p>

            <motion.p
              variants={item}
              className="mx-auto mt-5 max-w-2xl text-pretty text-base text-blue-200/70 sm:text-lg lg:mx-0 lg:text-xl"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
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

            <motion.dl
              variants={item}
              className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:max-w-2xl"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-start">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-bold text-blue-100 sm:text-3xl">
                    {stat.value}
                  </dd>
                  <dd className="mt-1 text-xs text-blue-200/60 sm:text-sm">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-sm lg:max-w-none"
          >
            <div className="relative mx-auto w-fit">
              <div className="absolute -inset-1 rounded-[1.5rem] bg-gradient-to-br from-blue-400/70 via-indigo-400/50 to-sky-400/60" />
              <div className="relative overflow-hidden rounded-[1.5rem] border border-blue-400/25 bg-[#020617] shadow-2xl shadow-blue-900/30">
                <Image
                  src={images.sofiane}
                  alt="Sofiane ASMA"
                  width={480}
                  height={560}
                  priority
                  className="h-auto w-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
