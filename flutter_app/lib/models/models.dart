class UserModel {
  final String uid;
  final String fullName;
  final String email;
  final String phone;
  final String bloodGroup;
  final String gender;
  final int age;
  final String city;
  final double? lat;
  final double? lng;
  final bool availability;
  final bool verified;
  final String role;
  final String? profileImage;
  final String? lastDonation;
  final DateTime createdAt;

  UserModel({
    required this.uid,
    required this.fullName,
    required this.email,
    this.phone = '',
    required this.bloodGroup,
    this.gender = '',
    this.age = 0,
    this.city = '',
    this.lat,
    this.lng,
    this.availability = true,
    this.verified = false,
    this.role = 'donor',
    this.profileImage,
    this.lastDonation,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory UserModel.fromMap(Map<String, dynamic> map, String uid) {
    return UserModel(
      uid: uid,
      fullName: map['fullName'] ?? '',
      email: map['email'] ?? '',
      phone: map['phone'] ?? '',
      bloodGroup: map['bloodGroup'] ?? 'O+',
      gender: map['gender'] ?? '',
      age: map['age'] ?? 0,
      city: map['city'] ?? '',
      lat: map['lat']?.toDouble(),
      lng: map['lng']?.toDouble(),
      availability: map['availability'] ?? true,
      verified: map['verified'] ?? false,
      role: map['role'] ?? 'donor',
      profileImage: map['profileImage'],
      lastDonation: map['lastDonation'],
      createdAt: map['createdAt'] != null ? DateTime.parse(map['createdAt']) : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'fullName': fullName,
      'email': email,
      'phone': phone,
      'bloodGroup': bloodGroup,
      'gender': gender,
      'age': age,
      'city': city,
      'lat': lat,
      'lng': lng,
      'availability': availability,
      'verified': verified,
      'role': role,
      'profileImage': profileImage,
      'lastDonation': lastDonation,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  UserModel copyWith({
    String? fullName, String? phone, String? bloodGroup, String? gender,
    int? age, String? city, bool? availability, bool? verified, String? lastDonation,
  }) {
    return UserModel(
      uid: uid, email: email,
      fullName: fullName ?? this.fullName,
      phone: phone ?? this.phone,
      bloodGroup: bloodGroup ?? this.bloodGroup,
      gender: gender ?? this.gender,
      age: age ?? this.age,
      city: city ?? this.city,
      lat: lat, lng: lng,
      availability: availability ?? this.availability,
      verified: verified ?? this.verified,
      role: role, profileImage: profileImage,
      lastDonation: lastDonation ?? this.lastDonation,
      createdAt: createdAt,
    );
  }
}

class BloodRequest {
  final String id;
  final String requesterName;
  final String patientName;
  final String bloodGroupNeeded;
  final String hospitalName;
  final String location;
  final String urgencyLevel;
  final String status;
  final int responses;
  final DateTime createdAt;

  BloodRequest({
    required this.id,
    required this.requesterName,
    required this.patientName,
    required this.bloodGroupNeeded,
    required this.hospitalName,
    required this.location,
    this.urgencyLevel = 'urgent',
    this.status = 'active',
    this.responses = 0,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory BloodRequest.fromMap(Map<String, dynamic> map, String id) {
    return BloodRequest(
      id: id,
      requesterName: map['requesterName'] ?? '',
      patientName: map['patientName'] ?? '',
      bloodGroupNeeded: map['bloodGroupNeeded'] ?? '',
      hospitalName: map['hospitalName'] ?? '',
      location: map['location'] ?? '',
      urgencyLevel: map['urgencyLevel'] ?? 'urgent',
      status: map['status'] ?? 'active',
      responses: map['responses'] ?? 0,
      createdAt: map['createdAt'] != null ? DateTime.parse(map['createdAt']) : DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() => {
    'requesterName': requesterName, 'patientName': patientName,
    'bloodGroupNeeded': bloodGroupNeeded, 'hospitalName': hospitalName,
    'location': location, 'urgencyLevel': urgencyLevel,
    'status': status, 'responses': responses,
    'createdAt': createdAt.toIso8601String(),
  };
}

class Hospital {
  final String id;
  final String name;
  final String address;
  final String contact;
  final Map<String, int> bloodAvailability;
  final double? lat;
  final double? lng;

  Hospital({
    required this.id, required this.name, required this.address,
    required this.contact, this.bloodAvailability = const {},
    this.lat, this.lng,
  });
}

class Donation {
  final String id;
  final String donorId;
  final String donorName;
  final String bloodGroup;
  final String date;
  final String hospital;
  final String remarks;

  Donation({
    required this.id, required this.donorId, required this.donorName,
    required this.bloodGroup, required this.date, required this.hospital,
    this.remarks = '',
  });
}

class AppNotification {
  final String id;
  final String userId;
  final String message;
  final String type;
  final bool read;
  final DateTime createdAt;

  AppNotification({
    required this.id, required this.userId, required this.message,
    this.type = 'info', this.read = false, DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();
}
