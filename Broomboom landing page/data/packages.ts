import { PackageItem } from "@/types";

export interface RentalPackage {
  id: string;
  title: string;
  subtitle: string;
  hoursKm: string;
  rentalType: string;
  duration: string;
  category: string;
  badge: string;
  optimalTime: string;
  priceStarting: number;
  highlights: string[];
  inclusions: string[];
  image: string;
}

export interface OutstationRoute {
  id: string;
  title: string;
  popularStops: string;
  distance: string;
  estimatedTime: string;
  tag: string;
  startingPrice: number;
  routeHighlights: string[];
  image: string;
  prices: {
    sedan: number;
    suv: number;
    suvPlus: number;
  };
}

export const RENTAL_PACKAGES: RentalPackage[] = [
  {
    id: "pkg_5hr_50km",
    title: "5 Hours / 50 KMs Rental Package",
    subtitle: "Ideal for quick morning darshan, elderly-friendly short hops & Bonedi Bari heritage pandals",
    hoursKm: "5 Hours / 50 KMs",
    rentalType: "Morning Rentals",
    duration: "5 Hours",
    category: "Short Pandal Hopping",
    badge: "🌅 Morning Special",
    optimalTime: "08:00 AM – 01:00 PM",
    priceStarting: 3551,
    highlights: [
      "Sovabazar Rajbari & Bagbazar Sarbojanin",
      "Kumartuli Park & Ahiritola Ghat",
      "College Square & Mohammed Ali Park",
      "Dedicated Chauffeur on Standby",
    ],
    inclusions: [
      "50 KMs & 5 Hours Included",
      "Chilled Dual AC & Sanitised Cab",
      "Driver Allowance & Fuel Included",
      "Free 24h Cancellation",
    ],
    image: "/images/d1.png",
  },
  {
    id: "pkg_8hr_80km",
    title: "8 Hours / 80 KMs Rental Package",
    subtitle: "Most popular choice for prime evening illumination & mega pandals with dining adda halts",
    hoursKm: "8 Hours / 80 KMs",
    rentalType: "Evening Rentals",
    duration: "8 Hours",
    category: "Prime Evening Circuit",
    badge: "🔥 Most Popular",
    optimalTime: "04:00 PM – 12:00 Midnight",
    priceStarting: 4551,
    highlights: [
      "Suruchi Sangha & Chetla Agrani",
      "Mudiali Club & Tridhara Sammilani",
      "Ekdalia Evergreen & Singhi Park",
      "Ballygunge Cultural & Badamtala",
    ],
    inclusions: [
      "80 KMs & 8 Hours Included",
      "Dedicated Route-Master Chauffeur",
      "All West Bengal Toll Taxes Handled",
      "Senior Citizen Drop Points",
    ],
    image: "/images/d2.png",
  },
  {
    id: "pkg_10hr_100km",
    title: "10 Hours / 100 KMs Rental Package",
    subtitle: "Complete twin-circuit coverage of both North & South Kolkata iconic theme pandals in one trip",
    hoursKm: "10 Hours / 100 KMs",
    rentalType: "Full Day Circuit",
    duration: "10 Hours",
    category: "Twin Mega Circuit",
    badge: "⭐ Grand Explorer",
    optimalTime: "02:00 PM – 12:00 Midnight",
    priceStarting: 5051,
    highlights: [
      "North Kolkata Bonedi Bari & Rajbari",
      "Salt Lake FD Block & Sreebhumi",
      "South Kolkata Theme Pandals",
      "Flexible Food & Adda Breaks",
    ],
    inclusions: [
      "100 KMs & 10 Hours Included",
      "Chilled Dual AC for Entire Family",
      "Police Route Barricade Bypass Guide",
      "Complimentary Water Bottles",
    ],
    image: "/images/d3.jpg",
  },
  {
    id: "pkg_12hr_120km",
    title: "12 Hours / 120 KMs Rental Package",
    subtitle: "Zero-traffic midnight to morning VIP Parikrama with peaceful darshan across top 20 pandals",
    hoursKm: "12 Hours / 120 KMs",
    rentalType: "Midnight VIP Tour",
    duration: "12 Hours",
    category: "All-Night VIP Parikrama",
    badge: "✨ Zero Traffic VIP",
    optimalTime: "08:00 PM – 08:00 AM",
    priceStarting: 6051,
    highlights: [
      "Sreebhumi Sporting Club Light Show",
      "Santosh Mitra Square & Dum Dum Park",
      "Tala Prattoy & Kashi Bose Lane",
      "Ballygunge Cultural & Behala Club",
    ],
    inclusions: [
      "120 KMs & 12 Hours Included",
      "Assigned Night Route Specialist",
      "24x7 Control Room Live Monitoring",
      "Emergency Standby Vehicle Backup",
    ],
    image: "/images/d4.jpg",
  },
];

