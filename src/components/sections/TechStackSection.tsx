"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { techGroups } from "@/content/techStackData";

export function TechStackSection() {
  const t = useTranslations("tech");

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="outline" className="mb-4">
            {t("title")}
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("subtitle")}
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {techGroups.map((group, gi) => {
            const CategoryIcon = group.icon;

            return (
              <motion.article
                key={group.category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: gi * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${group.accent.glow} via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100`}
                />

                <div className="relative flex items-center gap-3">
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${group.accent.tile}`}
                  >
                    <CategoryIcon className="size-5" />
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider">
                    {t(`categories.${group.category}`)}
                  </h3>
                  <span className="ms-auto text-xs tabular-nums text-muted-foreground">
                    {group.items.length}
                  </span>
                </div>

                <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(`categoryDescriptions.${group.category}`)}
                </p>

                <ul className="relative mt-5 space-y-2">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;

                    return (
                      <li
                        key={item.name}
                        className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/40 px-3 py-2.5 transition-colors hover:border-border hover:bg-background/70"
                      >
                        <ItemIcon
                          className="size-4 shrink-0"
                          style={{ color: item.color }}
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 flex flex-col items-start gap-6 rounded-2xl border border-primary/30 bg-primary/5 p-6 transition-colors hover:border-primary/50 sm:flex-row sm:items-center sm:p-8"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageCircle className="size-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold">{t("cta.title")}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t("cta.description")}
            </p>
          </div>

          <Button asChild variant="outline" className="shrink-0">
            <a href="#contact">
              {t("cta.action")}
              <ArrowRight className="rtl:rotate-180" />
            </a>
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}