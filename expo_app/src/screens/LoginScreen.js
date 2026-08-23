import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [role, setRole] = useState('donor'); // 'donor' | 'receiver' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setEmail('sameeradmin@lifelink.com');
      setPassword('Sameer@14');
    } else if (newRole === 'donor') {
      setEmail('sameershaik9184@gmail.com');
      setPassword('Donor@123');
    } else {
      setEmail('receiver@lifelink.com');
      setPassword('Receiver@123');
    }
  };

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required', 'Please enter email and password');
      return;
    }

    const res = login(role, { email, password });
    if (res.success) {
      Alert.alert('Login Successful', `Welcome to LifeLink as ${role.toUpperCase()}!`);
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('Home');
      }
    } else {
      Alert.alert('Login Failed', res.message || 'Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo Header */}
        <View style={styles.header}>
          <Text style={styles.logoIcon}>🩸</Text>
          <Text style={styles.title}>Life<Text style={{ color: Colors.primary }}>Link</Text></Text>
          <Text style={styles.subtitle}>Sign in to access your portal</Text>
        </View>

        {/* Role Tabs (Donor vs Receiver vs Admin) - Exact Web Design */}
        <View style={styles.roleTabs}>
          <TouchableOpacity
            style={[styles.roleTab, role === 'donor' && styles.roleTabDonorActive]}
            onPress={() => handleRoleChange('donor')}
          >
            <Text style={[styles.roleTabText, role === 'donor' && styles.roleTabTextActive]}>🩸 Donor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleTab, role === 'receiver' && styles.roleTabReceiverActive]}
            onPress={() => handleRoleChange('receiver')}
          >
            <Text style={[styles.roleTabText, role === 'receiver' && styles.roleTabTextActive]}>🏥 Receiver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleTab, role === 'admin' && styles.roleTabAdminActive]}
            onPress={() => handleRoleChange('admin')}
          >
            <Text style={[styles.roleTabText, role === 'admin' && styles.roleTabTextActive]}>🛡️ Admin</Text>
          </TouchableOpacity>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {role === 'donor' ? '🩸 Blood Donor Login' : role === 'receiver' ? '🏥 Blood Seeker Login' : '🛡️ Administrator Portal'}
          </Text>
          <Text style={styles.cardDesc}>
            {role === 'donor' 
              ? 'Manage availability, track donation milestones, and view digital donor card.' 
              : role === 'receiver'
              ? 'Find compatible donors, track SOS requests, and connect with hospitals.'
              : 'Authorized LifeLink system administration and verification.'}
          </Text>

          <Text style={styles.label}>{role === 'admin' ? 'Admin Email' : 'Email Address / Phone'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email or phone"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity 
            style={[
              styles.submitBtn,
              role === 'donor' ? styles.btnDonor : role === 'receiver' ? styles.btnReceiver : styles.btnAdmin
            ]} 
            onPress={handleLogin}
          >
            <Text style={styles.submitBtnText}>
              Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>
          </TouchableOpacity>

          {/* Quick Fill Demo Note */}
          <View style={styles.quickFillBox}>
            <Text style={styles.quickFillTitle}>💡 Quick Demo Account:</Text>
            <Text style={styles.quickFillText}>
              {role === 'admin' 
                ? 'Email: sameeradmin@lifelink.com\nPassword: Sameer@14' 
                : role === 'donor'
                ? 'Email: sameershaik9184@gmail.com\nPassword: Donor@123'
                : 'Email: receiver@lifelink.com\nPassword: Receiver@123'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  logoIcon: {
    fontSize: 40,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 30,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTabDonorActive: {
    backgroundColor: Colors.primary,
  },
  roleTabReceiverActive: {
    backgroundColor: Colors.success,
  },
  roleTabAdminActive: {
    backgroundColor: Colors.info,
  },
  roleTabText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  roleTabTextActive: {
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 18,
    lineHeight: 16,
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
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  btnDonor: {
    backgroundColor: Colors.primary,
  },
  btnReceiver: {
    backgroundColor: Colors.success,
  },
  btnAdmin: {
    backgroundColor: Colors.info,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  quickFillBox: {
    marginTop: 18,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  quickFillTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    marginBottom: 2,
  },
  quickFillText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    lineHeight: 16,
  },
});
