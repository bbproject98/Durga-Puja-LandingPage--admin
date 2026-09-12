"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  FileDown,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Sparkles,
  X,
  Send,
  Briefcase,
  Save,
  Loader2,
  UserCheck,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import {
  fetchFranchiseLeads,
  updateFranchiseLead,
  createFranchiseLead,
  deleteFranchiseLead,
  getFranchiseExportUrl,
  FranchiseLead,
  FranchiseLeadStatus,
  FranchisePackageTier,
} from "../lib/api";
import { FRANCHISE_LANDING_PAGE_URL } from "../lib/config";
import Pagination from "../components/Pagination";

const STATUS_CONFIG: Record<
  FranchiseLeadStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  NEW: {
    label: "New",
    bg: "bg-blue-50 text-blue-700",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  CONTACTED: {
    label: "Contacted",
    bg: "bg-amber-50 text-amber-800",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    bg: "bg-purple-50 text-purple-700",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  APPROVED: {
    label: "Approved Partner",
    bg: "bg-emerald-50 text-emerald-800",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  REJECTED: {
    label: "Declined",
    bg: "bg-rose-50 text-rose-700",
    text: "text-rose-700",
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

export default function FranchiseAdminPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data state
  const [leads, setLeads] = useState<FranchiseLead[]>([]);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [packageFilter, setPackageFilter] = useState<string>("ALL");

  // Pagination state (Matching Bookings page)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Lead Details Modal / Drawer (Editable)
  const [selectedLead, setSelectedLead] = useState<FranchiseLead | null>(null);
  const [editLeadData, setEditLeadData] = useState<FranchiseLead | null>(null);
  const [savingLead, setSavingLead] = useState(false);
  const [activeEditSection, setActiveEditSection] = useState<
    "applicant" | "territory" | "package" | "profile" | "decision"
  >("applicant");

  // Create Manual Lead Modal
  const [createLeadModalOpen, setCreateLeadModalOpen] = useState(false);
  const [savingNewLead, setSavingNewLead] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState<Partial<FranchiseLead>>({
    fullName: "",
    mobile: "",
    alternatePhone: "",
    email: "",
    city: "",
    state: "West Bengal",
    pincode: "",
    proposedAddress: "",
    spaceStatus: "Owned Commercial",
    carpetArea: "300 sq ft",
    preferredPackage: "gold",
    packageName: "Gold Partner (District Exclusive Hub)",
    investmentBudget: "₹5 Lakhs - ₹10 Lakhs",
    financeRequired: "Self-Funded / Ready Capital",
    loanAssistance: "No (Self-Funded)",
    currentProfession: "",
    hasExperience: "",
    message: "",
    status: "NEW",
    adminNotes: "",
  });

  // Load All Leads
  const loadData = async () => {
    try {
      const leadsRes = await fetchFranchiseLeads();
      setLeads(leadsRes.leads || []);
    } catch (err) {
      console.error("Error loading franchise leads:", err);
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

  // Lead status update
  const handleStatusChange = async (leadId: string, newStatus: FranchiseLeadStatus) => {
    try {
      const updated = await updateFranchiseLead(leadId, { status: newStatus });
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Delete Lead
  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this franchise inquiry?")) return;
    try {
      await deleteFranchiseLead(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      if (selectedLead?.id === leadId) setSelectedLead(null);
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    const q = search.toLowerCase().trim();
    return leads.filter((lead) => {
      const matchesSearch =
        !q ||
        lead.fullName.toLowerCase().includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        lead.mobile.includes(q) ||
        lead.applicationId.toLowerCase().includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
      const matchesPackage =
        packageFilter === "ALL" || lead.preferredPackage.toLowerCase() === packageFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPackage;
    });
  }, [leads, search, statusFilter, packageFilter]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, packageFilter]);

  // Paginated Leads
  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  // Open Lead Drawer (Loads editable copy)
  const openLeadDrawer = (lead: FranchiseLead) => {
    setSelectedLead(lead);
    setEditLeadData({ ...lead });
    setActiveEditSection("applicant");
  };

  // Handle in-place changes in lead editor
  const handleEditLeadChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditLeadData((prev) => {
      if (!prev) return prev;
      if (name === "preferredPackage") {
        const pkgNames: Record<string, string> = {
          silver: "Silver Partner (Booking Kiosk)",
          gold: "Gold Partner (District Exclusive Hub)",
          platinum: "Platinum Partner (Regional Master Franchise)",
          undecided: "Undecided / Flexible Tier",
        };
        return {
          ...prev,
          preferredPackage: value as FranchisePackageTier,
          packageName: pkgNames[value] || prev.packageName,
        };
      }
      return { ...prev, [name]: value };
    });
  };

  // Save all editable lead fields (modal editor)
  const handleSaveAllLeadDetails = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editLeadData) return;
    setSavingLead(true);
    try {
      const updated = await updateFranchiseLead(editLeadData.id, editLeadData);
      setLeads((prev) => prev.map((l) => (l.id === editLeadData.id ? updated : l)));
      setSelectedLead(updated);
      setEditLeadData(updated);
      alert("Franchise application details updated successfully!");
    } catch (err) {
      alert("Failed to update franchise lead details");
    } finally {
      setSavingLead(false);
    }
  };

  // Create new manual franchise lead
  const handleCreateLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNewLead(true);
    try {
      const created = await createFranchiseLead(newLeadForm);
      setLeads((prev) => [created, ...prev]);
      setCreateLeadModalOpen(false);
      setNewLeadForm({
        fullName: "",
        mobile: "",
        alternatePhone: "",
        email: "",
        city: "",
        state: "West Bengal",
        pincode: "",
        proposedAddress: "",
        spaceStatus: "Owned Commercial",
        carpetArea: "300 sq ft",
        preferredPackage: "gold",
        packageName: "Gold Partner (District Exclusive Hub)",
        investmentBudget: "₹5 Lakhs - ₹10 Lakhs",
        financeRequired: "Self-Funded / Ready Capital",
        loanAssistance: "No (Self-Funded)",
        currentProfession: "",
        hasExperience: "",
        message: "",
        status: "NEW",
        adminNotes: "",
      });
      alert("New franchise lead added successfully!");
    } catch (err) {
      alert("Failed to create franchise lead");
    } finally {
      setSavingNewLead(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-navy-900 via-navy-850 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-navy-800 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>Franchise Inquiries &bull; Direct Leads</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Franchise Leads Management
          </h1>
          <p className="text-sm text-slate-300 mt-1.5 max-w-xl">
            Review incoming territory partner inquiries, commercial property proposals, applicant investment budgets, and onboard franchise operators.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Direct Link to Live Franchise Landing Page */}
          <a
            href={FRANCHISE_LANDING_PAGE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold border border-amber-500/40 transition-all shadow-sm group"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Franchise Landing Page</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              PORTAL
            </span>
          </a>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-medium border border-navy-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Syncing..." : "Sync"}</span>
          </button>

          <a
            href={getFranchiseExportUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-medium border border-navy-700 transition-colors shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </a>

          {/* New Application Button */}
          <button
            onClick={() => setCreateLeadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Application</span>
          </button>
        </div>
      </div>


      {/* Filter and Search Bar (Matching Bookings Page) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applicant name, phone, email, city, ref ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { label: "All", value: "ALL" },
            { label: "New", value: "NEW" },
            { label: "Under Review", value: "UNDER_REVIEW" },
            { label: "Contacted", value: "CONTACTED" },
            { label: "Approved", value: "APPROVED" },
            { label: "Declined", value: "REJECTED" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? "bg-navy-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
              <span className="ml-1 text-[10px] font-mono opacity-80">
                (
                {tab.value === "ALL"
                  ? leads.length
                  : leads.filter((l) => l.status === tab.value).length}
                )
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Franchise Leads Table (With 1 2 3 4 row numbering and pagination like bookings) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-3 text-center w-12 font-mono">#</th>
                <th className="py-3.5 px-4 sm:px-6">Application Date</th>
                <th className="py-3.5 px-4">Ref ID</th>
                <th className="py-3.5 px-4">Applicant Details</th>
                <th className="py-3.5 px-4">Target Territory</th>
                <th className="py-3.5 px-4 text-right">Details &amp; Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No franchise leads match the filter.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try clearing the search or status filter.</p>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead, index) => {
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-amber-50/30 transition-colors cursor-pointer group"
                      onClick={() => openLeadDrawer(lead)}
                    >
                      {/* Row Count / Serial Number (1 2 3 4...) like Bookings */}
                      <td className="py-4 px-3 text-center font-mono">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center mx-auto text-[11px] border border-slate-200">
                          {(currentPage - 1) * pageSize + index + 1}
                        </span>
                      </td>

                      {/* Application Date & Time */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-900">
                              {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                            <p className="text-slate-500 font-mono text-[11px]">
                              {new Date(lead.createdAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Application Reference ID */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-800">
                        <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 text-[11px]">
                          {lead.applicationId}
                        </span>
                      </td>

                      {/* Applicant Details */}
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{lead.fullName}</p>
                          <p className="text-slate-600 font-mono text-[11px] mt-0.5">{lead.mobile}</p>
                          {lead.email && (
                            <p className="text-slate-400 text-[11px] truncate max-w-[160px]">
                              {lead.email}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Target Territory */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lead.city}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {lead.state || "West Bengal"} {lead.pincode ? `(${lead.pincode})` : ""}
                        </p>
                        {lead.carpetArea && (
                          <p className="text-[10px] text-slate-400">
                            Space: {lead.carpetArea} ({lead.spaceStatus || "TBD"})
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Call */}
                          <a
                            href={`tel:${lead.mobile}`}
                            title="Call Applicant"
                            className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          {/* Quick WhatsApp */}
                          <a
                            href={`https://wa.me/${lead.mobile.replace(/\D/g, "")}?text=${encodeURIComponent(
                              `Hello ${lead.fullName}, regarding your BroomBoom Franchise application (${lead.applicationId}) for ${lead.city}...`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            title="WhatsApp Applicant"
                            className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </a>

                          {/* Open Drawer Details */}
                          <button
                            onClick={() => openLeadDrawer(lead)}
                            title="View / Edit Lead Details"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Details</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            title="Delete Lead"
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Leads Pagination (Matching Bookings Page with 1 2 3 4) */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredLeads.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
          pageSizeOptions={[10, 25, 50]}
        />
      </div>

      {/* EDITABLE LEAD DETAILS MODAL / DRAWER */}
      {selectedLead && editLeadData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-navy-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-navy-950 font-black flex items-center justify-center text-sm shadow-md shrink-0">
                  {editLeadData.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-black">{editLeadData.fullName}</h2>
                    <span className="font-mono text-xs text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                      {editLeadData.applicationId}
                    </span>

                    {/* Prominent Status Pill in Details Header */}
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        STATUS_CONFIG[editLeadData.status]?.bg || "bg-blue-50 text-blue-700"
                      } ${
                        STATUS_CONFIG[editLeadData.status]?.border || "border-blue-200"
                      }`}
                    >
                      {STATUS_CONFIG[editLeadData.status]?.label || editLeadData.status}
                    </span>

                    {/* Prominent Package Tier Pill in Details Header */}
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        TIER_COLORS[editLeadData.preferredPackage]?.bg || "bg-amber-100"
                      } ${
                        TIER_COLORS[editLeadData.preferredPackage]?.text || "text-amber-900"
                      } ${
                        TIER_COLORS[editLeadData.preferredPackage]?.border || "border-amber-300"
                      }`}
                    >
                      {editLeadData.packageName || editLeadData.preferredPackage.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {editLeadData.city}, {editLeadData.state || "West Bengal"} &bull; Received {new Date(editLeadData.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => {
                    setSelectedLead(null);
                    setEditLeadData(null);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Package & Status Quick Overview Bar in Details Section */}
            <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {/* Package & Capital */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Package:</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-xs uppercase border ${
                    TIER_COLORS[editLeadData.preferredPackage]?.bg || "bg-amber-100"
                  } ${
                    TIER_COLORS[editLeadData.preferredPackage]?.text || "text-amber-900"
                  } ${
                    TIER_COLORS[editLeadData.preferredPackage]?.border || "border-amber-300"
                  }`}>
                    {editLeadData.packageName || editLeadData.preferredPackage}
                  </span>
                  <span className="text-slate-600 font-semibold">
                    Budget: <strong className="text-slate-900">{editLeadData.investmentBudget || "Flexible"}</strong>
                  </span>
                </div>

                <span className="hidden md:inline text-slate-300">|</span>

                {/* Territory Location */}
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{editLeadData.city}</span>
                  {editLeadData.carpetArea && (
                    <span className="text-slate-500 font-normal">({editLeadData.carpetArea})</span>
                  )}
                </div>
              </div>

              {/* Status Quick Changer */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                <select
                  value={editLeadData.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as FranchiseLeadStatus;
                    handleStatusChange(editLeadData.id, newStatus);
                    setEditLeadData((prev) => prev ? { ...prev, status: newStatus } : prev);
                  }}
                  className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-hidden transition-colors ${
                    STATUS_CONFIG[editLeadData.status]?.bg || "bg-blue-50 text-blue-700"
                  } ${
                    STATUS_CONFIG[editLeadData.status]?.border || "border-blue-200"
                  }`}
                >
                  <option value="NEW">New</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="APPROVED">Approved Partner</option>
                  <option value="REJECTED">Declined</option>
                </select>
              </div>
            </div>

            {/* Section Switcher Tabs */}
            <div className="flex items-center gap-1 px-6 border-b border-slate-100 overflow-x-auto text-xs bg-slate-50/50">
              {[
                { id: "applicant", label: "1. Applicant & Contact", icon: UserCheck },
                { id: "territory", label: "2. Territory & Property", icon: MapPin },
                { id: "package", label: "3. Package & Capital", icon: DollarSign },
                { id: "profile", label: "4. Profile & Statement", icon: Briefcase },
                { id: "decision", label: "5. Status & Notes", icon: CheckCircle2 },
              ].map((tab) => {
                const active = activeEditSection === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveEditSection(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 font-bold whitespace-nowrap transition-colors ${
                      active
                        ? "border-amber-500 text-navy-950 bg-white"
                        : "border-transparent text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? "text-amber-600" : "text-slate-400"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body / Editable Form Sections */}
            <form onSubmit={handleSaveAllLeadDetails} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* SECTION 1: APPLICANT INFO */}
              {activeEditSection === "applicant" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Prominent Package & Status Card in Section 1 */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Applied Package Tier
                      </span>
                      <p className="font-bold text-slate-900 text-xs">
                        {editLeadData.packageName || editLeadData.preferredPackage.toUpperCase()}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Budget: <span className="font-semibold text-slate-700">{editLeadData.investmentBudget || "Flexible"}</span> &bull; {editLeadData.financeRequired || "Self-Funded"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Application Review Status
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                          STATUS_CONFIG[editLeadData.status]?.bg || "bg-blue-50 text-blue-700"
                        } ${
                          STATUS_CONFIG[editLeadData.status]?.border || "border-blue-200"
                        }`}>
                          {STATUS_CONFIG[editLeadData.status]?.label || editLeadData.status}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Ref: <strong className="font-mono text-slate-700">{editLeadData.applicationId}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Applicant Personal &amp; Contact Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={editLeadData.fullName || ""}
                        onChange={handleEditLeadChange}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Primary Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={editLeadData.mobile || ""}
                        onChange={handleEditLeadChange}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-mono font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Alternate Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={editLeadData.alternatePhone || ""}
                        onChange={handleEditLeadChange}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editLeadData.email || ""}
                        onChange={handleEditLeadChange}
                        placeholder="partner@example.com"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: TERRITORY & COMMERCIAL SPACE */}
              {activeEditSection === "territory" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Target Territory &amp; Commercial Real Estate
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Target State
                      </label>
                      <select
                        name="state"
                        value={editLeadData.state || "West Bengal"}
                        onChange={handleEditLeadChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-900 font-medium"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Target City / District *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={editLeadData.city || ""}
                        onChange={handleEditLeadChange}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Postal Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={editLeadData.pincode || ""}
                        onChange={handleEditLeadChange}
                        placeholder="700001"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-mono text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Space Status
                      </label>
                      <select
                        name="spaceStatus"
                        value={editLeadData.spaceStatus || "Owned Commercial"}
                        onChange={handleEditLeadChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-900"
                      >
                        <option value="Owned Commercial">Owned Commercial Property</option>
                        <option value="Rented / Leased">Rented / Leased Commercial Shop</option>
                        <option value="Willing to Rent">Will Rent upon Franchise Approval</option>
                        <option value="No Dedicated Space">No Dedicated Commercial Space Yet</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Carpet Area (sq ft)
                      </label>
                      <input
                        type="text"
                        name="carpetArea"
                        value={editLeadData.carpetArea || ""}
                        onChange={handleEditLeadChange}
                        placeholder="e.g. 350 sq ft"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        Proposed Physical Address / Location
                      </label>
                      <textarea
                        rows={2}
                        name="proposedAddress"
                        value={editLeadData.proposedAddress || ""}
                        onChange={handleEditLeadChange}
                        placeholder="Plot/Shop No, Landmark, Road, City, Pincode"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: PACKAGE & CAPITAL */}
              {activeEditSection === "package" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Franchise Package Model &amp; Investment Capital
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Partner Package Tier
                      </label>
                      <select
                        name="preferredPackage"
                        value={editLeadData.preferredPackage || "gold"}
                        onChange={handleEditLeadChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-bold text-slate-900"
                      >
                        {PACKAGE_OPTIONS.map((opt) => (
                          <option key={opt.tier} value={opt.tier}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Package Display Title
                      </label>
                      <input
                        type="text"
                        name="packageName"
                        value={editLeadData.packageName || ""}
                        onChange={handleEditLeadChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Investment Budget
                      </label>
                      <select
                        name="investmentBudget"
                        value={editLeadData.investmentBudget || "₹5 Lakhs - ₹10 Lakhs"}
                        onChange={handleEditLeadChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-900 font-semibold"
                      >
                        <option value="₹2.5 Lakhs - ₹5 Lakhs">₹2.5 Lakhs - ₹5 Lakhs (Kiosk Model)</option>
                        <option value="₹5 Lakhs - ₹10 Lakhs">₹5 Lakhs - ₹10 Lakhs (District Hub)</option>
                        <option value="₹10 Lakhs - ₹20 Lakhs">₹10 Lakhs - ₹20 Lakhs (Mega Hub)</option>
                        <option value="₹20 Lakhs+">₹20 Lakhs+ (Regional Master Franchise)</option>
                        <option value="Flexible">Flexible / Open to Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Financing Option / Ready Capital
                      </label>
                      <select
                        name="financeRequired"
                        value={editLeadData.financeRequired || "Self-Funded / Ready Capital"}
                        onChange={handleEditLeadChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-900 font-semibold"
                      >
                        <option value="Self-Funded / Ready Capital">100% Self-Funded / Ready Liquid Capital</option>
                        <option value="Bank / NBFC Loan Required">Bank / NBFC Loan Assistance Needed</option>
                        <option value="Partial Self-Funded + Partial Loan">50% Self-Funded + 50% Loan</option>
                        <option value="Joint Venture Partnership">Joint Venture / Partner Investment</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: PROFESSIONAL PROFILE */}
              {activeEditSection === "profile" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Applicant Professional Background &amp; Logistics Experience
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Current Profession / Existing Business
                      </label>
                      <input
                        type="text"
                        name="currentProfession"
                        value={editLeadData.currentProfession || ""}
                        onChange={handleEditLeadChange}
                        placeholder="e.g. Travel Agency Owner, Fleet Operator, Retail Businessman"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Transport / Fleet / Logistics Experience
                      </label>
                      <input
                        type="text"
                        name="hasExperience"
                        value={editLeadData.hasExperience || ""}
                        onChange={handleEditLeadChange}
                        placeholder="e.g. 5+ years running local cab aggregations & outstation trips"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Applicant Message / Partnership Statement
                      </label>
                      <textarea
                        rows={3}
                        name="message"
                        value={editLeadData.message || ""}
                        onChange={handleEditLeadChange}
                        placeholder="Territory aspirations, fleet commitment, onboarding timeline..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: DECISION & ADMIN NOTES */}
              {activeEditSection === "decision" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Application Decision &amp; Internal Review Notes
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Application Status Decision
                      </label>
                      <select
                        name="status"
                        value={editLeadData.status || "NEW"}
                        onChange={handleEditLeadChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-bold text-slate-900"
                      >
                        <option value="NEW">New (Uncontacted)</option>
                        <option value="UNDER_REVIEW">Under Document &amp; Territory Review</option>
                        <option value="CONTACTED">Contacted / Initial Screening Done</option>
                        <option value="APPROVED">Approved Official Partner</option>
                        <option value="REJECTED">Declined / Unsuitable Territory</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Application ID Reference
                      </label>
                      <input
                        type="text"
                        disabled
                        value={editLeadData.applicationId}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-100 font-mono text-slate-600 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Internal Admin Follow-up Notes &amp; Action Log
                    </label>
                    <textarea
                      rows={4}
                      name="adminNotes"
                      value={editLeadData.adminNotes || ""}
                      onChange={handleEditLeadChange}
                      placeholder="e.g. Spoke with applicant Subhashish. Has prime shop near Station Road. Sent Gold tier draft MOU on WhatsApp."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLead(null);
                    setEditLeadData(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/franchise/${editLeadData.id}`}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>Dedicated Page</span>
                  </Link>

                  <button
                    type="submit"
                    disabled={savingLead}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 disabled:opacity-70"
                  >
                    {savingLead ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Lead Details</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MANUAL FRANCHISE APPLICATION MODAL */}
      {createLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 sm:p-6 bg-navy-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Add Manual Franchise Application</h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Register walk-in, call-in, or offline territory partner lead
                </p>
              </div>
              <button
                onClick={() => setCreateLeadModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLeadSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Applicant Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subhashish Roy"
                    value={newLeadForm.fullName || ""}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, fullName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={newLeadForm.mobile || ""}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, mobile: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="partner@example.com"
                    value={newLeadForm.email || ""}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target City / District *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Howrah, Kolkata"
                    value={newLeadForm.city || ""}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target State</label>
                  <select
                    value={newLeadForm.state || "West Bengal"}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, state: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none text-slate-900"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Postal Pincode</label>
                  <input
                    type="text"
                    placeholder="700001"
                    value={newLeadForm.pincode || ""}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, pincode: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Partner Package Tier</label>
                  <select
                    value={newLeadForm.preferredPackage || "gold"}
                    onChange={(e) =>
                      setNewLeadForm({
                        ...newLeadForm,
                        preferredPackage: e.target.value as FranchisePackageTier,
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none text-slate-900 font-semibold"
                  >
                    {PACKAGE_OPTIONS.map((opt) => (
                      <option key={opt.tier} value={opt.tier}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Investment Budget</label>
                  <select
                    value={newLeadForm.investmentBudget || "₹5 Lakhs - ₹10 Lakhs"}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, investmentBudget: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none text-slate-900"
                  >
                    <option value="₹2.5 Lakhs - ₹5 Lakhs">₹2.5 Lakhs - ₹5 Lakhs (Kiosk)</option>
                    <option value="₹5 Lakhs - ₹10 Lakhs">₹5 Lakhs - ₹10 Lakhs (District Hub)</option>
                    <option value="₹10 Lakhs - ₹20 Lakhs">₹10 Lakhs - ₹20 Lakhs (Mega Hub)</option>
                    <option value="₹20 Lakhs+">₹20 Lakhs+ (Regional Master)</option>
                    <option value="Flexible">Flexible / Open</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Commercial Space Status</label>
                  <select
                    value={newLeadForm.spaceStatus || "Owned Commercial"}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, spaceStatus: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none text-slate-900"
                  >
                    <option value="Owned Commercial">Owned Commercial Property</option>
                    <option value="Rented / Leased">Rented / Leased Commercial</option>
                    <option value="Willing to Rent">Will Rent upon Approval</option>
                    <option value="No Dedicated Space">No Dedicated Space</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Carpet Area</label>
                  <input
                    type="text"
                    placeholder="e.g. 300 sq ft"
                    value={newLeadForm.carpetArea || ""}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, carpetArea: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Applicant Statement / Pitch</label>
                  <textarea
                    rows={2}
                    placeholder="Inquiry notes, territory preferences, fleet commitment..."
                    value={newLeadForm.message || ""}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, message: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 outline-none text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateLeadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingNewLead}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {savingNewLead ? "Registering..." : "Register Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
