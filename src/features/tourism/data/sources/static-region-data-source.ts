import { loadDistrictsByRegion } from "@/features/tourism/data/districts/district-loaders";
import { indianRegionById, indianRegions } from "@/features/tourism/data/regions/indian-regions";
import type { RegionDataSource } from "@/features/tourism/data/sources/region-data-source";
import type { IndianDistrict, IndianRegion } from "@/features/tourism/types/region";

export class StaticRegionDataSource implements RegionDataSource {
  async listRegions(): Promise<IndianRegion[]> {
    return indianRegions;
  }

  async getRegionById(regionId: string): Promise<IndianRegion | null> {
    return indianRegionById.get(regionId) ?? null;
  }

  async listDistrictsByRegion(regionId: string): Promise<IndianDistrict[]> {
    if (!indianRegionById.has(regionId)) {
      return [];
    }

    return loadDistrictsByRegion(regionId);
  }
}

export const staticRegionDataSource = new StaticRegionDataSource();
