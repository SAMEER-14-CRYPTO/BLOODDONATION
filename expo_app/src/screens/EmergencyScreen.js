import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Linking, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { postEmergencyRequest } from '../services/api';

const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export default function EmergencyScreen() {
  const { user, token } = useAuth();
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [hospitalName, setHospitalName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [units, setUnits] = useState('1');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!patientName.trim() || !hospitalName.trim() || !city.trim() || !phone.trim()) {
      Alert.alert('Required Fields', 'Please fill in patient name, hospital, city, and phone number.');
      return;
    }

    setLoading(true);
    try {
      await postEmergencyRequest(token, {
        patientName,
        bloodGroupNeeded: bloodGroup,
        unitsNeeded: parseInt(units) || 1,
        hospitalName,
        location: city,
        phone,
        urgencyLevel: 'critical',
        notes: 'Urgent emergency request dispatched via LifeLink Mobile'
      });

      setIsSubmitted(true);
      Alert.alert(
        '🚨 SOS Alert Dispatched',
        `Emergency broadcast for ${bloodGroup} blood at ${hospitalName}, ${city} has been sent to nearby verified donors and synced to the database!`,
        [{ text: 'OK' }]
      );
      setPatientName('');
      setHospitalName('');
      setCity('');
    } catch (e) {
      Alert.alert('Error', 'Failed to dispatch SOS alert. Please try again.');
    }
    setLoading(false);
  };

  const handleCallHelpline = () => {
    Linking.openURL('tel:108').catch(() => {
      Alert.alert('Helpline', 'National Emergency Ambulance: 108\nBlood Emergency Helpline: 104');
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Emergency Hotline Banner */}
      <LinearGradient
        colors={['#D32F2F', '#9A0007']}
        style={styles.alertBanner}
      >
        <Text style={styles.alertIcon}>🚨</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.alertTitle}>Emergency Blood Helpline</Text>
          <Text style={styles.alertSub}>Instant 24/7 Medical Response across Tamil Nadu & Andhra Pradesh</Text>
        </View>
        <TouchableOpacity style={styles.callHotlineBtn} onPress={handleCallHelpline}>
          <Text style={styles.callHotlineText}>📞 108</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Form Card */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Request Urgent Blood (SOS)</Text>
        <Text style={styles.formSub}>Fill in patient details to trigger an instant donor broadcast.</Text>

        {/* Patient Name */}
        <Text style={styles.label}>Patient Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Ramesh Kumar"
          placeholderTextColor={Colors.textMuted}
          underlineColorAndroid="transparent"
          cursorColor={Colors.primary}
          value={patientName}
          onChangeText={setPatientName}
        />

        {/* Blood Group Selector */}
        <Text style={styles.label}>Blood Group Needed *</Text>
        <View style={styles.bloodGrid}>
          {BLOOD_TYPES.map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.bloodBtn, bloodGroup === g && styles.bloodBtnActive]}
              onPress={() => setBloodGroup(g)}
            >
              <Text style={[styles.bloodBtnText, bloodGroup === g && styles.bloodBtnTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hospital Name */}
        <Text style={styles.label}>Hospital / Medical Centre *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Apollo Hospital, Greams Road / SVIMS"
          placeholderTextColor={Colors.textMuted}
          underlineColorAndroid="transparent"
          cursorColor={Colors.primary}
          value={hospitalName}
          onChangeText={setHospitalName}
        />

        {/* City */}
        <Text style={styles.label}>City / Location *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Chennai, Tirupati, Coimbatore, Vizag"
          placeholderTextColor={Colors.textMuted}
          underlineColorAndroid="transparent"
          cursorColor={Colors.primary}
          value={city}
          onChangeText={setCity}
        />

        {/* Contact Phone & Units */}
        <View style={styles.row}>
          <View style={{ flex: 2 }}>
            <Text style={styles.label}>Contact Phone *</Text>
            <TextInput
              style={styles.input}
              placeholder="+91-9876543210"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
              underlineColorAndroid="transparent"
              cursorColor={Colors.primary}
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Units (Pints)</Text>
            <TextInput
              style={styles.input}
              placeholder="1"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              underlineColorAndroid="transparent"
              cursorColor={Colors.primary}
              value={units}
              onChangeText={setUnits}
            />
          </View>
        </View>

        {/* Submit SOS Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>🚨 Send Emergency SOS Alert</Text>
        </TouchableOpacity>

        {isSubmitted && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>✅ SOS broadcast active. Notifications dispatched to matched donors!</Text>
          </View>
        )}
      </View>
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
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    gap: 12,
  },
  alertIcon: {
    fontSize: 26,
  },
  alertTitle: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
  alertSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    marginTop: 2,
  },
  callHotlineBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  callHotlineText: {
    color: Colors.primaryDark,
    fontWeight: '900',
    fontSize: 13,
  },
  formCard: {
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 20,
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  formSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 18,
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
  bloodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bloodBtn: {
    width: '23%',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.bgDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    alignItems: 'center',
  },
  bloodBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  bloodBtnText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '800',
  },
  bloodBtnTextActive: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  successBox: {
    marginTop: 14,
    padding: 12,
    backgroundColor: 'rgba(67, 160, 71, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(67, 160, 71, 0.3)',
    borderRadius: 10,
  },
  successText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});
