# USER APP — Fix Plan

**Created**: 2026-06-21
**Based on**: [USER_APP_BUGS.md](USER_APP_BUGS.md) + [USER_APP_AUDIT.md](USER_APP_AUDIT.md)
**Scope**: Launch blockers (BUG-001–003) + High severity (BUG-004–006)

---

## Priority Tiers

| Tier | Meaning |
|------|---------|
| **P0** | Must fix before any QA or device testing — app is non-functional without these |
| **P1** | Required before production release — security or reliability |
| **P2** | Post-launch — performance, cleanup, UX polish |

---

## Implementation Order

```
P0 (fix first, in order)
  REDUX-1   → Fix broken API import in authSlice + featuresSlice
  REDUX-2   → Fix base_url.url type mismatch
  NAV-1     → Implement PartnerInfoForm (unblock partner onboarding route)

P1 (fix before release)
  SEC-1     → Remove Google Maps API key from source
  SEC-2     → Encrypt auth token with Keychain
  SEC-3     → Add 401 interceptor + auto-logout
  AUTH-1    → Implement server-side logout
  AUTH-2    → Add token expiry + refresh
  PAY-1     → Complete Cashfree payment session wiring

P2 (post-launch)
  SEC-4     → Remove console.log from production builds
  PERF-1    → Throttle tracking engine
  PERF-2    → Split HomeScreen into sub-components
  PERF-3    → Deduplicate redundant libraries
```

---

---

# GROUP 1 — Redux

---

## REDUX-1 — Fix broken `API` import in authSlice and featuresSlice

**Priority**: P0
**Bug ref**: BUG-001

### Root Cause
`authSlice.js` and `featuresSlice.js` both import `{ API }` from `../Api`, but `src/redux/Api/index.tsx` never exports a symbol named `API`. The import resolves to `undefined`. Every call to `API.post()` / `API.get()` throws `TypeError: Cannot read property 'post' of undefined` at runtime — silently swallowed by the Redux thunk error boundary, meaning the UI shows a loading spinner indefinitely.

### Files Affected
| File | Change Needed |
|------|--------------|
| `src/redux/Api/index.tsx` | Export an axios instance as `API` — OR — (preferred) expose `callApi` as the canonical helper |
| `src/redux/feature/authSlice.js` | Replace all `API.post()` / `API.get()` calls with `callApi({ endpoint, method, body, token })` |
| `src/redux/feature/featuresSlice.js` | Same refactor |

### Fix Options

**Option A — Minimal (fastest):** Add one line to `index.tsx`:
```ts
export const API = axiosInstance; // expose the existing axios instance
```
Risk: `API.post(url)` and `callApi({ endpoint })` use different URL formats — may require URL normalisation.

**Option B — Recommended:** Refactor both slices to call `callApi()` / `callMultipleApis()`, which are already correctly implemented and battle-tested in `apiRequests.tsx`. This removes the parallel API system entirely.

### Estimated Effort
| Task | Time |
|------|------|
| Option A (quick export fix) | 30 min |
| Option B (full refactor of both slices) | 3–4 hrs |

**Recommendation**: Option B. Option A patches the symptom; Option B closes the gap between two competing API layers permanently.

### Fix Complexity: **Medium**

---

## REDUX-2 — Fix `base_url.url` type mismatch

**Priority**: P0
**Bug ref**: BUG-002

### Root Cause
`src/redux/Api/index.tsx` exports:
```ts
export const base_url = 'https://mrbikedoctors.com/api'; // string
```
`featuresSlice.js` accesses:
```ts
`${base_url.url}/some/endpoint` // base_url.url → undefined
```
All API URLs built in `featuresSlice` resolve to `"undefined/some/endpoint"`, causing every network call to fail with a 404 or DNS error.

### Files Affected
| File | Change Needed |
|------|--------------|
| `src/redux/feature/featuresSlice.js` | Replace `base_url.url` with `base_url` everywhere |
| OR `src/redux/Api/index.tsx` | Change export to `export const base_url = { url: '...' }` |

