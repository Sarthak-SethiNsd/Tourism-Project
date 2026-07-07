import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/features/tourism/explore/category-card";
import { listTourismCategories, listTourismPlaces } from "@/features/tourism/services/tourism-service";

function countPlacesByCategory(categoryId: string, placeCategoryIds: string[][]) {
  return placeCategoryIds.filter((categoryIds) => categoryIds.includes(categoryId)).length;
}

export default async function CategoriesPage() {
  const [categories, places] = await Promise.all([listTourismCategories(), listTourismPlaces()]);
  const placeCategoryIds = places.map((place) => place.categoryIds);

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-24 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Categories"
            title="Browse by travel mood"
            description="Every category is powered by the same local tourism data used by Explore."
          />
          <Button asChild className="min-h-11 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/explore">Back to Explore</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/explore?category=${category.id}`} className="block h-full">
              <CategoryCard
                category={category}
                placeCount={countPlacesByCategory(category.id, placeCategoryIds)}
              />
            </Link>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
