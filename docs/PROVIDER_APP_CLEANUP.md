# Provider App – Code Cleanup Audit

**Date:** 2026-06-21
**App:** SerSLO Provider App (React Native 0.73) — `servslo_partner`
**Scope:** src/ directory only

---

## Legend

| Column | Meaning |
|--------|---------|
| File Path | Relative to `src/` |
| Why Unused | Reason for classification |
| Safe to Delete | Yes / No / Conditional |
| Dependencies | What depends on this file, or what this file depends on |

---

## 1. BikeDoctor-Specific Code

Same root cause as the user app — the codebase was forked from `mrbikedoctors.com` and the API layer was never migrated.

| File Path | Why Unused | Safe to Delete | Dependencies |
|-----------|-----------|----------------|--------------|
| `redux/Api/endpoints.tsx` | Every endpoint is `/bikedoctor/…` (login, OTP, services, banners, bikes, tickets, bookings). No SerSLO provider endpoints exist. | **No** – `apiRequests.tsx` imports it. Must be **replaced** with SerSLO provider endpoints. | Used by `redux/Api/apiRequests.tsx` |
| `redux/Api/index.tsx` (lines 13-14) | `base_url = 'https://mrbikedoctors.com/api'` and `image_url = 'https://mrbikedoctors.com/image/'` hard-coded to BikeDoctor's server. Also imports `react-native-image-crop-picker` for `captureImage`/`selectImageFromGallery` helpers used nowhere in active screens. | **No** – Whole API layer references these URLs. Must be **replaced**, not deleted alone. | Imported by `redux/Api/apiRequests.tsx`; `component/HostelList.tsx` (also unused) |
| `redux/Api/apiRequests.tsx` | Entire file implements BikeDoctor domain: bikes, garages, dealers, bike variants, pickup-and-drop. All 35+ exported functions are either for the motorcycle-garage workflow or never imported by any active screen. | **Yes** – No active screen calls any function from this file. | None (callers are themselves unused or non-existent) |
| `component/HorizontalList.tsx` | Renders a bike list; navigates to `ScreenNameEnum.MY_BIKES` which doesn't exist in routes. Zero imports outside its own file. | **Yes** | Not imported anywhere |
| `component/HostelList.tsx` | Displays garage/hostel items; navigates to `ScreenNameEnum.HostelDetailsScreen` (not in routes). Zero imports. | **Yes** | Not imported anywhere |
| `component/VerticalshopList.tsx` | Shows bike-shop cards; navigates to `ScreenNameEnum.GARAGE_DETAILS` (not in routes). Zero imports. | **Yes** | Not imported anywhere |
| `component/VerticalList.tsx` | Navigates to `ScreenNameEnum.BIKE_DETAILS` (not in routes). Imported only from `HorizontalList.tsx` (itself unused). | **Yes** (after deleting HorizontalList) | `component/HorizontalList.tsx` (unused) |

---

## 2. Unused Screens

Screens not registered in routes OR registered but never navigated to from any active screen.

| File Path | Why Unused | Safe to Delete | Dependencies |
|-----------|-----------|----------------|--------------|
| `screen/Chat/Chat.js` | Not registered in routes. Not imported or navigated to from anywhere in the app. No backend. | **Yes** | None |
| `screen/profile/EditProfile.tsx` | Not in routes. Not navigated to from any active screen (`EditProfileScreen.tsx` under `screen/Feature/` is the real one in routes). Contains hardcoded test data: `name='Rohan sahj'`, `phone='7828690192'`, `email='kunalsahusahi@gmail.com'`. | **Yes** | None |
| `screen/Feature/ArrivalConfirmation.tsx` | Not registered in `screenName.enum.ts` or `routes.ts`. Not imported or navigated to from any active screen — grep returns no callers. The provider arrival-confirmation flow is an unimplemented gap. | **Yes** (the component is dead; the **feature** must be built properly and wired into routes) | None |
| `screen/Feature/NotificationBell.tsx` | Exports a notification bell icon component but is **never imported** by any other file. Not a registered screen. | **Yes** | None |

---

## 3. Unused Components

Components with zero imports outside their own file.

