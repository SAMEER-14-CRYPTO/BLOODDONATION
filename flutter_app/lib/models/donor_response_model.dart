/// Model representing a donor's response to an emergency request (no Firebase dependency)
class DonorResponseModel {
  final String donorId;
  final String donorName;
  final String response; // 'accepted', 'declined'
  final DateTime respondedAt;
  final double? distance;
  final bool contactAllowed;

  DonorResponseModel({
    required this.donorId,
    required this.donorName,
    required this.response,
    DateTime? respondedAt,
    this.distance,
    this.contactAllowed = true,
  }) : respondedAt = respondedAt ?? DateTime.now();

  factory DonorResponseModel.fromMap(Map<String, dynamic> map, String id) {
    return DonorResponseModel(
      donorId: id,
      donorName: map['donorName'] ?? '',
      response: map['response'] ?? 'accepted',
      respondedAt: _parseDateTime(map['respondedAt']) ?? DateTime.now(),
      distance: map['distance']?.toDouble(),
      contactAllowed: map['contactAllowed'] ?? true,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'donorName': donorName,
      'response': response,
      'respondedAt': respondedAt.toIso8601String(),
      'distance': distance,
      'contactAllowed': contactAllowed,
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
