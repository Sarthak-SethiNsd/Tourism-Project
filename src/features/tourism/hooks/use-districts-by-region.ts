"use client";

import { useEffect, useState } from "react";
import type { IndianDistrict } from "@/features/tourism/types/region";
import { tourismService } from "@/features/tourism/services/tourism-service";
import type { AsyncStatus } from "@/types/common";

type UseDistrictsByRegionResult = {
  districts: IndianDistrict[];
  status: AsyncStatus;
  error: Error | null;
};

export function useDistrictsByRegion(regionId: string | undefined): UseDistrictsByRegionResult {
  const [districts, setDistricts] = useState<IndianDistrict[]>([]);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!regionId) {
      setDistricts([]);
      setStatus("idle");
      setError(null);
      return;
    }

    let cancelled = false;

    setStatus("loading");
    setError(null);

    tourismService
      .listDistrictsByRegion(regionId)
      .then((nextDistricts) => {
        if (!cancelled) {
          setDistricts(nextDistricts);
          setStatus("success");
        }
      })
      .catch((nextError: unknown) => {
        if (!cancelled) {
          setDistricts([]);
          setError(nextError instanceof Error ? nextError : new Error("Failed to load districts."));
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [regionId]);

  return { districts, status, error };
}