export const OUTSTATION_ROUTES: OutstationRoute[] = [
  // ---- EXISTING ROUTES (UPDATED WITH PRICES) ----
  {
    id: "kolkata-digha",
    title: "Kolkata to Digha",
    popularStops: "Old Digha • New Digha • Marine Drive • Udaipur Beach",
    distance: "185 KM",
    estimatedTime: "4.5 Hours",
    tag: "🌊 Beach Gateway",
    startingPrice: 3299,
    routeHighlights: [
      "Kolkata to Digha Sea Beach",
      "Marine Drive & Udaipur Border",
      "Kolaghat Hilsa & Tea Stop",
      "Sanitised roundtrip AC cab",
    ],
    image: "/images/digha.jpg",
    prices: { sedan: 3299, suv: 4299, suvPlus: 5499 },
  },
  {
    id: "kolkata-mayapur",
    title: "Kolkata to Mayapur",
    popularStops: "ISKCON TOVP Temple • Ganga Aarti • Nabadwip Dham",
    distance: "130 KM",
    estimatedTime: "3.5 Hours",
    tag: "🛕 Spiritual Tour",
    startingPrice: 2499,
    routeHighlights: [
      "ISKCON Temple of Vedic Planetarium",
      "Ganga Arati at Mayapur Ghat",
      "Shantipur Handloom & Sweet hub",
      "Day trip / overnight booking",
    ],
    image: "/images/mayapur.jpg",
    prices: { sedan: 2499, suv: 3599, suvPlus: 4599 }, // approximate – not in matrix, kept original as base
  },
  {
    id: "kolkata-mandarmani",
    title: "Kolkata to Mandarmani",
    popularStops: "Beach Resort • Red Crab Beach • Tajpur Confluence",
    distance: "175 KM",
    estimatedTime: "4.5 Hours",
    tag: "🦀 Luxury Resorts",
    startingPrice: 3299,
    routeHighlights: [
      "Drive-in Sea Beach access",
      "Tajpur & Shankarpur coastal road",
      "Kolaghat food plaza halt",
      "Full festive weekend support",
    ],
    image: "/images/mandarmani.jpg",
    prices: { sedan: 3299, suv: 4299, suvPlus: 5499 },
  },
  {
    id: "kolkata-bolpur",
    title: "Kolkata to Bolpur-Shantiniketan",
    popularStops: "Visva Bharati • Sonajhuri Haat • Kopai River",
    distance: "165 KM",
    estimatedTime: "4 Hours",
    tag: "🎨 Baul & Culture",
    startingPrice: 2999,
    routeHighlights: [
      "Visva-Bharati Ashram & Museum",
      "Saturday Sonajhuri Sanibarer Haat",
      "Shaktigarh Lyangcha tasting stop",
      "Chauffeur trained on Durgapur Exp",
    ],
    image: "/images/Santiniketan.jpg",
    prices: { sedan: 2999, suv: 3799, suvPlus: 4799 },
  },
  {
    id: "kolkata-ranchi",
    title: "Kolkata to Ranchi",
    popularStops: "Hundru Falls • Jonha Falls • Patratu Valley",
    distance: "400 KM",
    estimatedTime: "8.5 Hours",
    tag: "🌲 Waterfall Escapes",
    startingPrice: 5999,
    routeHighlights: [
      "Scenic Patratu Valley Ghat drive",
      "Hundru & Dassam Waterfalls",
      "Jharkhand interstate permit handled",
      "Dual driver option on request",
    ],
    image: "/images/ranchi.jpg",
    prices: { sedan: 5999, suv: 7499, suvPlus: 8999 },
  },

  // ---- NEW ROUTES FROM PRICE MATRIX ----
  {
    id: "kolkata-deoghar",
    title: "Kolkata to Deoghar",
    popularStops: "Baba Baidyanath Temple • Nandan Pahar • Basukinath",
    distance: "370 KM",
    estimatedTime: "7.5 Hours",
    tag: "🛕 Pilgrimage",
    startingPrice: 5499,
    routeHighlights: [
      "Baba Baidyanath Jyotirlinga darshan",
      "Scenic route via Dumka & Jasidih",
      "Breakfast halt at Ajoy River",
      "Interstate permit & tolls included",
    ],
    image: "/images/deoghar.jpg",
    prices: { sedan: 5499, suv: 6999, suvPlus: 8499 },
  },
  {
    id: "kolkata-jamshedpur",
    title: "Kolkata to Jamshedpur",
    popularStops: "Jubilee Park • Tata Steel • Dalma Wildlife Sanctuary",
    distance: "280 KM",
    estimatedTime: "5.5 Hours",
    tag: "🏭 Steel City",
    startingPrice: 4499,
    routeHighlights: [
      "Smooth NH18 expressway drive",
      "Jubilee Park & Tata Zoological Park",
      "Dalma Hill forest reserve stop",
      "Corporate & family trip ready",
    ],
    image: "/images/jamsedpur.jpg",
    prices: { sedan: 4499, suv: 5799, suvPlus: 6999 },
  },
  {
    id: "kolkata-bhubaneswar",
    title: "Kolkata to Bhubaneswar",
    popularStops: "Lingaraj Temple • Dhauli Stupa • Nandankanan Zoo",
    distance: "450 KM",
    estimatedTime: "8.5 Hours",
    tag: "🏛️ Temple City",
    startingPrice: 6499,
    routeHighlights: [
      "NH16 coastal highway drive",
      "Lingaraj & Mukteswar temple visit",
      "Dhauli peace pagoda & elephant safari",
      "Odisha interstate permit managed",
    ],
    image: "/images/Bhu.jpg",
    prices: { sedan: 6499, suv: 8299, suvPlus: 9999 },
  },
  {
    id: "kolkata-puri",
    title: "Kolkata to Puri",
    popularStops: "Jagannath Temple • Puri Beach • Konark Sun Temple",
    distance: "500 KM",
    estimatedTime: "9.5 Hours",
    tag: "🌊 Divine Beach",
    startingPrice: 7299,
    routeHighlights: [
      "Jagannath Dham darshan",
      "Sun Temple Konark & Chandrabhaga beach",
      "Puri sea walk & local seafood",
      "Overnight / 2‑day custom trips",
    ],
    image: "/images/puri.jpg",
    prices: { sedan: 7299, suv: 9299, suvPlus: 10999 },
  },
  {
    id: "kolkata-darjeeling",
    title: "Kolkata to Darjeeling",
    popularStops: "Toy Train • Tiger Hill • Batasia Loop • Ghoom",
    distance: "650 KM",
    estimatedTime: "13 Hours",
    tag: "🏔️ Queen of Hills",
    startingPrice: 8499,
    routeHighlights: [
      "Scenic NH12 & Hill cart road",
      "Tiger Hill sunrise & Batasia Loop",
      "Darjeeling tea garden stop",
      "Hill‑trained chauffeur provided",
    ],
    image: "/images/dar.jpg",
    prices: { sedan: 8499, suv: 10499, suvPlus: 12499 },
  },
  {
    id: "kolkata-gangtok",
    title: "Kolkata to Gangtok",
    popularStops: "MG Marg • Tsomgo Lake • Nathula Pass • Rumtek",
    distance: "720 KM",
    estimatedTime: "14.5 Hours",
    tag: "🏔️ Himalayan Escape",
    startingPrice: 9499,
    routeHighlights: [
      "Pristine Teesta river drive",
      "Tsomgo Lake & Baba Mandir",
      "Nathula Pass (permit arranged)",
      "Sikkim entry permit assistance",
    ],
    image: "/images/gan.jpg",
    prices: { sedan: 9499, suv: 11499, suvPlus: 13499 },
  },{
  id: "kolkata-gangasagar",
  title: "Kolkata to Ganga Sagar",
  popularStops: "Kapil Muni Temple • Sagar Island • Gangasagar Mela Ground • Kachuberia Ferry",
  distance: "130 KM + Ferry",
  estimatedTime: "4.5 Hours",
  tag: "🕉️ Sacred Pilgrimage",
  startingPrice: 3499,
  routeHighlights: [
    "Scenic drive via Diamond Harbour & Namkhana",
    "Ferry crossing to Sagar Island (boat ticket included)",
    "Kapil Muni Temple & holy dip at Gangasagar",
    "Fresh coconut water & local sweet stalls",
  ],
  image: "/images/gangasagar.jpg",
  prices: { sedan: 3499, suv: 4599, suvPlus: 5799 },
},
];

export const PACKAGES_DATA: Record<string, PackageItem> = {
  pkg_5hr_50km: {
    id: "pkg_5hr_50km",
    type: "pandal",
    title: "5 Hours / 50 KMs Rental Package",
    subtitle: "5 Hours",
    highlights: [],
    badge: "Morning",
  },
  pkg_8hr_80km: {
    id: "pkg_8hr_80km",
    type: "pandal",
    title: "8 Hours / 80 KMs Rental Package",
    subtitle: "8 Hours",
    highlights: [],
    badge: "Evening",
  },
  pkg_10hr_100km: {
    id: "pkg_10hr_100km",
    type: "pandal",
    title: "10 Hours / 100 KMs Rental Package",
    subtitle: "10 Hours",
    highlights: [],
    badge: "Full Day",
  },
  pkg_12hr_120km: {
    id: "pkg_12hr_120km",
    type: "pandal",
    title: "12 Hours / 120 KMs Rental Package",
    subtitle: "12 Hours",
    highlights: [],
    badge: "Midnight",
  },
};