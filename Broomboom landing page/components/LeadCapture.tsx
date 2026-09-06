"use client";

import React, { useState } from "react";
import { Zap, CheckCircle2 } from "lucide-react";

export const LeadCapture: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      alert("Please enter a valid 10-digit mobile number for instant quote.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-t border-amber-500/30 relative">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
          ⚡ 5-Minute Instant Callback
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-festive text-white mt-3 mb-2">
          Have a Specific Route or Custom Group Requirement?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-8">
          Leave your contact below — our Durga Puja Travel Desk will call you back with customized itineraries and exclusive group discounts.
        </p>

        {submitted ? (
          <div className="max-w-md mx-auto p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div className="text-left text-xs">
              <strong className="block text-white text-sm">Thank You {name || "Guest"}!</strong>
              Our Puja Specialist is calling {phone} in under 5 minutes.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="flex-1 px-4 py-3.5 bg-slate-950/90 border border-amber-500/30 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <input
              type="tel"
              placeholder="10-Digit Mobile / WhatsApp Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="flex-1 px-4 py-3.5 bg-slate-950/90 border border-amber-500/30 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl hover:scale-105 transition-all shadow-lg shadow-amber-500/30 whitespace-nowrap flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Request Fast Quote</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

