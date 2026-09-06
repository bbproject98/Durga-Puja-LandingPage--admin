"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { FLEET_DATA } from "@/data/fleet";
import { PACKAGES_DATA } from "@/data/packages";

interface FareEstimatorProps {
  onSelectAndBook: (vehicleId: string, packageId: string) => void;
}

export const FareEstimator: React.FC<FareEstimatorProps> = ({ onSelectAndBook }) => {
  const [vehicleId, setVehicleId] = useState("suv_7");
  const [packageId, setPackageId] = useState("south_theme");
  const [selectedDate, setSelectedDate] = useState("2026-10-16 (Maha Saptami)");

  const selectedVehicle = FLEET_DATA[vehicleId] || FLEET_DATA.suv_7;
  const selectedPackage = PACKAGES_DATA[packageId] || PACKAGES_DATA.south_theme;

  let calculatedFare = selectedVehicle.basePrice;
  if (selectedPackage.type === "pandal" && selectedPackage.pricingMultiplier) {
    calculatedFare = Math.round(selectedVehicle.basePrice * selectedPackage.pricingMultiplier);
  } else if (selectedPackage.type === "outstation") {
    calculatedFare = Math.round(selectedVehicle.outstationPerKm * 380 + 1500);
  }

  return (
    <div className="glass-modal rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <h3 className="text-lg font-bold text-white font-royal">Instant Puja Fare Estimator</h3>
        </div>
        <span className="text-[11px] bg-red-600/30 text-red-300 px-2 py-0.5 rounded border border-red-500/30 font-semibold">
          Festive Special
        </span>
      </div>

      <div className="space-y-4">
        {/* Select Vehicle */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1.5 block">1. Select Vehicle Type</label>
          <select
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900/90 border border-amber-500/30 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
          >
            <option value="sedan_4">Sedan (4 Seater) — Swift Dzire / Etios</option>
            <option value="suv_6">SUV (6 Seater) — Ertiga / Carens</option>
            <option value="suv_7">SUV+ (7 Seater) — Innova Crysta / Hycross</option>
            <option value="traveller_13">Tempo Traveller (13 Seater) — Urbania Luxury</option>
            <option value="traveller_15">Tempo Traveller (15 Seater) — Executive Deluxe</option>
            <option value="traveller_17">Tempo Traveller (17 Seater) — Grand Luxury</option>
          </select>
          <p className="text-[11px] text-amber-300/80 mt-1">
            {selectedVehicle.name} • {selectedVehicle.seats} Seats • {selectedVehicle.luggage}
          </p>
        </div>

        {/* Select Package */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1.5 block">2. Select Package or Route</label>
          <select
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900/90 border border-amber-500/30 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
          >
            <option value="north_heritage">North Kolkata Heritage & Bonedi Bari (8-10 Hrs)</option>
            <option value="south_theme">South Kolkata Mega Theme Circuit (10-12 Hrs)</option>
            <option value="midnight_vip">VIP Midnight Parikrama (10 PM - 6 AM)</option>
            <option value="festive_5day">5-Day All-Inclusive VIP Chauffeur (Sasthi-Dashami)</option>
            <option value="outstation_digha">Outstation: Kolkata ⇄ Digha / Mandarmani</option>
            <option value="outstation_shantiniketan">Outstation: Kolkata ⇄ Shantiniketan (Bolpur)</option>
            <option value="outstation_mayapur">Outstation: Kolkata ⇄ Mayapur / Nabadwip</option>
            <option value="outstation_sundarbans">Outstation: Kolkata ⇄ Sundarbans Gateway</option>
          </select>
        </div>

        {/* Select Day */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1.5 block">3. Puja Festival Day</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900/90 border border-amber-500/30 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
          >
            <option value="2026-10-15 (Maha Sasthi)">Oct 15 (Maha Sasthi) — Agomoni & Bodhon</option>
            <option value="2026-10-16 (Maha Saptami)">Oct 16 (Maha Saptami) — Nabapatrika Snan</option>
            <option value="2026-10-17 (Maha Ashtami)">Oct 17 (Maha Ashtami) — Sandhi Puja & Kumari Puja</option>
            <option value="2026-10-18 (Maha Navami)">Oct 18 (Maha Navami) — Maha Aarti & Dhunuchi Dance</option>
            <option value="2026-10-19 (Bijoya Dashami)">Oct 19 (Bijoya Dashami) — Sindoor Khela & Immersion</option>
            <option value="2026-10-14 (Panchami Night)">Oct 14 (Panchami Night) — Early Bird Parikrama</option>
          </select>
        </div>

        {/* Calculated Output Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/80 to-amber-950/80 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
              Estimated Festive Fare
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-amber-400">
                ₹{calculatedFare.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">incl. Driver + Fuel</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-emerald-400 block font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 inline" /> 0 Surge
            </span>
            <span className="text-[10px] text-slate-400">Pay 25% to Lock</span>
          </div>
        </div>

        {/* Quick Book CTA */}
        <button
          onClick={() => onSelectAndBook(vehicleId, packageId)}
          className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
        >
          <span>Check Live Availability & Book</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center">
          <span className="text-[11px] text-slate-400">⚡ Over 82% slots booked for Saptami & Ashtami</span>
        </div>
      </div>
    </div>
  );
};

