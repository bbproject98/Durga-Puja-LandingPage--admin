import React from "react";
import { Clock, Utensils, Sun, ArrowRight, Sparkles } from "lucide-react";
import { PACKAGES_DATA } from "@/data/packages";

interface PandalPackagesProps {
  onOpenBooking: (vehicleId: string, packageId: string) => void;
}

export const PandalPackages: React.FC<PandalPackagesProps> = ({ onOpenBooking }) => {
  const pandalPackages = Object.values(PACKAGES_DATA).filter((p) => p.type === "pandal");

  return (
    <section id="packages" className="py-20 bg-slate-950 border-t border-amber-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            🏮 Handcrafted Circuits
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-festive text-white">
            Curated <span className="text-gold-gradient">Pandal Hopping Packages</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Designed by Kolkata locals to save you 3-4 hours of traffic gridlock with optimized entry points, sweet tasting stops, and comfortable rest intervals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {pandalPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="glass-panel rounded-2xl p-6 md:p-8 border border-amber-500/20 glow-card flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-full">
                    {pkg.badge}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> {pkg.duration}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white font-festive mb-1">{pkg.title}</h3>
                <p className="text-xs text-amber-200/80 mb-5">{pkg.subtitle}</p>

                <div className="mb-5 bg-slate-900/60 p-4 rounded-xl border border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block mb-2">
                    Featured Pandal Stops
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.highlights.map((h, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-800/80 border border-white/10 rounded-lg text-xs text-slate-200 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-red-400" />
                        <span>{h}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mb-6 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <Utensils className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Food & Refreshment:</strong> {pkg.foodStop}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sun className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Optimal Slot:</strong> {pkg.bestTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block">Package Starting from</span>
                  <span className="text-xl font-bold text-amber-400">
                    ₹{Math.round(2499 * (pkg.pricingMultiplier || 1)).toLocaleString()}{" "}
                    <span className="text-xs text-slate-400 font-normal">(Sedan 4s)</span>
                  </span>
                </div>
                <button
                  onClick={() => onOpenBooking("suv_7", pkg.id)}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-700/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Book This Itinerary</span>
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

