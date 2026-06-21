# User App — API Requirements

> Analysis date: 2026-06-21  
> Base URL convention: `https://<domain>/api/v1`  
> Auth: Bearer token in `Authorization` header for all authenticated endpoints  
> All timestamps: ISO 8601 (`2026-06-21T10:30:00Z`)  
> All amounts: integer paise (₹49.00 = `4900`)

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [User Profile](#2-user-profile)
3. [Home Screen](#3-home-screen)
4. [Service Catalog](#4-service-catalog)
5. [Addresses](#5-addresses)
6. [Booking Creation Flow](#6-booking-creation-flow)
7. [Coupons](#7-coupons)
8. [Payment](#8-payment)
9. [Live Tracking](#9-live-tracking)
10. [Job Execution (OTP + Extra Work)](#10-job-execution)
11. [My Bookings](#11-my-bookings)
12. [Invoice](#12-invoice)
13. [Feedback & Rating](#13-feedback--rating)
14. [Notifications](#14-notifications)
15. [Referral](#15-referral)
16. [Wallet (Post MVP)](#16-wallet-post-mvp)

---

## 1. Authentication

### 1.1 Send OTP
**Screen**: PhoneLogin  
**Trigger**: User taps "Send OTP" after entering 10-digit phone number

```
POST /auth/send-otp
```

Request:
```json
{
  "phone": "9876543210",
  "country_code": "+91"
}
```

Response `200`:
```json
{
  "success": true,
  "message": "OTP sent",
  "otp_expires_in": 60
}
```

Response `429`:
```json
{
  "success": false,
  "error": "TOO_MANY_REQUESTS",
  "retry_after": 120
}
```

---

### 1.2 Verify OTP
**Screen**: OTPVerification  
**Trigger**: User submits 4-digit OTP

```
POST /auth/verify-otp
```

Request:
```json
{
  "phone": "9876543210",
  "country_code": "+91",
  "otp": "4821"
}
```

Response `200` (existing user — goes straight to Home):
```json
{
  "success": true,
  "is_new_user": false,
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "user": {
    "id": "usr_abc123",
    "name": "Rohan Sahu",
    "phone": "9876543210",
    "gender": "male",
    "photo_url": "https://...",
    "referral_code": "ROHAN1234",
    "language": "hi",
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

Response `200` (new user — goes to UserInfoForm):
```json
{
  "success": true,
  "is_new_user": true,
  "temp_token": "eyJ..."
}
```

Response `400`:
```json
{
  "success": false,
  "error": "INVALID_OTP",
  "attempts_remaining": 2
}
```

---

### 1.3 Complete Profile (New User)
**Screen**: UserInfoForm  
**Trigger**: New user taps "Next" after filling name, gender, photo

```
POST /auth/complete-profile
Content-Type: multipart/form-data
Authorization: Bearer <temp_token>
```

Request (multipart):
```
name:   "Rohan Sahu"
gender: "male"            // male | female | other
photo:  <binary file>     // optional, JPEG/PNG, max 5MB
fcm_token: "dxQ3..."
language: "hi"            // hi | en
```

Response `200`:
```json
{
  "success": true,
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "user": {
    "id": "usr_abc123",
    "name": "Rohan Sahu",
    "gender": "male",
    "photo_url": "https://cdn.../users/usr_abc123.jpg",
    "referral_code": "ROHAN1234"
  }
}
```

---

### 1.4 Refresh Token
**Trigger**: Access token expired (intercept 401 in axios)

```
POST /auth/refresh
```

Request:
```json
{
  "refresh_token": "eyJ..."
}
```

Response `200`:
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ..."
}
```

---

### 1.5 Logout
**Screen**: ProfileSettingsScreen  
**Trigger**: User confirms logout

```
POST /auth/logout
Authorization: Bearer <token>
```

Request:
```json
{
  "fcm_token": "dxQ3..."
}
```

Response `200`:
```json
{ "success": true }
```

---

### 1.6 Delete Account
**Screen**: ProfileSettingsScreen  
**Trigger**: User confirms "Delete my data"

```
DELETE /users/me
Authorization: Bearer <token>
```

Response `200`:
```json
{ "success": true }
```

---

## 2. User Profile

### 2.1 Get Profile
**Screen**: ProfileSettingsScreen, UserInfoForm (pre-fill on edit)

```
GET /users/me
Authorization: Bearer <token>
```

Response `200`:
```json
{
  "id": "usr_abc123",
  "name": "Rohan Sahu",
  "phone": "9876543210",
  "gender": "male",
  "photo_url": "https://cdn.../photo.jpg",
  "referral_code": "ROHAN1234",
  "language": "hi",
  "wallet_balance": 0,
  "created_at": "2026-01-01T00:00:00Z"
}
```

---

### 2.2 Update Profile
**Screen**: ProfileSettingsScreen → Edit Profile

```
PATCH /users/me
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Request (any subset of fields):
```
name:     "Rohan Sahu"
gender:   "male"
photo:    <binary file>
language: "en"
fcm_token: "newToken..."
```

Response `200`:
```json
{
  "success": true,
  "user": { /* same shape as GET /users/me */ }
}
```

---

## 3. Home Screen

### 3.1 Home Feed
**Screen**: HomeScreen  
**Trigger**: Screen mount

```
GET /home/feed
Authorization: Bearer <token>
```

Query params:
```
lat=19.0760&lng=72.8777
```

Response `200`:
```json
{
  "location": {
    "city": "Mumbai",
    "area": "Andheri West",
    "lat": 19.0760,
    "lng": 72.8777
  },
  "daily_services": [
    {
      "id": "svc_safai",
      "name": "घर की सफाई",
      "name_en": "Home Cleaning",
      "emoji": "🧹",
      "base_price": 29900,
      "category": "cleaning"
    }
  ],
  "most_booked": [
    {
      "id": "svc_ac",
      "name": "AC सर्विसिंग",
      "name_en": "AC Service",
      "emoji": "❄️",
      "base_price": 49900,
      "booking_count": 1240,
      "rating": 4.8,
      "category": "appliance"
    }
  ],
  "active_campaigns": [
    {
      "id": "cmp_monsoon",
      "type": "flash_deal",
      "title": "मानसून ऑफर",
      "subtitle": "50% off on pest control",
      "color": "#1565C0",
      "expires_at": "2026-07-31T23:59:59Z"
    }
  ]
}
```

---

## 4. Service Catalog

### 4.1 List All Services
**Screen**: AllServicesScreen  
**Trigger**: Screen mount

```
GET /services
Authorization: Bearer <token>
```

Query params:
```
lat=19.0760&lng=72.8777&category=cleaning   // category optional
```

Response `200`:
```json
{
  "services": [
    {
      "id": "svc_elec",
      "name": "इलेक्ट्रीशियन",
      "name_en": "Electrician",
      "emoji": "⚡",
      "category": "electrical",
      "base_price": 29900,
      "rating": 4.7,
      "review_count": 3210,
      "is_available": true,
      "tags": ["wiring", "fan", "switchboard"]
    }
  ],
  "categories": [
    { "id": "all", "label": "सभी", "label_en": "All" },
    { "id": "cleaning", "label": "सफाई", "label_en": "Cleaning" },
    { "id": "electrical", "label": "इलेक्ट्रिकल", "label_en": "Electrical" },
    { "id": "appliance", "label": "उपकरण", "label_en": "Appliance" },
    { "id": "beauty", "label": "ब्यूटी", "label_en": "Beauty" }
  ]
}
```

---

### 4.2 Get Service Detail
**Screen**: ServiceBookingScreen  
**Trigger**: User taps a service card

```
GET /services/:service_id
Authorization: Bearer <token>
```

Response `200`:
```json
{
  "id": "svc_ac",
  "name": "AC सर्विसिंग",
  "name_en": "AC Service",
  "emoji": "❄️",
  "category": "appliance",
  "base_price": 49900,
  "arrival_charge": 4900,
  "description": "Split AC deep clean + gas check",
  "time_slots": [
    { "label": "9 बजे", "value": "09:00", "available": true },
    { "label": "11 बजे", "value": "11:00", "available": true },
    { "label": "1 बजे", "value": "13:00", "available": false },
    { "label": "3 बजे", "value": "15:00", "available": true },
    { "label": "5 बजे", "value": "17:00", "available": true }
  ],
  "urgency_options": [
    { "label": "10 मिनट में", "value": "10min", "surcharge": 4900 },
    { "label": "30 मिनट में", "value": "30min", "surcharge": 2900 },
    { "label": "1 घंटे में", "value": "1hr", "surcharge": 0 }
  ],
  "is_available": true
}
```

---

## 5. Addresses

### 5.1 List Addresses
**Screen**: AddressesScreen  
**Trigger**: Screen mount

```
GET /users/me/addresses
Authorization: Bearer <token>
```

Response `200`:
```json
{
  "addresses": [
    {
      "id": "addr_001",
      "type": "home",
      "label": "घर",
      "line1": "101, Sai Darshan Society",
      "line2": "Andheri West",
      "city": "Mumbai",
      "pincode": "400053",
      "landmark": "Near D-Mart",
      "lat": 19.1234,
      "lng": 72.8567,
      "is_default": true
    }
  ]
}
```

---

### 5.2 Add Address
**Screen**: LocationPickerScreen → confirm  
**Trigger**: User confirms pin on map

```
POST /users/me/addresses
Authorization: Bearer <token>
```

Request:
```json
{
  "type": "home",
  "line1": "101, Sai Darshan Society",
  "line2": "Andheri West",
  "city": "Mumbai",
  "pincode": "400053",
  "landmark": "Near D-Mart",
  "lat": 19.1234,
  "lng": 72.8567,
  "is_default": false
}
```

Response `201`:
```json
{
  "success": true,
  "address": { /* same shape as list item */ }
}
```

---

### 5.3 Update Address

```
PATCH /users/me/addresses/:address_id
Authorization: Bearer <token>
```

Request (any subset):
```json
{
  "type": "office",
  "landmark": "4th floor, Tower B"
}
```

Response `200`:
```json
{ "success": true, "address": { /* updated */ } }
```

---

### 5.4 Delete Address

```
DELETE /users/me/addresses/:address_id
Authorization: Bearer <token>
```

Response `200`:
```json
{ "success": true }
```

---

### 5.5 Reverse Geocode
**Screen**: LocationPickerScreen  
**Trigger**: User drags map pin

```
GET /geo/reverse
Authorization: Bearer <token>
```

Query params:
```
lat=19.1234&lng=72.8567
```

Response `200`:
```json
{
  "line1": "Near Infinity Mall",
  "area": "Andheri West",
  "city": "Mumbai",
  "pincode": "400053"
}
```

---

## 6. Booking Creation Flow

### 6.1 Get Available Slots
**Screen**: ServiceBookingScreen  
**Trigger**: User selects a date

```
GET /bookings/available-slots
Authorization: Bearer <token>
```

Query params:
```
service_id=svc_ac&date=2026-06-22&lat=19.1234&lng=72.8567
```

Response `200`:
```json
{
  "date": "2026-06-22",
  "slots": [
    { "time": "09:00", "available": true },
    { "time": "11:00", "available": true },
    { "time": "13:00", "available": false },
    { "time": "15:00", "available": true },
    { "time": "17:00", "available": true }
  ]
}
```

---

### 6.2 Preview Booking (Review Screen)
**Screen**: ReviewBookingScreen  
**Trigger**: User taps "Review Booking" from ServiceBookingScreen

```
POST /bookings/preview
Authorization: Bearer <token>
```

Request:
```json
{
  "service_id": "svc_ac",
  "address_id": "addr_001",
  "date": "2026-06-22",
  "time_slot": "11:00",
  "urgency": "1hr",
  "coupon_code": "SAVE50",
  "recurring": null
}
```

Response `200`:
```json
{
  "preview_token": "prev_xyz789",
  "expires_at": "2026-06-21T11:10:00Z",
  "line_items": [
    { "label": "AC सर्विसिंग", "amount": 49900 },
    { "label": "Arrival Charge", "amount": 4900 },
    { "label": "Coupon (SAVE50)", "amount": -5000 }
  ],
  "subtotal": 49800,
  "taxes": 0,
  "total": 49800,
  "arrival_charge": 4900,
  "coupon_applied": {
    "code": "SAVE50",
    "discount": 5000
  },
  "provider_estimate": {
    "available_count": 4,
    "eta_min": 12
  }
}
```

---

### 6.3 Create Booking (Payment Confirmation)
**Screen**: PaymentScreen  
**Trigger**: User confirms payment method and taps "Book Now"

```
POST /bookings
Authorization: Bearer <token>
```

Request:
```json
{
  "preview_token": "prev_xyz789",
  "payment_method": "cash",
  "payment_plan": "full"
}
```

Response `201`:
```json
{
  "booking_id": "BK-102938",
  "status": "SEARCHING",
  "provider": null,
  "estimated_provider_eta": null,
  "message": "Provider खोजा जा रहा है..."
}
```

---

### 6.4 Poll Booking Status (Provider Assignment)
**Screen**: PaymentScreen (searching animation)  
**Trigger**: Polling every 3s after booking created until provider assigned

```
GET /bookings/:booking_id/status
Authorization: Bearer <token>
```

Response `200` (still searching):
```json
{
  "booking_id": "BK-102938",
  "status": "SEARCHING",
  "provider": null
}
```

Response `200` (provider assigned):
```json
{
  "booking_id": "BK-102938",
  "status": "ASSIGNED",
  "provider": {
    "id": "pvd_001",
    "name": "Rohit Sharma",
    "phone": "9876501234",
    "photo_url": "https://cdn.../pvd_001.jpg",
    "rating": 4.8,
    "jobs_done": 320,
    "lat": 19.1250,
    "lng": 72.8580,
    "eta_minutes": 12
  }
}
```

---

## 7. Coupons

### 7.1 List Available Coupons
**Screen**: ApplyCouponScreen  
**Trigger**: Screen mount

```
GET /coupons
Authorization: Bearer <token>
```

Query params:
```
service_id=svc_ac&order_amount=49900
```

Response `200`:
```json
{
  "coupons": [
    {
      "code": "SAVE50",
      "title": "₹50 की बचत",
      "description": "₹300+ के ऑर्डर पर",
      "discount_type": "flat",
      "discount_value": 5000,
      "min_order": 30000,
      "max_discount": 5000,
      "category": "general",
      "expires_at": "2026-12-31T23:59:59Z",
      "is_eligible": true
    }
  ]
}
```

---

### 7.2 Validate Coupon Code (Manual Entry)
**Screen**: ApplyCouponScreen  
**Trigger**: User types a code and taps "Apply"

```
POST /coupons/validate
Authorization: Bearer <token>
```

Request:
```json
{
  "code": "NEWUSER100",
  "service_id": "svc_ac",
  "order_amount": 49900
}
```

Response `200` (valid):
```json
{
  "valid": true,
  "code": "NEWUSER100",
  "discount": 10000,
  "final_amount": 39900
}
```

Response `200` (invalid):
```json
{
  "valid": false,
  "error": "COUPON_EXPIRED",
  "message": "यह कूपन समाप्त हो गया है"
}
```

---

## 8. Payment

### 8.1 Initiate UPI Payment
**Screen**: PaymentScreen  
**Trigger**: User selects UPI and taps "Pay"

```
POST /payments/initiate
Authorization: Bearer <token>
```

Request:
```json
{
  "booking_id": "BK-102938",
  "method": "upi",
  "upi_app": "gpay",
  "amount": 49800
}
```

Response `200`:
```json
{
  "payment_id": "pay_abc123",
  "upi_intent_url": "upi://pay?pa=...&pn=ServSLO&am=498.00&tr=pay_abc123",
  "expires_at": "2026-06-21T11:20:00Z"
}
```

---

### 8.2 Confirm Payment
**Screen**: PaymentScreen  
**Trigger**: App returns from UPI intent

```
POST /payments/:payment_id/confirm
Authorization: Bearer <token>
```

Request:
```json
{
  "booking_id": "BK-102938",
  "upi_ref": "TXN123456789"
}
```

Response `200`:
```json
{
  "success": true,
  "payment_id": "pay_abc123",
  "booking_id": "BK-102938",
  "status": "PAID"
}
```

---

## 9. Live Tracking

### 9.1 Get Booking Tracking State
**Screen**: BookingTrackScreen  
**Trigger**: Screen mount + polling every 5s

```
GET /bookings/:booking_id/track
Authorization: Bearer <token>
```

Response `200`:
```json
{
  "booking_id": "BK-102938",
  "status": "EN_ROUTE",
  "provider": {
    "id": "pvd_001",
    "name": "Rohit Sharma",
    "phone": "9876501234",
    "photo_url": "https://...",
    "rating": 4.8,
    "lat": 19.1242,
    "lng": 72.8571,
    "bearing": 45.2,
    "speed_kmh": 22.0
  },
  "eta_minutes": 8,
  "user_location": {
    "lat": 19.0760,
    "lng": 72.8777
  },
  "route_polyline": "encoded_polyline_string",
  "milestones": [
    { "key": "ASSIGNED",    "label": "Provider मिला",   "done": true,  "time": "2026-06-21T10:00:00Z" },
    { "key": "EN_ROUTE",    "label": "रास्ते में है",    "done": true,  "time": "2026-06-21T10:02:00Z" },
    { "key": "NEARBY",      "label": "पास में है",       "done": false, "time": null },
    { "key": "ARRIVED",     "label": "पहुँच गया",        "done": false, "time": null },
    { "key": "OTP_VERIFIED","label": "काम शुरू हुआ",    "done": false, "time": null },
    { "key": "IN_PROGRESS", "label": "काम चल रहा है",   "done": false, "time": null },
    { "key": "COMPLETED",   "label": "काम पूरा",         "done": false, "time": null }
  ]
}
```

---

### 9.2 Cancel Booking
**Screen**: BookingTrackScreen (cancel button, only if provider is far)

```
POST /bookings/:booking_id/cancel
Authorization: Bearer <token>
```

Request:
```json
{
  "reason": "changed_mind"
}
```

Response `200`:
```json
{
  "success": true,
  "refund": {
    "amount": 4900,
    "method": "wallet",
    "estimated_days": 0
  }
}
```

---

## 10. Job Execution

### 10.1 Verify Job-Start OTP
**Screen**: OTPModal  
**Trigger**: Provider arrives; user gives OTP to provider; provider confirms on their app; user taps Verify

```
POST /bookings/:booking_id/verify-start-otp
Authorization: Bearer <token>
```

Request:
```json
{
  "otp": "4821"
}
```

Response `200`:
```json
{
  "success": true,
  "booking_id": "BK-102938",
  "status": "IN_PROGRESS",
  "started_at": "2026-06-21T10:30:00Z"
}
```

Response `400`:
```json
{
  "success": false,
  "error": "INVALID_OTP"
}
```

---

### 10.2 Get Job Detail
**Screen**: JobDetailsScreen  
**Trigger**: Screen mount

```
GET /bookings/:booking_id/job
Authorization: Bearer <token>
```

Response `200`:
```json
{
  "booking_id": "BK-102938",
  "status": "IN_PROGRESS",
  "service": "AC सर्विसिंग",
  "provider": {
    "name": "Rohit Sharma",
    "photo_url": "https://...",
    "phone": "9876501234"
  },
  "address": "101, Sai Darshan, Andheri West",
  "scheduled_at": "2026-06-21T11:00:00Z",
  "started_at": "2026-06-21T10:30:00Z",
  "base_amount": 49900,
  "extra_work": [],
  "completion_otp": "7362"
}
```

---

### 10.3 Add Extra Work
**Screen**: JobDetailsScreen (Step 5 — extra work estimation)

```
POST /bookings/:booking_id/extra-work
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Request (multipart):
```
description: "Replace capacitor also"
amount:      "29900"
photo:       <binary file>    // optional
```

Response `200`:
```json
{
  "success": true,
  "extra_work_id": "ew_001",
  "status": "PENDING_APPROVAL",
  "amount": 29900
}
```

---

### 10.4 Verify Job-Completion OTP
**Screen**: JobDetailsScreen (Step 7)

```
POST /bookings/:booking_id/verify-complete-otp
Authorization: Bearer <token>
```

Request:
```json
{
  "otp": "7362"
}
```

Response `200`:
```json
{
  "success": true,
  "booking_id": "BK-102938",
  "status": "COMPLETED",
  "completed_at": "2026-06-21T12:15:00Z",
  "final_amount": 79800
}
```

---

## 11. My Bookings

### 11.1 List Bookings
**Screen**: MyBookingsScreen  
**Trigger**: Screen mount + tab switch

```
GET /bookings
Authorization: Bearer <token>
```

Query params:
```
status=active        // active | completed | cancelled | all (default: all)
page=1&limit=20
```

Response `200`:
```json
{
  "bookings": [
    {
      "booking_id": "BK-102938",
      "service": "AC सर्विसिंग",
      "service_emoji": "❄️",
      "status": "EN_ROUTE",
      "scheduled_at": "2026-06-21T11:00:00Z",
      "address": "Andheri West, Mumbai",
      "amount": 49900,
      "provider": {
        "name": "Rohit Sharma",
        "photo_url": "https://...",
        "rating": 4.8,
        "eta_minutes": 8
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "has_more": false
  }
}
```

---

## 12. Invoice

### 12.1 Get Invoice
**Screen**: invoiceData.tsx  
**Trigger**: Screen mount (bookingId passed as route param)

```
GET /bookings/:booking_id/invoice
Authorization: Bearer <token>
```

Response `200`:
```json
{
  "invoice_id": "INV-20260621-001",
  "booking_id": "BK-102938",
  "generated_at": "2026-06-21T12:20:00Z",
  "customer": {
    "name": "Rohan Sahu",
    "phone": "9876543210"
  },
  "provider": {
    "name": "Rohit Sharma",
    "id": "pvd_001"
  },
  "service": "AC सर्विसिंग",
  "address": "101, Sai Darshan, Andheri West, Mumbai - 400053",
  "started_at": "2026-06-21T10:30:00Z",
  "completed_at": "2026-06-21T12:15:00Z",
  "duration_minutes": 105,
  "line_items": [
    { "label": "AC सर्विसिंग", "amount": 49900 },
    { "label": "Arrival Charge", "amount": 4900 },
    { "label": "Extra Work — Capacitor", "amount": 29900 },
    { "label": "Coupon (SAVE50)", "amount": -5000 }
  ],
  "subtotal": 79700,
  "taxes": 0,
  "total": 79700,
  "payment_method": "cash",
  "payment_status": "PAID"
}
```

---

## 13. Feedback & Rating

### 13.1 Submit Feedback
**Screen**: FeedbackScreen  
**Trigger**: User taps "Submit Review"

```
POST /bookings/:booking_id/feedback
Authorization: Bearer <token>
```

Request:
```json
{
  "ratings": {
    "overall": 5,
    "punctuality": 4,
    "quality": 5,
    "behavior": 5
  },
  "comment": "Bahut achha kaam kiya"
}
```

Response `200`:
```json
{
  "success": true,
  "message": "धन्यवाद! आपकी प्रतिक्रिया दर्ज हो गई।"
}
```

---

## 14. Notifications

### 14.1 List Notifications
**Screen**: NotificationList  
**Trigger**: Screen mount

```
GET /notifications
Authorization: Bearer <token>
```

Query params:
```
type=booking     // booking | offer | payment | update | all (default: all)
page=1&limit=30
```

Response `200`:
```json
{
  "notifications": [
    {
      "id": "notif_001",
      "type": "booking",
      "title": "Provider रास्ते में है",
      "body": "Rohit Sharma 8 मिनट में पहुँचेगा",
      "is_read": false,
      "booking_id": "BK-102938",
      "created_at": "2026-06-21T10:02:00Z"
    }
  ],
  "unread_count": 3,
  "pagination": {
    "page": 1,
    "total": 12,
    "has_more": false
  }
}
```

---

### 14.2 Mark Notifications Read

```
PATCH /notifications/read
Authorization: Bearer <token>
```

Request:
```json
{
  "notification_ids": ["notif_001", "notif_002"]
}
```

To mark all as read:
```json
{
  "mark_all": true
}
```

Response `200`:
```json
{ "success": true, "updated_count": 2 }
```

---

### 14.3 Update FCM Token
**Trigger**: App launch or token refresh (index.js / AppNavigator)

```
PATCH /users/me/fcm-token
Authorization: Bearer <token>
```

Request:
```json
{
  "fcm_token": "dxQ3_new_token_here"
}
```

Response `200`:
```json
{ "success": true }
```

---

## 15. Referral

### 15.1 Get Referral Info
**Screen**: ReferToEarnScreen  
**Trigger**: Screen mount

```
GET /users/me/referral
Authorization: Bearer <token>
```

Response `200`:
```json
{
  "referral_code": "ROHAN1234",
  "total_referred": 3,
  "total_earned": 15000,
  "per_referral_reward": 5000,
  "share_text": "ServSLO पर घर की सेवाएं बुक करें। मेरे कोड ROHAN1234 से ₹50 की छूट पाएं। Download: https://..."
}
```

---

## 16. Wallet (Post MVP)

### 16.1 Get Wallet Balance
**Screen**: WalletScreen

```
GET /users/me/wallet
Authorization: Bearer <token>
```

Response `200`:
```json
{
  "cash_balance": 0,
  "bonus_balance": 0,
  "total_balance": 0
}
```

---

### 16.2 Get Transaction History
**Screen**: WalletScreen

```
GET /users/me/wallet/transactions
Authorization: Bearer <token>
```

Query params:
```
type=all     // all | addition | deduction
page=1&limit=20
```

Response `200`:
```json
{
  "transactions": [
    {
      "id": "txn_001",
      "type": "addition",
      "amount": 5000,
      "description": "Referral reward — FRIEND used ROHAN1234",
      "balance_after": 5000,
      "created_at": "2026-06-10T09:00:00Z"
    }
  ],
  "pagination": { "page": 1, "total": 0, "has_more": false }
}
```

---

### 16.3 Initiate Add Money
**Screen**: WalletScreen → Add Money flow

```
POST /users/me/wallet/add-money
Authorization: Bearer <token>
```

Request:
```json
{
  "amount": 50000,
  "method": "upi"
}
```

Response `200`:
```json
{
  "payment_id": "pay_wallet_001",
  "upi_intent_url": "upi://pay?pa=...&am=500.00&tr=pay_wallet_001"
}
```

---

## Summary: API Count by Screen

| Screen | API Calls Required |
|--------|--------------------|
| PhoneLogin | 1 (send-otp) |
| OTPVerification | 1 (verify-otp) |
| UserInfoForm | 1 (complete-profile) |
| HomeScreen | 1 (home/feed) |
| AllServicesScreen | 1 (services list) |
| ServiceBookingScreen | 2 (service detail + available slots) |
| ReviewBookingScreen | 1 (booking preview) |
| ApplyCouponScreen | 2 (list coupons + validate) |
| ArrivalChargesScreen | 0 (data from ReviewBookingScreen) |
| PaymentScreen | 3 (create booking + poll status + initiate/confirm payment) |
| BookingTrackScreen | 2 (track poll + cancel) |
| OTPModal | 1 (verify-start-otp) |
| JobDetailsScreen | 3 (get job + add extra work + verify-complete-otp) |
| InvoiceScreen | 1 (get invoice) |
| FeedbackScreen | 1 (submit feedback) |
| MyBookingsScreen | 1 (list bookings) |
| AddressesScreen | 3 (list + delete + set default) |
| LocationPickerScreen | 2 (reverse geocode + add/update address) |
| NotificationList | 2 (list + mark read) |
| ReferToEarnScreen | 1 (referral info) |
| ProfileSettingsScreen | 2 (get profile + update profile) |
| AppNavigator (global) | 1 (update FCM token) |
| Auth (global) | 2 (refresh token + logout) |
| **Total distinct endpoints** | **~30** |
