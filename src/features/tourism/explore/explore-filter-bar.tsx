"use client";

import { LocateFixed, SlidersHorizontal, X } from "lucide-react";
import type { IndianDistrict, IndianRegion, TourismCategory, TourismPriceLevel } from "@/features/tourism/types";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ExploreFilterState = {
  query: string;
  stateId: string;
  districtId: string;
  categoryId: string;
  priceLevel: "" | TourismPriceLevel;
  minimumRating: "" | "3" | "4" | "4.5";
  currentlyOpen: boolean;
  maxDistanceKm: "" | "10" | "50" | "100";
  visited: boolean;
  wishlist: boolean;
  saved: boolean;
  sortBy: "rating" | "distance" | "popularity" | "recently-added" | "alphabetical";
};

type ExploreFilterBarProps = {
  filters: ExploreFilterState;
  regions: IndianRegion[];
  districts: IndianDistrict[];
  categories: TourismCategory[];
  resultCount: number;
  onFiltersChange: (filters: ExploreFilterState) => void;
  onClear: () => void;
  hasLocation: boolean;
  locationMessage?: string;
  onRequestLocation: () => void;
};

const allValue = "all";

const priceOptions: Array<{ label: string; value: TourismPriceLevel }> = [
  { label: "Free", value: "free" },
  { label: "Budget", value: "budget" },
  { label: "Moderate", value: "moderate" },
  { label: "Premium", value: "premium" },
];

const ratingOptions: Array<{ label: string; value: ExploreFilterState["minimumRating"] }> = [
  { label: "3.0+ rating", value: "3" },
  { label: "4.0+ rating", value: "4" },
  { label: "4.5+ rating", value: "4.5" },
];

export function ExploreFilterBar({
  filters,
  regions,
  districts,
  categories,
  resultCount,
  onFiltersChange,
  onClear,
  hasLocation,
  locationMessage,
  onRequestLocation,
}: ExploreFilterBarProps) {
  function updateFilter(nextFilters: Partial<ExploreFilterState>) {
    onFiltersChange({ ...filters, ...nextFilters });
  }

  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1 space-y-2">
          <Label htmlFor="place-search">Search places</Label>
          <SearchInput
            id="place-search"
            placeholder="Search destinations, tags, experiences"
            value={filters.query}
            onChange={(event) => updateFilter({ query: event.target.value })}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>State</Label>
            <Select
              value={filters.stateId || allValue}
              onValueChange={(value) => updateFilter({ stateId: value === allValue ? "" : value, districtId: "" })}
            >
              <SelectTrigger className="min-h-12 min-w-44 rounded-lg bg-background">
                <SelectValue placeholder="All states" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allValue}>All states</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>District</Label>
            <Select
              value={filters.districtId || allValue}
              disabled={!filters.stateId || !districts.length}
              onValueChange={(value) => updateFilter({ districtId: value === allValue ? "" : value })}
            >
              <SelectTrigger className="min-h-12 min-w-44 rounded-lg bg-background">
                <SelectValue placeholder="All districts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allValue}>All districts</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.id}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.categoryId || allValue}
              onValueChange={(value) => updateFilter({ categoryId: value === allValue ? "" : value })}
            >
              <SelectTrigger className="min-h-12 min-w-40 rounded-lg bg-background">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allValue}>All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Budget</Label>
            <Select
              value={filters.priceLevel || allValue}
              onValueChange={(value) => updateFilter({ priceLevel: value === allValue ? "" : (value as TourismPriceLevel) })}
            >
              <SelectTrigger className="min-h-12 min-w-36 rounded-lg bg-background">
                <SelectValue placeholder="Any budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allValue}>Any budget</SelectItem>
                {priceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <Select value={filters.minimumRating || allValue} onValueChange={(value) => updateFilter({ minimumRating: value === allValue ? "" : value as ExploreFilterState["minimumRating"] })}>
              <SelectTrigger className="min-h-12 min-w-36 rounded-lg bg-background"><SelectValue placeholder="Any rating" /></SelectTrigger>
              <SelectContent><SelectItem value={allValue}>Any rating</SelectItem>{ratingOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Open now</Label>
            <Select value={filters.currentlyOpen ? "open" : allValue} onValueChange={(value) => updateFilter({ currentlyOpen: value === "open" })}>
              <SelectTrigger className="min-h-12 min-w-36 rounded-lg bg-background"><SelectValue placeholder="Any hours" /></SelectTrigger>
              <SelectContent><SelectItem value={allValue}>Any hours</SelectItem><SelectItem value="open">Currently open</SelectItem></SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Distance</Label>
            <Select value={filters.maxDistanceKm || allValue} onValueChange={(value) => { updateFilter({ maxDistanceKm: value === allValue ? "" : value as ExploreFilterState["maxDistanceKm"] }); if (value !== allValue && !hasLocation) onRequestLocation(); }}>
              <SelectTrigger className="min-h-12 min-w-36 rounded-lg bg-background"><SelectValue placeholder="Any distance" /></SelectTrigger>
              <SelectContent><SelectItem value={allValue}>Any distance</SelectItem><SelectItem value="10">Within 10 km</SelectItem><SelectItem value="50">Within 50 km</SelectItem><SelectItem value="100">Within 100 km</SelectItem></SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>My places</Label>
            <div className="flex min-h-12 flex-wrap gap-2 rounded-lg border bg-background p-1.5">
              <Button type="button" size="sm" className="min-h-10" variant={filters.visited ? "secondary" : "ghost"} onClick={() => updateFilter({ visited: !filters.visited })}>Visited</Button>
              <Button type="button" size="sm" className="min-h-10" variant={filters.wishlist ? "secondary" : "ghost"} onClick={() => updateFilter({ wishlist: !filters.wishlist })}>Wishlist</Button>
              <Button type="button" size="sm" className="min-h-10" variant={filters.saved ? "secondary" : "ghost"} onClick={() => updateFilter({ saved: !filters.saved })}>Saved</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sort by</Label>
            <Select value={filters.sortBy} onValueChange={(value) => { updateFilter({ sortBy: value as ExploreFilterState["sortBy"] }); if (value === "distance" && !hasLocation) onRequestLocation(); }}>
              <SelectTrigger className="min-h-12 min-w-40 rounded-lg bg-background"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="rating">Rating</SelectItem><SelectItem value="distance">Distance</SelectItem><SelectItem value="popularity">Popularity</SelectItem><SelectItem value="recently-added">Recently added</SelectItem><SelectItem value="alphabetical">Alphabetical (A–Z)</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="size-4" aria-hidden />
          {resultCount} matching {resultCount === 1 ? "place" : "places"}
        </p>
        <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" className="min-h-10 rounded-lg" onClick={onRequestLocation}><LocateFixed className="size-4" aria-hidden />{hasLocation ? "Location ready" : "Use my location"}</Button><Button type="button" variant="ghost" className="min-h-10 rounded-lg" onClick={onClear}><X className="size-4" aria-hidden />Clear filters</Button></div>
      </div>
      {locationMessage ? <p className="mt-3 text-sm text-muted-foreground">{locationMessage}</p> : null}
    </section>
  );
}
