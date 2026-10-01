import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getBaseUrl } from "@/lib/seo";
import { projects } from "@/content/projectsData";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  const lastModified = new Date();

  const locales = routing.locales;

  const homeEntries = locales.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${base}/${l}`]),
      ),
    },
  }));

  const projectEntries = projects.flatMap((project) =>
    locales.map((locale) => ({
      url: `${base}/${locale}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${base}/${l}/projects/${project.slug}`]),
        ),
      },
    })),
  );

  return [...homeEntries, ...projectEntries];
}
