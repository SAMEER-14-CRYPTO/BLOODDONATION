import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme, ThemeToggleButton } from '../context/ThemeContext';
import { updateUserProfileInDb } from '../services/api';

export default function ProfileScreen({ navigation }) {
  const { user, token, isLoggedIn, logout, setUser } = useAuth();
  const { isDark, theme } = useTheme();
  const [isAvailable, setIsAvailable] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Profile data fallback
  const profileData = user || {
    uid: 'donor_sameer_1',
    name: 'Sameer Shaik',
    email: 'sameershaik9184@gmail.com',
    phone: '+91-9184000000',
    bloodGroup: 'B-',
    age: '21',
    gender: 'Male',
    city: 'Rly Kodur',
    address: 'Main Bazaar Road, Railway Kodur',
    pincode: '516101',
    donorId: 'LL-IND-9184',
    totalDonations: 4,
    livesSaved: 12,
    lastDonation: '2026-08-20',
    role: 'donor',
    isVerified: true
  };

  const [editForm, setEditForm] = useState({ ...profileData });

  const handleSaveProfile = async () => {
    const updated = { ...profileData, ...editForm };
    setUser(updated);
    if (token && profileData.uid) {
      await updateUserProfileInDb(token, profileData.uid, editForm);
    }
    setIsEditing(false);
    Alert.alert('Profile Saved', 'Your details have been updated in the shared database.');
  };

  const handleToggleAvailability = async (val) => {
    setIsAvailable(val);
    if (token && profileData.uid) {
      await updateUserProfileInDb(token, profileData.uid, { availability: val });
    }
  };

  const handleDownloadCard = () => {
    Alert.alert('Digital Donor Card', `Donor ID: ${profileData.donorId || 'LL-IND-9184'}\nName: ${profileData.name}\nBlood Group: ${profileData.bloodGroup || 'B-'}\nStatus: Verified Active Donor`);
  };

  const handleLogout = () => {
    logout();
    Alert.alert('Logged Out', 'You have been signed out.');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.scrollContent}>
      
      {/* 💳 Digital Donor ID Card (Vibrant Gradient in both Light & Dark) */}
      <LinearGradient
        colors={['#C62828', '#E53935', '#B71C1C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.donorCard}
      >
        <View style={styles.cardTopRow}>
          <Text style={styles.cardBrand}>🩸 LifeLink Verified Donor ID</Text>
          <View style={styles.verifiedTag}>
            <Text style={styles.verifiedTagText}>✓ VERIFIED</Text>
          </View>
        </View>

        <View style={styles.cardMainRow}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarLetter}>{(profileData.name || 'U').charAt(0)}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.cardName}>{profileData.name}</Text>
            <Text style={styles.cardId}>ID: {profileData.donorId || 'LL-IND-9184'}</Text>
            <Text style={styles.cardLocation}>📍 {profileData.city || 'Chennai'}, AP</Text>
          </View>
          <View style={styles.cardBloodBadge}>
            <Text style={styles.cardBloodText}>{profileData.bloodGroup || 'B-'}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterText}>Emergency: {profileData.phone || '+91-9184000000'}</Text>
          <TouchableOpacity onPress={handleDownloadCard}>
            <Text style={styles.cardDownloadText}>📥 Save Card</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats Overview */}
      <View style={[styles.statsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.statCol}>
          <Text style={styles.statNum}>{profileData.totalDonations || 4}</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Donations</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={[styles.statNum, { color: Colors.success }]}>{profileData.livesSaved || 12}</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Lives Saved</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={[styles.statNum, { color: Colors.info }]}>Eligible</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Readiness</Text>
        </View>
      </View>

      {/* Profile Details Information Grid (High Contrast in Light & Dark Mode) */}
      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>👤 Personal Details</Text>
          <TouchableOpacity onPress={() => { setEditForm({ ...profileData }); setIsEditing(true); }}>
            <Text style={styles.editLinkText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailGrid}>
          <View style={[styles.detailItem, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>FULL NAME</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{profileData.name}</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>BLOOD GROUP</Text>
            <Text style={[styles.detailValue, { color: Colors.primary, fontWeight: '900' }]}>{profileData.bloodGroup || 'B-'}</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>PHONE NUMBER</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{profileData.phone}</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>EMAIL ADDRESS</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{profileData.email}</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>AGE / GENDER</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{profileData.age || 21} yrs • {profileData.gender || 'Male'}</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>CITY / LOCATION</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{profileData.city || 'Rly Kodur'}</Text>
          </View>
          <View style={[styles.detailItem, { width: '100%', backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>FULL RESIDENTIAL ADDRESS</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{profileData.address || 'Main Road, Railway Kodur'}</Text>
          </View>
          <View style={[styles.detailItem, { width: '100%', backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>LAST BLOOD DONATION</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{profileData.lastDonation || '2026-08-20'} (Safe & eligible to donate)</Text>
          </View>
        </View>
      </View>

      {/* Donor Controls & Availability Switch */}
      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>⚙️ Donor Settings</Text>

        <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={[styles.settingTitle, { color: theme.text }]}>Donor Availability Status</Text>
            <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
              {isAvailable ? '🟢 You appear in active search for emergency patients' : '⚪ You are currently marked busy'}
            </Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={handleToggleAvailability}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#3E3E3E', true: Colors.success }}
          />
        </View>

        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={[styles.settingTitle, { color: theme.text }]}>Emergency SMS & Broadcast Alerts</Text>
            <Text style={[styles.settingDesc, { color: theme.textMuted }]}>Receive critical patient notifications within 15 km</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#3E3E3E', true: Colors.primary }}
          />
        </View>
      </View>

      {/* Account Action Buttons */}
      <View style={{ gap: 10, marginTop: 6, marginBottom: 20 }}>
        {isLoggedIn ? (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>🚪 Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginBtnText}>🔑 Sign In / Switch Account</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={isEditing} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>✏️ Edit Donor Profile</Text>

            <ScrollView style={{ maxHeight: 380 }}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Full Name</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border, color: theme.text }]}
                value={editForm.name}
                onChangeText={text => setEditForm({ ...editForm, name: text })}
              />

              <Text style={[styles.inputLabel, { color: theme.text }]}>Phone Number</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border, color: theme.text }]}
                value={editForm.phone}
                onChangeText={text => setEditForm({ ...editForm, phone: text })}
              />

              <Text style={[styles.inputLabel, { color: theme.text }]}>City</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border, color: theme.text }]}
                value={editForm.city}
                onChangeText={text => setEditForm({ ...editForm, city: text })}
              />

              <Text style={[styles.inputLabel, { color: theme.text }]}>Full Address</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border, color: theme.text }]}
                value={editForm.address}
                onChangeText={text => setEditForm({ ...editForm, address: text })}
              />

              <Text style={[styles.inputLabel, { color: theme.text }]}>Age</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border, color: theme.text }]}
                value={editForm.age ? String(editForm.age) : ''}
                keyboardType="numeric"
                onChangeText={text => setEditForm({ ...editForm, age: text })}
              />
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: theme.border }]} onPress={() => setIsEditing(false)}>
                <Text style={[styles.cancelBtnText, { color: theme.textMuted }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  donorCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardBrand: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  verifiedTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedTagText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 10,
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  cardId: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    marginTop: 1,
    fontWeight: '600',
  },
  cardLocation: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    marginTop: 1,
  },
  cardBloodBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardBloodText: {
    color: Colors.primaryDark,
    fontSize: 16,
    fontWeight: '900',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardFooterText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
  },
  cardDownloadText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  statsCard: {
    flexDirection: 'row',
    borderWidth: 1,
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
    marginTop: 2,
    fontWeight: '600',
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  editLinkText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailItem: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  settingDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 83, 80, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.3)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelBtnText: {
    fontWeight: '800',
    fontSize: 13,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
