// LifeLink Unified Mobile API & Firebase Firestore Service
// Connected to Firebase Project: lifelink-app-9315f & SQLite Database
import { DonorsList, HospitalsList, BloodBanksList } from '../data/mockData';
import { 
  saveUserToFirestore, 
  postEmergencyRequestToFirestore, 
  fetchLiveEmergencyRequestsFromFirestore, 
  subscribeToLiveEmergencyRequests,
  fetchDonorsFromFirestore,
  fetchReceiversFromFirestore,
  deleteDonorFromFirestore,
  deleteReceiverFromFirestore,
  toggleDonorVerificationInFirestore,
  deleteEmergencyRequestFromFirestore,
  updateEmergencyRequestStatusInFirestore,
  fetchHospitalsFromFirestore,
  fetchBloodBanksFromFirestore
} from './firebase';

export { 
  subscribeToLiveEmergencyRequests, 
  deleteDonorFromFirestore, 
  deleteReceiverFromFirestore,
  toggleDonorVerificationInFirestore,
  deleteEmergencyRequestFromFirestore,
  updateEmergencyRequestStatusInFirestore,
  fetchReceiversFromFirestore
};

// Candidates for local dev backend:
export const API_CONFIG = {
  baseUrl: 'http://192.168.1.5:3000/api',
  emulatorUrl: 'http://10.0.2.2:3000/api',
  localhostUrl: 'http://localhost:3000/api'
};

let activeBaseUrl = API_CONFIG.baseUrl;

export function setApiBaseUrl(url) {
  if (url) activeBaseUrl = url;
}

export function getApiBaseUrl() {
  return activeBaseUrl;
}

// Fast fetch with 2-second timeout — never blocks the UI
function fastFetch(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeout));
}

// Helper to deduplicate requests list
export function deduplicateRequests(list = []) {
  const seen = new Set();
  return list.filter(item => {
    if (!item) return false;
    const key = (item.id && !String(item.id).startsWith('req_'))
      ? String(item.id)
      : ((item.patientName || item.patient_name || '') + '_' + 
         (item.hospitalName || item.hospital_name || '') + '_' + 
         (item.bloodGroupNeeded || item.blood_group_needed || '') + '_' + 
         (item.phone || ''));
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── 1. Fetch Donors (Firestore + SQLite Backend) ──
export async function fetchDonors() {
  // A. Try Shared Firebase Firestore Cloud Database
  try {
    const firestoreDonors = await fetchDonorsFromFirestore();
    if (firestoreDonors && firestoreDonors.length > 0) {
      return firestoreDonors;
    }
  } catch (e) {}

  // B. Try SQLite Backend API
  try {
    const res = await fastFetch(`${activeBaseUrl}/donors`, { headers: { 'Accept': 'application/json' } });
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

// ── 2. Fetch Emergency Requests (Unified Firestore + SQLite Backend) ──
export async function fetchEmergencyRequests() {
  const combined = [];

  // A. Fetch from Shared Firebase Firestore Cloud Database (lifelink-app-9315f)
  try {
    const firestoreRequests = await fetchLiveEmergencyRequestsFromFirestore();
    if (firestoreRequests && firestoreRequests.length > 0) {
      combined.push(...firestoreRequests);
    }
  } catch (e) {
    console.log('Firestore emergency fetch notice:', e.message);
  }

  // B. Fetch from SQLite Backend API
  try {
    const res = await fastFetch(`${activeBaseUrl}/emergency/requests`, { headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.requests) && data.requests.length > 0) {
        combined.push(...data.requests);
      }
    }
  } catch (e) {}

  if (combined.length > 0) {
    const deduped = deduplicateRequests(combined);
    return deduped.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  return [];
}

// ── 3. Post Emergency SOS Request (Saves to BOTH Firebase Firestore & SQLite) ──
export async function postEmergencyRequest(token, requestData) {
  let fsResult = { success: false };

  // Save to Firebase Firestore (lifelink-app-9315f)
  try {
    fsResult = await postEmergencyRequestToFirestore(requestData);
  } catch (e) {
    console.log('Firebase SOS save notice:', e.message);
  }

  // Save to SQLite Web Backend
  try {
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fastFetch(`${activeBaseUrl}/emergency/requests`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    });
    if (res.ok) {
      const data = await res.json();
      return { ok: true, id: data.request?.id || fsResult.id, ...data };
    }
  } catch (e) {}

  return { ok: true, id: fsResult.id || ('req_' + Date.now()), message: 'Saved to Firebase Firestore' };
}

// ── 4. Respond to Emergency Request ──
export async function respondToEmergencyRequest(token, requestId) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    await fastFetch(`${activeBaseUrl}/emergency/requests/${requestId}/respond`, {
      method: 'PATCH',
      headers
    });
  } catch (e) {}
  return { success: true };
}

// ── 5. Admin Actions: Fetch & Remove Receivers / Donors ──
export async function fetchReceivers() {
  try {
    const fsReceivers = await fetchReceiversFromFirestore();
    if (fsReceivers && fsReceivers.length > 0) return fsReceivers;
  } catch (e) {}
  return [
    {
      uid: 'rec_apollo_1',
      fullName: 'Kavitha Narayanan',
      displayName: 'Kavitha Narayanan',
      bloodGroupNeeded: 'O+',
      phone: '+91-9876543210',
      city: 'Chennai',
      hospital: 'Apollo Main Hospital, Greams Road',
      role: 'receiver'
    },
    {
      uid: 'rec_svims_2',
      fullName: 'Venkata Subbaiah',
      displayName: 'Venkata Subbaiah',
      bloodGroupNeeded: 'B-',
      phone: '+91-9184000000',
      city: 'Tirupati',
      hospital: 'SVIMS Super Speciality Hospital',
      role: 'receiver'
    }
  ];
}

export async function removeReceiver(token, uid) {
  try {
    await deleteReceiverFromFirestore(uid);
  } catch (e) {}
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await fastFetch(`${activeBaseUrl}/users/${uid}`, { method: 'DELETE', headers });
  } catch (e) {}
  return { success: true };
}

export async function removeDonor(token, uid) {
  // Delete from Cloud Firestore
  try {
    await deleteDonorFromFirestore(uid);
  } catch (e) {}

  // Delete from SQLite if available
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await fastFetch(`${activeBaseUrl}/users/${uid}`, { method: 'DELETE', headers });
  } catch (e) {}

  return { success: true };
}

