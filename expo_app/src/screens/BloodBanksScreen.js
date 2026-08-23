import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Linking, Alert } from 'react-native';
import { Colors } from '../constants/theme';
import { BloodBanksList, CityCoordinates } from '../data/mockData';
import InteractiveMap from '../components/InteractiveMap';

export default function BloodBanksScreen() {
  const [search, setSearch] = useState('');
  const [showMap, setShowMap] = useState(true);

  const filtered = BloodBanksList.filter(b => 
    !search.trim() || 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.city.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Contact', phone);
    });
  };

  const mapMarkers = filtered.map(b => {
    const coords = CityCoordinates[b.city] || { lat: 13.0827, lng: 80.2707 };
    return {
      lat: coords.lat,
      lng: coords.lng,
      name: b.name,
      address: b.address,
      contact: b.contact,
      type: 'bloodbank'
    };
  });

  const renderBankCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bankName}>🏦 {item.name}</Text>
            <Text style={styles.addressText}>📍 {item.address}</Text>
            <Text style={styles.phoneText}>📞 {item.contact}</Text>
          </View>
          <TouchableOpacity 
            style={styles.callBtn}
            onPress={() => handleCall(item.contact)}
          >
            <Text style={styles.callBtnText}>Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Blood Stock Status Grid in Subtle Colors */}
        <Text style={styles.stockTitle}>Blood Stock Units Status:</Text>
        <View style={styles.stocksGrid}>
          {Object.entries(item.stocks || {}).map(([group, count]) => {
            const theme = Colors.bloodThemes[group] || Colors.bloodThemes['O+'];
            const pct = Math.min(100, Math.round((count / 60) * 100));
            return (
              <View 
                key={group} 
                style={[styles.stockCard, { backgroundColor: theme.bg, borderColor: theme.border }]}
              >
                <Text style={[styles.stockGroup, { color: theme.text }]}>{group}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: theme.bar }]} />
                </View>
                <Text style={[styles.stockUnits, { color: theme.text }]}>{count} units</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search blood bank or city (e.g. Chennai, Tirupati, Vizag)…"
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.headerInfo}>
        <Text style={styles.countText}>
          Showing <Text style={{ color: Colors.primary, fontWeight: '800' }}>{filtered.length}</Text> Certified Centres
        </Text>
        <TouchableOpacity onPress={() => setShowMap(!showMap)}>
          <Text style={styles.mapToggleBtn}>{showMap ? '🗺️ Hide Map' : '🗺️ Show Map'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={
          showMap ? <InteractiveMap markers={mapMarkers} height={200} /> : null
        }
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderBankCard}
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
    marginBottom: 12,
  },
  bankName: {
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
  callBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
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
    gap: 8,
  },
  stockCard: {
    width: '23%',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  stockGroup: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  stockUnits: {
    fontSize: 10,
    fontWeight: '700',
  },
});
