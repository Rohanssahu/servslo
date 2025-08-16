// src/services/api.ts
export type LatLng = { latitude: number; longitude: number };

export type Partner = {
  id: string;
  name: string;
  rating: number;
  phone: string;
  avatarUrl?: string;
  vehicle?: string;
};

export type BookingStatus =
  | 'SEARCHING'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'OTP_VERIFIED'
  | 'IN_PROGRESS'
  | 'COMPLETED';

export type Booking = {
  id: string;
  serviceName: string;
  address: string;
  scheduledFor?: string;
  otp: string;
  baseFare: number;
  taxes: number;
  discount: number;
  estimate: number;
  customerNote?: string;
  partner?: Partner | null;
  pickup: LatLng;
  drop: LatLng;
  status: BookingStatus;
};

const MOCK: Booking = {
  id: 'BK-102938',
  serviceName: 'Intense Bathroom Cleaning',
  address: '303, Sai Residency, Vijay Nagar, Indore, MP',
  otp: '4829',
  baseFare: 459,
  taxes: 35,
  discount: 25,
  estimate: 469,
  customerNote: 'Please bring eco-friendly cleaner.',
  status: 'SEARCHING',
  partner: {
    name: 'Ravi Kumar',
    rating: 4.8,
    vehicle: 'Maruti Eeco',
    phone: '+91 9876543210',
    distance_km: 1.2 // partner ki current distance
  },
  pickup: { latitude: 22.7545, longitude: 75.893 },
  drop: { latitude: 22.753, longitude: 75.9015 },
};

let bookingDB: Booking = JSON.parse(JSON.stringify(MOCK));

export async function getBooking(id: string): Promise<Booking> {
  await sleep(300);
  return bookingDB;
}

export async function assignPartner(): Promise<void> {
  await sleep(800);
  bookingDB.partner = {
    id: 'PT-445',
    name: 'Rohit Sharma',
    rating: 4.82,
    phone: '+91 98765 43210',
    vehicle: 'Cleaner • ID PT-445',
  };
  bookingDB.status = 'ASSIGNED';
}

export async function updateStatus(status: BookingStatus) {
  await sleep(200);
  bookingDB.status = status;
}

export async function verifyOTP(otp: string) {
  await sleep(300);
  const ok = otp === bookingDB.otp;
  if (ok) bookingDB.status = 'OTP_VERIFIED';
  return ok;
}

export async function completeJob() {
  await sleep(300);
  bookingDB.status = 'COMPLETED';
}

export function resetMock() {
  bookingDB = JSON.parse(JSON.stringify(MOCK));
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
