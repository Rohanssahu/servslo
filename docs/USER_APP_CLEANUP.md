# User App – Code Cleanup Audit

**Date:** 2026-06-21  
**App:** SerSLO User App (React Native 0.73)  
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

All API routes point to `mrbikedoctors.com` — a different product's backend. These were carried over from a forked or reused codebase and have **zero relevance** to SerSLO.

| File Path | Why Unused | Safe to Delete | Dependencies |
|-----------|-----------|----------------|--------------|
| `redux/Api/endpoints.tsx` | Every single endpoint is `/bikedoctor/…` (login, OTP, services, banners, bikes, tickets, bookings). No SerSLO endpoints exist in this file. | **No** – `apiRequests.tsx` imports it. Must be **replaced** with SerSLO endpoints, not deleted alone. | Used by `redux/Api/apiRequests.tsx` |
| `redux/Api/index.tsx` (lines 13-14) | `base_url = 'https://mrbikedoctors.com/api'` and `image_url = 'https://mrbikedoctors.com/image/'` are hard-coded to BikeDoctor's server | **No** – the whole API layer references these. Must be **replaced**, not deleted. | Imported in `redux/Api/apiRequests.tsx`, `component/HostelList.tsx`, `component/HorizontalList.tsx`, `component/Image.tsx` |
| `redux/Api/apiRequests.tsx` | Entire file implements BikeDoctor domain: `get_mybikes`, `add_Bikes`, `get_BikeCompany`, `get_BikeModel`, `get_BikeVariant`, `remove_bike`, `garage_details`, `get_FilterBydeler`, `addPickupAddress`, `get_nearyBydeler`. These model motorcycle-garage workflows irrelevant to SerSLO home services. | **Conditional** – `cancel_booking` import in `BookingList.tsx` is the only active caller; rest of the file is dead. Safe after creating a SerSLO-specific replacement. | `component/BookingList.tsx` imports `cancel_booking` |
| `component/HorizontalList.tsx` | Renders a bike list; navigates to `ScreenNameEnum.MY_BIKES` which doesn't exist in routes. Entirely BikeDoctor UI. Zero imports outside own file. | **Yes** | Not imported anywhere |
| `component/HostelList.tsx` | Displays garage/hostel items, navigates to `ScreenNameEnum.HostelDetailsScreen` (not in routes). BikeDoctor screen repurposed with wrong label. Not imported anywhere. | **Yes** | Not imported anywhere |
| `component/VerticalshopList.tsx` | Shows bike-shop cards; navigates to `ScreenNameEnum.GARAGE_DETAILS` (not in routes). Not imported anywhere. | **Yes** | Not imported anywhere |
| `component/VerticalList.tsx` | Navigates to `ScreenNameEnum.BIKE_DETAILS` (not in routes). Imported once but that usage is in `HorizontalList.tsx` (itself unused). | **Yes** (after deleting HorizontalList) | `component/HorizontalList.tsx` (unused) |

---

## 2. Unused Screens

Screens that are registered in routes but **never navigated to** by any active screen, OR not registered in routes at all.

| File Path | Why Unused | Safe to Delete | Dependencies |
|-----------|-----------|----------------|--------------|
| `screen/BottamTab/EarningsScreen.tsx` | Not registered in routes (`_routes.BOTTOM_TAB` or `REGISTRATION_ROUTE`). Has hard-coded `earningsData` mock. The two `navigate()` calls inside are commented out. | **Yes** | Uses `screen/modal/WithdrawalSheet.tsx` (also can be deleted if this is removed) |
| `screen/Auth/PartnerInfoForm.tsx` | File contains only `export {default} from './UserInfoForm'` — a redirect alias with no real code. Not in routes. | **Yes** | None |
| `screen/Auth/PartnerDocumentsScreen.tsx` | Imported in `routes.ts` but **never navigated to** from any active screen. Partner onboarding belongs in the Partner app, not the user app. | **Yes** | `routes/routes.ts`, `routes/screenName.enum.ts` |
| `screen/Auth/PartnerServiceSelectionScreen.tsx` | Imported in `routes.ts` and `screenName.enum.ts` but **never navigated to**. Partner-side feature. | **Yes** | `routes/routes.ts`, `routes/screenName.enum.ts` |
| `screen/Chat/Chat.js` | Not registered in `routes.ts` at all. Not imported or navigated to from anywhere. | **Yes** | Standalone, no dependents |
| `screen/profile/EditProfile.tsx` | Not in routes, not navigated to from any active screen. Hard-coded state `name: 'Rohan sahj'`. | **Yes** | None |
| `screen/modal/JobModalProps.tsx` | Exports `JobRequestModal` component. Not imported or used anywhere in the app. | **Yes** | None |
| `screen/Feature/WalletScreen.tsx` | Registered in routes. `ProfileSettingsScreen` does **not** navigate to it — there is no wallet entry in the profile menu. UI contains no real wallet data. | **No** – keep registered, but flag as pre-MVP stub | `routes/routes.ts` |
| `screen/Feature/ReferralScreen.tsx` | Registered in routes. No active screen navigates to it. (`ReferToEarnScreen` is navigated to instead — they overlap.) | **Yes** | `routes/routes.ts` |

