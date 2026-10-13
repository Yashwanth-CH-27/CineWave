# 🎬 CineWave — Entertainment Video Streaming Platform

**CineWave** is a full-stack MERN entertainment video streaming web application designed in the style of an Over-The-Top (OTT) platform (resembling Netflix/Prime Video/Hotstar). Built as a moderately scoped college full-stack project, CineWave features user and creator authentication, role-based access control, an entertainment catalog with hero banners and genre rails, video playback with view tracking, a personal watchlist, **Razorpay payment gateway** integration for VIP subscriptions, and **Nodemailer SMTP** email notifications.

---

## 🌟 Key Features

### 1. 🔐 Authentication & Role-Based Access Control (RBAC)
- **Two Distinct Roles**: `USER` (Viewer) and `CREATOR` (Filmmaker/Studio).
- **Registration Role Selection**: Simple, intuitive card-based selection during signup (`Viewer` vs `Creator`).
- **Security**: Passwords hashed using `bcryptjs` with salt rounds; stateless `JWT` session tokens.
- **Protected Routes**: Navigation guards prevent unauthorized access to user watchlists, profiles, and the Creator Studio.
- **Email Alerts**: Automatic branded HTML notifications for welcome upon signup and security alerts upon login.

### 2. 🍿 Normal User Experience & Dashboard
- **OTT Hero Banner**: Full-width featured trailer showcase with backdrop, metadata pills (genre, duration, views), "Watch Now", and "Watchlist" actions.
- **Categorized Content Rails**: "Trending & Popular", "Recently Added", "VIP Exclusives", and "Curated Short Films".
- **Dynamic Search & Filtering**: Instant search across titles and descriptions, genre chips (Action, Comedy, Drama, Thriller, Animation, Short Films, Sci-Fi), and access tier tabs (`All`, `Free Stream`, `VIP Only`).
- **Video Detail Theater**: Playback theater with title, synopsis, genre, duration, view count, publication date, and creator attribution.
- **My Watchlist**: Save/bookmark movies and short films with instant toggle and dedicated watchlist management.
- **User Profile**: Update profile name, inspect current VIP membership validity with countdown, and review past Razorpay invoices.

### 3. 🎥 Creator Dashboard (Creator Studio) — Mandatory
- **Metrics Overview**: Live analytics for total videos published, cumulative audience views, VIP exclusive count, and free titles.
- **Publish Video Form**: Creators can add new videos by specifying title, synopsis, genre, duration, poster thumbnail URL, video stream URL, and Free/VIP toggle.
- **Content Management Table**: Responsive table showing thumbnails, titles, genres, tier status, view counts, and publication dates.
- **Edit Video**: Modify existing video details after publishing (title, synopsis, genre, thumbnail, video URL, tier).
- **Delete Video**: Remove creator-owned videos with safety confirmation.
- **Strict Backend Ownership Validation**: Server middleware prevents creators from editing or deleting videos owned by other creators.

### 4. 📺 Video Playback Engine
- **HTML5 Player**: Native `<video controls>` element with autoplay, poster frame, and responsive aspect-ratio container.
- **View Counter**: Automatically increments video view count in MongoDB upon stream opening.
- **Paywall Access Control**: Free videos streamable by all users; VIP Premium titles are strictly locked behind an active subscription check.
- **Fallback Resilience**: Displays custom fallback cards and "Open Direct Source" links if network or media format errors occur.

### 5. 💳 Razorpay VIP Subscription — Mandatory
- **Single Monthly Plan**: CineWave VIP All-Access (₹199 / 30 Days).
- **End-to-End Payment Flow**:
  1. User visits `/subscription` and clicks "Subscribe with Razorpay".
  2. Backend creates an official Razorpay order via REST API (`/api/payment/create-order`).
  3. Frontend opens Razorpay Checkout modal (`window.Razorpay`).
  4. User completes payment in Razorpay Test Mode.
  5. Frontend submits checkout response to backend (`/api/payment/verify`).
  6. Backend verifies cryptographic HMAC-SHA256 signature using the secret key.
  7. Successful payment is saved in the MongoDB `Payment` collection.
  8. User's `isPremium` status is set to `true` with a 30-day `subscriptionExpiry`.
  9. Branded payment receipt email is dispatched via Nodemailer.
  10. VIP exclusive playback is unlocked instantly.
