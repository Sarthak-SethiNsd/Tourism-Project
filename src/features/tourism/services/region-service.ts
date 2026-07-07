import { activeTourismProvider } from "@/features/tourism/providers/active-tourism-provider";
import type { TourismProvider } from "@/features/tourism/providers/tourism-provider";
import type { IndianDistrict, IndianRegion } from "@/features/tourism/types/region";

export class RegionService {
  constructor(private readonly provider: TourismProvider) {}

  listRegions(): Promise<IndianRegion[]> {
    return this.provider.listRegions();
  }

  listStates(): Promise<IndianRegion[]> {
    return this.provider.listStates();
  }

  listUnionTerritories(): Promise<IndianRegion[]> {
    return this.provider.listUnionTerritories();
  }

  getRegionById(regionId: string): Promise<IndianRegion | null> {
    return this.provider.getRegionById(regionId);
  }

  listDistrictsByRegion(regionId: string): Promise<IndianDistrict[]> {
    return this.provider.listDistrictsByRegion(regionId);
  }
}

export const regionService = new RegionService(activeTourismProvider);

export function createRegionService(provider: TourismProvider) {
  return new RegionService(provider);
}
