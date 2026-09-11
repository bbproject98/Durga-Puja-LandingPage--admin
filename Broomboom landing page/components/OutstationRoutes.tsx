"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navigation, Clock, Check, ArrowRight, Compass, ShieldCheck } from "lucide-react";
import { OUTSTATION_ROUTES } from "@/data/packages";

interface OutstationRoutesProps {
  onActionClick?: (type: "book" | "explore", title: string) => void;
}

export const OutstationRoutes: React.FC<OutstationRoutesProps> = ({ onActionClick }) => {
  const router = useRouter();

  const handleExploreClick = (routeTitle: string) => {
    const destination = routeTitle.split(" to ")[1] || "Digha";

    try {
      localStorage.setItem("broomboom_selected_outstation", routeTitle);
      localStorage.setItem("broomboom_selected_tour", `Outstation: ${routeTitle}`);
    } catch (e) {
      console.warn("Storage error", e);
    }
    
    if (onActionClick) {
      onActionClick("explore", `Outstation: ${routeTitle}`);
    } else {
      router.push(`/outstation-fleet?toCity=${encodeURIComponent(destination)}`);
    }
  };

  return (
    <section 
      id="outstation" 
      className="py-8 md:py-16 lg:py-12 bg-puja-yellow-subtle border-b border-amber-200 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-10">
          <div>
            <span className="px-3.5 py-1 rounded-full bg-amber-200/90 text-amber-950 border border-amber-300 text-xs font-black uppercase tracking-wider">
              🌊 Pujor Chhuti Outstation Getaways
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-festive text-slate-950 mt-2">
              Explore Outstation <span className="text-yellow-gradient">From Kolkata</span>
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl font-normal">
              Escape the city rush for a peaceful festive holiday across Bengal, Jharkhand &amp; Odisha with roundtrip sanitised cabs.
            </p>
          </div>

          <div className="text-xs text-amber-900 font-bold bg-white px-4 py-2.5 rounded-2xl border border-amber-300 shadow-sm flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Highway Fastag Tolls &amp; Driver Allowance Included</span>
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4">
          {OUTSTATION_ROUTES.map((route) => (
            <div
              key={route.id}
              onClick={(e) => {
                // If the click originated inside a button, let the button handle it
                if (e.target instanceof HTMLElement && e.target.closest("button")) return;
                // Otherwise, trigger the card's primary button
                e.currentTarget.querySelector("button")?.click();
              }}
              className="bg-white rounded-3xl overflow-hidden border border-amber-200/90 card-shadow flex flex-col justify-between group hover:border-amber-400 transition-all cursor-pointer"
            >
              <div>
                {/* Route Image Banner */}
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <Image
                    src={route.image}
                    alt={route.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-400 text-slate-950 rounded-full shadow">
                      {route.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white font-semibold">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-amber-400" /> {route.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> {route.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 lg:p-4 space-y-3 lg:space-y-2">
                  <div>
                    <h4 className="text-lg font-black text-slate-950 group-hover:text-amber-600 transition-colors">
                      {route.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium line-clamp-1">
                      {route.popularStops}
                    </p>
                  </div>

                  {/* Highlights List */}
                  <ul className="space-y-1 text-xs text-slate-600 font-medium">
                    {route.routeHighlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5 truncate">
                        <Check className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span className="truncate">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom EXPLORE Button */}
              <div className="p-4 lg:p-3 bg-puja-cream border-t border-amber-100">
                <button
                  onClick={() => handleExploreClick(route.title)}
                  className="w-full py-3 lg:py-2.5 px-4 lg:px-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-yellow-600 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-sm hover:scale-102 transition-all flex items-center justify-center gap-2 uppercase tracking-wider min-h-[44px] lg:min-h-[40px]"
                >
                  <span>Explore Route &amp; Fleet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};