import {
  deleteDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
  type DocumentData,
  type FieldValue,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import type { RecentlyViewedPlace, RecentlyViewedPlaceInput } from "@/features/recently-viewed/types";
import {
  getDocumentRef,
  getUserRecentlyViewedCollectionRef,
  getUserRecentlyViewedDocumentRef,
} from "@/services/firebase/firestore-service";

const MAX_RECENTLY_VIEWED_PLACES = 20;

type RecentlyViewedDocument = RecentlyViewedPlaceInput & {
  viewedAt: Timestamp | FieldValue;
};

export async function saveUserRecentlyViewedPlace(userId: string, input: RecentlyViewedPlaceInput): Promise<void> {
  const now = serverTimestamp();

  await setDoc(getDocumentRef("users", userId), { updatedAt: now }, { merge: true });
  await setDoc(
    getUserRecentlyViewedDocumentRef(userId, input.placeId),
    removeUndefinedValues({ ...input, viewedAt: now } satisfies RecentlyViewedDocument),
  );

  const snapshot = await getDocs(
    query(getUserRecentlyViewedCollectionRef(userId), orderBy("viewedAt", "desc"), limit(MAX_RECENTLY_VIEWED_PLACES + 1)),
  );

  if (snapshot.size <= MAX_RECENTLY_VIEWED_PLACES) {
    return;
  }

  const batch = writeBatch(getDocumentRef("users", userId).firestore);
  snapshot.docs.slice(MAX_RECENTLY_VIEWED_PLACES).forEach((documentSnapshot) => batch.delete(documentSnapshot.ref));
  await batch.commit();
}

export async function listUserRecentlyViewedPlaces(userId: string): Promise<RecentlyViewedPlace[]> {
  const snapshot = await getDocs(
    query(getUserRecentlyViewedCollectionRef(userId), orderBy("viewedAt", "desc"), limit(MAX_RECENTLY_VIEWED_PLACES)),
  );

  return snapshot.docs.map(mapRecentlyViewedDocument);
}

export async function deleteUserRecentlyViewedPlace(userId: string, placeId: string): Promise<void> {
  await deleteDoc(getUserRecentlyViewedDocumentRef(userId, placeId));
}

export async function clearUserRecentlyViewedPlaces(userId: string): Promise<void> {
  const snapshot = await getDocs(getUserRecentlyViewedCollectionRef(userId));

  if (snapshot.empty) {
    return;
  }

  const batch = writeBatch(getDocumentRef("users", userId).firestore);
  snapshot.docs.forEach((documentSnapshot) => batch.delete(documentSnapshot.ref));
  await batch.commit();
}

function mapRecentlyViewedDocument(snapshot: QueryDocumentSnapshot<DocumentData>): RecentlyViewedPlace {
  const data = snapshot.data() as Partial<RecentlyViewedDocument>;

  return {
    placeId: data.placeId ?? snapshot.id,
    googlePlaceId: data.googlePlaceId,
    placeName: data.placeName ?? "Recently viewed place",
    thumbnailPhotoReference: data.thumbnailPhotoReference,
    thumbnailUrl: data.thumbnailUrl,
    district: data.district,
    state: data.state,
    country: data.country ?? "India",
    viewedAt: toDate(data.viewedAt),
  };
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
