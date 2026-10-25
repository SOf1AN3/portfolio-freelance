"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { sectionHref, type SectionId } from "@/lib/anchors";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn, whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/utils";

const navItems = [
  { id: "services", key: "services" },
  { id: "projects", key: "projects" },
  { id: "process", key: "process" },
  { id: "about", key: "about" },
  { id: "contact", key: "contact" },
] as const satisfies readonly { id: SectionId; key: string }[];

/** Seuil (px) au-delà duquel l'en-tête bascule en mode « scrolé ». */
const SCROLL_THRESHOLD = 24;

/** Identifiant partagé entre le déclencheur du menu mobile et son panneau. */
const MOBILE_MENU_ID = "mobile-nav-sheet";

/** Soulignement émeraude animé (scaleX 0 → 1) des liens de navigation. */
const underlineClassName =
  "after:absolute after:inset-x-3 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-emerald after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100 rtl:after:origin-right";

const navLinkClassName = cn(
  "relative px-3 py-2 text-sm text-mist transition-colors duration-200 hover:text-platinum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald",
  underlineClassName,
);

const mobileLinkClassName =
  "block rounded-md border-b border-hairline/60 px-1 py-3 text-base text-mist transition-colors duration-200 hover:text-platinum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald";

type NavbarProps = {
  locale: Locale;
};

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("nav");
  const th = useTranslations("hero");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Barre de progression du scroll : montée ici, une seule fois dans le projet. */}
      <ScrollProgress />

      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full border-b transition-colors duration-300 backdrop-blur-xl",
          scrolled
            ? "border-hairline bg-canvas/85"
            : "border-transparent bg-canvas/60",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-3">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
          >
            <span className="font-display text-lg font-bold tracking-tight text-platinum">
              SOFIANE ASMA
            </span>
          </Link>

          <nav className="hidden items-center xl:flex" aria-label={t("mainNav")}>
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={sectionHref(item.id)}
                className={navLinkClassName}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher locale={locale} className="hidden sm:inline-flex" />

            <Button
              asChild
              variant="whatsapp"
              size="sm"
              className="hidden md:inline-flex"
            >
              <a
                href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {th("ctaPrimary")}
              </a>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="xl:hidden"
                  aria-label={t("menu")}
                  aria-expanded={open}
                  aria-controls={open ? MOBILE_MENU_ID : undefined}
                >
                  {open ? (
                    <X className="size-5" aria-hidden="true" />
                  ) : (
                    <Menu className="size-5" aria-hidden="true" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                id={MOBILE_MENU_ID}
                side={locale === "ar" ? "left" : "right"}
                className="flex w-[300px] flex-col p-0"
              >
                <SheetHeader className="border-b border-hairline p-6">
                  <SheetTitle className="flex items-center gap-2">
                    SOFIANE ASMA
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6">
                  <nav className="flex flex-col" aria-label={t("mainNav")}>
                    {navItems.map((item, i) => (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, x: locale === "ar" ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={sectionHref(item.id)}
                          onClick={() => setOpen(false)}
                          className={mobileLinkClassName}
                        >
                          {t(item.key)}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                <div className="flex flex-col gap-3 border-t border-hairline p-6">
                  <LanguageSwitcher
                    locale={locale}
                    className="w-full justify-between"
                  />
                  <Button asChild variant="whatsapp" className="w-full">
                    <a
                      href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                    >
                      {th("ctaPrimary")}
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href={sectionHref("projects")}
                      onClick={() => setOpen(false)}
                    >
                      {th("ctaSecondary")}
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </motion.header>
    </>
  );
}
