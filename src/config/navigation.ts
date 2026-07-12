import { Compass, Heart, Home, Map, Scale, Settings, UserRound } from "lucide-react";
import { routes } from "@/config/routes";

export const primaryNavigation = [
  { label: "Home", href: routes.home, icon: Home, disabled: false },
  { label: "Explore", href: routes.explore, icon: Compass, disabled: false },
  { label: "Map", href: routes.maps, icon: Map, disabled: true },
  { label: "Saved", href: routes.saved, icon: Heart, disabled: false },
] as const;

export const secondaryNavigation = [
  { label: "Compare", href: routes.compare, icon: Scale, disabled: false },
  { label: "Profile", href: routes.profile, icon: UserRound, disabled: false },
  { label: "Settings", href: routes.settings, icon: Settings, disabled: false },
] as const;
