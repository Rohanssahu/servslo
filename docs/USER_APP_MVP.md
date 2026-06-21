# User App — MVP Scope

> Analysis date: 2026-06-21  
> Scope: User App only. Provider App, Backend, and Admin are excluded.

---

## 1. Screen Inventory

### Authentication Flow

| # | Screen | File | Status |
|---|--------|------|--------|
| 1 | Splash | `src/screen/Auth/Splash.tsx` | ✅ UI Ready |
| 2 | Location Fetcher | `src/screen/Auth/LocationFetcher.tsx` | ✅ UI Ready |
| 3 | Language Select | `src/screen/Auth/Language.tsx` | ✅ UI Ready |
| 4 | Phone Login | `src/screen/Auth/PhoneLogin.tsx` | ✅ UI Ready · 🔌 Needs API |
| 5 | OTP Verification | `src/screen/Auth/OTPVerification.tsx` | ✅ UI Ready · 🔌 Needs API |
| 6 | User Info Form | `src/screen/Auth/UserInfoForm.tsx` | ✅ UI Ready · 🔌 Needs API |

### Bottom Tab Screens

| # | Screen | File | Status |
|---|--------|------|--------|
| 7 | Home | `src/screen/BottamTab/HomeScreen.tsx` | ✅ UI Ready · 🔌 Needs API |
| 8 | My Bookings | `src/screen/BottamTab/MyBookingsScreen.tsx` | ✅ UI Ready · 🔌 Needs API |
| 9 | Profile & Settings | `src/screen/BottamTab/ProfileSettingsScreen.tsx` | ✅ UI Ready · 🔌 Needs API |

### Booking Flow

| # | Screen | File | Status |
|---|--------|------|--------|
| 10 | All Services | `src/screen/Feature/AllServicesScreen.tsx` | ✅ UI Ready · 🔌 Needs API |
| 11 | Service Booking | `src/screen/bookingflow/ServiceBookingScreen.tsx` | ✅ UI Ready · 🔌 Needs API |
| 12 | Review Booking | `src/screen/Feature/ReviewBookingScreen.tsx` | ✅ UI Ready · 🔌 Needs API |
| 13 | Apply Coupon | `src/screen/bookingflow/ApplyCouponScreen.tsx` | ✅ UI Ready · 🔌 Needs API |
| 14 | Arrival Charges | `src/screen/bookingflow/ArrivalChargesScreen.tsx` | ✅ UI Ready · 🔌 Needs API |
| 15 | Payment | `src/screen/bookingflow/PaymentScreen.tsx` | ✅ UI Ready · 🔌 Needs API |
| 16 | Booking Track | `src/screen/Feature/BookingTrackScreen.tsx` | ✅ UI Ready · ⚙️ Needs Backend Logic |
| 17 | OTP Modal (Job Start) | `src/screen/bookingflow/OTPModal.tsx` | ✅ UI Ready · 🔌 Needs API |
| 18 | Job Details | `src/screen/Feature/JobDetailsScreen.tsx` | ✅ UI Ready · 🔌 Needs API |
| 19 | Invoice | `src/screen/bookingflow/invoiceData.tsx` | ✅ UI Ready · 🔌 Needs API |
| 20 | Feedback | `src/screen/Feature/FeedbackScreen.tsx` | ✅ UI Ready · 🔌 Needs API |
| 21 | Recurring Booking | `src/screen/bookingflow/RecurringBookingScreen.tsx` | ✅ UI Ready · 🔌 Needs API · 📅 Post MVP |

### Profile & Account Flow

| # | Screen | File | Status |
|---|--------|------|--------|
| 22 | Addresses | `src/screen/Feature/AddressesScreen.tsx` | ✅ UI Ready · 🔌 Needs API |
| 23 | Location Picker | `src/screen/Feature/LocationPickerScreen.tsx` | ✅ UI Ready · 🔌 Needs API |
| 24 | Wallet | `src/screen/Feature/WalletScreen.tsx` | ✅ UI Ready · 🔌 Needs API · 📅 Post MVP |
| 25 | Refer to Earn | `src/screen/Feature/ReferToEarnScreen.tsx` | ✅ UI Ready · 🔌 Needs API |

### Discovery

| # | Screen | File | Status |
|---|--------|------|--------|
| 26 | Nearby Providers | `src/screen/Feature/NearbyProvidersScreen.tsx` | ✅ UI Ready · 🔌 Needs API · 📅 Post MVP |

### Information & Support

| # | Screen | File | Status |
|---|--------|------|--------|
| 27 | Notifications | `src/screen/Feature/NotificationList.tsx` | ✅ UI Ready · 🔌 Needs API |
| 28 | Help & Support | `src/screen/Feature/PartnerHelpSupportScreen.tsx` | ✅ UI Ready (static + Linking) |
| 29 | Policies | `src/screen/Feature/PoliciesScreen.tsx` | ✅ UI Ready (static) |
| 30 | How to Use | `src/screen/Feature/HowToUseScreen.tsx` | ✅ UI Ready (static) |

---

## 2. Feature Status Legend

