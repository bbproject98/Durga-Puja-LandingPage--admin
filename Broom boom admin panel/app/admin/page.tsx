"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import StatsCard from "./components/StatsCard";
import {
  fetchBookings,
  fetchVehicles,
  fetchPackages,
  fetchLeads,
  updateLeadStatus,
  fetchFranchiseAnalytics,
  FranchiseAnalytics,
  Booking,
  Vehicle,
  Package,
  Lead,
} from "./lib/api";
import {
  IndianRupee,
  CalendarCheck,
  CarFront,
  Sparkles,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  Users,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [franchiseStats, setFranchiseStats] = useState<FranchiseAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [b, v, p, l, fa] = await Promise.all([
        fetchBookings(),
        fetchVehicles(),
        fetchPackages(),
        fetchLeads(),
        fetchFranchiseAnalytics().catch(() => null),
      ]);
      setBookings(b);
      setVehicles(v);
      setPackages(p);
      setLeads(l);
      if (fa) setFranchiseStats(fa);
    } catch (err) {
      console.error("Failed loading dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Format Date and Time
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  // Calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalTariff || 0), 0);
  const advanceCollected = bookings.reduce((sum, b) => sum + (b.advancePaid || 0), 0);
  const balancePending = bookings.reduce((sum, b) => sum + (b.balancePayable || 0), 0);


  return (
    <div className="space-y-8">
      {/* Top Welcome & Summary Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-navy-900 via-navy-850 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-navy-800 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kolkata Fleet Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Durga Puja 2026 Fleet Operations
          </h1>
          <p className="text-sm text-slate-300 mt-1.5 max-w-xl">
            Real-time status of chauffeur rentals, bookings queue sorted by travel departure date, and registered customer user leads.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-medium border border-navy-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Syncing..." : "Sync Fleet"}</span>
          </button>

          <Link
            href="/admin/bookings"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Manage Bookings</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Booking Value"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          icon={IndianRupee}
          color="amber"
          trend={{ value: "+24.8%", positive: true, label: "vs last season" }}
          subtitle={`₹${advanceCollected.toLocaleString("en-IN")} Advance Collected`}
        />

        <StatsCard
          title="Active Confirmed Bookings"
          value={bookings.length}
          icon={CalendarCheck}
          color="blue"
          trend={{ value: "Sorted ASC", positive: null, label: "departure sequence" }}
          subtitle={`₹${balancePending.toLocaleString("en-IN")} Balance to collect`}
        />

        <StatsCard
          title="User Leads & Logins"
          value={leads.length}
          icon={Users}
          color="emerald"
          trend={{ value: "Live Inquiries", positive: true, label: "real-time" }}
          subtitle="Customer auth & requests"
        />

        <StatsCard
          title="Fleet Categories"
          value={vehicles.length}
          icon={CarFront}
          color="purple"
          trend={{ value: "100% Ready", positive: true, label: "Sanitized & AC" }}
          subtitle="Sedans, SUVs & Travellers"
        />
      </div>

      {/* Franchise Network Expansion Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 border border-amber-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-navy-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900">Franchise &amp; Territory Network</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                CENTRAL CONSOLE
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {franchiseStats?.totalLeads ?? 0} Franchise Inquiries &bull; {franchiseStats?.activeHubs ?? 3} Active Fleet Hubs &bull; {franchiseStats?.brochureDownloads ?? 0} Prospectus Downloads
            </p>
          </div>
        </div>
        <Link
          href="/admin/franchise"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-all shadow-md shrink-0"
        >
          <span>Open Franchise Console</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
        </Link>
      </div>
      {/* Quick Category Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bookings Category Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-amber-400/80 hover:shadow-md transition-all group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Bookings Management</h3>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {bookings.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Track confirmed Puja parikrama trips, view chauffeur dispatch sequences, and manage advance &amp; pending payments.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              ₹{balancePending.toLocaleString("en-IN")} Pending Due
            </span>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Open Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* User Leads Category Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-amber-400/80 hover:shadow-md transition-all group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">User Inquiries &amp; Leads</h3>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {leads.length} Leads
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Customer auth logins, phone inquiries, package inquiries, and requested outstation quotes with timestamps.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Live Inquiries</span>
            </span>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Open Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Franchise Leads Category Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-amber-400/80 hover:shadow-md transition-all group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Franchise Leads</h3>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                {franchiseStats?.totalLeads ?? 0} Inquiries
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Multi-tier franchise investor applications, commercial space details, applicant liquid capital, and onboarding notes.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-600 font-semibold">
              District Hubs &amp; Master Tiers
            </span>
            <Link
              href="/admin/franchise"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Open Franchise Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>


      {/* Fleet Lineup & Pricing */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Fleet Lineup &amp; Pricing</h3>
            <p className="text-xs text-slate-500">
              Chauffeur-driven vehicles available for Puja parikrama
            </p>
          </div>
          <Link
            href="/admin/vehicles"
            className="text-xs font-semibold text-amber-600 hover:text-amber-700"
          >
            Configure Fleet →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:border-amber-400 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    {v.category}
                  </span>
                  <span className="text-xs font-bold text-amber-600">
                    ₹{v.basePrice} / {v.baseHours}h
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-800">{v.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{v.models}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>Seats: {v.seats}</span>
                <span>Extra: ₹{v.perExtraHour}/hr</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
