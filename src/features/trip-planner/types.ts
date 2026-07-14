import type { EntityId } from "@/types/common";

export type TripPlaceInput = {
  placeId: EntityId;
  googlePlaceId?: EntityId;
  placeName: string;
  thumbnailUrl?: string;
  thumbnailPhotoReference?: string;
  district?: string;
  state?: string;
};

export type TripPlace = TripPlaceInput & {
  addedAt: Date;
};

export type TripInput = {
  name: string;
  destinationCity: string;
  startDate: string;
  endDate: string;
  notes?: string;
};

export type Trip = TripInput & {
  id: EntityId;
  places: TripPlace[];
  createdAt: Date;
  updatedAt: Date;
};
