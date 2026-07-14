import type { IndianDistrict, IndianRegion, TourismPlace } from "@/features/tourism/types";
import type { TripPlaceInput } from "@/features/trip-planner/types";

export function createTripPlaceInput(place: TourismPlace, district?: IndianDistrict, region?: IndianRegion | null): TripPlaceInput {
  const primaryImage = place.images?.[0];

  return {
    placeId: place.id,
    googlePlaceId: place.googlePlaceId,
    placeName: place.name,
    thumbnailUrl: primaryImage?.url ?? place.imageUrl,
    thumbnailPhotoReference: primaryImage?.photoReference,
    district: district?.name ?? place.districtName ?? place.address?.district,
    state: region?.name ?? place.address?.region,
  };
}
