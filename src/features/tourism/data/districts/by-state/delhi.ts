import { createDistrictList } from "@/features/tourism/data/districts/create-district-list";

const districts = createDistrictList("delhi", [
  "Central Delhi",
  "East Delhi",
  "New Delhi",
  "North Delhi",
  "North East Delhi",
  "North West Delhi",
  "Shahdara",
  "South Delhi",
  "South East Delhi",
  "South West Delhi",
  "West Delhi"
]);

export default districts;
