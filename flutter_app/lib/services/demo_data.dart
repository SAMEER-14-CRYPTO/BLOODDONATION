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
    // ── Tamil Nadu Hospitals ────────────────────────────
    HospitalModel(id: 'h1', name: 'Apollo Hospitals, Greams Road', address: '21, Greams Lane, Chennai, Tamil Nadu - 600006', contact: '+91-44-28290200', bloodAvailability: {'O+': 25, 'A+': 18, 'B+': 14, 'AB+': 8, 'O-': 10, 'A-': 6, 'B-': 5, 'AB-': 3}, latitude: 13.0614, longitude: 80.2544),
    HospitalModel(id: 'h2', name: 'JIPMER Hospital', address: 'Dhanvantri Nagar, Gorimedu, Puducherry - 605006', contact: '+91-413-2272380', bloodAvailability: {'O+': 22, 'A+': 16, 'B+': 14, 'AB+': 6, 'O-': 8, 'A-': 5, 'B-': 4, 'AB-': 2}, latitude: 11.9570, longitude: 79.7969),
    HospitalModel(id: 'h3', name: 'Christian Medical College (CMC)', address: 'Ida Scudder Road, Vellore, Tamil Nadu - 632004', contact: '+91-416-2281000', bloodAvailability: {'O+': 25, 'A+': 18, 'B+': 12, 'AB+': 7, 'O-': 10, 'A-': 6, 'B-': 5, 'AB-': 3}, latitude: 12.9237, longitude: 79.1350),
    HospitalModel(id: 'h4', name: 'Madurai Meenakshi Mission Hospital', address: 'Lake Area, Melur Road, Madurai, Tamil Nadu - 625107', contact: '+91-452-4350000', bloodAvailability: {'O+': 15, 'A+': 9, 'B+': 11, 'AB+': 4, 'O-': 5, 'A-': 3, 'B-': 3, 'AB-': 1}, latitude: 9.9468, longitude: 78.1565),
    HospitalModel(id: 'h5', name: 'Rajiv Gandhi Government General Hospital', address: 'Park Town, Chennai, Tamil Nadu - 600003', contact: '+91-44-25305000', bloodAvailability: {'O+': 40, 'A+': 28, 'B+': 26, 'AB+': 10, 'O-': 15, 'A-': 9, 'B-': 8, 'AB-': 5}, latitude: 13.0827, longitude: 80.2707),
    HospitalModel(id: 'h6', name: 'PSG Hospitals, Coimbatore', address: 'Peelamedu, Coimbatore, Tamil Nadu - 641004', contact: '+91-422-4345000', bloodAvailability: {'O+': 16, 'A+': 11, 'B+': 10, 'AB+': 4, 'O-': 6, 'A-': 3, 'B-': 3, 'AB-': 2}, latitude: 11.0248, longitude: 76.9946),
    HospitalModel(id: 'h7', name: 'SRM Medical College Hospital', address: 'SRM Nagar, Kattankulathur, Tamil Nadu - 603203', contact: '+91-44-27455510', bloodAvailability: {'O+': 16, 'A+': 10, 'B+': 12, 'AB+': 4, 'O-': 5, 'A-': 3, 'B-': 4, 'AB-': 2}, latitude: 12.8231, longitude: 80.0442),
    HospitalModel(id: 'h8', name: 'KMCH (Kovai Medical Center)', address: '99, Avinashi Road, Coimbatore, Tamil Nadu - 641014', contact: '+91-422-4323800', bloodAvailability: {'O+': 12, 'A+': 7, 'B+': 9, 'AB+': 3, 'O-': 4, 'A-': 2, 'B-': 3, 'AB-': 1}, latitude: 11.0283, longitude: 76.9647),
    HospitalModel(id: 'h9', name: 'Sri Ramachandra Medical Centre', address: 'No. 1, Ramachandra Nagar, Porur, Chennai, TN - 600116', contact: '+91-44-45928669', bloodAvailability: {'O+': 30, 'A+': 20, 'B+': 18, 'AB+': 9, 'O-': 12, 'A-': 7, 'B-': 6, 'AB-': 4}, latitude: 13.0335, longitude: 80.1615),
    HospitalModel(id: 'h10', name: 'Government Stanley Medical College Hospital', address: 'Old Jail Road, Royapuram, Chennai, TN - 600001', contact: '+91-44-25281500', bloodAvailability: {'O+': 35, 'A+': 22, 'B+': 24, 'AB+': 8, 'O-': 14, 'A-': 8, 'B-': 7, 'AB-': 3}, latitude: 13.0850, longitude: 80.2872),

    // ── Andhra Pradesh Hospitals ────────────────────────
    HospitalModel(id: 'h11', name: 'SVIMS Hospital, Tirupati', address: 'Alipiri Road, Tirupati, Andhra Pradesh - 517507', contact: '+91-877-2287777', bloodAvailability: {'O+': 20, 'A+': 14, 'B+': 12, 'AB+': 6, 'O-': 7, 'A-': 4, 'B-': 5, 'AB-': 2}, latitude: 13.6450, longitude: 79.4100),
    HospitalModel(id: 'h12', name: 'NRI General Hospital, Guntur', address: 'Chinakakani, Mangalagiri, Guntur, AP - 522503', contact: '+91-863-2878999', bloodAvailability: {'O+': 15, 'A+': 10, 'B+': 11, 'AB+': 4, 'O-': 5, 'A-': 3, 'B-': 3, 'AB-': 1}, latitude: 16.4307, longitude: 80.5525),
    HospitalModel(id: 'h13', name: 'Apollo Hospitals, Visakhapatnam', address: 'Waltair Main Road, Visakhapatnam, AP - 530002', contact: '+91-891-2727272', bloodAvailability: {'O+': 18, 'A+': 12, 'B+': 14, 'AB+': 5, 'O-': 6, 'A-': 4, 'B-': 4, 'AB-': 2}, latitude: 17.7231, longitude: 83.3013),
    HospitalModel(id: 'h14', name: 'Andhra Hospitals, Vijayawada', address: 'Governorpet, Vijayawada, AP - 520002', contact: '+91-866-2577788', bloodAvailability: {'O+': 16, 'A+': 11, 'B+': 13, 'AB+': 4, 'O-': 5, 'A-': 3, 'B-': 4, 'AB-': 1}, latitude: 16.5087, longitude: 80.6326),
    HospitalModel(id: 'h15', name: 'KIMS Hospital, Nellore', address: 'Narasaraopet Road, Nellore, AP - 524004', contact: '+91-861-2322288', bloodAvailability: {'O+': 12, 'A+': 8, 'B+': 9, 'AB+': 3, 'O-': 4, 'A-': 2, 'B-': 3, 'AB-': 1}, latitude: 14.4373, longitude: 79.9690),
    HospitalModel(id: 'h16', name: 'Narayana Medical College & Hospital', address: 'Chinthareddypalem, Nellore, AP - 524003', contact: '+91-861-2317962', bloodAvailability: {'O+': 14, 'A+': 9, 'B+': 10, 'AB+': 3, 'O-': 5, 'A-': 3, 'B-': 3, 'AB-': 1}, latitude: 14.4197, longitude: 79.9748),
    HospitalModel(id: 'h17', name: 'King George Hospital (KGH)', address: 'Maharanipeta, Visakhapatnam, AP - 530002', contact: '+91-891-2564891', bloodAvailability: {'O+': 24, 'A+': 16, 'B+': 14, 'AB+': 6, 'O-': 9, 'A-': 5, 'B-': 5, 'AB-': 2}, latitude: 17.7146, longitude: 83.3037),
    HospitalModel(id: 'h18', name: 'Government General Hospital, Kurnool', address: 'Budhawarpet, Kurnool, AP - 518001', contact: '+91-8518-224242', bloodAvailability: {'O+': 18, 'A+': 12, 'B+': 10, 'AB+': 4, 'O-': 6, 'A-': 3, 'B-': 4, 'AB-': 1}, latitude: 15.8267, longitude: 78.0400),
    HospitalModel(id: 'h19', name: 'RIMS Hospital, Kadapa', address: 'Putlampalli, Kadapa, AP - 516004', contact: '+91-8562-252275', bloodAvailability: {'O+': 12, 'A+': 8, 'B+': 9, 'AB+': 3, 'O-': 4, 'A-': 2, 'B-': 3, 'AB-': 1}, latitude: 14.4750, longitude: 78.8300),
    HospitalModel(id: 'h20', name: 'Government General Hospital, Vijayawada', address: 'Gunadala, Vijayawada, AP - 520004', contact: '+91-866-2420385', bloodAvailability: {'O+': 22, 'A+': 15, 'B+': 12, 'AB+': 5, 'O-': 8, 'A-': 4, 'B-': 4, 'AB-': 2}, latitude: 16.5150, longitude: 80.6237),
  ];

  static List<BloodBankModel> bloodBanks = [
    // ── Tamil Nadu Blood Banks ──────────────────────────
    BloodBankModel(id: 'bb1', name: 'Tamil Nadu State Blood Bank', address: 'Kilpauk, Chennai, Tamil Nadu - 600010', contact: '+91-44-26432804', bloodAvailability: {'O+': 50, 'A+': 35, 'B+': 40, 'AB+': 12, 'O-': 18, 'A-': 10, 'B-': 12, 'AB-': 5}, latitude: 13.0843, longitude: 80.2399),
    BloodBankModel(id: 'bb2', name: 'Red Cross Blood Bank, Chennai', address: '179, Anna Salai, Chennai, Tamil Nadu - 600002', contact: '+91-44-28520068', bloodAvailability: {'O+': 42, 'A+': 28, 'B+': 32, 'AB+': 10, 'O-': 14, 'A-': 8, 'B-': 10, 'AB-': 4}, latitude: 13.0580, longitude: 80.2579),
    BloodBankModel(id: 'bb3', name: 'Lions Blood Bank, Madurai', address: 'Bibi Kulam Road, Madurai, Tamil Nadu - 625002', contact: '+91-452-2337344', bloodAvailability: {'O+': 30, 'A+': 20, 'B+': 25, 'AB+': 8, 'O-': 10, 'A-': 5, 'B-': 7, 'AB-': 3}, latitude: 9.9276, longitude: 78.1176),
    BloodBankModel(id: 'bb4', name: 'Rotary Blood Bank, Coimbatore', address: 'DB Road, RS Puram, Coimbatore, Tamil Nadu - 641002', contact: '+91-422-2543444', bloodAvailability: {'O+': 35, 'A+': 22, 'B+': 28, 'AB+': 9, 'O-': 12, 'A-': 6, 'B-': 8, 'AB-': 3}, latitude: 11.0090, longitude: 76.9547),
    BloodBankModel(id: 'bb5', name: 'GRH Blood Bank, Trichy', address: 'Thanjavur Road, Trichy, Tamil Nadu - 620001', contact: '+91-431-2407576', bloodAvailability: {'O+': 28, 'A+': 18, 'B+': 22, 'AB+': 7, 'O-': 9, 'A-': 5, 'B-': 6, 'AB-': 2}, latitude: 10.8003, longitude: 78.6939),
    BloodBankModel(id: 'bb6', name: 'Tirunelveli Medical College Blood Bank', address: 'High Ground, Tirunelveli, Tamil Nadu - 627011', contact: '+91-462-2572726', bloodAvailability: {'O+': 25, 'A+': 16, 'B+': 20, 'AB+': 6, 'O-': 8, 'A-': 4, 'B-': 5, 'AB-': 2}, latitude: 8.7284, longitude: 77.7131),
    BloodBankModel(id: 'bb7', name: 'Salem Government Blood Bank', address: 'Shanmuga Nagar, Salem, Tamil Nadu - 636007', contact: '+91-427-2313333', bloodAvailability: {'O+': 22, 'A+': 14, 'B+': 18, 'AB+': 5, 'O-': 7, 'A-': 4, 'B-': 5, 'AB-': 2}, latitude: 11.6596, longitude: 78.1542),
    BloodBankModel(id: 'bb8', name: 'Thanjavur Medical College Blood Bank', address: 'Medical College Road, Thanjavur, TN - 613004', contact: '+91-4362-231091', bloodAvailability: {'O+': 20, 'A+': 12, 'B+': 15, 'AB+': 5, 'O-': 6, 'A-': 3, 'B-': 4, 'AB-': 2}, latitude: 10.7768, longitude: 79.1318),

    // ── Andhra Pradesh Blood Banks ──────────────────────
    BloodBankModel(id: 'bb9', name: 'Red Cross Blood Bank, Vijayawada', address: 'Eluru Road, Vijayawada, AP - 520001', contact: '+91-866-2573456', bloodAvailability: {'O+': 40, 'A+': 25, 'B+': 30, 'AB+': 10, 'O-': 14, 'A-': 7, 'B-': 9, 'AB-': 4}, latitude: 16.5101, longitude: 80.6320),
    BloodBankModel(id: 'bb10', name: 'Government Blood Bank, Tirupati', address: 'Alipiri Road, Tirupati, AP - 517507', contact: '+91-877-2264567', bloodAvailability: {'O+': 35, 'A+': 22, 'B+': 26, 'AB+': 8, 'O-': 12, 'A-': 6, 'B-': 8, 'AB-': 3}, latitude: 13.6350, longitude: 79.4200),
    BloodBankModel(id: 'bb11', name: 'KGH Blood Bank, Visakhapatnam', address: 'Maharanipeta, Visakhapatnam, AP - 530002', contact: '+91-891-2564900', bloodAvailability: {'O+': 45, 'A+': 30, 'B+': 35, 'AB+': 12, 'O-': 16, 'A-': 8, 'B-': 10, 'AB-': 4}, latitude: 17.7146, longitude: 83.3037),
    BloodBankModel(id: 'bb12', name: 'NRI Blood Bank, Guntur', address: 'Chinakakani, Mangalagiri, Guntur, AP - 522503', contact: '+91-863-2878990', bloodAvailability: {'O+': 28, 'A+': 18, 'B+': 22, 'AB+': 7, 'O-': 9, 'A-': 5, 'B-': 6, 'AB-': 2}, latitude: 16.4307, longitude: 80.5525),
    BloodBankModel(id: 'bb13', name: 'Government Blood Bank, Nellore', address: 'Grand Trunk Road, Nellore, AP - 524001', contact: '+91-861-2314567', bloodAvailability: {'O+': 22, 'A+': 14, 'B+': 18, 'AB+': 5, 'O-': 7, 'A-': 4, 'B-': 5, 'AB-': 2}, latitude: 14.4426, longitude: 79.9865),
    BloodBankModel(id: 'bb14', name: 'RIMS Blood Bank, Kadapa', address: 'Putlampalli, Kadapa, AP - 516004', contact: '+91-8562-252280', bloodAvailability: {'O+': 18, 'A+': 12, 'B+': 14, 'AB+': 4, 'O-': 6, 'A-': 3, 'B-': 4, 'AB-': 1}, latitude: 14.4750, longitude: 78.8300),
    BloodBankModel(id: 'bb15', name: 'Kurnool Government Blood Bank', address: 'Budhawarpet, Kurnool, AP - 518001', contact: '+91-8518-224250', bloodAvailability: {'O+': 20, 'A+': 13, 'B+': 16, 'AB+': 5, 'O-': 7, 'A-': 3, 'B-': 5, 'AB-': 2}, latitude: 15.8267, longitude: 78.0400),
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
