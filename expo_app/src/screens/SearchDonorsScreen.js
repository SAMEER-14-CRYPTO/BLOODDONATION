import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  TextInput, Linking, Alert, RefreshControl 
} from 'react-native';
import { Colors } from '../constants/theme';
import { CityCoordinates } from '../data/mockData';
import InteractiveMap from '../components/InteractiveMap';
import { fetchDonors, removeDonor } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const BLOOD_GROUPS = ['ALL', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function SearchDonorsScreen() {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [searchCity, setSearchCity] = useState('');
  const [showMap, setShowMap] = useState(true);

  const loadDonors = async () => {
    setLoading(true);
    const data = await fetchDonors();
    setDonors(data);
    setLoading(false);
  };

  const handleDeleteDonorByAdmin = (item) => {
    const dName = item.displayName || item.display_name || item.full_name || item.name || 'Donor';
    Alert.alert(
      'Remove Donor Record',
      `Delete ${dName} from the database?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: '✕ Remove Donor', 
          style: 'destructive', 
          onPress: async () => {
            setDonors(prev => prev.filter(d => d.uid !== item.uid && d.id !== item.id));
            await removeDonor(token, item.uid || item.id);
            Alert.alert('Donor Removed', `${dName} was removed from the database.`);
          }
        }
      ]
    );
  };

  useEffect(() => {
    loadDonors();
  }, []);

  const filteredDonors = donors.filter(d => {
    const dGroup = d.bloodGroup || d.blood_group || 'O+';
    const dCity = d.city || '';
    const dName = d.displayName || d.display_name || d.full_name || d.name || '';
    const matchesGroup = selectedGroup === 'ALL' || dGroup === selectedGroup;
    const matchesCity = !searchCity.trim() || 
      dCity.toLowerCase().includes(searchCity.toLowerCase()) || 
      dName.toLowerCase().includes(searchCity.toLowerCase());
    return matchesGroup && matchesCity;
  });

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Phone', phone);
    });
  };

  const handleWhatsApp = (phone, name, group) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Hello ${name}, I found your contact on LifeLink Blood Network. Are you available for ${group} blood donation?`);
    Linking.openURL(`https://wa.me/${cleanPhone}?text=${msg}`).catch(() => {
      Alert.alert('WhatsApp', 'Could not open WhatsApp');
    });
  };

  const mapMarkers = filteredDonors.map(d => {
    const bGroup = d.bloodGroup || d.blood_group || 'O+';
    const cCity = d.city || 'Chennai';
    const coords = CityCoordinates[cCity] || { lat: 13.0827, lng: 80.2707 };
    return {
      lat: d.lat || coords.lat,
      lng: d.lng || coords.lng,
      name: d.displayName || d.display_name || d.name,
      bloodGroup: bGroup,
      address: d.address || cCity,
      phone: d.phone,
      type: 'donor'
    };
  });

  const renderDonorCard = ({ item }) => {
    const bGroup = item.bloodGroup || item.blood_group || 'O+';
    const dName = item.displayName || item.display_name || item.full_name || item.name || 'Verified Donor';
    const dCity = item.city || 'India';
    const dAddress = item.address || `${dCity}, India`;
    const dDistance = item.distance || '2.4';
    const dVerified = item.isVerified || item.verified;

    const themeBadge = Colors.bloodThemes[bGroup] || Colors.bloodThemes['O+'];
    return (
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.bloodBadge, { backgroundColor: themeBadge.bg, borderColor: themeBadge.border }]}>
            <Text style={[styles.bloodText, { color: themeBadge.text }]}>{bGroup}</Text>
          </View>
          <View style={styles.headerInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.donorName, { color: theme.text }]}>{dName}</Text>
              {dVerified ? <Text style={styles.verifiedBadge}>✓</Text> : null}
            </View>
            <Text style={[styles.locationText, { color: theme.textMuted }]}>📍 {dAddress}</Text>
            <Text style={[styles.distanceText, { color: theme.textMuted }]}>⚡ {dDistance} km away • Active</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.callBtn} 
            onPress={() => handleCall(item.phone)}
          >
            <Text style={styles.callBtnText}>📞 Call</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.waBtn} 
            onPress={() => handleWhatsApp(item.phone, dName, bGroup)}
          >
            <Text style={styles.waBtnText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {user?.role === 'admin' ? (
          <TouchableOpacity 
            style={{ 
              marginTop: 10, 
              paddingVertical: 8, 
              backgroundColor: 'rgba(229, 57, 53, 0.15)', 
              borderWidth: 1, 
              borderColor: 'rgba(229, 57, 53, 0.3)', 
              borderRadius: 10, 
              alignItems: 'center' 
            }}
            onPress={() => handleDeleteDonorByAdmin(item)}
          >
            <Text style={{ color: '#FF5252', fontSize: 11, fontWeight: '700' }}>✕ Remove Donor from Database</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Search Input */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search by city or donor name (e.g. Chennai, Tirupati)…"
          placeholderTextColor={theme.textMuted}
          value={searchCity}
          onChangeText={setSearchCity}
        />
      </View>

      {/* Blood Group Filter Chips */}
      <View style={styles.filterRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={BLOOD_GROUPS}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chip,
                selectedGroup === item && styles.chipActive
              ]}
              onPress={() => setSelectedGroup(item)}
            >
              <Text style={[
                styles.chipText,
                selectedGroup === item && styles.chipTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        />
      </View>

      {/* Map Toggle & Donor Count Bar */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          🩸 Found <Text style={{ color: Colors.primary, fontWeight: '800' }}>{filteredDonors.length}</Text> Active Donors
        </Text>
        <TouchableOpacity onPress={() => setShowMap(!showMap)}>
          <Text style={styles.mapToggleBtn}>{showMap ? '🗺️ Hide Map' : '🗺️ Show Map'}</Text>
        </TouchableOpacity>
      </View>

      {/* Donors List with Live Interactive Map Header */}
      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadDonors} tintColor={Colors.primary} />
        }
        ListHeaderComponent={
          showMap ? (
            <InteractiveMap 
              markers={mapMarkers} 
              height={220} 
            />
          ) : null
        }
        data={filteredDonors}
        keyExtractor={item => item.uid || item.id?.toString() || Math.random().toString()}
        renderItem={renderDonorCard}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 12,
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
  },
  filterRow: {
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  countText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  mapToggleBtn: {
    color: '#42A5F5',
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bloodBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodText: {
    fontSize: 16,
    fontWeight: '900',
  },
  headerInfo: {
    flex: 1,
  },
  donorName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    color: Colors.success,
    fontWeight: '900',
    fontSize: 14,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  distanceText: {
    fontSize: 11,
    color: Colors.success,
    marginTop: 2,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  callBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  callBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  waBtn: {
    flex: 1,
    backgroundColor: 'rgba(30, 136, 229, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(30, 136, 229, 0.4)',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  waBtnText: {
    color: '#42A5F5',
    fontWeight: '800',
    fontSize: 12,
  },
});
