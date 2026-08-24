import React from 'react';
import { View, StatusBar, Text, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Colors } from './src/constants/theme';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider, useTheme, ThemeToggleButton } from './src/context/ThemeContext';
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

// ── 1. Dedicated Admin Tab Navigator (When logged in as Administrator) ──
function AdminTabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '900', fontSize: 16 },
        headerRight: () => <ThemeToggleButton style={{ marginRight: 14 }} />,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarIcon: ({ focused }) => {
          let icon = '🛡️';
          if (route.name === 'Admin Panel') icon = '🛡️';
          else if (route.name === 'SOS Emergency') icon = '🚨';
          else if (route.name === 'Donors Directory') icon = '🩸';
          else if (route.name === 'Hospitals') icon = '🏥';
          else if (route.name === 'Admin Profile') icon = '👤';
          return <Text style={{ fontSize: focused ? 18 : 16 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen 
        name="Admin Panel" 
        component={AdminScreen} 
        options={{ headerShown: false, title: 'Admin Control' }} 
      />
      <Tab.Screen 
        name="SOS Emergency" 
        component={ReceiverRequestsScreen} 
        options={{ title: '🚨 SOS Emergency (Admin View)' }} 
      />
      <Tab.Screen 
        name="Donors Directory" 
        component={SearchDonorsScreen} 
        options={{ title: '🩸 Donors & Seekers (Admin View)' }} 
      />
      <Tab.Screen 
        name="Hospitals" 
        component={HospitalsScreen} 
        options={{ title: '🏥 Hospitals Network' }} 
      />
      <Tab.Screen 
        name="Admin Profile" 
        component={ProfileScreen} 
        options={{ title: '👤 Administrator Profile' }} 
      />
    </Tab.Navigator>
  );
}

// ── 2. Standard User Tab Navigator (Donor / Receiver) ──
function MainTabNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '900', fontSize: 16 },
        headerRight: () => <ThemeToggleButton style={{ marginRight: 14 }} />,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
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
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'User Profile' }} />
    </Tab.Navigator>
  );
}

function RootNavigation() {
  const { isLoggedIn, user } = useAuth();
  const { isDark, theme } = useTheme();
  const isAdmin = user?.role === 'admin';

  const baseTheme = isDark ? NavDarkTheme : DefaultTheme;
  const navTheme = {
    ...baseTheme,
    dark: isDark,
    colors: {
      ...baseTheme.colors,
      primary: theme.primary,
      background: theme.bg,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      notification: theme.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />
      
      {/* 🔐 Login comes first if user is not logged in */}
      {!isLoggedIn ? (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : (
        <>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: theme.card },
              headerTintColor: theme.text,
              headerTitleStyle: { fontWeight: '900', fontSize: 16 },
              headerRight: () => <ThemeToggleButton style={{ marginRight: 14 }} />,
              contentStyle: { backgroundColor: theme.bg }
            }}
          >
            {isAdmin ? (
              <Stack.Screen 
                name="AdminTabs" 
                component={AdminTabNavigator} 
                options={{ headerShown: false }} 
              />
            ) : (
              <Stack.Screen 
                name="MainTabs" 
                component={MainTabNavigator} 
                options={{ headerShown: false }} 
              />
            )}
            <Stack.Screen 
              name="AdminPanel" 
              component={AdminScreen} 
              options={{ title: '🛡️ Admin Control Panel' }} 
            />
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
    <ThemeProvider>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppWrapper() {
  const { theme } = useTheme();
  return (
    <View style={[styles.appContainer, { backgroundColor: theme.bg }]}>
      <RootNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  }
});
