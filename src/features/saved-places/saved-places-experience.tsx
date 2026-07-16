"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartOff, LoaderCircle, MapPin } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { hasFirebaseConfig } from "@/config/firebase";
import { signInWithGoogle } from "@/features/authentication/services/authentication-service";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";
import type { SavedPlace } from "@/features/saved-places/types";
import { getSavedPlaces, unsavePlace } from "@/features/tourism/services/tourism-service";
import { ComparePlaceButton } from "@/features/compare-places/compare-place-button";
import { AddToTripButton } from "@/features/trip-planner/add-to-trip-button";
import { AddToCollectionButton } from "@/features/collections/add-to-collection-button";

export function SavedPlacesExperience() {
  const { user, isReady } = useAuthUser();
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingPlaceId, setRemovingPlaceId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadSavedPlaces() {
      setErrorMessage(null);

      if (!hasFirebaseConfig || !isReady || !user) {
        setSavedPlaces([]);
        setIsLoading(!isReady);
        return;
      }

      setIsLoading(true);

      try {
        const places = await getSavedPlaces(user.uid);

        if (isActive) {
          setSavedPlaces(places);
        }
      } catch {
        if (isActive) {
          setErrorMessage("Saved places could not be loaded.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadSavedPlaces();

    return () => {
      isActive = false;
    };
  }, [isReady, user]);

  async function handleSignIn() {
    if (!hasFirebaseConfig) {
      setErrorMessage("Firebase is not configured for saved places.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      await signInWithGoogle();
    } catch {
      setErrorMessage("Sign in was not completed.");
      setIsLoading(false);
    }
  }

  async function handleRemove(placeId: string) {
    if (!user) {
      return;
    }

    const previousSavedPlaces = savedPlaces;

    setRemovingPlaceId(placeId);
    setSavedPlaces((currentPlaces) => currentPlaces.filter((place) => place.placeId !== placeId));
    setErrorMessage(null);

    try {
      await unsavePlace(user.uid, placeId);
    } catch {
      setSavedPlaces(previousSavedPlaces);
      setErrorMessage("Could not remove that saved place. Please try again.");
    } finally {
      setRemovingPlaceId(null);
    }
  }

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-24 sm:px-8 lg:px-12">
        <SectionHeader
          eyebrow="Favorites"
          title="Saved places"
          description="Places you have saved from details pages are stored privately in your Firebase account."
        />

        {errorMessage ? <ErrorState title="Saved places error" description={errorMessage} /> : null}

        {renderContent({
          isLoading,
          isReady,
          onRemove: handleRemove,
          onSignIn: handleSignIn,
          removingPlaceId,
          savedPlaces,
          userId: user?.uid,
        })}
      </main>
    </AppShell>
  );
}

function renderContent({
  isLoading,
  isReady,
  onRemove,
  onSignIn,
  removingPlaceId,
  savedPlaces,
  userId,
}: {
  isLoading: boolean;
  isReady: boolean;
  onRemove: (placeId: string) => void;
  onSignIn: () => void;
  removingPlaceId: string | null;
  savedPlaces: SavedPlace[];
  userId?: string;
}) {
  if (!isReady || isLoading) {
    return <LoadingState label="Loading saved places" />;
  }

  if (!userId) {
    return (
      <div className="grid gap-4">
        <EmptyState title="Sign in to see saved places" description="Your saved places are connected to your account." />
        <Button type="button" className="w-fit" onClick={onSignIn}>
          Sign in with Google
        </Button>
      </div>
    );
  }

  if (!savedPlaces.length) {
    return <EmptyState title="No saved places yet" description="Open a place details page and save it to build your favorites." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {savedPlaces.map((place) => (
        <SavedPlaceCard
          key={place.id}
          place={place}
          isRemoving={removingPlaceId === place.placeId}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

function SavedPlaceCard({
  isRemoving,
  onRemove,
  place,
}: {
  isRemoving: boolean;
  onRemove: (placeId: string) => void;
  place: SavedPlace;
}) {
  return (
    <Card className="overflow-hidden border-primary/10 shadow-sm">
      <Link href={`/place/${place.placeId}`} className="block">
        <div className="relative aspect-[16/10] bg-muted">
          {place.photoUrl ? (
            <Image
              src={place.photoUrl}
              alt={place.name}
              fill
              unoptimized={isRemoteImage(place.photoUrl)}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          ) : null}
        </div>
      </Link>
      <CardContent className="grid gap-4 p-4">
        <div>
          <Link href={`/place/${place.placeId}`} className="text-lg font-semibold tracking-tight hover:underline">
            {place.name}
          </Link>
          {place.location?.address ? (
            <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              {place.location.address}
            </p>
          ) : null}
          <p className="mt-2 text-xs font-medium text-muted-foreground">Saved {formatSavedDate(place.savedAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            disabled={isRemoving}
            onClick={() => onRemove(place.placeId)}
          >
            {isRemoving ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <HeartOff className="size-4" aria-hidden />}
            Remove
          </Button>
          <ComparePlaceButton placeId={place.placeId} className="w-fit" />
          <AddToTripButton
            className="w-fit"
            place={{
              placeId: place.placeId,
              googlePlaceId: place.googlePlaceId,
              placeName: place.name,
              thumbnailUrl: place.photoUrl,
              thumbnailPhotoReference: place.photoReference,
              district: place.location?.districtName,
              state: place.location?.regionName,
            }}
          />
          <AddToCollectionButton
            className="w-fit"
            place={{
              placeId: place.placeId,
              googlePlaceId: place.googlePlaceId,
              placeName: place.name,
              thumbnailUrl: place.photoUrl,
              thumbnailPhotoReference: place.photoReference,
              district: place.location?.districtName,
              state: place.location?.regionName,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function formatSavedDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}
