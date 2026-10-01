"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { projects } from "@/content/projectsData";
import { getProjectImage } from "@/lib/images";

const categoryColors: Record<string, string> = {
  saas: "from-blue-500/20 to-cyan-500/10",
  ai: "from-violet-500/20 to-fuchsia-500/10",
  media: "from-amber-500/20 to-orange-500/10",
  consulting: "from-emerald-500/20 to-teal-500/10",
};

export function ProjectsSection() {
  const t = useTranslations("projects");

  return (
    <section id="projects" className="scroll-mt-20 py-20 lg:py-28">
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

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => {
            const title = t(project.titleKey.replace("projects.", ""));
            const description = t(project.descriptionKey.replace("projects.", ""));
            const focus = t(project.focusKey.replace("projects.", ""));

            return (
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
              >
                <div
                  className={`relative h-48 overflow-hidden bg-gradient-to-br ${categoryColors[project.category] || categoryColors.saas} sm:h-56`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />
                  <Image
                    src={getProjectImage(project.slug)}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  <Badge
                    variant="secondary"
                    className="absolute end-4 top-4 bg-background/80 backdrop-blur"
                  >
                    {project.year}
                  </Badge>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-semibold leading-snug">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>

                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      {t("focus")}
                    </p>
                    <p className="text-sm text-muted-foreground">{focus}</p>
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      {t("stack")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3 pt-2">
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-4" />
                        {t("live")}
                      </a>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/projects/${project.slug}`}>
                        {t("viewProject")}
                        <ArrowUpRight className="size-4 rtl:rotate-90" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
