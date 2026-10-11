import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getBaseUrl } from "@/lib/seo";
import { projects } from "@/content/projectsData";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();

  const locales = routing.locales;

  // No `lastModified`: content has no modification dates, and a build-time
  // `new Date()` would mark every URL as changed on every deploy.
  const homeEntries = locales.map((locale) => ({
    url: `${base}/${locale}`,
    changeFrequency: "weekly" as const,
    priority: 1,
    alternates: {
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${base}/${l}`])),
        "x-default": `${base}/${routing.defaultLocale}`,
      },
    },
  }));

  const offerPath = "/creation-site-web";
  const offerEntries = locales.map((locale) => ({
    url: `${base}/${locale}${offerPath}`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
    alternates: {
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [l, `${base}/${l}${offerPath}`]),
        ),
        "x-default": `${base}/${routing.defaultLocale}${offerPath}`,
      },
    },
  }));

  const projectEntries = projects.flatMap((project) =>
    locales.map((locale) => ({
      url: `${base}/${locale}/projects/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((l) => [l, `${base}/${l}/projects/${project.slug}`]),
          ),
          "x-default": `${base}/${routing.defaultLocale}/projects/${project.slug}`,
        },
      },
    })),
  );

  return [...homeEntries, ...offerEntries, ...projectEntries];
}
