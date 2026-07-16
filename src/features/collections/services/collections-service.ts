import {
  addDoc,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  Timestamp,
  type DocumentData,
  type FieldValue,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import type { CollectionInput, CollectionPlace, CollectionPlaceInput, PlaceCollection } from "@/features/collections/types";
import { getDocumentRef, getUserCollectionDocumentRef, getUserCollectionsCollectionRef } from "@/services/firebase/firestore-service";

type CollectionDocument = CollectionInput & {
  places: StoredCollectionPlace[];
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
};

type StoredCollectionPlace = CollectionPlaceInput & {
  addedAt: Timestamp | FieldValue;
};

export async function createUserCollection(userId: string, input: CollectionInput): Promise<void> {
  const now = serverTimestamp();
  await addDoc(getUserCollectionsCollectionRef(userId), {
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    places: [],
    createdAt: now,
    updatedAt: now,
  } satisfies CollectionDocument);
  await setDoc(getDocumentRef("users", userId), { updatedAt: now }, { merge: true });
}

export async function listUserCollections(userId: string): Promise<PlaceCollection[]> {
  const snapshot = await getDocs(query(getUserCollectionsCollectionRef(userId), orderBy("updatedAt", "desc")));
  return snapshot.docs.map(mapCollectionDocument);
}

export async function addPlaceToUserCollection(userId: string, collectionId: string, place: CollectionPlaceInput): Promise<void> {
  const collectionRef = getUserCollectionDocumentRef(userId, collectionId);
  await runTransaction(collectionRef.firestore, async (transaction) => {
    const snapshot = await transaction.get(collectionRef);
    if (!snapshot.exists()) {
      throw new Error("Collection not found");
    }

    const currentPlaces = ((snapshot.data() as Partial<CollectionDocument>).places ?? []).filter(
      (item) => item.placeId !== place.placeId,
    );
    transaction.update(collectionRef, {
      places: [...currentPlaces, { ...removeUndefinedValues(place), addedAt: Timestamp.now() }],
      updatedAt: serverTimestamp(),
    });
  });
}

export async function removePlaceFromUserCollection(userId: string, collectionId: string, places: CollectionPlace[]): Promise<void> {
  await updateDoc(getUserCollectionDocumentRef(userId, collectionId), {
    places: places.map((place) => ({ ...removeUndefinedValues(place), addedAt: place.addedAt })),
    updatedAt: serverTimestamp(),
  });
}

export async function renameUserCollection(userId: string, collectionId: string, input: CollectionInput): Promise<void> {
  await updateDoc(getUserCollectionDocumentRef(userId, collectionId), {
    name: input.name,
    ...(input.description ? { description: input.description } : { description: null }),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUserCollection(userId: string, collectionId: string): Promise<void> {
  await deleteDoc(getUserCollectionDocumentRef(userId, collectionId));
}

function mapCollectionDocument(snapshot: QueryDocumentSnapshot<DocumentData>): PlaceCollection {
  const data = snapshot.data() as Partial<CollectionDocument>;
  return {
    id: snapshot.id,
    name: data.name ?? "Untitled collection",
    description: data.description,
    places: (data.places ?? []).map((place) => ({
      placeId: place.placeId,
      googlePlaceId: place.googlePlaceId,
      placeName: place.placeName,
      thumbnailUrl: place.thumbnailUrl,
      thumbnailPhotoReference: place.thumbnailPhotoReference,
      district: place.district,
      state: place.state,
      addedAt: toDate(place.addedAt),
    })),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

function toDate(value: Timestamp | FieldValue | undefined) {
  return isFirestoreTimestamp(value) ? value.toDate() : new Date();
}

function isFirestoreTimestamp(value: Timestamp | FieldValue | undefined): value is Timestamp {
  return Boolean(value && "toDate" in value && typeof value.toDate === "function");
}

function removeUndefinedValues<TValue extends object>(value: TValue): Partial<TValue> {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => typeof item !== "undefined")) as Partial<TValue>;
}
