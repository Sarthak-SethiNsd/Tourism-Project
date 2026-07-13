import type { EntityId } from "@/types/common";

export type RecentlyViewedPlaceInput = {
  placeId: EntityId;
  googlePlaceId?: EntityId;
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
