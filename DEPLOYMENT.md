# Production Deployment & Google Search Guide

This step-by-step guide explains how to deploy your full-stack business website to the cloud using practical, low-cost (or free tier) services suitable for a personal business, connect a custom domain with HTTPS, and get your business indexed on Google.

---

## 📋 Architecture Overview

- **Frontend**: Deployed on **Vercel** or **Netlify** (Fast, global CDN, automatic HTTPS, free tier).
- **Backend API**: Deployed on **Render.com** or **Railway.app** (Node.js runtime, automatic HTTPS, free/low-cost tiers).
- **Database**: **MongoDB Atlas** (Managed cloud database, 512MB free tier, automated backups).
- **Media Storage**: **Cloudinary** (Cloud image hosting, CDN optimization, free tier with generous bandwidth).
- **Custom Domain**: Configured via DNS records (A / CNAME) pointing to your deployment.
- **Search Engine**: **Google Search Console** and **Google Business Profile**.

---

## Step 1: Create MongoDB Atlas Database (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Click **Create a Deployment** and select the **M0 Free Cluster**.
3. Choose the region closest to India (e.g., `AWS / ap-south-1 (Mumbai)`).
4. Under **Security Quickstart**:
   - Create a database user (e.g., `business_admin`) and a strong password. **Note down this password.**
   - Under **IP Access List**, click **Add IP Address** and choose **Allow Access from Anywhere (`0.0.0.0/0`)** so that your backend host can connect.
5. In your Cluster Overview, click **Connect** → **Drivers** (Node.js).
6. Copy the connection string. It looks like:
   ```text
   mongodb+srv://business_admin:<password>@cluster0.xxxx.mongodb.net/business_website?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your database user password, and set the database name to `business_website`.

---

## Step 2: Create a Cloudinary Account for Image Uploads

1. Sign up for a free account at [Cloudinary](https://cloudinary.com).
2. Go to your **Cloudinary Dashboard**.
3. Locate your Account Details:
   - **Cloud Name**: e.g., `dxy123abc`
   - **API Key**: e.g., `123456789012345`
   - **API Secret**: e.g., `AbCdEfGhIjKlMnOpQrStUvWxYz`
4. These three keys will be set in your backend environment variables.

---

## Step 3: Deploy Backend API on Render.com

1. Push your project repository to GitHub (or GitLab).
2. Log into [Render.com](https://render.com).
3. Click **New +** → **Web Service**.
4. Connect your GitHub repository.
5. Configure the web service:
   - **Name**: `business-website-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
6. Add the following **Environment Variables** in Render:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | *Your MongoDB Atlas connection string from Step 1* |
| `JWT_SECRET` | *Generate a random 32-character string* |
| `JWT_EXPIRES_IN` | `7d` |
| `CLOUDINARY_CLOUD_NAME` | *Your Cloud Name from Step 2* |
| `CLOUDINARY_API_KEY` | *Your API Key from Step 2* |
| `CLOUDINARY_API_SECRET` | *Your API Secret from Step 2* |
| `CLIENT_URL` | *Your frontend URL, e.g. `https://yourdomain.com` or `https://business-site.vercel.app`* |
| `ADMIN_SETUP_SECRET` | *A secret phrase for initial setup* |
| `INITIAL_ADMIN_USERNAME` | `admin` |
| `INITIAL_ADMIN_EMAIL` | `admin@yourdomain.com` |
| `INITIAL_ADMIN_PASSWORD` | *Your chosen strong admin password* |

7. Click **Create Web Service**.
8. Render will build and deploy your backend. Once deployed, you will receive a public URL such as:
   `https://business-website-api.onrender.com`
9. Test it by opening `https://business-website-api.onrender.com/api/health` in your browser. You should receive:
   ```json
   {"status":"ok","service":"business-website-api"}
   ```

---

## Step 4: Deploy Frontend on Vercel

1. Log into [Vercel](https://vercel.com) and click **Add New...** → **Project**.
2. Select your GitHub repository.
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and select `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://business-website-api.onrender.com/api` *(Your deployed Render backend URL)*
5. Click **Deploy**.
6. Vercel will build and provide a live URL (e.g. `https://business-website.vercel.app`).
7. Update `CLIENT_URL` in your Render backend settings to match your Vercel URL, and trigger a quick redeploy so CORS is authorized.

---

## Step 5: Connect Your Custom Domain

1. Purchase a domain from any registrar (GoDaddy, Namecheap, Google Domains/Squarespace, Hostinger).
2. In **Vercel**:
   - Go to your Project → **Settings** → **Domains**.
   - Enter your domain name (e.g. `yourbusiness.com` and `www.yourbusiness.com`).
   - Vercel will display the required DNS records:
     - **A Record**: Point `@` to `76.76.21.21`
     - **CNAME Record**: Point `www` to `cname.vercel-dns.com`
3. In your Domain Registrar's DNS Manager:
   - Add the `A` and `CNAME` records provided by Vercel.
4. Vercel automatically provisions and renews an **SSL Certificate (HTTPS)** for free.

---

## Step 6: Submit Sitemap to Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property** and enter your custom domain (e.g. `https://yourbusiness.com`).
3. Verify domain ownership using the DNS TXT record or HTML file verification provided by Google.
4. Once verified, in the left sidebar click **Sitemaps**.
5. In **Add a new sitemap**, type:
   ```text
   sitemap.xml
   ```
6. Click **Submit**.
7. Google will crawl your dynamic sitemap containing all published products and categories. When you add new products through the admin dashboard, your sitemap updates automatically!

---

## Step 7: Set Up Google Business Profile (Local SEO)

1. Go to [Google Business Profile](https://www.google.com/business).
2. Click **Manage now** and enter your business name.
3. Choose categories:
   - Primary: *Industrial Equipment Supplier* or *Solar Energy Equipment Supplier*
   - Additional: *Water Treatment Plant Manufacturer*, *Scale Repair Service*
4. Enter your exact address matching your Admin Settings:
   - Address, City, State, and Pincode.
5. Add your phone number, WhatsApp contact, and website link (`https://yourbusiness.com`).
6. Complete Google's verification method (Video, Phone OTP, or Postcard).
7. Once verified, your business will appear on **Google Maps** and in local searches (e.g., *"weighing scales near me"*, *"solar panels in Mumbai"*).
