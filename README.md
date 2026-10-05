# UTM Manager — Digital Marketing Agency Tracking Platform

A full-stack web application designed for digital marketing teams to create, normalize, manage, validate, and organize UTM tracking URLs for multi-channel marketing campaigns.

---

## 1. Project Overview

UTM Manager provides marketing teams with a centralized, professional workspace to generate standard-compliant UTM tracking links without spreadsheet chaos or human formatting errors.

### Core Capabilities:
- **Clean Authentication**: Register and login with secure JWT tokens and bcrypt password hashing.
- **Agency Dashboard**: Overview cards showing Total Links, Links This Month, and Unique Campaigns.
- **UTM Builder & Normalizer**: Real-time URL normalization with strict formatting rules (lowercasing, underscore substitution, removing invalid characters, deduplicating underscores, and trimming).
- **Search & Multi-Filter**: Filter links by marketing source (Facebook, Google, LinkedIn, etc.) or medium (Paid Social, CPC, Email, etc.), with full-text search across campaigns.
- **Link Inspector**: Dedicated modal with a complete parameter breakdown, one-click copy feedback, and instant live URL testing.
- **Safety**: Deletion confirmation modals prevent accidental removal of active campaign URLs.

---

## 2. Tech Stack

### Frontend
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Vite**

### Backend
- **Node.js**
- **Express**
- **TypeScript**
- **JWT (jsonwebtoken)** for stateless authentication
- **bcryptjs** for secure password hashing

### Database & ORM
- **PostgreSQL**
- **Prisma ORM** (with migrations and typed models)
- Seamless JSON persistence fallback engine for zero-friction local/offline execution

---

## 3. Folder Structure

```text
utm-manager/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   │   └── 20261005_init/
│   │   │       └── migration.sql       # Initial PostgreSQL DDL migration
│   │   └── schema.prisma               # Prisma models (User & CampaignLink)
│   ├── src/
│   │   ├── config/                     # Configuration and environment loaders
│   │   ├── controllers/                # Auth & Link route controllers
│   │   │   ├── authController.ts
│   │   │   └── linkController.ts
│   │   ├── middleware/                 # JWT authentication middleware
│   │   │   └── auth.ts
│   │   ├── routes/                     # Express API route declarations
│   │   │   ├── authRoutes.ts
│   │   │   └── linkRoutes.ts
│   │   ├── services/                   # Database service layer
│   │   │   └── db.ts
│   │   ├── types/                      # Shared backend interfaces
│   │   │   └── index.ts
│   │   ├── utils/                      # Pure UTM normalizer & URL builder
│   │   │   └── utmNormalizer.ts
│   │   ├── app.ts                      # Express application factory
│   │   └── server.ts                   # Standalone backend server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/                 # UI components
│   │   │   ├── CreateLinkForm.tsx      # UTM builder form with live preview
│   │   │   ├── DeleteConfirmModal.tsx  # Confirmation modal
│   │   │   ├── Header.tsx              # Agency navigation & branding
│   │   │   ├── LinkDetailsModal.tsx    # UTM breakdown & inspector
│   │   │   ├── LinksTable.tsx          # Filterable & searchable table
│   │   │   ├── StatsCards.tsx          # Key metrics summary
│   │   │   └── Toast.tsx               # Feedback notifications
│   │   ├── context/
│   │   │   └── AuthContext.tsx         # User authentication state
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx       # Main analytics & links dashboard
│   │   │   ├── LoginPage.tsx           # Agency sign-in
│   │   │   └── RegisterPage.tsx        # Agency registration
│   │   ├── services/
│   │   │   └── api.ts                  # Typed HTTP client & token handling
│   │   ├── utils/
│   │   │   └── utm.ts                  # Client-side UTM normalization
│   │   ├── types.ts                    # Frontend interfaces
│   │   ├── App.tsx                     # Top-level view controller
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server.ts                           # Unified full-stack development entry point
├── package.json
└── README.md
```

---

## 4. Environment Setup

Copy `.env.example` in `backend/` or at the root:

```bash
cp backend/.env.example backend/.env
```

Configure your environment variables:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/utm_manager?schema=public"
JWT_SECRET="utm_manager_super_secret_jwt_key_2026_dev_agency_token"
JWT_EXPIRES_IN="7d"
```

For the frontend (`frontend/.env`):

```env
VITE_API_URL=http://localhost:5000
```

---

## 5. Database Setup

1. Start your local PostgreSQL server or provision a cloud instance.
2. Create a database named `utm_manager`:

```sql
CREATE DATABASE utm_manager;
```

3. Ensure the `DATABASE_URL` in your `.env` file points to your PostgreSQL instance:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/utm_manager?schema=public"
```

---

## 6. Migration Commands

Navigate to the `backend` folder and run:

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Apply migrations to PostgreSQL
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio database viewer
npx prisma studio
```

---

## 7. How to Start Backend

To run the backend server independently:

```bash
cd backend
npm install
npm run dev
```

The backend API will start at: `http://localhost:5000` (or the configured `PORT`).

---

## 8. How to Start Frontend

To run the frontend React application independently:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at: `http://localhost:5173`. Requests to `/api/*` will automatically proxy to the backend at `http://localhost:5000`.

### Running in Unified Full-Stack Mode:
You can also launch the integrated full-stack server from the root directory:

```bash
npm install
npm run dev
```

---

## 9. API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Log in with credentials (`email`, `password`) | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer Token) |

### Campaign Links

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/links` | Create and save a new normalized UTM campaign link | Yes (Bearer Token) |
| `GET` | `/api/links` | List campaign links (supports `?search=`, `?source=`, `?medium=`) | Yes (Bearer Token) |
| `GET` | `/api/links/stats` | Retrieve metrics (`totalLinks`, `linksThisMonth`, `uniqueCampaigns`) | Yes (Bearer Token) |
| `GET` | `/api/links/:id` | Get details of a single campaign link | Yes (Bearer Token) |
| `DELETE` | `/api/links/:id` | Delete a saved campaign link | Yes (Bearer Token) |

---

## UTM Normalization Rules Reference

All UTM parameters are normalized through the following deterministic pipeline:
1. **Lowercase**: Converts all characters to lowercase (`Facebook` -> `facebook`).
2. **Underscores**: Converts spaces, tabs, and hyphens into underscores (`Paid Social` -> `paid_social`).
3. **Special Character Stripping**: Strips invalid symbols while preserving `[a-z0-9_]`.
4. **Deduplication**: Collapses consecutive underscores (`sale___2026` -> `sale_2026`).
5. **Trimming**: Strips leading and trailing underscores and spaces.
6. **URL Safety**: Parameters are encoded into the URL using standard `URLSearchParams` without damaging existing query parameters on the landing page.