---

## 3. Unused Components

Components with zero imports outside their own file.

| File Path | Why Unused | Safe to Delete | Dependencies |
|-----------|-----------|----------------|--------------|
| `component/AddressAutocomplete.tsx` | Zero imports anywhere. Duplicate of `component/AutoAddress.tsx` which wraps the same Google Places Autocomplete library. | **Yes** | None |
| `component/BookingList.tsx` | Zero imports outside its own file. The only call it makes (`cancel_booking`) draws from the BikeDoctor API layer. | **Yes** | Imports `redux/Api/apiRequests.tsx` (BikeDoctor) |
| `component/Loader.tsx` | Zero imports. The app uses `src/configs/Loader/index.tsx` instead. | **Yes** | None |
| `component/ProfileList.tsx` | Zero imports anywhere. Duplicate profile-menu UI that also pulls in `LogoutModal`. Not wired to any screen. | **Yes** | Imports `screen/modal/LogoutModal.tsx` (LogoutModal may still be needed if ProfileSettingsScreen uses it directly — verify) |
| `component/ScratchCardList.tsx` | Zero imports anywhere. Scratch-card gamification feature not in SerSLO MVP. | **Yes** | None |
| `component/SeeallHeader.tsx` | Zero imports anywhere. | **Yes** | None |
| `component/SelectLocation.js` | Zero imports from outside its own file (only self-references inside the component). The app uses `LocationPickerScreen` instead. | **Yes** | None |
| `component/fontStyles.tsx` | Zero imports anywhere. | **Yes** | None |
| `component/UploadImageModal.tsx` | Zero imports anywhere. | **Yes** | None |
| `component/Localization/Localization.js` | Loaded only by `component/Localization/LanguageContext.js` (also unused — see §6). The app uses `src/language/LanguageContext.tsx` exclusively. | **Yes** | `component/Localization/LanguageContext.js` |
| `component/Localization/LanguageContext.js` | Not imported anywhere in the app. The active context is `src/language/LanguageContext.tsx`. | **Yes** | `component/Localization/Localization.js`, `component/Localization/localization.json` |
| `component/Localization/localization.json` | Only loaded by the unused `Localization.js`. | **Yes** | `component/Localization/Localization.js` |
| `component/Notification.js` | Not imported anywhere. The app uses `services/trackingNotifications.ts` for push notifications. Duplicate push-notification setup. | **Yes** | None |

---

## 4. Unused APIs

API functions exported from `redux/Api/apiRequests.tsx` that are never called by any screen or component.

