export const MAX_COMPARE_PLACES = 3;

const STORAGE_KEY = "india-tourism.compare-place-ids";
const CHANGE_EVENT = "india-tourism.compare-places-change";

export type AddComparePlaceResult = "added" | "already-added" | "limit-reached";

export function getComparePlaceIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");

    return Array.isArray(storedValue)
      ? [...new Set(storedValue.filter((placeId): placeId is string => typeof placeId === "string"))].slice(0, MAX_COMPARE_PLACES)
      : [];
  } catch {
    return [];
  }
}

export function addComparePlace(placeId: string): AddComparePlaceResult {
  const placeIds = getComparePlaceIds();

  if (placeIds.includes(placeId)) {
    return "already-added";
  }

  if (placeIds.length >= MAX_COMPARE_PLACES) {
    return "limit-reached";
  }

  writeComparePlaceIds([...placeIds, placeId]);
  return "added";
}

export function removeComparePlace(placeId: string) {
  writeComparePlaceIds(getComparePlaceIds().filter((id) => id !== placeId));
}

export function clearComparePlaces() {
  writeComparePlaceIds([]);
}

export function subscribeToComparePlaces(onChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      onChange();
    }
  };

  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function writeComparePlaceIds(placeIds: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(placeIds));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
