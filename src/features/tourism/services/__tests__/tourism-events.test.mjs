import { test } from "node:test";
import assert from "node:assert/strict";

// Directly test the production event resolver and curated dataset
import { resolveTourismEventsForPlace } from "../event-resolution-service.ts";
import { curatedTourismEvents } from "../../data/events/tourism-events.ts";

function createMockPlace(overrides = {}) {
  return {
    id: "test-place",
    name: "Test Attraction",
    stateId: "rajasthan",
    districtId: "rajasthan-jaipur",
    districtName: "Jaipur",
    categoryIds: ["heritage"],
    summary: "A test attraction summary.",
    description: "A test attraction detailed description.",
    highlights: ["Highlight 1"],
    bestTimeToVisit: "October to March",
    idealDuration: "2 hours",
    priceLevel: "free",
    rating: 4.5,
    tags: ["heritage", "test"],
    ...overrides,
  };
}

const mockJaipurDistrict = {
  id: "rajasthan-jaipur",
  name: "Jaipur",
  regionId: "rajasthan",
};

const mockRajasthanRegion = {
  id: "rajasthan",
  name: "Rajasthan",
  description: "Desert state",
};

test("Tier 1: Destination-specific events take precedence and are stamped with destination scope", () => {
  const place = createMockPlace({ id: "amber-fort-jaipur" });
  const results = resolveTourismEventsForPlace(place, mockJaipurDistrict, mockRajasthanRegion);

  assert.ok(results.length > 0, "Should resolve events for Amber Fort");
  const directEvents = results.filter((e) => e.scopeLevel === "destination");
  assert.ok(directEvents.length > 0, "Should have direct destination events");
  assert.equal(directEvents[0].scopeLevel, "destination");
  assert.ok(
    directEvents.some((e) => e.id === "teej-festival-jaipur" || e.id === "gangaur-festival-jaipur"),
    "Should include Teej or Gangaur tagged for Amber Fort",
  );
});

test("Tier 2: Inherits district celebrations when destination has no direct events", () => {
  const genericJaipurPlace = createMockPlace({
    id: "unlisted-jaipur-monument",
    districtId: "rajasthan-jaipur",
  });

  const results = resolveTourismEventsForPlace(genericJaipurPlace, mockJaipurDistrict, mockRajasthanRegion);

  assert.ok(results.length > 0, "Should inherit district celebrations");
  const districtEvents = results.filter((e) => e.scopeLevel === "district");
  assert.ok(districtEvents.length > 0, "Should be tagged as district scope");
  assert.equal(districtEvents[0].regionContextName, "Jaipur");
});

test("Tier 3: Falls back to up to 2 major state-level festivals when local events are insufficient", () => {
  const jaisalmerPlace = createMockPlace({
    id: "remote-jaisalmer-dune",
    districtId: "rajasthan-jaisalmer",
    districtName: "Jaisalmer",
  });

  const mockJaisalmerDistrict = {
    id: "rajasthan-jaisalmer",
    name: "Jaisalmer",
    regionId: "rajasthan",
  };

  const results = resolveTourismEventsForPlace(jaisalmerPlace, mockJaisalmerDistrict, mockRajasthanRegion);

  assert.ok(results.length > 0, "Should provide state-level fallback festivals");
  assert.ok(results.length <= 2, "State fallback must not exceed 2 events");
  for (const event of results) {
    assert.equal(event.scopeLevel, "state");
    assert.equal(event.regionContextName, "Rajasthan");
    assert.equal(event.isMajorFestival, true, "Only major festivals can serve as state fallback");
  }
});

test("Cap: Never returns more than 4 events total", () => {
  const customEvents = [
    {
      id: "ev-1",
      name: "Event 1",
      category: "cultural",
      recurrence: "annual",
      periodDescription: "Spring",
      placeIds: ["crowded-place"],
      districtId: "dist-1",
      stateId: "state-1",
      summary: "Summary 1",
    },
    {
      id: "ev-2",
      name: "Event 2",
      category: "cultural",
      recurrence: "annual",
      periodDescription: "Summer",
      placeIds: ["crowded-place"],
      districtId: "dist-1",
      stateId: "state-1",
      summary: "Summary 2",
    },
    {
      id: "ev-3",
      name: "Event 3",
      category: "cultural",
      recurrence: "annual",
      periodDescription: "Monsoon",
      placeIds: ["crowded-place"],
      districtId: "dist-1",
      stateId: "state-1",
      summary: "Summary 3",
    },
    {
      id: "ev-4",
      name: "Event 4",
      category: "cultural",
      recurrence: "annual",
      periodDescription: "Autumn",
      placeIds: ["crowded-place"],
      districtId: "dist-1",
      stateId: "state-1",
      summary: "Summary 4",
    },
    {
      id: "ev-5",
      name: "Event 5",
      category: "cultural",
      recurrence: "annual",
      periodDescription: "Winter",
      placeIds: ["crowded-place"],
      districtId: "dist-1",
      stateId: "state-1",
      summary: "Summary 5",
    },
  ];

  const crowdedPlace = createMockPlace({ id: "crowded-place", districtId: "dist-1", stateId: "state-1" });
  const results = resolveTourismEventsForPlace(crowdedPlace, undefined, undefined, customEvents);

  assert.equal(results.length, 4, "Total events must strictly be capped at 4");
});