| Function | Endpoint | Why Unused | Safe to Delete |
|----------|----------|------------|----------------|
| `Login_witPhone` | `POST /bikedoctor/userAuth/userLogin` | App uses phone-login flow directly in `PhoneLogin.tsx` via a separate inline call; this export is never imported. | **Yes** |
| `otp_Verify` | `POST /bikedoctor/userAuth/otpVerify` | Not imported anywhere. OTP verification is in `OTPVerification.tsx` via its own call. | **Yes** |
| `resend_Otp` | `POST /bikedoctor/userAuth/resendOtp` | Not imported anywhere. | **Yes** |
| `add_Profile` | `POST /bikedoctor/userAuth/addProfile` | Not imported anywhere. | **Yes** |
| `get_servicelist` | `GET /bikedoctor/service/servicelist` | Not imported anywhere. Home services are fetched via a different API in `HomeScreen.tsx`. | **Yes** |
| `get_bannerlist` | `GET /bikedoctor/banner/bannerlist` | Not imported anywhere. Banners in HomeScreen use inline static data. | **Yes** |
| `get_nearyBydeler` | `GET /bikedoctor/dealer/dealerWithInRange` | Not imported anywhere. BikeDoctor dealer concept. | **Yes** |
| `get_mybikes` | `GET /bikedoctor/customers/getMyBikes` | Not imported. Bike concept irrelevant. | **Yes** |
| `add_Bikes` | `POST /bikedoctor/customers/addUserBike` | Not imported. | **Yes** |
| `get_BikeCompany` | `GET /bikedoctor/bike/get-bike-companies` | Not imported. | **Yes** |
| `get_BikeModel` | `GET /bikedoctor/bike/get-bike-models/:company_id` | Not imported. | **Yes** |
| `get_BikeVariant` | `GET /bikedoctor/bike//get-bike-variants/:model_id` | Not imported (note double slash bug in endpoint). | **Yes** |
| `remove_bike` | `DELETE /bikedoctor/customers/deleteMyBike/:bike_id` | Not imported. | **Yes** |
| `get_FilterBydeler` | `GET /bikedoctor/dealer/dealerWithInRange2` | Not imported. | **Yes** |
| `garage_details` | `GET /bikedoctor/dealer/getShopDetails` | Not imported. | **Yes** |
| `create_booking` | `POST /bikedoctor/bookings/createBooking` | Not imported. SerSLO uses a separate booking endpoint. | **Yes** |
| `addPickupAddress` | `POST /bikedoctor/pickndrop/addpickndrop` | Not imported. | **Yes** |
| `get_profile` | `GET /bikedoctor/customers/customer` | Not imported. | **Yes** |
| `updateProfile` | `PUT /bikedoctor/customers/editcustomer/:id` | Not imported. | **Yes** |
| `updateProfileImage` | `POST /bikedoctor/customers/editimage` | Not imported. | **Yes** |
| `bookingdetails` | `GET /bikedoctor/bookings/getBookingDetails/:id` | Not imported. | **Yes** |
| `get_tikit` | `GET /bikedoctor/ticket/my-tickets` | Not imported. | **Yes** |
| `create_tikit` | `POST /bikedoctor/ticket/create` | Not imported. | **Yes** |
| `get_tikitdetails` | `GET /bikedoctor/ticket/tickets/:ticket_id` | Not imported. | **Yes** |
| `replay_tikit` | `POST /bikedoctor/ticket/reply/:ticket_id` | Not imported. | **Yes** |
| `tikitstatus` | `PUT /bikedoctor/ticket/status/:ticket_id` | Not imported. | **Yes** |
| `get_userbooking` | `GET /bikedoctor/bookings/getuserbookings` | Not imported anywhere in active screens. | **Yes** |

**Note:** `cancel_booking` is the **only** function imported (`component/BookingList.tsx`), and BookingList itself is unused (§3). The entire `apiRequests.tsx` file can be deleted once `BookingList.tsx` is removed.

---

## 5. Unused Packages

Packages installed in `package.json` with **zero imports** in the source tree.

### DELETE NOW — Zero usage, no native linking value

| Package | Evidence | Safe to Remove |
|---------|----------|----------------|
| `@react-native-community/checkbox` | 0 source files import it | **Yes** |
| `@react-native-ml-kit/text-recognition` | 0 source files import it | **Yes** |
| `@react-native-picker/picker` | 0 source files import it | **Yes** |
| `cashfree-pg-api-contract` | 0 source files import it | **Yes** |
| `expo-file-system` | 0 source files import it | **Yes** |
| `expo-sharing` | 0 source files import it | **Yes** |
| `i` | 0 source files import it (utility stub) | **Yes** |
| `lodash` | 0 source files import it | **Yes** |
| `npm` | Listed as a runtime dependency — should never be in `dependencies` | **Yes** |
| `react-native-bouncy-checkbox` | 0 source files import it | **Yes** |
| `react-native-calendar-picker` | 0 source files import it | **Yes** |
| `react-native-calendar-timetable` | 0 source files import it | **Yes** |
| `react-native-calendars` | 0 source files import it | **Yes** |
| `react-native-cashfree-pg-sdk` | 0 source files import it | **Yes** |
| `react-native-chart-kit` | 0 source files import it | **Yes** |
| `react-native-check-box` | 0 source files import it | **Yes** |
| `react-native-confirmation-code-field` | 0 source files import it | **Yes** |
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
| `react-native-share` | 0 source files import it | **Yes** |
| `react-native-status-bar-height` | 0 source files import it | **Yes** |
| `react-native-svg-transformer` | 0 source files import it | **Yes** |
| `react-native-three-dots-loader` | 0 source files import it | **Yes** |
| `react-native-video` | 0 source files import it | **Yes** |
| `react-native-video-controls` | 0 source files import it | **Yes** |
| `react-native-webview` | 0 source files import it | **Yes** |
| `react-native-reanimated-carousel` | 0 source files import it | **Yes** |
| `styled-components` | 0 source files import it | **Yes** |
| `date-fns` | 0 source files import it | **Yes** |

### DELETE LATER — Used in files that are themselves unused/partner-only

