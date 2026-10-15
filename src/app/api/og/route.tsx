import { ImageResponse } from "next/og";
import sofianePhoto from "@/assets/sofiane.png";

export const runtime = "nodejs";

const CACHE_CONTROL =
  "public, max-age=604800, s-maxage=604800, stale-while-revalidate=2592000";

/** Trusted static base used to resolve the avatar asset path — never derived
 * from the incoming request URL, which may be relative or header-controlled. */
const SITE_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://sofianeasma.me");

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

let avatarDataUriPromise: Promise<string> | undefined;

/**
 * Resolves the statically imported photo into a base64 data URI so Satori can
 * render it. The promise is cached for the lifetime of the server instance and
 * reset on failure so a transient error can be retried on the next request.
 */
function loadAvatarDataUri(): Promise<string> {
  avatarDataUriPromise ??= (async () => {
    const response = await fetch(new URL(sofianePhoto.src, SITE_BASE_URL), {
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
    if (bytes.length < 8 || PNG_SIGNATURE.some((b, i) => bytes[i] !== b)) {
      throw new Error("Avatar is not a valid PNG");
    }

    return `data:image/png;base64,${bytes.toString("base64")}`;
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

function IdentityCard({ avatarDataUri }: { avatarDataUri: string | null }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
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
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
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
          <div style={{ display: "flex" }}>AVAILABLE FOR NEW PROJECTS</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -1,
            color: "#f8fafc",
          }}
        >
          <div style={{ display: "flex" }}>Websites that</div>
          <div style={{ display: "flex" }}>turn visitors</div>
          <div style={{ display: "flex" }}>into clients</div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 29,
            fontWeight: 400,
            lineHeight: 1.35,
            color: "#93c5fd",
            maxWidth: 600,
          }}
        >
          Fast, modern sites for small businesses — plus custom web apps &amp;
          SaaS on demand.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 10,
          }}
        >
          <div
            style={{
              display: "flex",
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
              display: "flex",
              width: 280,
              height: 280,
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
              width={268}
              height={268}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          </div>
        ) : (
          <Monogram />
        )}

        <div
          style={{
            display: "flex",
            fontSize: 21,
            fontWeight: 700,
            letterSpacing: 3,
            color: "#64748b",
          }}
        >
          FULL-STACK WEB &amp; MOBILE
        </div>
      </div>
    </div>
  );
}

export async function GET(): Promise<Response> {
  try {
    let avatarDataUri: string | null = null;

    try {
      avatarDataUri = await loadAvatarDataUri();
    } catch (error) {
      console.error(
        "OG avatar unavailable, falling back to monogram:",
        error instanceof Error ? error.message : error,
      );
    }

    return new ImageResponse(<IdentityCard avatarDataUri={avatarDataUri} />, {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": CACHE_CONTROL },
    });
  } catch (error) {
    console.error(
      "OG generation failed:",
      error instanceof Error ? error.message : error,
    );
    return new Response("OG generation failed", { status: 500 });
  }
}
