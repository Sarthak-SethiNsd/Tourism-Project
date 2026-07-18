import { collection, doc } from "firebase/firestore";
import { getFirebaseFirestore } from "@/services/firebase/client";

export const firestoreCollections = {
  users: "users",
  places: "places",
  savedPlaces: "savedPlaces",
  wishlist: "wishlist",
  visited: "visited",
  searchHistory: "searchHistory",
  recentlyViewed: "recentlyViewed",
  trips: "trips",
  collections: "collections",
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

export function getUserWishlistCollectionRef(userId: string) {
  return collection(getDocumentRef("users", userId), firestoreCollections.wishlist);
}

export function getUserWishlistDocumentRef(userId: string, placeId: string) {
  return doc(getUserWishlistCollectionRef(userId), placeId);
}

export function getUserVisitedCollectionRef(userId: string) {
  return collection(getDocumentRef("users", userId), firestoreCollections.visited);
}

export function getUserVisitedDocumentRef(userId: string, placeId: string) {
  return doc(getUserVisitedCollectionRef(userId), placeId);
}

export function getUserSearchHistoryCollectionRef(userId: string) {
  return collection(getDocumentRef("users", userId), firestoreCollections.searchHistory);
}

export function getUserSearchHistoryDocumentRef(userId: string, entryId: string) {
  return doc(getUserSearchHistoryCollectionRef(userId), entryId);
}

export function getUserRecentlyViewedCollectionRef(userId: string) {
  return collection(getDocumentRef("users", userId), firestoreCollections.recentlyViewed);
}

export function getUserRecentlyViewedDocumentRef(userId: string, placeId: string) {
  return doc(getUserRecentlyViewedCollectionRef(userId), placeId);
}

export function getUserTripsCollectionRef(userId: string) {
  return collection(getDocumentRef("users", userId), firestoreCollections.trips);
}

export function getUserTripDocumentRef(userId: string, tripId: string) {
  return doc(getUserTripsCollectionRef(userId), tripId);
}

export function getUserCollectionsCollectionRef(userId: string) {
  return collection(getDocumentRef("users", userId), firestoreCollections.collections);
}

export function getUserCollectionDocumentRef(userId: string, collectionId: string) {
  return doc(getUserCollectionsCollectionRef(userId), collectionId);
}
