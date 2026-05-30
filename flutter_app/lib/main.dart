import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/donor_provider.dart';
import 'providers/request_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/signup_screen.dart';
import 'screens/auth/otp_screen.dart';
import 'screens/home_screen.dart';
import 'screens/search/search_donor_screen.dart';
import 'screens/search/donor_detail_screen.dart';
import 'screens/emergency/emergency_request_screen.dart';
import 'screens/hospital/hospital_list_screen.dart';
import 'screens/hospital/blood_bank_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/notifications_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/admin/admin_panel_screen.dart';
import 'utils/theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(const LifeLinkApp());
}

class LifeLinkApp extends StatelessWidget {
  const LifeLinkApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => DonorProvider()),
        ChangeNotifierProvider(create: (_) => RequestProvider()),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          return MaterialApp(
            title: 'LifeLink',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: ThemeMode.light,
            initialRoute: '/',
            routes: {
              '/': (context) => const SplashScreen(),
              '/onboarding': (context) => const OnboardingScreen(),
              '/login': (context) => const LoginScreen(),
              '/signup': (context) => const SignupScreen(),
              '/otp': (context) => const OTPScreen(),
              '/home': (context) => const HomeScreen(),
              '/search': (context) => const SearchDonorScreen(),
              '/emergency': (context) => const EmergencyRequestScreen(),
              '/hospitals': (context) => const HospitalListScreen(),
              '/blood-banks': (context) => const BloodBankScreen(),
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
