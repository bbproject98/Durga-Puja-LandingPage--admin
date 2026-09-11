"use client";

import React from "react";
import {
  Star,
  CheckCircle2,
  Clock,
  Headphones,
  FileText,
  BadgeCheck,
} from "lucide-react";

// Google Play Store Triangle Icon
const GooglePlayIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"
      fill="#EA4335"
    />
    <path
      d="M47 38.6c-5.8 8.4-9.3 19-9.3 31.6v371.6c0 12.6 3.5 23.2 9.3 31.6l239.3-237.4L47 38.6z"
      fill="#4285F4"
    />
    <path
      d="M325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z"
      fill="#34A853"
    />
    <path
      d="M471.1 236.4l-85.7-49.2-60.1 68.8 60.1 60.1 85.7-49.2c16.3-9.3 24.3-24.6 24.3-30.2 0-5.7-8-21-24.3-30.5z"
      fill="#FBBC04"
    />
  </svg>
);

// Justdial Badge Icon
const JustdialIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="48" height="48" rx="10" fill="#0076D7" />
    <path
      d="M17.5 12h5.5v19c0 3.6-2.5 6-6.5 6-3.8 0-6.2-2.2-6.5-5.5h5c.2 1.2 1 1.8 1.8 1.8 1.1 0 1.7-.8 1.7-2.3V12z"
      fill="#FFFFFF"
    />
    <path
      d="M36 12v24h-5.2v-2.8c-1.2 2-3.4 3.2-6.2 3.2-5.3 0-8.6-4.2-8.6-10.2 0-6.1 3.5-10.2 8.6-10.2 2.7 0 4.9 1.1 6.2 3.1V12H36zm-5.2 14.2c0-3.7-2.1-6.1-5.2-6.1-3 0-5.1 2.4-5.1 6.1s2.1 6.1 5.1 6.1c3.1 0 5.2-2.4 5.2-6.1z"
      fill="#FF6A00"
    />
  </svg>
);

// Durga Puja Parikrama / Trishul & Diya Icon
const DurgaPujaIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 2v19M9 5c0 3.5 1.5 5.5 3 5.5s3-2 3-5.5"
      stroke="#D97706"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 7c.5 4.5 3 7 6 7s5.5-2.5 6-7"
      stroke="#DC2626"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 19c1.5 2 4.5 3 8 3s6.5-1 8-3H4z"
      fill="#F59E0B"
      stroke="#D97706"
      strokeWidth="1.5"
    />
    <circle cx="12" cy="16" r="1.5" fill="#DC2626" />
  </svg>
);

