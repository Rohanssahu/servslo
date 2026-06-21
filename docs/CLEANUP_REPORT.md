# Cleanup Report

**Date:** 2026-06-21
**Scope:** BikeDoctor legacy code, dead Redux, unused components/screens, and unused packages

---

## 1. Files Deleted

### User App (`servslo/src/`)

#### BikeDoctor API Layer (3 files)
| File | Reason |
|------|--------|
| `redux/Api/endpoints.tsx` | All endpoints pointed to `/bikedoctor/…` |
| `redux/Api/apiRequests.tsx` | All 35 functions called BikeDoctor APIs; zero active callers |
| `redux/feature/featuresSlice.js` | All 8 thunks unreachable; called dead BikeDoctor API |

#### BikeDoctor UI Components (4 files)
| File | Reason |
|------|--------|
| `component/HorizontalList.tsx` | Bike-list UI; navigated to non-existent `MY_BIKES` route |
| `component/HostelList.tsx` | Garage/hostel UI; navigated to non-existent `HostelDetailsScreen` |
| `component/VerticalshopList.tsx` | Bike-shop UI; navigated to non-existent `GARAGE_DETAILS` |
| `component/VerticalList.tsx` | BikeDoctor UI; only imported by deleted HorizontalList |

#### Unused Components (13 files)
| File | Reason |
|------|--------|
| `component/AddressAutocomplete.tsx` | Duplicate of AutoAddress; zero imports |
| `component/BookingList.tsx` | Called BikeDoctor `cancel_booking`; zero screen imports |
| `component/Loader.tsx` | Replaced by `configs/Loader/index.tsx`; zero imports |
| `component/ProfileList.tsx` | Zero imports |
| `component/ScratchCardList.tsx` | User-facing gamification; zero imports |
| `component/SeeallHeader.tsx` | Zero imports |
| `component/SelectLocation.js` | Replaced by LocationPickerScreen; zero imports |
| `component/fontStyles.tsx` | Zero imports |
| `component/UploadImageModal.tsx` | Replaced by ImagePickerSheet; zero imports |
| `component/Notification.js` | Replaced by Firebase setup in AppNavigator; zero imports |
| `component/Localization/LanguageContext.js` | Replaced by `src/language/LanguageContext.tsx` |
| `component/Localization/Localization.js` | Replaced by `src/language/`; zero callers |
| `component/Localization/localization.json` | Only loaded by deleted Localization.js |

#### Misplaced / Dead Screens (8 files)
| File | Reason |
|------|--------|
| `screen/Auth/PartnerInfoForm.tsx` | Empty alias (`export {default} from './UserInfoForm'`); not in routes |
| `screen/Auth/PartnerDocumentsScreen.tsx` | Partner onboarding in user app; never navigated to |
| `screen/Auth/PartnerServiceSelectionScreen.tsx` | Partner onboarding in user app; never navigated to |
| `screen/Chat/Chat.js` | Not in routes; no backend |
| `screen/profile/EditProfile.tsx` | Not in routes; contained hardcoded test data (`name='Rohan sahj'`) |
| `screen/modal/JobModalProps.tsx` | Zero imports anywhere in active screens |
| `screen/modal/WithdrawalSheet.tsx` | Only called by deleted EarningsScreen |
| `screen/Feature/ReferralScreen.tsx` | Duplicate of ReferToEarnScreen; never navigated to |
| `screen/BottamTab/EarningsScreen.tsx` | Provider-side screen misplaced in user app; not in routes |

#### Dead Service (1 file)
| File | Reason |
|------|--------|
| `services/socket.ts` | Backward-compat shim; zero callers in active code |

**Total user app files deleted: 30**

---

### Provider App (`servslo_partner/src/`)

#### BikeDoctor API Layer (3 files)
| File | Reason |
|------|--------|
| `redux/Api/endpoints.tsx` | All endpoints pointed to `/bikedoctor/…` |
| `redux/Api/apiRequests.tsx` | All functions called BikeDoctor APIs; zero active callers |
| `redux/feature/featuresSlice.js` | All thunks unreachable; called dead BikeDoctor API |

#### BikeDoctor UI Components (4 files)
Same as user app — HorizontalList, HostelList, VerticalshopList, VerticalList.

#### Unused Components (13 files)
Same as user app — AddressAutocomplete, BookingList, Loader, ProfileList, ScratchCardList, SeeallHeader, SelectLocation, fontStyles, UploadImageModal, Notification, Localization folder (3 files).

#### Orphaned Dead Screens (5 files)
| File | Reason |
|------|--------|
| `screen/Chat/Chat.js` | Not in routes; no backend |
| `screen/profile/EditProfile.tsx` | Not in routes; contained hardcoded test data |
| `screen/Feature/ArrivalConfirmation.tsx` | Not in routes; zero imports anywhere |
| `screen/Feature/NotificationBell.tsx` | Defined but never imported anywhere |
| `screen/Feature/download.jpeg` | Accidentally committed test asset |

