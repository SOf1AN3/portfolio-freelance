"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";
import { ArrowLeft } from "lucide-react";

/**
 * Écran 404 « Obsidian Atelier » : grand code 404 en fond (décoratif),
 * micro-index mono, titre + description traduits et deux actions.
 * Les animations `Reveal` / `Stagger` neutralisent elles-mêmes le mouvement
 * lorsque l'utilisateur préfère un rendu réduit (`prefers-reduced-motion`).
 */
export function NotFoundClient() {
  const t = useTranslations("notFound");
  const tw = useTranslations("whatsappButton");

  return (
    <section
      aria-labelledby="not-found-title"
      className="relative isolate flex min-h-[78dvh] items-center overflow-hidden pb-24 pt-32"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex select-none items-center justify-center font-display text-8xl tracking-tight text-platinum/10 lg:text-9xl"
      >
        404
      </span>

      <Reveal className="w-full">
        <Container className="text-center">
          <Stagger className="flex flex-col items-center gap-6" stagger={0.1}>
            <StaggerItem>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald">
                ERR.404
              </p>
            </StaggerItem>

            <StaggerItem>
              <h1
                id="not-found-title"
                className="text-balance font-display text-4xl tracking-tight text-platinum lg:text-5xl"
              >
                {t("title")}
              </h1>
            </StaggerItem>

            <StaggerItem>
              <p className="mx-auto max-w-md text-pretty leading-relaxed text-mist">
                {t("description")}
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild variant="default" size="lg">
                  <Link href="/">
                    <ArrowLeft className="size-4 rtl:rotate-180" />
                    {t("home")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a
                    href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsappIcon className="size-4" />
                    {tw("label")}
                  </a>
                </Button>
              </div>
            </StaggerItem>
          </Stagger>
        </Container>
      </Reveal>
    </section>
  );
}
