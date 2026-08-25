// ============================================
// LIFELINK – Authentication Module
// 3-Role Auth: Donor, Receiver, Admin
// No Google Sign-In. Admin is hardcoded.
// ============================================

// Hardcoded Admin Credentials (only way to access admin)
const ADMIN_EMAIL = 'sameeradmin@lifelink.com';
const ADMIN_PASSWORD = 'Sameer@14';

// Friendly error messages for Firebase Auth error codes
function _friendlyAuthError(error) {
  const map = {
    'auth/user-not-found':        'No account found with this email. Please register first.',
    'auth/wrong-password':        'Incorrect password. Please try again.',
    'auth/invalid-credential':    'Invalid email or password. Please try again.',
    'auth/invalid-email':         'Please enter a valid email address.',
    'auth/email-already-in-use':  'This email is already registered. Try logging in instead.',
    'auth/weak-password':         'Password must be at least 6 characters.',
    'auth/too-many-requests':     'Too many failed attempts. Please try again later.',
    'auth/network-request-failed':'Network error. Please check your internet connection.',
    'auth/user-disabled':         'This account has been disabled. Contact support.'
  };
  return map[error.code] || error.message || 'An unexpected error occurred.';
}

const Auth = {
  currentUser: null,

  // ── Initialize auth state listener ──
  init() {
    const savedUser = localStorage.getItem('lifelink_user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.updateUI(this.currentUser);
      } catch (e) {
        localStorage.removeItem('lifelink_user');
      }
    }

    // Firebase listener — only active when live firebase is configured
    const isLive = typeof DEMO_MODE !== 'undefined' ? !DEMO_MODE : (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0);
    if (isLive && typeof auth !== 'undefined' && auth) {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            if (typeof db !== 'undefined' && db) {
              const doc = await db.collection('users').doc(user.uid).get();
              if (doc.exists) {
                const profile = { uid: user.uid, ...doc.data(), displayName: user.displayName || doc.data().fullName };
                localStorage.setItem('lifelink_user', JSON.stringify(profile));
                this.currentUser = profile;
              } else {
                this.currentUser = user;
              }
            } else {
              this.currentUser = user;
            }
          } catch (e) {
            this.currentUser = user;
          }
          this.updateUI(this.currentUser);
        } else if (!savedUser) {
          this.currentUser = null;
          this.updateUI(null);
        }
      });
    }
  },

  // ── Sign up (Donor or Receiver only — NO admin registration) ──
  async signup(data) {
    const role = data.role || 'donor'; // 'donor' or 'receiver'
    const emailClean = data.email.trim().toLowerCase();

    // Block admin registration
    if (role === 'admin') {
      App.showToast('Admin accounts cannot be registered. Contact the administrator.', 'error');
      return null;
    }

    // Enforce 8-12 character password length
    if (!data.password || data.password.length < 8 || data.password.length > 12) {
      App.showToast('Password must be between 8 and 12 characters long.', 'error');
      return null;
    }

    // Check if email already exists in the opposite role
    const donorPasswords = DemoData.getDonorPasswords();
    const receiverPasswords = DemoData.getReceiverPasswords();
    if (role === 'donor' && receiverPasswords[emailClean]) {
      App.showToast('This email is already registered as a Receiver. Please use a different email.', 'error');
      return null;
    }
    if (role === 'receiver' && donorPasswords[emailClean]) {
      App.showToast('This email is already registered as a Donor. Please use a different email.', 'error');
      return null;
    }

    // 1. Save to SQLite database via API (primary for PDD project)
    if (typeof LifeLinkAPI !== 'undefined') {
      try {
        const result = await LifeLinkAPI.register({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          phone: data.phone,
          bloodGroup: data.bloodGroup,
          gender: data.gender,
          age: data.age,
          city: data.city,
          lastDonation: data.lastDonation,
          role: role
        });
        if (result.user) {
          localStorage.setItem('lifelink_user', JSON.stringify(result.user));
          this.currentUser = result.user;
          App.showToast(`Account created in database! Welcome (${role.toUpperCase()})`, 'success');
          setTimeout(() => {
            window.location.href = role === 'receiver' ? 'search.html' : 'dashboard.html';
          }, 1000);
          return result.user;
        }
      } catch (e) {
        if (e.status === 409) {
          App.showToast(e.message, 'error');
          return null;
        }
        console.warn('[Auth] API register fallback:', e.message);
      }
    }

    // 2. Compute geographic coordinates for mapping
    const coords = (typeof DemoData !== 'undefined' && DemoData.getCoordsForCity)
      ? DemoData.getCoordsForCity(data.city)
      : { lat: 13.0827, lng: 80.2707 };

    const uid = role + '_' + Date.now();
    const userProfile = {
      uid,
      email: emailClean,
      password: data.password,
      displayName: data.fullName,
      fullName: data.fullName,
      phoneNumber: data.phone,
      phone: data.phone,
      bloodGroup: data.bloodGroup || 'O+',
      gender: data.gender || 'Male',
      age: parseInt(data.age) || 21,
      city: data.city || 'Chennai',
      address: `${data.city || 'Chennai'}, India`,
      lastDonation: data.lastDonation || 'Never',
      role: role,
      availability: true,
      verified: true,
      lat: coords.lat,
      lng: coords.lng,
      createdAt: new Date().toISOString()
    };

    // For receivers, also store what blood group they need
    if (role === 'receiver') {
      userProfile.bloodGroupNeeded = data.bloodGroupNeeded || data.bloodGroup || 'O+';
      userProfile.hospital = data.hospital || '';
    }

    // Save to local data store
    if (role === 'receiver') {
      DemoData.saveReceiverPassword(emailClean, data.password, uid);
      await DemoData.addReceiver(userProfile);
    } else {
      DemoData.saveDonorPassword(emailClean, data.password, uid);
      await DemoData.addDonor(userProfile);
    }

    // Save active session
    localStorage.setItem('lifelink_user', JSON.stringify(userProfile));
    this.currentUser = userProfile;

    // Sync to Shared Cloud Firestore (lifelink-app-9315f) for Web & Mobile
    if (typeof db !== 'undefined' && db) {
      try {
        const collectionName = role === 'receiver' ? 'receivers' : 'donors';
        const fsPayload = {
          ...userProfile,
          contactNumber: userProfile.phone || '',
          latitude: userProfile.lat,
          longitude: userProfile.lng,
          createdAt: (typeof firebase !== 'undefined' && firebase.firestore?.FieldValue)
            ? firebase.firestore.FieldValue.serverTimestamp()
            : new Date().toISOString()
        };
        await db.collection(collectionName).doc(userProfile.uid).set(fsPayload, { merge: true });
        await db.collection('users').doc(userProfile.uid).set(fsPayload, { merge: true });
        console.log('🔥 User profile synced to Firestore:', userProfile.uid);
      } catch (e) {
        console.warn('[Auth] Firestore direct save notice:', e.message);
      }
    }

    // Try Firebase Auth in background if available
    if (typeof auth !== 'undefined' && auth) {
      try {
        const cred = await auth.createUserWithEmailAndPassword(data.email, data.password);
        if (cred?.user) {
          await cred.user.updateProfile({ displayName: data.fullName });
        }
      } catch (e) {
        console.warn('[Auth] Firebase Auth background notice:', e.message);
      }
    }

    App.showToast(`Account created successfully! 🎉 Welcome to LifeLink (${role.toUpperCase()})`, 'success');
    setTimeout(() => {
      window.location.href = role === 'receiver' ? 'search.html' : 'dashboard.html';
    }, 1000);
    return userProfile;
  },

  // ── Unified Login with role awareness ──
  async login(email, password, roleHint = 'donor') {
    const emailLower = (email || '').trim().toLowerCase();

    if (!password || password.length < 8 || password.length > 12) {
      App.showToast('Password must be between 8 and 12 characters.', 'error');
      return null;
    }

    // 1. Authenticate against SQLite database via API (primary for PDD)
    if (typeof LifeLinkAPI !== 'undefined') {
      try {
        const result = await LifeLinkAPI.login(email, password, roleHint);
        if (result.user) {
          localStorage.setItem('lifelink_user', JSON.stringify(result.user));
          this.currentUser = result.user;
          let dest = 'dashboard.html';
          if (result.user.role === 'admin') dest = 'admin.html';
          else if (result.user.role === 'receiver') dest = 'search.html';
          App.showToast(`Welcome back, ${result.user.displayName || 'User'}! (Database login)`, 'success');
          setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get('redirect');
            window.location.href = redirect || dest;
          }, 800);
          return result.user;
        }
      } catch (e) {
        if (e.status === 401 || e.status === 403) {
          App.showToast(e.message, 'error');
          return null;
        }
        console.warn('[Auth] API login fallback:', e.message);
      }
    }

    // 2. Admin login (hardcoded credentials only)
    if (roleHint === 'admin') {
      const adminResult = await this.loginAdmin(emailLower, password);
      if (adminResult) return adminResult;
      App.showToast('Invalid admin credentials. Access denied.', 'error');
      return null;
    }

    // 3. Receiver login
    if (roleHint === 'receiver') {
      const receiverResult = await this.loginReceiver(emailLower, password);
      if (receiverResult) return receiverResult;
      App.showToast('Invalid email or password. Please check your credentials or register first.', 'error');
      return null;
    }

    // 4. Donor login
    const donorResult = await this.loginDonor(emailLower, password);
    if (donorResult) return donorResult;

    App.showToast('Invalid email or password. Please check your credentials or register first.', 'error');
    return null;
  },

  // ── Dedicated Donor Login ──
  async loginDonor(email, password) {
    const emailLower = email.trim().toLowerCase();
    const passwords = DemoData.getDonorPasswords();
    const localCred = passwords[emailLower];

    if (localCred && localCred.password === password) {
      try {
        const donors = await DemoData.getDonors();
        let donor = donors.find(d => d.email && d.email.toLowerCase() === emailLower);
        if (!donor) {
          donor = {
            uid: localCred.uid || 'donor_' + Date.now(),
            email: emailLower,
            displayName: emailLower.split('@')[0],
            role: 'donor',
            bloodGroup: 'O+',
            city: 'Chennai',
            availability: true,
            verified: true
          };
          await DemoData.addDonor(donor);
        }

        localStorage.setItem('lifelink_user', JSON.stringify(donor));
        this.currentUser = donor;
        App.showToast(`Welcome back, ${donor.displayName || 'Donor'}! 🩸`, 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
        return donor;
      } catch (err) {
        console.warn('[Auth] Donor lookup error:', err);
      }
    }

    // Check direct donor list fallback
    try {
      const donors = await DemoData.getDonors();
      const donor = donors.find(d => d.email && d.email.toLowerCase() === emailLower);
      if (donor && (!donor.password || donor.password === password)) {
        DemoData.saveDonorPassword(emailLower, password, donor.uid);
        localStorage.setItem('lifelink_user', JSON.stringify(donor));
        this.currentUser = donor;
        App.showToast(`Welcome back, ${donor.displayName || 'Donor'}! 🩸`, 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
        return donor;
      }
    } catch (e) {
      console.warn('[Auth] Donor list fallback error:', e);
    }

    return null;
  },

  // ── Dedicated Receiver Login ──
  async loginReceiver(email, password) {
    const emailLower = email.trim().toLowerCase();
    const passwords = DemoData.getReceiverPasswords();
    const localCred = passwords[emailLower];

    if (localCred && localCred.password === password) {
      try {
        const receivers = await DemoData.getReceivers();
        let receiver = receivers.find(r => r.email && r.email.toLowerCase() === emailLower);
        if (!receiver) {
          receiver = {
            uid: localCred.uid || 'receiver_' + Date.now(),
            email: emailLower,
            displayName: emailLower.split('@')[0],
            role: 'receiver',
            city: 'Chennai',
            verified: true
          };
          await DemoData.addReceiver(receiver);
        }

        localStorage.setItem('lifelink_user', JSON.stringify(receiver));
        this.currentUser = receiver;
        App.showToast(`Welcome back, ${receiver.displayName || 'Receiver'}! 🔍`, 'success');
        setTimeout(() => {
          window.location.href = 'search.html';
        }, 800);
        return receiver;
      } catch (err) {
        console.warn('[Auth] Receiver lookup error:', err);
      }
    }

    // Check direct receiver list fallback
    try {
      const receivers = await DemoData.getReceivers();
      const receiver = receivers.find(r => r.email && r.email.toLowerCase() === emailLower);
      if (receiver && (!receiver.password || receiver.password === password)) {
        DemoData.saveReceiverPassword(emailLower, password, receiver.uid);
        localStorage.setItem('lifelink_user', JSON.stringify(receiver));
        this.currentUser = receiver;
        App.showToast(`Welcome back, ${receiver.displayName || 'Receiver'}! 🔍`, 'success');
        setTimeout(() => {
          window.location.href = 'search.html';
        }, 800);
        return receiver;
      }
    } catch (e) {
      console.warn('[Auth] Receiver list fallback error:', e);
    }

    return null;
  },

  // ── Dedicated Admin Login (Hardcoded Only) ──
  async loginAdmin(email, password) {
    const emailLower = email.trim().toLowerCase();

    // Only hardcoded admin credentials work
    if (emailLower === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const admins = await DemoData.getAdmins();
      const admin = admins.find(a => a.email && a.email.toLowerCase() === ADMIN_EMAIL) || {
        uid: 'sameer_admin',
        email: ADMIN_EMAIL,
        displayName: 'Sameer Admin',
        fullName: 'Sameer Admin',
        role: 'admin',
        permissions: ['all', 'manage_users', 'manage_requests', 'broadcast'],
        verified: true
      };

      localStorage.setItem('lifelink_user', JSON.stringify(admin));
      this.currentUser = admin;
      App.showToast(`Admin Authenticated! Welcome, ${admin.displayName} 🔐`, 'success');
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 800);
      return admin;
    }

    return null;
  },

  // ── Logout ──
  async logout() {
    localStorage.removeItem('lifelink_user');
    if (typeof LifeLinkAPI !== 'undefined') LifeLinkAPI.setToken(null);
    this.currentUser = null;
    const isLive = typeof DEMO_MODE !== 'undefined' ? !DEMO_MODE : (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0);
    if (isLive && typeof auth !== 'undefined' && auth) {
      try { await auth.signOut(); } catch (err) { /* ignore */ }
    }
    window.location.href = 'login.html';
  },

  // ── Update profile ──
  async updateProfile(data) {
    try {
      // Validate Last Donation Date
      if (data.lastDonation && data.lastDonation !== 'Never') {
        const d = new Date(data.lastDonation);
        if (isNaN(d.getTime())) {
          App.showToast('Please enter a valid last donation date (YYYY-MM-DD)', 'error');
          return null;
        }
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (d > today) {
          App.showToast('Last donation date cannot be in the future.', 'error');
          return null;
        }
      }

      const uid = this.currentUser?.uid;

      // 1. Sync to SQLite Backend Database via API
      if (typeof LifeLinkAPI !== 'undefined' && uid) {
        try {
          await LifeLinkAPI.updateUser(uid, data);
        } catch (apiErr) {
          console.warn('[Auth] SQLite updateUser notice:', apiErr.message);
        }
      }

      // 2. Sync to Firebase Firestore if initialized
      if (typeof db !== 'undefined' && db && uid) {
        try {
          await db.collection('users').doc(uid).set(data, { merge: true });
          if (this.currentUser?.role === 'donor') {
            await db.collection('donors').doc(uid).set(data, { merge: true });
          }
        } catch (fsErr) {
          console.warn('[Auth] Firestore updateUser notice:', fsErr.message);
        }
      }

      // 3. Update Current Local State
      const updatedUser = { ...this.currentUser, ...data };
      localStorage.setItem('lifelink_user', JSON.stringify(updatedUser));
      this.currentUser = updatedUser;

      // 4. Update Local Memory/Storage Cache
      try {
        if (typeof DemoData !== 'undefined' && uid) {
          await DemoData.updateUser(uid, data);
        }
      } catch (e) { /* ignore */ }

      App.showToast('Profile and database updated successfully! ✅', 'success');
      return updatedUser;
    } catch (e) {
      App.showToast(e.message || 'Update failed', 'error');
      return null;
    }
  },


  // ── Update UI based on auth state ──
  updateUI(user) {
    const authBtns  = document.querySelectorAll('.auth-btn');
    const userBtns  = document.querySelectorAll('.user-btn');
    const userNames = document.querySelectorAll('.user-name');

    authBtns.forEach(el => el.style.display  = user ? 'none' : '');
    userBtns.forEach(el => el.style.display  = user ? '' : 'none');
    userNames.forEach(el => {
      if (user) el.textContent = user.displayName || user.email?.split('@')[0] || 'User';
    });
  },

  // ── Require auth (redirect to login if not logged in) ──
  async requireAuth(callback) {
    const redirectToLogin = () => {
      const page = window.location.pathname.split('/').pop() || 'index.html';
      window.location.replace(`login.html?redirect=${encodeURIComponent(page)}`);
      return false;
    };

    const token = typeof LifeLinkAPI !== 'undefined' ? LifeLinkAPI.getToken() : null;
    const savedUser = localStorage.getItem('lifelink_user');

    // Validate session with database when token exists
    if (token && typeof LifeLinkAPI !== 'undefined') {
      try {
        const result = await LifeLinkAPI.me();
        if (result.user) {
          this.currentUser = result.user;
          localStorage.setItem('lifelink_user', JSON.stringify(result.user));
          if (callback) callback(this.currentUser);
          return true;
        }
      } catch (e) {
        LifeLinkAPI.setToken(null);
        localStorage.removeItem('lifelink_user');
        App.showToast('Session expired. Please login again.', 'warning');
        return redirectToLogin();
      }
    }

    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
        if (callback) callback(this.currentUser);
        return true;
      } catch (e) {
        localStorage.removeItem('lifelink_user');
      }
    }

    return redirectToLogin();
  },

  // ── Require admin ──
  requireAdmin(callback) {
    this.requireAuth(user => {
      if (user.role === 'admin') {
        if (callback) callback(user);
      } else {
        App.showToast('Access denied. Admin portal only.', 'error');
        setTimeout(() => window.location.replace('dashboard.html'), 1000);
      }
    });
  }
};
