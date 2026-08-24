import { localTourismProvider } from "@/features/tourism/providers/local-tourism-provider";
import { getMapplsStaticKey } from "@/features/tourism/providers/mappls-api-config";
import { createMapplsApiCacheKey, MapplsApiCache } from "@/features/tourism/providers/mappls-api-cache";
import { fetchMapplsApi } from "@/features/tourism/providers/mappls-api-request";
import {
  MAPPLS_API_CACHE_TTL_MS,
  MAPPLS_AUTOSUGGEST_ENDPOINT,
  MAPPLS_GEOCODING_ENDPOINT,
  MAPPLS_NEARBY_SEARCH_ENDPOINT,
  MAPPLS_NEARBY_SEARCH_MAX_RADIUS_METERS,
  MAPPLS_NEARBY_SEARCH_MIN_RADIUS_METERS,
  MAPPLS_PLACE_DETAILS_ENDPOINT,
  MAPPLS_REGION_CODE,
  MAPPLS_REQUEST_REVALIDATE_SECONDS,
  MAPPLS_REVERSE_GEOCODING_ENDPOINT,
  MAPPLS_ROUTE_API_BASE_URL,
  MAPPLS_ROUTE_RESOURCE,
  MAPPLS_ROUTE_PROFILE_BY_TRAVEL_MODE,
  MAPPLS_TEXT_SEARCH_ENDPOINT,
  MAPPLS_TRAVEL_INFO_STATUS,
  mapplsKeywordByNearbyCategory,
} from "@/features/tourism/providers/mappls-tourism-constants";
import type {
  AutocompleteOptions,
  AutocompleteSuggestion,
  GeocodeOptions,
  GeocodeResult,
  NearbyPlace,
  NearbyPlaceCategory,
  ReverseGeocodeOptions,
  TourismGeoPoint,
  TourismPlacePhoto,
  TourismProvider,
  TourismRouteRequest,
  TourismRouteSummary,
  TravelInfo,
  TravelMode,
} from "@/features/tourism/providers/tourism-provider";
import type { IndianDistrict, IndianRegion } from "@/features/tourism/types/region";
import type { TourismCategory, TourismLocationFilter, TourismPlace, TourismPriceLevel } from "@/types/tourism";

type MapplsRecord = Record<string, unknown>;

export class MapplsTourismProvider implements TourismProvider {
  readonly name = "mappls" as const;
  private readonly apiCache = new MapplsApiCache(MAPPLS_API_CACHE_TTL_MS);
  private readonly placeCache = new Map<string, TourismPlace>();

  listCategories(): Promise<TourismCategory[]> { return localTourismProvider.listCategories(); }
  getCategoryById(categoryId: string): Promise<TourismCategory | null> { return localTourismProvider.getCategoryById(categoryId); }
  listPlaces(filters?: TourismLocationFilter): Promise<TourismPlace[]> { return localTourismProvider.listPlaces(filters); }
  getPlaceById(placeId: string): Promise<TourismPlace | null> { return Promise.resolve(this.placeCache.get(placeId) ?? null).then((place) => place ?? localTourismProvider.getPlaceById(placeId)); }
  listFeaturedPlaces(): Promise<TourismPlace[]> { return localTourismProvider.listFeaturedPlaces(); }
  listRegions(): Promise<IndianRegion[]> { return localTourismProvider.listRegions(); }
  listStates(): Promise<IndianRegion[]> { return localTourismProvider.listStates(); }
  listUnionTerritories(): Promise<IndianRegion[]> { return localTourismProvider.listUnionTerritories(); }
  getRegionById(regionId: string): Promise<IndianRegion | null> { return localTourismProvider.getRegionById(regionId); }
  listDistrictsByRegion(regionId: string): Promise<IndianDistrict[]> { return localTourismProvider.listDistrictsByRegion(regionId); }

  async searchExternalPlaces(query: string, filters?: TourismLocationFilter, signal?: AbortSignal): Promise<TourismPlace[]> {
    const input = query.trim();
    if (!input || !getMapplsStaticKey()) return [];
    const cacheKey = createMapplsApiCacheKey("text-search", input, filters);
    const cached = this.apiCache.get<TourismPlace[]>(cacheKey);
    if (cached.hit) return cached.value;
    const data = await this.request(MAPPLS_TEXT_SEARCH_ENDPOINT, { query: input, region: MAPPLS_REGION_CODE }, signal);
    const places = this.records(data).map((record) => this.toTourismPlace(record, filters)).filter((place): place is TourismPlace => Boolean(place));
    places.forEach((place) => this.placeCache.set(place.id, place));
    this.apiCache.set(cacheKey, places);
    return places;
  }

