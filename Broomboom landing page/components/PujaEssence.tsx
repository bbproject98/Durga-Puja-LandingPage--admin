import React from "react";
import { UserCheck, Moon, Landmark, Ticket } from "lucide-react";

export const PujaEssence: React.FC = () => {
  return (
    <section id="intro" className="py-20 bg-slate-950/80 border-y border-amber-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            🪔 Kolkata's Timeless Grandeur
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-festive text-white">
            Kolkata-r Pujo, <span className="text-gold-gradient">Apnar Moto Kore</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Durga Puja in Kolkata is not just a festival — it is the world's greatest open-air art carnival. We take away the fatigue of endless walking, humid crowds, and congested parking so you can soak in every beat of the *Dhak*.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 glow-card space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Senior-Citizen Friendly</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Close-proximity drop-off points coordinated with local police barricades, minimizing walking distance for elderly parents and children.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 glow-card space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <Moon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Midnight Parikrama</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experience the magical 10 PM to 6 AM window when Kolkata's dazzling LED light gates shine bright with zero traffic bottlenecks.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 glow-card space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Bonedi Bari Heritage</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exclusive routes through 200+ year-old aristocratic Rajbaris — Sovabazar, Jorasanko, and Hatkhola Dutta traditional rituals.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 glow-card space-y-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">VIP Fast-Track Pass</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bypass 2-hour general queues at top South & North Kolkata marquee pandals with our concierge VIP pass assistance.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

