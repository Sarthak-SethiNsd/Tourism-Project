"use client";

import { Scale, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MAX_COMPARE_PLACES,
  addComparePlace,
  removeComparePlace,
} from "@/features/compare-places/compare-storage";
import { useComparePlaceIds } from "@/features/compare-places/use-compare-places";
import { cn } from "@/lib/utils";

type ComparePlaceButtonProps = {
  placeId: string;
  className?: string;
};

export function ComparePlaceButton({ placeId, className }: ComparePlaceButtonProps) {
  const placeIds = useComparePlaceIds();
  const isSelected = placeIds.includes(placeId);
  const [message, setMessage] = useState<string | null>(null);

  function handleComparison() {
    if (isSelected) {
      removeComparePlace(placeId);
      setMessage(null);
      return;
    }

    const result = addComparePlace(placeId);
    setMessage(result === "limit-reached" ? `You can compare up to ${MAX_COMPARE_PLACES} places.` : null);
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Button type="button" variant={isSelected ? "secondary" : "outline"} onClick={handleComparison}>
        {isSelected ? <X className="size-4" aria-hidden /> : <Scale className="size-4" aria-hidden />}
        {isSelected ? "Remove from compare" : "Compare place"}
      </Button>
      {isSelected ? (
        <Button asChild type="button" variant="ghost" className="justify-start px-3 text-primary">
          <Link href="/compare">View comparison</Link>
        </Button>
      ) : null}
      {message ? <p className="text-sm text-destructive" role="status">{message}</p> : null}
    </div>
  );
}
