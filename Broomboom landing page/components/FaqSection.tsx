"use client";

import React, { useState } from "react";
import { ChevronDown, PhoneCall, Sparkles } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const COMPACT_FAQS: FaqItem[] = [
  {
    question: "How does BroomBoom ensure zero surge pricing during Durga Puja?",
    answer:
      "Unlike standard on-demand apps with 2x-3x surge, your festive tariff is 100% fixed the moment you reserve. Fuel, dual AC usage, and chauffeur allowances are included upfront."
  },
  {
    question: "How does the 25% advance deposit work?",
    answer:
      "A 25% advance locks your vehicle and chauffeur. An official digital receipt is sent instantly on WhatsApp and auto-synced with the assigned driver's app to prevent on-trip billing confusion."
  },
  {
    question: "Can the chauffeur wait while our family visits pandals or stops for food?",
    answer:
      "Yes! Your cab and driver remain dedicated exclusively to your group for the full duration (e.g. 5 Hrs / 50 KMs, 8 Hrs / 80 KMs, or Midnight tour). Leave bags safely in the locked AC car."
  },
  {
    question: "What is the cancellation and refund policy?",
    answer:
      "Full 100% refund is processed within 24 hours if you cancel at least 24 hours prior to your scheduled pickup time."
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      id="faqs" 
      className="py-8 md:py-12 lg:py-10 bg-puja-yellow-subtle border-b border-amber-200 relative"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header */}
        <div className="text-center mb-8 lg:mb-6 space-y-1.5">
          <span className="px-3 py-0.5 rounded-full bg-amber-200/90 text-amber-950 border border-amber-300 text-[11px] font-black uppercase tracking-wider">
            ❓ Quick FAQs
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-festive text-slate-950">
            Frequently Asked <span className="text-yellow-gradient">Questions</span>
          </h2>
        </div>

        {/* Compact Accordion */}
        <div className="space-y-2.5 lg:space-y-2">
          {COMPACT_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-amber-200/90 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full py-3.5 lg:py-3 px-4 sm:px-5 text-left flex items-center justify-between gap-3 focus:outline-none hover:bg-amber-50/40 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-950 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-amber-400 text-slate-950" : ""
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-amber-100 bg-puja-cream/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Compact Help Pill */}
        <div className="mt-6 lg:mt-5 p-3 bg-white rounded-2xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-slate-700 font-medium">Need custom group booking or routes?</span>
          </div>
          <a
            href="tel:+919876543210"
            className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <PhoneCall className="w-3 h-3" />
            <span>+91 98765 43210</span>
          </a>
        </div>

      </div>
    </section>
  );
};