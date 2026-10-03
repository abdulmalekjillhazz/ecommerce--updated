# ShopSphere — Decoupled Full-Stack E-Commerce Platform

[![Next.js 14](https://img.shields.io/badge/Client-Next.js%2014%20(Port%203000)-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Node.js Express](https://img.shields.io/badge/Server-Node.js%20Express%20(Port%205000)-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB Mongoose](https://img.shields.io/badge/Database-MongoDB%20Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://mongoosejs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A modern, production-ready full-stack e-commerce platform built with a decoupled architecture:
- **Client (Port 3000)**: Next.js 14 App Router with Server-Side Rendering (SSR), full Search Engine Optimization (SEO), rich Schema.org JSON-LD structured data, responsive mobile-first UI, and an actionable **Admin Center**.
- **Server (Port 5000)**: Node.js + Express REST API with MongoDB Mongoose ODM, JWT authentication with secure httpOnly cookies, CORS with credentials, and role-based access control.

---

## 🚀 Key System Highlights

### 1. Distinct Port Architecture
- **Port 5000**: Dedicated REST API backend handling business logic, database queries, inventory management, and authentication.
- **Port 3000**: Next.js 14 customer storefront and administrator dashboard with zero port collisions and clear separation of concerns.

### 2. Realistic Product Catalog & Seed Dataset
- Includes real, detailed consumer hardware (Sony WH-1000XM5, AirPods Pro 2, Apple Watch Series 9, Keychron Q1 Pro mechanical keyboard, Logitech MX Master 3S, Sony A7 IV camera).
- Real technical specifications (Battery life, dimensions, sensors, connectivity), realistic pricing, and verified reviews.

### 3. Actionable Admin Portal (`/admin`)
- **Executive Analytics Dashboard**: Real-time revenue KPIs, total volume, pending/processing/shipped/delivered breakdown, and low stock inventory alerts.
- **Product Inventory Manager**: Add, edit, restock, and deactivate products with instant server synchronization.
- **Order Processing Workflow**: Track customer delivery addresses, toggle statuses (`Pending` &rarr; `Processing` &rarr; `Shipped` &rarr; `Delivered`), and record courier tracking numbers.

### 4. Advanced SEO & Discovery
- Dynamic metadata generation (`generateMetadata`) on all product pages.
- Embedded JSON-LD schema markup (`OnlineStore`, `Product`, `AggregateRating`, `Offer`) for Google Search rich cards.
- Automated `robots.txt` (`app/robots.js`) and dynamic `sitemap.xml` (`app/sitemap.js`).

---

## 🛠️ Quick Commands

```bash
# 1. Install all dependencies
npm run install:all

# 2. Seed realistic products and test users
npm run seed:server

# 3. Start both Client (Port 3000) & Server (Port 5000) simultaneously
npm run dev
```

For complete instructions, problem diagnosis, and API reference, please consult [RUN_GUIDE.md](./RUN_GUIDE.md).
