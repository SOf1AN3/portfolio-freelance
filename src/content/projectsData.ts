export type Project = {
  slug: string;
  titleKey: string;
  descriptionKey: string;
  focusKey: string;
  contextKey: string; // "projects.items.N.context"
  roleKey: string; // "projects.items.N.role"
  stack: string[];
  link: string;
  year: string;
  category: "saas" | "ai" | "delivery" | "consulting";
  status: "published" | "client" | "personal" | "prototype" | "wip";
};

// TODO(validation utilisateur) : confirmer pour CHAQUE projet le statut exact
// (livré pour un client / projet personnel / prototype / en développement) et
// le rôle exact (conception seule, développement, maintenance...).
// "published" = le projet est actuellement accessible en ligne (vérifié), c'est
// le statut le plus prudent tant que le détail n'est pas confirmé.
export const projects: Project[] = [
  {
    slug: "dental-clinic-saas",
    titleKey: "projects.items.0.title",
    descriptionKey: "projects.items.0.description",
    focusKey: "projects.items.0.focus",
    contextKey: "projects.items.0.context",
    roleKey: "projects.items.0.role",
    stack: ["Next.js", "PostgreSQL", "Tailwind CSS", "TypeScript"],
    link: "https://dental-app-beta1.vercel.app/",
    year: "2025",
    category: "saas",
    status: "published",
  },
  {
    slug: "papernote",
    titleKey: "projects.items.1.title",
    descriptionKey: "projects.items.1.description",
    focusKey: "projects.items.1.focus",
    contextKey: "projects.items.1.context",
    roleKey: "projects.items.1.role",
    stack: ["Next.js", "AI Models API", "TypeScript", "Tailwind CSS"],
    link: "https://reviewer-ai-delta.vercel.app/fr",
    year: "2025",
    category: "ai",
    status: "published",
  },
  {
    slug: "delyx-delivery",
    titleKey: "projects.items.2.title",
    descriptionKey: "projects.items.2.description",
    focusKey: "projects.items.2.focus",
    contextKey: "projects.items.2.context",
    roleKey: "projects.items.2.role",
    stack: ["Next.js", "PostgreSQL", "TypeScript", "Tailwind CSS"],
    link: "https://delyx-delivery.vercel.app/",
    year: "2026",
    category: "delivery",
    status: "published",
  },
  {
    slug: "tiberium-consulting",
    titleKey: "projects.items.3.title",
    descriptionKey: "projects.items.3.description",
    focusKey: "projects.items.3.focus",
    contextKey: "projects.items.3.context",
    roleKey: "projects.items.3.role",
    stack: ["MongoDB", "Express", "React", "Node.js", "Socket.io"],
    link: "https://tiberium-next.vercel.app/",
    year: "2024",
    category: "consulting",
    status: "published",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
