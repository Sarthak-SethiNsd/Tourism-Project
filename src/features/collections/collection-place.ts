import type { IndianDistrict, IndianRegion, TourismPlace } from "@/features/tourism/types";
import type { CollectionPlaceInput } from "@/features/collections/types";

export function createCollectionPlaceInput(place: TourismPlace, district?: IndianDistrict, region?: IndianRegion | null): CollectionPlaceInput {
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
