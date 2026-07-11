import {
  addDoc,
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
import type { SearchHistoryEntry, SearchHistoryInput } from "@/features/search-history/types";
import {
  getDocumentRef,
  getUserSearchHistoryCollectionRef,
  getUserSearchHistoryDocumentRef,
} from "@/services/firebase/firestore-service";

type SearchHistoryDocument = SearchHistoryInput & {
  searchedAt: Timestamp | FieldValue;
};

const MAX_SEARCH_HISTORY_DELETE_BATCH_SIZE = 450;

export async function saveUserSearchHistoryEntry(userId: string, input: SearchHistoryInput): Promise<void> {
  const now = serverTimestamp();

  await setDoc(
    getDocumentRef("users", userId),
    {
      updatedAt: now,
    },
    { merge: true },
  );

  await addDoc(
    getUserSearchHistoryCollectionRef(userId),
    removeUndefinedValues({
      placeId: input.placeId,
      googlePlaceId: input.googlePlaceId,
      placeName: input.placeName,
      district: input.district,
      state: input.state,
      country: input.country,
      primaryCategory: input.primaryCategory,
      thumbnailPhotoReference: input.thumbnailPhotoReference,
      thumbnailUrl: input.thumbnailUrl,
      searchedAt: now,
    } satisfies SearchHistoryDocument),
  );
}

export async function listUserSearchHistory(userId: string): Promise<SearchHistoryEntry[]> {
  const snapshot = await getDocs(query(getUserSearchHistoryCollectionRef(userId), orderBy("searchedAt", "desc")));

  return snapshot.docs.map((documentSnapshot) => mapSearchHistoryDocument(userId, documentSnapshot));
}

export async function deleteUserSearchHistoryEntry(userId: string, entryId: string): Promise<void> {
  await deleteDoc(getUserSearchHistoryDocumentRef(userId, entryId));
}

export async function clearUserSearchHistory(userId: string): Promise<void> {
  const snapshot = await getDocs(
    query(getUserSearchHistoryCollectionRef(userId), orderBy("searchedAt", "desc"), limit(MAX_SEARCH_HISTORY_DELETE_BATCH_SIZE)),
  );

  if (snapshot.empty) {
    return;
  }

  const batch = writeBatch(getDocumentRef("users", userId).firestore);

  for (const documentSnapshot of snapshot.docs) {
    batch.delete(documentSnapshot.ref);
  }

  await batch.commit();

  if (snapshot.size === MAX_SEARCH_HISTORY_DELETE_BATCH_SIZE) {
    await clearUserSearchHistory(userId);
  }
}

function mapSearchHistoryDocument(userId: string, snapshot: QueryDocumentSnapshot<DocumentData>): SearchHistoryEntry {
  const data = snapshot.data() as Partial<SearchHistoryDocument>;

  return {
    id: snapshot.id,
    userId,
    placeId: data.placeId ?? "",
    googlePlaceId: data.googlePlaceId,
    placeName: data.placeName ?? "Searched place",
    district: data.district,
    state: data.state,
    country: data.country ?? "India",
    primaryCategory: data.primaryCategory,
    thumbnailPhotoReference: data.thumbnailPhotoReference,
    thumbnailUrl: data.thumbnailUrl,
    searchedAt: toDate(data.searchedAt),
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
