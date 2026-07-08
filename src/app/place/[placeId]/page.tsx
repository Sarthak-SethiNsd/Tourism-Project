import { notFound } from "next/navigation";
import { PlaceDetailsPage } from "@/features/tourism/place-details/place-details-page";
import {
  getTourismPlaceById,
  getTourismRegionById,
  listTourismCategories,
  listTourismDistrictsByRegion,
  listTourismPlaces,
} from "@/features/tourism/services/tourism-service";

type PlaceDetailPageProps = {
  params: Promise<{ placeId: string }>;
};

export async function generateStaticParams() {
  const places = await listTourismPlaces();

  return places.map((place) => ({ placeId: place.id }));
}

export async function generateMetadata({ params }: PlaceDetailPageProps) {
  const { placeId } = await params;
  const place = await getTourismPlaceById(placeId);

  if (!place) {
    return { title: "Place not found" };
  }

  return {
    title: place.name,
    description: place.summary || place.description,
  };
}

export default async function PlaceDetailRoute({ params }: PlaceDetailPageProps) {
  const { placeId } = await params;
  const place = await getTourismPlaceById(placeId);

  if (!place) {
    notFound();
  }

  const [allCategories, region, districts] = await Promise.all([
    listTourismCategories(),
    getTourismRegionById(place.stateId),
    listTourismDistrictsByRegion(place.stateId),
  ]);

  const categories = allCategories.filter((category) => place.categoryIds.includes(category.id));
  const district = districts.find((item) => item.id === place.districtId);

  return <PlaceDetailsPage place={place} categories={categories} region={region} district={district} />;
}
