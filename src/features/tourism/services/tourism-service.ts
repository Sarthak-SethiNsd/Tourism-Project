import { activeTourismProvider } from "@/features/tourism/providers/active-tourism-provider";
import type { SavedPlace } from "@/features/saved-places/types";
import type { SearchHistoryEntry, SearchHistoryInput } from "@/features/search-history/types";
import {
  isUserPlaceSaved,
  listSavedPlaces,
  saveUserPlace,
  unsaveUserPlace,
} from "@/features/saved-places/services/saved-places-service";
import {
  clearUserSearchHistory,
  deleteUserSearchHistoryEntry,
  listUserSearchHistory,
  saveUserSearchHistoryEntry,
} from "@/features/search-history/services/search-history-service";
import type {
  AutocompleteOptions,
  AutocompleteSuggestion,
  GeocodeOptions,
  GeocodeResult,
  NearbyPlace,
  NearbyPlaceCategory,
  ReverseGeocodeOptions,
  TravelInfo,
  TravelMode,
  TimeZoneResult,
  TourismGeoPoint,
  TourismPlacePhoto,
  TourismProvider,
  TourismRouteRequest,
  TourismRouteSummary,
} from "@/features/tourism/providers/tourism-provider";
import type { IndianDistrict, IndianRegion } from "@/features/tourism/types/region";
import { filterTourismPlaces } from "@/features/tourism/utils/place-filters";
import type { TourismCategory, TourismLocationFilter, TourismPlace } from "@/types/tourism";

type PlaceSearchHistoryContext = {
  district?: IndianDistrict;
  region?: IndianRegion;
  primaryCategory?: TourismCategory;
};

export class TourismService {
  constructor(private readonly provider: TourismProvider) {}

  getProviderName() {
    return this.provider.name;
  }

  listCategories(): Promise<TourismCategory[]> {
    return this.provider.listCategories();
  }

  getCategoryById(categoryId: string): Promise<TourismCategory | null> {
    return this.provider.getCategoryById(categoryId);
  }

  listPlaces(filters?: TourismLocationFilter): Promise<TourismPlace[]> {
    return this.provider.listPlaces(filters);
  }

  getPlaceById(placeId: string): Promise<TourismPlace | null> {
    return this.provider.getPlaceById(placeId);
  }

  savePlace(userId: string, place: TourismPlace): Promise<void> {
    return saveUserPlace(userId, this.mapPlaceToSavedPlaceInput(place));
  }

  unsavePlace(userId: string, placeId: string): Promise<void> {
    return unsaveUserPlace(userId, placeId);
  }

  isPlaceSaved(userId: string, placeId: string): Promise<boolean> {
    return isUserPlaceSaved(userId, placeId);
  }

  getSavedPlaces(userId: string): Promise<SavedPlace[]> {
    return listSavedPlaces(userId);
  }

  saveSearchHistoryEntry(
    userId: string,
    place: TourismPlace,
    context?: PlaceSearchHistoryContext,
  ): Promise<void> {
    return saveUserSearchHistoryEntry(userId, this.mapPlaceToSearchHistoryInput(place, context));
  }

  getSearchHistory(userId: string): Promise<SearchHistoryEntry[]> {
    return listUserSearchHistory(userId);
  }

  deleteSearchHistoryEntry(userId: string, entryId: string): Promise<void> {
    return deleteUserSearchHistoryEntry(userId, entryId);
  }

  clearSearchHistory(userId: string): Promise<void> {
    return clearUserSearchHistory(userId);
  }

  getPlaceDetailsBatch(placeIds: string[]): Promise<(TourismPlace | null | undefined)[]> {
    return (
      this.provider.getPlaceDetailsBatch?.(placeIds) ??
      Promise.all(placeIds.map((placeId) => this.getPlaceDetailsBatchItem(placeId)))
    );
  }

  listFeaturedPlaces(): Promise<TourismPlace[]> {
    return this.provider.listFeaturedPlaces();
  }

  listRegions(): Promise<IndianRegion[]> {
    return this.provider.listRegions();
  }

  listStates(): Promise<IndianRegion[]> {
    return this.provider.listStates();
  }

  listUnionTerritories(): Promise<IndianRegion[]> {
    return this.provider.listUnionTerritories();
  }

  getRegionById(regionId: string): Promise<IndianRegion | null> {
    return this.provider.getRegionById(regionId);
  }

  listDistrictsByRegion(regionId: string): Promise<IndianDistrict[]> {
    return this.provider.listDistrictsByRegion(regionId);
  }

  getNearbyPlaces(
    latitude: number,
    longitude: number,
    radius: number,
    category: NearbyPlaceCategory,
    signal?: AbortSignal,
  ): Promise<NearbyPlace[]> {
    return this.provider.getNearbyPlaces?.(latitude, longitude, radius, category, signal) ?? Promise.resolve([]);
  }

