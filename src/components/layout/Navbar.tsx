"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, MessageCircle } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn, whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/utils";
import { useSmoothAnchors, scrollToId } from "@/lib/scrollTo";

const navItems = [
  { href: "#services", key: "services" },
  { href: "#projects", key: "projects" },
  { href: "#process", key: "process" },
  { href: "#about", key: "about" },
  { href: "#contact", key: "contact" },
] as const;

type NavbarProps = {
  locale: Locale;
};

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("nav");
  const th = useTranslations("hero");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useSmoothAnchors();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleAnchorClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    event.preventDefault();
    setOpen(false);
    const id = href.replace(/^#/, "");
    window.setTimeout(() => scrollToId(id), open ? 220 : 0);
  }

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

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={(e) => handleAnchorClick(e, item.href)}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t(item.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} className="hidden sm:inline-flex" />

          <Button asChild size="sm" className="hidden md:inline-flex">
            <a
              href="#contact"
              onClick={(e) => handleAnchorClick(e, "#contact")}
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
            <SheetContent side={locale === "ar" ? "left" : "right"} className="flex w-[300px] flex-col p-0">
              <SheetHeader className="border-b border-border p-6">
                <SheetTitle className="text-lg font-bold">
                  Sofiane ASMA
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6">
                <nav className="flex flex-col gap-1">
                  <AnimatePresence>
                    {navItems.map((item, i) => (
                      <motion.a
                        key={item.key}
                        href={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={(e) => handleAnchorClick(e, item.href)}
                        className="rounded-lg px-3 py-3 text-base text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        {t(item.key)}
                      </motion.a>
                    ))}
                  </AnimatePresence>
                </nav>
              </div>

              <div className="flex flex-col gap-3 border-t border-border p-6">
                <LanguageSwitcher locale={locale} className="w-full justify-between" />
                <Button asChild className="w-full">
                  <a
                    href="#contact"
                    onClick={(e) => handleAnchorClick(e, "#contact")}
                  >
                    {th("ctaPrimary")}
                  </a>
                </Button>
                <Button asChild variant="whatsapp" className="w-full">
                  <a
                    href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="size-4" />
                    {th("ctaSecondary")}
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
