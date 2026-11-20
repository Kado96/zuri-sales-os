# ZURI Sales OS — Commercial Operating System & Field Intelligence

> **Integrated Commercial Management, Real-Time GPS Routing & Data Analytics Platform**  
> Custom-engineered for **ZAHARA INDUSTRIES SPRL** (Bujumbura, Burundi)  
> Live Demonstration: [https://zuri-sales-os.vercel.app](https://zuri-sales-os.vercel.app)

---

## 🌟 Executive System Overview

**ZURI Sales OS** is an enterprise-grade commercial operating platform built to empower the sales force and executive leadership of **Zahara Industries SPRL** across Burundi (Bujumbura and nationwide provinces).

It unifies B2B wholesale relationship management, field prospecting with verified on-site GPS check-ins, real-time inventory governance to eliminate injection-molding stockouts, and a **Bilingual AI Conversational Guide & Analyst** embedded directly into the workspace to onboard users and interpret business KPIs.

---

## 📱 Core Modules & Key Features

### 1. 📊 Executive Strategic Dashboard (`/`)
* **Executive Metrics:** Real-time visibility into monthly revenue, sales quota attainment (35M BIF target), and pending fulfillment orders.
* **14-Day Sales Velocity:** Trailing interactive charts tracking volume surges and weekly market-day trends.
* **Burundi Interactive Map:** Spatial distribution of wholesale partners powered by Leaflet & OpenStreetMap.
* **Precision Global Time Filter:** Dynamic recalculation across last 15m, 30m, 1h, 24h span, 7d, 30d, monthly, yearly, or custom minute-level date ranges.

### 2. 👥 Client CRM & Commercial Portfolio (`/clients`)
* **Central Directory:** Comprehensive accounts for Wholesalers, Distributors, Retailers, and Hardware stores.
* **Verified GPS Coordinates:** Instant one-click acquisition of precise device coordinates.
* **Turn-by-Turn Navigation:** One-tap **"S'y rendre / Navigate"** launcher opening destination routes directly in Google Maps.
* **RFM Category Tiers:** Clear visual categorization (VIP Account, Regular, New Lead, At Risk / To Re-activate).
* **Full CRUD Operations:** Add, inspect, modify, or safely remove client accounts with confirmation dialogs.

### 3. 🎯 Prospecting & Sales Pipeline (`/pipeline`)
* **Visual Kanban Lifecycle:** Sequential deal progression: `Nouveau → Contacté → RDV planifié → Intéressé → Devis envoyé → Négociation → Gagné / Perdu`.
* **Lead Inspection Modal:** Click any card to inspect deal parameters, assigned representatives, and detailed product requirements.
* **Custom Description & Requirements:** Capture specific model volumes, requested color variants, and delivery timelines.
* **Automated Win Conversion:** Deals marked **"Gagné"** automatically register as active clients in the CRM.
* **Predictive Win Scoring:** Machine-learning-inspired probability score (0 to 100) factoring deal volume and acquisition channel trust.

### 4. 📦 ZURI Catalog & Margin Engineering (`/produits`)
* **Molded Plastics Portfolio:** Ghajini (27L), Tusker (40L), Titanic (70L), Utility Buckets (5L/10L/20L), Pogo basins.
* **Price Governance & Margins:** Factory unit costs, distributor prices, wholesale pricing, and automated gross profit margins.
* **Item Management:** Complete catalog reference editing and inventory tracking.

### 5. 🛒 Sales & Order Processing (`/ventes`)
* **Quotes & Proformas:** Multi-line quotation generator formatted for clean single-click printing or PDF export.
* **Role-Governed Discount Ceilings:** Enforced discount authority limits (Field Rep: 3%, Sales Officer: 10%, Executive: 100%).
* **Fulfillment Pipeline:** Sequential states from quotation through dispatch, invoicing, and verified payment collection.
* **Real-time Atomic Deductions:** Immediate inventory subtraction upon shipment authorization.

### 6. 🏭 Inventory & Stockout Prevention (`/stocks`)
* **Stockout Early Warning:** Real-time monitoring of available floor stock versus reserved units tied to pending orders.
* **Days of Cover (DOC):** Algorithmic runway metric indicating remaining inventory days at current consumption velocity.
* **Replenishment Recommendations:** Automated calculation of optimal reorder batches to prevent factory mold downtime.

### 7. 📍 Field Operations & GPS Check-in (`/terrain`)
* **Route Scheduling:** Centralized assignment of daily client visits across municipal and provincial territories.
* **Verified GPS Check-In:** Validates physical rep presence on-site with tamper-proof timestamps and coordinates.
* **Meeting Debriefs:** Direct logging of discussions, future orders, and customer feedback for management review.

### 8. 🤖 Bilingual AI Guide & Analyst Chatbot
* **Floating Interactive Widget:** Always accessible at the bottom-right of every application screen.
* **Full English / French Bilingualism:** Switches dynamically in real time to match the application's global language setting (`FR / EN`).
* **Operational Tutor & Data Analyst:** Guides new reps step-by-step through every feature and demystifies algorithmic insights (Lead scoring, sales regression, spatial delivery clustering).

---

## 🛠️ Architecture & Technology Stack

* **Frontend:** React 19, TypeScript, Vite 8, TanStack Start & Router.
* **Styling & Components:** Tailwind CSS 4, Radix UI, Lucide Icons, Recharts.
* **Mapping Engine:** Leaflet & OpenStreetMap with full responsive mobile support.
* **Native Mobile Runtime:** Capacitor 8 (Production-ready Android native wrapper with fine location and network privileges).
* **Cloud & CI/CD:** Vercel (Automated zero-downtime continuous deployment tracking GitHub `main`).

---

## 🚀 Getting Started & Local Setup

```powershell
# Clone the repository
git clone https://github.com/Kado96/zuri-sales-os.git
cd "zuri-sales-os"

# Install project dependencies
bun install

# Run development server
bun run dev
```

### Production Build & Native Mobile Sync
```powershell
# Build web production bundle
bun run build

# Synchronize Android native platform
npx cap sync android

# Launch in Android Studio to build the signed APK
npx cap open android
```

---

## 👤 Candidate Profile & Developer
**Donald KANDEKE**  
*Sales Operations Specialist & Data Commercial Lead*  
Bujumbura, Burundi  
📞 (+257) 66 324 968 | 💬 WhatsApp: (+257) 79 928 864  
✉️ kandekedonald@gmail.com  
🐙 [github.com/Kado96](https://github.com/Kado96)
