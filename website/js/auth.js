// ============================================
// LIFELINK – Authentication Module
// Distinct Admin & Donor Authentication
// ============================================

// Admin secret code for registration
const ADMIN_SECRET_CODE = 'ADMIN-SECURE';

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
    'auth/user-disabled':         'This account has been disabled. Contact support.',
    'auth/popup-closed-by-user':  'Google sign-in was cancelled.'
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

  // ── Sign up (automatically routes to donor or admin section) ──
  async signup(data) {
    const isAdmin = (data.adminCode && data.adminCode === ADMIN_SECRET_CODE);
    const role = isAdmin ? 'admin' : 'donor';
    const emailClean = data.email.trim().toLowerCase();

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
          adminCode: data.adminCode,
          role: isAdmin ? 'admin' : 'donor'
        });
        if (result.user) {
          localStorage.setItem('lifelink_user', JSON.stringify(result.user));
          this.currentUser = result.user;
          App.showToast(`Account created in database! Welcome (${role.toUpperCase()})`, 'success');
          setTimeout(() => {
            window.location.href = role === 'admin' ? 'admin.html' : 'dashboard.html';
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
      : { lat: 20.5937, lng: 78.9629 };

    const uid = (isAdmin ? 'admin_' : 'donor_') + Date.now();
    const userProfile = {
      uid,
      email: emailClean,
      password: data.password, // saved in profile record
      displayName: data.fullName,
      fullName: data.fullName,
      phoneNumber: data.phone,
      phone: data.phone,
      bloodGroup: data.bloodGroup || 'O+',
      gender: data.gender || 'Male',
      age: parseInt(data.age) || 21,
      city: data.city || 'India',
      address: `${data.city || 'India'}, India`,
      lastDonation: data.lastDonation || 'Never',
      role: role,
      availability: true,
      verified: true,
      lat: coords.lat,
      lng: coords.lng,
      createdAt: new Date().toISOString()
    };

    // Save credentials into the respective section's credential store
    if (isAdmin) {
      DemoData.saveAdminPassword(emailClean, data.password, uid);
      await DemoData.addAdmin(userProfile);
    } else {
      DemoData.saveDonorPassword(emailClean, data.password, uid);
      await DemoData.addDonor(userProfile);
    }

    // Save active session
    localStorage.setItem('lifelink_user', JSON.stringify(userProfile));
    this.currentUser = userProfile;

    // Try Firebase in background if configured and not DEMO_MODE
    if (!DEMO_MODE && typeof auth !== 'undefined' && auth && typeof db !== 'undefined' && db) {
      try {
        const cred = await auth.createUserWithEmailAndPassword(data.email, data.password);
        await cred.user.updateProfile({ displayName: data.fullName });
        const collectionName = isAdmin ? 'admins' : 'donors';
        await db.collection(collectionName).doc(cred.user.uid).set({
          ...userProfile,
          uid: cred.user.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        await db.collection('users').doc(cred.user.uid).set({
          ...userProfile,
          uid: cred.user.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      } catch (e) {
        console.warn('[Auth] Firebase background sync notice:', e.code);
      }
    }

    App.showToast(`Account created successfully! 🎉 Welcome to LifeLink (${role.toUpperCase()})`, 'success');
    setTimeout(() => {
      window.location.href = role === 'admin' ? 'admin.html' : 'dashboard.html';
    }, 1000);
    return userProfile;
  },

  // ── Unified Login with role awareness ──
  async login(email, password, roleHint = 'donor') {
    const emailLower = email.trim().toLowerCase();

    // 1. Authenticate against SQLite database via API (primary for PDD)
    if (typeof LifeLinkAPI !== 'undefined') {
      try {
        const result = await LifeLinkAPI.login(email, password, roleHint);
        if (result.user) {
          localStorage.setItem('lifelink_user', JSON.stringify(result.user));
          this.currentUser = result.user;
          const dest = result.user.role === 'admin' ? 'admin.html' : 'dashboard.html';
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

    // 2. If role is explicitly admin or email indicates admin
    if (roleHint === 'admin' || emailLower.includes('admin')) {
      const adminResult = await this.loginAdmin(emailLower, password);
      if (adminResult) return adminResult;
    }

    // 2. Otherwise try donor login
    const donorResult = await this.loginDonor(emailLower, password);
    if (donorResult) return donorResult;

    // 3. Fallback: try admin login if donor failed and no explicit restriction
    if (roleHint !== 'donor') {
      const adminFallback = await this.loginAdmin(emailLower, password);
      if (adminFallback) return adminFallback;
    }

    App.showToast('Invalid email or password. Please check your credentials.', 'error');
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
            bloodGroup: 'B-',
            city: 'India',
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

  // ── Dedicated Admin Login ──
  async loginAdmin(email, password) {
    const emailLower = email.trim().toLowerCase();
    const passwords = DemoData.getAdminPasswords();
    const localCred = passwords[emailLower];

    if (localCred && localCred.password === password) {
      try {
        const admins = await DemoData.getAdmins();
        let admin = admins.find(a => a.email && a.email.toLowerCase() === emailLower);
        if (!admin) {
          admin = {
            uid: localCred.uid || 'admin_' + Date.now(),
            email: emailLower,
            displayName: 'Admin User',
            role: 'admin',
            permissions: ['all'],
            verified: true
          };
          await DemoData.addAdmin(admin);
        }

        localStorage.setItem('lifelink_user', JSON.stringify(admin));
        this.currentUser = admin;
        App.showToast(`Admin Authenticated! Welcome, ${admin.displayName} 🔐`, 'success');
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 800);
        return admin;
      } catch (err) {
        console.warn('[Auth] Admin lookup error:', err);
      }
    }

    // Check direct admin list fallback
    try {
      const admins = await DemoData.getAdmins();
      const admin = admins.find(a => a.email && a.email.toLowerCase() === emailLower);
      if (admin && (!admin.password || admin.password === password)) {
        DemoData.saveAdminPassword(emailLower, password, admin.uid);
        localStorage.setItem('lifelink_user', JSON.stringify(admin));
        this.currentUser = admin;
        App.showToast(`Admin Authenticated! Welcome, ${admin.displayName} 🔐`, 'success');
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 800);
        return admin;
      }
    } catch (e) {
      console.warn('[Auth] Admin list fallback error:', e);
    }

    return null;
  },

  // ── Login with Google ──
  async loginWithGoogle(accountOverride = null) {
    const isLive = typeof DEMO_MODE !== 'undefined' ? !DEMO_MODE : (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0);
    let googleUser = null;

    // 1. Try Firebase Google Popup if no override specified and live Firebase auth is present
    if (!accountOverride && isLive && typeof firebase !== 'undefined' && firebase.auth && typeof auth !== 'undefined' && auth) {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const res = await auth.signInWithPopup(provider);
        const gUser = res.user;

        googleUser = {
          uid: 'g_' + gUser.uid,
          email: gUser.email,
          displayName: gUser.displayName || 'Google User',
          fullName: gUser.displayName || 'Google User',
          photoURL: gUser.photoURL || '',
          phone: gUser.phoneNumber || '',
          role: 'donor',
          bloodGroup: 'B-',
          city: 'India',
          availability: true,
          verified: true,
          provider: 'google.com'
        };
      } catch (err) {
        if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
          console.log('[Auth] Google popup closed by user.');
          return null;
        }
        console.warn('[Auth] Firebase Google login notice:', err);
      }
    }

    // 2. If accountOverride was provided or popup was bypassed
    if (!googleUser) {
      const email = (accountOverride && accountOverride.email) ? accountOverride.email.trim().toLowerCase() : 'donor@gmail.com';
      const name = (accountOverride && accountOverride.name) ? accountOverride.name : email.split('@')[0];
      const isAdmin = (accountOverride && accountOverride.role === 'admin') || email.includes('admin');
      const role = isAdmin ? 'admin' : 'donor';

      googleUser = {
        uid: (isAdmin ? 'admin_g_' : 'donor_g_') + Date.now(),
        email: email,
        displayName: name,
        fullName: name,
        phone: (accountOverride && accountOverride.phone) || '+91-9876543210',
        bloodGroup: (accountOverride && accountOverride.bloodGroup) || (isAdmin ? 'O+' : 'B-'),
        gender: 'Male',
        age: 21,
        city: (accountOverride && accountOverride.city) || 'India',
        address: `${(accountOverride && accountOverride.city) || 'India'}, India`,
        role: role,
        availability: true,
        verified: true,
        provider: 'google.com',
        createdAt: new Date().toISOString()
      };
    }

    // A. Save to SQLite Database via API
    if (typeof LifeLinkAPI !== 'undefined') {
      try {
        const apiRes = await LifeLinkAPI.googleAuth(googleUser);
        if (apiRes && apiRes.user) {
          googleUser = { ...googleUser, ...apiRes.user };
        }
      } catch (e) {
        console.warn('[Auth] SQLite Google sync fallback:', e.message);
      }
    }

    // B. Save to Firebase Firestore
    if (typeof db !== 'undefined' && db) {
      try {
        const collectionName = googleUser.role === 'admin' ? 'admins' : 'donors';
        await db.collection(collectionName).doc(googleUser.uid).set(googleUser, { merge: true });
        await db.collection('users').doc(googleUser.uid).set(googleUser, { merge: true });
        console.log(`🔥 Google user saved to Firestore database (${collectionName})`);
      } catch (e) {
        console.warn('[Auth] Firestore Google sync notice:', e.message);
      }
    }

    // C. Save to Local Demo Data
    if (typeof DemoData !== 'undefined') {
      const coords = DemoData.getCoordsForCity(googleUser.city);
      googleUser.lat = coords.lat;
      googleUser.lng = coords.lng;
      if (googleUser.role === 'admin') {
        await DemoData.addAdmin(googleUser);
      } else {
        await DemoData.addDonor(googleUser);
      }
    }

    // Persist login session
    localStorage.setItem('lifelink_user', JSON.stringify(googleUser));
    this.currentUser = googleUser;

    const dest = googleUser.role === 'admin' ? 'admin.html' : 'dashboard.html';
    App.showToast(`Signed in as ${googleUser.displayName} with Google! 🌐 (Saved to Database)`, 'success');
    setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      window.location.href = redirect || dest;
    }, 800);

    return googleUser;
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
      if (!DEMO_MODE && typeof auth !== 'undefined' && auth && auth.currentUser && typeof db !== 'undefined' && db) {
        await db.collection('users').doc(auth.currentUser.uid).update(data);
      }
      const user = { ...this.currentUser, ...data };
      localStorage.setItem('lifelink_user', JSON.stringify(user));
      this.currentUser = user;
      try {
        if (typeof DemoData !== 'undefined') {
          await DemoData.updateUser(user.uid, data);
        }
      } catch (e) { /* ignore */ }
      App.showToast('Profile updated successfully!', 'success');
      return user;
    } catch (e) {
      App.showToast(e.message || 'Update failed', 'error');
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
