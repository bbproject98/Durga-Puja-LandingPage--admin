/**
 * Special Kolkata Durga Puja Landing Page & Booking Engine
 * Dynamic State Machine & Controller
 */

// --- Fleet Database ---
const FLEET_DATA = {
  sedan_4: {
    id: "sedan_4",
    name: "Sedan (4 Seater)",
    models: "Swift Dzire / Toyota Etios / Hyundai Aura",
    seats: 4,
    luggage: "2 Large Bags + 2 Handbags",
    category: "sedan",
    tag: "Most Popular for Small Families & Couples",
    badgeColor: "badge-gold",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
    basePrice: 2499,
    baseHours: 8,
    baseKm: 80,
    nightPrice: 3199,
    perExtraHour: 250,
    outstationPerKm: 13,
    features: ["Chilled Dual AC", "Sanitised & Clean Interior", "Kolkata Pandal Route Specialist Driver", "Complimentary Water Bottles", "Free Cancellation up to 24 hrs"]
  },
  suv_6: {
    id: "suv_6",
    name: "SUV (6 Seater)",
    models: "Maruti Ertiga / Kia Carens / Renault Triber",
    seats: 6,
    luggage: "3 Large Bags + 3 Handbags",
    category: "suv",
    tag: "Best Value for Joint Families",
    badgeColor: "badge-crimson",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    basePrice: 3499,
    baseHours: 8,
    baseKm: 80,
    nightPrice: 4299,
    perExtraHour: 350,
    outstationPerKm: 16,
    features: ["Spacious 3-Row AC", "High Ground Clearance for Crowded Alleys", "Dedicated Driver Mobile with Live GPS Tracking", "Senior Citizen Step-board Support", "24x7 Puja Control Room Support"]
  },
  suv_7: {
    id: "suv_7",
    name: "SUV+ (7 Seater)",
    models: "Toyota Innova Crysta / Hycross / Scorpio-N",
    seats: 7,
    luggage: "4 Large Bags + 4 Handbags",
    category: "suv",
    tag: "VIP Luxury & Ultimate Comfort",
    badgeColor: "badge-gold",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    basePrice: 4799,
    baseHours: 8,
    baseKm: 80,
    nightPrice: 5999,
    perExtraHour: 450,
    outstationPerKm: 21,
    features: ["Captain Recliner Seats", "Ultra-smooth Suspension for Senior Citizens", "Chauffeur in Uniform with 10+ Yr Experience", "Priority VIP Drop Point Knowledge", "In-car Phone Chargers & Wet Wipes"]
  },
  traveller_13: {
    id: "traveller_13",
    name: "Tempo Traveller (13 Seater)",
    models: "Force Luxury Urbania / Tempo Traveller 3350",
    seats: 13,
    luggage: "8 Large Bags",
    category: "traveller",
    tag: "Ideal for Large Joint Families & Friends Groups",
    badgeColor: "badge-gold",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    basePrice: 7499,
    baseHours: 8,
    baseKm: 80,
    nightPrice: 8999,
    perExtraHour: 700,
    outstationPerKm: 26,
    features: ["Individual AC Vents on Every Seat", "Pushback 2x1 Luxury Seats", "Large Panoramic Windows for Illumination Views", "Ample Rear Luggage Space", "Assigned Senior Chauffeur & Cleaner"]
  },
  traveller_15: {
    id: "traveller_15",
    name: "Tempo Traveller (15 Seater)",
    models: "Force Executive Deluxe Traveller",
    seats: 15,
    luggage: "10 Large Bags",
    category: "traveller",
    tag: "Perfect for Corporate Teams & Para Clubs",
    badgeColor: "badge-crimson",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    basePrice: 8499,
    baseHours: 8,
    baseKm: 80,
    nightPrice: 9999,
    perExtraHour: 800,
    outstationPerKm: 28,
    features: ["High Roof Walkthrough Cabin", "High Quality Bluetooth Audio for Agomoni & Puja Songs", "LED Ambient Mood Lighting", "Dedicated First Aid & Sanitisation Kit", "Police Route Permission Assistance"]
  },
  traveller_17: {
    id: "traveller_17",
    name: "Tempo Traveller (17 Seater)",
    models: "Force Grand Luxury / Urbania King",
    seats: 17,
    luggage: "12 Large Bags",
    category: "traveller",
    tag: "Maximum Group Capacity & Royalty",
    badgeColor: "badge-gold",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    basePrice: 9999,
    baseHours: 8,
    baseKm: 80,
    nightPrice: 11999,
    perExtraHour: 900,
    outstationPerKm: 31,
    features: ["Ultra Luxury Pushback Leather Seats", "Dual Heavy-duty Blower AC", "Microphone PA System for Tour Coordinators", "Extra Wide Aisles & Emergency Exit", "Guaranteed Reserve Vehicle on Standby"]
  }
};

