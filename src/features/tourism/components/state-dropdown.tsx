"use client";

import { useMemo, useState } from "react";
import { Check, Clock3, MapPin } from "lucide-react";
import type { SelectOption } from "@/config/tourism";
import { onboardingCopy, regionUiCopy } from "@/config/tourism";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type StateDropdownProps = {
  states: SelectOption[];
  recentStates: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  listLabel?: string;
  isLoading?: boolean;
};

export function StateDropdown({
  states,
  recentStates,
  value,
  onChange,
  listLabel = onboardingCopy.stateListLabel,
  isLoading = false,
}: StateDropdownProps) {
  const [query, setQuery] = useState("");
  const selectedState = states.find((state) => state.value === value);
  const filteredStates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return states;
    }

    return states.filter((state) => state.label.toLowerCase().includes(normalizedQuery));
  }, [query, states]);

  if (isLoading) {
    return (
      <div className="min-h-48">
        <LoadingState label="Loading states and union territories" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>State or Union Territory</Label>
        <Select value={value ?? ""} onValueChange={onChange}>
          <SelectTrigger className="min-h-12 rounded-lg bg-background text-base">
            <SelectValue placeholder={regionUiCopy.stateSelectPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="state-search">Search</Label>
        <SearchInput
          id="state-search"
          placeholder={regionUiCopy.stateSearchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {selectedState ? (
        <Card className="border-primary/15 bg-primary/5 shadow-sm">
          <CardContent className="flex min-h-14 items-center gap-3 p-3">
            <MapPin className="size-4 text-primary" aria-hidden />
            <div>
              <p className="text-sm font-semibold">{selectedState.label}</p>
              {selectedState.description ? (
                <p className="text-xs text-muted-foreground">{selectedState.description}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Selected region</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {recentStates.length ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Clock3 className="size-3.5" aria-hidden />
            Recently Selected
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recentStates.map((state) => (
              <Button
                key={state.value}
                type="button"
                variant="secondary"
                className="min-h-10 shrink-0 rounded-lg"
                onClick={() => onChange(state.value)}
              >
                {state.label}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{listLabel}</p>
        {filteredStates.length ? (
          <div className="grid gap-2">
            {filteredStates.map((state) => {
              const isSelected = state.value === value;

              return (
                <button
                  key={state.value}
                  type="button"
                  onClick={() => onChange(state.value)}
                  className={cn(
                    "flex min-h-16 w-full items-center justify-between rounded-lg border bg-card px-4 py-3 text-left shadow-sm transition",
                    isSelected && "border-primary bg-primary/5",
                  )}
                >
                  <span>
                    <span className="block text-sm font-semibold">{state.label}</span>
                    {state.description ? <span className="text-xs text-muted-foreground">{state.description}</span> : null}
                  </span>
                  {isSelected ? <Check className="size-4 text-primary" aria-hidden /> : null}
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState
            className="min-h-40"
            title={regionUiCopy.noStatesFoundTitle}
            description={regionUiCopy.noStatesFoundDescription}
          />
        )}
      </div>
    </div>
  );
}
