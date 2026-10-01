"use client";

import { useTranslations } from "next-intl";
import { Mail, MapPin } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { WHATSAPP_NUMBER, whatsappLink } from "@/lib/utils";
import { CONTACT_EMAIL } from "@/lib/contact";
import { SOCIAL_LINKS } from "@/lib/socials";
import { projects } from "@/content/projectsData";

type FooterProps = {
  locale: string;
};

export function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const tp = useTranslations("projects");

  const year = new Date().getFullYear();
  const waMessage =
    locale === "ar"
      ? "مرحباً سفيان، لدي مشروع ويب/جوال"
      : locale === "en"
        ? "Hi Sofiane, I have a web/mobile project"
        : "Bonjour Sofiane, j'ai un projet web/mobile";

  return (
    <footer className="border-t border-border bg-card/50">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <span className="block text-lg font-bold">Sofiane ASMA</span>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href={whatsappLink(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-[#22c55e]/10 hover:text-[#22c55e]"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tn("home")}
                </Link>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tn("services")}
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tn("projects")}
                </a>
              </li>
              <li>
                <a
                  href="#process"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tn("process")}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tn("contact")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("projects")}
            </h3>
            <ul className="space-y-2.5">
              {projects.map((project) => {
                const title = tp(
                  project.titleKey.replace("projects.", ""),
                );
                return (
                  <li key={project.slug}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("contactTitle")}
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-colors hover:text-foreground"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 text-[#22c55e]" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span dir="ltr">+{WHATSAPP_NUMBER}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Algeria · Remote worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {year} Sofiane ASMA. {t("rights")}
          </p>
          <p className="text-sm text-muted-foreground">{t("builtWith")}</p>
        </div>
      </Container>
    </footer>
  );
}
