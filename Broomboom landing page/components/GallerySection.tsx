"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export const GallerySection: React.FC = () => {
  const images = [
    {
      src: "/images/durga-puja-banner.jpg",
      caption: "BroomBoom Iconic Yellow Cab & Pandal Hopping Trail",
      category: "BroomBoom Special"
    },
    {
      src: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
      caption: "Sedan Fleet for Heritage Bonedi Bari Parikrama",
      category: "Fleet Comfort"
    },
    {
      src: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      caption: "South Kolkata Theme Pandals Illumination Tour",
      category: "Theme Art"
    },
    {
      src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      caption: "VIP Innova Crysta for Senior-Citizen Puja Visit",
      category: "Luxury Travel"
    },
    {
      src: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      caption: "Force Urbania 13-Seater Joint Family Midnight Tour",
      category: "Group Tour"
    },
    {
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      caption: "Kolkata to Digha Festive Beach Holiday Drive",
      category: "Outstation Trip"
    }
  ];

  return (
    <section 
      id="gallery" 
      className="py-8 md:py-16 lg:py-12 bg-white border-b border-amber-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-10 space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase tracking-wider">
            📸 Festive Moments &amp; Fleet
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-festive text-slate-950">
            Capturing the <span className="text-yellow-gradient">Spirit of Durga Puja</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            A glimpse into the magical pandal trails, night lights, and comfortable journeys experienced by BroomBoom riders.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-4">
          {images.map((item, idx) => (
            <div
              key={idx}
              className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden border-2 border-amber-200 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={item.src}
                alt={item.caption}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/90 text-amber-950 rounded-full shadow">
                  {item.category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kolkata Sharodutsav</span>
                </div>
                <h4 className="text-sm font-bold text-slate-100 leading-snug">
                  {item.caption}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};