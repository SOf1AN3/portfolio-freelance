"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE, cn } from "@/lib/utils";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";

export function WhatsAppButton() {
  const t = useTranslations("whatsappButton");
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  /** L'entrée est différée de 1,2 s : ce délai ne doit plus s'appliquer ensuite. */
  const [entered, setEntered] = useState(false);
  /**
   * Observation : section `#contact` visible, rattachée à la page où
   * l'observation a eu lieu. Hors de cette page, la valeur est `false`
   * sans réinitialisation explicite.
   */
  const [observed, setObserved] = useState<{
    pathname: string;
    visible: boolean;
  }>({ pathname, visible: false });

  const overContact = observed.pathname === pathname && observed.visible;

  // La section `#contact` n'existe que sur la page d'accueil : si elle est
  // absente, le bouton reste visible. L'observation est refaite à chaque
  // navigation, la section étant montée/démontée par le routeur.
  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;

    const observer = new IntersectionObserver(
      (entries) =>
        setObserved({
          pathname,
          visible: entries.some((entry) => entry.isIntersecting),
        }),
      { threshold: 0 },
    );

    observer.observe(contact);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <motion.a
      href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: overContact ? 0 : 1,
        scale: 1,
        y: overContact ? 8 : 0,
      }}
      transition={
        overContact
          ? // Masquage : instantané si l'utilisateur réduit les animations.
            { duration: prefersReduced ? 0 : 0.2, ease: "easeOut" }
          : { delay: entered ? 0 : 1.2, duration: 0.3, ease: "easeOut" }
      }
      onAnimationComplete={() => setEntered(true)}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] end-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald text-on-emerald shadow-lg shadow-emerald/30 transition-colors hover:bg-emerald-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald motion-reduce:transition-none sm:bottom-8 sm:end-8",
        // État masqué : plus aucun clic possible au-dessus du formulaire.
        overContact && "pointer-events-none",
      )}
      aria-label={t("label")}
      aria-hidden={overContact}
      tabIndex={overContact ? -1 : undefined}
    >
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
