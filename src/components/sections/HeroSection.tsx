"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { sectionHref } from "@/lib/anchors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/utils";
import { images } from "@/lib/images";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { Reveal } from "@/components/animations/Reveal";
import { Counter } from "@/components/animations/Counter";
import { Parallax } from "@/components/animations/Parallax";

type ProfileSpec = {
  label: string;
  value: string;
};

type Profile = {
  label: string;
  role: string;
  description: string;
  specs: ProfileSpec[];
};

type Metric = {
  label: string;
  tag: string;
  value: string;
  unit: string;
  description: string;
};

/**
 * Décomposition d'une valeur textuelle de métrique (`04`, `+3`, `<24h`) en un
 * triplet exploitable par `Counter`. Les zéros de remplissage sont conservés
 * comme préfixe (`04` → prefix `0`, to `4`). Si le motif n'est pas exprimable
 * en nombre, la valeur brute est retournée et affichée sans compteur.
 */
type ParsedMetricValue =
  | { kind: "count"; to: number; prefix: string; suffix: string }
  | { kind: "raw"; text: string };

function parseMetricValue(value: string): ParsedMetricValue {
  const match = /^([^0-9]*)([0-9]+)([^0-9]*)$/.exec(value);
  if (!match) return { kind: "raw", text: value };

  const [, head = "", digits = "", tail = ""] = match;
  const to = Number(digits);
  if (!Number.isFinite(to)) return { kind: "raw", text: value };

  const paddingZeros = Math.max(digits.length - String(to).length, 0);
  const prefix = `${head}${"0".repeat(paddingZeros)}`;

  return { kind: "count", to, prefix, suffix: tail };
}

/**
 * Découpe le titre autour de son `&` pour l'afficher en `text-mist`
 * (la ponctuation typographique porte l'accent du bloc titre).
 */
function TitleWithAmpersand({ title }: { title: string }) {
  const ampIndex = title.indexOf("&");

  if (ampIndex === -1) return <>{title}</>;

  return (
    <>
      {title.slice(0, ampIndex)}
      <span className="font-normal text-mist">&amp;</span>
      {title.slice(ampIndex + 1)}
    </>
  );
}

export function HeroSection() {
  const t = useTranslations("hero");
  const profile = t.raw("profile") as Profile;
  const metrics = t.raw("metrics") as Metric[];
  const flagshipCount = metrics[0]?.value ?? "04";

  return (
    <section className="relative flex min-h-[88dvh] items-center overflow-hidden pb-16 pt-28 lg:pb-20 lg:pt-32">
      {/* Trame de points architecturale (40px), purement décorative. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Halo émeraude ambiant, dérivé en parallaxe. */}
      <Parallax
        amount={60}
        className="pointer-events-none absolute -top-40 end-10 h-[550px] w-[550px]"
      >
        <div className="h-full w-full rounded-full bg-emerald/5 blur-[140px]" />
      </Parallax>

      <Container className="relative z-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Colonne gauche — Titre maître & appels à l'action (7 colonnes) */}
          <div className="lg:col-span-7">
            <Stagger className="flex flex-col gap-5" stagger={0.09}>
              <StaggerItem>
                <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.25em] text-fog">
                  {t("eyebrow")}
                </p>
              </StaggerItem>

              <StaggerItem>
                <h1 className="text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight text-platinum md:text-5xl lg:text-[3.75rem]">
                  <TitleWithAmpersand title={t("title")} />
                </h1>
              </StaggerItem>

              <StaggerItem>
                <p className="font-mono text-xs uppercase leading-relaxed tracking-[0.2em] text-mist">
                  {t("highlight")}
                </p>
              </StaggerItem>

              <StaggerItem>
                <p className="max-w-2xl text-pretty text-base leading-relaxed text-mist sm:text-lg">
                  {t("subtitle")}
                </p>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Button
                    asChild
                    variant="default"
                    size="lg"
                    className="group w-full gap-2.5 sm:w-auto"
                  >
                    <a
                      href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("ctaPrimary")}
                      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="group w-full gap-3 sm:w-auto"
                  >
                    <Link href={sectionHref("projects")}>
                      {t("ctaSecondary")}
                      <span aria-hidden className="font-mono text-xs tracking-widest text-emerald">
                        [ {flagshipCount} ]
                      </span>
                      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </StaggerItem>
            </Stagger>
          </div>

          {/* Colonne droite — Carte « PROFIL INGÉNIEUR » (5 colonnes) */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <Reveal delay={0.2} className="w-full max-w-md">
              <div className="group w-full rounded-md border border-hairline bg-card p-6 shadow-2xl">
                <div className="mb-6 flex items-center border-b border-hairline pb-4">
                  <Badge variant="success">{profile.label}</Badge>
                </div>

                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                  <div className="relative w-28 shrink-0 overflow-hidden rounded-md border border-emerald/25 bg-deep sm:w-32">
                    <Image
                      src={images.sofiane}
                      alt="Portrait de Sofiane ASMA, Ingénieur Full-Stack"
                      width={128}
                      height={128}
                      priority
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-2 text-center sm:text-start">
                    <p className="font-mono text-xs uppercase leading-relaxed tracking-[0.12em] text-emerald">
                      {profile.role}
                    </p>
                    <p className="text-sm leading-relaxed text-mist">
                      {profile.description}
                    </p>
                  </div>
                </div>

                <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-hairline pt-5">
                  {profile.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex flex-col items-center gap-1 rounded-sm border border-hairline bg-deep px-2 py-2.5 text-center"
                    >
                      <dt className="font-mono text-[10px] uppercase leading-tight tracking-widest text-fog">
                        {spec.label}
                      </dt>
                      <dd className="font-mono text-xs font-semibold text-platinum">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Registre des métriques quantitatives */}
        <Stagger className="grid gap-4 pt-8 md:grid-cols-3" stagger={0.1}>
          {metrics.map((metric) => {
            const parsed = parseMetricValue(metric.value);
            const valueClassName =
              "font-display text-4xl font-bold leading-none tracking-tight text-platinum lg:text-5xl";

            return (
              <StaggerItem
                key={metric.label}
                className="flex h-full flex-col justify-between gap-4 rounded-md border border-hairline bg-card p-6 transition-colors duration-300 hover:border-emerald/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.2em] text-fog">
                    {metric.label}
                  </span>
                  <span className="font-mono text-[11px] tracking-widest text-emerald">
                    {metric.tag}
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {parsed.kind === "count" ? (
                    <Counter
                      to={parsed.to}
                      prefix={parsed.prefix}
                      suffix={parsed.suffix}
                      className={valueClassName}
                    />
                  ) : (
                    <span className={valueClassName}>{parsed.text}</span>
                  )}
                  <span className="font-mono text-[11px] uppercase leading-tight tracking-widest text-mist">
                    {metric.unit}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-fog">{metric.description}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
