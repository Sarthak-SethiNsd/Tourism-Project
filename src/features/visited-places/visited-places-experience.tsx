"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleX, LoaderCircle, MapPin } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";
import { getVisitedPlaces, removeVisitedPlace } from "@/features/tourism/services/tourism-service";
import type { VisitedPlace } from "@/features/visited-places/types";

export function VisitedPlacesExperience() {
  const { user, isReady } = useAuthUser();
  const [places, setPlaces] = useState<VisitedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingPlaceId, setRemovingPlaceId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loadPlaces = useCallback(async () => {
    if (!isReady) return;
    setIsLoading(true); setErrorMessage(null);
    try { setPlaces(await getVisitedPlaces(user?.uid)); } catch { setErrorMessage("Visited places could not be loaded."); } finally { setIsLoading(false); }
  }, [isReady, user?.uid]);
  useEffect(() => { void loadPlaces(); }, [loadPlaces]);
  useEffect(() => { const refresh = () => { void loadPlaces(); }; window.addEventListener("india-tourism.visited-change", refresh); return () => window.removeEventListener("india-tourism.visited-change", refresh); }, [loadPlaces]);
  async function handleRemove(placeId: string) {
    const previousPlaces = places;
    setRemovingPlaceId(placeId); setPlaces((currentPlaces) => currentPlaces.filter((place) => place.placeId !== placeId));
    try { await removeVisitedPlace(user?.uid, placeId); window.dispatchEvent(new Event("india-tourism.visited-change")); } catch { setPlaces(previousPlaces); setErrorMessage("Could not remove that place. Please try again."); } finally { setRemovingPlaceId(null); }
  }
  return <AppShell><main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-24 sm:px-8 lg:px-12"><SectionHeader eyebrow="Travel history" title="Visited Places" description={user ? "Places you have marked as visited in your account." : "Places you have marked as visited on this device."} />{errorMessage ? <ErrorState title="Visited places error" description={errorMessage} /> : null}{!isReady || isLoading ? <LoadingState label="Loading visited places" /> : !places.length ? <EmptyState title="No places marked as visited" description="Mark a place from Explore or its details page to keep track of where you have been." /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{places.map((place) => <VisitedPlaceCard key={place.id} place={place} isRemoving={removingPlaceId === place.placeId} onRemove={handleRemove} />)}</div>}</main></AppShell>;
}

function VisitedPlaceCard({ place, isRemoving, onRemove }: { place: VisitedPlace; isRemoving: boolean; onRemove: (placeId: string) => void }) {
  return <Card className="overflow-hidden border-primary/10 shadow-sm"><div className="relative aspect-[16/10] bg-muted">{place.thumbnailUrl ? <Image src={place.thumbnailUrl} alt={place.placeName} fill unoptimized={isRemoteImage(place.thumbnailUrl)} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : null}</div><CardContent className="grid gap-4 p-4"><div><h2 className="text-lg font-semibold tracking-tight">{place.placeName}</h2><div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden /><div><p>District: {place.district ?? "Not available"}</p><p>State: {place.state ?? "Not available"}</p></div></div><p className="mt-2 text-xs font-medium text-muted-foreground">Visited {formatVisitedDate(place.visitedAt)}</p></div><div className="flex flex-wrap gap-2"><Button asChild variant="outline"><Link href={`/place/${place.placeId}`}>Open Details</Link></Button><Button type="button" variant="outline" disabled={isRemoving} onClick={() => onRemove(place.placeId)}>{isRemoving ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <CircleX className="size-4" aria-hidden />}Remove from Visited</Button></div></CardContent></Card>;
}
function formatVisitedDate(date: Date) { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date); }
function isRemoteImage(src: string) { return src.startsWith("http://") || src.startsWith("https://"); }
