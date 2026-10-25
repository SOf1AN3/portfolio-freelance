import { ImageResponse } from "next/og";
import { isLocale, routing, type Locale } from "@/i18n/routing";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sofianePhoto from "@/assets/sofiane.png";

export const runtime = "nodejs";

/**
 * Portrait frame, mirroring the "engineer profile" card of the home hero:
 * a rectangular panel with a hairline emerald rim instead of the old circle.
 * The photo is scaled to *cover* the box (both axes), then centred — Satori
 * does not honour `objectFit`/`objectPosition` reliably.
 */
const AVATAR_W = 300;
const AVATAR_H = 380;
const avatarScale = Math.max(
  AVATAR_W / sofianePhoto.width,
  AVATAR_H / sofianePhoto.height,
);
const avatarScaledWidth = sofianePhoto.width * avatarScale;
const avatarScaledHeight = sofianePhoto.height * avatarScale;
const avatarOffsetX = (avatarScaledWidth - AVATAR_W) / 2;
const avatarOffsetY = (avatarScaledHeight - AVATAR_H) / 2;

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
 * Obsidian Atelier palette — kept in sync with `src/app/globals.css`.
 * Every hex here is deliberate: deep obsidian canvas, graded slates, warm
 * platinum text and a single, restrained emerald accent.
 */
const C = {
  canvas: "#090A0F",
  card: "#151822",
  hairline: "rgba(255,255,255,0.08)",
  hairlineStrong: "rgba(255,255,255,0.16)",
  platinum: "#F1F5F9",
  mist: "#94A3B8",
  fog: "#64748B",
  emerald: "#10B981",
  emeraldBright: "#34D399",
  emeraldRim: "rgba(16,185,129,0.35)",
  emeraldWash: "rgba(16,185,129,0.10)",
  ink: "#003824",
};

/**
 * Card copy per locale. Plain TypeScript strings (not JSX text), so `&` stays
 * a single ampersand — escaping it would render `&amp;` literally.
 *
 * Constraint: <= ~22 characters per title line (the text column is ~740 px
 * wide at 54 px of Syne), otherwise the line wraps and the card looks broken.
 */
type Copy = {
  eyebrow: string;
  title1: string;
  title2: string;
  subtitle: string;
  badge: string;
  role: string;
};

const COPY: Record<Locale, Copy> = {
  fr: {
    eyebrow: "INGÉNIERIE & ARCHITECTURES NUMÉRIQUES",
    title1: "Sites web d'exception",
    title2: "& ingénierie logicielle",
    subtitle:
      "Pour entreprises exigeantes : applications web, SaaS et plateformes sur-mesure, ultra-rapides et simples à piloter.",
    badge: "DISPONIBLE POUR DE NOUVEAUX PROJETS",
    role: "INGÉNIEUR FULL-STACK",
  },
  en: {
    eyebrow: "SOFTWARE ENGINEERING & DIGITAL ARCHITECTURE",
    title1: "Exceptional websites",
    title2: "& software engineering",
    subtitle:
      "For demanding businesses: web apps, SaaS and custom platforms — fast and effortless to run.",
    badge: "AVAILABLE FOR NEW PROJECTS",
    role: "FULL-STACK SOFTWARE ENGINEER",
  },
  ar: {
    eyebrow: "هندسة البرمجيات والعمارة الرقمية",
    title1: "مواقع استثنائية",
    title2: "وهندسة برمجيات",
    subtitle:
      "للشركات المطالبة: تطبيقات ويب وأنظمة SaaS ومنصات حسب الطلب، سريعة وسهلة التسيير.",
    badge: "متاح لمشاريع جديدة",
    role: "مهندس Full-Stack",
  },
};

/** Identity shown on every card, whatever the locale. */
const NAME = "Sofiane ASMA";
const DOMAIN = "sofianeasma.me";

/** Options accepted by `ImageResponse`, derived from its constructor. */
type OgOptions = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>;
type OgFont = NonNullable<OgOptions["fonts"]>[number];

const FONTS_DIR = join(process.cwd(), "src/app/api/og/fonts");

