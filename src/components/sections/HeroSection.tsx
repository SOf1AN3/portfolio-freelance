"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { sectionHref } from "@/lib/anchors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/utils";
import { images } from "@/lib/images";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";

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
      <Container>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col items-center text-center"
        >
          <motion.div variants={item} className="relative">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-blue-500/60 via-indigo-500/40 to-sky-500/50 blur-md" />
            <div className="relative size-24 overflow-hidden rounded-full border-2 border-blue-400/40 bg-[#020617] shadow-2xl shadow-blue-900/40 sm:size-28">
              <Image
                src={images.sofiane}
                alt="Sofiane ASMA"
                width={112}
                height={112}
                priority
                className="h-full w-full object-cover object-top"
              />
            </div>
            <span className="absolute bottom-1 end-1 size-4 rounded-full border-[3px] border-[#020617] bg-[#22c55e]" />
          </motion.div>

          <motion.div variants={item} className="mt-6">
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
            className="mt-5 max-w-2xl text-pretty text-base text-blue-200/70 sm:text-lg lg:text-xl"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
          >
            <Button asChild variant="whatsapp" size="lg" className="w-full sm:w-auto">
              <a
                href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("ctaPrimary")}
                <WhatsappIcon className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href={sectionHref("projects")}>
                {t("ctaSecondary")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
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
      </Container>
    </section>
  );
}
