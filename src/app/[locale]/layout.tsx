import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  Plus_Jakarta_Sans,
  Cairo,
  JetBrains_Mono,
  Syne,
} from "next/font/google";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { routing, type Locale } from "@/i18n/routing";
import { generateLocaleMetadata, getStructuredData } from "@/lib/seo";
import { JsonLd } from "@/components/SEO/JsonLd";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import "../globals.css";

const syne = Syne({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "metadata" });

  return generateLocaleMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("description"),
    ogTitle: t("ogTitle"),
    ogDescription: t("ogDescription"),
    keywords: t.raw("keywords") as string[],
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const isRtl = locale === "ar";
  const structuredData = getStructuredData(locale as Locale);

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
      className={`${syne.variable} ${jakarta.variable} ${cairo.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        {/* Lien d'évitement (WCAG 2.4.1) : premier élément focusable au clavier. */}
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[70] focus:rounded-md focus:border focus:border-emerald/50 focus:bg-elevated focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:text-platinum"
        >
          {locale === "ar"
            ? "تخطَّ إلى المحتوى"
            : locale === "en"
              ? "Skip to content"
              : "Aller au contenu"}
        </a>
        <SmoothScrollProvider>
          <JsonLd data={structuredData} />
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar locale={locale as Locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale as Locale} />
            <WhatsAppButton />
          </NextIntlClientProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
