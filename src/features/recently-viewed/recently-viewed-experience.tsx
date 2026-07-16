"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, History, LoaderCircle, MapPin, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { hasFirebaseConfig } from "@/config/firebase";
import type { RecentlyViewedPlace } from "@/features/recently-viewed/types";
import {
  clearRecentlyViewedPlaces,
  deleteRecentlyViewedPlace,
  getRecentlyViewedPlaces,
} from "@/features/tourism/services/tourism-service";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";
import { AddToCollectionButton } from "@/features/collections/add-to-collection-button";

export function RecentlyViewedExperience() {
  const { user, isReady } = useAuthUser();
  const [places, setPlaces] = useState<RecentlyViewedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [removingPlaceId, setRemovingPlaceId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadPlaces() {
      if (hasFirebaseConfig && !isReady) {
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const entries = await getRecentlyViewedPlaces(user?.uid);

        if (isActive) {
          setPlaces(entries);
        }
      } catch {
        if (isActive) {
          setErrorMessage("Recently viewed places could not be loaded.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadPlaces();

    return () => {
      isActive = false;
    };
  }, [isReady, user?.uid]);

  async function handleRemove(placeId: string) {
    const previousPlaces = places;
    setRemovingPlaceId(placeId);
    setPlaces((currentPlaces) => currentPlaces.filter((place) => place.placeId !== placeId));
    setErrorMessage(null);

    try {
      await deleteRecentlyViewedPlace(user?.uid, placeId);
    } catch {
      setPlaces(previousPlaces);
      setErrorMessage("Could not remove that place. Please try again.");
    } finally {
      setRemovingPlaceId(null);
    }
  }

  async function handleClear() {
    const previousPlaces = places;
    setIsClearing(true);
    setPlaces([]);
    setErrorMessage(null);

    try {
      await clearRecentlyViewedPlaces(user?.uid);
    } catch {
      setPlaces(previousPlaces);
      setErrorMessage("Could not clear recently viewed places. Please try again.");
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-24 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="History"
            title="Recently viewed places"
            description="Your latest 20 opened destinations are kept here for quick return visits."
          />
          {places.length ? (
            <Button type="button" variant="outline" className="w-fit" disabled={isClearing} onClick={handleClear}>
              {isClearing ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
              Clear all
            </Button>
          ) : null}
        </div>

        {errorMessage ? <ErrorState title="Recently viewed error" description={errorMessage} /> : null}

        {isLoading ? (
          <LoadingState label="Loading recently viewed places" />
        ) : places.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {places.map((place) => (
              <RecentlyViewedCard
                key={place.placeId}
                place={place}
                isRemoving={isClearing || removingPlaceId === place.placeId}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No recently viewed places"
            description="Open any place details page and it will appear here for quick access."
          />
        )}
      </main>
    </AppShell>
  );
}

function RecentlyViewedCard({
  place,
  isRemoving,
  onRemove,
}: {
  place: RecentlyViewedPlace;
  isRemoving: boolean;
  onRemove: (placeId: string) => void;
}) {
  return (
    <Card className="overflow-hidden border-primary/10 shadow-sm">
      <Link href={`/place/${place.placeId}`} className="block">
        <div className="relative aspect-[16/10] bg-muted">
          {place.thumbnailUrl ? (
            <Image
              src={place.thumbnailUrl}
              alt={place.placeName}
              fill
              unoptimized={isRemoteImage(place.thumbnailUrl)}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <History className="size-8" aria-hidden />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="grid gap-4 p-4">
        <div className="grid gap-2">
          <h2 className="text-lg font-semibold tracking-tight">{place.placeName}</h2>
          <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
            {formatLocation(place)}
          </p>
          <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Clock3 className="size-3.5" aria-hidden />
            Viewed {formatViewedTime(place.viewedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild type="button">
            <Link href={`/place/${place.placeId}`}>Open Place Details</Link>
          </Button>
          <Button type="button" variant="outline" disabled={isRemoving} onClick={() => onRemove(place.placeId)}>
            {isRemoving ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
            Remove
          </Button>
          <AddToCollectionButton
            place={{
              placeId: place.placeId,
              googlePlaceId: place.googlePlaceId,
              placeName: place.placeName,
              thumbnailUrl: place.thumbnailUrl,
              thumbnailPhotoReference: place.thumbnailPhotoReference,
              district: place.district,
              state: place.state,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function formatLocation(place: RecentlyViewedPlace) {
  return [place.district, place.state].filter(Boolean).join(", ") || "Location not available";
}

function formatViewedTime(viewedAt: Date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(viewedAt);
}

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}
