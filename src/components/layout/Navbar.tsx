"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { sectionHref, type SectionId } from "@/lib/anchors";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn, whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/utils";

const navItems = [
  { id: "services", key: "services" },
  { id: "projects", key: "projects" },
  { id: "process", key: "process" },
  { id: "about", key: "about" },
  { id: "contact", key: "contact" },
] as const satisfies readonly { id: SectionId; key: string }[];

type NavbarProps = {
  locale: Locale;
};

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("nav");
  const th = useTranslations("hero");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          Sofiane ASMA
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t("mainNav")}>
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={sectionHref(item.id)}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} className="hidden sm:inline-flex" />

          <Button asChild variant="whatsapp" size="sm" className="hidden md:inline-flex">
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
                className="lg:hidden"
                aria-label={t("menu")}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={locale === "ar" ? "left" : "right"}
              className="flex w-[300px] flex-col p-0"
            >
              <SheetHeader className="border-b border-border p-6">
                <SheetTitle className="text-lg font-bold">
                  Sofiane ASMA
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6">
                <nav
                  className="flex flex-col gap-1"
                  aria-label={t("mainNav")}
                >
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
                        className="block rounded-lg px-3 py-3 text-base text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        {t(item.key)}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              <div className="flex flex-col gap-3 border-t border-border p-6">
                <LanguageSwitcher locale={locale} className="w-full justify-between" />
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
                  <Link href={sectionHref("projects")} onClick={() => setOpen(false)}>
                    {th("ctaSecondary")}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
