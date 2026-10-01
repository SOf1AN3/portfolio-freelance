"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/utils";

export function WhatsAppButton() {
  const t = useTranslations("whatsappButton");

  return (
    <motion.a
      href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.3 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 end-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#22c55e] text-white shadow-xl shadow-[#22c55e]/30 transition-colors hover:bg-[#16a34a] sm:bottom-8 sm:end-8"
      aria-label={t("label")}
    >
      <MessageCircle className="size-7" />
      <span className="absolute end-full me-3 hidden rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 sm:block pointer-events-none">
        {t("label")}
      </span>
      <span className="sr-only">{t("label")}</span>
    </motion.a>
  );
}
