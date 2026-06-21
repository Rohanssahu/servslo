# Booking Navigation Fix Report

## Problem

`ServiceBookingScreen` expects a `service` object with fields `id`, `label`, `emoji`, `desc`, `price`, `rating`, `basePrice`. Several call sites were navigating to this screen with incomplete objects — missing `desc`, `price`, and `id` in various combinations. Without `id`, the preview-booking API call is silently skipped; without `desc`/`price`, the service card UI renders blank fields.

---

## Call Sites Audited

| # | Location | Entry Point | Status Before Fix |
|---|----------|-------------|-------------------|
| 1 | `HomeScreen.tsx:476` | Smart search result tap | `svc: ServiceResult` — all required fields present; `id` absent (no real ID in search catalog) |
| 2 | `HomeScreen.tsx:763` | Quick services horizontal scroll | `item` from `QUICK_SERVICES` — missing `price` |
| 3 | `HomeScreen.tsx:944` | Most Booked card "Book" tap | Inline literal — missing `desc`, `price` |
| 4 | `HomeScreen.tsx:1061` | Appliance repair tiles | Inline literal — missing `desc`, `price` |
| 5 | `AllServicesScreen.tsx:292` | Service grid "Book Now" | `item: ServiceItem` — all required fields present; `id` absent (API mapping doesn't extract service ID yet) |
| 6 | `NearbyProvidersScreen.tsx:620` | Nearby provider "Book Expert" | Full `service + preSelectedProvider` — `id` absent but optional path works |

---

## Root Cause of Missing `service.id`

`ServiceBookingScreen` uses `service.id` to call `previewBooking()` for live pricing. All current data sources (local catalogs, `QUICK_SERVICES`, `MOST_BOOKED`, `APPLIANCE_ITEMS`) are static mock arrays that have no backend ID. `AllServicesScreen` maps API responses but discards the raw `s.id`, keeping only `s.category` as the `key`.

Until the API mapping in `AllServicesScreen` is updated to forward `id: s.id` (requires confirming the field name in the `/services` response), `service.id` will remain absent and the screen will always use fallback pricing.

---

## Fixes Applied

### 1. `ServiceBookingScreen.tsx` — Dev warning guard

Added a `__DEV__` console warning before the `if (service.id)` guard so developers immediately know the preview API is disabled:

```typescript
if (!service.id && __DEV__) {
  console.warn(
    '[ServiceBookingScreen] service.id missing — previewBooking API disabled, using fallback pricing.',
    {label: service.label},
  );
}
```

**Fallback behaviour** (already present, unchanged):
- Preview API call is skipped.
- `serviceCharge`, `arrivalCharge`, and `amount` remain the hardcoded `basePrice + ARRIVAL_CHARGE` values.
- The screen renders and the user can still proceed to `PaymentScreen`.

---

### 2. `HomeScreen.tsx:763` — Quick services scroll

`QUICK_SERVICES` items have `label`, `emoji`, `desc`, `rating`, `basePrice` but no `price` string.

**Before:**
```typescript
navigation.navigate(ScreenNameEnum.ServiceBookingScreen, { service: item });
```

**After:**
```typescript
navigation.navigate(ScreenNameEnum.ServiceBookingScreen, {
  service: {...item, price: `₹${item.basePrice}+`},
});
```

---

### 3. `HomeScreen.tsx:944` — Most Booked card

**Before:**
```typescript
service: { label: item.title, emoji: item.emoji, basePrice: 160, rating: item.rating }
```

**After:**
```typescript
service: {
  label: item.title,
  emoji: item.emoji,
  desc: 'Professional home service',
  price: item.price,
  basePrice: 160,
  rating: item.rating,
}
```

`item.price` is already present on `MOST_BOOKED` entries (e.g., `'₹160'`).

---

### 4. `HomeScreen.tsx:1061` — Appliance repair tiles

**Before:**
```typescript
service: { label: srv.label, emoji: srv.emoji, basePrice: 299, rating: '4.8' }
```

**After:**
```typescript
service: {
  label: srv.label,
  emoji: srv.emoji,
  desc: 'Expert repair & maintenance',
  price: '₹299+',
  basePrice: 299,
  rating: '4.8',
}
```

---

## Remaining Work

| Item | Owner | Notes |
|------|-------|-------|
| Forward `service.id` from API in `AllServicesScreen` | Backend + Frontend | Needs confirmation of the ID field name in `/services` response (`s.id`?). Update the `getServices()` mapping: `id: s.id` |
| Forward `service.id` from API in search catalog | Frontend | `searchEngine.ts` `CatalogEntry` and `CATALOG` hardcode all entries; once API-backed, wire `id` through |
| Verify `previewBooking()` endpoint is live | Backend | Once `service.id` is available, end-to-end booking preview needs smoke testing |
