import type {
  AutocompleteOptions,
  AutocompleteSuggestion,
  GeocodeOptions,
  GeocodeResult,
  GeocodeViewport,
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
import { getGoogleApiKey } from "@/features/tourism/providers/google-api-config";
import { createGoogleApiCacheKey, GoogleApiCache } from "@/features/tourism/providers/google-api-cache";
import type { GoogleApiCacheStats } from "@/features/tourism/providers/google-api-cache";
import { fetchGoogleApi } from "@/features/tourism/providers/google-api-request";
import { getGoogleSessionToken } from "@/features/tourism/providers/google-session-token-manager";
import {
  GOOGLE_API_CACHE_TTL_MS,
  GOOGLE_COMMON_REQUEST_HEADERS,
  GOOGLE_GEOCODING_ENDPOINT,
  GOOGLE_JSON_REQUEST_HEADERS,
  GOOGLE_LANGUAGE_CODE,
  GOOGLE_NEARBY_SEARCH_MAX_RADIUS_METERS,
  GOOGLE_NEARBY_SEARCH_MAX_RESULT_COUNT,
  GOOGLE_NEARBY_SEARCH_MIN_RADIUS_METERS,
  GOOGLE_NEARBY_SEARCH_RANK_PREFERENCE,
  GOOGLE_PLACE_DETAILS_ENDPOINT,
  GOOGLE_PLACE_DETAILS_FIELD_MASK,
  GOOGLE_PLACE_PHOTO_MAX_HEIGHT_PX,
  GOOGLE_PLACE_PHOTO_MAX_WIDTH_PX,
  GOOGLE_PLACE_PHOTO_MEDIA_SEGMENT,
  GOOGLE_PLACES_API_BASE_URL,
  GOOGLE_PLACES_AUTOCOMPLETE_ENDPOINT,
  GOOGLE_PLACES_AUTOCOMPLETE_FIELD_MASK,
  GOOGLE_PLACES_FIELD_MASK,
  GOOGLE_PLACES_NEARBY_FIELD_MASK,
  GOOGLE_PLACES_NEARBY_SEARCH_ENDPOINT,
  GOOGLE_PLACES_TEXT_SEARCH_ENDPOINT,
  GOOGLE_REGION_CODE,
  GOOGLE_REQUEST_REVALIDATE_SECONDS,
  GOOGLE_ROUTES_COMPUTE_ROUTES_ENDPOINT,
  GOOGLE_ROUTES_FIELD_MASK,
  GOOGLE_ROUTES_TRAVEL_MODE_BY_TRAVEL_MODE,
  GOOGLE_ROUTES_UNITS,
  GOOGLE_TIME_ZONE_ENDPOINT,
  GOOGLE_TRAVEL_INFO_STATUS,
  googleTypeByNearbyCategory,
} from "@/features/tourism/providers/google-tourism-constants";
import { localTourismProvider } from "@/features/tourism/providers/local-tourism-provider";
import type { IndianDistrict, IndianRegion } from "@/features/tourism/types/region";
import type { TourismCategory, TourismLocationFilter, TourismPlace, TourismPlaceImage, TourismPriceLevel } from "@/types/tourism";

type GooglePlacesSearchResponse = {
  places?: GooglePlace[];
};

type GooglePlacesAutocompleteResponse = {
  suggestions?: GoogleAutocompleteSuggestion[];
};

type GoogleAutocompleteSuggestion = {
  placePrediction?: GooglePlacePrediction;
};

type GooglePlacePrediction = {
  placeId?: string;
  text?: GoogleAutocompleteText;
  structuredFormat?: {
    mainText?: GoogleAutocompleteText;
    secondaryText?: GoogleAutocompleteText;
  };
  types?: string[];
  distanceMeters?: number;
};

type GoogleAutocompleteText = {
  text?: string;
};

type GoogleRoutesResponse = {
  routes?: GoogleRoute[];
};

type GoogleGeocodingResponse = {
  results?: GoogleGeocodingResult[];
  status?: string;
};

type GoogleGeocodingResult = {
  formatted_address?: string;
  place_id?: string;
  types?: string[];
  address_components?: GoogleGeocodingAddressComponent[];
  geometry?: {
    location?: {
      lat?: number;
      lng?: number;
    };
    viewport?: GoogleGeocodingViewport;
  };
};

type GoogleGeocodingViewport = {
  northeast?: {
    lat?: number;
    lng?: number;
  };
  southwest?: {
    lat?: number;
    lng?: number;
  };
};

type GoogleGeocodingAddressComponent = {
  long_name?: string;
  short_name?: string;
  types?: string[];
};

type GoogleTimeZoneResponse = {
  dstOffset?: number;
  rawOffset?: number;
  status?: string;
  timeZoneId?: string;
  timeZoneName?: string;
};

type GoogleRoute = {
  distanceMeters?: number;
  duration?: string;
};

type GooglePlace = {
  id?: string;
  displayName?: {
    text?: string;
  };
  formattedAddress?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  rating?: number;
  userRatingCount?: number;
  types?: string[];
  priceLevel?: string;
  currentOpeningHours?: GoogleOpeningHours;
  regularOpeningHours?: GoogleOpeningHours;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  editorialSummary?: {
    text?: string;
  };
  accessibilityOptions?: GoogleAccessibilityOptions;
  parkingOptions?: GoogleParkingOptions;
  paymentOptions?: GooglePaymentOptions;
  restroom?: boolean;
  photos?: GooglePhoto[];
  reviews?: GoogleReview[];
};

type GoogleReview = {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: GoogleLocalizedText;
  originalText?: GoogleLocalizedText;
  authorAttribution?: GoogleReviewAuthorAttribution;
  publishTime?: string;
};

type GoogleLocalizedText = {
  text?: string;
  languageCode?: string;
};

type GoogleReviewAuthorAttribution = {
  displayName?: string;
  uri?: string;
  photoUri?: string;
};

type GooglePhoto = {
  name?: string;
  widthPx?: number;
  heightPx?: number;
  authorAttributions?: GooglePhotoAttribution[];
};

type GooglePhotoAttribution = {
  displayName?: string;
  uri?: string;
  photoUri?: string;
};

type GoogleOpeningHours = {
  openNow?: boolean;
  weekdayDescriptions?: string[];
};

type GoogleAccessibilityOptions = {
  wheelchairAccessibleParking?: boolean;
  wheelchairAccessibleEntrance?: boolean;
  wheelchairAccessibleRestroom?: boolean;
  wheelchairAccessibleSeating?: boolean;
};

type GoogleParkingOptions = {
  freeParkingLot?: boolean;
  paidParkingLot?: boolean;
  freeStreetParking?: boolean;
  paidStreetParking?: boolean;
  valetParking?: boolean;
  freeGarageParking?: boolean;
  paidGarageParking?: boolean;
};

type GooglePaymentOptions = {
  acceptsCreditCards?: boolean;
  acceptsDebitCards?: boolean;
  acceptsCashOnly?: boolean;
  acceptsNfc?: boolean;
};

type GoogleUrlParamValue = string | number | undefined;

const categoryIdByGoogleType: Record<string, TourismPlace["categoryIds"][number]> = {
  amusement_park: "heritage",
  aquarium: "nature",
  art_gallery: "heritage",
  bakery: "food",
  beach: "beaches",
  cafe: "food",
  campground: "nature",
  church: "spiritual",
  hindu_temple: "spiritual",
  historical_landmark: "heritage",
  meal_takeaway: "food",
  mosque: "spiritual",
  museum: "heritage",
  national_park: "nature",
  park: "nature",
  restaurant: "food",
  synagogue: "spiritual",
  tourist_attraction: "heritage",
  zoo: "nature",
};

const priceLevelByGooglePriceLevel: Record<string, TourismPriceLevel> = {
  PRICE_LEVEL_FREE: "free",
  PRICE_LEVEL_INEXPENSIVE: "budget",
  PRICE_LEVEL_MODERATE: "moderate",
  PRICE_LEVEL_EXPENSIVE: "premium",
  PRICE_LEVEL_VERY_EXPENSIVE: "premium",
};

export class GoogleTourismProvider implements TourismProvider {
  readonly name = "google" as const;
  private readonly apiCache: GoogleApiCache;
  private readonly placeCache = new Map<string, TourismPlace>();

  constructor(cacheTtlMs = GOOGLE_API_CACHE_TTL_MS) {
    this.apiCache = new GoogleApiCache(cacheTtlMs);
  }

  async listCategories(): Promise<TourismCategory[]> {
    return localTourismProvider.listCategories();
  }

  async getCategoryById(categoryId: string): Promise<TourismCategory | null> {
    return localTourismProvider.getCategoryById(categoryId);
  }

  async listPlaces(filters?: TourismLocationFilter): Promise<TourismPlace[]> {
    const localPlaces = await localTourismProvider.listPlaces(filters);

    try {
      const googlePlaces = await this.searchExternalPlaces(this.buildSearchQuery(filters), filters);

      return googlePlaces.length ? googlePlaces : localPlaces;
    } catch {
      return localPlaces;
    }
  }

  async getPlaceById(placeId: string): Promise<TourismPlace | null> {
    const cachedPlace = this.placeCache.get(placeId);

    if (cachedPlace?.googlePlaceId) {
      try {
        return (await this.getExternalPlaceDetails(cachedPlace.googlePlaceId)) ?? cachedPlace;
      } catch {
        return cachedPlace;
      }
    }

    try {
      const googlePlace = await this.getExternalPlaceDetails(placeId);

      if (googlePlace) {
        return googlePlace;
      }
    } catch {
      return cachedPlace ?? localTourismProvider.getPlaceById(placeId);
    }

    return cachedPlace ?? localTourismProvider.getPlaceById(placeId);
  }

  async listFeaturedPlaces(): Promise<TourismPlace[]> {
    return localTourismProvider.listFeaturedPlaces();
  }

  async listRegions(): Promise<IndianRegion[]> {
    return localTourismProvider.listRegions();
  }

  async listStates(): Promise<IndianRegion[]> {
    return localTourismProvider.listStates();
  }

  async listUnionTerritories(): Promise<IndianRegion[]> {
    return localTourismProvider.listUnionTerritories();
  }

  async getRegionById(regionId: string): Promise<IndianRegion | null> {
    return localTourismProvider.getRegionById(regionId);
  }

  async listDistrictsByRegion(regionId: string): Promise<IndianDistrict[]> {
    return localTourismProvider.listDistrictsByRegion(regionId);
  }

  getGoogleApiCacheStats(): GoogleApiCacheStats {
    return this.apiCache.getStats();
  }

  invalidateGoogleApiCache(keyOrPrefix?: string) {
    if (!keyOrPrefix) {
      this.apiCache.invalidate();
      return;
    }

    this.apiCache.invalidatePrefix(keyOrPrefix);
    this.apiCache.invalidate(keyOrPrefix);
  }

  async getAutocompleteSuggestions(query: string, options?: AutocompleteOptions): Promise<AutocompleteSuggestion[]> {
    const input = query.trim();

    if (!input) {
      return [];
    }

    const apiKey = getGoogleApiKey();

    if (!apiKey) {
      return [];
    }

    try {
      const response = await fetchGoogleApi(GOOGLE_PLACES_AUTOCOMPLETE_ENDPOINT, {
        method: "POST",
        headers: {
          ...GOOGLE_JSON_REQUEST_HEADERS,
          [GOOGLE_COMMON_REQUEST_HEADERS.apiKey]: apiKey,
          [GOOGLE_COMMON_REQUEST_HEADERS.fieldMask]: GOOGLE_PLACES_AUTOCOMPLETE_FIELD_MASK,
        },
        body: JSON.stringify(this.buildAutocompleteRequestBody(input, options)),
        signal: options?.signal,
        next: { revalidate: GOOGLE_REQUEST_REVALIDATE_SECONDS },
      });

      if (!response?.ok) {
        return [];
      }

      const data = (await response.json()) as GooglePlacesAutocompleteResponse;

      if (!Array.isArray(data.suggestions)) {
        return [];
      }

      return data.suggestions
        .map((suggestion) => this.mapGoogleAutocompleteSuggestion(suggestion))
        .filter((suggestion): suggestion is AutocompleteSuggestion => Boolean(suggestion));
    } catch {
      return [];
    }
  }

  async searchExternalPlaces(query: string, filters?: TourismLocationFilter, signal?: AbortSignal): Promise<TourismPlace[]> {
    const cacheKey = createGoogleApiCacheKey("text-search", query, filters);
    const cachedPlaces = this.apiCache.get<TourismPlace[]>(cacheKey);

    if (cachedPlaces.hit) {
      return cachedPlaces.value;
    }

    const apiKey = getGoogleApiKey();

    if (!apiKey) {
      return [];
    }

    const response = await fetchGoogleApi(GOOGLE_PLACES_TEXT_SEARCH_ENDPOINT, {
      method: "POST",
      headers: {
        ...GOOGLE_JSON_REQUEST_HEADERS,
        [GOOGLE_COMMON_REQUEST_HEADERS.apiKey]: apiKey,
        [GOOGLE_COMMON_REQUEST_HEADERS.fieldMask]: GOOGLE_PLACES_FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: GOOGLE_LANGUAGE_CODE,
        regionCode: GOOGLE_REGION_CODE,
      }),
      signal,
      next: { revalidate: GOOGLE_REQUEST_REVALIDATE_SECONDS },
    });

    if (!response) {
      return [];
    }

    if (!response.ok) {
      throw new Error(`Google Places search failed with status ${response.status}.`);
    }

    const data = (await response.json()) as GooglePlacesSearchResponse;

    const places = (data.places ?? [])
      .map((place) => this.mapGooglePlaceToTourismPlace(place, filters))
      .filter((place): place is TourismPlace => Boolean(place));

    for (const place of places) {
      this.placeCache.set(place.id, place);
    }

    this.apiCache.set(cacheKey, places);

    return places;
  }

  async getExternalPlaceDetails(placeId: string, signal?: AbortSignal): Promise<TourismPlace | null> {
    const cacheKey = createGoogleApiCacheKey("place-details", placeId);
    const cachedPlace = this.apiCache.get<TourismPlace | null>(cacheKey);
    const existingPlace = this.placeCache.get(placeId);

    if (cachedPlace.hit) {
      return cachedPlace.value;
    }

    const apiKey = getGoogleApiKey();

    if (!apiKey) {
      return existingPlace ?? null;
    }

    try {
      const response = await fetchGoogleApi(
        `${GOOGLE_PLACE_DETAILS_ENDPOINT}/${encodeURIComponent(placeId)}?languageCode=${GOOGLE_LANGUAGE_CODE}`,
        {
          method: "GET",
          headers: {
            [GOOGLE_COMMON_REQUEST_HEADERS.apiKey]: apiKey,
            [GOOGLE_COMMON_REQUEST_HEADERS.fieldMask]: GOOGLE_PLACE_DETAILS_FIELD_MASK,
          },
          signal,
          next: { revalidate: GOOGLE_REQUEST_REVALIDATE_SECONDS },
        },
      );

      if (!response?.ok) {
        return existingPlace ?? null;
      }

      const place = (await response.json()) as GooglePlace;
      const tourismPlace = this.mapGooglePlaceToTourismPlace(place, undefined, existingPlace);

      if (!tourismPlace) {
        return existingPlace ?? null;
      }

      this.placeCache.set(tourismPlace.id, tourismPlace);
      this.apiCache.set(cacheKey, tourismPlace);

      return tourismPlace;
    } catch {
      return existingPlace ?? null;
    }
  }

  async getPlaceDetailsBatch(placeIds: string[]): Promise<(TourismPlace | null | undefined)[]> {
    return Promise.all(
      placeIds.map((placeId) =>
        this.runBatchRequest(() => this.getExternalPlaceDetails(placeId), undefined),
      ),
    );
  }

  async getNearbyPlaces(
    latitude: number,
    longitude: number,
    radius: number,
    category: NearbyPlaceCategory,
    signal?: AbortSignal,
  ): Promise<NearbyPlace[]> {
    const apiKey = getGoogleApiKey();
    const searchRadius = Math.min(
      Math.max(radius, GOOGLE_NEARBY_SEARCH_MIN_RADIUS_METERS),
      GOOGLE_NEARBY_SEARCH_MAX_RADIUS_METERS,
    );
    const fallbackPlaces = () => this.getLocalNearbyPlaces(latitude, longitude, searchRadius, category);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !Number.isFinite(radius)) {
      return [];
    }

    const cacheKey = createGoogleApiCacheKey("nearby-search", latitude, longitude, searchRadius, category);
    const cachedPlaces = this.apiCache.get<NearbyPlace[]>(cacheKey);

    if (cachedPlaces.hit) {
      return cachedPlaces.value;
    }

    if (!apiKey) {
      return fallbackPlaces();
    }

    try {
      const includedType = googleTypeByNearbyCategory[category];

      if (!includedType) {
        return fallbackPlaces();
      }

      const response = await fetchGoogleApi(GOOGLE_PLACES_NEARBY_SEARCH_ENDPOINT, {
        method: "POST",
        headers: {
          ...GOOGLE_JSON_REQUEST_HEADERS,
          [GOOGLE_COMMON_REQUEST_HEADERS.apiKey]: apiKey,
          [GOOGLE_COMMON_REQUEST_HEADERS.fieldMask]: GOOGLE_PLACES_NEARBY_FIELD_MASK,
        },
        body: JSON.stringify({
          includedTypes: [includedType],
          maxResultCount: GOOGLE_NEARBY_SEARCH_MAX_RESULT_COUNT,
          locationRestriction: {
            circle: {
              center: {
                latitude,
                longitude,
              },
              radius: searchRadius,
            },
          },
          rankPreference: GOOGLE_NEARBY_SEARCH_RANK_PREFERENCE,
          languageCode: GOOGLE_LANGUAGE_CODE,
          regionCode: GOOGLE_REGION_CODE,
        }),
        signal,
        next: { revalidate: GOOGLE_REQUEST_REVALIDATE_SECONDS },
      });

      if (!response?.ok) {
        return fallbackPlaces();
      }

      const data = (await response.json()) as GooglePlacesSearchResponse;

      if (!Array.isArray(data.places)) {
        return fallbackPlaces();
      }

      const places = data.places
        .map((place) => this.mapGooglePlaceToNearbyPlace(place, category, { latitude, longitude }))
        .filter((place): place is NearbyPlace => Boolean(place));

      const nearbyPlaces = places.length ? places : await fallbackPlaces();

      this.apiCache.set(cacheKey, nearbyPlaces);

      return nearbyPlaces;
    } catch {
      return fallbackPlaces();
    }
  }

  async listExternalPlacePhotos(placeId: string, signal?: AbortSignal): Promise<TourismPlacePhoto[]> {
    const cacheKey = createGoogleApiCacheKey("photos", placeId);
    const cachedPhotos = this.apiCache.get<TourismPlacePhoto[]>(cacheKey);

    if (cachedPhotos.hit) {
      return cachedPhotos.value;
    }

    const existingPlace = this.placeCache.get(placeId) ?? (await localTourismProvider.getPlaceById(placeId));
    const existingImages = existingPlace?.images?.length
      ? existingPlace.images
      : existingPlace?.imageUrl
        ? [{ url: existingPlace.imageUrl }]
        : [];

    if (existingImages.length) {
      const photos = existingImages.map((image) => ({
        url: image.url,
        attribution: image.attribution,
      }));

      this.apiCache.set(cacheKey, photos);

      return photos;
    }

    try {
      const place = await this.getExternalPlaceDetails(placeId, signal);

      const photos = (place?.images ?? []).map((image) => ({
        url: image.url,
        attribution: image.attribution,
      }));

      this.apiCache.set(cacheKey, photos);

      return photos;
    } catch {
      return [];
    }
  }

  async getTravelInfo(
    origin: TourismGeoPoint | string,
    destination: TourismGeoPoint | string,
    travelMode: TravelMode,
    signal?: AbortSignal,
  ): Promise<TravelInfo> {
    if (typeof origin === "string" || typeof destination === "string") {
      return this.getUnavailableTravelInfo(travelMode);
    }

    const cacheKey = createGoogleApiCacheKey("routes", origin, destination, travelMode);
    const cachedTravelInfo = this.apiCache.get<TravelInfo>(cacheKey);

    if (cachedTravelInfo.hit) {
      return cachedTravelInfo.value;
    }

    const apiKey = getGoogleApiKey();

    if (!apiKey) {
      return this.getUnavailableTravelInfo(travelMode);
    }

    try {
      const response = await fetchGoogleApi(GOOGLE_ROUTES_COMPUTE_ROUTES_ENDPOINT, {
        method: "POST",
        headers: {
          ...GOOGLE_JSON_REQUEST_HEADERS,
          [GOOGLE_COMMON_REQUEST_HEADERS.apiKey]: apiKey,
          [GOOGLE_COMMON_REQUEST_HEADERS.fieldMask]: GOOGLE_ROUTES_FIELD_MASK,
        },
        body: JSON.stringify({
          origin: this.mapGeoPointToRouteWaypoint(origin),
          destination: this.mapGeoPointToRouteWaypoint(destination),
          travelMode: GOOGLE_ROUTES_TRAVEL_MODE_BY_TRAVEL_MODE[travelMode],
          units: GOOGLE_ROUTES_UNITS,
          languageCode: GOOGLE_LANGUAGE_CODE,
          regionCode: GOOGLE_REGION_CODE,
        }),
        signal,
        next: { revalidate: GOOGLE_REQUEST_REVALIDATE_SECONDS },
      });

      if (!response?.ok) {
        return this.getUnavailableTravelInfo(travelMode);
      }

      const data = (await response.json()) as GoogleRoutesResponse;
      const route = data.routes?.[0];
      const durationSeconds = this.parseGoogleDurationSeconds(route?.duration);

      if (typeof route?.distanceMeters !== "number" || typeof durationSeconds !== "number") {
        return this.getUnavailableTravelInfo(travelMode);
      }

      const travelInfo: TravelInfo = {
        distanceMeters: route.distanceMeters,
        distanceText: this.formatDistanceText(route.distanceMeters),
        durationSeconds,
        durationText: this.formatDurationText(durationSeconds),
        travelMode,
        status: GOOGLE_TRAVEL_INFO_STATUS.ok,
        estimated: false,
      };

      this.apiCache.set(cacheKey, travelInfo);

      return travelInfo;
    } catch {
      return this.getUnavailableTravelInfo(travelMode);
    }
  }

  async geocode(query: string, options?: GeocodeOptions): Promise<GeocodeResult[]> {
    const address = query.trim();

    if (!address) {
      return [];
    }

    const apiKey = getGoogleApiKey();

    if (!apiKey) {
      return [];
    }

    return this.fetchGoogleGeocodingResults(this.buildGeocodingUrl(address, apiKey, options), options?.signal);
  }

  async reverseGeocode(
    latitude: number,
    longitude: number,
    options?: ReverseGeocodeOptions,
  ): Promise<GeocodeResult[]> {
    if (!this.isValidCoordinate(latitude, longitude)) {
      return [];
    }

    const apiKey = getGoogleApiKey();

    if (!apiKey) {
      return [];
    }

    return this.fetchGoogleGeocodingResults(
      this.buildReverseGeocodingUrl(latitude, longitude, apiKey, options),
      options?.signal,
    );
  }

  async reverseGeocodeBatch(locations: TourismGeoPoint[]): Promise<GeocodeResult[][]> {
    return Promise.all(
      locations.map((location) =>
        this.runBatchRequest(() => this.reverseGeocode(location.latitude, location.longitude), []),
      ),
    );
  }

  async getTimeZone(
    latitude: number,
    longitude: number,
    timestamp?: number,
    signal?: AbortSignal,
  ): Promise<TimeZoneResult | undefined> {
    if (!this.isValidCoordinate(latitude, longitude)) {
      return undefined;
    }

    const resolvedTimestamp = this.resolveTimeZoneTimestamp(timestamp);

    if (typeof resolvedTimestamp !== "number") {
      return undefined;
    }

    const apiKey = getGoogleApiKey();

    if (!apiKey) {
      return undefined;
    }

    const data = await this.fetchGoogleJson<GoogleTimeZoneResponse>(
      this.buildTimeZoneUrl(latitude, longitude, resolvedTimestamp, apiKey),
      signal,
    );

    return data ? this.mapGoogleTimeZoneResponse(data, resolvedTimestamp) : undefined;
  }

  async getTimeZoneBatch(locations: TourismGeoPoint[]): Promise<(TimeZoneResult | undefined)[]> {
    return Promise.all(
      locations.map((location) =>
        this.runBatchRequest(() => this.getTimeZone(location.latitude, location.longitude), undefined),
      ),
    );
  }

  async geocodeAddress(address: string): Promise<TourismGeoPoint | null> {
    const results = await this.geocode(address);

    if (results.length > 0) {
      return {
        latitude: results[0].latitude,
        longitude: results[0].longitude,
      };
    }

    return null;
  }

  async getRouteSummary(request: TourismRouteRequest): Promise<TourismRouteSummary | null> {
    const travelMode = request.travelMode ?? "driving";
    const travelInfo = await this.getTravelInfo(request.origin, request.destination, travelMode);

    if (travelInfo.status !== GOOGLE_TRAVEL_INFO_STATUS.ok) {
      return null;
    }

    return {
      distanceText: travelInfo.distanceText,
      durationText: travelInfo.durationText,
    };
  }

  async getDistanceMatrix(requests: TourismRouteRequest[]): Promise<TourismRouteSummary[]> {
    const results = await Promise.all(
      requests.map((request) =>
        this.runBatchRequest(async () => {
          const summary = await this.getRouteSummary(request);
          if (!summary) {
            throw new Error("Failed to get route summary");
          }
          return summary;
        }, null),
      ),
    );

    return results.filter((result): result is TourismRouteSummary => result !== null);
  }

  private buildAutocompleteRequestBody(input: string, options: AutocompleteOptions = {}) {
    const includedRegionCodes = options.includedRegionCodes ?? (options.includedRegion ? [options.includedRegion] : undefined);
    const sessionToken = "sessionToken" in options ? options.sessionToken : getGoogleSessionToken();

    return {
      input,
      locationBias: options.locationBias,
      locationRestriction: options.locationRestriction,
      includedRegionCodes,
      languageCode: options.language ?? GOOGLE_LANGUAGE_CODE,
      sessionToken,
      includedPrimaryTypes: options.includedPrimaryTypes,
      origin: options.origin,
    };
  }

  private mapGoogleAutocompleteSuggestion(suggestion: GoogleAutocompleteSuggestion): AutocompleteSuggestion | null {
    const prediction = suggestion.placePrediction;
    const placeId = prediction?.placeId;
    const primaryText = prediction?.structuredFormat?.mainText?.text ?? prediction?.text?.text;
    const secondaryText = prediction?.structuredFormat?.secondaryText?.text ?? "";
    const fullText = prediction?.text?.text ?? [primaryText, secondaryText].filter(Boolean).join(", ");

    if (!placeId || !primaryText || !fullText) {
      return null;
    }

    return {
      placeId,
      primaryText,
      secondaryText,
      fullText,
      types: prediction?.types ?? [],
      distanceMeters: prediction?.distanceMeters,
      source: "google",
    };
  }

  private buildSearchQuery(filters?: TourismLocationFilter) {
    const queryParts = [filters?.query, "tourist attractions"];

    if (filters?.districtId) {
      queryParts.push(filters.districtId.replaceAll("-", " "));
    }

    if (filters?.stateId) {
      queryParts.push(filters.stateId.replaceAll("-", " "));
    }

    queryParts.push("India");

    return queryParts.filter(Boolean).join(" ");
  }

  private mapGooglePlaceToTourismPlace(
    place: GooglePlace,
    filters?: TourismLocationFilter,
    existingPlace?: TourismPlace,
  ): TourismPlace | null {
    const googlePlaceId = place.id;
    const name = place.displayName?.text ?? existingPlace?.name;

    if (!googlePlaceId || !name) {
      return null;
    }

    const categoryIds = this.mapGoogleTypesToCategoryIds(place.types, filters, existingPlace);
    const priceLevel = place.priceLevel ? priceLevelByGooglePriceLevel[place.priceLevel] : existingPlace?.priceLevel;
    const phone = this.getGooglePhoneNumber(place) ?? existingPlace?.contactInfo?.phone;
    const openingHours = this.mapGoogleOpeningHours(place) ?? existingPlace?.openingHours;
    const formattedAddress = place.formattedAddress ?? existingPlace?.address?.formattedAddress;
    const editorialSummary = place.editorialSummary?.text;
    const images = this.mapGooglePhotosToTourismImages(place.photos, name, existingPlace);
    const imageUrl = images[0]?.url ?? existingPlace?.imageUrl;
    const reviews = this.mapGoogleReviews(place.reviews) ?? existingPlace?.reviews;

    if (!categoryIds.length || !priceLevel || (typeof place.rating !== "number" && typeof existingPlace?.rating !== "number")) {
      return null;
    }

    return {
      ...existingPlace,
      id: existingPlace?.id ?? googlePlaceId,
      googlePlaceId,
      name,
      stateId: existingPlace?.stateId ?? filters?.stateId ?? "google",
      districtId: existingPlace?.districtId ?? filters?.districtId ?? "google",
      categoryIds,
      summary: formattedAddress ?? "",
      description: editorialSummary ?? existingPlace?.description ?? formattedAddress ?? "",
      highlights: existingPlace?.highlights ?? [],
      bestTimeToVisit: existingPlace?.bestTimeToVisit ?? "",
      idealDuration: existingPlace?.idealDuration ?? "",
      priceLevel,
      rating: place.rating ?? existingPlace?.rating ?? 0,
      reviewsCount: place.userRatingCount,
      reviews,
      tags: place.types ?? existingPlace?.tags ?? [],
      imageUrl,
      images: images.length ? images : existingPlace?.images,
      address: formattedAddress ? { formattedAddress } : undefined,
      coordinates: {
        latitude: place.location?.latitude ?? existingPlace?.coordinates?.latitude ?? null,
        longitude: place.location?.longitude ?? existingPlace?.coordinates?.longitude ?? null,
      },
      openingHours,
      contactInfo: phone ? { phone } : undefined,
      websiteUrl: place.websiteUri ?? existingPlace?.websiteUrl,
      accessibility: this.mapAccessibilityOptions(place.accessibilityOptions, existingPlace?.accessibility),
      facilities: this.mapFacilities(place, existingPlace?.facilities),
      budget: {
        priceLevel,
      },
    };
  }

  private mapGoogleTypesToCategoryIds(
    types: string[] | undefined,
    filters?: TourismLocationFilter,
    existingPlace?: TourismPlace,
  ) {
    if (filters?.categoryId) {
      return [filters.categoryId];
    }

    if (existingPlace?.categoryIds.length) {
      return existingPlace.categoryIds;
    }

    const categoryIds = new Set<TourismPlace["categoryIds"][number]>();

    for (const type of types ?? []) {
      const categoryId = categoryIdByGoogleType[type];

      if (categoryId) {
        categoryIds.add(categoryId);
      }
    }

    return Array.from(categoryIds);
  }

  private mapGoogleReviews(reviews: GoogleReview[] | undefined) {
    if (!Array.isArray(reviews)) {
      return undefined;
    }

    return reviews
      .map((review, index) => {
        const text = review.text?.text ?? review.originalText?.text;
        const reviewerName = review.authorAttribution?.displayName;
        const rating = review.rating;

        if (!text || !reviewerName || typeof rating !== "number") {
          return null;
        }

        return {
          id: review.name ?? `${reviewerName}-${review.publishTime ?? index}`,
          reviewerName,
          reviewerProfilePhotoUrl: review.authorAttribution?.photoUri,
          rating,
          relativePublishTimeDescription: review.relativePublishTimeDescription ?? "",
          text,
          publishTime: review.publishTime,
        };
      })
      .filter((review): review is NonNullable<typeof review> => Boolean(review));
  }

  private mapGooglePlaceToNearbyPlace(
    place: GooglePlace,
    category: NearbyPlaceCategory,
    origin: TourismGeoPoint,
  ): NearbyPlace | null {
    const googlePlaceId = place.id;
    const name = place.displayName?.text;
    const latitude = place.location?.latitude;
    const longitude = place.location?.longitude;

    if (!googlePlaceId || !name || typeof latitude !== "number" || typeof longitude !== "number") {
      return null;
    }

    const openingHours = this.mapGoogleOpeningHours(place);

    return {
      id: googlePlaceId,
      googlePlaceId,
      name,
      category,
      formattedAddress: place.formattedAddress,
      coordinates: {
        latitude,
        longitude,
      },
      rating: place.rating,
      reviewsCount: place.userRatingCount,
      distanceText: this.formatDistanceText(this.calculateDistanceMeters(origin, { latitude, longitude })),
      websiteUrl: place.websiteUri,
      phoneNumber: this.getGooglePhoneNumber(place),
      openingHours,
      isOpen: openingHours?.openNow,
    };
  }

  private async getLocalNearbyPlaces(
    latitude: number,
    longitude: number,
    radius: number,
    category: NearbyPlaceCategory,
  ): Promise<NearbyPlace[]> {
    const localPlaces = await localTourismProvider.listPlaces({ query: category });
    const fallbackPlaces = localPlaces.length ? localPlaces : await localTourismProvider.listPlaces();
    const origin = { latitude, longitude };

    return fallbackPlaces
      .map((place) => this.mapLocalPlaceToNearbyPlace(place, category, origin))
      .filter((place): place is NearbyPlace => Boolean(place))
      .filter((place) => this.calculateDistanceMeters(origin, place.coordinates) <= radius)
      .sort(
        (firstPlace, secondPlace) =>
          this.calculateDistanceMeters(origin, firstPlace.coordinates) -
          this.calculateDistanceMeters(origin, secondPlace.coordinates),
      );
  }

  private mapLocalPlaceToNearbyPlace(
    place: TourismPlace,
    category: NearbyPlaceCategory,
    origin: TourismGeoPoint,
  ): NearbyPlace | null {
    const latitude = place.coordinates?.latitude;
    const longitude = place.coordinates?.longitude;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return null;
    }

    const coordinates = { latitude, longitude };

    return {
      id: place.id,
      googlePlaceId: place.googlePlaceId,
      name: place.name,
      category,
      formattedAddress: place.address?.formattedAddress,
      coordinates,
      rating: place.rating,
      reviewsCount: place.reviewsCount,
      imageUrl: place.imageUrl,
      distanceText: this.formatDistanceText(this.calculateDistanceMeters(origin, coordinates)),
      websiteUrl: place.websiteUrl,
      phoneNumber: place.contactInfo?.phone,
      openingHours: place.openingHours,
      isOpen: place.openingHours?.openNow,
    };
  }

  private getGooglePhoneNumber(place: GooglePlace) {
    return place.internationalPhoneNumber ?? place.nationalPhoneNumber;
  }

  private mapGooglePhotosToTourismImages(
    photos: GooglePhoto[] | undefined,
    placeName: string,
    existingPlace?: TourismPlace,
  ): TourismPlaceImage[] {
    const apiKey = getGoogleApiKey();

    if (!apiKey || !photos?.length) {
      return this.getExistingTourismImages(existingPlace);
    }

    const images = photos
      .map((photo): TourismPlaceImage | null => {
        if (!photo.name) {
          return null;
        }

        return {
          url: this.buildGooglePhotoMediaUrl(photo.name, apiKey),
          photoReference: photo.name,
          alt: placeName,
          attribution: this.formatGooglePhotoAttribution(photo.authorAttributions),
          width: photo.widthPx,
          height: photo.heightPx,
          source: "google",
        };
      })
      .filter((image): image is TourismPlaceImage => Boolean(image));

    return images.length ? images : this.getExistingTourismImages(existingPlace);
  }

  private getExistingTourismImages(existingPlace: TourismPlace | undefined): TourismPlaceImage[] {
    if (existingPlace?.images?.length) {
      return existingPlace.images;
    }

    return existingPlace?.imageUrl ? [{ url: existingPlace.imageUrl, alt: existingPlace.name, source: "local" }] : [];
  }

  private buildGooglePhotoMediaUrl(photoName: string, apiKey: string) {
    const cacheKey = createGoogleApiCacheKey(
      "photo-media",
      photoName,
      GOOGLE_PLACE_PHOTO_MAX_WIDTH_PX,
      GOOGLE_PLACE_PHOTO_MAX_HEIGHT_PX,
    );
    const cachedUrl = this.apiCache.get<string>(cacheKey);

    if (cachedUrl.hit) {
      return cachedUrl.value;
    }

    const params = new URLSearchParams({
      maxWidthPx: String(GOOGLE_PLACE_PHOTO_MAX_WIDTH_PX),
      maxHeightPx: String(GOOGLE_PLACE_PHOTO_MAX_HEIGHT_PX),
      key: apiKey,
    });

    const url = `${GOOGLE_PLACES_API_BASE_URL}/${photoName}/${GOOGLE_PLACE_PHOTO_MEDIA_SEGMENT}?${params.toString()}`;

    this.apiCache.set(cacheKey, url);

    return url;
  }

  private formatGooglePhotoAttribution(attributions: GooglePhotoAttribution[] | undefined) {
    const displayNames = (attributions ?? [])
      .map((attribution) => attribution.displayName)
      .filter((displayName): displayName is string => Boolean(displayName));

    return displayNames.length ? displayNames.join(", ") : undefined;
  }

  private getUnavailableTravelInfo(travelMode: TravelMode): TravelInfo {
    return {
      distanceMeters: null,
      distanceText: "Not available",
      durationSeconds: null,
      durationText: "Not available",
      travelMode,
      status: GOOGLE_TRAVEL_INFO_STATUS.notAvailable,
      estimated: false,
    };
  }

  private mapGeoPointToRouteWaypoint(point: TourismGeoPoint) {
    return {
      location: {
        latLng: {
          latitude: point.latitude,
          longitude: point.longitude,
        },
      },
    };
  }

  private buildGeocodingUrl(query: string, apiKey: string, options?: GeocodeOptions) {
    const params = this.createGoogleUrlParams({
      address: query,
      key: apiKey,
    });

    if (options?.region) {
      params.set("region", options.region);
    }

    if (options?.language) {
      params.set("language", options.language);
    }

    if (options?.bounds) {
      params.set("bounds", this.formatGeocodingBounds(options.bounds));
    }

    const components = this.formatGeocodingComponents(options?.components);

    if (components) {
      params.set("components", components);
    }

    return this.buildGoogleUrl(GOOGLE_GEOCODING_ENDPOINT, params);
  }

  private buildReverseGeocodingUrl(
    latitude: number,
    longitude: number,
    apiKey: string,
    options?: ReverseGeocodeOptions,
  ) {
    const params = this.createGoogleUrlParams({
      latlng: `${latitude},${longitude}`,
      key: apiKey,
    });

    if (options?.language) {
      params.set("language", options.language);
    }

    const resultType = this.formatPipeSeparatedValues(options?.resultType);

    if (resultType) {
      params.set("result_type", resultType);
    }

    const locationType = this.formatPipeSeparatedValues(options?.locationType);

    if (locationType) {
      params.set("location_type", locationType);
    }

    return this.buildGoogleUrl(GOOGLE_GEOCODING_ENDPOINT, params);
  }

  private buildTimeZoneUrl(latitude: number, longitude: number, timestamp: number, apiKey: string) {
    const params = this.createGoogleUrlParams({
      location: `${latitude},${longitude}`,
      timestamp,
      key: apiKey,
    });

    return this.buildGoogleUrl(GOOGLE_TIME_ZONE_ENDPOINT, params);
  }

  private async fetchGoogleJson<TResponse>(url: string, signal?: AbortSignal): Promise<TResponse | undefined> {
    try {
      const response = await fetchGoogleApi(url, {
        method: "GET",
        signal,
        next: { revalidate: GOOGLE_REQUEST_REVALIDATE_SECONDS },
      });

      if (!response?.ok) {
        return undefined;
      }

      return (await response.json()) as TResponse;
    } catch {
      return undefined;
    }
  }

  private async fetchGoogleGeocodingResults(url: string, signal?: AbortSignal): Promise<GeocodeResult[]> {
    const data = await this.fetchGoogleJson<GoogleGeocodingResponse>(url, signal);

    if (!Array.isArray(data?.results)) {
      return [];
    }

    return data.results
      .map((result) => this.mapGoogleGeocodingResult(result))
      .filter((result): result is GeocodeResult => Boolean(result));
  }

  private buildGoogleUrl(endpoint: string, params: URLSearchParams) {
    return `${endpoint}?${params.toString()}`;
  }

  private createGoogleUrlParams(params: Record<string, GoogleUrlParamValue>) {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (typeof value !== "undefined") {
        searchParams.set(key, String(value));
      }
    }

    return searchParams;
  }

  private async runBatchRequest<TResult, TFallback>(
    request: () => Promise<TResult>,
    fallback: TFallback,
  ): Promise<TResult | TFallback> {
    try {
      return await request();
    } catch {
      return fallback;
    }
  }

  private mapGoogleGeocodingResult(result: GoogleGeocodingResult): GeocodeResult | null {
    const latitude = result.geometry?.location?.lat;
    const longitude = result.geometry?.location?.lng;
    const formattedAddress = result.formatted_address;
    const placeId = result.place_id;

    if (typeof latitude !== "number" || typeof longitude !== "number" || !formattedAddress || !placeId) {
      return null;
    }

    return {
      latitude,
      longitude,
      formattedAddress,
      placeId,
      viewport: this.mapGoogleGeocodingViewport(result.geometry?.viewport),
      addressComponents: this.mapGoogleGeocodingAddressComponents(result.address_components),
      types: result.types ?? [],
      source: "google",
    };
  }

  private mapGoogleTimeZoneResponse(
    response: GoogleTimeZoneResponse,
    timestamp: number,
  ): TimeZoneResult | undefined {
    if (
      response.status !== "OK" ||
      !response.timeZoneId ||
      !response.timeZoneName ||
      typeof response.rawOffset !== "number" ||
      typeof response.dstOffset !== "number"
    ) {
      return undefined;
    }

    return {
      timeZoneId: response.timeZoneId,
      timeZoneName: response.timeZoneName,
      rawOffset: response.rawOffset,
      dstOffset: response.dstOffset,
      localTimestamp: timestamp + response.rawOffset + response.dstOffset,
      source: "google",
    };
  }

  private mapGoogleGeocodingViewport(viewport: GoogleGeocodingViewport | undefined) {
    const northeastLatitude = viewport?.northeast?.lat;
    const northeastLongitude = viewport?.northeast?.lng;
    const southwestLatitude = viewport?.southwest?.lat;
    const southwestLongitude = viewport?.southwest?.lng;

    if (
      typeof northeastLatitude !== "number" ||
      typeof northeastLongitude !== "number" ||
      typeof southwestLatitude !== "number" ||
      typeof southwestLongitude !== "number"
    ) {
      return undefined;
    }

    return {
      northeast: {
        latitude: northeastLatitude,
        longitude: northeastLongitude,
      },
      southwest: {
        latitude: southwestLatitude,
        longitude: southwestLongitude,
      },
    };
  }

  private mapGoogleGeocodingAddressComponents(components: GoogleGeocodingAddressComponent[] | undefined) {
    return (components ?? [])
      .map((component) => {
        if (!component.long_name || !component.short_name) {
          return null;
        }

        return {
          longName: component.long_name,
          shortName: component.short_name,
          types: component.types ?? [],
        };
      })
      .filter((component): component is GeocodeResult["addressComponents"][number] => Boolean(component));
  }

  private formatGeocodingBounds(bounds: GeocodeViewport) {
    return [
      `${bounds.southwest.latitude},${bounds.southwest.longitude}`,
      `${bounds.northeast.latitude},${bounds.northeast.longitude}`,
    ].join("|");
  }

  private formatGeocodingComponents(components: GeocodeOptions["components"] | undefined) {
    if (!components) {
      return undefined;
    }

    if (typeof components === "string") {
      return components;
    }

    return Object.entries(components)
      .flatMap(([key, value]) => {
        const values = Array.isArray(value) ? value : [value];

        return values.map((componentValue) => `${key}:${componentValue}`);
      })
      .join("|");
  }

  private formatPipeSeparatedValues(value: string | string[] | undefined) {
    if (!value) {
      return undefined;
    }

    return Array.isArray(value) ? value.join("|") : value;
  }

  private isValidCoordinate(latitude: number, longitude: number) {
    return (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  private resolveTimeZoneTimestamp(timestamp: number | undefined) {
    if (typeof timestamp === "undefined") {
      return Math.floor(Date.now() / 1000);
    }

    if (!Number.isFinite(timestamp)) {
      return undefined;
    }

    return Math.floor(timestamp);
  }

  private parseGoogleDurationSeconds(duration: string | undefined) {
    const match = duration?.match(/^(\d+)s$/);

    return match ? Number(match[1]) : null;
  }

  private mapGoogleOpeningHours(place: GooglePlace) {
    const openingHours = place.currentOpeningHours ?? place.regularOpeningHours;

    return openingHours
      ? {
          openNow: openingHours.openNow,
          weekdayText: openingHours.weekdayDescriptions,
        }
      : undefined;
  }

  private calculateDistanceMeters(origin: TourismGeoPoint, destination: TourismGeoPoint) {
    const earthRadiusMeters = 6371000;
    const latitudeDelta = this.toRadians(destination.latitude - origin.latitude);
    const longitudeDelta = this.toRadians(destination.longitude - origin.longitude);
    const originLatitude = this.toRadians(origin.latitude);
    const destinationLatitude = this.toRadians(destination.latitude);
    const haversine =
      Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(originLatitude) * Math.cos(destinationLatitude) * Math.sin(longitudeDelta / 2) ** 2;

    return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  }

  private formatDistanceText(distanceMeters: number) {
    if (distanceMeters < 1000) {
      return `${Math.round(distanceMeters)} m`;
    }

    return `${(distanceMeters / 1000).toFixed(1)} km`;
  }

  private formatDurationText(durationSeconds: number) {
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.round((durationSeconds % 3600) / 60);

    if (hours && minutes) {
      return `${hours} hr ${minutes} min`;
    }

    if (hours) {
      return `${hours} hr`;
    }

    return `${Math.max(minutes, 1)} min`;
  }

  private toRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  private mapAccessibilityOptions(options: GoogleAccessibilityOptions | undefined, existingAccessibility?: string[]) {
    const accessibility = new Set(existingAccessibility ?? []);

    if (options?.wheelchairAccessibleParking) {
      accessibility.add("Wheelchair accessible parking");
    }

    if (options?.wheelchairAccessibleEntrance) {
      accessibility.add("Wheelchair accessible entrance");
    }

    if (options?.wheelchairAccessibleRestroom) {
      accessibility.add("Wheelchair accessible restroom");
    }

    if (options?.wheelchairAccessibleSeating) {
      accessibility.add("Wheelchair accessible seating");
    }

    return accessibility.size ? Array.from(accessibility) : undefined;
  }

  private mapFacilities(place: GooglePlace, existingFacilities?: string[]) {
    const facilities = new Set(existingFacilities ?? []);

    if (place.restroom) {
      facilities.add("Restroom");
    }

    for (const facility of this.mapParkingFacilities(place.parkingOptions)) {
      facilities.add(facility);
    }

    for (const facility of this.mapPaymentFacilities(place.paymentOptions)) {
      facilities.add(facility);
    }

    return facilities.size ? Array.from(facilities) : undefined;
  }

  private mapParkingFacilities(options: GoogleParkingOptions | undefined) {
    const facilities: string[] = [];

    if (options?.freeParkingLot) facilities.push("Free parking lot");
    if (options?.paidParkingLot) facilities.push("Paid parking lot");
    if (options?.freeStreetParking) facilities.push("Free street parking");
    if (options?.paidStreetParking) facilities.push("Paid street parking");
    if (options?.valetParking) facilities.push("Valet parking");
    if (options?.freeGarageParking) facilities.push("Free garage parking");
    if (options?.paidGarageParking) facilities.push("Paid garage parking");

    return facilities;
  }

  private mapPaymentFacilities(options: GooglePaymentOptions | undefined) {
    const facilities: string[] = [];

    if (options?.acceptsCreditCards) facilities.push("Accepts credit cards");
    if (options?.acceptsDebitCards) facilities.push("Accepts debit cards");
    if (options?.acceptsCashOnly) facilities.push("Accepts cash only");
    if (options?.acceptsNfc) facilities.push("Accepts NFC payments");

    return facilities;
  }
}

export const googleTourismProvider = new GoogleTourismProvider();