| File Path | Why Unused | Safe to Delete | Dependencies |
|-----------|-----------|----------------|--------------|
| `component/AddressAutocomplete.tsx` | Zero imports anywhere. Duplicate of `component/AutoAddress.tsx` which wraps the same Google Places Autocomplete library. Also exposes a hardcoded Google Maps API key. | **Yes** | None |
| `component/BookingList.tsx` | Zero imports outside its own file. Calls `cancel_booking` from the BikeDoctor API layer. | **Yes** | Imports `redux/Api/apiRequests.tsx` (BikeDoctor) |
| `component/Loader.tsx` | Zero imports. The app uses `src/configs/Loader/index.tsx` instead. | **Yes** | None |
| `component/ProfileList.tsx` | Zero imports anywhere. Not wired to any screen. | **Yes** | None |
| `component/ScratchCardList.tsx` | Zero imports. Scratch-card gamification — user-facing feature with no place in the provider app. | **Yes** | None |
| `component/SeeallHeader.tsx` | Zero imports anywhere. | **Yes** | None |
| `component/SelectLocation.js` | Zero imports. The app uses `LocationContext.js` and `@react-native-community/geolocation` instead. | **Yes** | None |
| `component/fontStyles.tsx` | Zero imports anywhere. | **Yes** | None |
| `component/UploadImageModal.tsx` | Zero imports anywhere. The app uses `component/ImagePickerSheet.tsx` instead. Uses `react-native-modal` as its only consumer. | **Yes** | Sole consumer of `react-native-modal` package |
| `component/Notification.js` | Zero imports. Push notifications are set up via `@react-native-firebase/messaging` directly in `AppNavigator.js`. | **Yes** | None |
| `component/Localization/Localization.js` | Loaded only by `component/Localization/LanguageContext.js` (also unused). The active i18n layer is `src/language/LanguageContext.tsx`. | **Yes** | `component/Localization/LanguageContext.js` |
| `component/Localization/LanguageContext.js` | Not imported anywhere. Active context is `src/language/LanguageContext.tsx`. | **Yes** | `component/Localization/Localization.js`, `component/Localization/localization.json` |
| `component/Localization/localization.json` | Only loaded by the unused `Localization.js`. | **Yes** | `component/Localization/Localization.js` |

---

## 4. Unused APIs

API functions exported from `redux/Api/apiRequests.tsx` — every function here is unused. The entire file targets BikeDoctor endpoints and is never imported by any active screen.

| Function | Endpoint | Why Unused |
|----------|----------|------------|
| `Login_witPhone` | `POST /bikedoctor/userAuth/userLogin` | Auth handled via `PhoneLogin.tsx` with a separate call |
| `otp_Verify` | `POST /bikedoctor/userAuth/otpVerify` | OTP handled in `OTPVerification.tsx` directly |
| `resend_Otp` | `POST /bikedoctor/userAuth/resendOtp` | Not imported anywhere |
| `add_Profile` | `POST /bikedoctor/userAuth/addProfile` | Not imported anywhere |
| `get_states` | `GET /location/getAllStateData` | Not imported anywhere |
| `get_citys` | `GET /location/getCityByState/:stateId` | Not imported anywhere |
| `get_servicelist` | `GET /bikedoctor/service/servicelist` | Not imported; provider services fetched differently |
| `get_bannerlist` | `GET /bikedoctor/banner/bannerlist` | Not imported anywhere |
| `get_nearyBydeler` | `GET /bikedoctor/dealer/dealerWithInRange` | Dealer concept irrelevant |
| `get_userbooking` | `GET /bikedoctor/bookings/getuserbookings` | Not imported anywhere |
| `get_mybikes` | `GET /bikedoctor/customers/getMyBikes` | Bike concept irrelevant |
| `add_Bikes` | `POST /bikedoctor/customers/addUserBike` | Not imported |
| `get_BikeCompany` | `GET /bikedoctor/bike/get-bike-companies` | Not imported |
| `get_BikeModel` | `GET /bikedoctor/bike/get-bike-models/:company_id` | Not imported |
| `get_BikeVariant` | `GET /bikedoctor/bike//get-bike-variants/:model_id` | Not imported (note double slash in endpoint) |
| `remove_bike` | `DELETE /bikedoctor/customers/deleteMyBike/:bike_id` | Not imported |
| `garage_details` | `GET /bikedoctor/dealer/getShopDetails` | Not imported |
| `get_FilterBydeler` | `GET /bikedoctor/dealer/dealerWithInRange2` | Not imported |
| `addPickupAddress` | `POST /bikedoctor/pickndrop/addpickndrop` | Not imported |
| `create_booking` | `POST /bikedoctor/bookings/createBooking` | Not imported; SerSLO uses separate flow |
| `get_profile` | `GET /bikedoctor/customers/customer` | Not imported |
| `updateProfile` | `PUT /bikedoctor/customers/editcustomer/:id` | Not imported |
| `updateProfileImage` | `POST /bikedoctor/customers/editimage` | Not imported |
| `bookingdetails` | `GET /bikedoctor/bookings/getBookingDetails/:id` | Not imported |
| `cancel_booking` | `PUT /bikedoctor/bookings/updateBookingStatus` | Not imported by any active screen |
| `get_tikit` | `GET /bikedoctor/ticket/my-tickets` | Not imported |
| `create_tikit` | `POST /bikedoctor/ticket/create` | Not imported |
| `get_tikitdetails` | `GET /bikedoctor/ticket/tickets/:ticket_id` | Not imported |
| `replay_tikit` | `POST /bikedoctor/ticket/reply/:ticket_id` | Not imported |
| `tikitstatus` | `PUT /bikedoctor/ticket/status/:ticket_id` | Not imported |
| `callMultipleApis` | n/a | Utility for BikeDoctor batch calls; unused |
| `callApi` | n/a | Generic wrapper; unused by active screens |
| `requestCameraPermissions` | n/a | Duplicates `react-native-permissions`; unused |
| `captureImage` | n/a | Uses `react-native-image-crop-picker`; unused by active screens |
| `selectImageFromGallery` | n/a | Uses `react-native-image-crop-picker`; unused by active screens |

