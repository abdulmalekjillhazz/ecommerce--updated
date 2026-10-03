# E-Commerce Platform — Fast Execution Guide (`RUN_GUIDE.md`)

This guide explains the architectural diagnosis of your previous setup, how the new decoupled architecture resolves every problem, and exact step-by-step instructions to run the **Node.js Express Server on Port 5000** and the **Next.js 14 Client on Port 3000**.

---

## 1. Architectural Diagnosis & What Went Wrong Previously

### The Root Problems Identified:
1. **Incomplete Migration & Missing Endpoints**:
   - The previous project attempted to migrate an Express backend into Next.js App Router route handlers (`app/api/v1/`). However, only partial `auth` and `products` routes were ported.
   - **Cart (`/api/v1/cart/*`)**, **Order (`/api/v1/orders/*`)**, and **Payment (`/api/v1/payments/*`)** route handlers were missing, causing frontend API calls to fail.
   - The legacy `server-backend/` was left lingering in the repository, creating confusion about which backend was authoritative.
2. **Build & Deployment Failures**:
   - Vercel deployments failed with project build errors because Next.js route handlers attempted to initialize database connections without proper environment safeguards during static build generation.
3. **Port & Cookie Conflicts**:
   - Running client and server together without strict port boundaries created session cookie domain mismatches and CORS errors.
4. **Unrealistic Products & Inadequate Admin Panel**:
   - Products were generic placeholders without authentic tech specifications, SKUs, inventory counts, high-resolution media, or verified customer reviews.
   - The Admin area lacked operational tools: no real-time revenue KPIs, no order status lifecycle transition, and no inventory re-stock warnings.
5. **SEO Shortcomings**:
   - Heavy client-side rendering (`"use client"`) bypassed Next.js Server-Side Rendering (SSR), missing dynamic OpenGraph tags, JSON-LD Schema.org product markup, automated `sitemap.xml`, and `robots.txt`.

---

## 2. The Solution: Modern Decoupled Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      SHOPPING BROWSER                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               │                               │
        Port 3000 (HTTP)                Port 5000 (REST)
               │                               │
               v                               v
┌──────────────────────────────┐ ┌──────────────────────────────┐
│        NEXT.JS CLIENT        │ │     EXPRESS REST SERVER      │
│     (App Router, SSR, SEO)   │ │  (JWT Auth, Cart, Orders)    │
│                              │ │                              │
│ • Customer Storefront        │ │ • CORS with Credentials      │
│ • Dynamic Metadata & JSON-LD │ │ • httpOnly Secure Cookies    │
│ • Dedicated /admin Portal    │ │ • RBAC (Admin vs Customer)   │
│ • Zustand Cart & Auth Stores │ │ • Mongoose Models (MongoDB)  │
└──────────────────────────────┘ └──────────────┬───────────────┘
                                                │
                                                v
                                 ┌──────────────────────────────┐
                                 │       MONGODB DATABASE       │
                                 │  Users • Products • Orders   │
                                 │       Carts • Reviews        │
                                 └──────────────────────────────┘
