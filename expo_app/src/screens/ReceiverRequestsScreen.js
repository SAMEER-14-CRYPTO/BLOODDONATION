import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, 
  Linking, Modal, ScrollView, Alert, RefreshControl 
} from 'react-native';
import { Colors } from '../constants/theme';
import { CityCoordinates } from '../data/mockData';
import InteractiveMap from '../components/InteractiveMap';
import { useAuth } from '../context/AuthContext';
import { fetchEmergencyRequests, postEmergencyRequest, respondToEmergencyRequest } from '../services/api';

const DEFAULT_FALLBACK_REQUESTS = [
  {
    id: 'req_1',
    patientName: 'Ravi Kumar',
    bloodGroupNeeded: 'O+',
    unitsNeeded: 2,
    hospitalName: 'Apollo Main Hospital, Greams Road',
    location: 'Chennai',
    urgencyLevel: 'critical',
    phone: '+91-9876543210',
    notes: 'Urgent surgery scheduled at 9:00 AM tomorrow.',
    createdAt: '10 mins ago',
    lat: 13.0614,
    lng: 80.2544
  },
  {
    id: 'req_2',
    patientName: 'Kavitha Reddy',
    bloodGroupNeeded: 'B-',
    unitsNeeded: 1,
    hospitalName: 'SVIMS Multi-Speciality Hospital',
    location: 'Tirupati',
    urgencyLevel: 'critical',
    phone: '+91-9184000000',
    notes: 'ICU Patient emergency blood requirement.',
    createdAt: '30 mins ago',
    lat: 13.6450,
    lng: 79.4100
  },
  {
    id: 'req_3',
    patientName: 'Manoj Sundaram',
    bloodGroupNeeded: 'A+',
    unitsNeeded: 3,
    hospitalName: 'PSG Hospitals, Coimbatore',
    location: 'Coimbatore',
    urgencyLevel: 'urgent',
    phone: '+91-9876543211',
    notes: 'Platelet transfusion required immediately.',
    createdAt: '1 hour ago',
    lat: 11.0245,
    lng: 77.0028
  }
];

