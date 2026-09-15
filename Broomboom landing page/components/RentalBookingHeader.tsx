"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Check, X, ChevronDown, CalendarDays } from "lucide-react";
import { RENTAL_PACKAGES, RentalPackage } from "@/data/packages";

// --- Helpers ---

// Generate all 15‑minute time slots from 00:00 to 23:45
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const h = hour % 12 || 12;
      const ampm = hour < 12 ? "AM" : "PM";
      const mm = minute.toString().padStart(2, "0");
      slots.push(`${h.toString().padStart(2, "0")}:${mm} ${ampm}`);
    }
  }
  return slots;
};

const ALL_TIME_SLOTS = generateTimeSlots();

// Convert "HH:MM AM/PM" to minutes since midnight
const timeToMinutes = (timeStr: string): number => {
  const [time, ampm] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

// Get the next 15‑minute slot as a string from current time
const getNextQuarterHour = (): string => {
  const now = new Date();
  const minutes = now.getMinutes();
  const nextQuarter = Math.ceil(minutes / 15) * 15;
  now.setMinutes(nextQuarter, 0, 0);
  const h = now.getHours() % 12 || 12;
  const ampm = now.getHours() < 12 ? "AM" : "PM";
  const mm = now.getMinutes().toString().padStart(2, "0");
  return `${h.toString().padStart(2, "0")}:${mm} ${ampm}`;
};

// Get the current time as "HH:MM AM/PM" (rounded to minute)
const getCurrentTimeStr = (): string => {
  const now = new Date();
  const h = now.getHours() % 12 || 12;
  const ampm = now.getHours() < 12 ? "AM" : "PM";
  const mm = now.getMinutes().toString().padStart(2, "0");
  return `${h.toString().padStart(2, "0")}:${mm} ${ampm}`;
};

// Check if a date string (YYYY-MM-DD) is today
const isToday = (dateStr: string): boolean => {
  const today = new Date().toISOString().split("T")[0];
  return dateStr === today;
};

const getTodayStr = (): string => new Date().toISOString().split("T")[0];

// Long form for the date picker field (e.g. "16 Oct 2024")
const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return "Select date";
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Short form for the summary bar (e.g. "Oct 16").
// If the string is already human-readable (e.g. "Oct 16 (Maha Saptami)"),
// it is passed through untouched.
const formatSummaryDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const isIso = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  if (!isIso) return dateStr;
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
};