> **Note:** Unlike the user app, the provider app has **no active callers** for even `cancel_booking`. The entire `apiRequests.tsx` file can be deleted once `HorizontalList.tsx` and `BookingList.tsx` are removed.

---

## 5. Unused Packages

### DELETE NOW — Zero usage in active source tree

| Package | Evidence | Safe to Remove |
|---------|----------|----------------|
| `@react-native-community/checkbox` | 0 source files import it | **Yes** |
| `@react-native-ml-kit/text-recognition` | 0 source files import it | **Yes** |
| `@react-native-picker/picker` | 0 source files import it (element-dropdown used instead) | **Yes** |
| `cashfree-pg-api-contract` | 0 source files import it | **Yes** |
| `react-native-cashfree-pg-sdk` | 0 source files import it | **Yes** |
| `expo-file-system` | 0 source files import it | **Yes** |
| `expo-sharing` | 0 source files import it | **Yes** |
| `lodash` | 0 source files import it | **Yes** |
| `react-native-bouncy-checkbox` | 0 source files import it | **Yes** |
| `react-native-calendar-picker` | 0 source files import it | **Yes** |
| `react-native-calendar-timetable` | 0 source files import it | **Yes** |
| `react-native-calendars` | 0 source files import it | **Yes** |
| `react-native-chart-kit` | 0 source files import it — `PerformanceScreen` uses custom `View`-based drawing, no chart library | **Yes** |
| `react-native-check-box` | 0 source files import it | **Yes** |
| `react-native-confirmation-code-field` | 0 source files import it — OTP input is a custom implementation | **Yes** |
| `react-native-country-codes-picker` | 0 source files import it | **Yes** |
| `react-native-date-picker` | 0 source files import it | **Yes** |
| `react-native-dotenv` | 0 source files import it | **Yes** |
| `react-native-elements` | 0 source files import it | **Yes** |
| `react-native-fs` | 0 source files import it | **Yes** |
| `react-native-get-random-values` | 0 source files import it | **Yes** |
| `react-native-image-slider-box` | 0 source files import it | **Yes** |
| `react-native-loading-dots` | 0 source files import it | **Yes** |
| `react-native-localize` | 0 source files import it | **Yes** |
| `react-native-paper` | 0 source files import it | **Yes** |
| `react-native-qrcode-svg` | 0 source files import it | **Yes** |
| `react-native-radio-buttons-group` | 0 source files import it | **Yes** |
| `react-native-render-html` | 0 source files import it | **Yes** |
| `react-native-share` | 0 source files import it (ReferToEarnScreen uses `Share` from core `react-native`, not this package) | **Yes** |
| `react-native-status-bar-height` | 0 source files import it | **Yes** |
| `react-native-svg-transformer` | 0 source files import it | **Yes** |
| `react-native-three-dots-loader` | 0 source files import it | **Yes** |
| `react-native-video` | 0 source files import it | **Yes** |
| `react-native-video-controls` | 0 source files import it | **Yes** |
| `react-native-webview` | 0 source files import it | **Yes** |
| `react-native-reanimated-carousel` | 0 source files import it | **Yes** |
| `styled-components` | 0 source files import it | **Yes** |
| `date-fns` | 0 source files import it (`moment` is the active date library) | **Yes** |

### DELETE LATER — Used only in files that are themselves unused or in BikeDoctor layer

