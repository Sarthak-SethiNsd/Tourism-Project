import { Bot, Compass, Heart, KeyRound, Map, Settings, UserRound } from "lucide-react";

export const foundationModules = [
  {
    id: "authentication",
    name: "Authentication",
    description: "Firebase Auth boundary, auth services, and future route protection hooks.",
    status: "configured",
    icon: KeyRound,
  },
  {
    id: "tourism",
    name: "Tourism",
    description: "India geography layer with states, union territories, and dynamically loaded districts.",
    status: "configured",
    icon: Compass,
  },
  {
    id: "maps",
    name: "Maps",
    description: "Independent feature boundary for future interactive map integrations.",
    status: "placeholder",
    icon: Map,
  },
  {
    id: "saved-places",
    name: "Saved Places",
    description: "Store and service boundaries ready for user saved-place workflows.",
    status: "placeholder",
    icon: Heart,
  },
  {
    id: "user",
    name: "User",
    description: "Typed user profile model and account feature boundary.",
    status: "placeholder",
    icon: UserRound,
  },
  {
    id: "settings",
    name: "Settings",
    description: "Configuration-driven preferences and app settings module.",
    status: "placeholder",
    icon: Settings,
  },
  {
    id: "ai",
    name: "AI",
    description: "Isolated extension point for prompts, conversations, RAG, and retrieval later.",
    status: "isolated",
    icon: Bot,
  },
] as const;

export type FoundationModule = (typeof foundationModules)[number];
