import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sofiane ASMA — Développeur Web & Mobile Full-Stack",
    short_name: "Sofiane ASMA",
    description:
      "Développeur Full-Stack expert Next.js, React, Node.js. Applications web, SaaS et mobiles sur-mesure.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#3b5bdb",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: `${getBaseUrl()}/icon.png`,
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: `${getBaseUrl()}/apple-icon.png`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