| Package | Where Used | Why Delete Later |
|---------|-----------|-----------------|
| `react-native-image-crop-picker` | `redux/Api/index.tsx` (`captureImage`, `selectImageFromGallery`) only | That helper is part of the BikeDoctor layer (§1). Remove after refactoring `index.tsx`. |
| `react-native-localization` | `component/Localization/Localization.js` only | That file is unused (§3). Remove after deleting Localization folder. |
| `react-native-modal` | `component/UploadImageModal.tsx` only | That component is unused (§3). Remove after deleting `UploadImageModal.tsx`. |
| `prop-types` | `screen/Auth/PartnerDocumentsScreen.tsx` | Keep while this screen remains; remove if the prop-types import is migrated to TypeScript types. |

### KEEP — Actively used

| Package | Active Usage |
|---------|-------------|
| `@react-native-community/geolocation` | `component/helperFunction.js` |
| `@react-native-community/datetimepicker` | Booking/schedule date pickers |
| `@react-native-firebase/app` | Firebase initialization |
| `@react-native-firebase/messaging` | Push notifications in `AppNavigator.js` |
| `@react-native-community/push-notification-ios` | iOS push channel |
| `react-native-push-notification` | Android push channel |
| `@react-native-voice/voice` | Voice commands (if wired in HomeScreen future iteration) |
| `react-native-tts` | Text-to-speech in `HomeScreen.tsx` |
| `react-native-maps` | `NearbyJobsFeedScreen.tsx`, `JobDetailsScreen.tsx` |
| `react-native-geolocation-service` | Provider location tracking |
| `react-native-google-places-autocomplete` | `component/AutoAddress.tsx` |
| `react-native-image-picker` | `component/ImagePickerSheet.tsx`, `screen/Feature/JobDetailsScreen.tsx` |
| `react-native-element-dropdown` | Service selection dropdowns |
| `react-native-haptic-feedback` | `component/utils/Constant.js` |
| `react-native-linear-gradient` | UI gradients throughout |
| `react-native-permissions` | Location / camera for PartnerInfoForm & document upload |
| `react-native-vector-icons` | Icons throughout |
| `react-native-safe-area-context` | Navigation |
| `react-native-toast-message` | Toast alerts |
| `lottie-react-native` | Loading animations |
| `react-native-gesture-handler` | Navigation |
| `react-native-reanimated` | Animations |
| `react-native-screens` | Navigation |
| `react-native-svg` | SVG icon rendering |
| `react-native-circular-progress` | `screen/Feature/JobDetailsScreen.tsx`, `screen/modal/JobModalProps.tsx` |
| `@gorhom/bottom-sheet` | `EarningsScreen`, `EarningsFullDetailsScreen`, `WithdrawalSheet` |
| `react-native-responsive-screen` | `hp()`/`wp()` via `component/utils/Constant.js` |
| `moment` | `component/utils/Constant.js`, bookings date formatting |
| `axios` | API calls |
| `@reduxjs/toolkit` | Redux store |
| `react-redux` | React-Redux bindings |
| `redux-persist` | Persisted auth state |

---

## 6. Dead Redux Code

### `redux/feature/authSlice.js`

All thunks call `/auth/…` endpoints that do not match the active auth flow. `PhoneLogin.tsx` → `OTPVerification.tsx` → `PartnerInfoForm.tsx` handles auth entirely without Redux.

| Thunk / Action | Status | Reason |
|----------------|--------|--------|
| `login` (email + password) | **Dead** | App uses phone-OTP. This navigates to `ScreenNameEnum.BOTTAM_TAB` (typo-based enum not in routes). |
| `reset_password` | **Dead** | Navigates to `ScreenNameEnum.OTP_SCREEN` — not in routes. |
| `verify_otp` | **Dead** | Navigates to `ScreenNameEnum.CreatePassword` — not in routes. |
| `Create_new_password` | **Dead** | Navigates to `ScreenNameEnum.LOGIN_SCREEN` — not in routes. |
| `Sign_up` | **Dead** | `catch` block references `response` which is out of scope — throws `ReferenceError` before it can ever succeed. |
| `create_bussiness` | **Dead** | Business directory feature; never dispatched from any screen. |
| `get_profile` | **Dead** | Never dispatched; `state.User` is never read anywhere. |
| `loginSuccess` action | **Remove with `login`** | Only used inside the dead `login` thunk. |

> Safe to delete: all thunks above. Keep only the `userData`, `isLogin`, and `isLogOut` state fields if any screen reads Redux auth state directly. Audit with `useSelector(state => state.auth.*)` grep before pruning the slice entirely.

### `redux/feature/featuresSlice.js`

Entire slice is dead — none of these thunks are dispatched from any screen.

