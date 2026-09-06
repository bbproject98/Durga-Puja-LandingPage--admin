"use client";

import React from "react";
import { Sparkles, Heart, Users, MapPin, Clock, ShieldCheck, ArrowRight } from "lucide-react";

interface AboutSectionProps {
  onActionClick: (type: "book" | "explore", title: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onActionClick }) => {
  return (
    <section 
      id="about" 
      className="hidden md:block py-16 lg:py-12 bg-white border-b border-amber-100 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-10 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase tracking-wider">
            🌸 About BroomBoom Cabs Puja Special
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-festive text-slate-950">
            Kolkata Durga Puja, <span className="text-yellow-gradient">Celebrated Your Way</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Durga Puja in Kolkata is the world&apos;s greatest open-air cultural carnival. BroomBoom Cabs eliminates the exhausting walk, unpredictable traffic diversions, and overcrowded public transit so your entire family can celebrate in peaceful comfort.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4">
          
          <div className="p-6 lg:p-5 bg-puja-cream rounded-3xl border border-amber-200/80 card-shadow space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950">Senior-Citizen Friendly</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Close-proximity drop-off points coordinated with Kolkata Police barricades to minimize walking for elderly family members and children.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-amber-700">✓ Folding wheelchair support</div>
          </div>

          <div className="p-6 lg:p-5 bg-puja-cream rounded-3xl border border-amber-200/80 card-shadow space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold text-xl mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950">All-Night Midnight Hopping</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Experience the golden 10:00 PM to 06:00 AM window when city roads clear up and majestic Chandannagar illumination gates sparkle.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-amber-700">✓ Dedicated night chauffeurs</div>
          </div>

          <div className="p-6 lg:p-5 bg-puja-cream rounded-3xl border border-amber-200/80 card-shadow space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950">Heritage Bonedi Bari Tours</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Exclusive routes through 200+ year-old aristocratic Rajbaris — Sovabazar, Jorasanko, and Hatkhola Dutta traditional rituals.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-amber-700">✓ Authentic heritage circuits</div>
          </div>

          <div className="p-6 lg:p-5 bg-puja-cream rounded-3xl border border-amber-200/80 card-shadow space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold text-xl mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950">100% Fixed Festive Rates</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                Zero surge pricing during Saptami, Ashtami, and Navami rush. Your tariff is locked the moment you confirm your advance.
              </p>
            </div>
            <div className="pt-2 text-xs font-bold text-amber-700">✓ 0 cancellation guarantee</div>
          </div>

        </div>

        {/* About Bottom Callout */}
        <div className="mt-12 lg:mt-10 p-6 sm:p-8 lg:p-6 rounded-3xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 border border-amber-300/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center flex-shrink-0 font-bold shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-950">
                Planning a Joint Family or Para Club Pandal Hopping Tour?
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                We provide 13, 15, and 17-seater luxury Force Urbania Tempo Travellers with luggage bays and panoramic windows.
              </p>
            </div>
          </div>
          <button
            onClick={() => onActionClick("book", "About Section Large Fleet Request")}
            className="w-full md:w-auto px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl transition-all shadow whitespace-nowrap flex items-center justify-center gap-2"
          >
            <span>Book Large Group Fleet</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </section>
  );
};