| Package | Where Used | Why Delete Later |
|---------|-----------|-----------------|
| `react-native-localization` | `component/Localization/Localization.js` only | That file is unused (§3). Remove after deleting Localization folder. |
| `prop-types` | `screen/Auth/PartnerDocumentsScreen.tsx` only | That screen is a partner-side unused screen (§2). Remove after deleting it. |

### KEEP — Actively used

| Package | Active Usage |
|---------|-------------|
| `@react-native-community/geolocation` | `component/helperFunction.js`, `screen/Auth/LocationFetcher.tsx` |
| `@react-native-community/datetimepicker` | `screen/profile/EditProfile.tsx` |
| `@react-native-firebase/messaging` | `services/trackingNotifications.ts`, `component/Notification.js` |
| `@react-native-voice/voice` | `screen/BottamTab/HomeScreen.tsx`, `screen/Auth/PartnerServiceSelectionScreen.tsx` |
| `react-native-element-dropdown` | `screen/profile/EditProfile.tsx` |
| `react-native-haptic-feedback` | `services/trackingEngine.ts`, `screen/bookingflow/LiveTrackingMap.tsx` |
| `react-native-image-crop-picker` | `redux/Api/index.tsx` |
| `react-native-image-picker` | `screen/Auth/PartnerDocumentsScreen.tsx`, `screen/Auth/UserInfoForm.tsx` |
| `moment` | `screen/bookingflow/RecurringBookingScreen.tsx` |
| `geolib` | `screen/Feature/NearbyProvidersScreen.tsx` |

---

## 6. Dead Redux Code

### `redux/feature/authSlice.js`

The thunks in this slice call a `/auth/…` API that **does not belong to SerSLO** and is never dispatched from any screen.

| Thunk / Action | Status | Reason |
|----------------|--------|--------|
| `login` (email+password) | **Dead** | App uses phone-OTP login via `PhoneLogin.tsx` directly. This email/password login navigates to `ScreenNameEnum.BOTTAM_TAB` (old typo-based enum no longer in routes). |
| `reset_password` | **Dead** | Navigates to `ScreenNameEnum.OTP_SCREEN` which doesn't exist in routes. |
| `verify_otp` | **Dead** | Navigates to `ScreenNameEnum.CreatePassword` which doesn't exist in routes. |
| `Create_new_password` | **Dead** | Navigates to `ScreenNameEnum.LOGIN_SCREEN` which doesn't exist in routes. |
| `Sign_up` | **Dead** | The `errorToast(response.data.message)` in catch block references `response` which is out of scope — this code cannot run without throwing a ReferenceError. |
| `create_bussiness` | **Dead** | Partner-side feature. Never dispatched from any user screen. |
| `get_profile` | **Dead** | Never dispatched from any active screen. Stores to `state.User` but that state is never read anywhere. |
| `loginSuccess` action | **Keep** | Used in `login` thunk — remove together with `login`. |

### `redux/feature/featuresSlice.js`

Entire slice is dead — **none** of these thunks are dispatched from any screen in the user app.

| Thunk | Reason |
|-------|--------|
| `send_message_help` | Calls `/common/ask_support`. Not dispatched anywhere. |
| `get_Bussiness_data` | Business directory — irrelevant to SerSLO. Not dispatched. |
| `get_save_Bussines` | Calls the same endpoint as `get_Bussiness_data` (exact duplicate). Not dispatched. |
| `get_Bussiness_list` | Business directory filtering. Not dispatched. |
| `get_dashboard_data` | Business dashboard. Not dispatched. |
| `get_near_by_business` | Writes to `state.Bussinesslist` (same key as `get_Bussiness_list` — collision). Not dispatched. |
| `update_profile` | Not dispatched from any screen. |
| `get_business_details` | Not dispatched. |

**State fields that are never read:** `bussinessData`, `bussinessDetails`, `dashboardData`, `Bussinesslist`, `nearByStore`, `saveBusinessData`.

> Safe to delete: the entire `featuresSlice.js` and its `feature: FeatureReducer` entry in `Store.js`.

---

## 7. Duplicate Libraries

