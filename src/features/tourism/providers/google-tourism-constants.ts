import type { NearbyPlaceCategory } from "@/features/tourism/providers/tourism-provider";

export const GOOGLE_PLACES_API_BASE_URL = "https://places.googleapis.com/v1";
export const GOOGLE_PLACES_TEXT_SEARCH_ENDPOINT = `${GOOGLE_PLACES_API_BASE_URL}/places:searchText`;
export const GOOGLE_PLACES_NEARBY_SEARCH_ENDPOINT = `${GOOGLE_PLACES_API_BASE_URL}/places:searchNearby`;
export const GOOGLE_PLACES_AUTOCOMPLETE_ENDPOINT = `${GOOGLE_PLACES_API_BASE_URL}/places:autocomplete`;
export const GOOGLE_PLACE_DETAILS_ENDPOINT = `${GOOGLE_PLACES_API_BASE_URL}/places`;
export const GOOGLE_GEOCODING_ENDPOINT = "https://maps.googleapis.com/maps/api/geocode/json";
export const GOOGLE_TIME_ZONE_ENDPOINT = "https://maps.googleapis.com/maps/api/timezone/json";
export const GOOGLE_ROUTES_COMPUTE_ROUTES_ENDPOINT = "https://routes.googleapis.com/directions/v2:computeRoutes";

export const GOOGLE_COMMON_REQUEST_HEADERS = {
  contentType: "Content-Type",
  apiKey: "X-Goog-Api-Key",
  fieldMask: "X-Goog-FieldMask",
} as const;

export const GOOGLE_JSON_REQUEST_HEADERS = {
  [GOOGLE_COMMON_REQUEST_HEADERS.contentType]: "application/json",
} as const;

export const GOOGLE_LANGUAGE_CODE = "en";
export const GOOGLE_REGION_CODE = "IN";
export const GOOGLE_REQUEST_REVALIDATE_SECONDS = 60 * 60;
export const GOOGLE_API_CACHE_TTL_MS = GOOGLE_REQUEST_REVALIDATE_SECONDS * 1000;
export const GOOGLE_ROUTES_UNITS = "METRIC";
export const DEFAULT_SESSION_TIMEOUT_MS = 3 * 60 * 1000;
export const SESSION_TIMEOUT_MS = DEFAULT_SESSION_TIMEOUT_MS;

export const GOOGLE_PLACES_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.types",
  "places.priceLevel",
  "places.currentOpeningHours",
  "places.regularOpeningHours",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.websiteUri",
  "places.photos",
].join(",");

export const GOOGLE_PLACE_DETAILS_FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "rating",
  "userRatingCount",
  "types",
  "priceLevel",
  "currentOpeningHours",
  "regularOpeningHours",
  "nationalPhoneNumber",
  "internationalPhoneNumber",
  "websiteUri",
  "editorialSummary",
  "accessibilityOptions",
  "parkingOptions",
  "paymentOptions",
  "restroom",
  "photos",
].join(",");

export const GOOGLE_PLACES_NEARBY_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.types",
  "places.currentOpeningHours",
  "places.regularOpeningHours",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.websiteUri",
  "places.photos",
].join(",");

export const GOOGLE_ROUTES_FIELD_MASK = ["routes.duration", "routes.distanceMeters"].join(",");
export const GOOGLE_PLACES_AUTOCOMPLETE_FIELD_MASK = [
  "suggestions.placePrediction.placeId",
  "suggestions.placePrediction.text.text",
  "suggestions.placePrediction.structuredFormat.mainText.text",
  "suggestions.placePrediction.structuredFormat.secondaryText.text",
  "suggestions.placePrediction.types",
  "suggestions.placePrediction.distanceMeters",
].join(",");
export const GOOGLE_PLACE_PHOTO_MEDIA_SEGMENT = "media";
export const GOOGLE_PLACE_PHOTO_MAX_WIDTH_PX = 1600;
export const GOOGLE_PLACE_PHOTO_MAX_HEIGHT_PX = 1200;

export const DEFAULT_GOOGLE_NEARBY_SEARCH_RADIUS_METERS = 1500;
export const GOOGLE_NEARBY_SEARCH_MIN_RADIUS_METERS = 1;
export const GOOGLE_NEARBY_SEARCH_MAX_RADIUS_METERS = 50000;
export const GOOGLE_NEARBY_SEARCH_MAX_RESULT_COUNT = 20;
export const GOOGLE_NEARBY_SEARCH_RANK_PREFERENCE = "DISTANCE";

export const GOOGLE_TRAVEL_MODES = ["driving", "walking", "bicycling", "transit"] as const;
export type GoogleTravelMode = (typeof GOOGLE_TRAVEL_MODES)[number];

export const GOOGLE_ROUTES_TRAVEL_MODE_BY_TRAVEL_MODE: Record<GoogleTravelMode, string> = {
  driving: "DRIVE",
  walking: "WALK",
  bicycling: "BICYCLE",
  transit: "TRANSIT",
};

export const GOOGLE_TRAVEL_INFO_STATUS = {
  ok: "ok",
  notAvailable: "not_available",
} as const;

export const googleTypeByNearbyCategory: Record<NearbyPlaceCategory, string> = {
  hotels: "hotel",
  restaurants: "restaurant",
  cafes: "cafe",
  hospitals: "hospital",
  pharmacies: "pharmacy",
  parking: "parking",
  "bus stations": "bus_station",
  "railway stations": "train_station",
  airports: "airport",
  "fuel stations": "gas_station",
  ATMs: "atm",
  "shopping malls": "shopping_mall",
  "public toilets": "public_bathroom",
  "police stations": "police",
};