| Thunk | Reason |
|-------|--------|
| `send_message_help` | Calls `/common/ask_support`. Not dispatched anywhere. |
| `get_Bussiness_data` | Business directory. Not dispatched. |
| `get_save_Bussines` | Exact duplicate endpoint as `get_Bussiness_data`. Not dispatched. |
| `get_Bussiness_list` | Business filtering. Not dispatched. |
| `get_dashboard_data` | Business dashboard. Not dispatched. |
| `get_near_by_business` | Writes to `state.Bussinesslist` — collides with `get_Bussiness_list` key. Not dispatched. |
| `update_profile` | Not dispatched from any screen. |
| `get_business_details` | Not dispatched. |

**State fields never read:** `bussinessData`, `bussinessDetails`, `dashboardData`, `Bussinesslist`, `nearByStore`, `saveBusinessData`.

> Safe to delete: the entire `featuresSlice.js` and its `feature: FeatureReducer` entry in `Store.js`.

---

## 7. Duplicate Libraries

| Duplicate Pair | What They Do | Which to Keep | Which to Remove |
|----------------|--------------|---------------|-----------------|
| `react-native-image-crop-picker` vs `react-native-image-picker` | Both pick/capture images. `image-crop-picker` is used only in the unused `redux/Api/index.tsx` helper. `image-picker` is used in `JobDetailsScreen.tsx` and `ImagePickerSheet.tsx`. | **`react-native-image-picker`** | `react-native-image-crop-picker` (after refactoring `redux/Api/index.tsx`) |
| `src/component/Localization/` (3 files) vs `src/language/` | Both provide i18n/language switching. The entire app uses `src/language/LanguageContext.tsx`. The `component/Localization/` folder is dead. | **`src/language/`** | Entire `src/component/Localization/` folder + `react-native-localization` package |
| `component/AddressAutocomplete.tsx` vs `component/AutoAddress.tsx` | Both wrap `react-native-google-places-autocomplete`. `AutoAddress` is used in `PartnerInfoForm.tsx`. `AddressAutocomplete` has zero imports. | **`component/AutoAddress.tsx`** | `component/AddressAutocomplete.tsx` |
| `component/Notification.js` vs Firebase in `AppNavigator.js` | Both set up push notifications. `AppNavigator.js` uses `@react-native-firebase/messaging` directly. `Notification.js` is never imported. | **Firebase setup in `AppNavigator.js`** | `component/Notification.js` |
| `component/UploadImageModal.tsx` vs `component/ImagePickerSheet.tsx` | Both expose image pick/capture UI. `ImagePickerSheet` uses `react-native-image-picker` and is the active one. `UploadImageModal` has zero imports. | **`component/ImagePickerSheet.tsx`** | `component/UploadImageModal.tsx` |

---

## 8. Mock / Demo Data

Hard-coded static data masquerading as real live data.

| File | Mock Data | Risk |
|------|-----------|------|
| `screen/BottamTab/HomeScreen.tsx` | `HOME_NEARBY_JOBS` array — 4 hardcoded jobs: `Priya Sharma` (AC Repair, Shivaji Nagar, ₹550), `Ravi Kumar` (Electrician, ₹400), `Sunita Devi` (Plumbing, ₹350), `Mohan Lal` (AC Service, ₹480). All in Indore. | **High** — Provider sees fake jobs on their home dashboard. Real job assignments will never show until replaced. |
| `screen/Feature/invoiceData.tsx` | Static invoice: `booking_id: 'BOOK12345'`, `customer_name: 'Aman Verma'`, `customer_address: 'Flat 203, Green Heights, Andheri East, Mumbai'`, `service_type: 'Bathroom Cleaning'`, `date: '30 July 2025'` | **High** — Every provider sees the same "Aman Verma" invoice on every job. |
| `screen/profile/EditProfile.tsx` (legacy, §2) | `name='Rohan sahj'`, `phone='7828690192'`, `email='kunalsahusahi@gmail.com'` — hardcoded personal test data | **Low** — Screen is not in routes, but file exists in the repo and could accidentally resurface. |
| `screen/Feature/HowToUseScreen.tsx` | Support number `'1800-XXX-XXXX'` and `Linking.openURL('tel:1800XXXXXXX')` — placeholder never replaced | **Medium** — Provider tapping Help gets a broken call to a non-existent number. |
| `screen/Feature/PerformanceScreen.tsx` | All performance metrics (completion rate, response time, earnings, ratings, job counts) are hard-coded inline arrays/constants. No Redux or API calls. | **High** — Provider sees fabricated KPIs on every launch. |
| `screen/Feature/ReferToEarnScreen.tsx` | `referralCode = 'ROHAN1234'` hardcoded. Referral tracking has no backend. | **Medium** — Sharing this code does nothing; rewards can never be delivered. |
| `screen/Feature/NearbyJobsFeedScreen.tsx` | Job feed is populated by static data received from `HomeScreen` navigation params (the same `HOME_NEARBY_JOBS` mock array) or its own hardcoded defaults. | **High** — Provider's job feed never reflects real assignments. |
| `screen/Feature/EarningsFullDetailsScreen.tsx` | Earnings history, payout totals, and transaction rows are hard-coded inline. No Redux or API dispatch. | **High** — Provider sees fabricated earnings and payout history. |
| `screen/Feature/JobDetailsScreen.tsx` | Job status flow is driven by a local `useState` step counter, not by backend job state. OTP verification is simulated locally. | **High** — Provider can complete a "job" without any backend confirmation. |
| `screen/Feature/AllBookingsScreen.tsx` | Booking list is hard-coded data displayed inline, not fetched from Redux or any API. | **High** — Booking history always shows the same static entries. |
| `screen/Feature/HeaderComponent.tsx` | Notification badge hard-codes `count={3}` and unread count is never fetched. | **Low** — Visual only; badge always shows 3 regardless of real notifications. |
| `screen/Feature/invoiceData.tsx` (stray file) | A `download.jpeg` image asset sits in `screen/Feature/` — an accidentally committed test asset. | **Low** — Bloats the bundle; should be moved to `assets/` or deleted. |

