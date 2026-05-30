import 'package:flutter/material.dart';
import '../models/models.dart';
import '../services/demo_data.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  bool _isLoading = false;

  UserModel? get user => _user;
  bool get isLoggedIn => _user != null;
  bool get isLoading => _isLoading;
  bool get isAdmin => _user?.role == 'admin';

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 1));
    final users = DemoData.users;
    final found = users.where((u) => u.email == email).toList();
    if (found.isNotEmpty) {
      _user = found.first;
    } else {
      _user = UserModel(
        uid: 'demo_${DateTime.now().millisecondsSinceEpoch}',
        fullName: email.split('@')[0],
        email: email,
        bloodGroup: 'O+',
        role: email.contains('admin') ? 'admin' : 'donor',
        verified: true,
      );
    }
    _isLoading = false;
    notifyListeners();
    return true;
  }

  Future<bool> signup({
    required String fullName, required String email, required String password,
    required String phone, required String bloodGroup, required String gender,
    required int age, required String city,
  }) async {
    _isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(seconds: 1));
    _user = UserModel(
      uid: 'user_${DateTime.now().millisecondsSinceEpoch}',
      fullName: fullName, email: email, phone: phone,
      bloodGroup: bloodGroup, gender: gender, age: age, city: city,
    );
    DemoData.users.add(_user!);
    _isLoading = false;
    notifyListeners();
    return true;
  }

  void logout() {
    _user = null;
    notifyListeners();
  }

  void updateProfile(UserModel updated) {
    _user = updated;
    notifyListeners();
  }

  void toggleAvailability() {
    if (_user != null) {
      _user = _user!.copyWith(availability: !_user!.availability);
      notifyListeners();
    }
  }
}