  listExternalPlacePhotos(placeId: string, signal?: AbortSignal): Promise<TourismPlacePhoto[]> {
    return this.provider.listExternalPlacePhotos(placeId, signal);
  }

  getAutocompleteSuggestions(query: string, options?: AutocompleteOptions): Promise<AutocompleteSuggestion[]> {
    return this.provider.getAutocompleteSuggestions?.(query, options) ?? Promise.resolve([]);
  }

  geocode(query: string, options?: GeocodeOptions): Promise<GeocodeResult[]> {
    return this.provider.geocode?.(query, options) ?? Promise.resolve([]);
  }

  geocodeAddress(address: string): Promise<TourismGeoPoint | null> {
    return this.provider.geocodeAddress(address);
  }

  reverseGeocode(latitude: number, longitude: number, options?: ReverseGeocodeOptions): Promise<GeocodeResult[]> {
    return this.provider.reverseGeocode?.(latitude, longitude, options) ?? Promise.resolve([]);
  }

  reverseGeocodeBatch(locations: TourismGeoPoint[]): Promise<GeocodeResult[][]> {
    return (
      this.provider.reverseGeocodeBatch?.(locations) ??
      Promise.all(locations.map((location) => this.reverseGeocodeBatchItem(location)))
    );
  }

  getTimeZone(
    latitude: number,
    longitude: number,
    timestamp?: number,
    signal?: AbortSignal,
  ): Promise<TimeZoneResult | undefined> {
    return this.provider.getTimeZone?.(latitude, longitude, timestamp, signal) ?? Promise.resolve(undefined);
  }

  getTimeZoneBatch(locations: TourismGeoPoint[]): Promise<(TimeZoneResult | undefined)[]> {
    return (
      this.provider.getTimeZoneBatch?.(locations) ??
      Promise.all(locations.map((location) => this.getTimeZoneBatchItem(location)))
    );
  }

  getTravelInfo(
    origin: TourismGeoPoint | string,
    destination: TourismGeoPoint | string,
    travelMode: TravelMode,
    signal?: AbortSignal,
  ): Promise<TravelInfo> {
    return (
      this.provider.getTravelInfo?.(origin, destination, travelMode, signal) ??
      Promise.resolve({
        distanceMeters: null,
        distanceText: "Not implemented",
        durationSeconds: null,
        durationText: "Not implemented",
        travelMode,
        status: "not_implemented",
        estimated: false,
      })
    );
  }

  getRouteSummary(request: TourismRouteRequest): Promise<TourismRouteSummary | null> {
    return this.provider.getRouteSummary(request);
  }

  getDistanceMatrix(requests: TourismRouteRequest[]): Promise<TourismRouteSummary[]> {
    return this.provider.getDistanceMatrix(requests);
  }

  private async getPlaceDetailsBatchItem(placeId: string): Promise<TourismPlace | null | undefined> {
    try {
      return (await this.provider.getExternalPlaceDetails(placeId)) ?? this.getPlaceById(placeId);
    } catch {
      return this.getPlaceById(placeId);
    }
  }

  private mapPlaceToSavedPlaceInput(place: TourismPlace) {
    const primaryImage = place.images?.[0];

    return {
      placeId: place.id,
      googlePlaceId: place.googlePlaceId,
      name: place.name,
      photoUrl: primaryImage?.url ?? place.imageUrl,
      photoReference: primaryImage?.photoReference,
      location: {
        latitude: place.coordinates?.latitude ?? null,
        longitude: place.coordinates?.longitude ?? null,
        address: place.address?.formattedAddress,
        districtName: place.districtName ?? place.address?.district,
        regionName: place.address?.region,
      },
    };
  }

  private mapPlaceToSearchHistoryInput(
    place: TourismPlace,
    context?: PlaceSearchHistoryContext,
  ): SearchHistoryInput {
    const primaryImage = place.images?.[0];
    const primaryCategory = context?.primaryCategory;

    return {
      placeId: place.id,
      googlePlaceId: place.googlePlaceId,
      placeName: place.name,
      district: context?.district?.name ?? place.districtName ?? place.address?.district,
      state: context?.region?.name ?? place.address?.region,
      country: place.address?.country ?? "India",
      primaryCategory: primaryCategory?.name ?? place.categoryIds[0],
      thumbnailPhotoReference: primaryImage?.photoReference,
      thumbnailUrl: primaryImage?.url ?? place.imageUrl,
    };
  }

  private async reverseGeocodeBatchItem(location: TourismGeoPoint): Promise<GeocodeResult[]> {
    try {
      return await this.reverseGeocode(location.latitude, location.longitude);
    } catch {
      return [];
    }
  }

  private async getTimeZoneBatchItem(location: TourismGeoPoint): Promise<TimeZoneResult | undefined> {
    try {
      return await this.getTimeZone(location.latitude, location.longitude);
    } catch {
      return undefined;
    }
  }
}

export const tourismService = new TourismService(activeTourismProvider);

export async function listTourismCategories(): Promise<TourismCategory[]> {
  return tourismService.listCategories();
}

