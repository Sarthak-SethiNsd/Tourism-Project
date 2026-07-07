import type { EntityId, TimestampFields } from "@/types/common";

export type SavedPlace = TimestampFields & {
  id: EntityId;
  userId: EntityId;
  placeId: EntityId;
};
