"use client";

import { useMemo, useState } from "react";
import { Check, MapPinned } from "lucide-react";
import type { SelectOption } from "@/config/tourism";
import { onboardingCopy, regionUiCopy } from "@/config/tourism";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type DistrictDropdownProps = {
  districts: SelectOption[];
  entireStateSelected: boolean;
  value?: string;
  onDistrictChange: (value: string) => void;
  onEntireStateChange: () => void;
  isLoading?: boolean;
  listLabel?: string;
};

export function DistrictDropdown({
  districts,
  entireStateSelected,
  value,
  onDistrictChange,
  onEntireStateChange,
  isLoading = false,
  listLabel = onboardingCopy.districtListLabel,
}: DistrictDropdownProps) {
  const [query, setQuery] = useState("");
  const filteredDistricts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return districts;
    }

    return districts.filter((district) => district.label.toLowerCase().includes(normalizedQuery));
  }, [districts, query]);

  const selectPlaceholder = isLoading
    ? regionUiCopy.districtSelectLoadingPlaceholder
    : districts.length
      ? regionUiCopy.districtSelectPlaceholder
      : regionUiCopy.districtSelectLoadingPlaceholder;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onEntireStateChange}
        className={cn(
          "flex min-h-16 w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-left shadow-sm transition",
          entireStateSelected && "border-primary bg-primary/5",
        )}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPinned className="size-5" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">{onboardingCopy.exploreEntireStateTitle}</span>
            <span className="text-xs text-muted-foreground">{onboardingCopy.exploreEntireStateDescription}</span>
          </span>
        </span>
        {entireStateSelected ? <Check className="ml-3 size-4 shrink-0 text-primary" aria-hidden /> : null}
      </button>

      <div className="space-y-2">
        <Label>District</Label>
        <Select value={value ?? ""} onValueChange={onDistrictChange} disabled={isLoading || !districts.length}>
          <SelectTrigger className="min-h-12 rounded-lg bg-background text-base">
            <SelectValue placeholder={selectPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {districts.map((district) => (
              <SelectItem key={district.value} value={district.value}>
                {district.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="district-search">Search</Label>
        <SearchInput
          id="district-search"
          placeholder={regionUiCopy.districtSearchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={isLoading}
        />
      </div>

      {isLoading ? (
        <div className="min-h-40">
          <LoadingState label={regionUiCopy.districtsLoadingTitle} />
        </div>
      ) : filteredDistricts.length ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{listLabel}</p>
          <div className="grid gap-2">
            {filteredDistricts.map((district) => {
              const isSelected = district.value === value;

              return (
                <Button
                  key={district.value}
                  type="button"
                  variant="outline"
                  className={cn("min-h-12 justify-between rounded-lg", isSelected && "border-primary bg-primary/5")}
                  onClick={() => onDistrictChange(district.value)}
                >
                  {district.label}
                  {isSelected ? <Check className="size-4 text-primary" aria-hidden /> : null}
                </Button>
              );
            })}
          </div>
        </div>
      ) : query.trim() ? (
        <EmptyState
          className="min-h-40"
          title={regionUiCopy.noDistrictsFoundTitle}
          description={regionUiCopy.noDistrictsFoundDescription}
        />
      ) : (
        <EmptyState
          className="min-h-40"
          title={regionUiCopy.districtsEmptyTitle}
          description={regionUiCopy.districtsEmptyDescription}
        />
      )}
    </div>
  );
}
