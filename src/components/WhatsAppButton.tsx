"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/utils";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";

export function WhatsAppButton() {
  const t = useTranslations("whatsappButton");

  return (
    <motion.a
      href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="group fixed bottom-5 end-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald text-on-emerald shadow-lg shadow-emerald/30 transition-colors hover:bg-emerald-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald motion-reduce:transition-none sm:bottom-8 sm:end-8"
      aria-label={t("label")}
    >
      {/* Pulse discret (un seul point animé). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute end-2.5 top-2.5 size-1.5 rounded-full bg-on-emerald/80"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute end-2.5 top-2.5 size-1.5 animate-ping rounded-full bg-on-emerald/50 motion-reduce:animate-none"
      />

      <WhatsappIcon className="size-7" />
      <span
        className="pointer-events-none absolute end-full top-1/2 me-3 hidden -translate-y-1/2 rounded-md border border-hairline bg-elevated px-3 py-1.5 font-mono text-xs whitespace-nowrap text-platinum opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block motion-reduce:transition-none"
        aria-hidden
      >
        {t("label")}
      </span>
    </motion.a>
  );
}
