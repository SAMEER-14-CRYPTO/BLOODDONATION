import 'package:flutter/material.dart';
import '../models/models.dart';
import '../services/demo_data.dart';

class DonorProvider extends ChangeNotifier {
  List<UserModel> _donors = [];
  String _selectedBloodGroup = 'All';
  String _searchCity = '';
  bool _availableOnly = false;

  List<UserModel> get donors => _donors;
  String get selectedBloodGroup => _selectedBloodGroup;

  void loadDonors() {
    _donors = DemoData.users.where((u) => u.role == 'donor').toList();
    notifyListeners();
  }

  void searchDonors({String? bloodGroup, String? city, bool? availableOnly}) {
    _selectedBloodGroup = bloodGroup ?? _selectedBloodGroup;
    _searchCity = city ?? _searchCity;
    _availableOnly = availableOnly ?? _availableOnly;

    _donors = DemoData.users.where((u) => u.role == 'donor').where((u) {
      if (_selectedBloodGroup != 'All' && u.bloodGroup != _selectedBloodGroup) return false;
      if (_searchCity.isNotEmpty && !u.city.toLowerCase().contains(_searchCity.toLowerCase())) return false;
      if (_availableOnly && !u.availability) return false;
      return true;
    }).toList();
    notifyListeners();
  }

  void setBloodGroup(String group) {
    _selectedBloodGroup = group;
    searchDonors();
  }
}

class RequestProvider extends ChangeNotifier {
  List<BloodRequest> _requests = [];

  List<BloodRequest> get requests => _requests;
  List<BloodRequest> get activeRequests => _requests.where((r) => r.status == 'active').toList();

  void loadRequests() {
    _requests = DemoData.requests;
    notifyListeners();
  }

  void addRequest(BloodRequest request) {
    _requests.insert(0, request);
    notifyListeners();
  }

  void respondToRequest(String id) {
    final idx = _requests.indexWhere((r) => r.id == id);
    if (idx != -1) {
      final r = _requests[idx];
      _requests[idx] = BloodRequest(
        id: r.id, requesterName: r.requesterName, patientName: r.patientName,
        bloodGroupNeeded: r.bloodGroupNeeded, hospitalName: r.hospitalName,
        location: r.location, urgencyLevel: r.urgencyLevel, status: r.status,
        responses: r.responses + 1, createdAt: r.createdAt,
      );
      notifyListeners();
    }
  }
}