### Note
If REDUX-1 is resolved via Option B (refactoring to `callApi()`), this bug disappears automatically — `base_url.url` will no longer be referenced.

### Fix Complexity: **Low**
### Estimated Time: **15 min** (standalone) / **0 min** (if REDUX-1 Option B done)

---

---

# GROUP 2 — Authentication

---

## AUTH-1 — Implement server-side logout

**Priority**: P1
**Bug ref**: BUG-007

### Root Cause
`LogoutModal.tsx` clears local Redux state and AsyncStorage on logout, but never calls a logout endpoint. The server-issued Bearer token remains valid indefinitely. If the token is stolen, there is no way to invalidate it from the client side.

### Files Affected
| File | Change Needed |
|------|--------------|
| `src/screen/modal/LogoutModal.tsx` | Add `POST /auth/logout` call before clearing local state |
| `src/redux/feature/authSlice.js` | Add `logout` thunk |
| Backend | Ensure `/auth/logout` endpoint exists and invalidates the token |

### Fix Steps
1. Confirm with backend team that `/auth/logout` exists (or add it).
2. Add a `logout` async thunk to `authSlice.js` that calls the endpoint with the current Bearer token.
3. In `LogoutModal.tsx`, dispatch the thunk and await it before clearing AsyncStorage and navigating to login.
4. Handle network failure: still clear local state even if the server call fails (fail-open logout).

### Fix Complexity: **Low**
### Estimated Time: **1–2 hrs** (includes backend coordination)

---

## AUTH-2 — Add token expiry check and refresh

**Priority**: P1
**Bug ref**: BUG-006

### Root Cause
The app stores a Bearer token in AsyncStorage with no expiry metadata. When the token expires server-side, all API calls silently return 401 responses. There is no interceptor to catch this and no refresh flow, so the user stays on a broken screen with no feedback.

### Files Affected
| File | Change Needed |
|------|--------------|
| `src/redux/Api/index.tsx` | Add Axios response interceptor for 401 |
| `src/redux/feature/authSlice.js` | Add `refreshToken` thunk (if backend supports refresh tokens) |
| `src/navigators/AppNavigator.js` | Expose navigation action to redirect to login on auth failure |

### Fix Steps
1. In `index.tsx`, add an Axios interceptor:
   ```ts
   axiosInstance.interceptors.response.use(
     res => res,
     async err => {
       if (err.response?.status === 401) {
         // attempt refresh OR clear auth and navigate to login
       }
       return Promise.reject(err);
     }
   )
   ```
2. If backend issues refresh tokens: store refresh token in Keychain, call refresh endpoint, retry original request.
3. If no refresh tokens: on 401, clear AsyncStorage, dispatch logout action, navigate to `PhoneLogin`.
4. Show a toast: "Session expired. Please log in again."

### Fix Complexity: **Medium**
### Estimated Time: **3–4 hrs**

---

---

# GROUP 3 — Payments

---

## PAY-1 — Complete Cashfree payment session wiring

**Priority**: P1
**Bug ref**: (Partial implementation — no bug ID assigned; surfaced in audit)

### Root Cause
`PaymentScreen.tsx` (37KB) imports the Cashfree PG SDK and renders the full payment UI (UPI, cards, wallets), but the payment session creation step — which requires calling the backend to generate an `order_token` or `payment_session_id` — is either incomplete or wired to a placeholder. Without a valid session token from the server, the Cashfree SDK cannot initiate a real transaction.

### Files Affected
| File | Change Needed |
|------|--------------|
| `src/screen/bookingflow/PaymentScreen.tsx` | Wire `createOrder` API call → receive session token → pass to Cashfree SDK `CFPaymentGatewayService` |
| `src/redux/Api/apiRequests.tsx` | Add `createPaymentOrder(bookingId, amount)` function |
| Backend | Ensure `POST /bikedoctor/payments/createOrder` (or equivalent) returns a valid Cashfree session token |

