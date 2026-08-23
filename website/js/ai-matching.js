// ==========================================================
// LIFELINK – AI Donor Matching Engine & Smart Assistant
// Multi-Factor Algorithm: Blood Group, Proximity, Availability, Last Donation
// ==========================================================

const AIDonorMatching = {
  // ABO & Rh Blood Compatibility Matrix
  _compatibilityMatrix: {
    'O-':  ['O-'],
    'O+':  ['O-', 'O+'],
    'A-':  ['O-', 'A-'],
    'A+':  ['O-', 'O+', 'A-', 'A+'],
    'B-':  ['O-', 'B-'],
    'B+':  ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
  },

  // ----------------------------------------------------------
  // Core AI Donor Matching Algorithm
  // ----------------------------------------------------------
  matchDonors(request, donorsList) {
    if (!request || !donorsList || !donorsList.length) return [];

    const neededGroup = (request.bloodGroupNeeded || request.bloodGroup || 'O+').trim().toUpperCase();
    const reqLocation = request.location || request.hospitalName || request.city || 'Chennai';
    
    // Determine request coordinates
    let reqLat = request.lat;
    let reqLng = request.lng;
    if (reqLat == null || reqLng == null) {
      const coords = DemoData.getCoordsForCity(reqLocation);
      reqLat = coords.lat;
      reqLng = coords.lng;
    }

    const compatibleGroups = this._compatibilityMatrix[neededGroup] || [neededGroup];

    const scoredDonors = donorsList.map(donor => {
      const donorGroup = (donor.bloodGroup || '').trim().toUpperCase();
      const donorLat = donor.lat != null ? donor.lat : (DemoData.getCoordsForCity(donor.city || donor.address).lat);
      const donorLng = donor.lng != null ? donor.lng : (DemoData.getCoordsForCity(donor.city || donor.address).lng);
      
      // 1. Blood Compatibility Score (Max 40 points)
      let bloodScore = 0;
      let isExactMatch = false;
      let isCompatible = false;

      if (donorGroup === neededGroup) {
        bloodScore = 40;
        isExactMatch = true;
        isCompatible = true;
      } else if (compatibleGroups.includes(donorGroup)) {
        bloodScore = donorGroup === 'O-' ? 36 : 32; // O- universal gets higher secondary score
        isCompatible = true;
      } else {
        bloodScore = 0;
        isCompatible = false;
      }

      // 2. Proximity & Distance Score (Max 30 points)
      const distance = DemoData.getDistanceBetween(reqLat, reqLng, donorLat, donorLng);
      let distanceScore = 0;
      if (distance <= 5) {
        distanceScore = 30;
      } else if (distance <= 15) {
        distanceScore = 26;
      } else if (distance <= 30) {
        distanceScore = 21;
      } else if (distance <= 60) {
        distanceScore = 15;
      } else if (distance <= 120) {
        distanceScore = 9;
      } else {
        distanceScore = Math.max(2, Math.round(30 - (distance * 0.1)));
      }

      // 3. Availability Score (Max 15 points)
      let availScore = 0;
      if (donor.availability === true || donor.availability === 1) {
        availScore = 15;
      } else {
        availScore = 2; // Unavailable / inactive gets low weight
      }

      // 4. Last Donation Readiness Score (Max 15 points)
      let donationScore = 15;
      let daysSinceLast = 999;
      let donationEligibility = 'Eligible to Donate (Safe)';

      if (donor.lastDonation && donor.lastDonation !== 'Never') {
        const lastDate = new Date(donor.lastDonation);
        const diffMs = Date.now() - lastDate.getTime();
        daysSinceLast = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (daysSinceLast >= 90) {
          donationScore = 15;
          donationEligibility = `Safe to Donate (${Math.floor(daysSinceLast / 30)} months ago)`;
        } else if (daysSinceLast >= 60) {
          donationScore = 8;
          donationEligibility = `Approaching Eligibility (${daysSinceLast} days ago)`;
        } else {
          donationScore = 1;
          donationEligibility = `Recent Donation Cooldown (${daysSinceLast} days ago)`;
        }
      } else {
        donationEligibility = 'First Time / Safe to Donate';
      }

      // Total Normalized AI Match Score (0 - 100)
      const totalScore = Math.min(100, Math.round(bloodScore + distanceScore + availScore + donationScore));

      // AI Reasoning Formulation
      const insights = [];
      if (isExactMatch) insights.push(`Exact Blood Match (${donorGroup})`);
      else if (isCompatible) insights.push(`Compatible Donor Type (${donorGroup})`);
      else insights.push(`Incompatible Blood Type (${donorGroup})`);

      insights.push(`${distance} km away from ${reqLocation}`);
      insights.push(donor.availability ? 'Active & Available' : 'Currently Busy');
      insights.push(donationEligibility);

      return {
        ...donor,
        distance,
        isExactMatch,
        isCompatible,
        bloodScore,
        distanceScore,
        availScore,
        donationScore,
        aiScore: totalScore,
        aiInsights: insights
      };
    });

    // Filter out incompatible blood types and rank by AI Score descending
    const filteredAndRanked = scoredDonors
      .filter(d => d.isCompatible)
      .sort((a, b) => b.aiScore - a.aiScore);

    // Assign AI Ranking Labels
    filteredAndRanked.forEach((donor, index) => {
      donor.aiRank = index + 1;
      if (index === 0) {
        donor.aiBadge = '🌟 Top AI Match (Rank #1)';
        donor.aiBadgeClass = 'badge-top';
      } else if (index < 3) {
        donor.aiBadge = `⚡ High Priority (Rank #${donor.aiRank})`;
        donor.aiBadgeClass = 'badge-high';
      } else {
        donor.aiBadge = `👍 Suitable Match (Rank #${donor.aiRank})`;
        donor.aiBadgeClass = 'badge-good';
      }
    });

    return filteredAndRanked;
  },

  // ----------------------------------------------------------
  // Natural Language AI Query Parser
  // ----------------------------------------------------------
  parseQuery(naturalQuery) {
    const q = naturalQuery.toLowerCase();
    const result = {
      bloodGroupNeeded: 'O+',
      location: 'Chennai',
      unitsNeeded: 1,
      urgencyLevel: 'urgent'
    };

    // Extract Blood Group
    const bgMatch = q.match(/\b(a|b|ab|o)[+-]\b/i) || q.match(/\b(a|b|ab|o)\s+(positive|negative)\b/i);
    if (bgMatch) {
      let bg = bgMatch[0].toUpperCase().replace(/\s+/g, '');
      bg = bg.replace('POSITIVE', '+').replace('NEGATIVE', '-');
      result.bloodGroupNeeded = bg;
    }

    // Extract City in TN / AP
    const knownCities = Object.keys(DemoData._cityCoords);
    for (const city of knownCities) {
      if (q.includes(city)) {
        result.location = city.charAt(0).toUpperCase() + city.slice(1);
        break;
      }
    }

    // Extract Urgency
    if (q.includes('critical') || q.includes('emergency') || q.includes('icu') || q.includes('immediately')) {
      result.urgencyLevel = 'critical';
    }

    // Extract Units
    const unitMatch = q.match(/(\d+)\s*(unit|units|bottle|bottles|packet|packets)/i);
    if (unitMatch) {
      result.unitsNeeded = parseInt(unitMatch[1]) || 1;
    }

    return result;
  },

  // ----------------------------------------------------------
  // AI Assistant Modal UI Rendering
  // ----------------------------------------------------------
  initUI() {
    if (document.getElementById('aiAssistantModal')) return;

    const modalHTML = `
      <!-- AI Assistant Floating Trigger Button -->
      <div id="aiFloatingBtn" class="ai-floating-trigger" onclick="AIDonorMatching.openModal()" title="Open AI Donor Matching Assistant">
        <div class="ai-trigger-pulse"></div>
        <span class="ai-trigger-icon">🤖</span>
        <span class="ai-trigger-label">AI Donor Matcher</span>
      </div>

      <!-- AI Assistant Modal Overlay -->
      <div id="aiAssistantModal" class="modal-overlay ai-modal-overlay">
        <div class="modal ai-modal-box">
          <div class="ai-modal-header">
            <div style="display:flex;align-items:center;gap:12px">
              <div class="ai-avatar-badge">🤖</div>
              <div>
                <h3 style="margin:0;font-size:1.25rem;display:flex;align-items:center;gap:8px">
                  LifeLink AI Donor Matching
                  <span class="badge badge-success" style="font-size:0.7rem;padding:2px 8px">AI Active</span>
                </h3>
                <p style="margin:2px 0 0;font-size:0.82rem;color:var(--text-secondary)">
                  Multi-Factor Ranking • Tamil Nadu & Andhra Pradesh Donors
                </p>
              </div>
            </div>
            <button type="button" class="modal-close" onclick="AIDonorMatching.closeModal()">✕</button>
          </div>

          <!-- AI Natural Language Prompt / Quick Request Bar -->
          <div class="ai-prompt-box">
            <label style="font-size:0.85rem;font-weight:700;margin-bottom:6px;display:block">
              💬 Ask AI Assistant (or configure matching parameters):
            </label>
            <div style="display:flex;gap:8px">
              <input type="text" id="aiNaturalInput" class="form-input" 
                     placeholder="e.g. Find 2 units of B+ donor in Tirupati for emergency surgery…" 
                     style="font-size:0.9rem;padding:10px 14px">
              <button class="btn btn-primary" onclick="AIDonorMatching.handleNaturalQuery()" style="white-space:nowrap;padding:10px 18px">
                ✨ Ask AI
              </button>
            </div>
          </div>

          <!-- Matching Criteria Form -->
          <div class="ai-criteria-grid">
            <div class="form-group" style="margin-bottom:10px">
              <label style="font-size:0.8rem">Blood Group Needed</label>
              <select id="aiBloodGroup" class="form-input" style="padding:8px 12px;font-size:0.88rem" onchange="AIDonorMatching.runMatch()">
                <option value="O+">O+ (Positive)</option>
                <option value="O-">O- (Negative)</option>
                <option value="A+">A+ (Positive)</option>
                <option value="A-">A- (Negative)</option>
                <option value="B+" selected>B+ (Positive)</option>
                <option value="B-">B- (Negative)</option>
                <option value="AB+">AB+ (Positive)</option>
                <option value="AB-">AB- (Negative)</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom:10px">
              <label style="font-size:0.8rem">Patient City / Location</label>
              <input type="text" id="aiLocation" class="form-input" value="Chennai" 
                     placeholder="e.g. Chennai, Tirupati, Coimbatore, Vizag"
                     style="padding:8px 12px;font-size:0.88rem" onchange="AIDonorMatching.runMatch()">
            </div>

            <div class="form-group" style="margin-bottom:10px">
              <label style="font-size:0.8rem">Urgency Level</label>
              <select id="aiUrgency" class="form-input" style="padding:8px 12px;font-size:0.88rem" onchange="AIDonorMatching.runMatch()">
                <option value="critical">🚨 Critical / ICU</option>
                <option value="urgent" selected>⚡ Urgent (Within 4h)</option>
                <option value="normal">⏱️ Standard / Scheduled</option>
              </select>
            </div>
          </div>

          <!-- Matching Engine Results Header -->
          <div style="display:flex;justify-content:space-between;align-items:center;margin:16px 0 10px">
            <div style="font-weight:700;font-size:0.95rem;display:flex;align-items:center;gap:6px">
              <span>🎯 AI Ranked Donors</span>
              <span id="aiResultCount" class="badge badge-primary" style="font-size:0.75rem">0 Found</span>
            </div>
            <button class="btn btn-sm btn-outline" onclick="AIDonorMatching.runMatch()" style="padding:4px 12px;font-size:0.8rem">
              🔄 Re-calculate AI Scores
            </button>
          </div>

          <!-- Donor Results Container -->
          <div id="aiDonorsContainer" class="ai-donors-scroll">
            <div class="text-center" style="padding:30px">
              <p>Initializing AI matching algorithm…</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHTML;
    document.body.appendChild(wrapper);
  },

  openModal(prefill = null) {
    this.initUI();
    const modal = document.getElementById('aiAssistantModal');
    if (!modal) return;
    modal.classList.add('active');

    if (prefill) {
      if (prefill.bloodGroupNeeded || prefill.bloodGroup) {
        document.getElementById('aiBloodGroup').value = prefill.bloodGroupNeeded || prefill.bloodGroup;
      }
      if (prefill.location || prefill.hospitalName || prefill.city) {
        document.getElementById('aiLocation').value = prefill.location || prefill.hospitalName || prefill.city;
      }
      if (prefill.urgencyLevel) {
        document.getElementById('aiUrgency').value = prefill.urgencyLevel;
      }
    }

    this.runMatch();
  },

  closeModal() {
    const modal = document.getElementById('aiAssistantModal');
    if (modal) modal.classList.remove('active');
  },

  async handleNaturalQuery() {
    const input = document.getElementById('aiNaturalInput');
    const query = input ? input.value.trim() : '';
    if (!query) return;

    const parsed = this.parseQuery(query);
    document.getElementById('aiBloodGroup').value = parsed.bloodGroupNeeded;
    document.getElementById('aiLocation').value = parsed.location;
    document.getElementById('aiUrgency').value = parsed.urgencyLevel;

    App.showToast(`AI matched query: ${parsed.bloodGroupNeeded} blood in ${parsed.location}`, 'info');
    this.runMatch();
  },

  async runMatch() {
    const container = document.getElementById('aiDonorsContainer');
    const countEl = document.getElementById('aiResultCount');
    if (!container) return;

    const bg = document.getElementById('aiBloodGroup').value;
    const location = document.getElementById('aiLocation').value.trim() || 'Chennai';
    const urgency = document.getElementById('aiUrgency').value;

    container.innerHTML = '<div class="text-center" style="padding:24px"><p>🤖 Running AI multi-factor scoring…</p></div>';

    const donors = await DemoData.getDonors();
    const ranked = this.matchDonors({
      bloodGroupNeeded: bg,
      location: location,
      urgencyLevel: urgency
    }, donors);

    if (countEl) countEl.textContent = `${ranked.length} Matches`;

    if (!ranked.length) {
      container.innerHTML = `
        <div class="text-center" style="padding:32px">
          <p style="font-size:1.1rem;margin-bottom:8px">No compatible donors found nearby.</p>
          <p style="font-size:0.85rem;color:var(--text-secondary)">Try expanding search radius or check emergency blood banks in Tamil Nadu & AP.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = ranked.map(d => {
      const scoreColor = d.aiScore >= 85 ? 'var(--success)' : d.aiScore >= 65 ? 'var(--warning)' : 'var(--danger)';
      const badgeStyle = d.aiRank === 1 
        ? 'background:rgba(255,215,0,0.18);color:#d4af37;border:1px solid rgba(255,215,0,0.4)'
        : d.aiRank <= 3 
        ? 'background:rgba(67,160,71,0.15);color:#43A047;border:1px solid rgba(67,160,71,0.3)'
        : 'background:rgba(30,136,229,0.12);color:#1E88E5;border:1px solid rgba(30,136,229,0.25)';

      return `
        <div class="ai-donor-card">
          <div class="ai-donor-header">
            <div style="display:flex;align-items:center;gap:12px">
              <div class="ai-blood-badge">${d.bloodGroup}</div>
              <div>
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                  <h4 style="margin:0;font-size:1.02rem">${d.displayName || d.fullName}</h4>
                  <span class="badge" style="${badgeStyle};font-size:0.72rem;padding:2px 8px">${d.aiBadge}</span>
                </div>
                <p style="margin:2px 0 0;font-size:0.83rem;color:var(--text-secondary)">
                  📍 ${d.city || d.address} • <strong>${d.distance} km away</strong> • 📞 ${d.phone || '+91-XXXXXXXXXX'}
                </p>
              </div>
            </div>
            
            <!-- AI Match Percentage Meter -->
            <div class="ai-match-meter">
              <div class="ai-score-num" style="color:${scoreColor}">${d.aiScore}%</div>
              <div class="ai-score-label">AI MATCH</div>
            </div>
          </div>

          <!-- Multi-Factor Breakdown Badges -->
          <div class="ai-breakdown-row">
            <span class="ai-pill ${d.isExactMatch ? 'pill-success' : 'pill-info'}">🩸 Blood: ${d.bloodScore}/40</span>
            <span class="ai-pill ${d.distance <= 15 ? 'pill-success' : d.distance <= 60 ? 'pill-info' : 'pill-warning'}">📍 Distance: ${d.distanceScore}/30</span>
            <span class="ai-pill ${d.availability ? 'pill-success' : 'pill-danger'}">⚡ Availability: ${d.availScore}/15</span>
            <span class="ai-pill ${d.donationScore >= 12 ? 'pill-success' : 'pill-warning'}">⏱️ Readiness: ${d.donationScore}/15</span>
          </div>

          <!-- AI Diagnostic Reasoning Note -->
          <div class="ai-reason-box">
            💡 <strong>AI Insight:</strong> ${d.aiInsights.join(' • ')}
          </div>

          <!-- Action Buttons -->
          <div style="display:flex;gap:8px;margin-top:10px;justify-content:flex-end">
            <a href="tel:${d.phone}" class="btn btn-sm btn-primary" style="padding:6px 14px;font-size:0.82rem">
              📞 Direct Call
            </a>
            <button class="btn btn-sm btn-outline" style="padding:6px 14px;font-size:0.82rem" 
                    onclick="AIDonorMatching.requestDonor('${d.uid}', '${d.displayName || d.fullName}')">
              🚨 Send SOS Request
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  async requestDonor(donorUid, donorName) {
    App.showToast(`🚨 Direct SOS alert dispatched to ${donorName}!`, 'success');
  }
};

// Initialize floating trigger button upon DOM load
document.addEventListener('DOMContentLoaded', () => {
  AIDonorMatching.initUI();
});
