"use client";

import React from "react";
import { MessageCircle, Zap } from "lucide-react";

interface StickyMobileBarProps {
  onActionClick: (type: "book" | "explore", title: string) => void;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({ onActionClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/98 border-t-2 border-amber-400 px-4 pt-2.5 pb-safe shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
      <div className="pl-1">
        <span className="text-[10px] text-amber-950 block uppercase font-black tracking-tight">
          🪔 Kolkata Durga Puja Cabs
        </span>
        <span className="text-[11px] font-bold text-slate-700">Chilled Dual AC • Zero Surge</span>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="https://wa.me/8240765499?text=Hi%20BroomBoom%20Cabs,%20I%20want%20to%20book%20a%20cab%20for%20Durga%20Puja."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Support"
          className="w-11 h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl flex items-center justify-center shadow transition-all"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
        <button
          onClick={() => onActionClick("book", "Sticky Mobile Bar Booking")}
          className="btn-yellow-shimmer min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Zap className="w-3.5 h-3.5 fill-slate-950" />
          <span>Book Now</span>
        </button>
      </div>
    </div>
  );
};
