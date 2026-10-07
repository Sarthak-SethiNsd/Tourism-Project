/**
 * Firebase Storage service for tourism place media.
 *
 * This module provides the server-side / service-layer abstraction for
 * admin-managed image assets.  It intentionally does NOT:
 *  – expose any upload UI
 *  – reference Gallery V1 or local curated images
 *  – migrate existing static image data
 *  – implement admin authentication (that is Phase 3)
 *
 * All functions are client-safe (they call the Firebase JS SDK, not the
 * Firebase Admin SDK), but they should only be invoked from code paths that
 * have already verified the caller has administrative intent.
 * Route-level RBAC is deferred to Phase 3.
 *
 * Graceful degradation: every exported function returns a descriptive error
 * (not a thrown exception) when Firebase Storage is not configured, so the
 * rest of the app continues to work without a Storage bucket in development.
 */

import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytes,
  uploadBytesResumable,
  type FullMetadata,
  type StorageReference,
  type UploadMetadata,
  type UploadResult,
  type UploadTask,
} from "firebase/storage";
import { getFirebaseStorage } from "@/services/firebase/client";
import { hasFirebaseStorageConfig } from "@/config/firebase";
import { tourismPlaceImagePath } from "@/services/firebase/storage-paths";

// ---------------------------------------------------------------------------
// Re-export path helpers for convenience so callers only need one import.
// ---------------------------------------------------------------------------
export { tourismPlaceImagePath, tourismPlaceImagesFolder } from "@/services/firebase/storage-paths";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Input descriptor for a single image upload operation. */
export type PlaceImageUploadInput = {
  /** The stable TourismPlace.id this image belongs to. */
  placeId: string;
  /**
   * A caller-supplied stable image identifier that will become the final
   * path segment in Storage (e.g. "abc123.webp").  Must be unique within
   * the place's image folder.  The caller is responsible for generating this
   * (nanoid / crypto.randomUUID are recommended).
   */
  imageId: string;
  /** Raw bytes of the image to upload. */
  data: Blob | Uint8Array | ArrayBuffer;
  /** Optional metadata to store alongside the object (content-type, custom metadata). */
  metadata?: UploadMetadata;
};

/** Result returned after a successful upload. */
export type PlaceImageUploadResult = {
  /** Full Firebase Storage path (e.g. "tourism/places/{placeId}/images/{imageId}"). */
  storagePath: string;
  /** Public download URL suitable for use in TourismPlaceImage.url. */
  downloadUrl: string;
  /** Raw Firebase upload result for callers that need it. */
  uploadResult: UploadResult;
};

/** Thin wrapper around a StorageReference exposing the convenience methods below. */
export type PlaceImageRef = {
  /** Full path string (same value as TourismPlaceImage.storagePath). */
  storagePath: string;
  /** Underlying Firebase StorageReference. */
  ref: StorageReference;
};

// ---------------------------------------------------------------------------
// Internal guard
// ---------------------------------------------------------------------------

function assertStorageAvailable(): void {
  if (!hasFirebaseStorageConfig) {
    throw new Error(
      "Firebase Storage is not configured. " +
        "Set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in your environment variables.",
    );
  }
}

// ---------------------------------------------------------------------------
// Reference helpers
// ---------------------------------------------------------------------------

/**
 * Returns a thin wrapper around the Firebase StorageReference for a specific
 * place image path.  Use this when you need the raw ref for advanced operations.
 */
export function getPlaceImageRef(placeId: string, imageId: string): PlaceImageRef {
  assertStorageAvailable();
  const storagePath = tourismPlaceImagePath(placeId, imageId);

  return {
    storagePath,
    ref: ref(getFirebaseStorage(), storagePath),
  };
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

/**
 * Uploads a single place image to Firebase Storage and returns its download URL.
 *
 * This is an atomic, awaitable upload.  Use {@link uploadPlaceImageResumable}
 * when you need progress reporting (e.g. a future upload UI).
 *
 * @throws When Firebase Storage is not configured or the upload fails.
 */
export async function uploadPlaceImage(
  input: PlaceImageUploadInput,
): Promise<PlaceImageUploadResult> {
  assertStorageAvailable();

  const storagePath = tourismPlaceImagePath(input.placeId, input.imageId);
  const storageRef = ref(getFirebaseStorage(), storagePath);
  const uploadResult = await uploadBytes(storageRef, input.data, input.metadata);
  const downloadUrl = await getDownloadURL(uploadResult.ref);

  return { storagePath, downloadUrl, uploadResult };
}

/**
 * Starts a resumable upload task for a single place image.
 * Returns the raw {@link UploadTask} so that future upload UI components can
 * subscribe to progress events via `.on("state_changed", ...)`.
 *
 * The caller must await `getDownloadURL(task.snapshot.ref)` after the task
 * completes to obtain the public URL.
 */
export function uploadPlaceImageResumable(
  input: Omit<PlaceImageUploadInput, "data"> & { data: Blob | Uint8Array | ArrayBuffer },
): UploadTask {
  assertStorageAvailable();

  const storagePath = tourismPlaceImagePath(input.placeId, input.imageId);
  const storageRef = ref(getFirebaseStorage(), storagePath);

  return uploadBytesResumable(storageRef, input.data, input.metadata);
}

// ---------------------------------------------------------------------------
// Retrieve
// ---------------------------------------------------------------------------

/**
 * Returns the current public download URL for an existing place image.
 *
 * @throws When Storage is not configured, or the object does not exist.
 */
export async function getPlaceImageDownloadUrl(
  placeId: string,
  imageId: string,
): Promise<string> {
  assertStorageAvailable();

  const { ref: storageRef } = getPlaceImageRef(placeId, imageId);

  return getDownloadURL(storageRef);
}

/**
 * Returns the full Storage metadata for a place image.
 * Useful for verifying upload integrity or reading custom metadata fields.
 *
 * @throws When Storage is not configured, or the object does not exist.
 */
export async function getPlaceImageMetadata(
  placeId: string,
  imageId: string,
): Promise<FullMetadata> {
  assertStorageAvailable();

  const { ref: storageRef } = getPlaceImageRef(placeId, imageId);

  return getMetadata(storageRef);
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

/**
 * Permanently deletes a single place image from Firebase Storage.
 *
 * This operation is irreversible.  The caller is responsible for also
 * removing or archiving the corresponding {@link TourismPlaceImage} record
 * in Firestore (or static data) to prevent broken references in the gallery.
 *
 * @throws When Storage is not configured, or the object does not exist.
 */
export async function deletePlaceImage(
  placeId: string,
  imageId: string,
): Promise<void> {
  assertStorageAvailable();

  const { ref: storageRef } = getPlaceImageRef(placeId, imageId);

  await deleteObject(storageRef);
}

// ---------------------------------------------------------------------------
// Config availability check (safe to call without throwing)
// ---------------------------------------------------------------------------

/**
 * Returns `true` when Firebase Storage is configured and available.
 * Use this to conditionally show Storage-dependent UI without throwing.
 */
export function isStorageAvailable(): boolean {
  return hasFirebaseStorageConfig;
}
