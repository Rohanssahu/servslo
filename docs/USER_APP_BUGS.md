# USER APP — Bugs & Issues

**App**: ServSLO User App (React Native)
**Audit Date**: 2026-06-20

---

## Severity Legend

| Label | Meaning |
|-------|---------|
| 🔴 BLOCKER | App will crash or core feature will silently fail |
| 🟠 HIGH | Significant feature broken or security risk |
| 🟡 MEDIUM | Degraded experience or partial failure |
| 🟢 LOW | Code quality, cleanup, or minor edge case |

---

## Launch Blockers

### BUG-001 — Missing `API` export causes all Redux thunks to fail at runtime

**Severity**: 🔴 BLOCKER

**Files**:
- `src/redux/Api/index.tsx` — does NOT export `API` or `base_url`
- `src/redux/feature/authSlice.js` — line: `import { API } from '../Api'`
- `src/redux/feature/featuresSlice.js` — line: `import { API, base_url } from '../Api'`

**What breaks**:
Every async thunk in both Redux slices will fail with:
```
TypeError: Cannot read property 'post' of undefined
```
because `API` resolves to `undefined`. This affects:
- `login`, `reset_password`, `verify_otp`, `Create_new_password`, `Sign_up`
- `create_bussiness`, `get_profile`
- `send_message_help`, `get_Bussiness_data`, `get_save_Bussines`
- `get_Bussiness_list`, `get_dashboard_data`, `get_near_by_business`
- `update_profile`, `get_business_details`

**Fix**: Either export an `API` axios instance from `index.tsx`, or refactor thunks to use the existing `callApi()` / `callMultipleApis()` helpers.

---

### BUG-002 — `base_url.url` is `undefined` (type mismatch)

**Severity**: 🔴 BLOCKER

**Files**:
- `src/redux/Api/index.tsx` — exports `base_url` as a string: `export const base_url = 'https://...'`
- `src/redux/feature/featuresSlice.js` — accesses `base_url.url`

**What breaks**:
`base_url.url` evaluates to `undefined` because `base_url` is a plain string, not an object. All `featuresSlice` API calls will construct invalid URLs.

**Fix**: Change `base_url.url` references to just `base_url`, or change the export to `export const base_url = { url: 'https://...' }`.

---

### BUG-003 — `PartnerInfoForm.tsx` is an empty stub (40 bytes)

**Severity**: 🔴 BLOCKER (for partner onboarding flow)

**File**: `src/screen/Auth/PartnerInfoForm.tsx`

**What breaks**:
The file is referenced in the navigation routes but contains no implementation. Navigating to this screen will render a blank page or crash.

**Fix**: Implement the partner information form, or remove the route if the feature is intentionally deferred.

---

## Security Issues

### BUG-004 — Google Maps API key hardcoded in source code

**Severity**: 🟠 HIGH

**File**: `config.ts` (root level)
```ts
const api_key = 'AIzaSyAIXusFaztMWZwsm0SuBQEgZfuHWewJWYA'
```

**Impact**: The key is committed to git and visible to anyone with repo access. Even with GCP package restrictions, exposure in source opens risk of key theft and billing abuse.

**Fix**:
1. Add `config.ts` to `.gitignore` (it is already listed but the file was committed — remove from git history).
2. Move the key to a `.env` file and read it with `react-native-config`.

---

### BUG-005 — Auth token stored unencrypted in AsyncStorage

**Severity**: 🟠 HIGH

**Files**: `PhoneLogin.tsx`, `OTPVerification.tsx`, multiple API request files

**Impact**: AsyncStorage is not encrypted on Android. On rooted or jailbroken devices, the auth token can be read by other apps.

**Fix**: Store the token using `react-native-keychain` (iOS Keychain / Android Keystore).

---

### BUG-006 — No token expiration or refresh mechanism

**Severity**: 🟠 HIGH

**Files**: All API request files, `authSlice.js`

**Impact**: Expired tokens will cause silent 401 failures with no user feedback or automatic re-login.

**Fix**: Implement token expiry check + silent refresh, or redirect to login on 401.

---

### BUG-007 — No logout API call

**Severity**: 🟡 MEDIUM

**File**: `src/screen/modal/LogoutModal.tsx`

**Impact**: Logging out only clears local state. The server-side session / token remains active.

**Fix**: Add a `POST /auth/logout` endpoint and call it before clearing local state.

---

### BUG-008 — No auth guard on API calls

**Severity**: 🟡 MEDIUM

**Files**: All API request functions

**Impact**: If the token is missing or expired, API calls silently fail or return 401 with no redirect to login.

**Fix**: Add a central interceptor that checks for 401 responses and triggers logout + redirect.

---

### BUG-009 — Sensitive data logged via `console.log` in production builds

**Severity**: 🟡 MEDIUM

**Files**: `authSlice.js`, `featuresSlice.js`, `apiRequests.tsx`, `index.tsx`

