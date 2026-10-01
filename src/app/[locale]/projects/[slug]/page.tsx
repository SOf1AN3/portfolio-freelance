import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { getProjectBySlug, projects } from "@/content/projectsData";
import { getProjectStructuredData, generateLocaleMetadata, getBaseUrl } from "@/lib/seo";
import { getProjectImage } from "@/lib/images";
import { JsonLd } from "@/components/SEO/JsonLd";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  const structuredData = getProjectStructuredData(locale as Locale, {
    title,
    description,
    url: `${getBaseUrl()}/${locale}/projects/${slug}`,
    stack: project.stack,
  });

  return (
    <div className="pb-20 pt-28 lg:pb-28 lg:pt-32">
      <JsonLd data={structuredData} />
      <Container>
        <Button asChild variant="ghost" size="sm" className="mb-8">
          <Link href="/">
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {t("back")}
          </Link>
        </Button>

        <article className="mx-auto max-w-4xl">
          <Badge variant="outline" className="mb-4">
            {project.year}
          </Badge>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>

          <div className="relative mt-10 overflow-hidden rounded-2xl border border-border">
            <Image
              src={getProjectImage(slug)}
              alt={title}
              width={1200}
              height={750}
              priority
              className="h-auto w-full object-cover"
            />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("stack")}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-muted px-3 py-1.5 text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("focus")}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {focus}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4" />
                {t("live")}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/#contact">
                {t("contactCta")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </article>
      </Container>
    </div>
  );
}
