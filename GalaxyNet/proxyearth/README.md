# 🔍 LeakData.org - Mobile Number Tracker & Data Breach Checker

A powerful, privacy-focused web application built with **Next.js 16** that allows users to track Indian mobile number locations and check if their personal data has been compromised in data breaches. Featuring an interactive map interface, real-time geocoding, and comprehensive privacy controls.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare-orange)](https://pages.cloudflare.com/)

## 🌟 Features

- **📱 Mobile Number Tracking**: Track any Indian 10-digit mobile number location instantly
- **📧 Email Breach Check**: Verify if your email has been exposed in data leaks
- **🗺️ Interactive Map**: Beautiful OpenStreetMap integration with smooth zoom animations
- **🔒 Privacy-First**: Hide your data from search results with one click
- **⚡ Rate Limiting**: Smart IP-based daily usage limits (12 searches/day)
- **🛡️ Security**: Cloudflare Turnstile CAPTCHA integration for bot protection
- **📊 Real-time Geocoding**: Automatic address-to-coordinates conversion
- **🎨 Modern UI**: Responsive design with smooth animations using Framer Motion
- **🔍 SEO Optimized**: Schema.org markup for rich search results
- **📈 Analytics**: Google Analytics integration for insights

## 🚀 Live Demo

Visit the live application: [https://leakdata.org](https://leakdata.org)

## 📋 Table of Contents

- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Local Development Setup](#-local-development-setup)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Cloudflare Deployment](#-cloudflare-deployment)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Leaflet** - Interactive maps

### Backend
- **Next.js Edge Runtime** - Serverless API routes
- **Neon Postgres** - Serverless PostgreSQL database
- **Cloudflare Turnstile** - Bot protection

### Deployment
- **Cloudflare Pages** - Static hosting and edge functions

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.17 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Git** - Version control
- **Cloudflare Account** - [Sign up](https://dash.cloudflare.com/sign-up)
- **Neon Database Account** - [Sign up](https://neon.tech/)
- **Google Analytics Account** (optional) - [Sign up](https://analytics.google.com/)

## 💻 Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yenbook/proxyearth.git
cd proxyearth
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values (see [Environment Variables](#-environment-variables) section).

### Step 4: Set Up the Database

1. Create tables in your Neon database:

```sql
-- Daily usage tracking table
CREATE TABLE IF NOT EXISTS daily_usage (
    ip VARCHAR(45),
    date DATE DEFAULT CURRENT_DATE,
    count INTEGER DEFAULT 0,
    PRIMARY KEY (ip, date)
);

-- Hidden targets table (privacy)
CREATE TABLE IF NOT EXISTS hidden_targets (
    id SERIAL PRIMARY KEY,
    value VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 5: Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Environment Variables

### Required Secrets

Create a `.env.local` file with the following variables:

| Variable | Description | How to Obtain | Required |
|----------|-------------|---------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | [Neon Dashboard](https://console.neon.tech/) → Your Project → Connection Details | ✅ Yes |
| `API_BASE_URL` | External data leak API endpoint | Your data provider API endpoint | ✅ Yes |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key | [Cloudflare Dashboard](https://dash.cloudflare.com/) → Turnstile → Site → Secret Key | ✅ Yes |
| `TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key | [Cloudflare Dashboard](https://dash.cloudflare.com/) → Turnstile → Site → Site Key | ✅ Yes |
| `NEXT_PUBLIC_GA_ID` | Google Analytics Measurement ID | [Google Analytics](https://analytics.google.com/) → Admin → Property → Data Streams | ⚠️ Optional |

### Example `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"

# External API
API_BASE_URL="https://your-api-provider.com/search"

# Cloudflare Turnstile (CAPTCHA)
TURNSTILE_SECRET_KEY="0x4AAAAxxxxxxxxxxxxxxxxxxxxxxxx"
TURNSTILE_SITE_KEY="0x4AAAAAACFVodwOjSj0q1X0"

# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID="G-071CLQ0DJV"
```

### How to Obtain Each Secret:

#### 1. **DATABASE_URL** (Neon PostgreSQL)

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project or select an existing one
3. Navigate to **Dashboard** → **Connection Details**
4. Copy the connection string (select "Pooled connection")
5. It should look like: `postgresql://user:password@ep-xxx.region.neon.tech/dbname?sslmode=require`

#### 2. **API_BASE_URL** (Data Provider API)

1. Sign up with a data breach/mobile tracking API provider
2. Get your API endpoint URL from their documentation
3. Example format: `https://api.provider.com/v1/search`

#### 3. **TURNSTILE_SECRET_KEY & TURNSTILE_SITE_KEY** (Cloudflare)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Turnstile** in the left sidebar
3. Click **Add Site**
4. Fill in:
   - **Site name**: `leakdata.org` (or your domain)
   - **Domain**: Your actual domain or `localhost` for development
5. After creation, you'll see:
   - **Site Key** → Use as `TURNSTILE_SITE_KEY` (also update in `RemoveDataModal.tsx`)
   - **Secret Key** → Use as `TURNSTILE_SECRET_KEY`

#### 4. **NEXT_PUBLIC_GA_ID** (Google Analytics - Optional)

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a **GA4 Property** if you don't have one
3. Navigate to **Admin** → **Data Streams** → **Web**
4. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

## 🗄️ Database Setup

This project uses **Neon** (serverless PostgreSQL). Here's how to set it up:

### 1. Create a Neon Project

```bash
# Visit https://console.neon.tech/
# Click "Create Project"
# Choose your region (closest to your users)
# Copy the connection string
```

### 2. Run Migrations

The tables are created automatically on first API call, but you can manually create them:

```sql
-- Connect to your Neon database using psql or Neon SQL Editor

-- Rate limiting table
CREATE TABLE IF NOT EXISTS daily_usage (
    ip VARCHAR(45),
    date DATE DEFAULT CURRENT_DATE,
    count INTEGER DEFAULT 0,
    PRIMARY KEY (ip, date)
);

-- Privacy control table
CREATE TABLE IF NOT EXISTS hidden_targets (
    id SERIAL PRIMARY KEY,
    value VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('mobile', 'email')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_hidden_targets_value ON hidden_targets(value);
```

## ☁️ Cloudflare Deployment

This project is optimized for **Cloudflare Pages** with **Edge Runtime**.

### Step 1: Connect to Cloudflare Pages

#### Option A: Using Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages**
3. Click **Create Application** → **Pages** → **Connect to Git**
4. Authorize Cloudflare to access your GitHub account
5. Select the `yenbook/proxyearth` repository
6. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`

#### Option B: Using Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npx @cloudflare/next-on-pages@latest
wrangler pages deploy .vercel/output/static --project-name=proxyearth
```

### Step 2: Configure Environment Variables in Cloudflare

1. In Cloudflare Dashboard, go to **Workers & Pages** → Select your project
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

**For Production:**

Click **Add Variables** → Select **Production**

| Variable Name | Value | Type |
|---------------|-------|------|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.neon.tech/...` | Secret ✅ |
| `API_BASE_URL` | `https://your-api.com/search` | Secret ✅ |
| `TURNSTILE_SECRET_KEY` | `0x4AAAAxxxxxxxx` | Secret ✅ |

**Important Notes:**
- Mark `DATABASE_URL`, `API_BASE_URL`, and `TURNSTILE_SECRET_KEY` as **secrets** (encrypted)
- Public variables like `TURNSTILE_SITE_KEY` should be hardcoded or in source code
- Click **Save** after adding all variables

### Step 3: Deploy

```bash
# Trigger deployment
git push origin main

# Or use Cloudflare Dashboard → Deployments → Retry Deployment
```

### Step 4: Custom Domain Setup (Optional)

1. In Cloudflare Pages, go to **Custom Domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `leakdata.org`)
4. Cloudflare will automatically configure DNS

### Build Configuration

The project uses a custom build script for Cloudflare Pages:

```json
{
  "scripts": {
    "pages:build": "npx @cloudflare/next-on-pages@latest"
  }
}
```

This is already configured in `package.json`.

## 📁 Project Structure

```
proxyearth/
├── public/                    # Static assets
│   ├── favicon.ico
│   └── yt-size-img.jpg       # SEO image
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/             # API Routes (Edge Runtime)
│   │   │   ├── check/       # Data leak check endpoint
│   │   │   ├── hide/        # Privacy control endpoint
│   │   │   └── limit/       # Rate limit status endpoint
│   │   ├── layout.tsx       # Root layout (SEO, Analytics)
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── Map.tsx          # Leaflet map component
│   │   ├── MapBackground.tsx
│   │   ├── SearchBox.tsx    # Search interface
│   │   ├── ResultSheet.tsx  # Result display
│   │   ├── RateLimitPanel.tsx
│   │   ├── RemoveDataModal.tsx
│   │   ├── ErrorModal.tsx
│   │   ├── LoadingSteps.tsx
│   │   ├── DeepSearchTerminal.tsx
│   │   └── AboutModal.tsx
│   ├── lib/                 # Utilities
│   │   ├── api.ts           # API client functions
│   │   ├── db.ts            # Database connection
│   │   ├── security.ts      # Turnstile verification
│   │   └── utils.ts         # Helper functions
│   └── hooks/               # Custom React hooks
├── .env.local               # Environment variables (local)
├── .env.example             # Environment template
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

## 📡 API Documentation

### 1. Check Data Leak

**Endpoint:** `GET /api/check`

**Query Parameters:**
- `mobile` (optional): 10-digit Indian mobile number
- `email` (optional): Email address

**Headers:**
- `cf-turnstile-response`: Turnstile token

**Response:**
```json
{
  "status": "success",
  "mobile": "9876543210",
  "name": "ANIL KUMAR SAV",
  "address": "29, REDMA, DALTONGANJ PALAMU...",
  "circle": "VI DELHI",
  "email": "example@email.com",
  "fname": "Father Name",
  "id": "123456789012",
  "alt": "9123456789"
}
```

**Rate Limit Response (429):**
```json
{
  "rateLimit": true
}
```

### 2. Hide Data

**Endpoint:** `POST /api/hide`

**Body:**
```json
{
  "value": "9876543210",
  "type": "mobile"
}
```

**Headers:**
- `cf-turnstile-response`: Turnstile token

**Response:**
```json
{
  "success": true
}
```

### 3. Rate Limit Status

**Endpoint:** `GET /api/limit`

**Response:**
```json
{
  "count": 5,
  "limit": 12,
  "remaining": 7
}
```

## 🔧 Configuration

### Customizing Rate Limits

Edit `src/app/api/check/route.ts`:

```typescript
const LIMIT = 12; // Change to your desired limit
```

### Customizing Turnstile Site Key

Edit `src/components/RemoveDataModal.tsx`:

```tsx
<Turnstile
  siteKey="YOUR_SITE_KEY_HERE"
  // ...
/>
```

Also update in `src/components/SearchBox.tsx` if present.

### Adding Google Analytics

The GA tracking code is in `src/app/layout.tsx`. Update the ID:

```typescript
gtag('config', 'G-YOUR-GA-ID');
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🐛 Troubleshooting

### Issue: "Access Denied: Domain not allowed"
- **Solution**: Check `src/lib/security.ts` and add your domain to `allowedDomains`

### Issue: Database connection fails
- **Solution**: Verify `DATABASE_URL` is correct and Neon project is active

### Issue: Turnstile verification fails
- **Solution**: Ensure `TURNSTILE_SECRET_KEY` matches the site key in use

### Issue: Maps not loading
- **Solution**: Check CSP headers in `next.config.ts` allow OpenStreetMap

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**yenbook**

- GitHub: [@yenbook](https://github.com/yenbook)
- Repository: [proxyearth](https://github.com/yenbook/proxyearth)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Neon](https://neon.tech/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [React Leaflet](https://react-leaflet.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For issues, questions, or suggestions:

- Create an issue: [GitHub Issues](https://github.com/yenbook/proxyearth/issues)
- Email: contact@leakdata.org

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**
