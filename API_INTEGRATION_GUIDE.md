# INDIA P.L. — Backend API Integration Guide

This document outlines how the **INDIA P.L. Admin & Operations Web Dashboard** is architected to seamlessly connect with your real backend API.

---

## ⚡ How It Works

1. **Environment Configuration**:
   The frontend connects to your backend via the `VITE_API_BASE_URL` environment variable defined in `.env`:
   ```bash
   # In .env:
   VITE_API_BASE_URL=https://api.yourdomain.com/v1
   VITE_USE_MOCK_FALLBACK=false
   ```
2. **Dynamic Live Fallback**:
   - If `VITE_API_BASE_URL` is empty, the application runs on its dynamic client-side store with real-time math engines, localStorage persistence, and Haversine GPS calculations.
   - Once you paste your backend server URL into `.env`, the frontend automatically sends HTTP requests to your API.
3. **Authentication**:
   - All authenticated requests automatically include the JWT Bearer token in the `Authorization` header:
     ```http
     Authorization: Bearer <token>
     ```

---

## 📡 REST API Endpoint Specifications

All endpoints communicate via JSON (`Content-Type: application/json`).

### 1. Authentication
- `POST /auth/admin/login`
  - **Body**: `{ "identifier": "admin@indiapl.com", "password": "..." }`
  - **Response**: `{ "user": { "id": "...", "name": "...", "email": "...", "role": "Super Admin" }, "token": "jwt_token_here" }`
- `POST /auth/admin/logout`
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: `{ "success": true }`

---

### 2. Dashboard Analytics
- `GET /dashboard/metrics`
  - **Response**:
    ```json
    {
      "totalBookings": 125,
      "todayBookings": 18,
      "activeWorkers": 32,
      "totalCustomers": 486,
      "gmv": 45000,
      "cancellationRate": 4.8
    }
    ```
- `GET /dashboard/chart-trends`
  - **Response** (7 days, Sunday to Saturday):
    ```json
    [
      { "day": "Sun", "bookings": 18, "gmv": 5300 },
      { "day": "Mon", "bookings": 14, "gmv": 4200 },
      { "day": "Tue", "bookings": 19, "gmv": 5800 },
      { "day": "Wed", "bookings": 16, "gmv": 4900 },
      { "day": "Thu", "bookings": 22, "gmv": 6800 },
      { "day": "Fri", "bookings": 25, "gmv": 8100 },
      { "day": "Sat", "bookings": 31, "gmv": 9900 }
    ]
    ```

---

### 3. Bookings & GPS Dispatch
- `GET /bookings`
  - Query parameters: `status`, `search`, `page`, `limit`
  - **Response**: `Booking[]`
- `GET /bookings/:id`
  - **Response**: `Booking`
- `POST /bookings`
  - **Body**: Partial booking data from mobile app or admin simulator.
  - **Response**: `Booking`
- `PATCH /bookings/:id/status`
  - **Body**: `{ "status": "Accepted" | "In Progress" | "Completed" | "Cancelled" }`
  - **Response**: Updated `Booking`
- `POST /bookings/:id/auto-dispatch`
  - Runs nearest-pro Haversine algorithm and notifies candidate.
  - **Response**: `{ "success": true, "message": "Pro notified", "worker": { ... }, "distance": 2.3 }`
- `POST /bookings/:id/worker-response`
  - **Body**: `{ "accepted": true }` or `{ "accepted": false }`
  - **Response**: `{ "success": true }` (If false, backend cascades to next nearest pro).

---

### 4. Workers / Pros
- `GET /workers`
  - Query parameters: `availability`, `status`, `verificationStatus`, `search`
  - **Response**: `Worker[]`
- `GET /workers/:id`
  - **Response**: `Worker` (Includes full KYC documents, GPS coordinates, rating).
- `PUT /workers/:id`
  - **Body**: Updated `Worker` object.
- `PATCH /workers/:id/toggle-availability`
  - Toggles between `Available`, `Busy`, and `Offline`.
  - **Response**: Updated `Worker`
- `POST /workers/:id/approve`
  - Verifies Pro KYC documents and activates account.
  - **Response**: Updated `Worker` with `verificationStatus: "Verified"` and `status: "Active"`.
- `POST /workers/:id/reject`
  - Declines application.

---

### 5. Customers
- `GET /customers`
  - Query parameters: `search`, `page`
  - **Response**: `Customer[]`
- `GET /customers/:id`
  - **Response**: `Customer` (Includes saved addresses from PDF and booking history).

---

### 6. Services Catalog (CRUD)
- `GET /services`
  - **Response**: `ServiceItem[]`
- `POST /services`
  - **Body**:
    ```json
    {
      "name": "Residential Cleaning",
      "category": "Cleaning",
      "description": "Clean Homes • Fresh Spaces • Happier Living",
      "price": 297,
      "originalPrice": 499,
      "durationMinutes": 180,
      "status": "Active",
      "image": "https://images.unsplash.com/..."
    }
    ```
- `PUT /services/:id`
  - Updates service item.
- `DELETE /services/:id`
  - Deletes or deactivates service.

---

### 7. Reports & Analytics
- `GET /reports?range=7d`
  - **Response**:
    ```json
    {
      "timeRange": "7d",
      "weeklyTrend": [
        { "label": "Sun", "bookings": 18, "revenue": 5300, "completed": 18, "cancelled": 0 },
        { "label": "Mon", "bookings": 14, "revenue": 4200, "completed": 13, "cancelled": 1 },
        ...
      ],
      "categoryBreakdown": [
        { "name": "Residential Cleaning", "share": 44, "amount": "₹19,800", "count": 18 },
        { "name": "Deep Cleaning", "share": 26, "amount": "₹11,700", "count": 12 },
        ...
      ],
      "metrics": { ... }
    }
    ```

---

### 8. Notifications
- `GET /notifications`
- `PATCH /notifications/:id/read`
- `DELETE /notifications`

---

## 🛠️ Code Location Reference

| Purpose | File Path |
|---|---|
| Unified API Client | [`src/services/api.ts`](file:///c:/Users/priya/Documents/GitHub/india_PL_Website/src/services/api.ts) |
| Dynamic Metric & Chart Engine | [`src/services/dataCalculations.ts`](file:///c:/Users/priya/Documents/GitHub/india_PL_Website/src/services/dataCalculations.ts) |
| Haversine GPS Matching Logic | [`src/services/gpsService.ts`](file:///c:/Users/priya/Documents/GitHub/india_PL_Website/src/services/gpsService.ts) |
| Global Reactive State & Sync | [`src/context/AppContext.tsx`](file:///c:/Users/priya/Documents/GitHub/india_PL_Website/src/context/AppContext.tsx) |
| TypeScript Schemas | [`src/types/index.ts`](file:///c:/Users/priya/Documents/GitHub/india_PL_Website/src/types/index.ts) |
| Environment Config | [`.env`](file:///c:/Users/priya/Documents/GitHub/india_PL_Website/.env) |
