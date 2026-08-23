import '../models/models.dart';

/// LifeLink Demo Data — Self-contained in-memory database
/// All data lives here. No Firebase required for demo.
class DemoData {
  static List<UserModel> users = [
    UserModel(uid: 'u1', fullName: 'Rahul Sharma', email: 'rahul@demo.com', phone: '+91-9876543210', bloodGroup: 'O+', gender: 'Male', dateOfBirth: '1998-03-15', city: 'Mumbai', address: '42, Carter Road, Bandra West, Mumbai', donorStatus: 'Active', verified: true, lastDonationDate: '2025-12-15', latitude: 19.0596, longitude: 72.8295, createdAt: DateTime(2025, 1, 10)),
    UserModel(uid: 'u2', fullName: 'Priya Patel', email: 'priya@demo.com', phone: '+91-9876543211', bloodGroup: 'A+', gender: 'Female', dateOfBirth: '2001-07-22', city: 'Delhi', address: 'B-14, Connaught Place, New Delhi', donorStatus: 'Active', verified: true, lastDonationDate: '2026-01-20', latitude: 28.6315, longitude: 77.2167, createdAt: DateTime(2025, 3, 15)),
    UserModel(uid: 'u3', fullName: 'Amit Kumar', email: 'amit@demo.com', phone: '+91-9876543212', bloodGroup: 'B+', gender: 'Male', dateOfBirth: '1994-11-08', city: 'Bangalore', address: '15, MG Road, Ashok Nagar, Bengaluru', donorStatus: 'Inactive', verified: true, lastDonationDate: '2025-11-10', latitude: 12.9756, longitude: 77.6062, createdAt: DateTime(2025, 2, 20)),
    UserModel(uid: 'u4', fullName: 'Sara Khan', email: 'sara@demo.com', phone: '+91-9876543213', bloodGroup: 'AB+', gender: 'Female', dateOfBirth: '2004-02-14', city: 'Mumbai', address: '203, Sea View Apartments, Worli', donorStatus: 'Active', verified: false, latitude: 19.0176, longitude: 72.8158, createdAt: DateTime(2025, 6, 1)),
    UserModel(uid: 'u5', fullName: 'Vikram Singh', email: 'vikram@demo.com', phone: '+91-9876543214', bloodGroup: 'O-', gender: 'Male', dateOfBirth: '1991-09-30', city: 'Chennai', address: '78, Anna Salai, Teynampet, Chennai', donorStatus: 'Active', verified: true, lastDonationDate: '2026-03-05', latitude: 13.0418, longitude: 80.2341, createdAt: DateTime(2025, 4, 10)),
    UserModel(uid: 'u6', fullName: 'Meera Reddy', email: 'meera@demo.com', phone: '+91-9876543215', bloodGroup: 'A-', gender: 'Female', dateOfBirth: '1997-05-18', city: 'Hyderabad', address: 'Plot 35, Jubilee Hills, Hyderabad', donorStatus: 'Active', verified: true, lastDonationDate: '2026-02-14', latitude: 17.4260, longitude: 78.4085, createdAt: DateTime(2025, 5, 22)),
    UserModel(uid: 'u7', fullName: 'Arjun Nair', email: 'arjun@demo.com', phone: '+91-9876543216', bloodGroup: 'B-', gender: 'Male', dateOfBirth: '1999-12-25', city: 'Pune', address: '12, FC Road, Shivajinagar, Pune', donorStatus: 'Active', verified: true, latitude: 18.5308, longitude: 73.8474, createdAt: DateTime(2025, 7, 18)),
    UserModel(uid: 'u9', fullName: 'Deepa Menon', email: 'deepa@demo.com', phone: '+91-9876543217', bloodGroup: 'O+', gender: 'Female', dateOfBirth: '1995-08-12', city: 'Kochi', address: '22/B, MG Road, Ernakulam, Kochi', donorStatus: 'Active', verified: true, lastDonationDate: '2026-04-12', latitude: 9.9816, longitude: 76.2999, createdAt: DateTime(2025, 8, 5)),
    UserModel(uid: 'u10', fullName: 'Ravi Deshmukh', email: 'ravi@demo.com', phone: '+91-9876543218', bloodGroup: 'A+', gender: 'Male', dateOfBirth: '1986-04-03', city: 'Nagpur', address: '15, Dharampeth, Seminary Hills, Nagpur', donorStatus: 'Active', verified: true, lastDonationDate: '2026-01-08', latitude: 21.1458, longitude: 79.0882, createdAt: DateTime(2025, 9, 12)),
    UserModel(uid: 'u11', fullName: 'Ananya Gupta', email: 'ananya@demo.com', phone: '+91-9876543219', bloodGroup: 'AB-', gender: 'Female', dateOfBirth: '2000-10-28', city: 'Jaipur', address: 'C-56, Vaishali Nagar, Jaipur', donorStatus: 'Active', verified: true, lastDonationDate: '2026-03-28', latitude: 26.9124, longitude: 75.7873, createdAt: DateTime(2025, 10, 20)),
    UserModel(uid: 'u12', fullName: 'Karthik Iyer', email: 'karthik@demo.com', phone: '+91-9876543220', bloodGroup: 'B+', gender: 'Male', dateOfBirth: '1993-06-17', city: 'Coimbatore', address: '89, Avinashi Road, Peelamedu, Coimbatore', donorStatus: 'Inactive', verified: true, lastDonationDate: '2025-10-15', latitude: 11.0168, longitude: 76.9558, createdAt: DateTime(2025, 11, 2)),
    UserModel(uid: 'u13', fullName: 'Fatima Begum', email: 'fatima@demo.com', phone: '+91-9876543221', bloodGroup: 'O-', gender: 'Female', dateOfBirth: '1998-01-09', city: 'Lucknow', address: '45, Hazratganj, Lucknow', donorStatus: 'Active', verified: true, lastDonationDate: '2026-02-20', latitude: 26.8467, longitude: 80.9462, createdAt: DateTime(2025, 12, 10)),
    UserModel(uid: 'u14', fullName: 'Sanjay Thakur', email: 'sanjay@demo.com', phone: '+91-9876543222', bloodGroup: 'A-', gender: 'Male', dateOfBirth: '1988-07-21', city: 'Kolkata', address: '7A, Park Street, Kolkata', donorStatus: 'Active', verified: true, lastDonationDate: '2026-04-01', latitude: 22.5511, longitude: 88.3520, createdAt: DateTime(2026, 1, 5)),
    UserModel(uid: 'u15', fullName: 'Nisha Verma', email: 'nisha@demo.com', phone: '+91-9876543223', bloodGroup: 'AB+', gender: 'Female', dateOfBirth: '2002-03-30', city: 'Ahmedabad', address: '202, CG Road, Navrangpura, Ahmedabad', donorStatus: 'Active', verified: false, latitude: 23.0258, longitude: 72.5636, createdAt: DateTime(2026, 2, 14)),
    UserModel(uid: 'u16', fullName: 'Rajesh Pillai', email: 'rajesh@demo.com', phone: '+91-9876543224', bloodGroup: 'B-', gender: 'Male', dateOfBirth: '1981-11-15', city: 'Thiruvananthapuram', address: 'TC 12/456, Vazhuthacaud, Trivandrum', donorStatus: 'Active', verified: true, lastDonationDate: '2026-03-10', latitude: 8.5074, longitude: 76.9730, createdAt: DateTime(2026, 3, 1)),
    // South Indian donors – Chennai
    UserModel(uid: 'u18', fullName: 'Senthil Kumar', email: 'senthil@demo.com', phone: '+91-9944321100', bloodGroup: 'A+', gender: 'Male', dateOfBirth: '1992-05-10', city: 'Chennai', address: '14, T. Nagar, Chennai', donorStatus: 'Active', verified: true, lastDonationDate: '2026-04-10', latitude: 13.0418, longitude: 80.2341, createdAt: DateTime(2025, 6, 15)),
    UserModel(uid: 'u19', fullName: 'Kavitha Sundaram', email: 'kavitha@demo.com', phone: '+91-9944321101', bloodGroup: 'B+', gender: 'Female', dateOfBirth: '1996-09-23', city: 'Chennai', address: '56, Velachery Main Road, Chennai', donorStatus: 'Active', verified: true, lastDonationDate: '2026-02-18', latitude: 12.9783, longitude: 80.2209, createdAt: DateTime(2025, 7, 20)),
    UserModel(uid: 'u20', fullName: 'Murugan Palani', email: 'murugan@demo.com', phone: '+91-9944321102', bloodGroup: 'O+', gender: 'Male', dateOfBirth: '1989-11-03', city: 'Chennai', address: '7, Perambur Barracks Road, Perambur', donorStatus: 'Active', verified: true, lastDonationDate: '2026-03-22', latitude: 13.1188, longitude: 80.2490, createdAt: DateTime(2025, 8, 10)),
    UserModel(uid: 'u21', fullName: 'Anitha Rajan', email: 'anitha@demo.com', phone: '+91-9944321103', bloodGroup: 'AB+', gender: 'Female', dateOfBirth: '2001-01-14', city: 'Chennai', address: '22, OMR Road, Sholinganallur, Chennai', donorStatus: 'Active', verified: true, latitude: 12.9010, longitude: 80.2279, createdAt: DateTime(2025, 9, 5)),
    UserModel(uid: 'u22', fullName: 'Balaji Krishnan', email: 'balaji@demo.com', phone: '+91-9944321104', bloodGroup: 'O-', gender: 'Male', dateOfBirth: '1987-07-29', city: 'Chennai', address: '45, Anna Nagar, Chennai', donorStatus: 'Active', verified: true, lastDonationDate: '2026-01-15', latitude: 13.0850, longitude: 80.2101, createdAt: DateTime(2025, 10, 14)),
    UserModel(uid: 'u23', fullName: 'Divya Suresh', email: 'divya@demo.com', phone: '+91-9944321105', bloodGroup: 'A-', gender: 'Female', dateOfBirth: '1999-03-08', city: 'Coimbatore', address: '18, RS Puram, Coimbatore', donorStatus: 'Active', verified: true, lastDonationDate: '2026-02-28', latitude: 11.0024, longitude: 76.9552, createdAt: DateTime(2025, 11, 12)),
    UserModel(uid: 'u24', fullName: 'Suresh Babu', email: 'sureshb@demo.com', phone: '+91-9944321106', bloodGroup: 'B-', gender: 'Male', dateOfBirth: '1985-04-17', city: 'Madurai', address: '9, Goripalayam, Madurai', donorStatus: 'Active', verified: true, lastDonationDate: '2026-03-14', latitude: 9.9252, longitude: 78.1198, createdAt: DateTime(2025, 12, 1)),
    UserModel(uid: 'u25', fullName: 'Preethi Annamalai', email: 'preethi@demo.com', phone: '+91-9944321107', bloodGroup: 'AB-', gender: 'Female', dateOfBirth: '2000-12-25', city: 'Tiruchirappalli', address: '67, Thillai Nagar, Trichy', donorStatus: 'Active', verified: true, latitude: 10.8083, longitude: 78.7063, createdAt: DateTime(2026, 1, 18)),
    UserModel(uid: 'u26', fullName: 'Vignesh Subramanian', email: 'vignesh@demo.com', phone: '+91-9944321108', bloodGroup: 'O+', gender: 'Male', dateOfBirth: '1994-08-12', city: 'Chennai', address: '33, Adyar, Chennai', donorStatus: 'Active', verified: true, lastDonationDate: '2026-04-05', latitude: 13.0012, longitude: 80.2565, createdAt: DateTime(2026, 2, 22)),
    // Admin user
    UserModel(uid: 'admin1', fullName: 'Admin User', email: 'admin@lifelink.com', phone: '+91-9000000000', bloodGroup: 'O+', gender: 'Male', dateOfBirth: '1996-01-01', city: 'Mumbai', address: 'LifeLink HQ, BKC, Mumbai', donorStatus: 'Active', verified: true, role: 'admin', createdAt: DateTime(2025, 1, 1)),
  ];

