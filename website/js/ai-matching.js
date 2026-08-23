// ==========================================================
// LIFELINK – AI Assistant & Smart Donor Matching Engine
// ChatGPT-Style Conversational Interface & Multi-Factor Matching
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
        bloodScore = donorGroup === 'O-' ? 36 : 32;
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
      let availScore = (donor.availability === true || donor.availability === 1) ? 15 : 2;

      // 4. Last Donation Readiness Score (Max 15 points)
      let donationScore = 15;
      let daysSinceLast = 999;
      let donationEligibility = 'Eligible to Donate';

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
          donationEligibility = `Cooldown (${daysSinceLast} days ago)`;
        }
      } else {
        donationEligibility = 'First Time / Safe to Donate';
      }

      // Total Normalized AI Match Score (0 - 100)
      const totalScore = Math.min(100, Math.round(bloodScore + distanceScore + availScore + donationScore));

      const insights = [];
      if (isExactMatch) insights.push(`Exact Blood Match (${donorGroup})`);
      else if (isCompatible) insights.push(`Compatible Type (${donorGroup})`);
      insights.push(`${distance} km from ${reqLocation}`);
      insights.push(donor.availability ? 'Active' : 'Busy');
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

    return scoredDonors
      .filter(d => d.isCompatible)
      .sort((a, b) => b.aiScore - a.aiScore);
  },

  // ----------------------------------------------------------
  // Simple Natural Language Processing (ChatGPT-style)
  // ----------------------------------------------------------
  async answerPrompt(userPrompt) {
    const p = userPrompt.trim();
    const lower = p.toLowerCase();

    // 1. GREETING
    if (/^(hi|hello|hey|greetings|start|who are you|help|sup)\b/i.test(lower)) {
      return {
        type: 'text',
        text: `Hello! 👋 I am your **LifeLink AI Assistant**.

You can ask me simple questions in plain English, such as:
- *"Find B+ donors in Tirupati"*
- *"Can O+ donate to AB+?"*
- *"Who is the universal donor?"*
- *"Eligibility rules for donating blood"*
- *"Hospitals in Chennai"*
- *"Emergency blood request"*

How can I help you today?`
      };
    }

    // 2. DONOR FINDING / SEARCH QUERY
    const isSearchQuery = /\b(find|search|need|want|get|show|look for|require|urgent|emergency)\b/i.test(lower) ||
                          /\b(a|b|ab|o)[+-]\b/i.test(lower);

    if (isSearchQuery && !lower.includes('can ') && !lower.includes('rules') && !lower.includes('who can')) {
      const parsed = this.parseQuery(p);
      const donors = await DemoData.getDonors();
      const ranked = this.matchDonors({
        bloodGroupNeeded: parsed.bloodGroupNeeded,
        location: parsed.location,
        urgencyLevel: parsed.urgencyLevel
      }, donors);

      if (!ranked.length) {
        return {
          type: 'text',
          text: `🔍 I searched for **${parsed.bloodGroupNeeded}** donors near **${parsed.location}**, but no active compatible donors are currently found in this exact radius.

💡 **Quick Suggestions:**
1. Try searching nearby districts (e.g. Chennai, Tirupati, Coimbatore, Vijayawada).
2. Check the **[Blood Banks Directory](blood-banks.html)** for live stock.
3. Post an instant **[Emergency SOS Request](emergency.html)**.`
        };
      }

      return {
        type: 'donors',
        text: `🎯 Found **${ranked.length} compatible donor(s)** for **${parsed.bloodGroupNeeded}** near **${parsed.location}** (ranked by distance, availability & readiness):`,
        donors: ranked.slice(0, 5) // Show top 5 matches cleanly
      };
    }

    // 3. BLOOD COMPATIBILITY QUESTIONS
    if (lower.includes('can ') || lower.includes('compatible') || lower.includes('who can') || lower.includes('give blood to') || lower.includes('receive from')) {
      const bgMatch = lower.match(/\b(a|b|ab|o)[+-]\b/i);
      const bg = bgMatch ? bgMatch[0].toUpperCase() : null;

      if (lower.includes('universal donor')) {
        return {
          type: 'text',
          text: `🩸 **Universal Donor:**
- **O Negative (O-)** red blood cells can be safely transfused to patients of **any blood group** (A+, A-, B+, B-, AB+, AB-, O+, O-).
- It is crucial for emergency surgeries and trauma cases.`
        };
      }

      if (lower.includes('universal receiver') || lower.includes('universal recipient')) {
        return {
          type: 'text',
          text: `🩸 **Universal Recipient:**
- **AB Positive (AB+)** patients can receive red blood cells from **any blood group** (O-, O+, A-, A+, B-, B+, AB-, AB+).`
        };
      }

      if (bg) {
        const canReceiveFrom = this._compatibilityMatrix[bg] || [bg];
        const canDonateTo = Object.keys(this._compatibilityMatrix).filter(g => this._compatibilityMatrix[g].includes(bg));

        return {
          type: 'text',
          text: `🩸 **Blood Group ${bg} Compatibility Chart:**

✅ **Can GIVE blood to:** ${canDonateTo.join(', ')}
📥 **Can RECEIVE blood from:** ${canReceiveFrom.join(', ')}

${bg === 'O-' ? '🌟 *Note: O- is the Universal Donor.*' : ''}
${bg === 'AB+' ? '🌟 *Note: AB+ is the Universal Recipient.*' : ''}`
        };
      }

      return {
        type: 'text',
        text: `🩸 **Quick Blood Compatibility Summary:**
- **O-**: Universal Donor (Can give to everyone).
- **O+**: Can give to O+, A+, B+, AB+.
- **A+**: Can give to A+, AB+. Can receive from A+, A-, O+, O-.
- **B+**: Can give to B+, AB+. Can receive from B+, B-, O+, O-.
- **AB+**: Universal Recipient (Can receive from everyone).`
      };
    }

    // 4. DONATION ELIGIBILITY & RULES
    if (lower.includes('eligib') || lower.includes('rule') || lower.includes('how to donate') || lower.includes('age') || lower.includes('weight') || lower.includes('interval') || lower.includes('gap') || lower.includes('cooldown')) {
      return {
        type: 'text',
        text: `📋 **Basic Blood Donation Eligibility Criteria:**

1. **Age:** 18 to 65 years.
2. **Weight:** Minimum 45 kg (100 lbs).
3. **Hemoglobin Level:** Minimum 12.5 g/dL.
4. **Donation Gap / Cooldown:** 
   - Men: At least **90 days** (3 months) between donations.
   - Women: At least **120 days** (4 months) between donations.
5. **General Health:** Well-rested, no active fever or antibiotic treatment in the past 48 hours.`
      };
    }

    // 5. HOSPITALS & BLOOD BANKS
    if (lower.includes('hospital') || lower.includes('blood bank') || lower.includes('clinic')) {
      return {
        type: 'text',
        text: `🏥 **Verified Medical Network (Tamil Nadu & Andhra Pradesh):**

- **Hospitals Directory:** View 27+ super-speciality hospitals across Chennai, Tirupati, Coimbatore, Vijayawada, Vizag, and Kadapa on our **[Hospitals Page](hospitals.html)**.
- **Blood Banks Directory:** Check live blood stock units across certified Red Cross & Govt blood banks on our **[Blood Banks Page](blood-banks.html)**.`
      };
    }

    // 6. EMERGENCY / SOS
    if (lower.includes('emergency') || lower.includes('urgent') || lower.includes('accident') || lower.includes('icu') || lower.includes('sos')) {
      return {
        type: 'text',
        text: `🚨 **In an Emergency? Follow These 2 Quick Steps:**

1. **Post SOS Request:** Go to the **[Emergency Request Form](emergency.html)** to alert all nearby donors immediately via SMS & notifications.
2. **Search Nearest Donors:** Ask me here (e.g. *"Find O+ in Tirupati"*) or browse the **[Find Donors Page](search.html)** to call donors directly.`
      };
    }

    // 7. DEFAULT HELPFUL FALLBACK
    return {
      type: 'text',
      text: `I'm here to assist with all blood donation requirements across Tamil Nadu & Andhra Pradesh!

💡 **Try typing:**
- *"Find A+ in Coimbatore"*
- *"Who can receive O+ blood?"*
- *"Emergency B+ blood in Vijayawada"*
- *"What are the eligibility rules?"*`
    };
  },

  parseQuery(naturalQuery) {
    const q = naturalQuery.toLowerCase();
    const result = {
      bloodGroupNeeded: 'O+',
      location: 'Chennai',
      unitsNeeded: 1,
      urgencyLevel: 'urgent'
    };

    const bgMatch = q.match(/\b(a|b|ab|o)[+-]\b/i) || q.match(/\b(a|b|ab|o)\s+(positive|negative)\b/i);
    if (bgMatch) {
      let bg = bgMatch[0].toUpperCase().replace(/\s+/g, '');
      bg = bg.replace('POSITIVE', '+').replace('NEGATIVE', '-');
      result.bloodGroupNeeded = bg;
    }

    const knownCities = Object.keys(DemoData._cityCoords);
    for (const city of knownCities) {
      if (q.includes(city)) {
        result.location = city.charAt(0).toUpperCase() + city.slice(1);
        break;
      }
    }

    if (q.includes('critical') || q.includes('emergency') || q.includes('icu') || q.includes('immediately')) {
      result.urgencyLevel = 'critical';
    }

    return result;
  },

  // ----------------------------------------------------------
  // ChatGPT-Style Conversational UI Rendering
  // ----------------------------------------------------------
  initUI() {
    if (document.getElementById('aiChatDrawer')) return;

    const chatHTML = `
      <!-- Floating Trigger Pill -->
      <div id="aiFloatingBtn" class="ai-floating-trigger" onclick="AIDonorMatching.toggleChat()" title="Open ChatGPT-style LifeLink AI Assistant">
        <div class="ai-trigger-pulse"></div>
        <span class="ai-trigger-icon">🤖</span>
        <span class="ai-trigger-label">LifeLink AI</span>
      </div>

      <!-- ChatGPT-Style Chat Window -->
      <div id="aiChatDrawer" class="ai-chat-window">
        <!-- Header -->
        <div class="ai-chat-header">
          <div style="display:flex;align-items:center;gap:10px">
            <div class="ai-header-avatar">🤖</div>
            <div>
              <div style="font-weight:700;font-size:0.95rem;display:flex;align-items:center;gap:6px">
                LifeLink AI
                <span class="ai-status-dot" title="AI Ready"></span>
              </div>
              <div style="font-size:0.75rem;color:var(--text-secondary)">Tamil Nadu & AP Medical Assistant</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <button type="button" class="ai-header-btn" onclick="AIDonorMatching.clearChat()" title="Clear Chat">🧹</button>
            <button type="button" class="ai-header-btn" onclick="AIDonorMatching.toggleChat()" title="Close">✕</button>
          </div>
        </div>

        <!-- Chat Stream Messages -->
        <div id="aiChatMessages" class="ai-chat-body">
          <!-- Initial Welcome Message -->
          <div class="ai-msg ai-msg-bot">
            <div class="ai-msg-avatar">🤖</div>
            <div class="ai-msg-bubble">
              <p style="margin:0 0 8px">👋 <strong>Hi! I'm your LifeLink AI Assistant.</strong></p>
              <p style="margin:0 0 10px;font-size:0.88rem">Ask me anything about finding blood donors, checking compatibility, or hospital availability across Tamil Nadu & Andhra Pradesh.</p>
              
              <!-- Quick Prompt Pills -->
              <div class="ai-quick-prompts">
                <button type="button" class="ai-prompt-chip" onclick="AIDonorMatching.sendQuickPrompt('Find O+ donors in Chennai')">🩸 Find O+ in Chennai</button>
                <button type="button" class="ai-prompt-chip" onclick="AIDonorMatching.sendQuickPrompt('Find B+ donors in Tirupati')">⚡ Find B+ in Tirupati</button>
                <button type="button" class="ai-prompt-chip" onclick="AIDonorMatching.sendQuickPrompt('Can A+ donate to B+?')">❓ Can A+ give to B+?</button>
                <button type="button" class="ai-prompt-chip" onclick="AIDonorMatching.sendQuickPrompt('What are the rules to donate blood?')">💉 Donation rules</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ChatGPT-Style Input Bar -->
        <div class="ai-chat-footer">
          <form id="aiChatForm" onsubmit="AIDonorMatching.handleChatSubmit(event)" style="display:flex;gap:8px;width:100%;align-items:center">
            <input type="text" id="aiChatInput" class="ai-chat-input" 
                   placeholder="Message LifeLink AI… (e.g. Find A+ donor in Coimbatore)" autocomplete="off">
            <button type="submit" class="ai-send-btn" title="Send message">
              ➤
            </button>
          </form>
        </div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = chatHTML;
    document.body.appendChild(wrapper);
  },

  toggleChat() {
    this.initUI();
    const drawer = document.getElementById('aiChatDrawer');
    if (!drawer) return;
    drawer.classList.toggle('open');
    if (drawer.classList.contains('open')) {
      const input = document.getElementById('aiChatInput');
      if (input) setTimeout(() => input.focus(), 150);
    }
  },

  openModal(prefill = null) {
    this.initUI();
    const drawer = document.getElementById('aiChatDrawer');
    if (drawer && !drawer.classList.contains('open')) {
      drawer.classList.add('open');
    }
    if (prefill) {
      const group = prefill.bloodGroupNeeded || prefill.bloodGroup || 'O+';
      const city = prefill.location || prefill.hospitalName || prefill.city || 'Chennai';
      this.sendQuickPrompt(`Find ${group} donors in ${city}`);
    }
  },

  closeModal() {
    const drawer = document.getElementById('aiChatDrawer');
    if (drawer) drawer.classList.remove('open');
  },

  clearChat() {
    const messages = document.getElementById('aiChatMessages');
    if (!messages) return;
    messages.innerHTML = `
      <div class="ai-msg ai-msg-bot">
        <div class="ai-msg-avatar">🤖</div>
        <div class="ai-msg-bubble">
          <p style="margin:0 0 6px">Chat cleared! 🧹 What would you like to search or check?</p>
          <div class="ai-quick-prompts">
            <button type="button" class="ai-prompt-chip" onclick="AIDonorMatching.sendQuickPrompt('Find O+ donors in Chennai')">🩸 Find O+ in Chennai</button>
            <button type="button" class="ai-prompt-chip" onclick="AIDonorMatching.sendQuickPrompt('Can A+ donate to B+?')">❓ Blood compatibility</button>
          </div>
        </div>
      </div>
    `;
  },

  sendQuickPrompt(text) {
    const input = document.getElementById('aiChatInput');
    if (input) {
      input.value = text;
      this.handleChatSubmit(new Event('submit'));
    }
  },

  async handleChatSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const input = document.getElementById('aiChatInput');
    if (!input) return;
    const userText = input.value.trim();
    if (!userText) return;

    input.value = '';
    const messages = document.getElementById('aiChatMessages');

    // 1. Render User Message Bubble
    const userMsgHTML = `
      <div class="ai-msg ai-msg-user">
        <div class="ai-msg-bubble">${this.escapeHTML(userText)}</div>
      </div>
    `;
    messages.insertAdjacentHTML('beforeend', userMsgHTML);
    messages.scrollTop = messages.scrollHeight;

    // 2. Render Typing Indicator
    const typingId = 'typing_' + Date.now();
    const typingHTML = `
      <div id="${typingId}" class="ai-msg ai-msg-bot">
        <div class="ai-msg-avatar">🤖</div>
        <div class="ai-msg-bubble ai-typing-bubble">
          <span>●</span><span>●</span><span>●</span>
        </div>
      </div>
    `;
    messages.insertAdjacentHTML('beforeend', typingHTML);
    messages.scrollTop = messages.scrollHeight;

    // 3. Process AI Response
    try {
      const response = await this.answerPrompt(userText);
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();

      let botContent = '';
      if (response.type === 'donors') {
        const donorsCards = response.donors.map(d => `
          <div class="ai-chat-donor-card">
            <div style="display:flex;justify-content:space-between;align-items:start">
              <div>
                <div style="font-weight:700;font-size:0.92rem;display:flex;align-items:center;gap:6px">
                  <span class="ai-mini-blood">${d.bloodGroup}</span>
                  ${d.displayName || d.fullName}
                </div>
                <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:2px">
                  📍 ${d.city || d.address} • <strong>${d.distance} km away</strong>
                </div>
              </div>
              <span class="ai-score-pill">${d.aiScore}% Match</span>
            </div>
            <div style="display:flex;gap:6px;margin-top:8px;justify-content:flex-end">
              <a href="tel:${d.phone}" class="btn btn-sm btn-primary" style="padding:4px 10px;font-size:0.75rem">📞 Call</a>
              <a href="https://wa.me/${(d.phone||'').replace(/[^0-9]/g,'')}?text=Hi, need blood support from LifeLink" target="_blank" class="btn btn-sm btn-outline" style="padding:4px 10px;font-size:0.75rem">💬 WhatsApp</a>
            </div>
          </div>
        `).join('');

        botContent = `
          <p style="margin:0 0 8px">${this.formatMarkdown(response.text)}</p>
          <div style="display:flex;flex-direction:column;gap:8px">${donorsCards}</div>
        `;
      } else {
        botContent = `<div>${this.formatMarkdown(response.text)}</div>`;
      }

      const botMsgHTML = `
        <div class="ai-msg ai-msg-bot">
          <div class="ai-msg-avatar">🤖</div>
          <div class="ai-msg-bubble">${botContent}</div>
        </div>
      `;
      messages.insertAdjacentHTML('beforeend', botMsgHTML);
      messages.scrollTop = messages.scrollHeight;
    } catch (err) {
      console.error(err);
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();
    }
  },

  formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary" style="text-decoration:underline;font-weight:600">$1</a>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  },

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
};

// Initialize floating trigger button upon DOM load
document.addEventListener('DOMContentLoaded', () => {
  AIDonorMatching.initUI();
});
