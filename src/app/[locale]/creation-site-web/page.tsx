import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  BookOpen,
  Hammer,
  MonitorSmartphone,
  PenLine,
  Rocket,
  Search,
  Store,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { sectionHref } from "@/lib/anchors";
import { generateLocaleMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/utils";
import { Counter } from "@/components/animations/Counter";
import { Parallax } from "@/components/animations/Parallax";
import { Reveal } from "@/components/animations/Reveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { FaqSection } from "@/components/sections/FaqSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

type Props = {
  params: Promise<{ locale: string }>;
};

type TitledItem = {
  title: string;
  description: string;
};

const OFFER_PATH = "/creation-site-web";

const audienceIcons: LucideIcon[] = [Store, Stethoscope, Hammer, Users];
const deliverableIcons: LucideIcon[] = [
  PenLine,
  MonitorSmartphone,
  Search,
  Rocket,
  BookOpen,
];

/** Index de liste formaté sur deux chiffres : `1` → `01`. */
const toListIndex = (value: number): string => value.toString().padStart(2, "0");

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "websiteOffer" });

  return generateLocaleMetadata({
    locale,
    title: t("title"),
    description: t("subtitle"),
    ogTitle: t("ogTitle"),
    ogDescription: t("ogDescription"),
    path: OFFER_PATH,
  });
}

/**
 * En-tête de section : reprend la mise en page de `SectionHeader` (index mono
 * émeraude, titre `font-display`, lead `text-mist`) en y ajoutant l'`id`
 * attendu par `aria-labelledby` sur la `<section>` — `SectionHeader`
 * n'accepte pas d'`id`, l'utiliser casserait l'association accessible.
 */
function SectionHeading({
  id,
  index,
  title,
  subtitle,
}: {
  id: string;
  index: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald"
        >
          {index}
        </span>
        <span aria-hidden="true" className="h-px w-12 bg-hairline" />
      </div>
      <div className="flex flex-col gap-4">
        <h2
          id={id}
          className="font-display text-3xl font-semibold leading-[1.15] tracking-tight text-platinum md:text-4xl lg:text-[2.75rem]"
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="max-w-2xl leading-relaxed text-mist">{subtitle}</p>
        ) : null}
      </div>
    </header>
  );
}

function CtaButtons({
  primaryLabel,
  secondaryLabel,
  waMessage,
}: {
  primaryLabel: string;
  secondaryLabel: string;
  waMessage: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <Button
        asChild
        variant="default"
        size="lg"
        className="w-full sm:w-auto"
      >
        <Link href={sectionHref("contact")}>
          {primaryLabel}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="w-full sm:w-auto"
      >
        <a
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsappIcon className="size-4" />
          {secondaryLabel}
        </a>
      </Button>
    </div>
  );
}

