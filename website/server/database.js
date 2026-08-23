// ============================================
// LifeLink – SQLite Database (PDD Project)
// ============================================

const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'lifelink.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      uid TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'donor',
      full_name TEXT,
      display_name TEXT,
      phone TEXT,
      blood_group TEXT DEFAULT 'O+',
      gender TEXT DEFAULT 'Male',
      age INTEGER DEFAULT 21,
      city TEXT DEFAULT 'India',
      address TEXT,
      availability INTEGER DEFAULT 1,
      verified INTEGER DEFAULT 1,
      lat REAL,
      lng REAL,
      last_donation TEXT DEFAULT 'Never',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS emergency_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      requester_name TEXT,
      patient_name TEXT NOT NULL,
      blood_group_needed TEXT NOT NULL,
      units_needed INTEGER DEFAULT 1,
      hospital_name TEXT NOT NULL,
      location TEXT NOT NULL,
      phone TEXT,
      notes TEXT,
      urgency_level TEXT DEFAULT 'critical',
      lat REAL,
      lng REAL,
      status TEXT DEFAULT 'active',
      responses INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(uid)
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_requests_status ON emergency_requests(status);
  `);
}

function rowToUser(row) {
  if (!row) return null;
  return {
    uid: row.uid,
    email: row.email,
    role: row.role,
    fullName: row.full_name,
    displayName: row.display_name || row.full_name,
    phone: row.phone,
    phoneNumber: row.phone,
    bloodGroup: row.blood_group,
    gender: row.gender,
    age: row.age,
    city: row.city,
    address: row.address,
    availability: !!row.availability,
    verified: !!row.verified,
    lat: row.lat,
    lng: row.lng,
    lastDonation: row.last_donation,
    createdAt: row.created_at
  };
}

function rowToRequest(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    requesterName: row.requester_name,
    patientName: row.patient_name,
    bloodGroupNeeded: row.blood_group_needed,
    unitsNeeded: row.units_needed,
    hospitalName: row.hospital_name,
    location: row.location,
    phone: row.phone,
    notes: row.notes,
    urgencyLevel: row.urgency_level,
    lat: row.lat,
    lng: row.lng,
    status: row.status,
    responses: row.responses,
    createdAt: row.created_at
  };
}

function seedDemoUsers() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (count > 0) return;

  const passwordHash = bcrypt.hashSync('Sameer@14', 10);
  const now = new Date().toISOString();

  const insert = db.prepare(`
    INSERT INTO users (
      uid, email, password_hash, role, full_name, display_name, phone,
      blood_group, gender, age, city, address, availability, verified, lat, lng, last_donation, created_at
    ) VALUES (
      @uid, @email, @password_hash, @role, @full_name, @display_name, @phone,
      @blood_group, @gender, @age, @city, @address, @availability, @verified, @lat, @lng, @last_donation, @created_at
    )
  `);

  const demoUsers = [
    {
      uid: 'sameer_donor',
      email: 'sameershaik9184@gmail.com',
      password_hash: passwordHash,
      role: 'donor',
      full_name: 'Sameer Shaik',
      display_name: 'Sameer Shaik',
      phone: '+91-9184000000',
      blood_group: 'B-',
      gender: 'Male',
      age: 21,
      city: 'Rly Kodur',
      address: 'Rly Kodur, Andhra Pradesh',
      availability: 1,
      verified: 1,
      lat: 14.0042,
      lng: 79.3512,
      last_donation: '2026-08-20',
      created_at: now
    },
    {
      uid: 'sameer_admin',
      email: 'sameeradmin@lifelink.com',
      password_hash: passwordHash,
      role: 'admin',
      full_name: 'Sameer Admin',
      display_name: 'Sameer Admin',
      phone: '+91-9184000001',
      blood_group: 'O+',
      gender: 'Male',
      age: 21,
      city: 'Rly Kodur',
      address: 'LifeLink Headquarters, Rly Kodur, Andhra Pradesh',
      availability: 1,
      verified: 1,
      lat: 14.0042,
      lng: 79.3512,
      last_donation: 'Never',
      created_at: now
    },
    {
      uid: 'u1',
      email: 'karthik@demo.com',
      password_hash: bcrypt.hashSync('demo123', 10),
      role: 'donor',
      full_name: 'Karthik Iyer',
      display_name: 'Karthik Iyer',
      phone: '+91-9876543210',
      blood_group: 'O+',
      gender: 'Male',
      age: 28,
      city: 'Chennai',
      address: '42, Anna Nagar, Chennai, Tamil Nadu 600040',
      availability: 1,
      verified: 1,
      lat: 13.0827,
      lng: 80.2707,
      last_donation: '2026-07-15',
      created_at: now
    },
    {
      uid: 'u2',
      email: 'priya@demo.com',
      password_hash: bcrypt.hashSync('demo123', 10),
      role: 'donor',
      full_name: 'Priya Lakshmi',
      display_name: 'Priya Lakshmi',
      phone: '+91-9876543211',
      blood_group: 'A+',
      gender: 'Female',
      age: 25,
      city: 'Coimbatore',
      address: '15, RS Puram, Coimbatore, Tamil Nadu 641002',
      availability: 1,
      verified: 1,
      lat: 11.0168,
      lng: 76.9558,
      last_donation: '2026-06-20',
      created_at: now
    },
    {
      uid: 'u3',
      email: 'vikram@demo.com',
      password_hash: bcrypt.hashSync('demo123', 10),
      role: 'donor',
      full_name: 'Vikram Reddy',
      display_name: 'Vikram Reddy',
      phone: '+91-9876543212',
      blood_group: 'B+',
      gender: 'Male',
      age: 32,
      city: 'Visakhapatnam',
      address: 'Dwaraka Nagar, Visakhapatnam, AP 530016',
      availability: 1,
      verified: 1,
      lat: 17.6868,
      lng: 83.2185,
      last_donation: '2026-05-10',
      created_at: now
    }
  ];

  const tx = db.transaction((users) => {
    users.forEach(u => insert.run(u));
  });
  tx(demoUsers);

  const reqInsert = db.prepare(`
    INSERT INTO emergency_requests (
      id, user_id, requester_name, patient_name, blood_group_needed, units_needed,
      hospital_name, location, phone, notes, urgency_level, lat, lng, status, responses, created_at
    ) VALUES (
      @id, @user_id, @requester_name, @patient_name, @blood_group_needed, @units_needed,
      @hospital_name, @location, @phone, @notes, @urgency_level, @lat, @lng, @status, @responses, @created_at
    )
  `);

  reqInsert.run({
    id: 'r1',
    user_id: null,
    requester_name: 'Deepak Naidu',
    patient_name: 'Sunita Naidu',
    blood_group_needed: 'O+',
    units_needed: 2,
    hospital_name: 'Apollo Hospitals Chennai',
    location: 'Chennai',
    phone: '+91-9876543210',
    notes: 'Urgent requirement for cardiac surgery',
    urgency_level: 'critical',
    lat: 13.0067,
    lng: 80.2206,
    status: 'active',
    responses: 3,
    created_at: now
  });

  console.log('✅ SQLite database seeded with demo users and sample requests');
}

initSchema();
seedDemoUsers();

module.exports = {
  db,
  rowToUser,
  rowToRequest
};
