import React from 'react';
import { View, StatusBar, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Colors } from './src/constants/theme';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import SearchDonorsScreen from './src/screens/SearchDonorsScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import HospitalsScreen from './src/screens/HospitalsScreen';
import BloodBanksScreen from './src/screens/BloodBanksScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import AdminScreen from './src/screens/AdminScreen';
import FloatingAiAssistant from './src/components/FloatingAiAssistant';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.cardDark },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '900', fontSize: 16 },
        contentStyle: { backgroundColor: Colors.bgDark }
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Hospitals" component={HospitalsScreen} options={{ title: '🏥 Hospitals Network' }} />
      <Stack.Screen name="Blood Banks" component={BloodBanksScreen} options={{ title: '🏦 Blood Banks & Stocks' }} />
      <Stack.Screen name="Admin" component={AdminScreen} options={{ title: '🛡️ Admin Control Panel' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: '🔑 Sign In' }} />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  const { isLoggedIn, user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: Colors.cardDark },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '900', fontSize: 17 },
        tabBarStyle: {
          backgroundColor: Colors.cardDark,
          borderTopColor: Colors.borderDark,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarIcon: ({ focused }) => {
          let icon = '🩸';
          if (route.name === 'Home') icon = '🏠';
          else if (route.name === 'Search') icon = '🔍';
          else if (route.name === 'Emergency') icon = '🚨';
          else if (route.name === 'Hospitals') icon = '🏥';
          else if (route.name === 'Blood Banks') icon = '🏦';
          else if (route.name === 'Profile') icon = '👤';
          return <Text style={{ fontSize: focused ? 18 : 16 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="Search" component={SearchDonorsScreen} options={{ title: 'Find Donors' }} />
      <Tab.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Emergency SOS' }} />
      <Tab.Screen name="Hospitals" component={HospitalsScreen} options={{ title: 'Hospitals Network' }} />
      <Tab.Screen name="Blood Banks" component={BloodBanksScreen} options={{ title: 'Blood Banks' }} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: isLoggedIn ? (user.name ? user.name.split(' ')[0] : 'Profile') : 'Account' }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.appContainer}>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
          <MainTabNavigator />
          {/* Persistent Floating Side AI Assistant (Web-Style) */}
          <FloatingAiAssistant />
        </NavigationContainer>
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  }
});
