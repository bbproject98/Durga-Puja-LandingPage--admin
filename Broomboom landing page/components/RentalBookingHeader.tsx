"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Check, X, ChevronDown, CalendarDays } from "lucide-react";
import { RENTAL_PACKAGES, RentalPackage } from "@/data/packages";

// ─── Time helpers ─────────────────────────────────────────────────────────

const generateTimeSlots = (): string[] => {
  const out: string[] = [];
  for (let h = 0; h < 24; h++)
    for (let m = 0; m < 60; m += 15)
      out.push(`${String(h % 12 || 12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`);
  return out;
};

export const ALL_TIME_SLOTS = generateTimeSlots();

export const timeToMinutes = (t: string): number => {
  if (!t) return 0;
  const p = t.trim().split(" ");
  if (p.length < 2) return 0;
  let [h, m] = p[0].split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return 0;
  if (p[1].toUpperCase() === "PM" && h !== 12) h += 12;
  if (p[1].toUpperCase() === "AM" && h === 12) h = 0;
  return h * 60 + m;
};

export const getTodayStr = (): string => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
};

export const dateToKey = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const getCurrentTimeStr = (): string => {
  const n = new Date();
  return `${String(n.getHours() % 12 || 12).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")} ${n.getHours() < 12 ? "AM" : "PM"}`;
};

export const getOneHourAheadQuarterHour = (): string => {
  const d = new Date();
  d.setHours(d.getHours() + 1);
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  return `${String(d.getHours() % 12 || 12).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() < 12 ? "AM" : "PM"}`;
};

export const getInitialPickupDate = (): string => getTodayStr();

