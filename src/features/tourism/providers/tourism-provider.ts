import type { GoogleTravelMode } from "@/features/tourism/providers/google-tourism-constants";
import type { IndianDistrict, IndianRegion } from "@/features/tourism/types/region";
import type { TourismCategory, TourismLocationFilter, TourismOpeningHours, TourismPlace } from "@/types/tourism";

export type TourismProviderName = "local" | "google";

export type TourismGeoPoint = {
  latitude: number;
  longitude: number;
};

export type TravelMode = GoogleTravelMode;

export type TourismRouteRequest = {
  origin: TourismGeoPoint | string;
  destination: TourismGeoPoint | string;
  travelMode?: TravelMode;
};

export type TourismRouteSummary = {
  distanceText: string;
  durationText: string;
};

export type TravelInfo = {
  distanceMeters: number | null;
  distanceText: string;
  durationSeconds: number | null;
  durationText: string;
  travelMode: TravelMode;
  status: string;
  estimated: boolean;
};

export type TimeZoneResult = {
  timeZoneId: string;
  timeZoneName: string;
  rawOffset: number;
  dstOffset: number;
  localTimestamp: number;
  source: "google";
};

export type CurrentWeather = {
  temperatureCelsius: number;
  condition: string;
  weatherCode: number;
  feelsLikeCelsius: number;
  humidityPercent: number;
  windSpeedKph: number;
  updatedAt: Date;
};

export type TourismPlacePhoto = {
  url: string;
  attribution?: string;
};

export type GeocodeViewport = {
  northeast: TourismGeoPoint;
  southwest: TourismGeoPoint;
};

export type GeocodeAddressComponent = {
  longName: string;
  shortName: string;
  types: string[];
};

export type GeocodeResult = {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  placeId: string;
  viewport?: GeocodeViewport;
  addressComponents: GeocodeAddressComponent[];
  types: string[];
  source: "google";
};

export type GeocodeComponents = Record<string, string | string[]>;

export type GeocodeOptions = {
  region?: string;
  language?: string;
  bounds?: GeocodeViewport;
  components?: GeocodeComponents | string;
  signal?: AbortSignal;
};

export type ReverseGeocodeOptions = {
  language?: string;
  resultType?: string | string[];
  locationType?: string | string[];
  signal?: AbortSignal;
};

export type AutocompleteLocationCircle = {
  circle: {
    center: TourismGeoPoint;
    radius: number;
  };
};

export type AutocompleteLocationRectangle = {
  rectangle: {
    low: TourismGeoPoint;
    high: TourismGeoPoint;
  };
};

export type AutocompleteLocationArea = AutocompleteLocationCircle | AutocompleteLocationRectangle;

export type AutocompleteOptions = {
  locationBias?: AutocompleteLocationArea;
  locationRestriction?: AutocompleteLocationArea;
  includedRegion?: string;
  includedRegionCodes?: string[];
  language?: string;
  sessionToken?: string;
  includedPrimaryTypes?: string[];
  origin?: TourismGeoPoint;
  signal?: AbortSignal;
};

export type AutocompleteSuggestion = {
  placeId: string;
  primaryText: string;
  secondaryText: string;
  fullText: string;
  types: string[];
  distanceMeters?: number;
  source: "google";
};

export type NearbyPlaceCategory =
  | "hotels"
  | "restaurants"
  | "cafes"
  | "hospitals"
  | "pharmacies"
  | "parking"
  | "bus stations"
  | "railway stations"
  | "airports"
  | "fuel stations"
  | "ATMs"
  | "shopping malls"
  | "public toilets"
  | "police stations"
  | "tourist attractions";

export type NearbyPlace = {
  id: string;
  googlePlaceId?: string;
  name: string;
  category: NearbyPlaceCategory;
  formattedAddress?: string;
  coordinates: TourismGeoPoint;
  rating?: number;
  reviewsCount?: number;
  imageUrl?: string;
  distanceText?: string;
  websiteUrl?: string;
  phoneNumber?: string;
  openingHours?: TourismOpeningHours;
  isOpen?: boolean;
};

export interface TourismProvider {
  readonly name: TourismProviderName;

  listCategories(): Promise<TourismCategory[]>;
  getCategoryById(categoryId: string): Promise<TourismCategory | null>;
  listPlaces(filters?: TourismLocationFilter): Promise<TourismPlace[]>;
  getPlaceById(placeId: string): Promise<TourismPlace | null>;
  listFeaturedPlaces(): Promise<TourismPlace[]>;

  listRegions(): Promise<IndianRegion[]>;
  listStates(): Promise<IndianRegion[]>;
  listUnionTerritories(): Promise<IndianRegion[]>;
  getRegionById(regionId: string): Promise<IndianRegion | null>;
  listDistrictsByRegion(regionId: string): Promise<IndianDistrict[]>;

  searchExternalPlaces(query: string, filters?: TourismLocationFilter, signal?: AbortSignal): Promise<TourismPlace[]>;
  getExternalPlaceDetails(placeId: string, signal?: AbortSignal): Promise<TourismPlace | null>;
  getPlaceDetailsBatch?(placeIds: string[]): Promise<(TourismPlace | null | undefined)[]>;
  listExternalPlacePhotos(placeId: string, signal?: AbortSignal): Promise<TourismPlacePhoto[]>;
  getAutocompleteSuggestions?(query: string, options?: AutocompleteOptions): Promise<AutocompleteSuggestion[]>;
  getNearbyPlaces?(
    latitude: number,
    longitude: number,
    radius: number,
    category: NearbyPlaceCategory,
    signal?: AbortSignal,
  ): Promise<NearbyPlace[]>;
  getTravelInfo?(
    origin: TourismGeoPoint | string,
    destination: TourismGeoPoint | string,
    travelMode: TravelMode,
    signal?: AbortSignal,
  ): Promise<TravelInfo>;
  geocode?(query: string, options?: GeocodeOptions): Promise<GeocodeResult[]>;
  reverseGeocode?(latitude: number, longitude: number, options?: ReverseGeocodeOptions): Promise<GeocodeResult[]>;
  reverseGeocodeBatch?(locations: TourismGeoPoint[]): Promise<GeocodeResult[][]>;
  getTimeZone?(
    latitude: number,
    longitude: number,
    timestamp?: number,
    signal?: AbortSignal,
  ): Promise<TimeZoneResult | undefined>;
  getTimeZoneBatch?(locations: TourismGeoPoint[]): Promise<(TimeZoneResult | undefined)[]>;
  geocodeAddress(address: string): Promise<TourismGeoPoint | null>;
  getRouteSummary(request: TourismRouteRequest): Promise<TourismRouteSummary | null>;
  getDistanceMatrix(requests: TourismRouteRequest[]): Promise<TourismRouteSummary[]>;
}
