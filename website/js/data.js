// ============================================
// LIFELINK – Demo Data Store
// ============================================

const DemoData = {
  _key: 'lifelink_data',

  _defaults: {
    users: [
      { uid:'u1', displayName:'Rahul Sharma', email:'rahul@demo.com', phone:'+91-9876543210', bloodGroup:'O+', gender:'Male', age:28, city:'Mumbai', address:'42, Carter Road, Bandra West, Mumbai, Maharashtra 400050', availability:true, verified:true, role:'donor', lastDonation:'2025-12-15', lat:19.0596, lng:72.8295, createdAt:'2025-01-10' },
      { uid:'u2', displayName:'Priya Patel', email:'priya@demo.com', phone:'+91-9876543211', bloodGroup:'A+', gender:'Female', age:25, city:'Delhi', address:'B-14, Connaught Place, New Delhi, Delhi 110001', availability:true, verified:true, role:'donor', lastDonation:'2026-01-20', lat:28.6315, lng:77.2167, createdAt:'2025-03-15' },
      { uid:'u3', displayName:'Amit Kumar', email:'amit@demo.com', phone:'+91-9876543212', bloodGroup:'B+', gender:'Male', age:32, city:'Bangalore', address:'15, MG Road, Ashok Nagar, Bengaluru, Karnataka 560001', availability:false, verified:true, role:'donor', lastDonation:'2025-11-10', lat:12.9756, lng:77.6062, createdAt:'2025-02-20' },
      { uid:'u4', displayName:'Sara Khan', email:'sara@demo.com', phone:'+91-9876543213', bloodGroup:'AB+', gender:'Female', age:22, city:'Mumbai', address:'203, Sea View Apartments, Worli Sea Face, Mumbai, Maharashtra 400018', availability:true, verified:false, role:'donor', lat:19.0176, lng:72.8158, createdAt:'2025-06-01' },
      { uid:'u5', displayName:'Vikram Singh', email:'vikram@demo.com', phone:'+91-9876543214', bloodGroup:'O-', gender:'Male', age:35, city:'Chennai', address:'78, Anna Salai, Teynampet, Chennai, Tamil Nadu 600018', availability:true, verified:true, role:'donor', lastDonation:'2026-03-05', lat:13.0418, lng:80.2341, createdAt:'2025-04-10' },
      { uid:'u6', displayName:'Meera Reddy', email:'meera@demo.com', phone:'+91-9876543215', bloodGroup:'A-', gender:'Female', age:29, city:'Hyderabad', address:'Plot 35, Jubilee Hills Road No. 36, Hyderabad, Telangana 500033', availability:true, verified:true, role:'donor', lastDonation:'2026-02-14', lat:17.4260, lng:78.4085, createdAt:'2025-05-22' },
      { uid:'u7', displayName:'Arjun Nair', email:'arjun@demo.com', phone:'+91-9876543216', bloodGroup:'B-', gender:'Male', age:27, city:'Pune', address:'12, FC Road, Shivajinagar, Pune, Maharashtra 411004', availability:true, verified:true, role:'donor', lat:18.5308, lng:73.8474, createdAt:'2025-07-18' },
      { uid:'u9', displayName:'Deepa Menon', email:'deepa@demo.com', phone:'+91-9876543217', bloodGroup:'O+', gender:'Female', age:31, city:'Kochi', address:'22/B, MG Road, Ernakulam, Kochi, Kerala 682016', availability:true, verified:true, role:'donor', lastDonation:'2026-04-12', lat:9.9816, lng:76.2999, createdAt:'2025-08-05' },
      { uid:'u10', displayName:'Ravi Deshmukh', email:'ravi@demo.com', phone:'+91-9876543218', bloodGroup:'A+', gender:'Male', age:40, city:'Nagpur', address:'15, Dharampeth, Seminary Hills, Nagpur, Maharashtra 440010', availability:true, verified:true, role:'donor', lastDonation:'2026-01-08', lat:21.1458, lng:79.0882, createdAt:'2025-09-12' },
      { uid:'u11', displayName:'Ananya Gupta', email:'ananya@demo.com', phone:'+91-9876543219', bloodGroup:'AB-', gender:'Female', age:26, city:'Jaipur', address:'C-56, Vaishali Nagar, Jaipur, Rajasthan 302021', availability:true, verified:true, role:'donor', lastDonation:'2026-03-28', lat:26.9124, lng:75.7873, createdAt:'2025-10-20' },
      { uid:'u12', displayName:'Karthik Iyer', email:'karthik@demo.com', phone:'+91-9876543220', bloodGroup:'B+', gender:'Male', age:33, city:'Coimbatore', address:'89, Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004', availability:false, verified:true, role:'donor', lastDonation:'2025-10-15', lat:11.0168, lng:76.9558, createdAt:'2025-11-02' },
      { uid:'u13', displayName:'Fatima Begum', email:'fatima@demo.com', phone:'+91-9876543221', bloodGroup:'O-', gender:'Female', age:28, city:'Lucknow', address:'45, Hazratganj, Lucknow, Uttar Pradesh 226001', availability:true, verified:true, role:'donor', lastDonation:'2026-02-20', lat:26.8467, lng:80.9462, createdAt:'2025-12-10' },
      { uid:'u14', displayName:'Sanjay Thakur', email:'sanjay@demo.com', phone:'+91-9876543222', bloodGroup:'A-', gender:'Male', age:38, city:'Kolkata', address:'7A, Park Street, Park Street Area, Kolkata, West Bengal 700016', availability:true, verified:true, role:'donor', lastDonation:'2026-04-01', lat:22.5511, lng:88.3520, createdAt:'2026-01-05' },
      { uid:'u15', displayName:'Nisha Verma', email:'nisha@demo.com', phone:'+91-9876543223', bloodGroup:'AB+', gender:'Female', age:24, city:'Ahmedabad', address:'202, CG Road, Navrangpura, Ahmedabad, Gujarat 380009', availability:true, verified:false, role:'donor', lat:23.0258, lng:72.5636, createdAt:'2026-02-14' },
      { uid:'u16', displayName:'Rajesh Pillai', email:'rajesh@demo.com', phone:'+91-9876543224', bloodGroup:'B-', gender:'Male', age:45, city:'Thiruvananthapuram', address:'TC 12/456, Vazhuthacaud, Thiruvananthapuram, Kerala 695014', availability:true, verified:true, role:'donor', lastDonation:'2026-03-10', lat:8.5074, lng:76.9730, createdAt:'2026-03-01' },
      { uid:'u17', displayName:'Pooja Rawat', email:'pooja@demo.com', phone:'+91-9876543225', bloodGroup:'O+', gender:'Female', age:30, city:'Dehradun', address:'18, Rajpur Road, Dehradun, Uttarakhand 248001', availability:true, verified:true, role:'donor', lastDonation:'2026-04-22', lat:30.3165, lng:78.0322, createdAt:'2026-03-15' },
      { uid:'u8', displayName:'Admin User', email:'admin@lifelink.com', phone:'+91-9000000000', bloodGroup:'O+', gender:'Male', age:30, city:'Mumbai', address:'LifeLink HQ, BKC, Mumbai, Maharashtra 400051', availability:true, verified:true, role:'admin', createdAt:'2025-01-01' }
    ],
    requests: [
      { id:'r1', requesterName:'Deepak Verma', patientName:'Sunita Verma', bloodGroupNeeded:'O+', hospitalName:'Apollo Hospital, Mumbai', location:'Mumbai', urgencyLevel:'critical', status:'active', createdAt:'2026-05-12T08:00:00', responses:3 },
      { id:'r2', requesterName:'Kavita Joshi', patientName:'Ram Joshi', bloodGroupNeeded:'A-', hospitalName:'AIIMS, Delhi', location:'Delhi', urgencyLevel:'urgent', status:'active', createdAt:'2026-05-11T14:30:00', responses:1 },
      { id:'r3', requesterName:'Suresh Iyer', patientName:'Lakshmi Iyer', bloodGroupNeeded:'B+', hospitalName:'Fortis, Bangalore', location:'Bangalore', urgencyLevel:'normal', status:'fulfilled', createdAt:'2026-05-10T09:15:00', responses:5 },
      { id:'r4', requesterName:'Neha Gupta', patientName:'Anjali Gupta', bloodGroupNeeded:'AB+', hospitalName:'Max Hospital, Delhi', location:'Delhi', urgencyLevel:'critical', status:'active', createdAt:'2026-05-12T06:45:00', responses:0 }
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
      { id:'n1', userId:'u1', message:'Emergency: O+ blood needed at Apollo Hospital', type:'emergency', read:false, createdAt:'2026-05-12T08:00:00' },
      { id:'n2', userId:'u2', message:'Your blood donation is due. Last donation was 3 months ago.', type:'reminder', read:false, createdAt:'2026-05-11T09:00:00' },
      { id:'n3', userId:'u1', message:'Thank you for responding to the blood request!', type:'success', read:true, createdAt:'2026-05-10T15:30:00' }
    ]
  },

  // Get all data
  getData() {
    const stored = localStorage.getItem(this._key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch(e) {
        // Corrupted data – reset
        localStorage.removeItem(this._key);
      }
    }
    localStorage.setItem(this._key, JSON.stringify(this._defaults));
    return JSON.parse(JSON.stringify(this._defaults));
  },

  saveData(data) {
    localStorage.setItem(this._key, JSON.stringify(data));
  },

  // Force-reset to latest defaults (useful after data schema changes)
  resetData() {
    localStorage.removeItem(this._key);
    return this.getData();
  },

  async getUsers() { 
    if (DEMO_MODE) return this.getData().users;
    const snap = await db.collection('users').get();
    return snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  },

  async getRequests() { 
    if (DEMO_MODE) return this.getData().requests;
    const snap = await db.collection('requests').orderBy('createdAt', 'desc').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getHospitals() { 
    if (DEMO_MODE) return this.getData().hospitals;
    // Fallback to demo data if not yet seeded
    const snap = await db.collection('hospitals').get();
    if (snap.empty) return this.getData().hospitals;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getBloodBanks() { 
    if (DEMO_MODE) return this.getData().bloodBanks;
    const snap = await db.collection('bloodBanks').get();
    if (snap.empty) return this.getData().bloodBanks;
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getDonations() { 
    if (DEMO_MODE) return this.getData().donations;
    const snap = await db.collection('donations').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getNotifications(userId) {
    if (DEMO_MODE) return this.getData().notifications.filter(n => !userId || n.userId === userId);
    let q = db.collection('notifications');
    if (userId) q = q.where('userId', '==', userId);
    const snap = await q.get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async addUser(user) {
    if (DEMO_MODE) {
      const data = this.getData();
      data.users.push(user);
      this.saveData(data);
      return;
    }
    // Usually handled by auth.js on registration
    await db.collection('users').doc(user.uid).set(user);
  },

  async addRequest(req) {
    if (DEMO_MODE) {
      const data = this.getData();
      req.id = 'r' + Date.now();
      req.createdAt = new Date().toISOString();
      req.status = 'active';
      req.responses = 0;
      data.requests.push(req);
      this.saveData(data);
      return req;
    }
    
    // Add to Firebase
    const docRef = await db.collection('requests').add({
      ...req,
      status: 'active',
      responses: 0,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...req };
  },

  async updateUser(uid, updates) {
    if (DEMO_MODE) {
      const data = this.getData();
      const idx = data.users.findIndex(u => u.uid === uid);
      if (idx > -1) { data.users[idx] = { ...data.users[idx], ...updates }; this.saveData(data); }
      return;
    }
    await db.collection('users').doc(uid).update(updates);
  },

  async updateRequest(id, updates) {
    if (DEMO_MODE) {
      const data = this.getData();
      const idx = data.requests.findIndex(r => r.id === id);
      if (idx > -1) { data.requests[idx] = { ...data.requests[idx], ...updates }; this.saveData(data); }
      return;
    }
    await db.collection('requests').doc(id).update(updates);
  },

  async deleteUser(uid) {
    if (DEMO_MODE) {
      const data = this.getData();
      data.users = data.users.filter(u => u.uid !== uid);
      this.saveData(data);
      return;
    }
    await db.collection('users').doc(uid).delete();
  },

  async searchDonors(filters) {
    if (DEMO_MODE) {
      let donors = this.getData().users.filter(u => u.role === 'donor');
      if (filters.bloodGroup && filters.bloodGroup !== 'all') {
        donors = donors.filter(d => d.bloodGroup === filters.bloodGroup);
      }
      if (filters.city) {
        const q = filters.city.toLowerCase();
        donors = donors.filter(d =>
          d.city?.toLowerCase().includes(q) ||
          d.address?.toLowerCase().includes(q)
        );
      }
      if (filters.availableOnly) {
        donors = donors.filter(d => d.availability);
      }
      return donors;
    }

    let query = db.collection('users').where('role', '==', 'donor');
    if (filters.bloodGroup && filters.bloodGroup !== 'all') {
      query = query.where('bloodGroup', '==', filters.bloodGroup);
    }
    if (filters.availableOnly) {
      query = query.where('availability', '==', true);
    }
    const snap = await query.get();
    let donors = snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

    // Firebase doesn't support easy case-insensitive text search, filter city locally
    if (filters.city) {
      const q = filters.city.toLowerCase();
      donors = donors.filter(d =>
        d.city?.toLowerCase().includes(q) ||
        d.address?.toLowerCase().includes(q)
      );
    }
    return donors;
  },

  async getStats() {
    if (DEMO_MODE) {
      const data = this.getData();
      return {
        totalDonors: data.users.filter(u => u.role === 'donor').length,
        activeDonors: data.users.filter(u => u.role === 'donor' && u.availability).length,
        totalRequests: data.requests.length,
        activeRequests: data.requests.filter(r => r.status === 'active').length,
        fulfilledRequests: data.requests.filter(r => r.status === 'fulfilled').length,
        totalDonations: data.donations.length,
        totalHospitals: data.hospitals.length,
        totalBloodBanks: data.bloodBanks.length
      };
    }

    // In a real app we would use Firebase Aggregation queries or cloud functions.
    // For demo/small scales, fetching all is acceptable, but let's do parallel counts
    try {
      const [users, reqs, dons, hosps, banks] = await Promise.all([
        db.collection('users').get(),
        db.collection('requests').get(),
        db.collection('donations').get(),
        this.getHospitals(),
        this.getBloodBanks()
      ]);

      const usersData = users.docs.map(d => d.data());
      const reqsData = reqs.docs.map(d => d.data());

      return {
        totalDonors: usersData.filter(u => u.role === 'donor').length,
        activeDonors: usersData.filter(u => u.role === 'donor' && u.availability).length,
        totalRequests: reqsData.length,
        activeRequests: reqsData.filter(r => r.status === 'active').length,
        fulfilledRequests: reqsData.filter(r => r.status === 'fulfilled').length,
        totalDonations: dons.size,
        totalHospitals: hosps.length,
        totalBloodBanks: banks.length
      };
    } catch (e) {
      console.error(e);
      return {};
    }
  }
};
