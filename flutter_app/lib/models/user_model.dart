/// LifeLink User Model — Full user profile (no Firebase dependency)
class UserModel {
  final String uid;
  final String fullName;
  final String email;
  final String phone;
  final String? dateOfBirth;
  final String gender;
  final String bloodGroup;
  final String donorStatus; // 'Active', 'Inactive', 'Temporarily Unavailable'
  final bool emergencyAvailable;
  final String? lastDonationDate;
  final int donationCount;
  final String city;
  final String state;
  final String pincode;
  final String address;
  final double? latitude;
  final double? longitude;
  final DateTime? locationUpdatedAt;
  final String? profilePhoto;
  final bool verified;
  final String role; // 'donor', 'seeker', 'admin'
  final String? fcmToken;
  final String preferredContact; // 'Phone', 'SMS', 'Email', 'Any'
  final DateTime createdAt;
  final DateTime updatedAt;

  // Legacy compatibility
  bool get availability => donorStatus == 'Active';
  int get age {
    if (dateOfBirth == null) return 0;
    try {
      final dob = DateTime.parse(dateOfBirth!);
      final now = DateTime.now();
      int a = now.year - dob.year;
      if (now.month < dob.month || (now.month == dob.month && now.day < dob.day)) a--;
      return a;
    } catch (_) {
      return 0;
    }
  }

  String? get lastDonation => lastDonationDate;
  String? get profileImage => profilePhoto;
  double? get lat => latitude;
  double? get lng => longitude;
  bool get hasLocation => latitude != null && longitude != null;

  UserModel({
    required this.uid,
    required this.fullName,
    required this.email,
    this.phone = '',
    this.dateOfBirth,
    this.gender = '',
    required this.bloodGroup,
    this.donorStatus = 'Active',
    this.emergencyAvailable = true,
    this.lastDonationDate,
    this.donationCount = 0,
    this.city = '',
    this.state = '',
    this.pincode = '',
    this.address = '',
    this.latitude,
    this.longitude,
    this.locationUpdatedAt,
    this.profilePhoto,
    this.verified = false,
    this.role = 'donor',
    this.fcmToken,
    this.preferredContact = 'Any',
    DateTime? createdAt,
    DateTime? updatedAt,
    // Legacy named params for DemoData convenience
    int? age, // ignored — calculated from dateOfBirth
    bool? availability, // maps to donorStatus
    String? lastDonation, // maps to lastDonationDate
  })  : createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now();

  factory UserModel.fromMap(Map<String, dynamic> map, String uid) {
    return UserModel(
      uid: uid,
      fullName: map['fullName'] ?? map['displayName'] ?? '',
      email: map['email'] ?? '',
      phone: map['phone'] ?? '',
      dateOfBirth: map['dateOfBirth'],
      gender: map['gender'] ?? '',
      bloodGroup: map['bloodGroup'] ?? 'O+',
      donorStatus: map['donorStatus'] ?? (map['availability'] == true ? 'Active' : 'Inactive'),
      emergencyAvailable: map['emergencyAvailable'] ?? true,
      lastDonationDate: map['lastDonationDate'] ?? map['lastDonation'],
      donationCount: map['donationCount'] ?? 0,
      city: map['city'] ?? '',
      state: map['state'] ?? '',
      pincode: map['pincode'] ?? '',
      address: map['address'] ?? '',
      latitude: (map['latitude'] ?? map['lat'])?.toDouble(),
      longitude: (map['longitude'] ?? map['lng'])?.toDouble(),
      locationUpdatedAt: _parseDateTime(map['locationUpdatedAt']),
      profilePhoto: map['profilePhoto'] ?? map['profileImage'],
      verified: map['verified'] ?? false,
      role: map['role'] ?? 'donor',
      fcmToken: map['fcmToken'],
      preferredContact: map['preferredContact'] ?? 'Any',
      createdAt: _parseDateTime(map['createdAt']) ?? DateTime.now(),
      updatedAt: _parseDateTime(map['updatedAt']) ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'fullName': fullName,
      'email': email,
      'phone': phone,
      'dateOfBirth': dateOfBirth,
      'gender': gender,
      'bloodGroup': bloodGroup,
      'donorStatus': donorStatus,
      'emergencyAvailable': emergencyAvailable,
      'lastDonationDate': lastDonationDate,
      'donationCount': donationCount,
      'city': city,
      'state': state,
      'pincode': pincode,
      'address': address,
      'latitude': latitude,
      'longitude': longitude,
      'locationUpdatedAt': locationUpdatedAt?.toIso8601String(),
      'profilePhoto': profilePhoto,
      'verified': verified,
      'role': role,
      'fcmToken': fcmToken,
      'preferredContact': preferredContact,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': DateTime.now().toIso8601String(),
    };
  }

  // Alias for compatibility
  Map<String, dynamic> toFirestore() => toMap();

  UserModel copyWith({
    String? fullName, String? phone, String? dateOfBirth, String? gender,
    String? bloodGroup, String? donorStatus, bool? emergencyAvailable,
    String? lastDonationDate, int? donationCount, String? city, String? state,
    String? pincode, String? address, double? latitude, double? longitude,
    DateTime? locationUpdatedAt, String? profilePhoto, bool? verified,
    String? role, String? fcmToken, String? preferredContact, bool? availability,
  }) {
    return UserModel(
      uid: uid, email: email,
      fullName: fullName ?? this.fullName,
      phone: phone ?? this.phone,
      dateOfBirth: dateOfBirth ?? this.dateOfBirth,
      gender: gender ?? this.gender,
      bloodGroup: bloodGroup ?? this.bloodGroup,
      donorStatus: availability != null
          ? (availability ? 'Active' : 'Inactive')
          : (donorStatus ?? this.donorStatus),
      emergencyAvailable: emergencyAvailable ?? this.emergencyAvailable,
      lastDonationDate: lastDonationDate ?? this.lastDonationDate,
      donationCount: donationCount ?? this.donationCount,
      city: city ?? this.city,
      state: state ?? this.state,
      pincode: pincode ?? this.pincode,
      address: address ?? this.address,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      locationUpdatedAt: locationUpdatedAt ?? this.locationUpdatedAt,
      profilePhoto: profilePhoto ?? this.profilePhoto,
      verified: verified ?? this.verified,
      role: role ?? this.role,
      fcmToken: fcmToken ?? this.fcmToken,
      preferredContact: preferredContact ?? this.preferredContact,
      createdAt: createdAt,
      updatedAt: DateTime.now(),
    );
  }

  static DateTime? _parseDateTime(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    if (value is String) return DateTime.tryParse(value);
    return null;
  }
}
