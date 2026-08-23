import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/donor_provider.dart';
import 'providers/request_provider.dart';
import 'providers/theme_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/signup_screen.dart';
import 'screens/auth/otp_screen.dart';
import 'screens/home_screen.dart';
import 'screens/dashboard/dashboard_screen.dart';
import 'screens/search/search_donor_screen.dart';
import 'screens/emergency/emergency_request_screen.dart';
import 'screens/hospital/hospital_list_screen.dart';
import 'screens/hospital/blood_bank_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/notifications_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/admin/admin_panel_screen.dart';
import 'screens/about/about_screen.dart';
import 'screens/contact/contact_screen.dart';
import 'screens/auth/become_donor_screen.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'services/firebase_service.dart';
import 'core/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    await FirebaseService.initialize();
  } catch (e) {
    debugPrint('Firebase running in local/fallback mode: $e');
  }
  runApp(const LifeLinkApp());
}

class LifeLinkApp extends StatelessWidget {
  const LifeLinkApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => DonorProvider()),
        ChangeNotifierProvider(create: (_) => RequestProvider()),
      ],
      child: Consumer2<ThemeProvider, AuthProvider>(
        builder: (context, themeProvider, authProvider, _) {
          return MaterialApp(
            title: 'LifeLink',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeProvider.themeMode,
            initialRoute: authProvider.isLoggedIn
                ? (authProvider.isAdmin ? '/admin' : '/home')
                : '/login',
            routes: {
              '/': (context) => authProvider.isLoggedIn
                  ? (authProvider.isAdmin ? const AdminPanelScreen() : const HomeScreen())
                  : const LoginScreen(),
              '/login': (context) => const LoginScreen(),
              '/signup': (context) => const SignupScreen(),
              '/otp': (context) => const OTPScreen(),
              '/home': (context) => const HomeScreen(),
              '/dashboard': (context) => const DashboardScreen(),
              '/search': (context) => const SearchDonorScreen(),
              '/emergency': (context) => const EmergencyRequestScreen(),
              '/hospitals': (context) => const HospitalListScreen(),
              '/blood-banks': (context) => const BloodBankScreen(),
              '/about': (context) => const AboutScreen(),
              '/contact': (context) => const ContactScreen(),
              '/become-donor': (context) => const BecomeDonorScreen(),
              '/profile': (context) => const ProfileScreen(),
              '/notifications': (context) => const NotificationsScreen(),
              '/settings': (context) => const SettingsScreen(),
              '/admin': (context) => const AdminPanelScreen(),
            },
          );
        },
      ),
    );
  }
}
