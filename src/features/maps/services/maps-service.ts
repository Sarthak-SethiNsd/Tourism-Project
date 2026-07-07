import type { MapViewport } from "@/features/maps/types";

export function getDefaultIndiaViewport(): MapViewport {
  return {
    latitude: 22.9734,
    longitude: 78.6569,
    zoom: 4,
  };
}
