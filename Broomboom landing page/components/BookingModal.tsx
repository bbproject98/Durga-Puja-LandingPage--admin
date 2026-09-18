"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Car,
  UserCheck,
  Gift,
  ArrowRight,
  Lock,
  IdCard,
  Mic,
  Cake,
  Accessibility,
} from "lucide-react";
import { FLEET_DATA } from "@/data/fleet";
import { PACKAGES_DATA } from "@/data/packages";
import { BookingState, ConfirmedBooking } from "@/types";
import { submitBooking } from "@/lib/api";

// –––––––– Cashfree types and loader ––––––––––––––
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
      if (win.Cashfree) {
        resolve(win.Cashfree({ mode: "production" }));
      } else {
        reject(new Error("Unable to load Cashfree."));
      }
    };

    script.onerror = () => {
      reject(new Error("Unable to load Cashfree."));
    };

    document.head.appendChild(script);
  });
}

// –––––––– Component Props –––––––––––––––––––––––––
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVehicleId?: string;
  initialPackageId?: string;
  onBookingConfirmed: (booking: ConfirmedBooking) => void;
}

// –––––––– Component –––––––––––––––––––––––––––––––
export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialVehicleId = "suv_7",
  initialPackageId = "south_theme",
  onBookingConfirmed,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [bookingState, setBookingState] = useState<BookingState>({
    selectedVehicleId: initialVehicleId,
    selectedPackageId: initialPackageId,
    selectedDate: "2026-10-16 (Maha Saptami)",
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
      wheelchair: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      setBookingState((prev) => ({
        ...prev,
        selectedVehicleId: initialVehicleId || prev.selectedVehicleId,
        selectedPackageId: initialPackageId || prev.selectedPackageId,
      }));
      setStep(1);
    }
  }, [isOpen, initialVehicleId, initialPackageId]);

  if (!isOpen) return null;

  // –––– Derived data –––––––––––––––––––––––––––––––
  const car = FLEET_DATA[bookingState.selectedVehicleId] || FLEET_DATA.suv_7;
  const pkg = PACKAGES_DATA[bookingState.selectedPackageId] || PACKAGES_DATA.south_theme;

  let baseFare = car.basePrice;
  if (pkg.type === "pandal" && pkg.pricingMultiplier) {
    baseFare = Math.round(car.basePrice * pkg.pricingMultiplier);
  } else if (pkg.type === "outstation") {
    baseFare = Math.round(car.outstationPerKm * 380 + 1500);
  }

  let addonsTotal = 0;
  if (bookingState.addons.vipPass) addonsTotal += 499 * (bookingState.passengers || 4);
  if (bookingState.addons.guide) addonsTotal += 1199;
  if (bookingState.addons.sweets) addonsTotal += 599;

  const totalFare = baseFare + addonsTotal;

  // Fixed ₹2051 booking advance (GST + gateway still added on top as before)
  const FIXED_ADVANCE = 2051;
  const advanceAmount = Math.min(FIXED_ADVANCE, totalFare);

  const withGst = advanceAmount * 1.05;
  const withGateway = withGst * 1.03;
  const payableAmount = Math.ceil(withGateway);

  const gstAmount = Math.round(advanceAmount * 0.05);
  const gatewayCharge = Math.ceil(withGst * 0.03);
  const balanceDue = totalFare - advanceAmount;
  // –––– Handlers –––––––––––––––––––––––––––––––––––
  const handleNextStep = (currentStep: number) => {
    if (currentStep === 1) {
      setStep(2);
    } else if (currentStep === 2) {
      if (!bookingState.customerName.trim()) {
        alert("Please enter your full name.");
        return;
      }
      if (!bookingState.customerPhone.trim() || bookingState.customerPhone.trim().length < 10) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }
      if (!bookingState.pickupLocation.trim()) {
        alert("Please provide your pickup location in Kolkata.");
        return;
      }
      setStep(3);
    }
  };

  const handleConfirm = async (payMode: string) => {
    const localRef = "BBC-PUJA-" + Math.floor(100000 + Math.random() * 900000);

    const confirmed: ConfirmedBooking = {
      refId: localRef,
      timestamp: new Date().toISOString(),
      customerName: bookingState.customerName,
      customerPhone: bookingState.customerPhone,
      customerEmail: bookingState.customerEmail,
      pickupLocation: bookingState.pickupLocation,
      vehicle: car.name,
      vehicleModel: car.models,
      package: pkg.title,
      date: bookingState.selectedDate,
      slot: bookingState.timeSlot,
      passengers: bookingState.passengers,
      addons: bookingState.addons,
      payMode: payMode,
      totalFare: `₹${totalFare.toLocaleString()}`,
      advanceToPay: `₹${advanceAmount.toLocaleString()}`,
    };

    try {
      sessionStorage.setItem("broomboom_confirmed_booking", JSON.stringify(confirmed));
    } catch (e) {
      console.warn("Storage error", e);
    }

    if (payMode === "cod") {
      onBookingConfirmed(confirmed);
      return;
    }

    setIsProcessing(true);
    try {
      const payload = {
        customerName: bookingState.customerName.trim(),
        customerPhone: bookingState.customerPhone.trim(),
        customerEmail: bookingState.customerEmail.trim() || "guest@example.com",
        vehicleName: car.name,
        vehicleModels: car.models,
        vehicleSeats: car.seats,
        packageTitle: pkg.title,
        travelDate: bookingState.selectedDate,
        pickupTime:
          bookingState.timeSlot === "morning"
            ? "08:00 AM"
            : bookingState.timeSlot === "evening"
            ? "04:00 PM"
            : bookingState.timeSlot === "midnight"
            ? "10:00 PM"
            : "09:00 AM",
        pickupAddress: bookingState.pickupLocation.trim(),
        totalTariff: totalFare,
      };

      const result = await submitBooking(payload);
      if (!result?.success || !result?.data?.paymentSessionId) {
        throw new Error(result?.message || "Failed to initialize payment session.");
      }

      const bookingRef =
        result.data?.booking?.cashfreeOrderId ||
        result.data?.booking?.bookingId ||
        localRef;

      confirmed.refId = result.data?.booking?.bookingId || bookingRef;
      try {
        sessionStorage.setItem("broomboom_confirmed_booking", JSON.stringify(confirmed));
      } catch (_) {}

      const cashfree = await loadCashfree();
      const checkoutRes = await cashfree.checkout({
        paymentSessionId: result.data.paymentSessionId,
        redirectTarget: "_modal",
      });

      if (checkoutRes && (checkoutRes as any).error) {
        console.warn("Cashfree checkout modal closed or error:", (checkoutRes as any).error);
        setIsProcessing(false);
        return;
      }

      window.location.href = `/thank-you?order_id=${encodeURIComponent(bookingRef)}&payment_status=SUCCESS`;
    } catch (error: any) {
      setIsProcessing(false);
      console.error("Booking payment error:", error);
      alert(error?.message || "Failed to initiate payment. Please try again.");
    }
  };

  // –––––––– Render –––––––––––––––––––––––––––––––––
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="glass-modal w-full max-w-3xl rounded-2xl sm:rounded-3xl border border-amber-500/40 shadow-2xl overflow-hidden my-auto max-h-[95vh] sm:max-h-[90vh] animate-fadeIn flex flex-col">
        
        {/* -------- Header (fixed) -------- */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 p-3 sm:p-6 border-b border-amber-500/30 flex items-center justify-between flex-shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
              <span className="text-[9px] sm:text-xs uppercase font-bold text-amber-300 tracking-wider truncate">
                Durga Puja Chauffeur Booking
              </span>
            </div>
            <h3 className="text-sm sm:text-xl font-bold font-royal text-white mt-0.5 sm:mt-1 truncate">
              Reserve Your Festive Ride
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* -------- Step Indicator (fixed) -------- */}
        <div className="bg-slate-900/90 px-2 sm:px-6 py-2 sm:py-3 border-b border-white/5 flex items-center justify-between text-[10px] sm:text-xs font-semibold text-slate-400 overflow-x-auto scrollbar-hide gap-1 flex-shrink-0">
          <div
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-lg whitespace-nowrap ${
              step === 1 ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : ""
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-[11px] ${
                step >= 1 ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400"
              }`}
            >
              1
            </span>
            <span className="hidden xs:inline">Vehicle &amp; Route</span>
            <span className="xs:hidden">Veh.</span>
          </div>

          <div
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-lg whitespace-nowrap ${
              step === 2 ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : ""
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-[11px] ${
                step >= 2 ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400"
              }`}
            >
              2
            </span>
            <span className="hidden xs:inline">Pickup &amp; Passenger</span>
            <span className="xs:hidden">Pickup</span>
          </div>

          <div
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-lg whitespace-nowrap ${
              step === 3 ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : ""
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-[11px] ${
                step === 3 ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400"
              }`}
            >
              3
            </span>
            <span className="hidden xs:inline">Add-ons &amp; Confirm</span>
            <span className="xs:hidden">Confirm</span>
          </div>
        </div>

        {/* -------- Scrollable Body -------- */}
        <div className="p-3 sm:p-8 overflow-y-auto flex-1">
          
          {/* ====== STEP 1 ====== */}
          {step === 1 && (
            <div className="space-y-4 sm:space-y-5">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-400 flex-shrink-0" /> Step 1: Select Fleet &amp; Itinerary
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-slate-300 mb-1 block">
                    Select Vehicle Category
                  </label>
                  <select
                    value={bookingState.selectedVehicleId}
                    onChange={(e) =>
                      setBookingState({ ...bookingState, selectedVehicleId: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-3 bg-slate-900 border border-amber-500/30 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-amber-400 min-h-[44px]"
                  >
                    <option value="sedan_4">Sedan (4 Seater) — Dzire / Etios (₹2,499)</option>
                    <option value="suv_6">SUV (6 Seater) — Ertiga / Carens (₹3,499)</option>
                    <option value="suv_7">SUV+ (7 Seater) — Innova Crysta / Hycross (₹4,799)</option>
                    <option value="traveller_13">Tempo Traveller (13 Seater Luxury) (₹7,499)</option>
                    <option value="traveller_15">Tempo Traveller (15 Seater Executive) (₹8,499)</option>
                    <option value="traveller_17">Tempo Traveller (17 Seater Grand) (₹9,999)</option>
                  </select>
                  <div className="text-[10px] sm:text-[11px] text-amber-300 mt-1 font-medium">
                    {car.models} • {car.seats} Seats • {car.luggage}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-slate-300 mb-1 block">
                    Select Package / Route
                  </label>
                  <select
                    value={bookingState.selectedPackageId}
                    onChange={(e) =>
                      setBookingState({ ...bookingState, selectedPackageId: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-3 bg-slate-900 border border-amber-500/30 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-amber-400 min-h-[44px]"
                  >
                    <option value="north_heritage">North Kolkata Heritage &amp; Bonedi Bari</option>
                    <option value="south_theme">South Kolkata Mega Theme Circuit</option>
                    <option value="midnight_vip">VIP Midnight Parikrama (10 PM - 6 AM)</option>
                    <option value="festive_5day">5-Day All-Inclusive VIP Chauffeur Pass</option>
                    <option value="outstation_digha">Outstation: Kolkata ⇄ Digha / Mandarmani</option>
                    <option value="outstation_shantiniketan">Outstation: Kolkata ⇄ Shantiniketan</option>
                    <option value="outstation_mayapur">Outstation: Kolkata ⇄ Mayapur / Nabadwip</option>
                    <option value="outstation_sundarbans">Outstation: Kolkata ⇄ Sundarbans Gateway</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-slate-300 mb-1 block">
                    Puja Date / Day
                  </label>
                  <select
                    value={bookingState.selectedDate}
                    onChange={(e) =>
                      setBookingState({ ...bookingState, selectedDate: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-3 bg-slate-900 border border-amber-500/30 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-amber-400 min-h-[44px]"
                  >
                    <option value="2026-10-15 (Maha Sasthi)">Oct 15 (Maha Sasthi) — Agomoni</option>
                    <option value="2026-10-16 (Maha Saptami)">Oct 16 (Maha Saptami)</option>
                    <option value="2026-10-17 (Maha Ashtami)">Oct 17 (Maha Ashtami) — Sandhi Puja</option>
                    <option value="2026-10-18 (Maha Navami)">Oct 18 (Maha Navami)</option>
                    <option value="2026-10-19 (Bijoya Dashami)">Oct 19 (Bijoya Dashami) — Immersion</option>
                    <option value="2026-10-14 (Panchami Night)">Oct 14 (Panchami Night Preview)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-slate-300 mb-1 block">
                    Preferred Time Window
                  </label>
                  <select
                    value={bookingState.timeSlot}
                    onChange={(e) =>
                      setBookingState({ ...bookingState, timeSlot: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-3 bg-slate-900 border border-amber-500/30 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-amber-400 min-h-[44px]"
                  >
                    <option value="morning">Morning Tour (08:00 AM – 04:00 PM)</option>
                    <option value="evening">Evening Prime Tour (04:00 PM – 12:00 AM)</option>
                    <option value="midnight">All-Night Midnight Tour (10:00 PM – 06:00 AM)</option>
                    <option value="full_day">Full Day 24-Hr Continuous Charter</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 sm:pt-4 flex justify-end">
                <button
                  onClick={() => handleNextStep(1)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <span>Continue to Passenger Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ====== STEP 2 ====== */}
          {step === 2 && (
            <div className="space-y-4 sm:space-y-5">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400 flex-shrink-0" /> Step 2: Contact &amp; Pickup Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-slate-300 mb-1 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Anirban Roy"
                    value={bookingState.customerName}
                    onChange={(e) =>
                      setBookingState({ ...bookingState, customerName: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-3 bg-slate-900 border border-amber-500/30 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-amber-400 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-slate-300 mb-1 block">
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 8240765499"
                    value={bookingState.customerPhone}
                    onChange={(e) =>
                      setBookingState({ ...bookingState, customerPhone: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-3 bg-slate-900 border border-amber-500/30 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-amber-400 min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-slate-300 mb-1 block">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. anirban@gmail.com"
                    value={bookingState.customerEmail}
                    onChange={(e) =>
                      setBookingState({ ...bookingState, customerEmail: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-3 bg-slate-900 border border-amber-500/30 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-amber-400 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-slate-300 mb-1 block">
                    Total Passenger Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={bookingState.passengers}
                    onChange={(e) =>
                      setBookingState({
                        ...bookingState,
                        passengers: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-3 bg-slate-900 border border-amber-500/30 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-amber-400 min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] sm:text-xs font-semibold text-slate-300 mb-1 block">
                  Pickup Address &amp; Landmark in Kolkata *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tower 4, South City Garden, Prince Anwar Shah Road"
                  value={bookingState.pickupLocation}
                  onChange={(e) =>
                    setBookingState({ ...bookingState, pickupLocation: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-3 bg-slate-900 border border-amber-500/30 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-amber-400 min-h-[44px]"
                />
              </div>

              <div>
                <label className="text-[11px] sm:text-xs font-semibold text-slate-300 mb-1 block">
                  Special Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Elderly passenger, child seat, specific route preferences..."
                  value={bookingState.notes}
                  onChange={(e) =>
                    setBookingState({ ...bookingState, notes: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 bg-slate-900 border border-amber-500/30 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 sm:pt-4 flex flex-col-reverse sm:flex-row justify-between gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-5 sm:px-6 py-3 bg-slate-800 text-slate-300 font-semibold text-xs sm:text-sm rounded-xl hover:bg-slate-700 active:scale-95 transition-all min-h-[44px] flex items-center justify-center"
                >
                  &larr; Back
                </button>
                <button
                  onClick={() => handleNextStep(2)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <span>Continue to Add-ons</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ====== STEP 3 ====== */}
          {step === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400 flex-shrink-0" /> Step 3: Enhance Your Puja Experience &amp; Confirm
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <label className="cursor-pointer block">
                  <input
                    type="checkbox"
                    checked={bookingState.addons.vipPass}
                    onChange={(e) =>
                      setBookingState({
                        ...bookingState,
                        addons: { ...bookingState.addons, vipPass: e.target.checked },
                      })
                    }
                    className="hidden peer"
                  />
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/80 border border-white/10 peer-checked:border-amber-500 peer-checked:bg-amber-500/10 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-600/30 text-red-400 flex items-center justify-center flex-shrink-0">
                        <IdCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-white truncate">VIP Fast-Track Pass</div>
                        <div className="text-[10px] sm:text-xs text-slate-400 truncate">Priority queue access</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="text-xs sm:text-sm font-bold text-amber-400">+₹499</span>
                      <span className="text-[8px] sm:text-[9px] text-slate-500 block">/ person</span>
                    </div>
                  </div>
                </label>

                <label className="cursor-pointer block">
                  <input
                    type="checkbox"
                    checked={bookingState.addons.guide}
                    onChange={(e) =>
                      setBookingState({
                        ...bookingState,
                        addons: { ...bookingState.addons, guide: e.target.checked },
                      })
                    }
                    className="hidden peer"
                  />
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/80 border border-white/10 peer-checked:border-amber-500 peer-checked:bg-amber-500/10 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
                        <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-white truncate">Cultural Storyteller</div>
                        <div className="text-[10px] sm:text-xs text-slate-400 truncate">Bengali / English guide</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="text-xs sm:text-sm font-bold text-amber-400">+₹1,199</span>
                      <span className="text-[8px] sm:text-[9px] text-slate-500 block">/ tour</span>
                    </div>
                  </div>
                </label>

                <label className="cursor-pointer block">
                  <input
                    type="checkbox"
                    checked={bookingState.addons.sweets}
                    onChange={(e) =>
                      setBookingState({
                        ...bookingState,
                        addons: { ...bookingState.addons, sweets: e.target.checked },
                      })
                    }
                    className="hidden peer"
                  />
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/80 border border-white/10 peer-checked:border-amber-500 peer-checked:bg-amber-500/10 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
                        <Cake className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-white truncate">Traditional Mishti Box</div>
                        <div className="text-[10px] sm:text-xs text-slate-400 truncate">Assorted Bengali sweets</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="text-xs sm:text-sm font-bold text-amber-400">+₹599</span>
                      <span className="text-[8px] sm:text-[9px] text-slate-500 block">/ box</span>
                    </div>
                  </div>
                </label>

                <label className="cursor-pointer block">
                  <input
                    type="checkbox"
                    checked={bookingState.addons.wheelchair}
                    onChange={(e) =>
                      setBookingState({
                        ...bookingState,
                        addons: { ...bookingState.addons, wheelchair: e.target.checked },
                      })
                    }
                    className="hidden peer"
                  />
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900/80 border border-white/10 peer-checked:border-amber-500 peer-checked:bg-amber-500/10 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
                        <Accessibility className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-white truncate">Folding Wheelchair</div>
                        <div className="text-[10px] sm:text-xs text-slate-400 truncate">For senior citizens</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="text-xs sm:text-sm font-bold text-emerald-400">FREE</span>
                      <span className="text-[8px] sm:text-[9px] text-slate-500 block">Complimentary</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Price Breakdown */}
              <div className="p-3 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-red-950/60 border border-amber-500/40 space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-white/10">
                  <span className="text-[10px] sm:text-xs text-slate-400">Selected Vehicle</span>
                  <span className="text-[11px] sm:text-xs font-bold text-white truncate ml-2">
                    {car.name} ({car.seats} Seater)
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-white/10">
                  <span className="text-[10px] sm:text-xs text-slate-400">Itinerary / Package</span>
                  <span className="text-[11px] sm:text-xs font-bold text-amber-300 truncate ml-2">{pkg.title}</span>
                </div>
                <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-white/10">
                  <span className="text-[10px] sm:text-xs text-slate-400">Date &amp; Slot</span>
                  <span className="text-[11px] sm:text-xs text-slate-200 font-medium truncate ml-2">
                    {bookingState.selectedDate} • {bookingState.timeSlot.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-400">
                  <span>Base Festive Tariff (8 hrs / 80 km)</span>
                  <span className="text-white font-semibold">₹{baseFare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-400">
                  <span>Add-ons Total</span>
                  <span className="text-amber-400 font-semibold">₹{addonsTotal.toLocaleString()}</span>
                </div>
                <div className="pt-2 sm:pt-3 border-t border-amber-500/30 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">Total Estimated Tariff</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400">Incl. Fuel, AC &amp; Verified Driver</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-amber-400">
                    ₹{totalFare.toLocaleString()}
                  </span>
                </div>

                <div className="p-2 sm:p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between items-center text-[10px] sm:text-xs">
                    <span className="text-amber-300">Fixed Booking Advance </span>
                    <span className="text-white font-semibold">₹{advanceAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] sm:text-xs">
                    <span className="text-amber-300">GST (5%)</span>
                    <span className="text-white font-semibold">+₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] sm:text-xs">
                    <span className="text-amber-300">Gateway Charges (3%)</span>
                    <span className="text-white font-semibold">+₹{gatewayCharge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 sm:pt-2 border-t border-amber-500/30">
                    <span className="text-xs sm:text-sm font-bold text-amber-300">Total Payable in Gateway</span>
                    <span className="text-base sm:text-lg font-black text-amber-400">₹{payableAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-[9px] sm:text-[10px] text-slate-400 text-center pt-1">
                  Balance of ₹{balanceDue.toLocaleString()} to be paid to the driver in cash.
                </div>
              </div>

              <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-5 sm:px-6 py-3 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-700 transition-all min-h-[44px] flex items-center justify-center"
                >
                  &larr; Back to Details
                </button>
                <div className="w-full sm:w-auto flex flex-col xs:flex-row items-stretch gap-3">
                  <button
                    onClick={() => handleConfirm("cod")}
                    className="w-full xs:w-auto px-4 sm:px-5 py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl transition-all min-h-[44px] flex items-center justify-center"
                  >
                    Request Call &amp; Pay Later
                  </button>
                  <button
                    onClick={() => handleConfirm("advance")}
                    disabled={isProcessing}
                    className="w-full xs:w-auto px-6 sm:px-8 py-3 btn-shimmer bg-gradient-to-r from-amber-500 to-amber-600 disabled:opacity-60 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {isProcessing
                        ? "Opening Secure Payment..."
                        : `Pay ₹${payableAmount} & Confirm`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* end scrollable body */}
      </div>
    </div>
  );
};
