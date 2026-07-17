import { deleteDoc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, type DocumentData, type FieldValue, type QueryDocumentSnapshot, type Timestamp } from "firebase/firestore";
import type { WishlistPlace, WishlistPlaceInput } from "@/features/wishlist/types";
import { getDocumentRef, getUserWishlistCollectionRef, getUserWishlistDocumentRef } from "@/services/firebase/firestore-service";

type WishlistDocument = WishlistPlaceInput & { addedAt: Timestamp | FieldValue; createdAt: Timestamp | FieldValue; updatedAt: Timestamp | FieldValue };

export async function addUserWishlistPlace(userId: string, place: WishlistPlaceInput): Promise<void> {
  const now = serverTimestamp();
  await setDoc(getDocumentRef("users", userId), { updatedAt: now }, { merge: true });
  await setDoc(getUserWishlistDocumentRef(userId, place.placeId), removeUndefinedValues({ ...place, addedAt: now, createdAt: now, updatedAt: now } satisfies WishlistDocument), { merge: true });
}

export async function removeUserWishlistPlace(userId: string, placeId: string): Promise<void> {
  await deleteDoc(getUserWishlistDocumentRef(userId, placeId));
}

export async function isUserWishlistPlace(userId: string, placeId: string): Promise<boolean> {
  return (await getDoc(getUserWishlistDocumentRef(userId, placeId))).exists();
}

export async function listUserWishlistPlaces(userId: string): Promise<WishlistPlace[]> {
  const snapshot = await getDocs(query(getUserWishlistCollectionRef(userId), orderBy("addedAt", "desc")));
  return snapshot.docs.map((documentSnapshot) => mapWishlistDocument(userId, documentSnapshot));
}

function mapWishlistDocument(userId: string, snapshot: QueryDocumentSnapshot<DocumentData>): WishlistPlace {
  const data = snapshot.data() as Partial<WishlistDocument>;
  return { id: snapshot.id, userId, placeId: data.placeId ?? snapshot.id, googlePlaceId: data.googlePlaceId, placeName: data.placeName ?? "Wishlist place", thumbnailUrl: data.thumbnailUrl, thumbnailPhotoReference: data.thumbnailPhotoReference, district: data.district, state: data.state, addedAt: toDate(data.addedAt), createdAt: toDate(data.createdAt), updatedAt: toDate(data.updatedAt) };
}

function toDate(value: Timestamp | FieldValue | undefined) {
  return isFirestoreTimestamp(value) ? value.toDate() : new Date();
}

function isFirestoreTimestamp(value: Timestamp | FieldValue | undefined): value is Timestamp {
  return Boolean(value && "toDate" in value && typeof value.toDate === "function");
}

function removeUndefinedValues<TValue extends object>(value: TValue): Partial<TValue> {
  return Object.fromEntries(Object.entries(value).filter(([, entryValue]) => typeof entryValue !== "undefined")) as Partial<TValue>;
}
