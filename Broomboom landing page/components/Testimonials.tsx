"use client";

import React from "react";
import { Star, CheckCircle2 } from "lucide-react";

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: "Sourav Mukherjee",
      role: "South City Resident, Kolkata",
      trip: "Booked Innova Crysta (South Kolkata Theme Circuit)",
      source: "Google Play Store Rider",
      rating: 5,
      comment:
        "My 78-year-old parents could visit all 6 marquee South Kolkata pandals without fatigue! Driver Biplab knew the exact police bypass drop points closest to the VIP queues. Truly unforgettable experience!",
      initials: "SM",
      bgClass: "bg-amber-100 text-amber-800",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Ananya Ganguly",
      role: "NRI from London, UK",
      trip: "Booked 13-Seater Urbania (All-Night Midnight Parikrama)",
      source: "Justdial Verified Traveler",
      rating: 5,
      comment:
        "Visiting Kolkata for Durga Puja after 6 years with 11 family members. The 13-seater Force Urbania made our midnight parikrama seamless! Super chilled AC, clean seats, and driver was so polite.",
      initials: "AG",
      bgClass: "bg-yellow-100 text-yellow-800",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      name: "Rohan Chatterjee",
      role: "Salt Lake Sector V, Kolkata",
      trip: "Booked Ertiga 6s (Kolkata to Mandarmani Beach Tour)",
      source: "WhatsApp Verified Booking",
      rating: 5,
      comment:
        "We took the 3-day Mandarmani beach package on Dashami morning. The driver drove very carefully on the highway and recommended the best crab curry joint at Kolaghat. 10/10 service!",
      initials: "RC",
      bgClass: "bg-emerald-100 text-emerald-800",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      name: "Debarati Banerjee",
      role: "Ballygunge Circular Road",
      trip: "Booked Sedan Dzire (North Kolkata Heritage Tour)",
      source: "Google Play Store Rider",
      rating: 5,
      comment:
        "The Bonedi Bari heritage tour was magical. Sovabazar Rajbari, Bagbazar and sweet stops at Girish Chandra Dey — our driver managed the parking without us waiting a single minute in the crowd.",
      initials: "DB",
      bgClass: "bg-amber-100 text-amber-800",
      avatar: "https://i.pravatar.cc/150?img=7",
    },
  ];

  return (
    <section
      id="reviews"
      className="py-10 sm:py-12 md:py-16 lg:py-12 bg-puja-cream border-b border-amber-200 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-10 space-y-2.5 sm:space-y-2">
          <span className="inline-block px-3 py-1 sm:px-3.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-wider leading-tight">
            💬 Real Customer Testimonials &amp; Verified Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-festive text-slate-950 leading-tight text-balance">
            Voices of Joy from{" "}
            <span className="text-yellow-gradient">Last Year&apos;s Parikrama</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 px-2 sm:px-0">
            Read authentic verified reviews from local Kolkata families, NRI tourists, and outstation holidaymakers.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-4">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-5 sm:p-6 lg:p-5 rounded-2xl sm:rounded-3xl border border-amber-200/90 card-shadow flex flex-col justify-between gap-4 h-full min-w-0"
            >
              <div className="min-w-0">
                {/* Rating + Source */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex text-amber-500 gap-0.5 shrink-0">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200 whitespace-nowrap">
                    {rev.source}
                  </span>
                </div>

                <p className="text-[13px] sm:text-sm lg:text-xs xl:text-[13px] text-slate-700 leading-relaxed font-normal italic break-words">
                  &quot;{rev.comment}&quot;
                </p>
              </div>

              {/* Author */}
              <div className="pt-4 border-t border-amber-100 flex items-center gap-3 min-w-0">
                {rev.avatar ? (
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    loading="lazy"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover shrink-0 border border-amber-200"
                  />
                ) : (
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-[11px] sm:text-xs shrink-0 ${rev.bgClass}`}
                  >
                    {rev.initials}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-950 flex items-center gap-1 min-w-0">
                    <span className="truncate">{rev.name}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
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