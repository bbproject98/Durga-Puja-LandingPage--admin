// app/admin/franchise/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  fetchFranchiseLeadById,
  updateFranchiseLead,
  getAuthToken,
  FranchiseLead,
  FranchiseLeadStatus,
  FranchisePackageTier,
} from "../../lib/api";
import { FRANCHISE_LANDING_PAGE_URL } from "../../lib/config";
import {
  ArrowLeft,
  Save,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Building2,
  DollarSign,
  Briefcase,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Send,
  Sparkles,
  Store,
} from "lucide-react";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", 
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", 
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", 
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const PACKAGE_OPTIONS: {
  tier: FranchisePackageTier;
  label: string;
  defaultBudget: string;
}[] = [
  {
    tier: "silver",
    label: "Silver Partner (Booking Kiosk)",
    defaultBudget: "₹2.5 Lakhs - ₹5 Lakhs",
  },
  {
    tier: "gold",
    label: "Gold Partner (District Exclusive Hub)",
    defaultBudget: "₹5 Lakhs - ₹10 Lakhs",
  },
  {
    tier: "platinum",
    label: "Platinum Partner (Regional Master Franchise)",
    defaultBudget: "₹15 Lakhs+",
  },
  {
    tier: "undecided",
    label: "Undecided / Flexible Tier",
    defaultBudget: "Flexible",
  },
];

const STATUS_CONFIG: Record<
  FranchiseLeadStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  NEW: {
    label: "New",
    bg: "bg-blue-100 text-blue-800 border-blue-200",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  CONTACTED: {
    label: "Contacted",
    bg: "bg-amber-100 text-amber-800 border-amber-200",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    bg: "bg-purple-100 text-purple-800 border-purple-200",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  APPROVED: {
    label: "Approved Partner",
    bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  REJECTED: {
    label: "Declined",
    bg: "bg-rose-100 text-rose-800 border-rose-200",
    text: "text-rose-800",
    border: "border-rose-200",
  },
};

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  silver: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-300",
  },
  gold: {
    bg: "bg-amber-100",
    text: "text-amber-900",
    border: "border-amber-300",
  },
  platinum: {
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    border: "border-emerald-300",
  },
  undecided: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
  },
};

