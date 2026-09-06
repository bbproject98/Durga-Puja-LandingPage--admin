"use client";

import React from "react";
import {
  ArrowLeft,
  Car,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  IndianRupee,
} from "lucide-react";

// ––– Types –––––––––––––––––––––––––––––––––––––––
interface BookingData {
  vehicleName: string;
  route: string;
  date: string;
  time: string;
  customerName: string;
  phone: string;
  email: string;
  pickupAddress: string;
  pincode: string;
  totalTariff: number;
  advanceAmount: number;
}

interface ConfirmationPageProps {
  bookingData?: BookingData;
  onBack?: () => void;
  onConfirm?: () => void;
}

// ––– Component –––––––––––––––––––––––––––––––––––
export default function BookingConfirmationPage({
  bookingData = {
    vehicleName: "Sedan (4 Seater)",
    route: "Kolkata to Bhubaneswar",
    date: "2026-09-06",
    time: "08:00 AM",
    customerName: "Pulak Ghosh",
    phone: "08583992978",
    email: "sakarpartha222@gmail.com",
    pickupAddress: "Flat 4B, South City Residency, Prince Anwar Shah Road, Kolkata",
    pincode: "700019",
    totalTariff: 6499,
    advanceAmount: 1625,
  },
  onBack,
  onConfirm,
}: ConfirmationPageProps) {
  const {
    vehicleName,
    route,
    date,
    time,
    customerName,
    phone,
    email,
    pickupAddress,
    pincode,
    totalTariff,
    advanceAmount,
  } = bookingData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">

      {/* ===== Sticky Header ===== */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-amber-200/50 dark:border-amber-800/30 shadow-sm safe-top">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-base sm:text-lg font-bold text-amber-700 dark:text-amber-400 tracking-wide">
            REVIEW &amp; CONFIRM BOOKING
          </h1>
          <div className="w-8" />
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 pb-8">

        {/* Trip Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-700 p-4 sm:p-6 space-y-2">
          <div className="flex items-center gap-3">
            <Car className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">
              {vehicleName} • {route}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Clock className="w-4 h-4" />
            <span>{date} at {time}</span>
          </div>
        </div>

        {/* Passenger Information */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-700 p-4 sm:p-6 space-y-3">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 border-b border-slate-200 dark:border-slate-700 pb-2">
            Passenger / Primary Rider Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Full Name *
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sm sm:text-base font-medium text-slate-800 dark:text-white">
                  {customerName}
                </span>
              </div>
            </div>
            <div>
              <label className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                WhatsApp / Phone *
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sm sm:text-base font-medium text-slate-800 dark:text-white">
                  {phone}
                </span>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Confirmation Email *
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sm sm:text-base font-medium text-slate-800 dark:text-white break-all">
                  {email}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Pickup Address + Pincode */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-700 p-4 sm:p-6 space-y-3">
          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Pickup Address in Kolkata *
            </label>
            <div className="flex items-start gap-2 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base font-medium text-slate-800 dark:text-white">
                {pickupAddress}
              </span>
            </div>
          </div>
          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Pincode
            </label>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm sm:text-base font-medium text-slate-800 dark:text-white">
                {pincode}
              </span>
            </div>
          </div>
        </section>

        {/* Fare Summary */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl shadow-md border border-amber-200/60 dark:border-amber-800/30 p-4 sm:p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Total Trip Tariff
            </span>
            <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
              ₹{totalTariff.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-amber-200/50 dark:border-amber-700/40 pt-3">
            <div>
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                Payable 25% Deposit to Lock
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Advance payment secures your booking
              </p>
            </div>
            <span className="text-xl font-black text-amber-600 dark:text-amber-300">
              ₹{advanceAmount.toLocaleString()}
            </span>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[48px]"
          >
            <IndianRupee className="w-4 h-4" />
            Pay ₹{advanceAmount} &amp; Confirm Cab →
          </button>
        </div>
      </main>
    </div>
  );
}