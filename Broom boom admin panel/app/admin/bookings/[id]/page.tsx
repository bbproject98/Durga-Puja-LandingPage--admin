"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchBookings,
  updateBooking,
  getAuthToken,
  Booking,
} from "../../lib/api";
import {
  ArrowLeft,
  Save,
  Loader2,
  ChevronDown,
  CheckCircle2,
  Clock,
  Calendar,
  CreditCard,
  Receipt,
  Sparkles,
  ArrowRight,
  Repeat,
} from "lucide-react";

// --- INLINE DATA DEFINITIONS ---

interface RentalPackageItem {
  id: string;
  title: string;
  priceStarting: number;
}

interface OutstationRouteItem {
  id: string;
  title: string;
  startingPrice: number;
  prices: {
    sedan: number;
    suv: number;
    suvPlus: number;
  };
}

interface FleetVehicleItem {
  id: string;
  name: string;
  models: string;
  seats: number;
  category: "sedan" | "suv" | "traveller";
  basePrice: number;
  packageRates: Record<string, number>;
}

const FLEET_DATA: Record<string, FleetVehicleItem> = {
  sedan_4: {
    id: "sedan_4",
    name: "Sedan (4 Seater)",
    models: "Swift Dzire / Toyota Etios / Hyundai Aura",
    seats: 4,
    category: "sedan",
    basePrice: 4551,
    packageRates: {
      pkg_5hr_50km: 3551,
      pkg_8hr_80km: 4551,
      pkg_10hr_100km: 5051,
      pkg_12hr_120km: 6051,
    },
  },
  suv_6: {
    id: "suv_6",
    name: "SUV (6 Seater)",
    models: "Maruti Ertiga / Kia Carens / Renault Triber",
    seats: 6,
    category: "suv",
    basePrice: 5551,
    packageRates: {
      pkg_5hr_50km: 4551,
      pkg_8hr_80km: 5551,
      pkg_10hr_100km: 7051,
      pkg_12hr_120km: 8051,
    },
  },
  suv_7: {
    id: "suv_7",
    name: "SUV+ (7 Seater)",
    models: "Toyota Innova Crysta / Hycross / Scorpio-N",
    seats: 7,
    category: "suv",
    basePrice: 7551,
    packageRates: {
      pkg_5hr_50km: 6051,
      pkg_8hr_80km: 7551,
      pkg_10hr_100km: 8051,
      pkg_12hr_120km: 9051,
    },
  },
  traveller_13: {
    id: "traveller_13",
    name: "Tempo Traveller (13 Seater)",
    models: "Force Luxury Urbania / Tempo Traveller 3350",
    seats: 13,
    category: "traveller",
    basePrice: 10051,
    packageRates: {
      pkg_5hr_50km: 9051,
      pkg_8hr_80km: 10051,
      pkg_10hr_100km: 11051,
      pkg_12hr_120km: 12051,
    },
  },
  traveller_17: {
    id: "traveller_17",
    name: "Tempo Traveller (17 Seater)",
    models: "Force Executive Deluxe Traveller",
    seats: 17,
    category: "traveller",
    basePrice: 11051,
    packageRates: {
      pkg_5hr_50km: 10051,
      pkg_8hr_80km: 11051,
      pkg_10hr_100km: 12051,
      pkg_12hr_120km: 13051,
    },
  },
  traveller_24: {
    id: "traveller_24",
    name: "Tempo Traveller (24 Seater)",
    models: "Force Grand Luxury Coach / Urbania King 24s",
    seats: 24,
    category: "traveller",
    basePrice: 13051,
    packageRates: {
      pkg_5hr_50km: 12051,
      pkg_8hr_80km: 13051,
      pkg_10hr_100km: 14051,
      pkg_12hr_120km: 15051,
    },
  },
};

const RENTAL_PACKAGES: RentalPackageItem[] = [
  { id: "pkg_5hr_50km", title: "5 Hours / 50 KMs Rental Package", priceStarting: 3551 },
  { id: "pkg_8hr_80km", title: "8 Hours / 80 KMs Rental Package", priceStarting: 4551 },
  { id: "pkg_10hr_100km", title: "10 Hours / 100 KMs Rental Package", priceStarting: 5051 },
  { id: "pkg_12hr_120km", title: "12 Hours / 120 KMs Rental Package", priceStarting: 6051 },
];

