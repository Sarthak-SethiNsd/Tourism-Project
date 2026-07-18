import { deleteDoc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, type DocumentData, type FieldValue, type QueryDocumentSnapshot, type Timestamp } from "firebase/firestore";
import type { VisitedPlace, VisitedPlaceInput } from "@/features/visited-places/types";
import { getDocumentRef, getUserVisitedCollectionRef, getUserVisitedDocumentRef } from "@/services/firebase/firestore-service";

type VisitedPlaceDocument = VisitedPlaceInput & { visitedAt: Timestamp | FieldValue; createdAt: Timestamp | FieldValue; updatedAt: Timestamp | FieldValue };

export async function addUserVisitedPlace(userId: string, place: VisitedPlaceInput): Promise<void> {
  const now = serverTimestamp();
  await setDoc(getDocumentRef("users", userId), { updatedAt: now }, { merge: true });
  await setDoc(getUserVisitedDocumentRef(userId, place.placeId), removeUndefinedValues({ ...place, visitedAt: now, createdAt: now, updatedAt: now } satisfies VisitedPlaceDocument), { merge: true });
}

export async function removeUserVisitedPlace(userId: string, placeId: string): Promise<void> { await deleteDoc(getUserVisitedDocumentRef(userId, placeId)); }
export async function isUserVisitedPlace(userId: string, placeId: string): Promise<boolean> { return (await getDoc(getUserVisitedDocumentRef(userId, placeId))).exists(); }
export async function listUserVisitedPlaces(userId: string): Promise<VisitedPlace[]> {
  const snapshot = await getDocs(query(getUserVisitedCollectionRef(userId), orderBy("visitedAt", "desc")));
  return snapshot.docs.map((documentSnapshot) => mapVisitedPlaceDocument(userId, documentSnapshot));
}

function mapVisitedPlaceDocument(userId: string, snapshot: QueryDocumentSnapshot<DocumentData>): VisitedPlace {
  const data = snapshot.data() as Partial<VisitedPlaceDocument>;
  return { id: snapshot.id, userId, placeId: data.placeId ?? snapshot.id, googlePlaceId: data.googlePlaceId, placeName: data.placeName ?? "Visited place", thumbnailUrl: data.thumbnailUrl, thumbnailPhotoReference: data.thumbnailPhotoReference, district: data.district, state: data.state, visitedAt: toDate(data.visitedAt), createdAt: toDate(data.createdAt), updatedAt: toDate(data.updatedAt) };
}
function toDate(value: Timestamp | FieldValue | undefined) { return isFirestoreTimestamp(value) ? value.toDate() : new Date(); }
function isFirestoreTimestamp(value: Timestamp | FieldValue | undefined): value is Timestamp { return Boolean(value && "toDate" in value && typeof value.toDate === "function"); }
function removeUndefinedValues<TValue extends object>(value: TValue): Partial<TValue> { return Object.fromEntries(Object.entries(value).filter(([, entryValue]) => typeof entryValue !== "undefined")) as Partial<TValue>; }
