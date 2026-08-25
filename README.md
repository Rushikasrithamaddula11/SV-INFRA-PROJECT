# Verandah Estates - Real Estate Platform

A complete real estate management platform built with React and Firebase, featuring a public-facing property listing website and a powerful admin panel for managing properties, bookings, and users.

## 🌟 Features

### Public Website
- **Property Listings** - Browse villas, apartments, plots, and projects
- **Advanced Filtering** - Search by location, type, price range, and more
- **Property Details** - Comprehensive property information with image galleries
- **User Accounts** - Registration, login, and profile management
- **Favorites** - Save properties for later viewing
- **Bookings** - Book property viewings with date and time selection
- **Site Visits** - Schedule on-site property visits
- **Enquiries** - Send enquiries directly to the sales team
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### Admin Panel
- **Dashboard** - Overview of properties, bookings, users, and enquiries
- **Property Management** - Add, edit, delete properties with full details
- **Booking Management** - View and update booking statuses
- **Site Visit Management** - Manage scheduled property visits
- **Enquiry Management** - Track and respond to customer enquiries
- **User Management** - View users and manage admin roles
- **Role-Based Access** - Secure admin-only access with authentication

## 🚀 Tech Stack

- **Frontend**: React 18
- **Routing**: React Router DOM
- **Authentication**: Firebase Authentication
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **Styling**: Custom CSS with CSS Variables
- **Icons**: React Icons
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Git

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
cd verandah-estates
npm install
```

### 2. Firebase Setup

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once created, click on the Web icon (</>) to add a web app
4. Copy the Firebase configuration

#### Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method

#### Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode** (we'll add rules next)
4. Choose a location closest to your users

#### Enable Storage
1. Go to **Storage**
2. Click "Get started"
3. Start in **production mode**

### 3. Configure Firebase in the App

Your Firebase configuration is already set in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAEZ1Xl4Io13EF7f3_z2-IUavbQf3oA-P0",
  authDomain: "sami-b1b53.firebaseapp.com",
  projectId: "sami-b1b53",
  storageBucket: "sami-b1b53.firebasestorage.app",
  messagingSenderId: "1018059043047",
  appId: "1:1018059043047:web:951c1582282fb047d73242",
  measurementId: "G-YDJCWPJG7P"
};
```

### 4. Deploy Security Rules

#### Firestore Rules
1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Copy the content from `firestore.rules` and paste it
3. Click "Publish"

#### Storage Rules
1. In Firebase Console, go to **Storage** → **Rules**
2. Copy the content from `storage.rules` and paste it
3. Click "Publish"

### 5. Seed Initial Data

#### Start the development server:
```bash
npm start
```

#### Open the browser console (F12) and run:

```javascript
// Import the seed functions
import { seedProperties, createAdminUser } from './utils/seedData';

// Seed properties
await window.runAllSeeds();

// Create admin user
await window.createAdminUser('admin@verandahestates.com', 'admin123', 'Admin User');
```

Or you can run these commands directly in the browser console after the app loads:

```javascript
// Seed all properties
await window.runAllSeeds();

// Create admin account
await window.createAdminUser('admin@verandahestates.com', 'admin123', 'Admin User');
```

## 🎯 Usage

### Public Website
1. Visit `http://localhost:3000`
2. Browse properties, search, and filter
3. Register/Login to save favorites and book properties
4. View property details and schedule visits

### Admin Panel
1. Visit `http://localhost:3000/admin/login`
2. Login with admin credentials:
   - Email: `admin@verandahestates.com`
   - Password: `admin123`
3. Manage properties, bookings, and users

## 📁 Project Structure

```
verandah-estates/
├── public/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── PropertyCard.js
│   │   └── AuthModal.js
│   ├── context/            # React Context providers
│   │   ├── AuthContext.js
│   │   └── ToastContext.js
│   ├── pages/              # Page components
│   │   ├── Home.js
│   │   ├── Properties.js
│   │   ├── PropertyDetail.js
│   │   ├── Favorites.js
│   │   ├── Account.js
│   │   ├── About.js
│   │   └── admin/          # Admin pages
│   │       ├── AdminLogin.js
│   │       ├── AdminDashboard.js
│   │       ├── AdminProperties.js
│   │       ├── AdminBookings.js
│   │       └── AdminUsers.js
│   ├── utils/              # Utility functions
│   │   └── seedData.js
│   ├── firebase.js         # Firebase configuration
│   ├── App.js              # Main app component
│   ├── index.js            # App entry point
│   └── index.css           # Global styles
├── firestore.rules         # Firestore security rules
├── storage.rules           # Storage security rules
├── package.json
└── README.md
```

## 🎨 Color Scheme

The application uses a custom design system with these primary colors:

- **Ink** (#1B1F1C) - Primary dark color
- **Paper** (#EDE8DC) - Background color
- **Brass** (#B48A4A) - Accent color
- **Moss** (#45573F) - Success/available
- **Rust** (#A14E2A) - Warning/alert
- **Teak** (#6E4A30) - Secondary accent
- **Cream** (#F5F1E7) - Light background

## 🔐 Security

- Authentication required for user actions (bookings, favorites)
- Role-based access control for admin panel
- Firestore security rules prevent unauthorized access
- Input validation and sanitization
- Secure password handling via Firebase Auth

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (680px - 1024px)
- Mobile (< 680px)

## 🚢 Deployment

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Hosting
# - Use existing project (select your project)
# - Public directory: build
# - Single-page app: Yes
# - Automatic builds: No

# Build the app
npm run build

# Deploy
firebase deploy
```

## 🧪 Testing Accounts

After seeding, you can create test accounts:

**Admin Account:**
- Email: admin@verandahestates.com
- Password: admin123

**Create Test User:**
Register through the website or use:
```javascript
await window.createAdminUser('user@example.com', 'password123', 'Test User');
```
Then change role from 'admin' to 'user' in Firestore.

## 📝 Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify your Firebase configuration in `src/firebase.js`
- Check that Authentication, Firestore, and Storage are enabled
- Ensure security rules are deployed

### Seeding Fails
- Make sure you're logged in as admin
- Check browser console for specific errors
- Verify Firestore security rules allow writes

### Admin Panel Access Denied
- Ensure user has `role: 'admin'` in Firestore users collection
- Clear browser cache and cookies
- Try logging out and back in

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support and questions:
- Email: hello@verandahestates.example
- Phone: +91 40 2345 6789
- WhatsApp: [Click to chat](https://wa.me/914023456789)

## 🎉 Acknowledgments

- Design inspired by modern real estate platforms
- Built with Create React App
- Powered by Firebase
- Icons from React Icons
- Date formatting by date-fns

---

**Built with ❤️ for real estate professionals**
# swami-properties
