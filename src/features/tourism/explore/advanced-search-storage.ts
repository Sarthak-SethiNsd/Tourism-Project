import type { ExploreFilterState } from "@/features/tourism/explore/explore-filter-bar";

const STORAGE_KEY = "india-tourism.explore-filters";

export function getStoredExploreFilters(): Partial<ExploreFilterState> {
  if (typeof window === "undefined") return {};
  try {
    const value: unknown = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "{}");
    return value && typeof value === "object" ? value as Partial<ExploreFilterState> : {};
  } catch { return {}; }
}

export function storeExploreFilters(filters: ExploreFilterState) {
  if (typeof window !== "undefined") window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
}
