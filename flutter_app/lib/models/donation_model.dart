/// Donation record model (no Firebase dependency)
class DonationModel {
  final String donationId;
  final String donorId;
  final String donorName;
  final String bloodGroup;
  final DateTime donationDate;
  final String hospital;
  final double units;
  final String city;
  final String notes;
  final bool verified;
  final DateTime createdAt;

  DonationModel({
    required this.donationId,
    required this.donorId,
    required this.donorName,
    required this.bloodGroup,
    required this.donationDate,
    required this.hospital,
    this.units = 1.0,
    this.city = '',
    this.notes = '',
    this.verified = false,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory DonationModel.fromMap(Map<String, dynamic> map, String id) {
    return DonationModel(
      donationId: id,
      donorId: map['donorId'] ?? '',
      donorName: map['donorName'] ?? '',
      bloodGroup: map['bloodGroup'] ?? 'O+',
      donationDate: _parseDateTime(map['donationDate']) ?? DateTime.now(),
      hospital: map['hospital'] ?? map['hospitalName'] ?? '',
      units: (map['units'] ?? 1.0).toDouble(),
      city: map['city'] ?? '',
      notes: map['notes'] ?? map['remarks'] ?? '',
      verified: map['verified'] ?? false,
      createdAt: _parseDateTime(map['createdAt']) ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'donorId': donorId,
      'donorName': donorName,
      'bloodGroup': bloodGroup,
      'donationDate': donationDate.toIso8601String(),
      'hospital': hospital,
      'units': units,
      'city': city,
      'notes': notes,
      'verified': verified,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  Map<String, dynamic> toFirestore() => toMap();

  static DateTime? _parseDateTime(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    if (value is String) return DateTime.tryParse(value);
    return null;
  }
}
