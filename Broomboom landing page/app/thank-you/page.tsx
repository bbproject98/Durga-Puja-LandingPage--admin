"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Sparkles,
  Home,
  Car,
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
import { getApiBaseUrl } from "@/lib/api";

const PAID_STATES = ["PAID", "SUCCESS", "SUCCESSFUL", "CONFIRMED", "CAPTURED", "COMPLETED"];

function toRupees(value: any, fallback: string | null = null): string | null {
  if (value == null) return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return `₹${n.toLocaleString("en-IN")}`;
}

function toNumber(value: any): number | null {
  if (value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  const paramStatus = searchParams.get("payment_status");

  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const loadBooking = useCallback(async () => {
    setLoading(true);
    try {
      const saved = sessionStorage.getItem("broomboom_confirmed_booking");
      if (saved) {
        const localSaved = JSON.parse(saved);
        setBookingDetails(localSaved);
        if (localSaved.customerName) setCustomerName(localSaved.customerName);
      }
    } catch (_) {}

    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${getApiBaseUrl()}/api/bookings/${encodeURIComponent(orderId)}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Booking not found");

      const json = await res.json();
      const data = json.data || json;

      if (data) {
        setBookingDetails(data);
        if (data.customerName) setCustomerName(data.customerName);
        try {
          sessionStorage.setItem("broomboom_confirmed_booking", JSON.stringify(data));
        } catch (_) {}
      }
    } catch (err) {
      console.warn("Could not retrieve backend booking details", err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  const bookingStatus = (bookingDetails?.paymentStatus || bookingDetails?.status || "").toUpperCase();
  const isPaid = bookingStatus ? PAID_STATES.includes(bookingStatus) : paramStatus === "SUCCESS";

  // REDIRECT LOGIC: Force URL to /pending with exact parameters if not paid
  useEffect(() => {
    if (!loading && !isPaid) {
      router.replace(`/Pending?order_id=${orderId || ""}&payment_status=PENDING`);
    }
  }, [loading, isPaid, orderId, router]);

  const bookingRef = bookingDetails?.bookingId || bookingDetails?.refId || orderId || "BBC-PUJA-REQUEST";
  const vehicleName = bookingDetails?.vehicleName || bookingDetails?.vehicle || "Assigned Chauffeur Cab";
  const packageTitle = bookingDetails?.packageTitle || bookingDetails?.package || "Durga Puja Festive Tour";
  const travelDate = bookingDetails?.travelDate || bookingDetails?.date || "Oct 16 (Maha Saptami)";
  const pickupTime = bookingDetails?.pickupTime || bookingDetails?.slot || "04:00 PM";
  const pickupAddress = bookingDetails?.pickupAddress || bookingDetails?.pickupLocation || "Kolkata, West Bengal";
  const advancePaid = toRupees(bookingDetails?.advancePaid) || bookingDetails?.advanceToPay || "₹2,051";
  const totalTariff = toRupees(bookingDetails?.totalTariff) || bookingDetails?.totalFare || "₹4,551";

  const rawBalance = toNumber(bookingDetails?.balancePayable);
  const totalNum = toNumber(bookingDetails?.totalTariff);
  const advanceNum = toNumber(bookingDetails?.advancePaid);
  const computedBalance = totalNum != null && advanceNum != null ? totalNum - advanceNum : null;
  const balanceNumber = rawBalance != null ? rawBalance : computedBalance;
  const balancePayable = balanceNumber != null && Number.isFinite(balanceNumber) && balanceNumber > 0
      ? `₹${balanceNumber.toLocaleString("en-IN")}`
      : null;

  const customerPhone = bookingDetails?.customerPhone || "+91 8240765499";
  const customerEmail = bookingDetails?.customerEmail || "guest@example.com";
  const vehicleSeats = bookingDetails?.vehicleSeats || bookingDetails?.passengers || 4;

  const waMsg = encodeURIComponent(
    `*🪔 DURGA PUJA CHAUFFEUR BOOKING CONFIRMATION*\n` +
      `*Booking ID:* ${bookingRef}\n` +
      `*Customer:* ${customerName || "Guest"} (${customerPhone})\n` +
      `*Vehicle:* ${vehicleName}\n` +
      `*Package:* ${packageTitle}\n` +
      `*Date & Time:* ${travelDate} at ${pickupTime}\n` +
      `*Pickup Location:* ${pickupAddress}\n` +
      `*Advance Deposit:* ${advancePaid} (PAID)\n` +
      `*Total Trip Tariff:* ${totalTariff}\n\n` +
      `*Shubho Sharodiya! Please send my dedicated chauffeur contact & cab number.*`
  );

  if (loading || !isPaid) {
    return (
      <div className="min-h-screen bg-puja-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puja-cream flex items-center justify-center px-3 sm:px-4 py-6 sm:py-10">
      <div className="max-w-2xl w-full mx-auto">
        <div className="text-center space-y-4 sm:space-y-5 bg-white p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-2 border-amber-300 shadow-2xl">
          <div className="w-16 h-16 sm:w-18 sm:h-18 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-amber-100 text-amber-900 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            <span>🌸 Shubho Sharodiya 2026 — Durga Puja Chauffeur</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-festive text-slate-950">
            Booking Confirmed &amp; Locked!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Thank you, <strong>{customerName || "Valued Customer"}</strong>! Your ride request is successfully registered. Your deposit is confirmed via Cashfree. A dedicated route-specialist chauffeur will be assigned to you.
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-amber-300 text-sm font-mono font-bold shadow-md">
            <Hash className="w-4 h-4 text-amber-400" />
            <span>Booking Ref:</span>
            <span className="text-white tracking-wide">{bookingRef}</span>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 sm:p-6 border border-amber-500/40 text-left space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Rider &amp; Passenger Details</h3>
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
                <div className="font-bold text-white text-sm truncate">{customerName || "Valued Passenger"}</div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>WhatsApp Mobile</span>
                </div>
                <div className="font-bold text-amber-300 text-sm">{customerPhone}</div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Confirmation Email</span>
                </div>
                <div className="font-medium text-slate-200 truncate">{customerEmail}</div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Passenger Capacity</span>
                </div>
                <div className="font-semibold text-slate-200">Up to {vehicleSeats} Passengers</div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 text-left text-xs sm:text-sm space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-amber-200/70">
              <span className="text-slate-600">Reserved Vehicle</span>
              <span className="font-bold text-slate-900">{vehicleName}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-amber-200/70">
              <span className="text-slate-600">Advance Paid</span>
              <span className="font-bold text-emerald-700">{advancePaid}</span>
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

          <div className="space-y-3 pt-3">
            <a
              href={`https://wa.me/918240765499?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Get WhatsApp Confirmation Slip</span>
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/#rental-packages" className="py-3 px-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md">
                <Car className="w-4 h-4" />
                <span>Rider Packages</span>
              </Link>
              <button onClick={() => window.print()} className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-300 flex items-center justify-center gap-1.5">
                <Download className="w-4 h-4 text-slate-600" />
                <span>Save Receipt</span>
              </button>
              <Link href="/" className="py-3 px-3 bg-slate-950 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-puja-cream" />}>
      <ThankYouContent />
    </Suspense>
  );
}