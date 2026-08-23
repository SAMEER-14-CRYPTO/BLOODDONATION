import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../constants/theme';
import { answerAiPrompt } from '../services/aiMatching';

const QUICK_PROMPTS = [
  '🩸 Find O+ in Chennai',
  '⚡ Find B+ in Tirupati',
  '❓ Can A+ give to B+?',
  '💉 Donation rules',
  '🏥 Hospitals Network',
  '🚨 Emergency SOS'
];

export default function AiAssistantScreen() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: '👋 **Hi! I am your LifeLink AI Assistant.**\n\nAsk me anything about finding blood donors, checking compatibility, or hospital availability.',
      donors: []
    }
  ]);
  const [inputText, setInputText] = useState('');

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

    // Answer from AI engine
    setTimeout(() => {
      const response = answerAiPrompt(query);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.text,
        donors: response.donors || []
      };
      setMessages(prev => [...prev, botMsg]);
    }, 300);
  };

  const handleClear = () => {
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: '👋 **Chat cleared!** How can I assist you with blood donation today?',
        donors: []
      }
    ]);
  };

  const renderDonorCard = (donor) => {
    const theme = Colors.bloodThemes[donor.bloodGroup] || Colors.bloodThemes['O+'];
    return (
      <View key={donor.uid} style={styles.aiDonorCard}>
        <View style={styles.donorHeader}>
          <View style={[styles.miniBloodBadge, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Text style={[styles.miniBloodText, { color: theme.text }]}>{donor.bloodGroup}</Text>
          </View>
          <View style={styles.donorInfo}>
            <Text style={styles.donorName}>{donor.displayName}</Text>
            <Text style={styles.donorMeta}>📍 {donor.address || donor.city} • <strong>{donor.distance} km</strong></Text>
          </View>
          <View style={styles.aiScoreBadge}>
            <Text style={styles.aiScoreText}>{donor.aiScore}% Match</Text>
          </View>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity 
            style={styles.callSmallBtn}
            onPress={() => Linking.openURL(`tel:${donor.phone}`)}
          >
            <Text style={styles.callSmallBtnText}>📞 Direct Call</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.waSmallBtn}
            onPress={() => Linking.openURL(`https://wa.me/${donor.phone.replace(/[^0-9]/g, '')}`)}
          >
            <Text style={styles.waSmallBtnText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    const lines = item.text.split('\n');

    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowBot]}>
        {!isUser && <View style={styles.botAvatar}><Text style={{ fontSize: 13 }}>🤖</Text></View>}
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

          {item.donors && item.donors.length > 0 && (
            <View style={{ marginTop: 12, gap: 8 }}>
              {item.donors.map(d => renderDonorCard(d))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Top Controls Bar */}
      <View style={styles.topControlBar}>
        <Text style={styles.aiStatusText}>🟢 Smart Medical NLP Active</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text style={styles.clearChatText}>🧹 Clear Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Prompts Bar */}
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
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        />
      </View>

      {/* Messages Feed */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask LifeLink AI (e.g. Find A+ in Tirupati)…"
          placeholderTextColor={Colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
          <Text style={styles.sendBtnText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  topControlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.cardDark,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
    alignItems: 'center',
  },
  aiStatusText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '700',
  },
  clearChatText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  quickPromptsBar: {
    paddingVertical: 10,
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
    paddingVertical: 6,
  },
  promptChipText: {
    color: '#42A5F5',
    fontSize: 12,
    fontWeight: '700',
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 8,
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowBot: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7B1FA2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgBubble: {
    maxWidth: '85%',
    padding: 14,
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
    lineHeight: 19,
    marginBottom: 4,
  },
  msgTextUser: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerLineText: {
    fontWeight: '800',
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 6,
  },
  bulletLineText: {
    color: 'rgba(255, 255, 255, 0.9)',
    paddingLeft: 4,
    marginBottom: 3,
  },
  aiDonorCard: {
    backgroundColor: Colors.bgDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 12,
    padding: 12,
  },
  donorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniBloodBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBloodText: {
    fontSize: 12,
    fontWeight: '900',
  },
  donorInfo: {
    flex: 1,
  },
  donorName: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  donorMeta: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  aiScoreBadge: {
    backgroundColor: 'rgba(67, 160, 71, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  aiScoreText: {
    color: Colors.success,
    fontSize: 10,
    fontWeight: '800',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  callSmallBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    borderRadius: 8,
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
    paddingVertical: 6,
    borderRadius: 8,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
