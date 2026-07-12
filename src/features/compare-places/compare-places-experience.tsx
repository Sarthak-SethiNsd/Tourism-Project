"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { clearComparePlaces, removeComparePlace } from "@/features/compare-places/compare-storage";
import { useComparePlaceIds } from "@/features/compare-places/use-compare-places";
import { getPlaceDetailsBatch, getTourismPlaceById } from "@/features/tourism/services/tourism-service";
import type { TourismCategory, TourismPlace } from "@/features/tourism/types";

type ComparePlacesExperienceProps = {
  categories: TourismCategory[];
};

const priceLabelByLevel: Record<TourismPlace["priceLevel"], string> = {
  free: "Free",
  budget: "Budget",
  moderate: "Moderate",
  premium: "Premium",
};

export function ComparePlacesExperience({ categories }: ComparePlacesExperienceProps) {
  const placeIds = useComparePlaceIds();
  const [places, setPlaces] = useState<TourismPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadPlaces() {
      if (!placeIds.length) {
        setPlaces([]);
        return;
      }

      setIsLoading(true);
      const results = await getPlaceDetailsBatch(placeIds);
      const placesWithFallbacks = await Promise.all(
        results.map((place, index) => place ?? getTourismPlaceById(placeIds[index])),
      );

      if (isActive) {
        setPlaces(placesWithFallbacks.filter((place): place is TourismPlace => Boolean(place)));
        setIsLoading(false);
      }
    }

    void loadPlaces();
    return () => {
      isActive = false;
    };
  }, [placeIds]);

  const placesById = useMemo(() => new Map(places.map((place) => [place.id, place])), [places]);
  const orderedPlaces = placeIds.map((placeId) => placesById.get(placeId)).filter((place): place is TourismPlace => Boolean(place));

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-24 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Compare"
            title="Compare places"
            description="Keep up to three destinations side by side while planning your trip."
          />
          {placeIds.length ? (
            <Button type="button" variant="outline" className="w-fit" onClick={clearComparePlaces}>
              <Trash2 className="size-4" aria-hidden />
              Clear comparison
            </Button>
          ) : null}
        </div>

        {placeIds.length ? <SelectedPlaces placeIds={placeIds} placesById={placesById} /> : null}

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center gap-3 rounded-lg border bg-card text-sm text-muted-foreground">
            <LoaderCircle className="size-5 animate-spin" aria-hidden />
            Loading comparison details
          </div>
        ) : orderedPlaces.length < 2 ? (
          <EmptyState
            title="Choose at least two places"
            description="Add destinations from Explore, Search History, Saved Places, or a place details page to compare them here."
            className="bg-card"
          />
        ) : (
          <ComparisonTable places={orderedPlaces} categories={categories} />
        )}
      </main>
    </AppShell>
  );
}

function SelectedPlaces({ placeIds, placesById }: { placeIds: string[]; placesById: Map<string, TourismPlace> }) {
  return (
    <div className="flex flex-wrap gap-2">
      {placeIds.map((placeId) => {
        const place = placesById.get(placeId);

        return (
          <Button key={placeId} type="button" variant="secondary" onClick={() => removeComparePlace(placeId)}>
            {place?.name ?? "Selected place"}
            <Trash2 className="size-3.5" aria-hidden />
          </Button>
        );
      })}
    </div>
  );
}

function ComparisonTable({ places, categories }: { places: TourismPlace[]; categories: TourismCategory[] }) {
  const rows = [
    { label: "Main photo", value: (place: TourismPlace) => <PlaceImage place={place} /> },
    { label: "Rating", value: (place: TourismPlace) => (place.rating ? place.rating.toFixed(1) : "Unrated") },
    { label: "Total reviews", value: (place: TourismPlace) => formatReviewCount(place.reviewsCount) },
    { label: "Address", value: (place: TourismPlace) => formatAddress(place) },
    { label: "District", value: (place: TourismPlace) => place.districtName ?? place.address?.district ?? "Not available" },
    { label: "State", value: (place: TourismPlace) => place.address?.region ?? "Not available" },
    { label: "Country", value: (place: TourismPlace) => place.address?.country ?? "Not available" },
    { label: "Primary category", value: (place: TourismPlace) => formatPrimaryCategory(place, categories) },
    { label: "Opening status", value: (place: TourismPlace) => formatOpeningStatus(place) },
    { label: "Price level", value: (place: TourismPlace) => priceLabelByLevel[place.priceLevel] ?? "Not available" },
    { label: "Phone number", value: (place: TourismPlace) => place.contactInfo?.phone ?? "Not available" },
    { label: "Website", value: (place: TourismPlace) => <WebsiteLink href={place.websiteUrl} /> },
  ];

  return (
    <Card className="overflow-hidden border-primary/10 shadow-sm">
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-muted/70">
            <tr>
              <th scope="col" className="w-44 px-4 py-4 font-semibold">Place name</th>
              {places.map((place) => (
                <th key={place.id} scope="col" className="min-w-56 px-4 py-4 font-semibold">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/place/${place.id}`} className="hover:underline">{place.name}</Link>
                    <Button type="button" size="icon" variant="ghost" aria-label={`Remove ${place.name} from comparison`} onClick={() => removeComparePlace(place.id)}>
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t align-top">
                <th scope="row" className="bg-muted/30 px-4 py-4 font-medium">{row.label}</th>
                {places.map((place) => <td key={place.id} className="px-4 py-4 text-muted-foreground">{row.value(place)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function PlaceImage({ place }: { place: TourismPlace }) {
  const imageUrl = place.images?.[0]?.url ?? place.imageUrl;

  return imageUrl ? (
    <div className="relative aspect-[4/3] w-40 overflow-hidden rounded-md bg-muted">
      <Image src={imageUrl} alt={place.name} fill sizes="160px" unoptimized={isRemoteImage(imageUrl)} className="object-cover" />
    </div>
  ) : "Not available";
}

function WebsiteLink({ href }: { href?: string }) {
  return href ? <Link href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">Visit website <ExternalLink className="size-3.5" aria-hidden /></Link> : "Not available";
}

function formatReviewCount(reviewsCount?: number) {
  return typeof reviewsCount === "number" ? new Intl.NumberFormat("en-IN").format(reviewsCount) : "Not available";
}

function formatAddress(place: TourismPlace) {
  return place.address?.formattedAddress ?? ([place.address?.streetAddress, place.address?.locality].filter(Boolean).join(", ") || "Not available");
}

function formatPrimaryCategory(place: TourismPlace, categories: TourismCategory[]) {
  const category = categories.find((item) => item.id === place.categoryIds[0]);
  return category?.name ?? place.categoryIds[0]?.replaceAll("_", " ") ?? "Not available";
}

function formatOpeningStatus(place: TourismPlace) {
  if (typeof place.openingHours?.openNow !== "boolean") {
    return "Not available";
  }

  return place.openingHours.openNow ? "Open now" : "Closed now";
}

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}
