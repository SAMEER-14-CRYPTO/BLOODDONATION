import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Linking, Alert } from 'react-native';
import { Colors } from '../constants/theme';
import { DonorsList, CityCoordinates } from '../data/mockData';
import { rankDonors } from '../services/aiMatching';

const BLOOD_GROUPS = ['ALL', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function SearchDonorsScreen() {
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [searchCity, setSearchCity] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredDonors = DonorsList.filter(d => {
    const matchGroup = selectedGroup === 'ALL' || d.bloodGroup === selectedGroup;
    const matchCity = !searchCity.trim() || 
                      d.city.toLowerCase().includes(searchCity.toLowerCase()) || 
                      d.address.toLowerCase().includes(searchCity.toLowerCase());
    const matchAvail = !availableOnly || d.availability;
    return matchGroup && matchCity && matchAvail;
  });

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Calling unavailable', `Contact number: ${phone}`);
    });
  };

  const handleWhatsApp = (phone, name) => {
    const clean = phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${clean}?text=Hi ${name}, reaching out from LifeLink blood donation app.`;
    Linking.openURL(url).catch(() => {
      Alert.alert('WhatsApp unavailable', 'Could not launch WhatsApp.');
    });
  };

  const renderDonorCard = ({ item }) => {
    const theme = Colors.bloodThemes[item.bloodGroup] || Colors.bloodThemes['O+'];
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.bloodBadge, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Text style={[styles.bloodBadgeText, { color: theme.text }]}>{item.bloodGroup}</Text>
          </View>
          <View style={styles.infoCol}>
            <View style={styles.nameRow}>
              <Text style={styles.donorName}>{item.displayName}</Text>
              {item.verified && <Text style={styles.verifiedTag}>✓ Verified</Text>}
            </View>
            <Text style={styles.metaText}>📍 {item.address || item.city}</Text>
            <Text style={styles.metaText}>👤 {item.gender}, {item.age} yrs • Last: {item.lastDonation}</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: item.availability ? 'rgba(67,160,71,0.15)' : 'rgba(239,83,80,0.15)' }]}>
            <Text style={[styles.statusText, { color: item.availability ? Colors.success : Colors.primary }]}>
              {item.availability ? 'Active' : 'Busy'}
            </Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.callBtn]}
            onPress={() => handleCall(item.phone)}
          >
            <Text style={styles.callBtnText}>📞 Call</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.waBtn]}
            onPress={() => handleWhatsApp(item.phone, item.displayName)}
          >
            <Text style={styles.waBtnText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search city / district (e.g. Chennai, Tirupati)…"
          placeholderTextColor={Colors.textMuted}
          value={searchCity}
          onChangeText={setSearchCity}
        />
      </View>

      {/* Blood Group Chips */}
      <View style={styles.chipsScroll}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={BLOOD_GROUPS}
          keyExtractor={item => item}
          renderItem={({ item }) => {
            const isSelected = selectedGroup === item;
            return (
              <TouchableOpacity
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => setSelectedGroup(item)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        />
      </View>

      {/* Donor Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          Showing <Text style={{ color: Colors.primary, fontWeight: '800' }}>{filteredDonors.length}</Text> Donors
        </Text>
        <TouchableOpacity onPress={() => setAvailableOnly(!availableOnly)}>
          <Text style={[styles.availToggle, availableOnly && { color: Colors.success }]}>
            {availableOnly ? '🟢 Available only' : '⚪ All statuses'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Donors List */}
      <FlatList
        data={filteredDonors}
        keyExtractor={item => item.uid}
        renderItem={renderDonorCard}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No donors found</Text>
            <Text style={styles.emptyDesc}>Try selecting another blood group or clearing your search.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  searchBarContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  input: {
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 12,
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  chipsScroll: {
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
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
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  countText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  availToggle: {
    color: Colors.textMuted,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodBadgeText: {
    fontSize: 15,
    fontWeight: '900',
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  donorName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  verifiedTag: {
    color: Colors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  metaText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  callBtn: {
    backgroundColor: Colors.primary,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  waBtn: {
    backgroundColor: 'rgba(30, 136, 229, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(30, 136, 229, 0.3)',
  },
  waBtnText: {
    color: '#42A5F5',
    fontWeight: '700',
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
