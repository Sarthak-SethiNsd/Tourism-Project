import type { EntityId, TimestampFields } from "@/types/common";

export type UserProfile = TimestampFields & {
  id: EntityId;
  displayName: string;
  email: string;
  photoUrl?: string;
  savedPlaceIds: EntityId[];
};
