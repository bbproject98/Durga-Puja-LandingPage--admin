"use client";

import React from "react";
import { Check, MessageCircle, Download, Home, Phone, Hash } from "lucide-react";

interface ConfirmedBooking {
  refId: string;
  customerName: string;
  customerPhone: string;
  vehicle: string;
  vehicleModel: string;
  package: string;
  date: string;
  slot: string;
  pickupLocation: string;
  totalFare: string | number;
  advanceToPay: string | number;
}

interface ThankYouModalProps {
  booking: ConfirmedBooking | null;
  onClose: () => void;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const waMsg = encodeURIComponent(
    `*🪔 DURGA PUJA CHAUFFEUR BOOKING CONFIRMATION*\n` +
      `*Booking ID:* ${booking.refId}\n` +
      `*Customer:* ${booking.customerName} (${booking.customerPhone})\n` +
      `*Vehicle:* ${booking.vehicle}\n` +
      `*Package:* ${booking.package}\n` +
      `*Date:* ${booking.date}\n` +
      `*Pickup:* ${booking.pickupLocation}\n` +
      `*Total Fare:* ${booking.totalFare}\n` +
      `*Advance:* ${booking.advanceToPay}\n\n` +
      `*Shubho Sharodiya! Please share chauffeur assignment details & GPS tracking.*`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 overflow-y-auto">
      <div className="glass-modal w-full max-w-2xl rounded-3xl border border-amber-500/50 shadow-2xl p-6 sm:p-10 text-center relative animate-fadeIn my-8">
        
        {/* Festive Diya Badge */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-red-600 p-1 shadow-xl shadow-red-600/40 mb-6 float-slow">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-amber-400">
            <Check className="w-9 h-9" />
          </div>
        </div>

        <span className="px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/40">
          🌸 Shubho Sharodiya!
        </span>

        <h2 className="text-2xl sm:text-3xl font-bold font-festive text-white mt-3 mb-1">
          Booking Request Confirmed!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6">
          Maa Aschhen! We have reserved your vehicle. Our Central Puja Desk is assigning your route-specialist chauffeur.
        </p>

        {/* Booking Reference */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-300 text-sm font-mono font-bold mb-6">
          <Hash className="w-4 h-4 text-amber-400" />
          <span>Reference ID: </span>
          <span className="text-white">{booking.refId}</span>
        </div>

        {/* Booking Summary Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 text-left text-xs space-y-2.5 mb-6">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Customer Name:</span>
            <span className="font-bold text-white">{booking.customerName}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">WhatsApp Phone:</span>
            <span className="font-medium text-amber-300">{booking.customerPhone}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Allocated Vehicle:</span>
            <span className="font-bold text-white">
              {booking.vehicle} ({booking.vehicleModel})
            </span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Package / Route:</span>
            <span className="text-amber-300 font-medium">{booking.package}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Date &amp; Slot:</span>
            <span className="font-medium text-slate-200">
              {booking.date} ({booking.slot.toUpperCase()})
            </span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Pickup Address:</span>
            <span className="text-slate-300 font-medium truncate max-w-[200px]">
              {booking.pickupLocation}
            </span>
          </div>
          <div className="flex justify-between pt-1 font-bold text-sm">
            <span className="text-slate-300">Total Tariff:</span>
            <span className="text-amber-400">{booking.totalFare}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={`https://wa.me/919876543210?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Open Instant Booking Slip on WhatsApp</span>
          </a>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => window.print()}
              className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-white/10 flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Save / Print PDF
            </button>
            <button
              onClick={onClose}
              className="py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs rounded-xl border border-amber-500/30 flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" /> Return to Home
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-center gap-2">
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>
            Need urgent driver coordinates? Call 24/7 Helpline: <strong>+91 98765 43210</strong>
          </span>
        </div>

      </div>
    </div>
  );
};

