# Industrial & Commercial Business Website and Admin Management System

A production-ready, full-stack, database-driven business website and administrative content management system. Designed for personal businesses selling **Digital Weighing Scales**, **Solar Power Systems**, **Commercial Water Purifiers**, and any future product lines **without requiring source code modifications**.

---

## 🌟 Key Capabilities & Features

### 1. 100% Dynamic & Scalable Architecture
- **Zero Hard-coded Products, Categories, or Specs**: New product lines (e.g. *Industrial Machines*, *Agricultural Equipment*) and new products (e.g. *ATOM Digital Weighing Scale*) are created, edited, and published directly through the admin dashboard.
- **Dynamic Key-Value Specifications**: Each product can have its own customized specifications (e.g. Capacity, Accuracy, Platform Size, Membrane, Flow Rate, Discharge, Warranty).
- **Flexible 4-Tier Pricing Options**:
  1. *Exact Price* (e.g. ₹8,500)
  2. *MRP + Selling Price* with automatic calculated % OFF discount badge
  3. *Contact for Price* (leads to direct enquiry / phone call)
  4. *Get a Quote* (ideal for custom turnkey or industrial equipment)

### 2. Customer-Facing Business Website
- **Modern Responsive Design**: Built with React 19, TypeScript, and Tailwind CSS. Optimized for mobile phones (Android & iOS), tablets, and desktop workstations.
- **Dynamic Product Catalogue**: Instant search by keywords (e.g. "ATOM", "weighing", "300kg", "solar", "purifier"), category filters, and sorting (price low-to-high, high-to-low, newest).
- **Product Details & Gallery**: Multi-image interactive gallery, dynamic technical specifications table, bullet features, stock availability badge, and related products carousel from the same category.
- **WhatsApp & Phone Integration**: Instant click-to-chat WhatsApp button with pre-filled product inquiries (`"Hello, I am interested in [Product Name]..."`) and mobile quick-action buttons.
- **Customer Quote & Enquiry Submissions**: Validate 10-digit Indian phone numbers and store inquiries directly into MongoDB.

### 3. Comprehensive Admin Management Portal (`/admin`)
- **Secure Authentication**: Protected admin routes, bcrypt password hashing, and secure JWT sessions.
- **Dashboard Overview**: Real-time business metrics (Total Products, Published Products, Categories, Featured Products, New Quotes) and recent customer submissions.
- **Product Management (`/admin/products`)**:
  - Add, edit, delete, activate/deactivate, and toggle featured products for the homepage.
  - Multi-image uploader connected directly to Cloudinary with primary image selector and deletion.
  - Specification presets for rapid data entry.
- **Category Management (`/admin/categories`)**:
  - Add new categories with image, description, and custom slugs.
  - Changes instantly update the public navbar, dropdowns, filter pills, and footer across the website.
- **Enquiry Management (`/admin/enquiries`)**:
  - View incoming quotation requests.
  - Direct 1-click actions: Call (`tel:`), WhatsApp (`wa.me`), and Email (`mailto:`).
  - Status management (`NEW`, `CONTACTED`, `COMPLETED`) with internal notes.
- **Business Profile Settings (`/admin/settings`)**:
  - Update Company Name, Logo, Phone, WhatsApp, Official Email, Physical Address, Business Hours, About Us text, and Google Maps embed without touching code.

### 4. Search Engine Optimization (SEO) & Google Deployment
- **Dynamic SEO Meta Tags**: Dynamic `<title>`, meta descriptions, canonical URLs, and Open Graph / Twitter Card tags on every product and category page via `react-helmet-async`.
- **Structured Data (Schema.org JSON-LD)**:
  - `Product` schema markup with name, image, brand, price in INR, and stock availability.
  - `LocalBusiness` / `Organization` schema markup for local Google ranking.
