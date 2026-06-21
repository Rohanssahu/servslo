# User App — Integration Report

> Phase: 1  
> Date: 2026-06-21  
> Scope: Auth, Profile, Addresses, Categories, Services  
> Base URL: `https://mrbikedoctors.com/api/v1`

---

## Summary

| Area | Screens | Endpoints wired | Status |
|------|---------|----------------|--------|
| Auth | PhoneLogin, OTPVerification, UserInfoForm | 3 | ✅ Connected |
| Profile | ProfileSettingsScreen, UserInfoForm (edit) | 3 | ✅ Connected |
| Addresses | AddressesScreen | 2 | ✅ Connected |
| Services | AllServicesScreen | 1 | ✅ Connected |
| Home Feed | HomeScreen (location + most_booked) | 1 | ✅ Connected |

---

## New Files Created

| File | Purpose |
|------|---------|
| `src/api/client.ts` | Axios instance — attaches Bearer token, handles 401 → refresh token → retry |
| `src/api/authApi.ts` | `sendOtp`, `verifyOtp`, `completeProfile`, `logoutApi`, `deleteAccountApi` |
| `src/api/userApi.ts` | `getProfile`, `updateProfile`, `listAddresses`, `addAddress`, `updateAddress`, `deleteAddress`, `updateFcmToken` |
| `src/api/serviceApi.ts` | `getServices`, `getServiceDetail`, `getHomeFeed` |

---

## Connected Screens

### PhoneLogin (`src/screen/Auth/PhoneLogin.tsx`)
- **Endpoint**: `POST /auth/send-otp`
- **Before**: navigated directly to OTPVerification without any API call
- **After**: calls `sendOtp({phone, country_code: '+91'})`, navigates on success
- **Error handling**: `TOO_MANY_REQUESTS` → localized message, generic network error fallback
- **Loading**: button shows `ActivityIndicator` while request is in-flight

---

### OTPVerification (`src/screen/Auth/OTPVerification.tsx`)
- **Endpoints**: `POST /auth/verify-otp`, `POST /auth/send-otp` (resend)
- **Before**: `setTimeout(800ms)` fake verify → always navigated to UserInfoForm
- **After**:
  - `is_new_user: true` → `dispatch(setTempToken)` → UserInfoForm
  - `is_new_user: false` → `dispatch(loginSuccess)` → TabNavigator (existing user skip)
- **Error handling**: `INVALID_OTP` with `attempts_remaining` shown; generic fallback
- **Resend**: calls `sendOtp` again, restarts 60s timer only on success

---

### UserInfoForm (`src/screen/Auth/UserInfoForm.tsx`)
- **Endpoints**: `POST /auth/complete-profile` (new user), `PATCH /users/me` (edit profile)
- **Before**: navigated straight to `TabNavigator` with no API call
- **After**:
  - New user (`profile === false`): multipart POST with name, gender, language, optional photo → `dispatch(loginSuccess)` → TabNavigator
  - Edit profile (`profile === true`): multipart PATCH → `dispatch(setUser)` → goBack
- **Pre-fill**: edit mode pre-fills name, gender, photo from Redux `userData`
- **Loading**: button shows `ActivityIndicator` while submitting

---

### ProfileSettingsScreen (`src/screen/BottamTab/ProfileSettingsScreen.tsx`)
- **Endpoints**: `GET /users/me`, `POST /auth/logout`, `DELETE /users/me`
- **Before**: hardcoded location "Indore, MP", logout navigated to PhoneLogin with no API call, delete just `console.log`
- **After**:
  - `useEffect` calls `getProfile()` on mount → `dispatch(setUser)` — refreshes cached data silently
  - Header shows `+91 <phone>` from Redux userData
  - Logout: calls `logoutApi()` → `dispatch(logout())` → navigate to PhoneLogin
  - Delete account: calls `deleteAccountApi()` → `dispatch(logout())` → navigate to PhoneLogin

---

### AddressesScreen (`src/screen/Feature/AddressesScreen.tsx`)
- **Endpoints**: `GET /users/me/addresses`, `DELETE /users/me/addresses/:id`
- **Before**: hardcoded default prop `addresses = [{id:'1', title:'Home', line:'...'}]`
- **After**:
  - `useEffect` fetches `listAddresses()` on mount, maps `AddressItem` → local `Address` shape
  - Delete button triggers confirm Alert → `deleteAddressApi(id)` → removes from local state
  - Shows `ActivityIndicator` while loading
  - Edit button navigates to `LocationPickerScreen` with `addressId` param (Phase 2 wiring)
