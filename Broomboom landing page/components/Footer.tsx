"use client";

import React from "react";
import {
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

interface FooterProps {
  onActionClick: (type: "book" | "explore", title: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onActionClick }) => {
  return (
    <footer
      id="footer"
      className="bg-slate-950 text-white border-t-2 border-amber-500 pt-8 pb-6 md:pt-16 md:pb-12 lg:pt-12 lg:pb-8 text-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= BRAND + FOOTER LINKS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-8 pb-12 lg:pb-8 border-b border-amber-800/40">

          {/* ================= BRAND INFO ================= */}
          <div className="space-y-4 lg:space-y-3 md:col-span-1">

            {/* Logo + Puja Branding */}
            <div className="flex items-center gap-3">

              {/* Round BroomBoom Logo */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden shrink-0 shadow-md shadow-amber-500/30">
                <img
                  src="/images/broomboom-logo.png"
                  alt="BroomBoom Cabs"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.tried) {
                      target.dataset.tried = "true";
                      target.src = "/images/Broomboom-logo.png";
                    }
                  }}
                />
              </div>

              {/* Puja Text */}
              <div className="flex flex-col justify-center">

                <span className="px-2 py-0.5 w-fit text-[8px] sm:text-[9px] font-black bg-amber-400 text-slate-950 rounded border border-amber-300/60 tracking-wide">
                  PUJA 2026
                </span>

                <p className="text-[8px] sm:text-[10px] text-amber-400/80 tracking-widest uppercase font-semibold mt-1">
                  Kolkata Durga Puja Travel
                </p>

              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Kolkata’s premier Durga Puja car rental and pandal hopping
              chauffeur service by BroomBoom Cabs. Dedicated to joyful, safe,
              and stress-free festive journeys.
            </p>

            {/* Festive Message */}
            <div className="p-3 bg-amber-900/20 rounded-xl border border-amber-700/60 text-amber-200 font-festive text-sm font-bold">
              🌸 &quot;Maa Aschhen, Ghurchhe Kolkata with BroomBoom!&quot;
            </div>
          </div>

          {/* ================= OUTSTATION ROUTES ================= */}
          <div>
            <h4 className="text-sm font-bold text-amber-400 mb-4 lg:mb-3 uppercase tracking-wider">
              Explore Outstations
            </h4>

            <ul className="space-y-2 lg:space-y-1.5 font-medium text-slate-300">

              <li>
                <button
                  onClick={() =>
                    onActionClick("explore", "Kolkata to Digha")
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • Kolkata to Digha
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick("explore", "Kolkata to Mayapur")
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • Kolkata to Mayapur
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick("explore", "Kolkata to Mandarmani")
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • Kolkata to Mandarmani
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick(
                      "explore",
                      "Kolkata to Bolpur-Shantiniketan"
                    )
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • Kolkata to Bolpur-Shantiniketan
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick("explore", "Kolkata to Dhanbad")
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • Kolkata to Dhanbad
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick("explore", "Kolkata to Durgapur")
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • Kolkata to Durgapur
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick("explore", "Kolkata to Murshidabad")
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • Kolkata to Murshidabad
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick("explore", "Kolkata to Ranchi")
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • Kolkata to Ranchi
                </button>
              </li>

            </ul>
          </div>

          {/* ================= RENTAL PACKAGES ================= */}
          <div>
            <h4 className="text-sm font-bold text-amber-400 mb-4 lg:mb-3 uppercase tracking-wider">
              Rental Packages
            </h4>

            <ul className="space-y-2 lg:space-y-1.5 font-medium text-slate-300">

              <li>
                <button
                  onClick={() =>
                    onActionClick(
                      "book",
                      "North Kolkata Heritage Circuit"
                    )
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • North Kolkata Heritage &amp; Bonedi Bari
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick(
                      "book",
                      "South Kolkata Mega Theme Extravaganza"
                    )
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • South Kolkata Mega Theme Circuit
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick(
                      "book",
                      "All-Night Midnight Puja Parikrama"
                    )
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • All-Night Midnight Parikrama (10 PM - 6 AM)
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick(
                      "book",
                      "5-Day All-Inclusive VIP Chauffeur Pass"
                    )
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • 5-Day All-Inclusive VIP Chauffeur Pass
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick("book", "Sedan 4-Seater Rental")
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • Sedan (4 Seater) — Dzire / Etios
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick("book", "SUV 6-7 Seater Rental")
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • SUV &amp; SUV+ (6 &amp; 7 Seaters)
                </button>
              </li>

              <li>
                <button
                  onClick={() =>
                    onActionClick("book", "Tempo Traveller Rental")
                  }
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  • Tempo Traveller (13, 15, 17s)
                </button>
              </li>

            </ul>
          </div>

          {/* ================= CONTROL ROOM ================= */}
          <div>
            <h4 className="text-sm font-bold text-amber-400 mb-4 lg:mb-3 uppercase tracking-wider">
              24x7 Puja Control Room
            </h4>

            <ul className="space-y-3 lg:space-y-2 font-medium text-slate-300">

              {/* Phone */}
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />

                <div>
                  <span className="text-white font-bold block">
                    +91 8240765499
                  </span>

                  <span className="text-xs text-slate-400">
                    Direct Helpline &amp; WhatsApp
                  </span>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />

                <span className="text-slate-300">
                  support@broomboomcabs.com
                </span>
              </li>

              {/* Location */}
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />

                <span className="text-slate-300">
                  Hubs: Salt Lake Sector V | Southern Avenue | Kolkata Airport
                  CCU
                </span>
              </li>

            </ul>
          </div>

        </div>

        {/* ================= COPYRIGHT ================= */}
        <div className="pt-8 lg:pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">

          <div>
            © 2026 BroomBoom Cabs Kolkata. All Rights Reserved. Shubho
            Sharodiya!
          </div>

          <div className="flex items-center gap-6">

            <a
              href="http://broomboomcabs.com/user-terms"
              className="hover:text-amber-300 transition-colors"
            >
              Terms of Service
            </a>

            <a
              href="http://broomboomcabs.com/privacy-policy"
              className="hover:text-amber-300 transition-colors"
            >
              Privacy Policy
            </a>

            <a
              href="http://broomboomcabs.com/user-terms"
              className="hover:text-amber-300 transition-colors"
            >
              Refund Policy
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
};