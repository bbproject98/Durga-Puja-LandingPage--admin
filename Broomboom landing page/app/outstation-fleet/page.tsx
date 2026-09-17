"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Car, Users, Briefcase, ShieldCheck, CheckCircle2, Clock,
  ArrowRight, Sparkles, PhoneCall, Calendar, MapPin,
  ChevronDown, Info, Zap, Check, X, XCircle, MessageCircle,
  User, Phone, Mail
} from "lucide-react";

import { FLEET_DATA } from "@/data/fleet";
import { OUTSTATION_ROUTES } from "@/data/packages";
import { submitBooking } from "@/lib/api";
import { OutstationBookingHeader } from "@/components/OutstationBookingHeader";

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
  "West Bengal", "Jharkhand", "Odisha", "Bihar", "Assam",
  "Sikkim", "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu"
];

/* ------------------------------------------------------------------ */
/*  DESTINATION KM MAP (fallback when route data doesn't have km)     */
/* ------------------------------------------------------------------ */
const DESTINATION_KM_MAP: Record<string, number> = {
  gangtok: 720,
  darjeeling: 680,
  digha: 185,
  mandarmani: 170,
  sundarban: 110,
  sundarbans: 110,
  puri: 500,
  bhubaneswar: 440,
  ranchi: 410,
  jamshedpur: 310,
  patna: 590,
  gaya: 620,
  bodh: 620,
  shillong: 1030,
  guwahati: 1030,
  siliguri: 560,
  kalimpong: 690,
  lachung: 900,
  pelling: 780,
  bokaro: 340,
  dhanbad: 290,
  asansol: 210,
  bakkhali: 140,
  kolkata: 0,
};

/* ------------------------------------------------------------------ */
/*  PARSE ROUTE NUMBERS FROM STRINGS LIKE "185 KM" / "4.5 Hours"      */
/* ------------------------------------------------------------------ */
const parseNumericValue = (value?: string | number | null): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (!value) return null;

  const match = String(value).match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;

  const num = Number(match[1]);
  return Number.isFinite(num) ? num : null;
};

const getRouteKm = (route: any): number | null =>
  parseNumericValue(route?.distanceKm) ??
  parseNumericValue(route?.km) ??
  parseNumericValue(route?.distance) ??
  parseNumericValue(route?.totalKm);

const getRouteHours = (route: any): number | null =>
  parseNumericValue(route?.durationHours) ??
  parseNumericValue(route?.hours) ??
  parseNumericValue(route?.estimatedTime);

/* ------------------------------------------------------------------ */
/*  INCLUSIONS & EXCLUSIONS DATA (DYNAMIC BY TRIP + CAR)              */
/* ------------------------------------------------------------------ */
type TripDetails = {
  tripType: "oneWay" | "roundTrip";
  includedKm: number;
  includedHours: number;
  extraKmRate?: number;
  extraHourRate?: number;
  freeWaitingHours?: number;
};

const getInclusions = (trip: TripDetails): string[] => {
  const tripLabel = trip.tripType === "roundTrip" ? "round trip" : "one-way trip";

  return [
    "Fuel charges for the entire journey",
    "Experienced highway chauffeur + driver bhatta (allowance)",
    "AC vehicle with free doorstep pickup across Kolkata",
    `${trip.includedKm} km included for this ${tripLabel}`,
    `${trip.includedHours} hours included for this ${tripLabel}`,
    trip.tripType === "roundTrip"
      ? "Return journey on your chosen date with the same cab"
      : "Direct one-way drop to your destination city",
  ];
};

