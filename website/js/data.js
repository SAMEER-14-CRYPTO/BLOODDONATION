// ============================================
// LIFELINK – Data Store & Firebase Sync
// Distinct Admin, Donor & Receiver Database Sections
// Tamil Nadu & Andhra Pradesh Real Data
// ============================================

const DEFAULT_ADMIN_PASSWORDS = {
  'sameeradmin@lifelink.com': { password: 'Sameer@14', uid: 'sameer_admin' }
};

const DEFAULT_DONOR_PASSWORDS = {
  'sameershaik9184@gmail.com': { password: 'Sameer@14', uid: 'sameer_donor' },
  'karthik@demo.com':          { password: 'demo123',   uid: 'u1' },
  'priya@demo.com':            { password: 'demo123',   uid: 'u2' },
  'vikram@demo.com':           { password: 'demo123',   uid: 'u3' },
  'anitha@demo.com':           { password: 'demo123',   uid: 'u4' },
  'rajesh@demo.com':           { password: 'demo123',   uid: 'u5' },
  'meena@demo.com':            { password: 'demo123',   uid: 'u6' },
  'suresh@demo.com':           { password: 'demo123',   uid: 'u7' },
  'deepa@demo.com':            { password: 'demo123',   uid: 'u8' },
  'arjun@demo.com':            { password: 'demo123',   uid: 'u9' },
  'lakshmi@demo.com':          { password: 'demo123',   uid: 'u10' }
};

const DEFAULT_RECEIVER_PASSWORDS = {};

