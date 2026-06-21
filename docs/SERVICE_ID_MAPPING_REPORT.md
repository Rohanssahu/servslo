# Service ID Mapping Report — Phase 2.1

## Backend Field Name

**`id: string`**

Defined in `src/api/serviceApi.ts`:

```typescript
export interface ServiceItem {          // GET /services response shape
  id: string;                           // ← authoritative service ID
  name: string;
  name_en: string;
  emoji: string;
  category: string;
  base_price: number;
  rating: number;
  review_count: number;
  is_available: boolean;
  tags?: string[];
}

export interface HomeFeedItem {         // GET /home/feed most_booked shape
  id: string;                           // ← authoritative service ID
  name: string;
  name_en: string;
  emoji: string;
  base_price: number;
  category: string;
  booking_count?: number;
  rating?: number;
}
```

No `_id`, `service_id`, or `slug` fields exist on either API type.

---

## UI Field Name

All UI components standardise on **`service.id`** — the optional `id?: string` field on the service object passed to `ServiceBookingScreen`.

---

## Every Mapping Location

### 1. `src/screen/Feature/AllServicesScreen.tsx` — GET /services

**Type** (line 43):
```typescript
type ServiceItem = {
  id?: string;   // ← added in Phase 2.1
  key: string;
  ...
};
```

**Mapping** (line ~78):
```typescript
const mapped: ServiceItem[] = res.services.map(s => ({
  id: s.id,      // ← added in Phase 2.1
  key: s.category,
  label: lang === 'hi' ? s.name : s.name_en,
  emoji: s.emoji,
  desc: s.tags?.join(', ') ?? s.category,
  price: `₹${Math.round(s.base_price / 100)}+`,
  rating: s.rating?.toFixed(1) ?? '4.5',
  basePrice: Math.round(s.base_price / 100),
}));
```

**Navigation** (line ~292): passes `{service: item}` unchanged — `id` flows automatically.

**Status: WIRED ✅** — When API is live, every service card in AllServicesScreen reaches `ServiceBookingScreen` with `service.id` set.

---

### 2. `src/screen/BottamTab/HomeScreen.tsx` — GET /home/feed (most_booked)

**Mapping** (line ~178):
```typescript
res.most_booked.map(s => ({
  id: s.id,      // ← added in Phase 2.1
  title: lang === 'hi' ? s.name : s.name_en,
  rating: s.rating?.toFixed(1) ?? '4.8',
  reviews: `${((s.booking_count ?? 0) / 1000).toFixed(0)}K`,
  bookings: `${s.booking_count ?? 0}+`,
  price: `₹${Math.round(s.base_price / 100)}`,
  emoji: s.emoji,
  svcKey: null,
}))
```

**Navigation** (line ~943) — the `svcKey: null` path (Washing Machine Clean card):
```typescript
navigation.navigate(ScreenNameEnum.ServiceBookingScreen, {
  service: {
    id: item.id,   // ← added in Phase 2.1
    label: item.title,
    emoji: item.emoji,
    desc: 'Professional home service',
    price: item.price,
    basePrice: 160,
    rating: item.rating,
  },
});
```

**Status: WIRED ✅** — When API is live and `most_booked` is returned, these cards reach `ServiceBookingScreen` with `service.id` set.

---

### 3. `src/utils/searchEngine.ts` — Hardcoded catalog

**Type** (line 6):
```typescript
export type ServiceResult = {
  id?: string;   // ← added in Phase 2.1 — ready for API-backed search
  key: string;
  label: string;
  ...
};
```

**Status: TYPE-READY, FALLBACK ONLY ⚠️** — The current catalog (`CATALOG` array, lines 19–238) is hardcoded and has no backend IDs. `id` will be `undefined` for all search results until the search engine is wired to the API. The guard in `ServiceBookingScreen` handles this correctly.

---

## Navigation Call Sites — Final Status

| # | Source | Entry point | `service.id` status | Preview API |
|---|--------|-------------|---------------------|-------------|
| 1 | `AllServicesScreen:292` | Grid "Book Now" | ✅ Set from `s.id` (API) | Enabled when API live |
| 2 | `HomeScreen:476` | Smart search result tap | ⚠️ Absent — hardcoded catalog | Disabled, fallback pricing |
| 3 | `HomeScreen:763` | Quick services scroll | ⚠️ Absent — static array | Disabled, fallback pricing |
| 4 | `HomeScreen:944` | Most Booked card | ✅ Set from `s.id` (API) | Enabled when API live |
| 5 | `HomeScreen:1061` | Appliance repair tiles | ⚠️ Absent — static array | Disabled, fallback pricing |
| 6 | `NearbyProvidersScreen:620` | Nearby provider book | ⚠️ Absent — provider data | Disabled, fallback pricing |

---

## Remaining Fallback-Only Screens

These screens navigate to `ServiceBookingScreen` without `service.id` because their data source is static/local and has no backend IDs:

| Screen | Data source | Path to fix |
|--------|-------------|-------------|
| **HomeScreen — Smart Search** | `searchEngine.ts` hardcoded catalog (`CATALOG`) | Replace catalog with `GET /services` API call; populate `id` from response |
| **HomeScreen — Quick Services** | `QUICK_SERVICES` static array (in-component) | Map from `GET /services` response; match by category or name |
| **HomeScreen — Appliance Tiles** | `APPLIANCE_ITEMS` static array (in-component) | Same as above |
| **NearbyProvidersScreen** | Provider list (no service endpoint relationship) | Providers need a `service_id` link from `GET /providers` response, or a separate category-to-service lookup |

---

## Guard Behaviour (ServiceBookingScreen)

When `service.id` is absent:

```typescript
// Dev warning — visible in Metro log
if (!service.id && __DEV__) {
  console.warn(
    '[ServiceBookingScreen] service.id missing — previewBooking API disabled, using fallback pricing.',
    {label: service.label},
  );
}

// Preview API skipped — fallback pricing used
if (service.id) {
  const preview = await previewBooking({ service_id: service.id, ... });
  serviceCharge = preview.service_charge;
  arrivalCharge = preview.arrival_charge;
  amount = preview.total;
}
// else: serviceCharge = service.basePrice, arrivalCharge = 49, amount = total
```

The screen is fully functional either way — it just uses hardcoded `basePrice + ₹49 arrival` instead of live pricing.

---

## Remaining Work

1. **Wire search engine to GET /services** — replace `CATALOG` static array with API-fetched services so `ServiceResult.id` is populated for search results.
2. **Wire QUICK_SERVICES to GET /services** — replace the static in-component array with the API response, matched by category.
3. **Wire APPLIANCE_ITEMS to GET /services** — same as above.
4. **NearbyProvidersScreen** — requires `GET /providers` to return a `service_id` or category reference per provider so the booking can link to the right service.
5. **Smoke-test previewBooking end-to-end** — once IDs flow through AllServicesScreen → ServiceBookingScreen, verify `POST /bookings/preview` succeeds with a real `service_id`.
