export type TechItem = {
  name: string;
  category: "frontend" | "backend" | "mobile" | "tools";
};

export const techStack: TechItem[] = [
  { name: "Next.js", category: "frontend" },
  { name: "React", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Framer Motion", category: "frontend" },
  { name: "Node.js", category: "backend" },
  { name: "Express", category: "backend" },
  { name: "PostgreSQL", category: "backend" },
  { name: "MongoDB", category: "backend" },
  { name: "Socket.io", category: "backend" },
  { name: "React Native", category: "mobile" },
  { name: "Expo", category: "mobile" },
  { name: "Flutter Mobile", category: "mobile" },
  { name: "Dart", category: "mobile" },
  { name: "iOS / Android", category: "mobile" },
  { name: "Git / GitHub", category: "tools" },
  { name: "Docker", category: "tools" },
  { name: "Vercel", category: "tools" },
  { name: "CI/CD", category: "tools" },
  { name: "REST / GraphQL", category: "tools" },
];
