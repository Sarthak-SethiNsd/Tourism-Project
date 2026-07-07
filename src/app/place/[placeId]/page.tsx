import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, IndianRupee, MapPin, Star } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceCard } from "@/features/tourism/explore/place-card";
import {
  getTourismPlaceById,
  getTourismRegionById,
  listTourismCategories,
  listTourismDistrictsByRegion,
  listTourismPlaces,
} from "@/features/tourism/services/tourism-service";
import type { TourismPlace } from "@/features/tourism/types";

type PlaceDetailPageProps = {
  params: Promise<{ placeId: string }>;
};

const priceLabelByLevel: Record<TourismPlace["priceLevel"], string> = {
  free: "Free",
  budget: "Budget",
  moderate: "Moderate",
  premium: "Premium",
};

export async function generateStaticParams() {
  const places = await listTourismPlaces();

  return places.map((place) => ({ placeId: place.id }));
}

export async function generateMetadata({ params }: PlaceDetailPageProps) {
  const { placeId } = await params;
  const place = await getTourismPlaceById(placeId);

  if (!place) {
    return { title: "Place not found" };
  }

  return {
    title: place.name,
    description: place.summary,
  };
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { placeId } = await params;
  const place = await getTourismPlaceById(placeId);

  if (!place) {
    notFound();
  }

  const [categories, allPlaces, region, districts] = await Promise.all([
    listTourismCategories(),
    listTourismPlaces(),
    getTourismRegionById(place.stateId),
    listTourismDistrictsByRegion(place.stateId),
  ]);

  const district = districts.find((item) => item.id === place.districtId);
  const placeCategories = categories.filter((category) => place.categoryIds.includes(category.id));
  const categoryNames = placeCategories.map((category) => category.name).join(", ");
  const relatedPlaces = allPlaces
    .filter((item) => item.id !== place.id)
    .filter((item) => item.stateId === place.stateId || item.categoryIds.some((categoryId) => place.categoryIds.includes(categoryId)))
    .slice(0, 3);

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-8 pt-24 sm:px-8 lg:px-12">
        <Button asChild variant="ghost" className="w-fit rounded-lg">
          <Link href="/explore">
            <ArrowLeft className="size-4" aria-hidden />
            Back to Explore
          </Link>
        </Button>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="relative min-h-[360px] overflow-hidden rounded-lg bg-muted shadow-sm">
            {place.imageUrl ? (
              <Image
                src={place.imageUrl}
                alt={place.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            ) : null}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 text-white sm:p-7">
              <div className="mb-3 flex flex-wrap gap-2">
                {placeCategories.map((category) => (
                  <Badge key={category.id} variant="secondary" className="bg-white/90 text-foreground">
                    {category.name}
                  </Badge>
                ))}
              </div>
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">{place.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/86 sm:text-base">{place.summary}</p>
            </div>
          </div>

          <Card className="border-primary/10 shadow-sm">
            <CardContent className="flex h-full flex-col gap-5 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rating</p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
                    <Star className="size-5 fill-primary text-primary" aria-hidden />
                    {place.rating.toFixed(1)}
                  </p>
                </div>
                <Badge className="bg-accent text-accent-foreground hover:bg-accent">{priceLabelByLevel[place.priceLevel]}</Badge>
              </div>

              <div className="grid gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-3">
                  <MapPin className="size-4 text-primary" aria-hidden />
                  {district?.name ? `${district.name}, ` : ""}{region?.name ?? "India"}
                </span>
                <span className="flex items-center gap-3">
                  <CalendarDays className="size-4 text-primary" aria-hidden />
                  Best time: {place.bestTimeToVisit}
                </span>
                <span className="flex items-center gap-3">
                  <Clock3 className="size-4 text-primary" aria-hidden />
                  Ideal duration: {place.idealDuration}
                </span>
                <span className="flex items-center gap-3">
                  <IndianRupee className="size-4 text-primary" aria-hidden />
                  Budget: {priceLabelByLevel[place.priceLevel]}
                </span>
              </div>

              <div className="mt-auto rounded-lg bg-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</p>
                <p className="mt-2 text-sm font-medium">{categoryNames}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="border-primary/10 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <SectionHeader eyebrow="Overview" title="Why visit" />
              <p className="mt-5 text-base leading-8 text-muted-foreground">{place.description}</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Highlights</h2>
              <div className="mt-4 grid gap-3">
                {place.highlights.map((highlight) => (
                  <div key={highlight} className="rounded-lg bg-muted px-3 py-2 text-sm font-medium">
                    {highlight}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <SectionHeader eyebrow="More ideas" title="Related places" description="Continue exploring places with similar region or category signals." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {relatedPlaces.map((relatedPlace) => (
              <PlaceCard
                key={relatedPlace.id}
                place={relatedPlace}
                categories={categories.filter((category) => relatedPlace.categoryIds.includes(category.id))}
                region={region?.id === relatedPlace.stateId ? region : undefined}
              />
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
