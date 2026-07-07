import type { SelectOption } from "@/config/tourism";
import { regionsToSelectOptions } from "@/features/tourism/utils/region-mappers";
import type { IndianRegion } from "@/features/tourism/types/region";

const RECENT_REGIONS_STORAGE_KEY = "recent-tourism-states";
const MAX_RECENT_REGIONS = 4;

export function getRecentRegionOptions(allRegions: IndianRegion[]): SelectOption[] {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = window.localStorage.getItem(RECENT_REGIONS_STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    const values = JSON.parse(saved) as string[];
    const options = regionsToSelectOptions(allRegions);

    return values
      .map((value) => options.find((option) => option.value === value))
      .filter((option): option is SelectOption => Boolean(option));
  } catch {
    return [];
  }
}

export function saveRecentRegion(regionId: string, allRegions: IndianRegion[]) {
  const current = getRecentRegionOptions(allRegions).map((region) => region.value);
  const nextValues = [regionId, ...current.filter((item) => item !== regionId)].slice(0, MAX_RECENT_REGIONS);
  window.localStorage.setItem(RECENT_REGIONS_STORAGE_KEY, JSON.stringify(nextValues));
}
