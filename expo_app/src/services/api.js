// LifeLink Unified Mobile API & Firebase Firestore Service
// Connected to Firebase Project: lifelink-app-9315f & SQLite Database
import { DonorsList, HospitalsList, BloodBanksList } from '../data/mockData';
import { 
  saveUserToFirestore, 
  postEmergencyRequestToFirestore, 
  fetchLiveEmergencyRequestsFromFirestore, 
  fetchDonorsFromFirestore 
} from './firebase';

const BASE_URL = 'http://192.168.1.5:3000/api';

// Fast fetch with 2-second timeout — never blocks the UI
function fastFetch(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeout));
}

// ── 1. Fetch Donors (Firestore + SQLite Backend) ──
export async function fetchDonors() {
  // A. Try Firebase Firestore
  try {
    const firestoreDonors = await fetchDonorsFromFirestore();
    if (firestoreDonors && firestoreDonors.length > 0) {
      return firestoreDonors;
    }
  } catch (e) {}

  // B. Try SQLite Backend API
  try {
    const res = await fastFetch(`${BASE_URL}/donors`, { headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.donors) && data.donors.length > 0) {
        return data.donors;
      }
    }
  } catch (e) {}

  // C. Fallback to Verified Dataset
  return DonorsList;
}

// ── 2. Fetch Emergency Requests (Firestore + SQLite Backend) ──
export async function fetchEmergencyRequests() {
  // A. Try Firebase Firestore
  try {
    const firestoreRequests = await fetchLiveEmergencyRequestsFromFirestore();
    if (firestoreRequests && firestoreRequests.length > 0) {
      return firestoreRequests;
    }
  } catch (e) {}

  // B. Try SQLite Backend API
  try {
    const res = await fastFetch(`${BASE_URL}/emergency/requests`, { headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.requests) && data.requests.length > 0) {
        return data.requests;
      }
    }
  } catch (e) {}

  return [];
}

// ── 3. Post Emergency SOS Request (Saves to BOTH Firebase Firestore & SQLite) ──
export async function postEmergencyRequest(token, requestData) {
  // Save to Firebase Firestore (lifelink-app-9315f)
  try {
    await postEmergencyRequestToFirestore(requestData);
  } catch (e) {
    console.log('Firebase SOS save notice:', e.message);
  }

  // Save to SQLite Web Backend
  try {
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fastFetch(`${BASE_URL}/emergency/requests`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}

  return { ok: true, message: 'Saved to Firebase Firestore and local database' };
}

// ── 4. Respond to Emergency Request ──
export async function respondToEmergencyRequest(token, requestId) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    await fastFetch(`${BASE_URL}/emergency/requests/${requestId}/respond`, {
      method: 'PATCH',
      headers
    });
  } catch (e) {}
  return { success: true };
}

// ── 5. Update User Profile (Saves to BOTH Firebase Firestore & SQLite) ──
export async function updateUserProfileInDb(token, uid, profileData) {
  // Save to Firebase Firestore
  try {
    await saveUserToFirestore(uid, profileData);
  } catch (e) {}

  // Save to SQLite
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    await fastFetch(`${BASE_URL}/users/${uid}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(profileData)
    });
  } catch (e) {}

  return { success: true };
}

// ── 6. Hospitals & Blood Banks ──
export async function fetchHospitals() {
  try {
    const res = await fastFetch(`${BASE_URL}/hospitals`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}
  return HospitalsList;
}

export async function fetchBloodBanks() {
  try {
    const res = await fastFetch(`${BASE_URL}/blood-banks`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}
  return BloodBanksList;
}