### Fix Steps
1. Confirm the backend endpoint for order creation with the backend team.
2. Add `createPaymentOrder` to `apiRequests.tsx`:
   ```ts
   export const createPaymentOrder = (bookingId, amount, token) =>
     callApi({ endpoint: '/bikedoctor/payments/createOrder', method: 'POST',
               body: { bookingId, amount }, token });
   ```
3. In `PaymentScreen.tsx`, on "Pay Now" press:
   - Call `createPaymentOrder` → receive `paymentSessionId`.
   - Initialize Cashfree SDK with the session ID.
   - Handle SDK callbacks: `onSuccess` → navigate to `BookingConfirmationModal`, `onFailure` → show error.
4. Add loading and error states for the order creation step.
5. Test with Cashfree sandbox credentials.

### Fix Complexity: **Medium**
### Estimated Time: **4–6 hrs** (includes sandbox testing)

---

---

# GROUP 4 — Security

---

## SEC-1 — Remove Google Maps API key from source code and git history

**Priority**: P1
**Bug ref**: BUG-004

### Root Cause
`config.ts` at the project root exports a hardcoded Google Maps API key:
```ts
const api_key = 'AIzaSyAIXusFaztMWZwsm0SuBQEgZfuHWewJWYA'
```
The file is listed in `.gitignore` but was committed before the ignore rule was added, so it is tracked by git and present in the full commit history.

### Files Affected
| File | Change Needed |
|------|--------------|
| `config.ts` | Delete from repo; recreate from `.env` |
| `.env` (new file) | Add `GOOGLE_MAPS_API_KEY=...` |
| `.gitignore` | Ensure `.env` and `config.ts` are listed |
| All files importing `config.ts` | Import from `react-native-config` instead |
| `android/app/src/main/AndroidManifest.xml` | Move key to manifest meta-data (standard RN approach) |
| `ios/.../Info.plist` | Move key to plist |

### Fix Steps
1. Install `react-native-config`: `npm install react-native-config`.
2. Create `.env`:
   ```
   GOOGLE_MAPS_API_KEY=AIzaSyAIXusFaztMWZwsm0SuBQEgZfuHWewJWYA
   ```
3. Remove `config.ts` from git tracking: `git rm --cached config.ts`.
4. Update all import sites to use `Config.GOOGLE_MAPS_API_KEY` from `react-native-config`.
5. Purge the key from git history using `git filter-repo --path config.ts --invert-paths`.
6. Rotate the API key in Google Cloud Console after history purge is confirmed.
7. Add application restriction in GCP: restrict key to the app's iOS bundle ID + Android package name.

### Fix Complexity: **Medium**
### Estimated Time: **2–3 hrs** (includes git history purge + key rotation)

> **Important**: Rotating the key (step 6) must happen — even after removal from source, the old key is compromised if anyone cloned the repo.

---

## SEC-2 — Encrypt auth token using device Keychain / Keystore

**Priority**: P1
**Bug ref**: BUG-005

### Root Cause
The auth Bearer token is stored via:
```ts
AsyncStorage.setItem('token', response.token)
```
`AsyncStorage` is unencrypted on Android and stored in a SQLite database accessible on rooted devices. An attacker with physical access or malware can extract the token and impersonate the user indefinitely.

### Files Affected
| File | Change Needed |
|------|--------------|
| `src/screen/Auth/OTPVerification.tsx` | Replace `AsyncStorage.setItem('token', ...)` with Keychain write |
| `src/screen/Auth/PhoneLogin.tsx` | Replace any token reads with Keychain read |
| All files that do `AsyncStorage.getItem('token')` | Replace with `Keychain.getGenericPassword()` |
| `src/redux/Api/apiRequests.tsx` | Update token retrieval in request functions |
| `src/redux/Store.js` | Note: redux-persist whitelists `auth` — token should NOT be in persisted Redux state, only in Keychain |