| Duplicate Pair | What They Do | Which to Keep | Which to Remove |
|----------------|--------------|---------------|-----------------|
| `react-native-image-crop-picker` vs `react-native-image-picker` | Both pick/capture images. `image-crop-picker` is used only in the unused `redux/Api/index.tsx` helper (`captureImage`, `selectImageFromGallery`). `image-picker` is used in active screens (`UserInfoForm`, `PartnerDocumentsScreen`). | **`react-native-image-picker`** | `react-native-image-crop-picker` (after refactoring `redux/Api/index.tsx`) |
| `src/component/Localization/` folder (3 files) vs `src/language/` folder | Both provide i18n/language switching. The entire app uses `src/language/LanguageContext.tsx`. The `component/Localization/` folder is dead. | **`src/language/`** | Entire `src/component/Localization/` folder + `react-native-localization` package |
| `component/AddressAutocomplete.tsx` vs `component/AutoAddress.tsx` | Both wrap `react-native-google-places-autocomplete`. `AutoAddress` is used in `AddressesScreen`. `AddressAutocomplete` has zero imports. | **`component/AutoAddress.tsx`** | `component/AddressAutocomplete.tsx` |
| `component/Notification.js` vs `services/trackingNotifications.ts` | Both set up push notifications via Firebase + `react-native-push-notification`. The app boots `trackingNotifications.ts` from `AppNavigator.js`. `Notification.js` is never imported. | **`services/trackingNotifications.ts`** | `component/Notification.js` |
| `services/socket.ts` vs `services/trackingEngine.ts` | `socket.ts` is a backward-compat shim that delegates to `trackingEngine.ts`. If no code imports `socket.ts` (none found in active screens), the shim is dead weight. | **`services/trackingEngine.ts`** | `services/socket.ts` (after verifying no callers) |
| `screen/Feature/ReferralScreen.tsx` vs `screen/Feature/ReferToEarnScreen.tsx` | Both implement refer-a-friend sharing. `ReferToEarnScreen` is navigated to from `ProfileSettingsScreen`; `ReferralScreen` is not navigated to from anywhere. | **`screen/Feature/ReferToEarnScreen.tsx`** | `screen/Feature/ReferralScreen.tsx` |

---

## 8. Duplicate API Layers

The app has **three independent API layers** that partially overlap:

| Layer | File | Base URL | Pattern |
|-------|------|----------|---------|
| **A — Legacy BikeDoctor** | `redux/Api/index.tsx` + `redux/Api/apiRequests.tsx` | `https://mrbikedoctors.com/api` | `callMultipleApis()` / `callApi()` using `endpoint` object |
| **B — Redux Thunk (featuresSlice)** | `redux/feature/featuresSlice.js` | `base_url.url` from Layer A | `API.request(config)` inside thunks |
| **C — Services Layer** | `services/api.ts` | None (all mock in-memory) | Mock `getBooking()`, `assignPartner()`, `updateStatus()`, etc. |

**Problems:**
- Layer A's `base_url` points to `mrbikedoctors.com` — wrong server.
- Layer B calls `base_url.url` — a bug: `base_url` is a string, not an object with `.url`, so `base_url.url` is `undefined`. Every thunk in `featuresSlice.js` would send requests to `undefined/business/…`.
- Layer C is 100% mock (in-memory state, fake sleep timers) — it simulates booking lifecycle but never touches a real backend.

> **Action:** Delete Layers A and B entirely. Replace Layer C with real SerSLO API calls when the backend is ready.

---

## 9. Mock / Demo Data

Hard-coded static data masquerading as real API data.

| File | Mock Data | Risk |
|------|-----------|------|
| `services/api.ts` | Entire file is a mock: `MOCK` booking object, `bookingDB` in-memory store, fake `sleep()` delays for `getBooking`, `assignPartner`, `verifyOTP`, `completeJob`. Also `resetMock()`. | **High** — `LiveTrackingMap.tsx` and `BookingTrackScreen.tsx` call these. Real booking data will never appear until replaced. |
| `screen/Feature/BookingConfirmationModal.tsx` (line 27) | `MOCK_PROVIDER = { name: 'Sanjay Verma', rating: 4.9, jobs: 128, exp: '3 yrs', eta: '8 min', dist: '2.1 km', initial: 'S' }` — hardcoded provider shown on confirmation screen | **High** — User sees fake provider details on every booking confirmation. |
| `screen/bookingflow/couponData.ts` | `ALL_COUPONS` array with 10 static coupon codes (HDFC20, ICICI15, GPAY50, CRED15, etc.) with hard-coded discount logic | **Medium** — Coupons appear valid but are never server-validated. |
| `screen/bookingflow/invoiceData.tsx` | `invoiceData` object: static invoice with `booking_id: 'BOOK12345'`, `customer_name: 'Aman Verma'`, `customer_address: 'Flat 203, Green Heights, Andheri East, Mumbai'` | **High** — Every user sees "Aman Verma"'s invoice. |
| `screen/BottamTab/EarningsScreen.tsx` | `earningsData` array: 3 hard-coded Hindi earnings entries (Electrician, AC Repair, Plumber) | **Low** — Screen is not in routes (§2). |
| `screen/BottamTab/HomeScreen.tsx` | `DEALS`, `MOST_BOOKED`, `DAILY_HOME_SERVICES`, `SUBSCRIPTION_SERVICES`, `LIVE_PROVIDERS`, `QUICK_SERVICES`, `SALON_ITEMS`, `APPLIANCE_ITEMS`, `SMALL_TILES`, `TRUST_ITEMS` — all static arrays defined inline | **Medium** — Content cannot be updated without a code release. |
| `screen/Feature/NearbyProvidersScreen.tsx` | `INIT_PROVIDERS` array (line 95): 4 hard-coded providers with static lat/lng near Mumbai. `USER_LOC = { latitude: 19.1723, longitude: 72.9446 }` (hardcoded to Andheri East). | **High** — Providers never change and the user's location is always wrong. |
| `screen/Feature/ReviewBookingScreen.tsx` (line 57) | `source={{ uri: 'https://via.placeholder.com/50' }}` — placeholder image service | **Low** — Visual only, but signals unfinished UI. |

