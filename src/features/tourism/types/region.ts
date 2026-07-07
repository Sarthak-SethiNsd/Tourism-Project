import type { EntityId } from "@/types/common";

export type RegionType = "state" | "union_territory";

export type IndianRegion = {
  id: EntityId;
  name: string;
  type: RegionType;
  description?: string;
};

export type IndianDistrict = {
  id: EntityId;
  name: string;
  regionId: EntityId;
};

export type ExploreScope = "district" | "state";

export type LocationSelection = {
  regionId: EntityId;
  districtId?: EntityId;
  scope: ExploreScope;
};
