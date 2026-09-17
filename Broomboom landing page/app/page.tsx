"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { TrustedMetrics } from "@/components/TrustedMetrics";
import { RentalPackages } from "@/components/RentalPackages";
import { OutstationRoutes } from "@/components/OutstationRoutes";
import { GallerySection } from "@/components/GallerySection";
import { Testimonials } from "@/components/Testimonials";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { LoginModal } from "@/components/LoginModal";
import { BookingModal } from "@/components/BookingModal";
import { ThankYouModal } from "@/components/ThankYouModal";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { ConfirmedBooking } from "@/types";

export default function Home() {
  // Logged-in user state (persisted in sessionStorage)
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string; email?: string } | null>(null);

  // Login popup state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeActionContext, setActiveActionContext] = useState<{
    type: "book" | "explore";
    title: string;
  } | null>(null);

  // Full Booking engine & Confirmation states (opened after login if booking)
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [thankYouModalOpen, setThankYouModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);

  // Sync user from sessionStorage on mount
  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem("broomboom_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.name && parsed?.name !== "Guest Traveler" && parsed?.phone) {
          setCurrentUser(parsed);
        }
      }
    } catch (e) {
      console.warn("Storage load error", e);
    }
  }, []);

  const handleLogout = useCallback(() => {
    try {
      sessionStorage.removeItem("broomboom_user");
    } catch (_) {}
    setCurrentUser(null);
  }, []);

  // Central routing helper based on the selected package or outstation tour
  const proceedToDestination = useCallback((title: string) => {
    // 1. Save current active selection to session storage
    try {
      if (title) {
        sessionStorage.setItem("broomboom_selected_tour", title);
      }
    } catch (e) {
      console.warn("Storage error", e);
    }

    // 2. Check if Outstation route was selected
    const outstationDestinations = [
      "Digha",
      "Mayapur",
      "Mandarmani",
      "Bolpur-Shantiniketan",
      "Bolpur",
      "Dhanbad",
      "Durgapur",
      "Murshidabad",
      "Ranchi",
    ];

    const matchedDestination = outstationDestinations.find((city) =>
      title.toLowerCase().includes(city.toLowerCase())
    );

    if (matchedDestination || title.toLowerCase().includes("outstation") || title.includes(" to ")) {
      const destination = matchedDestination || title.split(" to ")[1]?.split(/[\s—\(\)]+/)[0] || "Digha";
      window.location.href = `/outstation-fleet?toCity=${encodeURIComponent(destination)}`;
      return;
    }

    // 3. Check if specific Rental Package was selected
    let targetPkg = "";
    const pkgIdMatch = title.match(/pkg_[a-z0-9_]+/i);
    if (pkgIdMatch) {
      targetPkg = pkgIdMatch[0];
    } else if (title.includes("South Kolkata Mega Theme") || title.includes("12hr")) {
      targetPkg = "pkg_12hr_120km";
    } else if (title.includes("North Kolkata Heritage") || title.includes("8hr")) {
      targetPkg = "pkg_8hr_80km";
    } else if (title.includes("Midnight") || title.includes("midnight")) {
      targetPkg = "pkg_midnight_8hr";
    } else if (title.includes("5-Day") || title.includes("5day")) {
      targetPkg = "pkg_5day_vip";
    } else {
      try {
        const savedPkg = sessionStorage.getItem("broomboom_active_package");
        if (savedPkg) targetPkg = savedPkg;
      } catch (_) {}
    }

    if (targetPkg) {
      try {
        sessionStorage.setItem("broomboom_active_package", targetPkg);
      } catch (_) {}
      window.location.href = `/fleet?pkg=${targetPkg}`;
      return;
    }

    // 4. Default redirect to Fleet / Car Selection page
    window.location.href = "/fleet";
  }, []);

  // Triggered on ANY "Book" or "Explore" button on the entire homepage
  const handleActionClick = (type: "book" | "explore", title: string) => {
    // Check if user is already logged in (state or sessionStorage)
    let user = currentUser;
    if (!user) {
      try {
        const savedUser = sessionStorage.getItem("broomboom_user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed?.name && parsed?.name !== "Guest Traveler" && parsed?.phone) {
            user = parsed;
            setCurrentUser(parsed);
          }
        }
      } catch (_) {}
    }

    if (user && user.name && user.name !== "Guest Traveler") {
      // User is already logged in once -> never ask for login again!
      proceedToDestination(title);
      return;
    }

    // Not yet logged in -> open login modal
    setActiveActionContext({ type, title });
    setLoginModalOpen(true);
  };

  // Called when user submits Name, Phone, Email in the Login popup -> Saves and Redirects
  const handleLoginSuccess = (userData: { name: string; phone: string; email: string }) => {
    setCurrentUser(userData);
    setLoginModalOpen(false);
    const title = activeActionContext?.title || "";
    proceedToDestination(title);
  };

  const handleBookingConfirmed = (booking: ConfirmedBooking) => {
    setConfirmedBooking(booking);
    setBookingModalOpen(false);
    setThankYouModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-puja-cream text-slate-900 relative pb-20 lg:pb-0">
      {/* 1. Sticky Festive Navbar */}
      <Navbar onActionClick={handleActionClick} currentUser={currentUser} onLogout={handleLogout} />

      {/* 2. Banner (Hero) */}
      <Hero onActionClick={handleActionClick} />

      {/* 3. About Section */}
      <AboutSection onActionClick={handleActionClick} />


      {/* 5. Rental Package (All Packages show Book button) */}
      <RentalPackages onActionClick={handleActionClick} />

      {/* 6. Explore Outstation From Kolkata (All 8 Routes with Explore button) */}
      <OutstationRoutes onActionClick={handleActionClick} />

      {/* 4. Trusted Reviews & Metrics */}
      <TrustedMetrics />

      {/* 7. Images / Festive Moments Showcase */}
      <GallerySection />

      {/* 8. Customer Testimonials & Reviews */}
      <Testimonials />

      {/* 9. FAQs Section */}
      <FaqSection />

      {/* 10. Footer */}
      <Footer onActionClick={handleActionClick} />

      {/* LOGIN POPUP MODAL (Name, Phone Number, Email ID) */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        actionContext={activeActionContext}
        onSuccess={handleLoginSuccess}
      />

      {/* Interactive Booking Customizer (Date, Pickup, VIP pass, Mishti box) */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onBookingConfirmed={handleBookingConfirmed}
      />

      {/* Festive Thank You Screen */}
      <ThankYouModal
        booking={confirmedBooking}
        onClose={() => setThankYouModalOpen(false)}
      />

      {/* Sticky Mobile Bottom CTA Bar */}
      <StickyMobileBar onActionClick={handleActionClick} />
    </main>
  );
}