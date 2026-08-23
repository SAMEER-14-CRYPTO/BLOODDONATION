import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Linking, Alert } from 'react-native';
import { Colors } from '../constants/theme';
import { HospitalsList, CityCoordinates } from '../data/mockData';
import InteractiveMap from '../components/InteractiveMap';

export default function HospitalsScreen() {
  const [search, setSearch] = useState('');
  const [showMap, setShowMap] = useState(true);
  const [focusedMarker, setFocusedMarker] = useState(null);
  const listRef = useRef(null);

  const filtered = HospitalsList.filter(h => 
    !search.trim() || 
    h.name.toLowerCase().includes(search.toLowerCase()) || 
    h.city.toLowerCase().includes(search.toLowerCase()) ||
    h.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Phone', phone);
    });
  };

  const handleFocusOnMap = (hospital) => {
    const coords = CityCoordinates[hospital.city] || { lat: 13.0827, lng: 80.2707 };
    setShowMap(true);
    setFocusedMarker({
      lat: coords.lat,
      lng: coords.lng,
      name: hospital.name
    });
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const mapMarkers = filtered.map(h => {
    const coords = CityCoordinates[h.city] || { lat: 13.0827, lng: 80.2707 };
    return {
      lat: coords.lat,
      lng: coords.lng,
      name: h.name,
      address: h.address,
      contact: h.contact,
      type: 'hospital'
    };
  });

  const renderHospitalCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hospName}>🏥 {item.name}</Text>
            <Text style={styles.addressText}>📍 {item.address}</Text>
            <Text style={styles.phoneText}>📞 {item.contact}</Text>
          </View>
        </View>

        {/* Live Blood Availability Badges */}
        <Text style={styles.stockTitle}>Live Blood Availability:</Text>
        <View style={styles.stocksGrid}>
          {Object.entries(item.bloodAvailability || {}).map(([group, count]) => {
            const theme = Colors.bloodThemes[group] || Colors.bloodThemes['O+'];
            return (
              <View 
                key={group} 
                style={[styles.stockPill, { backgroundColor: theme.bg, borderColor: theme.border }]}
              >
                <Text style={[styles.stockGroup, { color: theme.text }]}>{group}</Text>
                <Text style={[styles.stockCount, { color: theme.text }]}>{count}u</Text>
              </View>
            );
          })}
        </View>

        {/* Action Buttons: View on Map + Direct Call */}
        <View style={styles.actionBtnRow}>
          <TouchableOpacity 
            style={styles.mapFocusBtn}
            onPress={() => handleFocusOnMap(item)}
          >
            <Text style={styles.mapFocusBtnText}>📍 View on Map</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.callBtn}
            onPress={() => handleCall(item.contact)}
          >
            <Text style={styles.callBtnText}>📞 Call Hospital</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search hospital name or city (e.g. Chennai, Tirupati)…"
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.headerInfo}>
        <Text style={styles.countText}>
          Showing <Text style={{ color: Colors.primary, fontWeight: '800' }}>{filtered.length}</Text> Verified Hospitals
        </Text>
        <TouchableOpacity onPress={() => setShowMap(!showMap)}>
          <Text style={styles.mapToggleBtn}>{showMap ? '🗺️ Hide Map' : '🗺️ Show Map'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        ListHeaderComponent={
          showMap ? (
            <InteractiveMap 
              markers={mapMarkers} 
              focusedMarker={focusedMarker}
              height={220} 
            />
          ) : null
        }
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderHospitalCard}
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
  searchBar: {
    padding: 16,
    paddingBottom: 6,
  },
  input: {
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 12,
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  hospName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  phoneText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  stockTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 8,
  },
  stocksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  stockGroup: {
    fontSize: 11,
    fontWeight: '800',
  },
  stockCount: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  },
  mapFocusBtn: {
    flex: 1,
    backgroundColor: 'rgba(30, 136, 229, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(30, 136, 229, 0.3)',
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  mapFocusBtnText: {
    color: '#42A5F5',
    fontWeight: '800',
    fontSize: 12,
  },
  callBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  callBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
});
