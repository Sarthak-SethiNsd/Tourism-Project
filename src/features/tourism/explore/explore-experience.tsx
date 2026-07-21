"use client";

import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDistrictsByRegion } from "@/features/tourism/hooks/use-districts-by-region";
import type { IndianDistrict, IndianRegion, TourismCategory, TourismPlace } from "@/features/tourism/types";
import { filterTourismPlaces } from "@/features/tourism/utils/place-filters";
import { CategoryCard } from "@/features/tourism/explore/category-card";
import { ExploreFilterBar, type ExploreFilterState } from "@/features/tourism/explore/explore-filter-bar";
import { PlaceCard } from "@/features/tourism/explore/place-card";
import { hasFirebaseConfig } from "@/config/firebase";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";
import { getSavedPlaces, getVisitedPlaces, getWishlistPlaces, saveSearchHistoryEntry } from "@/features/tourism/services/tourism-service";
import { getStoredExploreFilters, storeExploreFilters } from "@/features/tourism/explore/advanced-search-storage";

type ExploreExperienceProps = {
  places: TourismPlace[];
  categories: TourismCategory[];
  regions: IndianRegion[];
  initialFilters?: Partial<ExploreFilterState>;
};

const defaultFilters: ExploreFilterState = {
  query: "",
  stateId: "",
  districtId: "",
  categoryId: "",
  priceLevel: "",
  minimumRating: "",
  currentlyOpen: false,
  maxDistanceKm: "",
  visited: false,
  wishlist: false,
  saved: false,
  sortBy: "rating",
};

function countPlacesByCategory(places: TourismPlace[], categoryId: string) {
  return places.filter((place) => place.categoryIds.includes(categoryId)).length;
}

function getCategoryList(place: TourismPlace, categories: TourismCategory[]) {
  return place.categoryIds
    .map((categoryId) => categories.find((category) => category.id === categoryId))
    .filter((category): category is TourismCategory => Boolean(category));
}

function buildDistrictMap(districts: IndianDistrict[]) {
  return new Map(districts.map((district) => [district.id, district]));
}

