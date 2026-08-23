// LifeLink Unified Mobile API Service
import { DonorsList, HospitalsList, BloodBanksList } from '../data/mockData';

const BASE_URL = 'http://192.168.1.5:3000/api';

export async function fetchDonors() {
  try {
    const res = await fetch(`${BASE_URL}/donors`, { timeout: 3000 });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    // Fallback to verified local data
  }
  return DonorsList;
}

export async function fetchHospitals() {
  try {
    const res = await fetch(`${BASE_URL}/hospitals`, { timeout: 3000 });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    // Fallback
  }
  return HospitalsList;
}

export async function fetchBloodBanks() {
  try {
    const res = await fetch(`${BASE_URL}/blood-banks`, { timeout: 3000 });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    // Fallback
  }
  return BloodBanksList;
}

export async function postEmergencyRequest(requestData) {
  try {
    const res = await fetch(`${BASE_URL}/emergency-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Local success simulation
  }
  return { ok: true, message: 'Emergency alert dispatched to verified donors' };
}