  static List<EmergencyRequestModel> requests = [
    EmergencyRequestModel(requestId: 'r1', requesterId: 'u1', requesterName: 'Deepak Verma', patientName: 'Sunita Verma', bloodGroup: 'O+', hospitalName: 'Apollo Hospital, Mumbai', city: 'Mumbai', emergencyLevel: 'Critical', status: 'active', responseCount: 3, createdAt: DateTime.now().subtract(const Duration(hours: 2))),
    EmergencyRequestModel(requestId: 'r2', requesterId: 'u2', requesterName: 'Kavita Joshi', patientName: 'Ram Joshi', bloodGroup: 'A-', hospitalName: 'AIIMS, Delhi', city: 'Delhi', emergencyLevel: 'Urgent', status: 'active', responseCount: 1, createdAt: DateTime.now().subtract(const Duration(hours: 8))),
    EmergencyRequestModel(requestId: 'r3', requesterId: 'u3', requesterName: 'Suresh Iyer', patientName: 'Lakshmi Iyer', bloodGroup: 'B+', hospitalName: 'Fortis, Bangalore', city: 'Bangalore', emergencyLevel: 'Normal', status: 'fulfilled', responseCount: 5, createdAt: DateTime.now().subtract(const Duration(days: 2))),
    EmergencyRequestModel(requestId: 'r4', requesterId: 'u4', requesterName: 'Neha Gupta', patientName: 'Anjali Gupta', bloodGroup: 'AB+', hospitalName: 'Max Hospital, Delhi', city: 'Delhi', emergencyLevel: 'Critical', status: 'active', responseCount: 0, createdAt: DateTime.now().subtract(const Duration(hours: 4))),
    // Chennai emergency requests
    EmergencyRequestModel(requestId: 'r5', requesterId: 'u18', requesterName: 'Senthil Kumar', patientName: 'Radha Senthil', bloodGroup: 'A+', hospitalName: 'Apollo Hospitals, Greams Road, Chennai', city: 'Chennai', emergencyLevel: 'Critical', status: 'active', responseCount: 2, createdAt: DateTime.now().subtract(const Duration(hours: 1))),
    EmergencyRequestModel(requestId: 'r6', requesterId: 'u19', requesterName: 'Kavitha S', patientName: 'Ramu Sundaram', bloodGroup: 'O-', hospitalName: 'MIOT Hospitals, Chennai', city: 'Chennai', emergencyLevel: 'Urgent', status: 'active', responseCount: 0, createdAt: DateTime.now().subtract(const Duration(hours: 3))),
  ];

