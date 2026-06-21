# USER APP — Full Audit Report

**App**: ServSLO User App (React Native)
**Audit Date**: 2026-06-20
**Auditor**: Claude Code

---

## 1. Overview

ServSLO is a React Native home/bike-service booking app targeting the Mumbai market with Hindi + English bilingual support. The user app handles customer-facing flows: browsing services, booking providers, payments, real-time tracking, and support.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (CLI, not Expo) |
| Language | TypeScript + JavaScript (mixed) |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| State | Redux Toolkit + redux-persist |
| HTTP | Axios + custom `callApi()` helper |
| Auth | Phone OTP → Bearer token → AsyncStorage |
| Push | Firebase Cloud Messaging (FCM) v21 |
| Maps | react-native-maps + Google Maps API |
| Payment | Cashfree PG SDK |
| Localization | react-native-localization (EN/HI) |
| Animations | Lottie + Reanimated v3 |
| Backend | `https://mrbikedoctors.com/api` (REST) |

---

## 3. Project Structure

```
servslo/
├── App.tsx                  — Root component (Redux Provider + PersistGate + Navigator)
├── index.js                 — RN entry + FCM background handler
├── config.ts                — 🔴 Hardcoded Google Maps API key
├── src/
│   ├── assets/              — Images, icons, Lottie JSON files
│   ├── component/           — 25+ reusable UI components
│   ├── configs/             — Loader, Toast config
│   ├── constant/            — App colors and constants
│   ├── language/            — EN/HI string tables
│   ├── navigators/          — AppNavigator, TabNavigator, RegistrationRoutes
│   ├── redux/
│   │   ├── Api/             — callApi(), callMultipleApis(), endpoints, apiRequests
│   │   ├── feature/         — authSlice.js 🔴, featuresSlice.js 🔴
│   │   └── Store.js         — Redux store + persist config
│   ├── routes/              — Route enums and screen-route config
│   ├── screen/
│   │   ├── Auth/            — 9 auth/onboarding screens
│   │   ├── BottamTab/       — 4 bottom-tab screens (HomeScreen, Bookings, Profile, Earnings)
│   │   ├── Feature/         — 26 feature screens
│   │   ├── bookingflow/     — 10 booking-flow screens
│   │   ├── modal/           — 4 modal components
│   │   ├── profile/         — EditProfile
│   │   └── Chat/            — Chat.js (incomplete)
│   ├── services/            — trackingEngine, trackingNotifications, socket shim
│   └── utils/               — searchEngine, useAsync hook
```

---

## 4. Screen Inventory

**Total screens: 60+**

### Auth Screens (9)

| Screen | File | Status |
|--------|------|--------|
| Splash | `Auth/Splash.tsx` | ✅ Complete |
| Language Select | `Auth/Language.tsx` | ✅ Complete |
| Location Fetcher | `Auth/LocationFetcher.tsx` | ✅ Complete |
| Phone Login | `Auth/PhoneLogin.tsx` | ✅ Complete |
| OTP Verification | `Auth/OTPVerification.tsx` | ✅ Complete |
| User Info Form | `Auth/UserInfoForm.tsx` | ✅ Complete |
| Partner Service Selection | `Auth/PartnerServiceSelectionScreen.tsx` | ✅ Complete |
| Partner Documents | `Auth/PartnerDocumentsScreen.tsx` | ✅ Complete |
| Partner Info Form | `Auth/PartnerInfoForm.tsx` | 🔴 Empty stub |

### Bottom Tab Screens (4)

| Screen | File | Size | Status |
|--------|------|------|--------|
| Home | `BottamTab/HomeScreen.tsx` | 61 KB | ✅ Complete |
| My Bookings | `BottamTab/MyBookingsScreen.tsx` | — | ✅ Complete |
| Profile Settings | `BottamTab/ProfileSettingsScreen.tsx` | — | ✅ Complete |
| Earnings | `BottamTab/EarningsScreen.tsx` | — | ✅ Complete |

### Feature Screens (26)