| Tag | Meaning |
|-----|---------|
| ✅ UI Ready | Screen is fully built with real UI, animations, and navigation wired |
| 🔌 Needs API | Currently uses hardcoded/mock data — needs a real API endpoint |
| ⚙️ Needs Backend Logic | Needs server-side logic beyond a simple CRUD endpoint (real-time, scheduling, payment gateway) |
| 📅 Post MVP | Fully built UI but feature is non-critical for first launch |

---

## 3. All User Features

### Auth & Onboarding

| Feature | Status |
|---------|--------|
| Animated splash screen | ✅ UI Ready |
| Auto-detect current city/location | ✅ UI Ready · 🔌 Needs API (reverse geocode) |
| Language selection (Hindi / English) | ✅ UI Ready |
| TTS voice prompts on auth screens | ✅ UI Ready |
| Phone number login (+91) | ✅ UI Ready · 🔌 Needs API |
| OTP verification (4-digit, 60s resend) | ✅ UI Ready · 🔌 Needs API |
| User profile setup (name, gender, photo) | ✅ UI Ready · 🔌 Needs API |
| T&C agreement modal | ✅ UI Ready |

### Home & Discovery

| Feature | Status |
|---------|--------|
| Location header (city + area name) | ✅ UI Ready · 🔌 Needs API |
| Smart search bar (text + voice) | ✅ UI Ready |
| Daily services grid (6 categories) | ✅ UI Ready · 🔌 Needs API |
| Most booked services carousel | ✅ UI Ready · 🔌 Needs API |
| Campaign system (flash deals, banners, coupons) | ✅ UI Ready · 📅 Post MVP |
| Onboarding walkthrough (5 steps) | ✅ UI Ready |
| All services grid with category filters | ✅ UI Ready · 🔌 Needs API |
| Voice search across service catalog | ✅ UI Ready |

### Booking Flow

| Feature | Status |
|---------|--------|
| Select service + date/time/urgency | ✅ UI Ready · 🔌 Needs API |
| Address selection per booking | ✅ UI Ready · 🔌 Needs API |
| Arrival charge explanation + accept/decline | ✅ UI Ready · 🔌 Needs API |
| Review booking summary | ✅ UI Ready · 🔌 Needs API |
| Apply coupon code | ✅ UI Ready · 🔌 Needs API |
| Cash / UPI payment selection | ✅ UI Ready · ⚙️ Needs Backend Logic |
| Booking confirmation | ✅ UI Ready · 🔌 Needs API |
| Recurring bookings (daily/weekly/monthly) | ✅ UI Ready · ⚙️ Needs Backend Logic · 📅 Post MVP |

### Live Tracking

| Feature | Status |
|---------|--------|
| Real-time provider location on map | ✅ UI Ready · ⚙️ Needs Backend Logic |
| Provider ETA countdown | ✅ UI Ready · ⚙️ Needs Backend Logic |
| Bearing-animated provider marker | ✅ UI Ready |
| Status timeline (7 milestones) | ✅ UI Ready · 🔌 Needs API |
| Push notifications: foreground | ✅ UI Ready · ⚙️ Needs Backend Logic |
| Push notifications: background | ✅ UI Ready · ⚙️ Needs Backend Logic |
| Push notifications: kill-state | ✅ UI Ready · ⚙️ Needs Backend Logic |

### Job Execution

| Feature | Status |
|---------|--------|
| Provider arrival confirmation | ✅ UI Ready · 🔌 Needs API |
| OTP to start job | ✅ UI Ready · 🔌 Needs API |
| Extra work estimation + photo | ✅ UI Ready · 🔌 Needs API |
| Job in-progress status | ✅ UI Ready · 🔌 Needs API |
| OTP to complete job | ✅ UI Ready · 🔌 Needs API |
| Invoice after completion | ✅ UI Ready · 🔌 Needs API |
| Rating & review after job | ✅ UI Ready · 🔌 Needs API |

### Booking Management

| Feature | Status |
|---------|--------|
| Active bookings list | ✅ UI Ready · 🔌 Needs API |
| Completed bookings history | ✅ UI Ready · 🔌 Needs API |
| Cancelled bookings | ✅ UI Ready · 🔌 Needs API |
| Cancel active booking | ✅ UI Ready · 🔌 Needs API |

### Profile & Account

| Feature | Status |
|---------|--------|
| View & edit profile (name, gender, photo) | ✅ UI Ready · 🔌 Needs API |
| Saved addresses (home, office, other) | ✅ UI Ready · 🔌 Needs API |
| Add new address with map picker | ✅ UI Ready · 🔌 Needs API |
| Edit / delete saved address | ✅ UI Ready · 🔌 Needs API |
| Language toggle (persisted) | ✅ UI Ready |
| Logout | ✅ UI Ready · 🔌 Needs API |
| Delete account | ✅ UI Ready · 🔌 Needs API |

### Wallet & Referral

