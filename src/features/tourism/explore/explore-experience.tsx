"use client";

import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
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
import { saveSearchHistoryEntry } from "@/features/tourism/services/tourism-service";

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
  const { districts } = useDistrictsByRegion(filters.stateId || undefined);
  const { user } = useAuthUser();

  const regionById = useMemo(() => new Map(regions.map((region) => [region.id, region])), [regions]);
  const districtById = useMemo(() => buildDistrictMap(districts), [districts]);

  const featuredPlaces = useMemo(() => places.filter((place) => place.isFeatured), [places]);
  const filteredPlaces = useMemo(
    () =>
      filterTourismPlaces(places, {
        query: filters.query,
        stateId: filters.stateId || undefined,
        districtId: filters.districtId || undefined,
        categoryId: filters.categoryId || undefined,
        priceLevel: filters.priceLevel || undefined,
      }),
    [filters, places],
  );

  function handleCategorySelect(categoryId: string) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      categoryId: currentFilters.categoryId === categoryId ? "" : categoryId,
    }));
  }

  function clearFilters() {
    setFilters(defaultFilters);
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
