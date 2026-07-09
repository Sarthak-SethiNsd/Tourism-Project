import type { EntityId, TimestampFields } from "@/types/common";

export type SavedPlaceLocation = {
  latitude: number | null;
  longitude: number | null;
  address?: string;
  districtName?: string;
  regionName?: string;
};

export type SavePlaceInput = {
  placeId: EntityId;
  googlePlaceId?: EntityId;
  name: string;
  photoUrl?: string;
  photoReference?: string;
  location?: SavedPlaceLocation;
};

export type SavedPlace = TimestampFields & {
  id: EntityId;
  userId: EntityId;
  placeId: EntityId;
  googlePlaceId?: EntityId;
  name: string;
  photoUrl?: string;
  photoReference?: string;
  location?: SavedPlaceLocation;
  savedAt: Date;
};
