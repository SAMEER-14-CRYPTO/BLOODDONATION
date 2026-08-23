// ============================================
// LIFELINK – Admin Panel Module
// Multi-Section Database & Emergency Request Management
// ============================================

const Admin = {
  currentTab: 'donors',

  async init() {
    Auth.requireAdmin(async (user) => {
      await Promise.all([
        this.loadStats(),
        this.loadUsers(),
        this.loadRequests()
      ]);
      this.loadActivity();
      this.renderMiniCharts();
      this.bindBroadcast();
    });
  },

  async loadStats() {
    try {
      const stats = await DemoData.getStats();
      const els = {
        totalUsers: document.getElementById('adminTotalUsers'),
        totalAdmins: document.getElementById('adminTotalAdmins'),
        activeDonors: document.getElementById('adminActiveDonors'),
        activeRequests: document.getElementById('adminActiveRequests')
      };
      if (els.totalUsers) els.totalUsers.textContent = stats.totalDonors || 0;
      if (els.totalAdmins) els.totalAdmins.textContent = stats.totalAdmins || 0;
      if (els.activeDonors) els.activeDonors.textContent = stats.activeDonors || 0;
      if (els.activeRequests) els.activeRequests.textContent = stats.activeRequests || 0;
    } catch (e) { console.error('Admin loadStats error:', e); }
  },

  switchUserTab(tab) {
    this.currentTab = tab;
    const donorsBtn = document.getElementById('viewDonorsTabBtn');
    const adminsBtn = document.getElementById('viewAdminsTabBtn');
    const badge = document.getElementById('activeSectionBadge');

    if (tab === 'donors') {
      donorsBtn.className = 'btn btn-sm btn-primary';
      adminsBtn.className = 'btn btn-sm btn-outline';
      if (badge) badge.textContent = 'Database: Donors Section';
    } else {
      adminsBtn.className = 'btn btn-sm btn-primary';
      donorsBtn.className = 'btn btn-sm btn-outline';
      if (badge) badge.textContent = 'Database: Admins Section';
    }
    this.loadUsers();
  },

  async loadUsers() {
    const container = document.getElementById('adminUsersList');
    if (!container) return;

    try {
      if (this.currentTab === 'donors') {
        const donors = await DemoData.getDonors();
        if (donors.length === 0) {
          container.innerHTML = '<p style="color:var(--text-secondary);padding:24px;text-align:center">No donors found in the donors database section.</p>';
          return;
        }

        container.innerHTML = donors.map(u => `
          <div class="user-row" style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--border);gap:12px">
            <div style="display:flex;align-items:center;gap:12px">
              <div class="user-avatar" style="width:40px;height:40px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700">
                ${u.displayName?.charAt(0) || 'D'}
              </div>
              <div class="user-info">
                <div class="user-name" style="font-weight:700;font-size:0.95rem">
                  ${u.displayName}
                  <span class="verify-badge ${u.verified ? 'verified' : 'unverified'}" style="font-size:0.75rem;padding:2px 8px;border-radius:12px;margin-left:6px;background:${u.verified ? 'rgba(67,160,71,0.15)' : 'rgba(251,140,0,0.15)'};color:${u.verified ? '#43A047' : '#FB8C00'}">
                    ${u.verified ? '✓ Verified' : '⏳ Pending'}
                  </span>
                  <span style="font-size:0.75rem;background:rgba(229,57,53,0.12);color:var(--primary);padding:2px 6px;border-radius:4px;font-weight:700;margin-left:4px">
                    ${u.bloodGroup || 'O+'}
                  </span>
                </div>
                <div class="user-email" style="font-size:0.82rem;color:var(--text-secondary);margin-top:2px">
                  📧 ${u.email} · 📍 ${u.city || 'India'} · 📞 ${u.phone || 'N/A'}
                </div>
              </div>
            </div>
            <div class="user-actions" style="display:flex;gap:6px">
              ${!u.verified ? `<button class="btn btn-sm btn-outline" onclick="Admin.verifyUser('${u.uid}')" title="Verify Donor" style="padding:4px 10px;font-size:0.8rem">✓ Verify</button>` : ''}
              <button class="btn btn-sm btn-outline danger" onclick="Admin.deleteUser('${u.uid}')" title="Remove Record" style="padding:4px 10px;font-size:0.8rem;color:#E53935;border-color:#E53935">✕ Remove</button>
            </div>
          </div>
        `).join('');

      } else {
        const admins = await DemoData.getAdmins();
        if (admins.length === 0) {
          container.innerHTML = '<p style="color:var(--text-secondary);padding:24px;text-align:center">No admin accounts found in the admins database section.</p>';
          return;
        }

        container.innerHTML = admins.map(a => `
          <div class="user-row" style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--border);gap:12px">
            <div style="display:flex;align-items:center;gap:12px">
              <div class="user-avatar" style="width:40px;height:40px;border-radius:50%;background:#1E88E5;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700">
                ${a.displayName?.charAt(0) || 'A'}
              </div>
              <div class="user-info">
                <div class="user-name" style="font-weight:700;font-size:0.95rem">
                  ${a.displayName}
                  <span style="font-size:0.75rem;padding:2px 8px;border-radius:12px;margin-left:6px;background:rgba(30,136,229,0.15);color:#1E88E5;font-weight:700">
                    🔐 ADMIN
                  </span>
                </div>
                <div class="user-email" style="font-size:0.82rem;color:var(--text-secondary);margin-top:2px">
                  📧 ${a.email} · 📱 ${a.phone || 'HQ'} · Permissions: [${(a.permissions || ['all']).join(', ')}]
                </div>
              </div>
            </div>
            <div class="user-actions" style="display:flex;gap:6px">
              <span class="badge badge-success" style="font-size:0.75rem">Active</span>
            </div>
          </div>
        `).join('');
      }
    } catch (e) { console.error('loadUsers error:', e); }
  },

  async loadRequests() {
    const container = document.getElementById('adminRequestsList');
    if (!container) return;
    try {
      const requests = await DemoData.getRequests();

      if (requests.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary);padding:24px;text-align:center">No emergency blood requests in database</p>';
        return;
      }

      container.innerHTML = requests.map(r => `
        <div class="request-card" style="padding:16px;margin-bottom:12px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;border-left:4px solid ${r.status === 'active' ? '#E53935' : '#43A047'}">
          <div class="request-info">
            <div class="request-title" style="font-weight:700;font-size:1.05rem;color:var(--primary)">
              🩸 ${r.bloodGroupNeeded} needed (${r.unitsNeeded || 1} Unit) — Patient: ${r.patientName}
            </div>
            <div class="request-meta" style="font-size:0.84rem;color:var(--text-secondary);margin-top:4px">
              <span>🏥 <strong>${r.hospitalName}</strong></span> · 
              <span>📍 ${r.location}</span> · 
              <span>📅 ${new Date(r.createdAt).toLocaleString()}</span>
              ${r.phone ? ` · <span>📞 <a href="tel:${r.phone}" style="color:var(--primary);font-weight:600">${r.phone}</a></span>` : ''}
              <span> · 👥 <strong>${r.responses || 0}</strong> responses</span>
            </div>
            ${r.notes ? `<div style="font-size:0.8rem;font-style:italic;color:var(--text);margin-top:4px">📝 "${r.notes}"</div>` : ''}
          </div>

          <div style="display:flex;align-items:center;gap:8px">
            <select class="form-input" style="padding:6px 10px;font-size:0.82rem;width:auto" onchange="Admin.updateRequestStatus('${r.id}', this.value)">
              <option value="active" ${r.status === 'active' ? 'selected' : ''}>🔴 Active SOS</option>
              <option value="fulfilled" ${r.status === 'fulfilled' ? 'selected' : ''}>🟢 Fulfilled</option>
              <option value="cancelled" ${r.status === 'cancelled' ? 'selected' : ''}>⚪ Cancelled</option>
            </select>
            <button class="btn btn-sm btn-outline danger" onclick="Admin.deleteRequest('${r.id}')" title="Delete Request" style="color:#E53935;border-color:#E53935">
              🗑️
            </button>
          </div>
        </div>
      `).join('');
    } catch (e) { console.error('loadRequests error:', e); }
  },

  async updateRequestStatus(id, newStatus) {
    try {
      await DemoData.updateRequest(id, { status: newStatus });
      App.showToast(`Request marked as ${newStatus}!`, 'success');
      this.loadRequests();
      this.loadStats();
    } catch (e) {
      console.error(e);
    }
  },

  async deleteRequest(id) {
    if (confirm('Are you sure you want to permanently delete this emergency request?')) {
      try {
        await DemoData.deleteRequest(id);
        App.showToast('Emergency request removed', 'info');
        this.loadRequests();
        this.loadStats();
      } catch (e) {
        console.error(e);
      }
    }
  },

  loadActivity() {
    const container = document.getElementById('adminTimeline');
    if (!container) return;

    const activities = [
      { time: 'Just now', event: 'Database sync active: Donors & Admins sections online' },
      { time: '5 min ago', event: 'Emergency SOS Broadcast engine verified' },
      { time: '20 min ago', event: 'Sameer Shaik verified in Donors database section' },
      { time: '1 hour ago', event: 'Admin permissions checked for sameeradmin@lifelink.com' },
      { time: '3 hours ago', event: 'Emergency request for O+ blood logged in Chennai' }
    ];

    container.innerHTML = activities.map(a => `
      <div class="timeline-item" style="padding:10px 0;border-bottom:1px solid var(--border)">
        <div class="time" style="font-size:0.75rem;color:var(--text-secondary);font-weight:700">${a.time}</div>
        <div class="event" style="font-size:0.86rem;margin-top:2px">${a.event}</div>
      </div>
    `).join('');
  },

  renderMiniCharts() {
    const container = document.getElementById('miniChart');
    if (!container) return;
    const heights = [35, 55, 45, 70, 60, 80, 50, 65, 75, 40, 85, 55];
    container.innerHTML = heights.map(h =>
      `<div class="mini-bar" style="height:${h}%;flex:1;background:var(--primary);border-radius:4px" title="${h}%"></div>`
    ).join('');
  },

  async verifyUser(uid) {
    try {
      await DemoData.updateUser(uid, { verified: true });
      App.showToast('Donor verified successfully in database!', 'success');
      this.loadUsers();
      this.loadStats();
    } catch (e) { console.error(e); }
  },

  async deleteUser(uid) {
    if (confirm('Are you sure you want to remove this record from the database?')) {
      try {
        await DemoData.deleteUser(uid);
        App.showToast('Record removed from database', 'info');
        this.loadUsers();
        this.loadStats();
      } catch (e) { console.error(e); }
    }
  },

  filterRecords() {
    const query = document.getElementById('adminSearchInput')?.value?.toLowerCase()?.trim();
    if (!query) {
      this.loadUsers();
      this.loadRequests();
      return;
    }
    // Search within user list rows
    const rows = document.querySelectorAll('#adminUsersList .user-row');
    rows.forEach(r => {
      const text = r.textContent.toLowerCase();
      r.style.display = text.includes(query) ? 'flex' : 'none';
    });
  },

  bindBroadcast() {
    const form = document.getElementById('broadcastForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = form.querySelector('textarea')?.value;
        if (msg) {
          DemoData.addNotification({
            message: `📢 ADMIN BROADCAST: ${msg}`,
            type: 'emergency'
          });
          App.showToast('🚨 Broadcast notification sent to all donors in database!', 'success');
          form.reset();
        }
      });
    }
  }
};
