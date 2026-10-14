import Link from "next/link";
import { Train, Bus, Plane, Car, MapPin, Navigation, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { createMapplsDirectionsUrl } from "@/features/tourism/utils/mappls-deep-links";
import type { NearbyPlace, TourismPlace } from "@/features/tourism/types";

type PublicTransportationSectionProps = {
  place: TourismPlace;
  railwayStations?: NearbyPlace[];
  busStations?: NearbyPlace[];
  airports?: NearbyPlace[];
};

export function PublicTransportationSection({
  place,
  railwayStations = [],
  busStations = [],
  airports = [],
}: PublicTransportationSectionProps) {
  const latitude = place.coordinates?.latitude;
  const longitude = place.coordinates?.longitude;
  const hasCoordinates = typeof latitude === "number" && typeof longitude === "number";

  const totalHubsCount = railwayStations.length + busStations.length + airports.length;
  const hasTransitGuidance = Boolean(
    place.transitGuidance &&
      (place.transitGuidance.rail ||
        place.transitGuidance.road ||
        place.transitGuidance.air ||
        place.transitGuidance.local),
  );

  if (!hasCoordinates && !hasTransitGuidance) {
    return (
      <section className="space-y-4">
        <SectionHeader
          eyebrow="Transit"
          title="Public Transportation"
          description="How to reach this destination using public transit networks."
        />
        <EmptyState
          title="Transportation information not available"
          description="Transit guidance and nearby hub information have not been indexed for this place."
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Transit"
        title="Public Transportation"
        description="Public transit connectivity, nearby stations, and travel options to reach this destination."
      />

      {/* 1. Curated Transit Guidance */}
      {hasTransitGuidance && place.transitGuidance && (
        <div className="grid gap-4 md:grid-cols-2">
          {place.transitGuidance.rail && (
            <Card className="border-primary/10 shadow-sm">
              <CardContent className="flex items-start gap-3.5 p-4 sm:p-5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Train className="size-5" aria-hidden />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">By Train</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{place.transitGuidance.rail}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {place.transitGuidance.road && (
            <Card className="border-primary/10 shadow-sm">
              <CardContent className="flex items-start gap-3.5 p-4 sm:p-5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bus className="size-5" aria-hidden />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">By Road / Bus</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{place.transitGuidance.road}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {place.transitGuidance.air && (
            <Card className="border-primary/10 shadow-sm">
              <CardContent className="flex items-start gap-3.5 p-4 sm:p-5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Plane className="size-5" aria-hidden />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">By Air</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{place.transitGuidance.air}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {place.transitGuidance.local && (
            <Card className="border-primary/10 shadow-sm">
              <CardContent className="flex items-start gap-3.5 p-4 sm:p-5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Car className="size-5" aria-hidden />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">Local Transit & Commute</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{place.transitGuidance.local}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 2. Nearby Transit Hubs (from search provider) */}
      {hasCoordinates && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Nearby Transit Hubs
            </h3>
            {totalHubsCount > 0 && (
              <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                {totalHubsCount} {totalHubsCount === 1 ? "hub" : "hubs"} found nearby
              </Badge>
            )}
          </div>

          {totalHubsCount > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {railwayStations.map((station) => (
                <TransitHubCard
                  key={station.id}
                  hub={station}
                  icon={Train}
                  categoryLabel="Railway Station"
                  actionLabel="Navigate from station"
                  destination={{
                    latitude: latitude!,
                    longitude: longitude!,
                    mapplsPin: place.mapplsPlaceId,
                  }}
                />
              ))}

              {busStations.map((station) => (
                <TransitHubCard
                  key={station.id}
                  hub={station}
                  icon={Bus}
                  categoryLabel="Bus Station"
                  actionLabel="Navigate from station"
                  destination={{
                    latitude: latitude!,
                    longitude: longitude!,
                    mapplsPin: place.mapplsPlaceId,
                  }}
                />
              ))}

              {airports.map((airport) => (
                <TransitHubCard
                  key={airport.id}
                  hub={airport}
                  icon={Plane}
                  categoryLabel="Airport"
                  actionLabel="Navigate from airport"
                  destination={{
                    latitude: latitude!,
                    longitude: longitude!,
                    mapplsPin: place.mapplsPlaceId,
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No live transit hubs identified nearby. Refer to the regional transit overview above.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function TransitHubCard({
  hub,
  icon: Icon,
  categoryLabel,
  actionLabel,
  destination,
}: {
  hub: NearbyPlace;
  icon: typeof Train;
  categoryLabel: string;
  actionLabel: string;
  destination: { latitude: number; longitude: number; mapplsPin?: string };
}) {
  const directionsUrl =
    hub.coordinates?.latitude && hub.coordinates?.longitude
      ? createMapplsDirectionsUrl(
          { latitude: hub.coordinates.latitude, longitude: hub.coordinates.longitude },
          destination,
        )
      : undefined;

  return (
    <Card className="border-primary/10 shadow-sm flex flex-col justify-between">
      <CardContent className="p-4 sm:p-5 flex flex-col gap-3 h-full">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
              <Icon className="size-4" aria-hidden />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground line-clamp-1">{hub.name}</h4>
              <p className="text-xs text-muted-foreground">{categoryLabel}</p>
            </div>
          </div>
          {hub.distanceText && (
            <Badge variant="secondary" className="shrink-0 text-xs font-medium">
              {hub.distanceText}
            </Badge>
          )}
        </div>

        {hub.formattedAddress && (
          <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 mt-0.5 shrink-0 text-muted-foreground/70" aria-hidden />
            <span className="line-clamp-2">{hub.formattedAddress}</span>
          </div>
        )}

        <div className="mt-auto pt-2">
          {directionsUrl ? (
            <Button asChild variant="outline" size="sm" className="w-full text-xs h-8 gap-1.5">
              <Link href={directionsUrl} target="_blank" rel="noreferrer">
                <Navigation className="size-3" aria-hidden />
                <span>{actionLabel}</span>
                <ExternalLink className="size-3 opacity-60" aria-hidden />
              </Link>
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">Coordinates unavailable for navigation</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