  async getExternalPlaceDetails(placeId: string, signal?: AbortSignal): Promise<TourismPlace | null> {
    const cachedPlace = this.placeCache.get(placeId);
    if (!getMapplsStaticKey()) return cachedPlace ?? null;
    const cacheKey = createMapplsApiCacheKey("place-details", placeId);
    const cached = this.apiCache.get<TourismPlace | null>(cacheKey);
    if (cached.hit) return cached.value;
    const data = await this.request(`${MAPPLS_PLACE_DETAILS_ENDPOINT}/${encodeURIComponent(placeId)}`, {}, signal);
    const record = this.records(data)[0] ?? this.asRecord(data?.data) ?? this.asRecord(data);
    const place = record ? this.toTourismPlace(record, undefined, cachedPlace) : cachedPlace ?? null;
    if (place) this.placeCache.set(place.id, place);
    this.apiCache.set(cacheKey, place);
    return place;
  }

  async listExternalPlacePhotos(placeId: string, signal?: AbortSignal): Promise<TourismPlacePhoto[]> {
    const place = (await this.getExternalPlaceDetails(placeId, signal)) ?? this.placeCache.get(placeId);
    return place?.images?.map(({ url, attribution }) => ({ url, attribution })) ?? (place?.imageUrl ? [{ url: place.imageUrl }] : []);
  }

  async getAutocompleteSuggestions(query: string, options?: AutocompleteOptions): Promise<AutocompleteSuggestion[]> {
    const input = query.trim();
    if (!input || !getMapplsStaticKey()) return [];
    const location = options?.origin ? `${options.origin.latitude},${options.origin.longitude}` : undefined;
    const data = await this.request(MAPPLS_AUTOSUGGEST_ENDPOINT, { query: input, region: MAPPLS_REGION_CODE, location }, options?.signal);
    return this.records(data).flatMap((record) => {
      const placeId = this.identifier(record);
      const primaryText = this.text(record, "placeName", "place_name", "name", "title");
      const secondaryText = this.text(record, "placeAddress", "place_address", "address", "formattedAddress") ?? "";
      return placeId && primaryText ? [{ placeId, primaryText, secondaryText, fullText: [primaryText, secondaryText].filter(Boolean).join(", "), types: this.stringList(record.type ?? record.category), ...(this.number(record.distance) === undefined ? {} : { distanceMeters: this.number(record.distance) }), source: "mappls" as const }] : [];
    });
  }

  async getNearbyPlaces(latitude: number, longitude: number, radius: number, category: NearbyPlaceCategory, signal?: AbortSignal): Promise<NearbyPlace[]> {
    if (!getMapplsStaticKey()) return [];
    const safeRadius = Math.max(MAPPLS_NEARBY_SEARCH_MIN_RADIUS_METERS, Math.min(radius, MAPPLS_NEARBY_SEARCH_MAX_RADIUS_METERS));
    const cacheKey = createMapplsApiCacheKey("nearby", latitude, longitude, safeRadius, category);
    const cached = this.apiCache.get<NearbyPlace[]>(cacheKey);
    if (cached.hit) return cached.value;
    const data = await this.request(MAPPLS_NEARBY_SEARCH_ENDPOINT, { keywords: mapplsKeywordByNearbyCategory[category], refLocation: `${latitude},${longitude}`, radius: safeRadius, region: MAPPLS_REGION_CODE, sortBy: "dist:asc" }, signal);
    const places = this.records(data).map((record) => this.toNearbyPlace(record, category, { latitude, longitude })).filter((place): place is NearbyPlace => Boolean(place));
    this.apiCache.set(cacheKey, places);
    return places;
  }

