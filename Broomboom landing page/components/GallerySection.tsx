"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles, X, MapPin } from "lucide-react";

export const GallerySection: React.FC = () => {
  const images = [
    {
      src: "/images/south-indian-temple-pandal.jpg",
      caption: "Majestic South Indian Temple Theme Pandal",
      category: "Temple Art",
      clubName: "South Indian Temple Pandal kolkata durga puja",
      alt: "south-indian-temple-pandal-durga-puja-broomboom-cabs",
      description: "A stunning recreation of a traditional South Indian temple gopuram, adorned with vibrant colors and intricate sculptures of deities. This pandal brings the divine grandeur of Southern temple architecture to the heart of Kolkata's Durga Puja celebrations.",
    },
    {
      src: "/images/solay.jpg",
      caption: "Iconic 'Sholay' Movie Theme Pandal - Kolkata Puja Special",
      category: "Theme Pandal",
      clubName: "Simla Sporting Club kolkata durga puja",
      alt: "simla-sporting-club-durga-puja-broomboom-cabs",
      description: "Step into the retro world of Bollywood's iconic classic 'Sholay' at this stunning Durga Puja pandal. A visual tribute to Gabbar, Jai, and Veeru that movie buffs simply cannot miss!",
    },
    {
      src: "/images/golden-pandal.jpg",
      caption: "Grand Illuminated Golden Pandal - Mesmerizing Night View",
      category: "Grand Illumination",
      clubName: "Sreebhumi Sporting Club kolkata durga puja",
      alt: "sreebhumi-sporting-club-durga-puja-broomboom-cabs",
      description: "Witness the breathtaking grandeur of Kolkata's Durga Puja with this stunningly illuminated golden pandal. The intricate architecture and mesmerizing lights create a magical festive atmosphere that draws thousands of visitors every night.",
    },
    {
      src: "/images/durga-idol.jpg",
      caption: "Divine Durga Idol - Artistic Brilliance of Sharodutsav",
      category: "Idol Art",
      clubName: "Mudiali Club kolkata durga puja",
      alt: "mudiali-club-durga-puja-broomboom-cabs",
      description: "Feast your eyes on the breathtaking craftsmanship of Maa Durga's idol. With intricate detailing, vibrant colors, and a majestic aura, this artistic masterpiece perfectly captures the spiritual essence of Kolkata's Durga Puja.",
    },
    {
      src: "/images/lalabagan-nabankur.jpg",
      caption: "Eco-Friendly 'Nabankur' Pandal - A Mini Forest in the City",
      category: "Eco-Friendly Pandal",
      clubName: "Lalabagan Nabankur kolkata durga puja",
      alt: "lalabagan-nabankur-durga-puja-broomboom-cabs",
      description: "Celebrating its 65th year with a sustainable theme, this pandal is a breathtaking 'greenhouse' of over 8,000 living plants. Designed by artist Prasanta Pal, the theme 'Nabankur' (new life) beautifully symbolizes growth and environmental awareness, creating a lush, breathing forest in the heart of North Kolkata.",
    },
    {
      src: "/images/66-pally-kerala-temple.jpg",
      caption: "Kerala Temple Theme Pandal - A Grand South Indian Welcome",
      category: "Temple Architecture",
      clubName: "66 Pally kolkata durga puja",
      alt: "66-pally-durga-puja-broomboom-cabs",
      description: "Step through a magnificent red gateway inspired by traditional Kerala temple architecture. This iconic South Kolkata pandal recreates the grandeur of a Kannur temple, complete with massive stone lamps and towering headgears reminiscent of Theyyam regalia. A must-visit for lovers of authentic South Indian art and culture.",
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
                alt={item.alt} // Uses the custom alt tag
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="inline-block px-3 py-0.5 sm:px-4 sm:py-1 bg-[#fbbf24] text-slate-950 rounded-full text-[10px] sm:text-xs font-extrabold border border-amber-200/60 shadow-sm">
                  {item.category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {/* Display dynamically formatted Club Name */}
                  <span>{item.clubName}</span>
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
                  alt={selectedImage.alt} // Uses the custom alt tag
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
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-300/30" />
                  {/* Display dynamically formatted Club Name in Modal */}
                  <span className="tracking-wide">{selectedImage.clubName}</span>
                </div>

                {/* DYNAMIC DESCRIPTION HERE */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedImage.description}
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