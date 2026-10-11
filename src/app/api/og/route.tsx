import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const CACHE_CONTROL =
  "public, max-age=604800, s-maxage=604800, stale-while-revalidate=2592000";

let arabicFontPromise: Promise<ArrayBuffer> | undefined;

function getArabicFont(): Promise<ArrayBuffer> {
  arabicFontPromise ??= readFile(new URL("./fonts/Cairo.ttf", import.meta.url))
    .then((buffer) =>
      buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
    )
    .catch((error) => {
      arabicFontPromise = undefined;
      throw error;
    });

  return arabicFontPromise;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "fr";
  const title =
    searchParams.get("title") ||
    (locale === "ar"
      ? "سفيان عاصمة — مطوّر Full-Stack"
      : locale === "en"
        ? "Sofiane ASMA — Full-Stack Developer"
        : "Sofiane ASMA — Développeur Full-Stack");

  const isArabic = locale === "ar";
  const arabicFont = isArabic ? await getArabicFont() : null;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #09090b 0%, #1e1b4b 45%, #0f172a 100%)",
          color: "#fafafa",
          fontFamily: isArabic ? "Cairo" : "sans-serif",
          padding: "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: "#3b82f6",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Sofiane ASMA
          </div>
          <div
            style={{
              fontSize: title.length > 50 ? 48 : 64,
              fontWeight: 700,
              textAlign: "center",
              maxWidth: 1000,
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#a1a1aa",
              marginTop: 12,
            }}
          >
            {isArabic
              ? "مواقع ويب احترافية · تطبيقات مخصّصة"
              : "Sites web professionnels · Applications sur-mesure"}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": CACHE_CONTROL },
      fonts: arabicFont
        ? [
            {
              name: "Cairo",
              data: arabicFont,
              weight: 400,
              style: "normal" as const,
            },
            {
              name: "Cairo",
              data: arabicFont,
              weight: 700,
              style: "normal" as const,
            },
          ]
        : undefined,
    },
  );
}