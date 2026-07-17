import type { WishlistPlace, WishlistPlaceInput } from "@/features/wishlist/types";

const STORAGE_KEY = "india-tourism.wishlist";

export function addLocalWishlistPlace(input: WishlistPlaceInput) {
  const now = new Date();
  const entry: WishlistPlace = { ...input, id: input.placeId, addedAt: now, createdAt: now, updatedAt: now };
  writeEntries([entry, ...getLocalWishlistPlaces().filter((place) => place.placeId !== input.placeId)]);
}

export function getLocalWishlistPlaces(): WishlistPlace[] {
  if (typeof window === "undefined") return [];

  try {
    const storedValue: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(storedValue)
      ? storedValue
          .filter(isStoredEntry)
          .map((entry) => ({ ...entry, addedAt: new Date(entry.addedAt), createdAt: new Date(entry.createdAt), updatedAt: new Date(entry.updatedAt) }))
          .sort((left, right) => right.addedAt.getTime() - left.addedAt.getTime())
      : [];
  } catch {
    return [];
  }
}

export function removeLocalWishlistPlace(placeId: string) {
  writeEntries(getLocalWishlistPlaces().filter((place) => place.placeId !== placeId));
}

export function isLocalWishlistPlace(placeId: string) {
  return getLocalWishlistPlaces().some((place) => place.placeId === placeId);
}

function writeEntries(entries: WishlistPlace[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
}

function isStoredEntry(value: unknown): value is WishlistPlace & { addedAt: string; createdAt: string; updatedAt: string } {
  return Boolean(
    value && typeof value === "object" && "placeId" in value && typeof value.placeId === "string" &&
      "placeName" in value && typeof value.placeName === "string" && "addedAt" in value && typeof value.addedAt === "string" &&
      "createdAt" in value && typeof value.createdAt === "string" && "updatedAt" in value && typeof value.updatedAt === "string",
  );
}
