import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';
import '../services/firestore_service.dart';

/// State Management Provider for Authentication and User Profile
class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  final FirestoreService _firestoreService = FirestoreService();

  UserModel? _user;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get user => _user;
  bool get isLoggedIn => _user != null;
  bool get isLoading => _isLoading;
  bool get isAdmin => _user?.role == 'admin';
  String? get errorMessage => _errorMessage;

  AuthProvider() {
    _init();
  }

  /// Initialize with demo user if available
  void _init() {
    _authService.authStateChanges.listen((UserModel? user) async {
      _user = user;
      notifyListeners();
    });
  }

  /// Refresh user profile data
  Future<void> refreshUser() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _user = await _authService.getCurrentUserProfile();
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Sign in with email and password
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _user = await _authService.signInWithEmailAndPassword(email, password);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Sign up / Register account
  Future<bool> signup({
    required String fullName,
    required String email,
    required String password,
    required String phone,
    required String bloodGroup,
    required String gender,
    String? dateOfBirth,
    int? age,
    required String city,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _user = await _authService.createUserWithEmailAndPassword(
        email: email,
        password: password,
        fullName: fullName,
        phone: phone,
        bloodGroup: bloodGroup,
        gender: gender,
        dateOfBirth: dateOfBirth ?? (age != null ? '${DateTime.now().year - age}-01-01' : null),
        city: city,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Sign out
  Future<void> logout() async {
    await _authService.signOut();
    _user = null;
    notifyListeners();
  }

  /// Update user profile
  Future<bool> updateProfile(UserModel updated) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _firestoreService.updateUser(updated.uid, updated.toMap());
      _user = updated;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Toggle donor availability status
  Future<void> toggleAvailability() async {
    if (_user != null) {
      final newStatus = _user!.donorStatus == 'Active' ? 'Inactive' : 'Active';
      final updated = _user!.copyWith(donorStatus: newStatus);
      await updateProfile(updated);
    }
  }
}
