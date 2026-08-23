/// LifeLink – App Constants
class AppConstants {
  AppConstants._();

  // App Identity
  static const String appName = 'LifeLink';
  static const String appSubtitle = 'Smart Blood Donor Finder';
  static const String appTagline = 'Every Drop Saves a Life';
  static const String appVersion = '1.0.0';
  static const String appPackage = 'com.lifelink.blooddonor';

  // Blood Groups
  static const List<String> bloodGroups = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
  ];

  // Emergency Levels
  static const List<String> emergencyLevels = ['Critical', 'Urgent', 'Normal'];

  // Distance Options (in km)
  static const List<double> distanceOptions = [1, 5, 10, 25, 50, 100];

  // Donor Status
  static const List<String> donorStatuses = ['Active', 'Inactive', 'Temporarily Unavailable'];

  // Contact Methods
  static const List<String> contactMethods = ['Phone', 'SMS', 'Email', 'Any'];

  // Gender Options
  static const List<String> genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  // Roles
  static const String roleDonor = 'donor';
  static const String roleSeeker = 'seeker';
  static const String roleHospital = 'hospital';
  static const String roleBloodBank = 'bloodBank';
  static const String roleAdmin = 'admin';

  // Request Status
  static const String statusActive = 'active';
  static const String statusAccepted = 'accepted';
  static const String statusFulfilled = 'fulfilled';
  static const String statusCancelled = 'cancelled';
  static const String statusExpired = 'expired';

  // Indian States
  static const List<String> indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
    'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Chandigarh', 'Puducherry',
  ];

  // Default India center for maps
  static const double defaultLatitude = 20.5937;
  static const double defaultLongitude = 78.9629;
  static const double defaultZoom = 5.0;

  // Donation eligibility (days between donations)
  static const int donationCooldownDays = 90;
}