export const TrustedMetrics: React.FC = () => {
  return (
    <section 
      id="trust" 
      className="hidden md:block py-16 lg:py-12 bg-puja-yellow-subtle border-b border-amber-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-10 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-amber-200/90 text-amber-950 border border-amber-300 text-xs font-black uppercase tracking-wider">
            ⭐ Factual Ratings &amp; Platform Trust Breakdown
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-festive text-slate-950">
            Trusted by <span className="text-yellow-gradient">Over 15,000+ Riders</span> Across Bengal
          </h2>
          <p className="text-sm text-slate-600 font-normal">
            Real performance ratings aggregated across Google Play Store, Justdial, and local Kolkata customer feedback desks.
          </p>
        </div>

        {/* 3 Major Platform Rating Cards */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-4 mb-10 lg:mb-8">
          
          {/* Card 1: Google Play Store */}
          <div className="p-6 lg:p-5 bg-white rounded-3xl border-2 border-amber-200 card-shadow space-y-3 text-center sm:text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                    <GooglePlayIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950">Google Play Store</h4>
                    <span className="text-[11px] text-slate-500">Android Rider &amp; Pilot App</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  Verified App
                </span>
              </div>

              <div className="flex items-baseline gap-2 my-2">
                <span className="text-3xl font-black text-slate-950">4.1</span>
                <div className="flex text-amber-400 text-xs gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">(10,000+ Downloads)</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Rated for quick cab booking, live GPS driver tracking, and affordable one-way outstation drops across West Bengal.
              </p>
            </div>

            <div className="pt-3 border-t border-amber-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Dedicated BroomBoom Pilot Driver Verification</span>
            </div>
          </div>

          {/* Card 2: Justdial */}
          <div className="p-6 lg:p-5 bg-white rounded-3xl border-2 border-amber-200 card-shadow space-y-3 text-center sm:text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-1.5">
                    <JustdialIcon className="w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950">Justdial</h4>
                    <span className="text-[11px] text-slate-500">Kolkata Travel Directory</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                  4.2 ★ Top Pick
                </span>
              </div>

              <div className="flex items-baseline gap-2 my-2">
                <span className="text-3xl font-black text-slate-950">4.2</span>
                <div className="flex text-amber-400 text-xs gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">(500+ Local Reviews)</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                High satisfaction reported for pre-scheduled airport transfers, Digha/Mandarmani roundtrips, and joint family festive rentals.
              </p>
            </div>

            <div className="pt-3 border-t border-amber-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>99.8% On-Time Scheduled Arrival</span>
            </div>
          </div>

          {/* Card 3: Durga Puja Parikrama Satisfaction */}
          <div className="p-6 lg:p-5 bg-white rounded-3xl border-2 border-amber-200 card-shadow space-y-3 text-center sm:text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 shadow-sm">
                    <DurgaPujaIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950">Puja Parikrama Desk</h4>
                    <span className="text-[11px] text-slate-500">Sharodutsav Fleet Desk</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                  Zero Surge
                </span>
              </div>

              <div className="flex items-baseline gap-2 my-2">
                <span className="text-3xl font-black text-slate-950">4.9</span>
                <div className="flex text-amber-400 text-xs gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">(15,000+ Festive Families)</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Celebrated for senior-friendly drop points, respectful uniformed chauffeurs, and dedicated midnight pandal navigation.
              </p>
            </div>

            <div className="pt-3 border-t border-amber-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Guaranteed Reserved Vehicle</span>
            </div>
          </div>

        </div>

        {/* The BroomBoom Transparency Shield */}
        <div className="p-8 lg:p-6 bg-white rounded-3xl border-2 border-amber-300 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 lg:pb-4 mb-6 lg:mb-4 border-b border-amber-100">
            <div>
              <span className="text-xs font-black text-amber-800 uppercase tracking-widest block mb-1">
                🛡️ Customer Service Guarantee
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-festive text-slate-950">
                The BroomBoom Transparency Shield
              </h3>
            </div>
            <div className="text-xs text-slate-500 font-medium bg-puja-cream px-4 py-2 rounded-xl border border-amber-200 shrink-0">
              Directly addressing customer feedback &amp; ensuring 100% peace of mind
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            
            {/* Feature 1: Advance Security */}
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-950">100% Advance Sync</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Your 20% advance deposit is digitally synced instantly with the assigned driver&apos;s app &amp; sent on WhatsApp. Zero on-trip billing confusion.
              </p>
            </div>

            {/* Feature 2: Standby Fleet */}
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-950">Zero Last-Minute Cancellation</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Backup reserve vehicles on standby across Salt Lake, Southern Avenue &amp; Airport to eliminate last-minute driver drops.
              </p>
            </div>

            {/* Feature 3: Direct Human Support */}
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Headphones className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-950">24/7 Human Helpline</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Direct hotline to Kolkata operations managers (+91 8240765499). No automated bots or long waiting times when you need support.
              </p>
            </div>

            {/* Feature 4: Fast Refund Policy */}
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-950">Instant 24-Hr Refund</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Full 100% refund processed within 24 hours if you cancel up to 24 hours prior to pickup time. Straightforward &amp; hassle-free.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};