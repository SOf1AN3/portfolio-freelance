import { ImageResponse } from "next/og";

export const runtime = "nodejs";

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
          fontFamily: "sans-serif",
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
            Next.js · React · Node.js · Mobile
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
