import client from './client';

// ── Booking types ─────────────────────────────────────────────────────────────

export interface BookingApiItem {
  id: string;
  service_name: string;
  emoji?: string;
  address: string;
  scheduled_at: string;
  amount: number;
  status: 'active' | 'completed' | 'cancelled';
  step: 'ASSIGNED' | 'EN_ROUTE' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  partner_name?: string | null;
  partner_rating?: string | null;
  eta?: string | null;
}

export interface BookingItem {
  id: string;
  service: string;
  emoji: string;
  address: string;
  datetime: string;
  amount: number;
  status: 'active' | 'completed' | 'cancelled';
  step: string;
  partner: string | null;
  partnerRating: string | null;
  eta: string | null;
}

export interface BookingPreviewRequest {
  service_id: string;
  address_id: string;
  scheduled_day: number;
  scheduled_time: string;
  urgency: '10min' | '30min' | '1hr';
}

export interface BookingPreviewResponse {
  service_charge: number;
  arrival_charge: number;
  total: number;
  estimated_duration?: string;
}

export interface CreateBookingRequest {
  service_id: string;
  address_id: string;
  scheduled_day: number;
  scheduled_time: string;
  urgency: '10min' | '30min' | '1hr';
  payment_mode: 'CASH' | 'UPI';
  pay_plan: 'FULL' | 'ARRIVAL_ONLY';
  coupon_code?: string;
  provider_id?: string;
}

export interface CreateBookingResponse {
  booking_id: string;
  status: string;
  partner?: {
    id?: string;
    name: string;
    initial: string;
    rating: string;
    jobs: number;
    eta: number;
    dist: number;
  };
}

// ── Notification types ────────────────────────────────────────────────────────

export interface NotificationApiItem {
  id: string;
  title: string;
  message: string;
  created_at: string;
  type: 'booking' | 'offer' | 'update' | 'payment';
  icon?: string;
  is_read: boolean;
}

// ── Normalization helpers ─────────────────────────────────────────────────────

const EMOJI_BY_SERVICE: [string, string][] = [
  ['ac', '❄️'],
  ['cleaning', '🧹'],
  ['plumb', '🔧'],
  ['electric', '⚡'],
  ['pest', '🐛'],
  ['carpent', '🪚'],
  ['paint', '🎨'],
  ['salon', '✂️'],
];

function serviceEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of EMOJI_BY_SERVICE) {
    if (lower.includes(key)) return emoji;
  }
  return '🔧';
}

function formatBookingDatetime(iso: string): string {
  try {
    const date = new Date(iso);
    const now = new Date();
    const todayStr = now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const timeStr = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    if (date.toDateString() === todayStr) return `आज, ${timeStr}`;
    if (date.toDateString() === tomorrow.toDateString()) return `कल, ${timeStr}`;

    return (
      date.toLocaleDateString('en-IN', {day: 'numeric', month: 'long'}) +
      `, ${timeStr}`
    );
  } catch {
    return iso;
  }
}

export function formatRelativeTime(iso: string): string {
  try {
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'अभी';
    if (diffMin < 60) return `${diffMin} मिनट पहले`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} घंटे पहले`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay === 1) return 'कल';
    return `${diffDay} दिन पहले`;
  } catch {
    return '';
  }
}

export function normalizeBooking(b: BookingApiItem): BookingItem {
  return {
    id: b.id,
    service: b.service_name,
    emoji: b.emoji ?? serviceEmoji(b.service_name),
    address: b.address,
    datetime: formatBookingDatetime(b.scheduled_at),
    amount: b.amount,
    status: b.status,
    step: b.step,
    partner: b.partner_name ?? null,
    partnerRating: b.partner_rating ?? null,
    eta: b.eta ?? null,
  };
}

// ── API functions ─────────────────────────────────────────────────────────────

export const getBookings = (params?: {status?: string}): Promise<BookingItem[]> =>
  client
    .get<BookingApiItem[]>('/bookings', {params})
    .then(r => r.data.map(normalizeBooking));

export const getBookingById = (id: string): Promise<BookingItem> =>
  client.get<BookingApiItem>(`/bookings/${id}`).then(r => normalizeBooking(r.data));

export const previewBooking = (
  body: BookingPreviewRequest,
): Promise<BookingPreviewResponse> =>
  client.post<BookingPreviewResponse>('/bookings/preview', body).then(r => r.data);

export const createBooking = (
  body: CreateBookingRequest,
): Promise<CreateBookingResponse> =>
  client.post<CreateBookingResponse>('/bookings', body).then(r => r.data);

export const getNotifications = (): Promise<NotificationApiItem[]> =>
  client.get<NotificationApiItem[]>('/notifications').then(r => r.data);

export const markNotificationsRead = (ids: string[]): Promise<void> =>
  client.post('/notifications/read', {ids}).then(() => undefined);
