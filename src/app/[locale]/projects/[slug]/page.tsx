import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { sectionHref } from "@/lib/anchors";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { getProjectBySlug, projects } from "@/content/projectsData";
import { getProjectStructuredData, generateLocaleMetadata, getBaseUrl } from "@/lib/seo";
import { getProjectImage } from "@/lib/images";
import { JsonLd } from "@/components/SEO/JsonLd";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import { Parallax } from "@/components/animations/Parallax";
import { ArrowLeft, ExternalLink, ArrowRight } from "lucide-react";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({
      locale,
      slug: project.slug,
    })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const project = getProjectBySlug(slug);
  if (!project) {
    return {};
  }

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "projects",
  });

  const title = t(project.titleKey.replace("projects.", ""));
  const description = t(project.descriptionKey.replace("projects.", ""));

  return generateLocaleMetadata({
    locale: locale as Locale,
    title: `${title} | Sofiane ASMA`,
    description,
    path: `/projects/${slug}`,
    type: "article",
  });
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const project = getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "projects",
  });

  const title = t(project.titleKey.replace("projects.", ""));
  const description = t(project.descriptionKey.replace("projects.", ""));
  const focus = t(project.focusKey.replace("projects.", ""));
  const context = t(project.contextKey.replace("projects.", ""));
  const role = t(project.roleKey.replace("projects.", ""));
  const status = t(`statuses.${project.status}`);
  const category = t(`categories.${project.category}`);
  // « projects.items.0.title » → « items.0.challenge » (clé présente dans fr/en/ar).
  const challenge = t(
    project.titleKey.replace("projects.", "").replace(/title$/, "challenge"),
  );

  const structuredData = getProjectStructuredData(locale as Locale, {
    title,
    description,
    url: `${getBaseUrl()}/${locale}/projects/${slug}`,
    stack: project.stack,
  });

  return (
    <main className="pb-16 pt-32 lg:pb-24 lg:pt-40">
      <JsonLd data={structuredData} />
      <Container>
        <Button asChild variant="ghost" size="sm" className="-ms-2 mb-10">
          <Link href="/">
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {t("back")}
          </Link>
        </Button>

        <article className="mx-auto max-w-5xl">
          {/* En-tête ledger : micro-index + statut */}
          <Reveal>
            <header className="border-t border-hairline pt-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
                  {project.year}
                  <span aria-hidden="true" className="mx-2">
                    {"//"}
                  </span>
                  {category}
                </p>
                <span
                  aria-hidden="true"
                  className="hidden h-px flex-1 bg-hairline sm:block"
                />
                <Badge variant="success">{status}</Badge>
              </div>
              <h1 className="mt-6 font-display text-4xl tracking-tight text-platinum lg:text-5xl">
                {title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-mist">
                {description}
              </p>
            </header>
          </Reveal>

          {/* Visuel du projet */}
          <Reveal delay={0.08} className="mt-12">
            <figure className="overflow-hidden rounded-md border border-hairline bg-deep">
              <Parallax amount={20} className="overflow-hidden">
                <div className="relative h-64 sm:h-[420px] lg:h-[520px]">
                  <Image
                    src={getProjectImage(slug)}
                    alt={title}
                    width={1600}
                    height={1000}
                    priority
                    className="absolute -top-10 h-[calc(100%_+_80px)] w-full object-cover"
                  />
                </div>
              </Parallax>
            </figure>
          </Reveal>

          <section className="py-24 lg:py-32">
            {/* Encart « challenge » */}
            <Reveal>
              <aside className="rounded-md border border-hairline bg-deep p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald">
                  <span aria-hidden="true">{"// "}</span>
                  {project.slug}
                </p>
                <p className="mt-4 text-base leading-relaxed text-mist">
                  {challenge}
                </p>
              </aside>
            </Reveal>

            {/* Métadonnées ledger */}
            <Stagger className="mt-14 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              <StaggerItem className="border-t border-hairline pt-4 pe-8">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
                  {t("role")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mist">{role}</p>
              </StaggerItem>
              <StaggerItem className="border-t border-hairline pt-4 pe-8">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
                  {t("context")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  {context}
                </p>
              </StaggerItem>
              <StaggerItem className="border-t border-hairline pt-4 pe-8">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
                  {t("focus")}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-mist">{focus}</p>
              </StaggerItem>
            </Stagger>

            {/* Stack technique */}
            <Reveal className="mt-14">
              <div className="border-t border-hairline pt-6">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
                  {t("stack")}
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-sm border border-hairline bg-deep px-2 py-0.5 font-mono text-[11px] text-fog"
                    >
                      / {tech.toUpperCase()}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* CTA final */}
            <Reveal className="mt-14">
              <div className="flex flex-wrap items-center gap-4 border-t border-hairline pt-8">
                <Button asChild size="lg">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-4" />
                    {t("viewProject")}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={sectionHref("contact")}>
                    {t("contactCta")}
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </section>
        </article>
      </Container>
    </main>
  );
}
