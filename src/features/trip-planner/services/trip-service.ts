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
  type DocumentData,
  type FieldValue,
  type QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import type { Trip, TripInput, TripPlace, TripPlaceInput } from "@/features/trip-planner/types";
import { getDocumentRef, getUserTripDocumentRef, getUserTripsCollectionRef } from "@/services/firebase/firestore-service";

type TripDocument = TripInput & {
  places: StoredTripPlace[];
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
};

type StoredTripPlace = TripPlaceInput & {
  addedAt: Timestamp | FieldValue;
};

export async function createUserTrip(userId: string, input: TripInput): Promise<void> {
  const now = serverTimestamp();

  await addDoc(getUserTripsCollectionRef(userId), {
    name: input.name,
    destinationCity: input.destinationCity,
    startDate: input.startDate,
    endDate: input.endDate,
    ...(input.notes ? { notes: input.notes } : {}),
    places: [],
    createdAt: now,
    updatedAt: now,
  } satisfies TripDocument);
  await setDoc(getDocumentRef("users", userId), { updatedAt: now }, { merge: true });
}

export async function listUserTrips(userId: string): Promise<Trip[]> {
  const snapshot = await getDocs(query(getUserTripsCollectionRef(userId), orderBy("updatedAt", "desc")));
  return snapshot.docs.map(mapTripDocument);
}

export async function addPlaceToUserTrip(userId: string, tripId: string, place: TripPlaceInput): Promise<void> {
  const tripRef = getUserTripDocumentRef(userId, tripId);

  await runTransaction(tripRef.firestore, async (transaction) => {
    const snapshot = await transaction.get(tripRef);

    if (!snapshot.exists()) {
      throw new Error("Trip not found");
    }

    const currentPlaces = ((snapshot.data() as Partial<TripDocument>).places ?? []).filter(
      (currentPlace) => currentPlace.placeId !== place.placeId,
    );

    transaction.update(tripRef, {
      places: [...currentPlaces, { ...removeUndefinedValues(place), addedAt: Timestamp.now() }],
      updatedAt: serverTimestamp(),
    });
  });
}

export async function updateUserTripPlaces(userId: string, tripId: string, places: TripPlace[]): Promise<void> {
  await updateDoc(getUserTripDocumentRef(userId, tripId), {
    places: places.map((place) => ({ ...removeUndefinedValues(place), addedAt: place.addedAt })),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUserTrip(userId: string, tripId: string): Promise<void> {
  await deleteDoc(getUserTripDocumentRef(userId, tripId));
}

function mapTripDocument(snapshot: QueryDocumentSnapshot<DocumentData>): Trip {
  const data = snapshot.data() as Partial<TripDocument>;

  return {
    id: snapshot.id,
    name: data.name ?? "Untitled trip",
    destinationCity: data.destinationCity ?? "Destination not set",
    startDate: data.startDate ?? "",
    endDate: data.endDate ?? "",
    notes: data.notes,
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
