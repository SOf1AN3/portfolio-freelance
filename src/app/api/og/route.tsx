import { ImageResponse } from "next/og";
import { isLocale, routing, type Locale } from "@/i18n/routing";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sofianePhoto from "@/assets/sofiane.png";

export const runtime = "nodejs";

/**
 * Square window used to crop the avatar. The photo is a portrait asset, so the
 * crop geometry is derived from its intrinsic dimensions: the image is scaled
 * to cover the square horizontally, then vertically centred. This replaces
 * `objectFit`/`objectPosition`, which Satori does not honour reliably.
 */
const AVATAR_BOX = 268;
const avatarScale = AVATAR_BOX / sofianePhoto.width;
const avatarScaledHeight = sofianePhoto.height * avatarScale;
const avatarOffsetY = (avatarScaledHeight - AVATAR_BOX) / 2;

const CACHE_CONTROL =
  "public, max-age=604800, s-maxage=604800, stale-while-revalidate=2592000";

/** Production origins allowed to serve the hashed avatar asset. */
const TRUSTED_ORIGINS = new Set([
  "https://sofianeasma.me",
  "https://www.sofianeasma.me",
]);

/** Hostnames accepted for local development origins. */
const LOCAL_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "[::1]",
  "0.0.0.0",
]);

/**
 * Card copy per locale. Plain TypeScript strings (not JSX text), so `&` stays
 * a single ampersand — escaping it would render `&amp;` literally.
 */
type Copy = {
  badge: string;
  title1: string;
  title2: string;
  title3: string;
  subtitle: string;
  role: string;
};

const COPY: Record<Locale, Copy> = {
  fr: {
    badge: "DISPONIBLE POUR DE NOUVEAUX PROJETS",
    title1: "Des sites web",
    title2: "qui transforment",
    title3: "vos visiteurs",
    subtitle:
      "Sites rapides et professionnels pour PME, applications web et SaaS sur-mesure.",
    role: "DÉVELOPPEUR WEB & MOBILE",
  },
  en: {
    badge: "AVAILABLE FOR NEW PROJECTS",
    title1: "Websites that",
    title2: "turn visitors",
    title3: "into clients",
    subtitle:
      "Fast, modern sites for small businesses — plus custom web apps & SaaS on demand.",
    role: "FULL-STACK WEB & MOBILE",
  },
  ar: {
    badge: "متاح لمشاريع جديدة",
    title1: "مواقع ويب",
    title2: "تجلب لك",
    title3: "عملاء جدد",
    subtitle:
      "مواقع ويب احترافية وسريعة للشركات الصغيرة، وتطبيقات وSaaS حسب الطلب.",
    role: "مطوّر ويب وتطبيقات جوال",
  },
};

/** Options accepted by `ImageResponse`, derived from its constructor. */
type OgOptions = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>;

let cairoFontsPromise: Promise<Buffer[]> | undefined;

/**
 * Reads the two Cairo weights used by the Arabic card. The promise is cached
 * for the lifetime of the server instance and reset on failure so a transient
 * error can be retried on the next request.
 */
function loadCairoFonts(): Promise<Buffer[]> {
  cairoFontsPromise ??= Promise.all([
    readFile(join(process.cwd(), "src/app/api/og/fonts", "Cairo-Regular.ttf")),
    readFile(join(process.cwd(), "src/app/api/og/fonts", "Cairo-Bold.ttf")),
  ]).catch((error: unknown) => {
    cairoFontsPromise = undefined;
    throw error;
  });

  return cairoFontsPromise;
}

/**
 * Validates a raw URL against a strict allow-list: a known production origin,
 * or a local `http` origin. Returns the normalised origin when accepted and
 * `null` otherwise, so no outgoing fetch is ever issued toward an origin that
 * is not explicitly trusted.
 */
function trustedOrigin(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    // Relative or malformed URL — not usable as an origin.
    return null;
  }

  if (TRUSTED_ORIGINS.has(url.origin)) {
    return url.origin;
  }

  if (url.protocol === "http:" && LOCAL_HOSTNAMES.has(url.hostname)) {
    return url.origin;
  }

  return null;
}

/**
 * Origins to try for the hashed avatar asset, most specific first: the origin
 * that served the request (its deployment emitted the current asset hash),
 * then the configured site origin. Entries failing the allow-list are dropped.
 */
