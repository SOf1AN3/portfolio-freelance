import { getBaseUrl } from "@/lib/seo";

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function buildOgImageUrl(locale: string, title?: string) {
  return `${getBaseUrl()}/api/og?locale=${locale}${title ? `&title=${encodeURIComponent(title)}` : ""}`;
}
