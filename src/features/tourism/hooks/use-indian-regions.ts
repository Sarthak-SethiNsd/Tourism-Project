"use client";

import { useEffect, useState } from "react";
import type { IndianRegion } from "@/features/tourism/types/region";
import { tourismService } from "@/features/tourism/services/tourism-service";
import type { AsyncStatus } from "@/types/common";

type UseIndianRegionsResult = {
  regions: IndianRegion[];
  status: AsyncStatus;
  error: Error | null;
};

export function useIndianRegions(): UseIndianRegionsResult {
  const [regions, setRegions] = useState<IndianRegion[]>([]);
  const [status, setStatus] = useState<AsyncStatus>("loading");
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    tourismService
      .listRegions()
      .then((nextRegions) => {
        if (!cancelled) {
          setRegions(nextRegions);
          setStatus("success");
        }
      })
      .catch((nextError: unknown) => {
        if (!cancelled) {
          setError(nextError instanceof Error ? nextError : new Error("Failed to load regions."));
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { regions, status, error };
}
