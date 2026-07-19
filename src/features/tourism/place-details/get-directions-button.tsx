"use client";

import { useState } from "react";
import { LoaderCircle, MapPinned, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { geocodeAddress, getTourismTravelInfo } from "@/features/tourism/services/tourism-service";
import type { TourismGeoPoint, TravelInfo, TravelMode } from "@/features/tourism/providers/tourism-provider";

type GetDirectionsButtonProps = { destination?: TourismGeoPoint; placeName: string };
type RouteOrigin = TourismGeoPoint | string;

const travelModes: { label: string; value: Extract<TravelMode, "driving" | "walking" | "bicycling"> }[] = [
  { label: "Driving", value: "driving" },
  { label: "Walking", value: "walking" },
  { label: "Cycling", value: "bicycling" },
];

export function GetDirectionsButton({ destination, placeName }: GetDirectionsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<TravelMode>("driving");
  const [manualLocation, setManualLocation] = useState("");
  const [origin, setOrigin] = useState<RouteOrigin | null>(null);
  const [route, setRoute] = useState<TravelInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Use your current location or enter a starting point to estimate your route.");

  async function calculateRoute(nextOrigin: RouteOrigin) {
    if (!destination) {
      setMessage("Route estimates are unavailable because this place does not have location coordinates.");
      return;
    }
    setOrigin(nextOrigin);
    setIsLoading(true);
    setRoute(null);
    setMessage("");
    try {
      const result = await getTourismTravelInfo(nextOrigin, destination, mode);
      if (result.status !== "ok" || result.distanceMeters === null || result.durationSeconds === null) {
        setMessage("A route estimate is not available for this journey right now. You can still open it in Google Maps.");
        return;
      }
      setRoute(result);
    } catch {
      setMessage("We could not calculate this route. Please try a different starting location.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setMessage("Your browser does not support location sharing. Enter your starting location below.");
      return;
    }
    setIsLoading(true);
    setMessage("Finding your current location…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { void calculateRoute({ latitude: coords.latitude, longitude: coords.longitude }); },
      () => { setIsLoading(false); setMessage("Your location is unavailable. Enter your starting location below."); },
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 },
    );
  }

  async function handleManualLocation() {
    const address = manualLocation.trim();
    if (!address) { setMessage("Enter a city, address, or landmark to get directions."); return; }
    setIsLoading(true);
    setMessage("Finding your starting location…");
    try {
      const point = await geocodeAddress(address);
      if (!point) { setMessage("We could not find that starting location. Try a more specific address."); return; }
      await calculateRoute(point);
    } catch {
      setMessage("We could not find that starting location. Try again or use your current location.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleModeChange(value: TravelMode) {
    setMode(value);
    if (origin) await calculateRoute(origin);
  }

  const mapsUrl = destination
    ? createGoogleMapsDirectionsUrl(origin ?? placeName, destination, mode)
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;
  return <Dialog open={isOpen} onOpenChange={setIsOpen}><DialogTrigger asChild><Button type="button" variant="outline"><Navigation className="size-4" aria-hidden />Get Directions</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Directions to {placeName}</DialogTitle><DialogDescription>Choose how you want to travel and where you are starting from.</DialogDescription></DialogHeader><div className="grid gap-4">{destination ? <><Select value={mode} onValueChange={(value) => void handleModeChange(value as TravelMode)}><SelectTrigger className="w-full"><SelectValue placeholder="Travel mode" /></SelectTrigger><SelectContent>{travelModes.map((travelMode) => <SelectItem key={travelMode.value} value={travelMode.value}>{travelMode.label}</SelectItem>)}</SelectContent></Select><Button type="button" variant="secondary" disabled={isLoading} onClick={handleUseCurrentLocation}>{isLoading ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <MapPinned className="size-4" aria-hidden />}Use my current location</Button><div className="grid gap-2"><label htmlFor="manual-origin" className="text-sm font-medium">Starting location</label><div className="flex gap-2"><Input id="manual-origin" value={manualLocation} onChange={(event) => setManualLocation(event.target.value)} placeholder="City, address, or landmark" /><Button type="button" disabled={isLoading} onClick={() => void handleManualLocation()}>Go</Button></div></div>{route ? <div className="rounded-lg bg-muted p-4 text-sm"><p className="font-semibold">Estimated route</p><p className="mt-2 text-muted-foreground">{route.distanceText} · {route.durationText}</p></div> : <p className="text-sm text-muted-foreground">{message}</p>}</> : <p className="text-sm text-muted-foreground">Route estimates are unavailable because this place does not have location coordinates.</p>}<Button asChild variant="outline"><a href={mapsUrl} target="_blank" rel="noreferrer">Open route in Google Maps</a></Button></div></DialogContent></Dialog>;
}

function createGoogleMapsDirectionsUrl(origin: RouteOrigin, destination: TourismGeoPoint, mode: TravelMode) {
  const originValue = typeof origin === "string" ? origin : `${origin.latitude},${origin.longitude}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originValue)}&destination=${encodeURIComponent(`${destination.latitude},${destination.longitude}`)}&travelmode=${mode}`;
}
