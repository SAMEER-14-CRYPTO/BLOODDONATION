// ============================================
// LIFELINK – Data Store & Firebase Sync
// Distinct Admin & Donor Database Sections
// ============================================

const DEFAULT_ADMIN_PASSWORDS = {
  'sameeradmin@lifelink.com': { password: 'Sameer@14', uid: 'sameer_admin' },
  'admin@lifelink.com':       { password: 'admin123',  uid: 'u8' }
};

const DEFAULT_DONOR_PASSWORDS = {
  'sameershaik9184@gmail.com': { password: 'Sameer@14', uid: 'sameer_donor' },
  'rahul@demo.com':            { password: 'demo123',   uid: 'u1' },
  'priya@demo.com':            { password: 'demo123',   uid: 'u2' },
  'amit@demo.com':             { password: 'demo123',   uid: 'u3' },
  'vikram@demo.com':           { password: 'demo123',   uid: 'u5' },
  'meera@demo.com':            { password: 'demo123',   uid: 'u6' },
  'deepa@demo.com':            { password: 'demo123',   uid: 'u9' }
};

const DemoData = {
  _key: 'lifelink_data',
  _isSeeding: false,

  // ────────────────────────────────────────────────────────────
  // Database Schema: Distinct Admin & Donor Sections
  // ────────────────────────────────────────────────────────────
  _defaults: {
    // ── Dedicated Admin Section ──
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
        createdAt: '2026-08-18T10:00:00'
      },
      {
        uid: 'u8',
        displayName: 'Admin User',
        fullName: 'LifeLink Admin',
        email: 'admin@lifelink.com',
        phone: '+91-9000000000',
        bloodGroup: 'O+',
        gender: 'Male',
        age: 30,
        city: 'Mumbai',
        address: 'LifeLink HQ, BKC, Mumbai, Maharashtra 400051',
        role: 'admin',
        permissions: ['all', 'manage_users', 'manage_requests'],
        verified: true,
        availability: true,
        createdAt: '2025-01-01T00:00:00'
      }
    ],

    // ── Dedicated Donor Section ──
    donors: [
      { uid:'sameer_donor', displayName:'Sameer Shaik', fullName:'Sameer Shaik', email:'sameershaik9184@gmail.com', phone:'+91-9184000000', bloodGroup:'B-', gender:'Male', age:21, city:'Rly Kodur', address:'Rly Kodur, Andhra Pradesh', availability:true, verified:true, role:'donor', lastDonation:'2026-08-20', lat:14.0042, lng:79.3512, createdAt:'2026-08-18' },
      { uid:'u1', displayName:'Rahul Sharma', fullName:'Rahul Sharma', email:'rahul@demo.com', phone:'+91-9876543210', bloodGroup:'O+', gender:'Male', age:28, city:'Mumbai', address:'42, Carter Road, Bandra West, Mumbai, Maharashtra 400050', availability:true, verified:true, role:'donor', lastDonation:'2025-12-15', lat:19.0596, lng:72.8295, createdAt:'2025-01-10' },
      { uid:'u2', displayName:'Priya Patel', fullName:'Priya Patel', email:'priya@demo.com', phone:'+91-9876543211', bloodGroup:'A+', gender:'Female', age:25, city:'Delhi', address:'B-14, Connaught Place, New Delhi, Delhi 110001', availability:true, verified:true, role:'donor', lastDonation:'2026-01-20', lat:28.6315, lng:77.2167, createdAt:'2025-03-15' },
      { uid:'u3', displayName:'Amit Kumar', fullName:'Amit Kumar', email:'amit@demo.com', phone:'+91-9876543212', bloodGroup:'B+', gender:'Male', age:32, city:'Bangalore', address:'15, MG Road, Ashok Nagar, Bengaluru, Karnataka 560001', availability:false, verified:true, role:'donor', lastDonation:'2025-11-10', lat:12.9756, lng:77.6062, createdAt:'2025-02-20' },
      { uid:'u4', displayName:'Sara Khan', fullName:'Sara Khan', email:'sara@demo.com', phone:'+91-9876543213', bloodGroup:'AB+', gender:'Female', age:22, city:'Mumbai', address:'203, Sea View Apartments, Worli Sea Face, Mumbai, Maharashtra 400018', availability:true, verified:false, role:'donor', lat:19.0176, lng:72.8158, createdAt:'2025-06-01' },
      { uid:'u5', displayName:'Vikram Singh', fullName:'Vikram Singh', email:'vikram@demo.com', phone:'+91-9876543214', bloodGroup:'O-', gender:'Male', age:35, city:'Chennai', address:'78, Anna Salai, Teynampet, Chennai, Tamil Nadu 600018', availability:true, verified:true, role:'donor', lastDonation:'2026-03-05', lat:13.0418, lng:80.2341, createdAt:'2025-04-10' },
      { uid:'u6', displayName:'Meera Reddy', fullName:'Meera Reddy', email:'meera@demo.com', phone:'+91-9876543215', bloodGroup:'A-', gender:'Female', age:29, city:'Hyderabad', address:'Plot 35, Jubilee Hills Road No. 36, Hyderabad, Telangana 500033', availability:true, verified:true, role:'donor', lastDonation:'2026-02-14', lat:17.4260, lng:78.4085, createdAt:'2025-05-22' },
      { uid:'u7', displayName:'Arjun Nair', fullName:'Arjun Nair', email:'arjun@demo.com', phone:'+91-9876543216', bloodGroup:'B-', gender:'Male', age:27, city:'Pune', address:'12, FC Road, Shivajinagar, Pune, Maharashtra 411004', availability:true, verified:true, role:'donor', lat:18.5308, lng:73.8474, createdAt:'2025-07-18' },
      { uid:'u9', displayName:'Deepa Menon', fullName:'Deepa Menon', email:'deepa@demo.com', phone:'+91-9876543217', bloodGroup:'O+', gender:'Female', age:31, city:'Kochi', address:'22/B, MG Road, Ernakulam, Kochi, Kerala 682016', availability:true, verified:true, role:'donor', lastDonation:'2026-04-12', lat:9.9816, lng:76.2999, createdAt:'2025-08-05' },
      { uid:'u10', displayName:'Ravi Deshmukh', fullName:'Ravi Deshmukh', email:'ravi@demo.com', phone:'+91-9876543218', bloodGroup:'A+', gender:'Male', age:40, city:'Nagpur', address:'15, Dharampeth, Seminary Hills, Nagpur, Maharashtra 440010', availability:true, verified:true, role:'donor', lastDonation:'2026-01-08', lat:21.1458, lng:79.0882, createdAt:'2025-09-12' },
      { uid:'u11', displayName:'Ananya Gupta', fullName:'Ananya Gupta', email:'ananya@demo.com', phone:'+91-9876543219', bloodGroup:'AB-', gender:'Female', age:26, city:'Jaipur', address:'C-56, Vaishali Nagar, Jaipur, Rajasthan 302021', availability:true, verified:true, role:'donor', lastDonation:'2026-03-28', lat:26.9124, lng:75.7873, createdAt:'2025-10-20' },
      { uid:'u12', displayName:'Karthik Iyer', fullName:'Karthik Iyer', email:'karthik@demo.com', phone:'+91-9876543220', bloodGroup:'B+', gender:'Male', age:33, city:'Coimbatore', address:'89, Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004', availability:false, verified:true, role:'donor', lastDonation:'2025-10-15', lat:11.0168, lng:76.9558, createdAt:'2025-11-02' },
      { uid:'u13', displayName:'Fatima Begum', fullName:'Fatima Begum', email:'fatima@demo.com', phone:'+91-9876543221', bloodGroup:'O-', gender:'Female', age:28, city:'Lucknow', address:'45, Hazratganj, Lucknow, Uttar Pradesh 226001', availability:true, verified:true, role:'donor', lastDonation:'2026-02-20', lat:26.8467, lng:80.9462, createdAt:'2025-12-10' },
      { uid:'u14', displayName:'Sanjay Thakur', fullName:'Sanjay Thakur', email:'sanjay@demo.com', phone:'+91-9876543222', bloodGroup:'A-', gender:'Male', age:38, city:'Kolkata', address:'7A, Park Street, Park Street Area, Kolkata, West Bengal 700016', availability:true, verified:true, role:'donor', lastDonation:'2026-04-01', lat:22.5511, lng:88.3520, createdAt:'2026-01-05' },
      { uid:'u15', displayName:'Nisha Verma', fullName:'Nisha Verma', email:'nisha@demo.com', phone:'+91-9876543223', bloodGroup:'AB+', gender:'Female', age:24, city:'Ahmedabad', address:'202, CG Road, Navrangpura, Ahmedabad, Gujarat 380009', availability:true, verified:false, role:'donor', lat:23.0258, lng:72.5636, createdAt:'2026-02-14' },
      { uid:'u16', displayName:'Rajesh Pillai', fullName:'Rajesh Pillai', email:'rajesh@demo.com', phone:'+91-9876543224', bloodGroup:'B-', gender:'Male', age:45, city:'Thiruvananthapuram', address:'TC 12/456, Vazhuthacaud, Thiruvananthapuram, Kerala 695014', availability:true, verified:true, role:'donor', lastDonation:'2026-03-10', lat:8.5074, lng:76.9730, createdAt:'2026-03-01' },
      { uid:'u17', displayName:'Pooja Rawat', fullName:'Pooja Rawat', email:'pooja@demo.com', phone:'+91-9876543225', bloodGroup:'O+', gender:'Female', age:30, city:'Dehradun', address:'18, Rajpur Road, Dehradun, Uttarakhand 248001', availability:true, verified:true, role:'donor', lastDonation:'2026-04-22', lat:30.3165, lng:78.0322, createdAt:'2026-03-15' }
    ],

    // ── Emergency Blood Requests Section ──
    requests: [
      { id:'r1', requesterName:'Deepak Verma', patientName:'Sunita Verma', bloodGroupNeeded:'O+', unitsNeeded: 2, hospitalName:'Apollo Hospital, Mumbai', location:'Mumbai', phone:'+91-9876543210', notes:'Urgent requirement for cardiac surgery', urgencyLevel:'critical', status:'active', lat:19.0330, lng:73.0290, createdAt:'2026-05-12T08:00:00', responses:3 },
      { id:'r2', requesterName:'Kavita Joshi', patientName:'Ram Joshi', bloodGroupNeeded:'A-', unitsNeeded: 1, hospitalName:'AIIMS, Delhi', location:'Delhi', phone:'+91-9876543211', notes:'Accident emergency in ICU Ward 4', urgencyLevel:'urgent', status:'active', lat:28.5670, lng:77.2100, createdAt:'2026-05-11T14:30:00', responses:1 },
      { id:'r3', requesterName:'Suresh Iyer', patientName:'Lakshmi Iyer', bloodGroupNeeded:'B+', unitsNeeded: 3, hospitalName:'Fortis, Bangalore', location:'Bangalore', phone:'+91-9876543212', notes:'Regular transfusion requirement', urgencyLevel:'normal', status:'fulfilled', lat:12.8910, lng:77.5980, createdAt:'2026-05-10T09:15:00', responses:5 },
      { id:'r4', requesterName:'Neha Gupta', patientName:'Anjali Gupta', bloodGroupNeeded:'AB+', unitsNeeded: 2, hospitalName:'Max Hospital, Delhi', location:'Delhi', phone:'+91-9876543213', notes:'Emergency delivery blood arrangement', urgencyLevel:'critical', status:'active', lat:28.5285, lng:77.2111, createdAt:'2026-05-12T06:45:00', responses:0 }
    ],

    hospitals: [
      { id:'h1', name:'Apollo Hospital', address:'Plot 13, Parsik Hill Road, Sector 23, CBD Belapur, Navi Mumbai, Maharashtra 400614', contact:'+91-22-12345678', bloodAvailability:{ 'O+':15, 'A+':8, 'B+':12, 'AB+':3, 'O-':5, 'A-':2, 'B-':4, 'AB-':1 }, lat:19.033, lng:73.029 },
      { id:'h2', name:'AIIMS Hospital', address:'Sri Aurobindo Marg, Ansari Nagar, Ansari Nagar East, New Delhi, Delhi 110029', contact:'+91-11-26588500', bloodAvailability:{ 'O+':20, 'A+':15, 'B+':10, 'AB+':6, 'O-':8, 'A-':5, 'B-':3, 'AB-':2 }, lat:28.567, lng:77.210 },
      { id:'h3', name:'Fortis Hospital', address:'154/9, Bannerghatta Main Road, Opposite IIM, Bengaluru, Karnataka 560076', contact:'+91-80-66214444', bloodAvailability:{ 'O+':12, 'A+':7, 'B+':9, 'AB+':4, 'O-':3, 'A-':2, 'B-':5, 'AB-':1 }, lat:12.891, lng:77.598 },
      { id:'h4', name:'Medanta Hospital', address:'CH Baktawar Singh Road, Sector 38, Gurugram, Haryana 122001', contact:'+91-124-4141414', bloodAvailability:{ 'O+':18, 'A+':11, 'B+':14, 'AB+':5, 'O-':6, 'A-':4, 'B-':3, 'AB-':2 }, lat:28.440, lng:77.041 },
      { id:'h5', name:'Narayana Health', address:'258/A, Bommasandra Industrial Area, Hosur Road, Bengaluru, Karnataka 560099', contact:'+91-80-71222222', bloodAvailability:{ 'O+':10, 'A+':6, 'B+':8, 'AB+':2, 'O-':4, 'A-':3, 'B-':2, 'AB-':1 }, lat:12.895, lng:77.600 },
      { id:'h6', name:'Max Super Speciality Hospital', address:'1, 2, Press Enclave Road, Saket, New Delhi, Delhi 110017', contact:'+91-11-26515050', bloodAvailability:{ 'O+':22, 'A+':14, 'B+':11, 'AB+':7, 'O-':9, 'A-':6, 'B-':4, 'AB-':3 }, lat:28.5285, lng:77.2111 },
      { id:'h7', name:'Kokilaben Dhirubhai Ambani Hospital', address:'Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai, Maharashtra 400053', contact:'+91-22-42696969', bloodAvailability:{ 'O+':17, 'A+':10, 'B+':13, 'AB+':5, 'O-':7, 'A-':4, 'B-':3, 'AB-':2 }, lat:19.1307, lng:72.8253 }
    ],

    bloodBanks: [
      { id:'bb1', name:'Indian Red Cross Blood Bank', address:'1, Red Cross Road, Near Bombay Hospital, Marine Lines, Mumbai, Maharashtra 400020', contact:'+91-22-23621573', lat:18.9441, lng:72.8302, stocks:{ 'O+':45, 'A+':30, 'B+':38, 'AB+':12, 'O-':15, 'A-':8, 'B-':10, 'AB-':4 }},
      { id:'bb2', name:'Rotary Blood Bank', address:'56-57, Institutional Area, Tughlakabad, New Delhi, Delhi 110062', contact:'+91-11-29960044', lat:28.5085, lng:77.2580, stocks:{ 'O+':55, 'A+':40, 'B+':35, 'AB+':15, 'O-':20, 'A-':12, 'B-':8, 'AB-':6 }},
      { id:'bb3', name:'Prathama Blood Centre', address:'Opposite Kiran Hospital, University Road, Satellite, Ahmedabad, Gujarat 380015', contact:'+91-79-26921111', lat:23.0225, lng:72.5299, stocks:{ 'O+':38, 'A+':25, 'B+':30, 'AB+':10, 'O-':12, 'A-':7, 'B-':9, 'AB-':3 }},
      { id:'bb4', name:'Rashtreeya Vidyalaya Blood Bank', address:'41, Bapuji Nagar, Basavanagudi, Bengaluru, Karnataka 560004', contact:'+91-80-26576985', lat:12.9387, lng:77.5650, stocks:{ 'O+':32, 'A+':20, 'B+':25, 'AB+':8, 'O-':10, 'A-':5, 'B-':7, 'AB-':2 }},
      { id:'bb5', name:'Thalassemia & Sickle Cell Society Blood Bank', address:'6-1-91, Padmarao Nagar, Secunderabad, Hyderabad, Telangana 500025', contact:'+91-40-27803894', lat:17.4340, lng:78.5060, stocks:{ 'O+':28, 'A+':18, 'B+':22, 'AB+':6, 'O-':8, 'A-':4, 'B-':6, 'AB-':2 }}
    ],

    donations: [
      { id:'d1', donorId:'u1', donorName:'Rahul Sharma', bloodGroup:'O+', date:'2025-12-15', hospital:'Apollo Hospital', remarks:'Routine donation' },
      { id:'d2', donorId:'u2', donorName:'Priya Patel', bloodGroup:'A+', date:'2026-01-20', hospital:'AIIMS Hospital', remarks:'Emergency donation' },
      { id:'d3', donorId:'u5', donorName:'Vikram Singh', bloodGroup:'O-', date:'2026-03-05', hospital:'Fortis Hospital', remarks:'Scheduled donation' }
    ],

    notifications: [
      { id:'n1', userId:'sameer_donor', message:'Emergency: O+ blood needed at Apollo Hospital, Mumbai', type:'emergency', read:false, createdAt:'2026-05-12T08:00:00' },
      { id:'n2', userId:'u1', message:'Emergency: O+ blood needed at Apollo Hospital', type:'emergency', read:false, createdAt:'2026-05-12T08:00:00' },
      { id:'n3', userId:'u2', message:'Your blood donation is due. Last donation was 3 months ago.', type:'reminder', read:false, createdAt:'2026-05-11T09:00:00' },
      { id:'n4', userId:'u1', message:'Thank you for responding to the blood request!', type:'success', read:true, createdAt:'2026-05-10T15:30:00' }
    ]
  },

  // ────────────────────────────────────────────────────────────
  // Credential Stores: Separate Admin & Donor Password Stores
  // ────────────────────────────────────────────────────────────
  getAdminPasswords() {
    const stored = localStorage.getItem('lifelink_admin_passwords');
    let map = { ...DEFAULT_ADMIN_PASSWORDS };
    if (stored) {
      try { map = { ...map, ...JSON.parse(stored) }; } catch (e) {}
    }
    return map;
  },

  saveAdminPassword(email, password, uid) {
    if (!email) return;
    const map = this.getAdminPasswords();
    map[email.trim().toLowerCase()] = { password, uid };
    localStorage.setItem('lifelink_admin_passwords', JSON.stringify(map));
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

  // Get local cache data (auto-resets if version mismatch)
  getData() {
    const DATA_VERSION = 'v5_partitioned'; // version update for separated schema
    const storedVer = localStorage.getItem(this._key + '_ver');
    if (storedVer !== DATA_VERSION) {
      localStorage.removeItem(this._key);
      localStorage.setItem(this._key + '_ver', DATA_VERSION);
    }
    const stored = localStorage.getItem(this._key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (!parsed.admins) parsed.admins = JSON.parse(JSON.stringify(this._defaults.admins));
        if (!parsed.donors) parsed.donors = JSON.parse(JSON.stringify(this._defaults.donors));
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
  // Distinct Section Readers: Donors & Admins
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
    if (typeof db !== 'undefined' && db) {
      try {
        const snap = await db.collection('admins').get();
        if (!snap.empty) {
          const fsAdmins = snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
          const localAdmins = this.getData().admins || [];
          const adminMap = new Map();
          fsAdmins.forEach(a => adminMap.set(a.uid || a.email, a));
          localAdmins.forEach(a => {
            const key = a.uid || a.email;
            if (!adminMap.has(key)) adminMap.set(key, a);
          });
          return Array.from(adminMap.values());
        }
      } catch (e) {
        console.warn('Firestore getAdmins fallback:', e.message);
      }
    }
    return this.getData().admins || [];
  },

  // Combined users view for global queries
  async getUsers() {
    const [donors, admins] = await Promise.all([this.getDonors(), this.getAdmins()]);
    return [...donors, ...admins];
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

  // Predefined City Coordinates for quick accurate mapping across India
  _cityCoords: {
    'rly kodur': { lat: 14.0042, lng: 79.3512 },
    'railway kodur': { lat: 14.0042, lng: 79.3512 },
    'kodur': { lat: 14.0042, lng: 79.3512 },
    'kadapa': { lat: 14.4673, lng: 78.8242 },
    'tirupati': { lat: 13.6288, lng: 79.4192 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'delhi': { lat: 28.6139, lng: 77.2090 },
    'new delhi': { lat: 28.6139, lng: 77.2090 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'bengaluru': { lat: 12.9716, lng: 77.5946 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'kolkata': { lat: 22.5726, lng: 88.3639 },
    'pune': { lat: 18.5204, lng: 73.8567 },
    'ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'jaipur': { lat: 26.9124, lng: 75.7873 },
    'lucknow': { lat: 26.8467, lng: 80.9462 },
    'kochi': { lat: 9.9816, lng: 76.2999 },
    'nagpur': { lat: 21.1458, lng: 79.0882 },
    'coimbatore': { lat: 11.0168, lng: 76.9558 },
    'thiruvananthapuram': { lat: 8.5074, lng: 76.9730 },
    'trivandrum': { lat: 8.5074, lng: 76.9730 },
    'dehradun': { lat: 30.3165, lng: 78.0322 },
    'vijayawada': { lat: 16.5062, lng: 80.6480 },
    'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'vizag': { lat: 17.6868, lng: 83.2185 },
    'guntur': { lat: 16.3067, lng: 80.4365 },
    'nellore': { lat: 14.4426, lng: 79.9865 },
    'kurnool': { lat: 15.8281, lng: 78.0373 },
    'anantapur': { lat: 14.6819, lng: 77.6006 }
  },

  getCoordsForCity(cityName) {
    if (!cityName) return { lat: 20.5937, lng: 78.9629 };
    const clean = cityName.trim().toLowerCase();
    for (const [key, coords] of Object.entries(this._cityCoords)) {
      if (clean.includes(key) || key.includes(clean)) {
        return coords;
      }
    }
    let hash = 0;
    for (let i = 0; i < clean.length; i++) hash = clean.charCodeAt(i) + ((hash << 5) - hash);
    const lat = 12.0 + Math.abs(hash % 1600) / 100;
    const lng = 74.0 + Math.abs((hash >> 3) % 1200) / 100;
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

  async addAdmin(admin) {
    admin.role = 'admin';
    const data = this.getData();
    if (!data.admins) data.admins = [];
    const idx = data.admins.findIndex(a => a.uid === admin.uid || (a.email && admin.email && a.email.toLowerCase() === admin.email.toLowerCase()));
    if (idx > -1) {
      data.admins[idx] = { ...data.admins[idx], ...admin };
    } else {
      data.admins.unshift(admin);
    }
    this.saveData(data);

    if (admin.password) {
      this.saveAdminPassword(admin.email, admin.password, admin.uid);
    }

    if (typeof db !== 'undefined' && db) {
      try {
        await db.collection('admins').doc(admin.uid).set(admin, { merge: true });
        await db.collection('users').doc(admin.uid).set(admin, { merge: true });
        console.log('🔥 Admin saved to database section: admins /', admin.uid);
      } catch (e) {
        console.warn('Firestore addAdmin notice:', e.message);
      }
    }
    return admin;
  },

  // General addUser router
  async addUser(user) {
    if (user.role === 'admin' || (user.email && user.email.toLowerCase().includes('admin'))) {
      return this.addAdmin(user);
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
    if (data.admins) data.admins = data.admins.filter(u => u.uid !== uid);
    this.saveData(data);

    const isLive = typeof DEMO_MODE !== 'undefined' ? !DEMO_MODE : false;
    if (isLive && typeof db !== 'undefined' && db) {
      try {
        await db.collection('donors').doc(uid).delete().catch(() => {});
        await db.collection('admins').doc(uid).delete().catch(() => {});
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
    return results;
  },

  async getStats() {
    try {
      const [donors, admins, reqs, dons, hosps, banks] = await Promise.all([
        this.getDonors(),
        this.getAdmins(),
        this.getRequests(),
        this.getDonations(),
        this.getHospitals(),
        this.getBloodBanks()
      ]);

      return {
        totalDonors: donors.length,
        activeDonors: donors.filter(u => u.availability).length,
        totalAdmins: admins.length,
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

