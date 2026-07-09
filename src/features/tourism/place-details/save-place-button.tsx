"use client";

import { useEffect, useState } from "react";
import { Heart, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasFirebaseConfig } from "@/config/firebase";
import { signInWithGoogle } from "@/features/authentication/services/authentication-service";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";
import { isPlaceSaved, savePlace, unsavePlace } from "@/features/tourism/services/tourism-service";
import type { TourismPlace } from "@/features/tourism/types";
import { cn } from "@/lib/utils";

type SavePlaceButtonProps = {
  place: TourismPlace;
  className?: string;
};

export function SavePlaceButton({ place, className }: SavePlaceButtonProps) {
  const { user, isReady } = useAuthUser();
  const [isSaved, setIsSaved] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadSavedState() {
      setErrorMessage(null);

      if (!hasFirebaseConfig || !isReady || !user) {
        setIsSaved(false);
        setIsChecking(!isReady);
        return;
      }

      setIsChecking(true);

      try {
        const nextIsSaved = await isPlaceSaved(user.uid, place.id);

        if (isActive) {
          setIsSaved(nextIsSaved);
        }
      } catch {
        if (isActive) {
          setErrorMessage("Saved status could not be loaded.");
        }
      } finally {
        if (isActive) {
          setIsChecking(false);
        }
      }
    }

    void loadSavedState();

    return () => {
      isActive = false;
    };
  }, [isReady, place.id, user]);

  async function handleToggleSaved() {
    if (!hasFirebaseConfig) {
      setErrorMessage("Firebase is not configured for saved places.");
      return;
    }

    setErrorMessage(null);
    setIsMutating(true);
    let didOptimisticallyUpdate = false;

    try {
      const activeUser = user ?? (await signInWithGoogle()).user;
      const previousIsSaved = isSaved;

      setIsSaved(!previousIsSaved);
      didOptimisticallyUpdate = true;

      if (previousIsSaved) {
        await unsavePlace(activeUser.uid, place.id);
      } else {
        await savePlace(activeUser.uid, place);
      }
    } catch {
      if (didOptimisticallyUpdate) {
        setIsSaved((currentValue) => !currentValue);
      }
      setErrorMessage("Could not update saved places. Please try again.");
    } finally {
      setIsMutating(false);
      setIsChecking(false);
    }
  }

  const isBusy = isChecking || isMutating;
  const buttonLabel = getButtonLabel({ isChecking, isMutating, isReady, isSaved, userId: user?.uid });

  return (
    <div className={cn("grid gap-2", className)}>
      <Button type="button" variant={isSaved ? "secondary" : "default"} onClick={handleToggleSaved} disabled={isBusy}>
        {isBusy ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden />
        ) : (
          <Heart className={cn("size-4", isSaved ? "fill-current" : "")} aria-hidden />
        )}
        {buttonLabel}
      </Button>
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </div>
  );
}

function getButtonLabel({
  isChecking,
  isMutating,
  isReady,
  isSaved,
  userId,
}: {
  isChecking: boolean;
  isMutating: boolean;
  isReady: boolean;
  isSaved: boolean;
  userId?: string;
}) {
  if (!isReady || isChecking) {
    return "Checking saved status";
  }

  if (isMutating) {
    return "Updating saved place";
  }

  if (!userId) {
    return "Sign in to save";
  }

  return isSaved ? "Saved" : "Save place";
}
