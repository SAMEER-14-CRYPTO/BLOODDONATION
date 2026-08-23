import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';

export default function ProfileScreen() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // User Profile State
  const [userData, setUserData] = useState({
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
    isVerified: true
  });

  const [editForm, setEditForm] = useState({ ...userData });

  const handleSaveProfile = () => {
    setUserData({ ...editForm });
    setIsEditing(false);
    Alert.alert('Profile Saved', 'Your donor details have been updated successfully.');
  };

  const handleDownloadCard = () => {
    Alert.alert('Digital Donor Card', `Donor ID: ${userData.donorId}\nName: ${userData.name}\nBlood Group: ${userData.bloodGroup}\nStatus: Verified Active Donor`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* 💳 Digital Donor ID Card (Web-Style) */}
      <LinearGradient
        colors={['#191C2E', '#232842', '#141724']}
        style={styles.donorCard}
      >
        <View style={styles.cardTopRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 16 }}>🩸</Text>
            <Text style={styles.cardBrand}>Life<Text style={{ color: Colors.primary }}>Link</Text> DONOR ID</Text>
          </View>
          <View style={styles.verifiedTag}>
            <Text style={styles.verifiedTagText}>✓ VERIFIED</Text>
          </View>
        </View>

        <View style={styles.cardMainRow}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarLetter}>{userData.name.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.cardName}>{userData.name}</Text>
            <Text style={styles.cardId}>ID: {userData.donorId}</Text>
            <Text style={styles.cardLocation}>📍 {userData.city}, AP</Text>
          </View>
          <View style={styles.cardBloodBadge}>
            <Text style={styles.cardBloodText}>{userData.bloodGroup}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterText}>Emergency Contact: {userData.phone}</Text>
          <TouchableOpacity onPress={handleDownloadCard}>
            <Text style={styles.cardDownloadText}>📥 Save Card</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats Overview */}
      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          <Text style={styles.statNum}>{userData.totalDonations}</Text>
          <Text style={styles.statLabel}>Donations</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={[styles.statNum, { color: Colors.success }]}>{userData.livesSaved}</Text>
          <Text style={styles.statLabel}>Lives Saved</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={[styles.statNum, { color: Colors.info }]}>Eligible</Text>
          <Text style={styles.statLabel}>Readiness</Text>
        </View>
      </View>

      {/* Profile Details Information Grid */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>👤 Personal Details</Text>
          <TouchableOpacity onPress={() => { setEditForm({ ...userData }); setIsEditing(true); }}>
            <Text style={styles.editLinkText}>✏️ Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{userData.name}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Blood Group</Text>
            <Text style={[styles.detailValue, { color: Colors.primary, fontWeight: '800' }]}>{userData.bloodGroup}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Contact Phone</Text>
            <Text style={styles.detailValue}>{userData.phone}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Email Address</Text>
            <Text style={styles.detailValue}>{userData.email}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Age / Gender</Text>
            <Text style={styles.detailValue}>{userData.age} yrs • {userData.gender}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>City / Location</Text>
            <Text style={styles.detailValue}>{userData.city}</Text>
          </View>
          <View style={[styles.detailItem, { width: '100%' }]}>
            <Text style={styles.detailLabel}>Full Residential Address</Text>
            <Text style={styles.detailValue}>{userData.address}, {userData.pincode}</Text>
          </View>
          <View style={[styles.detailItem, { width: '100%' }]}>
            <Text style={styles.detailLabel}>Last Blood Donation</Text>
            <Text style={styles.detailValue}>{userData.lastDonation} (Safe & eligible to donate)</Text>
          </View>
        </View>
      </View>

      {/* Donor Controls & Availability Switch */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>⚙️ Donor Settings</Text>

        <View style={styles.settingRow}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.settingTitle}>Donor Availability Status</Text>
            <Text style={styles.settingDesc}>
              {isAvailable ? '🟢 You appear in active search for emergency patients' : '⚪ You are currently marked busy'}
            </Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#3E3E3E', true: Colors.success }}
          />
        </View>

        <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.settingTitle}>Emergency SMS & Broadcast Alerts</Text>
            <Text style={styles.settingDesc}>Receive critical patient notifications within 15 km</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#3E3E3E', true: Colors.primary }}
          />
        </View>
      </View>

      {/* Recent Activity Feed (Web-style) */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>📋 Recent Activity</Text>
        <View style={styles.activityItem}>
          <View style={[styles.activityDot, { backgroundColor: Colors.primary }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.activityText}>Emergency Alert responded at SVIMS Hospital, Tirupati</Text>
            <Text style={styles.activityTime}>2 days ago</Text>
          </View>
        </View>
        <View style={styles.activityItem}>
          <View style={[styles.activityDot, { backgroundColor: Colors.success }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.activityText}>Blood donation verified at Area Govt Hospital, Rly Kodur</Text>
            <Text style={styles.activityTime}>1 week ago</Text>
          </View>
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal visible={isEditing} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>✏️ Edit Donor Profile</Text>

            <ScrollView style={{ maxHeight: 400 }}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.modalInput}
                value={editForm.name}
                onChangeText={text => setEditForm({ ...editForm, name: text })}
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.modalInput}
                value={editForm.phone}
                onChangeText={text => setEditForm({ ...editForm, phone: text })}
              />

              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.modalInput}
                value={editForm.city}
                onChangeText={text => setEditForm({ ...editForm, city: text })}
              />

              <Text style={styles.inputLabel}>Full Address</Text>
              <TextInput
                style={styles.modalInput}
                value={editForm.address}
                onChangeText={text => setEditForm({ ...editForm, address: text })}
              />

              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.modalInput}
                value={editForm.age}
                keyboardType="numeric"
                onChangeText={text => setEditForm({ ...editForm, age: text })}
              />
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditing(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
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
    backgroundColor: Colors.bgDark,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  donorCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D3452',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
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
    backgroundColor: 'rgba(67, 160, 71, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(67, 160, 71, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedTagText: {
    color: Colors.success,
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
    backgroundColor: Colors.primary,
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
    fontSize: 16,
    fontWeight: '900',
  },
  cardId: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  cardLocation: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  cardBloodBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(229, 57, 53, 0.2)',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBloodText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardFooterText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  cardDownloadText: {
    color: '#42A5F5',
    fontWeight: '700',
    fontSize: 11,
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  editLinkText: {
    color: '#42A5F5',
    fontSize: 12,
    fontWeight: '700',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    width: '48%',
    backgroundColor: Colors.bgDark,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  detailLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
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
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activityText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  activityTime: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: Colors.bgDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 10,
    color: '#FFFFFF',
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
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
  },
});
