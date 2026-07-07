import type { SelectOption } from "@/config/tourism";
import type { IndianDistrict, IndianRegion } from "@/features/tourism/types/region";

export function regionToSelectOption(region: IndianRegion): SelectOption {
  return {
    label: region.name,
    value: region.id,
    description: region.description,
  };
}

export function districtToSelectOption(district: IndianDistrict): SelectOption {
  return {
    label: district.name,
    value: district.id,
  };
}

export function regionsToSelectOptions(regions: IndianRegion[]): SelectOption[] {
  return regions.map(regionToSelectOption);
}

export function districtsToSelectOptions(districts: IndianDistrict[]): SelectOption[] {
  return districts.map(districtToSelectOption);
}
