"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { Parallax } from "@/components/animations/Parallax";
import { Reveal } from "@/components/animations/Reveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { projects, type Project } from "@/content/projectsData";
import { getProjectImage } from "@/lib/images";

export function ProjectsSection() {
  const t = useTranslations("projects");

  function projectText(project: Project, index: number) {
    return {
      title: t(project.titleKey.replace("projects.", "")),
      description: t(project.descriptionKey.replace("projects.", "")),
      challenge: t(`items.${index}.challenge`),
      status: t(`statuses.${project.status}`),
      category: t(`categories.${project.category}`),
    };
  }

  return (
    <section id="projects" className="scroll-mt-24 bg-canvas py-24 lg:py-32">
      <Container>
        <Reveal>
          <SectionHeader
            index={t("index")}
            title={t("title")}
            lead={t("subtitle")}
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-8 lg:grid-cols-2" stagger={0.1}>
          {projects.map((project, index) => {
            const { title, description, challenge, status, category } =
              projectText(project, index);

            return (
              <StaggerItem key={project.slug} className="h-full">
                <article className="group flex h-full flex-col rounded-md border border-hairline bg-card p-8 transition-colors duration-300 hover:border-emerald/40">
                  {/* Ligne haute : année // catégorie + statut vivant */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
                      {`${project.year} // ${category}`}
                    </span>
                    <Badge variant="success">{status}</Badge>
                  </div>

                  {/* Visuel encadré + parallaxe au scroll */}
                  <div className="relative mt-6 h-56 overflow-hidden rounded-md border border-hairline bg-deep">
                    <Parallax amount={24} className="absolute inset-x-0 -top-6">
                      <Image
                        src={getProjectImage(project.slug)}
                        alt={title}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="h-[272px] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    </Parallax>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card via-card/30 to-transparent"
                    />
                  </div>

                  {/* Titre + description */}
                  <div className="mt-6 flex flex-col gap-3">
                    <h3 className="font-display text-2xl leading-snug text-platinum transition-colors duration-300 group-hover:text-emerald">
                      {title}
                    </h3>
                    <p className="leading-relaxed text-mist">{description}</p>
                  </div>

                  {/* Encart « défi d'ingénierie » */}
                  <div className="mt-6 flex flex-col gap-2 rounded border border-hairline bg-deep p-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
                      {t("challengeLabel")}
                    </span>
                    <p className="text-sm leading-relaxed text-mist">
                      {challenge}
                    </p>
                  </div>

                  {/* Pied de carte : jetons de stack, statut, lien sortant */}
                  <div className="mt-auto flex flex-col gap-4 border-t border-hairline pt-4">
                    <ul
                      aria-label={t("stack")}
                      className="flex flex-wrap items-center gap-2"
                    >
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-sm border border-hairline bg-deep px-2 py-0.5 font-mono text-[11px] uppercase text-fog"
                        >
                          / {tech}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-fog">
                        {t("status")} : {status}
                      </span>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${t("live")} : ${title}`}
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-platinum transition-colors duration-300 hover:text-emerald focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
                      >
                        <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                          {t("live")}
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-4 shrink-0 text-emerald rtl:rotate-180"
                        />
                      </a>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
