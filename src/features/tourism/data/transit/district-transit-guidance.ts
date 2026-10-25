import type { TourismTransitGuidance } from "@/types/tourism";

/**
 * Curated registry of verified district/regional transit corridors.
 *
 * Rules:
 * - Regional hubs are gateways serving the wider district, not facilities at individual monuments.
 * - All entries are verified against official Indian Railways, State Road Transport Corporations, and AAI records.
 * - Keys must match standard district IDs produced by createDistrictList(regionId, [names]).
 */
export const districtTransitRegistry: Record<string, TourismTransitGuidance> = {
  // Rajasthan
  "rajasthan-jaipur": {
    rail: "Jaipur Junction (JP) and Gandhinagar Jaipur (GADJ) serve as the district's primary rail gateways with broad connectivity across India.",
    road: "Sindhi Camp Central Bus Terminal (RSRTC) operates express and deluxe buses connecting regional and inter-state corridors.",
    air: "Jaipur International Airport (JAI) at Sanganer operates regular domestic and international flights.",
    local: "Jaipur Metro, city low-floor buses, auto-rickshaws, and app-based taxis provide intra-district transit.",
  },
  "rajasthan-udaipur": {
    rail: "Udaipur City Railway Station (UDZ) connects the district with major North and West Indian cities via North Western Railway.",
    road: "Udaipur Central Bus Stand (Udiapole) connects across Rajasthan, Gujarat, and Madhya Pradesh.",
    air: "Maharana Pratap Airport (UDR) at Dabok serves domestic flights to key Indian metros.",
    local: "Auto-rickshaws, municipal buses, and tourist taxis provide onward travel within the district.",
  },
  "rajasthan-jodhpur": {
    rail: "Jodhpur Junction (JU) provides extensive rail links to Delhi, Mumbai, Ahmedabad, and Jaipur.",
    road: "Raika Bagh Central Bus Stand (RSRTC) connects the Thar desert region and surrounding districts.",
    air: "Jodhpur Civil Airport (JDH) operates daily flights connecting major commercial centers.",
    local: "City buses, auto-rickshaws, and rental cabs operate throughout Jodhpur urban and suburban zones.",
  },
  "rajasthan-jaisalmer": {
    rail: "Jaisalmer Railway Station (JSM) connects directly to Delhi, Jodhpur, and Jaipur.",
    road: "RSRTC Jaisalmer Depot operates regular services to Jodhpur, Bikaner, and Barmer.",
    air: "Jaisalmer Airport (JSA) operates scheduled civil flights during the peak tourist season.",
    local: "Auto-rickshaws, shared jeeps, and desert safari transport connect to surrounding dunes and villages.",
  },

  // Uttar Pradesh
  "uttar-pradesh-agra": {
    rail: "Agra Cantt (AGC) and Agra Fort (AF) stations serve as major railway junctions on the North Central network.",
    road: "Agra Inter-State Bus Terminal (ISBT Transport Nagar) and Idgah Bus Stand connect major corridors across UP, Delhi, and Rajasthan.",
    air: "Agra Airport (AGR, Kheria) operates select domestic connections; Indira Gandhi International Airport (DEL) in New Delhi serves as the primary international gateway.",
    local: "Prepaid cabs, auto-rickshaws, and electric vehicles operate throughout the metropolitan region.",
  },
  "uttar-pradesh-varanasi": {
    rail: "Varanasi Junction / Cantt (BSB) and Banaras (BSBS) provide comprehensive railway links across North, East, and Central India.",
    road: "Chaudhary Charan Singh Cantt Bus Station operates frequent inter-district and inter-state buses.",
    air: "Lal Bahadur Shastri International Airport (VNS) at Babatpur serves domestic routes and direct flights to regional hubs.",
    local: "Auto-rickshaws, e-rickshaws, and city taxis provide transit between railheads and local localities.",
  },

  // Kerala
  "kerala-idukki": {
    rail: "Railhead access is outside the hill district; Aluva (AWY) and Ernakulam Junction (ERS) in the plains serve as the primary rail connection points.",
    road: "KSRTC Munnar and Kumily depots run ghat-road services linking Kottayam, Ernakulam, and Madurai.",
    air: "Cochin International Airport (COK) at Nedumbassery is the primary airport serving the Idukki hill region.",
    local: "KSRTC local buses, shared jeeps, and private taxis navigate mountain and plantation roads.",
  },
  "kerala-alappuzha": {
    rail: "Alappuzha Railway Station (ALLP) connects coastal rail corridors running between Ernakulam and Thiruvananthapuram.",
    road: "KSRTC Alappuzha Central Bus Station operates express services along NH 66.",
    air: "Cochin International Airport (COK) is the nearest international airport serving the coastal backwater district.",
    local: "SWTD (State Water Transport Department) public ferry boats, auto-rickshaws, and canal shikaras provide local transit.",
  },

  // Goa
  "goa-north-goa": {
    rail: "Thivim (THVM) and Karmali (KRMI) on the Konkan Railway network are the primary rail stations for North Goa.",
    road: "Kadamba Transport Corporation (KTC) bus terminals at Panaji and Mapusa operate regional and inter-state coaches.",
    air: "Manohar International Airport (GOX) at Mopa and Dabolim Airport (GOI) provide domestic and international air connectivity.",
    local: "KTC public buses, pilot motorcycle taxis, auto-rickshaws, and rental vehicles serve the coastal and interior routes.",
  },

  // Karnataka
  "karnataka-mysuru": {
    rail: "Mysuru Junction (MYS) connects via electrified broad gauge to Bengaluru and major southern railway networks.",
    road: "Mysuru KSRTC Suburban Bus Stand operates comprehensive express routes across Karnataka, Kerala, and Tamil Nadu.",
    air: "Mysuru Airport (MYQ) operates regional flights; Kempegowda International Airport (BLR) in Bengaluru provides global connectivity.",
    local: "Mysuru City Bus Service (KSRTC low-floor buses), auto-rickshaws, and tongas operate within the urban core.",
  },

  // Delhi
  "delhi-new-delhi": {
    rail: "New Delhi Railway Station (NDLS) and Delhi Sarai Rohilla (DEE) serve as central hubs for national express trains.",
    road: "Maharana Pratap ISBT (Kashmere Gate) and Sarai Kale Khan ISBT connect extensive regional highway buses.",
    air: "Indira Gandhi International Airport (DEL) provides full domestic and international passenger operations.",
    local: "Delhi Metro network (Yellow and Blue lines), DTC low-floor city buses, and electric rickshaws provide seamless transit.",
  },
  "delhi-south-delhi": {
    rail: "Hazrat Nizamuddin Railway Station (NZM) serves major North-South and Rajdhani rail corridors.",
    road: "Sarai Kale Khan Inter-State Bus Terminus connects intercity buses traveling towards Uttar Pradesh, Rajasthan, and Haryana.",
    air: "Indira Gandhi International Airport (DEL) is directly accessible via the Airport Express Metro and Ring Road corridors.",
    local: "Delhi Metro (Magenta, Violet, and Pink lines), feeder buses, and app-based auto-rickshaws provide local connectivity.",
  },

  // Tamil Nadu
  "tamil-nadu-chennai": {
    rail: "Chennai Central (MAS) and Chennai Egmore (MS) are the primary railway gateways for North-bound and South-bound trains.",
    road: "Kalaignar Centenary Bus Terminus (KCBT Kilambakkam) and CMBT Koyambedu link omni and state express buses across South India.",
    air: "Chennai International Airport (MAA) at Meenambakkam connects comprehensive international and domestic air routes.",
    local: "Chennai Metro Rail, Suburban EMU trains, MRTS, and MTC city buses provide extensive metropolitan transit.",
  },
  "tamil-nadu-madurai": {
    rail: "Madurai Junction (MDU) on Southern Railway connects directly to Chennai, Bengaluru, and southern Tamil Nadu destinations.",
    road: "M.G.R. Integrated Bus Stand (Mattuthavani / MIBT) and Arappalayam Bus Stand connect regional routes.",
    air: "Madurai Airport (IXM) operates daily flights to domestic metros and regional overseas destinations.",
    local: "TNSTC town buses, auto-rickshaws, and shared taxis provide local connectivity across Madurai.",
  },

  // Arunachal Pradesh
  "arunachal-pradesh-tawang": {
    rail: "No direct railhead inside the high-altitude district; Bhalukpong (BPU) and Rangapara North (RPAN) in Assam serve as rail heads in the foothills.",
    road: "Arunachal Pradesh State Transport (APST) buses and shared Sumo passenger services link Tawang via Bomdila and Sela Pass from Tezpur.",
    air: "Lokpriya Gopinath Bordoloi International Airport (GAU) in Guwahati and Tezpur Airport serve as air entry points.",
    local: "Local shared Sumo vehicles and private mountain taxis provide transport across high-altitude roads.",
  },
};
