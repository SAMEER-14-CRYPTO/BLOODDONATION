# LifeLink – Smart Blood Donor Finder 🩸

A complete full-stack blood donation platform connecting donors, seekers, hospitals, and blood banks.

## 🌟 Features

- **Donor Registration & Verification** – Sign up, verify, and manage donor profiles
- **Smart Blood Search** – Find donors by blood group, city, and distance
- **Emergency Requests** – Instant alerts to matching nearby donors
- **Hospital Directory** – Partner hospitals with blood stock status
- **Blood Bank Directory** – Real-time blood bank stock levels
- **Admin Panel** – User management, analytics, and broadcast notifications
- **Dark Mode** – Full dark theme support
- **Responsive Design** – Works on desktop, tablet, and mobile

---

## 📁 Project Structure

```
BLOODLIFE/
├── website/              # Responsive web application
│   ├── index.html        # Home page
│   ├── about.html        # About page
│   ├── register.html     # Donor registration
│   ├── login.html        # Login page
│   ├── search.html       # Donor search
│   ├── emergency.html    # Emergency request
│   ├── hospitals.html    # Hospital directory
│   ├── blood-banks.html  # Blood bank directory
│   ├── contact.html      # Contact page
│   ├── faq.html          # FAQ page
│   ├── dashboard.html    # User dashboard
│   ├── admin.html        # Admin panel
│   ├── profile.html      # Profile management
│   ├── request-history.html # Request history
│   ├── css/
│   │   ├── main.css      # Design system & globals
│   │   ├── dashboard.css # Dashboard styles
│   │   └── admin.css     # Admin panel styles
│   └── js/
│       ├── firebase-config.js # Firebase setup
│       ├── data.js        # Demo data store
│       ├── auth.js        # Authentication module
│       ├── donors.js      # Donor search module
│       ├── emergency.js   # Emergency request module
│       ├── maps.js        # Google Maps module
│       ├── admin.js       # Admin panel module
│       └── app.js         # Main app controller
│
├── flutter_app/           # Flutter mobile application
│   ├── lib/
│   │   ├── main.dart
│   │   ├── utils/theme.dart
│   │   ├── models/models.dart
│   │   ├── services/demo_data.dart
│   │   ├── providers/
│   │   │   ├── auth_provider.dart
│   │   │   ├── donor_provider.dart
│   │   │   └── request_provider.dart
│   │   └── screens/
│   │       ├── splash_screen.dart
│   │       ├── onboarding_screen.dart
│   │       ├── home_screen.dart
│   │       ├── notifications_screen.dart
│   │       ├── settings_screen.dart
│   │       ├── auth/
│   │       │   ├── login_screen.dart
│   │       │   ├── signup_screen.dart
│   │       │   └── otp_screen.dart
│   │       ├── search/
│   │       │   ├── search_donor_screen.dart
│   │       │   └── donor_detail_screen.dart
│   │       ├── emergency/
│   │       │   └── emergency_request_screen.dart
│   │       ├── hospital/
│   │       │   ├── hospital_list_screen.dart
│   │       │   └── blood_bank_screen.dart
│   │       ├── profile/
│   │       │   └── profile_screen.dart
│   │       └── admin/
│   │           └── admin_panel_screen.dart
│   └── pubspec.yaml
│
└── README.md
```

---

## 🌐 Website Setup

### Quick Start
1. Open the `website/` folder
2. Open `index.html` in a browser (or use Live Server in VS Code)
3. The website works immediately with demo data – no backend setup needed!

### Demo Login Credentials
| Role  | Email              | Password |
|-------|--------------------|----------|
| Donor | rahul@demo.com     | demo123  |
| Admin | admin@lifelink.com | admin123 |

### Firebase Integration (Optional)
1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication** (Email/Password)
3. Enable **Cloud Firestore**
4. Copy your config to `website/js/firebase-config.js`
5. Replace the placeholder values with your Firebase config

### Google Maps Integration (Optional)
1. Get an API key from https://console.cloud.google.com
2. Enable the Maps JavaScript API
3. Add the script tag to HTML pages:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY"></script>
```

---

## 📱 Flutter App Setup

### Prerequisites
- Flutter SDK 3.x+
- Dart SDK
- Android Studio or VS Code
- An Android device or emulator

### Setup Steps
```bash
cd flutter_app

# Get dependencies
flutter pub get

# Run on connected device
flutter run

# Build APK
flutter build apk
```

### Firebase Setup for Flutter
1. Install FlutterFire CLI: `dart pub global activate flutterfire_cli`
2. Run: `flutterfire configure`
3. Uncomment Firebase initialization in `main.dart`

---

## 🗄️ Database Structure (Firestore)

### Collections
- **users** – Donor/seeker profiles with blood group, location, availability
- **requests** – Emergency blood requests with urgency levels
- **hospitals** – Hospital directory with blood stock
- **blood_banks** – Blood bank stock status
- **donations** – Donation history records
- **notifications** – Push notification logs
- **chats** – Donor-seeker messages

### Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /requests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    match /hospitals/{hospitalId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#E53935` (Medical Red) |
| Primary Dark | `#C62828` |
| Accent | `#FF7043` |
| Success | `#43A047` |
| Warning | `#FB8C00` |
| Info | `#1E88E5` |
| Font | Inter |
| Border Radius | 12px / 20px |

---

## 🔐 Security Features

- Password encryption via Firebase Auth
- OTP verification for phone numbers
- Role-based access control (donor, seeker, admin)
- Protected admin panel routes
- Data validation on all forms
- Duplicate account prevention

---

## 📋 Tech Stack

| Component | Technology |
|-----------|------------|
| Website Frontend | HTML, CSS, JavaScript |
| Mobile App | Flutter / Dart |
| Backend | Firebase (Auth, Firestore, FCM, Storage) |
| Maps | Google Maps API |
| State Management | Provider (Flutter) |
| Design | Custom CSS Design System |

---

## 📄 License

This project is built for educational and humanitarian purposes.

---

**Built with ❤️ to save lives.**