// --- Custom Time Dropdown Component ---
interface TimeDropdownProps {
  value: string;
  onChange: (time: string) => void;
  selectedDate: string; // YYYY-MM-DD
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({ value, onChange, selectedDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Compute available slots based on the selected date
  const availableSlots = useMemo(() => {
    if (isToday(selectedDate)) {
      const nowMinutes = timeToMinutes(getCurrentTimeStr());
      const nextQuarter = Math.ceil(nowMinutes / 15) * 15;
      return ALL_TIME_SLOTS.filter((slot) => timeToMinutes(slot) >= nextQuarter);
    }
    return ALL_TIME_SLOTS;
  }, [selectedDate]);

  // If current value is not available (e.g., past time for today), auto‑select the first available
  useEffect(() => {
    if (availableSlots.length > 0 && !availableSlots.includes(value)) {
      onChange(availableSlots[0]);
    }
  }, [availableSlots, value, onChange]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset the highlight to the currently selected value whenever the list opens
  useEffect(() => {
    if (!isOpen) return;
    const idx = availableSlots.indexOf(value);
    setHighlightedIndex(idx >= 0 ? idx : 0);
  }, [isOpen, availableSlots, value]);

  // Keep the highlighted option visible inside the scroll container
  useEffect(() => {
    if (!isOpen) return;
    const container = listRef.current;
    if (!container) return;
    const el = container.querySelector<HTMLElement>(`[data-index="${highlightedIndex}"]`);
    if (!el) return;
    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    if (elTop < container.scrollTop) {
      container.scrollTop = elTop;
    } else if (elBottom > container.scrollTop + container.clientHeight) {
      container.scrollTop = elBottom - container.clientHeight;
    }
  }, [isOpen, highlightedIndex]);

  const commitSelection = (index: number) => {
    const time = availableSlots[index];
    if (time) onChange(time);
    setIsOpen(false);
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Opening keys
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setIsOpen(true);
      return;
    }
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, availableSlots.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setHighlightedIndex(availableSlots.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commitSelection(highlightedIndex);
        break;
      case "Escape":
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  if (availableSlots.length === 0) {
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-1 rounded-lg border border-slate-700 w-[180px] flex items-center justify-between opacity-60">
        <span>No slots</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select pickup time"
        className="bg-slate-900 text-white text-xs px-3 py-1 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 w-[180px] flex items-center justify-between"
      >
        <span>{value}</span>
        <ChevronDown className="w-3 h-3 ml-2 opacity-60" />
      </button>

      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-10 mt-1 w-[180px] bg-slate-900 border border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
        >
          {availableSlots.map((time, index) => {
            const isSelected = time === value;
            const isHighlighted = index === highlightedIndex;
            return (
              <div
                key={time}
                data-index={index}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => commitSelection(index)}
                className={`px-3 py-1.5 text-xs text-white cursor-pointer transition-colors ${
                  isHighlighted ? "bg-amber-500/20" : ""
                } ${isSelected ? "text-amber-400 font-semibold" : ""}`}
              >
                {time}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- Custom Clickable Date Field ---
interface DateFieldProps {
  value: string;
  onChange: (date: string) => void;
  min?: string;
  className?: string;
}

const DateField: React.FC<DateFieldProps> = ({ value, onChange, min, className = "" }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const el = inputRef.current as
      | (HTMLInputElement & { showPicker?: () => void })
      | null;
    if (!el) return;
    // showPicker() is supported in Chrome 99+, Edge 99+, Safari 16+, Firefox 101+
    if (typeof el.showPicker === "function") {
      try {
        el.showPicker();
        return;
      } catch {
        /* fall through to focus */
      }
    }
    el.focus();
  };

  return (
    <div className={`relative w-full sm:w-[140px] group ${className}`}>
      {/* Visible bar — the whole thing is covered by the invisible input below */}
      <div className="pointer-events-none bg-slate-900 text-white text-xs px-2.5 sm:px-3 py-2 rounded-lg border border-slate-700 group-focus-within:border-amber-400 w-full flex items-center justify-between min-h-[38px]">
        <span className="truncate">{formatDisplayDate(value)}</span>
        <CalendarDays className="w-3.5 h-3.5 ml-2 opacity-60 shrink-0" />
      </div>

      {/* Invisible native date input stretched over the entire bar */}
      <input
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        aria-label="Select date"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
};

// --- Main Component ---
interface RentalBookingHeaderProps {
  tripType: string;
  city: string;
  pickupDate: string;
  pickupTime: string;
  onUpdateCity: (city: string) => void;
  onUpdateDate: (date: string) => void;
  onUpdateTime: (time: string) => void;
  selectedPackage: RentalPackage;
  onSelectPackage: (pkg: RentalPackage) => void;
}

export const RentalBookingHeader: React.FC<RentalBookingHeaderProps> = ({
  tripType,
  city,
  pickupDate,
  pickupTime,
  onUpdateCity,
  onUpdateDate,
  onUpdateTime,
  selectedPackage,
  onSelectPackage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempCity, setTempCity] = useState(city);
  const [tempDate, setTempDate] = useState(pickupDate);
  const [tempTime, setTempTime] = useState(pickupTime);

  const today = getTodayStr();

  // Keep the local draft state in sync with the props whenever we're NOT editing.
  // This handles async data loading in the parent.
  useEffect(() => {
    if (!isEditing) {
      setTempCity(city);
      setTempDate(pickupDate);
      setTempTime(pickupTime);
    }
  }, [city, pickupDate, pickupTime, isEditing]);

  // Single consolidated effect: while editing, if the date is today and the
  // chosen time has already passed, snap it to the next quarter hour.
  useEffect(() => {
    if (!isEditing) return;
    if (!isToday(tempDate)) return;

    const currentMinutes = timeToMinutes(getCurrentTimeStr());
    const selectedMinutes = timeToMinutes(tempTime);

    if (selectedMinutes < currentMinutes) {
      setTempTime(getNextQuarterHour());
    }
  }, [isEditing, tempDate, tempTime]);

  if (tripType !== "rental") return null;

  const handleSave = () => {
    onUpdateCity(tempCity);
    onUpdateDate(tempDate);
    onUpdateTime(tempTime);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempCity(city);
    setTempDate(pickupDate);
    setTempTime(pickupTime);
    setIsEditing(false);
  };

  return (
    <div className="w-full font-sans flex flex-col shadow-sm">
      {/* --- TOP ROW: DARK TRIP SUMMARY & MODIFY BUTTON --- */}
      <div className="w-full bg-slate-950 border-b border-amber-500/30 transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 min-h-[72px] flex flex-col justify-center">
          {!isEditing ? (
            <div className="flex items-center justify-between gap-3 text-xs animate-fadeIn">
              <div className="flex flex-wrap items-center gap-2 sm:gap-6 flex-1 min-w-0">
                <div className="min-w-[70px]">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">City</span>
                  <span className="font-semibold text-white truncate block">{city}</span>
                </div>
                <div className="h-6 w-px bg-slate-800 hidden sm:block" />
                <div className="hidden sm:block">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Trip Type</span>
                  <span className="font-bold text-amber-400">Local Rental</span>
                </div>
                <div className="h-6 w-px bg-slate-800 hidden sm:block" />
                <div>
                  <span className="text-[10px] text-emerald-400 block uppercase font-bold">
                    Pickup Schedule
                  </span>
                  <span className="font-semibold text-white text-[11px] sm:text-xs">
                    {formatSummaryDate(pickupDate)} • {pickupTime}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3.5 sm:px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] sm:text-[11px] uppercase tracking-wider transition-colors shadow shrink-0 active:scale-95"
              >
                Modify Trip
              </button>
            </div>
          ) : (
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 text-xs animate-fadeIn py-1">
              <div className="flex flex-wrap items-end gap-2.5 sm:gap-4 w-full xl:w-auto flex-1">
                <div className="w-[calc(50%-5px)] sm:w-auto">
                  <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">
                    City
                  </label>
                  <select
                    value={tempCity}
                    onChange={(e) => setTempCity(e.target.value)}
                    className="bg-slate-900 text-white text-xs px-2.5 sm:px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 w-full sm:w-[160px]"
                  >
                    <option value="Kolkata (Citywide)">Kolkata (Citywide)</option>
                    <option value="Howrah">Howrah</option>
                    <option value="Salt Lake">Salt Lake</option>
                    <option value="New Town">New Town</option>
                  </select>
                </div>

                {/* Pickup Date — fully clickable bar */}
                <div className="w-[calc(50%-5px)] sm:w-auto">
                  <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">
                    Pickup Date
                  </label>
                  <DateField value={tempDate} min={today} onChange={(newDate) => setTempDate(newDate)} />
                </div>

                <div className="w-full sm:w-auto">
                  <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">
                    Pickup Time
                  </label>
                  <TimeDropdown value={tempTime} onChange={setTempTime} selectedDate={tempDate} />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end xl:self-auto pt-1 xl:pt-0">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors active:scale-95"
                  aria-label="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 sm:px-5 py-2 h-9 flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-wider transition-colors shadow active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- BOTTOM ROW: SAVAARI STYLE PACKAGE TABS --- */}
      <div className="w-full bg-white border-b border-slate-200 py-3 sm:py-5 flex sm:justify-center overflow-x-auto scrollbar-hide px-4">
        <div className="inline-flex rounded-lg shadow-sm border border-slate-200 shrink-0" role="group">
          {RENTAL_PACKAGES.map((pkg, index) => {
            const isActive = selectedPackage.id === pkg.id;
            const isFirst = index === 0;
            const isLast = index === RENTAL_PACKAGES.length - 1;

            const borderClasses = isLast ? "" : "border-r border-slate-200";
            const roundedClasses = isFirst ? "rounded-l-lg" : isLast ? "rounded-r-lg" : "";

            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => onSelectPackage(pkg)}
                aria-pressed={isActive}
                className={`whitespace-nowrap px-4 sm:px-8 py-2.5 sm:py-3 text-[11px] sm:text-xs font-bold transition-colors ${borderClasses} ${roundedClasses} ${
                  isActive
                    ? "bg-black text-yellow-400 shadow-inner"
                    : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {pkg.hoursKm.replace("Hours", "hrs").replace(" / ", " | ").replace("KMs", "km")}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};