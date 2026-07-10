import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ExternalLink,
  Globe2,
  IndianRupee,
  Map,
  MapPin,
  Navigation,
  Phone,
  Star,
  Tags,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getNearbyTourismPlaces,
  getTourismTravelInfo,
  listExternalTourismPlacePhotos,
} from "@/features/tourism/services/tourism-service";
import { PlaceReviews } from "@/features/tourism/place-details/place-reviews";
import { SavePlaceButton } from "@/features/tourism/place-details/save-place-button";
import type { IndianDistrict, IndianRegion, NearbyPlace, TourismCategory, TourismPlace } from "@/features/tourism/types";

type PlaceDetailsPageProps = {
  place: TourismPlace;
  categories: TourismCategory[];
  region: IndianRegion | null;
  district?: IndianDistrict;
};

type GalleryPhoto = {
  url: string;
  attribution?: string;
};

const priceLabelByLevel: Record<TourismPlace["priceLevel"], string> = {
  free: "Free",
  budget: "Budget",
  moderate: "Moderate",
  premium: "Premium",
};

const DEFAULT_NEARBY_RADIUS_METERS = 5000;

export async function PlaceDetailsPage({ place, categories, region, district }: PlaceDetailsPageProps) {
  const latitude = place.coordinates?.latitude;
  const longitude = place.coordinates?.longitude;
  const hasCoordinates = typeof latitude === "number" && typeof longitude === "number";
  const googleMapsUrl = createGoogleMapsUrl(place, latitude, longitude);
  const address = formatAddress(place, district, region);
  const photos = await listExternalTourismPlacePhotos(place.googlePlaceId ?? place.id);
  const galleryImages = photos.length ? photos : createFallbackPhotos(place);
  const nearbyAttractions = hasCoordinates
    ? await getNearbyTourismPlaces(latitude, longitude, DEFAULT_NEARBY_RADIUS_METERS, "tourist attractions")
    : [];
  const travelInfo =
    hasCoordinates && nearbyAttractions[0]
      ? await getTourismTravelInfo({ latitude, longitude }, nearbyAttractions[0].coordinates, "driving")
      : undefined;

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-8 pt-24 sm:px-8 lg:px-12">
        <Button asChild variant="ghost" className="w-fit rounded-lg">
          <Link href="/explore">
            <ArrowLeft className="size-4" aria-hidden />
            Back to Explore
          </Link>
        </Button>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div className="relative min-h-[380px] overflow-hidden rounded-lg bg-muted shadow-sm">
            {place.imageUrl ? (
              <Image
                src={place.imageUrl}
                alt={place.name}
                fill
                priority
                unoptimized={isRemoteImage(place.imageUrl)}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            ) : null}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-white sm:p-7">
              <div className="mb-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge key={category.id} variant="secondary" className="bg-white/90 text-foreground">
                    {category.name}
                  </Badge>
                ))}
              </div>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">{place.name}</h1>
              {place.summary ? (
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/86 sm:text-base">{place.summary}</p>
              ) : null}
            </div>
          </div>

          <Card className="border-primary/10 shadow-sm">
            <CardContent className="flex h-full flex-col gap-5 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rating</p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
                    <Star className="size-5 fill-primary text-primary" aria-hidden />
                    {place.rating ? place.rating.toFixed(1) : "Unrated"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatReviewCount(place.reviewsCount)}</p>
                </div>
                <Badge className="bg-accent text-accent-foreground hover:bg-accent">
                  {priceLabelByLevel[place.priceLevel]}
                </Badge>
              </div>

              <SavePlaceButton place={place} />

              <div className="grid gap-3 text-sm text-muted-foreground">
                <InfoLine icon={MapPin} value={address} />
                <InfoLine icon={Phone} value={place.contactInfo?.phone} fallback="Phone not available" />
                <InfoLink
                  icon={Globe2}
                  href={place.websiteUrl}
                  label={place.websiteUrl ? "Website" : "Website not available"}
                />
                <InfoLink icon={Map} href={googleMapsUrl} label="Open in Google Maps" />
                <InfoLine
                  icon={Navigation}
                  value={hasCoordinates ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` : "Coordinates not available"}
                />
                <InfoLine icon={Tags} value={formatTypes(place.tags, categories)} />
              </div>

              {place.description ? (
                <div className="mt-auto rounded-lg bg-muted p-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Short description</p>
                  <p className="mt-2 text-sm leading-6">{place.description}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card className="border-primary/10 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <SectionHeader eyebrow="Hours" title="Opening hours" />
              {place.openingHours?.weekdayText?.length ? (
                <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
                  {place.openingHours.weekdayText.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Opening hours unavailable"
                  description="This place has not published hours through the current provider."
                  className="mt-5 min-h-48"
                />
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <SectionHeader eyebrow="Travel" title="Basic travel information" />
              <div className="mt-5 grid gap-3 text-sm text-muted-foreground">
                <InfoLine
                  icon={CalendarDays}
                  value={place.bestTimeToVisit || place.bestSeason}
                  fallback="Best time not available"
                />
                <InfoLine
                  icon={Clock3}
                  value={place.idealDuration || place.timeRequired}
                  fallback="Duration not available"
                />
                <InfoLine
                  icon={IndianRupee}
                  value={place.budget?.displayText ?? place.approximateBudget ?? priceLabelByLevel[place.priceLevel]}
                />
                {travelInfo ? (
                  <InfoLine
                    icon={Navigation}
                    value={`Nearest attraction: ${travelInfo.distanceText}, ${travelInfo.durationText}`}
                  />
                ) : null}
              </div>
            </CardContent>
          </Card>
        </section>

        <PhotosGallery placeName={place.name} photos={galleryImages} />
        <PlaceReviews reviews={place.reviews} />
        <NearbyAttractions attractions={nearbyAttractions.filter((attraction) => attraction.id !== place.id).slice(0, 6)} />
      </main>
    </AppShell>
  );
}

function PhotosGallery({ placeName, photos }: { placeName: string; photos: GalleryPhoto[] }) {
  return (
    <section className="space-y-4">
      <SectionHeader eyebrow="Photos" title="Gallery" />
      {photos.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.slice(0, 6).map((photo, index) => (
            <figure key={`${photo.url}-${index}`} className="overflow-hidden rounded-lg border bg-card shadow-sm">
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={photo.url}
                  alt={`${placeName} photo ${index + 1}`}
                  fill
                  unoptimized={isRemoteImage(photo.url)}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              {photo.attribution ? (
                <figcaption className="px-3 py-2 text-xs text-muted-foreground">{photo.attribution}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : (
        <EmptyState title="No photos yet" description="The current provider did not return gallery photos for this place." />
      )}
    </section>
  );
}

function NearbyAttractions({ attractions }: { attractions: NearbyPlace[] }) {
  return (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Nearby"
        title="Nearby attractions"
        description="Attractions discovered with the existing nearby search service."
      />
      {attractions.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {attractions.map((attraction) => (
            <Card key={attraction.id} className="border-primary/10 shadow-sm">
              <CardContent className="flex h-full flex-col gap-3 p-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{attraction.name}</h3>
                  {attraction.formattedAddress ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{attraction.formattedAddress}</p>
                  ) : null}
                </div>
                <div className="mt-auto grid gap-2 text-sm text-muted-foreground">
                  <InfoLine
                    icon={Star}
                    value={attraction.rating ? `${attraction.rating.toFixed(1)} (${attraction.reviewsCount ?? 0} reviews)` : "Unrated"}
                  />
                  <InfoLine icon={MapPin} value={attraction.distanceText} fallback="Distance not available" />
                  <InfoLink icon={Map} href={createNearbyGoogleMapsUrl(attraction)} label="Open in Google Maps" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No nearby attractions found" description="There were no attraction results close to this place." />
      )}
    </section>
  );
}

function InfoLine({
  icon: Icon,
  value,
  fallback = "Not available",
}: {
  icon: LucideIcon;
  value?: string | null;
  fallback?: string;
}) {
  return (
    <span className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <span>{value || fallback}</span>
    </span>
  );
}

function InfoLink({ icon: Icon, href, label }: { icon: LucideIcon; href?: string; label: string }) {
  if (!href) {
    return <InfoLine icon={Icon} value={label} />;
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-start gap-3 text-sm font-medium text-primary hover:underline"
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{label}</span>
      <ExternalLink className="mt-0.5 size-3.5 shrink-0" aria-hidden />
    </Link>
  );
}

function formatAddress(place: TourismPlace, district?: IndianDistrict, region?: IndianRegion | null) {
  const addressParts = [
    place.address?.streetAddress,
    place.address?.locality,
    place.address?.district ?? district?.name,
    place.address?.region ?? region?.name,
  ].filter(Boolean);
  const address = place.address?.formattedAddress ?? addressParts.join(", ");

  return address || "Address not available";
}

function formatReviewCount(reviewsCount: number | undefined) {
  if (typeof reviewsCount !== "number") {
    return "No review count available";
  }

  return `${new Intl.NumberFormat("en-IN").format(reviewsCount)} reviews`;
}

function formatTypes(tags: string[], categories: TourismCategory[]) {
  const values = tags.length ? tags : categories.map((category) => category.name);

  return values.length ? values.map((value) => value.replaceAll("_", " ")).join(", ") : "Types not available";
}

function createFallbackPhotos(place: TourismPlace): GalleryPhoto[] {
  if (place.images?.length) {
    return place.images.map((image) => ({ url: image.url, attribution: image.attribution }));
  }

  return place.imageUrl ? [{ url: place.imageUrl }] : [];
}

function createGoogleMapsUrl(place: TourismPlace, latitude?: number | null, longitude?: number | null) {
  if (typeof latitude === "number" && typeof longitude === "number") {
    const placeId = encodeURIComponent(place.googlePlaceId ?? place.id);

    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${placeId}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;
}

function createNearbyGoogleMapsUrl(place: NearbyPlace) {
  const placeId = encodeURIComponent(place.googlePlaceId ?? place.id);

  return `https://www.google.com/maps/search/?api=1&query=${place.coordinates.latitude},${place.coordinates.longitude}&query_place_id=${placeId}`;
}

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}