/**
 * Fonts used by the card. Stacks fall back per glyph: Syne/Jakarta/JetBrains
 * carry the Latin text, Cairo covers Arabic (and the Latin fragments such as
 * "Full-Stack" or the domain inside Arabic cards).
 *
 * A missing file degrades to Satori's default face instead of failing the
 * whole card: the route must never return 500 for a font problem.
 */
const FONT_FILES: ReadonlyArray<Omit<OgFont, "data"> & { file: string }> = [
  { file: "Syne-Bold.ttf", name: "Syne", weight: 700, style: "normal" },
  { file: "PlusJakartaSans-Regular.ttf", name: "Plus Jakarta Sans", weight: 400, style: "normal" },
  { file: "PlusJakartaSans-SemiBold.ttf", name: "Plus Jakarta Sans", weight: 600, style: "normal" },
  { file: "JetBrainsMono-Medium.ttf", name: "JetBrains Mono", weight: 500, style: "normal" },
  { file: "Cairo-Regular.ttf", name: "Cairo", weight: 400, style: "normal" },
  { file: "Cairo-Bold.ttf", name: "Cairo", weight: 700, style: "normal" },
];

let fontsPromise: Promise<OgFont[] | undefined> | undefined;

/**
 * Reads every TTF once per server instance. Failures are swallowed per file
 * (a deleted face only degrades the card) and an empty result is cached too,
 * so a broken directory never triggers a request storm.
 */
