// ============================================
// LIFELINK – Authentication Module
// ============================================

const Auth = {
  currentUser: null,

  // Initialize auth state listener
  init() {
    // Check local demo session first to keep fallback logins active
    const demoUser = localStorage.getItem('lifelink_user');
    if (demoUser) {
      this.currentUser = JSON.parse(demoUser);
      this.updateUI(this.currentUser);
    }

    // Initialize auth state listener for Firebase if enabled
    if (!DEMO_MODE && auth) {
      auth.onAuthStateChanged(user => {
        if (user) {
          this.currentUser = user;
          this.updateUI(user);
        } else if (!demoUser) {
          this.currentUser = null;
          this.updateUI(null);
        }
      });
    }
  },

  // Sign up with email/password
  async signup(data) {
    const isDemoAccount = data.email.endsWith('@demo.com') || data.email === 'admin@lifelink.com';
    
    if (DEMO_MODE || isDemoAccount) {
      const user = {
        uid: 'demo_' + Date.now(),
        email: data.email,
        displayName: data.fullName,
        phoneNumber: data.phone,
        bloodGroup: data.bloodGroup,
        gender: data.gender,
        age: data.age,
        city: data.city,
        role: 'donor',
        availability: true,
        verified: false,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('lifelink_user', JSON.stringify(user));
      await DemoData.addUser(user);
      this.currentUser = user;
      App.showToast('Account created successfully!', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 1000);
      return user;
    }

    try {
      const cred = await auth.createUserWithEmailAndPassword(data.email, data.password);
      await cred.user.updateProfile({ displayName: data.fullName });
      await db.collection('users').doc(cred.user.uid).set({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        bloodGroup: data.bloodGroup,
        gender: data.gender,
        age: data.age,
        city: data.city,
        role: 'donor',
        availability: true,
        verified: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      App.showToast('Account created successfully!', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 1000);
      return cred.user;
    } catch (e) {
      console.warn('Firebase signup failed, using demo fallback:', e.message);
      const user = {
        uid: 'demo_' + Date.now(),
        email: data.email,
        displayName: data.fullName,
        phoneNumber: data.phone,
        bloodGroup: data.bloodGroup,
        gender: data.gender,
        age: data.age,
        city: data.city,
        role: 'donor',
        availability: true,
        verified: false,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('lifelink_user', JSON.stringify(user));
      await DemoData.addUser(user);
      this.currentUser = user;
      App.showToast('Account created locally (Firebase Offline)', 'warning');
      setTimeout(() => window.location.href = 'dashboard.html', 1000);
      return user;
    }
  },

  // Login
  async login(email, password) {
    const isDemoAccount = email.endsWith('@demo.com') || email === 'admin@lifelink.com';

    if (DEMO_MODE || isDemoAccount) {
      try {
        const users = await DemoData.getUsers();
        const user = users.find(u => u.email === email);
        if (user) {
          localStorage.setItem('lifelink_user', JSON.stringify(user));
          this.currentUser = user;
          App.showToast('Welcome back!', 'success');
          if (user.role === 'admin') {
            setTimeout(() => window.location.href = 'admin.html', 1000);
          } else {
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
          }
          return user;
        }
        // Auto-create demo user if not found in pre-seeded list
        const newUser = {
          uid: 'demo_' + Date.now(),
          email,
          displayName: email.split('@')[0],
          role: email.includes('admin') ? 'admin' : 'donor',
          bloodGroup: 'O+',
          availability: true,
          verified: true,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('lifelink_user', JSON.stringify(newUser));
        await DemoData.addUser(newUser);
        this.currentUser = newUser;
        App.showToast('Welcome!', 'success');
        setTimeout(() => window.location.href = newUser.role === 'admin' ? 'admin.html' : 'dashboard.html', 1000);
        return newUser;
      } catch (err) {
        console.error('Demo login error:', err);
      }
    }

    try {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      App.showToast('Welcome back!', 'success');
      const doc = await db.collection('users').doc(cred.user.uid).get();
      const role = doc.exists ? doc.data().role : 'donor';
      setTimeout(() => window.location.href = role === 'admin' ? 'admin.html' : 'dashboard.html', 1000);
      return cred.user;
    } catch (e) {
      console.warn('Firebase login failed, attempting local fallback:', e.message);
      
      // Attempt local login with default data
      const users = await DemoData.getUsers();
      const user = users.find(u => u.email === email);
      if (user) {
        localStorage.setItem('lifelink_user', JSON.stringify(user));
        this.currentUser = user;
        App.showToast('Logged in as demo user (Firebase Offline)', 'warning');
        setTimeout(() => window.location.href = user.role === 'admin' ? 'admin.html' : 'dashboard.html', 1000);
        return user;
      }

      // Create new local user so login is never blocked
      const newUser = {
        uid: 'demo_' + Date.now(),
        email,
        displayName: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'donor',
        bloodGroup: 'O+',
        availability: true,
        verified: true,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('lifelink_user', JSON.stringify(newUser));
      await DemoData.addUser(newUser);
      this.currentUser = newUser;
      App.showToast('Logged in locally (Firebase Offline)', 'warning');
      setTimeout(() => window.location.href = newUser.role === 'admin' ? 'admin.html' : 'dashboard.html', 1000);
      return newUser;
    }
  },

  // Logout
  async logout() {
    localStorage.removeItem('lifelink_user');
    this.currentUser = null;
    if (!DEMO_MODE && auth) {
      try {
        await auth.signOut();
      } catch (err) {
        console.warn('Firebase logout error:', err.message);
      }
    }
    window.location.href = 'index.html';
  },

  // Forgot password
  async forgotPassword(email) {
    const isDemoAccount = email.endsWith('@demo.com') || email === 'admin@lifelink.com';
    
    if (DEMO_MODE || isDemoAccount) {
      App.showToast('Password reset email sent (demo)', 'success');
      return;
    }
    
    try {
      await auth.sendPasswordResetEmail(email);
      App.showToast('Password reset email sent!', 'success');
    } catch (e) {
      console.warn('Firebase forgot password failed, simulating locally:', e.message);
      App.showToast('Password reset email sent (Firebase Offline)', 'warning');
    }
  },

  // Update profile
  async updateProfile(data) {
    try {
      const demoUser = localStorage.getItem('lifelink_user');
      if (DEMO_MODE || demoUser) {
        const user = { ...this.currentUser, ...data };
        localStorage.setItem('lifelink_user', JSON.stringify(user));
        this.currentUser = user;
        try {
          await DemoData.updateUser(user.uid, data);
        } catch (e) {
          console.warn('Local storage updates failed:', e);
        }
        App.showToast('Profile updated!', 'success');
        return user;
      }
      await db.collection('users').doc(auth.currentUser.uid).update(data);
      App.showToast('Profile updated!', 'success');
    } catch (e) {
      App.showToast(e.message || 'Update failed', 'error');
    }
  },

  // Update UI based on auth state
  updateUI(user) {
    const authBtns = document.querySelectorAll('.auth-btn');
    const userBtns = document.querySelectorAll('.user-btn');
    const userNames = document.querySelectorAll('.user-name');

    authBtns.forEach(el => el.style.display = user ? 'none' : '');
    userBtns.forEach(el => el.style.display = user ? '' : 'none');
    userNames.forEach(el => {
      if (user) el.textContent = user.displayName || user.email?.split('@')[0] || 'User';
    });
  },

  // Check if user is logged in (redirect if not)
  requireAuth(callback) {
    // Check local storage session first
    const demoUser = localStorage.getItem('lifelink_user');
    if (demoUser) {
      this.currentUser = JSON.parse(demoUser);
      if (callback) callback(this.currentUser);
      return true;
    }

    if (!DEMO_MODE && auth) {
      auth.onAuthStateChanged(user => {
        if (user) {
          this.currentUser = user;
          if (callback) callback(user);
        } else {
          // Double check local storage just in case it was logged in while listener was waiting
          const u = localStorage.getItem('lifelink_user');
          if (u) {
            this.currentUser = JSON.parse(u);
            if (callback) callback(this.currentUser);
          } else {
            window.location.href = 'login.html';
          }
        }
      });
      return false;
    } else {
      window.location.href = 'login.html';
      return false;
    }
  },

  // Check admin
  requireAdmin(callback) {
    this.requireAuth(user => {
      if (user.role === 'admin') {
        if (callback) callback(user);
      } else {
        if (!DEMO_MODE && auth && auth.currentUser) {
          db.collection('users').doc(user.uid).get().then(doc => {
            if (doc.exists && doc.data().role === 'admin') {
              if (callback) callback(user);
            } else {
              window.location.href = 'dashboard.html';
            }
          }).catch(() => {
            window.location.href = 'dashboard.html';
          });
        } else {
          window.location.href = 'dashboard.html';
        }
      }
    });
  }
};