| Screen | File | Size | Status |
|--------|------|------|--------|
| All Services | `Feature/AllServicesScreen.tsx` | — | ✅ Complete |
| Nearby Providers | `Feature/NearbyProvidersScreen.tsx` | 34 KB | ✅ Complete |
| Booking Track | `Feature/BookingTrackScreen.tsx` | 33 KB | ✅ Complete |
| Wallet | `Feature/WalletScreen.tsx` | — | ✅ Complete |
| Notifications | `Feature/NotificationList.tsx` | — | ✅ Complete |
| Feedback | `Feature/FeedbackScreen.tsx` | — | ✅ Complete |
| How To Use | `Feature/HowToUseScreen.tsx` | — | ✅ Complete |
| Policies | `Feature/PoliciesScreen.tsx` | — | ✅ Complete |
| Addresses | `Feature/AddressesScreen.tsx` | — | ✅ Complete |
| Location Picker | `Feature/LocationPickerScreen.tsx` | — | ✅ Complete |
| Help & Support | `Feature/PartnerHelpSupportScreen.tsx` | — | ✅ Complete |
| Refer To Earn | `Feature/ReferToEarnScreen.tsx` | — | ✅ Complete |
| Referral | `Feature/ReferralScreen.tsx` | — | ✅ Complete |
| Job Details | `Feature/JobDetailsScreen.tsx` | — | ✅ Complete |
| Review Booking | `Feature/ReviewBookingScreen.tsx` | — | ✅ Complete |
| Service Bottom Sheet | `Feature/ServiceBottomSheet.tsx` | 15 KB | ✅ Complete |

### Booking Flow Screens (10)

| Screen | File | Size | Status |
|--------|------|------|--------|
| Service Booking | `bookingflow/ServiceBookingScreen.tsx` | 21 KB | ✅ Complete |
| Booking Details | `bookingflow/BookingDetailsScreen.tsx` | 19 KB | ✅ Complete |
| Payment | `bookingflow/PaymentScreen.tsx` | 37 KB | ⚠️ Partial (Cashfree wiring unclear) |
| Apply Coupon | `bookingflow/ApplyCouponScreen.tsx` | — | ⚠️ Partial (mock data) |
| Arrival Charges | `bookingflow/ArrivalChargesScreen.tsx` | — | ✅ Complete |
| Live Tracking Map | `bookingflow/LiveTrackingMap.tsx` | — | ✅ Complete |
| Recurring Booking | `bookingflow/RecurringBookingScreen.tsx` | 25 KB | ✅ Complete |
| OTP Modal | `bookingflow/OTPModal.tsx` | — | ✅ Complete |
| Invoice | `bookingflow/invoiceData.tsx` | — | ⚠️ Partial |
| Coupon Data | `bookingflow/couponData.ts` | — | ⚠️ Mock only |

### Modal & Profile Screens

| Screen | File | Status |
|--------|------|--------|
| Edit Profile | `profile/EditProfile.tsx` | ✅ Complete |
| Approval Waiting | `modal/ApprovalWaitingModal.tsx` | ✅ Complete |
| Logout | `modal/LogoutModal.tsx` | ⚠️ Partial (no API logout) |
| Job Modal | `modal/JobModalProps.tsx` | ✅ Complete |
| Withdrawal Sheet | `modal/WithdrawalSheet.tsx` | ✅ Complete |
| Chat | `Chat/Chat.js` | ⚠️ Partial |

---

## 5. Navigation Architecture

```
AppNavigator (root)
└── RegistrationRoutes (Stack — 31 screens)
    ├── SPLASH_SCREEN
    ├── LANGUAGE_SELECT
    ├── LocationFetcher
    ├── PhoneLogin
    ├── OTPVerification
    ├── UserInfoForm
    ├── PartnerServiceSelectionScreen
    ├── PartnerDocumentsScreen
    ├── ... (all feature screens registered here)
    └── TabNavigator (Bottom Tabs)
        ├── HOME_SCREEN (HomeScreen)
        ├── BOOKING_SCREEN (MyBookingsScreen)
        └── PROFILE_SCREEN (ProfileSettingsScreen)
```

- Gesture navigation enabled
- Custom fade animation on Language screen
- Global `navigationRef` exported for use in services (FCM handlers)
- 34 route enum values defined in `screenName.enum.ts`

---

## 6. State Management

**Redux Toolkit** with **redux-persist**:

| Slice | File | State Keys | Thunks | Status |
|-------|------|-----------|--------|--------|
| auth | `authSlice.js` | isLoading, isError, isSuccess, userData, isLogin, isLogOut, User | login, reset_password, verify_otp, Create_new_password, Sign_up, create_bussiness, get_profile | 🔴 All thunks broken (BUG-001) |
| features | `featuresSlice.js` | isLoading, isError, bussinessData, nearByStore, dashboardData, etc. | send_message_help, get_Bussiness_data, get_save_Bussines, get_Bussiness_list, get_dashboard_data, get_near_by_business, update_profile, get_business_details | 🔴 All thunks broken (BUG-001 + 002) |

