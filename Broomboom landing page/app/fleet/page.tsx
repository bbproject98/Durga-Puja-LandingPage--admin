"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Car, Users, Briefcase, ShieldCheck, CheckCircle2, Clock,
  ArrowRight, Sparkles, PhoneCall, Calendar, MapPin,
  ChevronDown, Info, Zap, Check, X, XCircle, MessageCircle, RotateCcw, User, Phone, Mail
} from "lucide-react";
import { FLEET_DATA } from "@/data/fleet";
import { RENTAL_PACKAGES, RentalPackage } from "@/data/packages";
import { submitBooking } from "@/lib/api";
import { RentalBookingHeader } from "@/components/RentalBookingHeader";
import { useSearchParams } from "next/navigation";

type CashfreeInstance = {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: "_modal" | "_self" | "_top" | "_blank";
  }) => Promise<{
    error?: { message: string; code?: string };
    redirect?: boolean;
    paymentDetails?: any;
  } | void>;
};

function loadCashfree(): Promise<CashfreeInstance> {
  return new Promise((resolve, reject) => {
    const win = window as Window & {
      Cashfree?: (options: { mode: "production" | "production" }) => CashfreeInstance;
    };

    if (win.Cashfree) {
      resolve(win.Cashfree({ mode: "production" }));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => {
      if (win.Cashfree) resolve(win.Cashfree({ mode: "production" }));
      else reject(new Error("Unable to load Cashfree."));
    };
    script.onerror = () => reject(new Error("Unable to load Cashfree."));
    document.head.appendChild(script);
  });
}

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", 
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", 
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", 
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

// ---------- HELPER: DYNAMIC INCLUSIONS ----------
function getDynamicInclusions(
  vehicle: any,
  selectedPkg: RentalPackage,
  price: number
): string[] {
  const formattedPrice = `₹${price.toLocaleString('en-IN')}`;

  const baseText = `Base package ${selectedPkg.hoursKm} usage (${formattedPrice})`;

  let acText = "Chilled Dual AC & Sanitised Interior";
  if (vehicle.category === "suv") {
    acText = "Chilled 3-Row AC & Ample Legroom";
    if (vehicle.id === "suv_7") {
      acText = "Luxury Captain Seats & Heavy-duty Dual AC";
    }
  } else if (vehicle.category === "traveller") {
    acText = "Individual AC Vents on Every Seat & Pushback Rows";
    if (vehicle.id === "traveller_17") {
      acText = "High Roof Cabin with Individual Blower ACs";
    }
    if (vehicle.id === "traveller_24") {
      acText = "Ultra-luxury Pushback Leather Recliners & Dual AC";
    }
  }

  const shared = [
    "Fuel Charges & Chauffeur Day Allowance Included",
    "State & City Toll Taxes Included",
    "Free 24h Modification",
  ];

  return [baseText, acText, ...shared];
}
// -------------------------------------------------

function FleetContent() {
  const searchParams = useSearchParams();
  const pkgFromUrl = searchParams.get("pkg");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "sedan" | "suv" | "traveller">("all");
  const [expandedDetailsCarId, setExpandedDetailsCarId] = useState<string | null>("sedan_4");
  const [userData, setUserData] = useState<{ name: string; phone: string; email: string }>({
    name: "Guest Traveler",
    phone: "+91 8240765499",
    email: "guest@example.com"
  });

  const [tripType, setTripType] = useState<"rental" | "outstation">("rental");
  const [selectedRentalPackage, setSelectedRentalPackage] = useState<RentalPackage>(() => {
    const initialPkgId = pkgFromUrl
      || (typeof window !== "undefined" ? sessionStorage.getItem("broomboom_active_package") : null)
      || "pkg_8hr_80km";
    return RENTAL_PACKAGES.find(p => p.id === initialPkgId) || RENTAL_PACKAGES[1];
  });
  
  const [selectedPickupDate, setSelectedPickupDate] = useState("");
  const [city, setCity] = useState("Kolkata (Citywide)");
  const [selectedPickupTime, setSelectedPickupTime] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupPincode, setPickupPincode] = useState("");
  const [pickupState, setPickupState] = useState("");
  const [isStateOpen, setIsStateOpen] = useState(false);

  const [selectedVehicleKey, setSelectedVehicleKey] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [addMishtiBox, setAddMishtiBox] = useState(true);
  const [addVipPass, setAddVipPass] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem("broomboom_user");
      if (savedUser) {
        setUserData(JSON.parse(savedUser));
      }
      const activePkgId = sessionStorage.getItem("broomboom_active_package");
      if (activePkgId) {
        const pkg = RENTAL_PACKAGES.find(p => p.id === activePkgId);
        if (pkg) setSelectedRentalPackage(pkg);
      }

      // Populate current real-time date and time
      const now = new Date();
      const currentDate = now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
      const currentTime = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });

      setSelectedPickupDate((prev) => prev || currentDate);
      setSelectedPickupTime((prev) => prev || currentTime);
    } catch (e) {
      console.warn("Storage load error", e);
    }
  }, []);

  const vehiclesList = Object.values(FLEET_DATA).filter((v) => {
    if (selectedCategory === "all") return true;
    return v.category === selectedCategory;
  });

  const selectedVehicle = selectedVehicleKey ? FLEET_DATA[selectedVehicleKey] : null;

  const checkoutPrice = useMemo(() => {
    if (!selectedVehicle) return 0;
    return tripType === "rental" && selectedVehicle.packageRates
      ? selectedVehicle.packageRates[selectedRentalPackage.id] || selectedVehicle.basePrice
      : selectedVehicle.basePrice;
  }, [selectedVehicle, tripType, selectedRentalPackage]);

  const handleSelectCar = (vehicleKey: string) => {
    setSelectedVehicleKey(vehicleKey);
    setIsCheckoutOpen(true);
  };

  const handleConfirmBooking = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!userData.name.trim() || userData.name === "Guest Traveler") {
      alert("Please enter your name in the checkout form for chauffeur coordination.");
      return;
    }

    if (!userData.phone.trim() || userData.phone.replace(/\D/g, "").length < 10) {
      alert("Please enter a valid 10-digit mobile number for WhatsApp booking updates.");
      return;
    }

    if (!pickupAddress.trim()) {
      alert("Please enter your pickup address in Kolkata.");
      return;
    }

    if (!selectedVehicle) {
      alert("Please select a vehicle.");
      return;
    }

    try {
      sessionStorage.setItem("broomboom_user", JSON.stringify(userData));
    } catch (_) {}

    try {
      const totalTariff = checkoutPrice;
      const advancePaid = Math.min(2051, totalTariff); // Fixed 2051 deposit
      const balancePayable = totalTariff - advancePaid;

      const bookingData = {
        customerName: userData.name || "Guest Traveler",
        customerPhone: userData.phone || "+91 8240765499",
        customerEmail: userData.email || "guest@example.com",
        vehicleName: selectedVehicle.name,
        vehicleModels: selectedVehicle.models,
        vehicleSeats: selectedVehicle.seats,
        packageTitle: tripType === "rental" ? selectedRentalPackage.title : "Outstation Trip",
        travelDate: selectedPickupDate,
        pickupTime: selectedPickupTime,
        pickupAddress: pickupAddress.trim(),
        pickupPincode: pickupPincode.trim(),
        pickupState: pickupState,
        totalTariff,
        advancePaid,
        balancePayable,
      };

      setIsProcessingPayment(true);

      const result = await submitBooking(bookingData);

      if (!result?.success) {
        throw new Error(result?.message || "Unable to create booking.");
      }

      const paymentSessionId = result.data?.paymentSessionId;
      if (!paymentSessionId) {
        throw new Error("Payment session was not created.");
      }

      const bookingRef =
        result.data?.booking?.cashfreeOrderId ||
        result.data?.booking?.bookingId ||
        `BBC-PUJA-${Math.floor(100000 + Math.random() * 900000)}`;

      try {
        const confirmedBooking = {
          refId: result.data?.booking?.bookingId || bookingRef,
          cashfreeOrderId: result.data?.booking?.cashfreeOrderId || bookingRef,
          customerName: bookingData.customerName,
          customerPhone: bookingData.customerPhone,
          customerEmail: bookingData.customerEmail,
          vehicle: bookingData.vehicleName,
          vehicleModel: bookingData.vehicleModels,
          package: bookingData.packageTitle,
          date: bookingData.travelDate,
          slot: bookingData.pickupTime,
          pickupLocation: bookingData.pickupAddress,
          totalFare: `₹${bookingData.totalTariff.toLocaleString()}`,
          advanceToPay: `₹${bookingData.advancePaid.toLocaleString()}`,
          balancePayable: `₹${bookingData.balancePayable.toLocaleString()}`,
        };
        sessionStorage.setItem("broomboom_confirmed_booking", JSON.stringify(confirmedBooking));
      } catch (e) {
        console.warn("Storage error", e);
      }

      const cashfree = await loadCashfree();
      if (!cashfree) {
        throw new Error("Unable to load Cashfree.");
      }

      const checkoutRes = await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_modal",
      });

      if (checkoutRes && (checkoutRes as any).error) {
        console.warn("Cashfree checkout modal closed or error:", (checkoutRes as any).error);
        setIsProcessingPayment(false);
        return;
      }

      window.location.href = `/thank-you?order_id=${encodeURIComponent(bookingRef)}&payment_status=SUCCESS`;
    } catch (error) {
      setIsProcessingPayment(false);
      console.error("Booking / Payment Error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating your booking."
      );
    }
  };

  return (
    <div className="min-h-screen bg-puja-cream text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-amber-200 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Section: Logo + Text */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 group min-w-0"
              aria-label="BroomBoom Cabs Home"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden shrink-0">
                <img
                  src="/images/broomboom-logo.png"
                  alt="BroomBoom Cabs"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.tried) {
                      target.dataset.tried = "true";
                      target.src = "/images/Broomboom-logo.png";
                    }
                  }}
                />
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <span className="px-2 py-0.5 w-fit text-[8px] sm:text-[9px] font-black bg-amber-400 text-slate-950 rounded border border-amber-500/40 tracking-wide shrink-0">
                  PUJA 2026
                </span>
                <p className="text-[8px] sm:text-[10px] text-slate-500 tracking-widest uppercase font-semibold mt-1 truncate">
                  Kolkata Durga Puja Travel
                </p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-2 text-xs font-bold bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-200 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Step 2 of 3: Select Your Cab</span>
            </div>
          </div>

          {/* Right Section: User Info + Phone */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:block text-right">
              <span className="text-[10px] text-slate-500 block font-medium">Logged In As</span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xs font-bold text-slate-900">{userData.name}</span>
                {userData.name !== "Guest Traveler" && (
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        sessionStorage.removeItem("broomboom_user");
                      } catch (_) {}
                      setUserData({ name: "Guest Traveler", phone: "+91 8240765499", email: "guest@example.com" });
                    }}
                    className="text-[10px] text-amber-800 hover:text-red-600 font-bold underline cursor-pointer"
                    title="Change / Logout"
                  >
                    (Change)
                  </button>
                )}
              </div>
            </div>
            
            <a
              href="tel:+918240765499"
              className="px-2 py-2 sm:px-3.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">24x7 Helpline:</span> +91 8240765499
            </a>
          </div>
        </div>
      </header>

      {/* Rental Booking Header */}
      <RentalBookingHeader 
        tripType={tripType}
        city={city}
        pickupDate={selectedPickupDate}
        pickupTime={selectedPickupTime}
        onUpdateCity={setCity}
        onUpdateDate={setSelectedPickupDate}
        onUpdateTime={setSelectedPickupTime}
        selectedPackage={selectedRentalPackage}
        onSelectPackage={setSelectedRentalPackage}
      />

      {/* Main Fleet Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full pb-20 lg:pb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-amber-200 pb-3 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[38px] active:scale-95 ${
              selectedCategory === "all"
                ? "bg-slate-950 text-amber-400 shadow-md"
                : "bg-white text-slate-700 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            All Available Cabs ({Object.keys(FLEET_DATA).length})
          </button>
          <button
            onClick={() => setSelectedCategory("sedan")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[38px] active:scale-95 ${
              selectedCategory === "sedan"
                ? "bg-slate-950 text-amber-400 shadow-md"
                : "bg-white text-slate-700 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            Sedan (4 Seater)
          </button>
          <button
            onClick={() => setSelectedCategory("suv")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[38px] active:scale-95 ${
              selectedCategory === "suv"
                ? "bg-slate-950 text-amber-400 shadow-md"
                : "bg-white text-slate-700 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            SUV &amp; SUV+ (6 &amp; 7 Seater)
          </button>
          <button
            onClick={() => setSelectedCategory("traveller")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[38px] active:scale-95 ${
              selectedCategory === "traveller"
                ? "bg-slate-950 text-amber-400 shadow-md"
                : "bg-white text-slate-700 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            Tempo Traveller (13, 17, 24 Seaters)
          </button>
        </div>

        {/* Cars Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {vehiclesList.map((car) => {
              const currentPrice = tripType === "rental" && car.packageRates
                ? car.packageRates[selectedRentalPackage.id] || car.basePrice
                : car.basePrice;

              const dynamicInclusions = getDynamicInclusions(car, selectedRentalPackage, currentPrice);

              return (
                <div
                  key={car.id}
                  className="bg-white rounded-3xl border-2 border-amber-200/90 shadow-md card-shadow overflow-hidden p-5 sm:p-6 hover:border-amber-400 transition-all group"
                >
                  <div className="grid sm:grid-cols-12 gap-6 items-center">
                    <div className="sm:col-span-5 space-y-3">
                      <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/90 border border-amber-200/80 shadow-sm flex items-center justify-center">
                        <Image
                          src={car.image}
                          alt={car.altRental ?? "Rental vehicle"}
                          fill
                          className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 30vw"
                        />
                        <div className="absolute top-2 left-2 z-10">
                          <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full shadow">
                            {car.tag}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                        <span className="flex items-center gap-1 bg-puja-cream px-2.5 py-1 rounded-lg border border-amber-200">
                          <Users className="w-3.5 h-3.5 text-amber-600" /> {car.seats} Seats
                        </span>
                        <span className="flex items-center gap-1 bg-puja-cream px-2.5 py-1 rounded-lg border border-amber-200">
                          <Briefcase className="w-3.5 h-3.5 text-amber-600" /> {car.luggage.split("+")[0]}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-bold text-[11px] border border-emerald-200">
                          Dual AC
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-4 space-y-2">
                      <h3 className="text-lg font-bold text-slate-950 font-royal">
                        {car.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {car.models}
                      </p>
                      <div className="space-y-1.5 pt-1 text-xs text-slate-700">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>Includes {selectedRentalPackage.hoursKm.replace('Hours', 'hrs').replace('KMs', 'kms')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>Chauffeur &amp; Fuel Included</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>Free 24h Modification</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 pt-0.5 font-medium">
                        Extra km: ₹{car.outstationPerKm}/km • Extra hr: ₹{car.perExtraHour}/hr
                      </div>
                    </div>

                    <div className="sm:col-span-3 flex flex-row sm:flex-col items-center sm:items-end justify-between text-left sm:text-right pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-amber-100 sm:pl-5 gap-3">
                      <div>
                        <span className="text-sm font-semibold text-slate-500 block line-through decoration-red-500 decoration-2">
                          ₹{(currentPrice + 800).toLocaleString()}
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-amber-900 leading-none">
                          ₹{currentPrice.toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectCar(car.id)}
                        className="w-auto sm:w-full btn-yellow-shimmer py-3 px-5 sm:px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md shadow-amber-400/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <Zap className="w-3.5 h-3.5 fill-slate-950" />
                        <span>BOOK NOW</span>
                      </button>
                    </div>
                  </div>

                  {/* Inclusions & Exclusions Accordion */}
                  <div className="mt-4 pt-3 border-t border-amber-100">
                    <button
                      onClick={() =>
                        setExpandedDetailsCarId(expandedDetailsCarId === car.id ? null : car.id)
                      }
                      className="flex items-center justify-between w-full text-xs font-bold text-amber-950 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 px-3.5 py-2.5 rounded-xl transition-colors border border-amber-200/80"
                    >
                      <span className="flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-amber-600" />
                        <span>Inclusions &amp; Exclusions Breakdown</span>
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-900 font-semibold">
                        <span className="hidden sm:inline">
                          {dynamicInclusions.length} Inclusions • {car.exclusions.length} Exclusions
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            expandedDetailsCarId === car.id ? "rotate-180 text-amber-700" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {expandedDetailsCarId === car.id && (
                      <div className="mt-3 p-4 bg-puja-cream rounded-2xl border border-amber-200 grid sm:grid-cols-2 gap-4 animate-fadeIn text-xs">
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-1.5 pb-1 border-b border-emerald-200 text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span>Inclusions (What&apos;s Included)</span>
                          </div>
                          <ul className="space-y-1.5 text-slate-700 font-medium">
                            {dynamicInclusions.map((inc, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <span>{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2.5 sm:border-l sm:border-amber-200 sm:pl-4">
                          <div className="flex items-center gap-1.5 pb-1 border-b border-red-200 text-red-800 font-bold uppercase tracking-wider text-[11px]">
                            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span>Exclusions (Extra Charges / Not Included)</span>
                          </div>
                          <ul className="space-y-1.5 text-slate-700 font-medium">
                            {car.exclusions.map((exc, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <X className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                                <span>{exc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-md card-shadow space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-amber-100">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950">BroomBoom Assurance</h4>
                  <span className="text-[11px] text-slate-500">100% Ride Guarantee</span>
                </div>
              </div>
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Zero Advance Dispute:</strong> Instant WhatsApp receipt synced with the driver app.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Standby Fleet Guarantee:</strong> Backup cars stationed at Salt Lake &amp; Southern Ave.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>VIP Pandal Drop Points:</strong> Driver navigates close to police barricades.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Complimentary Mishti Box:</strong> Traditional Bengali sweet treat onboard!</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-400 to-yellow-400 rounded-3xl p-6 text-slate-950 shadow-md space-y-3">
              <h4 className="text-base font-bold font-royal">Need Help Selecting?</h4>
              <p className="text-xs text-amber-950/90 leading-relaxed font-medium">
                Our Kolkata festival route specialists can customize multiple days, timings, and large group travellers.
              </p>
              <a
                href="https://wa.me/918240765499?text=Hi%20BroomBoom%20Cabs,%20please%20help%20me%20select%20a%20cab%20for%20Durga%20Puja."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      {isCheckoutOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl border-2 border-amber-300 shadow-2xl overflow-hidden relative card-shadow my-auto sm:my-8">
            <div className="alpana-yellow-top bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 p-4 sm:p-5 text-slate-950 relative">
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Durga Puja 2026 Confirmation</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-royal text-slate-950">
                Review &amp; Confirm Booking
              </h3>
              <p className="text-xs text-amber-950/80 mt-0.5">
                {selectedVehicle.name} • {tripType === "rental" ? selectedRentalPackage.title : "Outstation Trip"}
              </p>
            </div>

            <div className="p-4 sm:p-6 space-y-4 bg-puja-cream max-h-[82vh] overflow-y-auto">
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase">Selected Vehicle</span>
                    <h4 className="text-sm font-bold text-slate-950">{selectedVehicle.name}</h4>
                    <p className="text-[11px] text-slate-500">{selectedVehicle.models}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg sm:text-xl font-black text-amber-900">
                      ₹{checkoutPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-700 block font-bold">✓ Fixed Rate</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-amber-200 gap-3 text-xs flex flex-col">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Pickup Schedule:
                    </span>
                    <strong className="text-slate-900 block">{selectedPickupDate}</strong>
                    <span className="text-slate-500 text-[11px]">{selectedPickupTime}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-amber-200 text-[11px] space-y-1">
                  <span className="font-bold text-slate-900 block">✓ Included in this tariff:</span>
                  <p className="text-slate-600">
                    Fuel, chauffeur allowance, dual AC, all West Bengal tolls &amp; free 24h cancellation.
                  </p>
                </div>

                {/* Passenger Contact Details */}
                <div className="bg-white p-3.5 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center gap-1.5 border-b border-amber-100 pb-2">
                    <User className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                      Passenger / Primary Rider Information
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sen"
                        value={userData.name === "Guest Traveler" ? "" : userData.name}
                        onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full px-3 py-2.5 bg-slate-50 border border-amber-200 rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">
                        WhatsApp / Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 8240765499"
                        value={userData.phone === "+91 8240765499" ? "" : userData.phone}
                        onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                        required
                        className="w-full px-3 py-2.5 bg-slate-50 border border-amber-200 rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 mb-1 block">
                        Confirmation Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. rahul.sen@example.com"
                        value={userData.email === "guest@example.com" ? "" : userData.email}
                        onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full px-3 py-2.5 bg-slate-50 border border-amber-200 rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Updated Location Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      Pickup Address in Kolkata <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="e.g. Flat 4B, South City Residency, Prince Anwar Shah Road, Kolkata"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      required
                      rows={2}
                      className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      Pincode
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 700019"
                      value={pickupPincode}
                      onChange={(e) => setPickupPincode(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      State
                    </label>
                    <div 
                      onClick={() => setIsStateOpen(!isStateOpen)}
                      className="w-full px-3 py-2.5 border border-amber-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none cursor-pointer flex justify-between items-center text-base sm:text-xs min-h-[42px]"
                    >
                      <span className={pickupState ? "text-slate-900" : "text-slate-400"}>
                        {pickupState || "Select a state"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>

                    {isStateOpen && (
                      <ul className="absolute z-10 w-full mt-1 bg-white border border-amber-200 rounded-xl shadow-lg max-h-48 overflow-y-auto py-1 text-base sm:text-xs">
                        {INDIAN_STATES.map((state) => (
                          <li
                            key={state}
                            onClick={() => {
                              setPickupState(state);
                              setIsStateOpen(false);
                            }}
                            className="px-3 py-2 hover:bg-amber-50 cursor-pointer text-slate-700"
                          >
                            {state}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-amber-200 space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addMishtiBox}
                      onChange={(e) => setAddMishtiBox(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>🎁 Free Bengali Mishti Box &amp; Mineral Water onboard</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addVipPass}
                      onChange={(e) => setAddVipPass(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>⭐ VIP Pandal Pass Concierge Assistance</span>
                  </label>
                </div>

                <div className="p-3.5 bg-amber-100/90 rounded-2xl border border-amber-300 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-700">
                    <span>Total Trip Tariff:</span>
                    <span className="font-bold">₹{checkoutPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-950 font-black text-sm pt-1 border-t border-amber-200">
                    <span>Pay Advance To Confirm Booking:</span>
                    <span className="text-amber-900">₹{Math.min(2051, checkoutPrice).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full btn-yellow-shimmer py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 disabled:opacity-60 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-400/30 transition-all flex items-center justify-center gap-2 min-h-[48px] active:scale-95"
                >
                  {isProcessingPayment ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Opening Secure Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay Advance To Confirm Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free cancellation with 100% refund up to 24h prior</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200 py-8 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-900">
            BroomBoom Cabs • Kolkata Durga Puja &amp; Outstation Chauffeur Rentals
          </p>
          <p className="text-slate-500">
            24x7 Operations Hubs: Salt Lake Sector V • Southern Avenue • Kolkata Airport (CCU) • Helpline: +91 8240765499
          </p>
          <p className="text-[11px] text-slate-400 pt-2">
            © 2026 BroomBoom Cabs. All Rights Reserved. Shubho Sharodiya!
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function FleetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-puja-cream flex items-center justify-center font-bold text-slate-500">Loading Fleet...</div>}>
      <FleetContent />
    </Suspense>
  );
}