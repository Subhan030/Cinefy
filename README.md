# Cinefy 🎬

Cinefy is a modern, full-stack movie ticket booking application built with the MERN stack. It offers a premium user experience for browsing movies, selecting theatres, choosing seats, and managing bookings, complete with an administrative dashboard for full system control.


## 🚀 Features

### 👤 For Users
*   **Authentication**: Secure sign-up and login via Clerk.
*   **Movie Discovery**:
    *   Browse "Now Playing" and "Coming Soon" movies.
    *   Search by title or filter by genre.
    *   View detailed movie information including cast, synopsis, ratings, and runtime.
*   **Multi-Theatre Booking**:
    *   Browse different cinema locations.
    *   View specific "Now Showing" movies for each theatre.
    *   Select showtimes specific to a chosen theatre.
*   **Interactive Booking Flow**:
    *   **Real-time Seat Selection**: Visual seat map indicating available, booked, and selected seats.
    *   **Direct Booking**: Seamless booking process with instant confirmation.
*   **User Dashboard**:
    *   **My Bookings**: View booking history.
    *   **Digital Ticket**: Access a beautiful digital ticket for entry.
    *   **Sharing**: Share movies or tickets with friends via native share or link copy.
    *   **Favorites**: Save movies to your watchlist.
*   **Notifications**: Automated email confirmation upon successful booking.

### 🛡️ For Admins
*   **Dashboard**: Overview of system statistics.
*   **Movie Management**: specific tools to fetch and add data directly from TMDB API.
*   **Show Management**: Schedule shows for specific movies at specific theatres and times.
*   **Booking Management**: View a comprehensive list of all user bookings.

## 🛠️ Technology Stack

### Frontend (Client)
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS, Vanilla CSS
*   **Routing**: React Router DOM v7
*   **State/Context**: React Context API
*   **Icons**: Lucide React
*   **Utilities**: Axios, Html2Canvas, React Hot Toast

### Backend (Server)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Authentication**: Clerk SDK
*   **Email Service**: Nodemailer (SMTP)
*   **Payment**: Stripe (Integrated but currently set for direct booking)
*   **External APIs**: TMDB (The Movie Database) for movie data.

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB Instance (Local or Atlas)
*   TMDB API Key
*   Clerk Account keys
*   SMTP Credentials (e.g., Gmail App Password)

### 1. Clone the Repository
```bash
git clone https://github.com/Subhan030/Cinefy.git
cd Cinefy
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
TMDB_API_KEY=your_tmdb_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
STRIPE_SECRET_KEY=your_stripe_secret_key (optional if using direct booking)
```

Start the server:
```bash
npm run server
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASE_URL=http://localhost:4000
```

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser to view the app!

## 📁 Project Structure

```
Cinefy/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── assets/         # Images and icons
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Global state (AppContext)
│   │   ├── pages/          # Application pages (Home, Movies, Theaters, etc.)
│   │   │   └── admin/      # Admin dashboard pages
│   │   └── lib/            # Utilities
│   └── ...
├── server/                 # Express Backend
│   ├── config/             # DB and service configurations
│   ├── controllers/        # Route logic
│   ├── models/             # Mongoose schemas (User, Show, Movie, Booking)
│   ├── routes/             # API routes
│   └── services/           # Helper services (Email, etc.)
└── README.md
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📄 License
This project is open-source and available for personal and educational use.
