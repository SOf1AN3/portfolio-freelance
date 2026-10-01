import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sofianeasma.com";

export function getBaseUrl() {
  return BASE_URL.replace(/\/$/, "");
}

export function generateLocaleMetadata({
  locale,
  title,
  description,
  keywords,
  path = "",
  type = "website",
}: {
  locale: Locale;
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  type?: "website" | "article";
}): Metadata {
  const url = `${getBaseUrl()}/${locale}${path}`;
  const languages: Record<string, string> = {};

  for (const l of routing.locales) {
    languages[l] = `${getBaseUrl()}/${l}${path}`;
  }
  languages["x-default"] = `${getBaseUrl()}/${routing.defaultLocale}${path}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type,
      locale,
      alternateLocale: routing.locales.filter((l) => l !== locale),
      url,
      siteName: "Sofiane ASMA",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function getStructuredData(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${getBaseUrl()}/#professional-service`,
        name: "Sofiane ASMA — Développement Web & Mobile",
        description:
          locale === "ar"
            ? "خدمات تطوير الويب والتطبيقات الجوال حسب الطلب"
            : locale === "en"
              ? "Custom web & mobile development services"
              : "Services de développement web et mobile sur-mesure",
        url: `${getBaseUrl()}/${locale}`,
        telephone: "+213551797313",
        areaServed: "Worldwide",
        priceRange: "€€",
        knowsLanguage: routing.locales,
      },
      {
        "@type": "Person",
        "@id": `${getBaseUrl()}/#person`,
        name: "Sofiane ASMA",
        jobTitle: "Full-Stack Web & Mobile Developer",
        url: `${getBaseUrl()}/${locale}`,
        telephone: "+213551797313",
        address: {
          "@type": "PostalAddress",
          addressCountry: "DZ",
        },
        sameAs: ["https://github.com/", "https://linkedin.com/"],
      },
      {
        "@type": "WebSite",
        "@id": `${getBaseUrl()}/#website`,
        url: `${getBaseUrl()}/${locale}`,
        name: "Sofiane ASMA Portfolio",
        inLanguage: routing.locales,
      },
    ],
  };
}

export function getProjectStructuredData(
  locale: Locale,
  project: {
    title: string;
    description: string;
    url: string;
    stack: string[];
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: project.url,
    creator: {
      "@type": "Person",
      name: "Sofiane ASMA",
      url: `${getBaseUrl()}/${locale}`,
    },
    keywords: project.stack.join(", "),
    inLanguage: locale,
  };
}
