import * as React from "react";

type SectionHeaderAlign = "start" | "between";

interface SectionHeaderProps {
  /** Micro-index technique, ex. « 01 / ARCHITECTURE & OFFRE DE SERVICES ». */
  index: string;
  title: string;
  lead?: string;
  /** Alignement de l'en-tête : « start » (défaut) ou « between » (titre/CTA). */
  align?: SectionHeaderAlign;
  /** Emplacement optionnel de l'action (CTA) alignée à droite du titre. */
  children?: React.ReactNode;
}

function SectionHeader({
  index,
  title,
  lead,
  align = "start",
  children,
}: SectionHeaderProps): React.JSX.Element {
  const eyebrow = (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald">
        {index}
      </span>
      <span aria-hidden="true" className="h-px w-12 bg-hairline" />
    </div>
  );

  const heading = (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-semibold leading-[1.15] tracking-tight text-platinum">
        {title}
      </h2>
      {lead ? <p className="max-w-2xl text-mist leading-relaxed">{lead}</p> : null}
    </div>
  );

  const hasActionRow = align === "between" || Boolean(children);

  return (
    <header className="flex flex-col gap-5">
      {eyebrow}
      {hasActionRow ? (
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          {heading}
          {children ? <div className="shrink-0">{children}</div> : null}
        </div>
      ) : (
        heading
      )}
    </header>
  );
}

export { SectionHeader };
export type { SectionHeaderProps, SectionHeaderAlign };
