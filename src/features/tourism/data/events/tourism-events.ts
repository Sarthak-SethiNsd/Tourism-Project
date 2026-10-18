import type { TourismEvent } from "@/types/tourism";

/**
 * Curated authentic Indian festivals and cultural events.
 *
 * Rules:
 * - Traditional or seasonal timing is always provided as `periodDescription`.
 * - `confirmedEdition` is provided ONLY when exact dates are verified for an identified year.
 * - Dates and schedules must never be fabricated.
 */
export const curatedTourismEvents: TourismEvent[] = [
  // Varanasi / Dashashwamedh Ghat
  {
    id: "evening-ganga-aarti-varanasi",
    name: "Maha Aarti at Dashashwamedh Ghat",
    category: "spiritual",
    recurrence: "daily",
    periodDescription: "Daily at sunset (around 6:30 PM winter / 7:00 PM summer)",
    placeIds: ["dashashwamedh-ghat-varanasi"],
    districtId: "uttar-pradesh-varanasi",
    stateId: "uttar-pradesh",
    venue: "Dashashwamedh Ghat riverfront steps, Varanasi",
    summary:
      "A world-renowned Vedic ritual performed by young priests swinging massive multi-tiered brass lamps, surrounded by rhythmic chanting, bells, and floating diyas on the Ganga.",
    culturalSignificance:
      "A sacred centuries-old evening prayer offering to Goddess Ganga, Lord Shiva, Surya, and the cosmos, marking gratitude for the holy waters.",
    tips: [
      "Arrive 45–60 minutes early to secure a spot on the ghat steps or book a wooden boat on the river.",
      "Footwear should be removed if sitting on the designated aarti platforms.",
    ],
    officialWebsiteUrl: "https://uptourism.gov.in",
    isMajorFestival: true,
  },
  {
    id: "dev-deepawali-varanasi",
    name: "Dev Deepawali",
    category: "cultural",
    recurrence: "annual",
    periodDescription: "Kartik Purnima (full moon night in November, 15 days after Diwali)",
    placeIds: ["dashashwamedh-ghat-varanasi"],
    districtId: "uttar-pradesh-varanasi",
    stateId: "uttar-pradesh",
    venue: "All 84 ghats of Varanasi, anchored at Dashashwamedh Ghat and Assi Ghat",
    summary:
      "The celebrated 'Diwali of the Gods' where over one million earthen lamps (diyas) illuminate the entire 7-kilometer riverfront crescent of the holy river.",
    culturalSignificance:
      "According to Hindu tradition, gods descend from heaven on Kartik Purnima to bathe in the Ganga celebrating Lord Shiva's victory over the demon Tripurasura.",
    tips: [
      "River boats must be booked weeks in advance due to massive visitor influx.",
      "A laser light and sound show is typically staged near Chet Singh Ghat.",
    ],
    officialWebsiteUrl: "https://uptourism.gov.in",
    isMajorFestival: true,
  },

  // Agra / Taj Mahal
  {
    id: "taj-mahotsav-agra",
    name: "Taj Mahotsav",
    category: "cultural",
    recurrence: "annual",
    periodDescription: "Late February every year (traditionally 10 days, February 18–27)",
    placeIds: ["taj-mahal-agra"],
    districtId: "uttar-pradesh-agra",
    stateId: "uttar-pradesh",
    venue: "Shilpgram (Crafts Village), Eastern Gate, Taj Mahal, Agra",
    summary:
      "A vibrant 10-day cultural carnival showcasing Indian craftsmanship, classical dance, Awadhi and Mughlai culinary heritage, and folk arts near the Taj Mahal.",
    culturalSignificance:
      "Inaugurated by Uttar Pradesh Tourism in 1992 to celebrate Mughal arts, Indian crafts, and folk traditions, drawing hundreds of master artisans nationwide.",
    tips: [
      "Combine an early morning visit to the Taj Mahal with an evening stroll through the Shilpgram handicraft stalls.",
      "Entry tickets to Shilpgram are sold separately on-site and online by UP Tourism.",
    ],
    officialWebsiteUrl: "https://uptourism.gov.in",
    isMajorFestival: true,
  },

  // Jaipur / Amber Fort
  {
    id: "teej-festival-jaipur",
    name: "Teej Festival & Royal Procession",
    category: "cultural",
    recurrence: "annual",
    periodDescription: "Shravan month (monsoon, typically July or August)",
    placeIds: ["amber-fort-jaipur"],
    districtId: "rajasthan-jaipur",
    stateId: "rajasthan",
    venue: "Walled City of Jaipur, originating at City Palace and moving through Tripolia Bazaar",
    summary:
      "A lively monsoon spectacle in the Pink City featuring a grand procession of the palanquin of Goddess Parvati, folk dancers, Caparisoned camels, and traditional brass bands.",
    culturalSignificance:
      "Celebrates the reunion of Goddess Parvati with Lord Shiva and marks the arrival of the monsoon with swing songs, traditional Ghewar sweets, and colorful Leheriya attire.",
    tips: [
      "Special viewing enclosures are set up for tourists opposite Tripolia Gate by Rajasthan Tourism.",
      "Old city streets are heavily packed on procession days; plan travel on foot.",
    ],
    officialWebsiteUrl: "https://www.tourism.rajasthan.gov.in",
    isMajorFestival: true,
  },
  {
    id: "gangaur-festival-jaipur",
    name: "Gangaur Festival",
    category: "cultural",
    recurrence: "annual",
    periodDescription: "Chaitra month (spring, March to April, following Holi)",
    placeIds: ["amber-fort-jaipur"],
    districtId: "rajasthan-jaipur",
    stateId: "rajasthan",
    venue: "City Palace courtyard and winding streets of Jaipur",
    summary:
      "A colorful Rajasthani festival honoring Gauri (Goddess Parvati) with women carrying painted clay idols on their heads in royal street processions accompanied by folk music.",
    culturalSignificance:
      "One of the most cherished Rajasthani heritage festivals celebrating marital harmony, love, spring harvest, and devotion.",
    officialWebsiteUrl: "https://www.tourism.rajasthan.gov.in",
    isMajorFestival: true,
  },

  // Udaipur / City Palace Udaipur
  {
    id: "mewar-festival-udaipur",
    name: "Mewar Festival & Gangaur Procession",
    category: "cultural",
    recurrence: "annual",
    periodDescription: "March / April (coinciding with the arrival of spring and Gangaur)",
    placeIds: ["city-palace-udaipur"],
    districtId: "rajasthan-udaipur",
    stateId: "rajasthan",
    venue: "Gangaur Ghat and Lake Pichola, Udaipur",
    summary:
      "A grand lakeside festival where traditional royal boats escort deities across Lake Pichola from the City Palace to Gangaur Ghat, culminating in cultural fireworks and music.",
    culturalSignificance:
      "Celebrates the cultural heritage of the Mewar region through folk singing, Kalbelia dance, and age-old water ceremonies.",
    tips: [
      "Gather along Gangaur Ghat by late afternoon to watch decorated boats enter Lake Pichola.",
    ],
    officialWebsiteUrl: "https://www.tourism.rajasthan.gov.in",
    isMajorFestival: true,
  },

  // Alleppey / Backwaters
  {
    id: "nehru-trophy-boat-race-alappuzha",
    name: "Nehru Trophy Boat Race",
    category: "fair_mela",
    recurrence: "annual",
    periodDescription: "Second Saturday of August every year",
    placeIds: ["alleppey-backwaters"],
    districtId: "kerala-alappuzha",
    stateId: "kerala",
    venue: "Punnamada Lake, Alappuzha (Alleppey)",
    summary:
      "The largest water regatta in the world, where 100-foot-long snake boats (Chundan Vallams) manned by over 100 synchronized oarsmen race to the cadence of Vanchipattu boat songs.",
    culturalSignificance:
      "Instituted to commemorate Jawaharlal Nehru's 1952 visit to Alappuzha; it is the ultimate showcase of Kerala's communal unity, maritime prowess, and rowing traditions.",
    tips: [
      "Grandstand and pavilion passes must be purchased beforehand via the official district portal.",
      "Arrive early as waterways and roads into Alappuzha are regulated from morning.",
    ],
    officialWebsiteUrl: "https://nehrutrophy.nic.in",
    isMajorFestival: true,
  },

  // Munnar / Kerala Hills
  {
    id: "neelakurinji-blooming-munnar",
    name: "Neelakurinji Blossom Season",
    category: "seasonal",
    recurrence: "seasonal",
    periodDescription: "Once every 12 years (August to October; next expected cycle 2030)",
    placeIds: ["munnar-tea-gardens"],
    districtId: "kerala-idukki",
    stateId: "kerala",
    venue: "Eravikulam National Park and surrounding Western Ghats slopes, Munnar",
    summary:
      "A rare botanical phenomenon where the Strobilanthes kunthiana wildflower carpet entire mountain ridges in breathtaking hues of purple and blue.",
    culturalSignificance:
      "Revered by the indigenous Muthuvan tribes who historically used the 12-year flowering cycle to calculate their age and seasons.",
    tips: [
      "Eravikulam National Park entry is strictly quota-regulated; book entry passes months in advance during blooming years.",
    ],
    officialWebsiteUrl: "https://www.keralatourism.org",
    isMajorFestival: true,
  },

  // Goa / Baga Beach
  {
    id: "goa-carnival",
    name: "Goa Carnival",
    category: "cultural",
    recurrence: "annual",
    periodDescription: "February or March (4 days preceding Ash Wednesday / Lent)",
    placeIds: ["baga-beach-goa", "fontainhas-panaji"],
    districtId: "goa-north-goa",
    stateId: "goa",
    venue: "Panaji, Margao, Mapusa, and coastal towns of North Goa",
    summary:
      "A colorful 500-year-old Portuguese-era festival led by King Momo, featuring street parades, music bands, masquerades, and open-air beach feasts.",
    culturalSignificance:
      "Unique to Goa in India, the carnival celebrates Goan folklore, Konkani song, and communal festivity with the motto 'Eat, drink, and make merry' before Lent.",
    tips: [
      "Panaji hosts the primary float parade on the opening Saturday afternoon.",
      "Coastal traffic is dense; rental two-wheelers are easiest for hopping between carnival events.",
    ],
    officialWebsiteUrl: "https://goatourism.gov.in",
    isMajorFestival: true,
  },

  // Karnataka / Mysore Palace
  {
    id: "mysore-dasara",
    name: "Mysuru Dasara & Jumboo Savari",
    category: "heritage",
    recurrence: "annual",
    periodDescription: "Ashvin month (September / October, coinciding with Navaratri and Vijayadashami)",
    placeIds: ["mysore-palace"],
    districtId: "karnataka-mysuru",
    stateId: "karnataka",
    venue: "Mysore Palace grounds and Bannimantap parade grounds, Mysuru",
    summary:
      "The state festival (Nada Habba) of Karnataka, featuring the illumination of Mysore Palace with 100,000 light bulbs and a grand royal procession of decorated elephants carrying the golden howdah.",
    culturalSignificance:
      "Traced back to the 15th-century Vijayanagara Empire, celebrating the victory of Goddess Chamundeshwari over the demon Mahishasura.",
    tips: [
      "Palace illumination occurs every evening during the 10 days of Navaratri.",
      "The grand Jumboo Savari elephant march takes place on the final Vijayadashami day.",
    ],
    officialWebsiteUrl: "https://mysoredasara.gov.in",
    isMajorFestival: true,
  },

  // Karnataka / Hampi Ruins
  {
    id: "hampi-utsav",
    name: "Hampi Utsav (Vijaya Utsav)",
    category: "music_arts",
    recurrence: "annual",
    periodDescription: "November or January (typically 3 days announced by Karnataka Tourism)",
    placeIds: ["hampi-ruins"],
    districtId: "karnataka-vijayapura",
    stateId: "karnataka",
    venue: "Virupaksha Temple, Gayatri Peeta, and Eduru Basavanna ruins, Hampi",
    summary:
      "A three-day cultural extravaganza among the UNESCO boulder monuments, featuring classical Indian dance, music recitals, light shows illuminating historic temples, and puppet shows.",
    culturalSignificance:
      "Revives the grandeur of the Vijayanagara Empire, once renowned across Asia for patronage of literature, classical music, and architecture.",
    officialWebsiteUrl: "https://karnatakatourism.org",
    isMajorFestival: true,
  },

  // Delhi / India Gate & Qutub Minar
  {
    id: "qutub-festival-delhi",
    name: "Qutub Festival of Music and Dance",
    category: "music_arts",
    recurrence: "annual",
    periodDescription: "November or December (autumn evening series)",
    placeIds: ["qutub-minar"],
    districtId: "delhi-south-delhi",
    stateId: "delhi",
    venue: "Qutub Minar complex lawns, Mehrauli, New Delhi",
    summary:
      "A scenic open-air cultural festival against the illuminated backdrop of the 12th-century Qutub Minar, featuring classical Indian vocalists, Sufi singers, and dancers.",
    culturalSignificance:
      "Organized by Delhi Tourism and Sahitya Kala Parishad to celebrate Delhi's composite Ganga-Jamuni tehzeeb and architectural heritage.",
    tips: [
      "Evenings in November/December get chilly; carry warm layers.",
      "Seating is on a first-come, first-served basis for non-VIP passes.",
    ],
    officialWebsiteUrl: "https://delhitourism.gov.in",
    isMajorFestival: true,
  },

  // Tamil Nadu / Madurai Meenakshi Temple
  {
    id: "chithirai-festival-madurai",
    name: "Chithirai Festival (Thirukalyanam)",
    category: "spiritual",
    recurrence: "annual",
    periodDescription: "Chithirai month (April / May, lasting approximately 12 days)",
    placeIds: ["meenakshi-temple"],
    districtId: "tamil-nadu-madurai",
    stateId: "tamil-nadu",
    venue: "Meenakshi Amman Temple and Vaigai River, Madurai",
    summary:
      "One of South India's grandest temple festivals, depicting the celestial wedding of Goddess Meenakshi to Lord Sundareswarar, followed by Lord Kallazhagar's entry into the Vaigai River.",
    culturalSignificance:
      "A masterpiece of social integration initiated in the 17th century by King Thirumalai Nayakar, uniting Saivite and Vaishnavite traditions.",
    tips: [
      "The coronation (Pattabhishekam) and celestial wedding (Thirukalyanam) are the peak days with massive temple gatherings.",
    ],
    officialWebsiteUrl: "https://maduraimeenakshi.org",
    isMajorFestival: true,
  },
];