export function ExploreExperience({ places, categories, regions, initialFilters }: ExploreExperienceProps) {
  const [filters, setFilters] = useState<ExploreFilterState>({ ...defaultFilters, ...initialFilters });
  const [hasRestoredFilters, setHasRestoredFilters] = useState(false);
  const [visitedPlaceIds, setVisitedPlaceIds] = useState<Set<string>>(new Set());
  const [wishlistPlaceIds, setWishlistPlaceIds] = useState<Set<string>>(new Set());
  const [savedPlaceIds, setSavedPlaceIds] = useState<Set<string>>(new Set());
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | undefined>();
  const { districts } = useDistrictsByRegion(filters.stateId || undefined);
  const { user, isReady } = useAuthUser();

  const regionById = useMemo(() => new Map(regions.map((region) => [region.id, region])), [regions]);
  const districtById = useMemo(() => buildDistrictMap(districts), [districts]);

  const featuredPlaces = useMemo(() => places.filter((place) => place.isFeatured), [places]);
  useEffect(() => {
    setFilters((currentFilters) => ({ ...currentFilters, ...getStoredExploreFilters() }));
    setHasRestoredFilters(true);
  }, []);

  useEffect(() => {
    if (hasRestoredFilters) storeExploreFilters(filters);
  }, [filters, hasRestoredFilters]);

  useEffect(() => {
    let isActive = true;
    async function loadPlaceLists() {
      if (!isReady) return;
      try {
        const [visited, wishlist, saved] = await Promise.all([
          getVisitedPlaces(user?.uid),
          getWishlistPlaces(user?.uid),
          user ? getSavedPlaces(user.uid) : Promise.resolve([]),
        ]);
        if (isActive) {
          setVisitedPlaceIds(new Set(visited.map((place) => place.placeId)));
          setWishlistPlaceIds(new Set(wishlist.map((place) => place.placeId)));
          setSavedPlaceIds(new Set(saved.map((place) => place.placeId)));
        }
      } catch {
        if (isActive) setLocationMessage("Some account-based filters are unavailable right now.");
      }
    }
    void loadPlaceLists();
    return () => { isActive = false; };
  }, [isReady, user]);

  const filteredPlaces = useMemo(() => {
    const matchingPlaces = filterTourismPlaces(places, {
        query: filters.query,
        stateId: filters.stateId || undefined,
        districtId: filters.districtId || undefined,
        categoryId: filters.categoryId || undefined,
        priceLevel: filters.priceLevel || undefined,
      }).filter((place) => {
        const distanceKm = location ? getDistanceKm(location, place.coordinates) : undefined;
        return (!filters.minimumRating || place.rating >= Number(filters.minimumRating)) &&
          (!filters.currentlyOpen || place.openingHours?.openNow === true) &&
          (!filters.maxDistanceKm || !location || (distanceKm !== undefined && distanceKm <= Number(filters.maxDistanceKm))) &&
          (!filters.visited || visitedPlaceIds.has(place.id)) &&
          (!filters.wishlist || wishlistPlaceIds.has(place.id)) &&
          (!filters.saved || savedPlaceIds.has(place.id));
      });
    return sortPlaces(matchingPlaces, filters.sortBy, location, places);
  }, [filters, location, places, savedPlaceIds, visitedPlaceIds, wishlistPlaceIds]);

  function handleCategorySelect(categoryId: string) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      categoryId: currentFilters.categoryId === categoryId ? "" : categoryId,
    }));
  }

  function clearFilters() {
    setFilters(defaultFilters);
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Location is not supported by this browser. Distance filters are unavailable.");
      return;
    }
    setLocationMessage("Getting your location for distance filtering…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setLocation({ latitude: coords.latitude, longitude: coords.longitude }); setLocationMessage("Distance filters and sorting now use your current location."); },
      () => setLocationMessage("Your location is unavailable. You can still use the other filters."),
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 },
    );
  }

  function handlePlaceOpen(place: TourismPlace) {
    const query = filters.query.trim();

    if (!query || !hasFirebaseConfig || !user) {
      return;
    }

    void saveSearchHistoryEntry(user.uid, place, {
      district: districtById.get(place.districtId),
      region: regionById.get(place.stateId),
      primaryCategory: getCategoryList(place, categories)[0],
    });
  }

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-8 pt-24 sm:px-8 lg:px-12">
        <section className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-stretch">
          <div className="relative overflow-hidden rounded-lg bg-primary p-6 text-primary-foreground shadow-sm sm:p-8">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-5 flex size-12 items-center justify-center rounded-lg bg-white/15">
                <Compass className="size-6" aria-hidden />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/80">Explore India</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                Discover places by state, district, mood, and budget.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-primary-foreground/82 sm:text-base">
                Browse curated offline destinations across India. Start from your selected onboarding location or refine the journey here.
              </p>
            </div>
          </div>

          <Card className="border-primary/10 bg-card shadow-sm">
            <CardContent className="flex h-full flex-col justify-between gap-5 p-5">
              <div>
                <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Sparkles className="size-5" aria-hidden />
                </div>
                <h2 className="text-xl font-semibold">Version 1 ready</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This Explore page runs entirely on local data and stays independent from Firebase, maps, APIs, and AI.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-lg font-semibold">{places.length}</p>
                  <p className="text-xs text-muted-foreground">Places</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-lg font-semibold">{categories.length}</p>
                  <p className="text-xs text-muted-foreground">Categories</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-lg font-semibold">{regions.length}</p>
                  <p className="text-xs text-muted-foreground">Regions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {featuredPlaces.length ? (
          <section className="space-y-4">
            <SectionHeader
              eyebrow="Featured"
              title="Start with these travel highlights"
              description="A short list of high-signal destinations across heritage, nature, and spiritual travel."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {featuredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  categories={getCategoryList(place, categories)}
                  region={regionById.get(place.stateId)}
                  district={districtById.get(place.districtId)}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <SectionHeader eyebrow="Categories" title="Choose your travel mood" />
            <Button asChild variant="outline" className="min-h-11 rounded-lg">
              <Link href="/categories">View all categories</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                placeCount={countPlacesByCategory(places, category.id)}
                isActive={filters.categoryId === category.id}
                onSelect={handleCategorySelect}
              />
            ))}
          </div>
        </section>

        <ExploreFilterBar
          filters={filters}
          regions={regions}
          districts={districts}
          categories={categories}
          resultCount={filteredPlaces.length}
          onFiltersChange={setFilters}
          onClear={clearFilters}
          hasLocation={Boolean(location)}
          locationMessage={locationMessage}
          onRequestLocation={requestLocation}
        />

        <section className="space-y-4">
          <SectionHeader eyebrow="Places" title="Recommended destinations" description="Filter, search, and open any place for details." />
          {filteredPlaces.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  categories={getCategoryList(place, categories)}
                  region={regionById.get(place.stateId)}
                  district={districtById.get(place.districtId)}
                  onOpen={() => handlePlaceOpen(place)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No places match these filters"
              description="Try clearing a category, choosing a broader state, or searching for a different destination."
              className="bg-card"
            />
          )}
        </section>
      </main>
    </AppShell>
  );
}

function sortPlaces(places: TourismPlace[], sortBy: ExploreFilterState["sortBy"], location: { latitude: number; longitude: number } | null, sourcePlaces: TourismPlace[]) {
  const sourcePosition = new Map(sourcePlaces.map((place, index) => [place.id, index]));
  return [...places].sort((left, right) => {
    if (sortBy === "alphabetical") return left.name.localeCompare(right.name);
    if (sortBy === "popularity") return (right.reviewsCount ?? 0) - (left.reviewsCount ?? 0);
    if (sortBy === "recently-added") return (sourcePosition.get(right.id) ?? 0) - (sourcePosition.get(left.id) ?? 0);
    if (sortBy === "distance" && location) return (getDistanceKm(location, left.coordinates) ?? Infinity) - (getDistanceKm(location, right.coordinates) ?? Infinity);
    return right.rating - left.rating;
  });
}

function getDistanceKm(origin: { latitude: number; longitude: number }, destination?: TourismPlace["coordinates"]) {
  if (!destination || typeof destination.latitude !== "number" || typeof destination.longitude !== "number") return undefined;
  const toRadians = (value: number) => value * Math.PI / 180;
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const calculation = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(toRadians(origin.latitude)) * Math.cos(toRadians(destination.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(calculation), Math.sqrt(1 - calculation));
}