---

## 10. Features Not Required for SerSLO MVP

| Feature | File(s) | Reason Not MVP | Safe to Defer |
|---------|---------|---------------|---------------|
| **Wallet & Transactions** | `screen/Feature/WalletScreen.tsx` | No payment wallet backend exists. UI has no real data. | **Yes** |
| **Refer & Earn** | `screen/Feature/ReferToEarnScreen.tsx`, `screen/Feature/ReferralScreen.tsx` | Referral program requires backend tracking. Code is incomplete (`referralCode = 'ROHAN1234'` hardcoded). | **Yes** |
| **Recurring Bookings** | `screen/bookingflow/RecurringBookingScreen.tsx` | Complex scheduling feature. Not core to launch. | **Yes** |
| **Arrival Charges Screen** | `screen/bookingflow/ArrivalChargesScreen.tsx` | Separate pricing screen for arrival fees. Adds friction and complexity for MVP. | **Yes** |
| **Nearby Providers Map** | `screen/Feature/NearbyProvidersScreen.tsx` | All provider data is mocked (§9). Navigated to from HomeScreen but shows fake data. | **Yes** (disable navigation entry) |
| **Coupon / Promo Codes** | `screen/bookingflow/ApplyCouponScreen.tsx`, `screen/bookingflow/couponData.ts` | Static coupon data, no server validation. | **Yes** |
| **In-App Chat** | `screen/Chat/Chat.js` | Not in routes, no backend. | **Yes** |
| **Partner Onboarding in User App** | `screen/Auth/PartnerDocumentsScreen.tsx`, `screen/Auth/PartnerServiceSelectionScreen.tsx`, `screen/Auth/PartnerInfoForm.tsx` | Belongs in the Partner app. | **Yes** |
| **Earnings / Withdrawal** | `screen/BottamTab/EarningsScreen.tsx`, `screen/modal/WithdrawalSheet.tsx` | Provider-side feature in user app. No backend. | **Yes** |
| **Job Approval Waiting Modal** | `screen/modal/ApprovalWaitingModal.tsx` | Used in `JobDetailsScreen` which is navigated to from routes but is provider-facing UX. | **Conditional** |
| **Walkthrough Overlay** | `component/WalkthroughOverlay.tsx` | Used in HomeScreen but is a nice-to-have. | **No — keep for launch UX** |
| **Campaign / Flash Deals System** | `component/CampaignSystem.tsx`, `component/WomenCampaignBanner.tsx` | Used in HomeScreen with static data. Marketing feature, not core. | **No — defer data, keep UI** |
| **Job Invoice Screen** | `screen/bookingflow/invoiceData.tsx` | Hard-coded invoice data (§9). UI is complete but data layer is missing. | **Yes** |

---

## Summary Tables

### A. DELETE_NOW

These are confirmed dead: zero active callers, wrong domain (BikeDoctor), or completely broken.

