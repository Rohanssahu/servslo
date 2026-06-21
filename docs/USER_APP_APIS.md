# USER APP — API Reference

**App**: ServSLO User App (React Native)
**Audit Date**: 2026-06-20

---

## Base Configuration

| Item | Value |
|------|-------|
| Primary API Base URL | `https://mrbikedoctors.com/api` |
| Image CDN Base URL | `https://mrbikedoctors.com/image/` |
| Auth Header | `Authorization: Bearer <token>` |
| Token Storage Key | `AsyncStorage → 'token'` |
| FCM Token Storage Key | `AsyncStorage → '@servslo/fcmToken'` |

---

## Authentication Endpoints

| Endpoint | Method | Auth Required | Screen / File | Notes |
|----------|--------|---------------|---------------|-------|
| `/bikedoctor/userAuth/userLogin` | POST | No | `PhoneLogin.tsx` | Phone number → triggers OTP send |
| `/bikedoctor/userAuth/otpVerify` | POST | No | `OTPVerification.tsx` | Verifies OTP, returns auth token |
| `/bikedoctor/userAuth/resendOtp` | POST | No | `OTPVerification.tsx` | Resends OTP to phone |
| `/bikedoctor/userAuth/addProfile` | POST | Yes | `UserInfoForm.tsx` | Saves name, gender, address, photo |
| `/auth/login` | POST | No | `authSlice.js` | Alt auth (email+password) — Redux thunk |
| `/auth/password-reset` | POST | No | `authSlice.js` | Password reset request |
| `/auth/verify-otp` | POST | No | `authSlice.js` | Alt OTP verification |
| `/auth/create-new-password` | POST | No | `authSlice.js` | Set new password after reset |
| `/auth/signup` | POST | No | `authSlice.js` | Email-based registration |
| `/auth/get-profile` | POST | Yes | `authSlice.js` | Fetch current user profile |
| `/auth/update-profile` | POST | Yes | `featuresSlice.js` | Update user profile |

> **Note**: Endpoints under `/auth/` and `/bikedoctor/` appear to be two separate backends or API versions. The `/auth/` endpoints in Redux slices use a broken import (`API` is not exported), so those thunks will fail at runtime. See [USER_APP_BUGS.md](USER_APP_BUGS.md) — Bug #1.

---

## Location Endpoints

| Endpoint | Method | Auth Required | Screen / File | Notes |
|----------|--------|---------------|---------------|-------|
| `/location/getAllStateData` | GET | No | `UserInfoForm.tsx` | Returns list of Indian states |
| `/location/getCityByState/:stateId` | GET | No | `UserInfoForm.tsx` | Cities for a given state |
| `https://maps.googleapis.com/maps/api/geocode/json` | GET | API Key | `LocationFetcher.tsx` | Reverse geocoding from lat/lon |

---

## Service Endpoints

| Endpoint | Method | Auth Required | Screen / File | Notes |
|----------|--------|---------------|---------------|-------|
| `/bikedoctor/service/servicelist` | GET | No | `AllServicesScreen.tsx`, `HomeScreen.tsx` | Returns all service categories |
| `/bikedoctor/banner/bannerlist` | GET | No | `HomeScreen.tsx` | Returns promotional banners |
| `/bikedoctor/bike/get-bike-companies` | GET | No | `ServiceBookingScreen.tsx` | All bike brands |
| `/bikedoctor/bike/get-bike-models/:company_id` | GET | No | `ServiceBookingScreen.tsx` | Models for selected brand |
| `/bikedoctor/bike/get-bike-variants/:model_id` | GET | No | `ServiceBookingScreen.tsx` | Variants for selected model |

---

## Dealer / Provider Endpoints

| Endpoint | Method | Auth Required | Screen / File | Notes |
|----------|--------|---------------|---------------|-------|
| `/bikedoctor/dealer/dealerWithInRange` | GET | No | `NearbyProvidersScreen.tsx`, `HomeScreen.tsx` | Find dealers by lat/lon radius |
| `/bikedoctor/dealer/dealerWithInRange2` | GET | No | `NearbyProvidersScreen.tsx` | Dealer search with bike variant filter |
| `/bikedoctor/dealer/getShopDetails?dealer_id=X` | GET | No | `NearbyProvidersScreen.tsx` | Full dealer profile |

---

## Booking Endpoints

| Endpoint | Method | Auth Required | Screen / File | Notes |
|----------|--------|---------------|---------------|-------|
| `/bikedoctor/bookings/createBooking` | POST | Yes | `BookingDetailsScreen.tsx` | Create a new booking |
| `/bikedoctor/bookings/getuserbookings` | GET | Yes | `MyBookingsScreen.tsx` | All bookings for current user |
| `/bikedoctor/bookings/getBookingDetails/:id` | GET | Yes | `JobDetailsScreen.tsx` | Single booking details |
| `/bikedoctor/bookings/updateBookingStatus` | POST | Yes | `JobDetailsScreen.tsx` | Cancel or update booking status |

---

## User / Customer Endpoints

