import type { IndianDistrict, IndianRegion } from "@/features/tourism/types/region";
import type { TourismEvent, TourismPlace } from "@/types/tourism";
// @ts-expect-error Node.js ESM native execution requires .ts extension
import { curatedTourismEvents } from "../data/events/tourism-events.ts";

const recurrenceWeights: Record<TourismEvent["recurrence"], number> = {
  daily: 1,
  annual: 2,
  seasonal: 3,
  date_specific: 4,
};

const scopeWeights: Record<NonNullable<TourismEvent["scopeLevel"]>, number> = {
  destination: 1,
  district: 2,
  state: 3,
};

/**
 * Resolves cultural events and festivals for a destination following a deterministic,
 * three-tier geographic resolution hierarchy:
 *
 * 1. Tier 1 — Destination Match: Events explicitly tied to place.id.
 * 2. Tier 2 — District Match: Relevant celebrations attributed to the district.
 * 3. Tier 3 — State Cultural Heritage Fallback: Up to two major state festivals when
 *    fewer than two relevant destination/district events are available.
 *
 * Capped at 4 events total, with at most 2 Tier 3 fallback events.
 */
export function resolveTourismEventsForPlace(
  place: TourismPlace,
  district?: IndianDistrict,
  region?: IndianRegion | null,
  eventsSource: TourismEvent[] = curatedTourismEvents,
): TourismEvent[] {
  if (!place) {
    return [];
  }

  const seenIds = new Set<string>();
  const directEvents: TourismEvent[] = [];
  const districtEvents: TourismEvent[] = [];
  const stateFallbackCandidates: TourismEvent[] = [];

  const districtName = district?.name || place.districtName || "District";
  const stateName = region?.name || place.stateId;

  for (const event of eventsSource) {
    // 1. Tier 1: Direct destination match
    if (event.placeIds && event.placeIds.includes(place.id)) {
      if (!seenIds.has(event.id)) {
        seenIds.add(event.id);
        directEvents.push({
          ...event,
          scopeLevel: "destination",
        });
      }
      continue;
    }

    // 2. Tier 2: District/city match
    if (place.districtId && event.districtId === place.districtId) {
      if (!seenIds.has(event.id)) {
        seenIds.add(event.id);
        districtEvents.push({
          ...event,
          scopeLevel: "district",
          regionContextName: districtName,
        });
      }
      continue;
    }

    // 3. Tier 3: State-level major cultural festival candidate
    if (place.stateId && event.stateId === place.stateId && event.isMajorFestival) {
      if (!seenIds.has(event.id)) {
        stateFallbackCandidates.push({
          ...event,
          scopeLevel: "state",
          regionContextName: stateName,
        });
      }
    }
  }

  // Combine Tier 1 and Tier 2
  const results: TourismEvent[] = [...directEvents, ...districtEvents];

  // Tier 3: Add up to 2 major state-level festivals ONLY when fewer than 2 relevant
  // destination/district events are available.
  if (results.length < 2 && place.stateId) {
    const fallbackSlotsNeeded = Math.min(2 - results.length, 2);
    // Sort state fallback candidates before selecting the top ones
    stateFallbackCandidates.sort((a, b) => {
      const aWeight = recurrenceWeights[a.recurrence] ?? 5;
      const bWeight = recurrenceWeights[b.recurrence] ?? 5;
      if (aWeight !== bWeight) return aWeight - bWeight;
      return a.name.localeCompare(b.name);
    });

    const chosenFallbacks = stateFallbackCandidates
      .filter((candidate) => !seenIds.has(candidate.id))
      .slice(0, fallbackSlotsNeeded);

    for (const fallback of chosenFallbacks) {
      seenIds.add(fallback.id);
      results.push(fallback);
    }
  }

  // Deterministic sorting across all selected events:
  // 1. scopeLevel (destination first -> district -> state)
  // 2. isMajorFestival (major first)
  // 3. recurrence (daily -> annual -> seasonal -> date_specific)
  // 4. name alphabetical (localeCompare)
  results.sort((a, b) => {
    const aScope = scopeWeights[a.scopeLevel ?? "destination"] ?? 4;
    const bScope = scopeWeights[b.scopeLevel ?? "destination"] ?? 4;
    if (aScope !== bScope) return aScope - bScope;

    const aMajor = a.isMajorFestival ? 1 : 0;
    const bMajor = b.isMajorFestival ? 1 : 0;
    if (aMajor !== bMajor) return bMajor - aMajor;

    const aRecurrence = recurrenceWeights[a.recurrence] ?? 5;
    const bRecurrence = recurrenceWeights[b.recurrence] ?? 5;
    if (aRecurrence !== bRecurrence) return aRecurrence - bRecurrence;

    return a.name.localeCompare(b.name);
  });

  // Never return more than 4 events total
  return results.slice(0, 4);
}
