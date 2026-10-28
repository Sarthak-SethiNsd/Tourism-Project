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
  {
    id: "ganesh-chaturthi-mumbai",
    name: "Ganesh Chaturthi & Visarjan",
    category: "spiritual",
    recurrence: "annual",
    periodDescription: "Bhadrapada month (August / September, 10-day celebration ending on Anant Chaturdashi)",
    placeIds: ["gateway-of-india"],
    districtId: "maharashtra-mumbai-city",
    stateId: "maharashtra",
    venue: "City-wide pandals across Mumbai with major immersion processions at Girgaon Chowpatty and South Mumbai waterfront",
    summary:
      "Mumbai's most iconic community festival honoring Lord Ganesha, culminating in massive celebratory street processions with drums, dancing, and water immersion (Visarjan) along the Arabian Sea.",
    culturalSignificance:
      "Revitalized by Bal Gangadhar Tilak in 1893 as a grand public festival to foster unity, communal solidarity, and national consciousness against British colonial rule.",
    tips: [
      "Anant Chaturdashi (10th day) features the grandest immersion processions through South and Central Mumbai.",
      "Traffic is extensively regulated; local suburban trains and metro lines provide the most reliable transit on immersion days.",
    ],
    officialWebsiteUrl: "https://maharashtratourism.gov.in",
    isMajorFestival: true,
  },
  {
    id: "kala-ghoda-arts-festival",
    name: "Kala Ghoda Arts Festival",
    category: "music_arts",
    recurrence: "annual",
    periodDescription: "First Saturday of February (traditionally 9 days, early February)",
    placeIds: ["gateway-of-india"],
    districtId: "maharashtra-mumbai-city",
    stateId: "maharashtra",
    venue: "Kala Ghoda Arts District, Fort, South Mumbai (~600 m from Gateway of India)",
    summary:
      "India's largest multicultural street art festival, transforming South Mumbai's heritage quarter into an open-air pedestrian gallery of visual arts, dance, theater, cinema, literature, and architectural walks.",
    culturalSignificance:
      "Initiated in 1999 to preserve and revitalize the historic Indo-Saracenic and Victorian Gothic heritage buildings of the Kala Ghoda sub-precinct through public arts.",
    tips: [
      "All events, exhibitions, and workshops are free and open to the public without ticket charges.",
      "Combine an afternoon heritage walk from Gateway of India through Colaba and Kala Ghoda.",
    ],
    officialWebsiteUrl: "https://kalaghodaassociation.com",
    isMajorFestival: false,
  },
  {
    id: "ellora-ajanta-festival",
    name: "Ellora-Ajanta International Music & Dance Festival",
    category: "music_arts",
    recurrence: "annual",
    periodDescription: "January / February (annual multi-day cultural festival organized by MTDC)",
    placeIds: ["ajanta-caves"],
    districtId: "maharashtra-aurangabad",
    stateId: "maharashtra",
    venue: "Soneri Mahal campus / Ellora & Ajanta precincts, Chhatrapati Sambhajinagar",
    summary:
      "A premier classical cultural gathering bringing India's foremost vocalists, instrumentalists, and classical dancers to perform against the historic backdrop of ancient cave art and heritage architecture.",
    culturalSignificance:
      "Organized by Maharashtra Tourism Development Corporation (MTDC) to celebrate the artistic and sculptural genius of the UNESCO World Heritage Ajanta and Ellora Caves.",
    tips: [
      "Evenings feature open-air classical recitals under illuminated heritage monuments.",
      "MTDC operates dedicated festival shuttle buses from central Aurangabad transit hubs.",
    ],
    officialWebsiteUrl: "https://maharashtratourism.gov.in",
    isMajorFestival: true,
  },
  {
    id: "republic-day-kartavya-path",
    name: "Republic Day Parade & Beating Retreat",
    category: "heritage",
    recurrence: "annual",
    periodDescription: "January 26 to 29 annually (Parade on January 26, Beating Retreat at Vijay Chowk on January 29)",
    placeIds: ["india-gate-delhi"],
    districtId: "delhi-new-delhi",
    stateId: "delhi",
    venue: "Kartavya Path directly past India Gate to National War Memorial, New Delhi",
    summary:
      "India's paramount national ceremonial parade showcasing military regiments, cultural tableaux from each state, folk performances, and an Indian Air Force flypast moving down Kartavya Path past India Gate.",
    culturalSignificance:
      "Commemorates the adoption of the Constitution of India on January 26, 1950, expressing national unity, sovereign democracy, and India's immense cultural diversity.",
    tips: [
      "Public access requires reserved tickets or invitation passes issued via the official Aamantran government portal.",
      "Metro stations along Central Secretariat and Kartavya Path have regulated timings on January 26.",
    ],
    officialWebsiteUrl: "https://delhitourism.gov.in",
    isMajorFestival: true,
  },
  {
    id: "nanda-devi-mahotsav-nainital",
    name: "Nanda Devi Mahotsav & Fair",
    category: "spiritual",
    recurrence: "annual",
    periodDescription: "Bhadrapada Shukla Ashtami (September, lasting 5 to 7 days)",
    placeIds: ["naini-lake"],
    districtId: "uttarakhand-nainital",
    stateId: "uttarakhand",
    venue: "Naina Devi Temple grounds on northern shore of Naini Lake and Flatts ground, Nainital",
    summary:
      "A historic Kumaoni hill festival honoring Goddess Nanda Devi and Sunanda Devi, featuring traditional Chanchari folk dances, devotional processions around Naini Lake, and a bustling handicrafts fair.",
    culturalSignificance:
      "Traced back to the Chand dynasty kings of Kumaon in the 16th century, celebrating Goddess Nanda Devi as the celestial protector and family deity of the Central Himalayas.",
    tips: [
      "The final day features a sacred idol immersion procession in the waters of Naini Lake.",
      "The Flatts ground adjoining the lake hosts folk theater, regional Kumaoni food stalls, and woolens.",
    ],
    officialWebsiteUrl: "https://uttarakhandtourism.gov.in",
    isMajorFestival: true,
  },
  {
    id: "international-yoga-festival-rishikesh",
    name: "International Yoga Festival",
    category: "spiritual",
    recurrence: "annual",
    periodDescription: "First week of March every year (March 1–7)",
    placeIds: ["rishikesh-ghats"],
    districtId: "uttarakhand-dehradun",
    stateId: "uttarakhand",
    venue: "Parmarth Niketan Ashram and Ganga riverfront ghats, Rishikesh",
    summary:
      "A world-renowned annual gathering of spiritual masters, yogis, and seekers from over 80 nations participating in traditional pranayama, asana sessions, Vedic chanting, and discourse on the banks of the sacred Ganga.",
    culturalSignificance:
      "Anchored in the ancient yogic heritage of Rishikesh, celebrated globally as the 'Yoga Capital of the World' nestled in the Himalayan foothills.",
    tips: [
      "Registration is managed through the Uttarakhand Tourism Development Board and Parmarth Niketan.",
      "Early morning meditation sessions begin at sunrise overlooking the river ghats.",
    ],
    officialWebsiteUrl: "https://internationalyogafestival.com",
    isMajorFestival: true,
  },
  {
    id: "ganga-aarti-triveni-ghat",
    name: "Maha Aarti at Triveni Ghat",
    category: "spiritual",
    recurrence: "daily",
    periodDescription: "Daily at sunset (around 6:00 PM winter / 7:00 PM summer)",
    placeIds: ["rishikesh-ghats"],
    districtId: "uttarakhand-dehradun",
    stateId: "uttarakhand",
    venue: "Triveni Ghat steps, Rishikesh",
    summary:
      "A moving daily evening riverfront prayer featuring rhythmic bhajan chants, ringing temple bells, and the waving of tiered brass fire lamps by priests at the holy confluence of Ganga, Yamuna, and Saraswati.",
    culturalSignificance:
      "One of the most sacred pilgrimage traditions in the Garhwal Himalayas, where devotees release floating leaf cups with flowers and oil lamps (diyas) downstream into the river.",
    tips: [
      "Arrive at least 30 minutes before twilight to find comfortable step seating near the central aarti platform.",
      "Footwear must be deposited at the complimentary shoe stalls before descending to the ghat.",
    ],
    officialWebsiteUrl: "https://uttarakhandtourism.gov.in",
    isMajorFestival: false,
  },
  {
    id: "margazhi-season-chennai",
    name: "Chennai Margazhi Music & Dance Season",
    category: "music_arts",
    recurrence: "annual",
    periodDescription: "Mid-December to mid-January (Tamil Margazhi month, lasting 5 to 6 weeks)",
    placeIds: ["marina-beach"],
    districtId: "tamil-nadu-chennai",
    stateId: "tamil-nadu",
    venue: "Sabhas and cultural auditoriums throughout Chennai (Music Academy, Narada Gana Sabha, Kalakshetra) and coastal heritage zones",
    summary:
      "The world's largest classical cultural festival, featuring over 2,000 live performances of Carnatic classical vocal, veena, mridangam concerts, Bharatanatyam recitals, and temple lectures.",
    culturalSignificance:
      "Initiated in 1927 to commemorate the founding of the Madras Music Academy, honoring the sacred month of Margazhi as described in Andal's ancient Tiruppavai hymns.",
    tips: [
      "Morning concerts and lecture-demonstrations (lec-dems) are frequently free or open entry.",
      "The authentic 'Sabha canteens' serving freshly prepared filter coffee and South Indian delicacies are a beloved cultural hallmark.",
    ],
    officialWebsiteUrl: "https://tamilnadutourism.tn.gov.in",
    isMajorFestival: true,
  },
];
