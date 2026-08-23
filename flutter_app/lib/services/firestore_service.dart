import '../models/user_model.dart';
import '../models/emergency_request_model.dart';
import '../models/donation_model.dart';
import '../models/hospital_model.dart';
import '../models/blood_bank_model.dart';
import '../models/notification_model.dart';
import '../models/donor_response_model.dart';
import 'demo_data.dart';

/// Demo Database Service — Works against in-memory DemoData
/// Same API surface as the original FirestoreService, but no Firebase required.
class FirestoreService {
  // ═══════════════════════════════════════════
  // USER OPERATIONS
  // ═══════════════════════════════════════════

  /// Get user profile by UID
  Future<UserModel?> getUser(String uid) async {
    try {
      return DemoData.users.firstWhere((u) => u.uid == uid);
    } catch (_) {
      return null;
    }
  }

  /// Get user profile stream (simulated)
  Stream<UserModel?> userStream(String uid) {
    return Stream.periodic(const Duration(seconds: 2), (_) {
      try {
        return DemoData.users.firstWhere((u) => u.uid == uid);
      } catch (_) {
        return null;
      }
    });
  }

  /// Update user profile
  Future<void> updateUser(String uid, Map<String, dynamic> data) async {
    final idx = DemoData.users.indexWhere((u) => u.uid == uid);
    if (idx > -1) {
      final user = DemoData.users[idx];
      DemoData.users[idx] = user.copyWith(
        fullName: data['fullName'] as String?,
        phone: data['phone'] as String?,
        gender: data['gender'] as String?,
        bloodGroup: data['bloodGroup'] as String?,
        donorStatus: data['donorStatus'] as String?,
        city: data['city'] as String?,
        state: data['state'] as String?,
        verified: data['verified'] as bool?,
      );
    }
  }

  /// Update user location
  Future<void> updateUserLocation(String uid, double lat, double lng,
      String city, String state, String pincode, String address) async {
    final idx = DemoData.users.indexWhere((u) => u.uid == uid);
    if (idx > -1) {
      DemoData.users[idx] = DemoData.users[idx].copyWith(
        latitude: lat, longitude: lng, city: city, state: state,
        pincode: pincode, address: address,
      );
    }
  }

  // ═══════════════════════════════════════════
  // DONOR SEARCH
  // ═══════════════════════════════════════════

  /// Search donors by blood group
  Future<List<UserModel>> searchDonors({
    String? bloodGroup,
    bool availableOnly = false,
    bool emergencyOnly = false,
    int limit = 50,
  }) async {
    var donors = DemoData.users.where((u) => u.role == 'donor').toList();

    if (bloodGroup != null && bloodGroup != 'All') {
      donors = donors.where((d) => d.bloodGroup == bloodGroup).toList();
    }
    if (availableOnly) {
      donors = donors.where((d) => d.donorStatus == 'Active').toList();
    }
    if (emergencyOnly) {
      donors = donors.where((d) => d.emergencyAvailable).toList();
    }

    return donors.take(limit).toList();
  }

  /// Get all donors with location (for map display)
  Future<List<UserModel>> getDonorsWithLocation() async {
    return DemoData.users
        .where((u) => u.role == 'donor' && u.hasLocation)
        .toList();
  }

  /// Get nearby donors count
  Future<int> getNearbyDonorsCount(String bloodGroup) async {
    return DemoData.users
        .where((u) => u.role == 'donor' && u.bloodGroup == bloodGroup && u.donorStatus == 'Active')
        .length;
  }

  // ═══════════════════════════════════════════
  // EMERGENCY REQUESTS
  // ═══════════════════════════════════════════

  /// Create emergency request
  Future<String> createEmergencyRequest(EmergencyRequestModel request) async {
    DemoData.requests.add(request);
    return request.requestId;
  }

  /// Get all active emergency requests
  Stream<List<EmergencyRequestModel>> activeEmergencyRequestsStream() {
    return Stream.value(
      DemoData.requests.where((r) => r.status == 'active').toList()
        ..sort((a, b) => b.createdAt.compareTo(a.createdAt)),
    );
  }

  /// Get user's emergency requests
  Stream<List<EmergencyRequestModel>> userEmergencyRequestsStream(String userId) {
    return Stream.value(
      DemoData.requests.where((r) => r.requesterId == userId).toList()
        ..sort((a, b) => b.createdAt.compareTo(a.createdAt)),
    );
  }

  /// Get emergency request by ID
  Future<EmergencyRequestModel?> getEmergencyRequest(String requestId) async {
    try {
      return DemoData.requests.firstWhere((r) => r.requestId == requestId);
    } catch (_) {
      return null;
    }
  }

