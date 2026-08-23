// LifeLink Mobile Firebase Configuration & Firestore Database
// Project ID: lifelink-app-9315f

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, collection, doc, setDoc, getDoc, 
  getDocs, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp 
} from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCkw1YvaS98nyeSnUrHtBzUfz9wYkRFhbo",
  authDomain: "lifelink-app-9315f.firebaseapp.com",
  projectId: "lifelink-app-9315f",
  storageBucket: "lifelink-app-9315f.firebasestorage.app",
  messagingSenderId: "59407098111",
  appId: "1:59407098111:web:df65e13d249cf26e67ecca",
  measurementId: "G-DWZ6KX9GT5"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore Database (Exact same database as Web Application)
export const db = getFirestore(app);

// Firestore Collections Constants (Exact same collections as Web App)
export const COLLECTIONS = {
  USERS: 'users',
  DONORS: 'donors',
  EMERGENCY_REQUESTS: 'emergency_requests',
  HOSPITALS: 'hospitals',
  BLOOD_BANKS: 'blood_banks'
};

// ── Firebase Firestore Helper Services ──

// 1. Save or Update User Profile in Firestore
export async function saveUserToFirestore(uid, userData) {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await setDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log('User saved to Firebase Firestore:', uid);
    return { success: true };
  } catch (e) {
    console.log('Firestore user save error:', e.message);
    return { success: false, error: e.message };
  }
}

// 2. Post Emergency Request to Firestore
export async function postEmergencyRequestToFirestore(requestData) {
  try {
    const requestsCol = collection(db, COLLECTIONS.EMERGENCY_REQUESTS);
    const docRef = await addDoc(requestsCol, {
      ...requestData,
      status: 'active',
      responses: 0,
      createdAt: serverTimestamp()
    });
    console.log('Emergency request posted to Firebase Firestore:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.log('Firestore request post error:', e.message);
    return { success: false, error: e.message };
  }
}

// 3. Fetch Live Emergency Requests from Firestore
export async function fetchLiveEmergencyRequestsFromFirestore() {
  try {
    const requestsCol = collection(db, COLLECTIONS.EMERGENCY_REQUESTS);
    const q = query(requestsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const requests = [];
    snapshot.forEach(docSnap => {
      requests.push({ id: docSnap.id, ...docSnap.data() });
    });
    return requests;
  } catch (e) {
    console.log('Firestore fetch requests error:', e.message);
    return [];
  }
}

// 4. Fetch Verified Donors from Firestore
export async function fetchDonorsFromFirestore() {
  try {
    const donorsCol = collection(db, COLLECTIONS.USERS);
    const snapshot = await getDocs(donorsCol);
    const donors = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.role === 'donor' || !data.role) {
        donors.push({ uid: docSnap.id, ...data });
      }
    });
    return donors;
  } catch (e) {
    console.log('Firestore fetch donors error:', e.message);
    return [];
  }
}

export default app;
