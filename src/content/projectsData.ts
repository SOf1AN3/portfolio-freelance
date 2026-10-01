export type Project = {
  slug: string;
  titleKey: string;
  descriptionKey: string;
  focusKey: string;
  stack: string[];
  link: string;
  image: string;
  year: string;
  category: "saas" | "ai" | "media" | "consulting";
};

export const projects: Project[] = [
  {
    slug: "dental-clinic-saas",
    titleKey: "projects.items.0.title",
    descriptionKey: "projects.items.0.description",
    focusKey: "projects.items.0.focus",
    stack: ["Next.js", "PostgreSQL", "Tailwind CSS", "TypeScript"],
    link: "https://dental-app-beta1.vercel.app/",
    image: "/projects/dental-saas.svg",
    year: "2025",
    category: "saas",
  },
  {
    slug: "papernote",
    titleKey: "projects.items.1.title",
    descriptionKey: "projects.items.1.description",
    focusKey: "projects.items.1.focus",
    stack: ["Next.js", "AI Models API", "TypeScript", "Tailwind CSS"],
    link: "https://reviewer-ai-delta.vercel.app/fr",
    image: "/projects/papernote.svg",
    year: "2025",
    category: "ai",
  },
  {
    slug: "myks-radio",
    titleKey: "projects.items.2.title",
    descriptionKey: "projects.items.2.description",
    focusKey: "projects.items.2.focus",
    stack: ["React / Next.js", "Icecast API", "Custom Admin Dashboard"],
    link: "https://myks-radio.vercel.app/",
    image: "/projects/myks-radio.svg",
    year: "2024",
    category: "media",
  },
  {
    slug: "tiberium-consulting",
    titleKey: "projects.items.3.title",
    descriptionKey: "projects.items.3.description",
    focusKey: "projects.items.3.focus",
    stack: ["MongoDB", "Express", "React", "Node.js", "Socket.io"],
    link: "https://tiberium-next.vercel.app/",
    image: "/projects/tiberium.svg",
    year: "2024",
    category: "consulting",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
