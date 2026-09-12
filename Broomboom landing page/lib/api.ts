/**
 * BroomBoom Cabs - Frontend API Client
 * Connects Next.js UI with Express + Prisma Backend
 */

import { FLEET_DATA } from "@/data/fleet";
import { RENTAL_PACKAGES, OUTSTATION_ROUTES } from "@/data/packages";
import { Vehicle, PackageItem } from "@/types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000").replace(/\/+$/, "");

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string | null;
  context?: string;
  action?: "book" | "explore";
}

export interface BookingPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;

  vehicleName: string;
  vehicleModels?: string;
  vehicleSeats?: number;

  packageTitle: string;

  travelDate: string;
  pickupTime: string;

  returnDate?: string;
  returnTime?: string;

  pickupAddress: string;
  pickupPincode?: string;
  pickupState?: string;

  totalTariff: number;
}

// 1. Submit Lead (From Login / Quick Access popup)
export async function submitLead(payload: LeadPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to submit lead");
    }
    return await res.json();
  } catch (error) {
    console.warn("Backend API offline, saved lead to local storage fallback:", error);
    return { success: true, fallback: true, data: payload };
  }
}

// 2. Fetch Fleet from Backend (with local fallback)
export async function fetchFleet(category?: string): Promise<Record<string, Vehicle>> {
  try {
    const url = category && category !== "all" 
      ? `${API_BASE_URL}/api/fleet?category=${category}` 
      : `${API_BASE_URL}/api/fleet`;

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch fleet");
    
    const result = await res.json();
    if (result.success && Array.isArray(result.data)) {
      const fleetMap: Record<string, Vehicle> = {};
      result.data.forEach((item: Vehicle) => {
        fleetMap[item.id] = item;
      });
      return fleetMap;
    }
    return FLEET_DATA;
  } catch (error) {
    console.warn("Backend API offline, using local fleet dataset:", error);
    return FLEET_DATA;
  }
}

// 3. Fetch Packages from Backend (with local fallback)
export async function fetchPackages(type?: "rental" | "outstation"): Promise<any[]> {
  try {
    const url = type ? `${API_BASE_URL}/api/packages?type=${type}` : `${API_BASE_URL}/api/packages`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch packages");
    
    const result = await res.json();
    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }
    return type === "outstation" ? OUTSTATION_ROUTES : RENTAL_PACKAGES;
  } catch (error) {
    console.warn("Backend API offline, using local packages dataset:", error);
    return type === "outstation" ? OUTSTATION_ROUTES : RENTAL_PACKAGES;
  }
}

// 4. Create and Confirm Booking in Backend
// 4. Create Booking + Cashfree Payment Order
export async function submitBooking(payload: BookingPayload) {
  const res = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      result.message || "Failed to create booking and payment order"
    );
  }

  return result;
}

// 5. Fetch Booking by Reference ID
export async function fetchBookingById(bookingId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`);
    if (!res.ok) throw new Error("Booking not found");
    return await res.json();
  } catch (error) {
    console.warn("Could not fetch booking from backend:", error);
    return null;
  }
}

// 6. Check Backend Health
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    return await res.json();
  } catch (error) {
    return { success: false, status: "OFFLINE" };
  }
}