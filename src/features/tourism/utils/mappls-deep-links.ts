import type { TourismGeoPoint } from "@/features/tourism/providers/tourism-provider";

type MapplsPlaceReference = TourismGeoPoint & {
  mapplsPin?: string;
};

export function createMapplsPlaceUrl({ mapplsPin, latitude, longitude }: MapplsPlaceReference) {
  if (mapplsPin?.trim()) {
    return `https://mappls.com/${encodeURIComponent(mapplsPin)}`;
  }

  return `https://mappls.com/@${latitude},${longitude}`;
}

export function createMapplsDirectionsUrl(
  origin: TourismGeoPoint,
  destination: MapplsPlaceReference,
) {
  const destinationReference = destination.mapplsPin?.trim() || `${destination.latitude},${destination.longitude}`;
  const places = `${origin.latitude},${origin.longitude};${destinationReference}`;

  return `https://mappls.com/direction?places=${encodeURIComponent(places)}`;
}
