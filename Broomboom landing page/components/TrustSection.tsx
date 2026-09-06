import React from "react";
import { Compass, CircleDollarSign, HeartHandshake } from "lucide-react";

export const TrustSection: React.FC = () => {
  return (
    <section id="trust" className="py-20 bg-slate-950 border-t border-amber-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            🛡️ The BroomBoom Cabs Promise
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-festive text-white">
            Why Over 14,800+ Families <span className="text-gold-gradient">Trust Us Every Pujo</span>
          </h2>
          <p className="text-sm text-slate-300">
            We treat every passenger like family. Experience the warmth of authentic Bengali hospitality combined with military-grade route logistics.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 glow-card space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Pandal Alley Masters</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our drivers have 5+ years of Kolkata Puja night-driving experience. They know every police one-way restriction, diversion, and shortcut alleyway from Shyambazar to Gariahat.
            </p>
            <ul className="text-xs text-amber-300/90 space-y-1">
              <li>✓ Real-time traffic diversion updates</li>
              <li>✓ Strategic pickup points away from crowds</li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-red-500/20 glow-card space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <CircleDollarSign className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Zero Surge & 0 Cancellation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Once your booking advance is paid, your tariff is locked. Unlike app-based surge aggregators that cancel during peak Saptami/Ashtami hours, our car is 100% dedicated to you.
            </p>
            <ul className="text-xs text-red-300/90 space-y-1">
              <li>✓ Backup emergency fleet on standby</li>
              <li>✓ 100% refund if cancelled 24 hrs prior</li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/20 glow-card space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Bengali Festive Hospitality</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step into a car filled with festive cheer. Complimentary packaged mineral water, wet wipes, large umbrellas for rain contingencies, and a complimentary Mishti box.
            </p>
            <ul className="text-xs text-emerald-300/90 space-y-1">
              <li>✓ Family & women safety SOS support</li>
              <li>✓ 24/7 central emergency desk</li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};