- **Razorpay Test Mode Ready**: Full support for test keys and simulator fallback.

### 6. 📧 Nodemailer SMTP Notifications — Mandatory
- **Welcome Email**: Sent upon registration with role-specific tips.
- **Login Notification**: Dispatched upon sign-in with timestamp and security notice.
- **Payment Receipt**: Dispatched upon verified VIP activation with order ID, payment ID, amount, and validity date.
- **Non-blocking Execution**: Email delivery runs asynchronously; SMTP errors are logged to the console without interrupting user signup or login flows.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 18 + Vite | Single Page Application (SPA) with fast HMR |
| **Styling** | Tailwind CSS | Cinematic dark theme (`#0a0a0f`), glassmorphism, gold accents |
| **Icons** | Lucide React | High-resolution modern icons |
| **Routing** | React Router DOM v6 | Declarative routing with client-side history & route guards |
| **HTTP Client** | Axios | Configured with base URL and JWT Bearer token interceptor |
| **Backend** | Node.js + Express.js | Modular RESTful API architecture |
| **Database** | MongoDB + Mongoose | Schema modeling, validation, and text/genre indexing |
| **Embedded DB** | MongoMemoryServer | Automatic fallback for instant demo if local MongoDB daemon is not running |
| **Authentication** | JWT + bcryptjs | Password hashing and stateless token verification |
| **Payments** | Razorpay SDK | Order creation & HMAC-SHA256 signature verification |
| **Email** | Nodemailer | SMTP transporter for responsive HTML email alerts |

---

## 📁 Project Structure

```
cinewave/
├── package.json              # Monorepo scripts (run server/client together)
├── .gitignore                # Root gitignore
├── README.md                 # Complete project documentation
├── server/
│   ├── package.json          # Server dependencies & scripts
│   ├── .env.example          # Server environment variable template
│   ├── .env                  # Active server configuration
│   └── src/
│       ├── server.js         # Express app entrypoint & middleware mounting
│       ├── seed.js           # Database seeding script
│       ├── config/
│       │   ├── db.js         # MongoDB connection with embedded fallback
│       │   ├── email.js      # Nodemailer transporter & dispatch helpers
│       │   └── razorpay.js   # Razorpay instance & HMAC verification
│       ├── models/
│       │   ├── User.js       # User model (name, email, passwordHash, role, isPremium, expiry)
│       │   ├── Video.js      # Video model (title, synopsis, genre, thumbnail, videoUrl, views)
│       │   ├── Payment.js    # Payment model (orderId, paymentId, signature, amount, status)
│       │   └── Watchlist.js  # Watchlist model (user ref, video refs)
│       ├── middleware/
│       │   └── auth.js       # verifyToken, requireRole('CREATOR'), optionalAuth
│       ├── controllers/
│       │   ├── authController.js       # Signup, login, getMe, updateProfile
│       │   ├── videoController.js      # Video listing, search, details, view count, access check
│       │   ├── creatorController.js    # Creator-owned video CRUD & stats
│       │   ├── watchlistController.js  # Add, remove, and check user watchlist
│       │   └── paymentController.js    # Razorpay order, verify signature, history
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── videoRoutes.js
│       │   ├── creatorRoutes.js
│       │   ├── watchlistRoutes.js
│       │   └── paymentRoutes.js
│       └── utils/
│           ├── autoSeed.js             # Automatically seeds demo dataset if DB is empty
│           └── emailTemplates.js       # Branded HTML email templates
└── client/
    ├── package.json          # Client dependencies & Vite build scripts
    ├── vite.config.js        # Vite build & proxy settings
    ├── tailwind.config.js    # Tailwind palette, typography, and gradients
    ├── postcss.config.js     # PostCSS setup
    ├── index.html            # Main HTML with Google Fonts & Razorpay SDK script
    ├── .env.example          # Client environment template
    ├── .env                  # Active client configuration
    └── src/
        ├── main.jsx          # React DOM entrypoint with Auth & Watchlist providers
        ├── App.jsx           # App shell with Routes, Navbar, and Footer
        ├── index.css         # Tailwind directives & glassmorphism utilities
        ├── context/
        │   ├── AuthContext.jsx       # User state, token persistence, login/signup/logout
        │   └── WatchlistContext.jsx  # Watchlist state & toggle handlers
        ├── services/
        │   └── api.js                # Axios instance & organized API methods
        ├── components/
        │   ├── Navbar.jsx            # OTT navbar with logo, search, VIP badge & profile menu
        │   ├── Footer.jsx            # Cinematic footer with architecture details
        │   ├── HeroBanner.jsx        # Full-width featured trailer carousel
        │   ├── VideoCard.jsx         # Movie card with VIP tags, hover preview & quick bookmark
        │   ├── VideoGrid.jsx         # Section shelf renderer
        │   ├── VideoPlayer.jsx       # HTML5 player with view count trigger & paywall lock
        │   ├── PaywallModal.jsx      # VIP subscription modal for locked videos
        │   ├── ProtectedRoute.jsx    # Route guard for authenticated & creator-only routes
        │   └── Toast.jsx             # Action feedback notifications
        └── pages/
            ├── HomePage.jsx          # Home feed with Hero banner, genre chips & OTT shelves
            ├── ExplorePage.jsx       # Search catalog, genre filters, and sort options
            ├── VideoDetailsPage.jsx  # Player theater, metadata, watchlist & related titles
            ├── WatchlistPage.jsx     # Saved movies & short films
            ├── SubscriptionPage.jsx  # VIP plan card & Razorpay Checkout flow
            ├── PaymentSuccessPage.jsx# Payment confirmation receipt
            ├── CreatorStudioPage.jsx # Creator portal: video upload, editing, deletion & views
            ├── ProfilePage.jsx       # User settings, VIP status countdown & billing history
            ├── LoginPage.jsx         # Sign in with 1-click evaluator demo quick-fill
            ├── SignupPage.jsx        # Registration with Viewer vs Creator role selection
            └── NotFoundPage.jsx      # 404 page
```

