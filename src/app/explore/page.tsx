import { ExploreExperience } from "@/features/tourism/explore/explore-experience";
import { listTourismCategories, listTourismPlaces, listTourismRegions } from "@/features/tourism/services/tourism-service";
import type { TourismPriceLevel } from "@/features/tourism/types";

type ExplorePageProps = {
  searchParams: Promise<{
    state?: string;
    district?: string;
    scope?: string;
    category?: string;
    q?: string;
    budget?: TourismPriceLevel;
  }>;
};

const priceLevels: TourismPriceLevel[] = ["free", "budget", "moderate", "premium"];

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const [places, categories, regions] = await Promise.all([
    listTourismPlaces(),
    listTourismCategories(),
    listTourismRegions(),
  ]);

  const initialPriceLevel = params.budget && priceLevels.includes(params.budget) ? params.budget : "";

  return (
    <ExploreExperience
      places={places}
      categories={categories}
      regions={regions}
      initialFilters={{
        query: params.q ?? "",
        stateId: params.state ?? "",
        districtId: params.scope === "state" ? "" : (params.district ?? ""),
        categoryId: params.category ?? "",
        priceLevel: initialPriceLevel,
      }}
    />
  );
}
