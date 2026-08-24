import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, RefreshControl, ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme, ThemeToggleButton } from '../context/ThemeContext';
import { fetchDonors, fetchHospitals, fetchBloodBanks, fetchEmergencyRequests } from '../services/api';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { isDark, theme } = useTheme();
  const [donorCount, setDonorCount] = useState(0);
  const [hospitalCount, setHospitalCount] = useState(0);
  const [bloodBankCount, setBloodBankCount] = useState(0);
  const [activeSosCount, setActiveSosCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRealTimeMetrics = async () => {
    try {
      const [donors, hospitals, banks, reqs] = await Promise.all([
        fetchDonors(),
        fetchHospitals(),
        fetchBloodBanks(),
        fetchEmergencyRequests()
      ]);
      setDonorCount(donors ? donors.length : 0);
      setHospitalCount(hospitals ? hospitals.length : 0);
      setBloodBankCount(banks ? banks.length : 0);
      setActiveSosCount(reqs ? reqs.filter(r => r.status === 'active').length : 0);
    } catch (e) {
      console.log('Metrics load error:', e);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadRealTimeMetrics();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadRealTimeMetrics();
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.bg }]} 
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />
      
      {/* Header Banner with Theme Toggle */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.appName, { color: theme.text }]}>
            🩸 Life<Text style={{ color: Colors.primary }}>Link</Text>
          </Text>
          <Text style={[styles.tagline, { color: theme.textMuted }]}>
            Hi, <Text style={{ color: theme.text, fontWeight: '800' }}>{user?.fullName || user?.name || 'User'}</Text> ({user?.role?.toUpperCase() || 'DONOR'})
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Sun / Moon Theme Toggle */}
          <ThemeToggleButton />

          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={logout}
          >
            <Text style={styles.logoutBtnText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Card */}
      <LinearGradient
        colors={['#C62828', '#E53935', '#B71C1C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <Text style={styles.heroBadge}>⚡ REAL-TIME NETWORK</Text>
        <Text style={styles.heroTitle}>Smart Blood Donor Finder</Text>
        <Text style={styles.heroSubtitle}>
          Connect with real-time verified donors, super-speciality hospitals, and certified blood centres instantly.
        </Text>
        <View style={styles.heroBtnRow}>
          <TouchableOpacity 
            style={styles.heroPrimaryBtn}
            onPress={() => navigation.navigate('Donors')}
          >
            <Text style={styles.heroPrimaryBtnText}>🔍 Find Donors Map</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.heroSosBtn}
            onPress={() => navigation.navigate('SOS Requests')}
          >
            <Text style={styles.heroSosBtnText}>🚨 Receiver SOS</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Real-Time Statistics Row (Dynamic Live Counts) */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Text style={styles.statNum}>{donorCount}</Text>
          )}
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Active Donors</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.info} />
          ) : (
            <Text style={[styles.statNum, { color: Colors.info }]}>{hospitalCount}</Text>
          )}
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Hospitals</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.success} />
          ) : (
            <Text style={[styles.statNum, { color: Colors.success }]}>{bloodBankCount}</Text>
          )}
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Blood Banks</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {loading ? (
            <ActivityIndicator size="small" color="#FF5252" />
          ) : (
            <Text style={[styles.statNum, { color: '#FF5252' }]}>{activeSosCount}</Text>
          )}
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Active SOS</Text>
        </View>
      </View>

      {/* Core Services Grid */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Essential Services</Text>
      <View style={styles.gridContainer}>
        <TouchableOpacity 
          style={[styles.gridCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Donors')}
        >
          <Text style={styles.gridIcon}>🩸</Text>
          <Text style={[styles.gridTitle, { color: theme.text }]}>Donor Map & Search</Text>
          <Text style={[styles.gridDesc, { color: theme.textMuted }]}>Interactive donor map & blood filters</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.gridCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => navigation.navigate('SOS Requests')}
        >
          <Text style={styles.gridIcon}>🚨</Text>
          <Text style={[styles.gridTitle, { color: theme.text }]}>Receiver SOS Map</Text>
          <Text style={[styles.gridDesc, { color: theme.textMuted }]}>Active patient emergency requests</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.gridCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Hospitals')}
        >
          <Text style={styles.gridIcon}>🏥</Text>
          <Text style={[styles.gridTitle, { color: theme.text }]}>Hospitals Network</Text>
          <Text style={[styles.gridDesc, { color: theme.textMuted }]}>{hospitalCount} verified hospital locations</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.gridCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Blood Banks')}
        >
          <Text style={styles.gridIcon}>🏦</Text>
          <Text style={[styles.gridTitle, { color: theme.text }]}>Blood Banks</Text>
          <Text style={[styles.gridDesc, { color: theme.textMuted }]}>{bloodBankCount} certified component centres</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 18, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  appName: { fontSize: 24, fontWeight: '900', letterSpacing: 0.5 },
  tagline: { fontSize: 12, marginTop: 2 },
  logoutBtn: { backgroundColor: 'rgba(239, 83, 80, 0.15)', borderWidth: 1, borderColor: 'rgba(239, 83, 80, 0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  logoutBtnText: { color: Colors.primary, fontSize: 11, fontWeight: '800' },
  heroCard: { borderRadius: 20, padding: 22, marginBottom: 20, shadowColor: '#E53935', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  heroBadge: { backgroundColor: 'rgba(255, 255, 255, 0.2)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, color: '#FFFFFF', fontSize: 10, fontWeight: '800', marginBottom: 10 },
  heroTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', marginBottom: 6 },
  heroSubtitle: { fontSize: 13, color: 'rgba(255, 255, 255, 0.88)', lineHeight: 18, marginBottom: 18 },
  heroBtnRow: { flexDirection: 'row', gap: 10 },
  heroPrimaryBtn: { flex: 1, backgroundColor: '#FFFFFF', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  heroPrimaryBtnText: { color: Colors.primaryDark, fontWeight: '800', fontSize: 13 },
  heroSosBtn: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.4)', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  heroSosBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  statCard: { flex: 1, borderWidth: 1, borderRadius: 14, padding: 10, alignItems: 'center' },
  statNum: { fontSize: 16, fontWeight: '900', color: Colors.primary, marginBottom: 2 },
  statLabel: { fontSize: 10, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 14 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  gridCard: { width: '48%', borderWidth: 1, borderRadius: 16, padding: 16 },
  gridIcon: { fontSize: 26, marginBottom: 8 },
  gridTitle: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  gridDesc: { fontSize: 11, lineHeight: 15 }
});
