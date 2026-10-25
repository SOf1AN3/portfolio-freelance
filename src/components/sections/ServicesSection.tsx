"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { sectionHref } from "@/lib/anchors";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/animations/Reveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { Magnetic } from "@/components/animations/Magnetic";

/** Structure verrouillée par `services.items[]` dans `src/messages/*.json`. */
type ServiceItem = {
  index: string;
  duration: string;
  title: string;
  description: string;
  features: string[];
  link?: string;
};

export function ServicesSection() {
  const t = useTranslations("services");
  // `t.raw()` renvoie `unknown` : la forme des données est garantie par les messages i18n.
  const items = t.raw("items") as ServiceItem[];

  return (
    <section
      id="services"
      className="scroll-mt-24 border-y border-hairline bg-deep py-24 lg:py-32"
    >
      <Container>
        <Reveal>
          <SectionHeader
            index={t("index")}
            title={t("title")}
            lead={t("subtitle")}
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-2" stagger={0.1}>
          {items.map((service) => (
            <StaggerItem key={service.title} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-md border border-hairline bg-card p-6 transition-colors duration-300 hover:border-emerald/40 focus-within:border-emerald/40 sm:p-7">
                {/* Balayage émeraude au survol (RTL : origine à droite). */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-emerald to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100 rtl:origin-right"
                />

                <div className="flex items-center justify-between gap-3 border-b border-hairline pb-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full bg-emerald"
                    />
                    <span className="truncate font-mono text-[11px] uppercase tracking-[0.18em] text-emerald">
                      {service.index}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-fog">
                    {service.duration}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl leading-snug text-platinum transition-colors duration-300 group-hover:text-emerald sm:text-2xl">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-mist">
                  {service.description}
                </p>

                <ul className="mt-6 divide-y divide-hairline border-t border-hairline">
                  {service.features.map((feature, featureIndex) => (
                    <li key={feature} className="flex items-center gap-3 py-2.5">
                      <span
                        aria-hidden="true"
                        className="font-mono text-[11px] text-fog"
                      >
                        {String(featureIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-mist">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={service.link ?? sectionHref("contact")}
                  className="mt-6 inline-flex items-center gap-2 self-start font-mono text-[11px] uppercase tracking-[0.18em] text-emerald transition-colors duration-300 hover:text-emerald-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
                >
                  {service.link ? t("discover") : t("cta")}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3.5 shrink-0 rtl:rotate-180"
                  />
                </Link>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-start border-t border-hairline pt-8">
            <Magnetic strength={0.35}>
              <Link
                href={sectionHref("contact")}
                className="inline-flex items-center gap-2 rounded-md border border-emerald/40 bg-emerald/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-emerald transition-colors duration-300 hover:bg-emerald hover:text-on-emerald focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
              >
                {t("cta")}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 shrink-0 rtl:rotate-180"
                />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
