import { getRequestConfig } from "next-intl/server";
import { locale as getRootLocale } from "next/root-params";
import { routing } from "./routing";
import ar from "../messages/ar.json";
import en from "../messages/en.json";
import fr from "../messages/fr.json";

const messagesByLocale = {
  ar,
  en,
  fr,
} as const;

function resolveLocale(value: string | undefined): string {
  if (value && (routing.locales as readonly string[]).includes(value)) {
    return value;
  }
  return routing.defaultLocale;
}

export default getRequestConfig(async ({ locale: localeOverride }) => {
  let locale = localeOverride;

  if (!locale) {
    try {
      locale = await getRootLocale();
    } catch {
      locale = undefined;
    }
  }

  const resolved = resolveLocale(locale);

  return {
    locale: resolved,
    messages: messagesByLocale[resolved as keyof typeof messagesByLocale],
  };
});
