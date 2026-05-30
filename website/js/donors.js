// ============================================
// LIFELINK – Donor Search Module
// ============================================

const Donors = {
  init() {
    this.bindSearch();
    this.bindFilters();
    this.bindBloodChips();
  },

  bindSearch() {
    const form = document.getElementById('searchForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.performSearch();
      });
    }
    const quickBtn = document.getElementById('quickSearchBtn');
    if (quickBtn) quickBtn.addEventListener('click', () => this.performSearch());
  },

  bindFilters() {
    const filters = document.querySelectorAll('.search-filter');
    filters.forEach(f => f.addEventListener('change', () => this.performSearch()));
  },

  bindBloodChips() {
    const chips = document.querySelectorAll('.blood-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const bg = chip.dataset.group;
        const input = document.getElementById('bloodGroupFilter');
        if (input) input.value = bg;
        this.performSearch();
      });
    });
  },

  async performSearch() {
    const bloodGroup = document.getElementById('bloodGroupFilter')?.value || 'all';
    const city = document.getElementById('cityFilter')?.value || '';
    const availableOnly = document.getElementById('availableOnly')?.checked || false;

    // Show loading
    const container = document.getElementById('donorResults');
    if (container) container.innerHTML = '<div class="text-center" style="padding:40px"><div class="spinner"></div></div>';

    try {
      const results = await DemoData.searchDonors({ bloodGroup, city, availableOnly });
      this.renderResults(results);
      Maps.addDonorMarkers(results);

      if (city.trim()) {
        Maps.geocodeAddress(city, (location) => {
          if (location) {
            Maps.setCenter(location, 11);
          }
        });
      } else {
        Maps.fitBoundsToMarkers();
      }
    } catch (e) {
      console.error(e);
      if (container) container.innerHTML = '<div class="text-center text-danger">Error loading donors</div>';
    }
  },

  renderResults(donors) {
    const container = document.getElementById('donorResults');
    if (!container) return;

    if (donors.length === 0) {
      container.innerHTML = `
        <div class="text-center" style="padding:60px 20px">
          <div style="font-size:3rem;margin-bottom:16px">🔍</div>
          <h3>No donors found</h3>
          <p>Try adjusting your search filters</p>
        </div>`;
      return;
    }

    const count = document.getElementById('resultCount');
    if (count) count.textContent = `${donors.length} donor${donors.length !== 1 ? 's' : ''} found`;

    container.innerHTML = donors.map(d => `
      <div class="donor-card card" data-uid="${d.uid}">
        <div class="donor-avatar">${d.displayName?.charAt(0) || '?'}</div>
        <div class="donor-info">
          <div class="donor-name">
            ${d.displayName}
            ${d.verified ? '<span class="verify-badge verified">✓ Verified</span>' : ''}
          </div>
          <div class="donor-meta">
            <span>📍 ${d.address || d.city || 'N/A'}</span>
            <span>🩸 ${d.bloodGroup}</span>
            <span>${d.gender || ''}, ${d.age || ''} yrs</span>
            <span><span class="availability-dot ${d.availability ? 'online' : 'offline'}"></span> ${d.availability ? 'Available' : 'Unavailable'}</span>
          </div>
          ${d.distance ? `<div class="donor-meta"><span class="dist-badge">📏 ${d.distance} km away</span></div>` : ''}
        </div>
        <div class="blood-badge">${d.bloodGroup}</div>
        <div class="donor-actions">
          <a href="tel:${d.phone || '#'}" class="btn btn-sm btn-primary" title="Call">📞 Call</a>
          <button class="btn btn-sm btn-outline" onclick="Donors.viewDonor('${d.uid}')">View</button>
        </div>
      </div>
    `).join('');
  },

  async viewDonor(uid) {
    try {
      const users = await DemoData.getUsers();
      const donor = users.find(u => u.uid === uid);
      if (!donor) return;

      const modal = document.getElementById('donorModal');
      if (!modal) return;

      document.getElementById('modalDonorName').textContent = donor.displayName;
      document.getElementById('modalDonorBlood').textContent = donor.bloodGroup;
      document.getElementById('modalDonorCity').textContent = donor.city || 'N/A';
      document.getElementById('modalDonorGender').textContent = donor.gender || 'N/A';
      document.getElementById('modalDonorAge').textContent = donor.age || 'N/A';
      document.getElementById('modalDonorPhone').textContent = donor.phone || 'N/A';
      document.getElementById('modalDonorAvail').textContent = donor.availability ? 'Available' : 'Not Available';
      document.getElementById('modalDonorLastDonation').textContent = donor.lastDonation || 'Never';

      // Address field
      const addrEl = document.getElementById('modalDonorAddress');
      if (addrEl) addrEl.textContent = donor.address || 'N/A';

      // Coordinates field
      const coordsEl = document.getElementById('modalDonorCoords');
      if (coordsEl) {
        coordsEl.textContent = (donor.lat && donor.lng) ? `${donor.lat.toFixed(4)}, ${donor.lng.toFixed(4)}` : 'N/A';
      }

      modal.classList.add('active');
    } catch (e) {
      console.error(e);
    }
  },

  // Load all donors for listing
  async loadAll() {
    try {
      const users = await DemoData.getUsers();
      const donors = users.filter(u => u.role === 'donor');
      this.renderResults(donors);
    } catch (e) {
      console.error(e);
    }
  }
};
