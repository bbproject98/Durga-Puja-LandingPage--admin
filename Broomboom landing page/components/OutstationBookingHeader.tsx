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

const getCurrentTimeStr = (): string => {
  const now = new Date();
  const h = now.getHours() % 12 || 12;
  const ampm = now.getHours() < 12 ? "AM" : "PM";
  const mm = now.getMinutes().toString().padStart(2, "0");
  return `${h.toString().padStart(2, "0")}:${mm} ${ampm}`;
};

const isToday = (dateStr: string): boolean => {
  const today = new Date().toISOString().split("T")[0];
  return dateStr === today;
};

const getTodayStr = (): string => new Date().toISOString().split("T")[0];

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

// --- Custom Time Dropdown Component ---
interface TimeDropdownProps {
  value: string;
  onChange: (time: string) => void;
  selectedDate: string;
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({ value, onChange, selectedDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const availableSlots = useMemo(() => {
    if (isToday(selectedDate)) {
      const nowMinutes = timeToMinutes(getCurrentTimeStr());
      const nextQuarter = Math.ceil(nowMinutes / 15) * 15;
      return ALL_TIME_SLOTS.filter(slot => timeToMinutes(slot) >= nextQuarter);
    }
    return ALL_TIME_SLOTS;
  }, [selectedDate]);

  useEffect(() => {
    if (availableSlots.length > 0 && !availableSlots.includes(value)) {
      onChange(availableSlots[0]);
    }
  }, [availableSlots, value, onChange]);

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
    if (isOpen && listRef.current && !isToday(selectedDate)) {
      listRef.current.scrollTop = 0;
    }
  }, [isOpen, selectedDate]);

  if (availableSlots.length === 0) {
    return (
      <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 w-full md:w-[130px] flex items-center justify-between opacity-60">
        <span>No slots</span>
      </div>
    );
  }

