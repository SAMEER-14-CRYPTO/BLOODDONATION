import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/firestore_service.dart';
import '../services/location_service.dart';

/// Donor search provider with real Firestore + GPS distance filtering
class DonorProvider extends ChangeNotifier {
  final FirestoreService _firestoreService = FirestoreService();

  List<UserModel> _donors = [];
  List<UserModel> _filteredDonors = [];
  String _selectedBloodGroup = 'All';
  double _searchRadius = 50.0; // km
  String _searchCity = '';
  bool _availableOnly = false;
  bool _emergencyOnly = false;
  bool _isLoading = false;
  String? _errorMessage;

  // User's location for distance calc
  double? _userLat;
  double? _userLng;

  List<UserModel> get donors => _filteredDonors;
  String get selectedBloodGroup => _selectedBloodGroup;
  double get searchRadius => _searchRadius;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get availableOnly => _availableOnly;
  bool get emergencyOnly => _emergencyOnly;

  /// Set user location for distance calculations
  void setUserLocation(double lat, double lng) {
    _userLat = lat;
    _userLng = lng;
  }

  /// Load donors from Firestore
  Future<void> loadDonors() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _donors = await _firestoreService.searchDonors(
        bloodGroup: _selectedBloodGroup == 'All' ? null : _selectedBloodGroup,
        availableOnly: _availableOnly,
        emergencyOnly: _emergencyOnly,
      );
      _applyFilters();
      _isLoading = false;
    } catch (e) {
      _errorMessage = 'Unable to load nearby donors. Please try again.';
      _isLoading = false;
    }
    notifyListeners();
  }

  /// Search donors with filters
  Future<void> searchDonors({
    String? bloodGroup,
    String? city,
    bool? availableOnly,
    bool? emergencyOnly,
    double? radius,
  }) async {
    _selectedBloodGroup = bloodGroup ?? _selectedBloodGroup;
    _searchCity = city ?? _searchCity;
    _availableOnly = availableOnly ?? _availableOnly;
    _emergencyOnly = emergencyOnly ?? _emergencyOnly;
    _searchRadius = radius ?? _searchRadius;

    await loadDonors();
  }

  /// Set blood group filter
  void setBloodGroup(String group) {
    _selectedBloodGroup = group;
    searchDonors();
  }

  /// Set search radius
  void setSearchRadius(double radius) {
    _searchRadius = radius;
    _applyFilters();
    notifyListeners();
  }

  /// Toggle available only filter
  void toggleAvailableOnly() {
    _availableOnly = !_availableOnly;
    searchDonors();
  }

  /// Apply local filters (distance, city)
  void _applyFilters() {
    _filteredDonors = _donors.where((donor) {
      // City filter
      if (_searchCity.isNotEmpty &&
          !donor.city.toLowerCase().contains(_searchCity.toLowerCase())) {
        return false;
      }

      // Distance filter (only if user location and donor location available)
      if (_userLat != null && _userLng != null && donor.hasLocation) {
        final distance = LocationService.calculateDistance(
          _userLat!, _userLng!,
          donor.latitude!, donor.longitude!,
        );
        if (distance > _searchRadius) return false;
      }

      return true;
    }).toList();

    // Sort by distance if user location available
    if (_userLat != null && _userLng != null) {
      _filteredDonors.sort((a, b) {
        if (!a.hasLocation && !b.hasLocation) return 0;
        if (!a.hasLocation) return 1;
        if (!b.hasLocation) return -1;

        final distA = LocationService.calculateDistance(
            _userLat!, _userLng!, a.latitude!, a.longitude!);
        final distB = LocationService.calculateDistance(
            _userLat!, _userLng!, b.latitude!, b.longitude!);
        return distA.compareTo(distB);
      });
    }

    // Prioritize verified donors
    _filteredDonors.sort((a, b) {
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      return 0;
    });
  }

  /// Get distance between user and a donor
  double? getDistanceToDonor(UserModel donor) {
    if (_userLat == null || _userLng == null || !donor.hasLocation) return null;
    return LocationService.calculateDistance(
      _userLat!, _userLng!,
      donor.latitude!, donor.longitude!,
    );
  }

  /// Get donors for map display (with location)
  List<UserModel> get donorsWithLocation =>
      _filteredDonors.where((d) => d.hasLocation).toList();

  /// Clear filters
  void clearFilters() {
    _selectedBloodGroup = 'All';
    _searchCity = '';
    _availableOnly = false;
    _emergencyOnly = false;
    _searchRadius = 50.0;
    loadDonors();
  }
}
