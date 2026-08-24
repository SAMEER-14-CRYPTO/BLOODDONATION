import { DonorsList, HospitalsList, BloodBanksList, CityCoordinates } from '../data/mockData.js';

export const CompatibilityMatrix = {
  'O-':  ['O-'],
  'O+':  ['O-', 'O+'],
  'A-':  ['O-', 'A-'],
  'A+':  ['O-', 'O+', 'A-', 'A+'],
  'B-':  ['O-', 'B-'],
  'B+':  ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
};

export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// ── Blood Group Parser ──
export function extractBloodGroup(query = '') {
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
}

// ── City Parser ──
export function extractCity(query = '') {
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

  for (const c of Object.keys(CityCoordinates)) {
    if (text.includes(c.toLowerCase())) return c;
  }
  return null;
}

// ── Smart Context-Aware AI Chatbot Engine ──
export function answerAiPrompt(query, contextData = {}) {
  const q = (query || '').toLowerCase().trim();
  const allDonors = (contextData.donors && contextData.donors.length > 0) ? contextData.donors : DonorsList;
  const allHospitals = (contextData.hospitals && contextData.hospitals.length > 0) ? contextData.hospitals : HospitalsList;
  const allBanks = (contextData.bloodBanks && contextData.bloodBanks.length > 0) ? contextData.bloodBanks : BloodBanksList;

  // 1. Greetings & Intro
  if (/^(hi|hello|hey|help|start|namaste|vanakkam)\b/i.test(q)) {
    return {
      type: 'text',
      text: `Hello! 👋 I am your **LifeLink AI Assistant**.\n\nI can find exact blood donors, hospitals, and blood bank stocks for you.\n\nTry asking:\n• "A- donor in Tirupati"\n• "Find O+ in Chennai"\n• "Hospitals in Tirupati"\n• "Blood banks in Coimbatore"\n• "Can A+ give blood to B+?"`
    };
  }

  // 2. Hospital Queries (e.g. "hospitals in tirupati", "find hospital in chennai", "apollo hospital")
  if (q.includes('hospital') || q.includes('medical centre') || q.includes('doctor')) {
    const targetCity = extractCity(q);

    const matchingHospitals = allHospitals.filter(h => {
      const hCity = (h.city || '').toLowerCase();
      const hName = (h.name || '').toLowerCase();
      if (targetCity) return hCity.includes(targetCity.toLowerCase());
      return hName.includes(q) || q.split(' ').some(w => w.length > 3 && (hName.includes(w) || hCity.includes(w)));
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

  // 3. Blood Bank Queries (e.g. "blood bank in tirupati", "blood banks in chennai")
  if (q.includes('blood bank') || q.includes('blood centre') || q.includes('bank stock') || q.includes('stocks')) {
    const targetCity = extractCity(q);

    const matchingBanks = allBanks.filter(b => {
      const bCity = (b.city || '').toLowerCase();
      const bName = (b.name || '').toLowerCase();
      if (targetCity) return bCity.includes(targetCity.toLowerCase());
      return bName.includes(q) || q.split(' ').some(w => w.length > 3 && (bName.includes(w) || bCity.includes(w)));
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

  // 4. Blood Donor Search (e.g. "a- donor", "a- in tirupathi", "need O+ in chennai", "find B- donor")
  const bloodGroup = extractBloodGroup(q);
  const foundCity = extractCity(q);

  if (bloodGroup || foundCity || q.includes('donor') || q.includes('blood') || q.includes('urgent') || q.includes('need') || q.includes('find') || q.includes('want')) {
    const searchGroup = bloodGroup || 'O+';
    const hasSpecificCity = !!foundCity;
    const searchCity = foundCity || 'Chennai';
    const cityCoords = CityCoordinates[searchCity] || { lat: 13.0827, lng: 80.2707 };

    // A. Search for EXACT matching donors of requested bloodGroup in requested city
    const exactCityDonors = allDonors.filter(d => {
      const dGroup = (d.bloodGroup || d.blood_group || '').toUpperCase().trim();
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

    // B. If NO donor of requested bloodGroup in requested city, search for EXACT bloodGroup donors across all other cities!
    const exactGroupOtherCities = allDonors.filter(d => {
      const dGroup = (d.bloodGroup || d.blood_group || '').toUpperCase().trim();
      return dGroup === searchGroup;
    }).map(d => {
      const dCoords = CityCoordinates[d.city] || { lat: d.lat || 13.0827, lng: d.lng || 80.2707 };
      const dist = getDistance(cityCoords.lat, cityCoords.lng, dCoords.lat, dCoords.lng);
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
      const localHosp = allHospitals.find(h => (h.city || '').toLowerCase().includes(searchCity.toLowerCase()));
      const localBank = allBanks.find(b => (b.city || '').toLowerCase().includes(searchCity.toLowerCase()));

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
          text: `⚠️ **Sorry, no ${searchGroup} donor is registered in ${searchCity} or nearby locations.**${hospitalStockNote}\n\n🚨 Please use the **Receiver SOS Map** to broadcast an emergency request to all nearby hospitals and emergency networks!`
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

  // 5. Blood Compatibility Rules
  if (q.includes('can ') || q.includes('compatible') || q.includes('who can') || q.includes('universal') || q.includes('give') || q.includes('receive')) {
    if (q.includes('universal donor')) {
      return {
        type: 'text',
        text: `🩸 **Universal Red Blood Cell Donor:**\n• **O Negative (O-)** can give red blood cells to **all blood groups** (A+, A-, B+, B-, AB+, AB-, O+, O-).`
      };
    }
    if (q.includes('universal receiver') || q.includes('universal recipient')) {
      return {
        type: 'text',
        text: `🩸 **Universal Recipient:**\n• **AB Positive (AB+)** can receive blood from **all blood groups**.`
      };
    }
    const bg = extractBloodGroup(q);
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

      const canReceiveFrom = CompatibilityMatrix[bg] ? CompatibilityMatrix[bg].join(', ') : 'Compatible donors';

      return {
        type: 'text',
        text: `🩸 **Blood Group Compatibility for ${bg}:**\n• **${bg} can donate to:** ${canGiveTo}\n• **${bg} can receive from:** ${canReceiveFrom}`
      };
    }

    return {
      type: 'text',
      text: `🩸 **Blood Compatibility Summary:**\n• **O-**: Universal Donor (gives to all)\n• **O+**: Donates to O+, A+, B+, AB+\n• **A-**: Donates to A-, A+, AB-, AB+\n• **A+**: Donates to A+, AB+\n• **B-**: Donates to B-, B+, AB-, AB+\n• **B+**: Donates to B+, AB+\n• **AB-**: Donates to AB-, AB+\n• **AB+**: Universal Recipient (receives from all)`
    };
  }

  // 6. Donation Guidelines
  if (q.includes('rule') || q.includes('eligib') || q.includes('how to donate') || q.includes('age') || q.includes('weight')) {
    return {
      type: 'text',
      text: `📋 **Medical Eligibility for Blood Donation:**\n1. Age: 18 to 65 years\n2. Body Weight: 45 kg minimum\n3. Hemoglobin Level: 12.5 g/dL minimum\n4. Pulse & Blood Pressure: Normal resting ranges\n5. Donation Interval: 90 days for men, 120 days for women.`
    };
  }

  // Default Fallback
  return {
    type: 'text',
    text: `I'm here to help you find blood donors, hospitals, and blood banks across our live network!\n\nTry asking:\n• "A- donor in Tirupati"\n• "Find O+ in Chennai"\n• "Hospitals in Tirupati"\n• "Blood banks in Coimbatore"\n• "Can A+ donate to B+?"`
  };
}
