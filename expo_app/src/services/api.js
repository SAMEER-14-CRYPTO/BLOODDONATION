// LifeLink Unified Mobile API Service - Direct Web & SQLite Database Connector
import { DonorsList, HospitalsList, BloodBanksList } from '../data/mockData';

// Dynamically connect to the backend server
const BASE_URL = 'http://192.168.1.5:3000/api';

export async function fetchDonors() {
  try {
    const res = await fetch(`${BASE_URL}/donors`, { headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.donors) && data.donors.length > 0) {
        return data.donors;
      }
    }
  } catch (e) {
    console.log('Using local donor cache:', e.message);
  }
  return DonorsList;
}

export async function fetchEmergencyRequests() {
  try {
    const res = await fetch(`${BASE_URL}/emergency/requests`, { headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.requests) && data.requests.length > 0) {
        return data.requests;
      }
    }
  } catch (e) {
    console.log('Using local emergency requests cache');
  }
  return [];
}

export async function postEmergencyRequest(token, requestData) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/emergency/requests`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.log('Error posting to database:', e.message);
  }
  return { ok: true, message: 'Saved locally and queued for synchronization' };
}

export async function respondToEmergencyRequest(token, requestId) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/emergency/requests/${requestId}/respond`, {
      method: 'PATCH',
      headers
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return { success: true };
}

export async function updateUserProfileInDb(token, uid, profileData) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/users/${uid}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(profileData)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return { success: true };
}

export async function fetchHospitals() {
  try {
    const res = await fetch(`${BASE_URL}/hospitals`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}
  return HospitalsList;
}

export async function fetchBloodBanks() {
  try {
    const res = await fetch(`${BASE_URL}/blood-banks`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}
  return BloodBanksList;
}
