// ============================================
// LIFELINK – Main Application Controller
// Smooth Micro-Animations & Interactivity
// ============================================

const App = {
  init() {
    this.initTheme();
    this.initNav();
    this.initModals();
    this.initAccordions();
    this.initScrollAnimations();
    this.initToggles();
    this.initClickFeedback();
    this.initRealTimeStats();
    Auth.init();
  },

  // --- Smooth Tactile Click & Ripple Animations ---
  initClickFeedback() {
    document.addEventListener('pointerdown', (e) => {
      const target = e.target.closest('.btn, .blood-chip, .tab, .tab-btn, .map-ctrl-btn, .user-action-btn, .geo-small-btn');
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      const isLightBg = target.classList.contains('btn-white') || target.classList.contains('btn-outline');
      circle.className = `ll-ripple ${isLightBg ? 'll-ripple-dark' : ''}`;
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;

      // Remove existing ripples
      const existing = target.querySelectorAll('.ll-ripple');
      existing.forEach(r => r.remove());

      target.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 600);
    });
  },

  // --- Theme ---
  initTheme() {
    const saved = localStorage.getItem('lifelink_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.innerHTML = saved === 'dark' ? '☀️' : '🌙';
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('lifelink_theme', next);
        toggle.innerHTML = next === 'dark' ? '☀️' : '🌙';
      });
    }
  },

  // --- Navigation ---
  initNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
      });
      // Close on link click
      navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => navLinks.classList.remove('active'));
      });
    }
    // Active link
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .sidebar-link').forEach(a => {
      const href = a.getAttribute('href');
      if (href === current) a.classList.add('active');
    });
    // Sidebar toggle on mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }
  },

  // --- Modals with Smooth Backdrop Click ---
  initModals() {
    document.querySelectorAll('[data-modal]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const modal = document.getElementById(trigger.dataset.modal);
        if (modal) modal.classList.add('active');
      });
    });
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal-overlay').classList.remove('active');
      });
    });
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    });
  },

  // --- Accordions ---
  initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const wasActive = item.classList.contains('active');
        // Close all siblings
        item.parentElement.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
      });
    });
  },

  // --- Scroll Animations ---
  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  },

  // --- Toggle Switches ---
  initToggles() {
    document.querySelectorAll('.toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        const event = new CustomEvent('toggle-change', { detail: { active: toggle.classList.contains('active') } });
        toggle.dispatchEvent(event);
      });
    });
    // Availability toggle
    const availToggle = document.getElementById('availabilityToggle');
    if (availToggle) {
      const user = Auth.currentUser;
      if (user?.availability) availToggle.classList.add('active');
      availToggle.addEventListener('toggle-change', async (e) => {
        const isAvailable = e.detail.active;
        if (Auth.currentUser) {
          Auth.currentUser.availability = isAvailable;
          localStorage.setItem('lifelink_user', JSON.stringify(Auth.currentUser));
          try {
            await DemoData.updateUser(Auth.currentUser.uid, { availability: isAvailable });
          } catch(err) { console.error(err); }
        }
        this.showToast(isAvailable ? 'You are now available for donation' : 'You are now set as unavailable', 'info');
      });
    }
  },

  // --- Toast Notifications ---
  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || ''}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px) scale(0.9)';
      setTimeout(() => toast.remove(), 320);
    }, 4000);
  },

  // --- Time Ago ---
  timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  },

  // --- Real-Time Live Stats Sync ---
  async initRealTimeStats() {
    try {
      if (typeof DemoData === 'undefined') {
        this.animateCounters();
        return;
      }
      const [donors, hospitals, banks, reqs] = await Promise.all([
        DemoData.getDonors(),
        DemoData.getHospitals(),
        DemoData.getBloodBanks(),
        DemoData.getEmergencyRequests()
      ]);

      const donorsEl = document.getElementById('liveHeroDonors');
      const hospEl = document.getElementById('liveHeroHospitals');
      const banksEl = document.getElementById('liveHeroBanks');
      const sosEl = document.getElementById('liveHeroSos');

      if (donorsEl && donors) donorsEl.dataset.count = donors.length;
      if (hospEl && hospitals) hospEl.dataset.count = hospitals.length;
      if (banksEl && banks) banksEl.dataset.count = banks.length;
      if (sosEl && reqs) sosEl.dataset.count = reqs.filter(r => r.status === 'active' || !r.status).length;

      this.animateCounters();
    } catch(e) {
      console.log('Real-time stats load error:', e);
      this.animateCounters();
    }
  },

  // --- Counter Animation ---
  animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count) || 0;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current.toLocaleString() + (el.dataset.suffix || '');
      }, 30);
    });
  },

  // --- Tabs with Tactile Transition ---
  initTabs(container) {
    const tabContainer = document.querySelector(container);
    if (!tabContainer) return;
    const tabs = tabContainer.querySelectorAll('.tab, .tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(c => {
          c.style.display = c.id === target ? 'block' : 'none';
        });
      });
    });
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());