  /// Update emergency request status
  Future<void> updateEmergencyRequestStatus(String requestId, String status) async {
    final idx = DemoData.requests.indexWhere((r) => r.requestId == requestId);
    if (idx > -1) {
      DemoData.requests[idx] = DemoData.requests[idx].copyWith(status: status);
    }
  }

  /// Add donor response to emergency request
  Future<void> addDonorResponse(String requestId, DonorResponseModel response) async {
    final idx = DemoData.requests.indexWhere((r) => r.requestId == requestId);
    if (idx > -1) {
      DemoData.requests[idx] = DemoData.requests[idx].copyWith(
        responseCount: DemoData.requests[idx].responseCount + 1,
      );
    }
  }

  /// Get responses for an emergency request (demo returns empty)
  Stream<List<DonorResponseModel>> emergencyResponsesStream(String requestId) {
    return Stream.value([]);
  }

  // ═══════════════════════════════════════════
  // DONATIONS
  // ═══════════════════════════════════════════

  /// Add donation record
  Future<String> addDonation(DonationModel donation) async {
    DemoData.donations.add(donation);

    // Update user's donation count
    final idx = DemoData.users.indexWhere((u) => u.uid == donation.donorId);
    if (idx > -1) {
      DemoData.users[idx] = DemoData.users[idx].copyWith(
        donationCount: DemoData.users[idx].donationCount + 1,
        lastDonationDate: donation.donationDate.toIso8601String().split('T')[0],
      );
    }

    return donation.donationId;
  }

  /// Get user's donation history
  Stream<List<DonationModel>> donationHistoryStream(String donorId) {
    return Stream.value(
      DemoData.donations.where((d) => d.donorId == donorId).toList()
        ..sort((a, b) => b.donationDate.compareTo(a.donationDate)),
    );
  }

  // ═══════════════════════════════════════════
  // HOSPITALS & BLOOD BANKS
  // ═══════════════════════════════════════════

  /// Get all hospitals
  Future<List<HospitalModel>> getHospitals() async {
    return DemoData.hospitals;
  }

  /// Get all blood banks
  Future<List<BloodBankModel>> getBloodBanks() async {
    return DemoData.bloodBanks;
  }

  // ═══════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════

  /// Get user notifications
  Stream<List<NotificationModel>> notificationsStream(String userId) {
    return Stream.value(
      DemoData.notifications.where((n) => n.userId == userId).toList()
        ..sort((a, b) => b.createdAt.compareTo(a.createdAt)),
    );
  }

  /// Mark notification as read
  Future<void> markNotificationRead(String notificationId) async {
    // In demo mode, notifications are immutable objects, so we just accept the call
  }

  /// Get unread notification count
  Stream<int> unreadNotificationCount(String userId) {
    return Stream.value(
      DemoData.notifications.where((n) => n.userId == userId && !n.read).length,
    );
  }

  /// Create notification
  Future<void> createNotification(NotificationModel notification) async {
    DemoData.notifications.add(notification);
  }

  // ═══════════════════════════════════════════
  // ADMIN / STATISTICS
  // ═══════════════════════════════════════════

  Future<int> getTotalUsers() async => DemoData.users.length;
  Future<int> getTotalDonors() async => DemoData.users.where((u) => u.role == 'donor').length;
  Future<int> getVerifiedDonors() async => DemoData.users.where((u) => u.role == 'donor' && u.verified).length;
  Future<int> getActiveRequestCount() async => DemoData.requests.where((r) => r.status == 'active').length;
  Future<int> getTotalDonations() async => DemoData.donations.length;

  Future<List<UserModel>> getAllUsers() async {
    return List.from(DemoData.users)..sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }

  Future<void> verifyDonor(String uid) async {
    final idx = DemoData.users.indexWhere((u) => u.uid == uid);
    if (idx > -1) DemoData.users[idx] = DemoData.users[idx].copyWith(verified: true);
  }

  Future<void> suspendUser(String uid) async {
    final idx = DemoData.users.indexWhere((u) => u.uid == uid);
    if (idx > -1) DemoData.users[idx] = DemoData.users[idx].copyWith(donorStatus: 'Suspended');
  }

  Future<void> deleteUserProfile(String uid) async {
    DemoData.users.removeWhere((u) => u.uid == uid);
  }

  Future<List<EmergencyRequestModel>> getAllEmergencyRequests() async {
    return List.from(DemoData.requests)..sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }

  Future<int> getCitiesCovered() async {
    return DemoData.users.map((u) => u.city).where((c) => c.isNotEmpty).toSet().length;
  }
}
