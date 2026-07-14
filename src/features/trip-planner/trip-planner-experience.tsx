"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, LoaderCircle, MapPin, Plus, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { hasFirebaseConfig } from "@/config/firebase";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";
import type { Trip, TripInput, TripPlace } from "@/features/trip-planner/types";
import { createTrip, deleteTrip, getTrips, updateTripPlaces } from "@/features/tourism/services/tourism-service";

const initialForm: TripInput = { name: "", destinationCity: "", startDate: "", endDate: "", notes: "" };

export function TripPlannerExperience() {
  const { user, isReady } = useAuthUser();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [form, setForm] = useState<TripInput>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [busyTripId, setBusyTripId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadTrips = useCallback(async () => {
    if (hasFirebaseConfig && !isReady) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      setTrips(await getTrips(user?.uid));
    } catch {
      setErrorMessage("Trips could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }, [isReady, user?.uid]);

  useEffect(() => { void loadTrips(); }, [loadTrips]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreating(true);
    setErrorMessage(null);

    try {
      await createTrip(user?.uid, { ...form, notes: form.notes?.trim() || undefined });
      setForm(initialForm);
      await loadTrips();
    } catch {
      setErrorMessage("Could not create this trip. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  async function handlePlacesChange(trip: Trip, places: TripPlace[]) {
    const previousTrips = trips;
    setBusyTripId(trip.id);
    setTrips((currentTrips) => currentTrips.map((item) => item.id === trip.id ? { ...item, places } : item));

    try {
      await updateTripPlaces(user?.uid, trip.id, places);
    } catch {
      setTrips(previousTrips);
      setErrorMessage("Could not update the places in this trip.");
    } finally {
      setBusyTripId(null);
    }
  }

  async function handleDelete(tripId: string) {
    const previousTrips = trips;
    setBusyTripId(tripId);
    setTrips((currentTrips) => currentTrips.filter((trip) => trip.id !== tripId));

    try {
      await deleteTrip(user?.uid, tripId);
    } catch {
      setTrips(previousTrips);
      setErrorMessage("Could not delete this trip. Please try again.");
    } finally {
      setBusyTripId(null);
    }
  }

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-8 pt-24 sm:px-8 lg:px-12">
        <SectionHeader eyebrow="Trips" title="Manual trip planner" description="Create a trip, then add destinations from Explore, Saved Places, or place details." />
        <TripForm form={form} isCreating={isCreating} onChange={setForm} onSubmit={handleCreate} />
        {errorMessage ? <ErrorState title="Trip planner error" description={errorMessage} /> : null}
        {isLoading ? <LoadingState label="Loading trips" /> : trips.length ? (
          <div className="grid gap-5">{trips.map((trip) => <TripCard key={trip.id} trip={trip} isBusy={busyTripId === trip.id} onDelete={handleDelete} onPlacesChange={handlePlacesChange} />)}</div>
        ) : <EmptyState title="No trips yet" description="Create your first trip, then add places from across the app." />}
      </main>
    </AppShell>
  );
}

function TripForm({ form, isCreating, onChange, onSubmit }: { form: TripInput; isCreating: boolean; onChange: (form: TripInput) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <Card className="border-primary/10 shadow-sm"><CardContent className="p-5 sm:p-6"><form className="grid gap-4" onSubmit={onSubmit}>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Trip Name"><Input required value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} /></Field>
      <Field label="Destination City"><Input required value={form.destinationCity} onChange={(event) => onChange({ ...form, destinationCity: event.target.value })} /></Field>
      <Field label="Start Date"><Input required type="date" value={form.startDate} onChange={(event) => onChange({ ...form, startDate: event.target.value })} /></Field>
      <Field label="End Date"><Input required type="date" min={form.startDate || undefined} value={form.endDate} onChange={(event) => onChange({ ...form, endDate: event.target.value })} /></Field>
    </div>
    <Field label="Notes (optional)"><Textarea value={form.notes} onChange={(event) => onChange({ ...form, notes: event.target.value })} /></Field>
    <Button type="submit" className="w-fit" disabled={isCreating}>{isCreating ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Plus className="size-4" aria-hidden />} Create Trip</Button>
  </form></CardContent></Card>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-medium">{label}{children}</label>; }

function TripCard({ trip, isBusy, onDelete, onPlacesChange }: { trip: Trip; isBusy: boolean; onDelete: (id: string) => void; onPlacesChange: (trip: Trip, places: TripPlace[]) => void }) {
  return <Card className="border-primary/10 shadow-sm"><CardContent className="grid gap-5 p-5 sm:p-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><h2 className="text-xl font-semibold">{trip.name}</h2><p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" aria-hidden />{trip.destinationCity}</p><p className="mt-2 text-sm text-muted-foreground">{formatDateRange(trip.startDate, trip.endDate)}</p>{trip.notes ? <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{trip.notes}</p> : null}</div><Button type="button" variant="destructive" disabled={isBusy} onClick={() => onDelete(trip.id)}><Trash2 className="size-4" aria-hidden />Delete trip</Button></div>
    {trip.places.length ? <div className="grid gap-3">{trip.places.map((place, index) => <TripPlaceRow key={place.placeId} place={place} isBusy={isBusy} isFirst={index === 0} isLast={index === trip.places.length - 1} onRemove={() => onPlacesChange(trip, trip.places.filter((item) => item.placeId !== place.placeId))} onMove={(direction) => onPlacesChange(trip, movePlace(trip.places, index, direction))} />)}</div> : <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">No places added yet.</p>}
  </CardContent></Card>;
}

function TripPlaceRow({ place, isBusy, isFirst, isLast, onRemove, onMove }: { place: TripPlace; isBusy: boolean; isFirst: boolean; isLast: boolean; onRemove: () => void; onMove: (direction: -1 | 1) => void }) {
  return <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"><div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted sm:w-24">{place.thumbnailUrl ? <Image src={place.thumbnailUrl} alt={place.placeName} fill unoptimized={isRemoteImage(place.thumbnailUrl)} sizes="96px" className="object-cover" /> : null}</div><div className="min-w-0 flex-1"><p className="font-medium">{place.placeName}</p><p className="mt-1 text-sm text-muted-foreground">{[place.district, place.state].filter(Boolean).join(", ") || "Location not available"}</p></div><div className="flex flex-wrap gap-2"><Button type="button" size="icon" variant="outline" aria-label={`Move ${place.placeName} up`} disabled={isBusy || isFirst} onClick={() => onMove(-1)}><ArrowUp className="size-4" aria-hidden /></Button><Button type="button" size="icon" variant="outline" aria-label={`Move ${place.placeName} down`} disabled={isBusy || isLast} onClick={() => onMove(1)}><ArrowDown className="size-4" aria-hidden /></Button><Button type="button" variant="outline" disabled={isBusy} onClick={onRemove}><Trash2 className="size-4" aria-hidden />Remove</Button></div></div>;
}

function movePlace(places: TripPlace[], index: number, direction: -1 | 1) { const nextPlaces = [...places]; const targetIndex = index + direction; [nextPlaces[index], nextPlaces[targetIndex]] = [nextPlaces[targetIndex], nextPlaces[index]]; return nextPlaces; }
function formatDateRange(startDate: string, endDate: string) { return `${formatDate(startDate)} – ${formatDate(endDate)}`; }
function formatDate(value: string) { return value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`)) : "Date not set"; }
function isRemoteImage(src: string) { return src.startsWith("http://") || src.startsWith("https://"); }
