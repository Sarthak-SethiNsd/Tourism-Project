import { activeTourismProvider } from "@/features/tourism/providers/active-tourism-provider";
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
  TourismProvider,
  TourismRouteRequest,
  TourismRouteSummary,
} from "@/features/tourism/providers/tourism-provider";
import type { IndianDistrict, IndianRegion } from "@/features/tourism/types/region";
import { filterTourismPlaces } from "@/features/tourism/utils/place-filters";
import type { TourismCategory, TourismLocationFilter, TourismPlace } from "@/types/tourism";

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
      return await this.provider.getExternalPlaceDetails(placeId);
    } catch {
      return undefined;
    }
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
