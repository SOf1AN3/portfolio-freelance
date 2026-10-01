"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Globe,
  Smartphone,
  Gauge,
  Wrench,
  ArrowRight,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

const icons = [Globe, Smartphone, Gauge, Wrench];

export function ServicesSection() {
  const t = useTranslations("services");
  const items = t.raw("items") as {
    title: string;
    description: string;
    features: string[];
  }[];

  return (
    <section id="services" className="scroll-mt-20 py-20 lg:py-28">
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

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {items.map((service, i) => {
            const Icon = icons[i] || Globe;
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40 sm:p-8"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-semibold leading-snug">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    {t("cta")}
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
