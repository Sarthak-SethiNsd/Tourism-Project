import type { EntityId, TimestampFields } from "@/types/common";

export type VisitedPlaceInput = {
  placeId: EntityId;
  mapplsPlaceId?: EntityId;
  placeName: string;
  thumbnailUrl?: string;
  thumbnailPhotoReference?: string;
  district?: string;
  state?: string;
};

export type VisitedPlace = VisitedPlaceInput &
  TimestampFields & {
    id: EntityId;
    userId?: EntityId;
    visitedAt: Date;
  };
