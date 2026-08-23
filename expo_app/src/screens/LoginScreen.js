import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [role, setRole] = useState('donor'); // 'donor' | 'receiver' | 'admin'
  const [email, setEmail] = useState('sameershaik9184@gmail.com');
  const [password, setPassword] = useState('Donor@123');
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

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Required', 'Please enter email address');
      return;
    }

    const res = await login(role, { email, password: password || '123456' });
    if (res.success) {
      // User is logged in, RootNavigation will automatically render the main app
    } else {
      Alert.alert('Login Notice', res.message || 'Invalid credentials. Please verify details.');
    }
  };

  const handleQuickDemoLogin = (demoRole) => {
    handleRoleChange(demoRole);
    const demoEmail = demoRole === 'admin' ? 'sameeradmin@lifelink.com' : demoRole === 'donor' ? 'sameershaik9184@gmail.com' : 'receiver@lifelink.com';
    const demoPass = demoRole === 'admin' ? 'Sameer@14' : 'Donor@123';
    login(demoRole, { email: demoEmail, password: demoPass });
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
          <Text style={styles.subtitle}>Smart Blood Donor Network</Text>
        </View>

        {/* Role Tabs (Donor vs Receiver vs Admin) - Exact Web Design */}
        <View style={styles.roleTabs}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.roleTab, role === 'donor' && styles.roleTabDonorActive]}
            onPress={() => handleRoleChange('donor')}
          >
            <Text style={[styles.roleTabText, role === 'donor' && styles.roleTabTextActive]}>🩸 Donor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.roleTab, role === 'receiver' && styles.roleTabReceiverActive]}
            onPress={() => handleRoleChange('receiver')}
          >
            <Text style={[styles.roleTabText, role === 'receiver' && styles.roleTabTextActive]}>🏥 Receiver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.roleTab, role === 'admin' && styles.roleTabAdminActive]}
            onPress={() => handleRoleChange('admin')}
          >
            <Text style={[styles.roleTabText, role === 'admin' && styles.roleTabTextActive]}>🛡️ Admin</Text>
          </TouchableOpacity>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {role === 'donor' ? '🩸 Blood Donor Sign In' : role === 'receiver' ? '🏥 Blood Seeker Sign In' : '🛡️ Admin Control Login'}
          </Text>
          <Text style={styles.cardDesc}>
            {role === 'donor' 
              ? 'Sign in to manage donation availability, emergency alerts & donor card.' 
              : role === 'receiver'
              ? 'Sign in to find compatible donors & broadcast urgent patient requests.'
              : 'Admin access for user verification and platform management.'}
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
            activeOpacity={0.7}
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

          {/* 1-Tap Quick Demo Buttons */}
          <View style={styles.quickFillBox}>
            <Text style={styles.quickFillTitle}>⚡ 1-Tap Instant Demo Login:</Text>
            <View style={styles.quickBtnRow}>
              <TouchableOpacity 
                activeOpacity={0.6}
                style={[styles.quickPill, { borderColor: Colors.primary }]}
                onPress={() => handleQuickDemoLogin('donor')}
              >
                <Text style={[styles.quickPillText, { color: Colors.primary }]}>🩸 Donor</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                activeOpacity={0.6}
                style={[styles.quickPill, { borderColor: Colors.success }]}
                onPress={() => handleQuickDemoLogin('receiver')}
              >
                <Text style={[styles.quickPillText, { color: Colors.success }]}>🏥 Receiver</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                activeOpacity={0.6}
                style={[styles.quickPill, { borderColor: Colors.info }]}
                onPress={() => handleQuickDemoLogin('admin')}
              >
                <Text style={[styles.quickPillText, { color: Colors.info }]}>🛡️ Admin</Text>
              </TouchableOpacity>
            </View>
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  quickFillTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    marginBottom: 8,
  },
  quickBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  quickPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
