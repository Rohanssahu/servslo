# User App Phase 3 Report — Static Catalog Replacement

## Objective

Replace the three remaining static service catalogs (Quick Services, Appliance Tiles, Smart Search) with live data from `GET /services`, ensuring every navigating service carries a real `service.id` so the Booking Preview API (`POST /bookings/preview`) can be called from all entry points.

---

## Static Arrays Removed

### 1. `QUICK_SERVICES` — `HomeScreen.tsx` (line ~347)

**Before:** Hardcoded array of 8 items inside the component body. No `id`, no `price`.

```typescript
const QUICK_SERVICES = [
  { label: t.electrician, emoji: '⚡', desc: t.wiringRepairs, rating: '4.8', basePrice: 199 },
  { label: t.plumber, emoji: '🔧', desc: t.leaksPipesTaps, rating: '4.7', basePrice: 149 },
  // ...
  { label: t.more, emoji: '➕', desc: '', rating: '4.8', basePrice: 0 },
];
```

**After:** Replaced with a derived `quickServices` variable. When `rawApiServices` is loaded from `GET /services`, shows the first 7 API services (with `id`) plus a static "More" item. Falls back to `QUICK_SERVICES_FALLBACK` (translated, full price fields) while the API loads or if it fails.

```typescript
const quickServices = rawApiServices.length > 0
  ? [
      ...rawApiServices.slice(0, 7).map(s => ({
        id: s.id,
        label: lang === 'hi' ? s.name : s.name_en,
        emoji: s.emoji,
        desc: s.tags?.[0] ?? s.category,
        price: `₹${Math.round(s.base_price / 100)}+`,
        rating: s.rating?.toFixed(1) ?? '4.8',
        basePrice: Math.round(s.base_price / 100),
      })),
      {label: t.more, emoji: '➕', desc: '', price: '', rating: '', basePrice: 0},
    ]
  : QUICK_SERVICES_FALLBACK;
```

**Navigation simplified:**
```typescript
// Before:  service: {...item, price: `₹${item.basePrice}+`}  (price was missing from array)
// After:   service: item                                       (price included in item)
navigation.navigate(ScreenNameEnum.ServiceBookingScreen, {service: item});
```

---

### 2. `APPLIANCE_ITEMS` — `HomeScreen.tsx` (line ~363)

**Before:** Hardcoded array with only `label` and `emoji`. Navigation constructed all other fields inline with hardcoded values (`basePrice: 299`, `rating: '4.8'`).

```typescript
const APPLIANCE_ITEMS = [
  { label: t.acService, emoji: '❄️' },
  { label: t.washingMachine, emoji: '🫧' },
  // ...
];
// Navigation:
service: { label: srv.label, emoji: srv.emoji, desc: 'Expert repair & maintenance',
           price: '₹299+', basePrice: 299, rating: '4.8' }
```

**After:** Replaced with `applianceServices` derived from API (filtered by `category === 'appliance'`). Fallback is `APPLIANCE_ITEMS_FALLBACK` with full fields including per-service prices.

```typescript
const applianceServices = rawApiServices.length > 0
  ? rawApiServices
      .filter(s => s.category === 'appliance')
      .map(s => ({ id: s.id, label, emoji, desc, price, rating, basePrice }))
  : APPLIANCE_ITEMS_FALLBACK;

// Navigation simplified:
navigation.navigate(ScreenNameEnum.ServiceBookingScreen, {service: srv});
```

---

### 3. `CATALOG` (hardcoded) — `searchEngine.ts`

**Before:** Static `CATALOG` array of 27 entries used directly by `search()`. No IDs, aliases were hardcoded.

**After:** `CATALOG` is kept as the authoritative alias reference. A new mutable `activeCatalog` variable is initialized to `CATALOG` and replaced when `initSearchCatalog()` is called. The merge strategy:

1. For each hardcoded entry, find a matching API service by label (`name_en` / `name`). If matched, attach `id` — preserving all rich aliases.
2. API services with no hardcoded match are appended as new entries using `tags` as aliases.