  async getTravelInfo(origin: TourismGeoPoint | string, destination: TourismGeoPoint | string, travelMode: TravelMode, signal?: AbortSignal): Promise<TravelInfo> {
    if (typeof origin === "string" || typeof destination === "string" || !getMapplsStaticKey()) return this.unavailableTravelInfo(travelMode);
    const profile = MAPPLS_ROUTE_PROFILE_BY_TRAVEL_MODE[travelMode];
    const path = `${MAPPLS_ROUTE_API_BASE_URL}/${MAPPLS_ROUTE_RESOURCE}/${profile}/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
    const data = await this.request(path, { steps: "false", region: MAPPLS_REGION_CODE }, signal);
    const route = this.records(data?.routes)[0];
    const distanceMeters = route ? this.number(route.distance ?? route.distanceMeters) : undefined;
    const durationSeconds = route ? this.number(route.duration ?? route.durationSeconds) : undefined;
    return distanceMeters === undefined || durationSeconds === undefined ? this.unavailableTravelInfo(travelMode) : {
      distanceMeters, distanceText: formatDistance(distanceMeters), durationSeconds, durationText: formatDuration(durationSeconds), travelMode, status: MAPPLS_TRAVEL_INFO_STATUS.ok, estimated: true,
    };
  }

  async geocode(query: string, options?: GeocodeOptions): Promise<GeocodeResult[]> {
    const address = query.trim();
    if (!address || !getMapplsStaticKey()) return [];
    const data = await this.request(MAPPLS_GEOCODING_ENDPOINT, { address, region: options?.region ?? MAPPLS_REGION_CODE }, options?.signal);
    return this.records(data).flatMap((record) => {
      const placeId = this.identifier(record);
      const formattedAddress = this.text(record, "formattedAddress", "formatted_address", "address", "placeAddress");
      const latitude = this.number(record.latitude ?? record.lat);
      const longitude = this.number(record.longitude ?? record.lng ?? record.lon);
      return placeId && formattedAddress && latitude !== undefined && longitude !== undefined
        ? [{ latitude, longitude, formattedAddress, placeId, addressComponents: [], types: this.stringList(record.type), source: "mappls" as const }]
        : [];
    });
  }

  async reverseGeocode(latitude: number, longitude: number, options?: ReverseGeocodeOptions): Promise<GeocodeResult[]> {
    if (!getMapplsStaticKey()) return [];
    const data = await this.request(MAPPLS_REVERSE_GEOCODING_ENDPOINT, { lat: latitude, lng: longitude, region: MAPPLS_REGION_CODE, lang: options?.language }, options?.signal);
    return this.records(data).flatMap((record) => {
      const placeId = this.identifier(record); const formattedAddress = this.text(record, "formattedAddress", "formatted_address", "address", "placeAddress");
      const resolvedLatitude = this.number(record.latitude ?? record.lat) ?? latitude; const resolvedLongitude = this.number(record.longitude ?? record.lng ?? record.lon) ?? longitude;
      return placeId && formattedAddress ? [{ latitude: resolvedLatitude, longitude: resolvedLongitude, formattedAddress, placeId, addressComponents: [], types: this.stringList(record.type), source: "mappls" as const }] : [];
    });
  }

  async geocodeAddress(address: string): Promise<TourismGeoPoint | null> { const result = (await this.geocode(address))[0]; return result ? { latitude: result.latitude, longitude: result.longitude } : null; }
  async getRouteSummary(request: TourismRouteRequest): Promise<TourismRouteSummary | null> { const route = await this.getTravelInfo(request.origin, request.destination, request.travelMode ?? "driving"); return route.distanceMeters === null ? null : { distanceText: route.distanceText, durationText: route.durationText }; }
  async getDistanceMatrix(requests: TourismRouteRequest[]): Promise<TourismRouteSummary[]> { return Promise.all(requests.map(async (request) => (await this.getRouteSummary(request)) ?? { distanceText: "Unavailable", durationText: "Unavailable" })); }

  private async request(endpoint: string, params: Record<string, string | number | undefined>, signal?: AbortSignal): Promise<MapplsRecord | undefined> {
    const staticKey = getMapplsStaticKey(); if (!staticKey) return undefined;
    const search = new URLSearchParams({ access_token: staticKey });
    Object.entries(params).forEach(([key, value]) => { if (value !== undefined) search.set(key, String(value)); });
    try { const response = await fetchMapplsApi(`${endpoint}?${search.toString()}`, { signal, next: { revalidate: MAPPLS_REQUEST_REVALIDATE_SECONDS } }); return response?.ok ? this.asRecord(await response.json()) : undefined; } catch { return undefined; }
  }

  private records(value: unknown): MapplsRecord[] { const record = this.asRecord(value); if (Array.isArray(value)) return value.map((item) => this.asRecord(item)).filter((item): item is MapplsRecord => Boolean(item)); if (!record) return []; for (const key of ["suggestedLocations", "results", "places", "data", "response"]) { const items = record[key]; if (Array.isArray(items)) return items.map((item) => this.asRecord(item)).filter((item): item is MapplsRecord => Boolean(item)); } return []; }
  private asRecord(value: unknown): MapplsRecord | undefined { return value && typeof value === "object" && !Array.isArray(value) ? value as MapplsRecord : undefined; }
  private text(record: MapplsRecord, ...keys: string[]) { for (const key of keys) { const value = record[key]; if (typeof value === "string" && value.trim()) return value.trim(); } return undefined; }
  private number(value: unknown) { const number = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN; return Number.isFinite(number) ? number : undefined; }
  private identifier(record: MapplsRecord) { return this.text(record, "eLoc", "eloc", "placeId", "place_id", "mapplsPin", "id"); }
  private stringList(value: unknown) { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : typeof value === "string" ? [value] : []; }
  private toTourismPlace(record: MapplsRecord, filters?: TourismLocationFilter, existing?: TourismPlace): TourismPlace | null { const mapplsPlaceId = this.identifier(record); const name = this.text(record, "placeName", "place_name", "name", "title") ?? existing?.name; if (!mapplsPlaceId || !name) return null; const latitude = this.number(record.latitude ?? record.lat ?? record.entryLatitude); const longitude = this.number(record.longitude ?? record.lng ?? record.lon ?? record.entryLongitude); const address = this.text(record, "placeAddress", "place_address", "formattedAddress", "address"); const categoryIds = filters?.categoryId ? [filters.categoryId] : existing?.categoryIds?.length ? existing.categoryIds : ["heritage"]; const rating = this.number(record.rating ?? record.avgRating) ?? existing?.rating ?? 0; const imageUrl = this.text(record, "imageUrl", "image_url", "thumbnail"); return { ...existing, id: existing?.id ?? mapplsPlaceId, mapplsPlaceId, name, stateId: existing?.stateId ?? "external", districtId: existing?.districtId ?? "external", categoryIds, summary: existing?.summary ?? address ?? name, description: existing?.description ?? address ?? name, highlights: existing?.highlights ?? [], bestTimeToVisit: existing?.bestTimeToVisit ?? "Not available", idealDuration: existing?.idealDuration ?? "Not available", priceLevel: existing?.priceLevel ?? this.priceLevel(record), rating, reviewsCount: this.number(record.totalUserReviews ?? record.reviewsCount), tags: this.stringList(record.type ?? record.category), imageUrl: imageUrl ?? existing?.imageUrl, images: imageUrl ? [{ url: imageUrl, source: "mappls" }] : existing?.images, coordinates: latitude !== undefined && longitude !== undefined ? { latitude, longitude } : existing?.coordinates, address: address ? { ...existing?.address, formattedAddress: address } : existing?.address, websiteUrl: this.text(record, "website", "websiteUrl") ?? existing?.websiteUrl, contactInfo: this.text(record, "phone", "phoneNumber") ? { phone: this.text(record, "phone", "phoneNumber") } : existing?.contactInfo, openingHours: typeof record.openNow === "boolean" ? { openNow: record.openNow } : existing?.openingHours }; }
  private toNearbyPlace(record: MapplsRecord, category: NearbyPlaceCategory, origin: TourismGeoPoint): NearbyPlace | null { const mapplsPlaceId = this.identifier(record); const name = this.text(record, "placeName", "place_name", "name", "title"); const latitude = this.number(record.latitude ?? record.lat ?? record.entryLatitude); const longitude = this.number(record.longitude ?? record.lng ?? record.lon ?? record.entryLongitude); if (!mapplsPlaceId || !name || latitude === undefined || longitude === undefined) return null; const distance = this.number(record.distance) ?? haversineDistance(origin, { latitude, longitude }); return { id: mapplsPlaceId, mapplsPlaceId, name, category, formattedAddress: this.text(record, "placeAddress", "place_address", "formattedAddress", "address"), coordinates: { latitude, longitude }, rating: this.number(record.rating ?? record.avgRating), reviewsCount: this.number(record.totalUserReviews ?? record.reviewsCount), imageUrl: this.text(record, "imageUrl", "image_url", "thumbnail"), distanceText: formatDistance(distance), websiteUrl: this.text(record, "website", "websiteUrl"), phoneNumber: this.text(record, "phone", "phoneNumber"), isOpen: typeof record.openNow === "boolean" ? record.openNow : undefined }; }
  private priceLevel(record: MapplsRecord): TourismPriceLevel { const value = this.number(record.priceLevel ?? record.price); return value !== undefined && value >= 3 ? "premium" : value === 2 ? "moderate" : "budget"; }
  private unavailableTravelInfo(travelMode: TravelMode): TravelInfo { return { distanceMeters: null, distanceText: "Unavailable", durationSeconds: null, durationText: "Unavailable", travelMode, status: MAPPLS_TRAVEL_INFO_STATUS.notAvailable, estimated: false }; }
}

function formatDistance(meters: number) { return meters >= 1000 ? `${(meters / 1000).toFixed(meters >= 10000 ? 0 : 1)} km` : `${Math.round(meters)} m`; }
function formatDuration(seconds: number) { const minutes = Math.max(1, Math.round(seconds / 60)); return minutes >= 60 ? `${Math.floor(minutes / 60)} hr ${minutes % 60 ? `${minutes % 60} min` : ""}`.trim() : `${minutes} min`; }
function haversineDistance(from: TourismGeoPoint, to: TourismGeoPoint) { const radians = (value: number) => value * Math.PI / 180; const latitude = radians(to.latitude - from.latitude); const longitude = radians(to.longitude - from.longitude); const a = Math.sin(latitude / 2) ** 2 + Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude)) * Math.sin(longitude / 2) ** 2; return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); }

export const mapplsTourismProvider = new MapplsTourismProvider();
