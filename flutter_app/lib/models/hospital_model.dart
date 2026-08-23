/// Hospital model with blood stock availability (no Firebase dependency)
class HospitalModel {
  final String id;
  final String name;
  final String address;
  final String contact;
  final Map<String, int> bloodAvailability;
  final double? latitude;
  final double? longitude;
  final double? distance; // calculated at runtime

  HospitalModel({
    required this.id,
    required this.name,
    required this.address,
    required this.contact,
    this.bloodAvailability = const {},
    this.latitude,
    this.longitude,
    this.distance,
  });

  // Legacy aliases
  double? get lat => latitude;
  double? get lng => longitude;

  factory HospitalModel.fromMap(Map<String, dynamic> map, String id) {
    final availabilityData = map['bloodAvailability'] as Map<String, dynamic>? ?? {};
    final availability = availabilityData.map((k, v) => MapEntry(k, (v as num).toInt()));

    return HospitalModel(
      id: id,
      name: map['name'] ?? '',
      address: map['address'] ?? '',
      contact: map['contact'] ?? map['phone'] ?? '',
      bloodAvailability: availability,
      latitude: (map['latitude'] ?? map['lat'])?.toDouble(),
      longitude: (map['longitude'] ?? map['lng'])?.toDouble(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'address': address,
      'contact': contact,
      'bloodAvailability': bloodAvailability,
      'latitude': latitude,
      'longitude': longitude,
    };
  }

  Map<String, dynamic> toFirestore() => toMap();
}
