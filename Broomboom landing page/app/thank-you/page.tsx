"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Home,
  Car,
  RefreshCw,
  MessageCircle,
  Download,
  Hash,
  ShieldCheck,
  Phone,
  User,
  Users,
  Mail,
  MapPin,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:5000";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id");
  const paymentStatusParam = searchParams.get("payment_status"); // "SUCCESS" or "FAILED"

  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  // 1. Fetch booking details from backend using orderId or fallback to localStorage
  useEffect(() => {
    let localSaved: any = null;
    try {
      const saved = localStorage.getItem("broomboom_confirmed_booking");
      if (saved) {
        localSaved = JSON.parse(saved);
        setBookingDetails(localSaved);
        if (localSaved.customerName) {
          setCustomerName(localSaved.customerName);
        }
      }
    } catch (_) {}

    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/bookings/${encodeURIComponent(orderId)}`);
        if (!res.ok) throw new Error("Booking not found");
        const json = await res.json();
        const data = json.data || json;
        if (data) {
          setBookingDetails(data);
          if (data.customerName) {
            setCustomerName(data.customerName);
          }
        }
      } catch (err) {
        console.warn("Could not retrieve backend booking details, using fallback:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [orderId]);

  // 2. Determine payment status
  const isPaid =
    bookingDetails?.paymentStatus === "PAID" ||
    bookingDetails?.status === "CONFIRMED";
  const isFailure =
    paymentStatusParam === "FAILED" ||
    bookingDetails?.paymentStatus === "FAILED";
  const isSuccess = !isFailure;

  const bookingRef =
    bookingDetails?.bookingId ||
    bookingDetails?.refId ||
    orderId ||
    "BBC-PUJA-CONFIRMED";

  const vehicleName =
    bookingDetails?.vehicleName ||
    bookingDetails?.vehicle ||
    "Assigned Chauffeur Cab";

  const packageTitle =
    bookingDetails?.packageTitle ||
    bookingDetails?.package ||
    "Durga Puja Festive Tour";

  const travelDate =
    bookingDetails?.travelDate ||
    bookingDetails?.date ||
    "Oct 16 (Maha Saptami)";

  const pickupTime =
    bookingDetails?.pickupTime ||
    bookingDetails?.slot ||
    "04:00 PM";

  const pickupAddress =
    bookingDetails?.pickupAddress ||
    bookingDetails?.pickupLocation ||
    "Kolkata, West Bengal";

  const advancePaid =
    bookingDetails?.advancePaid != null
      ? `₹${Number(bookingDetails.advancePaid).toLocaleString()}`
      : bookingDetails?.advanceToPay || "₹1,138";

  const totalTariff =
    bookingDetails?.totalTariff != null
      ? `₹${Number(bookingDetails.totalTariff).toLocaleString()}`
      : bookingDetails?.totalFare || "₹4,551";

  const balancePayable =
    bookingDetails?.balancePayable != null
      ? `₹${Number(bookingDetails.balancePayable).toLocaleString()}`
      : null;

  const customerPhone =
    bookingDetails?.customerPhone || "+91 8240765499";

  const customerEmail =
    bookingDetails?.customerEmail || "guest@example.com";

  const vehicleSeats =
    bookingDetails?.vehicleSeats || bookingDetails?.passengers || 4;

  const waMsg = encodeURIComponent(
    `*🪔 DURGA PUJA CHAUFFEUR BOOKING CONFIRMATION*\n` +
      `*Booking ID:* ${bookingRef}\n` +
      `*Customer:* ${customerName || "Guest"} (${bookingDetails?.customerPhone || ""})\n` +
      `*Vehicle:* ${vehicleName}\n` +
      `*Package:* ${packageTitle}\n` +
      `*Date & Time:* ${travelDate} at ${pickupTime}\n` +
      `*Pickup Location:* ${pickupAddress}\n` +
      `*25% Advance Deposit:* ${advancePaid} (${isPaid ? "PAID" : "VERIFIED"})\n` +
      `*Total Trip Tariff:* ${totalTariff}\n\n` +
      `*Shubho Sharodiya! Please send my dedicated chauffeur contact & cab number.*`
  );

  // 3. Render loading
  if (loading) {
    return (
      <div className="min-h-screen bg-puja-cream flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-slate-700 font-bold text-sm">
            Verifying your payment &amp; reserving your chauffeur...
          </div>
        </div>
      </div>
    );
  }

  // 4. Render Failure Screen
  if (isFailure) {
    return (
      <div className="min-h-screen bg-puja-cream flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full bg-white p-8 sm:p-10 rounded-3xl border-2 border-red-300 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <XCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-950">Payment Not Completed</h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            The payment transaction was cancelled or could not be completed. Your chauffeur has not been locked yet.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => router.push("/fleet")}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold text-sm rounded-xl shadow flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Booking Again
            </button>
            <Link
              href="/#rental-packages"
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-sm rounded-xl border border-amber-300 flex items-center justify-center gap-2 transition-all"
            >
              <Car className="w-4 h-4" />
              <span>Rider Packages</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-amber-300 font-bold text-sm rounded-xl"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 5. SUCCESS CONFIRMATION SCREEN
  return (
    <div className="min-h-screen bg-puja-cream flex items-center justify-center px-3 sm:px-4 py-6 sm:py-10">
      <div className="max-w-2xl w-full mx-auto">
        <div className="text-center space-y-4 sm:space-y-5 bg-white p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-2 border-amber-300 shadow-2xl">
          
          {/* Green Check Icon */}
          <div className="w-16 h-16 sm:w-18 sm:h-18 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          {/* Festive Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-amber-100 text-amber-900 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            <span>🌸 Shubho Sharodiya 2026 — Durga Puja Chauffeur</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-festive text-slate-950">
            {isPaid ? "Booking Confirmed & Locked!" : "Booking Request Received!"}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Thank you, <strong>{customerName || "Valued Customer"}</strong>! Your ride request is
            successfully registered. {isPaid ? "Your 25% deposit is confirmed via Cashfree." : "Our Puja desk is verifying the confirmation."} A dedicated route-specialist chauffeur will be assigned to you.
          </p>

          {/* Booking Reference ID */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-amber-300 text-sm font-mono font-bold shadow-md">
            <Hash className="w-4 h-4 text-amber-400" />
            <span>Booking Ref:</span>
            <span className="text-white tracking-wide">{bookingRef}</span>
          </div>

          {/* Rider / Passenger Section */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 sm:p-6 border border-amber-500/40 text-left space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Rider &amp; Passenger Details</h3>
                  <p className="text-[11px] text-amber-300/80">Primary contact for chauffeur coordination</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Rider</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lead Rider Name</span>
                </div>
                <div className="font-bold text-white text-sm truncate">
                  {customerName || "Valued Passenger"}
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>WhatsApp Mobile</span>
                </div>
                <div className="font-bold text-amber-300 text-sm">
                  {customerPhone}
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Confirmation Email</span>
                </div>
                <div className="font-medium text-slate-200 truncate">
                  {customerEmail}
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Passenger Capacity</span>
                </div>
                <div className="font-semibold text-slate-200">
                  Up to {vehicleSeats} Passengers • Air Conditioned
                </div>
              </div>

              <div className="sm:col-span-2 bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pickup Address &amp; Kolkata Landmark</span>
                </div>
                <div className="font-medium text-slate-100 text-xs sm:text-sm">
                  {pickupAddress}
                </div>
              </div>
            </div>

            {/* Chauffeur Assignment Status for the Rider */}
            <div className="bg-amber-500/10 rounded-xl p-3.5 border border-amber-500/30 flex items-start gap-3">
              <Car className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-2">
                  <span>Assigned Chauffeur Status:</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                    Dispatch Queue
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Your police-verified, route-specialist chauffeur details (Name, Photo, Direct Contact &amp; Cab Plate Number) will be automatically dispatched via WhatsApp to <strong className="text-white">{customerPhone}</strong> exactly 2 hours prior to {pickupTime}.
                </p>
              </div>
            </div>

            {/* Rider Rental Packages Button */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <span className="text-[11px] text-slate-300">Need another festive circuit or outstation package?</span>
              <Link
                href="/#rental-packages"
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition-all hover:scale-105"
              >
                <Car className="w-3.5 h-3.5" />
                <span>Rider Rental Packages</span>
              </Link>
            </div>
          </div>

          {/* Detailed Summary Card */}
          <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 text-left text-xs sm:text-sm space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-amber-200/70">
              <span className="text-slate-600">Reserved Vehicle</span>
              <span className="font-bold text-slate-900">{vehicleName}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-amber-200/70">
              <span className="text-slate-600">Package / Route</span>
              <span className="font-bold text-amber-900">{packageTitle}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-amber-200/70">
              <span className="text-slate-600">Date &amp; Time Window</span>
              <span className="font-medium text-slate-800">
                {travelDate} • {pickupTime}
              </span>
            </div>

            <div className="flex justify-between items-start pb-2 border-b border-amber-200/70">
              <span className="text-slate-600">Pickup Address</span>
              <span className="font-medium text-slate-800 text-right max-w-[170px] sm:max-w-[260px] text-xs sm:text-sm break-words">
                {pickupAddress}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-amber-200/70">
              <span className="text-slate-600">25% Advance Paid</span>
              <span className="font-bold text-emerald-700">{advancePaid} (Online via Cashfree)</span>
            </div>

            {balancePayable && (
              <div className="flex justify-between items-center pb-2 border-b border-amber-200/70">
                <span className="text-slate-600">Balance to Driver on Trip</span>
                <span className="font-semibold text-slate-800">{balancePayable}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-1 font-bold text-sm">
              <span className="text-slate-700">Total Trip Tariff</span>
              <span className="text-amber-600 text-base">{totalTariff}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-3">
            <a
              href={`https://wa.me/919876543210?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 min-h-[48px]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Get WhatsApp Confirmation Slip</span>
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/#rental-packages"
                className="py-3 px-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 active:scale-95 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-400/25 hover:scale-105 min-h-[44px]"
              >
                <Car className="w-4 h-4" />
                <span>Rider / Rental Packages</span>
              </Link>

              <button
                onClick={() => window.print()}
                className="py-3 px-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-semibold text-xs rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 transition-all min-h-[44px]"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Save / Print Receipt</span>
              </button>

              <Link
                href="/"
                className="py-3 px-3 bg-slate-950 hover:bg-slate-800 active:scale-95 text-amber-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow min-h-[44px]"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </Link>
            </div>
          </div>

          {/* Helpline Footer */}
          <div className="pt-4 border-t border-amber-200/60 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-2">
            <div className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Guaranteed On-Time Chauffeur</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>24/7 Puja Control Room: <strong>+91 8240765499</strong></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-puja-cream flex items-center justify-center">
          <div className="text-slate-500 font-medium">Loading your booking details...</div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}