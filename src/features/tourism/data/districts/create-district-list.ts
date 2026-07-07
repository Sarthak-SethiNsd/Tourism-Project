import type { IndianDistrict } from "@/features/tourism/types/region";
import { toRegionSlug } from "@/features/tourism/utils/region-slug";

export function createDistrictList(regionId: string, names: readonly string[]): IndianDistrict[] {
  return names.map((name) => ({
    id: `${regionId}-${toRegionSlug(name)}`,
    name,
    regionId,
  }));
}
