export const routes = {
  home: "/",
  login: "/login",
  explore: "/explore",
  state: "/state",
  district: "/district",
  categories: "/categories",
  place: "/place",
  saved: "/saved",
  compare: "/compare",
  recentlyViewed: "/recently-viewed",
  tripPlanner: "/trip-planner",
  profile: "/profile",
  settings: "/settings",
  auth: "/login",
  tourism: "/tourism",
  maps: "/maps",
  savedPlaces: "/saved",
  user: "/profile",
  ai: "/ai",
} as const;

export type AppRoute = keyof typeof routes;