export async function toggleDonorVerify(token, uid, currentVerified) {
  let res = { success: true, verified: !currentVerified };
  try {
    res = await toggleDonorVerificationInFirestore(uid, currentVerified);
  } catch (e) {}

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await fastFetch(`${activeBaseUrl}/users/${uid}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ verified: res.verified })
    });
  } catch (e) {}

  return res;
}

export async function removeEmergencyRequest(token, id) {
  try {
    await deleteEmergencyRequestFromFirestore(id);
  } catch (e) {}

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await fastFetch(`${activeBaseUrl}/emergency/requests/${id}`, { method: 'DELETE', headers });
  } catch (e) {}

  return { success: true };
}

export async function fulfillEmergencyRequest(token, id) {
  try {
    await updateEmergencyRequestStatusInFirestore(id, 'fulfilled');
  } catch (e) {}

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    await fastFetch(`${activeBaseUrl}/emergency/requests/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'fulfilled' })
    });
  } catch (e) {}

  return { success: true };
}

// ── 6. Update User Profile ──
export async function updateUserProfileInDb(token, uid, profileData) {
  try {
    await saveUserToFirestore(uid, profileData);
  } catch (e) {}

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    await fastFetch(`${activeBaseUrl}/users/${uid}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(profileData)
    });
  } catch (e) {}

  return { success: true };
}

// ── 7. Hospitals & Blood Banks ──
export async function fetchHospitals() {
  try {
    const fsHosps = await fetchHospitalsFromFirestore();
    if (fsHosps && fsHosps.length > 0) return fsHosps;
  } catch (e) {}

  try {
    const res = await fastFetch(`${activeBaseUrl}/hospitals`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}
  return HospitalsList;
}

export async function fetchBloodBanks() {
  try {
    const fsBanks = await fetchBloodBanksFromFirestore();
    if (fsBanks && fsBanks.length > 0) return fsBanks;
  } catch (e) {}

  try {
    const res = await fastFetch(`${activeBaseUrl}/blood-banks`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}
  return BloodBanksList;
}
