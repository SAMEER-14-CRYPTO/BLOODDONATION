// LifeLink Mobile Firebase Configuration & Firestore Database
// Project ID: lifelink-app-9315f (Unified Cloud Backend for Web + Android)

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, collection, doc, setDoc, getDoc, 
  getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot, serverTimestamp 
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
  RECEIVERS: 'receivers',
  EMERGENCY_REQUESTS: 'emergency_requests',
  LEGACY_REQUESTS: 'requests',
  HOSPITALS: 'hospitals',
  BLOOD_BANKS: 'blood_banks',
  DONATIONS: 'donations'
};

// ── Firebase Firestore Helper Services ──

// 1. Save or Update User Profile in Firestore
export async function saveUserToFirestore(uid, userData) {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const payload = {
      ...userData,
      uid,
      fullName: userData.fullName || userData.displayName || userData.name || 'User',
      displayName: userData.displayName || userData.fullName || 'User',
      phone: userData.phone || userData.contactNumber || '',
      contactNumber: userData.phone || userData.contactNumber || '',
      bloodGroup: userData.bloodGroup || 'O+',
      city: userData.city || 'Chennai',
      role: userData.role || 'donor',
      verified: userData.verified !== false && userData.isVerified !== false,
      isVerified: userData.verified !== false && userData.isVerified !== false,
      updatedAt: serverTimestamp()
    };

    await setDoc(userRef, payload, { merge: true });

    // Mirror into role-specific collection (donors / receivers)
    if (userData.role === 'donor' || !userData.role) {
      const donorRef = doc(db, COLLECTIONS.DONORS, uid);
      await setDoc(donorRef, payload, { merge: true });
    } else if (userData.role === 'receiver') {
      const receiverRef = doc(db, COLLECTIONS.RECEIVERS, uid);
      await setDoc(receiverRef, payload, { merge: true });
    }

    console.log('User saved to Firebase Firestore:', uid);
    return { success: true };
  } catch (e) {
    console.log('Firestore user save error:', e.message);
    return { success: false, error: e.message };
  }
}

