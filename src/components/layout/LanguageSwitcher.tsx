"use client";

import { useTranslations } from "next-intl";
import { Languages } from "lucide-react";

import { routing, localeNames, localeFlags, type Locale } from "@/i18n/routing";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
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
  const router = useRouter();

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
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onSelect={() => {
              router.replace(pathname, { locale: l });
            }}
            className={cn(
              "flex items-center justify-between gap-2",
              l === locale && "font-semibold text-primary",
            )}
          >
            <span className="flex items-center gap-2">
              <span>{localeFlags[l]}</span>
              <span>{localeNames[l]}</span>
            </span>
            <Link
              href={pathname}
              locale={l}
              className="absolute inset-0"
              aria-label={localeNames[l]}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