| Feature | Status |
|---------|--------|
| Wallet balance (cash + bonus) | ✅ UI Ready · 🔌 Needs API · 📅 Post MVP |
| Add money to wallet | ✅ UI Ready · ⚙️ Needs Backend Logic · 📅 Post MVP |
| Transaction history | ✅ UI Ready · 🔌 Needs API · 📅 Post MVP |
| Referral code share | ✅ UI Ready · 🔌 Needs API |
| Referral earnings tracking | ✅ UI Ready · 🔌 Needs API · 📅 Post MVP |

### Notifications & Support

| Feature | Status |
|---------|--------|
| In-app notification list | ✅ UI Ready · 🔌 Needs API |
| Mark notification as read | ✅ UI Ready · 🔌 Needs API |
| Mark all as read | ✅ UI Ready · 🔌 Needs API |
| Help & Support (call, WhatsApp, email, FAQ) | ✅ UI Ready (static links) |
| Policies (terms, privacy, refund, cancellation) | ✅ UI Ready (static) |
| How to Use guide | ✅ UI Ready (static) |

---

## 4. Flow Maps

### Authentication Flow
```
Splash (900ms auto)
  → LocationFetcher (geolocation + reverse geocode)
    → Language Select
      → Phone Login
        → OTP Verification
          → User Info Form
            → HomeScreen (Tab Navigator)
```

### Core Booking Flow
```
HomeScreen
  → [AllServicesScreen]          (optional, browse all)
    → ServiceBookingScreen        (pick date / time / address)
      → ReviewBookingScreen       (summary + coupon)
        → [ApplyCouponScreen]     (optional)
          → ArrivalChargesScreen  (₹49 arrival fee gate)
            → PaymentScreen       (cash / UPI, provider assignment)
              → BookingTrackScreen (live map + ETA)
                → OTPModal         (job-start OTP)
                  → JobDetailsScreen (in-progress + extra work)
                    → FeedbackScreen
                      → HomeScreen
```

### Profile Flow
```
ProfileSettingsScreen
  ├── Edit Profile
  ├── AddressesScreen
  │     └── LocationPickerScreen
  ├── WalletScreen           (Post MVP)
  ├── ReferToEarnScreen
  ├── HowToUseScreen
  ├── PoliciesScreen
  ├── Help & Support
  └── Logout / Delete Account
```

### Address Flow
```
AddressesScreen
  ├── Select existing address (radio)
  ├── Edit address (type + landmark)
  ├── Delete address
  └── Add New → LocationPickerScreen (map pin + type) → Save → back
```

### Tracking Flow
```
MyBookingsScreen → [tap active booking]
  → BookingTrackScreen
      ├── Live map (provider marker + polyline)
      ├── Status timeline (ASSIGNED → COMPLETED)
      ├── ETA badge
      └── FCM push (foreground / background / kill-state)
```

---

## 5. Final User App MVP Scope

### IN SCOPE — Must ship for MVP

| # | Feature Area | Screens Included |
|---|-------------|-----------------|
| 1 | Auth & Onboarding | Splash, LocationFetcher, Language, PhoneLogin, OTPVerification, UserInfoForm |
| 2 | Home | HomeScreen (services grid, most booked, search) |
| 3 | Service Discovery | AllServicesScreen |
| 4 | Core Booking | ServiceBookingScreen, ReviewBookingScreen, ApplyCouponScreen, ArrivalChargesScreen, PaymentScreen |
| 5 | Live Tracking | BookingTrackScreen |
| 6 | Job Execution | OTPModal, JobDetailsScreen, InvoiceScreen |
| 7 | Post-Job | FeedbackScreen |
| 8 | Booking History | MyBookingsScreen |
| 9 | Profile | ProfileSettingsScreen, Edit Profile |
| 10 | Addresses | AddressesScreen, LocationPickerScreen |
| 11 | Referral | ReferToEarnScreen |
| 12 | Notifications | NotificationList |
| 13 | Info & Support | HelpSupportScreen, PoliciesScreen, HowToUseScreen |

### OUT OF SCOPE — Post MVP

| Feature | Reason |
|---------|--------|
| RecurringBookingScreen | Complex scheduling logic; not a D1 use case |
| WalletScreen + Add Money | Requires payment gateway + wallet backend |
| NearbyProvidersScreen | Provider matching handled by backend; map preview is non-critical |
| Campaign system (banners/deals) | Content management system dependency |
| Referral earnings tracking | Requires accounting backend |

### MVP Definition of Done

A feature is MVP-complete when:
1. The screen connects to a real API (no hardcoded data)
2. Error states are handled (empty, failed, loading)
3. The happy path works end-to-end on device
4. FCM push notifications fire at the correct booking status transitions

---

## 6. Current State Summary

| Category | Count | UI Ready | Needs API | Post MVP |
|----------|-------|----------|-----------|----------|
| Auth screens | 6 | 6 | 3 | 0 |
| Tab screens | 3 | 3 | 3 | 0 |
| Booking flow | 12 | 12 | 12 | 1 |
| Profile / Account | 4 | 4 | 4 | 1 |
| Discovery | 1 | 1 | 1 | 1 |
| Info / Support | 4 | 4 | 0 | 0 |
| **Total** | **30** | **30** | **23** | **3** |

**The entire app UI is built. Zero screens need UI work. The only remaining work is wiring real APIs.**
