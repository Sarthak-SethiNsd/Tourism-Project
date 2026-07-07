import { tourismCategories, tourismCategoryById } from "@/features/tourism/data/categories/tourism-categories";
import { tourismPlaceById, tourismPlaces } from "@/features/tourism/data/places/tourism-places";
import { staticRegionDataSource } from "@/features/tourism/data/sources/static-region-data-source";
import type {
  TourismGeoPoint,
  TourismPlacePhoto,
  TourismProvider,
  TourismRouteSummary,
} from "@/features/tourism/providers/tourism-provider";
import type { IndianDistrict, IndianRegion } from "@/features/tourism/types/region";
import { filterTourismPlaces } from "@/features/tourism/utils/place-filters";
import type { TourismCategory, TourismLocationFilter, TourismPlace } from "@/types/tourism";

export class LocalTourismProvider implements TourismProvider {
  readonly name = "local" as const;

  async listCategories(): Promise<TourismCategory[]> {
    return tourismCategories;
  }

  async getCategoryById(categoryId: string): Promise<TourismCategory | null> {
    return tourismCategoryById.get(categoryId) ?? null;
  }

  async listPlaces(filters?: TourismLocationFilter): Promise<TourismPlace[]> {
    return filterTourismPlaces(tourismPlaces, filters);
  }

  async getPlaceById(placeId: string): Promise<TourismPlace | null> {
    return tourismPlaceById.get(placeId) ?? null;
  }

  async listFeaturedPlaces(): Promise<TourismPlace[]> {
    return tourismPlaces.filter((place) => place.isFeatured);
  }

  async listRegions(): Promise<IndianRegion[]> {
    return staticRegionDataSource.listRegions();
  }

  async listStates(): Promise<IndianRegion[]> {
    const regions = await this.listRegions();

    return regions.filter((region) => region.type === "state");
  }

  async listUnionTerritories(): Promise<IndianRegion[]> {
    const regions = await this.listRegions();

    return regions.filter((region) => region.type === "union_territory");
  }

  async getRegionById(regionId: string): Promise<IndianRegion | null> {
    return staticRegionDataSource.getRegionById(regionId);
  }

  async listDistrictsByRegion(regionId: string): Promise<IndianDistrict[]> {
    return staticRegionDataSource.listDistrictsByRegion(regionId);
  }

  async searchExternalPlaces(): Promise<TourismPlace[]> {
    return [];
  }

  async getExternalPlaceDetails(): Promise<TourismPlace | null> {
    return null;
  }

  async listExternalPlacePhotos(): Promise<TourismPlacePhoto[]> {
    return [];
  }

  async geocodeAddress(): Promise<TourismGeoPoint | null> {
    return null;
  }

  async getRouteSummary(): Promise<TourismRouteSummary | null> {
    return null;
  }

  async getDistanceMatrix(): Promise<TourismRouteSummary[]> {
    return [];
  }
}

export const localTourismProvider = new LocalTourismProvider();
