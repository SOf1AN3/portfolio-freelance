export const SECTION_IDS = [
  "services",
  "projects",
  "process",
  "about",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export function isSectionId(value: string): value is SectionId {
  return (SECTION_IDS as readonly string[]).includes(value);
}

/**
 * Builds a locale-aware href pointing at a home page section.
 * Next.js App Router scrolls to the matching `id` after navigation, so this
 * works both from the home page and from project detail pages.
 */
export function sectionHref(id: SectionId) {
  return { pathname: "/", hash: `#${id}` } as const;
}