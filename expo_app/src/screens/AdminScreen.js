import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Colors } from '../constants/theme';
import { DonorsList } from '../data/mockData';

export default function AdminScreen() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [donors, setDonors] = useState(DonorsList);

  const handleAdminLogin = () => {
    if (email.trim() === 'sameeradmin@lifelink.com' && password === 'Sameer@14') {
      setIsAdminLoggedIn(true);
      Alert.alert('Welcome Admin', 'Administrator privileges granted.');
    } else {
      Alert.alert('Access Denied', 'Invalid administrator email or password.');
    }
  };

  const toggleVerify = (uid) => {
    setDonors(prev => prev.map(d => d.uid === uid ? { ...d, verified: !d.verified } : d));
  };

  if (!isAdminLoggedIn) {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginCard}>
          <Text style={styles.loginIcon}>🛡️</Text>
          <Text style={styles.loginTitle}>Admin Control Login</Text>
          <Text style={styles.loginSub}>Restricted access for LifeLink administrative staff only.</Text>

          <Text style={styles.label}>Admin Email</Text>
          <TextInput
            style={styles.input}
            placeholder="sameeradmin@lifelink.com"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleAdminLogin}>
            <Text style={styles.loginBtnText}>Sign In as Administrator</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.adminHeader}>
        <View>
          <Text style={styles.adminTitle}>Admin Control Center</Text>
          <Text style={styles.adminSub}>Logged in: sameeradmin@lifelink.com</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setIsAdminLoggedIn(false)}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricNum}>{donors.length}</Text>
          <Text style={styles.metricLabel}>Total Donors</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricNum, { color: Colors.success }]}>
            {donors.filter(d => d.verified).length}
          </Text>
          <Text style={styles.metricLabel}>Verified</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricNum, { color: Colors.info }]}>
            {donors.filter(d => d.availability).length}
          </Text>
          <Text style={styles.metricLabel}>Available</Text>
        </View>
      </View>

      {/* Donor Verification Management List */}
      <Text style={styles.sectionTitle}>Donor Verification Management</Text>
      {donors.map(donor => (
        <View key={donor.uid} style={styles.donorRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.donorName}>{donor.displayName} ({donor.bloodGroup})</Text>
            <Text style={styles.donorMeta}>📍 {donor.city} • 📞 {donor.phone}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.verifyToggleBtn, donor.verified ? styles.verifiedBtn : styles.unverifiedBtn]}
            onPress={() => toggleVerify(donor.uid)}
          >
            <Text style={[styles.verifyToggleText, donor.verified ? styles.verifiedText : styles.unverifiedText]}>
              {donor.verified ? '✓ Verified' : 'Verify'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loginContainer: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    justifyContent: 'center',
    padding: 20,
  },
  loginCard: {
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 24,
    padding: 24,
  },
  loginIcon: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 10,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  loginSub: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: Colors.bgDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 12,
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 22,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  adminSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 83, 80, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  metricNum: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  donorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  donorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  donorMeta: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  verifyToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  verifiedBtn: {
    backgroundColor: 'rgba(67, 160, 71, 0.15)',
    borderColor: 'rgba(67, 160, 71, 0.3)',
  },
  unverifiedBtn: {
    backgroundColor: 'rgba(251, 140, 0, 0.15)',
    borderColor: 'rgba(251, 140, 0, 0.3)',
  },
  verifiedText: {
    color: Colors.success,
    fontWeight: '700',
    fontSize: 11,
  },
  unverifiedText: {
    color: Colors.warning,
    fontWeight: '700',
    fontSize: 11,
  },
});