function loadFonts(): Promise<OgFont[] | undefined> {
  fontsPromise ??= Promise.all(
    FONT_FILES.map(async ({ file, ...meta }): Promise<OgFont | null> => {
      try {
        const data = await readFile(join(FONTS_DIR, file));
        return { ...meta, data };
      } catch (error) {
        console.error(
          `OG font unavailable: ${file}`,
          error instanceof Error ? error.message : error,
        );
        return null;
      }
    }),
  ).then((fonts) => {
    const loaded = fonts.filter((font): font is OgFont => font !== null);
    return loaded.length > 0 ? loaded : undefined;
  });

  return fontsPromise;
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

/** Obsidian monogram shown when the photo cannot be resolved. */
function Monogram() {
  return (
    <div
      style={{
        display: "flex",
        width: AVATAR_W,
        height: AVATAR_H,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${C.hairline}`,
        background: `linear-gradient(160deg, ${C.card} 0%, #0E1017 100%)`,
        fontSize: 120,
        fontWeight: 700,
        fontFamily: "Syne, Cairo, sans-serif",
        letterSpacing: -4,
        color: C.emeraldBright,
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

  const display = "Syne, Cairo, sans-serif";
  const body = "Plus Jakarta Sans, Cairo, sans-serif";
  const mono = "JetBrains Mono, Cairo, monospace";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: rtl ? "row-reverse" : "row",
        position: "relative",
        width: "100%",
        height: "100%",
        padding: 56,
        gap: 44,
        alignItems: "center",
        backgroundColor: C.canvas,
        color: C.platinum,
      }}
    >
      {/* Architectural dot matrix, same 40 px grid as the site hero. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.11) 1px, transparent 0)",
          backgroundSize: "40px 40px",
          opacity: 0.55,
        }}
      />
      {/* Restrained emerald luminescence, top-right (mirrored in RTL). */}
      <div
        style={{
          position: "absolute",
          top: -180,
          [rtl ? "left" : "right"]: -60,
          width: 520,
          height: 520,
          display: "flex",
          backgroundImage:
            "radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0) 68%)",
        }}
      />
      {/* Inner hairline frame — the card's "bevel". */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          right: 24,
          bottom: 24,
          display: "flex",
          border: `1px solid ${C.hairline}`,
          borderRadius: 6,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
          gap: 22,
          position: "relative",
          alignItems: rtl ? "flex-end" : "flex-start",
          textAlign,
        }}
      >
        {/* Micro-index: mono, emerald, tracked out — with its rule. */}
        <div
          style={{
            display: "flex",
            flexDirection: rowDirection,
            alignItems: "center",
            gap: 14,
            textAlign,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: mono,
              fontSize: 20,
              fontWeight: 500,
              letterSpacing: 3,
              color: C.emeraldBright,
            }}
          >
            {c.eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              width: 96,
              height: 1,
              backgroundColor: C.hairlineStrong,
            }}
          />
        </div>

        {/* Display title — Syne, tight tracking, platinum. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontFamily: display,
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: -1.5,
            color: C.platinum,
            textAlign,
          }}
        >
          <div style={{ display: "flex", textAlign }}>{c.title1}</div>
          <div style={{ display: "flex", textAlign }}>{c.title2}</div>
        </div>

        <div
          style={{
            display: "flex",
            textAlign,
            fontFamily: body,
            fontSize: 25,
            fontWeight: 400,
            lineHeight: 1.4,
            color: C.mist,
            maxWidth: 680,
          }}
        >
          {c.subtitle}
        </div>

        {/* Status token: rectilinear, never a pill. */}
        <div
          style={{
            display: "flex",
            flexDirection: rowDirection,
            textAlign,
            alignItems: "center",
            gap: 12,
            borderRadius: 4,
            border: "1px solid rgba(16,185,129,0.45)",
            backgroundColor: C.emeraldWash,
            padding: "11px 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: C.emeraldBright,
            }}
          />
          <div
            style={{
              display: "flex",
              fontFamily: mono,
              fontSize: 19,
              fontWeight: 500,
              letterSpacing: 1.6,
              color: C.emeraldBright,
              textAlign,
            }}
          >
            {c.badge}
          </div>
        </div>

        {/* Identity ledger: hairline, name, rule, domain. */}
        <div
          style={{
            display: "flex",
            flexDirection: rowDirection,
            textAlign,
            alignItems: "center",
            gap: 16,
            width: "100%",
            marginTop: 6,
            paddingTop: 18,
            borderTop: `1px solid ${C.hairline}`,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: body,
              fontSize: 27,
              fontWeight: 600,
              letterSpacing: -0.3,
              color: C.platinum,
              textAlign,
            }}
          >
            {NAME}
          </div>
          <div
            style={{
              display: "flex",
              width: 1,
              height: 18,
              backgroundColor: C.hairlineStrong,
            }}
          />
          <div
            style={{
              display: "flex",
              fontFamily: mono,
              fontSize: 23,
              fontWeight: 500,
              color: C.fog,
              textAlign,
            }}
          >
            {DOMAIN}
          </div>
        </div>
      </div>

      {/* Right rail: framed portrait + role, as in the hero profile card. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          width: AVATAR_W,
          flexShrink: 0,
          position: "relative",
        }}
      >
        {avatarDataUri ? (
          <div
            style={{
              position: "relative",
              display: "flex",
              width: AVATAR_W,
              height: AVATAR_H,
              borderRadius: 6,
              overflow: "hidden",
              border: `1px solid ${C.emeraldRim}`,
              backgroundColor: C.card,
              boxShadow: "0 0 60px rgba(16,185,129,0.14)",
            }}
          >
            {/* Satori only understands raw <img> tags fed with data URIs. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarDataUri}
              alt="Sofiane ASMA"
              width={Math.round(avatarScaledWidth)}
              height={Math.round(avatarScaledHeight)}
              style={{
                position: "absolute",
                top: -Math.round(avatarOffsetY),
                left: -Math.round(avatarOffsetX),
                width: Math.round(avatarScaledWidth),
                height: Math.round(avatarScaledHeight),
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 150,
                display: "flex",
                backgroundImage:
                  "linear-gradient(to top, rgba(9,10,15,0.88), rgba(9,10,15,0))",
              }}
            />
          </div>
        ) : (
          <Monogram />
        )}

        <div
          style={{
            display: "flex",
            textAlign: "center",
            fontFamily: mono,
            fontSize: 19,
            fontWeight: 500,
            letterSpacing: 2.4,
            color: C.emerald,
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

  // Every face is loaded up-front; missing files degrade to Satori's default.
  const fonts = await loadFonts();

  // Arabic (and stray Latin fragments) resolve through the Cairo entry of the
  // stacks. If Cairo itself is missing, the Arabic card would render tofu, so
  // fall back to English copy rather than shipping a broken image.
  const hasCairo = fonts?.some((font) => font.name === "Cairo");
  if (locale === "ar" && !hasCairo) {
    console.error("OG Cairo fonts unavailable, falling back to English");
    locale = "en";
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
