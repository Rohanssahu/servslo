# PROJECT PROGRESS

**Project**: ServSLO — Home Services Booking Platform
**Last Updated**: 2026-06-20
**Market**: Mumbai, India
**Languages**: Hindi + English

---

## Overall Completion

```
User App (React Native)   ████████░░  78%
Partner App               [not audited]
Backend API               [not audited]
```

---

## User App Status

### Feature Completion by Area

| Area | Status | % Done | Blocker |
|------|--------|--------|---------|
| Splash / Onboarding | ✅ Shipped | 95% | PartnerInfoForm.tsx empty |
| Authentication (OTP) | ✅ Shipped | 90% | No logout API |
| Home Screen | ✅ Shipped | 100% | — |
| Service Discovery | ✅ Shipped | 100% | — |
| Nearby Providers Map | ✅ Shipped | 100% | — |
| Booking Flow | ✅ Shipped | 85% | Invoice rendering unclear |
| Payment Integration | ⚠️ In Progress | 60% | Cashfree wiring incomplete |
| Real-time Tracking | ✅ Shipped | 100% | — |
| Push Notifications (FCM) | ✅ Shipped | 100% | — |
| Booking History | ✅ Shipped | 100% | — |
| User Profile & Vehicles | ✅ Shipped | 90% | — |
| Saved Addresses | ✅ Shipped | 100% | — |
| Support Tickets | ✅ Shipped | 100% | — |
| Referral & Earnings | ✅ Shipped | 100% | — |
| Localization (EN/HI) | ✅ Shipped | 100% | — |
| Redux State Layer | 🔴 Broken | 30% | Missing API export (BUG-001) |
| Security Hardening | 🔴 Not Started | 20% | API key exposed, no keychain |
| Chat | ⚠️ In Progress | 30% | socket.ts is a shim |

---

## Launch Blockers (Must Fix Before Release)

| # | Bug | File | Impact |
|---|-----|------|--------|
| 1 | Missing `API` export — all Redux thunks crash | `redux/Api/index.tsx` | 🔴 All async state ops fail |
| 2 | `base_url.url` is undefined | `featuresSlice.js` | 🔴 All feature API calls fail |
| 3 | `PartnerInfoForm.tsx` is empty | `Auth/PartnerInfoForm.tsx` | 🔴 Partner onboarding broken |
| 4 | Google Maps API key in source | `config.ts` | 🟠 Security — must remove |
| 5 | Auth token unencrypted in AsyncStorage | All API files | 🟠 Security — use Keychain |

---

## Next Priority Fixes

### Immediate (Pre-launch)
1. Fix `authSlice.js` and `featuresSlice.js` to use `callApi()` instead of the broken `API` import.
2. Remove `config.ts` from git, move API key to `.env` + `react-native-config`.
3. Implement `PartnerInfoForm.tsx`.
4. Switch token storage to `react-native-keychain`.
5. Implement 401 interceptor → auto logout + redirect to login.

### Short-term (Post-launch)
6. Complete Cashfree payment session creation.
7. Implement server-side logout endpoint.
8. Remove all `console.log` statements from production builds.
9. Add token refresh / expiry handling.
10. Throttle tracking engine from 350ms → 1000ms.

### Medium-term
11. Deduplicate date, geolocation, and image picker libraries.
12. Split `HomeScreen.tsx` (61KB) into memoized sub-components.
13. Add `React.memo` + `useCallback` to large list screens.
14. Implement API response caching (SWR or react-query).
15. Complete Chat feature with real socket integration.

---

## Key Technical Decisions

| Decision | Current State | Recommendation |
|----------|--------------|----------------|
| Auth storage | `AsyncStorage` (plain) | Migrate to `react-native-keychain` |
| API layer | Two parallel systems (apiRequests.tsx ✅ vs Redux thunks 🔴) | Consolidate — use only `callApi()` |
| Date libraries | moment + date-fns both installed | Keep `date-fns` only, remove `moment` |
| Geolocation | Two libs installed | Keep `react-native-geolocation-service` |
| Image picker | Two libs installed | Keep `react-native-image-crop-picker` |
| Environment config | Hardcoded in source | Use `react-native-config` with `.env` |

---

## Linked Documents

- [USER_APP_AUDIT.md](USER_APP_AUDIT.md) — Full technical audit
- [USER_APP_FEATURES.md](USER_APP_FEATURES.md) — Feature-by-feature status
- [USER_APP_APIS.md](USER_APP_APIS.md) — All API endpoints
- [USER_APP_BUGS.md](USER_APP_BUGS.md) — All bugs (18 found, 3 blockers)
