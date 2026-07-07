import type { IndianDistrict, IndianRegion } from "@/features/tourism/types/region";

export interface RegionDataSource {
  listRegions(): Promise<IndianRegion[]>;
  getRegionById(regionId: string): Promise<IndianRegion | null>;
  listDistrictsByRegion(regionId: string): Promise<IndianDistrict[]>;
}
