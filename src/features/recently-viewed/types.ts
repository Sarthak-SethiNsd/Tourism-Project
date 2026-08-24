import type { EntityId } from "@/types/common";

export type RecentlyViewedPlaceInput = {
  placeId: EntityId;
  mapplsPlaceId?: EntityId;
  placeName: string;
  thumbnailPhotoReference?: string;
  thumbnailUrl?: string;
  district?: string;
  state?: string;
  country: string;
};

export type RecentlyViewedPlace = RecentlyViewedPlaceInput & {
  viewedAt: Date;
};
