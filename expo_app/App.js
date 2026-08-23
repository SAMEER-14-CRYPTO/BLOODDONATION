import React from 'react';
import { View, StatusBar, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Colors } from './src/constants/theme';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreen';
import SearchDonorsScreen from './src/screens/SearchDonorsScreen';
import ReceiverRequestsScreen from './src/screens/ReceiverRequestsScreen';
import HospitalsScreen from './src/screens/HospitalsScreen';
import BloodBanksScreen from './src/screens/BloodBanksScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import AdminScreen from './src/screens/AdminScreen';
import FloatingAiAssistant from './src/components/FloatingAiAssistant';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabNavigator() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: Colors.cardDark },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '900', fontSize: 16 },
        tabBarStyle: {
          backgroundColor: Colors.cardDark,
          borderTopColor: Colors.borderDark,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarIcon: ({ focused }) => {
          let icon = '🩸';
          if (route.name === 'Home') icon = '🏠';
          else if (route.name === 'Donors') icon = '🩸';
          else if (route.name === 'SOS Requests') icon = '🚨';
          else if (route.name === 'Hospitals') icon = '🏥';
          else if (route.name === 'Blood Banks') icon = '🏦';
          else if (route.name === 'Profile') icon = '👤';
          return <Text style={{ fontSize: focused ? 18 : 16 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Donors" component={SearchDonorsScreen} options={{ title: 'Donors Map & Search' }} />
      <Tab.Screen name="SOS Requests" component={ReceiverRequestsScreen} options={{ title: 'Receiver SOS & Map' }} />
      <Tab.Screen name="Hospitals" component={HospitalsScreen} options={{ title: 'Hospitals Network' }} />
      <Tab.Screen name="Blood Banks" component={BloodBanksScreen} options={{ title: 'Blood Banks & Stock' }} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: user?.role === 'admin' ? 'Admin Profile' : 'Donor Profile' }} 
      />
    </Tab.Navigator>
  );
}

function RootNavigation() {
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      
      {/* 🔐 Login comes first if user is not logged in */}
      {!isLoggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.bgDark } }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : (
        <>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: Colors.cardDark },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: { fontWeight: '900', fontSize: 16 },
              contentStyle: { backgroundColor: Colors.bgDark }
            }}
          >
            <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="AdminPanel" component={AdminScreen} options={{ title: '🛡️ Admin Control Panel' }} />
          </Stack.Navigator>

          {/* ✨ Floating AI Assistant ONLY rendered inside the app when logged in */}
          <FloatingAiAssistant />
        </>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.appContainer}>
        <RootNavigation />
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
