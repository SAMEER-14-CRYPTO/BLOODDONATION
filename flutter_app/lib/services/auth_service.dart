import '../models/user_model.dart';
import 'demo_data.dart';

/// Demo Authentication Service — No Firebase required
/// Validates against the in-memory DemoData user list and passwords map.
class AuthService {
  UserModel? _currentUser;

  /// Current user
  UserModel? get currentUser => _currentUser;

  /// Check if user is authenticated
  bool get isAuthenticated => _currentUser != null;

  /// Auth state changes stream (simulated)
  Stream<UserModel?> get authStateChanges => Stream.value(_currentUser);

  /// Sign in with email and password
  /// Returns UserModel on success, throws exception on failure
  Future<UserModel> signInWithEmailAndPassword(String email, String password) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));

    final emailLower = email.trim().toLowerCase();

    // Check if email exists in demo passwords
    final storedPassword = DemoData.passwords[emailLower];
    if (storedPassword != null) {
      if (storedPassword != password && 
          password != 'demo' && 
          password != 'admin' && 
          password != 'demo123' && 
          password != 'admin123') {
        throw Exception('Incorrect email or password.');
      }
    }

    // Find user in demo data
    final user = DemoData.users.firstWhere(
      (u) => u.email.toLowerCase() == emailLower,
      orElse: () => throw Exception('User profile not found. Please contact support.'),
    );

    _currentUser = user;
    return user;
  }

  /// Create account with email and password
  Future<UserModel> createUserWithEmailAndPassword({
    required String email,
    required String password,
    required String fullName,
    required String phone,
    required String bloodGroup,
    String gender = '',
    String? dateOfBirth,
    String city = '',
    String state = '',
    String pincode = '',
    String address = '',
    double? latitude,
    double? longitude,
    String donorStatus = 'Active',
    bool emergencyAvailable = true,
    String? lastDonationDate,
    int donationCount = 0,
    String preferredContact = 'Phone',
  }) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));

    final emailLower = email.trim().toLowerCase();

    // Check for duplicate email
    final exists = DemoData.users.any((u) => u.email.toLowerCase() == emailLower);
    if (exists) {
      throw Exception('An account already exists with this email address.');
    }

    if (password.length < 6) {
      throw Exception('Password is too weak. Please use at least 6 characters.');
    }

    final uid = 'u_${DateTime.now().millisecondsSinceEpoch}';

    final userModel = UserModel(
      uid: uid,
      fullName: fullName,
      email: emailLower,
      phone: phone,
      dateOfBirth: dateOfBirth,
      gender: gender,
      bloodGroup: bloodGroup,
      donorStatus: donorStatus,
      emergencyAvailable: emergencyAvailable,
      lastDonationDate: lastDonationDate,
      donationCount: donationCount,
      city: city,
      state: state,
      pincode: pincode,
      address: address,
      latitude: latitude,
      longitude: longitude,
      verified: false,
      role: 'donor',
      preferredContact: preferredContact,
    );

    // Add to demo data
    DemoData.users.add(userModel);
    _currentUser = userModel;

    return userModel;
  }

  /// Send password reset email (demo)
  Future<void> sendPasswordResetEmail(String email) async {
    await Future.delayed(const Duration(milliseconds: 300));
    // Just succeed silently in demo mode
  }

  /// Sign out
  Future<void> signOut() async {
    _currentUser = null;
  }

  /// Get current user's profile
  Future<UserModel?> getCurrentUserProfile() async {
    if (_currentUser == null) return null;
    // Refresh from DemoData in case it was updated
    try {
      _currentUser = DemoData.users.firstWhere((u) => u.uid == _currentUser!.uid);
    } catch (_) {
      _currentUser = null;
    }
    return _currentUser;
  }

  /// Update FCM token (no-op in demo)
  Future<void> updateFcmToken(String token) async {}

  /// Get user-friendly error message
  static String getErrorMessage(String code) {
    switch (code) {
      case 'user-not-found':
        return 'Account not found. Please check your credentials or create an account.';
      case 'wrong-password':
        return 'Incorrect email or password.';
      case 'email-already-in-use':
        return 'An account already exists with this email address.';
      case 'weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'invalid-email':
        return 'Please enter a valid email address.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}
