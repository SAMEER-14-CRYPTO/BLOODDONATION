// ============================================
// LIFELINK – Firebase Configuration & Database
// Project: LIFELINK APP (lifelink-app-9315f)
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyCkw1YvaS98nyeSnUrHtBzUfz9wYkRFhbo",
  authDomain: "lifelink-app-9315f.firebaseapp.com",
  projectId: "lifelink-app-9315f",
  storageBucket: "lifelink-app-9315f.firebasestorage.app",
  messagingSenderId: "59407098111",
  appId: "1:59407098111:web:df65e13d249cf26e67ecca",
  measurementId: "G-DWZ6KX9GT5"
};

// Global Firebase services
let app = null;
let auth = null;
let db = null;
let storage = null;
let messaging = null;
let analytics = null;
let DEMO_MODE = false;

function initFirebase() {
  try {
    if (typeof firebase !== 'undefined') {
      // Initialize or reuse app
      if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
      } else {
        app = firebase.app();
      }

      // Initialize Firestore & Auth
      if (firebase.auth) auth = firebase.auth();
      if (firebase.firestore) {
        db = firebase.firestore();
        // Enable offline cache persistence for reliable data sync
        try {
          db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
            // Already initialized or multiple tabs
          });
        } catch (e) {}
      }

      // Initialize Analytics
      if (firebase.analytics) {
        try {
          analytics = firebase.analytics();
        } catch (e) {}
      }

      DEMO_MODE = false;
      console.log('🔥 Connected to Live Firebase Firestore & Auth Database: lifelink-app-9315f');
      return true;
    }
  } catch (e) {
    console.warn('Firebase initialization notice:', e.message);
  }
  
  DEMO_MODE = true;
  console.log('🔶 Local fallback mode active (offline/local storage)');
  return false;
}

// Auto-initialize immediately on load
initFirebase();