const DemoData = {
  _key: 'lifelink_data',
  _isSeeding: false,

  // ────────────────────────────────────────────────────────────
  // Database Schema: Admin, Donor & Receiver Sections
  // ────────────────────────────────────────────────────────────
  _defaults: {
    // ── Dedicated Admin Section (Hardcoded – only Sameer) ──
    admins: [
      {
        uid: 'sameer_admin',
        displayName: 'Sameer Admin',
        fullName: 'Sameer Admin',
        email: 'sameeradmin@lifelink.com',
        phone: '+91-9184000001',
        bloodGroup: 'O+',
        gender: 'Male',
        age: 21,
        city: 'Rly Kodur',
        address: 'LifeLink Headquarters, Rly Kodur, Andhra Pradesh',
        role: 'admin',
        permissions: ['all', 'manage_users', 'manage_requests', 'broadcast'],
        verified: true,
        availability: true,
        lat: 14.0042,
        lng: 79.3512,
        createdAt: '2026-08-18T10:00:00'
      }
    ],

    // ── Dedicated Donor Section (Tamil Nadu & Andhra Pradesh) ──
    donors: [
      { uid:'sameer_donor', displayName:'Sameer Shaik', fullName:'Sameer Shaik', email:'sameershaik9184@gmail.com', phone:'+91-9184000000', bloodGroup:'B-', gender:'Male', age:21, city:'Rly Kodur', address:'Rly Kodur, Andhra Pradesh', availability:true, verified:true, role:'donor', lastDonation:'2026-08-20', lat:14.0042, lng:79.3512, createdAt:'2026-08-18' },
      { uid:'u1', displayName:'Karthik Iyer', fullName:'Karthik Iyer', email:'karthik@demo.com', phone:'+91-9876543210', bloodGroup:'O+', gender:'Male', age:28, city:'Chennai', address:'42, Anna Nagar, Chennai, Tamil Nadu 600040', availability:true, verified:true, role:'donor', lastDonation:'2026-07-15', lat:13.0827, lng:80.2707, createdAt:'2026-01-10' },
      { uid:'u2', displayName:'Priya Lakshmi', fullName:'Priya Lakshmi', email:'priya@demo.com', phone:'+91-9876543211', bloodGroup:'A+', gender:'Female', age:25, city:'Coimbatore', address:'15, RS Puram, Coimbatore, Tamil Nadu 641002', availability:true, verified:true, role:'donor', lastDonation:'2026-06-20', lat:11.0168, lng:76.9558, createdAt:'2026-03-15' },
      { uid:'u3', displayName:'Vikram Reddy', fullName:'Vikram Reddy', email:'vikram@demo.com', phone:'+91-9876543212', bloodGroup:'B+', gender:'Male', age:32, city:'Visakhapatnam', address:'Dwaraka Nagar, Visakhapatnam, AP 530016', availability:true, verified:true, role:'donor', lastDonation:'2026-05-10', lat:17.6868, lng:83.2185, createdAt:'2026-02-20' },
      { uid:'u4', displayName:'Anitha Devi', fullName:'Anitha Devi', email:'anitha@demo.com', phone:'+91-9876543213', bloodGroup:'AB+', gender:'Female', age:22, city:'Madurai', address:'KK Nagar, Madurai, Tamil Nadu 625020', availability:true, verified:true, role:'donor', lastDonation:'2026-04-05', lat:9.9252, lng:78.1198, createdAt:'2026-06-01' },
      { uid:'u5', displayName:'Rajesh Kumar', fullName:'Rajesh Kumar', email:'rajesh@demo.com', phone:'+91-9876543214', bloodGroup:'O-', gender:'Male', age:35, city:'Vijayawada', address:'MG Road, Vijayawada, AP 520010', availability:true, verified:true, role:'donor', lastDonation:'2026-03-05', lat:16.5062, lng:80.6480, createdAt:'2026-04-10' },
      { uid:'u6', displayName:'Meena Kumari', fullName:'Meena Kumari', email:'meena@demo.com', phone:'+91-9876543215', bloodGroup:'A-', gender:'Female', age:29, city:'Tirupati', address:'TPT Main Road, Tirupati, AP 517501', availability:true, verified:true, role:'donor', lastDonation:'2026-02-14', lat:13.6288, lng:79.4192, createdAt:'2026-05-22' },
      { uid:'u7', displayName:'Suresh Babu', fullName:'Suresh Babu', email:'suresh@demo.com', phone:'+91-9876543216', bloodGroup:'B-', gender:'Male', age:27, city:'Salem', address:'Hasthampatti, Salem, Tamil Nadu 636007', availability:true, verified:true, role:'donor', lastDonation:'2026-07-18', lat:11.6643, lng:78.1460, createdAt:'2026-07-18' },
      { uid:'u8', displayName:'Deepa Rajan', fullName:'Deepa Rajan', email:'deepa@demo.com', phone:'+91-9876543217', bloodGroup:'O+', gender:'Female', age:31, city:'Trichy', address:'Cantonment, Tiruchirappalli, TN 620001', availability:true, verified:true, role:'donor', lastDonation:'2026-04-12', lat:10.7905, lng:78.7047, createdAt:'2026-08-05' },
      { uid:'u9', displayName:'Arjun Naidu', fullName:'Arjun Naidu', email:'arjun@demo.com', phone:'+91-9876543218', bloodGroup:'A+', gender:'Male', age:40, city:'Guntur', address:'Brodipet, Guntur, AP 522002', availability:true, verified:true, role:'donor', lastDonation:'2026-01-08', lat:16.3067, lng:80.4365, createdAt:'2026-09-12' },
      { uid:'u10', displayName:'Lakshmi Priya', fullName:'Lakshmi Priya', email:'lakshmi@demo.com', phone:'+91-9876543219', bloodGroup:'AB-', gender:'Female', age:26, city:'Nellore', address:'Grand Trunk Road, Nellore, AP 524001', availability:true, verified:true, role:'donor', lastDonation:'2026-03-28', lat:14.4426, lng:79.9865, createdAt:'2026-10-20' },
      { uid:'u11', displayName:'Ravi Shankar', fullName:'Ravi Shankar', email:'ravi@demo.com', phone:'+91-9876543220', bloodGroup:'B+', gender:'Male', age:33, city:'Vellore', address:'CMC Road, Vellore, Tamil Nadu 632004', availability:true, verified:true, role:'donor', lastDonation:'2026-06-15', lat:12.9165, lng:79.1325, createdAt:'2026-11-02' },
      { uid:'u12', displayName:'Kavitha Selvi', fullName:'Kavitha Selvi', email:'kavitha@demo.com', phone:'+91-9876543221', bloodGroup:'O-', gender:'Female', age:28, city:'Puducherry', address:'MG Road, Puducherry 605001', availability:true, verified:true, role:'donor', lastDonation:'2026-02-20', lat:11.9416, lng:79.8083, createdAt:'2026-12-10' },
      { uid:'u13', displayName:'Venkatesh Rao', fullName:'Venkatesh Rao', email:'venkatesh@demo.com', phone:'+91-9876543222', bloodGroup:'A-', gender:'Male', age:38, city:'Kadapa', address:'Railway Station Road, Kadapa, AP 516001', availability:true, verified:true, role:'donor', lastDonation:'2026-04-01', lat:14.4673, lng:78.8242, createdAt:'2026-01-05' },
      { uid:'u14', displayName:'Sowmya Narayanan', fullName:'Sowmya Narayanan', email:'sowmya@demo.com', phone:'+91-9876543223', bloodGroup:'AB+', gender:'Female', age:24, city:'Erode', address:'Gandhiji Road, Erode, Tamil Nadu 638001', availability:true, verified:true, role:'donor', lastDonation:'2026-05-14', lat:11.3410, lng:77.7172, createdAt:'2026-02-14' },
      { uid:'u15', displayName:'Prasad Varma', fullName:'Prasad Varma', email:'prasad@demo.com', phone:'+91-9876543224', bloodGroup:'B-', gender:'Male', age:45, city:'Kurnool', address:'Station Road, Kurnool, AP 518001', availability:true, verified:true, role:'donor', lastDonation:'2026-03-10', lat:15.8281, lng:78.0373, createdAt:'2026-03-01' },
      { uid:'u16', displayName:'Divya Bharathi', fullName:'Divya Bharathi', email:'divya@demo.com', phone:'+91-9876543225', bloodGroup:'O+', gender:'Female', age:30, city:'Thanjavur', address:'South Main Street, Thanjavur, TN 613001', availability:true, verified:true, role:'donor', lastDonation:'2026-04-22', lat:10.7870, lng:79.1378, createdAt:'2026-03-15' },
      { uid:'u17', displayName:'Manoj Kumar', fullName:'Manoj Kumar', email:'manoj@demo.com', phone:'+91-9876543226', bloodGroup:'A+', gender:'Male', age:29, city:'Anantapur', address:'Clock Tower Area, Anantapur, AP 515001', availability:true, verified:true, role:'donor', lastDonation:'2026-06-01', lat:14.6819, lng:77.6006, createdAt:'2026-04-10' }
    ],

    // ── Dedicated Receiver Section ──
    receivers: [],

    // ── Emergency Blood Requests Section ──
    requests: [
      { id:'r1', requesterName:'Deepak Naidu', patientName:'Sunita Naidu', bloodGroupNeeded:'O+', unitsNeeded:2, hospitalName:'Apollo Hospital, Chennai', location:'Chennai', phone:'+91-9876543210', notes:'Urgent requirement for cardiac surgery', urgencyLevel:'critical', status:'active', lat:13.0067, lng:80.2206, createdAt:'2026-05-12T08:00:00', responses:3 },
      { id:'r2', requesterName:'Kavita Reddy', patientName:'Ram Reddy', bloodGroupNeeded:'A-', unitsNeeded:1, hospitalName:'SVIMS Hospital, Tirupati', location:'Tirupati', phone:'+91-9876543211', notes:'Accident emergency in ICU Ward 4', urgencyLevel:'urgent', status:'active', lat:13.6288, lng:79.4192, createdAt:'2026-05-11T14:30:00', responses:1 },
      { id:'r3', requesterName:'Suresh Iyer', patientName:'Lakshmi Iyer', bloodGroupNeeded:'B+', unitsNeeded:3, hospitalName:'CMC Hospital, Vellore', location:'Vellore', phone:'+91-9876543212', notes:'Regular transfusion requirement', urgencyLevel:'normal', status:'fulfilled', lat:12.9165, lng:79.1325, createdAt:'2026-05-10T09:15:00', responses:5 },
      { id:'r4', requesterName:'Neha Sharma', patientName:'Anjali Sharma', bloodGroupNeeded:'AB+', unitsNeeded:2, hospitalName:'JIPMER Hospital, Puducherry', location:'Puducherry', phone:'+91-9876543213', notes:'Emergency delivery blood arrangement', urgencyLevel:'critical', status:'active', lat:11.9570, lng:79.7969, createdAt:'2026-05-12T06:45:00', responses:0 }
    ],

    // ── Hospitals: Tamil Nadu & Andhra Pradesh Only (100% Verified) ──
    hospitals: [
      // ══════════════ Tamil Nadu Hospitals ══════════════
      { id:'h1',  name:'Apollo Hospitals, Greams Road', address:'No. 21, Greams Lane, Off Greams Road, Chennai, Tamil Nadu 600006', contact:'+91-44-28293333', bloodAvailability:{ 'O+':22, 'A+':15, 'B+':18, 'AB+':6, 'O-':8, 'A-':4, 'B-':5, 'AB-':3 }, lat:13.0614, lng:80.2544 },
      { id:'h2',  name:'JIPMER Super Speciality Hospital', address:'Dhanvantri Nagar, Gorimedu, Puducherry 605006', contact:'+91-413-2272380', bloodAvailability:{ 'O+':28, 'A+':18, 'B+':20, 'AB+':7, 'O-':10, 'A-':6, 'B-':5, 'AB-':3 }, lat:11.9570, lng:79.7969 },
      { id:'h3',  name:'Christian Medical College (CMC)', address:'Ida Scudder Road, Vellore, Tamil Nadu 632004', contact:'+91-416-2281000', bloodAvailability:{ 'O+':30, 'A+':22, 'B+':16, 'AB+':9, 'O-':12, 'A-':7, 'B-':6, 'AB-':4 }, lat:12.9237, lng:79.1350 },
      { id:'h4',  name:'Madurai Meenakshi Mission Hospital', address:'Lake Area, Melur Road, Madurai, Tamil Nadu 625107', contact:'+91-452-4350000', bloodAvailability:{ 'O+':18, 'A+':11, 'B+':14, 'AB+':5, 'O-':6, 'A-':4, 'B-':4, 'AB-':2 }, lat:9.9468, lng:78.1565 },
      { id:'h5',  name:'Rajiv Gandhi Govt General Hospital (GGH)', address:'Park Town, Chennai, Tamil Nadu 600003', contact:'+91-44-25305000', bloodAvailability:{ 'O+':40, 'A+':25, 'B+':24, 'AB+':10, 'O-':15, 'A-':8, 'B-':7, 'AB-':4 }, lat:13.0785, lng:80.2747 },
      { id:'h6',  name:'PSG Hospitals, Coimbatore', address:'Peelamedu, Coimbatore, Tamil Nadu 641004', contact:'+91-422-2570170', bloodAvailability:{ 'O+':19, 'A+':12, 'B+':15, 'AB+':5, 'O-':7, 'A-':3, 'B-':4, 'AB-':2 }, lat:11.0245, lng:77.0028 },
      { id:'h7',  name:'SRM Medical College Hospital & Research Centre', address:'SRM Nagar, Potheri, Kattankulathur, Tamil Nadu 603203', contact:'+91-44-27455510', bloodAvailability:{ 'O+':20, 'A+':14, 'B+':15, 'AB+':6, 'O-':8, 'A-':4, 'B-':5, 'AB-':2 }, lat:12.8231, lng:80.0442 },
      { id:'h8',  name:'KMCH (Kovai Medical Center & Hospital)', address:'99, Avinashi Road, Coimbatore, Tamil Nadu 641014', contact:'+91-422-4323800', bloodAvailability:{ 'O+':16, 'A+':10, 'B+':12, 'AB+':4, 'O-':5, 'A-':3, 'B-':4, 'AB-':2 }, lat:11.0283, lng:76.9647 },
      { id:'h9',  name:'Sri Ramachandra Medical Centre', address:'No. 1 Ramachandra Nagar, Porur, Chennai, Tamil Nadu 600116', contact:'+91-44-24768027', bloodAvailability:{ 'O+':24, 'A+':16, 'B+':17, 'AB+':7, 'O-':9, 'A-':5, 'B-':5, 'AB-':3 }, lat:13.0346, lng:80.1417 },
      { id:'h10', name:'Government Stanley Medical College Hospital', address:'Old Jail Road, Royapuram, Chennai, Tamil Nadu 600001', contact:'+91-44-25281066', bloodAvailability:{ 'O+':26, 'A+':18, 'B+':15, 'AB+':7, 'O-':9, 'A-':5, 'B-':4, 'AB-':3 }, lat:13.1145, lng:80.2879 },
      { id:'h11', name:'Government Rajaji Hospital, Madurai', address:'Panagal Road, Shenoy Nagar, Madurai, Tamil Nadu 625020', contact:'+91-452-2532535', bloodAvailability:{ 'O+':22, 'A+':14, 'B+':16, 'AB+':6, 'O-':8, 'A-':4, 'B-':5, 'AB-':2 }, lat:9.9252, lng:78.1198 },
      { id:'h12', name:'Kauvery Hospital, Trichy', address:'No. 1, K.C. Road, Tennur, Tiruchirappalli, Tamil Nadu 620017', contact:'+91-431-4077777', bloodAvailability:{ 'O+':18, 'A+':12, 'B+':13, 'AB+':5, 'O-':6, 'A-':3, 'B-':4, 'AB-':2 }, lat:10.8158, lng:78.6854 },

      // ══════════════ Andhra Pradesh Hospitals ══════════════
      { id:'h13', name:'SVIMS Multi-Speciality Hospital, Tirupati', address:'Alipiri Road, Tirupati, Andhra Pradesh 517507', contact:'+91-877-2287777', bloodAvailability:{ 'O+':26, 'A+':18, 'B+':16, 'AB+':8, 'O-':10, 'A-':5, 'B-':6, 'AB-':3 }, lat:13.6450, lng:79.4100 },
      { id:'h14', name:'NRI General Hospital, Guntur', address:'Chinakakani, Mangalagiri, Guntur, Andhra Pradesh 522503', contact:'+91-863-2878999', bloodAvailability:{ 'O+':20, 'A+':14, 'B+':15, 'AB+':6, 'O-':7, 'A-':4, 'B-':4, 'AB-':2 }, lat:16.4307, lng:80.5525 },
      { id:'h15', name:'Apollo Hospitals, Visakhapatnam', address:'Waltair Main Road, Visakhapatnam, Andhra Pradesh 530002', contact:'+91-891-2727272', bloodAvailability:{ 'O+':22, 'A+':15, 'B+':17, 'AB+':7, 'O-':8, 'A-':5, 'B-':5, 'AB-':3 }, lat:17.7231, lng:83.3013 },
      { id:'h16', name:'Andhra Hospitals, Vijayawada', address:'Governorpet, Vijayawada, Andhra Pradesh 520002', contact:'+91-866-2577788', bloodAvailability:{ 'O+':20, 'A+':13, 'B+':16, 'AB+':5, 'O-':7, 'A-':4, 'B-':5, 'AB-':2 }, lat:16.5087, lng:80.6326 },
      { id:'h17', name:'KIMS Multi Speciality Hospital, Nellore', address:'Narasaraopet Road, Nellore, Andhra Pradesh 524004', contact:'+91-861-2322288', bloodAvailability:{ 'O+':16, 'A+':10, 'B+':12, 'AB+':4, 'O-':5, 'A-':3, 'B-':4, 'AB-':2 }, lat:14.4373, lng:79.9690 },
      { id:'h18', name:'Narayana Medical College & Super Speciality Hospital', address:'Chinthareddypalem, Nellore, Andhra Pradesh 524003', contact:'+91-861-2317962', bloodAvailability:{ 'O+':18, 'A+':12, 'B+':14, 'AB+':5, 'O-':6, 'A-':4, 'B-':4, 'AB-':2 }, lat:14.4197, lng:79.9748 },
      { id:'h19', name:'King George Hospital (KGH), Visakhapatnam', address:'Maharanipeta, Visakhapatnam, Andhra Pradesh 530002', contact:'+91-891-2564891', bloodAvailability:{ 'O+':30, 'A+':20, 'B+':18, 'AB+':8, 'O-':12, 'A-':6, 'B-':7, 'AB-':3 }, lat:17.7146, lng:83.3037 },
      { id:'h20', name:'Government General Hospital, Kurnool', address:'Budhawarpet, Kurnool, Andhra Pradesh 518001', contact:'+91-8518-224242', bloodAvailability:{ 'O+':24, 'A+':16, 'B+':14, 'AB+':6, 'O-':8, 'A-':4, 'B-':5, 'AB-':2 }, lat:15.8267, lng:78.0400 },
      { id:'h21', name:'RIMS Super Speciality Hospital, Kadapa', address:'Putlampalli, Kadapa, Andhra Pradesh 516004', contact:'+91-8562-252275', bloodAvailability:{ 'O+':18, 'A+':11, 'B+':13, 'AB+':4, 'O-':6, 'A-':3, 'B-':4, 'AB-':2 }, lat:14.4750, lng:78.8300 },
      { id:'h22', name:'Government General Hospital, Vijayawada', address:'Gunadala, Vijayawada, Andhra Pradesh 520004', contact:'+91-866-2420385', bloodAvailability:{ 'O+':28, 'A+':18, 'B+':16, 'AB+':7, 'O-':10, 'A-':5, 'B-':5, 'AB-':3 }, lat:16.5150, lng:80.6237 },
      { id:'h23', name:'Area Government Hospital, Rly Kodur', address:'Hospital Road, Railway Kodur, Annamayya District, AP 516101', contact:'+91-8566-244222', bloodAvailability:{ 'O+':14, 'A+':8, 'B+':10, 'AB+':3, 'O-':5, 'A-':2, 'B-':3, 'AB-':1 }, lat:14.0042, lng:79.3512 },
      { id:'h24', name:'Government General Hospital, Anantapur', address:'Court Road, Anantapur, Andhra Pradesh 515001', contact:'+91-8554-274242', bloodAvailability:{ 'O+':20, 'A+':12, 'B+':14, 'AB+':5, 'O-':7, 'A-':3, 'B-':4, 'AB-':2 }, lat:14.6819, lng:77.6006 }
    ],

    // ── Blood Banks: Tamil Nadu & Andhra Pradesh Only (100% Verified) ──
    bloodBanks: [
      // ══════════════ Tamil Nadu Blood Banks ══════════════
      { id:'bb1',  name:'Tamil Nadu State Blood Transfusion Bank', address:'Kilpauk, Chennai, Tamil Nadu 600010', contact:'+91-44-26432804', lat:13.0843, lng:80.2399, stocks:{ 'O+':55, 'A+':38, 'B+':44, 'AB+':15, 'O-':20, 'A-':12, 'B-':14, 'AB-':6 }},
      { id:'bb2',  name:'Indian Red Cross Society Blood Bank, Chennai', address:'179, Anna Salai, Chennai, Tamil Nadu 600002', contact:'+91-44-28520068', lat:13.0580, lng:80.2579, stocks:{ 'O+':46, 'A+':30, 'B+':35, 'AB+':12, 'O-':16, 'A-':9, 'B-':11, 'AB-':5 }},
      { id:'bb3',  name:'Lions Blood Bank & Research Foundation, Madurai', address:'Bibi Kulam Road, Madurai, Tamil Nadu 625002', contact:'+91-452-2337344', lat:9.9276, lng:78.1176, stocks:{ 'O+':35, 'A+':24, 'B+':28, 'AB+':10, 'O-':12, 'A-':6, 'B-':8, 'AB-':4 }},
      { id:'bb4',  name:'Rotary Central Blood Bank, Coimbatore', address:'DB Road, RS Puram, Coimbatore, Tamil Nadu 641002', contact:'+91-422-2543444', lat:11.0090, lng:76.9547, stocks:{ 'O+':40, 'A+':26, 'B+':32, 'AB+':11, 'O-':14, 'A-':8, 'B-':10, 'AB-':4 }},
      { id:'bb5',  name:'Government Rajaji Hospital (GRH) Blood Bank, Trichy', address:'Thanjavur Road, Tiruchirappalli, Tamil Nadu 620001', contact:'+91-431-2407576', lat:10.8003, lng:78.6939, stocks:{ 'O+':32, 'A+':20, 'B+':25, 'AB+':8, 'O-':10, 'A-':6, 'B-':7, 'AB-':3 }},
      { id:'bb6',  name:'Tirunelveli Medical College Blood Bank', address:'High Ground, Tirunelveli, Tamil Nadu 627011', contact:'+91-462-2572726', lat:8.7284, lng:77.7131, stocks:{ 'O+':28, 'A+':18, 'B+':22, 'AB+':7, 'O-':9, 'A-':5, 'B-':6, 'AB-':3 }},
      { id:'bb7',  name:'Salem Mohan Kumaramangalam Blood Bank', address:'Shanmuga Nagar, Salem, Tamil Nadu 636007', contact:'+91-427-2313333', lat:11.6596, lng:78.1542, stocks:{ 'O+':25, 'A+':16, 'B+':20, 'AB+':6, 'O-':8, 'A-':4, 'B-':5, 'AB-':2 }},
      { id:'bb8',  name:'Thanjavur Medical College Blood Centre', address:'Medical College Road, Thanjavur, Tamil Nadu 613004', contact:'+91-4362-231091', lat:10.7768, lng:79.1318, stocks:{ 'O+':24, 'A+':15, 'B+':18, 'AB+':6, 'O-':7, 'A-':4, 'B-':5, 'AB-':2 }},
      { id:'bb9',  name:'Puducherry Government General Blood Bank', address:'Victor Simonel Street, White Town, Puducherry 605001', contact:'+91-413-2336050', lat:11.9338, lng:79.8336, stocks:{ 'O+':30, 'A+':19, 'B+':22, 'AB+':8, 'O-':10, 'A-':5, 'B-':6, 'AB-':3 }},

      // ══════════════ Andhra Pradesh Blood Banks ══════════════
      { id:'bb10', name:'Indian Red Cross Society Blood Bank, Vijayawada', address:'Eluru Road, Governorpet, Vijayawada, AP 520001', contact:'+91-866-2573456', lat:16.5101, lng:80.6320, stocks:{ 'O+':48, 'A+':30, 'B+':36, 'AB+':12, 'O-':16, 'A-':9, 'B-':11, 'AB-':5 }},
      { id:'bb11', name:'Government District Blood Bank, Tirupati', address:'Alipiri Road, Near SVIMS, Tirupati, AP 517507', contact:'+91-877-2264567', lat:13.6350, lng:79.4200, stocks:{ 'O+':42, 'A+':26, 'B+':30, 'AB+':10, 'O-':14, 'A-':7, 'B-':9, 'AB-':4 }},
      { id:'bb12', name:'King George Hospital (KGH) Blood Centre, Visakhapatnam', address:'Maharanipeta, Visakhapatnam, Andhra Pradesh 530002', contact:'+91-891-2564900', lat:17.7146, lng:83.3037, stocks:{ 'O+':50, 'A+':34, 'B+':40, 'AB+':14, 'O-':18, 'A-':10, 'B-':12, 'AB-':5 }},
      { id:'bb13', name:'NRI Super Speciality Blood Bank, Guntur', address:'Chinakakani, Mangalagiri, Guntur, AP 522503', contact:'+91-863-2878990', lat:16.4307, lng:80.5525, stocks:{ 'O+':32, 'A+':20, 'B+':25, 'AB+':8, 'O-':10, 'A-':6, 'B-':7, 'AB-':3 }},
      { id:'bb14', name:'Government General Blood Bank, Nellore', address:'Grand Trunk Road, Nellore, Andhra Pradesh 524001', contact:'+91-861-2314567', lat:14.4426, lng:79.9865, stocks:{ 'O+':26, 'A+':16, 'B+':20, 'AB+':6, 'O-':8, 'A-':4, 'B-':5, 'AB-':2 }},
      { id:'bb15', name:'RIMS Regional Blood Bank, Kadapa', address:'Putlampalli, Kadapa, Andhra Pradesh 516004', contact:'+91-8562-252280', lat:14.4750, lng:78.8300, stocks:{ 'O+':22, 'A+':14, 'B+':16, 'AB+':5, 'O-':7, 'A-':3, 'B-':4, 'AB-':2 }},
      { id:'bb16', name:'Kurnool Government Medical College Blood Bank', address:'Budhawarpet, Kurnool, Andhra Pradesh 518001', contact:'+91-8518-224250', lat:15.8267, lng:78.0400, stocks:{ 'O+':25, 'A+':15, 'B+':18, 'AB+':6, 'O-':8, 'A-':4, 'B-':5, 'AB-':2 }},
      { id:'bb17', name:'Red Cross Blood Bank, Rajahmundry', address:'Danavaipeta, Rajahmundry, East Godavari, AP 533103', contact:'+91-883-2471234', lat:17.0005, lng:81.8040, stocks:{ 'O+':28, 'A+':18, 'B+':22, 'AB+':7, 'O-':9, 'A-':5, 'B-':6, 'AB-':2 }},
      { id:'bb18', name:'Anantapur District Central Blood Bank', address:'Government Hospital Campus, Anantapur, AP 515001', contact:'+91-8554-274100', lat:14.6819, lng:77.6006, stocks:{ 'O+':24, 'A+':15, 'B+':17, 'AB+':5, 'O-':7, 'A-':3, 'B-':4, 'AB-':2 }}
    ],

    donations: [
      { id:'d1', donorId:'u1', donorName:'Karthik Iyer', bloodGroup:'O+', date:'2026-07-15', hospital:'Apollo Hospitals, Greams Road, Chennai', remarks:'Routine donation' },
      { id:'d2', donorId:'u2', donorName:'Priya Lakshmi', bloodGroup:'A+', date:'2026-06-20', hospital:'PSG Hospitals, Coimbatore', remarks:'Emergency donation' },
      { id:'d3', donorId:'u3', donorName:'Vikram Reddy', bloodGroup:'B+', date:'2026-05-10', hospital:'Apollo Hospitals, Visakhapatnam', remarks:'Scheduled donation' }
    ],

    notifications: [
      { id:'n1', userId:'sameer_donor', message:'Emergency: O+ blood needed at Apollo Hospitals, Chennai', type:'emergency', read:false, createdAt:'2026-05-12T08:00:00' },
      { id:'n2', userId:'u1', message:'Emergency: O+ blood needed at Apollo Hospitals, Greams Road', type:'emergency', read:false, createdAt:'2026-05-12T08:00:00' },
      { id:'n3', userId:'u2', message:'Your blood donation is due. Last donation was 3 months ago.', type:'reminder', read:false, createdAt:'2026-05-11T09:00:00' },
      { id:'n4', userId:'u1', message:'Thank you for responding to the blood request!', type:'success', read:true, createdAt:'2026-05-10T15:30:00' }
    ]
  },

  // ────────────────────────────────────────────────────────────
  // Credential Stores: Separate Admin, Donor & Receiver Password Stores
  // ────────────────────────────────────────────────────────────
  getAdminPasswords() {
    return { ...DEFAULT_ADMIN_PASSWORDS };
  },

  saveAdminPassword(email, password, uid) {
    // No-op: Admin credentials are hardcoded and cannot be changed
  },

  getDonorPasswords() {
    const stored = localStorage.getItem('lifelink_donor_passwords');
    let map = { ...DEFAULT_DONOR_PASSWORDS };
    if (stored) {
      try { map = { ...map, ...JSON.parse(stored) }; } catch (e) {}
    }
    return map;
  },

  saveDonorPassword(email, password, uid) {
    if (!email) return;
    const map = this.getDonorPasswords();
    map[email.trim().toLowerCase()] = { password, uid };
    localStorage.setItem('lifelink_donor_passwords', JSON.stringify(map));
  },

  getReceiverPasswords() {
    const stored = localStorage.getItem('lifelink_receiver_passwords');
    let map = { ...DEFAULT_RECEIVER_PASSWORDS };
    if (stored) {
      try { map = { ...map, ...JSON.parse(stored) }; } catch (e) {}
    }
    return map;
  },

  saveReceiverPassword(email, password, uid) {
    if (!email) return;
    const map = this.getReceiverPasswords();
    map[email.trim().toLowerCase()] = { password, uid };
    localStorage.setItem('lifelink_receiver_passwords', JSON.stringify(map));
  },

  // Get local cache data (auto-resets if version mismatch)
  getData() {
    const DATA_VERSION = 'v10_tamilnadu_andhrapradesh_exclusive'; // strictly TN and AP
    const storedVer = localStorage.getItem(this._key + '_ver');
    if (storedVer !== DATA_VERSION) {
      localStorage.removeItem(this._key);
      localStorage.setItem(this._key + '_ver', DATA_VERSION);
    }
    const stored = localStorage.getItem(this._key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.hospitals = JSON.parse(JSON.stringify(this._defaults.hospitals));
        parsed.bloodBanks = JSON.parse(JSON.stringify(this._defaults.bloodBanks));
        if (!parsed.admins) parsed.admins = JSON.parse(JSON.stringify(this._defaults.admins));
        if (!parsed.donors) parsed.donors = JSON.parse(JSON.stringify(this._defaults.donors));
        if (!parsed.receivers) parsed.receivers = [];
        if (!parsed.requests) parsed.requests = JSON.parse(JSON.stringify(this._defaults.requests));
        return parsed;
      } catch(e) {
        localStorage.removeItem(this._key);
      }
    }
    localStorage.setItem(this._key, JSON.stringify(this._defaults));
    return JSON.parse(JSON.stringify(this._defaults));
  },

  saveData(data) {
    localStorage.setItem(this._key, JSON.stringify(data));
  },

  // Force-reset to latest defaults
  resetData() {
    localStorage.removeItem(this._key);
    return this.getData();
  },

  // ────────────────────────────────────────────────────────────
  // Haversine Distance Calculation (km)
  // ────────────────────────────────────────────────────────────
  getDistanceBetween(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // 1 decimal place
  },

  // ────────────────────────────────────────────────────────────
  // Distinct Section Readers: Donors, Admins & Receivers
  // ────────────────────────────────────────────────────────────
  async getDonors() {
    if (typeof LifeLinkAPI !== 'undefined' && LifeLinkAPI.connected !== false) {
      try {
        const apiDonors = await LifeLinkAPI.getDonors();
        if (apiDonors.length) return apiDonors;
      } catch (e) {
        console.warn('API getDonors fallback:', e.message);
      }
    }
    if (typeof db !== 'undefined' && db) {
      try {
        const snap = await db.collection('donors').get();
        if (!snap.empty) {
          const fsDonors = snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
          const localDonors = this.getData().donors || [];
          const donorMap = new Map();
          fsDonors.forEach(d => donorMap.set(d.uid || d.email, d));
          localDonors.forEach(d => {
            const key = d.uid || d.email;
            if (!donorMap.has(key)) donorMap.set(key, d);
          });
          return Array.from(donorMap.values());
        }
      } catch (e) {
        console.warn('Firestore getDonors fallback:', e.message);
      }
    }
    return this.getData().donors || [];
  },

  async getAdmins() {
    // Admin is hardcoded — always return from defaults
    return this.getData().admins || [];
  },

  async getReceivers() {
    if (typeof db !== 'undefined' && db) {
      try {
        const snap = await db.collection('receivers').get();
        if (!snap.empty) {
          return snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        }
      } catch (e) {
        console.warn('Firestore getReceivers fallback:', e.message);
      }
    }
    return this.getData().receivers || [];
  },

  // Combined users view for global queries
  async getUsers() {
    const [donors, admins, receivers] = await Promise.all([this.getDonors(), this.getAdmins(), this.getReceivers()]);
    return [...donors, ...admins, ...receivers];
  },

  // ────────────────────────────────────────────────────────────
  // Emergency Blood Requests Access
  // ────────────────────────────────────────────────────────────
  async getRequests() { 
    if (typeof LifeLinkAPI !== 'undefined') {
      try {
        const apiReqs = await LifeLinkAPI.getEmergencyRequests();
        if (apiReqs.length) return apiReqs;
      } catch (e) {
        console.warn('API getRequests fallback:', e.message);
      }
    }
    if (typeof db !== 'undefined' && db) {
      try {
        const snap = await db.collection('requests').get();
        if (!snap.empty) {
          const firestoreReqs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const localReqs = this.getData().requests || [];
          const reqMap = new Map();
          firestoreReqs.forEach(r => reqMap.set(r.id, r));
          localReqs.forEach(r => { if (!reqMap.has(r.id)) reqMap.set(r.id, r); });
          return Array.from(reqMap.values()).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }
      } catch (e) {
        console.warn('Firestore getRequests fallback:', e.message);
      }
    }
    const local = this.getData().requests || [];
    return local.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  },

  async getHospitals() { 
    if (typeof db !== 'undefined' && db) {
      try {
        const snap = await db.collection('hospitals').get();
        if (!snap.empty) {
          return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
      } catch (e) {
        console.warn('Firestore getHospitals fallback:', e.message);
      }
    }
    return this.getData().hospitals;
  },

  async getBloodBanks() { 
    if (typeof db !== 'undefined' && db) {
      try {
        const snap = await db.collection('bloodBanks').get();
        if (!snap.empty) {
          return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
      } catch (e) {
        console.warn('Firestore getBloodBanks fallback:', e.message);
      }
    }
    return this.getData().bloodBanks;
  },

  async getDonations() { 
    const isLive = typeof DEMO_MODE !== 'undefined' ? !DEMO_MODE : false;
    if (!isLive || typeof db === 'undefined' || !db) return this.getData().donations || [];
    try {
      const snap = await db.collection('donations').get();
      if (snap.empty) return this.getData().donations || [];
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      return this.getData().donations || [];
    }
  },

  async getNotifications(userId) {
    const list = this.getData().notifications || [];
    const isLive = typeof DEMO_MODE !== 'undefined' ? !DEMO_MODE : false;
    if (!isLive || typeof db === 'undefined' || !db) return list.filter(n => !userId || n.userId === userId || !n.userId);
    try {
      let q = db.collection('notifications');
      if (userId) q = q.where('userId', '==', userId);
      const snap = await q.get();
      if (snap.empty) return list.filter(n => !userId || n.userId === userId || !n.userId);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      return list.filter(n => !userId || n.userId === userId || !n.userId);
    }
  },

  // Predefined City Coordinates: Tamil Nadu & Andhra Pradesh
  _cityCoords: {
    // Andhra Pradesh
    'rly kodur': { lat: 14.0042, lng: 79.3512 },
    'railway kodur': { lat: 14.0042, lng: 79.3512 },
    'kodur': { lat: 14.0042, lng: 79.3512 },
    'kadapa': { lat: 14.4673, lng: 78.8242 },
    'cuddapah': { lat: 14.4673, lng: 78.8242 },
    'tirupati': { lat: 13.6288, lng: 79.4192 },
    'vijayawada': { lat: 16.5062, lng: 80.6480 },
    'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'vizag': { lat: 17.6868, lng: 83.2185 },
    'guntur': { lat: 16.3067, lng: 80.4365 },
    'nellore': { lat: 14.4426, lng: 79.9865 },
    'kurnool': { lat: 15.8281, lng: 78.0373 },
    'anantapur': { lat: 14.6819, lng: 77.6006 },
    'rajahmundry': { lat: 17.0005, lng: 81.8040 },
    'kakinada': { lat: 16.9891, lng: 82.2475 },
    'eluru': { lat: 16.7107, lng: 81.0952 },
    'ongole': { lat: 15.5057, lng: 80.0499 },
    'chittoor': { lat: 13.2172, lng: 79.1003 },
    'srikakulam': { lat: 18.2949, lng: 83.8938 },
    'machilipatnam': { lat: 16.1875, lng: 81.1389 },
    'tenali': { lat: 16.2428, lng: 80.6400 },
    'proddatur': { lat: 14.7502, lng: 78.5481 },
    'adoni': { lat: 15.6265, lng: 77.2747 },
    'amaravati': { lat: 16.5131, lng: 80.5150 },
    // Tamil Nadu
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'madras': { lat: 13.0827, lng: 80.2707 },
    'coimbatore': { lat: 11.0168, lng: 76.9558 },
    'madurai': { lat: 9.9252, lng: 78.1198 },
    'tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
    'trichy': { lat: 10.7905, lng: 78.7047 },
    'salem': { lat: 11.6643, lng: 78.1460 },
    'tirunelveli': { lat: 8.7284, lng: 77.7131 },
    'erode': { lat: 11.3410, lng: 77.7172 },
    'vellore': { lat: 12.9165, lng: 79.1325 },
    'thanjavur': { lat: 10.7870, lng: 79.1378 },
    'tanjore': { lat: 10.7870, lng: 79.1378 },
    'dindigul': { lat: 10.3624, lng: 77.9695 },
    'thoothukudi': { lat: 8.7642, lng: 78.1348 },
    'tuticorin': { lat: 8.7642, lng: 78.1348 },
    'nagercoil': { lat: 8.1833, lng: 77.4119 },
    'kanchipuram': { lat: 12.8342, lng: 79.7036 },
    'kumbakonam': { lat: 10.9602, lng: 79.3845 },
    'karur': { lat: 10.9601, lng: 78.0766 },
    'sivakasi': { lat: 9.4533, lng: 77.7967 },
    'namakkal': { lat: 11.2189, lng: 78.1674 },
    'puducherry': { lat: 11.9416, lng: 79.8083 },
    'pondicherry': { lat: 11.9416, lng: 79.8083 },
    'hosur': { lat: 12.7409, lng: 77.8253 },
    'tirupur': { lat: 11.1085, lng: 77.3411 },
    'cuddalore': { lat: 11.7447, lng: 79.7689 },
    'ramanathapuram': { lat: 9.3639, lng: 78.8395 },
    'krishnagiri': { lat: 12.5186, lng: 78.2137 },
    'villupuram': { lat: 11.9401, lng: 79.4861 }
  },

  getCoordsForCity(cityName) {
    if (!cityName) return { lat: 13.0827, lng: 80.2707 }; // Default: Chennai
    const clean = cityName.trim().toLowerCase();
    for (const [key, coords] of Object.entries(this._cityCoords)) {
      if (clean.includes(key) || key.includes(clean)) {
        return coords;
      }
    }
    // Fallback: generate coords in TN/AP region
    let hash = 0;
    for (let i = 0; i < clean.length; i++) hash = clean.charCodeAt(i) + ((hash << 5) - hash);
    const lat = 9.0 + Math.abs(hash % 1000) / 100; // 9.0 – 19.0 range
    const lng = 77.0 + Math.abs((hash >> 3) % 700) / 100; // 77.0 – 84.0 range
    return { lat, lng };
  },

  // ────────────────────────────────────────────────────────────
  // Section-Specific Insertions & Updates
  // ────────────────────────────────────────────────────────────
  async addDonor(donor) {
    if (donor.lat == null || donor.lng == null) {
      const coords = this.getCoordsForCity(donor.city || donor.address);
      donor.lat = coords.lat;
      donor.lng = coords.lng;
    }
    if (!donor.address && donor.city) {
      donor.address = `${donor.city}, India`;
    }
    donor.role = 'donor';

    const data = this.getData();
    if (!data.donors) data.donors = [];
    const idx = data.donors.findIndex(d => d.uid === donor.uid || (d.email && donor.email && d.email.toLowerCase() === donor.email.toLowerCase()));
    if (idx > -1) {
      data.donors[idx] = { ...data.donors[idx], ...donor };
    } else {
      data.donors.unshift(donor);
    }
    this.saveData(data);

    // Save credentials if password provided
    if (donor.password) {
      this.saveDonorPassword(donor.email, donor.password, donor.uid);
    }

    if (typeof db !== 'undefined' && db) {
      try {
        await db.collection('donors').doc(donor.uid).set(donor, { merge: true });
        await db.collection('users').doc(donor.uid).set(donor, { merge: true });
        console.log('🔥 Donor saved to database section: donors /', donor.uid);
      } catch (e) {
        console.warn('Firestore addDonor notice:', e.message);
      }
    }
    return donor;
  },

  async addReceiver(receiver) {
    if (receiver.lat == null || receiver.lng == null) {
      const coords = this.getCoordsForCity(receiver.city || receiver.address);
      receiver.lat = coords.lat;
      receiver.lng = coords.lng;
    }
    if (!receiver.address && receiver.city) {
      receiver.address = `${receiver.city}, India`;
    }
    receiver.role = 'receiver';

    const data = this.getData();
    if (!data.receivers) data.receivers = [];
    const idx = data.receivers.findIndex(r => r.uid === receiver.uid || (r.email && receiver.email && r.email.toLowerCase() === receiver.email.toLowerCase()));
    if (idx > -1) {
      data.receivers[idx] = { ...data.receivers[idx], ...receiver };
    } else {
      data.receivers.unshift(receiver);
    }
    this.saveData(data);

    if (receiver.password) {
      this.saveReceiverPassword(receiver.email, receiver.password, receiver.uid);
    }

    if (typeof db !== 'undefined' && db) {
      try {
        await db.collection('receivers').doc(receiver.uid).set(receiver, { merge: true });
        await db.collection('users').doc(receiver.uid).set(receiver, { merge: true });
        console.log('🔥 Receiver saved to database section: receivers /', receiver.uid);
      } catch (e) {
        console.warn('Firestore addReceiver notice:', e.message);
      }
    }
    return receiver;
  },

  async addAdmin(admin) {
    // Admin cannot be added dynamically — hardcoded only
    console.warn('[DemoData] Admin accounts are hardcoded and cannot be created dynamically.');
    return null;
  },

  // General addUser router
  async addUser(user) {
    if (user.role === 'receiver') {
      return this.addReceiver(user);
    }
    return this.addDonor(user);
  },

  // ────────────────────────────────────────────────────────────
  // Emergency Request Creation & Management
  // ────────────────────────────────────────────────────────────
  async addRequest(req) {
    if (req.lat == null || req.lng == null) {
      const coords = this.getCoordsForCity(req.location || req.hospitalName);
      req.lat = coords.lat;
      req.lng = coords.lng;
    }

    const newReq = {
      ...req,
      id: req.id || 'req_' + Date.now(),
      status: req.status || 'active',
      responses: req.responses || 0,
      unitsNeeded: parseInt(req.unitsNeeded) || 1,
      createdAt: req.createdAt || new Date().toISOString()
    };

    // Update local cache
    const data = this.getData();
    if (!data.requests) data.requests = [];
    data.requests.unshift(newReq);

    // Create system notification for all donors
    if (!data.notifications) data.notifications = [];
    data.notifications.unshift({
      id: 'n_' + Date.now(),
      message: `🚨 Emergency: ${newReq.bloodGroupNeeded} blood urgently needed at ${newReq.hospitalName} (${newReq.location})`,
      type: 'emergency',
      read: false,
      requestId: newReq.id,
      createdAt: newReq.createdAt
    });

    this.saveData(data);

    // Save to SQLite database via API
    if (typeof LifeLinkAPI !== 'undefined' && LifeLinkAPI.getToken()) {
      try {
        const result = await LifeLinkAPI.createEmergencyRequest({
          patientName: newReq.patientName,
          bloodGroupNeeded: newReq.bloodGroupNeeded,
          unitsNeeded: newReq.unitsNeeded,
          hospitalName: newReq.hospitalName,
          location: newReq.location,
          requesterName: newReq.requesterName,
          phone: newReq.phone,
          notes: newReq.notes,
          urgencyLevel: newReq.urgencyLevel,
          lat: newReq.lat,
          lng: newReq.lng
        });
        if (result.request) {
          console.log('💾 Emergency request saved to SQLite database:', result.request.id);
          return result.request;
        }
      } catch (e) {
        console.warn('API addRequest fallback:', e.message);
      }
    }

    // Live Firebase Firestore sync
    if (typeof db !== 'undefined' && db) {
      try {
        await db.collection('requests').doc(newReq.id).set(newReq);
        console.log('🔥 Emergency request synced to Live Firestore: requests /', newReq.id);
      } catch (e) {
        console.warn('Firestore addRequest notice:', e.message);
      }
    }
    return newReq;
  },

  async updateUser(uid, updates) {
    const data = this.getData();
    let updated = false;

    // Check donors section
    if (data.donors) {
      const dIdx = data.donors.findIndex(u => u.uid === uid);
      if (dIdx > -1) {
        data.donors[dIdx] = { ...data.donors[dIdx], ...updates };
        updated = true;
      }
    }
    // Check receivers section
    if (data.receivers) {
      const rIdx = data.receivers.findIndex(u => u.uid === uid);
      if (rIdx > -1) {
        data.receivers[rIdx] = { ...data.receivers[rIdx], ...updates };
        updated = true;
      }
    }
    // Check admins section
    if (data.admins) {
      const aIdx = data.admins.findIndex(u => u.uid === uid);
      if (aIdx > -1) {
        data.admins[aIdx] = { ...data.admins[aIdx], ...updates };
        updated = true;
      }
    }

    if (updated) {
      this.saveData(data);
    }

    const isLive = typeof DEMO_MODE !== 'undefined' ? !DEMO_MODE : false;
    if (isLive && typeof db !== 'undefined' && db) {
      try {
        await db.collection('users').doc(uid).update(updates);
        await db.collection('donors').doc(uid).update(updates).catch(() => {});
        await db.collection('receivers').doc(uid).update(updates).catch(() => {});
        await db.collection('admins').doc(uid).update(updates).catch(() => {});
      } catch (e) {
        console.warn('Firestore updateUser fallback:', e.message);
      }
    }
  },

  async updateRequest(id, updates) {
    const data = this.getData();
    if (data.requests) {
      const idx = data.requests.findIndex(r => r.id === id);
      if (idx > -1) {
        data.requests[idx] = { ...data.requests[idx], ...updates };
        this.saveData(data);
      }
    }

    const isLive = typeof DEMO_MODE !== 'undefined' ? !DEMO_MODE : false;
    if (isLive && typeof db !== 'undefined' && db) {
      try {
        await db.collection('requests').doc(id).update(updates);
      } catch (e) {
        console.warn('Firestore updateRequest fallback:', e.message);
      }
    }
  },

  async deleteRequest(id) {
    const data = this.getData();
    if (data.requests) {
      data.requests = data.requests.filter(r => r.id !== id);
      this.saveData(data);
    }

    const isLive = typeof DEMO_MODE !== 'undefined' ? !DEMO_MODE : false;
    if (isLive && typeof db !== 'undefined' && db) {
      try {
        await db.collection('requests').doc(id).delete();
      } catch (e) {
        console.warn('Firestore deleteRequest fallback:', e.message);
      }
    }
  },

  async addDonation(donation) {
    const data = this.getData();
    if (!data.donations) data.donations = [];
    const newDonation = {
      id: donation.id || 'd_' + Date.now(),
      date: donation.date || new Date().toISOString().split('T')[0],
      ...donation
    };
    data.donations.unshift(newDonation);
    this.saveData(data);
    return newDonation;
  },

  async addNotification(notif) {
    const data = this.getData();
    if (!data.notifications) data.notifications = [];
    const newNotif = {
      id: notif.id || 'n_' + Date.now(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notif
    };
    data.notifications.unshift(newNotif);
    this.saveData(data);
    return newNotif;
  },

  async deleteUser(uid) {
    const data = this.getData();
    if (data.donors) data.donors = data.donors.filter(u => u.uid !== uid);
    if (data.receivers) data.receivers = data.receivers.filter(u => u.uid !== uid);
    // Admins cannot be deleted
    this.saveData(data);

    const isLive = typeof DEMO_MODE !== 'undefined' ? !DEMO_MODE : false;
    if (isLive && typeof db !== 'undefined' && db) {
      try {
        await db.collection('donors').doc(uid).delete().catch(() => {});
        await db.collection('receivers').doc(uid).delete().catch(() => {});
        await db.collection('users').doc(uid).delete().catch(() => {});
      } catch (e) {
        console.warn('Firestore deleteUser fallback:', e.message);
      }
    }
  },

  async searchDonors(filters = {}) {
    const donors = await this.getDonors();
    let results = donors.filter(u => u.role === 'donor' || !u.role);

    if (filters.bloodGroup && filters.bloodGroup !== 'all') {
      const targetBg = filters.bloodGroup.trim().toUpperCase();
      results = results.filter(d => d.bloodGroup && d.bloodGroup.trim().toUpperCase() === targetBg);
    }
    if (filters.city && filters.city.trim()) {
      const q = filters.city.toLowerCase().trim();
      results = results.filter(d =>
        (d.city && d.city.toLowerCase().includes(q)) ||
        (d.address && d.address.toLowerCase().includes(q))
      );
    }
    if (filters.availableOnly) {
      results = results.filter(d => d.availability);
    }

    // Sort by distance from receiver/user location if provided
    if (filters.userLat != null && filters.userLng != null) {
      results = results.map(d => ({
        ...d,
        distance: this.getDistanceBetween(filters.userLat, filters.userLng, d.lat || 0, d.lng || 0)
      }));
      results.sort((a, b) => a.distance - b.distance);
    }

    return results;
  },

  async getStats() {
    try {
      const [donors, admins, receivers, reqs, dons, hosps, banks] = await Promise.all([
        this.getDonors(),
        this.getAdmins(),
        this.getReceivers(),
        this.getRequests(),
        this.getDonations(),
        this.getHospitals(),
        this.getBloodBanks()
      ]);

      return {
        totalDonors: donors.length,
        activeDonors: donors.filter(u => u.availability).length,
        totalAdmins: admins.length,
        totalReceivers: receivers.length,
        totalRequests: reqs.length,
        activeRequests: reqs.filter(r => r.status === 'active').length,
        fulfilledRequests: reqs.filter(r => r.status === 'fulfilled').length,
        totalDonations: dons.length,
        totalHospitals: hosps.length,
        totalBloodBanks: banks.length
      };
    } catch (e) {
      console.error('getStats error:', e);
      return {};
    }
  }
};