---

## 9. Features Not Required for SerSLO MVP

| Feature | File(s) | Reason Not MVP | Safe to Defer |
|---------|---------|---------------|---------------|
| **Refer & Earn** | `screen/Feature/ReferToEarnScreen.tsx` | Referral tracking requires backend. Code is incomplete (`referralCode = 'ROHAN1234'` hardcoded). | **Yes** |
| **Earnings Full Details** | `screen/Feature/EarningsFullDetailsScreen.tsx` | All earnings data is hardcoded (§8). No payout backend exists. | **Yes** (keep `EarningsScreen` tab but disable deep-link) |
| **Withdrawal Sheet** | `screen/modal/WithdrawalSheet.tsx` | Depends on `EarningsFullDetailsScreen` payment flow; no Cashfree integration wired. | **Yes** |
| **Performance Screen** | `screen/Feature/PerformanceScreen.tsx` | All KPIs are mock (§8). Needs a real analytics/ratings backend. | **Yes** |
| **Nearby Jobs Feed** | `screen/Feature/NearbyJobsFeedScreen.tsx` | Job data is mock (§8). Uses `react-native-maps` but shows static locations. | **Yes** (disable navigation entry from HomeScreen) |
| **Job Invoice Screen** | `screen/Feature/invoiceData.tsx` | Hardcoded invoice (§8). Invoice generation requires real booking data. | **Yes** |
| **In-App Chat** | `screen/Chat/Chat.js` | Not in routes. No chat backend. | **Yes** |
| **Approval Waiting Modal** | `screen/modal/ApprovalWaitingModal.tsx` | Used in `JobDetailsScreen` for a locally simulated verification step — not connected to a real approval system. | **Conditional** — keep UI, but backend must drive the visible state. |
| **Quick Actions Screen** | `screen/Feature/QuickActionsScreen.tsx` | The screen itself is reachable, but most of its action targets (`EarningsFullDetailsScreen`, `PerformanceScreen`, `ReferToEarnScreen`, `JobInvoiceScreen`) are post-MVP stubs. | **Conditional** — keep screen; hide/disable buttons for post-MVP targets. |
| **All Bookings Screen** | `screen/Feature/AllBookingsScreen.tsx` | Booking list is hardcoded (§8). Keep screen structure, replace data with real API. | **No — keep for launch, replace mock data** |
| **Job Details Screen** | `screen/Feature/JobDetailsScreen.tsx` | Core provider workflow but job state is fully mocked (§8). Keep screen, replace mock flow with real backend. | **No — keep for launch, wire to backend** |

---

## Summary Tables

### A. DELETE_NOW

Confirmed dead: zero active callers, wrong domain (BikeDoctor), no routes entry, or duplicate.

