"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Check, X, ChevronDown, ArrowRight, CalendarDays } from "lucide-react";

// --- Helpers ---
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

const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [time, ampm] = timeStr.split(" ");
  if (!time || !ampm) return 0;
  let [hours, minutes] = time.split(":").map(Number);
  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const getTodayStr = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isToday = (dateStr: string): boolean => {
  return Boolean(dateStr) && dateStr === getTodayStr();
};

const getCurrentTimeStr = (): string => {
  const now = new Date();
  const hours = now.getHours();
  const h = hours % 12 || 12;
  const ampm = hours < 12 ? "AM" : "PM";
  const mm = now.getMinutes().toString().padStart(2, "0");
  return `${h.toString().padStart(2, "0")}:${mm} ${ampm}`;
};

const getNextQuarterHour = (): string => {
  const now = new Date();
  const minutes = now.getMinutes();
  const nextQuarter = Math.ceil(minutes / 15) * 15;
  now.setMinutes(nextQuarter, 0, 0);
  const hours = now.getHours();
  const h = hours % 12 || 12;
  const ampm = hours < 12 ? "AM" : "PM";
  const mm = now.getMinutes().toString().padStart(2, "0");
  return `${h.toString().padStart(2, "0")}:${mm} ${ampm}`;
};

const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return "Select date";
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return dateStr;
  const parsed = new Date(year, month - 1, day);
  if (isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// NEW: Strictly enforces valid dates and forces current time if date is today
const getValidDateTime = (dateStr: string, timeStr: string): { date: string; time: string } => {
  const today = getTodayStr();
  let finalDate = dateStr || today;
  let finalTime = timeStr || "";

  // 1. If the date is in the past, force it to today
  if (finalDate < today) {
    finalDate = today;
  }

  // 2. If the final date is today, ALWAYS use the current time (next quarter hour)
  //    This overrides any hardcoded default time (like 08:00 AM) passed by the parent.
  if (finalDate === today) {
    finalTime = getNextQuarterHour();
  } else {
     // For future dates, just ensure it's a valid 15-minute interval
     const selectedMinutes = timeToMinutes(finalTime);
     if (!finalTime || selectedMinutes % 15 !== 0) {
       finalTime = "10:00 AM"; // Default fallback for future dates
     }
  }

  return { date: finalDate, time: finalTime };
};

// --- Custom Time Dropdown Component ---
interface TimeDropdownProps {
  value: string;
  onChange: (time: string) => void;
  selectedDate: string;
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({ value, onChange, selectedDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const availableSlots = useMemo(() => {
    if (isToday(selectedDate)) {
      const nowMinutes = timeToMinutes(getCurrentTimeStr());
      const nextQuarter = Math.ceil(nowMinutes / 15) * 15;
      const validSlots = ALL_TIME_SLOTS.filter((slot) => timeToMinutes(slot) >= nextQuarter);

      if (value && !validSlots.includes(value)) {
        return [value, ...validSlots].sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
      }
      return validSlots;
    }
    return ALL_TIME_SLOTS;
  }, [selectedDate, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const idx = availableSlots.indexOf(value);
    setHighlightedIndex(idx >= 0 ? idx : 0);
  }, [isOpen, availableSlots, value]);

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
    }
  };

  if (availableSlots.length === 0) {
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 w-full md:w-[130px] flex items-center justify-between opacity-60 min-h-[38px]">
        <span>No slots</span>
      </div>
    );
  }

  return (
    <div className="relative w-full md:w-[130px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select time"
        className="bg-slate-900 text-white text-base sm:text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 w-full flex items-center justify-between min-h-[38px]"
      >
        <span>{value || availableSlots[0]}</span>
        <ChevronDown className="w-3 h-3 ml-2 opacity-60 shrink-0" />
      </button>

      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-30 mt-1 w-full min-w-[130px] bg-slate-900 border border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
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
}

const DateField: React.FC<DateFieldProps> = ({ value, onChange, min }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const el = inputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null;
    if (!el) return;
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
    <div className="relative w-full sm:w-[130px] min-h-[38px] group">
      <div className="pointer-events-none bg-slate-900 text-white text-base sm:text-xs px-3 py-2 rounded-lg border border-slate-700 group-focus-within:border-amber-400 w-full min-h-[38px] flex items-center justify-between">
        <span className="truncate">{formatDisplayDate(value)}</span>
        <CalendarDays className="w-3.5 h-3.5 ml-2 opacity-60 shrink-0" />
      </div>

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

// --- Main Outstation Header Component ---
interface OutstationBookingHeaderProps {
  tripType: "oneWay" | "roundTrip";
  fromCity: string;
  toCity: string;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  returnTime?: string;
  onUpdateDetails: (details: {
    tripType: "oneWay" | "roundTrip";
    fromCity: string;
    toCity: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
  }) => void;
}

export const OutstationBookingHeader: React.FC<OutstationBookingHeaderProps> = ({
  tripType,
  fromCity,
  toCity,
  pickupDate,
  pickupTime,
  returnDate = "",
  returnTime = "",
  onUpdateDetails,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Sanitize incoming props so we never display a past date/time
  // If the date is today, this will force the current time (ignoring hardcoded props like 08:00 AM)
  const displayPickup = getValidDateTime(pickupDate, pickupTime);
  const displayReturn = getValidDateTime(returnDate || pickupDate, returnTime || pickupTime);

  const [tempTripType, setTempTripType] = useState<"oneWay" | "roundTrip">(tripType);
  const [tempFromCity, setTempFromCity] = useState(fromCity);
  const [tempToCity, setTempToCity] = useState(toCity);
  
  const [tempDate, setTempDate] = useState<string>(displayPickup.date);
  const [tempTime, setTempTime] = useState<string>(displayPickup.time);
  const [tempReturnDate, setTempReturnDate] = useState<string>(displayReturn.date);
  const [tempReturnTime, setTempReturnTime] = useState<string>(displayReturn.time);

  const today = getTodayStr();

  // Sync temp state when entering edit mode or props change
  useEffect(() => {
    if (isEditing) {
      setTempTripType(tripType);
      setTempFromCity(fromCity);
      setTempToCity(toCity);

      const validPickup = getValidDateTime(pickupDate, pickupTime);
      setTempDate(validPickup.date);
      setTempTime(validPickup.time);

      const validReturn = getValidDateTime(returnDate || pickupDate, returnTime || pickupTime);
      setTempReturnDate(validReturn.date);
      setTempReturnTime(validReturn.time);
    }
  }, [isEditing, tripType, fromCity, toCity, pickupDate, pickupTime, returnDate, returnTime]);

  // If today is selected and the chosen pickup time has already passed, bump it forward
  useEffect(() => {
    if (!isEditing) return;
    if (!isToday(tempDate)) return;

    const currentMinutes = timeToMinutes(getCurrentTimeStr());
    const selectedMinutes = timeToMinutes(tempTime);

    if (selectedMinutes < currentMinutes) {
      setTempTime(getNextQuarterHour());
    }
  }, [isEditing, tempDate, tempTime]);

  // If today is selected for return and the chosen return time has already passed, bump it forward
  useEffect(() => {
    if (!isEditing) return;
    if (tempTripType !== "roundTrip") return;
    if (!isToday(tempReturnDate)) return;

    const currentMinutes = timeToMinutes(getCurrentTimeStr());
    const selectedMinutes = timeToMinutes(tempReturnTime);

    if (selectedMinutes < currentMinutes) {
      setTempReturnTime(getNextQuarterHour());
    }
  }, [isEditing, tempTripType, tempReturnDate, tempReturnTime]);

  const handleSave = () => {
    // Double-check validity before saving
    const finalPickup = getValidDateTime(tempDate, tempTime);
    const finalReturn = getValidDateTime(tempReturnDate, tempReturnTime);

    onUpdateDetails({
      tripType: tempTripType,
      fromCity: tempFromCity,
      toCity: tempToCity,
      pickupDate: finalPickup.date,
      pickupTime: finalPickup.time,
      returnDate: tempTripType === "roundTrip" ? finalReturn.date : "",
      returnTime: tempTripType === "roundTrip" ? finalReturn.time : "",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTripType(tripType);
    setTempFromCity(fromCity);
    setTempToCity(toCity);
    setTempDate(displayPickup.date);
    setTempTime(displayPickup.time);
    setTempReturnDate(displayReturn.date);
    setTempReturnTime(displayReturn.time);
    setIsEditing(false);
  };

  return (
    <div className="w-full font-sans flex flex-col shadow-sm mb-6">
      <div className="w-full bg-slate-950 border-b border-amber-500/30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 min-h-[72px] flex flex-col justify-center">
          {!isEditing ? (
            /* --- CLICKABLE SUMMARY VIEW --- */
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsEditing(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsEditing(true);
                }
              }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fadeIn cursor-pointer group rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 p-1 -m-1"
              aria-label="Click to modify trip details"
            >
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 flex-1 w-full sm:w-auto">
                {/* Route */}
                <div className="flex items-center gap-2 group-hover:opacity-90">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">From</span>
                    <span className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                      {fromCity}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 mt-2" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">To</span>
                    <span className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                      {toCity || "Select City"}
                    </span>
                  </div>
                </div>

                <div className="h-6 w-px bg-slate-800 hidden xs:block" />

                {/* Trip Type */}
                <div className="group-hover:opacity-90">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Trip Type</span>
                  <span className="font-bold text-amber-400">
                    {tripType === "oneWay" ? "One-Way Drop" : "Round Trip"}
                  </span>
                </div>

                <div className="h-6 w-px bg-slate-800 hidden sm:block" />

                {/* Departure - Using sanitized display values */}
                <div className="group-hover:opacity-90">
                  <span className="text-[10px] text-emerald-400 block uppercase font-bold">Departure</span>
                  <span className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                    {formatDisplayDate(displayPickup.date)} • {displayPickup.time}
                  </span>
                </div>

                {/* Return (Conditional) - Using sanitized display values */}
                {tripType === "roundTrip" && displayReturn.date && (
                  <>
                    <div className="h-6 w-px bg-slate-800 hidden sm:block" />
                    <div className="group-hover:opacity-90">
                      <span className="text-[10px] text-emerald-400 block uppercase font-bold">Return</span>
                      <span className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {formatDisplayDate(displayReturn.date)} • {displayReturn.time}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] uppercase tracking-wider transition-colors shadow shrink-0 text-center min-h-[38px] flex items-center justify-center active:scale-95"
              >
                Modify Trip
              </button>
            </div>
          ) : (
            /* --- EDIT VIEW --- */
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 text-xs animate-fadeIn py-2 w-full">
              <div className="flex flex-col gap-3 w-full xl:w-auto flex-1">
                {/* Type Toggle */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTempTripType("oneWay")}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border min-h-[36px] ${
                      tempTripType === "oneWay"
                        ? "bg-amber-400 text-black border-amber-400"
                        : "text-slate-400 border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    One Way Drop
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempTripType("roundTrip")}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border min-h-[36px] ${
                      tempTripType === "roundTrip"
                        ? "bg-amber-400 text-black border-amber-400"
                        : "text-slate-400 border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    Round Trip
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-end gap-2.5 sm:gap-4 w-full">
                  {/* From */}
                  <div className="col-span-1 sm:w-auto">
                    <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">From</label>
                    <input
                      type="text"
                      value={tempFromCity}
                      onChange={(e) => setTempFromCity(e.target.value)}
                      className="bg-slate-900 text-white text-base sm:text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 w-full sm:w-[120px] min-h-[38px]"
                    />
                  </div>

                  {/* To Dropdown */}
                  <div className="col-span-1 sm:w-auto">
                    <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">To</label>
                    <select
                      value={tempToCity}
                      onChange={(e) => setTempToCity(e.target.value)}
                      className="bg-slate-900 text-white text-base sm:text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 w-full sm:w-[140px] min-h-[38px]"
                    >
                      <option value="">Select City</option>
                      <option value="Digha">Digha</option>
                      <option value="Mandarmani">Mandarmani</option>
                      <option value="Shantiniketan">Shantiniketan (Bolpur)</option>
                      <option value="Deoghar">Deoghar</option>
                      <option value="Ranchi">Ranchi</option>
                      <option value="Jamshedpur">Jamshedpur</option>
                      <option value="Bhubaneswar">Bhubaneswar</option>
                      <option value="Puri">Puri</option>
                      <option value="Darjeeling">Darjeeling</option>
                      <option value="Gangtok">Gangtok</option>
                      <option value="Ganga Sagar">Ganga Sagar</option>
                      <option value="Mayapur">Mayapur</option>
                    </select>
                  </div>

                  {/* Pickup */}
                  <div className="col-span-1 sm:w-auto">
                    <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Pickup Date</label>
                    <DateField
                      value={tempDate}
                      min={today}
                      onChange={(newDate) => {
                        setTempDate(newDate);
                        if (tempTripType === "roundTrip" && tempReturnDate < newDate) {
                          setTempReturnDate(newDate);
                        }
                      }}
                    />
                  </div>
                  <div className="col-span-1 sm:w-auto">
                    <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Time</label>
                    <TimeDropdown value={tempTime} onChange={setTempTime} selectedDate={tempDate} />
                  </div>

                  {/* Return (Conditional) */}
                  {tempTripType === "roundTrip" && (
                    <>
                      <div className="col-span-1 sm:w-auto">
                        <label className="text-[10px] text-amber-400 block uppercase font-bold mb-1">Return Date</label>
                        <DateField
                          value={tempReturnDate}
                          min={tempDate || today}
                          onChange={(newDate) => setTempReturnDate(newDate)}
                        />
                      </div>
                      <div className="col-span-1 sm:w-auto">
                        <label className="text-[10px] text-amber-400 block uppercase font-bold mb-1">Time</label>
                        <TimeDropdown
                          value={tempReturnTime}
                          onChange={setTempReturnTime}
                          selectedDate={tempReturnDate}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end mt-2 xl:mt-0">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-xs font-semibold min-h-[38px] active:scale-95"
                >
                  <X className="w-4 h-4 sm:mr-1" />
                  <span className="sm:inline">Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-5 py-2 h-9 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-wider transition-colors shadow min-h-[38px] active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};