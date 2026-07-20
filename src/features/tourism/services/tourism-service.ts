import { activeTourismProvider } from "@/features/tourism/providers/active-tourism-provider";
import type { SavedPlace } from "@/features/saved-places/types";
import type { SearchHistoryEntry, SearchHistoryInput } from "@/features/search-history/types";
import type { RecentlyViewedPlace, RecentlyViewedPlaceInput } from "@/features/recently-viewed/types";
import type { Trip, TripInput, TripPlace, TripPlaceInput } from "@/features/trip-planner/types";
import type { CollectionInput, CollectionPlace, CollectionPlaceInput, PlaceCollection } from "@/features/collections/types";
import type { WishlistPlace, WishlistPlaceInput } from "@/features/wishlist/types";
import type { VisitedPlace, VisitedPlaceInput } from "@/features/visited-places/types";
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
import {
  clearUserRecentlyViewedPlaces,
  deleteUserRecentlyViewedPlace,
  listUserRecentlyViewedPlaces,
  saveUserRecentlyViewedPlace,
} from "@/features/recently-viewed/services/recently-viewed-service";
import {
  clearLocalRecentlyViewedPlaces,
  getLocalRecentlyViewedPlaces,
  removeLocalRecentlyViewedPlace,
  saveLocalRecentlyViewedPlace,
} from "@/features/recently-viewed/services/recently-viewed-local-storage";
import {
  addPlaceToLocalTrip,
  createLocalTrip,
  deleteLocalTrip,
  getLocalTrips,
  updateLocalTripPlaces,
} from "@/features/trip-planner/services/trip-local-storage";
import {
  addPlaceToUserTrip,
  createUserTrip,
  deleteUserTrip,
  listUserTrips,
  updateUserTripPlaces,
} from "@/features/trip-planner/services/trip-service";
import {
  addPlaceToLocalCollection,
  createLocalCollection,
  deleteLocalCollection,
  getLocalCollections,
  removePlaceFromLocalCollection,
  renameLocalCollection,
} from "@/features/collections/services/collections-local-storage";
import {
  addPlaceToUserCollection,
  createUserCollection,
  deleteUserCollection,
  listUserCollections,
  removePlaceFromUserCollection,
  renameUserCollection,
} from "@/features/collections/services/collections-service";
import {
  addLocalWishlistPlace,
  getLocalWishlistPlaces,
  isLocalWishlistPlace,
  removeLocalWishlistPlace,
} from "@/features/wishlist/services/wishlist-local-storage";
import {
  addUserWishlistPlace,
  isUserWishlistPlace,
  listUserWishlistPlaces,
  removeUserWishlistPlace,
} from "@/features/wishlist/services/wishlist-service";
import {
  addLocalVisitedPlace,
  getLocalVisitedPlaces,
  isLocalVisitedPlace,
  removeLocalVisitedPlace,
} from "@/features/visited-places/services/visited-places-local-storage";
import {
  addUserVisitedPlace,
  isUserVisitedPlace,
  listUserVisitedPlaces,
  removeUserVisitedPlace,
} from "@/features/visited-places/services/visited-places-service";
import type {
  AutocompleteOptions,
  AutocompleteSuggestion,
  CurrentWeather,
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
  private readonly nearbyPlacesCache = new Map<string, Promise<NearbyPlace[]>>();
  private readonly travelInfoCache = new Map<string, Promise<TravelInfo>>();
  private readonly weatherCache = new Map<string, { expiresAt: number; request: Promise<CurrentWeather | null> }>();

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

  addWishlistPlace(userId: string | undefined, place: TourismPlace): Promise<void> {
    const input = this.mapPlaceToWishlistPlaceInput(place);
    if (userId) return addUserWishlistPlace(userId, input);
    addLocalWishlistPlace(input);
    return Promise.resolve();
  }

  removeWishlistPlace(userId: string | undefined, placeId: string): Promise<void> {
    if (userId) return removeUserWishlistPlace(userId, placeId);
    removeLocalWishlistPlace(placeId);
    return Promise.resolve();
  }

  isPlaceInWishlist(userId: string | undefined, placeId: string): Promise<boolean> {
    return userId ? isUserWishlistPlace(userId, placeId) : Promise.resolve(isLocalWishlistPlace(placeId));
  }

  getWishlistPlaces(userId?: string): Promise<WishlistPlace[]> {
    return userId ? listUserWishlistPlaces(userId) : Promise.resolve(getLocalWishlistPlaces());
  }

  addVisitedPlace(userId: string | undefined, place: TourismPlace): Promise<void> {
    const input = this.mapPlaceToVisitedPlaceInput(place);
    if (userId) return addUserVisitedPlace(userId, input);
    addLocalVisitedPlace(input);
    return Promise.resolve();
  }

  removeVisitedPlace(userId: string | undefined, placeId: string): Promise<void> {
    if (userId) return removeUserVisitedPlace(userId, placeId);
    removeLocalVisitedPlace(placeId);
    return Promise.resolve();
  }

  isPlaceVisited(userId: string | undefined, placeId: string): Promise<boolean> {
    return userId ? isUserVisitedPlace(userId, placeId) : Promise.resolve(isLocalVisitedPlace(placeId));
  }

  getVisitedPlaces(userId?: string): Promise<VisitedPlace[]> {
    return userId ? listUserVisitedPlaces(userId) : Promise.resolve(getLocalVisitedPlaces());
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

  saveRecentlyViewedPlace(userId: string | undefined, place: TourismPlace, context?: PlaceSearchHistoryContext): Promise<void> {
    const input = this.mapPlaceToRecentlyViewedInput(place, context);

    if (userId) {
      return saveUserRecentlyViewedPlace(userId, input);
    }

    saveLocalRecentlyViewedPlace(input);
    return Promise.resolve();
  }

  getRecentlyViewedPlaces(userId?: string): Promise<RecentlyViewedPlace[]> {
    return userId ? listUserRecentlyViewedPlaces(userId) : Promise.resolve(getLocalRecentlyViewedPlaces());
  }

  deleteRecentlyViewedPlace(userId: string | undefined, placeId: string): Promise<void> {
    if (userId) {
      return deleteUserRecentlyViewedPlace(userId, placeId);
    }

    removeLocalRecentlyViewedPlace(placeId);
    return Promise.resolve();
  }

  clearRecentlyViewedPlaces(userId?: string): Promise<void> {
    if (userId) {
      return clearUserRecentlyViewedPlaces(userId);
    }

    clearLocalRecentlyViewedPlaces();
    return Promise.resolve();
  }

  createTrip(userId: string | undefined, input: TripInput): Promise<void> {
    if (userId) {
      return createUserTrip(userId, input);
    }

    createLocalTrip(input);
    return Promise.resolve();
  }

  getTrips(userId?: string): Promise<Trip[]> {
    return userId ? listUserTrips(userId) : Promise.resolve(getLocalTrips());
  }

  addPlaceToTrip(userId: string | undefined, tripId: string, place: TripPlaceInput): Promise<void> {
    if (userId) {
      return addPlaceToUserTrip(userId, tripId, place);
    }

    addPlaceToLocalTrip(tripId, place);
    return Promise.resolve();
  }

  updateTripPlaces(userId: string | undefined, tripId: string, places: TripPlace[]): Promise<void> {
    if (userId) {
      return updateUserTripPlaces(userId, tripId, places);
    }

    updateLocalTripPlaces(tripId, places);
    return Promise.resolve();
  }

  deleteTrip(userId: string | undefined, tripId: string): Promise<void> {
    if (userId) {
      return deleteUserTrip(userId, tripId);
    }

    deleteLocalTrip(tripId);
    return Promise.resolve();
  }

  createCollection(userId: string | undefined, input: CollectionInput): Promise<void> {
    if (userId) return createUserCollection(userId, input);
    createLocalCollection(input);
    return Promise.resolve();
  }

  getCollections(userId?: string): Promise<PlaceCollection[]> {
    return userId ? listUserCollections(userId) : Promise.resolve(getLocalCollections());
  }

  addPlaceToCollection(userId: string | undefined, collectionId: string, place: CollectionPlaceInput): Promise<void> {
    if (userId) return addPlaceToUserCollection(userId, collectionId, place);
    addPlaceToLocalCollection(collectionId, place);
    return Promise.resolve();
  }

  removePlaceFromCollection(userId: string | undefined, collectionId: string, places: CollectionPlace[]): Promise<void> {
    if (userId) return removePlaceFromUserCollection(userId, collectionId, places);
    removePlaceFromLocalCollection(collectionId, places);
    return Promise.resolve();
  }

  renameCollection(userId: string | undefined, collectionId: string, input: CollectionInput): Promise<void> {
    if (userId) return renameUserCollection(userId, collectionId, input);
    renameLocalCollection(collectionId, input);
    return Promise.resolve();
  }

  deleteCollection(userId: string | undefined, collectionId: string): Promise<void> {
    if (userId) return deleteUserCollection(userId, collectionId);
    deleteLocalCollection(collectionId);
    return Promise.resolve();
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
    const cacheKey = [latitude, longitude, radius, category].join(":");
    const cachedRequest = this.nearbyPlacesCache.get(cacheKey);

    if (cachedRequest) {
      return cachedRequest;
    }

    const request = this.provider.getNearbyPlaces?.(latitude, longitude, radius, category, signal) ?? Promise.resolve([]);
    this.nearbyPlacesCache.set(cacheKey, request);
    void request.catch(() => this.nearbyPlacesCache.delete(cacheKey));

    return request;
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
    const cacheKey = [formatRouteLocation(origin), formatRouteLocation(destination), travelMode].join(":");
    const cachedRequest = this.travelInfoCache.get(cacheKey);

    if (cachedRequest) {
      return cachedRequest;
    }

    const request =
      this.provider.getTravelInfo?.(origin, destination, travelMode, signal) ??
      Promise.resolve({
        distanceMeters: null,
        distanceText: "Not implemented",
        durationSeconds: null,
        durationText: "Not implemented",
        travelMode,
        status: "not_implemented",
        estimated: false,
      });
    this.travelInfoCache.set(cacheKey, request);
    void request.catch(() => this.travelInfoCache.delete(cacheKey));

    return request;
  }

  getCurrentWeather(latitude: number, longitude: number): Promise<CurrentWeather | null> {
    const cacheKey = `${latitude},${longitude}`;
    const cachedWeather = this.weatherCache.get(cacheKey);

    if (cachedWeather && cachedWeather.expiresAt > Date.now()) {
      return cachedWeather.request;
    }

    const request = fetchCurrentWeather(latitude, longitude);
    this.weatherCache.set(cacheKey, { request, expiresAt: Date.now() + 10 * 60 * 1000 });
    void request.catch(() => this.weatherCache.delete(cacheKey));

    return request;
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

  private mapPlaceToWishlistPlaceInput(place: TourismPlace): WishlistPlaceInput {
    const primaryImage = place.images?.[0];
    return {
      placeId: place.id,
      googlePlaceId: place.googlePlaceId,
      placeName: place.name,
      thumbnailUrl: primaryImage?.url ?? place.imageUrl,
      thumbnailPhotoReference: primaryImage?.photoReference,
      district: place.districtName ?? place.address?.district,
      state: place.address?.region,
    };
  }

  private mapPlaceToVisitedPlaceInput(place: TourismPlace): VisitedPlaceInput {
    const primaryImage = place.images?.[0];
    return {
      placeId: place.id,
      googlePlaceId: place.googlePlaceId,
      placeName: place.name,
      thumbnailUrl: primaryImage?.url ?? place.imageUrl,
      thumbnailPhotoReference: primaryImage?.photoReference,
      district: place.districtName ?? place.address?.district,
      state: place.address?.region,
    };
  }

  private mapPlaceToRecentlyViewedInput(
    place: TourismPlace,
    context?: PlaceSearchHistoryContext,
  ): RecentlyViewedPlaceInput {
    const primaryImage = place.images?.[0];

    return {
      placeId: place.id,
      googlePlaceId: place.googlePlaceId,
      placeName: place.name,
      thumbnailPhotoReference: primaryImage?.photoReference,
      thumbnailUrl: primaryImage?.url ?? place.imageUrl,
      district: context?.district?.name ?? place.districtName ?? place.address?.district,
      state: context?.region?.name ?? place.address?.region,
      country: place.address?.country ?? "India",
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

function formatRouteLocation(location: TourismGeoPoint | string) {
  return typeof location === "string" ? location.trim().toLowerCase() : `${location.latitude},${location.longitude}`;
}

type OpenMeteoWeatherResponse = {
  current?: {
    time?: string;
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
};

async function fetchCurrentWeather(latitude: number, longitude: number): Promise<CurrentWeather | null> {
  const searchParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
    timezone: "auto",
  });

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${searchParams.toString()}`);
    if (!response.ok) return null;
    const current = ((await response.json()) as OpenMeteoWeatherResponse).current;
    if (!current || !hasCurrentWeatherValues(current)) return null;
    return {
      temperatureCelsius: current.temperature_2m,
      feelsLikeCelsius: current.apparent_temperature,
      humidityPercent: current.relative_humidity_2m,
      windSpeedKph: current.wind_speed_10m,
      weatherCode: current.weather_code,
      condition: getWeatherCondition(current.weather_code),
      updatedAt: current.time ? new Date(current.time) : new Date(),
    };
  } catch {
    return null;
  }
}

function hasCurrentWeatherValues(current: NonNullable<OpenMeteoWeatherResponse["current"]>): current is Required<NonNullable<OpenMeteoWeatherResponse["current"]>> {
  return [current.temperature_2m, current.apparent_temperature, current.relative_humidity_2m, current.wind_speed_10m, current.weather_code].every((value) => typeof value === "number");
}

function getWeatherCondition(weatherCode: number) {
  if (weatherCode === 0) return "Sunny";
  if ([1, 2].includes(weatherCode)) return "Partly cloudy";
  if (weatherCode === 3) return "Cloudy";
  if ([45, 48].includes(weatherCode)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(weatherCode)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return "Rainy";
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return "Snowy";
  if ([95, 96, 99].includes(weatherCode)) return "Thunderstorms";
  return "Weather unavailable";
}

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

export async function addWishlistPlace(userId: string | undefined, place: TourismPlace): Promise<void> {
  return tourismService.addWishlistPlace(userId, place);
}

export async function removeWishlistPlace(userId: string | undefined, placeId: string): Promise<void> {
  return tourismService.removeWishlistPlace(userId, placeId);
}

export async function isPlaceInWishlist(userId: string | undefined, placeId: string): Promise<boolean> {
  return tourismService.isPlaceInWishlist(userId, placeId);
}

export async function getWishlistPlaces(userId?: string): Promise<WishlistPlace[]> {
  return tourismService.getWishlistPlaces(userId);
}

export async function addVisitedPlace(userId: string | undefined, place: TourismPlace): Promise<void> {
  return tourismService.addVisitedPlace(userId, place);
}

export async function removeVisitedPlace(userId: string | undefined, placeId: string): Promise<void> {
  return tourismService.removeVisitedPlace(userId, placeId);
}

export async function isPlaceVisited(userId: string | undefined, placeId: string): Promise<boolean> {
  return tourismService.isPlaceVisited(userId, placeId);
}

export async function getVisitedPlaces(userId?: string): Promise<VisitedPlace[]> {
  return tourismService.getVisitedPlaces(userId);
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

export async function saveRecentlyViewedPlace(
  userId: string | undefined,
  place: TourismPlace,
  context?: PlaceSearchHistoryContext,
): Promise<void> {
  return tourismService.saveRecentlyViewedPlace(userId, place, context);
}

export async function getRecentlyViewedPlaces(userId?: string): Promise<RecentlyViewedPlace[]> {
  return tourismService.getRecentlyViewedPlaces(userId);
}

export async function deleteRecentlyViewedPlace(userId: string | undefined, placeId: string): Promise<void> {
  return tourismService.deleteRecentlyViewedPlace(userId, placeId);
}

export async function clearRecentlyViewedPlaces(userId?: string): Promise<void> {
  return tourismService.clearRecentlyViewedPlaces(userId);
}

export async function createTrip(userId: string | undefined, input: TripInput): Promise<void> {
  return tourismService.createTrip(userId, input);
}

export async function getTrips(userId?: string): Promise<Trip[]> {
  return tourismService.getTrips(userId);
}

export async function addPlaceToTrip(userId: string | undefined, tripId: string, place: TripPlaceInput): Promise<void> {
  return tourismService.addPlaceToTrip(userId, tripId, place);
}

export async function updateTripPlaces(userId: string | undefined, tripId: string, places: TripPlace[]): Promise<void> {
  return tourismService.updateTripPlaces(userId, tripId, places);
}

export async function deleteTrip(userId: string | undefined, tripId: string): Promise<void> {
  return tourismService.deleteTrip(userId, tripId);
}

export async function createCollection(userId: string | undefined, input: CollectionInput): Promise<void> {
  return tourismService.createCollection(userId, input);
}

export async function getCollections(userId?: string): Promise<PlaceCollection[]> {
  return tourismService.getCollections(userId);
}

export async function addPlaceToCollection(userId: string | undefined, collectionId: string, place: CollectionPlaceInput): Promise<void> {
  return tourismService.addPlaceToCollection(userId, collectionId, place);
}

export async function removePlaceFromCollection(userId: string | undefined, collectionId: string, places: CollectionPlace[]): Promise<void> {
  return tourismService.removePlaceFromCollection(userId, collectionId, places);
}

export async function renameCollection(userId: string | undefined, collectionId: string, input: CollectionInput): Promise<void> {
  return tourismService.renameCollection(userId, collectionId, input);
}

export async function deleteCollection(userId: string | undefined, collectionId: string): Promise<void> {
  return tourismService.deleteCollection(userId, collectionId);
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

export async function getCurrentTourismWeather(latitude: number, longitude: number): Promise<CurrentWeather | null> {
  return tourismService.getCurrentWeather(latitude, longitude);
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
