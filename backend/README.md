# INDIA P.L. — Production Operations & Dispatch Backend API

Enterprise-grade REST API backend and automated GPS dispatch engine powering the **INDIA P.L.** Operations Platform.

This backend was built specifically to fulfill **100% of the API contract** expected by the INDIA P.L. Admin & Dispatch frontend (`src/services/api.ts`), requiring **zero code modifications** to the frontend application.

---

## 🌟 Key Features

1. **Autonomous GPS Worker Assignment Engine**:
   - High-precision **Haversine formula** spherical distance calculations (\(R = 6371\text{ km}\)).
   - Multi-factor candidate scoring: Distance weight (50%), Worker Rating (30%), Completion Rate (20%).
   - Dynamic 15km service radius with fallback expansion up to 30km.
   - Skill-matching verification & real-time dispatch audit trail logging.
   - Cascading re-assignment if a worker rejects or dispatch window expires.

2. **Real-time Analytics & Calculations Engine**:
   - Zero-lag metrics computation: Today's revenue, active bookings, unassigned queue, active workers, customer satisfaction.
   - 7-day rolling performance chart data generation with Day-of-Week labels.
   - Dynamic worker rating recalculation based on verified customer review submissions.
   - Payout settlement calculations (Approved, Pending Review, Processing, Paid).

3. **Complete Out-of-the-Box Persistence**:
   - JSON file-backed ACID-like store (`data/database.json`) seeded with realistic Bhubaneswar / Odisha operations data.
   - Zero database installation required (no MongoDB or PostgreSQL setup needed to run immediately).
   - Easily swappable for MongoDB / PostgreSQL via the repository/store pattern.

4. **Security & Role-Based Access Control**:
   - JWT authentication (`7d` token validity).
   - Bearer token authentication middleware with optional bypass for dev tooling.
   - Configurable CORS whitelist for Vite/React dev and production domains.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm** or **pnpm** or **yarn**

### 2. Installation
Navigate into the `backend/` directory and install dependencies:
```bash
cd backend
npm install
```

### 3. Environment Configuration
The repository includes a ready-to-use `.env` file. You can adjust settings if needed:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=india_pl_super_secret_jwt_key_2026_operations_secure
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
DATA_FILE_PATH=./data/database.json
```

### 4. Running the Backend

#### Development Mode (with Hot Reload):
```bash
npm run dev
```
The server will start at: `http://localhost:5000`

#### Production Build:
```bash
npm run build
npm start
```

#### Reset / Seed Database:
To restore the database to its pristine demo state with workers, bookings, and services:
```bash
npm run seed
```

---

## 🔗 Connecting the Frontend to this Backend

The INDIA P.L. frontend already has built-in dynamic API switching! 

To connect the frontend to this live backend:

1. In the root directory of the project, create or edit `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_USE_MOCK_FALLBACK=false
   ```
2. Start or restart the frontend Vite server:
   ```bash
   npm run dev
   ```
3. When you open the frontend, the UI will automatically connect directly to `http://localhost:5000` for all operations!

*(If `VITE_API_BASE_URL` is omitted, the frontend automatically falls back to in-memory mock mode without throwing errors).*

---

## 📡 API Endpoints Overview

### Health & System
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server uptime and health status |
| `GET` | `/` | API overview and index |

### Authentication (`/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/admin/login` | Login with email or phone + password |
| `GET` | `/auth/admin/me` | Fetch authenticated admin profile (Bearer token) |
| `POST` | `/auth/admin/logout` | Revoke session |

**Default Admin Credentials**:
- **Email**: `admin@indiapl.com` (or phone: `+91 98765 00001`)
- **Password**: Any password in development (e.g. `admin123`)

---

### Dashboard & Analytics (`/dashboard`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard/metrics` | Real-time counts, revenue, and queue sizes |
| `GET` | `/dashboard/chart-trends` | 7-day rolling revenue and bookings data |

---

### Bookings (`/bookings`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/bookings` | List all bookings (supports `?status=...&search=...`) |
| `GET` | `/bookings/:id` | Get booking details with full dispatch logs |
| `POST` | `/bookings` | Create new booking |
| `PATCH` | `/bookings/:id/status` | Update status (`Confirmed`, `In-Progress`, `Completed`, `Cancelled`, etc.) |
| `POST` | `/bookings/:id/auto-dispatch` | **Trigger automated Haversine GPS dispatch** |
| `POST` | `/bookings/:id/worker-response` | Worker accepts or rejects booking (triggers cascade on reject) |