---

## 🗄️ Database Schemas & Models

### 1. User (`models/User.js`)
- `name` (String, required): Full name.
- `email` (String, required, unique): User email.
- `passwordHash` (String, required): Hashed via bcrypt.
- `role` (String, enum: `['USER', 'CREATOR']`, default: `'USER'`).
- `isPremium` (Boolean, default: `false`): VIP membership flag.
- `subscriptionExpiry` (Date, default: `null`): Expiry timestamp for the 30-day pass.

### 2. Video (`models/Video.js`)
- `title` (String, required): Video title.
- `description` (String, required): Synopsis.
- `genre` (String, enum: `['Action', 'Comedy', 'Drama', 'Thriller', 'Animation', 'Short Films', 'Sci-Fi', 'Documentary']`).
- `thumbnailUrl` (String, required): Poster image link.
- `videoUrl` (String, required): Playable stream link (MP4/WebM).
- `creator` (ObjectId, ref: `'User'`, required): Owner creator.
- `isPremium` (Boolean, default: `false`): VIP access gate.
- `views` (Number, default: `0`): Cumulative play count.
- `duration` (String, default: `'10m'`): Duration text (e.g. `'14m'`).
- `featured` (Boolean, default: `false`): Featured banner candidate.

### 3. Payment (`models/Payment.js`)
- `user` (ObjectId, ref: `'User'`, required): Paying user.
- `razorpayOrderId` (String, required): Order generated by Razorpay.
- `razorpayPaymentId` (String): Payment identifier.
- `razorpaySignature` (String): Cryptographic signature.
- `amount` (Number, required): Amount in paise (19900 = ₹199.00).
- `currency` (String, default: `'INR'`).
- `status` (String, enum: `['created', 'successful', 'failed']`).
- `plan` (String, default: `'CineWave VIP Monthly'`).
- `subscriptionDays` (Number, default: `30`).

### 4. Watchlist (`models/Watchlist.js`)
- `user` (ObjectId, ref: `'User'`, required, unique).
- `videos` (Array of ObjectId, ref: `'Video'`).

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher.
- **npm**: v9.0.0 or higher.
- *(Optional)* **MongoDB**: Local MongoDB or MongoDB Atlas URI (if not installed, CineWave automatically launches an embedded in-memory MongoDB database so the app runs immediately!).

