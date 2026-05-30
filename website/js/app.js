// ============================================
// LIFELINK – Main Application Controller
// ============================================

const App = {
  init() {
    this.initTheme();
    this.initNav();
    this.initModals();
    this.initAccordions();
    this.initScrollAnimations();
    this.initToggles();
    Auth.init();
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

  // --- Modals ---
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
      toast.style.transform = 'translateX(100px)';
      setTimeout(() => toast.remove(), 300);
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

  // --- Counter Animation ---
  animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      let current = 0;
      const step = Math.ceil(target / 50);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current.toLocaleString() + (el.dataset.suffix || '');
      }, 30);
    });
  },

  // --- Tabs ---
  initTabs(container) {
    const tabContainer = document.querySelector(container);
    if (!tabContainer) return;
    const tabs = tabContainer.querySelectorAll('.tab');
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
