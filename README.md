# CineWave — Video Streaming Platform

CineWave is a full-stack video streaming web application built using the MERN stack. It allows users to browse movies and short films, search for content, watch videos, and maintain a personal watchlist. The application also includes a creator dashboard for managing video content and a VIP subscription feature.

## Features

- **User Authentication:** Register, log in, and manage your profile.
- **Role-Based Access:** Separate features for viewers and content creators.
- **Browse Videos:** Explore movies and short films by genre, popularity, and recently added content.
- **Search and Filters:** Find videos by title, description, and genre.
- **Video Playback:** Watch available videos directly in the browser.
- **Watchlist:** Save videos to watch later.
- **Creator Dashboard:** Add, edit, and delete videos, and view basic statistics.
- **VIP Subscription:** Razorpay integration for premium content access.
- **Email Notifications:** Nodemailer integration for account and payment-related emails.

## Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- React Router
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Other Technologies**
- JWT and bcryptjs for authentication
- Razorpay for payments
- Nodemailer for email notifications

## Project Structure

```text
CineWave/
├── client/          # React frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
├── server/          # Express backend
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── utils/
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- MongoDB, either locally or through MongoDB Atlas

### 1. Clone the Repository

```bash
git clone https://github.com/Yashwanth-CH-27/CineWave.git
cd CineWave
```

### 2. Install Dependencies

If the root `package.json` includes the `install:all` script, run:

```bash
npm run install:all
```

Alternatively, install the dependencies separately:

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure Environment Variables

Create the required `.env` files in the `server` and `client` directories.

Configure the backend with the appropriate values for your environment:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/cinewave
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

RAZORPAY_KEY_ID=your_razorpay_test_key
RAZORPAY_KEY_SECRET=your_razorpay_test_secret
SUBSCRIPTION_PRICE_PAISE=19900
SUBSCRIPTION_CURRENCY=INR
SUBSCRIPTION_DURATION_DAYS=30

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=your_sender_email
CLIENT_URL=http://localhost:5173
```

For the frontend, configure `client/.env`:

```env
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=your_razorpay_test_key
```

Replace the example values with your actual configuration. Payment and email features require valid credentials for the respective services.

**Important:** Do not commit real passwords, API secrets, or private environment files to GitHub.

### 4. Start the Application

Start the backend from the project root:

```bash
npm run start:server
```

In a separate terminal, start the frontend:

```bash
npm run dev:client
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

### 5. Database Setup

If the project includes a database seeding script, you can populate the database with sample content using:

```bash
npm run seed
```

Make sure your database configuration is set up before running the command.

## Payment Integration

CineWave includes a VIP subscription feature using Razorpay. The configured monthly plan is ₹199 for 30 days.

For development and demonstration, use Razorpay test mode and configure the required API keys. Test payments do not represent actual production transactions.

## Future Improvements

- Add pagination and more advanced search options.
- Improve video streaming and content delivery.
- Add more detailed creator analytics.
- Improve automated testing and error handling.
- Deploy the application for public access.

## Author

**Yashwanth CH**

GitHub: [Yashwanth-CH-27](https://github.com/Yashwanth-CH-27)
