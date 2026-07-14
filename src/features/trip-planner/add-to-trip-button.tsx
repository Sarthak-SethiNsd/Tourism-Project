"use client";

import { useState } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { hasFirebaseConfig } from "@/config/firebase";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";
import type { Trip, TripPlaceInput } from "@/features/trip-planner/types";
import { addPlaceToTrip, getTrips } from "@/features/tourism/services/tourism-service";
import { cn } from "@/lib/utils";

type AddToTripButtonProps = {
  place: TripPlaceInput;
  className?: string;
};

export function AddToTripButton({ place, className }: AddToTripButtonProps) {
  const { user, isReady } = useAuthUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function handleOpenChange(nextIsOpen: boolean) {
    setIsOpen(nextIsOpen);
    setMessage(null);

    if (!nextIsOpen || (hasFirebaseConfig && !isReady)) {
      return;
    }

    setIsLoading(true);

    try {
      setTrips(await getTrips(user?.uid));
    } catch {
      setMessage("Trips could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAdd(tripId: string) {
    setIsAdding(true);
    setMessage(null);

    try {
      await addPlaceToTrip(user?.uid, tripId, place);
      setIsOpen(false);
    } catch {
      setMessage("Could not add this place to the trip. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Button type="button" variant="outline" className={cn(className)} disabled={hasFirebaseConfig && !isReady} onClick={() => void handleOpenChange(true)}>
        <Plus className="size-4" aria-hidden />
        Add to Trip
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to a trip</DialogTitle>
          <DialogDescription>Select the trip for {place.placeName}.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" aria-hidden /> Loading trips</div>
        ) : trips.length ? (
          <div className="grid gap-2">
            {trips.map((trip) => (
              <Button key={trip.id} type="button" variant="outline" className="h-auto justify-start px-3 py-3 text-left" disabled={isAdding} onClick={() => void handleAdd(trip.id)}>
                <span className="grid gap-1">
                  <span>{trip.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{trip.destinationCity}</span>
                </span>
              </Button>
            ))}
          </div>
        ) : (
          <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">Create a trip from the Trip Planner page before adding places.</p>
        )}
        {message ? <p className="text-sm text-destructive" role="status">{message}</p> : null}
      </DialogContent>
    </Dialog>
  );
}
