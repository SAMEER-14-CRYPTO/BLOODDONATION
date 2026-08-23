import 'package:flutter/material.dart';
import '../models/emergency_request_model.dart';
import '../services/firestore_service.dart';

/// State Management Provider for Emergency Blood Requests
class RequestProvider extends ChangeNotifier {
  final FirestoreService _firestoreService = FirestoreService();

  List<EmergencyRequestModel> _requests = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<EmergencyRequestModel> get requests => _requests;
  List<EmergencyRequestModel> get activeRequests =>
      _requests.where((r) => r.status == 'active').toList();
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  RequestProvider() {
    loadRequests();
  }

  Future<void> loadRequests() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _requests = await _firestoreService.getAllEmergencyRequests();
      _isLoading = false;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
    }
    notifyListeners();
  }

  Future<bool> createRequest(EmergencyRequestModel request) async {
    _isLoading = true;
    notifyListeners();

    try {
      await _firestoreService.createEmergencyRequest(request);
      await loadRequests();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> updateStatus(String requestId, String status) async {
    await _firestoreService.updateEmergencyRequestStatus(requestId, status);
    await loadRequests();
  }
}
