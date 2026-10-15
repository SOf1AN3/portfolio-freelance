import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  BookOpen,
  CircleCheck,
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
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { FaqSection } from "@/components/sections/FaqSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

function SectionHeading({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2
        id={id}
        className="text-balance text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
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
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Button asChild size="lg">
        <Link href={sectionHref("contact")}>
          {primaryLabel}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </Button>
      <Button asChild variant="whatsapp" size="lg">
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
    <Container className="pt-28 pb-20 lg:pt-32 lg:pb-28">
      <header className="mx-auto max-w-3xl text-center">
        <Badge variant="outline">{t("badge")}</Badge>
        <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          {t("subtitle")}
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-3xl">
        <CtaButtons
          primaryLabel={t("ctaPrimary")}
          secondaryLabel={t("ctaSecondary")}
          waMessage={waMessage}
        />
      </div>

      <section aria-labelledby="audience" className="mt-16 lg:mt-24">
        <SectionHeading
          id="audience"
          title={t("audience.title")}
          subtitle={t("audience.subtitle")}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {audienceItems.map((item, i) => {
            const Icon = audienceIcons[i] ?? Store;
            return (
              <Card key={item.title}>
                <CardContent className="p-6">
                  <span className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="problems" className="mt-16 lg:mt-24">
        <SectionHeading id="problems" title={t("problems.title")} />
        <ul className="mx-auto mt-8 max-w-3xl space-y-4">
          {problemItems.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CircleCheck
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-[#22c55e]"
              />
              <span className="leading-relaxed text-muted-foreground">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="deliverables" className="mt-16 lg:mt-24">
        <SectionHeading id="deliverables" title={t("deliverables.title")} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deliverableItems.map((item, i) => {
            const Icon = deliverableIcons[i] ?? PenLine;
            return (
              <Card key={item.title}>
                <CardContent className="p-6">
                  <span className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="options" className="mt-16 lg:mt-24">
        <SectionHeading
          id="options"
          title={t("options.title")}
          subtitle={t("options.subtitle")}
        />
        <ul className="mx-auto mt-8 max-w-3xl space-y-5">
          {optionItems.map((item) => (
            <li key={item.title}>
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
        <Card className="mx-auto mt-8 max-w-3xl bg-muted/50">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-lg font-semibold">
              {t("options.pricing.title")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("options.pricing.note")}
            </p>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="steps" className="mt-16 lg:mt-24">
        <SectionHeading id="steps" title={t("steps.title")} />
        <ol className="mx-auto mt-10 max-w-3xl space-y-6">
          {stepItems.map((step, i) => (
            <li key={step.title} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <FaqSection />

      <section aria-labelledby="final-cta" className="mt-4 lg:mt-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
          <h2
            id="final-cta"
            className="text-balance text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
          >
            {t("cta.title")}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
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
      </section>
    </Container>
  );
}