**Total provider app files deleted: 25**

---

## 2. Packages Removed

### User App — 45 packages removed

| Package | Why Removed |
|---------|-------------|
| `@react-native-community/checkbox` | Zero imports |
| `@react-native-ml-kit/text-recognition` | Zero imports |
| `@react-native-picker/picker` | Zero imports (element-dropdown used instead) |
| `cashfree-pg-api-contract` | Zero imports |
| `expo-file-system` | Zero imports |
| `expo-sharing` | Zero imports |
| `i` | Utility stub; zero imports |
| `lodash` | Zero imports |
| `npm` | Listed as runtime dependency; never appropriate |
| `prop-types` | Only used in deleted PartnerDocumentsScreen |
| `react-native-bouncy-checkbox` | Zero imports |
| `react-native-calendar-picker` | Zero imports |
| `react-native-calendar-timetable` | Zero imports |
| `react-native-calendars` | Zero imports |
| `react-native-cashfree-pg-sdk` | Zero imports |
| `react-native-chart-kit` | Zero imports |
| `react-native-check-box` | Zero imports |
| `react-native-confirmation-code-field` | Zero imports |
| `react-native-country-codes-picker` | Zero imports |
| `react-native-date-picker` | Zero imports |
| `react-native-dotenv` | Zero imports |
| `react-native-elements` | Zero imports |
| `react-native-fs` | Zero imports |
| `react-native-get-random-values` | Zero imports |
| `react-native-image-crop-picker` | Only used in deleted BikeDoctor API helpers |
| `react-native-image-slider-box` | Zero imports |
| `react-native-loading-dots` | Zero imports |
| `react-native-localization` | Only used in deleted Localization folder |
| `react-native-localize` | Zero imports |
| `react-native-modal` | Only used in deleted UploadImageModal |
| `react-native-paper` | Zero imports |
| `react-native-qrcode-svg` | Zero imports |
| `react-native-radio-buttons-group` | Zero imports |
| `react-native-render-html` | Zero imports |
| `react-native-share` | Zero imports |
| `react-native-status-bar-height` | Zero imports |
| `react-native-svg-transformer` | Zero imports |
| `react-native-three-dots-loader` | Zero imports |
| `react-native-video` | Zero imports |
| `react-native-video-controls` | Zero imports |
| `react-native-webview` | Zero imports |
| `react-native-reanimated-carousel` | Zero imports |
| `styled-components` | Zero imports |
| `date-fns` | Zero imports (moment is the active date library) |

**Packages remaining in user app: 37**

### Provider App — 39 packages removed

Same set as user app minus: `i`, `npm`, `prop-types`, `react-native-image-crop-picker` (still used in `redux/Api/index.tsx` — scheduled DELETE_LATER).

Additional: `react-native-localization` (only used in deleted Localization folder).

**Packages remaining in provider app: 44**

---

## 3. Routes Removed

### User App (`routes/routes.ts`)
| Removed | Type |
|---------|------|
| `import PartnerServiceSelectionScreen` | Dead import (file deleted) |
| `import ReferralScreen` | Dead import (file deleted) |
| `{ name: ReferralScreen, Component: ReferralScreen }` | Route entry for deleted screen |

### User App (`routes/screenName.enum.ts`)
| Removed Enum Value | Reason |
|-------------------|--------|
| `PartnerServiceSelectionScreen` | Screen deleted |
| `PartnerDocumentsScreen` | Screen deleted |
| `ReferralScreen` | Screen deleted |

### Provider App
No route changes required — all deleted provider app screens (Chat.js, EditProfile.tsx, ArrivalConfirmation.tsx, NotificationBell.tsx) were not registered in routes.ts or screenName.enum.ts.

---

## 4. Redux Removed

### Both Apps — `redux/feature/featuresSlice.js` deleted
Entire slice removed. All 8 thunks were unreachable. State fields (`bussinessData`, `bussinessDetails`, `dashboardData`, `Bussinesslist`, `nearByStore`, `saveBusinessData`) were never read by any active screen.

### Both Apps — `redux/Store.js` updated
`import FeatureReducer from './feature/featuresSlice'` removed.
`feature: FeatureReducer` removed from `combineReducers`.

### Both Apps — `redux/feature/authSlice.js` rewritten
All 7 dead thunks removed: `login`, `reset_password`, `verify_otp`, `Create_new_password`, `Sign_up`, `create_bussiness`, `get_profile`.

All associated `extraReducers` cases removed.

Stale imports removed: `createAsyncThunk`, `createAction`, `API`, `Alert`, `AsyncStorage`, `ScreenNameEnum`, `Toast`, `errorToast`, `successToast`.

