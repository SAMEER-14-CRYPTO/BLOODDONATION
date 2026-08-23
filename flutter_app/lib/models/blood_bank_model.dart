/// Blood Bank model with stock metrics (no Firebase dependency)
class BloodBankModel {
  final String id;
  final String name;
  final String address;
  final String contact;
  final Map<String, int> bloodAvailability;
  final double? latitude;
  final double? longitude;
  final double? distance; // calculated at runtime

  BloodBankModel({
    required this.id,
    required this.name,
    required this.address,
    required this.contact,
    this.bloodAvailability = const {},
    this.latitude,
    this.longitude,
    this.distance,
  });

  factory BloodBankModel.fromMap(Map<String, dynamic> map, String id) {
    final raw = (map['bloodAvailability'] ?? map['stocks']) as Map<String, dynamic>? ?? {};
    final availability = raw.map((k, v) => MapEntry(k, (v as num).toInt()));

    return BloodBankModel(
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
