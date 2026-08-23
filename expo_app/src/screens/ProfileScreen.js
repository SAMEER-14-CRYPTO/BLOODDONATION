import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Colors } from '../constants/theme';

export default function ProfileScreen() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile update saved.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Profile Header Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>S</Text>
        </View>
        <Text style={styles.userName}>Sameer Shaik</Text>
        <Text style={styles.userEmail}>sameershaik9184@gmail.com</Text>
        <View style={styles.bloodBadge}>
          <Text style={styles.bloodBadgeText}>🩸 Blood Group: B-</Text>
        </View>
      </View>

      {/* Donor Statistics */}
      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          <Text style={styles.statNum}>4</Text>
          <Text style={styles.statLabel}>Donations</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={[styles.statNum, { color: Colors.success }]}>12</Text>
          <Text style={styles.statLabel}>Lives Saved</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={[styles.statNum, { color: Colors.info }]}>Safe</Text>
          <Text style={styles.statLabel}>Eligibility</Text>
        </View>
      </View>

      {/* Settings Options */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Donor Controls</Text>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>Donor Availability Status</Text>
            <Text style={styles.settingDesc}>Appear in active search for emergency requests</Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#3E3E3E', true: Colors.success }}
          />
        </View>

        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
          <View>
            <Text style={styles.settingTitle}>Emergency SMS & Alerts</Text>
            <Text style={styles.settingDesc}>Receive critical patient notifications nearby</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#3E3E3E', true: Colors.primary }}
          />
        </View>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile}>
        <Text style={styles.editBtnText}>✏️ Update Donor Info</Text>
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
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  bloodBadge: {
    backgroundColor: 'rgba(229, 57, 53, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  bloodBadgeText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    maxWidth: 220,
  },
  editBtn: {
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  editBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
