import type { LocationSelection } from "@/features/tourism/types/region";

export function buildExploreSearchParams(selection: LocationSelection) {
  const searchParams = new URLSearchParams({ state: selection.regionId });

  if (selection.scope === "state") {
    searchParams.set("scope", "state");
    return searchParams;
  }

  if (selection.districtId) {
    searchParams.set("district", selection.districtId);
  }

  return searchParams;
}