- **Automatic XML Sitemap (`/sitemap.xml`)**: Dynamically generated XML sitemap listing all published products, active categories, and static pages with `<lastmod>` timestamps.
- **Robots.txt (`/robots.txt`)**: Allows search bots to crawl public pages while safely disallowing private `/admin` routes.
- **Noindex Protection**: All admin pages are protected with `noindex, nofollow` meta tags.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, React Router, Lucide Icons, React Helmet Async, Axios |
| **Backend** | Node.js, Express.js, TypeScript, REST API, Helmet, CORS, Express Rate Limit |
| **Database** | MongoDB & Mongoose ODM (Compatible with MongoDB Atlas or local MongoDB) |
| **Image Storage** | Cloudinary v2 SDK + Multer (with built-in local disk fallback for dev) |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js, HTTP-Only Cookie support |

---

## 📁 Final Project Structure

```
business-website/
├── client/                      # Frontend Application (React + Vite + TS)
│   ├── public/                  # Favicon and static files
│   ├── src/
│   │   ├── assets/              # Icons and static resources
│   │   ├── components/
│   │   │   ├── common/          # Header, Footer, Badge, Skeleton, EmptyState, ConfirmDialog, FloatingCTA
│   │   │   ├── enquiry/         # EnquiryModal, EnquiryForm
│   │   │   ├── product/         # ProductCard, DynamicSpecs, ImageGallery, PriceDisplay
│   │   │   └── seo/             # SEOHead, SchemaMarkup (Product & Organization JSON-LD)
│   │   ├── context/
│   │   │   ├── AuthContext.tsx  # Admin authentication state
│   │   │   └── SettingsContext.tsx # Dynamic business settings and categories
│   │   ├── layouts/
│   │   │   ├── PublicLayout.tsx # Customer website layout with Header and Footer
│   │   │   └── AdminLayout.tsx  # Protected admin layout with Sidebar and Topbar
│   │   ├── pages/
│   │   │   ├── public/          # Home, Products, ProductDetail, Categories, About, Contact, Quote, 404
│   │   │   └── admin/           # Login, Dashboard, Products, ProductForm, Categories, Enquiries, Settings, Profile
│   │   ├── services/            # API clients for auth, products, categories, enquiries, settings, uploads
│   │   ├── types/               # TypeScript interfaces matching backend models
│   │   ├── utils/               # Currency (₹ INR), WhatsApp links, date formatters
│   │   ├── App.tsx              # Application routing
│   │   ├── main.tsx             # React entrypoint
│   │   └── index.css            # Tailwind directives and styles
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                      # Backend REST API (Node.js + Express + TS)
│   ├── src/
│   │   ├── config/              # MongoDB connection, Cloudinary, and validated environment variables
│   │   ├── controllers/         # Auth, Product, Category, Enquiry, Settings, Upload, Stats, Sitemap
│   │   ├── middleware/          # Auth JWT verification, Multer upload buffer, centralized error handler
│   │   ├── models/              # Mongoose schemas: Admin, Product, Category, Enquiry, BusinessSettings
│   │   ├── routes/              # Express route definitions
│   │   ├── seed/                # Seed script with initial categories, products, admin, and settings
│   │   ├── utils/               # Slugify, JWT token generation, logger
│   │   ├── app.ts               # Express configuration, CORS, rate limits, routes
│   │   └── server.ts            # Server entrypoint with non-blocking initialization
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── .env.example                 # Root configuration template
├── .gitignore                   # Ignores node_modules, build outputs, and .env files
├── package.json                 # Monorepo scripts (build, dev, seed)
├── README.md                    # Project manual & developer guide
└── DEPLOYMENT.md                # Step-by-step production cloud deployment guide
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `server/.env` and `client/.env`:

### Server (`server/.env`):
```env
PORT=5000
NODE_ENV=development

# Database: MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/business_website?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_12345
JWT_EXPIRES_IN=7d

# Cloudinary Image Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS
CLIENT_URL=http://localhost:5173

