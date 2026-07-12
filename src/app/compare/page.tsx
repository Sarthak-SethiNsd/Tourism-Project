import { ComparePlacesExperience } from "@/features/compare-places/compare-places-experience";
import { listTourismCategories } from "@/features/tourism/services/tourism-service";

export default async function ComparePlacesPage() {
  const categories = await listTourismCategories();

  return <ComparePlacesExperience categories={categories} />;
}
