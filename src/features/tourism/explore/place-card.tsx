import Image from "next/image";
import Link from "next/link";
import { Clock3, IndianRupee, MapPin, Star } from "lucide-react";
import type { IndianDistrict, IndianRegion, TourismCategory, TourismPlace } from "@/features/tourism/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ComparePlaceButton } from "@/features/compare-places/compare-place-button";
import { AddToTripButton } from "@/features/trip-planner/add-to-trip-button";
import { createTripPlaceInput } from "@/features/trip-planner/trip-place";
import { AddToCollectionButton } from "@/features/collections/add-to-collection-button";
import { createCollectionPlaceInput } from "@/features/collections/collection-place";

type PlaceCardProps = {
  place: TourismPlace;
  categories: TourismCategory[];
  region?: IndianRegion;
  district?: IndianDistrict;
  onOpen?: () => void;
};

const priceLabelByLevel: Record<TourismPlace["priceLevel"], string> = {
  free: "Free",
  budget: "Budget",
  moderate: "Moderate",
  premium: "Premium",
};

export function PlaceCard({ place, categories, region, district, onOpen }: PlaceCardProps) {
  return (
    <Card className="group h-full overflow-hidden border-primary/10 bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/place/${place.id}`} className="block" onClick={onOpen}>
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {place.imageUrl ? (
            <Image
              src={place.imageUrl}
              alt={place.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
            <div className="flex items-center gap-1 text-sm font-semibold">
              <Star className="size-4 fill-current" aria-hidden />
              {place.rating.toFixed(1)}
            </div>
          </div>
        </div>
      </Link>
      <CardContent className="flex flex-col gap-4 p-4">
        <Link href={`/place/${place.id}`} onClick={onOpen} className="block">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              {categories.slice(0, 2).map((category) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{place.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{place.summary}</p>
            <div className="mt-4 grid gap-2 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5" aria-hidden />
              {district?.name ? `${district.name}, ` : ""}
              {region?.name ?? "India"}
            </span>
            <span className="flex items-center gap-2">
              <Clock3 className="size-3.5" aria-hidden />
              {place.idealDuration}
            </span>
            <span className="flex items-center gap-2">
              <IndianRupee className="size-3.5" aria-hidden />
              {priceLabelByLevel[place.priceLevel]}
            </span>
            </div>
          </div>
        </Link>
        <ComparePlaceButton placeId={place.id} />
        <AddToTripButton place={createTripPlaceInput(place, district, region)} />
        <AddToCollectionButton place={createCollectionPlaceInput(place, district, region)} />
      </CardContent>
    </Card>
  );
}
