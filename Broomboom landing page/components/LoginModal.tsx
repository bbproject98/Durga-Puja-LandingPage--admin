"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, User, Phone, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { submitLead } from "@/lib/api";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionContext?: {
    type: "book" | "explore";
    title: string;
    itemDetails?: string;
  } | null;
  onSuccess: (userData: { name: string; phone: string; email: string }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  actionContext,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto pre-fill if user has previously filled their details
  useEffect(() => {
    if (isOpen) {
      try {
        const savedUser = localStorage.getItem("broomboom_user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed.name && parsed.name !== "Guest Traveler") setName(parsed.name);
          if (parsed.phone && parsed.phone !== "+91 9876543210") setPhone(parsed.phone);
          if (parsed.email && parsed.email !== "guest@example.com") setEmail(parsed.email);
        }
      } catch (_) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    const userData = { name: name.trim(), phone: phone.trim(), email: email.trim() };

    // 1. Post to Express + Prisma Backend
    try {
      submitLead({
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        context: actionContext?.title || "General Request",
        action: actionContext?.type || "book",
      });
    } catch (err) {
      console.warn("API submit error", err);
    }

    // 2. Save to localStorage fallback
    try {
      localStorage.setItem("broomboom_user", JSON.stringify(userData));
      const leads = JSON.parse(localStorage.getItem("broomboom_leads") || "[]");
      leads.push({
        ...userData,
        context: actionContext?.title || "General Request",
        action: actionContext?.type || "book",
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("broomboom_leads", JSON.stringify(leads));
    } catch (err) {
      console.warn("Storage error", err);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      onSuccess(userData);
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl border-2 border-amber-300 shadow-2xl overflow-hidden relative card-shadow my-auto sm:my-8">
        
        {/* Festive Yellow Top Header Banner */}
        <div className="alpana-yellow-top bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 p-4 sm:p-6 text-slate-950 relative">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-amber-900 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1.5 sm:mb-2 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Durga Puja 2026 Special</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold font-royal text-slate-950">
            {actionContext?.type === "explore" ? "Explore Exclusive Fare" : "Instant Booking & Quote"}
          </h3>
          <p className="text-xs text-amber-950/80 mt-1 font-medium">
            {actionContext?.title
              ? `Selected: ${actionContext.title}`
              : "Enter your details to unlock early bird festival pricing."}
          </p>
        </div>

        {/* Modal Form */}
        <div className="p-4 sm:p-6 md:p-7 space-y-4 bg-puja-cream">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Details Saved!</h4>
              <p className="text-xs text-slate-600">
                Welcome, <strong>{name}</strong>! Redirecting to your confirmed booking details...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sourav Mukherjee"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>Phone Number (WhatsApp)</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  ✓ Booking slip & driver tracking will be sent on this number
                </span>
              </div>

              {/* Email ID */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>Email ID</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. sourav@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full btn-yellow-shimmer py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 active:scale-95 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-400/30 transition-all flex items-center justify-center gap-2 mt-2 min-h-[48px]"
              >
                <span>Continue & Unlock Rates</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Privacy Protected • Zero Spam</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