export default function EditFranchiseLeadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lead, setLead] = useState<FranchiseLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Auth guard
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  // Load Franchise Lead
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const found = await fetchFranchiseLeadById(id);
        if (found) {
          setLead(found);
        } else {
          setError("Franchise Lead Application not found");
        }
      } catch (err) {
        setError("Failed to load franchise application");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLead((prev) => {
      if (!prev) return prev;

      // Automatically sync packageName when preferredPackage changes
      if (name === "preferredPackage") {
        const matched = PACKAGE_OPTIONS.find((p) => p.tier === value);
        return {
          ...prev,
          preferredPackage: value as FranchisePackageTier,
          packageName: matched ? matched.label : prev.packageName,
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    setSaving(true);
    try {
      const updated = await updateFranchiseLead(lead.id, lead);
      setLead(updated);
      setSuccessToast(true);
      setTimeout(() => {
        setSuccessToast(false);
        router.push("/admin/franchise");
      }, 1200);
    } catch (err) {
      alert("Failed to update franchise lead details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="text-center py-12">
        <p className="text-rose-500 font-semibold">{error || "Franchise Application not found"}</p>
        <button
          onClick={() => router.push("/admin/franchise")}
          className="mt-4 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-bold transition-colors"
        >
          Return to Franchise Hub
        </button>
      </div>
    );
  }

  const statusStyle = STATUS_CONFIG[lead.status] || STATUS_CONFIG.NEW;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold text-xs">Franchise application updated successfully!</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => router.push("/admin/franchise")}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Franchise Network</span>
        </button>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-mono text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-full border border-slate-200 font-bold">
            {lead.applicationId}
          </span>

          <span
            className={`text-xs px-3 py-1 rounded-full font-bold border ${statusStyle.bg}`}
          >
            {statusStyle.label}
          </span>

          <span
            className={`text-xs px-3 py-1 rounded-full font-bold border ${
              TIER_COLORS[lead.preferredPackage]?.bg || "bg-amber-100"
            } ${
              TIER_COLORS[lead.preferredPackage]?.text || "text-amber-900"
            } ${
              TIER_COLORS[lead.preferredPackage]?.border || "border-amber-300"
            }`}
          >
            {lead.packageName || lead.preferredPackage.toUpperCase()}
          </span>

          <a
            href={FRANCHISE_LANDING_PAGE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
            <span>Franchise Landing Page</span>
          </a>
        </div>
      </div>

      {/* Page Title & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-black text-slate-900">
              Edit Franchise Lead &amp; Application
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Edit partner applicant details, territory allocation, commercial space, investment tier, and review notes.
          </p>
        </div>

        {/* Quick Contact Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${lead.mobile}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Applicant</span>
          </a>

          <a
            href={`https://wa.me/${lead.mobile.replace(/\D/g, "")}?text=${encodeURIComponent(
              `Hello ${lead.fullName}, this is the territory management team from BroomBoom regarding your franchise application (${lead.applicationId}) for ${lead.city}.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Applicant Information */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Applicant Personal &amp; Contact Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={lead.fullName || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Primary Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                value={lead.mobile || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-mono font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Alternate Phone / WhatsApp
              </label>
              <input
                type="tel"
                name="alternatePhone"
                value={lead.alternatePhone || ""}
                onChange={handleChange}
                placeholder="+91 98XXX XXXXX"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={lead.email || ""}
                onChange={handleChange}
                placeholder="partner@example.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: Territory & Commercial Property */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Territory Location &amp; Commercial Space
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Target City / District *
              </label>
              <input
                type="text"
                name="city"
                value={lead.city || ""}
                onChange={handleChange}
                required
                placeholder="e.g. Kolkata, Siliguri, Durgapur"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-semibold text-slate-800"
              />
            </div>

            {/* Custom State Dropdown */}
            <div className="relative">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                State / UT *
              </label>
              <div
                onClick={() => setIsStateOpen(!isStateOpen)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs cursor-pointer flex justify-between items-center focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <span className={lead.state ? "text-slate-900 font-semibold" : "text-slate-400"}>
                  {lead.state || "Select Indian State"}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>

              {isStateOpen && (
                <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto py-1 text-xs">
                  {INDIAN_STATES.map((st) => (
                    <li
                      key={st}
                      onClick={() => {
                        setLead((prev) => (prev ? { ...prev, state: st } : prev));
                        setIsStateOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-amber-50 cursor-pointer text-slate-700"
                    >
                      {st}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={lead.pincode || ""}
                onChange={handleChange}
                placeholder="e.g. 700019"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Commercial Space Status
              </label>
              <select
                name="spaceStatus"
                value={lead.spaceStatus || "Owned Commercial"}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800"
              >
                <option value="Owned Commercial">Owned Commercial Property</option>
                <option value="Rented Showroom">Rented Commercial / Showroom</option>
                <option value="Mall Kiosk Space">Mall / Station Kiosk Space</option>
                <option value="Planning to Lease">Planning to Lease Commercial Space</option>
                <option value="Home Office / Shared">Home Office / Shared Desk</option>
                <option value="TBD">To Be Decided with BroomBoom Team</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Estimated Carpet Area
              </label>
              <input
                type="text"
                name="carpetArea"
                value={lead.carpetArea || ""}
                onChange={handleChange}
                placeholder="e.g. 350 sq ft"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Proposed Hub / Kiosk Physical Address
              </label>
              <textarea
                rows={2}
                name="proposedAddress"
                value={lead.proposedAddress || ""}
                onChange={handleChange}
                placeholder="Plot/Shop No, Landmark, Road, City, Pincode"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800"
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: Package & Capital Investment */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Package Model &amp; Investment Budget
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Franchise Partner Package Tier
              </label>
              <select
                name="preferredPackage"
                value={lead.preferredPackage || "gold"}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-bold text-slate-800"
              >
                {PACKAGE_OPTIONS.map((opt) => (
                  <option key={opt.tier} value={opt.tier}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Package Display Title
              </label>
              <input
                type="text"
                name="packageName"
                value={lead.packageName || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Investment Capital Budget
              </label>
              <select
                name="investmentBudget"
                value={lead.investmentBudget || "₹5 Lakhs - ₹10 Lakhs"}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800 font-semibold"
              >
                <option value="₹2.5 Lakhs - ₹5 Lakhs">₹2.5 Lakhs - ₹5 Lakhs (Kiosk Model)</option>
                <option value="₹5 Lakhs - ₹10 Lakhs">₹5 Lakhs - ₹10 Lakhs (District Hub)</option>
                <option value="₹10 Lakhs - ₹20 Lakhs">₹10 Lakhs - ₹20 Lakhs (Mega Hub)</option>
                <option value="₹20 Lakhs+">₹20 Lakhs+ (Regional Master Franchise)</option>
                <option value="Flexible">Flexible / Open to Consultation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Financing Option / Ready Capital
              </label>
              <select
                name="financeRequired"
                value={lead.financeRequired || "Self-Funded / Ready Capital"}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800 font-semibold"
              >
                <option value="Self-Funded / Ready Capital">100% Self-Funded / Ready Liquid Capital</option>
                <option value="Bank / NBFC Loan Required">Bank / NBFC Loan Assistance Needed</option>
                <option value="Partial Self-Funded + Partial Loan">50% Self-Funded + 50% Loan</option>
                <option value="Joint Venture Partnership">Joint Venture / Partner Investment</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Loan Assistance Desk &amp; Scheme Support
              </label>
              <select
                name="loanAssistance"
                value={lead.loanAssistance || "No (Self-Funded)"}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800"
              >
                <option value="No (Self-Funded)">No — Fully Self-Funded</option>
                <option value="Yes - Bank Loan Support Required">Yes — Requires BroomBoom NBFC / Bank Tie-up Support</option>
                <option value="Yes - Seeking PMEGP / Mudra Scheme">Yes — Seeking Government PMEGP / Mudra Loan Guidance</option>
              </select>
            </div>
          </div>
        </section>

        {/* SECTION 4: Professional Profile & Transport Background */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              4. Professional Background &amp; Transport Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Current Profession / Business
              </label>
              <input
                type="text"
                name="currentProfession"
                value={lead.currentProfession || ""}
                onChange={handleChange}
                placeholder="e.g. Fleet Operator, Tour & Travel Agency, Businessman"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Experience in Transport / Logistics
              </label>
              <input
                type="text"
                name="hasExperience"
                value={lead.hasExperience || ""}
                onChange={handleChange}
                placeholder="e.g. Yes, 8+ years running tourist taxi service"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Applicant Message &amp; Vision Pitch
              </label>
              <textarea
                rows={3}
                name="message"
                value={lead.message || ""}
                onChange={handleChange}
                placeholder="Applicant's statement or notes submitted with the application..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800"
              />
            </div>
          </div>
        </section>

        {/* SECTION 5: Status, Timestamps & Internal Admin Notes */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Clock className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              5. Decision Status &amp; Territory Manager Notes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Franchise Evaluation Status *
              </label>
              <select
                name="status"
                value={lead.status}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-bold text-slate-900 bg-slate-50"
              >
                <option value="NEW">NEW - Unreviewed Application</option>
                <option value="CONTACTED">CONTACTED - Call / WhatsApp Initiated</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW - Evaluation &amp; KYC Verification</option>
                <option value="APPROVED">APPROVED - Territory Contract Cleared</option>
                <option value="REJECTED">REJECTED - Declined / Incompatible Territory</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Inquiry Source
              </label>
              <input
                type="text"
                name="source"
                value={lead.source || "BroomBoom Franchise Landing Page"}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Territory Manager &amp; Internal Audit Notes
              </label>
              <textarea
                rows={3}
                name="adminNotes"
                value={lead.adminNotes || ""}
                onChange={handleChange}
                placeholder="Log discussion notes, territory exclusivity terms, fleet commitment, background verification..."
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-800"
              />
            </div>
          </div>

          {/* Timestamp Cards */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Application Submitted
                </span>
                <p className="text-xs font-bold text-slate-900 mt-0.5 font-mono">
                  {formatDateTime(lead.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Last Admin Action / Update
                </span>
                <p className="text-xs font-bold text-slate-900 mt-0.5 font-mono">
                  {formatDateTime(lead.updatedAt || lead.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => router.push("/admin/franchise")}
            className="px-6 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Lead Details</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