function candidateOrigins(request: Request): string[] {
  const origins: string[] = [];

  for (const raw of [request.url, process.env.NEXT_PUBLIC_SITE_URL ?? ""]) {
    if (!raw) continue;

    const origin = trustedOrigin(raw);
    if (origin && !origins.includes(origin)) {
      origins.push(origin);
    }
  }

  return origins;
}

/**
 * Magic-number signatures accepted for the avatar asset. Note that
 * `src/assets/sofiane.png` is in fact JPEG-encoded despite its extension, so
 * both formats are detected from the header rather than trusted from the name.
 */
const IMAGE_SIGNATURES: ReadonlyArray<{
  mimeType: string;
  bytes: readonly number[];
}> = [
  {
    mimeType: "image/png",
    bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  },
  { mimeType: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
];

/** Detects the real image format from its header, or `null` when unrecognised. */
function detectImageMimeType(bytes: Buffer): string | null {
  for (const { mimeType, bytes: signature } of IMAGE_SIGNATURES) {
    if (
      bytes.length >= signature.length &&
      signature.every((byte, index) => bytes[index] === byte)
    ) {
      return mimeType;
    }
  }

  return null;
}

let avatarDataUriPromise: Promise<string> | undefined;

/**
 * Fetches the hashed avatar asset from a single origin and validates it
 * (HTTP status, `image/*` content-type, real image signature) before returning
 * it as a base64 data URI.
 */
async function fetchAvatarDataUri(origin: string): Promise<string> {
  // Defence in depth: re-validate here so no future caller can bypass the
  // allow-list, even though every current caller already filters the origin.
  const trusted = trustedOrigin(origin);
  if (!trusted) {
    throw new Error(`Untrusted avatar origin: ${origin}`);
  }

  // The static import must stay a root-relative path; an absolute URL (CDN or
  // assetPrefix) would silently override the trusted origin.
  if (!sofianePhoto.src.startsWith("/")) {
    throw new Error(`Unexpected avatar asset path: ${sofianePhoto.src}`);
  }

  const response = await fetch(new URL(sofianePhoto.src, trusted), {
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Avatar fetch failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`Unexpected avatar content-type: ${contentType}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  const mimeType = detectImageMimeType(bytes);
  if (!mimeType) {
    throw new Error("Avatar is not a valid PNG or JPEG");
  }

  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

/**
 * Resolves the statically imported photo into a base64 data URI so Satori can
 * render it. Candidate origins are tried in order until one yields a valid
 * image. The promise is cached for the lifetime of the server instance and
 * reset on failure so a transient error can be retried on the next request.
 */
function loadAvatarDataUri(request: Request): Promise<string> {
  avatarDataUriPromise ??= (async () => {
    const origins = candidateOrigins(request);
    if (origins.length === 0) {
      throw new Error("No trusted origin available for the avatar fetch");
    }

    const failures: string[] = [];
    for (const origin of origins) {
      try {
        return await fetchAvatarDataUri(origin);
      } catch (error) {
        failures.push(
          `${origin}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    throw new Error(`Avatar fetch failed (${failures.join("; ")})`);
  })().catch((error: unknown) => {
    avatarDataUriPromise = undefined;
    throw error;
  });

  return avatarDataUriPromise;
}

function Monogram() {
  return (
    <div
      style={{
        display: "flex",
        width: 280,
        height: 280,
        borderRadius: 9999,
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
        fontSize: 100,
        fontWeight: 700,
        color: "#f8fafc",
      }}
    >
      <div style={{ display: "flex" }}>SA</div>
    </div>
  );
}

function IdentityCard({
  avatarDataUri,
  locale,
}: {
  avatarDataUri: string | null;
  locale: Locale;
}) {
  const c = COPY[locale];
  const rtl = locale === "ar";
  const textAlign = rtl ? "right" : "left";
  const rowDirection = rtl ? "row-reverse" : "row";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: rtl ? "row-reverse" : "row",
        width: "100%",
        height: "100%",
        padding: 56,
        gap: 40,
        alignItems: "center",
        background:
          "linear-gradient(135deg, #020617 0%, #0b1226 55%, #101c3d 100%)",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: 26,
          alignItems: rtl ? "flex-end" : "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: rowDirection,
            textAlign,
            alignItems: "center",
            gap: 12,
            borderRadius: 9999,
            border: "2px solid rgba(34,197,94,0.45)",
            backgroundColor: "rgba(34,197,94,0.12)",
            padding: "10px 22px",
            fontSize: 23,
            fontWeight: 700,
            letterSpacing: 2,
            color: "#4ade80",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 9999,
              backgroundColor: "#22c55e",
            }}
          />
          <div style={{ display: "flex", textAlign }}>{c.badge}</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign,
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -1,
            color: "#f8fafc",
          }}
        >
          <div style={{ display: "flex", textAlign }}>{c.title1}</div>
          <div style={{ display: "flex", textAlign }}>{c.title2}</div>
          <div style={{ display: "flex", textAlign }}>{c.title3}</div>
        </div>

        <div
          style={{
            display: "flex",
            textAlign,
            fontSize: 29,
            fontWeight: 400,
            lineHeight: 1.35,
            color: "#93c5fd",
            maxWidth: 600,
          }}
        >
          {c.subtitle}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: rowDirection,
            textAlign,
            alignItems: "center",
            gap: 16,
            marginTop: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              textAlign,
              fontSize: 30,
              fontWeight: 700,
              color: "#e2e8f0",
            }}
          >
            Sofiane ASMA
          </div>
          <div
            style={{
              display: "flex",
              width: 8,
              height: 8,
              borderRadius: 9999,
              backgroundColor: "#3b82f6",
            }}
          />
          <div
            style={{
              display: "flex",
              textAlign,
              fontSize: 26,
              fontWeight: 400,
              color: "#60a5fa",
            }}
          >
            sofianeasma.me
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          width: 320,
          flexShrink: 0,
        }}
      >
        {avatarDataUri ? (
          <div
            style={{
              position: "relative",
              display: "flex",
              width: AVATAR_BOX,
              height: AVATAR_BOX,
              borderRadius: 9999,
              overflow: "hidden",
              border: "6px solid rgba(59,130,246,0.45)",
              boxShadow: "0 0 70px rgba(59,130,246,0.30)",
            }}
          >
            {/* Satori only understands raw <img> tags fed with data URIs. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarDataUri}
              alt="Sofiane ASMA"
              width={AVATAR_BOX}
              height={Math.round(avatarScaledHeight)}
              style={{
                position: "absolute",
                top: -Math.round(avatarOffsetY),
                left: 0,
                width: AVATAR_BOX,
                height: Math.round(avatarScaledHeight),
                maxWidth: "none",
              }}
            />
          </div>
        ) : (
          <Monogram />
        )}

        <div
          style={{
            display: "flex",
            textAlign,
            fontSize: 21,
            fontWeight: 700,
            letterSpacing: 3,
            color: "#64748b",
          }}
        >
          {c.role}
        </div>
      </div>
    </div>
  );
}

export async function GET(request: Request): Promise<Response> {
  const raw = new URL(request.url).searchParams.get("locale");
  let locale: Locale = raw && isLocale(raw) ? raw : routing.defaultLocale;

  // Arabic needs Cairo; other locales keep Satori's default fonts untouched.
  let fonts: OgOptions["fonts"];
  if (locale === "ar") {
    try {
      const [regular, bold] = await loadCairoFonts();
      fonts = [
        { name: "Cairo", data: regular, weight: 400, style: "normal" },
        { name: "Cairo", data: bold, weight: 700, style: "normal" },
      ];
    } catch (error) {
      console.error(
        "OG Cairo fonts unavailable, falling back to English:",
        error instanceof Error ? error.message : error,
      );
      locale = "en";
      fonts = undefined;
    }
  }

  try {
    let avatarDataUri: string | null = null;

    try {
      avatarDataUri = await loadAvatarDataUri(request);
    } catch (error) {
      console.error(
        "OG avatar unavailable, falling back to monogram:",
        error instanceof Error ? error.message : error,
      );
    }

    return new ImageResponse(
      <IdentityCard avatarDataUri={avatarDataUri} locale={locale} />,
      {
        width: 1200,
        height: 630,
        headers: { "Cache-Control": CACHE_CONTROL },
        ...(fonts ? { fonts } : {}),
      },
    );
  } catch (error) {
    console.error(
      "OG generation failed:",
      error instanceof Error ? error.message : error,
    );
    return new Response("OG generation failed", { status: 500 });
  }
}