// 2. Post Emergency Request to Firestore (Single Clean Insert)
export async function postEmergencyRequestToFirestore(requestData) {
  try {
    const requestsCol = collection(db, COLLECTIONS.EMERGENCY_REQUESTS);
    const id = requestData.id || ('req_' + Date.now());
    const reqPayload = {
      ...requestData,
      id,
      requestId: id,
      patientName: requestData.patientName || requestData.patient_name || 'Patient',
      patient_name: requestData.patientName || requestData.patient_name || 'Patient',
      bloodGroupNeeded: requestData.bloodGroupNeeded || requestData.blood_group_needed || requestData.bloodGroup || 'O+',
      blood_group_needed: requestData.bloodGroupNeeded || requestData.blood_group_needed || requestData.bloodGroup || 'O+',
      bloodGroup: requestData.bloodGroupNeeded || requestData.blood_group_needed || requestData.bloodGroup || 'O+',
      unitsNeeded: parseInt(requestData.unitsNeeded || requestData.units_needed || requestData.unitsRequired || 1),
      units_needed: parseInt(requestData.unitsNeeded || requestData.units_needed || requestData.unitsRequired || 1),
      unitsRequired: parseInt(requestData.unitsNeeded || requestData.units_needed || requestData.unitsRequired || 1),
      hospitalName: requestData.hospitalName || requestData.hospital_name || 'Hospital',
      hospital_name: requestData.hospitalName || requestData.hospital_name || 'Hospital',
      location: requestData.location || requestData.city || 'Chennai',
      city: requestData.location || requestData.city || 'Chennai',
      phone: requestData.phone || requestData.contactNumber || '',
      contactNumber: requestData.phone || requestData.contactNumber || '',
      contact_number: requestData.phone || requestData.contactNumber || '',
      urgencyLevel: requestData.urgencyLevel || requestData.urgency_level || requestData.emergencyLevel || 'critical',
      urgency_level: requestData.urgencyLevel || requestData.urgency_level || requestData.emergencyLevel || 'critical',
      emergencyLevel: requestData.urgencyLevel || requestData.urgency_level || requestData.emergencyLevel || 'critical',
      notes: requestData.notes || requestData.message || '',
      message: requestData.notes || requestData.message || '',
      lat: requestData.lat != null ? requestData.lat : (requestData.latitude != null ? requestData.latitude : 13.0827),
      latitude: requestData.lat != null ? requestData.lat : (requestData.latitude != null ? requestData.latitude : 13.0827),
      lng: requestData.lng != null ? requestData.lng : (requestData.longitude != null ? requestData.longitude : 80.2707),
      longitude: requestData.lng != null ? requestData.lng : (requestData.longitude != null ? requestData.longitude : 80.2707),
      status: requestData.status || 'active',
      responses: requestData.responses || 0,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(requestsCol, reqPayload);
    console.log('Emergency request posted to Firebase Firestore:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.log('Firestore request post error:', e.message);
    return { success: false, error: e.message };
  }
}

// 3. Fetch Live Emergency Requests from Firestore (With Deduplication)
export async function fetchLiveEmergencyRequestsFromFirestore() {
  try {
    const requestsCol = collection(db, COLLECTIONS.EMERGENCY_REQUESTS);
    const q = query(requestsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const requests = [];
    const seen = new Set();

    snapshot.forEach(docSnap => {
      const d = docSnap.data();
      const id = docSnap.id || d.id || d.requestId;
      if (!seen.has(id)) {
        seen.add(id);
        requests.push({
          id,
          requestId: id,
          patientName: d.patientName || d.patient_name || 'Patient',
          patient_name: d.patientName || d.patient_name || 'Patient',
          bloodGroupNeeded: d.bloodGroupNeeded || d.bloodGroup || d.blood_group_needed || 'O+',
          blood_group_needed: d.bloodGroupNeeded || d.bloodGroup || d.blood_group_needed || 'O+',
          unitsNeeded: parseInt(d.unitsNeeded || d.units_needed || d.unitsRequired || 1),
          units_needed: parseInt(d.unitsNeeded || d.units_needed || d.unitsRequired || 1),
          hospitalName: d.hospitalName || d.hospital_name || 'Hospital',
          hospital_name: d.hospitalName || d.hospital_name || 'Hospital',
          location: d.location || d.city || 'Chennai',
          phone: d.phone || d.contactNumber || d.contact_number || '',
          contactNumber: d.phone || d.contactNumber || d.contact_number || '',
          urgencyLevel: d.urgencyLevel || d.urgency_level || d.emergencyLevel || 'critical',
          urgency_level: d.urgencyLevel || d.urgency_level || d.emergencyLevel || 'critical',
          notes: d.notes || d.message || '',
          lat: d.lat != null ? d.lat : (d.latitude != null ? d.latitude : 13.0827),
          lng: d.lng != null ? d.lng : (d.longitude != null ? d.longitude : 80.2707),
          status: d.status || 'active',
          responses: d.responses || 0,
          createdAt: d.createdAt
        });
      }
    });
    return requests;
  } catch (e) {
    console.log('Firestore fetch requests error:', e.message);
    return [];
  }
}

// 4. Real-time Live Emergency Requests Subscription (With Deduplication)
export function subscribeToLiveEmergencyRequests(callback) {
  try {
    const requestsCol = collection(db, COLLECTIONS.EMERGENCY_REQUESTS);
    const q = query(requestsCol, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const requests = [];
      const seen = new Set();

      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        const id = docSnap.id || d.id || d.requestId;
        if (!seen.has(id)) {
          seen.add(id);
          requests.push({
            id,
            requestId: id,
            patientName: d.patientName || d.patient_name || 'Patient',
            patient_name: d.patientName || d.patient_name || 'Patient',
            bloodGroupNeeded: d.bloodGroupNeeded || d.bloodGroup || d.blood_group_needed || 'O+',
            blood_group_needed: d.bloodGroupNeeded || d.bloodGroup || d.blood_group_needed || 'O+',
            unitsNeeded: parseInt(d.unitsNeeded || d.units_needed || d.unitsRequired || 1),
            units_needed: parseInt(d.unitsNeeded || d.units_needed || d.unitsRequired || 1),
            hospitalName: d.hospitalName || d.hospital_name || 'Hospital',
            hospital_name: d.hospitalName || d.hospital_name || 'Hospital',
            location: d.location || d.city || 'Chennai',
            phone: d.phone || d.contactNumber || d.contact_number || '',
            contactNumber: d.phone || d.contactNumber || d.contact_number || '',
            urgencyLevel: d.urgencyLevel || d.urgency_level || d.emergencyLevel || 'critical',
            urgency_level: d.urgencyLevel || d.urgency_level || d.emergencyLevel || 'critical',
            notes: d.notes || d.message || '',
            lat: d.lat != null ? d.lat : (d.latitude != null ? d.latitude : 13.0827),
            lng: d.lng != null ? d.lng : (d.longitude != null ? d.longitude : 80.2707),
            status: d.status || 'active',
            responses: d.responses || 0,
            createdAt: d.createdAt
          });
        }
      });
      callback(requests);
    }, (err) => {
      console.log('Firestore emergency subscription error:', err.message);
    });
  } catch (e) {
    console.log('Firestore subscribe error:', e.message);
    return null;
  }
}