### Fix Steps
1. Install `react-native-keychain`: `npm install react-native-keychain`.
2. Link native modules (auto-link on RN 0.60+, verify `pod install` on iOS).
3. Create a `tokenStorage.ts` utility:
   ```ts
   import * as Keychain from 'react-native-keychain';
   export const saveToken = (token: string) =>
     Keychain.setGenericPassword('servslo_user', token);
   export const getToken = async () => {
     const creds = await Keychain.getGenericPassword();
     return creds ? creds.password : null;
   };
   export const clearToken = () => Keychain.resetGenericPassword();
   ```
4. Replace all `AsyncStorage.setItem('token', ...)` / `AsyncStorage.getItem('token')` / `AsyncStorage.removeItem('token')` with calls to this utility.
5. Ensure `clearToken()` is called in `LogoutModal.tsx` on logout.

### Fix Complexity: **Low**
### Estimated Time: **2–3 hrs**

---

## SEC-3 — Add 401 interceptor for automatic logout and redirect

**Priority**: P1
**Bug ref**: BUG-008

### Root Cause
No centralised handling exists for 401 (Unauthorized) HTTP responses. When a token expires or is invalidated, API calls fail silently — the user sees a spinner or stale data with no explanation and no path to re-authenticate.

### Files Affected
| File | Change Needed |
|------|--------------|
| `src/redux/Api/index.tsx` | Add Axios response interceptor |
| `src/navigators/AppNavigator.js` | Use `navigationRef` to navigate to login from outside React tree |
| `src/redux/feature/authSlice.js` | Dispatch `logoutSuccess` action from interceptor |

### Fix Steps
1. In `index.tsx`, after creating the axios instance, add:
   ```ts
   axiosInstance.interceptors.response.use(
     response => response,
     error => {
       if (error.response?.status === 401) {
         clearToken();                    // SEC-2 utility
         store.dispatch(logoutSuccess()); // clear Redux auth state
         navigationRef.current?.reset({
           index: 0,
           routes: [{ name: 'PhoneLogin' }],
         });
         Toast.show({ type: 'error', text1: 'Session expired. Please log in.' });
       }
       return Promise.reject(error);
     }
   );
   ```
2. Ensure `store` and `navigationRef` are importable in `index.tsx` without circular dependencies (use lazy import or a singleton pattern if needed).
3. Test by manually expiring a token server-side and confirming the user is redirected.

### Fix Complexity: **Low**
### Estimated Time: **1–2 hrs**

---

## SEC-4 — Strip console.log statements from production builds

**Priority**: P2
**Bug ref**: BUG-009

### Root Cause
Approximately 120 `console.log` and `console.error` calls exist in the Redux layer. These log auth tokens, full API responses (including user PII), and error stack traces. On Android, these are visible via `adb logcat` without root.

### Files Affected
| File | Change Needed |
|------|--------------|
| `src/redux/feature/authSlice.js` | Remove / conditionally gate all console statements |
| `src/redux/feature/featuresSlice.js` | Same |
| `src/redux/Api/index.tsx` | Same |
| `src/redux/Api/apiRequests.tsx` | Same |
| `babel.config.js` | Add `babel-plugin-transform-remove-console` for release builds |

### Fix Steps
1. Install plugin: `npm install --save-dev babel-plugin-transform-remove-console`.
2. In `babel.config.js`:
   ```js
   module.exports = {
     presets: ['module:@react-native/babel-preset'],
     env: {
       production: {
         plugins: ['transform-remove-console'],
       },
     },
   };
   ```
3. Optionally: manually remove logs from the Redux layer for clarity, regardless of build mode.

### Fix Complexity: **Low**
### Estimated Time: **30 min** (Babel plugin) / **2 hrs** (manual removal)

---

---

# GROUP 5 — Navigation

---

## NAV-1 — Implement `PartnerInfoForm.tsx`

