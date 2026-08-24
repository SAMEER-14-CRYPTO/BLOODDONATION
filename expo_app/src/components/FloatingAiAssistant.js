import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, 
  FlatList, Linking, KeyboardAvoidingView, Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';
import { answerAiPrompt } from '../services/aiMatching';
import { fetchDonors, fetchHospitals, fetchBloodBanks } from '../services/api';

const QUICK_PROMPTS = [
  '🩸 Need A+ in Tirupati',
  '⚡ Find O+ in Chennai',
  '🏥 Hospitals in Tirupati',
  '🏦 Blood banks in Coimbatore',
  '❓ Can A+ donate to B+?'
];

export default function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: '👋 Hi! I am your LifeLink Medical AI Assistant.\n\nAsk me anything about finding donors in your city, checking blood bank stocks, or hospital emergency guidance.',
      donors: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [contextData, setContextData] = useState({ donors: [], hospitals: [], bloodBanks: [] });

  useEffect(() => {
    // Preload live context from cloud database
    Promise.all([
      fetchDonors(),
      fetchHospitals(),
      fetchBloodBanks()
    ]).then(([donors, hospitals, bloodBanks]) => {
      setContextData({ donors, hospitals, bloodBanks });
    }).catch(() => {});
  }, []);

  const handleSend = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      donors: []
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const response = answerAiPrompt(query, contextData);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.text,
        donors: response.donors || []
      };
      setMessages(prev => [...prev, botMsg]);
    }, 200);
  };

  const handleClear = () => {
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: '👋 Chat cleared! How can I assist you with blood donation, hospitals, or blood banks today?',
        donors: []
      }
    ]);
  };

  const renderDonorCard = (donor) => {
    const theme = Colors.bloodThemes[donor.bloodGroup] || Colors.bloodThemes['O+'];
    return (
      <View key={donor.uid || donor.id || Math.random().toString()} style={styles.aiDonorCard}>
        <View style={styles.donorHeader}>
          <View style={[styles.miniBloodBadge, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Text style={[styles.miniBloodText, { color: theme.text }]}>{donor.bloodGroup || 'O+'}</Text>
          </View>
          <View style={styles.donorInfo}>
            <Text style={styles.donorName}>{donor.displayName || donor.fullName || 'Verified Donor'}</Text>
            <Text style={styles.donorMeta}>
              📍 {donor.address || donor.city || 'Tamil Nadu / AP'} • <Text style={{ fontWeight: '700', color: '#FFF' }}>{donor.distance} km away</Text>
            </Text>
          </View>
          <View style={styles.aiScoreBadge}>
            <Text style={styles.aiScoreText}>{donor.aiScore || 95}% Match</Text>
          </View>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity 
            style={styles.callSmallBtn}
            onPress={() => Linking.openURL(`tel:${donor.phone || '+91-9184000000'}`)}
          >
            <Text style={styles.callSmallBtnText}>📞 Call</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.waSmallBtn}
            onPress={() => Linking.openURL(`https://wa.me/${(donor.phone || '9184000000').replace(/[^0-9]/g, '')}`)}
          >
            <Text style={styles.waSmallBtnText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    const lines = (item.text || '').split('\n');

    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowBot]}>
        {!isUser && (
          <View style={styles.botAvatar}>
            <Text style={{ fontSize: 13 }}>✨</Text>
          </View>
        )}
        <View style={[styles.msgBubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
          {lines.map((line, idx) => {
            const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
            const isHeader = line.includes('**') && !line.includes('•');
            const cleanLine = line.replace(/\*\*(.*?)\*\*/g, '$1');

            return (
              <Text 
                key={idx} 
                style={[
                  styles.msgText, 
                  isUser && styles.msgTextUser,
                  isHeader && styles.headerLineText,
                  isBullet && styles.bulletLineText
                ]}
              >
                {cleanLine}
              </Text>
            );
          })}

          {item.donors && item.donors.length > 0 ? (
            <View style={{ marginTop: 10, gap: 8 }}>
              {item.donors.map(d => renderDonorCard(d))}
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <>
      {/* ✨ Floating AI Assistant Symbol Button */}
      <TouchableOpacity 
        style={styles.circleTriggerContainer}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#E53935', '#B71C1C']}
          style={styles.circleTrigger}
        >
          <Text style={styles.circleIcon}>✨</Text>
          <View style={styles.onlineDot} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Full Screen AI Assistant Modal */}
      <Modal visible={isOpen} animationType="slide" transparent={true}>
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.chatWindow}>
            {/* Header */}
            <View style={styles.chatHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <LinearGradient
                  colors={['#E53935', '#B71C1C']}
                  style={styles.headerAvatar}
                >
                  <Text style={{ fontSize: 16 }}>✨</Text>
                </LinearGradient>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.headerTitle}>LifeLink AI</Text>
                    <View style={styles.statusDot} />
                  </View>
                  <Text style={styles.headerSub}>Live Medical & Donor Assistant</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity style={styles.headerBtn} onPress={handleClear}>
                  <Text style={{ fontSize: 13 }}>🧹</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerBtn} onPress={() => setIsOpen(false)}>
                  <Text style={{ fontSize: 14, color: '#FFFFFF', fontWeight: '800' }}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Prompts */}
            <View style={styles.quickPromptsBar}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={QUICK_PROMPTS}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.promptChip}
                    onPress={() => handleSend(item.replace(/^[^\s]+\s/, ''))}
                  >
                    <Text style={styles.promptChipText}>{item}</Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingHorizontal: 14, gap: 8 }}
              />
            </View>

            {/* Messages */}
            <FlatList
              data={messages}
              keyExtractor={item => item.id}
              renderItem={renderMessage}
              contentContainerStyle={{ padding: 14, paddingBottom: 20 }}
            />

            {/* Input Bar */}
            <View style={styles.inputBar}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask LifeLink AI (e.g. Need A+ in Tirupati)…"
                placeholderTextColor={Colors.textMuted}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => handleSend()}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
                <Text style={styles.sendBtnText}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  circleTriggerContainer: {
    position: 'absolute',
    bottom: 82,
    right: 18,
    zIndex: 999,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  circleTrigger: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  circleIcon: {
    fontSize: 22,
  },
  onlineDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#43A047',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  chatWindow: {
    height: '84%',
    backgroundColor: Colors.bgDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    overflow: 'hidden',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.cardDark,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  headerSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  headerBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPromptsBar: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
    backgroundColor: Colors.cardDark,
  },
  promptChip: {
    backgroundColor: 'rgba(30, 136, 229, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(30, 136, 229, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  promptChipText: {
    color: '#42A5F5',
    fontSize: 11,
    fontWeight: '700',
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowBot: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(229, 57, 53, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgBubble: {
    maxWidth: '84%',
    padding: 12,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: Colors.info,
    borderTopRightRadius: 2,
  },
  bubbleBot: {
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderTopLeftRadius: 2,
  },
  msgText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 3,
  },
  msgTextUser: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerLineText: {
    fontWeight: '800',
    color: '#FFFFFF',
    fontSize: 13,
    marginBottom: 4,
  },
  bulletLineText: {
    color: 'rgba(255, 255, 255, 0.9)',
    paddingLeft: 4,
    marginBottom: 2,
  },
  aiDonorCard: {
    backgroundColor: Colors.bgDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 10,
    padding: 10,
  },
  donorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniBloodBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBloodText: {
    fontSize: 11,
    fontWeight: '900',
  },
  donorInfo: {
    flex: 1,
  },
  donorName: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  donorMeta: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  aiScoreBadge: {
    backgroundColor: 'rgba(67, 160, 71, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aiScoreText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: '800',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  callSmallBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  callSmallBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  waSmallBtn: {
    flex: 1,
    backgroundColor: 'rgba(30, 136, 229, 0.2)',
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  waSmallBtnText: {
    color: '#42A5F5',
    fontSize: 11,
    fontWeight: '800',
  },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Colors.cardDark,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 13,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});
