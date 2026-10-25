"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Link } from "@/i18n/navigation";
import { sectionHref } from "@/lib/anchors";
import { Counter } from "@/components/animations/Counter";
import { Marquee } from "@/components/animations/Marquee";
import { Reveal } from "@/components/animations/Reveal";
import { techGroups } from "@/content/techStackData";

export function TechStackSection() {
  const t = useTranslations("tech");
  const locale = useLocale();

  // Rail du Marquee : une seule occurrence par technologie (les doublons
  // transverses — Java, Python, Flutter… — sont affichés une fois).
  const marqueeNames = Array.from(
    new Set(
      techGroups.flatMap((group) => group.items.map((item) => item.name)),
    ),
  );

  return (
    <section className="border-y border-hairline bg-deep py-24 lg:py-32">
      <Container>
        <Reveal>
          <SectionHeader
            index={t("index")}
            title={t("title")}
            lead={t("subtitle")}
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {techGroups.map((group, index) => {
            // Décomposition de la chaîne ICU : seul le nombre (formaté pour la
            // locale active, chiffres arabes compris) est remplacé par le
            // <Counter> — le libellé traduit reste identique. Si le nombre
            // n'est pas isolable, on affiche la chaîne entière sans compteur.
            const countLabel = t("pillarCount", { count: group.items.length });
            const countToken = new Intl.NumberFormat(locale).format(
              group.items.length,
            );
            const tokenIndex = countLabel.indexOf(countToken);
            const hasCounter = tokenIndex >= 0;
            const countBefore = hasCounter ? countLabel.slice(0, tokenIndex) : "";
            const countAfter = hasCounter
              ? countLabel.slice(tokenIndex + countToken.length)
              : "";

            return (
              <Reveal
                key={group.category}
                delay={index * 0.06}
                className="h-full"
              >
                <article className="flex h-full flex-col gap-4 rounded-md border border-hairline bg-card p-6">
                  <div className="flex items-center justify-between gap-3 border-b border-hairline pb-3">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald">
                      {t(`categories.${group.category}`)}
                    </h3>
                    <span className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-fog">
                      {hasCounter ? (
                        <>
                          {countBefore}
                          <Counter to={group.items.length} />
                          {countAfter}
                        </>
                      ) : (
                        countLabel
                      )}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-mist">
                    {t(`categoryDescriptions.${group.category}`)}
                  </p>

                  <ul className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;

                      return (
                        <li
                          key={item.name}
                          className="inline-flex items-center gap-1.5 rounded-sm border border-hairline bg-deep px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-fog transition-colors duration-200 hover:border-emerald/40 hover:text-mist"
                        >
                          <ItemIcon
                            aria-hidden="true"
                            className="size-3.5 shrink-0"
                            style={{ color: item.color }}
                          />
                          {item.name}
                        </li>
                      );
                    })}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Rail défilant : contenu déjà listé ci-dessus, masqué au lecteur
            d'écran. `dir="ltr"` fige le sens du rail (noms de technologies
            latins) pour que la boucle reste sans couture en locale ar. */}
        <div
          aria-hidden="true"
          dir="ltr"
          className="mt-12 border-t border-hairline pt-8"
        >
          <Marquee speed={40} pauseOnHover>
            {marqueeNames.map((name) => (
              <span
                key={name}
                className="me-8 font-mono text-xs uppercase tracking-[0.2em] text-mist"
              >
                {name}
              </span>
            ))}
          </Marquee>
        </div>

        <Reveal delay={0.1} className="mt-12">
          <div className="group flex flex-col gap-4 rounded-md border border-hairline bg-card p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-1">
              <p className="font-display text-lg text-platinum">
                {t("cta.title")}
              </p>
              <p className="text-sm leading-relaxed text-mist">
                {t("cta.description")}
              </p>
            </div>

            <Link
              href={sectionHref("contact")}
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-sm border border-emerald/40 bg-emerald/10 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-emerald transition-colors duration-300 hover:bg-emerald/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
            >
              {t("cta.action")}
              <ArrowRight
                aria-hidden="true"
                className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
