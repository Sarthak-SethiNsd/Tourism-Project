"use client";

import { useEffect } from "react";
import { hasFirebaseConfig } from "@/config/firebase";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";
import { saveRecentlyViewedPlace } from "@/features/tourism/services/tourism-service";
import type { IndianDistrict, IndianRegion, TourismPlace } from "@/features/tourism/types";

type RecentlyViewedTrackerProps = {
  place: TourismPlace;
  district?: IndianDistrict;
  region: IndianRegion | null;
};

export function RecentlyViewedTracker({ place, district, region }: RecentlyViewedTrackerProps) {
  const { user, isReady } = useAuthUser();

  useEffect(() => {
    if (hasFirebaseConfig && !isReady) {
      return;
    }

    void saveRecentlyViewedPlace(user?.uid, place, { district, region: region ?? undefined });
  }, [district, isReady, place, region, user?.uid]);

  return null;
}