| # | Path | Category |
|---|------|----------|
| 1 | `redux/Api/endpoints.tsx` | BikeDoctor endpoints |
| 2 | `redux/Api/apiRequests.tsx` | BikeDoctor API functions |
| 3 | `redux/feature/featuresSlice.js` | Dead Redux slice (all thunks unreachable) |
| 4 | `component/HorizontalList.tsx` | BikeDoctor UI, zero imports |
| 5 | `component/HostelList.tsx` | BikeDoctor UI, zero imports |
| 6 | `component/VerticalshopList.tsx` | BikeDoctor UI, zero imports |
| 7 | `component/VerticalList.tsx` | BikeDoctor UI, zero imports |
| 8 | `component/AddressAutocomplete.tsx` | Duplicate of AutoAddress, zero imports |
| 9 | `component/BookingList.tsx` | Calls BikeDoctor cancel_booking, zero imports |
| 10 | `component/Loader.tsx` | Replaced by `configs/Loader/index.tsx`, zero imports |
| 11 | `component/ProfileList.tsx` | Zero imports |
| 12 | `component/ScratchCardList.tsx` | Zero imports |
| 13 | `component/SeeallHeader.tsx` | Zero imports |
| 14 | `component/SelectLocation.js` | Replaced by LocationPickerScreen, zero imports |
| 15 | `component/fontStyles.tsx` | Zero imports |
| 16 | `component/UploadImageModal.tsx` | Zero imports |
| 17 | `component/Notification.js` | Replaced by trackingNotifications, zero imports |
| 18 | `component/Localization/` (folder) | Replaced by `src/language/`, zero imports |
| 19 | `screen/Auth/PartnerInfoForm.tsx` | Empty alias file |
| 20 | `screen/Auth/PartnerDocumentsScreen.tsx` | Partner app screen, never navigated to |
| 21 | `screen/Auth/PartnerServiceSelectionScreen.tsx` | Partner app screen, never navigated to |
| 22 | `screen/Chat/Chat.js` | Not in routes, no backend |
| 23 | `screen/profile/EditProfile.tsx` | Not in routes, hard-coded user data |
| 24 | `screen/modal/JobModalProps.tsx` | Zero imports, never used |
| 25 | `screen/Feature/ReferralScreen.tsx` | Duplicate of ReferToEarnScreen, never navigated to |
| 26 | `screen/BottamTab/EarningsScreen.tsx` | Provider screen in user app, not in routes |
| 27 | All dead thunks in `redux/feature/authSlice.js` | Wrong domain, broken navigation targets |
| 28 | `services/socket.ts` | Backward-compat shim, zero callers |

**Packages to remove (npm uninstall):**
`@react-native-community/checkbox`, `@react-native-ml-kit/text-recognition`, `@react-native-picker/picker`, `cashfree-pg-api-contract`, `expo-file-system`, `expo-sharing`, `i`, `lodash`, `npm`, `react-native-bouncy-checkbox`, `react-native-calendar-picker`, `react-native-calendar-timetable`, `react-native-calendars`, `react-native-cashfree-pg-sdk`, `react-native-chart-kit`, `react-native-check-box`, `react-native-confirmation-code-field`, `react-native-country-codes-picker`, `react-native-date-picker`, `react-native-dotenv`, `react-native-elements`, `react-native-fs`, `react-native-get-random-values`, `react-native-image-slider-box`, `react-native-loading-dots`, `react-native-localize`, `react-native-paper`, `react-native-qrcode-svg`, `react-native-radio-buttons-group`, `react-native-render-html`, `react-native-share`, `react-native-status-bar-height`, `react-native-svg-transformer`, `react-native-three-dots-loader`, `react-native-video`, `react-native-video-controls`, `react-native-webview`, `react-native-reanimated-carousel`, `styled-components`, `date-fns`, `react-native-image-crop-picker`

---

### B. DELETE_LATER

Usable code but deferred until post-MVP features are built or dependencies are cleaned.

| # | Path | Condition |
|---|------|-----------|
| 1 | `screen/Feature/WalletScreen.tsx` | Delete or connect to backend post-MVP |
| 2 | `screen/Feature/ReferToEarnScreen.tsx` | Delete or connect referral backend post-MVP |
| 3 | `screen/bookingflow/RecurringBookingScreen.tsx` | Delete or build recurring-booking backend |
| 4 | `screen/bookingflow/ArrivalChargesScreen.tsx` | Delete or define arrival-charge business logic |
| 5 | `screen/bookingflow/ApplyCouponScreen.tsx` + `couponData.ts` | Replace static coupons with backend API |
| 6 | `screen/bookingflow/invoiceData.tsx` | Replace hard-coded invoice with real booking data |
| 7 | `screen/Feature/NearbyProvidersScreen.tsx` | Replace mock provider data with real API |
| 8 | `screen/Feature/BookingConfirmationModal.tsx` (MOCK_PROVIDER only) | Replace `MOCK_PROVIDER` constant with real partner data |
| 9 | `services/api.ts` | Replace entire mock API with real SerSLO endpoints |
| 10 | `react-native-localization` package | Remove after deleting `component/Localization/` folder |
| 11 | `prop-types` package | Remove after deleting `PartnerDocumentsScreen` |

---

### C. KEEP

Active code required for MVP or currently live in the user journey.

