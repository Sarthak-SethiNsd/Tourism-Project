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

/**
 * Lifecycle state for admin-managed images.
 * – "active"   Image is published and visible in the gallery.
 * – "draft"    Image has been uploaded but is not yet published.
 * – "archived" Image has been removed from display but is retained for audit purposes.
 */
export type TourismImageStatus = "active" | "draft" | "archived";

export type TourismPlaceImage = {
  /** URL or public path of the image asset. Required. */
  url: string;

  /**
   * Stable identifier for this image record.
   * Required for admin-managed images ("admin" source); optional for all other sources.
   */
  id?: string;

  /**
   * Provider-specific reference, used to fetch full-resolution assets (e.g. a Mappls photo token).
   * Also serves as a deduplication hint for thumbnail picking in service mappers.
   */
  photoReference?: string;

  /**
   * Firebase Storage path for admin-uploaded images (e.g. "places/{placeId}/images/{imageId}.webp").
   * Not present for externally-sourced images.
   */
  storagePath?: string;

  /** Accessible alt text. Falls back to place name + index in Gallery V1. */
  alt?: string;

  /** Display credit line rendered below the gallery. */
  attribution?: string;

  /** Intrinsic width in pixels, if known. Used by the lightbox for optimal sizing. */
  width?: number;

  /** Intrinsic height in pixels, if known. Used by the lightbox for optimal sizing. */
  height?: number;

  /**
   * Provenance of the image.
   * – "local"   Bundled static asset (current default for curated place data).
   * – "admin"   Uploaded and managed by an administrator.
   * – "partner" Sourced from a content partner.
   * – "user"    Submitted by an end-user.
   * – "mappls"  Retrieved from the Mappls Places API (excluded from the local gallery).
   */
  source?: "local" | "admin" | "mappls" | "partner" | "user";

  /**
   * Explicit display order (0-based ascending).
   * When present, the gallery should sort by this value before rendering.
   * Omitted for statically-ordered arrays where position is the implicit order.
   */
  order?: number;

  /**
   * Whether this image should be displayed in the gallery.
   * Defaults to true (visible) when omitted so that all existing images without this field remain visible.
   */
  isVisible?: boolean;

  /**
   * Lifecycle state.
   * Omitted for legacy/static images, which are treated as "active" implicitly.
   */
  status?: TourismImageStatus;
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

export type TourismPlaceReview = {
  id: string;
  reviewerName: string;
  reviewerProfilePhotoUrl?: string;
  rating: number;
  relativePublishTimeDescription: string;
  text: string;
  publishTime?: string;
};

export type TourismPlace = {
  id: EntityId;
  name: string;
  mapplsPlaceId?: string;
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
  reviews?: TourismPlaceReview[];
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
