import type { EntityId } from "@/types/common";

export type TourismCategoryId = string;

export type TourismCategory = {
  id: TourismCategoryId;
  name: string;
  description: string;
  iconName: "landmark" | "mountain" | "waves" | "tree" | "utensils" | "sparkles";
  accent: "royal" | "sunset" | "water" | "forest" | "rose" | "earth";
};

export type TourismPriceLevel = "free" | "budget" | "moderate" | "premium";

export type TourismCoordinates = {
  latitude: number | null;
  longitude: number | null;
};

export type TourismPlaceImage = {
  url: string;
  photoReference?: string;
  alt?: string;
  attribution?: string;
  width?: number;
  height?: number;
  source?: "local" | "google" | "partner" | "user";
};

export type TourismOpeningPeriod = {
  day: number;
  openTime?: string;
  closeTime?: string;
};

export type TourismOpeningHours = {
  openNow?: boolean;
  weekdayText?: string[];
  periods?: TourismOpeningPeriod[];
};

export type TourismContactInfo = {
  phone?: string;
  email?: string;
};

export type TourismAddress = {
  formattedAddress?: string;
  streetAddress?: string;
  locality?: string;
  district?: string;
  region?: string;
  country?: string;
  postalCode?: string;
};

export type TourismBudget = {
  priceLevel?: TourismPriceLevel;
  displayText?: string;
  minAmount?: number;
  maxAmount?: number;
  currencyCode?: string;
};

export type TourismPlace = {
  id: EntityId;
  name: string;
  googlePlaceId?: string;
  stateId: EntityId;
  districtId: EntityId;
  districtName?: string;
  address?: TourismAddress;
  categoryIds: TourismCategoryId[];
  summary: string;
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  bestSeason?: string;
  idealDuration: string;
  timeRequired?: string;
  priceLevel: TourismPriceLevel;
  approximateBudget?: string;
  budget?: TourismBudget;
  rating: number;
  reviewsCount?: number;
  tags: string[];
  isFeatured?: boolean;
  imageUrl?: string;
  images?: TourismPlaceImage[];
  coordinates?: TourismCoordinates;
  openingHours?: TourismOpeningHours;
  contactInfo?: TourismContactInfo;
  websiteUrl?: string;
  nearbyAttractionIds?: EntityId[];
  nearbyAttractions?: string[];
  accessibility?: string[];
  facilities?: string[];
  distanceText?: string;
  travelTimeText?: string;
};

export type TourismLocationFilter = {
  stateId?: EntityId;
  districtId?: EntityId;
  categoryId?: TourismCategoryId;
  query?: string;
  priceLevel?: TourismPriceLevel;
};
