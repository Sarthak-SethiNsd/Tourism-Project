import type { Trip, TripInput, TripPlace, TripPlaceInput } from "@/features/trip-planner/types";

const STORAGE_KEY = "india-tourism.trips";

export function createLocalTrip(input: TripInput) {
  const now = new Date();
  const trip: Trip = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `trip-${Date.now()}`,
    ...input,
    places: [],
    createdAt: now,
    updatedAt: now,
  };

  writeTrips([trip, ...getLocalTrips()]);
}

export function getLocalTrips(): Trip[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(storedValue)
      ? storedValue.filter(isStoredTrip).map(reviveTrip).sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime())
      : [];
  } catch {
    return [];
  }
}

export function addPlaceToLocalTrip(tripId: string, place: TripPlaceInput) {
  const now = new Date();
  writeTrips(getLocalTrips().map((trip) => trip.id === tripId ? {
    ...trip,
    places: [...trip.places.filter((item) => item.placeId !== place.placeId), { ...place, addedAt: now }],
    updatedAt: now,
  } : trip));
}

export function updateLocalTripPlaces(tripId: string, places: TripPlace[]) {
  const now = new Date();
  writeTrips(getLocalTrips().map((trip) => trip.id === tripId ? { ...trip, places, updatedAt: now } : trip));
}

export function deleteLocalTrip(tripId: string) {
  writeTrips(getLocalTrips().filter((trip) => trip.id !== tripId));
}

function writeTrips(trips: Trip[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  }
}

function isStoredTrip(value: unknown): value is Trip & { createdAt: string; updatedAt: string } {
  return Boolean(value && typeof value === "object" && "id" in value && typeof value.id === "string" && "name" in value && typeof value.name === "string" && "places" in value && Array.isArray(value.places));
}

function reviveTrip(trip: Trip & { createdAt: string; updatedAt: string }) {
  return {
    ...trip,
    createdAt: new Date(trip.createdAt),
    updatedAt: new Date(trip.updatedAt),
    places: trip.places.map((place) => ({ ...place, addedAt: new Date(place.addedAt) })),
  } satisfies Trip;
}
