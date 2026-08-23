/// LifeLink – Firebase Collection & Field Constants
class FirebaseConstants {
  FirebaseConstants._();

  // Collection Names
  static const String usersCollection = 'users';
  static const String emergencyRequestsCollection = 'emergency_requests';
  static const String donationsCollection = 'donations';
  static const String hospitalsCollection = 'hospitals';
  static const String bloodBanksCollection = 'blood_banks';
  static const String notificationsCollection = 'notifications';
  static const String responsesSubcollection = 'responses';
  static const String appStatisticsCollection = 'app_statistics';
  static const String reportsCollection = 'reports';

  // User Fields
  static const String fieldUid = 'uid';
  static const String fieldFullName = 'fullName';
  static const String fieldEmail = 'email';
  static const String fieldPhone = 'phone';
  static const String fieldDateOfBirth = 'dateOfBirth';
  static const String fieldGender = 'gender';
  static const String fieldBloodGroup = 'bloodGroup';
  static const String fieldDonorStatus = 'donorStatus';
  static const String fieldEmergencyAvailable = 'emergencyAvailable';
  static const String fieldLastDonationDate = 'lastDonationDate';
  static const String fieldDonationCount = 'donationCount';
  static const String fieldCity = 'city';
  static const String fieldState = 'state';
  static const String fieldPincode = 'pincode';
  static const String fieldAddress = 'address';
  static const String fieldLatitude = 'latitude';
  static const String fieldLongitude = 'longitude';
  static const String fieldLocationUpdatedAt = 'locationUpdatedAt';
  static const String fieldProfilePhoto = 'profilePhoto';
  static const String fieldVerified = 'verified';
  static const String fieldRole = 'role';
  static const String fieldCreatedAt = 'createdAt';
  static const String fieldUpdatedAt = 'updatedAt';
  static const String fieldFcmToken = 'fcmToken';
  static const String fieldPreferredContact = 'preferredContact';

  // Emergency Request Fields
  static const String fieldRequestId = 'requestId';
  static const String fieldRequesterId = 'requesterId';
  static const String fieldPatientName = 'patientName';
  static const String fieldUnitsRequired = 'unitsRequired';
  static const String fieldHospitalName = 'hospitalName';
  static const String fieldHospitalAddress = 'hospitalAddress';
  static const String fieldEmergencyLevel = 'emergencyLevel';
  static const String fieldRequiredDate = 'requiredDate';
  static const String fieldRequiredTime = 'requiredTime';
  static const String fieldContactNumber = 'contactNumber';
  static const String fieldMessage = 'message';
  static const String fieldStatus = 'status';

  // Donation Fields
  static const String fieldDonorId = 'donorId';
  static const String fieldDonationDate = 'donationDate';
  static const String fieldHospital = 'hospital';
  static const String fieldUnits = 'units';
  static const String fieldNotes = 'notes';

  // Notification Fields
  static const String fieldUserId = 'userId';
  static const String fieldTitle = 'title';
  static const String fieldType = 'type';
  static const String fieldRead = 'read';
  static const String fieldData = 'data';
}
