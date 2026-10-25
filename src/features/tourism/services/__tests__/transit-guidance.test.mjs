import { test } from "node:test";
import assert from "node:assert/strict";

// In-engine test of resolution logic and verified registry mappings
import { districtTransitRegistry } from "../../data/transit/district-transit-guidance.ts";

function hasMeaningfulGuidance(guidance) {
  if (!guidance) return false;
  return Boolean(
    (guidance.rail && guidance.rail.trim().length > 0) ||
    (guidance.road && guidance.road.trim().length > 0) ||
    (guidance.air && guidance.air.trim().length > 0) ||
    (guidance.local && guidance.local.trim().length > 0)
  );
}

function resolvePlaceTransitGuidance(place, district) {
  if (hasMeaningfulGuidance(place.transitGuidance)) {
    return {
      ...place.transitGuidance,
      sourceLevel: "destination",
    };
  }

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

  return undefined;
}

function createMockPlace(overrides = {}) {
  return {
    id: "test-place",
    name: "Test Attraction",
    stateId: "rajasthan",
    districtId: "rajasthan-jaipur",
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

test("Tier 1: Destination-specific guidance takes highest priority", () => {
  const customPlace = createMockPlace({
    transitGuidance: {
      rail: "Custom Destination Rail Station (~2 km)",
      road: "Direct shuttle from highway",
    },
  });

  const resolved = resolvePlaceTransitGuidance(customPlace, mockJaipurDistrict);

  assert.ok(resolved, "Guidance should be resolved");
  assert.equal(resolved.sourceLevel, "destination");
  assert.equal(resolved.rail, "Custom Destination Rail Station (~2 km)");
  assert.equal(resolved.road, "Direct shuttle from highway");
  assert.equal(resolved.districtName, undefined);
});

test("Tier 2: Inherits verified district-level guidance when place guidance is absent", () => {
  const placeWithoutGuidance = createMockPlace({
    transitGuidance: undefined,
  });

  const resolved = resolvePlaceTransitGuidance(placeWithoutGuidance, mockJaipurDistrict);

  assert.ok(resolved, "Guidance should be resolved via district fallback");
  assert.equal(resolved.sourceLevel, "district");
  assert.equal(resolved.districtName, "Jaipur");
  assert.ok(resolved.rail?.includes("Jaipur Junction"), "Should inherit Jaipur district railhead");
  assert.ok(resolved.air?.includes("Jaipur International Airport"), "Should inherit Jaipur airport");
});

test("Tier 2: Inherits district guidance when place guidance has empty or whitespace-only strings", () => {
  const whitespacePlace = createMockPlace({
    transitGuidance: {
      rail: "   ",
      road: "",
      air: "\t\n  ",
      local: "",
    },
  });

  const resolved = resolvePlaceTransitGuidance(whitespacePlace, mockJaipurDistrict);

  assert.ok(resolved, "Whitespace guidance should be treated as empty and trigger Tier 2");
  assert.equal(resolved.sourceLevel, "district");
  assert.equal(resolved.districtName, "Jaipur");
  assert.ok(resolved.rail?.includes("Jaipur Junction"));
});

test("Tier 1 with partial guidance does NOT fall back to district", () => {
  const partialPlace = createMockPlace({
    transitGuidance: {
      local: "Foot trail access only from main village road",
    },
  });

  const resolved = resolvePlaceTransitGuidance(partialPlace, mockJaipurDistrict);

  assert.ok(resolved);
  assert.equal(resolved.sourceLevel, "destination");
  assert.equal(resolved.local, "Foot trail access only from main village road");
  assert.equal(resolved.rail, undefined, "Unset custom fields must remain undefined and not be polluted by district registry");
});

test("Tier 3: Returns undefined when district is not in registry and place has no guidance", () => {
  const unindexedPlace = createMockPlace({
    districtId: "unregistered-unknown-district",
    transitGuidance: undefined,
  });

  const resolved = resolvePlaceTransitGuidance(unindexedPlace, {
    id: "unregistered-unknown-district",
    name: "Remote Forest",
    regionId: "unknown",
  });

  assert.equal(resolved, undefined, "Should safely return undefined for unregistered districts without fabricating data");
});

test("Tier 3: Returns undefined when place has no districtId and no guidance", () => {
  const noDistrictPlace = createMockPlace({
    districtId: undefined,
    transitGuidance: undefined,
  });

  const resolved = resolvePlaceTransitGuidance(noDistrictPlace);

  assert.equal(resolved, undefined, "Should safely return undefined when districtId is absent");
});

test("Registry integrity: Verified district keys exist and have non-empty guidance", () => {
  const verifiedDistrictKeys = [
    "rajasthan-jaipur",
    "rajasthan-udaipur",
    "rajasthan-jodhpur",
    "rajasthan-jaisalmer",
    "uttar-pradesh-agra",
    "uttar-pradesh-varanasi",
    "kerala-idukki",
    "kerala-alappuzha",
    "goa-north-goa",
    "karnataka-mysuru",
    "delhi-new-delhi",
    "delhi-south-delhi",
    "tamil-nadu-chennai",
    "tamil-nadu-madurai",
    "arunachal-pradesh-tawang",
  ];

  for (const key of verifiedDistrictKeys) {
    const entry = districtTransitRegistry[key];
    assert.ok(entry, `Registry must contain verified district: ${key}`);
    assert.ok(hasMeaningfulGuidance(entry), `Registry entry for ${key} must have meaningful guidance`);
  }
});
