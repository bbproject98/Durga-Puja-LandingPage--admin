export type FleetCategory = 'sedan' | 'suv' | 'traveller';

export interface Vehicle {
  id: string;
  name: string;
  models: string;
  seats: number;
  luggage: string;
  category: FleetCategory;
  tag: string;
  badgeType: 'gold' | 'crimson';
  image: string;
  basePrice: number;
  baseHours: number;
  baseKm: number;
  nightPrice: number;
  perExtraHour: number;
  outstationPerKm: number;
  packageRates?: Record<string, number>;
  features: string[];
  inclusions: string[];
  exclusions: string[];
  altRental?: string;
  altOutstation?: string;
}

export type PackageType = 'pandal' | 'outstation';

export interface PackageItem {
  id: string;
  type: PackageType;
  title: string;
  subtitle: string;
  duration?: string;
  distance?: string;
  highlights: string[];
  foodStop?: string;
  bestTime?: string;
  badge: string;
  pricingMultiplier?: number;
}

export interface BookingState {
  selectedVehicleId: string;
  selectedPackageId: string;
  selectedDate: string;
  timeSlot: string;
  pickupLocation: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  passengers: number;
  notes: string;
  addons: {
    vipPass: boolean;
    guide: boolean;
    sweets: boolean;
    wheelchair: boolean;
  };
}

export interface ConfirmedBooking {
  refId: string;
  timestamp: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupLocation: string;
  vehicle: string;
  vehicleModel: string;
  package: string;
  date: string;
  slot: string;
  passengers: number;
  addons: {
    vipPass: boolean;
    guide: boolean;
    sweets: boolean;
    wheelchair: boolean;
  };
  payMode: string;
  totalFare: string;
  advanceToPay: string;
}