export async function getTourismCategoryById(categoryId: string): Promise<TourismCategory | null> {
  return tourismService.getCategoryById(categoryId);
}

export async function listTourismPlaces(filters?: TourismLocationFilter): Promise<TourismPlace[]> {
  return tourismService.listPlaces(filters);
}

export async function getTourismPlaceById(placeId: string): Promise<TourismPlace | null> {
  return tourismService.getPlaceById(placeId);
}

export async function savePlace(userId: string, place: TourismPlace): Promise<void> {
  return tourismService.savePlace(userId, place);
}

export async function unsavePlace(userId: string, placeId: string): Promise<void> {
  return tourismService.unsavePlace(userId, placeId);
}

export async function isPlaceSaved(userId: string, placeId: string): Promise<boolean> {
  return tourismService.isPlaceSaved(userId, placeId);
}

export async function getSavedPlaces(userId: string): Promise<SavedPlace[]> {
  return tourismService.getSavedPlaces(userId);
}

export async function saveSearchHistoryEntry(
  userId: string,
  place: TourismPlace,
  context?: PlaceSearchHistoryContext,
): Promise<void> {
  return tourismService.saveSearchHistoryEntry(userId, place, context);
}

export async function getSearchHistory(userId: string): Promise<SearchHistoryEntry[]> {
  return tourismService.getSearchHistory(userId);
}

export async function deleteSearchHistoryEntry(userId: string, entryId: string): Promise<void> {
  return tourismService.deleteSearchHistoryEntry(userId, entryId);
}

export async function clearSearchHistory(userId: string): Promise<void> {
  return tourismService.clearSearchHistory(userId);
}

export async function getPlaceDetailsBatch(placeIds: string[]): Promise<(TourismPlace | null | undefined)[]> {
  return tourismService.getPlaceDetailsBatch(placeIds);
}

export async function listFeaturedTourismPlaces(): Promise<TourismPlace[]> {
  return tourismService.listFeaturedPlaces();
}

export async function listTourismRegions(): Promise<IndianRegion[]> {
  return tourismService.listRegions();
}

export async function getTourismRegionById(regionId: string): Promise<IndianRegion | null> {
  return tourismService.getRegionById(regionId);
}

export async function listTourismDistrictsByRegion(regionId: string): Promise<IndianDistrict[]> {
  return tourismService.listDistrictsByRegion(regionId);
}

export async function getNearbyTourismPlaces(
  latitude: number,
  longitude: number,
  radius: number,
  category: NearbyPlaceCategory,
  signal?: AbortSignal,
): Promise<NearbyPlace[]> {
  return tourismService.getNearbyPlaces(latitude, longitude, radius, category, signal);
}

export async function listExternalTourismPlacePhotos(
  placeId: string,
  signal?: AbortSignal,
): Promise<TourismPlacePhoto[]> {
  return tourismService.listExternalPlacePhotos(placeId, signal);
}

export async function getAutocompleteSuggestions(
  query: string,
  options?: AutocompleteOptions,
): Promise<AutocompleteSuggestion[]> {
  return tourismService.getAutocompleteSuggestions(query, options);
}

export async function geocode(query: string, options?: GeocodeOptions): Promise<GeocodeResult[]> {
  return tourismService.geocode(query, options);
}

export async function geocodeAddress(address: string): Promise<TourismGeoPoint | null> {
  return tourismService.geocodeAddress(address);
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  options?: ReverseGeocodeOptions,
): Promise<GeocodeResult[]> {
  return tourismService.reverseGeocode(latitude, longitude, options);
}

export async function reverseGeocodeBatch(locations: TourismGeoPoint[]): Promise<GeocodeResult[][]> {
  return tourismService.reverseGeocodeBatch(locations);
}

export async function getTimeZone(
  latitude: number,
  longitude: number,
  timestamp?: number,
  signal?: AbortSignal,
): Promise<TimeZoneResult | undefined> {
  return tourismService.getTimeZone(latitude, longitude, timestamp, signal);
}

export async function getTimeZoneBatch(locations: TourismGeoPoint[]): Promise<(TimeZoneResult | undefined)[]> {
  return tourismService.getTimeZoneBatch(locations);
}

export async function getTourismTravelInfo(
  origin: TourismGeoPoint | string,
  destination: TourismGeoPoint | string,
  travelMode: TravelMode,
  signal?: AbortSignal,
): Promise<TravelInfo> {
  return tourismService.getTravelInfo(origin, destination, travelMode, signal);
}

export async function getRouteSummary(request: TourismRouteRequest): Promise<TourismRouteSummary | null> {
  return tourismService.getRouteSummary(request);
}

export async function getDistanceMatrix(requests: TourismRouteRequest[]): Promise<TourismRouteSummary[]> {
  return tourismService.getDistanceMatrix(requests);
}

export { filterTourismPlaces };

export function createTourismService(provider: TourismProvider) {
  return new TourismService(provider);
}