**Kept:** `loginSuccess` action + the auth state shape (`userData`, `isLogin`, `isLogOut`, etc.) for future backend integration.

### User App — `redux/Api/index.tsx` cleaned
Removed `import ImagePicker from 'react-native-image-crop-picker'`.
Removed `import { PermissionsAndroid, Platform }` (no longer needed).
Removed dead helpers: `requestCameraPermissions`, `captureImage`, `selectImageFromGallery`.
Fixed pre-existing bug: added `AxiosResponse` to axios import (was used but never imported).

---

## 5. Remaining Screen Count

### User App — 41 screens
| Group | Screens |
|-------|---------|
| Auth (7) | Splash, Language, LocationFetcher, PhoneLogin, OTPVerification, UserInfoForm, TermsAndConditionsModal |
| Bottom Tab (3) | HomeScreen, MyBookingsScreen, ProfileSettingsScreen |
| Feature (15) | AddressesScreen, AllServicesScreen, BookingConfirmationModal, BookingTrackScreen, FeedbackScreen, HeaderComponent, HowToUseScreen, JobDetailsScreen, LocationPickerScreen, NearbyProvidersScreen, NotificationBell, NotificationList, PartnerHelpSupportScreen, PoliciesScreen, QuickServiceCard, ReferToEarnScreen, ReviewBookingScreen, ServiceBottomSheet, WalletScreen |
| Booking flow (9) | ApplyCouponScreen, ArrivalChargesScreen, BookingDetailsScreen, LiveTrackingMap, OTPModal, PaymentScreen, RecurringBookingScreen, ServiceBookingScreen, invoiceData |
| Modals (2) | ApprovalWaitingModal, LogoutModal |

### Provider App — 29 screens
| Group | Screens |
|-------|---------|
| Auth (8) | Splash, Language, PhoneLogin, OTPVerification, PartnerInfoForm, PartnerServiceSelectionScreen, PartnerDocumentsScreen, TermsAndConditionsModal |
| Bottom Tab (4) | HomeScreen, MyBookingsScreen, EarningsScreen, ProfileSettingsScreen |
| Feature (13) | AllBookingsScreen, EarningsFullDetailsScreen, EditProfileScreen, HeaderComponent, HowToUseScreen, JobDetailsScreen, NearbyJobsFeedScreen, NotificationList, PartnerHelpSupportScreen, PerformanceScreen, QuickActionsScreen, ReferToEarnScreen, invoiceData |
| Modals (4) | ApprovalWaitingModal, JobModalProps, LogoutModal, WithdrawalSheet |

---

## 6. Build Status

| Check | User App | Provider App |
|-------|----------|--------------|
| npm uninstall | ✅ Exit 0 | ✅ Exit 0 |
| Broken imports after deletion | ✅ None found | ✅ None found |
| routes.ts references to deleted files | ✅ Cleaned | ✅ N/A (no routes changes needed) |
| screenName.enum.ts orphan entries | ✅ 3 removed | ✅ None needed |
| Store.js FeatureReducer | ✅ Removed | ✅ Removed |
| authSlice dead thunks | ✅ All 7 removed | ✅ All 7 removed |
| Api/index.tsx image-crop-picker | ✅ Import + functions removed | ⚠️ Still present (DELETE_LATER) |

> Full metro bundler build not run (no simulator attached). All static import chains are clean — no file being imported references a deleted file.

---

## 7. Remaining DELETE_LATER Items

These were intentionally deferred. Mock data will be replaced when the backend is ready.

| Item | App | Condition |
|------|-----|-----------|
| `redux/Api/index.tsx` base URL `mrbikedoctors.com` | Both | Replace with real SerSLO endpoint when backend is ready |
| `react-native-image-crop-picker` package | Provider | Remove after refactoring `redux/Api/index.tsx` |
| `screen/Feature/WalletScreen.tsx` | User | Connect to payment backend post-MVP |
| `screen/Feature/ReferToEarnScreen.tsx` | Both | Connect referral backend post-MVP |
| `screen/bookingflow/ApplyCouponScreen.tsx` + `couponData.ts` | User | Replace static coupons with backend API |
| `screen/bookingflow/invoiceData.tsx` | Both | Replace hardcoded invoice with real booking data |
| `screen/Feature/NearbyProvidersScreen.tsx` (user) | User | Replace mock provider data with real API |
| `screen/Feature/BookingConfirmationModal.tsx` MOCK_PROVIDER | User | Replace with real partner data from booking API |
| `services/api.ts` (user) | User | Replace entire mock API with real SerSLO endpoints |
| `screen/Feature/EarningsFullDetailsScreen.tsx` | Provider | Replace mock earnings with real backend |
| `screen/Feature/PerformanceScreen.tsx` | Provider | Replace mock KPIs with real analytics API |
| `screen/Feature/NearbyJobsFeedScreen.tsx` | Provider | Replace mock job feed with real assignment API |