test("Deduplication: Prevents duplicate events across geographic tiers", () => {
  const customEvents = [
    {
      id: "multi-tier-event",
      name: "Shared Festival",
      category: "cultural",
      recurrence: "annual",
      periodDescription: "Autumn",
      placeIds: ["target-place"],
      districtId: "target-district",
      stateId: "target-state",
      isMajorFestival: true,
      summary: "Summary",
    },
  ];

  const place = createMockPlace({
    id: "target-place",
    districtId: "target-district",
    stateId: "target-state",
  });

  const results = resolveTourismEventsForPlace(place, undefined, undefined, customEvents);

  assert.equal(results.length, 1, "Event must appear only once");
  assert.equal(results[0].scopeLevel, "destination", "Should be attributed at the highest matching tier");
});

test("Deterministic sorting: Direct events sort before district and state events", () => {
  const customEvents = [
    {
      id: "state-ev",
      name: "A State Event",
      category: "cultural",
      recurrence: "annual",
      periodDescription: "Spring",
      districtId: "other-district",
      stateId: "test-state",
      isMajorFestival: true,
      summary: "Summary",
    },
    {
      id: "direct-ev",
      name: "Z Direct Event",
      category: "cultural",
      recurrence: "annual",
      periodDescription: "Autumn",
      placeIds: ["sort-place"],
      districtId: "test-district",
      stateId: "test-state",
      isMajorFestival: false,
      summary: "Summary",
    },
    {
      id: "district-ev",
      name: "M District Event",
      category: "cultural",
      recurrence: "annual",
      periodDescription: "Winter",
      districtId: "test-district",
      stateId: "test-state",
      isMajorFestival: true,
      summary: "Summary",
    },
  ];

  const place = createMockPlace({
    id: "sort-place",
    districtId: "test-district",
    stateId: "test-state",
  });

  const results = resolveTourismEventsForPlace(place, undefined, undefined, customEvents);

  assert.equal(results[0].id, "direct-ev", "Direct event must sort first despite alphabetical or major status");
  assert.equal(results[1].id, "district-ev", "District event must sort second");
});

test("Robustness: Gracefully handles missing place, invalid districts, and missing states", () => {
  // @ts-expect-error test undefined place
  assert.deepEqual(resolveTourismEventsForPlace(undefined), []);

  const isolatedPlace = createMockPlace({
    id: "isolated-destination",
    districtId: undefined,
    stateId: undefined,
  });

  const results = resolveTourismEventsForPlace(isolatedPlace);
  assert.ok(Array.isArray(results));
  assert.equal(results.length, 0, "Unindexed place with no district or state should safely return empty array");
});

test("Temporal accuracy: Does not fabricate annual Gregorian dates when confirmedEdition is absent", () => {
  const varanasiAarti = curatedTourismEvents.find((e) => e.id === "evening-ganga-aarti-varanasi");
  assert.ok(varanasiAarti);
  assert.ok(varanasiAarti.periodDescription.includes("sunset"), "Must provide human-readable timing description");
  assert.equal(varanasiAarti.confirmedEdition, undefined, "Daily ritual should not have annual confirmed edition");

  const devDeepawali = curatedTourismEvents.find((e) => e.id === "dev-deepawali-varanasi");
  assert.ok(devDeepawali);
  assert.ok(devDeepawali.periodDescription.includes("Kartik Purnima"), "Must ground timing in traditional lunar calendar");
});

test("Dataset integrity: All 21 curated events meet domain standards and official requirements", () => {
  assert.equal(curatedTourismEvents.length, 21, "Curated events dataset must contain exactly 21 verified entries");

  for (const event of curatedTourismEvents) {
    assert.ok(event.id && event.id.length > 0, "Event must have id");
    assert.ok(event.name && event.name.length > 0, "Event must have name");
    assert.ok(event.summary && event.summary.length > 0, "Event must have summary");
    assert.ok(event.periodDescription && event.periodDescription.length > 0, "Event must have periodDescription");
    assert.ok(event.stateId && event.stateId.length > 0, "Event must have stateId");
    assert.ok(event.category, "Event must have category");
    assert.ok(event.recurrence, "Event must have recurrence");
    if (event.officialWebsiteUrl) {
      assert.ok(
        event.officialWebsiteUrl.startsWith("https://"),
        `Official URL must use secure https: ${event.officialWebsiteUrl}`,
      );
    }
  }
});
