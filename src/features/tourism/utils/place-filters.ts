import type { TourismLocationFilter, TourismPlace } from "@/types/tourism";

function matchesQuery(place: TourismPlace, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const searchableText = [
    place.name,
    place.summary,
    place.description,
    place.bestTimeToVisit,
    place.idealDuration,
    ...place.highlights,
    ...place.tags,
    ...place.categoryIds,
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

export function filterTourismPlaces(places: TourismPlace[], filters: TourismLocationFilter = {}) {
  return places.filter((place) => {
    const matchesState = filters.stateId ? place.stateId === filters.stateId : true;
    const matchesDistrict = filters.districtId ? place.districtId === filters.districtId : true;
    const matchesCategory = filters.categoryId ? place.categoryIds.includes(filters.categoryId) : true;
    const matchesPrice = filters.priceLevel ? place.priceLevel === filters.priceLevel : true;
    const matchesSearch = filters.query ? matchesQuery(place, filters.query) : true;

    return matchesState && matchesDistrict && matchesCategory && matchesPrice && matchesSearch;
  });
}
