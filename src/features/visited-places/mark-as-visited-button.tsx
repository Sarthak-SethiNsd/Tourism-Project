"use client";

import { useEffect, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";
import { addVisitedPlace, isPlaceVisited, removeVisitedPlace } from "@/features/tourism/services/tourism-service";
import type { TourismPlace } from "@/features/tourism/types";
import { cn } from "@/lib/utils";

type MarkAsVisitedButtonProps = { place: TourismPlace; className?: string };

export function MarkAsVisitedButton({ place, className }: MarkAsVisitedButtonProps) {
  const { user, isReady } = useAuthUser();
  const [isVisited, setIsVisited] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    async function loadVisitedState() {
      if (!isReady) return;
      setErrorMessage(null);
      setIsChecking(true);
      try {
        const nextValue = await isPlaceVisited(user?.uid, place.id);
        if (isActive) setIsVisited(nextValue);
      } catch {
        if (isActive) setErrorMessage("Visited status could not be loaded.");
      } finally {
        if (isActive) setIsChecking(false);
      }
    }
    void loadVisitedState();
    return () => { isActive = false; };
  }, [isReady, place.id, user?.uid]);

  async function handleToggle() {
    const previousValue = isVisited;
    setErrorMessage(null);
    setIsMutating(true);
    setIsVisited(!previousValue);
    try {
      if (previousValue) await removeVisitedPlace(user?.uid, place.id);
      else await addVisitedPlace(user?.uid, place);
      window.dispatchEvent(new Event("india-tourism.visited-change"));
    } catch {
      setIsVisited(previousValue);
      setErrorMessage("Could not update visited places. Please try again.");
    } finally {
      setIsMutating(false);
    }
  }

  const isBusy = !isReady || isChecking || isMutating;
  return <div className={cn("grid gap-2", className)}><Button type="button" variant={isVisited ? "secondary" : "outline"} onClick={handleToggle} disabled={isBusy}>{isBusy ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" aria-hidden />}{isBusy ? "Updating visited places" : isVisited ? "Visited" : "Mark as Visited"}</Button>{errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}</div>;
}