// ============================================
// PWA – Service Worker, Install Prompt & Status
// ============================================

const PWA = {
  deferredPrompt: null,

  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupOnlineStatus();
    this.setupStandaloneMode();
  },

  // --- Register Service Worker ---
  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.warn('[PWA] Service Workers not supported');
      return;
    }
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      console.log('[PWA] Service Worker registered:', reg.scope);

      // Check for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            App.showToast('App updated! Refresh to see changes.', 'info');
          }
        });
      });
    } catch (err) {
      console.error('[PWA] Service Worker registration failed:', err);
    }
  },

  // --- Install Prompt ---
  setupInstallPrompt() {
    // Capture the install prompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      // Only show if user hasn't dismissed before
      if (!localStorage.getItem('lifelink_install_dismissed')) {
        this.showInstallBanner();
      }
    });

    // Track successful installs
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.hideInstallBanner();
      App.showToast('🎉 LifeLink installed successfully!', 'success');
      localStorage.setItem('lifelink_installed', 'true');
    });
  },

  showInstallBanner() {
    // Don't show if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (document.querySelector('.pwa-install-banner')) return;

    const banner = document.createElement('div');
    banner.className = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="pwa-install-content">
        <div class="pwa-install-icon">🩸</div>
        <div class="pwa-install-text">
          <strong>Install LifeLink</strong>
          <span>Add to home screen for the best experience</span>
        </div>
        <div class="pwa-install-actions">
          <button class="pwa-install-btn" id="pwaInstallBtn">Install</button>
          <button class="pwa-install-close" id="pwaCloseBtn">✕</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        banner.classList.add('active');
      });
    });

    // Install button
    document.getElementById('pwaInstallBtn').addEventListener('click', async () => {
      if (!this.deferredPrompt) return;
      this.deferredPrompt.prompt();
      const result = await this.deferredPrompt.userChoice;
      console.log('[PWA] Install result:', result.outcome);
      this.deferredPrompt = null;
      this.hideInstallBanner();
    });

    // Close button
    document.getElementById('pwaCloseBtn').addEventListener('click', () => {
      this.hideInstallBanner();
      localStorage.setItem('lifelink_install_dismissed', Date.now().toString());
    });
  },

  hideInstallBanner() {
    const banner = document.querySelector('.pwa-install-banner');
    if (banner) {
      banner.classList.remove('active');
      setTimeout(() => banner.remove(), 400);
    }
  },

  // --- Online / Offline Status ---
  setupOnlineStatus() {
    window.addEventListener('online', () => {
      App.showToast('✅ You\'re back online!', 'success');
      document.body.classList.remove('is-offline');
    });

    window.addEventListener('offline', () => {
      App.showToast('📡 You\'re offline. Some features may be limited.', 'warning');
      document.body.classList.add('is-offline');
    });

    // Set initial state
    if (!navigator.onLine) {
      document.body.classList.add('is-offline');
    }
  },

  // --- Standalone Mode Enhancements ---
  setupStandaloneMode() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone === true;

    if (isStandalone) {
      document.body.classList.add('pwa-standalone');
      this.addBottomNav();
    }
  },

  // --- Bottom Navigation for Installed App ---
  addBottomNav() {
    if (document.querySelector('.pwa-bottom-nav')) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const nav = document.createElement('nav');
    nav.className = 'pwa-bottom-nav';
    nav.innerHTML = `
      <a href="index.html" class="pwa-nav-item ${currentPage === 'index.html' ? 'active' : ''}">
        <span class="pwa-nav-icon">🏠</span>
        <span class="pwa-nav-label">Home</span>
      </a>
      <a href="search.html" class="pwa-nav-item ${currentPage === 'search.html' ? 'active' : ''}">
        <span class="pwa-nav-icon">🔍</span>
        <span class="pwa-nav-label">Donors</span>
      </a>
      <a href="emergency.html" class="pwa-nav-item pwa-nav-emergency ${currentPage === 'emergency.html' ? 'active' : ''}">
        <span class="pwa-nav-icon">🚨</span>
        <span class="pwa-nav-label">SOS</span>
      </a>
      <a href="hospitals.html" class="pwa-nav-item ${currentPage === 'hospitals.html' ? 'active' : ''}">
        <span class="pwa-nav-icon">🏥</span>
        <span class="pwa-nav-label">Hospitals</span>
      </a>
      <a href="dashboard.html" class="pwa-nav-item ${currentPage === 'dashboard.html' ? 'active' : ''}">
        <span class="pwa-nav-icon">👤</span>
        <span class="pwa-nav-label">Profile</span>
      </a>
    `;
    document.body.appendChild(nav);
  }
};

// Initialize PWA on load
document.addEventListener('DOMContentLoaded', () => PWA.init());