**Impact**: Auth tokens, API responses including PII, and error details are logged in production. Accessible via ADB logcat on Android.

**Estimated count**: 120+ console.log/console.error statements in the Redux layer alone.

**Fix**: Remove all console statements from production code, or use a logger library that strips logs in release builds.

---

### BUG-010 — No HTTPS certificate pinning

**Severity**: 🟡 MEDIUM

**Impact**: Vulnerable to MITM attacks on untrusted networks (public Wi-Fi, corporate proxies).

**Fix**: Implement certificate pinning via `react-native-ssl-pinning` for the primary API domain.

---

## Code Quality / Runtime Issues

### BUG-011 — `multipart/form-data` header set but body sent as JSON

**Severity**: 🟡 MEDIUM

**Files**: Some upload functions in `apiRequests.tsx`

**Impact**: File uploads may silently fail or send garbled data. Server may reject with 400.

**Fix**: Ensure `FormData` object is used when `Content-Type: multipart/form-data` is set.

---

### BUG-012 — Duplicate third-party libraries increase bundle size

**Severity**: 🟡 MEDIUM

**Duplicates found**:
| Purpose | Library 1 | Library 2 |
|---------|-----------|-----------|
| Geolocation | `@react-native-community/geolocation` | `react-native-geolocation-service` |
| Image picker | `react-native-image-picker` | `react-native-image-crop-picker` |
| Date handling | `moment` | `date-fns` |
| Calendar | `react-native-calendars` | `react-native-calendar-picker` |

**Impact**: Larger APK/IPA size, longer startup time, increased memory usage.

**Fix**: Audit usage and keep one library per purpose.

---

### BUG-013 — Tracking engine updates at 350ms — no throttling

**Severity**: 🟡 MEDIUM

**File**: `src/services/trackingEngine.ts`

**Impact**: On lower-end Android devices, 350ms DOM/state updates from the tracking engine may cause frame drops and jank in the live tracking screen.

**Fix**: Increase interval to 1–2 seconds, or throttle updates to only when position changes meaningfully (>5 meters).

---

### BUG-014 — `HomeScreen.tsx` is 61KB — renders as a single component

**Severity**: 🟡 MEDIUM

**File**: `src/screen/BottamTab/HomeScreen.tsx`

**Impact**: No memoization on a large component tree means every state update triggers a full re-render of the home screen, leading to jank.

**Fix**: Split into sub-components and wrap with `React.memo`. Memoize callbacks with `useCallback`.

---

### BUG-015 — Chat feature is incomplete

**Severity**: 🟡 MEDIUM

**Files**: `src/screen/Chat/Chat.js`, `src/services/socket.ts`

**Impact**: `socket.ts` is described as a "backward-compat shim." Chat functionality is not fully implemented and may not work.

**Fix**: Implement real-time chat or remove the route until it is ready.

---

### BUG-016 — `PartnerInfoForm.tsx` listed in `.gitignore` but committed

**Severity**: 🟢 LOW

**File**: `config.ts` (not PartnerInfoForm — the gitignore lists `config.ts`)

**Impact**: `config.ts` appears in `.gitignore` at line 67 but the file is still tracked by git (it was committed before being added to .gitignore).

**Fix**: Run `git rm --cached config.ts` then commit to stop tracking it.

---

### BUG-017 — Typos in directory and variable names (inconsistency)

**Severity**: 🟢 LOW

**Instances**:
- Directory: `BottamTab/` (should be `BottomTab`)
- Redux state: `bussinessData` (should be `businessData`)
- Redux thunk: `create_bussiness` (should be `create_business`)

**Impact**: No runtime impact, but confusing to developers and makes grep harder.

---

### BUG-018 — `TypeScript` config is minimal; many type errors likely suppressed

**Severity**: 🟢 LOW

**File**: `tsconfig.json`

**Impact**: TypeScript is configured but several JS files (`authSlice.js`, `featuresSlice.js`) have no types. Type errors that would catch BUG-001/002 at compile time are silent.

**Fix**: Convert slices to TypeScript and enable `strict` mode in tsconfig.

---

## Summary by Severity

| Severity | Count |
|----------|-------|
| 🔴 BLOCKER | 3 |
| 🟠 HIGH | 3 |
| 🟡 MEDIUM | 8 |
| 🟢 LOW | 4 |
| **Total** | **18** |

---

## Launch Readiness

The app **cannot ship** in its current state due to:

1. **BUG-001** — Redux thunks all fail (broken import)
2. **BUG-002** — API URLs resolve to `undefined`
3. **BUG-003** — Partner onboarding screen is blank
4. **BUG-004** — API key exposed in source (security)
5. **BUG-005** — Tokens unencrypted (security)

Fix BUG-001 through BUG-003 to unblock functional testing. Fix BUG-004 and BUG-005 before any public release.
