import 'dart:math';

/// Location Service — Pure Dart implementation (no GPS/geocoding dependencies)
/// Provides distance calculations and mock location for demo mode.
class LocationService {
  /// Mock: Get current position (returns Mumbai demo location)
  Future<LocationPosition> getCurrentPosition() async {
    await Future.delayed(const Duration(milliseconds: 300));
    // Return demo location: Mumbai
    return LocationPosition(latitude: 19.076, longitude: 72.877);
  }

  /// Check if location services are enabled (always true in demo)
  Future<bool> isLocationEnabled() async => true;

  /// Reverse geocode coordinates to address (mock)
  Future<LocationInfo> reverseGeocode(double latitude, double longitude) async {
    return LocationInfo(
      latitude: latitude,
      longitude: longitude,
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      address: 'Mumbai, Maharashtra, India',
    );
  }

  /// Calculate distance between two coordinates in kilometers
  /// Uses the Haversine formula
  static double calculateDistance(
    double lat1, double lon1,
    double lat2, double lon2,
  ) {
    const double earthRadius = 6371.0; // Earth's radius in km

    final double dLat = _toRadians(lat2 - lat1);
    final double dLon = _toRadians(lon2 - lon1);

    final double a = sin(dLat / 2) * sin(dLat / 2) +
        cos(_toRadians(lat1)) *
            cos(_toRadians(lat2)) *
            sin(dLon / 2) *
            sin(dLon / 2);

    final double c = 2 * atan2(sqrt(a), sqrt(1 - a));

    return earthRadius * c;
  }

  static double _toRadians(double degree) {
    return degree * pi / 180;
  }

  /// Format distance for display
  static String formatDistance(double distanceKm) {
    if (distanceKm < 1) {
      return '${(distanceKm * 1000).round()} m';
    } else if (distanceKm < 10) {
      return '${distanceKm.toStringAsFixed(1)} km';
    } else {
      return '${distanceKm.round()} km';
    }
  }

  /// Check if a coordinate is within radius (km)
  static bool isWithinRadius(
    double lat1, double lon1,
    double lat2, double lon2,
    double radiusKm,
  ) {
    final distance = calculateDistance(lat1, lon1, lat2, lon2);
    return distance <= radiusKm;
  }
}

/// Simple position container
class LocationPosition {
  final double latitude;
  final double longitude;
  LocationPosition({required this.latitude, required this.longitude});
}

/// Location info container
class LocationInfo {
  final double latitude;
  final double longitude;
  final String address;
  final String city;
  final String state;
  final String pincode;
  final String country;

  LocationInfo({
    required this.latitude,
    required this.longitude,
    this.address = '',
    this.city = '',
    this.state = '',
    this.pincode = '',
    this.country = 'India',
  });

  String get displayString {
    if (city.isNotEmpty && state.isNotEmpty) {
      return '$city, $state';
    }
    if (city.isNotEmpty) return city;
    return address.isNotEmpty ? address : 'Unknown location';
  }

  bool get isValid => city.isNotEmpty;
}

/// Custom exception for location errors
class LocationException implements Exception {
  final String message;
  LocationException(this.message);

  @override
  String toString() => message;
}