---

### Workers / Service Professionals (`/workers`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/workers` | List all service professionals with dynamic ratings |
| `GET` | `/workers/:id` | Get worker profile and verification status |
| `POST` | `/workers` | Register new service professional |
| `PUT` | `/workers/:id` | Update worker profile / skills / location |
| `PATCH` | `/workers/:id/toggle-availability` | Toggle online/offline status |
| `POST` | `/workers/:id/approve` | Approve worker KYC/onboarding |
| `POST` | `/workers/:id/reject` | Reject worker application |

---

### Customers (`/customers`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/customers` | List all registered customers |
| `GET` | `/customers/:id` | Get customer profile & booking history |
| `POST` | `/customers` | Create new customer profile |
| `PUT` | `/customers/:id` | Update customer profile |

---

### Services Catalog (`/services`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/services` | List all services with pricing and categories |
| `GET` | `/services/:id` | Get specific service details |
| `POST` | `/services` | Create new service item |
| `PUT` | `/services/:id` | Update service pricing or details |
| `DELETE` | `/services/:id` | Remove service from catalog |

---

### Payouts & Settlements (`/payouts`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/payouts` | List all payout requests |
| `GET` | `/payouts/metrics` | Dynamic payout breakdown (Pending, Processing, Settled) |
| `GET` | `/payouts/:id` | Get payout request details |
| `POST` | `/payouts` | Create new payout request |
| `POST` | `/payouts/:id/verify` | Verify bank / UPI credentials |
| `POST` | `/payouts/:id/approve` | Approve payout for settlement |
| `POST` | `/payouts/:id/reject` | Reject payout request |
| `POST` | `/payouts/:id/paid` | Mark payout as settled/paid |

---

### Customer Ratings & Feedback (`/ratings`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/ratings` | List all customer ratings |
| `GET` | `/ratings/worker/:workerId` | Get ratings for a specific worker |
| `POST` | `/ratings` | Submit review (auto-recalculates worker rating average) |

---

### Notifications & Alerts (`/notifications`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/notifications` | List operational alerts |
| `POST` | `/notifications` | Create custom alert |
| `PATCH` | `/notifications/:id/read` | Mark alert as read |
| `DELETE` | `/notifications` | Clear all notifications |

---

### Reports (`/reports`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/reports?range=7d` | Get aggregated reports analytics for `7d`, `30d`, or `90d` |

---

## 📁 Directory Architecture

```
backend/
├── .env                  # Environment variables
├── .env.example          # Environment template
├── package.json          # Node dependencies & scripts
├── tsconfig.json         # TypeScript configuration (NodeNext)
├── README.md             # This documentation
├── data/
│   └── database.json     # Auto-generated persistent JSON database
└── src/
    ├── server.ts         # Express server & middleware pipeline
    ├── config/
    │   └── env.ts        # Typed configuration loader
    ├── types/
    │   └── index.ts      # Shared TypeScript data contracts
    ├── data/
    │   ├── initialData.ts# High-fidelity seed records
    │   ├── store.ts      # ACID-like persistent file store
    │   └── seed.ts       # Database reset CLI script
    ├── middleware/
    │   ├── authMiddleware.ts # JWT authentication guard
    │   └── errorHandler.ts   # Centralized error formatter
    ├── services/
    │   ├── authService.ts    # Token generation & verification
    │   ├── calculationsService.ts # Real-time metrics & charts calculation
    │   └── gpsService.ts     # Haversine distance & dispatch ranker
    └── routes/
        ├── authRoutes.ts
        ├── bookingsRoutes.ts
        ├── customersRoutes.ts
        ├── dashboardRoutes.ts
        ├── notificationsRoutes.ts
        ├── payoutsRoutes.ts
        ├── ratingsRoutes.ts
        ├── reportsRoutes.ts
        ├── servicesRoutes.ts
        └── workersRoutes.ts
```

---

## 🛡️ Production Readiness

1. **CORS Protected**: Configured for specified origins with credential support.
2. **Error Handling**: Graceful error handling for missing IDs, malformed JSON, and server crashes.
3. **Stateless Operations**: Calculations are derived dynamically from records to eliminate race conditions.
4. **Database Agnostic**: The `store.ts` file isolates storage logic, allowing direct migration to MongoDB Mongoose or PostgreSQL Prisma with zero route changes.