// --- Pandal Hopping & Outstation Packages ---
const PACKAGES_DATA = {
  north_heritage: {
    id: "north_heritage",
    type: "pandal",
    title: "North Kolkata Heritage & Bonedi Bari Tour",
    subtitle: "Experience 200-Year-Old Aristocratic Traditions",
    duration: "8 - 10 Hours",
    highlights: ["Sovabazar Rajbari", "Bagbazar Sarbojanin", "Kumartuli Park", "Ahiritola", "College Square", "Mohammad Ali Park"],
    foodStop: "Heritage Sweet Stopover at Girish Chandra Dey / Putiram",
    bestTime: "Morning (8 AM - 4 PM) or Evening (4 PM - Midnight)",
    badge: "Cultural Favorite",
    pricingMultiplier: 1.0
  },
  south_theme: {
    id: "south_theme",
    type: "pandal",
    title: "South Kolkata Mega Theme Extravaganza",
    subtitle: "World-Class Art, Mesmerizing Idols & Light Illuminations",
    duration: "10 - 12 Hours",
    highlights: ["Suruchi Sangha", "Chetla Agrani", "Ekdalia Evergreen", "Singhi Park", "Mudiali Club", "Tridhara Sammilani", "Badamtala Ashar Sangha", "Maddox Square"],
    foodStop: "South Kolkata Adda & Street Food stop near Maddox Square",
    bestTime: "Evening to Late Night (3 PM - 2 AM)",
    badge: "Most Glamorous",
    pricingMultiplier: 1.15
  },
  midnight_vip: {
    id: "midnight_vip",
    type: "pandal",
    title: "VIP Midnight Parikrama (Night Owl Circuit)",
    subtitle: "Witness Kolkata's Magic When Crowds Subside & Lights Shine Brightest",
    duration: "8 Hours (10:00 PM – 06:00 AM)",
    highlights: ["15+ Top Pandals across North & South", "Zero Heavy Traffic Delays", "Bypass Alley Routing", "Night Dhaba / Midnight Chai Stop"],
    foodStop: "Midnight Kolkata Roll & Chai break at Balwant Singh Eating House / Jai Hind",
    bestTime: "Midnight (10 PM - 6 AM)",
    badge: "Zero Traffic Hassle",
    pricingMultiplier: 1.25
  },
  festive_5day: {
    id: "festive_5day",
    type: "pandal",
    title: "5-Day All-Inclusive VIP Puja Chauffeur",
    subtitle: "Dedicated Luxury Car & Chauffeur from Sasthi to Dashami + Immersion Ghat",
    duration: "5 Full Days (Unlimited Daily Flexibility)",
    highlights: ["North, South, Salt Lake & Behala coverage", "Immersion (Bishorjan) Babughat / Prinsep Ghat drop", "Same Trusted Driver all 5 days", "Free VIP Entry Passes (Subject to club quota)"],
    foodStop: "Personalized daily dining & restaurant recommendations",
    bestTime: "Full 5 Days (Sasthi, Saptami, Ashtami, Navami, Dashami)",
    badge: "Ultimate Peace of Mind",
    pricingMultiplier: 4.6
  },
  outstation_digha: {
    id: "outstation_digha",
    type: "outstation",
    title: "Kolkata ⇄ Digha / Mandarmani / Tajpur Beach Getaway",
    subtitle: "Sun, Sand, Crab Masala & Coastal Sharodiya Breeze",
    duration: "2-3 Days Roundtrip / Custom",
    distance: "185 km one way (Expressway via Kolaghat)",
    highlights: ["Kolaghat Sher-e-Punjab breakfast stop", "Direct Beach resort drops", "Pujor Shondha beach walk", "Sightseeing at Old Digha, New Digha & Shankarpur"],
    badge: "Top Beach Holiday"
  },
  outstation_shantiniketan: {
    id: "outstation_shantiniketan",
    type: "outstation",
    title: "Kolkata ⇄ Shantiniketan (Bolpur) Cultural Retreat",
    subtitle: "Baul Melodies, Sonajhuri Haat & Tagore's Festive Reverence",
    duration: "2 Days Roundtrip / Custom",
    distance: "165 km one way",
    highlights: ["Sonajhuri Forest Saturday Haat", "Visva Bharati heritage tour", "Kopai River sunset", "Authentic Bengali Kansa Thaali lunch stop"],
    badge: "Art & Soul"
  },
  outstation_mayapur: {
    id: "outstation_mayapur",
    type: "outstation",
    title: "Kolkata ⇄ Mayapur / Nabadwip / Krishnanagar",
    subtitle: "Spiritual Darshan at ISKCON Temple & Krishnanagar Clay Idol Masters",
    duration: "Same Day or 2 Days",
    distance: "130 km one way",
    highlights: ["World's Largest Temple of Vedic Planetarium (TOVP)", "Ghurni Clay Doll artisans", "Authentic Sarpuria and Sarbhaja sweet tasting at Krishnanagar"],
    badge: "Spiritual & Heritage"
  },
  outstation_sundarbans: {
    id: "outstation_sundarbans",
    type: "outstation",
    title: "Kolkata ⇄ Sundarbans Delta Gateway (Godkhali)",
    subtitle: "Mangrove Mystery, River Cruises & Wild Bengal Tiger Trail",
    duration: "2-3 Days",
    distance: "105 km to Godkhali Jetty",
    highlights: ["Direct AC transfer to Godkhali Jetty", "Luggage safety while you are on the houseboat", "Complimentary rural Bengal tour stop"],
    badge: "Eco Adventure"
  }
};

