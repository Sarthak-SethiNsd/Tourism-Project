import type { EntityId } from "@/types/common";

export type CollectionPlaceInput = {
  placeId: EntityId;
  googlePlaceId?: EntityId;
  placeName: string;
  thumbnailUrl?: string;
  thumbnailPhotoReference?: string;
  district?: string;
  state?: string;
};

export type CollectionPlace = CollectionPlaceInput & {
  addedAt: Date;
};

export type CollectionInput = {
  name: string;
  description?: string;
};

export type PlaceCollection = CollectionInput & {
  id: EntityId;
  places: CollectionPlace[];
  createdAt: Date;
  updatedAt: Date;
};
