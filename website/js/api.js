// ============================================
// LifeLink – Database API Client (PDD Project)
// Connects frontend to SQLite backend
// ============================================

const LifeLinkAPI = {
  baseUrl: '',
  connected: false,

  init() {
    // If running on custom dev server (Live Server 5500/8080) or file protocol, default to localhost:3000
    if (!window.location.origin || window.location.origin === 'null' || window.location.port !== '3000') {
      this.baseUrl = 'http://localhost:3000';
    } else {
      this.baseUrl = window.location.origin;
    }
  },

  getToken() {
    return localStorage.getItem('lifelink_token');
  },

  setToken(token) {
    if (token) localStorage.setItem('lifelink_token', token);
    else localStorage.removeItem('lifelink_token');
  },

  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = this.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(data.error || `Request failed (${res.status})`);
        err.status = res.status;
        throw err;
      }
      return data;
    } catch (e) {
      if (e.status) throw e;
      throw new Error('Cannot reach database server. Start it with: cd server && npm start');
    }
  },

  async checkHealth() {
    try {
      const data = await this.request('/api/health');
      this.connected = !!data.ok;
      return data;
    } catch (e) {
      this.connected = false;
      return null;
    }
  },

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async login(email, password, role) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    });
    if (data.token) this.setToken(data.token);
    return data;
  },

  async googleAuth(userData) {
    const data = await this.request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (data.token) this.setToken(data.token);
    return data;
  },

  async me() {
    return this.request('/api/auth/me');
  },

  async getDonors() {
    const data = await this.request('/api/donors');
    return data.donors || [];
  },

  async getEmergencyRequests() {
    const data = await this.request('/api/emergency/requests');
    return data.requests || [];
  },

  async createEmergencyRequest(requestData) {
    return this.request('/api/emergency/requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },

  async respondToRequest(id) {
    return this.request(`/api/emergency/requests/${id}/respond`, { method: 'PATCH' });
  },

  async updateUser(uid, updates) {
    return this.request(`/api/users/${uid}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }
};

LifeLinkAPI.init();