- **Payload mapping**: `line1 + line2 + city + pincode` joined into `line`, `label` → `title`

---

### AllServicesScreen (`src/screen/Feature/AllServicesScreen.tsx`)
- **Endpoint**: `GET /services`
- **Before**: `ALL_SERVICES` (30 hardcoded entries) and `CATEGORIES` (6 hardcoded tabs)
- **After**:
  - `useEffect` on mount fetches `getServices()` → maps API shape to UI shape
  - API `base_price` (paise) → `₹X+` price string (divided by 100)
  - API `rating` (float) → `"4.8"` string
  - API `tags[]` → `desc` string (joined with `, `)
  - Categories from `res.categories` with bilingual labels (hi/en based on `lang`)
  - Shows `ActivityIndicator` on first load
  - Falls back to 4-item `FALLBACK_SERVICES` if API fails

---

### HomeScreen (`src/screen/BottamTab/HomeScreen.tsx`)
- **Endpoint**: `GET /home/feed`
- **Before**: location hardcoded `"Mulund Road, Mumbai..."`, `MOST_BOOKED` 3-item static array
- **After**:
  - `feedLocation` state shows `area + city` from API response
  - `mostBooked` state replaces static `MOST_BOOKED`; mapped from `res.most_booked[]`
  - `DAILY_HOME_SERVICES`, `QUICK_SERVICES`, `SMALL_TILES` intentionally kept static — these drive the ServiceBottomSheet which requires fixed `DailyServiceKey` values not present in API response (Phase 2 scope)
  - Falls back to original static data if API fails

---

## Redux Changes (`src/redux/feature/authSlice.js`)

New actions added (all exported):

| Action | Payload | Purpose |
|--------|---------|---------|
| `setTokens` | `{accessToken, refreshToken}` | Called after token refresh |
| `setUser` | user object | Called after profile fetch/update |
| `setTempToken` | string | Stored after verify-otp for new user |
| `logout` | — | Clears all auth state |

`loginSuccess` updated to accept `{user, accessToken, refreshToken}` shape (backward-compatible — legacy calls passing user directly still work via `action.payload.user ?? action.payload`).

---

## Failed Integrations

None in Phase 1. All 5 areas connected.

---

## Payload Mismatches

| Field | API returns | UI expects | Resolution |
|-------|------------|------------|-----------|
| `base_price` | integer paise (e.g. `29900`) | `"₹299+"` string | Divide by 100 in mapping layer |
| `rating` | float (e.g. `4.8`) | `"4.8"` string | `.toFixed(1)` in mapping layer |
| `tags[]` | string array | `desc` string | `tags.join(', ')` |
| `label` (address) | e.g. `"घर"` | `title` field | Mapped directly |
| `is_new_user` | boolean | routing decision | Used to branch to UserInfoForm vs TabNavigator |
| `booking_count` | integer | `"12K+"` string | Divided by 1000, appended `+` |

---

## Missing Backend Fields

| Screen | Missing field | Impact |
|--------|--------------|--------|
| HomeScreen most_booked | `old_price` / `off` (discount badge) | Discount badge won't show — no data from API yet |
| HomeScreen most_booked | `reviews` count string | Shows `"0K"` if `booking_count` is 0 |
| AddressesScreen | `is_default` | Default address not visually flagged — no radio pre-selection from API yet |
| AllServicesScreen | `desc` (free-text) | Derived from `tags[]`; if `tags` is empty, shows category name |

---

## Remaining Mock Data (Phase 2+)

| Screen | Data | Reason kept static |
|--------|------|--------------------|
| HomeScreen | `DAILY_HOME_SERVICES`, `SMALL_TILES`, `QUICK_SERVICES` | Tied to `ServiceBottomSheet` `DailyServiceKey` — no API equivalent |
| HomeScreen | `DEALS` (Quick Cleaning Packages) | Campaign system — Post MVP |
| HomeScreen | `LIVE_PROVIDERS` | Live provider count — needs separate API |
| HomeScreen | `SUBSCRIPTION_SERVICES` | Not in MVP API scope |
| AllServicesScreen | `FALLBACK_SERVICES` (4 items) | Emergency fallback only — replaced by API on success |
