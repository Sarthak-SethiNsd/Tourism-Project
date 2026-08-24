import type { NearbyPlaceCategory } from "@/features/tourism/providers/tourism-provider";

export const MAPPLS_SEARCH_API_BASE_URL = "https://search.mappls.com";
export const MAPPLS_TEXT_SEARCH_ENDPOINT = `${MAPPLS_SEARCH_API_BASE_URL}/search/places/textsearch/json`;
export const MAPPLS_AUTOSUGGEST_ENDPOINT = `${MAPPLS_SEARCH_API_BASE_URL}/search/places/autosuggest/json`;
export const MAPPLS_NEARBY_SEARCH_ENDPOINT = `${MAPPLS_SEARCH_API_BASE_URL}/search/places/nearby/json`;
export const MAPPLS_GEOCODING_ENDPOINT = `${MAPPLS_SEARCH_API_BASE_URL}/search/address/geocode`;
export const MAPPLS_REVERSE_GEOCODING_ENDPOINT = `${MAPPLS_SEARCH_API_BASE_URL}/search/address/rev-geocode`;
export const MAPPLS_PLACE_DETAILS_ENDPOINT = "https://place.mappls.com/O2O/entity/place-details";
export const MAPPLS_ROUTE_API_BASE_URL = "https://route.mappls.com/route/direction";

export const MAPPLS_REGION_CODE = "IND";
export const MAPPLS_REQUEST_REVALIDATE_SECONDS = 60 * 60;
export const MAPPLS_API_CACHE_TTL_MS = MAPPLS_REQUEST_REVALIDATE_SECONDS * 1000;
export const MAPPLS_NEARBY_SEARCH_MIN_RADIUS_METERS = 500;
export const MAPPLS_NEARBY_SEARCH_MAX_RADIUS_METERS = 10000;
export const MAPPLS_NEARBY_SEARCH_MAX_RESULT_COUNT = 20;
export const MAPPLS_ROUTE_RESOURCE = "route_adv";

export const MAPPLS_TRAVEL_MODES = ["driving", "walking", "bicycling"] as const;
export type MapplsTravelMode = (typeof MAPPLS_TRAVEL_MODES)[number];

export const MAPPLS_ROUTE_PROFILE_BY_TRAVEL_MODE: Record<MapplsTravelMode, string> = {
  driving: "driving",
  walking: "walking",
  bicycling: "biking",
};

export const MAPPLS_TRAVEL_INFO_STATUS = {
  ok: "ok",
  notAvailable: "not_available",
} as const;

export const mapplsKeywordByNearbyCategory: Record<NearbyPlaceCategory, string> = {
  hotels: "hotel",
  restaurants: "restaurant",
  cafes: "cafe",
  hospitals: "hospital",
  pharmacies: "pharmacy",
  parking: "parking",
  "bus stations": "bus station",
  "railway stations": "railway station",
  airports: "airport",
  "fuel stations": "fuel station",
  ATMs: "atm",
  "shopping malls": "shopping mall",
  "public toilets": "public toilet",
  "police stations": "police station",
  "tourist attractions": "tourist attraction",
};
