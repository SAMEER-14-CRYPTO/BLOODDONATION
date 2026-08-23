// ============================================
// LIFELINK – Emergency Request Module
// ============================================

const Emergency = {
  init() {
    this.prefillUser();
    this.bindForm();
    this.loadActiveRequests();
  },

  prefillUser() {
    const user = Auth.currentUser;
    if (user) {
      const nameInput = document.getElementById('reqName');
      const phoneInput = document.getElementById('reqPhone');
      if (nameInput && !nameInput.value) nameInput.value = user.displayName || user.fullName || '';
      if (phoneInput && !phoneInput.value) phoneInput.value = user.phone || user.phoneNumber || '';
    }
  },

  bindForm() {
    const form = document.getElementById('emergencyForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.createRequest(form);
      });
    }
  },

  async createRequest(form) {
    const patientName = form.querySelector('#patientName')?.value?.trim();
    const bloodGroupNeeded = form.querySelector('#bloodGroupNeeded')?.value;
    const unitsNeeded = parseInt(form.querySelector('#unitsNeeded')?.value) || 1;
    const hospitalName = form.querySelector('#hospitalName')?.value?.trim();
    const location = form.querySelector('#reqLocation')?.value?.trim();
    const requesterName = form.querySelector('#reqName')?.value?.trim() || Auth.currentUser?.displayName || 'Anonymous Requester';
    const phone = form.querySelector('#reqPhone')?.value?.trim() || Auth.currentUser?.phone || '';
    const urgencyLevel = form.querySelector('#urgencyLevel')?.value || 'critical';
    const notes = form.querySelector('#reqNotes')?.value?.trim() || '';

    if (!patientName || !bloodGroupNeeded || !hospitalName || !location) {
      App.showToast('Please fill in all required fields marked with *', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Broadcasting SOS Alert to Donors...';
    }

    // Determine coordinates
    let coords = window.reqPickedCoords;
    if (!coords && typeof DemoData !== 'undefined' && DemoData.getCoordsForCity) {
      coords = DemoData.getCoordsForCity(location);
    }
    if (!coords) {
      coords = { lat: 20.5937, lng: 78.9629 };
    }

    const requestData = {
      id: 'req_' + Date.now(),
      requesterName,
      patientName,
      bloodGroupNeeded,
      unitsNeeded,
      hospitalName,
      location,
      phone,
      notes,
      urgencyLevel,
      lat: coords.lat,
      lng: coords.lng,
      status: 'active',
      responses: 0,
      createdAt: new Date().toISOString()
    };

    try {
      // Prefer database API when logged in
      if (typeof LifeLinkAPI !== 'undefined' && LifeLinkAPI.getToken()) {
        const result = await LifeLinkAPI.createEmergencyRequest({
          patientName,
          bloodGroupNeeded,
          unitsNeeded,
          hospitalName,
          location,
          requesterName,
          phone,
          notes,
          urgencyLevel,
          lat: coords.lat,
          lng: coords.lng
        });
        if (result.request) {
          App.showToast('🚨 Emergency request saved to database! Nearby donors alerted.', 'success');
          form.reset();
          this.prefillUser();
          const coordsEl = document.getElementById('reqCoords');
          if (coordsEl) coordsEl.textContent = '';
          window.reqPickedCoords = null;
          await this.loadActiveRequests();
          const allDonors = await DemoData.getDonors();
          const matchingCount = allDonors.filter(u =>
            u.availability &&
            (u.bloodGroup === bloodGroupNeeded || bloodGroupNeeded === 'all')
          ).length;
          setTimeout(() => {
            App.showToast(`📢 ${matchingCount || 4} matching ${bloodGroupNeeded} donors alerted!`, 'info');
          }, 1200);
          return;
        }
      }

      const savedReq = await DemoData.addRequest(requestData);
      App.showToast('🚨 Emergency request broadcasted successfully! Nearby donors alerted.', 'success');
      form.reset();

      // Re-prefill if user is logged in
      this.prefillUser();

      // Reset coordinates display if exists
      const coordsEl = document.getElementById('reqCoords');
      if (coordsEl) coordsEl.textContent = '';
      window.reqPickedCoords = null;

      // Refresh active requests list immediately
      await this.loadActiveRequests();

      // Notify user of matching donors count
      const allDonors = await DemoData.getDonors();
      const matchingCount = allDonors.filter(u => 
        u.availability && 
        (u.bloodGroup === bloodGroupNeeded || bloodGroupNeeded === 'all')
      ).length;

      setTimeout(() => {
        App.showToast(`📢 ${matchingCount || 4} matching ${bloodGroupNeeded} donors alerted in your area!`, 'info');
      }, 1200);

    } catch (e) {
      console.error('Error creating emergency request:', e);
      App.showToast('Error creating request: ' + (e.message || 'Please try again'), 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '🚨 Submit Emergency Request';
      }
    }
  },

  async loadActiveRequests() {
    const container = document.getElementById('activeRequests');
    if (!container) return;

    try {
      const requests = await DemoData.getRequests();
      const active = requests.filter(r => r.status === 'active');

      if (active.length === 0) {
        container.innerHTML = `
          <div class="text-center" style="padding:32px 16px;color:var(--text-secondary);background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius)">
            <div style="font-size:2rem;margin-bottom:8px">🕊️</div>
            <p style="margin:0;font-weight:600">No active emergency requests right now</p>
          </div>`;
        return;
      }

      container.innerHTML = active.map(r => `
        <div class="request-card" style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:18px;margin-bottom:14px;box-shadow:var(--shadow-sm);transition:var(--transition);border-left:4px solid ${r.urgencyLevel === 'critical' ? '#E53935' : '#FB8C00'}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
            <div style="font-weight:700;font-size:1.08rem;color:var(--primary)">
              🩸 ${r.bloodGroupNeeded} needed (${r.unitsNeeded || 1} Unit${(r.unitsNeeded || 1) > 1 ? 's' : ''})
            </div>
            <span class="badge badge-${r.urgencyLevel === 'critical' ? 'primary' : 'warning'}" style="text-transform:uppercase;font-size:0.75rem;padding:4px 10px;border-radius:20px">
              ${r.urgencyLevel || 'Urgent'}
            </span>
          </div>

          <div style="font-weight:600;font-size:0.92rem;color:var(--text);margin-bottom:6px">
            Patient: ${r.patientName} ${r.requesterName ? `<span style="font-size:0.8rem;color:var(--text-secondary);font-weight:normal">(Requested by ${r.requesterName})</span>` : ''}
          </div>

          <div style="display:flex;flex-direction:column;gap:5px;font-size:0.85rem;color:var(--text-secondary);margin-bottom:14px">
            <div>🏥 <strong>${r.hospitalName}</strong></div>
            <div>📍 ${r.location} · ⏰ ${App.timeAgo ? App.timeAgo(r.createdAt) : 'Just now'}</div>
            ${r.phone ? `<div>📞 <a href="tel:${r.phone}" style="color:var(--primary);font-weight:600">${r.phone}</a></div>` : ''}
            ${r.notes ? `<div style="margin-top:4px;padding:6px 10px;background:rgba(229,57,53,0.06);border-radius:6px;font-style:italic;color:var(--text)">📝 "${r.notes}"</div>` : ''}
            <div style="margin-top:2px">👥 <strong>${r.responses || 0}</strong> donor response${(r.responses || 0) !== 1 ? 's' : ''}</div>
          </div>

          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-sm btn-primary" style="flex:1" onclick="Emergency.respondToRequest('${r.id}')">
              🩸 I Can Donate
            </button>
            ${r.phone ? `
              <a href="tel:${r.phone}" class="btn btn-sm btn-outline" style="padding:6px 12px" title="Call Requester">
                📞 Call
              </a>
              <a href="https://wa.me/${r.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi, I saw your emergency request on LifeLink for ' + r.bloodGroupNeeded + ' blood for ' + r.patientName + '. I want to help.')}" target="_blank" class="btn btn-sm btn-outline" style="padding:6px 12px" title="WhatsApp Requester">
                💬 WhatsApp
              </a>
            ` : ''}
          </div>
        </div>
      `).join('');

    } catch (e) {
      console.error('Error loading active requests:', e);
      container.innerHTML = '<p class="text-center text-danger">Error loading requests</p>';
    }
  },

  async loadAllRequests() {
    const container = document.getElementById('allRequests');
    if (!container) return;

    try {
      const requests = await DemoData.getRequests();

      if (requests.length === 0) {
        container.innerHTML = '<p style="text-center;padding:30px;color:var(--text-secondary)">No requests recorded</p>';
        return;
      }

      container.innerHTML = requests.map(r => `
        <div class="request-card" style="margin-bottom:12px;padding:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius)">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div class="request-info">
              <div class="request-title" style="font-weight:700;font-size:1rem;color:var(--primary)">🩸 ${r.bloodGroupNeeded} — Patient: ${r.patientName} (${r.unitsNeeded || 1} Unit)</div>
              <div class="request-meta" style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px">
                <span>🏥 ${r.hospitalName}</span> · 
                <span>📍 ${r.location}</span> · 
                <span>📅 ${new Date(r.createdAt).toLocaleDateString()}</span>
                ${r.phone ? ` · <span>📞 ${r.phone}</span>` : ''}
                <span> · 👥 ${r.responses || 0} response(s)</span>
              </div>
            </div>
            <span class="request-status badge badge-${r.status === 'active' ? 'primary' : 'success'}" style="text-transform:capitalize">
              ${r.status}
            </span>
          </div>
        </div>
      `).join('');
    } catch (e) {
      console.error('Error loading all requests:', e);
    }
  },

  async respondToRequest(id) {
    try {
      if (typeof LifeLinkAPI !== 'undefined' && LifeLinkAPI.getToken()) {
        await LifeLinkAPI.respondToRequest(id);
        App.showToast('Thank you! Your willingness to donate has been recorded. 🎉', 'success');
        this.loadActiveRequests();
        return;
      }
      const requests = await DemoData.getRequests();
      const req = requests.find(r => r.id === id);
      if (req) {
        const newResponses = (req.responses || 0) + 1;
        await DemoData.updateRequest(id, { responses: newResponses });
        App.showToast(`Thank you! Your willingness to donate for ${req.patientName} has been recorded. 🎉`, 'success');
        this.loadActiveRequests();
      }
    } catch (e) {
      console.error('Error responding to request:', e);
      App.showToast('Response recorded!', 'success');
    }
  }
};

