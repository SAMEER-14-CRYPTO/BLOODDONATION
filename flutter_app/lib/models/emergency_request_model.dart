/// Emergency request status enum
enum RequestStatus { active, accepted, fulfilled, cancelled, expired }

/// LifeLink Emergency Request Model (no Firebase dependency)
class EmergencyRequestModel {
  final String requestId;
  final String requesterId;
  final String patientName;
  final String bloodGroup;
  final int unitsRequired;
  final String hospitalName;
  final String hospitalAddress;
  final String city;
  final String state;
  final double? latitude;
  final double? longitude;
  final String contactNumber;
  final String emergencyLevel; // 'Critical', 'Urgent', 'Normal'
  final String? requiredDate;
  final String? requiredTime;
  final String message;
  final String status; // 'active', 'accepted', 'fulfilled', 'cancelled', 'expired'
  final int responseCount;
  final DateTime createdAt;
  final DateTime updatedAt;

  final String? requesterName;
  final double? distance;

  // Legacy compatibility aliases
  String get urgencyLevel => emergencyLevel;
  String get bloodGroupNeeded => bloodGroup;
  String get location => city;
  int get responses => responseCount;

  EmergencyRequestModel({
    required this.requestId,
    required this.requesterId,
    required this.patientName,
    required this.bloodGroup,
    this.unitsRequired = 1,
    required this.hospitalName,
    this.hospitalAddress = '',
    this.city = '',
    this.state = '',
    this.latitude,
    this.longitude,
    this.contactNumber = '',
    this.emergencyLevel = 'Urgent',
    this.requiredDate,
    this.requiredTime,
    this.message = '',
    this.status = 'active',
    this.responseCount = 0,
    DateTime? createdAt,
    DateTime? updatedAt,
    this.requesterName,
    this.distance,
    // Legacy named params
    String? urgencyLevel,
    String? bloodGroupNeeded,
    String? location,
    int? responses,
  })  : createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now();

  factory EmergencyRequestModel.fromMap(Map<String, dynamic> map, String id) {
    return EmergencyRequestModel(
      requestId: id,
      requesterId: map['requesterId'] ?? '',
      patientName: map['patientName'] ?? '',
      bloodGroup: map['bloodGroup'] ?? map['bloodGroupNeeded'] ?? '',
      unitsRequired: map['unitsRequired'] ?? 1,
      hospitalName: map['hospitalName'] ?? '',
      hospitalAddress: map['hospitalAddress'] ?? '',
      city: map['city'] ?? map['location'] ?? '',
      state: map['state'] ?? '',
      latitude: map['latitude']?.toDouble(),
      longitude: map['longitude']?.toDouble(),
      contactNumber: map['contactNumber'] ?? '',
      emergencyLevel: map['emergencyLevel'] ?? map['urgencyLevel'] ?? 'Urgent',
      requiredDate: map['requiredDate'],
      requiredTime: map['requiredTime'],
      message: map['message'] ?? '',
      status: map['status'] ?? 'active',
      responseCount: map['responseCount'] ?? map['responses'] ?? 0,
      createdAt: _parseDateTime(map['createdAt']) ?? DateTime.now(),
      updatedAt: _parseDateTime(map['updatedAt']) ?? DateTime.now(),
      requesterName: map['requesterName'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'requesterId': requesterId,
      'patientName': patientName,
      'bloodGroup': bloodGroup,
      'unitsRequired': unitsRequired,
      'hospitalName': hospitalName,
      'hospitalAddress': hospitalAddress,
      'city': city,
      'state': state,
      'latitude': latitude,
      'longitude': longitude,
      'contactNumber': contactNumber,
      'emergencyLevel': emergencyLevel,
      'requiredDate': requiredDate,
      'requiredTime': requiredTime,
      'message': message,
      'status': status,
      'responseCount': responseCount,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': DateTime.now().toIso8601String(),
    };
  }

  Map<String, dynamic> toFirestore() => toMap();

  EmergencyRequestModel copyWith({
    String? patientName, String? bloodGroup, int? unitsRequired,
    String? hospitalName, String? hospitalAddress, String? city,
    String? state, double? latitude, double? longitude,
    String? contactNumber, String? emergencyLevel, String? requiredDate,
    String? requiredTime, String? message, String? status,
    int? responseCount, double? distance,
  }) {
    return EmergencyRequestModel(
      requestId: requestId, requesterId: requesterId,
      patientName: patientName ?? this.patientName,
      bloodGroup: bloodGroup ?? this.bloodGroup,
      unitsRequired: unitsRequired ?? this.unitsRequired,
      hospitalName: hospitalName ?? this.hospitalName,
      hospitalAddress: hospitalAddress ?? this.hospitalAddress,
      city: city ?? this.city, state: state ?? this.state,
      latitude: latitude ?? this.latitude, longitude: longitude ?? this.longitude,
      contactNumber: contactNumber ?? this.contactNumber,
      emergencyLevel: emergencyLevel ?? this.emergencyLevel,
      requiredDate: requiredDate ?? this.requiredDate,
      requiredTime: requiredTime ?? this.requiredTime,
      message: message ?? this.message, status: status ?? this.status,
      responseCount: responseCount ?? this.responseCount,
      createdAt: createdAt, updatedAt: DateTime.now(),
      requesterName: requesterName, distance: distance ?? this.distance,
    );
  }

  bool get isActive => status == 'active';
  bool get isCritical => emergencyLevel.toLowerCase() == 'critical';

  static DateTime? _parseDateTime(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    if (value is String) return DateTime.tryParse(value);
    return null;
  }
}
