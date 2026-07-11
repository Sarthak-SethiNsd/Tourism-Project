import { collection, doc } from "firebase/firestore";
import { getFirebaseFirestore } from "@/services/firebase/client";

export const firestoreCollections = {
  users: "users",
  places: "places",
  savedPlaces: "savedPlaces",
  searchHistory: "searchHistory",
} as const;

export function getCollectionRef(collectionName: keyof typeof firestoreCollections) {
  return collection(getFirebaseFirestore(), firestoreCollections[collectionName]);
}

export function getDocumentRef(collectionName: keyof typeof firestoreCollections, id: string) {
  return doc(getFirebaseFirestore(), firestoreCollections[collectionName], id);
}

export function getUserSavedPlacesCollectionRef(userId: string) {
  return collection(getDocumentRef("users", userId), firestoreCollections.savedPlaces);
}

export function getUserSavedPlaceDocumentRef(userId: string, placeId: string) {
  return doc(getUserSavedPlacesCollectionRef(userId), placeId);
}

export function getUserSearchHistoryCollectionRef(userId: string) {
  return collection(getDocumentRef("users", userId), firestoreCollections.searchHistory);
}

export function getUserSearchHistoryDocumentRef(userId: string, entryId: string) {
  return doc(getUserSearchHistoryCollectionRef(userId), entryId);
}
