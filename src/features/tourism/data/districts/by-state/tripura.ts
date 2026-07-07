import { createDistrictList } from "@/features/tourism/data/districts/create-district-list";

const districts = createDistrictList("tripura", [
  "Dhalai",
  "Gomati",
  "Khowai",
  "North Tripura",
  "Sepahijala",
  "South Tripura",
  "Unakoti",
  "West Tripura"
]);

export default districts;