```typescript
export function initSearchCatalog(services: ApiService[]): void {
  const merged = CATALOG.map(entry => {
    const match = services.find(s =>
      s.name_en.toLowerCase() === entry.label.toLowerCase() ||
      s.name.toLowerCase() === entry.label.toLowerCase(),
    );
    return match ? {...entry, id: match.id} : entry;
  });
  // append uncovered API services...
  activeCatalog = [...merged, ...extra];
}
```

`initSearchCatalog()` is called from `HomeScreen.tsx` immediately after `getServices()` resolves, so both HomeScreen search and AllServicesScreen search benefit.

---

## API Fetch Wiring

`HomeScreen.tsx` now calls both APIs in the same `useEffect([lang])`:

```typescript
useEffect(() => {
  getHomeFeed().then(...).catch(() => {});

  getServices()
    .then(res => {
      setRawApiServices(res.services);   // powers quickServices + applianceServices
      initSearchCatalog(res.services);   // powers Smart Search
    })
    .catch(() => {});                    // keeps static fallbacks on failure
}, [lang]);
```

---

## Booking Preview API — Status by Entry Point

| Entry point | `service.id` source | Preview API |
|---|---|---|
| **Quick Services scroll** | `s.id` from `GET /services` | ✅ Enabled when API live |
| **Appliance Tiles** | `s.id` from `GET /services` (category=appliance) | ✅ Enabled when API live |
| **Smart Search results** | `s.id` merged via `initSearchCatalog()` | ✅ Enabled when API live |
| **AllServicesScreen grid** | `s.id` from `GET /services` (Phase 2.1) | ✅ Enabled when API live |
| **HomeScreen — Most Booked** | `s.id` from `GET /home/feed` (Phase 2.1) | ✅ Enabled when API live |
| **NearbyProvidersScreen** | No service ID — provider data only | ⚠️ Fallback pricing |

---

## Remaining Mock Data

These arrays remain hardcoded — they either don't navigate directly to `ServiceBookingScreen` or are a separate UX feature:

| Array | Location | Reason kept static |
|---|---|---|
| `DEALS` | `HomeScreen.tsx` | Pricing packages → opens `ServiceBottomSheet`, not booking |
| `SALON_ITEMS` | `HomeScreen.tsx` | Navigates to `AllServicesScreen` (category=salon) — no direct booking |
| `SMALL_TILES` | `HomeScreen.tsx` | Opens `ServiceBottomSheet` with a service key — no direct booking |
| `DAILY_HOME_SERVICES` | `HomeScreen.tsx` | Subscription feature, different flow |
| `SUBSCRIPTION_SERVICES` | `HomeScreen.tsx` | Subscription flow — not one-time booking |
| `LIVE_PROVIDERS` | `HomeScreen.tsx` | Navigates to `NearbyProvidersScreen` — no direct service booking |
| `MOST_BOOKED` (static) | `HomeScreen.tsx` | Used as fallback only — replaced by API data when `GET /home/feed` loads |

---

## Remaining Fallback-Pricing Paths

Screens that still reach `ServiceBookingScreen` without `service.id`:

1. **NearbyProvidersScreen** — provider objects carry no `service_id`. Fix requires `GET /providers` to return a `service_id` per provider.
2. **HomeScreen Quick Services / Appliance** (fallback state only) — when `GET /services` fails, `QUICK_SERVICES_FALLBACK` and `APPLIANCE_ITEMS_FALLBACK` are used. These have no `id`. The dev warning in `ServiceBookingScreen` fires, fallback pricing is shown.
3. **Smart Search** (fallback state only) — before `initSearchCatalog()` is called (first seconds of app load, or on API failure), `activeCatalog` is the hardcoded `CATALOG` with no IDs.

---

## Files Changed

| File | Change |
|---|---|
| `src/utils/searchEngine.ts` | Added `ApiService` type, `activeCatalog` mutable variable, `initSearchCatalog()` export. `search()` uses `activeCatalog`. |
| `src/screen/BottamTab/HomeScreen.tsx` | Added `getServices`, `ServiceItem`, `initSearchCatalog` imports. Added `rawApiServices` state. Added `getServices()` call in useEffect. Replaced `QUICK_SERVICES` with `QUICK_SERVICES_FALLBACK + quickServices`. Replaced `APPLIANCE_ITEMS` with `APPLIANCE_ITEMS_FALLBACK + applianceServices`. Simplified both navigation calls. |