// --- Booking App State ---
const AppState = {
  selectedVehicleId: "suv_7",
  selectedPackageId: "south_theme",
  selectedDate: "2026-10-18 (Maha Saptami)",
  timeSlot: "evening",
  pickupLocation: "",
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  passengers: 4,
  notes: "",
  addons: {
    vipPass: false,
    guide: false,
    sweets: false,
    wheelchair: false
  },
  confirmedBooking: null
};

// --- DOM Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  renderFleetSection();
  renderPackagesSection();
  renderOutstationSection();
  initCountdown();
  initLiveBookingToasts();
  setupEventListeners();
  updateEstimatorFare();
});

// --- Render Fleet Section ---
function renderFleetSection() {
  const grid = document.getElementById("fleet-cards-grid");
  if (!grid) return;

  grid.innerHTML = Object.values(FLEET_DATA).map(car => `
    <div class="glass-panel rounded-2xl overflow-hidden border border-amber-500/20 glow-card flex flex-col justify-between group">
      <div>
        <div class="relative h-52 overflow-hidden bg-slate-900">
          <img src="${car.image}" alt="${car.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <div class="absolute top-3 left-3">
            <span class="px-3 py-1 text-xs font-semibold rounded-full ${car.badgeColor === 'badge-gold' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-red-600/30 text-red-300 border border-red-500/40'} backdrop-blur-md">
              ${car.tag}
            </span>
          </div>
          <div class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs text-amber-300 font-medium flex items-center gap-1.5">
            <i class="fa-solid fa-users text-amber-400"></i> ${car.seats} Seater
          </div>
        </div>

        <div class="p-6">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">${car.name}</h3>
              <p class="text-xs text-slate-400 mt-0.5">${car.models}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 my-4 p-3 bg-slate-900/60 rounded-xl border border-white/5 text-xs text-slate-300">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-suitcase text-amber-400"></i>
              <span>${car.luggage}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-snowflake text-cyan-400"></i>
              <span>Chilled Dual AC</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-clock text-amber-400"></i>
              <span>8 Hrs / 80 Km Base</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-shield-halved text-emerald-400"></i>
              <span>Verified Chauffeur</span>
            </div>
          </div>

          <ul class="space-y-1.5 mb-5 text-xs text-slate-400">
            ${car.features.slice(0, 3).map(f => `
              <li class="flex items-center gap-2">
                <i class="fa-solid fa-circle-check text-amber-400 text-[10px]"></i>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <div class="p-6 pt-0 border-t border-white/5">
        <div class="flex items-end justify-between my-3">
          <div>
            <span class="text-[11px] uppercase tracking-wider text-slate-400 block">Festive Puja Rate</span>
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-black text-amber-400">₹${car.basePrice.toLocaleString()}</span>
              <span class="text-xs text-slate-400">/ 8 hrs</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-[11px] text-slate-400 block">Night Parikrama</span>
            <span class="text-sm font-semibold text-rose-300">₹${car.nightPrice.toLocaleString()}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 mt-4">
          <button onclick="openBookingModal('${car.id}', 'south_theme')" class="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5">
            <i class="fa-solid fa-bolt text-xs"></i> Book Vehicle
          </button>
          <a href="https://wa.me/918240765499?text=Hi%20PujoParikrama,%20I%20am%20interested%20in%20booking%20${encodeURIComponent(car.name)}%20for%20Durga%20Puja." target="_blank" class="w-full py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5">
            <i class="fa-brands fa-whatsapp text-emerald-400"></i> WhatsApp
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

// --- Filter Fleet by Category ---
window.filterFleet = function(category) {
  const tabs = document.querySelectorAll(".fleet-filter-btn");
  tabs.forEach(tab => {
    if (tab.dataset.category === category) {
      tab.classList.add("bg-amber-500", "text-slate-950", "font-bold");
      tab.classList.remove("bg-slate-900/80", "text-slate-300", "border-white/10");
    } else {
      tab.classList.remove("bg-amber-500", "text-slate-950", "font-bold");
      tab.classList.add("bg-slate-900/80", "text-slate-300", "border-white/10");
    }
  });

  const cards = document.querySelectorAll("#fleet-cards-grid > div");
  Object.values(FLEET_DATA).forEach((car, index) => {
    if (category === "all" || car.category === category) {
      cards[index].style.display = "flex";
    } else {
      cards[index].style.display = "none";
    }
  });
};

// --- Render Packages Section ---
function renderPackagesSection() {
  const container = document.getElementById("packages-grid");
  if (!container) return;

  const pandalPackages = Object.values(PACKAGES_DATA).filter(p => p.type === "pandal");

  container.innerHTML = pandalPackages.map(pkg => `
    <div class="glass-panel rounded-2xl p-6 md:p-8 border border-amber-500/20 glow-card flex flex-col justify-between relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div>
        <div class="flex items-center justify-between gap-2 mb-3">
          <span class="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-full">
            ${pkg.badge}
          </span>
          <span class="text-xs text-slate-400 flex items-center gap-1.5">
            <i class="fa-regular fa-clock text-amber-400"></i> ${pkg.duration}
          </span>
        </div>

        <h3 class="text-2xl font-bold text-white font-festive mb-1">${pkg.title}</h3>
        <p class="text-xs text-amber-200/80 mb-5">${pkg.subtitle}</p>

        <div class="mb-5 bg-slate-900/60 p-4 rounded-xl border border-white/5">
          <span class="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block mb-2">Featured Pandal Stops</span>
          <div class="flex flex-wrap gap-1.5">
            ${pkg.highlights.map(h => `
              <span class="px-2.5 py-1 bg-slate-800/80 border border-white/10 rounded-lg text-xs text-slate-200 flex items-center gap-1">
                <i class="fa-solid fa-om text-red-400 text-[10px]"></i> ${h}
              </span>
            `).join('')}
          </div>
        </div>

        <div class="space-y-2 mb-6 text-xs text-slate-300">
          <div class="flex items-start gap-2">
            <i class="fa-solid fa-utensils text-amber-400 mt-0.5"></i>
            <span><strong>Food & Refreshment:</strong> ${pkg.foodStop}</span>
          </div>
          <div class="flex items-start gap-2">
            <i class="fa-solid fa-sun text-amber-400 mt-0.5"></i>
            <span><strong>Optimal Slot:</strong> ${pkg.bestTime}</span>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span class="text-[11px] text-slate-400 block">Package Starting from</span>
          <span class="text-xl font-bold text-amber-400">₹${Math.round(2499 * pkg.pricingMultiplier).toLocaleString()} <span class="text-xs text-slate-400 font-normal">(Sedan 4s)</span></span>
        </div>
        <button onclick="openBookingModal('suv_7', '${pkg.id}')" class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-700/30 transition-all flex items-center justify-center gap-2">
          <span>Book This Itinerary</span>
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// --- Render Outstation Section ---
function renderOutstationSection() {
  const container = document.getElementById("outstation-grid");
  if (!container) return;

  const outstationList = Object.values(PACKAGES_DATA).filter(p => p.type === "outstation");

  container.innerHTML = outstationList.map(item => `
    <div class="glass-panel rounded-2xl p-6 border border-white/10 glow-card flex flex-col justify-between group">
      <div>
        <div class="flex justify-between items-start mb-3">
          <span class="px-2.5 py-0.5 text-[11px] bg-red-600/30 border border-red-500/40 text-red-300 rounded-full font-medium">
            ${item.badge}
          </span>
          <span class="text-xs text-slate-400 flex items-center gap-1">
            <i class="fa-solid fa-route text-amber-400"></i> ${item.distance}
          </span>
        </div>

        <h4 class="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-1">${item.title}</h4>
        <p class="text-xs text-slate-400 mb-4">${item.subtitle}</p>

        <ul class="space-y-1.5 mb-5 text-xs text-slate-300">
          ${item.highlights.map(h => `
            <li class="flex items-center gap-2">
              <i class="fa-solid fa-check text-emerald-400 text-[11px]"></i>
              <span>${h}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="pt-4 border-t border-white/5 flex items-center justify-between">
        <span class="text-xs text-amber-400 font-semibold">Toll & Chauffeur Covered</span>
        <button onclick="openBookingModal('suv_7', '${item.id}')" class="px-4 py-2 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-semibold text-xs rounded-xl border border-amber-500/30 transition-all flex items-center gap-1.5">
          <span>Book Outstation</span>
          <i class="fa-solid fa-chevron-right text-[10px]"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// --- Live Estimator Calculator ---
window.updateEstimatorFare = function() {
  const vehicleSelect = document.getElementById("est-vehicle");
  const packageSelect = document.getElementById("est-package");
  const resultDisplay = document.getElementById("est-fare-display");
  const modelDisplay = document.getElementById("est-model-display");

  if (!vehicleSelect || !packageSelect || !resultDisplay) return;

  const vehicleKey = vehicleSelect.value;
  const packageKey = packageSelect.value;

  const car = FLEET_DATA[vehicleKey] || FLEET_DATA.sedan_4;
  const pkg = PACKAGES_DATA[packageKey] || PACKAGES_DATA.south_theme;

  let calculatedFare = car.basePrice;
  if (pkg.type === "pandal") {
    calculatedFare = Math.round(car.basePrice * pkg.pricingMultiplier);
  } else if (pkg.type === "outstation") {
    calculatedFare = Math.round(car.outstationPerKm * 380 + 1500); // Sample roundtrip outstation base
  }

  resultDisplay.textContent = `₹${calculatedFare.toLocaleString()}`;
  if (modelDisplay) {
    modelDisplay.textContent = `${car.name} (${car.models.split('/')[0].trim()}) • Max ${car.seats} Passengers`;
  }
};

window.quickBookFromEstimator = function() {
  const vehicleSelect = document.getElementById("est-vehicle");
  const packageSelect = document.getElementById("est-package");
  const dateSelect = document.getElementById("est-date");

  const v = vehicleSelect ? vehicleSelect.value : "suv_7";
  const p = packageSelect ? packageSelect.value : "south_theme";
  const d = dateSelect ? dateSelect.value : "2026-10-18 (Maha Saptami)";

  AppState.selectedVehicleId = v;
  AppState.selectedPackageId = p;
  AppState.selectedDate = d;

  openBookingModal(v, p);
};

// --- Multi-Step Booking Modal Logic ---
window.openBookingModal = function(vehicleId = "suv_7", packageId = "south_theme") {
  AppState.selectedVehicleId = vehicleId;
  AppState.selectedPackageId = packageId;

  const modal = document.getElementById("booking-modal");
  if (!modal) return;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";

  // Pre-fill booking selectors
  const vehicleSelect = document.getElementById("book-vehicle-select");
  const packageSelect = document.getElementById("book-package-select");

  if (vehicleSelect) vehicleSelect.value = vehicleId;
  if (packageSelect) packageSelect.value = packageId;

  setBookingStep(1);
  recalculateBookingSummary();
};

window.closeBookingModal = function() {
  const modal = document.getElementById("booking-modal");
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "auto";
};

window.setBookingStep = function(stepNumber) {
  // Hide all step panels
  for (let i = 1; i <= 3; i++) {
    const stepEl = document.getElementById(`booking-step-${i}`);
    const indicatorEl = document.getElementById(`step-indicator-${i}`);
    if (stepEl) stepEl.classList.add("hidden");
    if (indicatorEl) {
      indicatorEl.classList.remove("active", "completed");
      if (i < stepNumber) indicatorEl.classList.add("completed");
      if (i === stepNumber) indicatorEl.classList.add("active");
    }
  }

  const currentStep = document.getElementById(`booking-step-${stepNumber}`);
  if (currentStep) currentStep.classList.remove("hidden");

  // Scroll modal body to top
  const modalBody = document.getElementById("booking-modal-body");
  if (modalBody) modalBody.scrollTop = 0;
};

window.handleNextStep = function(currentStep) {
  if (currentStep === 1) {
    // Validate Step 1 selections
    const vehicleSelect = document.getElementById("book-vehicle-select");
    const packageSelect = document.getElementById("book-package-select");
    const dateInput = document.getElementById("book-date-input");
    const slotSelect = document.getElementById("book-slot-select");

    if (vehicleSelect) AppState.selectedVehicleId = vehicleSelect.value;
    if (packageSelect) AppState.selectedPackageId = packageSelect.value;
    if (dateInput && dateInput.value) AppState.selectedDate = dateInput.value;
    if (slotSelect) AppState.timeSlot = slotSelect.value;

    setBookingStep(2);
    recalculateBookingSummary();
  } else if (currentStep === 2) {
    // Validate Step 2 contact details
    const nameInput = document.getElementById("book-name-input");
    const phoneInput = document.getElementById("book-phone-input");
    const pickupInput = document.getElementById("book-pickup-input");
    const passengersInput = document.getElementById("book-passengers-input");

    if (!nameInput || !nameInput.value.trim()) {
      alert("Please enter your full name.");
      nameInput.focus();
      return;
    }
    if (!phoneInput || phoneInput.value.trim().length < 10) {
      alert("Please provide a valid 10-digit WhatsApp phone number for booking confirmation.");
      phoneInput.focus();
      return;
    }
    if (!pickupInput || !pickupInput.value.trim()) {
      alert("Please enter your pickup address or landmark in Kolkata.");
      pickupInput.focus();
      return;
    }

    AppState.customerName = nameInput.value.trim();
    AppState.customerPhone = phoneInput.value.trim();
    AppState.pickupLocation = pickupInput.value.trim();
    AppState.passengers = passengersInput ? passengersInput.value : 4;
    AppState.customerEmail = document.getElementById("book-email-input")?.value.trim() || "";
    AppState.notes = document.getElementById("book-notes-input")?.value.trim() || "";

    setBookingStep(3);
    recalculateBookingSummary();
  }
};

window.toggleAddon = function(addonKey) {
  const checkbox = document.getElementById(`addon-${addonKey}`);
  if (checkbox) {
    AppState.addons[addonKey] = checkbox.checked;
    recalculateBookingSummary();
  }
};

function recalculateBookingSummary() {
  const car = FLEET_DATA[AppState.selectedVehicleId] || FLEET_DATA.suv_7;
  const pkg = PACKAGES_DATA[AppState.selectedPackageId] || PACKAGES_DATA.south_theme;

  let baseFare = car.basePrice;
  if (pkg.type === "pandal") {
    baseFare = Math.round(car.basePrice * pkg.pricingMultiplier);
  } else if (pkg.type === "outstation") {
    baseFare = Math.round(car.outstationPerKm * 380 + 1500);
  }

  // Addons calculation
  let addonsTotal = 0;
  if (AppState.addons.vipPass) addonsTotal += 499 * (parseInt(AppState.passengers) || 4);
  if (AppState.addons.guide) addonsTotal += 1199;
  if (AppState.addons.sweets) addonsTotal += 599;

  const totalFare = baseFare + addonsTotal;
  const advanceAmount = Math.round(totalFare * 0.20);

  // Update DOM elements in Summary box
  const summaryVehicleEl = document.getElementById("summary-vehicle-name");
  const summaryPackageEl = document.getElementById("summary-package-name");
  const summaryDateEl = document.getElementById("summary-date-time");
  const summaryBaseFareEl = document.getElementById("summary-base-fare");
  const summaryAddonsFareEl = document.getElementById("summary-addons-fare");
  const summaryTotalFareEl = document.getElementById("summary-total-fare");
  const summaryAdvanceEl = document.getElementById("summary-advance-amount");

  if (summaryVehicleEl) summaryVehicleEl.textContent = `${car.name} (${car.seats} Seater)`;
  if (summaryPackageEl) summaryPackageEl.textContent = pkg.title;
  if (summaryDateEl) summaryDateEl.textContent = `${AppState.selectedDate} • Slot: ${AppState.timeSlot.toUpperCase()}`;
  if (summaryBaseFareEl) summaryBaseFareEl.textContent = `₹${baseFare.toLocaleString()}`;
  if (summaryAddonsFareEl) summaryAddonsFareEl.textContent = `₹${addonsTotal.toLocaleString()}`;
  if (summaryTotalFareEl) summaryTotalFareEl.textContent = `₹${totalFare.toLocaleString()}`;
  if (summaryAdvanceEl) summaryAdvanceEl.textContent = `₹${advanceAmount.toLocaleString()}`;

  // Vehicle badge in step 1
  const vehicleBadge = document.getElementById("step1-car-specs");
  if (vehicleBadge) {
    vehicleBadge.textContent = `${car.models} • ${car.seats} Seats • ${car.luggage}`;
  }
}

// --- Submit Final Booking ---
window.submitFinalBooking = function(payMode = "advance") {
  const car = FLEET_DATA[AppState.selectedVehicleId] || FLEET_DATA.suv_7;
  const pkg = PACKAGES_DATA[AppState.selectedPackageId] || PACKAGES_DATA.south_theme;

  const bookingRef = "PUJA2026-KOL-" + Math.floor(100000 + Math.random() * 900000);
  
  const bookingRecord = {
    refId: bookingRef,
    timestamp: new Date().toISOString(),
    customerName: AppState.customerName,
    customerPhone: AppState.customerPhone,
    customerEmail: AppState.customerEmail,
    pickupLocation: AppState.pickupLocation,
    vehicle: car.name,
    vehicleModel: car.models,
    package: pkg.title,
    date: AppState.selectedDate,
    slot: AppState.timeSlot,
    passengers: AppState.passengers,
    addons: AppState.addons,
    payMode: payMode,
    totalFare: document.getElementById("summary-total-fare")?.textContent || "₹4,799",
    advanceToPay: document.getElementById("summary-advance-amount")?.textContent || "₹960"
  };

  AppState.confirmedBooking = bookingRecord;

  // Save to LocalStorage
  try {
    const existing = JSON.parse(localStorage.getItem("pujo_bookings") || "[]");
    existing.push(bookingRecord);
    localStorage.setItem("pujo_bookings", JSON.stringify(existing));
  } catch (e) {
    console.warn("Storage error", e);
  }

  // Close Booking Modal and Open Thank You Screen
  closeBookingModal();
  renderThankYouScreen(bookingRecord);
};

// --- Thank You / Confirmation Screen ---
function renderThankYouScreen(b) {
  const thankYouModal = document.getElementById("thank-you-modal");
  if (!thankYouModal) return;

  // Populate Fields
  document.getElementById("ty-booking-id").textContent = `#${b.refId}`;
  document.getElementById("ty-name").textContent = b.customerName;
  document.getElementById("ty-phone").textContent = b.customerPhone;
  document.getElementById("ty-vehicle").textContent = `${b.vehicle} (${b.vehicleModel})`;
  document.getElementById("ty-package").textContent = b.package;
  document.getElementById("ty-date-slot").textContent = `${b.date} (${b.slot.toUpperCase()})`;
  document.getElementById("ty-pickup").textContent = b.pickupLocation;
  document.getElementById("ty-total").textContent = b.totalFare;
  document.getElementById("ty-advance").textContent = b.advanceToPay;

  // Build WhatsApp share string
  const waMsg = `*🪔 DURGA PUJA CHAUFFEUR BOOKING CONFIRMATION*%0A` +
    `*Booking ID:* ${b.refId}%0A` +
    `*Customer:* ${b.customerName} (${b.customerPhone})%0A` +
    `*Vehicle:* ${b.vehicle}%0A` +
    `*Package:* ${b.package}%0A` +
    `*Date:* ${b.date}%0A` +
    `*Pickup:* ${b.pickupLocation}%0A` +
    `*Total Fare:* ${b.totalFare}%0A` +
    `*Advance:* ${b.advanceToPay}%0A%0A` +
    `*Shubho Sharodiya! Please send driver details & GPS link.*`;

  const waBtn = document.getElementById("ty-whatsapp-btn");
  if (waBtn) {
    waBtn.href = `https://wa.me/918240765499?text=${waMsg}`;
  }

  thankYouModal.classList.remove("hidden");
  thankYouModal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

window.closeThankYouModal = function() {
  const thankYouModal = document.getElementById("thank-you-modal");
  if (!thankYouModal) return;

  thankYouModal.classList.add("hidden");
  thankYouModal.classList.remove("flex");
  document.body.style.overflow = "auto";
};

// --- Fast Lead Capture Form (Sticky & Modal) ---
window.submitFastLead = function(e) {
  if (e) e.preventDefault();

  const phoneInput = document.getElementById("fast-phone-input");
  const nameInput = document.getElementById("fast-name-input");

  if (!phoneInput || phoneInput.value.length < 10) {
    alert("Please enter a valid 10-digit mobile number for instant quote.");
    return false;
  }

  const name = nameInput ? nameInput.value : "Guest";
  const phone = phoneInput.value;

  alert(`🎉 Thank you ${name}! Our Puja Travel Specialist is calling ${phone} in under 5 minutes with exclusive festive discounts.`);
  
  phoneInput.value = "";
  if (nameInput) nameInput.value = "";
  return false;
};

// --- Countdown to Durga Puja 2026 ---
function initCountdown() {
  // Target: Mahalaya / Sasthi 2026
  const targetDate = new Date("October 15, 2026 06:00:00").getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      const banner = document.getElementById("countdown-timer");
      if (banner) banner.textContent = "🌸 MAA ASCHHEN! PUJA IS LIVE! 🌸";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dEl = document.getElementById("cnt-days");
    const hEl = document.getElementById("cnt-hours");
    const mEl = document.getElementById("cnt-minutes");
    const sEl = document.getElementById("cnt-seconds");

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// --- Live Booking Social Proof Toasts ---
function initLiveBookingToasts() {
  const toastEl = document.getElementById("social-proof-toast");
  const msgEl = document.getElementById("toast-message");
  if (!toastEl || !msgEl) return;

  const mockEvents = [
    "🔥 Subhashis from Salt Lake just booked an Innova Crysta (7s) for Saptami Night!",
    "🪔 Debarati from Ballygunge booked South Kolkata Theme Tour (Dzire 4s)!",
    "🚐 Priya & 12 friends reserved 13-Seater Urbania for Midnight Parikrama!",
    "🌊 Anirban booked Kolkata ⇄ Mandarmani 3-Day Beach Holiday (Ertiga 6s)!",
    "✨ VIP Passes claimed by 4 families for Maddox & Ekdalia Evergreen!"
  ];

  let index = 0;
  setInterval(() => {
    msgEl.textContent = mockEvents[index % mockEvents.length];
    toastEl.classList.remove("translate-y-24", "opacity-0");
    toastEl.classList.add("translate-y-0", "opacity-100");

    setTimeout(() => {
      toastEl.classList.remove("translate-y-0", "opacity-100");
      toastEl.classList.add("translate-y-24", "opacity-0");
    }, 4500);

    index++;
  }, 12000);
}

// --- Setup Event Listeners & FAQ Accordions ---
function setupEventListeners() {
  // FAQ accordion toggles
  document.querySelectorAll(".faq-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      const icon = button.querySelector(".faq-icon");
      
      const isOpen = !content.classList.contains("hidden");
      
      // Close all other FAQs
      document.querySelectorAll(".faq-content").forEach(c => c.classList.add("hidden"));
      document.querySelectorAll(".faq-icon").forEach(i => i.classList.remove("rotate-180"));

      if (!isOpen) {
        content.classList.remove("hidden");
        if (icon) icon.classList.add("rotate-180");
      }
    });
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
}
