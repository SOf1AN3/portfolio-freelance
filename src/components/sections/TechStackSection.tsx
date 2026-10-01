"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { techStack } from "@/content/techStackData";

const categoryOrder = ["frontend", "backend", "mobile", "tools"] as const;

const categoryMeta: Record<
  string,
  { labelKey: string; className: string }
> = {
  frontend: {
    labelKey: "frontend",
    className: "from-blue-500/15 to-blue-500/5 text-blue-400 border-blue-500/20",
  },
  backend: {
    labelKey: "backend",
    className: "from-emerald-500/15 to-emerald-500/5 text-emerald-400 border-emerald-500/20",
  },
  mobile: {
    labelKey: "mobile",
    className: "from-violet-500/15 to-violet-500/5 text-violet-400 border-violet-500/20",
  },
  tools: {
    labelKey: "tools",
    className: "from-amber-500/15 to-amber-500/5 text-amber-400 border-amber-500/20",
  },
};

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

        <div className="mt-14 space-y-10">
          {categoryOrder.map((category, catIndex) => {
            const items = techStack.filter((t) => t.category === category);
            const meta = categoryMeta[category];

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: catIndex * 0.08 }}
              >
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(`categories.${meta.labelKey}`)}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`rounded-xl border bg-gradient-to-br px-5 py-3 text-sm font-medium ${meta.className}`}
                    >
                      {item.name}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
