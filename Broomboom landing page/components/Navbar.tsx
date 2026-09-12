"use client";

import React, { useState } from "react";
import { Zap, Menu, X, User, LogOut } from "lucide-react";

interface NavbarProps {
  onActionClick: (type: "book" | "explore", title: string) => void;
  currentUser?: { name: string; phone: string; email?: string } | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onActionClick, currentUser, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-amber-200 shadow-sm backdrop-blur-md">

      {/* Top Festive Announcement Bar */}
      <div className="alpana-yellow-top bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 py-1.5 px-3 text-center text-[11px] sm:text-xs font-bold text-slate-950 flex items-center justify-center gap-1.5 sm:gap-3 shadow-inner">

        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-black bg-red-600 text-white uppercase tracking-wider animate-pulse">
          🌸 Puja 2026 Special
        </span>

        <span className="truncate">
          ⚡ Flat ₹1,000 OFF on 3-Day &amp; 5-Day Passes!
        </span>

        <button
          onClick={() =>
            onActionClick("explore", "Early Bird Special Offer")
          }
          className="underline hover:text-red-700 font-extrabold hidden sm:inline ml-1"
        >
          Claim Offer &rarr;
        </button>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">

        {/* BroomBoom Image Only */}
         <a
            href="#"
            className="flex items-center gap-3 sm:gap-4 group shrink-0"
            aria-label="BroomBoom Cabs Home"
          >
            {/* Round Logo */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden shrink-0">
              <img
                src="/images/Broomboom-logo.png"
                alt="BroomBoom Cabs"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Puja Information */}
            <div className="flex flex-col justify-center">
              <span className="px-2 py-0.5 w-fit text-[8px] sm:text-[10px] font-black bg-amber-400 text-slate-950 rounded border border-amber-500/40 tracking-wide">
                PUJA 2026
              </span>

              <p className="text-[9px] sm:text-[11px] text-slate-500 tracking-widest uppercase font-semibold mt-1">
                Kolkata Durga Puja Travel
              </p>
            </div>
          </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-700">

          <a
            href="#banner"
            className="hover:text-amber-600 transition-colors"
          >
            Home
          </a>

          <a
            href="#rental-packages"
            className="hover:text-amber-600 transition-colors"
          >
            Rental Packages
          </a>

          <a
            href="#outstation"
            className="hover:text-amber-600 transition-colors"
          >
            Outstation
          </a>

          <a
            href="#about"
            className="hover:text-amber-600 transition-colors"
          >
            About
          </a>

          <a
            href="#reviews"
            className="hover:text-amber-600 transition-colors"
          >
            Reviews
          </a>

          <a
            href="#footer"
            className="hover:text-amber-600 transition-colors"
          >
            Contact
          </a>

        </nav>

        {/* Desktop Book Button & User Status */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-300/80 rounded-xl px-3 py-1.5 text-xs text-slate-800 shadow-sm">
              <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-slate-500 font-medium leading-none">Logged In</span>
                <span className="font-bold text-slate-950 truncate max-w-[120px] leading-tight">{currentUser.name}</span>
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Logout / Change Account"
                  className="ml-1 text-[10px] text-amber-800 hover:text-red-600 font-bold underline cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
          )}

          <button
            onClick={() =>
              onActionClick("book", "Main Navigation Booking")
            }
            className="
              btn-yellow-shimmer
              px-6
              py-2.5
              bg-gradient-to-r
              from-amber-400
              via-amber-500
              to-yellow-500
              hover:from-amber-500
              hover:to-yellow-600
              text-slate-950
              font-black
              text-xs
              rounded-xl
              shadow-md
              shadow-amber-400/30
              hover:scale-105
              transition-all
              flex
              items-center
              gap-1.5
            "
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />

            <span>
              Book Now
            </span>
          </button>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="
            lg:hidden
            p-2
            text-slate-700
            hover:text-amber-600
            focus:outline-none
            touch-manipulation
          "
          aria-label="Toggle Menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-amber-200 px-5 py-4 space-y-2 shadow-xl animate-fadeIn">

          {/* Home */}
          <a
            href="#banner"
            onClick={() => setMobileMenuOpen(false)}
            className="
              block
              text-sm
              font-bold
              text-slate-800
              hover:text-amber-600
              py-2
              px-2.5
              rounded-lg
              hover:bg-amber-50
              transition-colors
            "
          >
            🏠 Home
          </a>

          {/* Rental Packages */}
          <a
            href="#rental-packages"
            onClick={() => setMobileMenuOpen(false)}
            className="
              block
              text-sm
              font-bold
              text-slate-800
              hover:text-amber-600
              py-2
              px-2.5
              rounded-lg
              hover:bg-amber-50
              transition-colors
            "
          >
            🏮 Rental Packages
          </a>

          {/* Outstation */}
          <a
            href="#outstation"
            onClick={() => setMobileMenuOpen(false)}
            className="
              block
              text-sm
              font-bold
              text-slate-800
              hover:text-amber-600
              py-2
              px-2.5
              rounded-lg
              hover:bg-amber-50
              transition-colors
            "
          >
            🌊 Outstation Routes
          </a>

          {/* About */}
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="
              block
              text-sm
              font-bold
              text-slate-800
              hover:text-amber-600
              py-2
              px-2.5
              rounded-lg
              hover:bg-amber-50
              transition-colors
            "
          >
            🌸 About Service
          </a>

          {/* Reviews */}
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="
              block
              text-sm
              font-bold
              text-slate-800
              hover:text-amber-600
              py-2
              px-2.5
              rounded-lg
              hover:bg-amber-50
              transition-colors
            "
          >
            ⭐ Reviews &amp; Ratings
          </a>

          {/* Contact */}
          <a
            href="#footer"
            onClick={() => setMobileMenuOpen(false)}
            className="
              block
              text-sm
              font-bold
              text-slate-800
              hover:text-amber-600
              py-2
              px-2.5
              rounded-lg
              hover:bg-amber-50
              transition-colors
            "
          >
            📞 Contact &amp; Helpline
          </a>

          {/* Mobile User Status & Book Button */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {currentUser && (
              <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-slate-800">
                <div className="flex items-center gap-2 truncate">
                  <User className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-500 block leading-tight">Logged in as</span>
                    <span className="font-bold text-slate-900 truncate block">{currentUser.name}</span>
                  </div>
                </div>
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="text-[11px] text-amber-800 hover:text-red-600 font-bold underline shrink-0 px-2 py-1"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onActionClick("book", "Mobile Nav Booking");
              }}
              className="
                w-full
                py-3
                bg-gradient-to-r
                from-amber-400
                to-amber-500
                text-slate-950
                font-black
                text-xs
                rounded-xl
                text-center
                shadow
                active:scale-98
                transition-all
              "
            >
              Book Cab Now
            </button>

          </div>

        </div>
      )}

    </header>
  );
};