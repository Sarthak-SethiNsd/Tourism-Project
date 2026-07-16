import type { CollectionInput, CollectionPlace, CollectionPlaceInput, PlaceCollection } from "@/features/collections/types";

const STORAGE_KEY = "india-tourism.collections";

export function createLocalCollection(input: CollectionInput) {
  const now = new Date();
  const collection: PlaceCollection = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `collection-${Date.now()}`,
    ...input,
    places: [],
    createdAt: now,
    updatedAt: now,
  };
  writeCollections([collection, ...getLocalCollections()]);
}

export function getLocalCollections(): PlaceCollection[] {
  if (typeof window === "undefined") return [];
  try {
    const storedValue: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(storedValue)
      ? storedValue.filter(isStoredCollection).map(reviveCollection).sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime())
      : [];
  } catch { return []; }
}

export function addPlaceToLocalCollection(collectionId: string, place: CollectionPlaceInput) {
  const now = new Date();
  writeCollections(getLocalCollections().map((collection) => collection.id === collectionId ? {
    ...collection,
    places: [...collection.places.filter((item) => item.placeId !== place.placeId), { ...place, addedAt: now }],
    updatedAt: now,
  } : collection));
}

export function removePlaceFromLocalCollection(collectionId: string, places: CollectionPlace[]) {
  const now = new Date();
  writeCollections(getLocalCollections().map((collection) => collection.id === collectionId ? { ...collection, places, updatedAt: now } : collection));
}

export function renameLocalCollection(collectionId: string, input: CollectionInput) {
  const now = new Date();
  writeCollections(getLocalCollections().map((collection) => collection.id === collectionId ? { ...collection, ...input, updatedAt: now } : collection));
}

export function deleteLocalCollection(collectionId: string) {
  writeCollections(getLocalCollections().filter((collection) => collection.id !== collectionId));
}

function writeCollections(collections: PlaceCollection[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
}

function isStoredCollection(value: unknown): value is PlaceCollection & { createdAt: string; updatedAt: string } {
  return Boolean(value && typeof value === "object" && "id" in value && typeof value.id === "string" && "name" in value && typeof value.name === "string" && "places" in value && Array.isArray(value.places));
}

function reviveCollection(collection: PlaceCollection & { createdAt: string; updatedAt: string }) {
  return { ...collection, createdAt: new Date(collection.createdAt), updatedAt: new Date(collection.updatedAt), places: collection.places.map((place) => ({ ...place, addedAt: new Date(place.addedAt) })) } satisfies PlaceCollection;
}
