import type { RecentlyViewedPlace, RecentlyViewedPlaceInput } from "@/features/recently-viewed/types";

const STORAGE_KEY = "india-tourism.recently-viewed-places";
const MAX_RECENTLY_VIEWED_PLACES = 20;

export function saveLocalRecentlyViewedPlace(input: RecentlyViewedPlaceInput) {
  const entry: RecentlyViewedPlace = { ...input, viewedAt: new Date() };
  const nextEntries = [entry, ...getLocalRecentlyViewedPlaces().filter((place) => place.placeId !== input.placeId)].slice(
    0,
    MAX_RECENTLY_VIEWED_PLACES,
  );

  writeEntries(nextEntries);
}

export function getLocalRecentlyViewedPlaces(): RecentlyViewedPlace[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");

    return Array.isArray(storedValue)
      ? storedValue
          .filter(isStoredEntry)
          .map((entry) => ({ ...entry, viewedAt: new Date(entry.viewedAt) }))
          .sort((left, right) => right.viewedAt.getTime() - left.viewedAt.getTime())
          .slice(0, MAX_RECENTLY_VIEWED_PLACES)
      : [];
  } catch {
    return [];
  }
}

export function removeLocalRecentlyViewedPlace(placeId: string) {
  writeEntries(getLocalRecentlyViewedPlaces().filter((place) => place.placeId !== placeId));
}

export function clearLocalRecentlyViewedPlaces() {
  writeEntries([]);
}

function writeEntries(entries: RecentlyViewedPlace[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function isStoredEntry(value: unknown): value is RecentlyViewedPlace & { viewedAt: string } {
  return Boolean(
    value &&
      typeof value === "object" &&
      "placeId" in value &&
      typeof value.placeId === "string" &&
      "placeName" in value &&
      typeof value.placeName === "string" &&
      "viewedAt" in value &&
      typeof value.viewedAt === "string",
  );
}
