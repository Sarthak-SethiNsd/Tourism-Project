/**
 * Firebase Storage path conventions for the India Tourism Discovery project.
 *
 * All paths are relative to the project's default Storage bucket root.
 * Keep this module free of Firebase SDK imports — it is a pure string-building
 * helper so that path definitions can be imported in server components,
 * service workers, or test environments without initialising Firebase.
 *
 * Bucket layout:
 *
 *   tourism/
 *     places/
 *       {placeId}/
 *         images/
 *           {imageId}          ← primary asset (e.g. .webp, .jpg)
 *           {imageId}_thumb    ← future: server-side thumbnail variant
 *
 * Rules:
 *   – placeId   matches the TourismPlace.id value (e.g. "amber-fort-jaipur")
 *   – imageId   is a caller-supplied stable identifier (nanoid / uuid recommended)
 *   – Segments never contain trailing slashes
 *   – Extension is part of imageId (e.g. "abc123.webp")
 */

/** Root namespace for all tourism media inside the Storage bucket. */
const TOURISM_STORAGE_ROOT = "tourism" as const;

/** Sub-namespace for place images. */
const PLACES_SEGMENT = "places" as const;

/** Sub-namespace for image assets inside a place folder. */
const IMAGES_SEGMENT = "images" as const;

/**
 * Returns the Storage folder path for all images belonging to a place.
 *
 * @example
 * tourismPlaceImagesFolder("amber-fort-jaipur")
 * // → "tourism/places/amber-fort-jaipur/images"
 */
export function tourismPlaceImagesFolder(placeId: string): string {
  return `${TOURISM_STORAGE_ROOT}/${PLACES_SEGMENT}/${placeId}/${IMAGES_SEGMENT}`;
}

/**
 * Returns the full Storage path for a specific image asset.
 *
 * @param placeId  The stable TourismPlace.id
 * @param imageId  A stable image identifier including file extension (e.g. "abc123.webp")
 *
 * @example
 * tourismPlaceImagePath("amber-fort-jaipur", "abc123.webp")
 * // → "tourism/places/amber-fort-jaipur/images/abc123.webp"
 */
export function tourismPlaceImagePath(placeId: string, imageId: string): string {
  return `${tourismPlaceImagesFolder(placeId)}/${imageId}`;
}

/**
 * Extracts the imageId segment from a full Storage path previously constructed
 * by {@link tourismPlaceImagePath}.  Returns `undefined` if the path does not
 * match the expected convention.
 *
 * @example
 * parseTourismPlaceImageId("tourism/places/amber-fort-jaipur/images/abc123.webp")
 * // → "abc123.webp"
 */
export function parseTourismPlaceImageId(storagePath: string): string | undefined {
  const prefix = `${TOURISM_STORAGE_ROOT}/${PLACES_SEGMENT}/`;
  const suffix = `/${IMAGES_SEGMENT}/`;
  const suffixIndex = storagePath.lastIndexOf(suffix);

  if (!storagePath.startsWith(prefix) || suffixIndex === -1) {
    return undefined;
  }

  const imageId = storagePath.slice(suffixIndex + suffix.length);

  return imageId || undefined;
}
