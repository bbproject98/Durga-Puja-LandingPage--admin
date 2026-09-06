"use client";

import React from "react";
import { Star, Quote, CheckCircle2, Smartphone, MapPin, Award } from "lucide-react";

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: "Sourav Mukherjee",
      role: "South City Resident, Kolkata",
      trip: "Booked Innova Crysta (South Kolkata Theme Circuit)",
      source: "Google Play Store Rider",
      sourceIcon: "play",
      rating: 5,
      comment:
        "My 78-year-old parents could visit all 6 marquee South Kolkata pandals without fatigue! Driver Biplab knew the exact police bypass drop points closest to the VIP queues. Truly unforgettable experience!",
      initials: "SM",
      bgClass: "bg-amber-100 text-amber-800"
    },
    {
      name: "Ananya Ganguly",
      role: "NRI from London, UK",
      trip: "Booked 13-Seater Urbania (All-Night Midnight Parikrama)",
      source: "Justdial Verified Traveler",
      sourceIcon: "directory",
      rating: 5,
      comment:
        "Visiting Kolkata for Durga Puja after 6 years with 11 family members. The 13-seater Force Urbania made our midnight parikrama seamless! Super chilled AC, clean seats, and driver was so polite.",
      initials: "AG",
      bgClass: "bg-yellow-100 text-yellow-800"
    },
    {
      name: "Rohan Chatterjee",
      role: "Salt Lake Sector V, Kolkata",
      trip: "Booked Ertiga 6s (Kolkata to Mandarmani Beach Tour)",
      source: "WhatsApp Verified Booking",
      sourceIcon: "direct",
      rating: 5,
      comment:
        "We took the 3-day Mandarmani beach package on Dashami morning. The driver drove very carefully on the highway and recommended the best crab curry joint at Kolaghat. 10/10 service!",
      initials: "RC",
      bgClass: "bg-emerald-100 text-emerald-800"
    },
    {
      name: "Debarati Banerjee",
      role: "Ballygunge Circular Road",
      trip: "Booked Sedan Dzire (North Kolkata Heritage Tour)",
      source: "Google Play Store Rider",
      sourceIcon: "play",
      rating: 5,
      comment:
        "The Bonedi Bari heritage tour was magical. Sovabazar Rajbari, Bagbazar and sweet stops at Girish Chandra Dey — our driver managed the parking without us waiting a single minute in the crowd.",
      initials: "DB",
      bgClass: "bg-amber-100 text-amber-800"
    }
  ];

  return (
    <section 
      id="reviews" 
      className="py-8 md:py-16 lg:py-12 bg-puja-cream border-b border-amber-200 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-10 space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase tracking-wider">
            💬 Real Customer Testimonials &amp; Verified Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-festive text-slate-950">
            Voices of Joy from <span className="text-yellow-gradient">Last Year&apos;s Parikrama</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Read authentic verified reviews from local Kolkata families, NRI tourists, and outstation holidaymakers.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-6 lg:p-5 rounded-3xl border border-amber-200/90 card-shadow flex flex-col justify-between space-y-4 relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-500 text-xs gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                    {rev.source}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal italic">
                  &quot;{rev.comment}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-amber-100 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs flex-shrink-0 ${rev.bgClass}`}
                >
                  {rev.initials}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-950 truncate flex items-center gap-1">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                  </h4>
                  <div className="text-[10px] text-slate-500 truncate">{rev.role}</div>
                  <div className="text-[9px] font-semibold text-amber-700 truncate mt-0.5">
                    {rev.trip}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};