---

### Step 1: Install Dependencies

From the project root:
```bash
npm run install:all
```
*Or install separately:*
```bash
cd server && npm install
cd ../client && npm install
```

---

### Step 2: Environment Configuration

Create or inspect `.env` files in both directories:

#### Server Configuration (`server/.env`):
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection (use local, Atlas, or embedded in-memory fallback)
MONGODB_URI=mongodb://127.0.0.1:27017/cinewave
USE_IN_MEMORY_DB_FALLBACK=true

# JWT Secret
JWT_SECRET=cinewave_super_secure_jwt_secret_key_2026_demo
JWT_EXPIRES_IN=7d

# Razorpay Test Credentials (replace with your keys from dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_cinewave123456
RAZORPAY_KEY_SECRET=rzp_test_secret_cinewave987654
SUBSCRIPTION_PRICE_PAISE=19900
SUBSCRIPTION_CURRENCY=INR
SUBSCRIPTION_DURATION_DAYS=30

# Nodemailer / SMTP Credentials (Gmail, Mailtrap, or Ethereal)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=demo_user@ethereal.email
SMTP_PASS=demo_password
SMTP_FROM="CineWave OTT" <no-reply@cinewave.tv>

# Client URL
CLIENT_URL=http://localhost:5173
```

#### Client Configuration (`client/.env`):
```env
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=rzp_test_cinewave123456
```

---

### Step 3: Seed Database (Demo Data)

Populate the database with demo users, creator accounts, and 12 high-definition sample movies and short films:
```bash
npm run seed
```
*(Note: If MongoDB is empty upon server start, CineWave also automatically seeds the demo content!)*

---

### Step 4: Run the Application

In terminal 1 (start backend API on `http://localhost:5000`):
```bash
npm run start:server
```

In terminal 2 (start frontend Vite dev server on `http://localhost:5173`):
```bash
npm run dev:client
```

Open your browser at **`http://localhost:5173`**.

---

## 🔑 Pre-Seeded Demo Credentials

For quick evaluation and grading, the login page features **1-click quick-fill buttons**:

| Account Type | Email | Password | Role | Permissions |
|---|---|---|---|---|
| **Content Creator** | `creator@cinewave.com` | `creator123` | `CREATOR` | Full access to **Creator Studio**: upload, edit, delete own videos, and view metrics. |
| **Indie Studio** | `ava@cinewave.com` | `creator123` | `CREATOR` | Creator account for testing multi-creator ownership checks. |
| **VIP Premium User** | `premium@cinewave.com` | `premium123` | `USER` | Active 30-day VIP membership; streams all free and VIP exclusive films. |
| **Free Tier User** | `user@cinewave.com` | `user123` | `USER` | Streams free content; can subscribe to VIP via Razorpay. |

---

## 💳 Razorpay Test Mode Setup Instructions

