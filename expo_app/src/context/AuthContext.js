import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, email, role: 'donor'|'receiver'|'admin', bloodGroup, ... }

  const login = (role, credentials) => {
    if (role === 'admin') {
      if (credentials.email === 'sameeradmin@lifelink.com' && credentials.password === 'Sameer@14') {
        const adminUser = {
          name: 'Admin Sameer',
          email: credentials.email,
          role: 'admin',
          phone: '+91-9184000000',
          city: 'Rly Kodur',
          isVerified: true
        };
        setUser(adminUser);
        return { success: true };
      }
      return { success: false, message: 'Invalid Admin credentials' };
    }

    if (role === 'donor') {
      const donorUser = {
        name: credentials.email ? credentials.email.split('@')[0] : 'Sameer Shaik',
        email: credentials.email || 'sameershaik9184@gmail.com',
        role: 'donor',
        bloodGroup: 'B-',
        phone: '+91-9184000000',
        city: 'Rly Kodur',
        address: 'Main Road, Railway Kodur',
        age: '21',
        gender: 'Male',
        totalDonations: 4,
        livesSaved: 12,
        lastDonation: '2026-08-20',
        isVerified: true,
        donorId: 'LL-IND-9184'
      };
      setUser(donorUser);
      return { success: true };
    }

    // Receiver
    const receiverUser = {
      name: credentials.email ? credentials.email.split('@')[0] : 'Patient Receiver',
      email: credentials.email || 'receiver@lifelink.com',
      role: 'receiver',
      phone: '+91-9876543210',
      city: 'Chennai',
      isVerified: true
    };
    setUser(receiverUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