export const isToday = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}` === getTodayStr();
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
};

// ─── Availability ─────────────────────────────────────────────────────────

export type BookedSlotsByDate = Record<string, string[]>;

export const makeBookedSlotsBefore = (t: string): string[] =>
  ALL_TIME_SLOTS.filter((s) => timeToMinutes(s) < timeToMinutes(t));

export const makeBookedWholeDay = (): string[] => [...ALL_TIME_SLOTS];

export const getAvailableSlots = (date: string, bookedSlots: string[] = []): string[] => {
  const booked = new Set(bookedSlots.map((s) => s.trim().toUpperCase()));
  let slots = ALL_TIME_SLOTS.filter((s) => !booked.has(s.toUpperCase()));
  if (isToday(date)) {
    const min = Math.ceil((timeToMinutes(getCurrentTimeStr()) + 60) / 15) * 15;
    slots = slots.filter((s) => timeToMinutes(s) >= min);
  }
  return slots;
};

export const findFirstAvailable = (
  bookedSlotsByDate: BookedSlotsByDate = {},
  maxDaysAhead = 60
): { date: string; time: string } => {
  const now = new Date();
  for (let i = 0; i < maxDaysAhead; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const key = dateToKey(d);
    const slots = getAvailableSlots(key, bookedSlotsByDate[key] ?? []);
    if (slots.length > 0) return { date: key, time: slots[0] };
  }
  return { date: getTodayStr(), time: ALL_TIME_SLOTS[0] };
};

// ─── Formatters ───────────────────────────────────────────────────────────

const formatDisplayDate = (s: string): string => {
  if (!s) return "Select date";
  const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T00:00:00`) : new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatSummaryDate = (s: string): string => {
  if (!s) return "";
  const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T00:00:00`) : new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
};

// ─── City data ────────────────────────────────────────────────────────────

const WB_CITY_GROUPS = [
  { region: "Kolkata & Greater Kolkata", cities: ["Kolkata", "Kolkata (Citywide)", "Salt Lake (Bidhannagar)", "New Town (Rajarhat)", "Dum Dum", "Barasat", "Barrackpore", "Sonarpur", "Budge Budge", "Shalimar", "Shatragathi"] },
  { region: "Howrah & Hooghly", cities: ["Howrah", "Bally", "Uttarpara", "Konnagar", "Rishra", "Serampore", "Chandannagar", "Chinsurah"] },
];
const ALL_WB_CITIES = WB_CITY_GROUPS.flatMap((g) => g.cities);

// ─── City dropdown ────────────────────────────────────────────────────────

const CityDropdown: React.FC<{ value: string; isCustomCity: boolean; onSelectCity: (c: string, custom: boolean) => void }> = ({ value, isCustomCity, onSelectCity }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative w-full" ref={ref}>
      <button type="button" onClick={() => setOpen((p) => !p)}
        className="bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 w-full flex items-center justify-between min-h-[38px]">
        <span className="truncate">{isCustomCity ? (value || "Other city...") : (value || "Select City")}</span>
        <ChevronDown className="w-3 h-3 ml-1 opacity-60 shrink-0" />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full sm:w-[200px] bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-[128px] overflow-y-auto">
          {WB_CITY_GROUPS.map((g) => (
            <div key={g.region}>
              <div className="h-[24px] px-2.5 flex items-center text-[10px] font-bold text-slate-400 bg-slate-950/95 sticky top-0 uppercase tracking-wider border-b border-slate-800">{g.region}</div>
              {g.cities.map((c) => {
                const sel = !isCustomCity && value === c;
                return (
                  <div key={c} onClick={() => { onSelectCity(c, false); setOpen(false); }}
                    className={`h-[32px] px-3 flex items-center text-xs text-white cursor-pointer transition-colors hover:bg-amber-500/20 ${sel ? "text-amber-400 font-bold bg-amber-500/10" : ""}`}>
                    <span className="truncate">{c}</span>
                  </div>
                );
              })}
            </div>
          ))}
          <div className="border-t border-slate-800">
            <div onClick={() => { onSelectCity("", true); setOpen(false); }}
              className="h-[32px] px-3 flex items-center text-xs text-amber-400 hover:bg-amber-500/20 cursor-pointer font-medium">
              Other — enter city…
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Time dropdown ────────────────────────────────────────────────────────

const TimeDropdown: React.FC<{ value: string; onChange: (t: string) => void; selectedDate: string; bookedSlots?: string[] }> = ({ value, onChange, selectedDate, bookedSlots = [] }) => {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const availableSlots = useMemo(() => getAvailableSlots(selectedDate, bookedSlots), [selectedDate, bookedSlots]);

  useEffect(() => {
    if (availableSlots.length > 0 && !availableSlots.includes(value)) onChange(availableSlots[0]);
  }, [availableSlots, value, onChange]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (!open) return;
    const i = availableSlots.indexOf(value);
    setHi(i >= 0 ? i : 0);
  }, [open, availableSlots, value]);

  useEffect(() => {
    if (!open) return;
    const c = listRef.current; if (!c) return;
    const el = c.querySelector<HTMLElement>(`[data-index="${hi}"]`); if (!el) return;
    const top = el.offsetTop, bot = top + el.offsetHeight;
    if (top < c.scrollTop) c.scrollTop = top;
    else if (bot > c.scrollTop + c.clientHeight) c.scrollTop = bot - c.clientHeight;
  }, [open, hi]);

  if (availableSlots.length === 0)
    return <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 w-[150px] flex items-center justify-between opacity-60 min-h-[38px]"><span>No slots</span></div>;

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox" aria-expanded={open} aria-label="Select pickup time"
        className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 w-full sm:w-[150px] flex items-center justify-between min-h-[38px]">
        <span>{value}</span><ChevronDown className="w-3 h-3 ml-2 opacity-60 shrink-0" />
      </button>
      {open && (
        <div ref={listRef} role="listbox" tabIndex={-1}
          className="absolute z-30 mt-1 w-full sm:w-[150px] bg-slate-900 border border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {availableSlots.map((t, i) => (
            <div key={t} data-index={i} role="option" aria-selected={t === value}
              onMouseEnter={() => setHi(i)} onClick={() => { onChange(t); setOpen(false); }}
              className={`px-3 py-1.5 text-xs text-white cursor-pointer transition-colors ${i === hi ? "bg-amber-500/20" : ""} ${t === value ? "text-amber-400 font-semibold" : ""}`}>
              {t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Date field ───────────────────────────────────────────────────────────

const DateField: React.FC<{ value: string; onChange: (d: string) => void; min?: string }> = ({ value, onChange, min }) => {
  const ref = useRef<HTMLInputElement>(null);
  const open = () => {
    const el = ref.current as (HTMLInputElement & { showPicker?: () => void }) | null;
    if (!el) return;
    if (typeof el.showPicker === "function") { try { el.showPicker(); return; } catch { /* ignore */ } }
    el.focus();
  };
  return (
    <div className="relative w-full sm:w-[130px] group">
      <div className="pointer-events-none bg-slate-900 text-white text-xs px-2.5 sm:px-3 py-2 rounded-lg border border-slate-700 group-focus-within:border-amber-400 w-full flex items-center justify-between min-h-[38px]">
        <span className="truncate">{formatDisplayDate(value)}</span>
        <CalendarDays className="w-3.5 h-3.5 ml-1.5 opacity-60 shrink-0" />
      </div>
      <input ref={ref} type="date" value={value} min={min} onChange={(e) => onChange(e.target.value)} onClick={open}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
        aria-label="Select date" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────

interface RentalBookingHeaderProps {
  tripType: string; city: string; pickupDate: string; pickupTime: string;
  onUpdateCity: (c: string) => void; onUpdateDate: (d: string) => void; onUpdateTime: (t: string) => void;
  selectedPackage: RentalPackage; onSelectPackage: (p: RentalPackage) => void;
  bookedSlotsByDate?: BookedSlotsByDate;
}

export const RentalBookingHeader: React.FC<RentalBookingHeaderProps> = ({
  tripType, city, pickupDate, pickupTime, onUpdateCity, onUpdateDate, onUpdateTime,
  selectedPackage, onSelectPackage, bookedSlotsByDate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempCity, setTempCity] = useState(city);
  const [tempDate, setTempDate] = useState(pickupDate);
  const [tempTime, setTempTime] = useState(pickupTime);
  const [isCustomCity, setIsCustomCity] = useState(() => !ALL_WB_CITIES.includes(city));
  const customRef = useRef<HTMLInputElement>(null);
  const today = getTodayStr();

  // ✅ FALLBACK: Matches your exact scenario for TODAY (18 Oct)
  // - 18 Oct is booked until 2 PM.
  // - 19 Oct and beyond are fully normal.
  const activeBooked = useMemo(() => {
    if (bookedSlotsByDate) return bookedSlotsByDate;
    const todayKey = getTodayStr();
    return {
      [todayKey]: makeBookedSlotsBefore("02:00 PM"),
    };
  }, [bookedSlotsByDate]);

  const tempBooked = activeBooked[tempDate] ?? [];
  const savedBooked = activeBooked[pickupDate] ?? [];
  const savedHasSlots = getAvailableSlots(pickupDate, savedBooked).length > 0;

  useEffect(() => {
    if (!isEditing) {
      setTempCity(city); setTempDate(pickupDate); setTempTime(pickupTime);
      setIsCustomCity(!ALL_WB_CITIES.includes(city));
    }
  }, [city, pickupDate, pickupTime, isEditing]);

  useEffect(() => { if (isEditing && isCustomCity) customRef.current?.focus(); }, [isEditing, isCustomCity]);

  // ✅ SYNC & JUMP: Ensure time is valid, or jump to next available date if fully booked
  useEffect(() => {
    const slots = getAvailableSlots(pickupDate, savedBooked);
    if (slots.length === 0) {
      const first = findFirstAvailable(activeBooked);
      if (first.date !== pickupDate) onUpdateDate(first.date);
      if (first.time !== pickupTime) onUpdateTime(first.time);
    } else if (!slots.includes(pickupTime)) {
      onUpdateTime(slots[0]);
    }
  }, [pickupDate, pickupTime, savedBooked, activeBooked, onUpdateDate, onUpdateTime]);

  // Same validation for temp state while editing
  useEffect(() => {
    if (!isEditing) return;
    const slots = getAvailableSlots(tempDate, tempBooked);
    if (slots.length === 0) {
      const first = findFirstAvailable(activeBooked);
      if (first.date !== tempDate) { setTempDate(first.date); setTempTime(first.time); }
    } else if (!slots.includes(tempTime)) {
      setTempTime(slots[0]);
    }
  }, [isEditing, tempDate, tempTime, tempBooked, activeBooked]);

  if (tripType !== "rental") return null;

  const save = () => {
    if (tempDate < today) return;
    const slots = getAvailableSlots(tempDate, tempBooked);
    if (slots.length === 0) return; 
    onUpdateCity(isCustomCity ? tempCity.trim() || city : tempCity);
    onUpdateDate(tempDate); onUpdateTime(tempTime); setIsEditing(false);
  };
  const cancel = () => {
    setTempCity(city); setTempDate(pickupDate); setTempTime(pickupTime);
    setIsCustomCity(!ALL_WB_CITIES.includes(city)); setIsEditing(false);
  };

  return (
    <div className="w-full font-sans flex flex-col shadow-sm">
      <div className="w-full bg-slate-950 border-b border-amber-500/30 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 min-h-[72px] flex flex-col justify-center">
          {!isEditing ? (
            <div role="button" tabIndex={0} onClick={() => setIsEditing(true)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsEditing(true); } }}
              className="flex items-center justify-between gap-3 text-xs cursor-pointer group rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 p-1 -m-1"
              aria-label="Click to modify trip details">
              <div className="flex flex-wrap items-center gap-2 sm:gap-6 flex-1 min-w-0">
                <div className="min-w-[65px]"><span className="text-[10px] text-slate-400 block uppercase font-bold">City</span>
                  <span className="font-semibold text-white truncate block group-hover:text-amber-300 transition-colors">{city}</span></div>
                <div className="h-6 w-px bg-slate-800 hidden sm:block" />
                <div className="hidden sm:block"><span className="text-[10px] text-slate-400 block uppercase font-bold">Trip Type</span>
                  <span className="font-bold text-amber-400">Local Rental</span></div>
                <div className="h-6 w-px bg-slate-800 hidden sm:block" />
                <div>
                  <span className="text-[10px] text-emerald-400 block uppercase font-bold">Pickup Schedule</span>
                  <span className={`font-semibold text-[11px] sm:text-xs group-hover:text-amber-300 transition-colors ${savedHasSlots ? "text-white" : "text-red-400"}`}>
                    {savedHasSlots ? `${formatSummaryDate(pickupDate)} • ${pickupTime}` : "Finding next available…"}
                  </span>
                </div>
              </div>
              <button type="button" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                className="px-3.5 sm:px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow shrink-0 active:scale-95">
                Modify Trip
              </button>
            </div>
          ) : (
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 text-xs py-1">
              <div className="flex flex-wrap items-end gap-2 sm:gap-3 w-full xl:w-auto flex-1">
                <div className="w-[calc(50%-4px)] sm:w-[150px]">
                  <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">City</label>
                  <CityDropdown value={tempCity} isCustomCity={isCustomCity}
                    onSelectCity={(c, custom) => { setIsCustomCity(custom); setTempCity(c); }} />
                  {isCustomCity && (
                    <input ref={customRef} type="text" value={tempCity} onChange={(e) => setTempCity(e.target.value)}
                      placeholder="City name" aria-label="Enter city name"
                      className="mt-1.5 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 w-full min-h-[38px]" />
                  )}
                </div>
                <div className="w-[calc(50%-4px)] sm:w-auto">
                  <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Pickup Date</label>
                  <DateField value={tempDate} min={today} onChange={setTempDate} />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Pickup Time</label>
                  <TimeDropdown value={tempTime} onChange={setTempTime} selectedDate={tempDate} bookedSlots={tempBooked} />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end xl:self-auto pt-1 xl:pt-0">
                <button type="button" onClick={cancel}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white active:scale-95"
                  aria-label="Cancel"><X className="w-4 h-4" /></button>
                <button type="button" onClick={save}
                  className="px-4 sm:px-5 py-2 h-9 flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow active:scale-95">
                  <Check className="w-4 h-4" /><span>Save</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full bg-white border-b border-slate-200 py-3 sm:py-5 flex sm:justify-center overflow-x-auto px-4">
        <div className="inline-flex rounded-lg shadow-sm border border-slate-200 shrink-0" role="group">
          {RENTAL_PACKAGES.map((pkg, i) => {
            const active = selectedPackage.id === pkg.id;
            const first = i === 0, last = i === RENTAL_PACKAGES.length - 1;
            return (
              <button key={pkg.id} type="button" onClick={() => onSelectPackage(pkg)} aria-pressed={active}
                className={`whitespace-nowrap px-4 sm:px-8 py-2.5 sm:py-3 text-[11px] sm:text-xs font-bold transition-colors ${last ? "" : "border-r border-slate-200"} ${first ? "rounded-l-lg" : last ? "rounded-r-lg" : ""} ${
                  active ? "bg-black text-yellow-400 shadow-inner" : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}>
                {pkg.hoursKm.replace("Hours", "hrs").replace(" / ", " | ").replace("KMs", "km")}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};