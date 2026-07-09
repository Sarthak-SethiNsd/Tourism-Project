import {
  deleteDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type FieldValue,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import type { SavePlaceInput, SavedPlace, SavedPlaceLocation } from "@/features/saved-places/types";
import {
  getDocumentRef,
  getUserSavedPlaceDocumentRef,
  getUserSavedPlacesCollectionRef,
} from "@/services/firebase/firestore-service";

type SavedPlaceDocument = {
  placeId: string;
  googlePlaceId?: string;
  name: string;
  photoUrl?: string;
  photoReference?: string;
  location?: SavedPlaceLocation;
  savedAt: Timestamp | FieldValue;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
};

export async function saveUserPlace(userId: string, place: SavePlaceInput): Promise<void> {
  const now = serverTimestamp();
  const location = place.location ? cleanLocation(place.location) : undefined;

  await setDoc(
    getDocumentRef("users", userId),
    {
      updatedAt: now,
    },
    { merge: true },
  );

  await setDoc(
    getUserSavedPlaceDocumentRef(userId, place.placeId),
    removeUndefinedValues({
      placeId: place.placeId,
      googlePlaceId: place.googlePlaceId,
      name: place.name,
      photoUrl: place.photoUrl,
      photoReference: place.photoReference,
      location,
      savedAt: now,
      createdAt: now,
      updatedAt: now,
    } satisfies SavedPlaceDocument),
    { merge: true },
  );
}

export async function unsaveUserPlace(userId: string, placeId: string): Promise<void> {
  await deleteDoc(getUserSavedPlaceDocumentRef(userId, placeId));
}

export async function isUserPlaceSaved(userId: string, placeId: string): Promise<boolean> {
  const snapshot = await getDoc(getUserSavedPlaceDocumentRef(userId, placeId));

  return snapshot.exists();
}

export async function listSavedPlaces(userId: string): Promise<SavedPlace[]> {
  const snapshot = await getDocs(query(getUserSavedPlacesCollectionRef(userId), orderBy("savedAt", "desc")));

  return snapshot.docs.map((documentSnapshot) => mapSavedPlaceDocument(userId, documentSnapshot));
}

function mapSavedPlaceDocument(userId: string, snapshot: QueryDocumentSnapshot<DocumentData>): SavedPlace {
  const data = snapshot.data() as Partial<SavedPlaceDocument>;

  return {
    id: snapshot.id,
    userId,
    placeId: data.placeId ?? snapshot.id,
    googlePlaceId: data.googlePlaceId,
    name: data.name ?? "Saved place",
    photoUrl: data.photoUrl,
    photoReference: data.photoReference,
    location: data.location,
    savedAt: toDate(data.savedAt),
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

function cleanLocation(location: SavedPlaceLocation): SavedPlaceLocation {
  return removeUndefinedValues(location) as SavedPlaceLocation;
}

function removeUndefinedValues<TValue extends object>(value: TValue): Partial<TValue> {
  return Object.fromEntries(Object.entries(value).filter(([, entryValue]) => typeof entryValue !== "undefined")) as Partial<TValue>;
}