| Endpoint | Method | Auth Required | Screen / File | Notes |
|----------|--------|---------------|---------------|-------|
| `/bikedoctor/customers/customer` | GET | Yes | `ProfileSettingsScreen.tsx` | Fetch current user profile |
| `/bikedoctor/customers/editcustomer/:id` | PUT | Yes | `EditProfile.tsx` | Update name, gender, etc. |
| `/bikedoctor/customers/editimage` | PUT | Yes | `EditProfile.tsx` | Update profile picture |
| `/bikedoctor/customers/getMyBikes` | GET | Yes | `ProfileSettingsScreen.tsx` | Get user's saved bikes |
| `/bikedoctor/customers/addUserBike` | POST | Yes | `ProfileSettingsScreen.tsx` | Add a bike to profile |
| `/bikedoctor/customers/deleteMyBike/:bike_id` | POST | Yes | `ProfileSettingsScreen.tsx` | Remove bike from profile |

---

## Pickup / Dropoff Endpoints

| Endpoint | Method | Auth Required | Screen / File | Notes |
|----------|--------|---------------|---------------|-------|
| `/bikedoctor/pickndrop/addpickndrop` | POST | Yes | `ServiceBookingScreen.tsx` | Save pickup/dropoff location for a booking |

---

## Support / Ticket Endpoints

| Endpoint | Method | Auth Required | Screen / File | Notes |
|----------|--------|---------------|---------------|-------|
| `/bikedoctor/ticket/my-tickets` | GET | Yes | `PartnerHelpSupportScreen.tsx` | All support tickets for user |
| `/bikedoctor/ticket/create` | POST | Yes | `PartnerHelpSupportScreen.tsx` | Open a new support ticket |
| `/bikedoctor/ticket/tickets/:ticket_id` | GET | Yes | `PartnerHelpSupportScreen.tsx` | Get single ticket details |
| `/bikedoctor/ticket/reply/:ticket_id` | POST | Yes | `PartnerHelpSupportScreen.tsx` | Post reply to a ticket |
| `/bikedoctor/ticket/status/:ticket_id` | PUT | Yes | `PartnerHelpSupportScreen.tsx` | Change ticket status (close/reopen) |

---

## Business / Dashboard Endpoints (Redux — Currently Broken)

> These endpoints are defined in `authSlice.js` and `featuresSlice.js` but will NOT function at runtime due to a missing `API` export. See Bug #1 in [USER_APP_BUGS.md](USER_APP_BUGS.md).

| Endpoint | Method | Redux Thunk | Notes |
|----------|--------|-------------|-------|
| `/auth/create-business` | POST | `create_bussiness` | Create business profile |
| `/business/get_business` | POST | `get_Bussiness_data` | Fetch business data |
| `/business/get_busines_filter` | POST | `get_Bussiness_list` | Filter businesses by category |
| `/business/get_dashboard` | POST | `get_dashboard_data` | Dashboard metrics |
| `/business/near_by_business` | POST | `get_near_by_business` | Find nearby businesses |
| `/business/get_business_details` | POST | `get_business_details` | Specific business details |
| `/business/get_save_businesses` | POST | `get_save_Bussines` | Saved/favorited businesses |
| `/common/ask_support` | POST | `send_message_help` | Send support message |

---

## External APIs

| Service | Endpoint | Auth | Used In |
|---------|----------|------|---------|
| Google Maps Geocoding | `https://maps.googleapis.com/maps/api/geocode/json` | API Key (in config.ts) | `LocationFetcher.tsx` |
| Google Places Autocomplete | via `react-native-google-places-autocomplete` | Same API Key | `LocationPickerScreen.tsx`, `AddressesScreen.tsx` |
| Cashfree PG | via `react-native-cashfree-pg-sdk` | Order token | `PaymentScreen.tsx` |
| Firebase FCM | via `@react-native-firebase/messaging` | google-services.json | `index.js`, `trackingNotifications.ts` |

---

## API Layer Architecture

```
src/redux/Api/
├── index.tsx          — exports callApi() and callMultipleApis() helpers
├── endpoints.tsx      — API endpoint constants
└── apiRequests.tsx    — 20+ named request functions (bike, dealer, booking APIs)

src/redux/feature/
├── authSlice.js       — 🔴 imports { API } which is NOT exported from index.tsx
└── featuresSlice.js   — 🔴 imports { API, base_url } which are NOT exported
```

**Request format (working path via `apiRequests.tsx`):**
```ts
callApi({
  endpoint: ENDPOINTS.SOME_ENDPOINT,
  method: 'GET' | 'POST' | 'PUT',
  body: { ... },         // optional
  token: string,         // optional — adds Bearer header
})
```

---

## API Statistics

| Metric | Count |
|--------|-------|
| Total unique endpoints | 40+ |
| GET endpoints | 17 |
| POST endpoints | 20 |
| PUT endpoints | 3 |
| External API integrations | 4 |
| Broken Redux thunks (import error) | 9 |
| Correctly wired API calls (apiRequests.tsx) | 20+ |
