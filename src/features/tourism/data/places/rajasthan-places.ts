import type { TourismCategoryId, TourismPlace, TourismPriceLevel } from "@/types/tourism";

const imagePlaceholder = "/images/india-discovery-hero.png";
const coordinatePlaceholder = { latitude: null, longitude: null };

type RajasthanPlaceInput = {
  districtName: string;
  destinationSlug: string;
  name: string;
  categoryIds: TourismCategoryId[];
  tags?: string[];
  priceLevel?: TourismPriceLevel;
  idealDuration?: string;
  bestTimeToVisit?: string;
};

const categoryLabelById: Record<TourismCategoryId, string> = {
  heritage: "heritage",
  nature: "nature",
  beaches: "waterfront",
  mountains: "hill and desert landscape",
  food: "food and culture",
  spiritual: "spiritual",
};

function districtIdFromName(districtName: string) {
  return `rajasthan-${districtName
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

function defaultBudget(categoryIds: TourismCategoryId[]): TourismPriceLevel {
  if (categoryIds.includes("nature") || categoryIds.includes("food")) {
    return "budget";
  }

  return "moderate";
}

function createRajasthanPlace({
  districtName,
  destinationSlug,
  name,
  categoryIds,
  tags = [],
  priceLevel,
  idealDuration = "2-3 hours",
  bestTimeToVisit = "October to March",
}: RajasthanPlaceInput): TourismPlace {
  const primaryCategory = categoryLabelById[categoryIds[0]] ?? "tourism";
  const districtId = districtIdFromName(districtName);

  return {
    id: `${districtId}-${destinationSlug}`,
    name,
    stateId: "rajasthan",
    districtId,
    districtName,
    categoryIds,
    summary: `${name} is a ${primaryCategory} destination in ${districtName}, Rajasthan.`,
    description: `${name} is included in the offline Rajasthan tourism dataset for district-level discovery, search, and category filtering.`,
    highlights: ["District tourism highlight", "Local travel stop", "Offline dataset entry"],
    bestTimeToVisit,
    idealDuration,
    priceLevel: priceLevel ?? defaultBudget(categoryIds),
    approximateBudget: priceLevel ?? defaultBudget(categoryIds),
    rating: 4.3,
    tags: ["rajasthan", districtName.toLowerCase(), destinationSlug, ...categoryIds, ...tags],
    imageUrl: imagePlaceholder,
    coordinates: coordinatePlaceholder,
  };
}

const placeInputs: RajasthanPlaceInput[] = [
  ...[
    ["ajmer-sharif-dargah", "Ajmer Sharif Dargah", ["spiritual", "heritage"]],
    ["ana-sagar-lake", "Ana Sagar Lake", ["nature"]],
    ["adhai-din-ka-jhonpra", "Adhai Din Ka Jhonpra", ["heritage"]],
    ["taragarh-fort-ajmer", "Taragarh Fort Ajmer", ["heritage", "mountains"]],
    ["nareli-jain-temple", "Nareli Jain Temple", ["spiritual", "heritage"]],
    ["pushkar-lake", "Pushkar Lake", ["spiritual", "nature"]],
    ["mayo-college-museum", "Mayo College Museum", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Ajmer", destinationSlug, name, categoryIds })),
  ...[
    ["bala-quila", "Bala Quila", ["heritage", "mountains"]],
    ["sariska-tiger-reserve", "Sariska Tiger Reserve", ["nature"]],
    ["siliserh-lake-palace", "Siliserh Lake Palace", ["nature", "heritage"]],
    ["alwar-city-palace", "Alwar City Palace Museum", ["heritage"]],
    ["moosi-maharani-ki-chhatri", "Moosi Maharani Ki Chhatri", ["heritage"]],
    ["bhangarh-fort", "Bhangarh Fort", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Alwar", destinationSlug, name, categoryIds })),
  ...[
    ["anupgarh-fort", "Anupgarh Fort", ["heritage"]],
    ["laila-majnu-mazar", "Laila Majnu Mazar", ["spiritual", "heritage"]],
    ["binjor-heritage-site", "Binjor Heritage Site", ["heritage"]],
    ["ghaggar-river-view", "Ghaggar River View", ["nature"]],
    ["border-desert-trail", "Anupgarh Border Desert Trail", ["nature", "mountains"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Anupgarh", destinationSlug, name, categoryIds })),
  ...[
    ["nakoda-jain-temple", "Nakoda Jain Temple", ["spiritual", "heritage"]],
    ["jasol-mata-temple", "Jasol Mata Temple", ["spiritual"]],
    ["tilwara-cattle-fair-ground", "Tilwara Fair Ground", ["heritage"]],
    ["pachpadra-salt-lake", "Pachpadra Salt Lake", ["nature"]],
    ["balotra-textile-market", "Balotra Textile Market", ["food", "heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Balotra", destinationSlug, name, categoryIds })),
  ...[
    ["mahi-dam", "Mahi Dam", ["nature"]],
    ["kagdi-pick-up-weir", "Kagdi Pick Up Weir", ["nature"]],
    ["tripura-sundari-temple", "Tripura Sundari Temple", ["spiritual"]],
    ["anand-sagar-lake", "Anand Sagar Lake", ["nature", "heritage"]],
    ["arthuna-temples", "Arthuna Temples", ["heritage", "spiritual"]],
    ["ram-kund-banswara", "Ram Kund", ["spiritual", "nature"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Banswara", destinationSlug, name, categoryIds })),
  ...[
    ["shergarh-fort-baran", "Shergarh Fort Baran", ["heritage"]],
    ["sorsan-grassland", "Sorsan Grassland", ["nature"]],
    ["shahabad-fort", "Shahabad Fort", ["heritage", "mountains"]],
    ["bhand-devra-temple", "Bhand Devra Temple", ["spiritual", "heritage"]],
    ["sitabari", "Sitabari", ["spiritual", "nature"]],
    ["kapildhara-baran", "Kapildhara", ["nature", "spiritual"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Baran", destinationSlug, name, categoryIds })),
  ...[
    ["kiradu-temples", "Kiradu Temples", ["heritage", "spiritual"]],
    ["mahabar-sand-dunes", "Mahabar Sand Dunes", ["nature", "mountains"]],
    ["barmer-fort", "Barmer Fort", ["heritage"]],
    ["devka-sun-temple", "Devka Sun Temple", ["spiritual", "heritage"]],
    ["chintamani-parasnath-jain-temple", "Chintamani Parasnath Jain Temple", ["spiritual"]],
    ["barmer-craft-market", "Barmer Craft Market", ["food", "heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Barmer", destinationSlug, name, categoryIds })),
  ...[
    ["beawar-clock-tower-market", "Beawar Clock Tower Market", ["heritage", "food"]],
    ["todgarh-raoli-landscape", "Todgarh-Raoli Landscape", ["nature", "mountains"]],
    ["salemabad-nimbark-peeth", "Salemabad Nimbark Peeth", ["spiritual", "heritage"]],
    ["beawar-old-city-walk", "Beawar Old City Walk", ["heritage"]],
    ["badshahi-bagh-beawar", "Badshahi Bagh Beawar", ["nature", "heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Beawar", destinationSlug, name, categoryIds })),
  ...[
    ["keoladeo-national-park", "Keoladeo National Park", ["nature"]],
    ["lohangarh-fort", "Lohagarh Fort", ["heritage"]],
    ["bharatpur-palace-museum", "Bharatpur Palace Museum", ["heritage"]],
    ["ganga-mandir-bharatpur", "Ganga Mandir Bharatpur", ["spiritual", "heritage"]],
    ["banke-bihari-temple-bharatpur", "Banke Bihari Temple Bharatpur", ["spiritual"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Bharatpur", destinationSlug, name, categoryIds })),
  ...[
    ["harni-mahadev", "Harni Mahadev", ["spiritual", "nature"]],
    ["kyara-ke-balaji", "Kyara Ke Balaji", ["spiritual"]],
    ["mandalgarh-fort", "Mandalgarh Fort", ["heritage"]],
    ["meja-dam", "Meja Dam", ["nature"]],
    ["pur-udan-chatri", "Pur Udan Chatri", ["heritage"]],
    ["bhilwara-textile-market", "Bhilwara Textile Market", ["food", "heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Bhilwara", destinationSlug, name, categoryIds })),
  ...[
    ["junagarh-fort", "Junagarh Fort", ["heritage"]],
    ["karni-mata-temple-deshnok", "Karni Mata Temple Deshnok", ["spiritual", "heritage"]],
    ["rampuria-havelis", "Rampuria Havelis", ["heritage"]],
    ["lalgarh-palace", "Lalgarh Palace", ["heritage"]],
    ["national-research-centre-on-camel", "National Research Centre on Camel", ["nature", "heritage"]],
    ["gajner-palace-lake", "Gajner Palace and Lake", ["heritage", "nature"]],
    ["bikaner-old-city-food-walk", "Bikaner Old City Food Walk", ["food", "heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Bikaner", destinationSlug, name, categoryIds })),
  ...[
    ["taragarh-fort-bundi", "Taragarh Fort Bundi", ["heritage", "mountains"]],
    ["bundi-garh-palace", "Bundi Garh Palace", ["heritage"]],
    ["raniji-ki-baori", "Raniji Ki Baori", ["heritage"]],
    ["sukh-mahal", "Sukh Mahal", ["heritage", "nature"]],
    ["jait-sagar-lake", "Jait Sagar Lake", ["nature"]],
    ["chitrashala-bundi", "Chitrashala Bundi", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Bundi", destinationSlug, name, categoryIds })),
  ...[
    ["chittorgarh-fort", "Chittorgarh Fort", ["heritage"]],
    ["vijay-stambh", "Vijay Stambh", ["heritage"]],
    ["padmini-palace", "Padmini Palace", ["heritage"]],
    ["kalika-mata-temple", "Kalika Mata Temple", ["spiritual", "heritage"]],
    ["sanwariya-seth-temple", "Sanwariya Seth Temple", ["spiritual"]],
    ["bassi-wildlife-sanctuary", "Bassi Wildlife Sanctuary", ["nature"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Chittorgarh", destinationSlug, name, categoryIds })),
  ...[
    ["tal-chhapar-sanctuary", "Tal Chhapar Sanctuary", ["nature"]],
    ["churu-havelis", "Churu Havelis", ["heritage"]],
    ["sethani-ka-johara", "Sethani Ka Johara", ["heritage", "nature"]],
    ["salasar-balaji-temple", "Salasar Balaji Temple", ["spiritual"]],
    ["ratangarh-fort", "Ratangarh Fort", ["heritage"]],
    ["kanhaiyalal-bagla-haveli", "Kanhaiyalal Bagla Haveli", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Churu", destinationSlug, name, categoryIds })),
  ...[
    ["chand-baori", "Chand Baori", ["heritage"]],
    ["harshat-mata-temple", "Harshat Mata Temple", ["spiritual", "heritage"]],
    ["mehandipur-balaji", "Mehandipur Balaji", ["spiritual"]],
    ["bhandarej-baori", "Bhandarej Baori", ["heritage"]],
    ["abhaneri-village", "Abhaneri Village", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Dausa", destinationSlug, name, categoryIds })),
  ...[
    ["deeg-palace", "Deeg Palace", ["heritage"]],
    ["gopal-bhavan", "Gopal Bhavan", ["heritage"]],
    ["deeg-fort", "Deeg Fort", ["heritage"]],
    ["deeg-water-gardens", "Deeg Water Gardens", ["nature", "heritage"]],
    ["kaman-temple-circuit", "Kaman Temple Circuit", ["spiritual", "heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Deeg", destinationSlug, name, categoryIds })),
  ...[
    ["machkund", "Machkund", ["spiritual", "nature"]],
    ["shergarh-fort-dholpur", "Shergarh Fort Dholpur", ["heritage"]],
    ["chambal-safari-dholpur", "Chambal Safari Dholpur", ["nature"]],
    ["van-vihar-sanctuary", "Van Vihar Sanctuary", ["nature"]],
    ["talab-e-shahi", "Talab-e-Shahi", ["heritage", "nature"]],
    ["ram-sagar-sanctuary", "Ram Sagar Sanctuary", ["nature"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Dholpur", destinationSlug, name, categoryIds })),
  ...[
    ["kuchaman-fort", "Kuchaman Fort", ["heritage"]],
    ["didwana-salt-lake", "Didwana Salt Lake", ["nature"]],
    ["kuchaman-old-city", "Kuchaman Old City", ["heritage"]],
    ["meethri-stepwell", "Meethri Stepwell", ["heritage"]],
    ["didwana-local-market", "Didwana Local Market", ["food", "heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Didwana-Kuchaman", destinationSlug, name, categoryIds })),
  ...[
    ["sambhar-lake", "Sambhar Lake", ["nature"]],
    ["shakambhari-mata-temple", "Shakambhari Mata Temple", ["spiritual"]],
    ["dudu-fort", "Dudu Fort", ["heritage"]],
    ["naraina-dham", "Naraina Dham", ["spiritual", "heritage"]],
    ["phulera-heritage-rail-stop", "Phulera Heritage Rail Stop", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Dudu", destinationSlug, name, categoryIds })),
  ...[
    ["juna-mahal", "Juna Mahal", ["heritage"]],
    ["gaib-sagar-lake", "Gaib Sagar Lake", ["nature"]],
    ["deo-somnath-temple", "Deo Somnath Temple", ["spiritual", "heritage"]],
    ["udai-bilas-palace", "Udai Bilas Palace", ["heritage"]],
    ["beneshwar-dham", "Beneshwar Dham", ["spiritual", "nature"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Dungarpur", destinationSlug, name, categoryIds })),
  ...[
    ["hindumalkot-border", "Hindumalkot Border", ["heritage"]],
    ["gauri-shankar-temple-ganganagar", "Gauri Shankar Temple Ganganagar", ["spiritual"]],
    ["suratgarh-fort", "Suratgarh Fort", ["heritage"]],
    ["ganganagar-public-park", "Ganganagar Public Park", ["nature"]],
    ["bror-village-heritage-site", "Bror Village Heritage Site", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Ganganagar", destinationSlug, name, categoryIds })),
  ...[
    ["gangapur-city-old-market", "Gangapur City Old Market", ["food", "heritage"]],
    ["dhundeshwar-mahadev", "Dhundeshwar Mahadev", ["spiritual"]],
    ["gangapur-heritage-walk", "Gangapur Heritage Walk", ["heritage"]],
    ["chambal-plains-view", "Gangapur Plains View", ["nature"]],
    ["gangapur-local-craft-bazaar", "Gangapur Local Craft Bazaar", ["food", "heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Gangapurcity", destinationSlug, name, categoryIds })),
  ...[
    ["bhatner-fort", "Bhatner Fort", ["heritage"]],
    ["kalibangan-archaeological-site", "Kalibangan Archaeological Site", ["heritage"]],
    ["gogamedi", "Gogamedi", ["spiritual", "heritage"]],
    ["brahmani-mata-temple", "Brahmani Mata Temple", ["spiritual"]],
    ["sila-mata-temple", "Sila Mata Temple", ["spiritual"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Hanumangarh", destinationSlug, name, categoryIds })),
  ...[
    ["hawa-mahal", "Hawa Mahal", ["heritage"]],
    ["city-palace-jaipur", "City Palace Jaipur", ["heritage"]],
    ["jantar-mantar-jaipur", "Jantar Mantar Jaipur", ["heritage"]],
    ["nahargarh-fort", "Nahargarh Fort", ["heritage", "mountains"]],
    ["jaigarh-fort", "Jaigarh Fort", ["heritage"]],
    ["albert-hall-museum", "Albert Hall Museum", ["heritage"]],
    ["galta-ji", "Galta Ji", ["spiritual", "nature"]],
    ["patrika-gate", "Patrika Gate", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Jaipur", destinationSlug, name, categoryIds })),
  ...[
    ["samode-palace", "Samode Palace", ["heritage"]],
    ["samode-bagh", "Samode Bagh", ["heritage", "nature"]],
    ["jamwa-ramgarh-lake", "Jamwa Ramgarh Lake", ["nature"]],
    ["achrol-fort", "Achrol Fort", ["heritage"]],
    ["bagru-hand-block-printing", "Bagru Hand Block Printing", ["heritage", "food"]],
    ["chandlai-lake", "Chandlai Lake", ["nature"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Jaipur Rural", destinationSlug, name, categoryIds })),
  ...[
    ["jaisalmer-fort", "Jaisalmer Fort", ["heritage"]],
    ["sam-sand-dunes", "Sam Sand Dunes", ["nature", "mountains"]],
    ["patwon-ki-haveli", "Patwon Ki Haveli", ["heritage"]],
    ["gadisar-lake", "Gadisar Lake", ["nature", "heritage"]],
    ["kuldhara", "Kuldhara", ["heritage"]],
    ["tanot-mata-temple", "Tanot Mata Temple", ["spiritual", "heritage"]],
    ["longewala-war-memorial", "Longewala War Memorial", ["heritage"]],
    ["bada-bagh", "Bada Bagh", ["heritage", "nature"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Jaisalmer", destinationSlug, name, categoryIds })),
  ...[
    ["jalore-fort", "Jalore Fort", ["heritage", "mountains"]],
    ["sundha-mata-temple", "Sundha Mata Temple", ["spiritual", "mountains"]],
    ["topekhana-jalore", "Topekhana Jalore", ["heritage"]],
    ["bhinmal-heritage-walk", "Bhinmal Heritage Walk", ["heritage"]],
    ["sire-mandir", "Sire Mandir", ["spiritual", "mountains"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Jalore", destinationSlug, name, categoryIds })),
  ...[
    ["gagron-fort", "Gagron Fort", ["heritage"]],
    ["jhalawar-fort", "Jhalawar Fort", ["heritage"]],
    ["chandrabhaga-temples", "Chandrabhaga Temples", ["spiritual", "heritage"]],
    ["bhawani-natyashala", "Bhawani Natyashala", ["heritage"]],
    ["kolvi-buddhist-caves", "Kolvi Buddhist Caves", ["heritage", "spiritual"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Jhalawar", destinationSlug, name, categoryIds })),
  ...[
    ["rani-sati-temple", "Rani Sati Temple", ["spiritual"]],
    ["khetri-mahal", "Khetri Mahal", ["heritage"]],
    ["mandawa-havelis", "Mandawa Havelis", ["heritage"]],
    ["nawalgarh-havelis", "Nawalgarh Havelis", ["heritage"]],
    ["dundlod-fort", "Dundlod Fort", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Jhunjhunu", destinationSlug, name, categoryIds })),
  ...[
    ["mehrangarh-fort", "Mehrangarh Fort", ["heritage"]],
    ["jaswant-thada", "Jaswant Thada", ["heritage"]],
    ["umaid-bhawan-palace", "Umaid Bhawan Palace", ["heritage"]],
    ["mandore-gardens", "Mandore Gardens", ["heritage", "nature"]],
    ["toorji-ka-jhalra", "Toorji Ka Jhalra", ["heritage"]],
    ["rao-jodha-desert-rock-park", "Rao Jodha Desert Rock Park", ["nature"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Jodhpur", destinationSlug, name, categoryIds })),
  ...[
    ["osian-temples", "Osian Temples", ["spiritual", "heritage"]],
    ["bishnoi-village-safari", "Bishnoi Village Safari", ["heritage", "nature"]],
    ["guda-bishnoi-lake", "Guda Bishnoi Lake", ["nature"]],
    ["balesar-desert-trail", "Balesar Desert Trail", ["nature", "mountains"]],
    ["khimsar-dunes-approach", "Jodhpur Rural Dune Route", ["nature", "mountains"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Jodhpur Rural", destinationSlug, name, categoryIds })),
  ...[
    ["kaila-devi-temple", "Kaila Devi Temple", ["spiritual"]],
    ["timangarh-fort", "Timangarh Fort", ["heritage"]],
    ["madan-mohan-ji-temple", "Madan Mohan Ji Temple", ["spiritual", "heritage"]],
    ["karauli-city-palace", "Karauli City Palace", ["heritage"]],
    ["shri-mahavirji-temple", "Shri Mahavirji Temple", ["spiritual"]],
    ["mandrayal-fort", "Mandrayal Fort", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Karauli", destinationSlug, name, categoryIds })),
  ...[
    ["kekri-fort", "Kekri Fort", ["heritage"]],
    ["bisalpur-dam-approach", "Bisalpur Dam Approach", ["nature"]],
    ["sawar-heritage-walk", "Sawar Heritage Walk", ["heritage"]],
    ["kekri-old-market", "Kekri Old Market", ["food", "heritage"]],
    ["kekri-jain-temple-circuit", "Kekri Jain Temple Circuit", ["spiritual", "heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Kekri", destinationSlug, name, categoryIds })),
  ...[
    ["tijara-jain-temple", "Tijara Jain Temple", ["spiritual", "heritage"]],
    ["baba-mohan-ram-kali-kholi", "Baba Mohan Ram Kali Kholi", ["spiritual"]],
    ["khairthal-old-market", "Khairthal Old Market", ["food", "heritage"]],
    ["bhiwadi-urban-food-street", "Bhiwadi Urban Food Street", ["food"]],
    ["tijara-fort-palace", "Tijara Fort Palace", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Khairthal-Tijara", destinationSlug, name, categoryIds })),
  ...[
    ["garadia-mahadev", "Garadia Mahadev", ["nature", "spiritual"]],
    ["seven-wonders-park", "Seven Wonders Park", ["heritage", "nature"]],
    ["kota-garh-palace", "Kota Garh Palace", ["heritage"]],
    ["chambal-garden", "Chambal Garden", ["nature"]],
    ["kishore-sagar-lake", "Kishore Sagar Lake", ["nature", "heritage"]],
    ["kota-barrage", "Kota Barrage", ["nature"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Kota", destinationSlug, name, categoryIds })),
  ...[
    ["neemrana-fort-palace", "Neemrana Fort Palace", ["heritage"]],
    ["behror-old-market", "Behror Old Market", ["food", "heritage"]],
    ["kotputli-fort", "Kotputli Fort", ["heritage"]],
    ["sarund-mata-temple", "Sarund Mata Temple", ["spiritual"]],
    ["kotputli-aravalli-viewpoint", "Kotputli Aravalli Viewpoint", ["nature", "mountains"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Kotputli-Behror", destinationSlug, name, categoryIds })),
  ...[
    ["nagaur-fort", "Nagaur Fort", ["heritage"]],
    ["tarkeen-dargah", "Tarkeen Dargah", ["spiritual", "heritage"]],
    ["khimsar-fort", "Khimsar Fort", ["heritage"]],
    ["merta-city", "Merta City", ["spiritual", "heritage"]],
    ["deepak-mahal", "Deepak Mahal", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Nagaur", destinationSlug, name, categoryIds })),
  ...[
    ["ganeshwar-archaeological-site", "Ganeshwar Archaeological Site", ["heritage"]],
    ["patan-mahal", "Patan Mahal", ["heritage", "mountains"]],
    ["neem-ka-thana-old-market", "Neem Ka Thana Old Market", ["food", "heritage"]],
    ["aravalli-copper-belt-view", "Aravalli Copper Belt View", ["nature", "heritage"]],
    ["neem-ka-thana-stepwell", "Neem Ka Thana Stepwell", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Neem Ka Thana", destinationSlug, name, categoryIds })),
  ...[
    ["ranakpur-jain-temple", "Ranakpur Jain Temple", ["spiritual", "heritage"]],
    ["jawai-leopard-conservation-area", "Jawai Leopard Conservation Area", ["nature"]],
    ["om-banna-temple", "Om Banna Temple", ["spiritual", "heritage"]],
    ["parshuram-mahadev-temple", "Parshuram Mahadev Temple", ["spiritual", "mountains"]],
    ["nimbok-nath-temple", "Nimbo Ka Nath Temple", ["spiritual"]],
    ["bangur-museum", "Bangur Museum", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Pali", destinationSlug, name, categoryIds })),
  ...[
    ["khichan-bird-sanctuary", "Khichan Bird Sanctuary", ["nature"]],
    ["phalodi-fort", "Phalodi Fort", ["heritage"]],
    ["lal-niwas-phalodi", "Lal Niwas Phalodi", ["heritage"]],
    ["phalodi-salt-lakes", "Phalodi Salt Lakes", ["nature"]],
    ["desert-village-trail-phalodi", "Phalodi Desert Village Trail", ["nature", "heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Phalodi", destinationSlug, name, categoryIds })),
  ...[
    ["sitamata-wildlife-sanctuary", "Sitamata Wildlife Sanctuary", ["nature"]],
    ["gautameshwar-temple", "Gautameshwar Temple", ["spiritual", "nature"]],
    ["devgarh-pratapgarh", "Devgarh Pratapgarh", ["heritage"]],
    ["jakham-dam", "Jakham Dam", ["nature"]],
    ["thewa-art-cluster", "Thewa Art Cluster", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Pratapgarh", destinationSlug, name, categoryIds })),
  ...[
    ["kumbhalgarh-fort", "Kumbhalgarh Fort", ["heritage", "mountains"]],
    ["haldi-ghati", "Haldighati", ["heritage"]],
    ["nathdwara-temple", "Nathdwara Temple", ["spiritual"]],
    ["rajsamand-lake", "Rajsamand Lake", ["nature", "heritage"]],
    ["charbhuja-temple", "Charbhuja Temple", ["spiritual"]],
    ["molela-terracotta-village", "Molela Terracotta Village", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Rajsamand", destinationSlug, name, categoryIds })),
  ...[
    ["jaisamand-lake", "Jaisamand Lake", ["nature"]],
    ["jaisamand-wildlife-sanctuary", "Jaisamand Wildlife Sanctuary", ["nature"]],
    ["salumbar-palace", "Salumbar Palace", ["heritage"]],
    ["idana-mata-temple", "Idana Mata Temple", ["spiritual"]],
    ["ruthi-rani-mahal", "Ruthi Rani Mahal", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Salumbar", destinationSlug, name, categoryIds })),
  ...[
    ["sanchore-desert-trail", "Sanchore Desert Trail", ["nature", "mountains"]],
    ["narmada-canal-view", "Narmada Canal View", ["nature"]],
    ["sanchore-old-market", "Sanchore Old Market", ["food", "heritage"]],
    ["raniwara-rural-circuit", "Raniwara Rural Circuit", ["heritage", "nature"]],
    ["border-village-craft-trail", "Sanchore Border Village Craft Trail", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Sanchore", destinationSlug, name, categoryIds })),
  ...[
    ["ranthambore-national-park", "Ranthambore National Park", ["nature"]],
    ["ranthambore-fort", "Ranthambore Fort", ["heritage"]],
    ["trinetra-ganesh-temple", "Trinetra Ganesh Temple", ["spiritual"]],
    ["surwal-lake", "Surwal Lake", ["nature"]],
    ["khandar-fort", "Khandar Fort", ["heritage"]],
    ["rajiv-gandhi-regional-museum", "Rajiv Gandhi Regional Museum", ["heritage", "nature"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Sawai Madhopur", destinationSlug, name, categoryIds })),
  ...[
    ["shahpura-haveli", "Shahpura Haveli", ["heritage"]],
    ["ramdwara-shahpura", "Ramdwara Shahpura", ["spiritual", "heritage"]],
    ["phooliya-kalan-heritage-walk", "Phooliya Kalan Heritage Walk", ["heritage"]],
    ["triveni-dham-shahpura", "Triveni Dham Shahpura", ["spiritual"]],
    ["shahpura-lake", "Shahpura Lake", ["nature"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Shahpura", destinationSlug, name, categoryIds })),
  ...[
    ["khatu-shyam-temple", "Khatu Shyam Temple", ["spiritual"]],
    ["jeen-mata-temple", "Jeen Mata Temple", ["spiritual", "mountains"]],
    ["harshnath-temple", "Harshnath Temple", ["spiritual", "heritage"]],
    ["laxmangarh-fort", "Laxmangarh Fort", ["heritage"]],
    ["devgarh-fort-sikar", "Devgarh Fort Sikar", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Sikar", destinationSlug, name, categoryIds })),
  ...[
    ["mount-abu", "Mount Abu", ["mountains", "nature"]],
    ["dilwara-temples", "Dilwara Temples", ["spiritual", "heritage"]],
    ["nakki-lake", "Nakki Lake", ["nature"]],
    ["guru-shikhar", "Guru Shikhar", ["mountains", "nature"]],
    ["achalgarh-fort", "Achalgarh Fort", ["heritage", "mountains"]],
    ["toad-rock", "Toad Rock", ["nature", "mountains"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Sirohi", destinationSlug, name, categoryIds })),
  ...[
    ["sunehri-kothi", "Sunehri Kothi", ["heritage"]],
    ["hathi-bhata", "Hathi Bhata", ["heritage"]],
    ["bisalpur-dam", "Bisalpur Dam", ["nature"]],
    ["rasiya-ke-tekri", "Rasiya Ke Tekri", ["heritage", "nature"]],
    ["arabic-persian-research-institute", "Arabic Persian Research Institute", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Tonk", destinationSlug, name, categoryIds })),
  ...[
    ["lake-pichola", "Lake Pichola", ["nature", "heritage"]],
    ["jagdish-temple", "Jagdish Temple", ["spiritual", "heritage"]],
    ["sajjangarh-palace", "Sajjangarh Palace", ["heritage", "mountains"]],
    ["saheliyon-ki-bari", "Saheliyon Ki Bari", ["nature", "heritage"]],
    ["fateh-sagar-lake", "Fateh Sagar Lake", ["nature"]],
    ["bagore-ki-haveli", "Bagore Ki Haveli", ["heritage"]],
  ].map(([destinationSlug, name, categoryIds]) => ({ districtName: "Udaipur", destinationSlug, name, categoryIds })),
] as RajasthanPlaceInput[];

export const rajasthanPlaces = placeInputs.map(createRajasthanPlace);
