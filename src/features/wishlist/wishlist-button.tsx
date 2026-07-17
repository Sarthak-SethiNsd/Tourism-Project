"use client";

import { useEffect, useState } from "react";
import { Bookmark, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";
import { addWishlistPlace, isPlaceInWishlist, removeWishlistPlace } from "@/features/tourism/services/tourism-service";
import type { TourismPlace } from "@/features/tourism/types";
import { cn } from "@/lib/utils";

type WishlistButtonProps = { place: TourismPlace; className?: string };

export function WishlistButton({ place, className }: WishlistButtonProps) {
  const { user, isReady } = useAuthUser();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    async function loadWishlistState() {
      if (!isReady) return;
      setErrorMessage(null);
      setIsChecking(true);
      try {
        const nextValue = await isPlaceInWishlist(user?.uid, place.id);
        if (isActive) setIsWishlisted(nextValue);
      } catch {
        if (isActive) setErrorMessage("Wishlist status could not be loaded.");
      } finally {
        if (isActive) setIsChecking(false);
      }
    }
    void loadWishlistState();
    return () => { isActive = false; };
  }, [isReady, place.id, user?.uid]);

  async function handleToggle() {
    const previousValue = isWishlisted;
    setErrorMessage(null);
    setIsMutating(true);
    setIsWishlisted(!previousValue);
    try {
      if (previousValue) await removeWishlistPlace(user?.uid, place.id);
      else await addWishlistPlace(user?.uid, place);
      window.dispatchEvent(new Event("india-tourism.wishlist-change"));
    } catch {
      setIsWishlisted(previousValue);
      setErrorMessage("Could not update your wishlist. Please try again.");
    } finally {
      setIsMutating(false);
    }
  }

  const isBusy = !isReady || isChecking || isMutating;
  return (
    <div className={cn("grid gap-2", className)}>
      <Button type="button" variant={isWishlisted ? "secondary" : "outline"} onClick={handleToggle} disabled={isBusy}>
        {isBusy ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Bookmark className={cn("size-4", isWishlisted && "fill-current")} aria-hidden />}
        {isBusy ? "Updating wishlist" : isWishlisted ? "In Wishlist" : "Add to Wishlist"}
      </Button>
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </div>
  );
}
