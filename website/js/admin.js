// ============================================
// LIFELINK – Admin Panel Module
// ============================================

const Admin = {
  async init() {
    if (!Auth.requireAdmin()) return;
    await Promise.all([
      this.loadStats(),
      this.loadUsers(),
      this.loadRequests()
    ]);
    this.loadActivity();
    this.renderMiniCharts();
    this.bindBroadcast();
  },

  async loadStats() {
    try {
      const stats = await DemoData.getStats();
      const els = {
        totalUsers: document.getElementById('adminTotalUsers'),
        activeDonors: document.getElementById('adminActiveDonors'),
        activeRequests: document.getElementById('adminActiveRequests'),
        totalDonations: document.getElementById('adminTotalDonations')
      };
      if (els.totalUsers) els.totalUsers.textContent = stats.totalDonors || 0;
      if (els.activeDonors) els.activeDonors.textContent = stats.activeDonors || 0;
      if (els.activeRequests) els.activeRequests.textContent = stats.activeRequests || 0;
      if (els.totalDonations) els.totalDonations.textContent = stats.totalDonations || 0;
    } catch (e) { console.error(e); }
  },

  async loadUsers() {
    const container = document.getElementById('adminUsersList');
    if (!container) return;
    try {
      const allUsers = await DemoData.getUsers();
      const users = allUsers.filter(u => u.role !== 'admin');

      container.innerHTML = users.map(u => `
        <div class="user-row">
          <div class="user-avatar">${u.displayName?.charAt(0) || '?'}</div>
          <div class="user-info">
            <div class="user-name">${u.displayName} <span class="verify-badge ${u.verified ? 'verified' : 'unverified'}">${u.verified ? '✓ Verified' : '⏳ Pending'}</span></div>
            <div class="user-email">${u.email} · ${u.bloodGroup} · ${u.city || 'N/A'}</div>
          </div>
          <div class="user-actions">
            ${!u.verified ? `<button class="user-action-btn" onclick="Admin.verifyUser('${u.uid}')" title="Verify">✓</button>` : ''}
            <button class="user-action-btn danger" onclick="Admin.deleteUser('${u.uid}')" title="Remove">✕</button>
          </div>
        </div>
      `).join('');
    } catch (e) { console.error(e); }
  },

  async loadRequests() {
    const container = document.getElementById('adminRequestsList');
    if (!container) return;
    try {
      const requests = await DemoData.getRequests();

      container.innerHTML = requests.map(r => `
        <div class="request-card" style="margin-bottom:8px">
          <div class="request-info">
            <div class="request-title">${r.bloodGroupNeeded} — ${r.patientName}</div>
            <div class="request-meta">
              <span>🏥 ${r.hospitalName}</span>
              <span>📅 ${new Date(r.createdAt).toLocaleDateString()}</span>
              <span>👥 ${r.responses || 0} responses</span>
            </div>
          </div>
          <span class="request-status ${r.status}">${r.status}</span>
        </div>
      `).join('');
    } catch (e) { console.error(e); }
  },

  loadActivity() {
    const container = document.getElementById('adminTimeline');
    if (!container) return;

    const activities = [
      { time: '2 min ago', event: 'New emergency request for O+ blood in Mumbai' },
      { time: '15 min ago', event: 'Rahul Sharma responded to blood request' },
      { time: '1 hour ago', event: 'New donor Meera Reddy registered' },
      { time: '3 hours ago', event: 'Blood request for A- fulfilled at AIIMS' },
      { time: '5 hours ago', event: 'Admin verified 3 new donor accounts' },
      { time: '1 day ago', event: 'System broadcast sent to 150 donors' }
    ];

    container.innerHTML = activities.map(a => `
      <div class="timeline-item">
        <div class="time">${a.time}</div>
        <div class="event">${a.event}</div>
      </div>
    `).join('');
  },

  renderMiniCharts() {
    const container = document.getElementById('miniChart');
    if (!container) return;
    const heights = [35, 55, 45, 70, 60, 80, 50, 65, 75, 40, 85, 55];
    container.innerHTML = heights.map(h =>
      `<div class="mini-bar" style="height:${h}%" title="${h}%"></div>`
    ).join('');
  },

  async verifyUser(uid) {
    try {
      await DemoData.updateUser(uid, { verified: true });
      App.showToast('User verified successfully!', 'success');
      this.loadUsers();
      this.loadStats();
    } catch (e) { console.error(e); }
  },

  async deleteUser(uid) {
    if (confirm('Are you sure you want to remove this user?')) {
      try {
        await DemoData.deleteUser(uid);
        App.showToast('User removed', 'info');
        this.loadUsers();
        this.loadStats();
      } catch (e) { console.error(e); }
    }
  },

  bindBroadcast() {
    const form = document.getElementById('broadcastForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = form.querySelector('textarea')?.value;
        if (msg) {
          App.showToast('Broadcast notification sent to all donors!', 'success');
          form.reset();
        }
      });
    }
  }
};
