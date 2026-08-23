// AI Donor Matching & Chatbot Service for Expo App
import { DonorsList, CityCoordinates } from '../data/mockData';

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

export function rankDonors(bloodGroup, city = 'Chennai') {
  const targetCoords = CityCoordinates[city] || CityCoordinates['Chennai'];
  const needed = (bloodGroup || 'O+').toUpperCase();
  const compatible = CompatibilityMatrix[needed] || [needed];

  const scored = DonorsList.map(donor => {
    const isExact = donor.bloodGroup === needed;
    const isComp = compatible.includes(donor.bloodGroup);
    
    // Blood Score (40)
    const bloodScore = isExact ? 40 : (isComp ? 32 : 0);
    
    // Distance Score (30)
    const dist = getDistance(targetCoords.lat, targetCoords.lng, donor.lat, donor.lng);
    const distScore = dist <= 10 ? 30 : dist <= 50 ? 22 : dist <= 120 ? 15 : 5;
    
    // Availability (15)
    const availScore = donor.availability ? 15 : 2;
    
    // Readiness (15)
    const readyScore = 15;
    
    const total = Math.min(100, bloodScore + distScore + availScore + readyScore);
    
    return {
      ...donor,
      distance: dist,
      isExact,
      isCompatible: isComp,
      aiScore: total
    };
  });

  return scored.filter(d => d.isCompatible).sort((a, b) => b.aiScore - a.aiScore);
}

export function answerAiPrompt(query) {
  const q = (query || '').toLowerCase().trim();

  if (/^(hi|hello|hey|help|start)\b/i.test(q)) {
    return {
      type: 'text',
      text: `Hello! 👋 I'm your **LifeLink AI Assistant**.\n\nAsk me anything about finding donors, checking compatibility, or hospital emergency guidance:\n• "Find O+ in Chennai"\n• "Can A+ give blood to B+?"\n• "Who is the universal donor?"\n• "What are the donation rules?"`
    };
  }

  // Donor Search
  if (/\b(find|search|need|want|get|urgent|emergency)\b/i.test(q) || /\b(a|b|ab|o)[+-]\b/i.test(q)) {
    let group = 'O+';
    const bgMatch = q.match(/\b(a|b|ab|o)[+-]\b/i);
    if (bgMatch) group = bgMatch[0].toUpperCase();

    let foundCity = 'Chennai';
    Object.keys(CityCoordinates).forEach(c => {
      if (q.includes(c.toLowerCase())) foundCity = c;
    });

    const donors = rankDonors(group, foundCity);
    return {
      type: 'donors',
      text: `🎯 Found **${donors.length} compatible donor(s)** for **${group}** near **${foundCity}**:`,
      donors: donors.slice(0, 4)
    };
  }

  // Blood Compatibility
  if (q.includes('can ') || q.includes('compatible') || q.includes('who can') || q.includes('universal')) {
    if (q.includes('universal donor')) {
      return {
        type: 'text',
        text: `🩸 **Universal Donor:**\n• **O Negative (O-)** can give red blood cells to **all blood types** (A+, A-, B+, B-, AB+, AB-, O+, O-).`
      };
    }
    if (q.includes('universal receiver') || q.includes('universal recipient')) {
      return {
        type: 'text',
        text: `🩸 **Universal Recipient:**\n• **AB Positive (AB+)** can receive blood from **all blood types**.`
      };
    }
    return {
      type: 'text',
      text: `🩸 **Compatibility Rules:**\n• **O-**: Gives to everyone\n• **O+**: Gives to O+, A+, B+, AB+\n• **A+**: Gives to A+, AB+\n• **B+**: Gives to B+, AB+\n• **AB+**: Universal receiver`
    };
  }

  // Eligibility
  if (q.includes('rule') || q.includes('eligib') || q.includes('how to donate') || q.includes('age')) {
    return {
      type: 'text',
      text: `📋 **Basic Donation Rules:**\n1. Age between 18 to 65 years\n2. Minimum weight 45 kg\n3. Minimum hemoglobin 12.5 g/dL\n4. 90-day cooldown between donations for men, 120 days for women.`
    };
  }

  return {
    type: 'text',
    text: `I'm here to assist with finding blood donors and answering compatibility questions!\n\nTry typing:\n• "Find B+ in Tirupati"\n• "Can O+ give to AB+?"\n• "Emergency blood request"`
  };
}