```

- **Server (`server/`)**: Runs independently on **Port 5000**. Provides robust REST API endpoints (`/api/v1/...`), MongoDB Mongoose models, bcrypt password hashing, and JWT tokens delivered via `httpOnly` secure cookies.
- **Client (`client/`)**: Runs independently on **Port 3000**. Built with **Next.js 14 App Router**, Tailwind CSS, Lucide icons, and Zustand state management. Features complete server-side rendered SEO product pages, JSON-LD rich snippets, dynamic sitemap, and a dedicated `/admin` management suite.

---

## 3. Directory Structure

```
├── client/                     # Next.js 14 Frontend Application (Port 3000)
│   ├── app/
│   │   ├── admin/              # Dedicated Admin Portal
│   │   │   ├── layout.jsx      # Admin Layout with RBAC guard & Sidebar
│   │   │   ├── page.jsx        # Admin Dashboard with KPI analytics
│   │   │   ├── products/       # Product Inventory Manager & CRUD
│   │   │   └── orders/         # Order Status Lifecycle Manager
│   │   ├── cart/               # Full Shopping Cart with shipping progress
│   │   ├── checkout/           # Multi-step checkout with COD / Card
│   │   ├── login/              # Sign in with One-Click Demo Credentials
│   │   ├── register/           # Customer registration
│   │   ├── orders/             # Customer order history & tracking
│   │   │   └── [id]/           # Order timeline & delivery details
│   │   ├── products/           # Product Catalog (Search, Filter, Sort)
│   │   │   └── [slug]/         # Product Detail (SSR, SEO Metadata, JSON-LD)
│   │   ├── layout.jsx          # Root Layout (Navbar, Footer, CartDrawer)
│   │   ├── page.jsx            # Modern, high-converting Homepage
│   │   ├── robots.js           # SEO robots.txt generator
│   │   └── sitemap.js          # Dynamic sitemap.xml generator
│   ├── components/             # Reusable UI components
│   ├── lib/api.js              # Central Axios instance with credentials
│   ├── store/                  # Zustand state stores (Auth, Cart)
│   ├── .env.local              # Client environment variables
│   └── package.json            # Scripts configured with -p 3000
│
├── server/                     # Node.js + Express REST API (Port 5000)
│   ├── src/
│   │   ├── config/             # Database (Mongoose) & Server config
│   │   ├── controllers/        # Auth, Product, Cart, Order, Admin controllers
│   │   ├── middleware/         # Auth, RBAC, error handling, 404
│   │   ├── models/             # User, Product, Order, Cart, Review
│   │   ├── routes/             # Versioned API routes (/api/v1/...)
│   │   ├── seed/               # Realistic seed dataset & automated seeder
│   │   ├── utils/              # ApiError, ApiResponse, asyncHandler, tokens
│   │   ├── app.js              # Express app with CORS & Helmet
│   │   └── server.js           # Server listener on Port 5000
│   ├── .env                    # Server environment variables
│   └── package.json            # Scripts & dependencies
│
├── README.md                   # Full documentation & architecture manual
├── RUN_GUIDE.md                # Fast execution guide (this file)
└── package.json                # Root package for concurrent multi-process execution
```

---

## 4. Pre-configured Demo Accounts

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Store Administrator** | `admin@store.com` | `Admin@12345` | Full access to `/admin` dashboard, product inventory CRUD, and order status updates |
| **Verified Customer** | `customer@store.com` | `Customer@12345` | Customer catalog browsing, cart, checkout, reviews, and order tracking |

> **Convenience Feature**: On the `/login` page, click the **"Demo Admin"** or **"Demo Customer"** button to automatically populate credentials and sign in instantly.

---

## 5. Step-by-Step Setup & Running Guide

### Step 1: Verify Environment Files

The required `.env` files are already pre-configured for local execution:

#### `server/.env` (Port 5000):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/ecommerce_db
JWT_ACCESS_SECRET=ecommerce_access_secret_key_32chars_super_safe_token
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=ecommerce_refresh_secret_key_32chars_super_safe_token
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SAME_SITE=lax
COOKIE_DOMAIN=localhost
```
*(If using MongoDB Atlas in cloud, paste your connection string into `MONGODB_URI`)*.

#### `client/.env.local` (Port 3000):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CURRENCY=$
```

---

### Step 2: Install Dependencies

From the project root:
```bash
# Install root, server, and client dependencies simultaneously:
npm run install:all
```
*Or manually in each folder:*
```bash
cd server && npm install
cd ../client && npm install
```

---

### Step 3: Seed Database with Realistic Products

Run the automated seeder to populate the MongoDB database with realistic consumer electronics (Sony WH-1000XM5, AirPods Pro 2, Apple Watch Series 9, Keychron Q1 Pro, Logitech MX Master 3S, Sony A7 IV camera, etc.):

```bash
# From project root:
npm run seed:server