// 5. Fetch Verified Donors from Firestore
export async function fetchDonorsFromFirestore() {
  try {
    const donorsCol = collection(db, COLLECTIONS.USERS);
    const snapshot = await getDocs(donorsCol);
    const donors = [];
    const seen = new Set();

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const uid = docSnap.id || data.uid;
      if ((data.role === 'donor' || !data.role) && !seen.has(uid)) {
        seen.add(uid);
        donors.push({
          uid,
          ...data,
          fullName: data.fullName || data.name || data.displayName || 'Blood Donor',
          displayName: data.displayName || data.fullName || data.name || 'Blood Donor',
          name: data.name || data.fullName || data.displayName || 'Blood Donor',
          bloodGroup: data.bloodGroup || 'O+',
          phone: data.phone || data.contactNumber || '',
          city: data.city || 'Chennai',
          role: 'donor',
          availability: data.availability !== false && data.donorStatus !== 'Inactive',
          donorStatus: data.donorStatus || (data.availability === false ? 'Inactive' : 'Active'),
          verified: data.verified !== false && data.isVerified !== false,
          isVerified: data.verified !== false && data.isVerified !== false
        });
      }
    });
    return donors;
  } catch (e) {
    console.log('Firestore fetch donors error:', e.message);
    return [];
  }
}

// 5b. Fetch Receivers from Firestore
export async function fetchReceiversFromFirestore() {
  try {
    const usersCol = collection(db, COLLECTIONS.USERS);
    const snapshot = await getDocs(usersCol);
    const receivers = [];
    const seen = new Set();

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const uid = docSnap.id || data.uid;
      if (data.role === 'receiver' && !seen.has(uid)) {
        seen.add(uid);
        receivers.push({
          uid,
          ...data,
          fullName: data.fullName || data.displayName || data.name || 'Blood Seeker',
          displayName: data.displayName || data.fullName || data.name || 'Blood Seeker',
          bloodGroupNeeded: data.bloodGroupNeeded || data.bloodGroup || 'O+',
          phone: data.phone || data.contactNumber || '',
          city: data.city || 'Chennai',
          role: 'receiver'
        });
      }
    });
    return receivers;
  } catch (e) {
    return [];
  }
}

// 6. Admin Actions: Delete Donor from Firestore
export async function deleteDonorFromFirestore(uid) {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const donorRef = doc(db, COLLECTIONS.DONORS, uid);
    await deleteDoc(userRef).catch(() => {});
    await deleteDoc(donorRef).catch(() => {});
    console.log('Donor removed from Firestore:', uid);
    return { success: true };
  } catch (e) {
    console.log('Error deleting donor:', e.message);
    return { success: false, error: e.message };
  }
}

// 6b. Admin Actions: Delete Receiver from Firestore
export async function deleteReceiverFromFirestore(uid) {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const recRef = doc(db, COLLECTIONS.RECEIVERS, uid);
    await deleteDoc(userRef).catch(() => {});
    await deleteDoc(recRef).catch(() => {});
    console.log('Receiver removed from Firestore:', uid);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// 7. Admin Actions: Toggle Donor Verification
export async function toggleDonorVerificationInFirestore(uid, currentVerified) {
  try {
    const newStatus = !currentVerified;
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const donorRef = doc(db, COLLECTIONS.DONORS, uid);
    await updateDoc(userRef, { verified: newStatus, isVerified: newStatus }).catch(() => {});
    await updateDoc(donorRef, { verified: newStatus, isVerified: newStatus }).catch(() => {});
    return { success: true, verified: newStatus };
  } catch (e) {
    console.log('Error updating donor verification:', e.message);
    return { success: false, error: e.message };
  }
}

// 8. Admin Actions: Delete Emergency Request from Firestore
export async function deleteEmergencyRequestFromFirestore(id) {
  try {
    const reqRef = doc(db, COLLECTIONS.EMERGENCY_REQUESTS, id);
    await deleteDoc(reqRef).catch(() => {});
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// 9. Admin Actions: Update Emergency Request Status (e.g. Fulfilled)
export async function updateEmergencyRequestStatusInFirestore(id, status) {
  try {
    const reqRef = doc(db, COLLECTIONS.EMERGENCY_REQUESTS, id);
    await updateDoc(reqRef, { status }).catch(() => {});
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// 10. Fetch Hospitals from Firestore
export async function fetchHospitalsFromFirestore() {
  try {
    const hospCol = collection(db, COLLECTIONS.HOSPITALS);
    const snapshot = await getDocs(hospCol);
    const hospitals = [];
    snapshot.forEach(docSnap => {
      hospitals.push({ id: docSnap.id, ...docSnap.data() });
    });
    return hospitals;
  } catch (e) {
    return [];
  }
}

// 11. Fetch Blood Banks from Firestore
export async function fetchBloodBanksFromFirestore() {
  try {
    const bankCol = collection(db, COLLECTIONS.BLOOD_BANKS);
    const snapshot = await getDocs(bankCol);
    const banks = [];
    snapshot.forEach(docSnap => {
      banks.push({ id: docSnap.id, ...docSnap.data() });
    });
    return banks;
  } catch (e) {
    return [];
  }
}

export default app;