const OUTSTATION_ROUTES: OutstationRouteItem[] = [
  { id: "kolkata-digha", title: "Kolkata to Digha", startingPrice: 3299, prices: { sedan: 3299, suv: 4299, suvPlus: 5499 } },
  { id: "kolkata-mayapur", title: "Kolkata to Mayapur", startingPrice: 2499, prices: { sedan: 2499, suv: 3599, suvPlus: 4599 } },
  { id: "kolkata-mandarmani", title: "Kolkata to Mandarmani", startingPrice: 3299, prices: { sedan: 3299, suv: 4299, suvPlus: 5499 } },
  { id: "kolkata-bolpur", title: "Kolkata to Bolpur-Shantiniketan", startingPrice: 2999, prices: { sedan: 2999, suv: 3799, suvPlus: 4799 } },
  { id: "kolkata-ranchi", title: "Kolkata to Ranchi", startingPrice: 5999, prices: { sedan: 5999, suv: 7499, suvPlus: 8999 } },
  { id: "kolkata-deoghar", title: "Kolkata to Deoghar", startingPrice: 5499, prices: { sedan: 5499, suv: 6999, suvPlus: 8499 } },
  { id: "kolkata-jamshedpur", title: "Kolkata to Jamshedpur", startingPrice: 4499, prices: { sedan: 4499, suv: 5799, suvPlus: 6999 } },
  { id: "kolkata-bhubaneswar", title: "Kolkata to Bhubaneswar", startingPrice: 6499, prices: { sedan: 6499, suv: 8299, suvPlus: 9999 } },
  { id: "kolkata-puri", title: "Kolkata to Puri", startingPrice: 7299, prices: { sedan: 7299, suv: 9299, suvPlus: 10999 } },
  { id: "kolkata-darjeeling", title: "Kolkata to Darjeeling", startingPrice: 8499, prices: { sedan: 8499, suv: 10499, suvPlus: 12499 } },
  { id: "kolkata-gangtok", title: "Kolkata to Gangtok", startingPrice: 9499, prices: { sedan: 9499, suv: 11499, suvPlus: 13499 } },
  { id: "kolkata-gangasagar", title: "Kolkata to Ganga Sagar", startingPrice: 3499, prices: { sedan: 3499, suv: 4599, suvPlus: 5799 } },
];

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function EditBookingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isStateOpen, setIsStateOpen] = useState(false);

  // Auth guard
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  // Load booking
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const all = await fetchBookings();
        const found = all.find((b) => b.id === id || b.bookingId === id);
        if (found) {
          const fare = Number(found.fare ?? found.totalTariff ?? 0);
          const advance = Number(found.advanceAmount ?? found.advancePaid ?? Math.round(fare * 0.25));
          const gst = Number(found.gstAmount ?? Math.round(advance * 0.05));
          const gateway = Number(found.gatewayCharge ?? Math.ceil((advance + gst) * 0.03));
          const finalPayable = Number(found.finalPayable ?? (advance + gst + gateway));
          const balance = Number(found.balanceDue ?? Math.max(0, fare - advance));

          setBooking({
            ...found,
            fare,
            totalTariff: fare,
            advanceAmount: advance,
            advancePaid: advance,
            gstAmount: gst,
            gatewayCharge: gateway,
            finalPayable,
            balanceDue: balance,
            balancePayable: balance,
          });
        } else {
          setError("Booking not found");
        }
      } catch {
        setError("Failed to load booking");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setBooking((prev) => {
      if (!prev) return prev;
      const val = type === "number" ? (value === "" ? 0 : Number(value)) : value;
      return { ...prev, [name]: val };
    });
  };

  const handleFinancialChange = (name: string, value: number) => {
    setBooking((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [name]: value };

      if (name === "totalTariff" || name === "fare") {
        const fare = value;
        const advance = prev.advancePaid || prev.advanceAmount || Math.round(fare * 0.25);
        const gst = Math.round(advance * 0.05);
        const withGst = advance + gst;
        const gateway = Math.ceil(withGst * 0.03);
        const finalPay = withGst + gateway;
        const balance = Math.max(0, fare - advance);

        return {
          ...updated,
          totalTariff: fare,
          fare,
          advancePaid: advance,
          advanceAmount: advance,
          gstAmount: gst,
          gatewayCharge: gateway,
          finalPayable: finalPay,
          balanceDue: balance,
          balancePayable: balance,
        };
      }

      if (name === "advancePaid" || name === "advanceAmount") {
        const advance = value;
        const fare = prev.totalTariff || prev.fare || 0;
        const gst = Math.round(advance * 0.05);
        const withGst = advance + gst;
        const gateway = Math.ceil(withGst * 0.03);
        const finalPay = withGst + gateway;
        const balance = Math.max(0, fare - advance);

        return {
          ...updated,
          advancePaid: advance,
          advanceAmount: advance,
          gstAmount: gst,
          gatewayCharge: gateway,
          finalPayable: finalPay,
          balanceDue: balance,
          balancePayable: balance,
        };
      }

      if (name === "gstAmount" || name === "gatewayCharge") {
        const advance = updated.advancePaid || updated.advanceAmount || 0;
        const gst = name === "gstAmount" ? value : (updated.gstAmount || 0);
        const gateway = name === "gatewayCharge" ? value : (updated.gatewayCharge || 0);
        const finalPay = advance + gst + gateway;
        return {
          ...updated,
          [name]: value,
          finalPayable: finalPay,
        };
      }

      return updated;
    });
  };

  const isCurrentOutstation = (pkgTitle: string = "", tripType?: string | null) => {
    if (tripType === "ONE_WAY" || tripType === "ROUND_TRIP") return true;
    const lower = (pkgTitle || "").toLowerCase();
    return (
      lower.includes("to ") ||
      lower.includes("outstation") ||
      OUTSTATION_ROUTES.some((r) => r.title.toLowerCase() === lower)
    );
  };

  const calculateDynamicPrice = (
    pkgTitle: string,
    vehicleName: string,
    tripType?: string | null
  ): number | null => {
    const fleetItem = Object.values(FLEET_DATA).find((f) => f.name === vehicleName);
    const rentalPkg = RENTAL_PACKAGES.find((p) => p.title === pkgTitle);
    const outstationPkg = OUTSTATION_ROUTES.find((p) => p.title === pkgTitle);

    if (fleetItem && rentalPkg) {
      return fleetItem.packageRates[rentalPkg.id] ?? rentalPkg.priceStarting;
    }

    if (outstationPkg) {
      let base = outstationPkg.startingPrice;
      if (vehicleName.includes("7 Seater") || vehicleName.includes("Innova")) {
        base = outstationPkg.prices.suvPlus;
      } else if (vehicleName.includes("6 Seater") || vehicleName.includes("SUV")) {
        base = outstationPkg.prices.suv;
      } else if (vehicleName.includes("Sedan")) {
        base = outstationPkg.prices.sedan;
      }
      const activeTrip = tripType ?? booking?.tripType ?? (booking?.returnDate ? "ROUND_TRIP" : "ONE_WAY");
      if (activeTrip === "ROUND_TRIP") {
        return Math.round(base * 1.85);
      }
      return base;
    }

    if (rentalPkg) return rentalPkg.priceStarting;
    if (fleetItem) return fleetItem.basePrice;
    return null;
  };

  const handleTripTypeChange = (type: "ONE_WAY" | "ROUND_TRIP") => {
    setBooking((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, tripType: type };
      if (type === "ROUND_TRIP") {
        if (!updated.returnDate) {
          updated.returnDate = prev.travelDate || new Date().toISOString().split("T")[0];
        }
        if (!updated.returnTime) {
          updated.returnTime = "20:00";
        }
      } else {
        updated.returnDate = null;
        updated.returnTime = null;
      }
      return updated;
    });

    const newPrice = calculateDynamicPrice(booking?.packageTitle || "", booking?.vehicleName || "", type);
    if (newPrice !== null) {
      handleFinancialChange("totalTariff", newPrice);
    }
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const fleetItem = Object.values(FLEET_DATA).find((f) => f.name === selectedName);

    setBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        vehicleName: selectedName,
        vehicleSeats: fleetItem ? fleetItem.seats : prev.vehicleSeats,
        vehicleModels: fleetItem ? fleetItem.models : prev.vehicleModels,
      };
    });

    const newPrice = calculateDynamicPrice(booking?.packageTitle || "", selectedName, booking?.tripType);
    if (newPrice !== null) {
      handleFinancialChange("totalTariff", newPrice);
    }
  };

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = e.target.value;
    const isOut = isCurrentOutstation(selectedTitle);

    setBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        packageTitle: selectedTitle,
        tripType: isOut ? (prev.tripType || "ONE_WAY") : prev.tripType,
      };
    });

    const newPrice = calculateDynamicPrice(selectedTitle, booking?.vehicleName || "", booking?.tripType);
    if (newPrice !== null) {
      handleFinancialChange("totalTariff", newPrice);
    }
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
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setSaving(true);
    try {
      await updateBooking(booking.id, booking);
      router.push("/admin/bookings");
    } catch {
      alert("Failed to update booking");
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

  if (error || !booking) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || "Booking not found"}</p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-slate-200 rounded-xl">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </button>
        <span className="font-mono text-xs bg-slate-100 px-3 py-1 rounded-full">
          {booking.bookingId}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900">Edit Booking Details</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="customerName"
                value={booking.customerName || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone *</label>
              <input
                type="tel"
                name="customerPhone"
                value={booking.customerPhone || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="customerEmail"
                value={booking.customerEmail || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Trip Itinerary */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Trip Itinerary &amp; Schedule
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {(booking.tripType === "ROUND_TRIP" || booking.returnDate)
                  ? "Round-Trip journey schedule including departure and return timings."
                  : "One-Way direct trip schedule."}
              </p>
            </div>
            <div>
              {(booking.tripType === "ROUND_TRIP" || booking.returnDate) ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 shadow-2xs">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Round Trip Itinerary</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>One-Way Itinerary</span>
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {(booking.tripType === "ROUND_TRIP" || booking.returnDate) ? "Departure Date *" : "Travel Date *"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="travelDate"
                  value={booking.travelDate || ""}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Oct 16, 2026"
                  className="flex-1 w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-semibold text-slate-900"
                />
                <input
                  type="date"
                  title="Choose Date from Calendar"
                  onChange={(e) => {
                    if (e.target.value) {
                      const dateObj = new Date(e.target.value);
                      const formattedDate = dateObj.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                      setBooking((prev) => (prev ? { ...prev, travelDate: formattedDate } : prev));
                    }
                  }}
                  className="px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 cursor-pointer outline-none hover:bg-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {(booking.tripType === "ROUND_TRIP" || booking.returnDate) ? "Departure Pickup Time *" : "Pickup Time *"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="pickupTime"
                  value={booking.pickupTime || ""}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 04:00 PM"
                  className="flex-1 w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-semibold text-slate-900"
                />
                <input
                  type="time"
                  title="Choose Time"
                  onChange={(e) => {
                    if (e.target.value) {
                      const [h, m] = e.target.value.split(":");
                      const hour = parseInt(h, 10);
                      const ampm = hour >= 12 ? "PM" : "AM";
                      const formattedHour = hour % 12 || 12;
                      const formattedTime = `${formattedHour.toString().padStart(2, "0")}:${m} ${ampm}`;
                      setBooking((prev) => (prev ? { ...prev, pickupTime: formattedTime } : prev));
                    }
                  }}
                  className="px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 cursor-pointer outline-none hover:bg-slate-100"
                />
              </div>
            </div>

            {/* Return Date & Return Time (Shown for Round Trip) */}
            {(booking.tripType === "ROUND_TRIP" || booking.returnDate) && (
              <>
                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200/80">
                  <label className="block text-xs font-bold text-purple-900 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-700" />
                    <span>Return Date (Round Trip) *</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="returnDate"
                      value={booking.returnDate || ""}
                      onChange={handleChange}
                      placeholder="e.g. Oct 18, 2026"
                      className="flex-1 w-full px-3 py-2 border border-purple-200 bg-white rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none font-bold text-purple-950"
                    />
                    <input
                      type="date"
                      title="Choose Return Date"
                      onChange={(e) => {
                        if (e.target.value) {
                          const dateObj = new Date(e.target.value);
                          const formattedDate = dateObj.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          });
                          setBooking((prev) => (prev ? { ...prev, returnDate: formattedDate } : prev));
                        }
                      }}
                      className="px-2 py-2 border border-purple-200 rounded-xl bg-purple-100 text-purple-700 cursor-pointer outline-none hover:bg-purple-200"
                    />
                  </div>
                  <span className="text-[10px] text-purple-700 mt-1 block">Scheduled return travel date</span>
                </div>

                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200/80">
                  <label className="block text-xs font-bold text-purple-900 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-700" />
                    <span>Return Pickup Time (Round Trip)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="returnTime"
                      value={booking.returnTime || ""}
                      onChange={handleChange}
                      placeholder="e.g. 06:00 PM"
                      className="flex-1 w-full px-3 py-2 border border-purple-200 bg-white rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none font-bold text-purple-950"
                    />
                    <input
                      type="time"
                      title="Choose Return Time"
                      onChange={(e) => {
                        if (e.target.value) {
                          const [h, m] = e.target.value.split(":");
                          const hour = parseInt(h, 10);
                          const ampm = hour >= 12 ? "PM" : "AM";
                          const formattedHour = hour % 12 || 12;
                          const formattedTime = `${formattedHour.toString().padStart(2, "0")}:${m} ${ampm}`;
                          setBooking((prev) => (prev ? { ...prev, returnTime: formattedTime } : prev));
                        }
                      }}
                      className="px-2 py-2 border border-purple-200 rounded-xl bg-purple-100 text-purple-700 cursor-pointer outline-none hover:bg-purple-200"
                    />
                  </div>
                  <span className="text-[10px] text-purple-700 mt-1 block">Scheduled return pickup hour</span>
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Pickup Address *</label>
              <input
                type="text"
                name="pickupAddress"
                value={booking.pickupAddress || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-slate-700 mb-1">Pincode</label>
              <input
                type="text"
                name="pickupPincode"
                value={booking.pickupPincode || ""}
                onChange={handleChange}
                placeholder="e.g. 700019"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              />
            </div>

            <div className="md:col-span-1 relative">
              <label className="block text-xs font-medium text-slate-700 mb-1">State</label>
              <div
                onClick={() => setIsStateOpen(!isStateOpen)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none cursor-pointer flex justify-between items-center"
              >
                <span className={booking.pickupState ? "text-slate-900" : "text-slate-400"}>
                  {booking.pickupState || "Select a state"}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>

              {isStateOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto py-1 text-sm">
                  {INDIAN_STATES.map((state) => (
                    <li
                      key={state}
                      onClick={() => {
                        setBooking((prev) => (prev ? { ...prev, pickupState: state } : prev));
                        setIsStateOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-amber-50 cursor-pointer text-slate-700"
                    >
                      {state}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Vehicle & Package */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Vehicle & Package
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Vehicle Name *</label>
              <select
                name="vehicleName"
                value={booking.vehicleName || ""}
                onChange={handleVehicleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              >
                <option value="" disabled>-- Select Vehicle --</option>
                {Object.values(FLEET_DATA).map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.name}>
                    {vehicle.name} ({vehicle.seats} Seats)
                  </option>
                ))}

                {/* Retains unmapped vehicle types safely */}
                {booking.vehicleName &&
                  !Object.values(FLEET_DATA).some((v) => v.name === booking.vehicleName) && (
                    <optgroup label="Current Selection">
                      <option value={booking.vehicleName}>{booking.vehicleName}</option>
                    </optgroup>
                  )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Package Title *</label>
              <select
                name="packageTitle"
                value={booking.packageTitle || ""}
                onChange={handlePackageChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              >
                <option value="" disabled>-- Select Package / Route --</option>

                <optgroup label="Hourly Rental Packages (Pandal Hopping)">
                  {RENTAL_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.title}>
                      {pkg.title}
                    </option>
                  ))}
                </optgroup>

                <optgroup label="Outstation Routes">
                  {OUTSTATION_ROUTES.map((route) => (
                    <option key={route.id} value={route.title}>
                      {route.title}
                    </option>
                  ))}
                </optgroup>

                {booking.packageTitle &&
                  !RENTAL_PACKAGES.some((p) => p.title === booking.packageTitle) &&
                  !OUTSTATION_ROUTES.some((r) => r.title === booking.packageTitle) && (
                    <optgroup label="Current Selection">
                      <option value={booking.packageTitle}>{booking.packageTitle}</option>
                    </optgroup>
                  )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Seats</label>
              <input
                type="number"
                name="vehicleSeats"
                value={booking.vehicleSeats || 0}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Vehicle Models (Suggested)</label>
              <input
                type="text"
                name="vehicleModels"
                value={booking.vehicleModels || ""}
                onChange={handleChange}
                placeholder="e.g. Swift Dzire / Toyota Etios"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-sm text-slate-800"
              />
            </div>

            {/* Outstation Trip Type Selection: One-Way vs Round Trip */}
            <div className="md:col-span-2 pt-4 pb-2 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Outstation Trip Mode *
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select whether this outstation journey is a single-drop One-Way or full Round-Trip journey.
                  </p>
                </div>
                {isCurrentOutstation(booking.packageTitle, booking.tripType) && (
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 w-fit">
                    OUTSTATION PACKAGE DETECTED
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                {/* One-Way Option */}
                <button
                  type="button"
                  onClick={() => handleTripTypeChange("ONE_WAY")}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                    (booking.tripType === "ONE_WAY" || (!booking.tripType && !booking.returnDate))
                      ? "bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                      : "bg-slate-50/60 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    (booking.tripType === "ONE_WAY" || (!booking.tripType && !booking.returnDate))
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">One-Way Trip</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Single drop to outstation destination without return taxi booking.
                    </p>
                  </div>
                </button>

                {/* Round Trip Option */}
                <button
                  type="button"
                  onClick={() => handleTripTypeChange("ROUND_TRIP")}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                    (booking.tripType === "ROUND_TRIP" || booking.returnDate)
                      ? "bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20 shadow-xs"
                      : "bg-slate-50/60 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    (booking.tripType === "ROUND_TRIP" || booking.returnDate)
                      ? "bg-purple-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    <Repeat className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">Round Trip</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Includes return journey back to Kolkata with return date scheduling.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tariff & Extra Charges Breakdown */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Tariff, Extra Charges &amp; Final Payable Breakdown
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated with 25% Advance, 5% GST, and 3% Gateway fee
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleFinancialChange("totalTariff", booking.totalTariff || 0)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors w-fit"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Recalculate Extra Charges</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Base Ride Fare (₹) *
              </label>
              <input
                type="number"
                name="totalTariff"
                value={booking.totalTariff || 0}
                onChange={(e) => handleFinancialChange("totalTariff", Number(e.target.value))}
                required
                min="0"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-bold text-slate-900 text-sm"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Full ride fare before charges</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Advance Share (25%) (₹)
              </label>
              <input
                type="number"
                name="advancePaid"
                value={booking.advancePaid || 0}
                onChange={(e) => handleFinancialChange("advancePaid", Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-bold text-emerald-700 text-sm"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">25% mandatory online advance</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GST Extra (5% on Advance) (₹)
              </label>
              <input
                type="number"
                name="gstAmount"
                value={booking.gstAmount ?? Math.round((booking.advancePaid || 0) * 0.05)}
                onChange={(e) => handleFinancialChange("gstAmount", Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-bold text-slate-800 text-sm"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">5% GST charged extra</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gateway Fee Extra (3%) (₹)
              </label>
              <input
                type="number"
                name="gatewayCharge"
                value={
                  booking.gatewayCharge ??
                  Math.ceil(
                    ((booking.advancePaid || 0) +
                      (booking.gstAmount ?? Math.round((booking.advancePaid || 0) * 0.05))) *
                      0.03
                  )
                }
                onChange={(e) => handleFinancialChange("gatewayCharge", Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-bold text-slate-800 text-sm"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">3% gateway charge</span>
            </div>
          </div>

          {/* Visual Financial Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Final Payable (Total Paid Online)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-mono font-bold">
                    Advance + Extras
                  </span>
                </div>
                <div className="text-3xl font-black text-emerald-900 mt-2.5 font-mono">
                  ₹{Number(
                    booking.finalPayable ??
                      ((booking.advancePaid || 0) +
                        (booking.gstAmount ?? Math.round((booking.advancePaid || 0) * 0.05)) +
                        (booking.gatewayCharge ??
                          Math.ceil(
                            ((booking.advancePaid || 0) +
                              (booking.gstAmount ?? Math.round((booking.advancePaid || 0) * 0.05))) *
                              0.03
                          )))
                  ).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="text-[11px] text-emerald-800 mt-3 pt-3 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-1">
                <span>
                  Advance ₹{Number(booking.advancePaid || 0).toLocaleString("en-IN")} + GST ₹{Number(booking.gstAmount || 0).toLocaleString("en-IN")} + Fee ₹{Number(booking.gatewayCharge || 0).toLocaleString("en-IN")}
                </span>
                <span className="font-bold">
                  {booking.paymentStatus === "PAID" ? "✓ Paid in Full Online" : "⏳ Pending Payment"}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Balance Collection (At Pickup)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-mono font-bold">
                    Cash / UPI
                  </span>
                </div>
                <div
                  className={`text-3xl font-black mt-2.5 font-mono ${
                    Number(booking.balanceDue ?? (Number(booking.totalTariff || 0) - Number(booking.advancePaid || 0))) > 0
                      ? "text-rose-600"
                      : "text-emerald-700"
                  }`}
                >
                  ₹{Number(
                    booking.balanceDue ??
                      Math.max(0, Number(booking.totalTariff || 0) - Number(booking.advancePaid || 0))
                  ).toLocaleString("en-IN")}
                </div>
              </div>
              <div className="text-[11px] text-amber-900 mt-3 pt-3 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-1">
                <span>
                  Base Fare ₹{Number(booking.totalTariff || 0).toLocaleString("en-IN")} − Advance ₹{Number(booking.advancePaid || 0).toLocaleString("en-IN")}
                </span>
                <span className="font-bold">Chauffeur Collects at Trip Start</span>
              </div>
            </div>
          </div>
        </section>

        {/* Status, Payment & Timestamp Details */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Clock className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Payment Status &amp; Timestamp Details (When Paid)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Status
              </label>
              <select
                name="paymentStatus"
                value={booking.paymentStatus || "PENDING"}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-bold text-sm"
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Booking Status
              </label>
              <select
                name="status"
                value={booking.status || "CONFIRMED"}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-bold text-sm"
              >
                <option value="PAYMENT_PENDING">PAYMENT PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                {booking.status &&
                  !["PAYMENT_PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(
                    booking.status
                  ) && <option value={booking.status}>{booking.status}</option>}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cashfree Order ID
              </label>
              <input
                type="text"
                name="cashfreeOrderId"
                value={booking.cashfreeOrderId || ""}
                onChange={handleChange}
                placeholder="CF_BBC-PUJA-XXXX"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-mono text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  booking.paymentStatus === "PAID"
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-amber-100 text-amber-700 border border-amber-200"
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Payment Confirmation Time (When Paid)
                </span>
                {booking.paymentStatus === "PAID" ? (
                  <>
                    <p className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                      {formatDateTime(booking.updatedAt || booking.createdAt)}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ Payment Verified &amp; Confirmed
                    </span>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-amber-700 mt-0.5">
                      Awaiting Online Advance Payment
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Payment Status: {booking.paymentStatus || "PENDING"}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Booking Initialized Date &amp; Time
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
                  {formatDateTime(booking.createdAt)}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  Ref: {booking.bookingId}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold shadow-md flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}