  return (
    <div className="relative w-full md:w-[130px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 text-white text-base sm:text-xs px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 w-full flex items-center justify-between min-h-[38px]"
      >
        <span>{value}</span>
        <ChevronDown className="w-3 h-3 ml-2 opacity-60" />
      </button>

      {isOpen && (
        <div
          ref={listRef}
          className="absolute z-10 mt-1 w-full min-w-[130px] bg-slate-900 border border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
        >
          {availableSlots.map((time) => (
            <div
              key={time}
              onClick={() => {
                onChange(time);
                setIsOpen(false);
              }}
              className={`px-3 py-1.5 text-xs text-white hover:bg-amber-500/20 cursor-pointer transition-colors ${
                time === value ? "bg-amber-500/20 text-amber-400 font-semibold" : ""
              }`}
            >
              {time}
            </div>
          ))}
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
    const el = inputRef.current;
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
    <div className="relative w-full sm:w-[130px] min-h-[38px] group">
      {/* Visible bar — the whole thing is covered by the invisible input below */}
      <div className="pointer-events-none bg-slate-900 text-white text-base sm:text-xs px-3 py-2 rounded-lg border border-slate-700 group-focus-within:border-amber-400 w-full min-h-[38px] flex items-center justify-between">
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
  returnTime = "10:00 AM",
  onUpdateDetails,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Temp states for editing
  const [tempTripType, setTempTripType] = useState<"oneWay" | "roundTrip">(tripType);
  const [tempFromCity, setTempFromCity] = useState(fromCity);
  const [tempToCity, setTempToCity] = useState(toCity);
  const [tempDate, setTempDate] = useState(pickupDate);
  const [tempTime, setTempTime] = useState(pickupTime);
  const [tempReturnDate, setTempReturnDate] = useState(returnDate || getTodayStr());
  const [tempReturnTime, setTempReturnTime] = useState(returnTime);

  const today = getTodayStr();

  // Validate times on edit open/date change
  useEffect(() => {
    if (isEditing && isToday(tempDate)) {
      const currentMinutes = timeToMinutes(getCurrentTimeStr());
      const selectedMinutes = timeToMinutes(tempTime);
      if (selectedMinutes < currentMinutes) {
        setTempTime(getNextQuarterHour());
      }
    }
  }, [tempDate, isEditing, tempTime]);

  const handleSave = () => {
    onUpdateDetails({
      tripType: tempTripType,
      fromCity: tempFromCity,
      toCity: tempToCity,
      pickupDate: tempDate,
      pickupTime: tempTime,
      returnDate: tempTripType === "roundTrip" ? tempReturnDate : "",
      returnTime: tempTripType === "roundTrip" ? tempReturnTime : "",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempTripType(tripType);
    setTempFromCity(fromCity);
    setTempToCity(toCity);
    setTempDate(pickupDate);
    setTempTime(pickupTime);
    setTempReturnDate(returnDate || getTodayStr());
    setTempReturnTime(returnTime);
    setIsEditing(false);
  };

  return (
    <div className="w-full font-sans flex flex-col shadow-sm mb-6">
      <div className="w-full bg-slate-950 border-b border-amber-500/30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 min-h-[72px] flex flex-col justify-center">
          
          {!isEditing ? (
            /* --- SUMMARY VIEW --- */
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fadeIn">
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 flex-1 w-full sm:w-auto">
                
                {/* Route */}
                <div className="flex items-center gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">From</span>
                    <span className="font-semibold text-white">{fromCity}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 mt-2" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">To</span>
                    <span className="font-semibold text-white">{toCity || "Select City"}</span>
                  </div>
                </div>

                <div className="h-6 w-px bg-slate-800 hidden xs:block" />
                
                {/* Trip Type */}
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Trip Type</span>
                  <span className="font-bold text-amber-400">
                    {tripType === "oneWay" ? "One-Way Drop" : "Round Trip"}
                  </span>
                </div>
                
                <div className="h-6 w-px bg-slate-800 hidden sm:block" />
                
                {/* Departure */}
                <div>
                  <span className="text-[10px] text-emerald-400 block uppercase font-bold">Departure</span>
                  <span className="font-semibold text-white">{pickupDate} • {pickupTime}</span>
                </div>

                {/* Return (Conditional) */}
                {tripType === "roundTrip" && returnDate && (
                  <>
                    <div className="h-6 w-px bg-slate-800 hidden sm:block" />
                    <div>
                      <span className="text-[10px] text-emerald-400 block uppercase font-bold">Return</span>
                      <span className="font-semibold text-white">{returnDate} • {returnTime}</span>
                    </div>
                  </>
                )}

              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] uppercase tracking-wider transition-colors shadow shrink-0 text-center min-h-[38px] flex items-center justify-center"
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
                    onClick={() => setTempTripType("oneWay")}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border min-h-[36px] ${
                      tempTripType === "oneWay" ? "bg-amber-400 text-black border-amber-400" : "text-slate-400 border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    One Way Drop
                  </button>
                  <button 
                    onClick={() => setTempTripType("roundTrip")}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border min-h-[36px] ${
                      tempTripType === "roundTrip" ? "bg-amber-400 text-black border-amber-400" : "text-slate-400 border-slate-700 hover:bg-slate-800"
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
                  
                  {/* To Dropdown mapping ALL Outstation Routes */}
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

                  {/* Pickup — fully clickable bar */}
                  <div className="col-span-1 sm:w-auto">
                    <label className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Pickup Date</label>
                    <DateField
                      value={tempDate}
                      min={today}
                      onChange={(newDate) => {
                        setTempDate(newDate);
                        // Prevent return date being before new pickup date
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

                  {/* Return (Conditional) — fully clickable bar */}
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
                        <TimeDropdown value={tempReturnTime} onChange={setTempReturnTime} selectedDate={tempReturnDate} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end mt-2 xl:mt-0">
                <button
                  onClick={handleCancel}
                  className="px-4 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-xs font-semibold min-h-[38px]"
                >
                  <X className="w-4 h-4 sm:mr-1" />
                  <span className="sm:inline">Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-5 py-2 h-9 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] uppercase tracking-wider transition-colors shadow min-h-[38px]"
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