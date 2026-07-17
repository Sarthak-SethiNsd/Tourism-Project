"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookmarkX, LoaderCircle, MapPin } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";
import type { WishlistPlace } from "@/features/wishlist/types";
import { getWishlistPlaces, removeWishlistPlace } from "@/features/tourism/services/tourism-service";

export function WishlistExperience() {
  const { user, isReady } = useAuthUser();
  const [places, setPlaces] = useState<WishlistPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingPlaceId, setRemovingPlaceId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPlaces = useCallback(async () => {
    if (!isReady) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setPlaces(await getWishlistPlaces(user?.uid));
    } catch {
      setErrorMessage("Wishlist places could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }, [isReady, user?.uid]);

  useEffect(() => { void loadPlaces(); }, [loadPlaces]);
  useEffect(() => {
    const refresh = () => { void loadPlaces(); };
    window.addEventListener("india-tourism.wishlist-change", refresh);
    return () => window.removeEventListener("india-tourism.wishlist-change", refresh);
  }, [loadPlaces]);

  async function handleRemove(placeId: string) {
    const previousPlaces = places;
    setRemovingPlaceId(placeId);
    setPlaces((currentPlaces) => currentPlaces.filter((place) => place.placeId !== placeId));
    try {
      await removeWishlistPlace(user?.uid, placeId);
      window.dispatchEvent(new Event("india-tourism.wishlist-change"));
    } catch {
      setPlaces(previousPlaces);
      setErrorMessage("Could not remove that place. Please try again.");
    } finally {
      setRemovingPlaceId(null);
    }
  }

  return <AppShell><main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-24 sm:px-8 lg:px-12">
    <SectionHeader eyebrow="Bucket list" title="Wishlist" description={user ? "Places saved to your account for a future visit." : "Places saved on this device for a future visit."} />
    {errorMessage ? <ErrorState title="Wishlist error" description={errorMessage} /> : null}
    {!isReady || isLoading ? <LoadingState label="Loading wishlist" /> : !places.length ? <EmptyState title="Your wishlist is empty" description="Add places from Explore or a place details page to start planning your next trip." /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{places.map((place) => <WishlistCard key={place.id} place={place} isRemoving={removingPlaceId === place.placeId} onRemove={handleRemove} />)}</div>}
  </main></AppShell>;
}

function WishlistCard({ place, isRemoving, onRemove }: { place: WishlistPlace; isRemoving: boolean; onRemove: (placeId: string) => void }) {
  return <Card className="overflow-hidden border-primary/10 shadow-sm"><div className="relative aspect-[16/10] bg-muted">{place.thumbnailUrl ? <Image src={place.thumbnailUrl} alt={place.placeName} fill unoptimized={isRemoteImage(place.thumbnailUrl)} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : null}</div><CardContent className="grid gap-4 p-4"><div><h2 className="text-lg font-semibold tracking-tight">{place.placeName}</h2><div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden /><div><p>District: {place.district ?? "Not available"}</p><p>State: {place.state ?? "Not available"}</p></div></div><p className="mt-2 text-xs font-medium text-muted-foreground">Added {formatAddedDate(place.addedAt)}</p></div><div className="flex flex-wrap gap-2"><Button asChild variant="outline"><Link href={`/place/${place.placeId}`}>Open Details</Link></Button><Button type="button" variant="outline" disabled={isRemoving} onClick={() => onRemove(place.placeId)}>{isRemoving ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <BookmarkX className="size-4" aria-hidden />}Remove from Wishlist</Button></div></CardContent></Card>;
}

function formatAddedDate(date: Date) { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date); }
function isRemoteImage(src: string) { return src.startsWith("http://") || src.startsWith("https://"); }
