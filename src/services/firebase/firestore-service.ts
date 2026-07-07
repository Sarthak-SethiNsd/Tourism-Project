import { collection, doc } from "firebase/firestore";
import { getFirebaseFirestore } from "@/services/firebase/client";

export const firestoreCollections = {
  users: "users",
  places: "places",
  savedPlaces: "savedPlaces",
} as const;

export function getCollectionRef(collectionName: keyof typeof firestoreCollections) {
  return collection(getFirebaseFirestore(), firestoreCollections[collectionName]);
}

export function getDocumentRef(collectionName: keyof typeof firestoreCollections, id: string) {
  return doc(getFirebaseFirestore(), firestoreCollections[collectionName], id);
}
