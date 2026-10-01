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

const FEATURED_SLUG = "tiberium-consulting";

const categoryAccents: Record<string, string> = {
  saas: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ai: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  media: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  consulting: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export function ProjectsSection() {
  const t = useTranslations("projects");

  const featured = projects.find((p) => p.slug === FEATURED_SLUG);
  const rest = projects.filter((p) => p.slug !== FEATURED_SLUG);

  function projectText(project: (typeof projects)[number]) {
    return {
      title: t(project.titleKey.replace("projects.", "")),
      description: t(project.descriptionKey.replace("projects.", "")),
      focus: t(project.focusKey.replace("projects.", "")),
      category: t(`categories.${project.category}`),
    };
  }

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

        {featured && (
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group relative mt-14 overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-primary/40"
          >
            <Link
              href={`/projects/${featured.slug}`}
              className="absolute inset-0 z-10"
              aria-label={t("viewProject")}
            />

            <div className="relative aspect-[2.08/1] overflow-hidden bg-card">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${categoryColors[featured.category] || categoryColors.saas}`}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />
              <Image
                src={getProjectImage(featured.slug)}
                alt={projectText(featured).title}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="transform-gpu object-cover object-top transition-transform duration-700 will-change-transform group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 -bottom-px top-1/2 bg-gradient-to-t from-card to-transparent" />

              <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-6 sm:p-8">
                <Badge
                  variant="secondary"
                  className="relative bg-background/80 backdrop-blur"
                >
                  {featured.year}
                </Badge>
                <Badge
                  variant="outline"
                  className={`relative backdrop-blur ${categoryAccents[featured.category] || categoryAccents.saas}`}
                >
                  {projectText(featured).category}
                </Badge>
              </div>
            </div>

            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <h3 className="text-2xl font-bold leading-snug sm:text-3xl">
                  {projectText(featured).title}
                </h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {projectText(featured).description}
                </p>
              </div>

              <div className="flex flex-col justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {t("focus")}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {projectText(featured).focus}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {featured.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-border bg-background/60 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, i) => {
            const { title, description, focus, category } =
              projectText(project);

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
                <Link
                  href={`/projects/${project.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={t("viewProject")}
                />

                <div className="relative aspect-[2/1] overflow-hidden bg-gradient-to-br">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${categoryColors[project.category] || categoryColors.saas}`}
                  />
                  <Image
                    src={getProjectImage(project.slug)}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />

                  <Badge
                    variant="secondary"
                    className="absolute end-3 top-3 bg-background/80 backdrop-blur"
                  >
                    {project.year}
                  </Badge>
                </div>

                <div className="relative flex flex-1 flex-col p-5">
                  <Badge
                    variant="outline"
                    className={`w-fit backdrop-blur ${categoryAccents[project.category] || categoryAccents.saas}`}
                  >
                    {category}
                  </Badge>

                  <h3 className="mt-3 text-lg font-semibold leading-snug">
                    {title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>

                  <p className="mt-4 line-clamp-2 text-sm text-muted-foreground/80">
                    {focus}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2 pt-1">
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-20"
                      >
                        <ExternalLink className="size-4" />
                        {t("live")}
                      </a>
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="relative z-20">
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