# Admin Setup Credentials (Used for automatic database seeding)
ADMIN_SETUP_SECRET=secret_setup_key_2025
INITIAL_ADMIN_USERNAME=admin
INITIAL_ADMIN_EMAIL=admin@business.com
INITIAL_ADMIN_PASSWORD=Admin@12345
```

### Client (`client/.env`):
```env
# Backend API Base URL
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
# From project root:
npm.cmd install
npm.cmd --prefix server install
npm.cmd --prefix client install
```

### 2. Seed Database (Optional / Automatic)
When the server starts with a valid MongoDB URI, it automatically initializes:
- Initial Categories (*Weighing Scale Machines*, *Solar Products*, *Water Purifiers*)
- 8 sample models with dynamic specifications, prices, and features
- Business settings with sample contact information
- Default Admin account: `admin@business.com` / `Admin@12345`

You can also run the seed script directly anytime:
```bash
npm.cmd run seed
```

### 3. Run Development Servers
In two terminal windows:

**Terminal 1 (Backend API):**
```bash
npm.cmd run dev:server
```
Runs on `http://localhost:5000`.

**Terminal 2 (Frontend Client):**
```bash
npm.cmd run dev:client
```
Runs on `http://localhost:5173`.

---

## 🔐 How to Access the Admin Dashboard

1. Navigate to: `http://localhost:5173/admin/login`
2. Enter your credentials:
   - **Username or Email**: `admin` or `admin@business.com`
   - **Password**: `Admin@12345` (or the password configured in `INITIAL_ADMIN_PASSWORD`)
3. Click **Secure Admin Login**.
4. You will be redirected to the **Control Center Dashboard** (`/admin/dashboard`).

---

## 📦 How to Add a New Product (Zero Code Changes)

1. Log into `/admin`.
2. Click **Products** in the sidebar.
3. Click **+ Add New Product**.
4. Fill in:
   - **Product Name**: e.g., `ATOM 300kg Digital Weighing Scale`
   - **Category**: Select *Weighing Scale Machines* (or any new category you created).
   - **Brand**: e.g., `ATOM`
   - **Pricing Mode**: Choose *Exact Price*, *MRP + Discount*, *Contact for Price*, or *Get a Quote*.
   - **Upload Images**: Click *Browse Images* or paste an image URL. Click the star icon to set the Primary thumbnail.
   - **Dynamic Specifications**: Click preset buttons like `+ Capacity`, `+ Accuracy`, `+ Platform Size`, or click `+ Add Specification` to add custom rows.
   - **Features**: Add bullet points for highlights.
   - **Stock & Status**: Choose *In Stock* and *Published*.
5. Click **Publish Product to Website**.
6. **Result**: The product immediately appears on the homepage, category list, product search, and creates an SEO-friendly URL at `/products/atom-300kg-digital-weighing-scale` with Schema.org product data!

---

## 🏭 How to Add a New Category (e.g., "Industrial Equipment")

1. Log into `/admin`.
2. Click **Categories** in the sidebar.
3. Click **+ Add New Category**.
4. Enter:
   - **Name**: e.g. `Industrial Equipment`
   - **Description**: Technical description of this category.
   - **Image**: Upload image or enter URL.
5. Click **Create Category**.
6. **Result**: "Industrial Equipment" automatically appears in the public website header dropdown, mobile drawer, home category grid, filter pills on `/products`, and footer!

---

## 💬 How Customer Enquiries Work

1. Customers browsing any product can click **Enquire Now / Get Quote** or the WhatsApp button.
2. In the modal/form, the customer enters their name, 10-digit mobile number, email, and requirement.
3. The enquiry is saved in MongoDB and tagged as `NEW`.
4. In `/admin/enquiries`:
   - Admin sees customer name, phone number, product name, and requirement.
   - Admin can click **Call** to dial directly or **WhatsApp** to open a pre-filled chat with the customer.
   - Admin can change status to `CONTACTED` or `COMPLETED`.

---

## 🏗️ Production Build Verification

To verify that all TypeScript code and assets compile for production:
```bash
npm.cmd run build
```
This builds:
- `server/dist/server.js` (Compiled TypeScript backend)
- `client/dist/` (Optimized production bundle with minified HTML, CSS, and JS)

For complete cloud deployment instructions (MongoDB Atlas, Cloudinary, Render, Vercel, Netlify, Custom Domains, HTTPS, Google Search Console, Google Business Profile), refer to **[DEPLOYMENT.md](file:///e:/business%20website/DEPLOYMENT.md)**.