**Priority**: P0
**Bug ref**: BUG-003

### Root Cause
`src/screen/Auth/PartnerInfoForm.tsx` is 40 bytes — an empty file. It is registered as a route in the navigation stack and is reached after `PartnerServiceSelectionScreen`. Partners navigating through the onboarding flow will see a completely blank screen.

### Files Affected
| File | Change Needed |
|------|--------------|
| `src/screen/Auth/PartnerInfoForm.tsx` | Implement the form |

### Required Form Fields (inferred from flow context)
- Full legal name
- Business / shop name
- Business address
- GST number (optional)
- Years of experience
- Primary service area (city/pin code)
- Bank account details (for payouts — or defer to a later step)
- Profile photo

### Fix Steps
1. Define the data model for partner info (coordinate with backend on required fields for `POST /bikedoctor/userAuth/addPartnerProfile` or equivalent endpoint).
2. Implement the form using the existing patterns from `UserInfoForm.tsx` (consistent styling, validation, image picker).
3. On submit, POST to the partner profile endpoint with Bearer token.
4. On success, navigate to `PartnerDocumentsScreen` (which already exists).
5. Handle errors with the existing Toast pattern.

### Fix Complexity: **Medium**
### Estimated Time: **4–6 hrs**

---

---

# GROUP 6 — Performance

---

## PERF-1 — Throttle tracking engine from 350ms to 1000ms

**Priority**: P2
**Bug ref**: BUG-013

### Root Cause
`src/services/trackingEngine.ts` dispatches position updates on a 350ms interval. On lower-end Android devices (common in the target Mumbai market), this causes the JS thread to process ~3 updates/sec, competing with animations and scroll gestures and causing frame drops on `BookingTrackScreen.tsx`.

### Files Affected
| File | Change Needed |
|------|--------------|
| `src/services/trackingEngine.ts` | Change interval from 350ms to 1000ms |
| `src/screen/Feature/BookingTrackScreen.tsx` | Add marker animation interpolation to smooth the 1s jumps |

### Fix Steps
1. In `trackingEngine.ts`, change the `setInterval` delay from `350` to `1000`.
2. To avoid visible "jumps" in the map marker at 1s intervals, add position interpolation using `Animated.timing` over 900ms between updates in `BookingTrackScreen.tsx`.
3. Test on a low-end Android emulator (Pixel 3a equivalent) for frame smoothness.

### Fix Complexity: **Low**
### Estimated Time: **1–2 hrs**

---

## PERF-2 — Split `HomeScreen.tsx` into memoized sub-components

**Priority**: P2
**Bug ref**: BUG-014

### Root Cause
`HomeScreen.tsx` is 61KB and renders as a single functional component. Any state update (search query, location change, banner load) triggers a full re-render of the entire screen tree — including the campaign carousel, the service grid, the nearby-provider count, and the walkthrough overlay — simultaneously.

### Files Affected
| File | Change Needed |
|------|--------------|
| `src/screen/BottamTab/HomeScreen.tsx` | Decompose into sub-components |
| New files (within `src/screen/BottamTab/`) | `HomeBanners.tsx`, `HomeServiceGrid.tsx`, `HomeCampaigns.tsx`, `HomeSearchBar.tsx` |

### Fix Steps
1. Identify the 4–5 logical sections within `HomeScreen.tsx` (banner carousel, service grid, campaign cards, nearby count, search).
2. Extract each into its own file receiving only the props it needs.
3. Wrap each with `React.memo()`.
4. Use `useCallback` for event handlers passed as props.
5. Verify with React DevTools that re-renders are scoped to the section that changed.

### Fix Complexity: **Medium**
### Estimated Time: **4–6 hrs**

---

## PERF-3 — Deduplicate redundant third-party libraries

**Priority**: P2
**Bug ref**: BUG-012

### Root Cause
Multiple libraries serving identical purposes are installed, increasing APK/IPA size and startup time.

