"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, X } from "lucide-react";

export const GallerySection: React.FC = () => {
  const images = [
    {
      src: "/images/durga-puja-2026-broomboom-cabs.jpg",
      caption: "BroomBoom Iconic Yellow Cab & Pandal Hopping Trail",
      category: "BroomBoom Special",
    },
    {
      src: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
      caption: "Sedan Fleet for Heritage Bonedi Bari Parikrama",
      category: "Fleet Comfort",
    },
    {
      src: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      caption: "South Kolkata Theme Pandals Illumination Tour",
      category: "Theme Art",
    },
    {
      src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      caption: "VIP Innova Crysta for Senior-Citizen Puja Visit",
      category: "Luxury Travel",
    },
    {
      src: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      caption: "Force Urbania 13-Seater Joint Family Midnight Tour",
      category: "Group Tour",
    },
    {
      src: "/images/digha.jpg",
      caption: "Kolkata to Digha Festive Beach Holiday Drive",
      category: "Outstation Trip",
    },
  ];

  // State for popup
  const [selectedImage, setSelectedImage] = useState<typeof images[0] | null>(null);
  const closeModal = () => setSelectedImage(null);

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
              className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden border-2 border-amber-200 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedImage(item)} // Open popup on click
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

        {/* ========== POPUP / MODAL ========== */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
            onClick={closeModal}
          >
            <div
              className="relative w-full max-w-[calc(100%-1rem)] sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto bg-white rounded-2xl overflow-hidden shadow-2xl border border-amber-200/60 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative top bar */}
              <div className="h-1.5 bg-gradient-to-r from-amber-400 via-red-500 to-amber-300" />

              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 z-20 p-1 rounded-full bg-black/40 text-white hover:bg-amber-600 hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20"
                aria-label="Close popup"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Image */}
              <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gradient-to-b from-amber-50/50 to-white/80">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.caption}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 500px"
                />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 space-y-2 bg-white border-t border-amber-100">
                <h3 className="text-base sm:text-xl md:text-2xl font-extrabold text-slate-900 leading-tight break-words">
                  {selectedImage.caption}
                </h3>

                <div className="flex items-center gap-2 text-amber-600 text-xs sm:text-sm font-bold">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-300/30" />
                  <span className="tracking-wide">Kolkata Sharodutsav</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Explore the best of Durga Puja with BroomBoom's premium fleet and local expertise.
                  Book your ride for a hassle‑free festival experience.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="inline-block px-3 py-0.5 sm:px-4 sm:py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] sm:text-xs font-bold border border-amber-200/60 shadow-sm">
                    {selectedImage.category}
                  </span>
                  <span className="h-3 w-px bg-amber-200" />
                  <span className="text-[10px] sm:text-xs text-amber-600 font-medium">✨ Puja 2026</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};