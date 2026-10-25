"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { sectionHref } from "@/lib/anchors";
import { images } from "@/lib/images";
import { Reveal } from "@/components/animations/Reveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { Parallax } from "@/components/animations/Parallax";
import { Magnetic } from "@/components/animations/Magnetic";

const EXPERTISE_KEYS = ["web", "desktop", "mobile"] as const;

/** Micro-index ledger : « 01 », « 02 », … */
const ledgerIndex = (position: number): string =>
  String(position).padStart(2, "0");

export function AboutSection() {
  const t = useTranslations("about");
  const tContact = useTranslations("contact");
  const highlights = t.raw("highlights") as string[];

  return (
    <section id="about" className="scroll-mt-16 py-24 lg:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Colonne gauche — portrait encadré + bloc identitaire mono */}
          <Reveal delay={0} className="lg:col-span-5">
            <div className="flex flex-col gap-5">
              <div className="overflow-hidden rounded-md border border-hairline bg-card p-1.5">
                <div className="overflow-hidden rounded border border-emerald/25">
                  <Parallax amount={20} className="grid aspect-[4/5] overflow-hidden">
                    <Image
                      src={images.sofiane}
                      alt="Sofiane ASMA — Ingénieur Full-Stack"
                      width={1024}
                      height={1280}
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="-mt-[30px] h-[calc(100%_+_60px)] w-full object-cover object-top"
                    />
                  </Parallax>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 border-t border-hairline pt-4 font-mono">
                <span className="text-xs uppercase tracking-[0.2em] text-emerald">
                  {t("role")}
                </span>
                <span className="text-[11px] uppercase tracking-[0.15em] text-fog">
                  {tContact("coordinates.reach")}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Colonne droite — discours éditorial + ledger d'engagements */}
          <Reveal delay={0.15} className="lg:col-span-7">
            <SectionHeader
              index={t("index")}
              title={t("title")}
              lead={t("subtitle")}
            />

            <p className="mt-8 text-pretty text-lg leading-relaxed text-mist">
              {t("description")}
            </p>

            <Stagger className="mt-10">
              <ul className="border-b border-hairline">
                {highlights.map((highlight, i) => (
                  <li key={highlight} className="border-t border-hairline">
                    <StaggerItem className="flex items-start gap-4 py-4">
                      <span
                        aria-hidden="true"
                        className="w-7 shrink-0 pt-0.5 font-mono text-xs tracking-widest text-emerald"
                      >
                        {ledgerIndex(i + 1)}
                      </span>
                      <span className="text-mist">{highlight}</span>
                    </StaggerItem>
                  </li>
                ))}
              </ul>
            </Stagger>

            <ul className="mt-8 flex flex-wrap gap-2">
              {EXPERTISE_KEYS.map((key) => (
                <li
                  key={key}
                  className="rounded-sm border border-hairline bg-card px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-mist"
                >
                  {t(`expertise.${key}`)}
                </li>
              ))}
            </ul>

            <Magnetic className="mt-8 inline-block">
              <Button asChild variant="outline" size="lg">
                <Link href={sectionHref("contact")}>
                  {t("cta")}
                  <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
            </Magnetic>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
