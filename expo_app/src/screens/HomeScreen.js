import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      
      {/* Header Banner */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>🩸 Life<Text style={{ color: Colors.primary }}>Link</Text></Text>
          <Text style={styles.tagline}>Smart Blood Donor Network</Text>
        </View>
        <TouchableOpacity 
          style={styles.aiBadgeBtn} 
          onPress={() => navigation.navigate('AI Assistant')}
        >
          <Text style={styles.aiBadgeText}>🤖 AI Assistant</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Card */}
      <LinearGradient
        colors={['#C62828', '#E53935', '#B71C1C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <Text style={styles.heroBadge}>⚡ REAL-TIME DISPATCH</Text>
        <Text style={styles.heroTitle}>Need Blood Urgently?</Text>
        <Text style={styles.heroSubtitle}>
          Connect with verified donors, hospitals, and certified blood centres instantly.
        </Text>
        <View style={styles.heroBtnRow}>
          <TouchableOpacity 
            style={styles.heroPrimaryBtn}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.heroPrimaryBtnText}>🔍 Find Donors</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.heroSosBtn}
            onPress={() => navigation.navigate('Emergency')}
          >
            <Text style={styles.heroSosBtnText}>🚨 SOS Alert</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Quick Statistics Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>1,450+</Text>
          <Text style={styles.statLabel}>Active Donors</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: Colors.info }]}>27</Text>
          <Text style={styles.statLabel}>Hospitals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: Colors.success }]}>18</Text>
          <Text style={styles.statLabel}>Blood Banks</Text>
        </View>
      </View>

      {/* Quick Menu Grid */}
      <Text style={styles.sectionTitle}>Quick Services</Text>
      <View style={styles.gridContainer}>
        <TouchableOpacity 
          style={styles.gridCard}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.gridIcon}>🩸</Text>
          <Text style={styles.gridTitle}>Find Donors</Text>
          <Text style={styles.gridDesc}>Search by blood group & city</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.gridCard}
          onPress={() => navigation.navigate('AI Assistant')}
        >
          <Text style={styles.gridIcon}>🤖</Text>
          <Text style={styles.gridTitle}>AI Matcher</Text>
          <Text style={styles.gridDesc}>ChatGPT-style medical assistant</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.gridCard}
          onPress={() => navigation.navigate('Hospitals')}
        >
          <Text style={styles.gridIcon}>🏥</Text>
          <Text style={styles.gridTitle}>Hospitals</Text>
          <Text style={styles.gridDesc}>Verified super-speciality network</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.gridCard}
          onPress={() => navigation.navigate('Blood Banks')}
        >
          <Text style={styles.gridIcon}>🏦</Text>
          <Text style={styles.gridTitle}>Blood Banks</Text>
          <Text style={styles.gridDesc}>Live component unit stocks</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.gridCard}
          onPress={() => navigation.navigate('Emergency')}
        >
          <Text style={styles.gridIcon}>🚨</Text>
          <Text style={styles.gridTitle}>Emergency SOS</Text>
          <Text style={styles.gridDesc}>1-tap urgent hospital alert</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.gridCard}
          onPress={() => navigation.navigate('Admin')}
        >
          <Text style={styles.gridIcon}>🛡️</Text>
          <Text style={styles.gridTitle}>Admin Panel</Text>
          <Text style={styles.gridDesc}>Platform management & control</Text>
        </TouchableOpacity>
      </View>

      {/* Live Web App Portal Link */}
      <TouchableOpacity 
        style={styles.webPortalBtn}
        onPress={() => navigation.navigate('Web Portal')}
      >
        <Text style={styles.webPortalText}>🌐 Open Full Web Application Mode</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  aiBadgeBtn: {
    backgroundColor: 'rgba(123, 31, 162, 0.25)',
    borderWidth: 1,
    borderColor: '#7B1FA2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  aiBadgeText: {
    color: '#BA68C8',
    fontSize: 12,
    fontWeight: '700',
  },
  heroCard: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: 18,
    marginBottom: 18,
  },
  heroBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  heroPrimaryBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  heroPrimaryBtnText: {
    color: Colors.primaryDark,
    fontWeight: '800',
    fontSize: 14,
  },
  heroSosBtn: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  heroSosBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  gridCard: {
    width: '48%',
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 16,
    padding: 16,
  },
  gridIcon: {
    fontSize: 26,
    marginBottom: 8,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  gridDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 15,
  },
  webPortalBtn: {
    backgroundColor: 'rgba(30, 136, 229, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(30, 136, 229, 0.3)',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  webPortalText: {
    color: '#42A5F5',
    fontWeight: '700',
    fontSize: 13,
  },
});
