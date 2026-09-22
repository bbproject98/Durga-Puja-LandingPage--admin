"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Clock,
  Sparkles,
  Home,
  RefreshCw,
  MessageCircle,
  Hash,
  ShieldCheck,
  Phone,
  CreditCard,
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

/* ------------------------------------------------------------------ */
/*  Cashfree Loader Setup (Forced to Production)                      */
/* ------------------------------------------------------------------ */
type CashfreeInstance = {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: "_modal" | "_self" | "_top" | "_blank";
  }) => Promise<any>;
};

function loadCashfree(): Promise<CashfreeInstance> {
  return new Promise((resolve, reject) => {
    const win = window as any;
    
    // Hardcoded to production to prevent sandbox mismatch errors
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

function PendingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  const paramStatus = searchParams.get("payment_status");

  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const loadBooking = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);

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
        // MERGE backend data with existing state so we don't overwrite local keys like paymentSessionId
        setBookingDetails((prev: any) => ({ ...prev, ...data }));
        if (data.customerName) setCustomerName(data.customerName);
        
        try {
          const existingSession = sessionStorage.getItem("broomboom_confirmed_booking");
          const parsedSession = existingSession ? JSON.parse(existingSession) : {};
          sessionStorage.setItem(
            "broomboom_confirmed_booking", 
            JSON.stringify({ ...parsedSession, ...data })
          );
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

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    await loadBooking({ silent: true });
    setRefreshing(false);
  };

  const bookingStatus = (bookingDetails?.paymentStatus || bookingDetails?.status || "").toUpperCase();
  const isPaid = bookingStatus ? PAID_STATES.includes(bookingStatus) : paramStatus === "SUCCESS";

  useEffect(() => {
    if (!loading && isPaid) {
      router.replace(`/thank-you?order_id=${orderId || ""}&payment_status=SUCCESS`);
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
  
  /* ------------------------------------------------------------------ */
  /*  Updated Payment Handler (Modal + Fallback to Link)                */
  /* ------------------------------------------------------------------ */
  const handleCompletePayment = async () => {
    setIsProcessingPayment(true);
    
    const paymentSessionId = bookingDetails?.paymentSessionId || bookingDetails?.cashfreeSessionId;
    const resumePaymentUrl = bookingDetails?.paymentLink || bookingDetails?.paymentUrl || bookingDetails?.checkoutUrl || bookingDetails?.shortUrl;

    if (paymentSessionId) {
      try {
        const cashfree = await loadCashfree();
        
        const checkoutRes = await cashfree.checkout({
          paymentSessionId: paymentSessionId,
          redirectTarget: "_modal", 
        });

        if (checkoutRes && (checkoutRes as any).error) {
          setIsProcessingPayment(false);
          return; // Stay on the pending page
        }

        window.location.href = `/thank-you?order_id=${encodeURIComponent(bookingRef)}&payment_status=SUCCESS`;
        return;

      } catch (err) {
        console.error("Failed to load Cashfree checkout on Pending page, falling back to link", err);
        // Do not return here; allow the code to fall through to the resumePaymentUrl below
      }
    }

    // Fallback if the session ID is missing, expired, or errored out
    if (resumePaymentUrl) {
      window.location.href = resumePaymentUrl;
      return;
    }

    setIsProcessingPayment(false);
    alert("Payment session expired or could not be found. Please create a new booking.");
    router.push("/fleet"); 
  };

  const waMsgPending = encodeURIComponent(
    `*🪔 DURGA PUJA CHAUFFEUR BOOKING — PAYMENT PENDING*\n` +
      `*Booking ID:* ${bookingRef}\n` +
      `*Customer:* ${customerName || "Guest"} (${customerPhone})\n` +
      `*Advance Due:* ${advancePaid}\n\n` +
      `*I could not complete the online advance payment. Please share a payment link / UPI ID so I can confirm my cab.*`
  );

  if (loading || isPaid) {
    return (
      <div className="min-h-screen bg-puja-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puja-cream flex items-center justify-center px-3 sm:px-4 py-6 sm:py-10">
      <div className="max-w-2xl w-full mx-auto">
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-2 border-amber-300 shadow-2xl text-center space-y-5 sm:space-y-6">
          <div className="w-16 h-16 sm:w-18 sm:h-18 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
            <Clock className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-amber-100 text-amber-900 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>🌸 Shubho Sharodiya 2026 — Durga Puja Chauffeur</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-festive text-slate-950">
            Payment Pending
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Thank you, <strong>{customerName || "Valued Customer"}</strong>! Your booking request has been created, but we have <strong className="text-amber-700">not received your advance deposit</strong> yet. Your chauffeur is <strong>not locked</strong> until the advance payment is completed.
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-amber-300 text-sm font-mono font-bold shadow-md">
            <Hash className="w-4 h-4 text-amber-400" />
            <span>Booking Ref:</span>
            <span className="text-white tracking-wide">{bookingRef}</span>
          </div>

          <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-950">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-950 text-amber-300 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900/70">Advance Due Now</div>
                <div className="text-xl sm:text-2xl font-black leading-tight">{advancePaid}</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
              <div className="text-[11px] font-semibold text-slate-900/80 text-center sm:text-right">
                Pay online to lock your
                <br className="hidden sm:block" /> cab &amp; chauffeur instantly
              </div>
              <button
                onClick={handleCompletePayment}
                disabled={isProcessingPayment}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-950 hover:bg-slate-800 active:scale-95 text-amber-300 font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center gap-1.5 disabled:opacity-70 min-w-[120px]"
              >
                {isProcessingPayment ? <Clock className="w-4 h-4 animate-spin" /> : "Pay Now"}
              </button>
            </div>
          </div>

          <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 text-left text-xs sm:text-sm space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-amber-200/70">
              <span className="text-slate-600">Reserved Vehicle</span>
              <span className="font-bold text-slate-900">{vehicleName}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-amber-200/70">
              <span className="text-slate-600">Advance Status</span>
              <span className="font-bold text-amber-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Awaiting Payment
              </span>
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

          <div className="bg-slate-900 text-white rounded-2xl p-4 border border-amber-500/40 text-left flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Nothing was deducted.</strong> If any amount was debited during the attempt, it is auto-reversed by your bank within 5–7 working days. Your request is saved under <strong className="text-amber-300">{bookingRef}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={handleRefreshStatus}
              disabled={refreshing}
              className="py-3.5 px-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-semibold text-xs rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 transition-all disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 text-slate-600 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Checking..." : "Refresh Status"}</span>
            </button>

            <a
              href={`https://wa.me/918240765499?text=${waMsgPending}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pay via WhatsApp</span>
            </a>

            <Link
              href="/"
              className="py-3.5 px-3 bg-slate-950 hover:bg-slate-800 active:scale-95 text-amber-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow"
            >
              <Home className="w-4 h-4" />
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-puja-cream flex items-center justify-center font-bold text-slate-500">Loading details...</div>}>
      <PendingContent />
    </Suspense>
  );
}