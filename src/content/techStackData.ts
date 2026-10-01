import type { IconType } from "react-icons";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiOpenjdk,
  SiSocketdotio,
  SiOpenapiinitiative,
  SiGraphql,
  SiExpo,
  SiPwa,
  SiFlutter,
  SiDart,
  SiApple,
  SiAndroid,
  SiPostgresql,
  SiMongodb,
  SiElectron,
  SiNeon,
  SiSupabase,
  SiPrisma,
  SiFirebase,
  SiDotnet,
  SiGit,
  SiGithub,
  SiDocker,
  SiVercel,
  SiGithubactions,
  SiGitlab,
  SiJenkins,
} from "react-icons/si";
import { TbDeviceMobile } from "react-icons/tb";
import {
  Layout,
  Server,
  Database,
  Smartphone,
  Monitor,
  Wrench,
} from "lucide-react";

export type TechCategory =
  | "frontend"
  | "backend"
  | "data"
  | "mobile"
  | "desktop"
  | "tools";

export type TechItem = {
  name: string;
  icon: IconType;
  color: string;
};

export type TechGroup = {
  category: TechCategory;
  icon: IconType;
  accent: {
    tile: string;
    glow: string;
  };
  items: TechItem[];
};

export const techGroups: TechGroup[] = [
  {
    category: "frontend",
    icon: Layout,
    accent: {
      tile: "bg-sky-500/10 text-sky-400",
      glow: "from-sky-500/10",
    },
    items: [
      { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#38BDF8" },
      { name: "Framer Motion", icon: SiFramer, color: "#FF0055" },
    ],
  },
  {
    category: "backend",
    icon: Server,
    accent: {
      tile: "bg-emerald-500/10 text-emerald-400",
      glow: "from-emerald-500/10",
    },
    items: [
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Express", icon: SiExpress, color: "#FFFFFF" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "Java", icon: SiOpenjdk, color: "#F89820" },
      { name: "Socket.io", icon: SiSocketdotio, color: "#A1A1AA" },
      { name: "REST", icon: SiOpenapiinitiative, color: "#6BA539" },
      { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
    ],
  },
  {
    category: "mobile",
    icon: Smartphone,
    accent: {
      tile: "bg-violet-500/10 text-violet-400",
      glow: "from-violet-500/10",
    },
    items: [
      { name: "React Native", icon: TbDeviceMobile, color: "#61DAFB" },
      { name: "Expo", icon: SiExpo, color: "#E6E6E6" },
      { name: "Progressive Web Apps", icon: SiPwa, color: "#5A0FC8" },
      { name: "Flutter", icon: SiFlutter, color: "#02569B" },
      { name: "Dart", icon: SiDart, color: "#0175C2" },
      { name: "iOS", icon: SiApple, color: "#F5F5F7" },
      { name: "Android", icon: SiAndroid, color: "#3DDC84" },
    ],
  },
  {
    category: "data",
    icon: Database,
    accent: {
      tile: "bg-amber-500/10 text-amber-400",
      glow: "from-amber-500/10",
    },
    items: [
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "Neon", icon: SiNeon, color: "#00E599" },
      { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
      { name: "Prisma", icon: SiPrisma, color: "#A8A9AD" },
      { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
    ],
  },
  {
    category: "desktop",
    icon: Monitor,
    accent: {
      tile: "bg-cyan-500/10 text-cyan-400",
      glow: "from-cyan-500/10",
    },
    items: [
      { name: "Electron", icon: SiElectron, color: "#47848F" },
      { name: "Flutter", icon: SiFlutter, color: "#02569B" },
      { name: ".NET", icon: SiDotnet, color: "#512BD4" },
      { name: "Java", icon: SiOpenjdk, color: "#F89820" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
    ],
  },
  {
    category: "tools",
    icon: Wrench,
    accent: {
      tile: "bg-rose-500/10 text-rose-400",
      glow: "from-rose-500/10",
    },
    items: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#FFFFFF" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Vercel", icon: SiVercel, color: "#FFFFFF" },
      { name: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
      { name: "GitLab CI", icon: SiGitlab, color: "#FC6D26" },
      { name: "Jenkins", icon: SiJenkins, color: "#D24939" },
    ],
  },
];