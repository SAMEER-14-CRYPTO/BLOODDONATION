// ==========================================================
// LIFELINK – AI Assistant & Smart Donor Matching Engine
// Enhanced Context-Aware Querying & Accurate Network Matching
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

  extractBloodGroup(query = '') {
    const text = query.toLowerCase();
    if (text.includes('ab+') || text.includes('ab positive') || text.includes('ab pos') || text.includes('ab +')) return 'AB+';
    if (text.includes('ab-') || text.includes('ab negative') || text.includes('ab neg') || text.includes('ab -')) return 'AB-';
    if (text.includes('a+') || text.includes('a positive') || text.includes('a pos') || text.includes('a +')) return 'A+';
    if (text.includes('a-') || text.includes('a negative') || text.includes('a neg') || text.includes('a -')) return 'A-';
    if (text.includes('b+') || text.includes('b positive') || text.includes('b pos') || text.includes('b +')) return 'B+';
    if (text.includes('b-') || text.includes('b negative') || text.includes('b neg') || text.includes('b -')) return 'B-';
    if (text.includes('o+') || text.includes('o positive') || text.includes('o pos') || text.includes('o +')) return 'O+';
    if (text.includes('o-') || text.includes('o negative') || text.includes('o neg') || text.includes('o -')) return 'O-';

    const bgMatch = query.match(/\b(ab|a|b|o)\s*([+-]|positive|negative|pos|neg)\b/i);
    if (bgMatch) {
      const type = bgMatch[1].toUpperCase();
      const sign = (bgMatch[2].includes('-') || bgMatch[2].toLowerCase().includes('neg')) ? '-' : '+';
      return type + sign;
    }
    return null;
  },

  extractCity(query = '') {
    const text = query.toLowerCase();
    if (text.includes('tirupati') || text.includes('tirupathi')) return 'Tirupati';
    if (text.includes('rly kodur') || text.includes('railway kodur') || text.includes('kodur')) return 'Rly Kodur';
    if (text.includes('chennai') || text.includes('madras')) return 'Chennai';
    if (text.includes('coimbatore') || text.includes('kovai')) return 'Coimbatore';
    if (text.includes('madurai')) return 'Madurai';
    if (text.includes('trichy') || text.includes('tiruchirappalli')) return 'Trichy';
    if (text.includes('salem')) return 'Salem';
    if (text.includes('tirunelveli') || text.includes('nellai')) return 'Tirunelveli';
    if (text.includes('vellore')) return 'Vellore';
    if (text.includes('puducherry') || text.includes('pondicherry') || text.includes('pondy')) return 'Puducherry';
    if (text.includes('vijayawada') || text.includes('bezawada')) return 'Vijayawada';
    if (text.includes('visakhapatnam') || text.includes('vizag')) return 'Visakhapatnam';
    if (text.includes('guntur')) return 'Guntur';
    if (text.includes('nellore')) return 'Nellore';
    if (text.includes('kurnool')) return 'Kurnool';
    if (text.includes('kadapa') || text.includes('cuddapah')) return 'Kadapa';
    if (text.includes('anantapur') || text.includes('ananthapur')) return 'Anantapur';

    const knownCities = Object.keys(DemoData._cityCoords || {});
    for (const c of knownCities) {
      if (text.includes(c.toLowerCase())) return c;
    }
    return null;
  },

  // ----------------------------------------------------------
  // Conversational Natural Language Answering Engine
  // ----------------------------------------------------------
  async answerPrompt(prompt) {
    const p = (prompt || '').trim();
    const lower = p.toLowerCase();

    // 1. GREETING
    if (/^(hi|hello|hey|help|start|namaste|vanakkam)\b/i.test(lower)) {
      return {
        type: 'text',
        text: `Hello! 👋 I am your **LifeLink AI Assistant**.

I can find exact blood donors, hospitals, and blood bank stocks for you.

💡 **Try asking me:**
- *"A- blood in Tirupati"*
- *"Find O+ in Chennai"*
- *"Hospitals in Tirupati"*
- *"Blood banks in Coimbatore"*
- *"Can A+ donate to B+?"*

How can I help you today?`
      };
    }

    // 2. HOSPITAL QUERIES
    if (lower.includes('hospital') || lower.includes('medical centre') || lower.includes('doctor')) {
      const targetCity = this.extractCity(lower);
      const hospitals = await DemoData.getHospitals();

      const matchingHospitals = hospitals.filter(h => {
        const hCity = (h.city || '').toLowerCase();
        const hName = (h.name || '').toLowerCase();
        if (targetCity) return hCity.includes(targetCity.toLowerCase());
        return hName.includes(lower) || lower.split(' ').some(w => w.length > 3 && (hName.includes(w) || hCity.includes(w)));
      });

      if (matchingHospitals.length > 0) {
        const hospCards = matchingHospitals.slice(0, 3).map(h => {
          const stocks = h.bloodAvailability ? Object.entries(h.bloodAvailability).map(([k, v]) => `${k}: ${v} units`).join(' | ') : 'Stock available';
          return `🏥 **${h.name}**\n📍 Location: ${h.address || h.city}\n📞 Emergency Contact: ${h.contact}\n🩸 Stock: ${stocks}`;
        }).join('\n\n');

        return {
          type: 'text',
          text: `🏥 **Verified Hospitals ${targetCity ? `in ${targetCity}` : 'Found'}:**\n\n${hospCards}`
        };
      } else if (targetCity) {
        return {
          type: 'text',
          text: `⚠️ Sorry, no verified hospital is directly listed in **${targetCity}** in our database.\n\nNearest emergency hospital facilities are located in **Chennai** and **Vellore**.\n📞 National Emergency Ambulance Helpline: **108**`
        };
      }
    }

    // 3. BLOOD BANK QUERIES
    if (lower.includes('blood bank') || lower.includes('blood centre') || lower.includes('bank stock') || lower.includes('stocks')) {
      const targetCity = this.extractCity(lower);
      const banks = await DemoData.getBloodBanks();

      const matchingBanks = banks.filter(b => {
        const bCity = (b.city || '').toLowerCase();
        const bName = (b.name || '').toLowerCase();
        if (targetCity) return bCity.includes(targetCity.toLowerCase());
        return bName.includes(lower) || lower.split(' ').some(w => w.length > 3 && (bName.includes(w) || bCity.includes(w)));
      });

      if (matchingBanks.length > 0) {
        const bankCards = matchingBanks.slice(0, 3).map(b => {
          const stocks = b.stocks ? Object.entries(b.stocks).map(([k, v]) => `${k}: ${v}`).join(', ') : 'Active stock';
          return `🏦 **${b.name}**\n📍 City: ${b.city} (${b.address || ''})\n📞 Contact: ${b.contact}\n🩸 Blood Units: ${stocks}`;
        }).join('\n\n');

        return {
          type: 'text',
          text: `🏦 **Certified Blood Banks ${targetCity ? `in ${targetCity}` : 'Available'}:**\n\n${bankCards}`
        };
      } else if (targetCity) {
        return {
          type: 'text',
          text: `⚠️ Sorry, no certified blood bank is listed directly in **${targetCity}**.\n\nNearest regional blood centers are available in **Chennai** (Apex Blood Bank: +91-44-26432804) and **Tirupati** (SVIMS Regional Blood Centre: +91-877-2287777).`
        };
      }
    }

    // 4. BLOOD DONOR SEARCH (Exact Blood Group & Location Matching)
    const bloodGroup = this.extractBloodGroup(lower);
    const foundCity = this.extractCity(lower);

    if (bloodGroup || foundCity || lower.includes('donor') || lower.includes('blood') || lower.includes('urgent') || lower.includes('need') || lower.includes('find') || lower.includes('want')) {
      const searchGroup = bloodGroup || 'O+';
      const hasSpecificCity = !!foundCity;
      const searchCity = foundCity || 'Chennai';
      const cityCoords = DemoData.getCoordsForCity(searchCity);

      const donors = await DemoData.getDonors();
      const hospitals = await DemoData.getHospitals();
      const banks = await DemoData.getBloodBanks();

      // A. Search for EXACT matching donors of requested bloodGroup in requested city
      const exactCityDonors = donors.filter(d => {
        const dGroup = (d.bloodGroup || '').toUpperCase().trim();
        const dCity = (d.city || '').toLowerCase().trim();
        return dGroup === searchGroup && dCity.includes(searchCity.toLowerCase());
      });

      if (exactCityDonors.length > 0) {
        const scoredDonors = exactCityDonors.map(d => ({
          ...d,
          distance: 2,
          aiScore: 99,
          bloodGroup: (d.bloodGroup || searchGroup).toUpperCase(),
          displayName: d.displayName || d.fullName || d.name || 'Verified Donor',
          city: d.city || searchCity,
          phone: d.phone || '+91-9876543210'
        }));

        return {
          type: 'donors',
          text: `✅ **Found ${exactCityDonors.length} verified ${searchGroup} donor(s) directly in ${searchCity}:**`,
          donors: scoredDonors.slice(0, 3)
        };
      }

      // B. If NO donor of requested bloodGroup in requested city, search for EXACT bloodGroup donors across other cities!
      const exactGroupOtherCities = donors.filter(d => {
        const dGroup = (d.bloodGroup || '').toUpperCase().trim();
        return dGroup === searchGroup;
      }).map(d => {
        const dCoords = DemoData.getCoordsForCity(d.city || d.address);
        const dist = DemoData.getDistanceBetween(cityCoords.lat, cityCoords.lng, dCoords.lat, dCoords.lng);
        return {
          ...d,
          distance: dist,
          aiScore: Math.max(65, 95 - Math.round(dist / 5)),
          bloodGroup: (d.bloodGroup || searchGroup).toUpperCase(),
          displayName: d.displayName || d.fullName || d.name || 'Verified Donor',
          city: d.city || 'Tamil Nadu / AP',
          phone: d.phone || '+91-9876543210'
        };
      }).sort((a, b) => a.distance - b.distance);

      // C. Check if local hospital or blood bank has stock in that city
      let hospitalStockNote = '';
      if (hasSpecificCity) {
        const localHosp = hospitals.find(h => (h.city || '').toLowerCase().includes(searchCity.toLowerCase()));
        const localBank = banks.find(b => (b.city || '').toLowerCase().includes(searchCity.toLowerCase()));

        if (localHosp && localHosp.bloodAvailability && localHosp.bloodAvailability[searchGroup]) {
          hospitalStockNote = `\n\n🏥 **Hospital Stock in ${searchCity}:**\n• **${localHosp.name}** has **${localHosp.bloodAvailability[searchGroup]} units** of ${searchGroup} ready. 📞 Call: ${localHosp.contact}`;
        } else if (localBank && localBank.stocks && localBank.stocks[searchGroup]) {
          hospitalStockNote = `\n\n🏦 **Blood Bank in ${searchCity}:**\n• **${localBank.name}** has **${localBank.stocks[searchGroup]} units** of ${searchGroup} in stock. 📞 Call: ${localBank.contact}`;
        }
      }

      if (hasSpecificCity) {
        if (exactGroupOtherCities.length > 0) {
          return {
            type: 'donors',
            text: `⚠️ **Sorry, no ${searchGroup} donor is currently registered directly in ${searchCity}.**\n\nHowever, we found verified **${searchGroup}** donors in other locations:${hospitalStockNote}`,
            donors: exactGroupOtherCities.slice(0, 3)
          };
        } else {
          return {
            type: 'text',
            text: `⚠️ **Sorry, no ${searchGroup} donor is registered in ${searchCity} or nearby locations.**${hospitalStockNote}\n\n🚨 Please use the **[Emergency SOS Request Form](emergency.html)** to broadcast an urgent request to all nearby hospitals and emergency networks!`
          };
        }
      } else {
        // User asked for a blood group without mentioning a specific city (e.g. "a- donor")
        if (exactGroupOtherCities.length > 0) {
          return {
            type: 'donors',
            text: `✅ **Found ${exactGroupOtherCities.length} verified ${searchGroup} donor(s) in the network:**`,
            donors: exactGroupOtherCities.slice(0, 3)
          };
        }
      }
    }

    // 5. BLOOD COMPATIBILITY QUESTIONS
    if (lower.includes('can ') || lower.includes('compatible') || lower.includes('who can') || lower.includes('give blood to') || lower.includes('receive from') || lower.includes('universal')) {
      if (lower.includes('universal donor')) {
        return {
          type: 'text',
          text: `🩸 **Universal Red Blood Cell Donor:**
- **O Negative (O-)** red blood cells can be safely transfused to patients of **all blood groups** (A+, A-, B+, B-, AB+, AB-, O+, O-).
- It is crucial for emergency surgeries and trauma resuscitation.`
        };
      }

      if (lower.includes('universal receiver') || lower.includes('universal recipient')) {
        return {
          type: 'text',
          text: `🩸 **Universal Recipient:**
- **AB Positive (AB+)** patients can receive red blood cells from **all blood groups** (O-, O+, A-, A+, B-, B+, AB-, AB+).`
        };
      }

      const bg = this.extractBloodGroup(lower);
      if (bg) {
        const canGiveTo = {
          'O-': 'Everyone (O-, O+, A-, A+, B-, B+, AB-, AB+)',
          'O+': 'O+, A+, B+, AB+',
          'A-': 'A-, A+, AB-, AB+',
          'A+': 'A+, AB+',
          'B-': 'B-, B+, AB-, AB+',
          'B+': 'B+, AB+',
          'AB-': 'AB-, AB+',
          'AB+': 'AB+ only'
        }[bg] || 'Compatible recipients';

        const canReceiveFrom = this._compatibilityMatrix[bg] ? this._compatibilityMatrix[bg].join(', ') : 'Compatible donors';

        return {
          type: 'text',
          text: `🩸 **Blood Group ${bg} Compatibility Guide:**

✅ **${bg} can donate to:** ${canGiveTo}
📥 **${bg} can receive from:** ${canReceiveFrom}

${bg === 'O-' ? '🌟 *Note: O- is the Universal Red Blood Cell Donor.*' : ''}
${bg === 'AB+' ? '🌟 *Note: AB+ is the Universal Recipient.*' : ''}`
        };
      }

      return {
        type: 'text',
        text: `🩸 **Quick Blood Compatibility Summary:**
- **O-**: Universal Donor (gives to all).
- **O+**: Donates to O+, A+, B+, AB+.
- **A-**: Donates to A-, A+, AB-, AB+.
- **A+**: Donates to A+, AB+.
- **B-**: Donates to B-, B+, AB-, AB+.
- **B+**: Donates to B+, AB+.
- **AB-**: Donates to AB-, AB+.
- **AB+**: Universal Recipient (receives from all).`
      };
    }

    // 6. DONATION ELIGIBILITY & RULES
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

    // 7. DEFAULT HELPFUL FALLBACK
    return {
      type: 'text',
      text: `I'm here to help you find blood donors, hospitals, and blood banks across our live network!

💡 **Try typing:**
- *"A- blood in Tirupati"*
- *"Find O+ in Chennai"*
- *"Hospitals in Tirupati"*
- *"Blood banks in Coimbatore"*
- *"Can A+ donate to B+?"*`
    };
  },

  // ----------------------------------------------------------
  // Conversational UI Rendering
  // ----------------------------------------------------------
  initUI() {
    if (document.getElementById('aiChatDrawer')) return;

    const chatHTML = `
      <!-- Floating Trigger Pill (Sleek ✨ Sparkle AI Symbol) -->
      <div id="aiFloatingBtn" class="ai-floating-trigger" onclick="AIDonorMatching.toggleChat()" title="Open LifeLink Medical AI Assistant">
        <div class="ai-trigger-pulse"></div>
        <span class="ai-trigger-icon">✨</span>
        <span class="ai-trigger-label">LifeLink AI</span>
      </div>

      <!-- AI Assistant Window -->
      <div id="aiChatDrawer" class="ai-chat-window">
        <!-- Header -->
        <div class="ai-chat-header">
          <div style="display:flex;align-items:center;gap:10px">
            <div class="ai-header-avatar">✨</div>
            <div>
              <div style="font-weight:700;font-size:0.95rem;display:flex;align-items:center;gap:6px">
                LifeLink AI
                <span class="ai-status-dot" title="AI Ready"></span>
              </div>
              <div style="font-size:0.75rem;color:var(--text-secondary)">Smart Medical Assistant</div>
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
            <div class="ai-msg-avatar">✨</div>
            <div class="ai-msg-bubble">
              <p style="margin:0 0 8px">👋 <strong>Hi! I'm your LifeLink AI Assistant.</strong></p>
              <p style="margin:0 0 10px;font-size:0.88rem">Ask me anything about finding blood donors in your city, hospital stocks, or checking compatibility.</p>
              
              <!-- Quick Prompt Pills -->
              <div class="ai-quick-prompts">
                <button type="button" class="ai-prompt-chip" onclick="AIDonorMatching.sendQuickPrompt('Need A- blood in Tirupati')">🩸 Need A- in Tirupati</button>
                <button type="button" class="ai-prompt-chip" onclick="AIDonorMatching.sendQuickPrompt('Find O+ in Chennai')">⚡ Find O+ in Chennai</button>
                <button type="button" class="ai-prompt-chip" onclick="AIDonorMatching.sendQuickPrompt('Hospitals in Tirupati')">🏥 Hospitals in Tirupati</button>
                <button type="button" class="ai-prompt-chip" onclick="AIDonorMatching.sendQuickPrompt('Can A+ donate to B+?')">❓ Can A+ give to B+?</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Bar -->
        <div class="ai-chat-footer">
          <form id="aiChatForm" onsubmit="AIDonorMatching.handleChatSubmit(event)" style="display:flex;gap:8px;width:100%;align-items:center">
            <input type="text" id="aiChatInput" class="ai-chat-input" 
                   placeholder="Ask LifeLink AI (e.g. Need A- in Tirupati)…" autocomplete="off">
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
        <div class="ai-msg-avatar">✨</div>
        <div class="ai-msg-bubble">
          <p style="margin:0 0 6px">Chat cleared! 🧹 What would you like to search or check?</p>
          <div class="ai-quick-prompts">
            <button type="button" class="ai-prompt-chip" onclick="AIDonorMatching.sendQuickPrompt('Need A- blood in Tirupati')">🩸 Need A- in Tirupati</button>
            <button type="button" class="ai-prompt-chip" onclick="AIDonorMatching.sendQuickPrompt('Find O+ in Chennai')">⚡ Find O+ in Chennai</button>
            <button type="button" class="ai-prompt-chip" onclick="AIDonorMatching.sendQuickPrompt('Hospitals in Tirupati')">🏥 Hospitals in Tirupati</button>
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
        <div class="ai-msg-avatar">✨</div>
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
                  ${d.displayName || d.fullName || d.name}
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
          <div class="ai-msg-avatar">✨</div>
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
