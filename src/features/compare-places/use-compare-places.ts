"use client";

import { useEffect, useState } from "react";
import { getComparePlaceIds, subscribeToComparePlaces } from "@/features/compare-places/compare-storage";

export function useComparePlaceIds() {
  const [placeIds, setPlaceIds] = useState<string[]>([]);

  useEffect(() => {
    const updatePlaceIds = () => setPlaceIds(getComparePlaceIds());

    updatePlaceIds();
    return subscribeToComparePlaces(updatePlaceIds);
  }, []);

  return placeIds;
}