1. Visit [https://dashboard.razorpay.com](https://dashboard.razorpay.com) and create a free account.
2. Toggle the dashboard switch to **Test Mode** (top bar).
3. Navigate to **Settings** → **API Keys** → click **Generate Test Key**.
4. Copy your `Key Id` and `Key Secret`.
5. Update `server/.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_YourKeyHere
   RAZORPAY_KEY_SECRET=YourSecretHere
   ```
6. Update `client/.env`:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_YourKeyHere
   ```
7. When testing payment on the `/subscription` page:
   - Use any test card number: `4111 1111 1111 1111` (any future expiry, any CVV).
   - Enter OTP `123456` or click **Success** on the Razorpay test simulator.
   - The backend validates the cryptographic signature, activates VIP status in MongoDB, and dispatches a receipt email.

---

## 📧 Nodemailer SMTP Setup Instructions

### Option A: Mailtrap (Recommended for Testing & College Demos)
1. Sign up at [https://mailtrap.io](https://mailtrap.io).
2. Go to **Email Testing** → **Inboxes** → select your sandbox inbox.
3. Select **Show Credentials** and choose **Nodemailer**.
4. Paste the host, port, user, and pass into `server/.env`.
5. All sent emails will appear in your Mailtrap inbox.

### Option B: Gmail SMTP
1. Enable **2-Step Verification** on your Google Account.
2. Generate an **App Password** under Google Security settings.
3. Configure `server/.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_16_digit_app_password
   SMTP_FROM="CineWave OTT" <your_email@gmail.com>
   ```

*(Note: CineWave wraps email delivery in non-blocking try/catch handlers. If SMTP is misconfigured or offline, an informative warning is logged to the console without interrupting user signup or payment activation).*

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/signup`: Create a new user (`name`, `email`, `password`, `role`).
- `POST /api/auth/login`: Authenticate user (`email`, `password`).
- `GET /api/auth/me`: Retrieve current user session and active VIP status *(Protected)*.
- `PUT /api/auth/profile`: Update user profile name *(Protected)*.

### Videos (`/api/videos`)
- `GET /api/videos`: List videos with search (`?search=`), genre (`?genre=`), filter (`?filter=free|premium`), sort (`?sort=popular|title`).
- `GET /api/videos/featured`: Retrieve top featured movies for hero banner.
- `GET /api/videos/:id`: Get video details and playback access check.
- `POST /api/videos/:id/view`: Increment video view counter.
- `GET /api/videos/:id/access`: Check playback permission for the current user.

### Creator Studio (`/api/creator`) — *Requires 'CREATOR' Role*
- `GET /api/creator/videos`: List creator's published videos and aggregate metrics.
- `POST /api/creator/videos`: Publish a new video (`title`, `description`, `genre`, `thumbnailUrl`, `videoUrl`, `isPremium`, `duration`).
- `PUT /api/creator/videos/:id`: Update an existing video *(Enforces ownership check)*.
- `DELETE /api/creator/videos/:id`: Delete a video *(Enforces ownership check)*.

### Watchlist (`/api/watchlist`) — *Protected*
- `GET /api/watchlist`: Retrieve user's saved videos.
- `POST /api/watchlist/toggle/:videoId`: Add or remove a video from the user's watchlist.
- `GET /api/watchlist/check/:videoId`: Check whether a specific video is saved.

### Payments (`/api/payment`) — *Protected*
- `POST /api/payment/create-order`: Create a Razorpay order for the ₹199 monthly pass.
- `POST /api/payment/verify`: Cryptographically verify payment signature, activate VIP status in MongoDB, and dispatch email receipt.
- `GET /api/payment/status`: Check current subscription validity and remaining days.
- `GET /api/payment/history`: Retrieve past Razorpay orders and payment receipts.

---

## 🔒 Security & Architectural Decisions

1. **Role Selection at Registration**: For this college MVP, role selection (`USER` vs `CREATOR`) is provided on the registration form to allow examiners to test both flows immediately without requiring an out-of-band administrative provisioning system. Role permissions are strictly verified on the server for all operations.
2. **Backend Ownership Enforcement**: Video edit and deletion endpoints verify that `video.creator.toString() === req.user._id.toString()`. A creator cannot modify another creator's content even if they know the video ID.
3. **Cryptographic Payment Verification**: Premium status is **never** granted solely on the frontend checkout callback. The frontend must send `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` to `/api/payment/verify`, where the server computes `HMAC-SHA256(order_id + '|' + payment_id, secret)` and compares it before writing to MongoDB.
4. **Video Storage via Stream URLs**: Large binary video files are not stored directly in MongoDB (to prevent BSON document size bloat and severe database memory exhaustion). CineWave streams browser-playable MP4 URLs (e.g. Google Cloud test buckets and Blender open movies), which represent industry standard CDN/object-storage URLs.
5. **Subscription Scope**: The VIP subscription is modeled as a non-recurring 30-day entitlement. Automated recurring credit-card debit via Razorpay Subscriptions requires webhook endpoints and banking mandates that are outside the single-day demonstration scope.

---

## 🎓 College Project Submission Notes

- **Course**: Full-Stack Web Development / MERN Stack Engineering.
- **Project Name**: CineWave — Entertainment Video Streaming Web Application.
- **Architecture**: Single Page Application (React + Vite) + REST API (Node.js + Express) + NoSQL (MongoDB + Mongoose).
- **Production Readiness**: Code adheres to strict clean-code principles, modular separation of concerns, and full error handling.