const getExclusions = (trip: TripDetails): string[] => {
  const extraKmRate = trip.extraKmRate ?? 20;
  const freeWaitingHours = trip.freeWaitingHours ?? 0;

  const extraHourText =
    trip.extraHourRate != null
      ? `Extra waiting hours beyond ${freeWaitingHours} free waiting hour(s): ₹${trip.extraHourRate}/hour`
      : `Extra waiting hours beyond ${freeWaitingHours} free waiting hour(s)`;

  return [
    "All state tolls, FASTag & interstate permit charges",
    "GST & booking platform charges",
    "Parking charges at hotels, resorts or tourist spots",
    "Monument / sightseeing entry tickets & guide fees",
    "Night driving charges between 11:00 PM – 06:00 AM",
    `Extra kilometres beyond ${trip.includedKm} km: ₹${extraKmRate}/km`,
    extraHourText,
    "Meals, personal expenses & anything not listed in inclusions",
  ];
};

type OutstationData = {
  tripType: "oneWay" | "roundTrip";
  fromCity: string;
  toCity: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
};

function OutstationFleetContent() {
  const searchParams = useSearchParams();
  const toCityParam = searchParams.get("toCity") || "Digha";

  const [isMounted, setIsMounted] = useState(false);

  const [outstationData, setOutstationData] = useState<OutstationData>({
    tripType: "oneWay",
    fromCity: "Kolkata",
    toCity: toCityParam,
    pickupDate: "",
    pickupTime: "08:00 AM",
    returnDate: "",
    returnTime: "10:00 AM",
  });

  /* ------------------------------------------------------------------ */
  /*  SAFE MERGE UPDATER — prevents state wipeout from header           */
  /* ------------------------------------------------------------------ */
  const handleUpdateDetails = (
    updates:
      | Partial<OutstationData>
      | ((prev: OutstationData) => Partial<OutstationData>)
  ) => {
    setOutstationData((prev) => {
      const next = typeof updates === "function" ? updates(prev) : updates;
      return { ...prev, ...next };
    });
  };

  const [selectedCategory, setSelectedCategory] = useState<"all" | "sedan" | "suv" | "traveller">("all");
  const [expandedDetailsCarId, setExpandedDetailsCarId] = useState<string | null>(null);

  const [userData, setUserData] = useState({
    name: "Guest Traveler",
    phone: "+91 8240765499",
    email: "guest@example.com",
  });

  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupPincode, setPickupPincode] = useState("");
  const [pickupState, setPickupState] = useState("West Bengal");
  const [isStateOpen, setIsStateOpen] = useState(false);
  const stateDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedVehicleKey, setSelectedVehicleKey] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    setOutstationData((prev) => ({
      ...prev,
      pickupDate: new Date().toISOString().split("T")[0],
    }));

    try {
      const savedUser = sessionStorage.getItem("broomboom_user");
      if (savedUser) setUserData(JSON.parse(savedUser));
    } catch (e) {}
  }, []);

  // Sync toCity param → state whenever URL changes
  useEffect(() => {
    if (toCityParam) {
      setOutstationData((prev) => ({ ...prev, toCity: toCityParam }));
    }
  }, [toCityParam]);

  // Close state dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const vehiclesList = Object.values(FLEET_DATA).filter((v) => {
    if (selectedCategory === "all") return true;
    return v.category === selectedCategory;
  });

  const selectedVehicle = selectedVehicleKey ? FLEET_DATA[selectedVehicleKey] : null;

  /* ------------------------------------------------------------------ */
  /*  FIND ROUTE for current destination (case-insensitive, normalized)  */
  /* ------------------------------------------------------------------ */
  const matchedRoute = useMemo(() => {
    const rawCity = (outstationData.toCity || "").trim();
    if (!rawCity) return null;

    const normalize = (value: string) =>
      value.toLowerCase().replace(/[^a-z0-9]/g, "");

    const city = normalize(rawCity);

    return (
      OUTSTATION_ROUTES.find((r) => {
        const title = normalize(r.title);
        const routeCity = normalize(r.title.replace(/^kolkata\s+to\s+/i, ""));
        return (
          title.includes(city) ||
          routeCity.includes(city) ||
          city.includes(routeCity)
        );
      }) ?? null
    );
  }, [outstationData.toCity]);

  /* ------------------------------------------------------------------ */
  /*  SAFE PRICE RESOLVER — never returns NaN                            */
  /* ------------------------------------------------------------------ */
  const getCarRate = (car: any): number => {
    const route = matchedRoute;

    // One-way price from route or car fallback
    let baseRate = 0;

    if (route) {
      if (car.category === "sedan") {
        baseRate = Number(route.prices?.sedan) || 0;
      } else if (car.category === "suv") {
        const isSuvPlus =
          car.name.toLowerCase().includes("innova") || car.seats >= 7;
        baseRate =
          Number(isSuvPlus ? route.prices?.suvPlus : route.prices?.suv) || 0;
      } else {
        baseRate = Math.round((Number(route.prices?.suvPlus) || 0) * 1.5);
      }
    }

    if (!baseRate) {
      baseRate = Number(car.basePrice) || 0;
    }

    const rate =
      outstationData.tripType === "roundTrip" ? baseRate * 2 : baseRate;

    return Number.isFinite(rate) ? rate : 0;
  };

  /* ------------------------------------------------------------------ */
  /*  DYNAMIC TRIP DETAILS PER CAR                                       */
  /* ------------------------------------------------------------------ */
  const getTripDetailsForCar = (car: any): TripDetails => {
    const route: any = matchedRoute;
    const city = (outstationData.toCity || "").trim().toLowerCase();

    const routeKm = getRouteKm(route);

    let mapKm: number | null = null;
    if (!routeKm) {
      const key = Object.keys(DESTINATION_KM_MAP).find((k) => city.includes(k));
      if (key) mapKm = DESTINATION_KM_MAP[key];
    }

    const oneWayKm = Math.max(1, Math.round(routeKm ?? mapKm ?? 250));

    const oneWayHours =
      getRouteHours(route) ??
      Math.max(8, Math.ceil(oneWayKm / 40));

    const oneWayIncludedKm = oneWayKm;
    const oneWayIncludedHours = Math.max(1, Math.ceil(oneWayHours));

    const includedKm =
      outstationData.tripType === "roundTrip"
        ? oneWayIncludedKm * 2
        : oneWayIncludedKm;

    const includedHours =
      outstationData.tripType === "roundTrip"
        ? oneWayIncludedHours * 2
        : oneWayIncludedHours;

    return {
      tripType: outstationData.tripType,
      includedKm,
      includedHours,
      extraKmRate: Number(car?.outstationPerKm) || 20,
      extraHourRate: 150,
      freeWaitingHours: 2,
    };
  };

  const checkoutPrice = useMemo(() => {
    if (!selectedVehicle) return 0;
    const rate = getCarRate(selectedVehicle);
    return Number.isFinite(rate) ? rate : 0;
  }, [selectedVehicle, outstationData, matchedRoute]);

  const advanceAmount = Math.round(checkoutPrice * 0.25) || 0;
  const balanceAmount = checkoutPrice - advanceAmount;

  const handleSelectCar = (vehicleKey: string) => {
    setSelectedVehicleKey(vehicleKey);
    setIsCheckoutOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userData.name.trim() || userData.name === "Guest Traveler") {
      alert("Please enter your name for chauffeur coordination.");
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
      const advancePaid = advanceAmount;
      const balancePayable = balanceAmount;

      const bookingData = {
        customerName: userData.name || "Guest Traveler",
        customerPhone: userData.phone || "+91 8240765499",
        customerEmail: userData.email || "guest@example.com",
        vehicleName: selectedVehicle.name,
        vehicleModels: selectedVehicle.models,
        vehicleSeats: selectedVehicle.seats,
        packageTitle: `Outstation: Kolkata to ${outstationData.toCity} (${outstationData.tripType === "roundTrip" ? "Round Trip" : "One Way Drop"})`,
        travelDate: outstationData.pickupDate,
        pickupTime: outstationData.pickupTime,
        pickupAddress: pickupAddress.trim(),
        pickupPincode: pickupPincode.trim(),
        pickupState,
        totalTariff,
        advancePaid,
        balancePayable,
      };

      setIsProcessingPayment(true);

      const result = await submitBooking(bookingData);
      if (!result?.success || !result.data?.paymentSessionId) {
        throw new Error(result?.message || "Unable to create booking.");
      }

      const bookingRef =
        result.data?.booking?.cashfreeOrderId ||
        result.data?.booking?.bookingId ||
        `BBC-OUT-${Math.floor(100000 + Math.random() * 900000)}`;

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
      if (!cashfree) throw new Error("Unable to load Cashfree.");

      const checkoutRes = await cashfree.checkout({
        paymentSessionId: result.data.paymentSessionId,
        redirectTarget: "_modal",
      });

      if (checkoutRes && (checkoutRes as any).error) {
        setIsProcessingPayment(false);
        return;
      }

      window.location.href = `/thank-you?order_id=${encodeURIComponent(bookingRef)}&payment_status=SUCCESS`;
    } catch (error) {
      setIsProcessingPayment(false);
      alert(error instanceof Error ? error.message : "Something went wrong while creating your booking.");
    }
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-puja-cream flex items-center justify-center font-bold text-slate-500">Loading Fleet...</div>;
  }

  return (
    <div className="min-h-screen bg-puja-cream text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-amber-200 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2">
          {/* Left Side: Logo & Title */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0 min-w-0"
            aria-label="BroomBoom Cabs Home"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-amber-50">
              <img
                src="/images/Broomboom-logo.png"
                alt="BroomBoom Cabs"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
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
              <span className="px-2 py-0.5 w-fit text-[8px] sm:text-[9px] font-black bg-amber-400 text-slate-950 rounded border border-amber-500/40 tracking-wide whitespace-nowrap">
                PUJA 2026
              </span>

              <p className="text-[8px] sm:text-[10px] text-slate-500 tracking-wider uppercase font-semibold mt-1 truncate">
                Kolkata Durga Puja Travel
              </p>
            </div>
          </Link>

          {/* Right Side: User Info & Phone */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* User Info - Hidden on smaller screens to save space */}
            <div className="hidden md:block text-right">
              <span className="text-[10px] text-slate-500 block font-medium">
                Logged In As
              </span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xs font-bold text-slate-900 truncate max-w-[100px]">
                  {userData.name}
                </span>
                {userData.name !== "Guest Traveler" && (
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        sessionStorage.removeItem("broomboom_user");
                      } catch (_) {}
                      setUserData({ name: "Guest Traveler", phone: "+91 8240765499", email: "guest@example.com" });
                    }}
                    className="text-[10px] text-amber-800 hover:text-red-600 font-bold underline cursor-pointer whitespace-nowrap"
                    title="Change / Logout"
                  >
                    (Change)
                  </button>
                )}
              </div>
            </div>

            {/* Phone Number - whitespace-nowrap prevents breaking */}
            <a
              href="tel:+918240765499"
              className="px-3 py-2 sm:px-4 sm:py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden lg:inline">Highway Helpline:</span>
              <span>+91 8240765499</span>
            </a>
          </div>
        </div>
      </header>

      <OutstationBookingHeader
        tripType={outstationData.tripType}
        fromCity={outstationData.fromCity}
        toCity={outstationData.toCity}
        pickupDate={outstationData.pickupDate}
        pickupTime={outstationData.pickupTime}
        returnDate={outstationData.returnDate}
        returnTime={outstationData.returnTime}
        onUpdateDetails={handleUpdateDetails}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full flex-1 pb-20 lg:pb-8">
        <div className="flex items-center gap-2 mb-6 border-b border-amber-200 pb-3 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[38px] active:scale-95 ${
              selectedCategory === "all"
                ? "bg-slate-950 text-amber-400 shadow-md"
                : "bg-white text-slate-700 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            All Highway Cabs ({Object.keys(FLEET_DATA).length})
          </button>
          <button
            onClick={() => setSelectedCategory("sedan")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[38px] active:scale-95 ${
              selectedCategory === "sedan"
                ? "bg-slate-950 text-amber-400 shadow-md"
                : "bg-white text-slate-700 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            Sedan (Dzire / Etios)
          </button>
          <button
            onClick={() => setSelectedCategory("suv")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[38px] active:scale-95 ${
              selectedCategory === "suv"
                ? "bg-slate-950 text-amber-400 shadow-md"
                : "bg-white text-slate-700 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            SUV &amp; SUV+ (Ertiga / Innova)
          </button>
          <button
            onClick={() => setSelectedCategory("traveller")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[38px] active:scale-95 ${
              selectedCategory === "traveller"
                ? "bg-slate-950 text-amber-400 shadow-md"
                : "bg-white text-slate-700 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            Tempo Traveller (13-26 Seater)
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {vehiclesList.map((car) => {
              const currentPrice = getCarRate(car);
              const isDetailsOpen = expandedDetailsCarId === car.id;
              const tripDetails = getTripDetailsForCar(car);

              return (
                <div
                  key={car.id}
                  className="bg-white rounded-3xl border-2 border-amber-200/90 shadow-md overflow-hidden p-5 sm:p-6 hover:border-amber-400 transition-all group"
                >
                  <div className="grid sm:grid-cols-12 gap-6 items-center">
                    <div className="sm:col-span-5 space-y-3">
                      <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/90 border border-amber-200/80 shadow-sm flex items-center justify-center">
                        <Image
                          src={car.image}
                          alt={car.altOutstation ?? car.name}
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
                          AC Cab
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-4 space-y-2">
                      <h3 className="text-lg font-bold text-slate-950 font-royal">{car.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{car.models}</p>

                      <div className="space-y-1.5 pt-1 text-xs text-slate-700">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>
                            {outstationData.fromCity} → {outstationData.toCity} (
                            {outstationData.tripType === "roundTrip" ? "Round Trip" : "One Way Drop"})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>
                            {tripDetails.includedKm} km &amp; {tripDetails.includedHours} hours included
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>Fuel &amp; Driver Bhatta Included</span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-3 flex flex-row sm:flex-col items-center sm:items-end justify-between text-left sm:text-right pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-amber-100 sm:pl-5 gap-3">
                      <div>
                        <span className="text-sm font-semibold text-slate-400 block line-through decoration-red-500 decoration-2">
                          ₹{(currentPrice + 1200).toLocaleString()}
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-amber-900 leading-none">
                          ₹{currentPrice.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold block mt-0.5 sm:mt-1">
                          All-Inclusive Rate
                        </span>
                      </div>
                      <button
                        onClick={() => handleSelectCar(car.id)}
                        className="w-auto sm:w-full py-3 px-5 sm:px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <Zap className="w-3.5 h-3.5 fill-slate-950" />
                        <span>BOOK NOW</span>
                      </button>
                    </div>
                  </div>

                  {/* ---------------- INCLUSIONS & EXCLUSIONS ---------------- */}
                  <div className="mt-5 pt-4 border-t border-amber-100">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedDetailsCarId(isDetailsOpen ? null : car.id)
                      }
                      aria-expanded={isDetailsOpen}
                      className="flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>
                        {isDetailsOpen ? "Hide" : "View"} Inclusions &amp; Exclusions
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          isDetailsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDetailsOpen && (
                      <div className="mt-3 grid sm:grid-cols-2 gap-3 animate-fadeIn">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5">
                          <h5 className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Inclusions
                          </h5>
                          <ul className="space-y-1.5">
                            {getInclusions(tripDetails).map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-snug"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-600 mt-[1px] flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5">
                          <h5 className="text-[11px] font-black uppercase tracking-wider text-red-800 flex items-center gap-1.5 mb-2">
                            <XCircle className="w-3.5 h-3.5" />
                            Exclusions
                          </h5>
                          <ul className="space-y-1.5">
                            {getExclusions(tripDetails).map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-snug"
                              >
                                <X className="w-3.5 h-3.5 text-red-500 mt-[1px] flex-shrink-0" />
                                <span>{item}</span>
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

          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-md space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-amber-100">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950">Outstation Assurance</h4>
                  <span className="text-[11px] text-slate-500">100% Guaranteed On-Time Chauffeur</span>
                </div>
              </div>
              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Zero Toll Hassle:</strong> FASTag highway toll booths handled by chauffeur.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Interstate Permits:</strong> Jharkhand, Odisha &amp; Sikkim border documentation pre-arranged.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Doorstep Pickup:</strong> Chauffeur reaches your home address on schedule.</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-400 rounded-3xl p-6 border-2 border-amber-500 shadow-md space-y-4">
              <h4 className="text-lg font-bold text-slate-950 font-royal uppercase tracking-wide">
                Need Help Selecting?
              </h4>
              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                Our Kolkata festival route specialists can customize multiple days, timings, and large group travellers.
              </p>
              <a
                href="https://wa.me/918240765499"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 min-h-[48px] active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Checkout Modal */}
      {isCheckoutOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl border-2 border-amber-300 shadow-2xl overflow-hidden relative my-auto sm:my-8">
            <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 p-4 sm:p-5 text-slate-950 relative">
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-lg sm:text-xl font-bold font-royal text-slate-950">Review &amp; Confirm Booking</h3>
              <p className="text-xs text-amber-950/80 mt-0.5">
                {selectedVehicle.name} • {outstationData.fromCity} to {outstationData.toCity}
              </p>
            </div>

            <div className="p-4 sm:p-6 space-y-4 bg-puja-cream max-h-[82vh] overflow-y-auto">
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase">Selected Cab</span>
                    <h4 className="text-sm font-bold text-slate-950">{selectedVehicle.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-lg sm:text-xl font-black text-amber-900">₹{checkoutPrice.toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-700 block font-bold">✓ Fixed Highway Fare</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-amber-200 gap-2 text-xs flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Pickup Schedule:
                  </span>
                  <strong className="text-slate-900">
                    {outstationData.pickupDate} at {outstationData.pickupTime}
                  </strong>
                  {outstationData.tripType === "roundTrip" && outstationData.returnDate && (
                    <span className="text-slate-600 text-[11px]">
                      Return on {outstationData.returnDate} at {outstationData.returnTime}
                    </span>
                  )}
                </div>

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

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                      State <span className="text-red-500">*</span>
                    </label>
                    <div className="relative" ref={stateDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsStateOpen((prev) => !prev)}
                        aria-haspopup="listbox"
                        aria-expanded={isStateOpen}
                        className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl text-base sm:text-xs text-slate-900 focus:outline-none focus:border-amber-500 flex items-center justify-between gap-2 text-left"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          {pickupState}
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 flex-shrink-0 ${
                            isStateOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isStateOpen && (
                        <div
                          role="listbox"
                          className="absolute z-30 mt-1 w-full bg-white border border-amber-200 rounded-xl shadow-xl max-h-48 overflow-y-auto py-1"
                        >
                          {INDIAN_STATES.map((state) => (
                            <button
                              key={state}
                              type="button"
                              role="option"
                              aria-selected={pickupState === state}
                              onClick={() => {
                                setPickupState(state);
                                setIsStateOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                                pickupState === state
                                  ? "bg-amber-100 font-bold text-amber-900"
                                  : "text-slate-700 hover:bg-amber-50"
                              }`}
                            >
                              {state}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-100/90 rounded-2xl border border-amber-300 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-700">
                    <span>Total Trip Tariff:</span>
                    <span className="font-bold">₹{checkoutPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-950 font-black text-sm pt-1 border-t border-amber-200">
                    <span>Payable 25% Deposit to Lock:</span>
                    <span className="text-amber-900">
                      ₹{advanceAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 disabled:opacity-60 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 min-h-[48px] active:scale-95"
                >
                  {isProcessingPayment ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Connecting to Cashfree...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay 25% Advance &amp; Confirm Cab</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OutstationFleetPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm font-bold text-slate-500">Loading Outstation Fleet...</div>}>
      <OutstationFleetContent />
    </Suspense>
  );
}