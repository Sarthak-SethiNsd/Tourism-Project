import type { EntityId } from "@/types/common";

export type SearchHistoryInput = {
  placeId: EntityId;
  googlePlaceId?: EntityId;
  placeName: string;
  district?: string;
  state?: string;
  country: string;
  primaryCategory?: string;
  thumbnailPhotoReference?: string;
  thumbnailUrl?: string;
};

export type SearchHistoryEntry = SearchHistoryInput & {
  id: EntityId;
  userId: EntityId;
  searchedAt: Date;
};
