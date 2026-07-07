import type { TourismCategory } from "@/types/tourism";

export const tourismCategories: TourismCategory[] = [
  {
    id: "heritage",
    name: "Heritage",
    description: "Forts, palaces, monuments, and living history.",
    iconName: "landmark",
    accent: "royal",
  },
  {
    id: "nature",
    name: "Nature",
    description: "Forests, waterfalls, valleys, and national parks.",
    iconName: "tree",
    accent: "forest",
  },
  {
    id: "beaches",
    name: "Beaches",
    description: "Coasts, islands, lagoons, and relaxed sea views.",
    iconName: "waves",
    accent: "water",
  },
  {
    id: "mountains",
    name: "Mountains",
    description: "Himalayan towns, hill trails, and high passes.",
    iconName: "mountain",
    accent: "earth",
  },
  {
    id: "food",
    name: "Food",
    description: "Local markets, street food, regional meals, and cafes.",
    iconName: "utensils",
    accent: "sunset",
  },
  {
    id: "spiritual",
    name: "Spiritual",
    description: "Temples, shrines, ghats, monasteries, and quiet retreats.",
    iconName: "sparkles",
    accent: "rose",
  },
];

export const tourismCategoryById = new Map(tourismCategories.map((category) => [category.id, category]));