**Persistence**: Only `auth` slice is persisted via AsyncStorage.

---

## 7. Third-Party Integrations

| Integration | Library | Version | Status |
|-------------|---------|---------|--------|
| Firebase FCM | @react-native-firebase/messaging | 21.12.0 | ✅ Working |
| Google Maps | react-native-maps | 1.3.2 | ✅ Working |
| Google Places | react-native-google-places-autocomplete | 2.5.7 | ✅ Working |
| Cashfree Payments | react-native-cashfree-pg-sdk | 2.2.0 | ⚠️ Imported, wiring unclear |
| Voice Recognition | @react-native-voice/voice | 3.2.4 | ✅ Working |
| Text-to-Speech | react-native-tts | 4.1.1 | ✅ Working |
| ML Kit (OCR) | @react-native-ml-kit/text-recognition | 1.5.2 | ✅ Present |
| Lottie Animations | lottie-react-native | 7.3.1 | ✅ Working |
| Reanimated | react-native-reanimated | 3.10.1 | ✅ Working |
| Bottom Sheet | @gorhom/bottom-sheet | 4.6.1 | ✅ Working |

---

## 8. Security Assessment

| Issue | Severity | Status |
|-------|----------|--------|
| Google Maps API key in source | 🟠 HIGH | Exposed in `config.ts` |
| Auth token in plain AsyncStorage | 🟠 HIGH | No encryption |
| No token expiry / refresh | 🟠 HIGH | Silent failures |
| No cert pinning | 🟡 MEDIUM | MITM risk |
| 120+ console.log in production | 🟡 MEDIUM | PII leakage risk |
| No server-side logout | 🟡 MEDIUM | Token remains valid after logout |
| No auth guard / 401 handling | 🟡 MEDIUM | No auto-redirect |

---

## 9. Performance Assessment

| Issue | Severity | File |
|-------|----------|------|
| HomeScreen 61KB single component | 🟡 MEDIUM | `HomeScreen.tsx` |
| PaymentScreen 37KB single component | 🟡 MEDIUM | `PaymentScreen.tsx` |
| Tracking engine at 350ms — no throttle | 🟡 MEDIUM | `trackingEngine.ts` |
| Duplicate geolocation libraries | 🟡 MEDIUM | package.json |
| Duplicate date libraries | 🟢 LOW | package.json |
| Duplicate calendar libraries | 🟢 LOW | package.json |
| Duplicate image picker libraries | 🟢 LOW | package.json |
| No API response caching | 🟢 LOW | All API files |
| No memoization on large lists | 🟡 MEDIUM | `NearbyProvidersScreen.tsx` |

---

## 10. Code Quality

| Metric | Value |
|--------|-------|
| Screen components | 60+ |
| Total API endpoints wired | 40+ |
| Redux async thunks | 15 (all broken) |
| console.log statements in Redux layer | ~120 |
| Commented-out code lines | ~199 |
| TODO / FIXME comments | 1 found |
| TypeScript coverage | ~60% (many JS files) |
| Empty / stub files | 1 (`PartnerInfoForm.tsx`) |

---

## 11. Overall Completion Estimate

| Area | % Done |
|------|--------|
| UI / Screens | 95% |
| Navigation | 100% |
| Auth flow (OTP) | 90% |
| Service discovery | 100% |
| Booking flow | 85% |
| Payments | 60% |
| Real-time tracking | 100% |
| Notifications | 100% |
| Profile / Settings | 90% |
| Support tickets | 100% |
| Referrals | 100% |
| Redux wiring | 30% (broken imports) |
| Security hardening | 20% |
| Chat | 30% |
| **OVERALL** | **~78%** |

---

## 12. Linked Documents

- [USER_APP_FEATURES.md](USER_APP_FEATURES.md) — Per-feature status table
- [USER_APP_APIS.md](USER_APP_APIS.md) — All API endpoints
- [USER_APP_BUGS.md](USER_APP_BUGS.md) — All bugs and issues
- [PROJECT_PROGRESS.md](PROJECT_PROGRESS.md) — Overall project status