  static List<HospitalModel> hospitals = [
    // North India
    HospitalModel(id: 'h1', name: 'Apollo Hospital', address: 'Navi Mumbai, Maharashtra', contact: '+91-22-12345678', bloodAvailability: {'O+': 15, 'A+': 8, 'B+': 12, 'AB+': 3, 'O-': 5, 'A-': 2, 'B-': 4, 'AB-': 1}, latitude: 19.033, longitude: 73.029),
    HospitalModel(id: 'h2', name: 'AIIMS Hospital', address: 'Ansari Nagar, New Delhi', contact: '+91-11-26588500', bloodAvailability: {'O+': 20, 'A+': 15, 'B+': 10, 'AB+': 6, 'O-': 8, 'A-': 5, 'B-': 3, 'AB-': 2}, latitude: 28.567, longitude: 77.210),
    HospitalModel(id: 'h3', name: 'Fortis Hospital', address: 'Bannerghatta Rd, Bangalore', contact: '+91-80-66214444', bloodAvailability: {'O+': 12, 'A+': 7, 'B+': 9, 'AB+': 4, 'O-': 3, 'A-': 2, 'B-': 5, 'AB-': 1}, latitude: 12.891, longitude: 77.598),
    HospitalModel(id: 'h4', name: 'Medanta Hospital', address: 'Sector 38, Gurugram', contact: '+91-124-4141414', bloodAvailability: {'O+': 18, 'A+': 11, 'B+': 14, 'AB+': 5, 'O-': 6, 'A-': 4, 'B-': 3, 'AB-': 2}, latitude: 28.440, longitude: 77.041),
    HospitalModel(id: 'h5', name: 'Narayana Health', address: 'Hosur Road, Bangalore', contact: '+91-80-71222222', bloodAvailability: {'O+': 10, 'A+': 6, 'B+': 8, 'AB+': 2, 'O-': 4, 'A-': 3, 'B-': 2, 'AB-': 1}, latitude: 12.895, longitude: 77.600),
    HospitalModel(id: 'h6', name: 'Max Super Speciality Hospital', address: 'Saket, New Delhi', contact: '+91-11-26515050', bloodAvailability: {'O+': 22, 'A+': 14, 'B+': 11, 'AB+': 7, 'O-': 9, 'A-': 6, 'B-': 4, 'AB-': 3}, latitude: 28.5285, longitude: 77.2111),
    HospitalModel(id: 'h7', name: 'Kokilaben Hospital', address: 'Andheri West, Mumbai', contact: '+91-22-42696969', bloodAvailability: {'O+': 17, 'A+': 10, 'B+': 13, 'AB+': 5, 'O-': 7, 'A-': 4, 'B-': 3, 'AB-': 2}, latitude: 19.1307, longitude: 72.8253),

    // ── South India – Chennai & Tamil Nadu ────────────────────────────
    HospitalModel(id: 'h8', name: 'Apollo Hospitals, Greams Road', address: '21, Greams Lane, Chennai - 600006', contact: '+91-44-28290200', bloodAvailability: {'O+': 25, 'A+': 18, 'B+': 14, 'AB+': 8, 'O-': 10, 'A-': 6, 'B-': 5, 'AB-': 3}, latitude: 13.0614, longitude: 80.2544),
    HospitalModel(id: 'h9', name: 'MIOT International Hospital', address: '4/112, Mount Poonamallee Road, Chennai - 600089', contact: '+91-44-42002288', bloodAvailability: {'O+': 20, 'A+': 12, 'B+': 16, 'AB+': 5, 'O-': 8, 'A-': 4, 'B-': 6, 'AB-': 2}, latitude: 13.0382, longitude: 80.1617),
    HospitalModel(id: 'h10', name: 'Fortis Malar Hospital', address: 'No 52, 1st Main Road, Gandhi Nagar, Adyar, Chennai - 600020', contact: '+91-44-42892222', bloodAvailability: {'O+': 18, 'A+': 10, 'B+': 12, 'AB+': 4, 'O-': 7, 'A-': 3, 'B-': 4, 'AB-': 2}, latitude: 13.0053, longitude: 80.2565),
    HospitalModel(id: 'h11', name: 'Kauvery Hospital, Alwarpet', address: '199, Luz Church Road, Mylapore, Chennai - 600004', contact: '+91-44-40006000', bloodAvailability: {'O+': 22, 'A+': 15, 'B+': 11, 'AB+': 6, 'O-': 9, 'A-': 5, 'B-': 4, 'AB-': 3}, latitude: 13.0341, longitude: 80.2650),
    HospitalModel(id: 'h12', name: 'Sri Ramachandra Institute of Higher Education', address: 'No. 1, Ramachandra Nagar, Porur, Chennai - 600116', contact: '+91-44-45928669', bloodAvailability: {'O+': 30, 'A+': 20, 'B+': 18, 'AB+': 9, 'O-': 12, 'A-': 7, 'B-': 6, 'AB-': 4}, latitude: 13.0335, longitude: 80.1615),
    HospitalModel(id: 'h13', name: 'Government Stanley Medical College & Hospital', address: 'Old Jail Road, Chennai - 600001', contact: '+91-44-25281500', bloodAvailability: {'O+': 35, 'A+': 22, 'B+': 24, 'AB+': 8, 'O-': 14, 'A-': 8, 'B-': 7, 'AB-': 3}, latitude: 13.0850, longitude: 80.2872),
    HospitalModel(id: 'h14', name: 'Rajiv Gandhi Government General Hospital', address: 'Park Town, Chennai - 600003', contact: '+91-44-25305000', bloodAvailability: {'O+': 40, 'A+': 28, 'B+': 26, 'AB+': 10, 'O-': 15, 'A-': 9, 'B-': 8, 'AB-': 5}, latitude: 13.0827, longitude: 80.2707),
    HospitalModel(id: 'h15', name: 'Billroth Hospitals', address: '43, Lakshmi Talkies Road, Shenoy Nagar, Chennai - 600030', contact: '+91-44-26444000', bloodAvailability: {'O+': 15, 'A+': 10, 'B+': 9, 'AB+': 4, 'O-': 6, 'A-': 3, 'B-': 3, 'AB-': 1}, latitude: 13.0888, longitude: 80.2183),
    HospitalModel(id: 'h16', name: 'Vijaya Hospital', address: '434, N.S.K. Salai, Vadapalani, Chennai - 600026', contact: '+91-44-24806363', bloodAvailability: {'O+': 14, 'A+': 9, 'B+': 11, 'AB+': 3, 'O-': 5, 'A-': 3, 'B-': 2, 'AB-': 1}, latitude: 13.0523, longitude: 80.2090),
    HospitalModel(id: 'h17', name: 'Global Hospital, Chennai', address: '439, Cheran Nagar, Perumbakkam, Chennai - 600100', contact: '+91-44-44777000', bloodAvailability: {'O+': 19, 'A+': 13, 'B+': 12, 'AB+': 5, 'O-': 7, 'A-': 4, 'B-': 4, 'AB-': 2}, latitude: 12.9285, longitude: 80.1956),
    HospitalModel(id: 'h18', name: 'PSG Hospitals, Coimbatore', address: 'Peelamedu, Coimbatore - 641004', contact: '+91-422-4345000', bloodAvailability: {'O+': 16, 'A+': 11, 'B+': 10, 'AB+': 4, 'O-': 6, 'A-': 3, 'B-': 3, 'AB-': 2}, latitude: 11.0248, longitude: 76.9946),
    HospitalModel(id: 'h19', name: 'Government Rajaji Hospital, Madurai', address: 'Park Avenue, Madurai - 625020', contact: '+91-452-2532535', bloodAvailability: {'O+': 28, 'A+': 18, 'B+': 20, 'AB+': 7, 'O-': 11, 'A-': 6, 'B-': 5, 'AB-': 3}, latitude: 9.9191, longitude: 78.1188),
    HospitalModel(id: 'h20', name: 'Manipal Hospital, Vijayawada', address: '7-1-82/A, Beside Siddhartha Public School, Vijayawada - 520010', contact: '+91-866-6727777', bloodAvailability: {'O+': 17, 'A+': 11, 'B+': 9, 'AB+': 5, 'O-': 6, 'A-': 4, 'B-': 3, 'AB-': 2}, latitude: 16.5062, longitude: 80.6480),
    HospitalModel(id: 'h21', name: 'Yashoda Hospitals, Hyderabad', address: 'Raj Bhavan Road, Somajiguda, Hyderabad - 500082', contact: '+91-40-45674567', bloodAvailability: {'O+': 21, 'A+': 14, 'B+': 13, 'AB+': 6, 'O-': 8, 'A-': 5, 'B-': 4, 'AB-': 2}, latitude: 17.4178, longitude: 78.4647),
    HospitalModel(id: 'h22', name: 'Amrita Institute of Medical Sciences, Kochi', address: 'AIMS Ponekkara P.O., Kochi - 682041', contact: '+91-484-2801234', bloodAvailability: {'O+': 24, 'A+': 16, 'B+': 15, 'AB+': 6, 'O-': 9, 'A-': 5, 'B-': 4, 'AB-': 2}, latitude: 9.9816, longitude: 76.2999),
  ];