| # | Path | Category |
|---|------|----------|
| 1 | `redux/Api/endpoints.tsx` | BikeDoctor endpoints |
| 2 | `redux/Api/apiRequests.tsx` | BikeDoctor API functions (no active callers) |
| 3 | `redux/feature/featuresSlice.js` | Dead Redux slice (all thunks unreachable) |
| 4 | `component/HorizontalList.tsx` | BikeDoctor UI, zero imports |
| 5 | `component/HostelList.tsx` | BikeDoctor UI, zero imports |
| 6 | `component/VerticalshopList.tsx` | BikeDoctor UI, zero imports |
| 7 | `component/VerticalList.tsx` | BikeDoctor UI, zero imports (used only by HorizontalList) |
| 8 | `component/AddressAutocomplete.tsx` | Duplicate of AutoAddress, zero imports |
| 9 | `component/BookingList.tsx` | Calls BikeDoctor cancel_booking, zero imports |
| 10 | `component/Loader.tsx` | Replaced by `configs/Loader/index.tsx`, zero imports |
| 11 | `component/ProfileList.tsx` | Zero imports |
| 12 | `component/ScratchCardList.tsx` | Zero imports, user-side feature |
| 13 | `component/SeeallHeader.tsx` | Zero imports |
| 14 | `component/SelectLocation.js` | Replaced by LocationContext, zero imports |
| 15 | `component/fontStyles.tsx` | Zero imports |
| 16 | `component/UploadImageModal.tsx` | Replaced by ImagePickerSheet, zero imports |
| 17 | `component/Notification.js` | Replaced by Firebase in AppNavigator, zero imports |
| 18 | `component/Localization/` (folder, 3 files) | Replaced by `src/language/`, zero imports |
| 19 | `screen/Chat/Chat.js` | Not in routes, no backend |
| 20 | `screen/profile/EditProfile.tsx` | Not in routes, hardcoded test data |
| 21 | `screen/Feature/ArrivalConfirmation.tsx` | Not in routes, zero callers |
| 22 | `screen/Feature/NotificationBell.tsx` | Zero imports anywhere |
| 23 | All dead thunks in `redux/feature/authSlice.js` | Wrong domain, broken navigation targets, one has a `ReferenceError` bug |

**Packages to remove (`npm uninstall`):**
`@react-native-community/checkbox`, `@react-native-ml-kit/text-recognition`, `@react-native-picker/picker`, `cashfree-pg-api-contract`, `react-native-cashfree-pg-sdk`, `expo-file-system`, `expo-sharing`, `lodash`, `react-native-bouncy-checkbox`, `react-native-calendar-picker`, `react-native-calendar-timetable`, `react-native-calendars`, `react-native-chart-kit`, `react-native-check-box`, `react-native-confirmation-code-field`, `react-native-country-codes-picker`, `react-native-date-picker`, `react-native-dotenv`, `react-native-elements`, `react-native-fs`, `react-native-get-random-values`, `react-native-image-slider-box`, `react-native-loading-dots`, `react-native-localize`, `react-native-paper`, `react-native-qrcode-svg`, `react-native-radio-buttons-group`, `react-native-render-html`, `react-native-share`, `react-native-status-bar-height`, `react-native-svg-transformer`, `react-native-three-dots-loader`, `react-native-video`, `react-native-video-controls`, `react-native-webview`, `react-native-reanimated-carousel`, `styled-components`, `date-fns`

---

### B. DELETE_LATER

Usable structure but deferred until post-MVP backend work is complete or dependencies are cleaned first.

| # | Path | Condition |
|---|------|-----------|
| 1 | `screen/Feature/ReferToEarnScreen.tsx` | Delete or connect referral backend post-MVP |
| 2 | `screen/Feature/EarningsFullDetailsScreen.tsx` | Replace mock earnings data with real backend |
| 3 | `screen/modal/WithdrawalSheet.tsx` | Wire to payment backend post-MVP |
| 4 | `screen/Feature/PerformanceScreen.tsx` | Replace mock KPIs with real analytics API |
| 5 | `screen/Feature/NearbyJobsFeedScreen.tsx` | Replace mock job feed with real assignment API |
| 6 | `screen/Feature/invoiceData.tsx` | Replace hardcoded invoice with real booking data |
| 7 | `react-native-image-crop-picker` package | Remove after refactoring `redux/Api/index.tsx` |
| 8 | `react-native-localization` package | Remove after deleting `component/Localization/` folder |
| 9 | `react-native-modal` package | Remove after deleting `component/UploadImageModal.tsx` |
| 10 | `prop-types` package | Migrate to TypeScript prop types, then remove |

---

### C. KEEP

Active code required for MVP or live in the core provider journey.

