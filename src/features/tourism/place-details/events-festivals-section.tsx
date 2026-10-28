import Link from "next/link";
import {
  Calendar,
  ExternalLink,
  Info,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import type {
  TourismEvent,
  TourismEventCategory,
  TourismEventRecurrence,
  TourismPlace,
} from "@/features/tourism/types";

type EventsFestivalsSectionProps = {
  place: TourismPlace;
  events: TourismEvent[];
};

const categoryLabelMap: Record<TourismEventCategory, string> = {
  cultural: "Cultural Celebration",
  spiritual: "Spiritual & Ritual",
  music_arts: "Music & Performing Arts",
  seasonal: "Seasonal Spectacle",
  heritage: "Heritage Festival",
  fair_mela: "Traditional Fair & Regatta",
};

const recurrenceLabelMap: Record<TourismEventRecurrence, string> = {
  daily: "Daily Ritual",
  annual: "Annual Festival",
  seasonal: "Seasonal Cycle",
  date_specific: "Scheduled Event",
};

export function EventsFestivalsSection({
  place,
  events,
}: EventsFestivalsSectionProps) {
  if (!events || events.length === 0) {
    return (
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Culture & Celebrations"
          title="Events & Festivals"
          description="Local cultural events, traditional celebrations, and seasonal festivities."
        />
        <EmptyState
          title="No scheduled festivals indexed"
          description={`No major local festivals or seasonal celebrations are currently cataloged specifically for ${place.name}. Check regional tourism advisories or visit during the general peak travel season (${place.bestTimeToVisit || "October to March"}).`}
        />
      </section>
    );
  }

  const isStateFallbackOnly = events.every((event) => event.scopeLevel === "state");
  const stateContextName = events[0]?.regionContextName || place.stateId;

  const sectionDescription = isStateFallbackOnly
    ? `Explore prominent cultural heritage and state-wide celebrations across ${stateContextName}.`
    : `Experience authentic living culture and traditional festivals in and around ${place.name}.`;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Culture & Celebrations"
          title="Events & Festivals"
          description={sectionDescription}
        />
        <Badge
          variant="outline"
          className="w-fit text-xs font-normal text-muted-foreground"
        >
          {events.length} {events.length === 1 ? "celebration" : "celebrations"}
        </Badge>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {events.map((event) => (
          <EventCard key={event.id} event={event} currentPlaceId={place.id} />
        ))}
      </div>
    </section>
  );
}

function EventCard({
  event,
  currentPlaceId,
}: {
  event: TourismEvent;
  currentPlaceId: string;
}) {
  const isDirectMatch =
    event.scopeLevel === "destination" || (event.placeIds && event.placeIds.includes(currentPlaceId));
  const isDistrictMatch = event.scopeLevel === "district";
  const isStateFallback = event.scopeLevel === "state";

  const categoryLabel = categoryLabelMap[event.category] ?? "Cultural";
  const recurrenceLabel = recurrenceLabelMap[event.recurrence] ?? "Event";

  return (
    <Card className="flex flex-col justify-between border-primary/10 shadow-sm transition-all hover:border-primary/25">
      <CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">
        {/* Header & Badges */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs font-medium">
              {categoryLabel}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs font-normal text-muted-foreground"
            >
              {recurrenceLabel}
            </Badge>
            {isDirectMatch && (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium border-0">
                <Sparkles className="mr-1 size-3" aria-hidden />
                At this destination
              </Badge>
            )}
            {isDistrictMatch && (
              <Badge
                variant="outline"
                className="text-xs font-normal border-blue-500/30 bg-blue-500/10 text-blue-800 dark:text-blue-300"
              >
                District Celebration ({event.regionContextName || "District"})
              </Badge>
            )}
            {isStateFallback && (
              <Badge
                variant="outline"
                className="text-xs font-normal border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
              >
                State Cultural Heritage ({event.regionContextName || "State"})
              </Badge>
            )}
          </div>

          <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {event.name}
          </h3>
        </div>

        {/* Timing Information */}
        <div className="rounded-lg bg-muted/60 p-3.5 space-y-1.5 text-sm">
          <div className="flex items-start gap-2.5">
            <Calendar
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden
            />
            <div className="space-y-0.5">
              <p className="font-medium text-foreground">
                {event.periodDescription}
              </p>
              <p className="text-xs text-muted-foreground">
                {event.recurrence === "daily"
                  ? "Recurring daily schedule"
                  : "Traditional / lunar season (dates subject to yearly calendar)"}
              </p>
            </div>
          </div>

          {/* Confirmed Edition (if verified for current/upcoming cycle) */}
          {event.confirmedEdition && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>
                Confirmed for {event.confirmedEdition.year}:{" "}
                {event.confirmedEdition.startDate} to{" "}
                {event.confirmedEdition.endDate}
              </span>
            </div>
          )}
        </div>

        {/* Venue / Location */}
        {event.venue && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin
              className="mt-0.5 size-4 shrink-0 text-muted-foreground/80"
              aria-hidden
            />
            <span className="line-clamp-2">{event.venue}</span>
          </div>
        )}

        {/* Summary Description */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {event.summary}
        </p>

        {/* Cultural Significance Highlight */}
        {event.culturalSignificance && (
          <div className="rounded-md border border-primary/10 bg-primary/5 p-3 text-xs leading-relaxed text-foreground">
            <span className="font-semibold text-primary">Cultural Context: </span>
            {event.culturalSignificance}
          </div>
        )}

        {/* Practical Visitor Tips */}
        {event.tips && event.tips.length > 0 && (
          <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5 font-medium text-foreground">
              <Info className="size-3.5 text-primary" aria-hidden />
              <span>Visitor Tips:</span>
            </p>
            <ul className="list-disc pl-4 space-y-1">
              {event.tips.map((tip, idx) => (
                <li key={idx} className="leading-normal">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* External Official Link */}
        {event.officialWebsiteUrl && (
          <div className="mt-auto pt-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full sm:w-fit text-xs gap-1.5"
            >
              <Link
                href={event.officialWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Official tourism details for ${event.name}`}
              >
                <span>Official Tourism Details</span>
                <ExternalLink className="size-3 opacity-70" aria-hidden />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
