"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Sparkles,
    Car,
    ShieldCheck,
    ArrowRight,
    Zap,
    CheckCircle2,
    Clock,
    Ticket,
    BadgeCheck,
    Compass,
    MapPin,
    Users,
    Star,
    Calendar,
    Route,
    Award,
    Clock as ClockIcon,
    Map,
    ChevronRight,
     Receipt  
} from "lucide-react";

interface HeroProps {
    onActionClick: (type: "book" | "explore", title: string) => void;
    whatsappNumber?: string;
}

export const Hero: React.FC<HeroProps> = ({
    onActionClick,
    whatsappNumber = "+918240765499",
}) => {
    const [selectedVehicle, setSelectedVehicle] = useState("SUV (6 Seater)");
    const [selectedRoute, setSelectedRoute] = useState("South Kolkata Mega Theme Circuit");

    // Rental Packages (Puja Tours) – kept for desktop use
    const rentalPackages = [
        {
            id: 1,
            title: "South Kolkata Mega Theme Circuit",
            duration: "10–12 Hrs",
            icon: MapPin,
            description: "Covers top South Kolkata pandals with themed decorations & grand idols.",
            bg: "from-amber-50 to-orange-50",
            border: "border-amber-200",
        },
        {
            id: 2,
            title: "North Kolkata Heritage & Bonedi Bari",
            duration: "8–10 Hrs",
            icon: Compass,
            description: "Explore old Kolkata's heritage pandals & traditional Bonedi Bari pujas.",
            bg: "from-amber-50 to-yellow-50",
            border: "border-yellow-200",
        },
        {
            id: 3,
            title: "VIP Midnight Puja Parikrama",
            duration: "10 PM – 6 AM",
            icon: ClockIcon,
            description: "Night-long parikrama covering the most exclusive midnight aartis.",
            bg: "from-indigo-50 to-purple-50",
            border: "border-indigo-200",
        },
        {
            id: 4,
            title: "5-Day All-Inclusive VIP Chauffeur",
            duration: "5 Days",
            icon: Award,
            description: "Dedicated chauffeur + AC cab for all 5 days of Durga Puja festivities.",
            bg: "from-emerald-50 to-teal-50",
            border: "border-emerald-200",
        },
    ];

    // Outstation Packages – kept for desktop use
    const outstationPackages = [
        { id: 1, title: "Kolkata to Digha", route: "Coastal Getaway", icon: Car },
        { id: 2, title: "Kolkata to Mayapur", route: "Spiritual Tour", icon: Car },
        { id: 3, title: "Kolkata to Mandarmani", route: "Beach Escape", icon: Car },
        { id: 4, title: "Kolkata to Bolpur-Shantiniketan", route: "Cultural Retreat", icon: Car },
        { id: 5, title: "Kolkata to Dhanbad", route: "Coal City Express", icon: Car },
        { id: 6, title: "Kolkata to Durgapur", route: "Industrial Hub", icon: Car },
        { id: 7, title: "Kolkata to Murshidabad", route: "Nawab Heritage", icon: Car },
        { id: 8, title: "Kolkata to Ranchi", route: "Hill Town Drive", icon: Car },
    ];

    return (
        <>
            <section
                id="banner"
                className="relative pt-1 pb-4 md:pt-4 md:pb-16 bg-puja-gradient-hero border-b border-amber-200/80 overflow-hidden bg-yellow-dots"
            >
                {/* Ambient background glows */}
                <div className="absolute top-0 right-10 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-96 h-96 bg-yellow-400/15 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* TOP BADGES – hidden on mobile, visible on lg+ */}
                    <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:justify-between lg:gap-3 mb-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-amber-300 shadow-sm text-xs font-bold text-amber-900">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Kolkata Durga Puja 2026 • BroomBoom Special Chauffeur Rental</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white/90 px-3.5 py-1.5 rounded-full border border-amber-200 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                            <span>
                                ⭐ <strong>4.9/5 Rating</strong> (15,000+ Kolkata Families Served)
                            </span>
                        </div>
                    </div>

                    {/* Main 2-Column Grid */}
                    <div className="grid lg:grid-cols-12 gap-4 lg:gap-10 items-start lg:items-center">
                        {/* ====== LEFT COLUMN ====== */}
                        <div className="lg:col-span-6 space-y-2 md:space-y-4 text-center lg:text-left">
                            <h1 className="font-festive text-2xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black text-slate-950 leading-snug tracking-tight text-balance">
                                <span className="block">Celebrate Durga Puja</span>
                                <span className="block text-yellow-gradient">2026 With BroomBoom Cabs</span>
                            </h1>

                            <p className="text-[11px] sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Experience the magic of Kolkata Durga Puja with premium{" "}
                                <strong className="font-semibold text-slate-900">
                                    car rental and outstation cab packages
                                </strong>{" "}
                                designed to make your festive season stress-free. Whether you are
                                navigating the city&apos;s radiant streets or embarking on a long
                                weekend escape, BroomBoom Cabs offers seamless,{" "}
                                <strong className="font-semibold text-slate-900">
                                    100% fixed-rate travel
                                </strong>{" "}
                                across West Bengal and beyond.
                            </p>

                            {/* VALUE PROPS – hidden on mobile, visible on lg+ */}
                                <div className="hidden lg:inline-grid lg:grid-cols-2 gap-2 pt-1 text-xs font-semibold text-slate-700">
                                    <span className="px-3 py-1.5 bg-white border border-amber-200 rounded-xl shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                                        <Car className="w-4 h-4 text-amber-600" /> 4 to 17 Seaters (Sedan, SUV, Urbania)
                                    </span>
                                    <span className="px-3 py-1.5 bg-white border border-amber-200 rounded-xl shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Zero Surge Guarantee
                                    </span>
                                    <span className="px-3 py-1.5 bg-white border border-amber-200 rounded-xl shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                                        <Receipt className="w-4 h-4 text-amber-600" /> Transparent Billing System
                                    </span>
                                    <span className="px-3 py-1.5 bg-white border border-amber-200 rounded-xl shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                                        <CheckCircle2 className="w-4 h-4 text-amber-600" /> Senior-Friendly Drop Points
                                    </span>
                                </div>

                            {/* Action Buttons – Single row on mobile */}
                            <div className="pt-0 sm:pt-1 flex flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 w-full">
                                <button
                                    onClick={() => onActionClick("book", "Banner Primary Book Button")}
                                    className="flex-1 sm:flex-none min-h-[42px] sm:min-h-[48px] btn-yellow-shimmer px-3 sm:px-8 py-2.5 sm:py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-md shadow-amber-400/30 active:scale-98 transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
                                >
                                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950 shrink-0" />
                                    <span className="hidden sm:inline">Book Festive Cab Now</span>
                                    <span className="sm:hidden">Book Cab Now</span>
                                </button>
                                <a
                                    href="#outstation"
                                    className="flex-1 sm:flex-none min-h-[42px] sm:min-h-[48px] px-3 sm:px-6 py-2.5 sm:py-3.5 bg-white hover:bg-amber-50 border-2 border-amber-400/90 text-amber-900 font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-sm active:scale-98 transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
                                >
                                    <span className="hidden sm:inline">Explore 12 Outstation Routes</span>
                                    <span className="sm:hidden">12 Outstation Routes</span>
                                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                                </a>
                            </div>

                            {/* MOBILE ONLY: Rating display directly after the Action Buttons */}
                            <div className="lg:hidden rounded-xl border border-amber-200 bg-white p-1.5 shadow-sm text-left mt-0">
                                <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-lg border border-amber-100 bg-amber-50/50 py-1">
                                    {/* App Store */}
                                    <div className="flex min-w-0 items-center justify-center gap-1 px-1">
                                        <div className="h-3.5 w-3.5 shrink-0">
                                            <svg viewBox="0 0 48 48" className="h-full w-full">
                                                <rect width="48" height="48" rx="9" fill="#08A9E6" />
                                                <path
                                                    d="M25.4 10.2c.2 2.2-.7 4.3-2.1 5.8-1.4 1.5-3.5 2.4-5.6 2.2-.2-2.1.7-4.2 2.1-5.7 1.4-1.5 3.5-2.4 5.6-2.3Z"
                                                    fill="white"
                                                />
                                                <path
                                                    d="M30.1 25.2c0-3.5 2.9-5.2 3-5.3-1.6-2.4-4.2-2.7-5.1-2.8-2.2-.2-4.3 1.3-5.4 1.3-1.1 0-2.8-1.3-4.6-1.3-2.4 0-4.6 1.4-5.8 3.6-2.5 4.3-.6 10.7 1.8 14.2 1.2 1.7 2.6 3.6 4.5 3.5 1.8-.1 2.5-1.1 4.7-1.1s2.8 1.1 4.7 1.1c2-.1 3.2-1.8 4.4-3.5 1.4-2 2-3.9 2-4-.1 0-4.2-1.6-4.2-5.7Z"
                                                    fill="white"
                                                />
                                            </svg>
                                        </div>
                                        <div className="min-w-0 leading-tight">
                                            <div className="truncate text-[8.5px] font-bold text-slate-900">App Store</div>
                                            <div className="whitespace-nowrap text-[7.5px] font-semibold tracking-tighter text-amber-500">
                                                ★★★★★ <span className="font-normal tracking-normal text-slate-500">4.2K</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Google */}
                                    <div className="flex min-w-0 items-center justify-center gap-1 px-1">
                                        <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center font-sans text-[10px] font-bold text-[#4285F4]">
                                            G
                                        </div>
                                        <div className="min-w-0 leading-tight">
                                            <div className="truncate text-[8.5px] font-bold text-slate-900">Google</div>
                                            <div className="whitespace-nowrap text-[7.5px] font-semibold tracking-tighter text-amber-500">
                                                ★★★★★ <span className="font-normal tracking-normal text-slate-500">6.1K</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Play Store */}
                                    <div className="flex min-w-0 items-center justify-center gap-1 px-1">
                                        <div className="h-3.5 w-3.5 shrink-0">
                                            <svg viewBox="0 0 48 48" className="h-full w-full">
                                                <path d="M6 5.5c-.7.8-1 2-1 3.6v29.8c0 1.6.3 2.8 1 3.6L27.2 24 6 5.5Z" fill="#00D639" />
                                                <path d="M27.2 24 6 5.5c.7-.8 1.8-.9 3.1-.2l25 14.2L27.2 24Z" fill="#00A8FF" />
                                                <path d="M27.2 24 6 42.5c.7.8 1.8.9 3.1.2l25-14.2L27.2 24Z" fill="#FFCF00" />
                                                <path d="m34.1 19.5-6.9 4.5 6.9 4.5 7.2-4.1c1.9-1.1 1.9-3 0-4.1l-7.2-4.1Z" fill="#FF3B30" />
                                            </svg>
                                        </div>
                                        <div className="min-w-0 leading-tight">
                                            <div className="truncate text-[8.5px] font-bold text-slate-900">Play Store</div>
                                            <div className="whitespace-nowrap text-[7.5px] font-semibold tracking-tighter text-amber-500">
                                                ★★★★★ <span className="font-normal tracking-normal text-slate-500">15.5K</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MOBILE ONLY: Feature Pills – now directly after rating */}
                            <div className="lg:hidden grid grid-cols-3 gap-1.5 pt-0">
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-1 py-2 px-1 rounded-xl bg-white border border-amber-200/90 shadow-sm text-slate-800 active:scale-95 transition-all text-center min-w-0"
                                >
                                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <span className="text-[10px] font-bold tracking-tight truncate">24/7 Service</span>
                                </button>

                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-1 py-2 px-1 rounded-xl bg-white border border-amber-200/90 shadow-sm text-slate-800 active:scale-95 transition-all text-center min-w-0"
                                >
                                    <Ticket className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <span className="text-[10px] font-bold tracking-tight truncate">VIP Pass</span>
                                </button>

                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-1 py-2 px-1 rounded-xl bg-white border border-amber-200/90 shadow-sm text-slate-800 active:scale-95 transition-all text-center min-w-0"
                                >
                                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span className="text-[10px] font-bold tracking-tight truncate">100% Cab Guarantee</span>
                                </button>
                            </div>

                            {/* INCLUSIONS – hidden on mobile, visible on lg+ */}
                            <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:justify-start gap-4 pt-1 text-xs text-slate-600 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-amber-600" /> Free 24h Cancellation
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-amber-600" /> VIP Pandal Pass Concierge
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-amber-600" /> 24/7 Human Helpline
                                </div>
                            </div>
                        </div>

                        {/* ====== RIGHT COLUMN ====== */}
                        <div className="lg:col-span-6 space-y-2.5 sm:space-y-4">
                            {/* DESKTOP ONLY: Banner Artwork */}
                            <div className="hidden lg:block relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-300 shadow-lg sm:shadow-2xl card-shadow group">
                                <div className="relative aspect-[4/3] sm:aspect-[16/10] md:h-72 w-full bg-slate-900">
                                    <Image
                                        src="/images/durga-puja-2026-broomboom-cabs.jpg"
                                        alt="durga-puja-2026-broomboom-cabs"
                                        fill
                                        priority
                                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                        sizes="50vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-black/10 to-black/20" />

                                    <div className="absolute top-3 left-3">
                                        <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full shadow flex items-center gap-1">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span>BroomBoom Pujo Special</span>
                                        </span>
                                    </div>

                                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-amber-300 font-bold border border-amber-400/40 shadow">
                                        🪔 Kolkata Sharodutsav
                                    </div>

                                    <div className="absolute bottom-3 left-4 right-4 text-white">
                                        <p className="text-sm md:text-base font-bold text-amber-300 font-festive leading-tight">
                                            Heritage Pandal Hopping with Iconic Kolkata Cabs
                                        </p>
                                        <p className="text-[11px] text-slate-200 mt-0.5">
                                            Chilled Dual AC • Verified Route Chauffeurs • Senior Citizen Friendly Drops
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* DESKTOP ONLY: Quick Booking Card */}
                            <div className="hidden lg:block bg-white rounded-2xl p-3 sm:p-4 md:p-5 border border-amber-200 shadow-md card-shadow space-y-2.5 sm:space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                    <div>
                                        <label className="text-[10px] sm:text-[11px] font-bold text-slate-700 mb-1 block">
                                            1. Vehicle Category
                                        </label>
                                        <select
                                            value={selectedVehicle}
                                            onChange={(e) => setSelectedVehicle(e.target.value)}
                                            className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-puja-cream border border-amber-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                                        >
                                            <option value="Sedan (4 Seater)">Sedan (4s) — Dzire / Etios</option>
                                            <option value="SUV (6 Seater)">SUV (6s) — Ertiga / Carens</option>
                                            <option value="SUV+ (7 Seater)">SUV+ (7s) — Innova Crysta</option>
                                            <option value="Tempo Traveller (13s)">Tempo Traveller (13s Urbania)</option>
                                            <option value="Tempo Traveller (17s)">Tempo Traveller (17s Grand)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] sm:text-[11px] font-bold text-slate-700 mb-1 block">
                                            2. Tour / Outstation Route
                                        </label>
                                        <select
                                            value={selectedRoute}
                                            onChange={(e) => setSelectedRoute(e.target.value)}
                                            className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-puja-cream border border-amber-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                                        >
                                            <option value="South Kolkata Mega Theme Circuit">South Kolkata Mega Theme (10-12 Hrs)</option>
                                            <option value="North Kolkata Heritage & Bonedi Bari">North Kolkata Heritage (8-10 Hrs)</option>
                                            <option value="VIP Midnight Puja Parikrama">Midnight Parikrama (10 PM - 6 AM)</option>
                                            <option value="5-Day All-Inclusive VIP Chauffeur">5-Day All-Inclusive VIP Chauffeur</option>
                                            <option value="Kolkata to Digha">Outstation: Kolkata to Digha</option>
                                            <option value="Kolkata to Mayapur">Outstation: Kolkata to Mayapur</option>
                                            <option value="Kolkata to Mandarmani">Outstation: Kolkata to Mandarmani</option>
                                            <option value="Kolkata to Bolpur-Shantiniketan">Outstation: Kolkata to Bolpur</option>
                                            <option value="Kolkata to Dhanbad">Outstation: Kolkata to Dhanbad</option>
                                            <option value="Kolkata to Durgapur">Outstation: Kolkata to Durgapur</option>
                                            <option value="Kolkata to Murshidabad">Outstation: Kolkata to Murshidabad</option>
                                            <option value="Kolkata to Ranchi">Outstation: Kolkata to Ranchi</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        onActionClick("book", `${selectedVehicle} — ${selectedRoute}`)
                                    }
                                    className="w-full min-h-[42px] sm:min-h-[48px] btn-yellow-shimmer py-2.5 sm:py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md shadow-amber-400/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Check Availability &amp; View Fleet</span>
                                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};