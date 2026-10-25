import type { IndianDistrict } from "@/features/tourism/types/region";
import type { TourismPlace, TourismTransitGuidance } from "@/types/tourism";
import { districtTransitRegistry } from "@/features/tourism/data/transit/district-transit-guidance";

/**
 * Checks whether a guidance object contains at least one meaningful, non-whitespace string.
 */
export function hasMeaningfulGuidance(guidance?: TourismTransitGuidance): boolean {
  if (!guidance) return false;
  return Boolean(
    (guidance.rail && guidance.rail.trim().length > 0) ||
    (guidance.road && guidance.road.trim().length > 0) ||
    (guidance.air && guidance.air.trim().length > 0) ||
    (guidance.local && guidance.local.trim().length > 0)
  );
}

/**
 * Resolves transit guidance for a destination following strict non-destructive fallback precedence:
 *
 * 1. Tier 1 (Destination-Specific): If place.transitGuidance contains non-empty text, it takes
 *    absolute priority and is stamped with sourceLevel: "destination".
 * 2. Tier 2 (District-Level Inheritance): If custom guidance is absent or contains only whitespace,
 *    inherits verified regional gateway corridors from the district registry for place.districtId.
 *    Stamped with sourceLevel: "district" and the district name.
 * 3. Tier 3 (Unavailable): If neither exists, returns undefined (triggers nearby-hub lookup or EmptyState).
 */
export function resolvePlaceTransitGuidance(
  place: TourismPlace,
  district?: IndianDistrict
): TourismTransitGuidance | undefined {
  // 1. Tier 1: Valid destination-specific guidance takes precedence
  if (hasMeaningfulGuidance(place.transitGuidance)) {
    return {
      ...place.transitGuidance,
      sourceLevel: "destination",
    };
  }

  // 2. Tier 2: Inherit verified district guidance if available
  if (place.districtId) {
    const districtGuidance = districtTransitRegistry[place.districtId];
    if (hasMeaningfulGuidance(districtGuidance)) {
      return {
        ...districtGuidance,
        sourceLevel: "district",
        districtName: district?.name || place.districtName,
      };
    }
  }

  // 3. Tier 3: No verified guidance available
  return undefined;
}
