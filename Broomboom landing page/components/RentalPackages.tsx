"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, Navigation } from "lucide-react";
import { RENTAL_PACKAGES } from "@/data/packages";

// Custom Durga Maa Icon (Trishul / Trident)
const DurgaTrishulIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <path 
      d="M12 2V22M12 2L8 6M12 2L16 6M12 6L10 4M12 6L14 4M9 18H15M12 18V22" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

interface RentalPackagesProps {
  onActionClick?: (type: "book" | "explore", title: string) => void;
}

export const RentalPackages: React.FC<RentalPackagesProps> = ({ onActionClick }) => {
  // Single source of truth for the booking action
  const handleBook = (pkg: (typeof RENTAL_PACKAGES)[number]) => {
    try {
      sessionStorage.setItem("broomboom_active_package", pkg.id);
      sessionStorage.setItem("broomboom_selected_tour", pkg.title);
    } catch (e) {
      console.warn("Storage error", e);
    }
    if (onActionClick) {
      onActionClick("book", `Rental Package: ${pkg.title} (${pkg.id})`);
    } else {
      window.location.href = `/fleet?pkg=${pkg.id}`;
    }
  };

  // Keyboard support for the clickable card
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    pkg: (typeof RENTAL_PACKAGES)[number]
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleBook(pkg);
    }
  };

  return (
    <section
      id="rental-packages"
      className="py-8 md:py-16 lg:py-12 bg-white border-b border-amber-200 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-8 space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase tracking-wider">
            🏮 Curated Pandal Hopping Circuits
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-festive text-slate-950">
            Festive Rental <span className="text-yellow-gradient">Packages</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Choose your preferred hourly &amp; KM rental package with verified chauffeurs, chilled AC &amp; zero surge.
          </p>
        </div>

        {/* 4 Clean Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4 items-stretch">
          {RENTAL_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              role="button"
              tabIndex={0}
              aria-label={`Book ${pkg.title} rental package`}
              onClick={() => handleBook(pkg)}
              onKeyDown={(e) => handleKeyDown(e, pkg)}
              className="bg-puja-cream h-full rounded-3xl overflow-hidden border-2 border-amber-200/90 card-shadow flex flex-col justify-between group hover:border-amber-400 hover:shadow-lg active:scale-[0.99] transition-all p-4 lg:p-3.5 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            >
              {/* Top Content */}
              <div className="flex flex-col flex-1 space-y-2.5">
                
                {/* Highlight Text Above Package */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-md shadow-amber-500/30 border border-amber-300/50 flex items-center justify-center py-2 px-2.5">
                  <DurgaTrishulIcon className="w-4 h-4 text-slate-950 mr-1.5 shrink-0 animate-bounce" />
                  <div className="text-center drop-shadow-sm leading-tight">
                    <p className="text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wider">
                      Book at Your Preferred Time This Durga Puja
                    </p>
                    <p className="text-[10px] font-bold text-amber-950 mt-0.5">
                      Book Anytime • 24/7 Available
                    </p>
                  </div>
                  <DurgaTrishulIcon className="w-4 h-4 text-slate-950 ml-1.5 shrink-0 animate-bounce" />
                </div>

                {/* Image Banner */}
                <div className="relative h-36 w-full shrink-0 rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
                  <Image
                    src={pkg.image}
                    alt={pkg.imageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full shadow">
                      {pkg.badge}
                    </span>
                  </div>
                </div>

                {/* Subtitle */}
                <div className="space-y-1 flex-1">
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {pkg.subtitle}
                  </p>
                </div>

                {/* Prominent Package Highlights Strip */}
                <div className="shrink-0 p-2.5 lg:p-2 bg-white rounded-xl border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-black text-slate-950">
                    <span className="flex items-center gap-1 text-amber-900">
                      <Navigation className="w-3 h-3 text-amber-600" />
                      <span>{pkg.hoursKm}</span>
                    </span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded-md font-bold">
                      {pkg.rentalType}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 pt-1 border-t border-amber-100 space-y-1">
                    <p className="truncate">
                      <span className="font-semibold text-slate-700">Pandals: </span>
                      <span>{pkg.highlights.slice(0, 3).join(", ")} etc.</span>
                    </p>
                    <p className="text-[10px] font-bold text-amber-900 flex items-center gap-1.5 bg-amber-50/80 px-2 py-1 rounded-lg border border-amber-200/60 leading-tight">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                      <span>You can explore pandals as per your plan.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Actions & Highlights */}
              <div className="mt-3 shrink-0 space-y-2.5">
                <div className="pt-2.5 border-t border-amber-200/80">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBook(pkg);
                    }}
                    className="w-full btn-yellow-shimmer py-3 lg:py-2.5 px-4 lg:px-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md shadow-amber-400/30 hover:scale-102 transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer min-h-[44px] lg:min-h-[40px]"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>BOOK NOW</span>
                  </button>
                </div>

                {/* Highlight Text Below Package */}
                <div className="text-center bg-green-50 border border-green-200 rounded-xl p-2 shadow-sm">
                  <p className="text-[10px] font-black text-green-800 uppercase tracking-tight leading-tight">
                    100% Cab Guarantee, No Cancellation, Free Time and Free Date Modification
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};