export type EntityId = string;

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export type TimestampFields = {
  createdAt: Date;
  updatedAt: Date;
};