  static List<BloodBankModel> bloodBanks = [
    BloodBankModel(id: 'bb1', name: 'Indian Red Cross Blood Bank', address: '1, Red Cross Rd, Mumbai', contact: '+91-22-23621573', bloodAvailability: {'O+': 45, 'A+': 30, 'B+': 38, 'AB+': 12, 'O-': 15, 'A-': 8, 'B-': 10, 'AB-': 4}, latitude: 18.9441, longitude: 72.8302),
    BloodBankModel(id: 'bb2', name: 'Rotary Blood Bank', address: '56-57, Tughlakabad, Delhi', contact: '+91-11-29960044', bloodAvailability: {'O+': 55, 'A+': 40, 'B+': 35, 'AB+': 15, 'O-': 20, 'A-': 12, 'B-': 8, 'AB-': 6}, latitude: 28.5085, longitude: 77.2580),
    BloodBankModel(id: 'bb3', name: 'Prathama Blood Centre', address: 'Satellite Rd, Ahmedabad', contact: '+91-79-26921111', bloodAvailability: {'O+': 38, 'A+': 25, 'B+': 30, 'AB+': 10, 'O-': 12, 'A-': 7, 'B-': 9, 'AB-': 3}, latitude: 23.0225, longitude: 72.5299),
    BloodBankModel(id: 'bb4', name: 'RV Blood Bank', address: 'Basavanagudi, Bangalore', contact: '+91-80-26576985', bloodAvailability: {'O+': 32, 'A+': 20, 'B+': 25, 'AB+': 8, 'O-': 10, 'A-': 5, 'B-': 7, 'AB-': 2}, latitude: 12.9387, longitude: 77.5650),
    BloodBankModel(id: 'bb5', name: 'Thalassemia Society Blood Bank', address: 'Padmarao Nagar, Hyderabad', contact: '+91-40-27803894', bloodAvailability: {'O+': 28, 'A+': 18, 'B+': 22, 'AB+': 6, 'O-': 8, 'A-': 4, 'B-': 6, 'AB-': 2}, latitude: 17.4340, longitude: 78.5060),
    // South Indian blood banks
    BloodBankModel(id: 'bb6', name: 'Tamil Nadu Blood Transfusion Council', address: '359/1, Anna Salai, Teynampet, Chennai - 600018', contact: '+91-44-24333370', bloodAvailability: {'O+': 60, 'A+': 45, 'B+': 42, 'AB+': 18, 'O-': 22, 'A-': 14, 'B-': 12, 'AB-': 7}, latitude: 13.0418, longitude: 80.2341),
    BloodBankModel(id: 'bb7', name: 'Apollo Blood Bank, Chennai', address: '21, Greams Lane, Thousand Lights, Chennai - 600006', contact: '+91-44-28290200', bloodAvailability: {'O+': 48, 'A+': 32, 'B+': 36, 'AB+': 14, 'O-': 18, 'A-': 11, 'B-': 9, 'AB-': 5}, latitude: 13.0614, longitude: 80.2544),
    BloodBankModel(id: 'bb8', name: 'KKHTDB Government Blood Bank, Chennai', address: 'KKHTDB, Kilpauk, Chennai - 600010', contact: '+91-44-26412503', bloodAvailability: {'O+': 70, 'A+': 55, 'B+': 50, 'AB+': 20, 'O-': 25, 'A-': 16, 'B-': 13, 'AB-': 8}, latitude: 13.0827, longitude: 80.2481),
    BloodBankModel(id: 'bb9', name: 'Voluntary Blood Bank, Coimbatore', address: 'Gandhipuram, Coimbatore - 641012', contact: '+91-422-2301850', bloodAvailability: {'O+': 35, 'A+': 24, 'B+': 28, 'AB+': 9, 'O-': 13, 'A-': 8, 'B-': 6, 'AB-': 3}, latitude: 11.0168, longitude: 76.9558),
    BloodBankModel(id: 'bb10', name: 'District Blood Bank, Madurai', address: 'Govt Rajaji Hospital Campus, Madurai - 625020', contact: '+91-452-2532535', bloodAvailability: {'O+': 40, 'A+': 28, 'B+': 32, 'AB+': 11, 'O-': 15, 'A-': 9, 'B-': 8, 'AB-': 4}, latitude: 9.9191, longitude: 78.1188),
    BloodBankModel(id: 'bb11', name: 'Shri Sathya Sai Institute Blood Bank, Puttaparthi', address: 'Prasanthigram, Puttaparthi, AP - 515134', contact: '+91-8555-287239', bloodAvailability: {'O+': 25, 'A+': 17, 'B+': 20, 'AB+': 7, 'O-': 10, 'A-': 6, 'B-': 5, 'AB-': 3}, latitude: 14.1630, longitude: 77.8116),
  ];

