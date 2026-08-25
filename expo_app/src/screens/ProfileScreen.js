import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme, ThemeToggleButton } from '../context/ThemeContext';
import { updateUserProfileInDb } from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];

export function getDonationEligibility(lastDateStr) {
  if (!lastDateStr || lastDateStr === 'Never') {
    return {
      isEligible: true,
      text: '🟢 Eligible to donate now',
      subText: 'No recent donation on record',
      color: Colors.success
    };
  }

  const lastDate = new Date(lastDateStr);
  if (isNaN(lastDate.getTime())) {
    return {
      isEligible: true,
      text: '🟢 Eligible to donate',
      subText: '',
      color: Colors.success
    };
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (lastDate > today) {
    return {
      isEligible: false,
      isFuture: true,
      text: '❌ Invalid Future Date',
      subText: 'Donation date cannot be in the future',
      color: Colors.primary
    };
  }

  // 90 days required gap for whole blood donation
  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const requiredGap = 90;

  if (diffDays >= requiredGap) {
    return {
      isEligible: true,
      text: '🟢 Safe & Eligible to Donate',
      subText: `${diffDays} days since last donation`,
      color: Colors.success
    };
  } else {
    const remaining = requiredGap - diffDays;
    const nextDate = new Date(lastDate.getTime() + (requiredGap * 24 * 60 * 60 * 1000));
    const formattedNext = nextDate.toISOString().split('T')[0];
    return {
      isEligible: false,
      remainingDays: remaining,
      nextDate: formattedNext,
      text: `⏳ Next Eligible: ${formattedNext}`,
      subText: `Recovery gap: ${remaining} days remaining`,
      color: '#F59E0B'
    };
  }
}

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
    displayName: 'Sameer Shaik',
    fullName: 'Sameer Shaik',
    email: 'sameershaik9184@gmail.com',
    phone: '+91-9184000000',
    bloodGroup: 'B-',
    age: 21,
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

  const eligibility = getDonationEligibility(profileData.lastDonation);
  const liveFormEligibility = getDonationEligibility(editForm.lastDonation);

  const handleOpenEdit = () => {
    setEditForm({
      ...profileData,
      name: profileData.name || profileData.displayName || profileData.fullName || '',
      phone: profileData.phone || profileData.phoneNumber || '',
      bloodGroup: profileData.bloodGroup || 'B-',
      gender: profileData.gender || 'Male',
      age: profileData.age ? String(profileData.age) : '21',
      city: profileData.city || 'Rly Kodur',
      address: profileData.address || '',
      lastDonation: (profileData.lastDonation && profileData.lastDonation !== 'Never') ? profileData.lastDonation : ''
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!editForm.name || !editForm.name.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name.');
      return;
    }

    if (editForm.lastDonation && editForm.lastDonation !== 'Never') {
      const check = getDonationEligibility(editForm.lastDonation);
      if (check.isFuture) {
        Alert.alert('Validation Error', 'Last donation date cannot be in the future.');
        return;
      }
    }

    const updated = {
      ...profileData,
      ...editForm,
      name: editForm.name.trim(),
      displayName: editForm.name.trim(),
      fullName: editForm.name.trim(),
      phone: editForm.phone ? editForm.phone.trim() : profileData.phone,
      bloodGroup: editForm.bloodGroup || 'B-',
      gender: editForm.gender || 'Male',
      age: parseInt(editForm.age) || 21,
      city: editForm.city ? editForm.city.trim() : 'Rly Kodur',
      address: editForm.address ? editForm.address.trim() : '',
      lastDonation: editForm.lastDonation ? editForm.lastDonation.trim() : 'Never'
    };

    // 1. Update React Native Auth Context & local storage
    setUser(updated);

    // 2. Sync to Backend Database & Firestore
    const targetUid = profileData.uid || 'donor_sameer_1';
    await updateUserProfileInDb(token, targetUid, updated);

    setIsEditing(false);
    Alert.alert('Profile Saved ✅', 'Your details and donation records have been successfully updated in the shared database.');
  };

  const handleToggleAvailability = async (val) => {
    setIsAvailable(val);
    const targetUid = profileData.uid || 'donor_sameer_1';
    await updateUserProfileInDb(token, targetUid, { availability: val });
  };

  const handleDownloadCard = () => {
    Alert.alert(
      'Digital Donor ID Card',
      `Donor ID: ${profileData.donorId || 'LL-IND-9184'}\nName: ${profileData.name || profileData.displayName}\nBlood Group: ${profileData.bloodGroup || 'B-'}\nLast Donation: ${profileData.lastDonation || 'Never'}\nStatus: Verified Active Donor`
    );
  };

  const handleLogout = () => {
    logout();
    Alert.alert('Logged Out', 'You have been signed out.');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.scrollContent}>
      
      {/* 💳 Digital Donor ID Card */}
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
            <Text style={styles.avatarLetter}>{(profileData.name || profileData.displayName || 'U').charAt(0)}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.cardName}>{profileData.name || profileData.displayName || 'Sameer Shaik'}</Text>
            <Text style={styles.cardId}>ID: {profileData.donorId || 'LL-IND-9184'}</Text>
            <Text style={styles.cardLocation}>📍 {profileData.city || 'Rly Kodur'}, AP</Text>
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
          <Text style={[styles.statNum, { color: eligibility.isEligible ? Colors.success : '#F59E0B' }]}>
            {eligibility.isEligible ? 'Ready' : 'Resting'}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Eligibility</Text>
        </View>
      </View>

      {/* Profile Details Information Grid */}
      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>👤 Personal Details</Text>
          <TouchableOpacity onPress={handleOpenEdit}>
            <Text style={styles.editLinkText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailGrid}>
          <View style={[styles.detailItem, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>FULL NAME</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{profileData.name || profileData.displayName || 'Sameer Shaik'}</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>BLOOD GROUP</Text>
            <Text style={[styles.detailValue, { color: Colors.primary, fontWeight: '900' }]}>{profileData.bloodGroup || 'B-'}</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>PHONE NUMBER</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{profileData.phone || profileData.phoneNumber || '+91-9184000000'}</Text>
          </View>
          <View style={[styles.detailItem, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>EMAIL ADDRESS</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{profileData.email || 'sameershaik9184@gmail.com'}</Text>
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
            <Text style={[styles.detailValue, { color: theme.text }]}>{profileData.address || 'Main Road, Railway Kodur, AP'}</Text>
          </View>
          
          {/* Last Blood Donation with Live Eligibility */}
          <View style={[styles.detailItem, { width: '100%', backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border }]}>
            <Text style={[styles.detailLabel, { color: theme.textMuted }]}>LAST BLOOD DONATION & ELIGIBILITY</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>
              {profileData.lastDonation || 'Never'}
            </Text>
            <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: eligibility.color }}>
                {eligibility.text}
              </Text>
            </View>
            {eligibility.subText ? (
              <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
                {eligibility.subText}
              </Text>
            ) : null}
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
            <Text style={[styles.settingTitle, { color: theme.text }]}>Emergency Alerts Broadcast</Text>
            <Text style={[styles.settingDesc, { color: theme.textMuted }]}>Receive critical patient notifications nearby</Text>
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

            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              
              {/* Full Name */}
              <Text style={[styles.inputLabel, { color: theme.text }]}>Full Name *</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border, color: theme.text }]}
                value={editForm.name}
                placeholder="Enter full name"
                placeholderTextColor={theme.textMuted}
                onChangeText={text => setEditForm({ ...editForm, name: text })}
              />

              {/* Phone */}
              <Text style={[styles.inputLabel, { color: theme.text }]}>Phone Number</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border, color: theme.text }]}
                value={editForm.phone}
                placeholder="e.g. +91-9184000000"
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
                onChangeText={text => setEditForm({ ...editForm, phone: text })}
              />

              {/* Blood Group Selector */}
              <Text style={[styles.inputLabel, { color: theme.text }]}>Blood Group</Text>
              <View style={styles.chipRow}>
                {BLOOD_GROUPS.map(bg => (
                  <TouchableOpacity
                    key={bg}
                    style={[
                      styles.chip,
                      { borderColor: theme.border },
                      editForm.bloodGroup === bg && { backgroundColor: Colors.primary, borderColor: Colors.primary }
                    ]}
                    onPress={() => setEditForm({ ...editForm, bloodGroup: bg })}
                  >
                    <Text style={[styles.chipText, { color: editForm.bloodGroup === bg ? '#FFF' : theme.text }]}>
                      {bg}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Gender Selector */}
              <Text style={[styles.inputLabel, { color: theme.text }]}>Gender</Text>
              <View style={styles.chipRow}>
                {GENDERS.map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.chip,
                      { borderColor: theme.border },
                      editForm.gender === g && { backgroundColor: Colors.primary, borderColor: Colors.primary }
                    ]}
                    onPress={() => setEditForm({ ...editForm, gender: g })}
                  >
                    <Text style={[styles.chipText, { color: editForm.gender === g ? '#FFF' : theme.text }]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Age */}
              <Text style={[styles.inputLabel, { color: theme.text }]}>Age (18 - 65 yrs)</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border, color: theme.text }]}
                value={editForm.age ? String(editForm.age) : ''}
                placeholder="e.g. 21"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                onChangeText={text => setEditForm({ ...editForm, age: text })}
              />

              {/* City */}
              <Text style={[styles.inputLabel, { color: theme.text }]}>City</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border, color: theme.text }]}
                value={editForm.city}
                placeholder="e.g. Rly Kodur, Chennai"
                placeholderTextColor={theme.textMuted}
                onChangeText={text => setEditForm({ ...editForm, city: text })}
              />

              {/* Address */}
              <Text style={[styles.inputLabel, { color: theme.text }]}>Full Residential Address</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border, color: theme.text }]}
                value={editForm.address}
                placeholder="Street name, landmark, area"
                placeholderTextColor={theme.textMuted}
                onChangeText={text => setEditForm({ ...editForm, address: text })}
              />

              {/* Last Donation Date with Shortcuts & Live Validation */}
              <Text style={[styles.inputLabel, { color: theme.text }]}>Last Blood Donation Date (YYYY-MM-DD)</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: isDark ? '#111422' : '#F8FAFC', borderColor: theme.border, color: theme.text }]}
                value={editForm.lastDonation}
                placeholder="YYYY-MM-DD (e.g. 2026-08-20)"
                placeholderTextColor={theme.textMuted}
                onChangeText={text => setEditForm({ ...editForm, lastDonation: text })}
              />

              {/* Date Quick Shortcuts */}
              <View style={[styles.chipRow, { marginTop: 6 }]}>
                <TouchableOpacity
                  style={[styles.quickChip, { borderColor: theme.border }]}
                  onPress={() => setEditForm({ ...editForm, lastDonation: 'Never' })}
                >
                  <Text style={[styles.quickChipText, { color: theme.textMuted }]}>Never Donated</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.quickChip, { borderColor: theme.border }]}
                  onPress={() => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    setEditForm({ ...editForm, lastDonation: todayStr });
                  }}
                >
                  <Text style={[styles.quickChipText, { color: theme.textMuted }]}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.quickChip, { borderColor: theme.border }]}
                  onPress={() => {
                    const d = new Date();
                    d.setDate(d.getDate() - 95);
                    setEditForm({ ...editForm, lastDonation: d.toISOString().split('T')[0] });
                  }}
                >
                  <Text style={[styles.quickChipText, { color: theme.textMuted }]}>3+ Months Ago</Text>
                </TouchableOpacity>
              </View>

              {/* Real-time Eligibility Helper inside Modal */}
              {editForm.lastDonation ? (
                <View style={[styles.hintCard, { backgroundColor: isDark ? '#111422' : '#F1F5F9', borderColor: theme.border }]}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: liveFormEligibility.color }}>
                    {liveFormEligibility.text}
                  </Text>
                  {liveFormEligibility.subText ? (
                    <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>
                      {liveFormEligibility.subText}
                    </Text>
                  ) : null}
                </View>
              ) : null}

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
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  cardId: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  cardLocation: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    marginTop: 2,
  },
  cardBloodBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  quickChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  hintCard: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
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
