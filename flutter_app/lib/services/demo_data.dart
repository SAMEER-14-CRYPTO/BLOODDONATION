import '../models/models.dart';

class DemoData {
  static List<UserModel> users = [
    UserModel(uid: 'u1', fullName: 'Rahul Sharma', email: 'rahul@demo.com', phone: '+91-9876543210', bloodGroup: 'O+', gender: 'Male', age: 28, city: 'Mumbai', availability: true, verified: true, lastDonation: '2025-12-15', lat: 19.076, lng: 72.877),
    UserModel(uid: 'u2', fullName: 'Priya Patel', email: 'priya@demo.com', phone: '+91-9876543211', bloodGroup: 'A+', gender: 'Female', age: 25, city: 'Delhi', availability: true, verified: true, lastDonation: '2026-01-20', lat: 28.613, lng: 77.209),
    UserModel(uid: 'u3', fullName: 'Amit Kumar', email: 'amit@demo.com', phone: '+91-9876543212', bloodGroup: 'B+', gender: 'Male', age: 32, city: 'Bangalore', availability: false, verified: true, lastDonation: '2025-11-10', lat: 12.971, lng: 77.594),
    UserModel(uid: 'u4', fullName: 'Sara Khan', email: 'sara@demo.com', phone: '+91-9876543213', bloodGroup: 'AB+', gender: 'Female', age: 22, city: 'Mumbai', availability: true, verified: false, lat: 19.082, lng: 72.881),
    UserModel(uid: 'u5', fullName: 'Vikram Singh', email: 'vikram@demo.com', phone: '+91-9876543214', bloodGroup: 'O-', gender: 'Male', age: 35, city: 'Chennai', availability: true, verified: true, lastDonation: '2026-03-05', lat: 13.082, lng: 80.270),
    UserModel(uid: 'u6', fullName: 'Meera Reddy', email: 'meera@demo.com', phone: '+91-9876543215', bloodGroup: 'A-', gender: 'Female', age: 29, city: 'Hyderabad', availability: true, verified: true, lastDonation: '2026-02-14', lat: 17.385, lng: 78.486),
    UserModel(uid: 'u7', fullName: 'Arjun Nair', email: 'arjun@demo.com', phone: '+91-9876543216', bloodGroup: 'B-', gender: 'Male', age: 27, city: 'Pune', availability: true, verified: true, lat: 18.520, lng: 73.856),
    UserModel(uid: 'admin1', fullName: 'Admin User', email: 'admin@lifelink.com', phone: '+91-9000000000', bloodGroup: 'O+', gender: 'Male', age: 30, city: 'Mumbai', availability: true, verified: true, role: 'admin'),
  ];

  static List<BloodRequest> requests = [
    BloodRequest(id: 'r1', requesterName: 'Deepak Verma', patientName: 'Sunita Verma', bloodGroupNeeded: 'O+', hospitalName: 'Apollo Hospital', location: 'Mumbai', urgencyLevel: 'critical', status: 'active', responses: 3, createdAt: DateTime.now().subtract(const Duration(hours: 2))),
    BloodRequest(id: 'r2', requesterName: 'Kavita Joshi', patientName: 'Ram Joshi', bloodGroupNeeded: 'A-', hospitalName: 'AIIMS', location: 'Delhi', urgencyLevel: 'urgent', status: 'active', responses: 1, createdAt: DateTime.now().subtract(const Duration(hours: 8))),
    BloodRequest(id: 'r3', requesterName: 'Suresh Iyer', patientName: 'Lakshmi Iyer', bloodGroupNeeded: 'B+', hospitalName: 'Fortis Hospital', location: 'Bangalore', urgencyLevel: 'normal', status: 'fulfilled', responses: 5, createdAt: DateTime.now().subtract(const Duration(days: 2))),
    BloodRequest(id: 'r4', requesterName: 'Neha Gupta', patientName: 'Anjali Gupta', bloodGroupNeeded: 'AB+', hospitalName: 'Max Hospital', location: 'Delhi', urgencyLevel: 'critical', status: 'active', responses: 0, createdAt: DateTime.now().subtract(const Duration(hours: 4))),
  ];

  static List<Hospital> hospitals = [
    Hospital(id: 'h1', name: 'Apollo Hospital', address: 'Navi Mumbai, Maharashtra', contact: '+91-22-12345678', bloodAvailability: {'O+': 15, 'A+': 8, 'B+': 12, 'AB+': 3, 'O-': 5}, lat: 19.033, lng: 73.029),
    Hospital(id: 'h2', name: 'AIIMS Hospital', address: 'Ansari Nagar, New Delhi', contact: '+91-11-26588500', bloodAvailability: {'O+': 20, 'A+': 15, 'B+': 10, 'AB+': 6, 'O-': 8}, lat: 28.567, lng: 77.210),
    Hospital(id: 'h3', name: 'Fortis Hospital', address: 'Bannerghatta Rd, Bangalore', contact: '+91-80-66214444', bloodAvailability: {'O+': 12, 'A+': 7, 'B+': 9, 'AB+': 4, 'O-': 3}, lat: 12.891, lng: 77.598),
    Hospital(id: 'h4', name: 'Medanta Hospital', address: 'Sector 38, Gurugram', contact: '+91-124-4141414', bloodAvailability: {'O+': 18, 'A+': 11, 'B+': 14, 'AB+': 5, 'O-': 6}, lat: 28.440, lng: 77.041),
  ];

  static List<AppNotification> notifications = [
    AppNotification(id: 'n1', userId: 'u1', message: 'Emergency: O+ blood needed at Apollo Hospital', type: 'emergency', createdAt: DateTime.now().subtract(const Duration(hours: 1))),
    AppNotification(id: 'n2', userId: 'u1', message: 'Your donation is due! Last donation was 3 months ago.', type: 'reminder', createdAt: DateTime.now().subtract(const Duration(days: 1))),
    AppNotification(id: 'n3', userId: 'u1', message: 'Thank you for responding to the blood request!', type: 'success', read: true, createdAt: DateTime.now().subtract(const Duration(days: 3))),
  ];

  static List<Donation> donations = [
    Donation(id: 'd1', donorId: 'u1', donorName: 'Rahul Sharma', bloodGroup: 'O+', date: '2025-12-15', hospital: 'Apollo Hospital', remarks: 'Routine'),
    Donation(id: 'd2', donorId: 'u2', donorName: 'Priya Patel', bloodGroup: 'A+', date: '2026-01-20', hospital: 'AIIMS', remarks: 'Emergency'),
  ];
}
