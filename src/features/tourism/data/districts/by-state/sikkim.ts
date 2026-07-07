import { createDistrictList } from "@/features/tourism/data/districts/create-district-list";

const districts = createDistrictList("sikkim", [
  "Gangtok",
  "Gyalshing",
  "Mangan",
  "Namchi",
  "Pakyong",
  "Soreng"
]);

export default districts;