| Path | Role |
|------|------|
| `screen/Auth/Splash.tsx` | App entry screen |
| `screen/Auth/Language.tsx` | Language selection (hi/en) |
| `screen/Auth/PhoneLogin.tsx` | Phone-OTP login entry |
| `screen/Auth/OTPVerification.tsx` | OTP verification |
| `screen/Auth/PartnerInfoForm.tsx` | Partner profile setup (name, location, photo) |
| `screen/Auth/PartnerServiceSelectionScreen.tsx` | Multi-select service categories during onboarding |
| `screen/Auth/PartnerDocumentsScreen.tsx` | Aadhaar, PAN, bank details upload |
| `screen/Auth/TermsAndConditionsModal.tsx` | T&C modal used inside PartnerInfoForm |
| `screen/BottamTab/HomeScreen.tsx` | Provider dashboard — job feed + quick links |
| `screen/BottamTab/MyBookingsScreen.tsx` | Booking list (replace mock data) |
| `screen/BottamTab/EarningsScreen.tsx` | Earnings overview tab (replace mock data) |
| `screen/BottamTab/ProfileSettingsScreen.tsx` | Settings + profile |
| `screen/Feature/JobDetailsScreen.tsx` | Job detail + status flow (replace mock flow) |
| `screen/Feature/AllBookingsScreen.tsx` | Full booking history (replace mock data) |
| `screen/Feature/EditProfileScreen.tsx` | Edit partner profile |
| `screen/Feature/NotificationList.tsx` | In-app notifications |
| `screen/Feature/HowToUseScreen.tsx` | Provider onboarding / how-to (replace placeholder support number) |
| `screen/Feature/PartnerHelpSupportScreen.tsx` | Help & FAQ |
| `screen/Feature/QuickActionsScreen.tsx` | Quick action shortcuts (disable post-MVP targets) |
| `screen/Feature/HeaderComponent.tsx` | Shared header with notification bell used by HomeScreen |
| `screen/modal/JobModalProps.tsx` | Job detail bottom sheet used by HomeScreen + NearbyJobsFeedScreen |
| `screen/modal/LogoutModal.tsx` | Logout confirmation |
| `screen/modal/ApprovalWaitingModal.tsx` | Waiting state in JobDetailsScreen (wire to backend) |
| `component/AutoAddress.tsx` | Google Places address input for PartnerInfoForm |
| `component/CustomButton.tsx` | Shared button |
| `component/CustomHeaderProps.tsx` | Header props interface |
| `component/HomeHeader.tsx` | Home screen header |
| `component/Icon.tsx` | Icon wrapper |
| `component/Image.tsx` | Image/icon asset map |
| `component/ImagePickerSheet.tsx` | Active image picker bottom sheet |
| `component/LocationContext.js` | Location context provider |
| `component/SearchBar.tsx` | Search input |
| `component/TextInput.tsx` | Styled text input |
| `component/helperFunction.js` | Geolocation utilities |
| `component/utils/` (all) | Constants, theme, adjust, haptic |
| `language/LanguageContext.tsx` | Active i18n context (hi/en + TTS) |
| `language/languageStrings.ts` | All translated strings |
| `redux/Api/index.tsx` | API client (after replacing BikeDoctor base URL) |
| `redux/feature/authSlice.js` | Auth state (prune dead thunks; keep `userData`, `isLogin`, `isLogOut`) |
| `redux/Store.js` | Redux store (remove `feature: FeatureReducer` entry) |
| `navigators/AppNavigator.js` | Root navigator + Firebase push setup |
| `navigators/RegistrationRoutes.tsx` | Stack navigator (remove hardcoded Google Maps API key — move to env) |
| `navigators/TabNavigator.js` | Bottom tab navigator |
| `navigators/FeatureRoutes.tsx` | Feature stack routes |
| `routes/routes.ts` | Route definitions |
| `routes/screenName.enum.ts` | Screen name constants |
| `routes/screenRoute.config.ts` | Screen options config |
| `configs/Loader/index.tsx` | Global loading overlay |
| `configs/customToast.tsx` | Toast config |
| `constant/index.tsx` | App-wide color constants |

---

## Additional Action Items (Not Categorised as Delete)

| Item | File | Priority |
|------|------|----------|
| **Replace BikeDoctor base URL** | `redux/Api/index.tsx:13-14` | Blocker for any real API call |
| **Move Google Maps API keys to .env** | `navigators/RegistrationRoutes.tsx`, `component/AutoAddress.tsx` | Security — keys are exposed in source |
| **Replace `HOME_NEARBY_JOBS` mock** | `screen/BottamTab/HomeScreen.tsx` | High — providers see fake jobs |
| **Wire `JobDetailsScreen` to backend** | `screen/Feature/JobDetailsScreen.tsx` | High — entire job flow is simulated locally |
| **Replace placeholder support number** | `screen/Feature/HowToUseScreen.tsx` | Medium — broken Linking call on Help tap |
| **Add `ArrivalConfirmation` to routes** | `routes/routes.ts`, `routes/screenName.enum.ts` | Medium — the arrival-confirmation UX must be built and registered |
| **Remove `screen/Feature/download.jpeg`** | Stray asset file in wrong directory | Low |

---

*End of cleanup audit.*
