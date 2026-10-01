"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function NotFoundClient() {
  const t = useTranslations("notFound");
  const tn = useTranslations("nav");

  return (
    <div className="flex min-h-[70dvh] items-center justify-center px-4 pb-20 pt-32">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          404
        </p>
        <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
          {t("description")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="size-4 rtl:rotate-180" />
              {t("home")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/#projects">{tn("projects")}</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
