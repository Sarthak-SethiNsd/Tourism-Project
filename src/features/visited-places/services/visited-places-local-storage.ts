import type { VisitedPlace, VisitedPlaceInput } from "@/features/visited-places/types";

const STORAGE_KEY = "india-tourism.visited";

export function addLocalVisitedPlace(input: VisitedPlaceInput) {
  const now = new Date();
  const entry: VisitedPlace = { ...input, id: input.placeId, visitedAt: now, createdAt: now, updatedAt: now };
  writeEntries([entry, ...getLocalVisitedPlaces().filter((place) => place.placeId !== input.placeId)]);
}

export function getLocalVisitedPlaces(): VisitedPlace[] {
  if (typeof window === "undefined") return [];
  try {
    const storedValue: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(storedValue)
      ? storedValue.filter(isStoredEntry).map((entry) => ({ ...entry, visitedAt: new Date(entry.visitedAt), createdAt: new Date(entry.createdAt), updatedAt: new Date(entry.updatedAt) })).sort((left, right) => right.visitedAt.getTime() - left.visitedAt.getTime())
      : [];
  } catch { return []; }
}

export function removeLocalVisitedPlace(placeId: string) { writeEntries(getLocalVisitedPlaces().filter((place) => place.placeId !== placeId)); }
export function isLocalVisitedPlace(placeId: string) { return getLocalVisitedPlaces().some((place) => place.placeId === placeId); }

function writeEntries(entries: VisitedPlace[]) { if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }
function isStoredEntry(value: unknown): value is VisitedPlace & { visitedAt: string; createdAt: string; updatedAt: string } {
  return Boolean(value && typeof value === "object" && "placeId" in value && typeof value.placeId === "string" && "placeName" in value && typeof value.placeName === "string" && "visitedAt" in value && typeof value.visitedAt === "string" && "createdAt" in value && typeof value.createdAt === "string" && "updatedAt" in value && typeof value.updatedAt === "string");
}