  static List<NotificationModel> notifications = [
    NotificationModel(id: 'n1', userId: 'u1', message: 'Emergency: O+ blood needed at Apollo Hospital', type: 'emergency', createdAt: DateTime.now().subtract(const Duration(hours: 1))),
    NotificationModel(id: 'n2', userId: 'u1', message: 'Your donation is due! Last donation was 3 months ago.', type: 'reminder', createdAt: DateTime.now().subtract(const Duration(days: 1))),
    NotificationModel(id: 'n3', userId: 'u1', message: 'Thank you for responding to the blood request!', type: 'success', read: true, createdAt: DateTime.now().subtract(const Duration(days: 3))),
    NotificationModel(id: 'n4', userId: 'u18', message: '🚨 Urgent: A+ blood needed at Apollo Chennai!', type: 'emergency', createdAt: DateTime.now().subtract(const Duration(minutes: 30))),
  ];

  static List<DonationModel> donations = [
    DonationModel(donationId: 'd1', donorId: 'u1', donorName: 'Rahul Sharma', bloodGroup: 'O+', donationDate: DateTime(2025, 12, 15), hospital: 'Apollo Hospital', notes: 'Routine'),
    DonationModel(donationId: 'd2', donorId: 'u2', donorName: 'Priya Patel', bloodGroup: 'A+', donationDate: DateTime(2026, 1, 20), hospital: 'AIIMS', notes: 'Emergency'),
    DonationModel(donationId: 'd3', donorId: 'u5', donorName: 'Vikram Singh', bloodGroup: 'O-', donationDate: DateTime(2026, 3, 5), hospital: 'Fortis Hospital', notes: 'Scheduled'),
    DonationModel(donationId: 'd4', donorId: 'u18', donorName: 'Senthil Kumar', bloodGroup: 'A+', donationDate: DateTime(2026, 4, 10), hospital: 'Apollo Chennai', notes: 'Routine'),
  ];

  /// Demo login credentials:
  /// Donor: rahul@demo.com / demo123
  /// Admin: admin@lifelink.com / admin123
  static const Map<String, String> passwords = {
    'rahul@demo.com': 'demo123',
    'priya@demo.com': 'demo123',
    'amit@demo.com': 'demo123',
    'sara@demo.com': 'demo123',
    'vikram@demo.com': 'demo123',
    'meera@demo.com': 'demo123',
    'arjun@demo.com': 'demo123',
    'senthil@demo.com': 'demo123',
    'kavitha@demo.com': 'demo123',
    'murugan@demo.com': 'demo123',
    'admin@lifelink.com': 'admin123',
  };
}
