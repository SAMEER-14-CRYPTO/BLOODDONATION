// ============================================
// LifeLink – Express API Server (PDD Project)
// Serves website + SQLite database API
// ============================================

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { db, rowToUser, rowToRequest } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'lifelink-pdd-secret-key-2026';
const WEBSITE_ROOT = path.join(__dirname, '..');

app.use(cors());
app.use(express.json());

// ── Auth middleware ──
function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Login required. Please sign in again.' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const row = db.prepare('SELECT * FROM users WHERE uid = ?').get(payload.uid);
    if (!row) {
      return res.status(401).json({ error: 'Account not found. Please register or login again.' });
    }
    req.user = rowToUser(row);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Session expired. Please login again.' });
  }
}

function signToken(user) {
  return jwt.sign({ uid: user.uid, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

// ── API Routes ──

app.get('/api/health', (_req, res) => {
  const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  const requestCount = db.prepare('SELECT COUNT(*) AS c FROM emergency_requests').get().c;
  res.json({
    ok: true,
    database: 'SQLite',
    dbFile: 'server/lifelink.db',
    users: userCount,
    emergencyRequests: requestCount,
    message: 'LifeLink database connected'
  });
});

// Register new user (donor or admin with secret code)
app.post('/api/auth/register', (req, res) => {
  try {
    const {
      email, password, fullName, phone, bloodGroup, gender, age, city,
      lastDonation, adminCode, role: roleHint
    } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and full name are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const emailClean = email.trim().toLowerCase();
    const existing = db.prepare('SELECT uid FROM users WHERE email = ?').get(emailClean);
    if (existing) {
      return res.status(409).json({ error: 'This email is already registered. Try logging in.' });
    }

    const isAdmin = adminCode === 'ADMIN-SECURE' || roleHint === 'admin';
    const role = isAdmin ? 'admin' : 'donor';
    const uid = (isAdmin ? 'admin_' : 'donor_') + Date.now();
    const now = new Date().toISOString();
    const passwordHash = bcrypt.hashSync(password, 10);

    db.prepare(`
      INSERT INTO users (
        uid, email, password_hash, role, full_name, display_name, phone,
        blood_group, gender, age, city, address, availability, verified, lat, lng, last_donation, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?, ?, ?)
    `).run(
      uid, emailClean, passwordHash, role, fullName, fullName, phone || '',
      bloodGroup || 'O+', gender || 'Male', parseInt(age) || 21, city || 'India',
      `${city || 'India'}, India`, 20.5937, 78.9629, lastDonation || 'Never', now
    );

    const user = rowToUser(db.prepare('SELECT * FROM users WHERE uid = ?').get(uid));
    const token = signToken(user);

    res.status(201).json({ token, user, message: `Registered as ${role}` });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Google Auth – authenticates or registers user via Google in SQLite database
app.post('/api/auth/google', (req, res) => {
  try {
    const { email, displayName, fullName, photoURL, phone, bloodGroup, gender, age, city, address, role: roleHint } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required for Google authentication.' });
    }

    const emailClean = email.trim().toLowerCase();
    const name = displayName || fullName || emailClean.split('@')[0];
    const isAdmin = roleHint === 'admin' || emailClean.includes('admin');
    const role = isAdmin ? 'admin' : 'donor';

    let row = db.prepare('SELECT * FROM users WHERE email = ?').get(emailClean);

    if (!row) {
      const uid = (isAdmin ? 'admin_' : 'donor_') + 'g_' + Date.now();
      const now = new Date().toISOString();
      const passwordHash = bcrypt.hashSync('GOOGLE_AUTH_' + Date.now(), 10);

      db.prepare(`
        INSERT INTO users (
          uid, email, password_hash, role, full_name, display_name, phone,
          blood_group, gender, age, city, address, availability, verified, lat, lng, last_donation, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?, ?, ?)
      `).run(
        uid, emailClean, passwordHash, role, name, name, phone || '',
        bloodGroup || (role === 'admin' ? 'O+' : 'B-'), gender || 'Male', parseInt(age) || 21,
        city || 'India', address || `${city || 'India'}, India`, 20.5937, 78.9629, 'Never', now
      );

      row = db.prepare('SELECT * FROM users WHERE uid = ?').get(uid);
    }

    const user = rowToUser(row);
    const token = signToken(user);

    res.json({ token, user, message: 'Google authentication successful' });
  } catch (e) {
    console.error('Google auth error:', e);
    res.status(500).json({ error: 'Google login failed. Please try again.' });
  }
});

// Login – validates against SQLite database
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password, role: roleHint } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const emailClean = email.trim().toLowerCase();
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(emailClean);

    if (!row || !bcrypt.compareSync(password, row.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (roleHint === 'admin' && row.role !== 'admin') {
      return res.status(403).json({ error: 'This account is not an admin. Use Donor Login.' });
    }
    if (roleHint === 'donor' && row.role === 'admin' && !emailClean.includes('admin')) {
      // Allow admin emails to login as donor tab only if explicitly admin tab - skip
    }

    const user = rowToUser(row);
    const token = signToken(user);

    res.json({ token, user, message: 'Login successful' });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Get current logged-in user from token
app.get('/api/auth/me', authRequired, (req, res) => {
  res.json({ user: req.user });
});

// List donors (public)
app.get('/api/donors', (_req, res) => {
  const rows = db.prepare("SELECT * FROM users WHERE role = 'donor' ORDER BY created_at DESC").all();
  res.json({ donors: rows.map(rowToUser) });
});

// List admins (admin only)
app.get('/api/admins', authRequired, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access only.' });
  }
  const rows = db.prepare("SELECT * FROM users WHERE role = 'admin' ORDER BY created_at DESC").all();
  res.json({ admins: rows.map(rowToUser) });
});

// Emergency requests – list
app.get('/api/emergency/requests', (_req, res) => {
  const rows = db.prepare('SELECT * FROM emergency_requests ORDER BY created_at DESC').all();
  res.json({ requests: rows.map(rowToRequest) });
});

// Emergency requests – create (login required)
app.post('/api/emergency/requests', authRequired, (req, res) => {
  try {
    const {
      patientName, bloodGroupNeeded, unitsNeeded, hospitalName, location,
      requesterName, phone, notes, urgencyLevel, lat, lng
    } = req.body;

    if (!patientName || !bloodGroupNeeded || !hospitalName || !location) {
      return res.status(400).json({ error: 'Patient name, blood group, hospital, and location are required.' });
    }

    const id = 'req_' + Date.now();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO emergency_requests (
        id, user_id, requester_name, patient_name, blood_group_needed, units_needed,
        hospital_name, location, phone, notes, urgency_level, lat, lng, status, responses, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 0, ?)
    `).run(
      id,
      req.user.uid,
      requesterName || req.user.displayName,
      patientName,
      bloodGroupNeeded,
      parseInt(unitsNeeded) || 1,
      hospitalName,
      location,
      phone || req.user.phone || '',
      notes || '',
      urgencyLevel || 'critical',
      lat ?? 20.5937,
      lng ?? 78.9629,
      now
    );

    const saved = rowToRequest(db.prepare('SELECT * FROM emergency_requests WHERE id = ?').get(id));
    res.status(201).json({ request: saved, message: 'Emergency request saved to database' });
  } catch (e) {
    console.error('Create request error:', e);
    res.status(500).json({ error: 'Failed to save emergency request.' });
  }
});

// Respond to emergency request
app.patch('/api/emergency/requests/:id/respond', authRequired, (req, res) => {
  const { id } = req.params;
  const row = db.prepare('SELECT * FROM emergency_requests WHERE id = ?').get(id);
  if (!row) {
    return res.status(404).json({ error: 'Request not found.' });
  }
  const responses = (row.responses || 0) + 1;
  db.prepare('UPDATE emergency_requests SET responses = ? WHERE id = ?').run(responses, id);
  const updated = rowToRequest(db.prepare('SELECT * FROM emergency_requests WHERE id = ?').get(id));
  res.json({ request: updated });
});

// Update user profile
app.patch('/api/users/:uid', authRequired, (req, res) => {
  if (req.user.uid !== req.params.uid && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not allowed to update this profile.' });
  }
  const allowed = ['full_name', 'display_name', 'phone', 'blood_group', 'city', 'address', 'availability', 'last_donation'];
  const updates = req.body;
  const sets = [];
  const values = [];

  const fieldMap = {
    fullName: 'full_name', displayName: 'display_name', phone: 'phone',
    bloodGroup: 'blood_group', city: 'city', address: 'address',
    availability: 'availability', lastDonation: 'last_donation'
  };

  for (const [key, col] of Object.entries(fieldMap)) {
    if (updates[key] !== undefined) {
      sets.push(`${col} = ?`);
      values.push(key === 'availability' ? (updates[key] ? 1 : 0) : updates[key]);
    }
  }

  if (sets.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update.' });
  }

  values.push(req.params.uid);
  db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE uid = ?`).run(...values);

  const user = rowToUser(db.prepare('SELECT * FROM users WHERE uid = ?').get(req.params.uid));
  res.json({ user });
});

// ── Serve static website files ──
app.use(express.static(WEBSITE_ROOT));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  const filePath = path.join(WEBSITE_ROOT, req.path);
  if (req.path.endsWith('.html') || !path.extname(req.path)) {
    const htmlFile = req.path.endsWith('.html')
      ? filePath
      : path.join(WEBSITE_ROOT, req.path === '/' ? 'index.html' : req.path + '.html');
    return res.sendFile(htmlFile, (err) => {
      if (err) res.sendFile(path.join(WEBSITE_ROOT, 'index.html'));
    });
  }
  next();
});

app.listen(PORT, () => {
  console.log('');
  console.log('🩸 LifeLink PDD Server Running');
  console.log('──────────────────────────────────────');
  console.log(`   Website:  http://localhost:${PORT}`);
  console.log(`   API:      http://localhost:${PORT}/api/health`);
  console.log(`   Database: SQLite (server/lifelink.db)`);
  console.log('──────────────────────────────────────');
  console.log('');
});
