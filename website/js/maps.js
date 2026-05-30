// ============================================
// LIFELINK – Maps Module (Leaflet.js – FREE, No API Key)
// ============================================

const Maps = {
  map: null,
  markers: [],
  markerLayer: null,
  currentUserMarker: null,
  mapInstances: {},

  // -----------------------------------------------
  // Initialize the map in a container
  // -----------------------------------------------
  init(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clean up old map instance
    if (this.mapInstances[containerId]) {
      this.mapInstances[containerId].remove();
      delete this.mapInstances[containerId];
    }

    const center = options.center || LIFELINK_CONFIG.defaultCenter;
    const zoom = options.zoom || LIFELINK_CONFIG.defaultZoom;

    // Create map
    const map = L.map(containerId, {
      center: [center.lat, center.lng],
      zoom: zoom,
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: true
    });

    // Add zoom control to right side
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Choose tile layer based on theme
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    this._addTileLayer(map, isDark);

    // Store reference
    this.map = map;
    this.mapInstances[containerId] = map;
    this.markerLayer = L.layerGroup().addTo(map);

    // Enable geolocation if requested
    if (options.enableGeolocation) {
      this._tryUseGeolocation();
    }

    // Fire ready callback
    if (typeof options.onMapReady === 'function') {
      options.onMapReady(map);
    }

    // Handle resize
    setTimeout(() => map.invalidateSize(), 200);
    window.addEventListener('resize', () => map.invalidateSize());

    return map;
  },

  _addTileLayer(map, isDark) {
    if (isDark) {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);
    } else {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);
    }
  },

  // -----------------------------------------------
  // Create custom donor marker icon
  // -----------------------------------------------
  _createDonorIcon(donor) {
    const isAvailable = donor.availability;
    const bgColor = isAvailable ? '#43A047' : '#9E9E9E';
    const pulseColor = isAvailable ? 'rgba(67,160,71,0.3)' : 'rgba(158,158,158,0.2)';
    const bloodGroup = donor.bloodGroup || '?';

    const html = `
      <div class="ll-marker ${isAvailable ? 'll-marker-available' : 'll-marker-unavailable'}" 
           style="--marker-color:${bgColor};--marker-pulse:${pulseColor}">
        <div class="ll-marker-pin">
          <span class="ll-marker-bg">${bloodGroup}</span>
        </div>
        ${isAvailable ? '<div class="ll-marker-pulse"></div>' : ''}
      </div>
    `;

    return L.divIcon({
      className: 'leaflet-donor-marker',
      html: html,
      iconSize: [44, 56],
      iconAnchor: [22, 56],
      popupAnchor: [0, -50]
    });
  },

  // -----------------------------------------------
  // Create hospital marker icon
  // -----------------------------------------------
  _createHospitalIcon() {
    const html = `
      <div class="ll-marker ll-marker-hospital">
        <div class="ll-marker-pin ll-marker-pin-hospital">
          <span>🏥</span>
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'leaflet-hospital-marker',
      html: html,
      iconSize: [44, 56],
      iconAnchor: [22, 56],
      popupAnchor: [0, -50]
    });
  },

  // -----------------------------------------------
  // Create blood bank marker icon
  // -----------------------------------------------
  _createBloodBankIcon() {
    const html = `
      <div class="ll-marker ll-marker-bloodbank">
        <div class="ll-marker-pin ll-marker-pin-bloodbank">
          <span>🩸</span>
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'leaflet-bloodbank-marker',
      html: html,
      iconSize: [44, 56],
      iconAnchor: [22, 56],
      popupAnchor: [0, -50]
    });
  },

  // -----------------------------------------------
  // Create user location marker
  // -----------------------------------------------
  _createUserIcon() {
    const html = `
      <div class="ll-user-marker">
        <div class="ll-user-dot"></div>
        <div class="ll-user-pulse"></div>
        <div class="ll-user-pulse ll-user-pulse-2"></div>
      </div>
    `;

    return L.divIcon({
      className: 'leaflet-user-marker',
      html: html,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -16]
    });
  },

  // -----------------------------------------------
  // Donor Markers
  // -----------------------------------------------
  addDonorMarkers(donors) {
    if (!this.map) return;
    this.clearMarkers();

    donors.forEach((d, i) => {
      if (d.lat == null || d.lng == null) return;

      const marker = L.marker([Number(d.lat), Number(d.lng)], {
        icon: this._createDonorIcon(d),
        title: `${d.displayName} (${d.bloodGroup})`
      });

      const popup = L.popup({
        className: 'll-popup',
        maxWidth: 300,
        minWidth: 240,
        closeButton: true,
        autoPan: true,
        autoPanPadding: [40, 40]
      }).setContent(this._donorPopupContent(d));

      marker.bindPopup(popup);

      // Add with animation delay
      setTimeout(() => {
        marker.addTo(this.markerLayer);
      }, i * 80);

      this.markers.push(marker);
    });

    // Fit bounds after all markers
    setTimeout(() => this.fitBoundsToMarkers(), donors.length * 80 + 200);
  },

  _donorPopupContent(d) {
    const available = d.availability;
    const statusColor = available ? '#43A047' : '#9E9E9E';
    const statusText = available ? '✅ Available Now' : '⭕ Currently Unavailable';
    const statusBg = available ? 'rgba(67,160,71,0.1)' : 'rgba(158,158,158,0.1)';
    const initials = (d.displayName || '?').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

    return `
      <div class="ll-popup-content">
        <div class="ll-popup-header">
          <div class="ll-popup-avatar">${initials}</div>
          <div class="ll-popup-info">
            <div class="ll-popup-name">${d.displayName}</div>
            <div class="ll-popup-city">📍 ${d.city || 'India'}</div>
          </div>
          <div class="ll-popup-blood">${d.bloodGroup}</div>
        </div>
        ${d.address ? `<div class="ll-popup-address">${d.address}</div>` : ''}
        <div class="ll-popup-status" style="background:${statusBg};border-left:3px solid ${statusColor}">
          <div style="color:${statusColor};font-weight:600;font-size:0.85rem">${statusText}</div>
          ${d.lastDonation ? `<div style="color:#757575;font-size:0.78rem;margin-top:3px">🩸 Last donated: ${d.lastDonation}</div>` : ''}
          ${d.verified ? `<div style="color:#1E88E5;font-size:0.78rem;margin-top:3px">✓ Verified Donor</div>` : ''}
        </div>
        <div class="ll-popup-coords">🌐 ${Number(d.lat).toFixed(4)}, ${Number(d.lng).toFixed(4)}</div>
        ${d.phone ? `<a href="tel:${d.phone}" class="ll-popup-call">📞 Call ${d.phone}</a>` : ''}
      </div>
    `;
  },

  // -----------------------------------------------
  // Hospital Markers
  // -----------------------------------------------
  addHospitalMarkers(hospitals) {
    if (!this.map) return;
    this.clearMarkers();

    hospitals.forEach((h, i) => {
      if (h.lat == null || h.lng == null) return;

      const marker = L.marker([Number(h.lat), Number(h.lng)], {
        icon: this._createHospitalIcon(),
        title: h.name
      });

      const popup = L.popup({
        className: 'll-popup',
        maxWidth: 300,
        minWidth: 240
      }).setContent(this._hospitalPopupContent(h));

      marker.bindPopup(popup);

      setTimeout(() => {
        marker.addTo(this.markerLayer);
      }, i * 100);

      this.markers.push(marker);
    });

    setTimeout(() => this.fitBoundsToMarkers(), hospitals.length * 100 + 200);
  },

  _hospitalPopupContent(h) {
    const stockBadges = Object.entries(h.bloodAvailability || {})
      .map(([g, c]) => {
        const col = c > 5 ? '#43A047' : c > 0 ? '#FB8C00' : '#E53935';
        return `<span class="ll-stock-badge" style="background:${col}15;color:${col};border:1px solid ${col}33">${g}: ${c}</span>`;
      }).join('');

    return `
      <div class="ll-popup-content">
        <div class="ll-popup-name" style="font-size:1.05rem;margin-bottom:6px">🏥 ${h.name}</div>
        <div class="ll-popup-address">${h.address}</div>
        <div style="font-weight:600;font-size:0.82rem;margin:10px 0 6px;color:#212121">Blood Stock:</div>
        <div class="ll-stock-grid">${stockBadges}</div>
        ${h.contact ? `<a href="tel:${h.contact}" class="ll-popup-call" style="background:#1E88E5">📞 ${h.contact}</a>` : ''}
      </div>
    `;
  },

  // -----------------------------------------------
  // Blood Bank Markers
  // -----------------------------------------------
  addBloodBankMarkers(banks) {
    if (!this.map) return;

    banks.forEach((b, i) => {
      if (!b.lat || !b.lng) return;

      const marker = L.marker([Number(b.lat), Number(b.lng)], {
        icon: this._createBloodBankIcon(),
        title: b.name
      });

      const popup = L.popup({
        className: 'll-popup',
        maxWidth: 280,
        minWidth: 220
      }).setContent(`
        <div class="ll-popup-content">
          <div class="ll-popup-name" style="font-size:1.05rem;margin-bottom:6px">🩸 ${b.name}</div>
          <div class="ll-popup-address">${b.address}</div>
          ${b.contact ? `<a href="tel:${b.contact}" class="ll-popup-call" style="background:#E53935">📞 ${b.contact}</a>` : ''}
        </div>
      `);

      marker.bindPopup(popup);

      setTimeout(() => {
        marker.addTo(this.markerLayer);
      }, i * 100);

      this.markers.push(marker);
    });
  },

  // -----------------------------------------------
  // User Location Marker
  // -----------------------------------------------
  addUserLocationMarker(lat, lng, label = 'You are here') {
    if (!this.map) return;
    if (this.currentUserMarker) {
      this.map.removeLayer(this.currentUserMarker);
    }

    this.currentUserMarker = L.marker([lat, lng], {
      icon: this._createUserIcon(),
      title: label,
      zIndexOffset: 999
    }).addTo(this.map);

    this.currentUserMarker.bindPopup(`
      <div class="ll-popup-content">
        <div style="text-align:center;font-weight:700;font-size:0.95rem">📍 ${label}</div>
        <div style="text-align:center;font-size:0.8rem;color:#757575;margin-top:4px">
          ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}
        </div>
      </div>
    `, { className: 'll-popup' }).openPopup();
  },

  // -----------------------------------------------
  // Marker / Map Utilities
  // -----------------------------------------------
  clearMarkers() {
    if (this.markerLayer) {
      this.markerLayer.clearLayers();
    }
    this.markers = [];
  },

  setCenter(coords, zoom) {
    if (!this.map || !coords) return;
    this.map.flyTo([coords.lat, coords.lng], zoom || this.map.getZoom(), {
      duration: 1.2,
      easeLinearity: 0.25
    });
  },

  fitBoundsToMarkers() {
    if (!this.map || this.markers.length === 0) return;
    if (this.markers.length === 1) {
      const pos = this.markers[0].getLatLng();
      this.map.flyTo(pos, 13, { duration: 1 });
      return;
    }
    const group = L.featureGroup(this.markers);
    this.map.fitBounds(group.getBounds(), {
      padding: [50, 50],
      maxZoom: 14,
      animate: true,
      duration: 1
    });
  },

  // -----------------------------------------------
  // Geolocation
  // -----------------------------------------------
  _tryUseGeolocation() {
    if (!navigator.geolocation || !this.map) return;
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.setCenter(coords, 12);
        this.addUserLocationMarker(coords.lat, coords.lng);
      },
      () => { /* denied — keep default center */ },
      { timeout: 8000 }
    );
  },

  getUserLocation(callback) {
    if (!navigator.geolocation) { callback(null); return; }
    navigator.geolocation.getCurrentPosition(
      pos => callback({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => callback(null),
      { timeout: 8000 }
    );
  },

  // -----------------------------------------------
  // Distance (Haversine)
  // -----------------------------------------------
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  },

  // -----------------------------------------------
  // Search location using Nominatim (free)
  // -----------------------------------------------
  searchLocation(query, callback) {
    if (!query) { callback(null); return; }
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}&limit=1`)
      .then(r => r.json())
      .then(results => {
        if (results && results.length > 0) {
          callback({
            lat: parseFloat(results[0].lat),
            lng: parseFloat(results[0].lon),
            name: results[0].display_name
          });
        } else {
          callback(null);
        }
      })
      .catch(() => callback(null));
  },

  geocodeAddress(address, callback) {
    this.searchLocation(address, callback);
  }
};
