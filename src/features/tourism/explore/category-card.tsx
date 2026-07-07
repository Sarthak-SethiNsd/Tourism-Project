import { Landmark, Mountain, Sparkles, Trees, Utensils, Waves } from "lucide-react";
import type { TourismCategory } from "@/features/tourism/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  category: TourismCategory;
  placeCount?: number;
  isActive?: boolean;
  onSelect?: (categoryId: string) => void;
};

const accentClassByName: Record<TourismCategory["accent"], string> = {
  royal: "bg-primary/10 text-primary",
  sunset: "bg-accent/20 text-accent-foreground",
  water: "bg-cyan-100 text-cyan-800",
  forest: "bg-emerald-100 text-emerald-800",
  rose: "bg-rose-100 text-rose-800",
  earth: "bg-stone-200 text-stone-800",
};

const iconByName = {
  landmark: Landmark,
  mountain: Mountain,
  waves: Waves,
  tree: Trees,
  utensils: Utensils,
  sparkles: Sparkles,
};

export function CategoryCard({ category, placeCount, isActive = false, onSelect }: CategoryCardProps) {
  const Icon = iconByName[category.iconName];
  const content = (
    <Card
      className={cn(
        "h-full border-primary/10 bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        isActive && "border-primary bg-primary/5",
      )}
    >
      <CardContent className="flex h-full flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <span className={cn("flex size-11 items-center justify-center rounded-lg", accentClassByName[category.accent])}>
            <Icon className="size-5" aria-hidden />
          </span>
          {typeof placeCount === "number" ? (
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {placeCount} places
            </span>
          ) : null}
        </div>
        <div>
          <h3 className="text-base font-semibold">{category.name}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (!onSelect) {
    return content;
  }

  return (
    <button type="button" className="h-full text-left" onClick={() => onSelect(category.id)} aria-pressed={isActive}>
      {content}
    </button>
  );
}
