import type { IndianRegion } from "@/features/tourism/types/region";

export const indianRegions: IndianRegion[] = [
  { id: "andhra-pradesh", name: "Andhra Pradesh", type: "state", description: "Coastal temples, heritage, and cuisine" },
  { id: "arunachal-pradesh", name: "Arunachal Pradesh", type: "state", description: "Eastern Himalayas and monasteries" },
  { id: "assam", name: "Assam", type: "state", description: "Tea gardens, wildlife, and Brahmaputra" },
  { id: "bihar", name: "Bihar", type: "state", description: "Ancient history and pilgrimage" },
  { id: "chhattisgarh", name: "Chhattisgarh", type: "state", description: "Waterfalls, tribes, and forests" },
  { id: "goa", name: "Goa", type: "state", description: "Beaches, Portuguese heritage, nightlife" },
  { id: "gujarat", name: "Gujarat", type: "state", description: "Coasts, temples, and heritage" },
  { id: "haryana", name: "Haryana", type: "state", description: "Heritage circuits and urban gateways" },
  { id: "himachal-pradesh", name: "Himachal Pradesh", type: "state", description: "Mountains, valleys, and trails" },
  { id: "jharkhand", name: "Jharkhand", type: "state", description: "Waterfalls, forests, and tribal culture" },
  { id: "karnataka", name: "Karnataka", type: "state", description: "Heritage, forests, and coffee country" },
  { id: "kerala", name: "Kerala", type: "state", description: "Backwaters, hills, and wellness" },
  { id: "madhya-pradesh", name: "Madhya Pradesh", type: "state", description: "Wildlife, forts, and ancient cities" },
  { id: "maharashtra", name: "Maharashtra", type: "state", description: "Cities, caves, coasts, and ghats" },
  { id: "manipur", name: "Manipur", type: "state", description: "Loktak Lake and valley culture" },
  { id: "meghalaya", name: "Meghalaya", type: "state", description: "Living root bridges and highlands" },
  { id: "mizoram", name: "Mizoram", type: "state", description: "Hills, bamboo forests, and culture" },
  { id: "nagaland", name: "Nagaland", type: "state", description: "Hornbill festivals and highlands" },
  { id: "odisha", name: "Odisha", type: "state", description: "Temples, coasts, and crafts" },
  { id: "punjab", name: "Punjab", type: "state", description: "Golden Temple and vibrant culture" },
  { id: "rajasthan", name: "Rajasthan", type: "state", description: "Forts, deserts, and palaces" },
  { id: "sikkim", name: "Sikkim", type: "state", description: "Himalayan peaks and monasteries" },
  { id: "tamil-nadu", name: "Tamil Nadu", type: "state", description: "Temples, coasts, and culture" },
  { id: "telangana", name: "Telangana", type: "state", description: "Heritage forts and urban hubs" },
  { id: "tripura", name: "Tripura", type: "state", description: "Palaces, lakes, and hill tracts" },
  { id: "uttar-pradesh", name: "Uttar Pradesh", type: "state", description: "Taj Mahal, ghats, and pilgrimage" },
  { id: "uttarakhand", name: "Uttarakhand", type: "state", description: "Pilgrimage, peaks, and rivers" },
  { id: "west-bengal", name: "West Bengal", type: "state", description: "Culture, delta, and hills" },
  { id: "andaman-and-nicobar-islands", name: "Andaman and Nicobar Islands", type: "union_territory", description: "Islands, reefs, and beaches" },
  { id: "chandigarh", name: "Chandigarh", type: "union_territory", description: "Planned city and gardens" },
  {
    id: "dadra-and-nagar-haveli-and-daman-and-diu",
    name: "Dadra and Nagar Haveli and Daman and Diu",
    type: "union_territory",
    description: "Coastal forts and serene getaways",
  },
  { id: "delhi", name: "Delhi", type: "union_territory", description: "Capital monuments and markets" },
  { id: "jammu-and-kashmir", name: "Jammu and Kashmir", type: "union_territory", description: "Valleys, lakes, and shrines" },
  { id: "ladakh", name: "Ladakh", type: "union_territory", description: "High-altitude desert and monasteries" },
  { id: "lakshadweep", name: "Lakshadweep", type: "union_territory", description: "Coral atolls and lagoons" },
  { id: "puducherry", name: "Puducherry", type: "union_territory", description: "French quarter and coastal charm" },
];

export const indianRegionIds = indianRegions.map((region) => region.id);

export const indianRegionById = new Map(indianRegions.map((region) => [region.id, region]));