| Path | Role |
|------|------|
| `screen/Auth/Splash.tsx` | App entry screen |
| `screen/Auth/Language.tsx` | Language selection (hi/en) |
| `screen/Auth/LocationFetcher.tsx` | Permissions + initial location |
| `screen/Auth/PhoneLogin.tsx` | Phone-OTP login entry |
| `screen/Auth/OTPVerification.tsx` | OTP verification |
| `screen/Auth/UserInfoForm.tsx` | User profile setup on first launch |
| `screen/BottamTab/HomeScreen.tsx` | Main home — service discovery |
| `screen/BottamTab/MyBookingsScreen.tsx` | Booking list |
| `screen/BottamTab/ProfileSettingsScreen.tsx` | Settings / profile |
| `screen/Feature/AllServicesScreen.tsx` | Browse all service categories |
| `screen/Feature/ServiceBottomSheet.tsx` | Service detail drawer |
| `screen/bookingflow/ServiceBookingScreen.tsx` | Booking slot selection |
| `screen/bookingflow/PaymentScreen.tsx` | Payment summary + trigger |
| `screen/bookingflow/BookingDetailsScreen.tsx` | Booking detail view |
| `screen/bookingflow/LiveTrackingMap.tsx` | Live provider tracking map |
| `screen/bookingflow/OTPModal.tsx` | Service-start OTP |
| `screen/Feature/BookingTrackScreen.tsx` | Real-time tracking screen |
| `screen/Feature/AddressesScreen.tsx` | Saved addresses |
| `screen/Feature/LocationPickerScreen.tsx` | Address picker |
| `screen/Feature/NotificationList.tsx` | In-app notifications |
| `screen/Feature/FeedbackScreen.tsx` | Post-service rating |
| `screen/Feature/PartnerHelpSupportScreen.tsx` | Help & FAQ |
| `screen/Feature/HowToUseScreen.tsx` | Onboarding / how-to |
| `screen/Feature/PoliciesScreen.tsx` | T&C / privacy |
| `screen/Feature/ReviewBookingScreen.tsx` | Pre-booking confirmation review |
| `screen/Feature/JobDetailsScreen.tsx` | Job detail for provider-side view |
| `screen/Feature/QuickServiceCard.tsx` | Reusable service card |
| `screen/modal/ApprovalWaitingModal.tsx` | Wait state modal |
| `screen/modal/LogoutModal.tsx` | Logout confirmation |
| `component/SmartSearchBar.tsx` | AI-powered search with voice |
| `component/SpeakerButton.tsx` | TTS toggle |
| `component/AutoAddress.tsx` | Google Places address input |
| `component/CustomButton.tsx` | Shared button component |
| `component/HomeHeader.tsx` | Home screen header |
| `component/Icon.tsx` | Icon wrapper |
| `component/Image.tsx` | Image/icon asset map |
| `component/TextInput.tsx` | Styled text input |
| `component/WalkthroughOverlay.tsx` | First-launch guided tour |
| `component/CampaignSystem.tsx` | Flash deals / campaign UI |
| `component/WomenCampaignBanner.tsx` | Women's safety campaign banner |
| `component/SearchBar.tsx` | Basic search bar |
| `component/CustomHeaderProps.tsx` | Header props |
| `component/LocationContext.js` | Location context provider |
| `component/helperFunction.js` | Geolocation utilities |
| `component/utils/` (all) | Constants, theme, adjust |
| `language/LanguageContext.tsx` | Active i18n context (hi/en + TTS) |
| `language/languageStrings.ts` | All translated strings |
| `redux/Api/index.tsx` | API client (after replacing BikeDoctor URLs) |
| `redux/feature/authSlice.js` | Auth state (keep `loginSuccess`; prune dead thunks) |
| `redux/Store.js` | Redux store |
| `services/trackingEngine.ts` | Real-time provider movement simulation |
| `services/trackingNotifications.ts` | Push notification layer |
| `navigators/AppNavigator.js` | Root navigator |
| `navigators/RegistrationRoutes.tsx` | Stack navigator |
| `navigators/TabNavigator.tsx` | Bottom tab navigator |
| `routes/routes.ts` | Route definitions |
| `routes/screenName.enum.ts` | Screen name constants |
| `configs/Loader/index.tsx` | Global loading overlay |
| `configs/customToast.tsx` | Toast config |
| `constant/index.tsx` | App-wide color constants |
| `utils/searchEngine.ts` | Smart search engine |
| `utils/useAsync.ts` | Async hook utility |
| `assets/fonts/Poppins-*` | Brand font family |
| `assets/icons/*` | Tab bar icons |

---

*End of cleanup audit.*
