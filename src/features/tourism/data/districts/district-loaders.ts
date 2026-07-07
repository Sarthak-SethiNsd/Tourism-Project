import type { IndianDistrict } from "@/features/tourism/types/region";

type DistrictModule = { default: IndianDistrict[] };

const districtLoaders: Record<string, () => Promise<DistrictModule>> = {
  "andhra-pradesh": () => import("@/features/tourism/data/districts/by-state/andhra-pradesh"),
  "arunachal-pradesh": () => import("@/features/tourism/data/districts/by-state/arunachal-pradesh"),
  assam: () => import("@/features/tourism/data/districts/by-state/assam"),
  bihar: () => import("@/features/tourism/data/districts/by-state/bihar"),
  chhattisgarh: () => import("@/features/tourism/data/districts/by-state/chhattisgarh"),
  goa: () => import("@/features/tourism/data/districts/by-state/goa"),
  gujarat: () => import("@/features/tourism/data/districts/by-state/gujarat"),
  haryana: () => import("@/features/tourism/data/districts/by-state/haryana"),
  "himachal-pradesh": () => import("@/features/tourism/data/districts/by-state/himachal-pradesh"),
  jharkhand: () => import("@/features/tourism/data/districts/by-state/jharkhand"),
  karnataka: () => import("@/features/tourism/data/districts/by-state/karnataka"),
  kerala: () => import("@/features/tourism/data/districts/by-state/kerala"),
  "madhya-pradesh": () => import("@/features/tourism/data/districts/by-state/madhya-pradesh"),
  maharashtra: () => import("@/features/tourism/data/districts/by-state/maharashtra"),
  manipur: () => import("@/features/tourism/data/districts/by-state/manipur"),
  meghalaya: () => import("@/features/tourism/data/districts/by-state/meghalaya"),
  mizoram: () => import("@/features/tourism/data/districts/by-state/mizoram"),
  nagaland: () => import("@/features/tourism/data/districts/by-state/nagaland"),
  odisha: () => import("@/features/tourism/data/districts/by-state/odisha"),
  punjab: () => import("@/features/tourism/data/districts/by-state/punjab"),
  rajasthan: () => import("@/features/tourism/data/districts/by-state/rajasthan"),
  sikkim: () => import("@/features/tourism/data/districts/by-state/sikkim"),
  "tamil-nadu": () => import("@/features/tourism/data/districts/by-state/tamil-nadu"),
  telangana: () => import("@/features/tourism/data/districts/by-state/telangana"),
  tripura: () => import("@/features/tourism/data/districts/by-state/tripura"),
  "uttar-pradesh": () => import("@/features/tourism/data/districts/by-state/uttar-pradesh"),
  uttarakhand: () => import("@/features/tourism/data/districts/by-state/uttarakhand"),
  "west-bengal": () => import("@/features/tourism/data/districts/by-state/west-bengal"),
  "andaman-and-nicobar-islands": () => import("@/features/tourism/data/districts/by-state/andaman-and-nicobar-islands"),
  chandigarh: () => import("@/features/tourism/data/districts/by-state/chandigarh"),
  "dadra-and-nagar-haveli-and-daman-and-diu": () =>
    import("@/features/tourism/data/districts/by-state/dadra-and-nagar-haveli-and-daman-and-diu"),
  delhi: () => import("@/features/tourism/data/districts/by-state/delhi"),
  "jammu-and-kashmir": () => import("@/features/tourism/data/districts/by-state/jammu-and-kashmir"),
  ladakh: () => import("@/features/tourism/data/districts/by-state/ladakh"),
  lakshadweep: () => import("@/features/tourism/data/districts/by-state/lakshadweep"),
  puducherry: () => import("@/features/tourism/data/districts/by-state/puducherry"),
};

const districtCache = new Map<string, IndianDistrict[]>();

export function hasDistrictLoader(regionId: string) {
  return regionId in districtLoaders;
}

export async function loadDistrictsByRegion(regionId: string): Promise<IndianDistrict[]> {
  const cached = districtCache.get(regionId);

  if (cached) {
    return cached;
  }

  const loader = districtLoaders[regionId];

  if (!loader) {
    return [];
  }

  const districtModule = await loader();
  const districts = districtModule.default;
  districtCache.set(regionId, districts);

  return districts;
}

export function clearDistrictCache() {
  districtCache.clear();
}