### Libraries to Remove

| Purpose | Keep | Remove | Estimated Size Saving |
|---------|------|--------|-----------------------|
| Geolocation | `react-native-geolocation-service` | `@react-native-community/geolocation` | ~50 KB |
| Image picker | `react-native-image-crop-picker` | `react-native-image-picker` | ~200 KB |
| Date handling | `date-fns` | `moment` | ~230 KB (moment is notoriously large) |
| Calendar | `react-native-calendars` | `react-native-calendar-picker` | ~80 KB |

**Estimated total savings**: ~560 KB from JS bundle.

### Files Affected
All files that import the libraries being removed. Requires a grep-and-replace pass across `src/`.

### Fix Steps
1. `grep -r "react-native-community/geolocation\|react-native-image-picker\|moment\|calendar-picker"` across `src/` to find all import sites.
2. Replace each import with the equivalent from the chosen library.
3. Uninstall removed packages: `npm uninstall react-native-image-picker @react-native-community/geolocation moment react-native-calendar-picker`.
4. Run `pod install` (iOS) and rebuild.
5. Smoke-test geolocation, image upload, date pickers.

### Fix Complexity: **Medium**
### Estimated Time: **3–4 hrs**

---

---

# Full Fix Schedule

## P0 — Pre-QA (fix before any testing)

| ID | Task | Complexity | Est. Time | Dependency |
|----|------|-----------|-----------|------------|
| REDUX-1 | Fix broken `API` import — refactor slices to use `callApi()` | Medium | 3–4 hrs | None |
| REDUX-2 | Fix `base_url.url` type mismatch | Low | 15 min | Resolved by REDUX-1 |
| NAV-1 | Implement `PartnerInfoForm.tsx` | Medium | 4–6 hrs | None |

**P0 total: ~8 hrs**

---

## P1 — Pre-release (fix before production)

| ID | Task | Complexity | Est. Time | Dependency |
|----|------|-----------|-----------|------------|
| SEC-1 | Remove Maps API key from source + rotate | Medium | 2–3 hrs | None |
| SEC-2 | Encrypt auth token with Keychain | Low | 2–3 hrs | None |
| SEC-3 | Add 401 interceptor + auto-logout | Low | 1–2 hrs | SEC-2, AUTH-1 |
| AUTH-1 | Implement server-side logout | Low | 1–2 hrs | None |
| AUTH-2 | Token expiry check + refresh | Medium | 3–4 hrs | SEC-2 |
| PAY-1 | Complete Cashfree payment session wiring | Medium | 4–6 hrs | REDUX-1 |

**P1 total: ~14–20 hrs**

---

## P2 — Post-launch

| ID | Task | Complexity | Est. Time | Dependency |
|----|------|-----------|-----------|------------|
| SEC-4 | Strip console.log from production | Low | 30 min | None |
| PERF-1 | Throttle tracking engine to 1000ms | Low | 1–2 hrs | None |
| PERF-2 | Split HomeScreen into sub-components | Medium | 4–6 hrs | None |
| PERF-3 | Deduplicate redundant libraries | Medium | 3–4 hrs | None |

**P2 total: ~9–13 hrs**

---

## Grand Total

| Tier | Tasks | Estimated Time |
|------|-------|---------------|
| P0 | 3 | ~8 hrs |
| P1 | 6 | ~14–20 hrs |
| P2 | 4 | ~9–13 hrs |
| **All** | **13** | **~31–41 hrs** |

---

## Linked Documents

- [USER_APP_BUGS.md](USER_APP_BUGS.md) — Source bug definitions
- [USER_APP_AUDIT.md](USER_APP_AUDIT.md) — Full audit findings
- [USER_APP_FEATURES.md](USER_APP_FEATURES.md) — Feature status
- [USER_APP_APIS.md](USER_APP_APIS.md) — API reference
- [PROJECT_PROGRESS.md](PROJECT_PROGRESS.md) — Overall project status
