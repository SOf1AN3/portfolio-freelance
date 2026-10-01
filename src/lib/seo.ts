import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { SOCIAL_LINKS } from "@/lib/socials";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sofianeasma.me";

export function getBaseUrl() {
  return BASE_URL.replace(/\/$/, "");
}

export function buildOgImageUrl(locale: string, title?: string) {
  const base = `${getBaseUrl()}/api/og?locale=${encodeURIComponent(locale)}`;
  return title ? `${base}&title=${encodeURIComponent(title)}` : base;
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

  const ogImage = buildOgImageUrl(locale, title);

  return {
    metadataBase: new URL(getBaseUrl()),
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
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function getStructuredData(locale: Locale) {
  const sameAs = [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.github];

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
        "@type": "Organization",
        "@id": `${getBaseUrl()}/#organization`,
        name: "Sofiane ASMA",
        url: `${getBaseUrl()}/${locale}`,
        logo: `${getBaseUrl()}/api/og?locale=${locale}`,
        sameAs,
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
        sameAs,
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
    "@graph": [
      {
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
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: `${getBaseUrl()}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projets",
            item: `${getBaseUrl()}/${locale}#projects`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: project.url,
          },
        ],
      },
    ],
  };
}