# Or directly inside server/:
cd server
npm run seed
```

Output confirmation:
```text
✅ Database seeded successfully with realistic data!
👤 Admin Account   : admin@store.com / Admin@12345
👤 Customer Account: customer@store.com / Customer@12345
📦 Products Seeded : 8 Realistic Hardware Items
```

---

### Step 4: Run the Application

#### Option A: One-Command Concurrent Runner (Recommended)
From the root directory:
```bash
npm run dev
```
*This uses `concurrently` to boot the Server on Port 5000 and the Client on Port 3000 in a single terminal window with color-coded logs.*

#### Option B: Dual Terminal Windows (Manual)
**Terminal 1 (Backend Server on Port 5000):**
```bash
cd server
npm run dev
```
*Console output:*
```text
🚀 E-Commerce API Server running in development mode
📡 Listening on PORT: http://localhost:5000
🔗 Connected Client Origin: http://localhost:3000
🩺 Health check: http://localhost:5000/api/v1/health
```

**Terminal 2 (Next.js Client on Port 3000):**
```bash
cd client
npm run dev
```
*Console output:*
```text
▲ Next.js 14.2.3
- Local: http://localhost:3000
- Port:  3000
```

---

## 6. Accessing the Application

- **Customer Storefront**: Open [http://localhost:3000](http://localhost:3000)
- **Product Catalog**: Open [http://localhost:3000/products](http://localhost:3000/products)
- **Admin Center**: Open [http://localhost:3000/admin](http://localhost:3000/admin)
- **Backend Health Check**: Open [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 7. REST API Endpoints Overview (Port 5000)

| Module | Method | Endpoint | Access | Purpose |
|---|---|---|---|---|
| **Health** | `GET` | `/api/v1/health` | Public | Server status & uptime check |
| **Auth** | `POST` | `/api/v1/auth/register` | Public | Register new user with httpOnly cookies |
| **Auth** | `POST` | `/api/v1/auth/login` | Public | Authenticate user & issue token pair |
| **Auth** | `POST` | `/api/v1/auth/logout` | Protected | Clear cookies & invalidate refresh token |
| **Auth** | `GET` | `/api/v1/auth/me` | Protected | Hydrate user session from cookie |
| **Auth** | `POST` | `/api/v1/auth/refresh-token` | Public (Cookie) | Rotate JWT tokens automatically |
| **Products**| `GET` | `/api/v1/products` | Public | Catalog with search, filters, pagination |
| **Products**| `GET` | `/api/v1/products/categories` | Public | Distinct categories with counts |
| **Products**| `GET` | `/api/v1/products/:idOrSlug` | Public | Product details by slug or ID |
| **Products**| `POST` | `/api/v1/products/:id/reviews`| Protected | Add verified customer review |
| **Products**| `POST` | `/api/v1/products` | Admin | Create product with SKU & specs |
| **Products**| `PUT` | `/api/v1/products/:id` | Admin | Update pricing, stock, or SEO metadata |
| **Products**| `DELETE`| `/api/v1/products/:id` | Admin | Soft-delete / deactivate product |
| **Cart** | `GET` | `/api/v1/cart` | Protected | Get user database cart |
| **Cart** | `PUT` | `/api/v1/cart/sync` | Protected | Sync local cart to database |
| **Cart** | `POST` | `/api/v1/cart/merge` | Protected | Merge guest cart after login |
| **Orders** | `POST` | `/api/v1/orders` | Protected | Place order with stock verification |
| **Orders** | `GET` | `/api/v1/orders/mine` | Protected | Customer order history |
| **Orders** | `GET` | `/api/v1/orders/:id` | Protected | Order details & tracking status |
| **Orders** | `GET` | `/api/v1/orders` | Admin | List all store orders with filters |
| **Orders** | `PUT` | `/api/v1/orders/:id/status` | Admin | Update status (Pending, Shipped, etc.) |
| **Admin** | `GET` | `/api/v1/admin/analytics` | Admin | Dashboard revenue, KPIs & inventory alerts |

---

## 8. SEO Features Built-In

1. **Dynamic Metadata (`generateMetadata`)**:
   - Each product detail page dynamically computes custom `<title>`, `<meta description>`, and `<meta keywords>` based on the product data.
2. **OpenGraph & Twitter Card Tags**:
   - Social preview cards generated with image dimensions (1200x630) for Twitter, Facebook, and LinkedIn shares.
3. **Schema.org Structured Data (JSON-LD)**:
   - Homepage embeds `OnlineStore` and `WebSite` Schema.
   - Product pages embed Schema.org `Product`, `Offer`, `AggregateRating`, and `Brand` for Google Search Rich Snippets.
4. **Automated Search Crawlers**:
   - `app/robots.js` allows search engines to index products while protecting `/admin/` and private customer routes.
   - `app/sitemap.js` dynamically generates XML sitemap including all live product slugs fetched from the API.
