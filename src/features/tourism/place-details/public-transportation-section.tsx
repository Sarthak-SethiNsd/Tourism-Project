import Link from "next/link";
import { Train, Bus, Plane, Car, MapPin, Navigation, ExternalLink, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { createMapplsDirectionsUrl } from "@/features/tourism/utils/mappls-deep-links";
import type { NearbyPlace, TourismPlace, TourismTransitGuidance } from "@/features/tourism/types";

type PublicTransportationSectionProps = {
  place: TourismPlace;
  resolvedGuidance?: TourismTransitGuidance;
  railwayStations?: NearbyPlace[];
  busStations?: NearbyPlace[];
  airports?: NearbyPlace[];
};

export function PublicTransportationSection({
  place,
  resolvedGuidance,
  railwayStations = [],
  busStations = [],
  airports = [],
}: PublicTransportationSectionProps) {
  const latitude = place.coordinates?.latitude;
  const longitude = place.coordinates?.longitude;
  const hasCoordinates = typeof latitude === "number" && typeof longitude === "number";

  // Active guidance falls back to place.transitGuidance if resolvedGuidance wasn't explicitly provided
  const guidance = resolvedGuidance ?? place.transitGuidance;
  const isDistrictInherited = guidance?.sourceLevel === "district";

  const hasGuidanceContent = Boolean(
    guidance &&
      ((guidance.rail && guidance.rail.trim().length > 0) ||
        (guidance.road && guidance.road.trim().length > 0) ||
        (guidance.air && guidance.air.trim().length > 0) ||
        (guidance.local && guidance.local.trim().length > 0)),
  );

  const totalHubsCount = railwayStations.length + busStations.length + airports.length;

  if (!hasCoordinates && !hasGuidanceContent) {
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
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Transit"
          title="Public Transportation"
          description="Public transit connectivity, nearby stations, and travel options to reach this destination."
        />
        {isDistrictInherited && (
          <Badge
            variant="outline"
            className="w-fit text-xs font-normal border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
          >
            Regional Connectivity ({guidance.districtName || place.districtName || "District"})
          </Badge>
        )}
      </div>

      {/* 1. Curated Transit Guidance */}
      {hasGuidanceContent && guidance && (
        <div className="space-y-3">
          {isDistrictInherited && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-amber-900 dark:text-amber-200">
              <Info className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" aria-hidden />
              <p className="leading-relaxed">
                Showing verified regional transit corridors for{" "}
                <span className="font-semibold">{guidance.districtName || place.districtName || "this district"}</span>.
                These transit hubs serve the wider district and connecting travel may be required to reach {place.name}.
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {guidance.rail && guidance.rail.trim().length > 0 && (
              <Card className="border-primary/10 shadow-sm transition-all hover:border-primary/25">
                <CardContent className="flex items-start gap-3.5 p-4 sm:p-5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Train className="size-5" aria-hidden />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">By Train</h4>
                      {isDistrictInherited && (
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Regional Hub</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{guidance.rail}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {guidance.road && guidance.road.trim().length > 0 && (
              <Card className="border-primary/10 shadow-sm transition-all hover:border-primary/25">
                <CardContent className="flex items-start gap-3.5 p-4 sm:p-5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bus className="size-5" aria-hidden />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">By Road / Bus</h4>
                      {isDistrictInherited && (
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Regional Bus Corridor</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{guidance.road}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {guidance.air && guidance.air.trim().length > 0 && (
              <Card className="border-primary/10 shadow-sm transition-all hover:border-primary/25">
                <CardContent className="flex items-start gap-3.5 p-4 sm:p-5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Plane className="size-5" aria-hidden />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">By Air</h4>
                      {isDistrictInherited && (
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Regional Airport</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{guidance.air}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {guidance.local && guidance.local.trim().length > 0 && (
              <Card className="border-primary/10 shadow-sm transition-all hover:border-primary/25">
                <CardContent className="flex items-start gap-3.5 p-4 sm:p-5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Car className="size-5" aria-hidden />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-foreground">Local Transit & Commute</h4>
                      {isDistrictInherited && (
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">District Network</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{guidance.local}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
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
              No live transit hubs identified within immediate search radius. Refer to the regional transit overview above.
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
