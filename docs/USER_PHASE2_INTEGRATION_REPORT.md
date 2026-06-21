# User App — Phase 2 API Integration Report

**Date:** 2026-06-21  
**Scope:** Bookings (list + detail + create), Notifications (list + read)

---

## Summary

Phase 2 wired five real API endpoints across four screens, replacing all remaining mock arrays in the booking and notification flows. The `TIME_SLOTS` and `URGENCY_OPTIONS` constants are deliberately preserved pending backend equivalents.

---

## New File

### `src/api/bookingApi.ts`

Central module for all booking and notification API calls.

| Export | Method | Endpoint |
|--------|--------|----------|
| `getBookings(params?)` | GET | `/bookings` |
| `getBookingById(id)` | GET | `/bookings/:id` |
| `previewBooking(body)` | POST | `/bookings/preview` |
| `createBooking(body)` | POST | `/bookings` |
| `getNotifications()` | GET | `/notifications` |
| `markNotificationsRead(ids)` | POST | `/notifications/read` |

Also exports: `normalizeBooking`, `formatRelativeTime`, and all TypeScript interfaces.

---

## Connected Screens

| Screen | File | APIs Wired | Status |
|--------|------|------------|--------|
| MyBookingsScreen | `src/screen/BottamTab/MyBookingsScreen.tsx` | `GET /bookings` | ✅ Fully migrated |
| NotificationList | `src/screen/Feature/NotificationList.tsx` | `GET /notifications`, `POST /notifications/read` | ✅ Fully migrated |
| ServiceBookingScreen | `src/screen/bookingflow/ServiceBookingScreen.tsx` | `POST /bookings/preview` | ✅ Wired (graceful fallback) |
| PaymentScreen | `src/screen/bookingflow/PaymentScreen.tsx` | `POST /bookings` | ✅ Fully migrated |

---

## Mock Data Removed

| Array / Object | File | Replaced With |
|----------------|------|---------------|
| `ALL_BOOKINGS` (5-item static array) | MyBookingsScreen | `getBookings()` + `useState<BookingItem[]>` |
| `notifs` (10-item useMemo using languageStrings) | NotificationList | `getNotifications()` + `normalizeNotification()` |
| `INITIALLY_READ` Set | NotificationList | API `is_read` field |
| Mock `bookingId: \`BK${Date.now()}\`` | ServiceBookingScreen → PaymentScreen | `createBooking()` returns real `booking_id` |

## Mock Data Kept (Intentional)

| Constant | File | Reason |
|----------|------|--------|
| `TIME_SLOTS` | ServiceBookingScreen | No backend equivalent yet |
| `URGENCY_OPTIONS` | ServiceBookingScreen | No backend equivalent yet |
| `ADDRESSES` | ServiceBookingScreen | Awaits `GET /user/addresses` (Phase 3) |
| UPI payment processing | PaymentScreen | Payment gateway integration is a separate phase |

---

## Payload Mismatches

### `GET /bookings` → MyBookingsScreen

| Backend Field | UI Field | Notes |
|---------------|----------|-------|
| `service_name` | `service` | Mapped in `normalizeBooking()` |
| `scheduled_at` (ISO 8601) | `datetime` (Hindi display string) | Formatted by `formatBookingDatetime()` |
| `partner_name` | `partner` | Mapped |
| `partner_rating` | `partnerRating` | Mapped |
| `emoji` (optional) | `emoji` | Falls back to `serviceEmoji()` lookup if absent |
| `eta` (optional) | `eta` | Falls back to `null` |

### `GET /notifications` → NotificationList

| Backend Field | UI Field | Notes |
|---------------|----------|-------|
| `is_read` | `read` | Mapped in `normalizeNotification()` |
| `created_at` (ISO 8601) | `time` (relative Hindi string) | Formatted by `formatRelativeTime()` |
| `icon` (optional) | `icon` | Falls back to `TYPE_ICONS[type]` if absent |

### `POST /bookings/preview` — ServiceBookingScreen

| UI Sends | Field | Notes |
|----------|-------|-------|
| `service.id` | `service_id` | **Missing in current nav params** — see below |
| `selectedAddr` | `address_id` | Currently `'1'` or `'2'` (hardcoded placeholder) |
| `selectedDay` | `scheduled_day` | 0=today, 1=tomorrow, 2=day after |
| `selectedTime` | `scheduled_time` | Hindi time string e.g. `"9 बजे"` |
| `selectedUrgency` | `urgency` | `'10min' \| '30min' \| '1hr'` |

### `POST /bookings` — PaymentScreen

| UI Sends | Field | Notes |
|----------|-------|-------|
| `serviceId` | `service_id` | Passed from ServiceBookingScreen |
| `addressId` | `address_id` | Placeholder ID until addresses API wired |
| `mode` | `payment_mode` | `'CASH' \| 'UPI'` |
| `payPlan` | `pay_plan` | `'FULL' \| 'ARRIVAL_ONLY'` |
| `appliedCoupon?.code` | `coupon_code` | Optional |
| `preSelectedProvider?.id` | `provider_id` | Optional; `id` field not yet in PreSelectedProvider type |

---

## Missing Backend Fields

| Field | Where Needed | Impact | Recommendation |
|-------|-------------|--------|----------------|
| `service.id` | ServiceBookingScreen nav params | Preview API not called; falls back to hardcoded pricing | Services from `GET /services` include `id` — pass it through nav params when navigating to ServiceBookingScreen |
| `address_id` (real) | ServiceBookingScreen → PaymentScreen | Wrong address sent to backend | Wire `GET /user/addresses` (Phase 3) and replace hardcoded ADDRESSES |
| `provider_id` on PreSelectedProvider | PaymentScreen | Pre-selected provider not pinned on backend | Add `id` field to PreSelectedProvider type and populate from provider list API |
| `emoji` on BookingApiItem | MyBookingsScreen | Auto-derived from service name — may mismatch | Backend should store and return service emoji |
| `icon` on NotificationApiItem | NotificationList | Auto-derived from notification type | Backend should return icon name (MaterialCommunityIcons) |
| `scheduled_time` format | BookingPreviewRequest | Backend may reject Hindi time strings | Backend should define accepted format (e.g. `"09:00"`) and TIME_SLOTS updated accordingly |

---

## UX Changes

- **MyBookingsScreen**: Added `ActivityIndicator` on initial load, `RefreshControl` for pull-to-refresh, and an error state with retry button.
- **NotificationList**: Added loading spinner, error state with retry, and optimistic read-marking (local state updates immediately; API call fires in background).
- **ServiceBookingScreen**: "Book Service" button shows `ActivityIndicator` while the preview API call is in flight and is disabled to prevent double-tap.
- **PaymentScreen**: `payNow` is now `async`; shows modal on booking success, dismisses it and shows an `Alert` on booking failure.

---

## Screens Not Yet Migrated (Phase 3 Candidates)

| Screen | Missing API |
|--------|-------------|
| BookingDetailsScreen | `GET /bookings/:id` (function exists, screen not yet wired) |
| BookingTrackScreen | Real-time partner location |
| InvoiceScreen | `GET /bookings/:id/invoice` |
| AddressesScreen | `GET /user/addresses`, `POST /user/addresses` |
| ProfileSettingsScreen | `GET /user/profile`, `PUT /user/profile` |
