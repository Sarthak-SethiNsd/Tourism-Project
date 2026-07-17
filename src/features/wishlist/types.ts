import type { EntityId, TimestampFields } from "@/types/common";

export type WishlistPlaceInput = {
  placeId: EntityId;
  googlePlaceId?: EntityId;
  placeName: string;
  thumbnailUrl?: string;
  thumbnailPhotoReference?: string;
  district?: string;
  state?: string;
};

export type WishlistPlace = WishlistPlaceInput &
  TimestampFields & {
    id: EntityId;
    userId?: EntityId;
    addedAt: Date;
  };
