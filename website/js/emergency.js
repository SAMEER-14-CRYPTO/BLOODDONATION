// ============================================
// LIFELINK – Emergency Request Module
// ============================================

const Emergency = {
  init() {
    this.bindForm();
    this.loadActiveRequests();
  },

  bindForm() {
    const form = document.getElementById('emergencyForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.createRequest(form);
      });
    }
  },

  async createRequest(form) {
    const data = {
      requesterName: Auth.currentUser?.displayName || form.querySelector('#reqName')?.value || 'Anonymous',
      patientName: form.querySelector('#patientName')?.value,
      bloodGroupNeeded: form.querySelector('#bloodGroupNeeded')?.value,
      hospitalName: form.querySelector('#hospitalName')?.value,
      location: form.querySelector('#reqLocation')?.value,
      urgencyLevel: form.querySelector('#urgencyLevel')?.value || 'urgent'
    };

    if (!data.patientName || !data.bloodGroupNeeded || !data.hospitalName) {
      App.showToast('Please fill in all required fields', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;

    try {
      const req = await DemoData.addRequest(data);
      App.showToast('🚨 Emergency request created! Notifying nearby donors...', 'success');
      form.reset();

      // Simulate notification
      setTimeout(() => {
        App.showToast('3 matching donors have been notified!', 'info');
      }, 2000);

      this.loadActiveRequests();
    } catch (e) {
      App.showToast('Error creating request: ' + e.message, 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  },

  async loadActiveRequests() {
    const container = document.getElementById('activeRequests');
    if (!container) return;

    try {
      const requests = await DemoData.getRequests();
      const active = requests.filter(r => r.status === 'active');
      container.innerHTML = active.map(r => `
        <div class="request-card">
          <div class="request-info">
            <div class="request-title">🩸 ${r.bloodGroupNeeded} needed for ${r.patientName}</div>
            <div class="request-meta">
              <span>🏥 ${r.hospitalName}</span>
              <span>📍 ${r.location}</span>
              <span>⏰ ${App.timeAgo(r.createdAt)}</span>
              <span>👥 ${r.responses || 0} response${(r.responses || 0) !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <span class="badge badge-${r.urgencyLevel === 'critical' ? 'primary' : 'warning'}">${r.urgencyLevel}</span>
          <button class="btn btn-sm btn-primary" onclick="Emergency.respondToRequest('${r.id}')">Respond</button>
        </div>
      `).join('');

      if (active.length === 0) {
        container.innerHTML = '<p class="text-center" style="padding:40px;color:var(--text-secondary)">No active emergency requests</p>';
      }
    } catch (e) {
      console.error(e);
      container.innerHTML = '<p class="text-center text-danger">Error loading requests</p>';
    }
  },

  async loadAllRequests() {
    const container = document.getElementById('allRequests');
    if (!container) return;

    try {
      const requests = await DemoData.getRequests();
      container.innerHTML = requests.map(r => `
        <div class="request-card">
          <div class="request-info">
            <div class="request-title">🩸 ${r.bloodGroupNeeded} — ${r.patientName}</div>
            <div class="request-meta">
              <span>🏥 ${r.hospitalName}</span>
              <span>📍 ${r.location}</span>
              <span>📅 ${new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <span class="request-status ${r.status}">${r.status}</span>
        </div>
      `).join('');
    } catch (e) {
      console.error(e);
    }
  },

  async respondToRequest(id) {
    if (!Auth.currentUser) {
      App.showToast('Please login to respond', 'error');
      window.location.href = 'login.html';
      return;
    }
    App.showToast('Thank you! The requester has been notified of your response.', 'success');
    
    try {
      const requests = await DemoData.getRequests();
      const req = requests.find(r => r.id === id);
      if (req) {
        const responses = (req.responses || 0) + 1;
        await DemoData.updateRequest(id, { responses });
        this.loadActiveRequests();
      }
    } catch (e) {
      console.error(e);
    }
  }
};
