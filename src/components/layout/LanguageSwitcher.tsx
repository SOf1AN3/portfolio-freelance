"use client";

import { Check, Languages } from "lucide-react";
import { useTranslations } from "next-intl";

import { routing, localeNames, localeFlags, type Locale } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  locale: Locale;
  className?: string;
};

export function LanguageSwitcher({ locale, className }: LanguageSwitcherProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-2", className)}
          aria-label={t("language")}
        >
          <Languages className="size-4" />
          <span className="hidden sm:inline">{localeNames[locale]}</span>
          <span className="sm:hidden">{localeFlags[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {routing.locales.map((l) => {
          const isActive = l === locale;

          return (
            <DropdownMenuItem key={l} asChild>
              <Link
                href={pathname}
                locale={l}
                hrefLang={l}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex items-center justify-between gap-2",
                  isActive && "font-semibold text-primary",
                )}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden>{localeFlags[l]}</span>
                  <span>{localeNames[l]}</span>
                </span>
                {isActive ? (
                  <Check className="size-4" aria-hidden />
                ) : null}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}