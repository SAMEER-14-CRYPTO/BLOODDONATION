// ============================================
// LIFELINK – Firebase Configuration
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyBRoujrcfoLg6T0hQZekqivufnlSblyf5o",
  authDomain: "blood-donation-app-621d1.firebaseapp.com",
  projectId: "blood-donation-app-621d1",
  storageBucket: "blood-donation-app-621d1.firebasestorage.app",
  messagingSenderId: "313909561664",
  appId: "1:313909561664:web:5beb4c2b186a5bd98e52a5",
  measurementId: "G-JGDM48H21Y"
};

// Firebase CDN modules (loaded via script tags in HTML)
let app, auth, db, storage, messaging;

function initFirebase() {
  try {
    if (typeof firebase !== 'undefined') {
      app = firebase.initializeApp(firebaseConfig);
      auth = firebase.auth();
      db = firebase.firestore();
      
      if (firebase.messaging && firebase.messaging.isSupported()) {
        messaging = firebase.messaging();
      }
      console.log('✅ Firebase initialized and connected to blood-donation-app-621d1');
      return true;
    }
  } catch (e) {
    console.warn('Firebase not loaded, using demo mode:', e.message);
  }
  return false;
}

// Demo mode flag - when Firebase is not configured
const DEMO_MODE = !initFirebase() || firebaseConfig.apiKey === 'YOUR_API_KEY';

if (DEMO_MODE) {
  console.log('🔶 Running in DEMO MODE - Firebase not configured');
}