export default function ReceiverRequestsScreen() {
  const [requests, setRequests] = useState(DEFAULT_FALLBACK_REQUESTS);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [search, setSearch] = useState('');
  const { user, token } = useAuth();

  // Form State
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [hospitalName, setHospitalName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState(user?.phone || '+91-9184000000');
  const [units, setUnits] = useState('1');
  const [notes, setNotes] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    const dbRequests = await fetchEmergencyRequests();
    if (dbRequests && dbRequests.length > 0) {
      setRequests(dbRequests);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const mapMarkers = requests.map(r => ({
    lat: r.lat || 13.0827,
    lng: r.lng || 80.2707,
    name: `🚨 ${r.bloodGroupNeeded || r.blood_group_needed} needed for ${r.patientName || r.patient_name}`,
    address: `${r.hospitalName || r.hospital_name}, ${r.location}`,
    contact: r.phone,
    type: 'donor'
  }));

  const handlePostRequest = async () => {
    if (!patientName.trim() || !hospitalName.trim() || !location.trim() || !phone.trim()) {
      Alert.alert('Required Fields', 'Please fill in patient name, hospital, location, and contact phone.');
      return;
    }

    const coords = CityCoordinates[location] || { lat: 13.0827, lng: 80.2707 };
    const newReqPayload = {
      patientName,
      bloodGroupNeeded: bloodGroup,
      unitsNeeded: parseInt(units) || 1,
      hospitalName,
      location,
      urgencyLevel: 'critical',
      phone,
      notes,
      lat: coords.lat,
      lng: coords.lng
    };

    // Save directly to the shared SQLite / Web backend database!
    await postEmergencyRequest(token, newReqPayload);

    const localNewReq = {
      ...newReqPayload,
      id: 'req_' + Date.now(),
      createdAt: 'Just now'
    };

    setRequests(prev => [localNewReq, ...prev]);
    setShowNewModal(false);
    setPatientName('');
    setHospitalName('');
    setLocation('');
    setNotes('');
    Alert.alert('🚨 SOS Dispatched', `Emergency broadcast for ${bloodGroup} at ${hospitalName} is live in the database and visible across both Web & Mobile platforms!`);
  };

  const handleRespond = async (req) => {
    await respondToEmergencyRequest(token, req.id);
    Alert.alert(
      'Respond to SOS',
      `Would you like to connect with ${req.patientName || req.patient_name}'s family to donate ${req.bloodGroupNeeded || req.blood_group_needed}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: '📞 Call Now', 
          onPress: () => Linking.openURL(`tel:${req.phone}`) 
        },
        { 
          text: '💬 WhatsApp', 
          onPress: () => Linking.openURL(`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}?text=I saw your emergency request for ${req.bloodGroupNeeded || req.blood_group_needed} blood at ${req.hospitalName || req.hospital_name}. I want to help.`) 
        }
      ]
    );
  };

  const filtered = requests.filter(r => {
    const pName = r.patientName || r.patient_name || '';
    const hName = r.hospitalName || r.hospital_name || '';
    const loc = r.location || '';
    const bGroup = r.bloodGroupNeeded || r.blood_group_needed || '';
    return !search.trim() ||
      pName.toLowerCase().includes(search.toLowerCase()) ||
      hName.toLowerCase().includes(search.toLowerCase()) ||
      loc.toLowerCase().includes(search.toLowerCase()) ||
      bGroup.toLowerCase().includes(search.toLowerCase());
  });

  const renderRequestCard = ({ item }) => {
    const bg = item.bloodGroupNeeded || item.blood_group_needed || 'O+';
    const pName = item.patientName || item.patient_name || 'Patient';
    const hName = item.hospitalName || item.hospital_name || 'Hospital';
    const urgency = item.urgencyLevel || item.urgency_level || 'critical';
    const unitsCount = item.unitsNeeded || item.units_needed || 1;
    const timeStr = item.createdAt || item.created_at || 'Recently';

    const theme = Colors.bloodThemes[bg] || Colors.bloodThemes['O+'];
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.bloodBadge, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Text style={[styles.bloodBadgeText, { color: theme.text }]}>{bg}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.patientName}>{pName}</Text>
              <View style={[styles.urgencyBadge, urgency === 'critical' ? styles.urgencyCritical : styles.urgencyUrgent]}>
                <Text style={styles.urgencyText}>{urgency.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.metaText}>🏥 {hName}</Text>
            <Text style={styles.metaText}>📍 {item.location} • 🩸 {unitsCount} unit(s) • ⏱️ {timeStr}</Text>
          </View>
        </View>

        {item.notes ? (
          <Text style={styles.notesText}>💬 "{item.notes}"</Text>
        ) : null}

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.respondBtn}
            onPress={() => handleRespond(item)}
          >
            <Text style={styles.respondBtnText}>🤝 Respond to Help</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.callSmallBtn}
            onPress={() => Linking.openURL(`tel:${item.phone}`)}
          >
            <Text style={styles.callSmallBtnText}>📞 Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Search & Post Bar */}
      <View style={styles.topBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search requests by city, hospital, group…"
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.postSosBtn} onPress={() => setShowNewModal(true)}>
          <Text style={styles.postSosText}>+ SOS</Text>
        </TouchableOpacity>
      </View>

      {/* Map Header */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          🚨 Active Patient Requests: <Text style={{ color: Colors.primary, fontWeight: '800' }}>{filtered.length}</Text>
        </Text>
        <TouchableOpacity onPress={() => setShowMap(!showMap)}>
          <Text style={styles.mapToggleBtn}>{showMap ? '🗺️ Hide Map' : '🗺️ Show Map'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadRequests} tintColor={Colors.primary} />
        }
        ListHeaderComponent={
          showMap ? <InteractiveMap markers={mapMarkers} height={200} /> : null
        }
        data={filtered}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        renderItem={renderRequestCard}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      />

      {/* New Request Modal */}
      <Modal visible={showNewModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>🚨 Post Emergency Blood Request</Text>
            <ScrollView style={{ maxHeight: 420 }}>
              <Text style={styles.inputLabel}>Patient Name *</Text>
              <TextInput style={styles.modalInput} value={patientName} onChangeText={setPatientName} placeholder="e.g. Ramesh Kumar" placeholderTextColor={Colors.textMuted} />

              <Text style={styles.inputLabel}>Blood Group Needed *</Text>
              <View style={styles.groupGrid}>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(g => (
                  <TouchableOpacity key={g} style={[styles.groupBtn, bloodGroup === g && styles.groupBtnActive]} onPress={() => setBloodGroup(g)}>
                    <Text style={[styles.groupBtnText, bloodGroup === g && styles.groupBtnTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Hospital / Clinic *</Text>
              <TextInput style={styles.modalInput} value={hospitalName} onChangeText={setHospitalName} placeholder="e.g. Apollo Hospital, Chennai" placeholderTextColor={Colors.textMuted} />

              <Text style={styles.inputLabel}>City / Location *</Text>
              <TextInput style={styles.modalInput} value={location} onChangeText={setLocation} placeholder="e.g. Chennai, Tirupati, Coimbatore" placeholderTextColor={Colors.textMuted} />

              <Text style={styles.inputLabel}>Contact Phone *</Text>
              <TextInput style={styles.modalInput} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+91-9876543210" placeholderTextColor={Colors.textMuted} />

              <Text style={styles.inputLabel}>Units Needed</Text>
              <TextInput style={styles.modalInput} value={units} onChangeText={setUnits} keyboardType="numeric" placeholder="1" placeholderTextColor={Colors.textMuted} />

              <Text style={styles.inputLabel}>Additional Notes / Reason</Text>
              <TextInput style={styles.modalInput} value={notes} onChangeText={setNotes} placeholder="e.g. Emergency surgery at 9 AM" placeholderTextColor={Colors.textMuted} />
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowNewModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.broadcastBtn} onPress={handlePostRequest}>
                <Text style={styles.broadcastBtnText}>🚨 Dispatch SOS Alert</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDark },
  topBar: { flexDirection: 'row', padding: 16, paddingBottom: 6, gap: 10 },
  searchInput: { flex: 1, backgroundColor: Colors.cardDark, borderWidth: 1, borderColor: Colors.borderDark, borderRadius: 12, color: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 10, fontSize: 13 },
  postSosBtn: { backgroundColor: Colors.primary, paddingHorizontal: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  postSosText: { color: '#FFFFFF', fontWeight: '900', fontSize: 13 },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6, alignItems: 'center' },
  countText: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' },
  mapToggleBtn: { color: '#42A5F5', fontSize: 12, fontWeight: '700' },
  card: { backgroundColor: Colors.cardDark, borderWidth: 1, borderColor: Colors.borderDark, borderRadius: 16, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bloodBadge: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  bloodBadgeText: { fontSize: 15, fontWeight: '900' },
  patientName: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  urgencyBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  urgencyCritical: { backgroundColor: 'rgba(229, 57, 53, 0.2)' },
  urgencyUrgent: { backgroundColor: 'rgba(251, 140, 0, 0.2)' },
  urgencyText: { fontSize: 9, fontWeight: '900', color: Colors.primary },
  metaText: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  notesText: { fontSize: 11, color: '#FFFFFF', fontStyle: 'italic', backgroundColor: Colors.bgDark, padding: 8, borderRadius: 8, marginTop: 8 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.06)' },
  respondBtn: { flex: 2, backgroundColor: Colors.success, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  respondBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  callSmallBtn: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  callSmallBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: Colors.cardDark, borderWidth: 1, borderColor: Colors.borderDark, borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 17, fontWeight: '900', color: '#FFFFFF', marginBottom: 12 },
  inputLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 4, marginTop: 8 },
  modalInput: { backgroundColor: Colors.bgDark, borderWidth: 1, borderColor: Colors.borderDark, borderRadius: 10, color: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8, fontSize: 13 },
  groupGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  groupBtn: { width: '22%', paddingVertical: 8, borderRadius: 8, backgroundColor: Colors.bgDark, borderWidth: 1, borderColor: Colors.borderDark, alignItems: 'center' },
  groupBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  groupBtnText: { color: Colors.textMuted, fontSize: 12, fontWeight: '800' },
  groupBtnTextActive: { color: '#FFFFFF' },
  modalBtnRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  cancelBtn: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  cancelBtnText: { color: '#FFFFFF', fontWeight: '700' },
  broadcastBtn: { flex: 2, backgroundColor: Colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  broadcastBtnText: { color: '#FFFFFF', fontWeight: '900' }
});
