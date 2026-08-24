import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ScrollView, Alert, KeyboardAvoidingView, Platform, StatusBar 
} from 'react-native';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme, ThemeToggleButton } from '../context/ThemeContext';

const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export default function LoginScreen() {
  const { isDark, theme } = useTheme();
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'register'
  const [role, setRole] = useState('donor'); // 'donor' | 'receiver' | 'admin'

  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register State
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const { login, register } = useAuth();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert('Required Field', 'Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Required Field', 'Please enter your password.');
      return;
    }
    if (password.length < 8 || password.length > 12) {
      Alert.alert('Password Length', 'Password must be between 8 and 12 characters.');
      return;
    }

    const res = await login(role, { email, password });
    if (res.success) {
      // Logged in successfully
    } else {
      Alert.alert('Login Notice', res.message || 'Invalid credentials. Please verify your details.');
    }
  };

  const handleRegister = async () => {
    if (!fullName.trim() || !regEmail.trim() || !regPassword.trim() || !phone.trim() || !city.trim()) {
      Alert.alert('Required Fields', 'Please fill in Full Name, Email, Password, Phone Number, and City.');
      return;
    }
    if (regPassword.length < 8 || regPassword.length > 12) {
      Alert.alert('Password Length', 'Password must be between 8 and 12 characters.');
      return;
    }

    const userData = {
      fullName,
      displayName: fullName,
      name: fullName,
      email: regEmail.trim().toLowerCase(),
      password: regPassword,
      phone: phone.trim(),
      bloodGroup: bloodGroup,
      city: city.trim(),
      address: address.trim() || `${city.trim()}, India`,
      role: role, // 'donor' or 'receiver'
      availability: true,
      verified: true,
      isVerified: true
    };

    const res = await register(userData);
    if (res.success) {
      Alert.alert('🎉 Welcome to LifeLink', `Your account has been registered as a verified ${role.toUpperCase()} and connected to the cloud network!`);
    } else {
      Alert.alert('Registration Notice', res.message || 'Could not complete registration. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.bg }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Right Theme Switcher */}
        <View style={styles.topRightThemeRow}>
          <ThemeToggleButton />
        </View>

        {/* Logo Header */}
        <View style={styles.header}>
          <Text style={styles.logoIcon}>🩸</Text>
          <Text style={[styles.title, { color: theme.text }]}>Life<Text style={{ color: Colors.primary }}>Link</Text></Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>Smart Blood Donor & SOS Emergency Network</Text>
        </View>

        {/* ── 1. SIGN IN VIEW (Default Mode) ── */}
        {authMode === 'signin' ? (
          <View>
            {/* Role Tabs for Sign In */}
            <View style={[styles.roleTabs, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={[styles.roleTab, role === 'donor' && styles.roleTabDonorActive]}
                onPress={() => handleRoleChange('donor')}
              >
                <Text style={[styles.roleTabText, { color: role === 'donor' ? '#FFFFFF' : theme.textMuted }]}>🩸 Donor</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.6}
                style={[styles.roleTab, role === 'receiver' && styles.roleTabReceiverActive]}
                onPress={() => handleRoleChange('receiver')}
              >
                <Text style={[styles.roleTabText, { color: role === 'receiver' ? '#FFFFFF' : theme.textMuted }]}>🏥 Receiver</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.6}
                style={[styles.roleTab, role === 'admin' && styles.roleTabAdminActive]}
                onPress={() => handleRoleChange('admin')}
              >
                <Text style={[styles.roleTabText, { color: role === 'admin' ? '#FFFFFF' : theme.textMuted }]}>🛡️ Admin</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Card */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {role === 'donor' ? '🩸 Blood Donor Sign In' : role === 'receiver' ? '🏥 Blood Seeker Sign In' : '🛡️ Admin Control Login'}
              </Text>
              <Text style={[styles.cardDesc, { color: theme.textMuted }]}>
                {role === 'donor' 
                  ? 'Sign in to manage availability, accept emergency SOS alerts & donor badge.' 
                  : role === 'receiver'
                  ? 'Sign in to find compatible donors & broadcast urgent SOS requests.'
                  : 'Administrator credentials required for master database control.'}
              </Text>

              <Text style={[styles.label, { color: theme.text }]}>{role === 'admin' ? 'Administrator Email' : 'Email Address'}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
                placeholder={role === 'admin' ? 'sameeradmin@lifelink.com' : 'Enter your email address'}
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid="transparent"
                cursorColor={role === 'donor' ? Colors.primary : role === 'receiver' ? Colors.success : Colors.info}
                selectionColor={role === 'donor' ? 'rgba(229, 57, 53, 0.3)' : role === 'receiver' ? 'rgba(67, 160, 71, 0.3)' : 'rgba(30, 136, 229, 0.3)'}
              />

              <Text style={[styles.label, { color: theme.text }]}>Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
                placeholder="Enter password"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                maxLength={12}
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid="transparent"
                cursorColor={role === 'donor' ? Colors.primary : role === 'receiver' ? Colors.success : Colors.info}
                selectionColor={role === 'donor' ? 'rgba(229, 57, 53, 0.3)' : role === 'receiver' ? 'rgba(67, 160, 71, 0.3)' : 'rgba(30, 136, 229, 0.3)'}
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity 
                activeOpacity={0.7}
                style={[
                  styles.submitBtn,
                  role === 'donor' ? styles.btnDonor : role === 'receiver' ? styles.btnReceiver : styles.btnAdmin
                ]} 
                onPress={handleSignIn}
              >
                <Text style={styles.submitBtnText}>
                  Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>

              {/* Bottom Register Prompt */}
              {role !== 'admin' && (
                <View style={styles.bottomSwitchContainer}>
                  <View style={styles.dividerRow}>
                    <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                    <Text style={[styles.dividerText, { color: theme.textMuted }]}>NEW TO LIFELINK?</Text>
                    <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                  </View>

                  <TouchableOpacity 
                    style={[styles.bottomRegisterBtn, { borderColor: theme.border, backgroundColor: theme.inputBg }]}
                    onPress={() => {
                      setAuthMode('register');
                      if (role === 'admin') setRole('donor');
                    }}
                  >
                    <Text style={[styles.bottomRegisterBtnText, { color: theme.text }]}>
                      ✨ Register as a {role === 'donor' ? 'Donor' : 'Receiver'} →
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ) : (
          /* ── 2. REGISTER / SIGN UP VIEW ── */
          <View>
            {/* Role Tabs for Register (Only Donor & Receiver) */}
            <View style={[styles.roleTabs, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={[styles.roleTab, role === 'donor' && styles.roleTabDonorActive]}
                onPress={() => handleRoleChange('donor')}
              >
                <Text style={[styles.roleTabText, { color: role === 'donor' ? '#FFFFFF' : theme.textMuted }]}>🩸 Register as Donor</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.6}
                style={[styles.roleTab, role === 'receiver' && styles.roleTabReceiverActive]}
                onPress={() => handleRoleChange('receiver')}
              >
                <Text style={[styles.roleTabText, { color: role === 'receiver' ? '#FFFFFF' : theme.textMuted }]}>🏥 Register as Receiver</Text>
              </TouchableOpacity>
            </View>

            {/* Register Card */}
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {role === 'donor' ? '🩸 Register as Blood Donor' : '🏥 Register as Blood Receiver'}
              </Text>
              <Text style={[styles.cardDesc, { color: theme.textMuted }]}>
                {role === 'donor'
                  ? 'Join our live donor network to save lives and respond to urgent hospital broadcasts.'
                  : 'Create an account to quickly connect with donors & post emergency requests.'}
              </Text>

              <Text style={[styles.label, { color: theme.text }]}>Full Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g. Ramesh Kumar"
                placeholderTextColor={theme.textMuted}
                value={fullName}
                onChangeText={setFullName}
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid="transparent"
                cursorColor={role === 'donor' ? Colors.primary : Colors.success}
              />

              <Text style={[styles.label, { color: theme.text }]}>Email Address *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g. ramesh@example.com"
                placeholderTextColor={theme.textMuted}
                value={regEmail}
                onChangeText={setRegEmail}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid="transparent"
                cursorColor={role === 'donor' ? Colors.primary : Colors.success}
              />

              <Text style={[styles.label, { color: theme.text }]}>Password *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
                placeholder="Enter password (8 to 12 chars)"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
                maxLength={12}
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid="transparent"
                cursorColor={role === 'donor' ? Colors.primary : Colors.success}
                value={regPassword}
                onChangeText={setRegPassword}
              />

              <Text style={[styles.label, { color: theme.text }]}>Contact Phone *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
                placeholder="+91-9876543210"
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
                autoCorrect={false}
                spellCheck={false}
                underlineColorAndroid="transparent"
                cursorColor={role === 'donor' ? Colors.primary : Colors.success}
                value={phone}
                onChangeText={setPhone}
              />

              <Text style={[styles.label, { color: theme.text }]}>{role === 'donor' ? 'Blood Group (Donor) *' : 'Blood Group Needed *'}</Text>
              <View style={styles.bloodGrid}>
                {BLOOD_TYPES.map(bg => (
                  <TouchableOpacity
                    key={bg}
                    style={[
                      styles.bloodBtn, 
                      { backgroundColor: theme.inputBg, borderColor: theme.border },
                      bloodGroup === bg && styles.bloodBtnActive
                    ]}
                    onPress={() => setBloodGroup(bg)}
                  >
                    <Text style={[styles.bloodBtnText, { color: bloodGroup === bg ? '#FFFFFF' : theme.textMuted }]}>{bg}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: theme.text }]}>City / Location *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g. Chennai, Tirupati, Coimbatore, Vizag"
                placeholderTextColor={theme.textMuted}
                value={city}
                onChangeText={setCity}
              />

              <Text style={[styles.label, { color: theme.text }]}>Address / Area (Optional)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
                placeholder="e.g. Anna Nagar, Chennai"
                placeholderTextColor={theme.textMuted}
                value={address}
                onChangeText={setAddress}
              />

              <TouchableOpacity 
                activeOpacity={0.7}
                style={[
                  styles.submitBtn,
                  role === 'donor' ? styles.btnDonor : styles.btnReceiver
                ]} 
                onPress={handleRegister}
              >
                <Text style={styles.submitBtnText}>
                  Create {role === 'donor' ? 'Donor' : 'Receiver'} Account
                </Text>
              </TouchableOpacity>

              {/* Bottom Back to Sign In Link */}
              <View style={styles.bottomSwitchContainer}>
                <View style={styles.dividerRow}>
                  <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                  <Text style={[styles.dividerText, { color: theme.textMuted }]}>ALREADY REGISTERED?</Text>
                  <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                </View>

                <TouchableOpacity 
                  style={[styles.bottomRegisterBtn, { borderColor: theme.border, backgroundColor: theme.inputBg }]}
                  onPress={() => setAuthMode('signin')}
                >
                  <Text style={[styles.bottomRegisterBtnText, { color: theme.text }]}>
                    ← Back to Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  topRightThemeRow: {
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
  },
  logoIcon: {
    fontSize: 38,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  roleTabs: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 30,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 8,
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
    fontSize: 12,
    fontWeight: '800',
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
  },
  bloodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  bloodBtn: {
    width: '23%',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  bloodBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  bloodBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  submitBtn: {
    paddingVertical: 13,
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
  bottomSwitchContainer: {
    marginTop: 20,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bottomRegisterBtn: {
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  bottomRegisterBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