// TODO(tarifs) : renseigner le tarif de départ d'un site vitrine dans
// `websiteOffer.options.pricing.note` (messages/*.json) dès qu'il est défini.
// Ne jamais afficher un montant inventé : laisser la note actuelle tant que
// les tarifs ne sont pas arrêtés.
export default async function CreationSiteWebPage({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "websiteOffer" });

  // Message WhatsApp pré-rempli, adapté à la page (offre site web) et à la langue.
  const waMessage =
    locale === "ar"
      ? "مرحباً سفيان، لدي مشروع إنشاء موقع لمؤسستي"
      : locale === "en"
        ? "Hi Sofiane, I need a website for my business"
        : "Bonjour Sofiane, je souhaite créer un site pour mon entreprise";

  const audienceItems = t.raw("audience.items") as TitledItem[];
  const problemItems = t.raw("problems.items") as string[];
  const deliverableItems = t.raw("deliverables.items") as TitledItem[];
  const optionItems = t.raw("options.items") as TitledItem[];
  const stepItems = t.raw("steps.items") as TitledItem[];

  return (
    <>
      {/* Bandeau hero */}
      <div className="pt-28 pb-16 lg:pt-32 lg:pb-20">
        <Container>
          <Reveal>
            <header className="mx-auto max-w-3xl text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald">
                SEC. WEB / OFFRE
              </p>
              <div className="mt-5 flex justify-center">
                <Badge variant="success">{t("badge")}</Badge>
              </div>
              <h1 className="mt-5 text-balance font-display text-4xl font-semibold tracking-tight text-platinum lg:text-5xl">
                {t("title")}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-mist">
                {t("subtitle")}
              </p>
            </header>
          </Reveal>
          <div className="mx-auto mt-8 max-w-3xl">
            <CtaButtons
              primaryLabel={t("ctaPrimary")}
              secondaryLabel={t("ctaSecondary")}
              waMessage={waMessage}
            />
          </div>
        </Container>
      </div>

      {/* 01 — Audience */}
      <section
        aria-labelledby="audience"
        className="border-y border-hairline bg-deep py-24 lg:py-32"
      >
        <Container>
          <Reveal>
            <SectionHeading
              id="audience"
              index="01"
              title={t("audience.title")}
              subtitle={t("audience.subtitle")}
            />
          </Reveal>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2">
            {audienceItems.map((item, i) => {
              const Icon = audienceIcons[i] ?? Store;
              return (
                <StaggerItem key={item.title} className="h-full">
                  <Card className="h-full p-6 transition-colors hover:border-emerald/30">
                    <div>
                      <span className="mb-4 inline-flex size-10 items-center justify-center rounded-md border border-emerald/30 bg-emerald/10 text-emerald">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <h3 className="font-display text-lg font-semibold tracking-tight text-platinum">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-mist">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </section>

      {/* 02 — Problèmes */}
      <section
        aria-labelledby="problems"
        className="bg-canvas py-24 lg:py-32"
      >
        <Container>
          <Reveal>
            <SectionHeading id="problems" index="02" title={t("problems.title")} />
          </Reveal>
          <Reveal className="mt-8 max-w-3xl">
            <ul className="divide-y divide-hairline border-y border-hairline">
              {problemItems.map((item, i) => (
                <li key={item} className="flex items-start gap-4 py-4">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 font-mono text-xs tracking-widest text-emerald"
                  >
                    {toListIndex(i + 1)}
                  </span>
                  <span className="min-w-0 leading-relaxed text-mist">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* 03 — Délivrables */}
      <section
        aria-labelledby="deliverables"
        className="border-y border-hairline bg-deep py-24 lg:py-32"
      >
        <Container>
          <Reveal>
            <SectionHeading
              id="deliverables"
              index="03"
              title={t("deliverables.title")}
            />
          </Reveal>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {deliverableItems.map((item, i) => {
              const Icon = deliverableIcons[i] ?? PenLine;
              return (
                <StaggerItem key={item.title} className="h-full">
                  <Card className="h-full p-6 transition-colors hover:border-emerald/30">
                    <div>
                      <span className="mb-4 inline-flex size-10 items-center justify-center rounded-md border border-emerald/30 bg-emerald/10 text-emerald">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <h3 className="font-display text-lg font-semibold tracking-tight text-platinum">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-mist">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </section>

      {/* 04 — Options */}
      <section aria-labelledby="options" className="bg-canvas py-24 lg:py-32">
        <Container>
          <Reveal>
            <SectionHeading
              id="options"
              index="04"
              title={t("options.title")}
              subtitle={t("options.subtitle")}
            />
          </Reveal>
          <Reveal className="mt-8 max-w-3xl">
            <ul className="divide-y divide-hairline border-y border-hairline">
              {optionItems.map((item, i) => (
                <li key={item.title} className="flex items-start gap-4 py-5">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 font-mono text-xs tracking-widest text-emerald"
                  >
                    {toListIndex(i + 1)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-semibold tracking-tight text-platinum">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-mist">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="mt-8 max-w-3xl">
            <div className="rounded-md border border-emerald/30 bg-card p-6 sm:p-8">
              <h3 className="font-display text-lg font-semibold tracking-tight text-platinum">
                {t("options.pricing.title")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">
                {t("options.pricing.note")}
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 05 — Étapes */}
      <section
        aria-labelledby="steps"
        className="border-y border-hairline bg-deep py-24 lg:py-32"
      >
        <Container>
          <Reveal>
            <SectionHeading id="steps" index="05" title={t("steps.title")} />
          </Reveal>
          <Reveal className="mt-10 max-w-3xl">
            <ol className="divide-y divide-hairline border-y border-hairline">
              {stepItems.map((step, i) => (
                <li key={step.title} className="flex items-start gap-4 py-5">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 font-mono text-xs tracking-widest text-emerald"
                  >
                    <Counter to={i + 1} prefix={i + 1 < 10 ? "0" : ""} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-platinum">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-mist">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </section>

      <FaqSection bordered={false} />

      {/* Bandeau CTA final */}
      <section
        aria-labelledby="final-cta"
        className="border-t border-hairline bg-deep py-24 lg:py-32"
      >
        <Container>
          <Reveal className="mx-auto max-w-3xl">
            <div className="relative overflow-hidden rounded-md border border-emerald/30 bg-card p-8 text-center sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
              >
                <Parallax amount={40} className="w-full">
                  <div className="mx-auto size-72 rounded-full bg-emerald/10 blur-3xl" />
                </Parallax>
              </div>
              <div className="relative">
                <h2
                  id="final-cta"
                  className="text-balance font-display text-3xl font-semibold leading-[1.15] tracking-tight text-platinum md:text-4xl lg:text-[2.75rem]"
                >
                  {t("cta.title")}
                </h2>
                <p className="mt-4 leading-relaxed text-mist">
                  {t("cta.description")}
                </p>
                <div className="mt-8">
                  <CtaButtons
                    primaryLabel={t("cta.form")}
                    secondaryLabel={t("cta.whatsapp")}
                    waMessage={waMessage}
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
