"use client";

import { SlidersHorizontal, X } from "lucide-react";
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
};

type ExploreFilterBarProps = {
  filters: ExploreFilterState;
  regions: IndianRegion[];
  districts: IndianDistrict[];
  categories: TourismCategory[];
  resultCount: number;
  onFiltersChange: (filters: ExploreFilterState) => void;
  onClear: () => void;
};

const allValue = "all";

const priceOptions: Array<{ label: string; value: TourismPriceLevel }> = [
  { label: "Free", value: "free" },
  { label: "Budget", value: "budget" },
  { label: "Moderate", value: "moderate" },
  { label: "Premium", value: "premium" },
];

export function ExploreFilterBar({
  filters,
  regions,
  districts,
  categories,
  resultCount,
  onFiltersChange,
  onClear,
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
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="size-4" aria-hidden />
          {resultCount} matching {resultCount === 1 ? "place" : "places"}
        </p>
        <Button type="button" variant="ghost" className="min-h-10 rounded-lg" onClick={onClear}>
          <X className="size-4" aria-hidden />
          Clear filters
        </Button>
      </div>
    </section>
  );
}
