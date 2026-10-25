"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { sectionHref } from "@/lib/anchors";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/animations/Reveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { whatsappLink } from "@/lib/utils";
import { CONTACT_EMAIL } from "@/lib/contact";
import { SOCIAL_LINKS } from "@/lib/socials";

type FooterProps = {
  locale: string;
};

/** Soulignement émeraude animé (scaleX 0 → 1) des liens de la colonne. */
const underlineClassName =
  "relative inline-block py-0.5 text-sm text-mist transition-colors duration-200 hover:text-platinum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-emerald after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100 rtl:after:origin-right";

const microLabelClassName =
  "font-mono text-xs uppercase tracking-widest text-fog";

export function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  /** Liens de navigation internes : accueil, offre éditoriale et sections. */
  const navLinks = [
    { id: "home", label: tn("home"), href: "/" },
    { id: "websiteOffer", label: t("websiteOffer"), href: "/creation-site-web" },
    { id: "services", label: tn("services"), href: sectionHref("services") },
    { id: "projects", label: tn("projects"), href: sectionHref("projects") },
    { id: "process", label: tn("process"), href: sectionHref("process") },
    { id: "about", label: tn("about"), href: sectionHref("about") },
    { id: "contact", label: tn("contact"), href: sectionHref("contact") },
  ];

  const year = new Date().getFullYear();
  const waMessage =
    locale === "ar"
      ? "مرحباً سفيان، لدي مشروع ويب/جوال"
      : locale === "en"
        ? "Hi Sofiane, I have a web/mobile project"
        : "Bonjour Sofiane, j'ai un projet web/mobile";

  const socialLinks = [
    { id: "linkedin", label: "LinkedIn", href: SOCIAL_LINKS.linkedin, external: true },
    { id: "github", label: "GitHub", href: SOCIAL_LINKS.github, external: true },
    { id: "whatsapp", label: "WhatsApp", href: whatsappLink(waMessage), external: true },
    { id: "email", label: "Email", href: `mailto:${CONTACT_EMAIL}`, external: false },
  ];

  return (
    <footer className="border-t border-hairline bg-deep">
      <Container className="py-16">
        {/* Filet supérieur + micro-index technique. */}
        <div className="mb-10 flex items-center gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald">
            SEC. FIN
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-hairline" />
        </div>

        <Reveal>
          <Stagger className="grid gap-10 md:grid-cols-12" stagger={0.1}>
            <StaggerItem className="flex flex-col gap-4 md:col-span-6">
              <span className="font-display text-2xl font-bold tracking-tight text-platinum">
                SOFIANE ASMA
              </span>
              <p className="max-w-md text-sm leading-relaxed text-mist">
                {t("tagline")}
              </p>
              <p className="font-mono text-xs text-mist">Algérie · Remote</p>
              <p className="font-mono text-xs text-mist">
                © {year} Sofiane ASMA. {t("rights")}
              </p>
            </StaggerItem>

            <StaggerItem className="flex flex-col gap-4 md:col-span-3">
              <h2 className={microLabelClassName}>{t("quickLinks")}</h2>
              <nav aria-label={t("quickLinks")}>
                <ul className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <li key={link.id}>
                      <Link href={link.href} className={underlineClassName}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </StaggerItem>

            <StaggerItem className="flex flex-col gap-4 md:col-span-3">
              <h2 className={microLabelClassName}>{t("contactTitle")}</h2>
              <ul className="flex flex-col">
                {socialLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="group flex items-center justify-between gap-3 border-b border-hairline py-2.5 font-mono text-xs text-mist transition-colors duration-200 hover:text-platinum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-3.5 shrink-0 text-fog opacity-70 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          </Stagger>
        </Reveal>

      </Container>
    </footer>
  );
}
