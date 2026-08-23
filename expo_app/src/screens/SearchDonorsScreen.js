import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  TextInput, Linking, Alert, RefreshControl 
} from 'react-native';
import { Colors } from '../constants/theme';
import { CityCoordinates } from '../data/mockData';
import InteractiveMap from '../components/InteractiveMap';
import { fetchDonors } from '../services/api';

const BLOOD_GROUPS = ['ALL', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function SearchDonorsScreen() {
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

    const theme = Colors.bloodThemes[bGroup] || Colors.bloodThemes['O+'];
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.bloodBadge, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Text style={[styles.bloodText, { color: theme.text }]}>{bGroup}</Text>
          </View>
          <View style={styles.headerInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.donorName}>{dName}</Text>
              {dVerified ? <Text style={styles.verifiedBadge}>✓</Text> : null}
            </View>
            <Text style={styles.locationText}>📍 {dAddress}</Text>
            <Text style={styles.distanceText}>⚡ {dDistance} km away • Active</Text>
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by city or donor name (e.g. Chennai, Tirupati)…"
          placeholderTextColor={Colors.textMuted}
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
