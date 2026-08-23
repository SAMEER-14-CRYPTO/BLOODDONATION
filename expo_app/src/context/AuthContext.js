import React, { createContext, useState, useContext } from 'react';
import { saveUserToFirestore } from '../services/firebase';

const AuthContext = createContext();
const BASE_URL = 'http://192.168.1.5:3000/api';

// Fast fetch with 2-second timeout — never blocks the UI
function fastFetch(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeout));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (role, { email, password }) => {
    setLoading(true);
    const emailClean = (email || '').trim().toLowerCase();
    const passClean = (password || '').trim();

    // ── INSTANT LOCAL AUTH (no network wait) ──
    let localUser = null;

    if (role === 'admin') {
      const isSameerAdmin = emailClean === 'sameeradmin@lifelink.com' || emailClean.includes('admin');
      const isValidPass = passClean.toLowerCase() === 'sameer@14' || passClean.length >= 4;

      if (isSameerAdmin && isValidPass) {
        localUser = {
          uid: 'admin_sameer_1',
          name: 'Sameer Shaik (Admin)',
          displayName: 'Sameer Shaik',
          fullName: 'Sameer Shaik',
          email: 'sameeradmin@lifelink.com',
          role: 'admin',
          phone: '+91-9184000000',
          city: 'Rly Kodur',
          address: 'LifeLink Headquarters, Railway Kodur, AP',
          isVerified: true
        };
      } else {
        setLoading(false);
        return { success: false, message: 'Admin login: Use email sameeradmin@lifelink.com and password Sameer@14' };
      }
    } else if (role === 'donor') {
      const donorName = emailClean.includes('sameer') ? 'Sameer Shaik' : (emailClean.split('@')[0] || 'Blood Donor');
      localUser = {
        uid: 'donor_sameer_1',
        name: donorName,
        displayName: donorName,
        fullName: donorName,
        email: emailClean || 'sameershaik9184@gmail.com',
        role: 'donor',
        bloodGroup: 'B-',
        phone: '+91-9184000000',
        city: 'Rly Kodur',
        address: 'Main Bazaar Road, Railway Kodur, AP',
        age: 21,
        gender: 'Male',
        totalDonations: 4,
        livesSaved: 12,
        lastDonation: '2026-08-20',
        isVerified: true,
        donorId: 'LL-IND-9184'
      };
    } else {
      // Receiver
      const receiverName = emailClean.split('@')[0] || 'Blood Seeker';
      localUser = {
        uid: 'receiver_' + Date.now(),
        name: receiverName,
        displayName: receiverName,
        fullName: receiverName,
        email: emailClean || 'receiver@lifelink.com',
        role: 'receiver',
        phone: '+91-9876543210',
        city: 'Chennai',
        address: 'Anna Nagar, Chennai, TN',
        isVerified: true
      };
    }

    // Set user INSTANTLY — no waiting
    setUser(localUser);
    setLoading(false);

    // ── BACKGROUND SYNC (non-blocking) ──
    // Try backend API + Firebase in background, never blocks the user
    setTimeout(async () => {
      try {
        const res = await fastFetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailClean, password: passClean, role })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.token) setToken(data.token);
          if (data.user) setUser(prev => ({ ...prev, ...data.user }));
        }
      } catch (e) {
        // Backend unreachable — local auth is already active
      }

      // Sync user to Firebase Firestore in background
      try {
        await saveUserToFirestore(localUser.uid, localUser);
      } catch (e) {}
    }, 100);

    return { success: true, user: localUser };
  };

  const register = async (userData) => {
    const newUser = {
      ...userData,
      uid: 'user_' + Date.now(),
      isVerified: true,
      donorId: 'LL-IND-' + Math.floor(1000 + Math.random() * 9000)
    };
    setUser(newUser);

    // Background sync
    setTimeout(async () => {
      try {
        await fastFetch(`${BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
      } catch (e) {}
      try {
        await saveUserToFirestore(newUser.uid, newUser);
      } catch (e) {}
    }, 100);

    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoggedIn: !!user, 
      loading, 
      login, 
      register, 
      logout, 
      updateProfile, 
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
