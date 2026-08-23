// ============================================
// LIFELINK – Maps Module (Leaflet.js – FREE, No API Key)
// ============================================

const Maps = {
  map: null,
  markers: [],
  markerLayer: null,
  currentUserMarker: null,
  mapInstances: {},
  userCoords: null,

  // -----------------------------------------------
  // Initialize the map in a container
  // -----------------------------------------------
  init(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    // Clean up old map instance if already initialized on this container
    if (this.mapInstances[containerId]) {
      try {
        this.mapInstances[containerId].remove();
      } catch (e) {
        console.warn('Map cleanup error:', e);
      }
      delete this.mapInstances[containerId];
    }

    // Parse center properly whether passed as array [lat, lng], object {lat, lng}, or default
    let centerLat = LIFELINK_CONFIG.defaultCenter.lat;
    let centerLng = LIFELINK_CONFIG.defaultCenter.lng;

    if (Array.isArray(options.center) && options.center.length >= 2) {
      centerLat = Number(options.center[0]);
      centerLng = Number(options.center[1]);
    } else if (options.center && typeof options.center === 'object') {
      if (typeof options.center.lat !== 'undefined') centerLat = Number(options.center.lat);
      if (typeof options.center.lng !== 'undefined') centerLng = Number(options.center.lng);
    }

    const zoom = options.zoom || LIFELINK_CONFIG.defaultZoom || 5;

    // Create Leaflet map instance
    const map = L.map(containerId, {
      center: [centerLat, centerLng],
      zoom: zoom,
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: true
    });

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add tile layer matching current theme
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    this._addTileLayer(map, isDark);

    // Marker Layer Group
    const markerLayer = L.layerGroup().addTo(map);

    // Store references
    this.map = map;
    this.mapInstances[containerId] = map;
    this.markerLayer = markerLayer;

    // Geolocation if requested
    if (options.enableGeolocation) {
      this._tryUseGeolocation();
    }

    // Fire onMapReady callback
    if (typeof options.onMapReady === 'function') {
      try {
        options.onMapReady(map);
      } catch (e) {
        console.error('onMapReady callback error:', e);
      }
    }

    // Auto-listen for theme changes to swap tiles seamlessly
    this._initThemeObserver();

    // Trigger invalidateSize to ensure correct tile rendering
    setTimeout(() => map.invalidateSize(), 250);
    window.addEventListener('resize', () => {
      if (map && typeof map.invalidateSize === 'function') {
        map.invalidateSize();
      }
    });

    return map;
  },

  // -----------------------------------------------
  // Tile Layer with Dark/Light Support
  // -----------------------------------------------
  _addTileLayer(map, isDark) {
    if (!map) return;
    if (map._currentTileLayer) {
      try { map.removeLayer(map._currentTileLayer); } catch (e) {}
    }

    const tileLayer = isDark
      ? L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19
        })
      : L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19
        });

    tileLayer.addTo(map);
    map._currentTileLayer = tileLayer;
  },

  _themeObserverInitialized: false,
  _initThemeObserver() {
    if (this._themeObserverInitialized) return;
    this._themeObserverInitialized = true;

    // Watch data-theme attribute on <html> element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          this.updateTheme(isDark);
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  },

  updateTheme(isDark) {
    const dark = isDark !== undefined ? isDark : document.documentElement.getAttribute('data-theme') === 'dark';
    Object.values(this.mapInstances).forEach(map => {
      if (map) this._addTileLayer(map, dark);
    });
  },

  // -----------------------------------------------
  // Custom Marker Icons
  // -----------------------------------------------
  _createDonorIcon(donor) {
    const isAvailable = Boolean(donor.availability);
    const bgColor = isAvailable ? '#43A047' : '#757575';
    const pulseColor = isAvailable ? 'rgba(67,160,71,0.35)' : 'rgba(117,117,117,0.2)';
    const bloodGroup = donor.bloodGroup || '?';

    const html = `
      <div class="ll-marker ${isAvailable ? 'll-marker-available' : 'll-marker-unavailable'}" 
           style="--marker-color:${bgColor};--marker-pulse:${pulseColor}">
        <div class="ll-marker-pin" title="${donor.displayName || 'Donor'} (${bloodGroup})">
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

  _createHospitalIcon(hospital) {
    const html = `
      <div class="ll-marker ll-marker-hospital" title="${hospital?.name || 'Hospital'}">
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

  _createBloodBankIcon(bank) {
    const html = `
      <div class="ll-marker ll-marker-bloodbank" title="${bank?.name || 'Blood Bank'}">
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

  _createUserIcon() {
    const html = `
      <div class="ll-user-marker" title="Your Location">
        <div class="ll-user-dot"></div>
        <div class="ll-user-pulse"></div>
        <div class="ll-user-pulse ll-user-pulse-2"></div>
      </div>
    `;

    return L.divIcon({
      className: 'leaflet-user-marker',
      html: html,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -18]
    });
  },

  // -----------------------------------------------
  // Add Markers (Donors)
  // -----------------------------------------------
  addDonorMarkers(donors = [], shouldFitBounds = true) {
    if (!this.map) return;
    this.clearMarkers();

    donors.forEach((d, i) => {
      if (d.lat == null || d.lng == null) return;

      const marker = L.marker([Number(d.lat), Number(d.lng)], {
        icon: this._createDonorIcon(d),
        title: `${d.displayName || 'Donor'} (${d.bloodGroup || 'Blood'})`
      });

      const popup = L.popup({
        className: 'll-popup',
        maxWidth: 320,
        minWidth: 260,
        closeButton: true,
        autoPan: true,
        autoPanPadding: [40, 40]
      }).setContent(this._donorPopupContent(d));

      marker.bindPopup(popup);

      setTimeout(() => {
        if (this.markerLayer) marker.addTo(this.markerLayer);
      }, Math.min(i * 40, 400));

      this.markers.push(marker);
    });

    if (shouldFitBounds && donors.length > 0) {
      setTimeout(() => this.fitBoundsToMarkers(), Math.min(donors.length * 40 + 100, 500));
    }
  },

  _donorPopupContent(d) {
    const available = Boolean(d.availability);
    const statusColor = available ? '#43A047' : '#757575';
    const statusText = available ? '✅ Available Now' : '⭕ Currently Unavailable';
    const statusBg = available ? 'rgba(67,160,71,0.12)' : 'rgba(158,158,158,0.12)';
    const initials = (d.displayName || 'Donor').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

    let distStr = '';
    if (this.userCoords && d.lat != null && d.lng != null) {
      const dist = this.calculateDistance(this.userCoords.lat, this.userCoords.lng, d.lat, d.lng);
      distStr = `<div style="font-size:0.8rem;color:#1E88E5;font-weight:700;margin-top:2px">📍 ~${dist} km from you</div>`;
    }

    return `
      <div class="ll-popup-content">
        <div class="ll-popup-header">
          <div class="ll-popup-avatar">${initials}</div>
          <div class="ll-popup-info">
            <div class="ll-popup-name">${d.displayName || 'Verified Donor'}</div>
            <div class="ll-popup-city">📍 ${d.city || 'India'}</div>
            ${distStr}
          </div>
          <div class="ll-popup-blood">${d.bloodGroup || 'Blood'}</div>
        </div>
        ${d.address ? `<div class="ll-popup-address">${d.address}</div>` : ''}
        <div class="ll-popup-status" style="background:${statusBg};border-left:3px solid ${statusColor}">
          <div style="color:${statusColor};font-weight:700;font-size:0.85rem">${statusText}</div>
          ${d.lastDonation ? `<div style="color:var(--text-secondary,#666);font-size:0.78rem;margin-top:4px">🩸 Last Donated: ${d.lastDonation}</div>` : ''}
          ${d.verified ? `<div style="color:#1E88E5;font-size:0.78rem;margin-top:2px;font-weight:600">✓ Verified Donor Profile</div>` : ''}
        </div>
        <div class="ll-popup-coords">🌐 Lat: ${Number(d.lat).toFixed(4)}, Lng: ${Number(d.lng).toFixed(4)}</div>
        <div style="display:flex;gap:8px;margin-top:10px">
          ${d.phone ? `<a href="tel:${d.phone}" class="ll-popup-call" style="flex:1;text-align:center">📞 Call ${d.phone}</a>` : ''}
          <a href="search.html?bg=${encodeURIComponent(d.bloodGroup || '')}" class="ll-popup-call" style="background:var(--primary,#e53935);flex:1;text-align:center">🔍 View Profile</a>
        </div>
      </div>
    `;
  },

  // -----------------------------------------------
  // Add Markers (Hospitals)
  // -----------------------------------------------
  addHospitalMarkers(hospitals = [], shouldFitBounds = true) {
    if (!this.map) return;
    this.clearMarkers();

    hospitals.forEach((h, i) => {
      if (h.lat == null || h.lng == null) return;

      const marker = L.marker([Number(h.lat), Number(h.lng)], {
        icon: this._createHospitalIcon(h),
        title: h.name || 'Hospital'
      });

      const popup = L.popup({
        className: 'll-popup',
        maxWidth: 320,
        minWidth: 260
      }).setContent(this._hospitalPopupContent(h));

      marker.bindPopup(popup);

      setTimeout(() => {
        if (this.markerLayer) marker.addTo(this.markerLayer);
      }, Math.min(i * 40, 400));

      this.markers.push(marker);
    });

    if (shouldFitBounds && hospitals.length > 0) {
      setTimeout(() => this.fitBoundsToMarkers(), Math.min(hospitals.length * 40 + 100, 500));
    }
  },

  _hospitalPopupContent(h) {
    const stockBadges = Object.entries(h.bloodAvailability || {})
      .map(([g, c]) => {
        const col = c > 5 ? '#43A047' : c > 0 ? '#FB8C00' : '#E53935';
        return `<span class="ll-stock-badge" style="background:${col}15;color:${col};border:1px solid ${col}33">${g}: <strong>${c}</strong></span>`;
      }).join('');

    let distStr = '';
    if (this.userCoords && h.lat != null && h.lng != null) {
      const dist = this.calculateDistance(this.userCoords.lat, this.userCoords.lng, h.lat, h.lng);
      distStr = `<div style="font-size:0.8rem;color:#1E88E5;font-weight:700;margin-top:2px">📍 ~${dist} km from you</div>`;
    }

    return `
      <div class="ll-popup-content">
        <div class="ll-popup-name" style="font-size:1.1rem;margin-bottom:4px">🏥 ${h.name}</div>
        <div class="ll-popup-address">${h.address || 'Hospital Center'}</div>
        ${distStr}
        <div style="font-weight:700;font-size:0.85rem;margin:12px 0 6px;color:var(--text,#212121)">Available Blood Stock:</div>
        <div class="ll-stock-grid">${stockBadges || '<span style="font-size:0.8rem;color:#757575">Stock info available on call</span>'}</div>
        <div style="display:flex;gap:8px;margin-top:10px">
          ${h.contact ? `<a href="tel:${h.contact}" class="ll-popup-call" style="background:#1E88E5;flex:1;text-align:center">📞 Call ${h.contact}</a>` : ''}
          <a href="emergency.html" class="ll-popup-call" style="background:#dc2626;flex:1;text-align:center">🚨 Request Blood</a>
        </div>
      </div>
    `;
  },

  // -----------------------------------------------
  // Add Markers (Blood Banks)
  // -----------------------------------------------
  addBloodBankMarkers(banks = [], shouldFitBounds = true) {
    if (!this.map) return;
    this.clearMarkers();

    banks.forEach((b, i) => {
      if (b.lat == null || b.lng == null) return;

      const marker = L.marker([Number(b.lat), Number(b.lng)], {
        icon: this._createBloodBankIcon(b),
        title: b.name || 'Blood Bank'
      });

      const popup = L.popup({
        className: 'll-popup',
        maxWidth: 320,
        minWidth: 260
      }).setContent(this._bloodBankPopupContent(b));

      marker.bindPopup(popup);

      setTimeout(() => {
        if (this.markerLayer) marker.addTo(this.markerLayer);
      }, Math.min(i * 40, 400));

      this.markers.push(marker);
    });

    if (shouldFitBounds && banks.length > 0) {
      setTimeout(() => this.fitBoundsToMarkers(), Math.min(banks.length * 40 + 100, 500));
    }
  },

  _bloodBankPopupContent(b) {
    const stockBadges = Object.entries(b.stocks || {})
      .map(([g, c]) => {
        const col = c > 10 ? '#43A047' : c > 0 ? '#FB8C00' : '#E53935';
        return `<span class="ll-stock-badge" style="background:${col}15;color:${col};border:1px solid ${col}33">${g}: <strong>${c}</strong></span>`;
      }).join('');

    let distStr = '';
    if (this.userCoords && b.lat != null && b.lng != null) {
      const dist = this.calculateDistance(this.userCoords.lat, this.userCoords.lng, b.lat, b.lng);
      distStr = `<div style="font-size:0.8rem;color:#1E88E5;font-weight:700;margin-top:2px">📍 ~${dist} km from you</div>`;
    }

    return `
      <div class="ll-popup-content">
        <div class="ll-popup-name" style="font-size:1.1rem;margin-bottom:4px">🩸 ${b.name}</div>
        <div class="ll-popup-address">${b.address || 'Blood Bank Storage'}</div>
        ${distStr}
        ${stockBadges ? `<div style="font-weight:700;font-size:0.85rem;margin:12px 0 6px;color:var(--text,#212121)">Stored Units:</div><div class="ll-stock-grid">${stockBadges}</div>` : ''}
        <div style="display:flex;gap:8px;margin-top:10px">
          ${b.contact ? `<a href="tel:${b.contact}" class="ll-popup-call" style="background:#E53935;flex:1;text-align:center">📞 Call ${b.contact}</a>` : ''}
          <a href="blood-banks.html" class="ll-popup-call" style="background:#1E88E5;flex:1;text-align:center">🏥 All Banks</a>
        </div>
      </div>
    `;
  },

  // -----------------------------------------------
  // Combined Multi-Layer Markers
  // -----------------------------------------------
  addCombinedMarkers({ donors = [], hospitals = [], bloodBanks = [] }, shouldFitBounds = true) {
    if (!this.map) return;
    this.clearMarkers();

    let allItems = [];

    donors.forEach(d => {
      if (d.lat != null && d.lng != null) {
        const marker = L.marker([Number(d.lat), Number(d.lng)], {
          icon: this._createDonorIcon(d),
          title: `${d.displayName} (${d.bloodGroup})`
        }).bindPopup(L.popup({ className: 'll-popup', maxWidth: 320, minWidth: 260 }).setContent(this._donorPopupContent(d)));
        allItems.push(marker);
      }
    });

    hospitals.forEach(h => {
      if (h.lat != null && h.lng != null) {
        const marker = L.marker([Number(h.lat), Number(h.lng)], {
          icon: this._createHospitalIcon(h),
          title: h.name
        }).bindPopup(L.popup({ className: 'll-popup', maxWidth: 320, minWidth: 260 }).setContent(this._hospitalPopupContent(h)));
        allItems.push(marker);
      }
    });

    bloodBanks.forEach(b => {
      if (b.lat != null && b.lng != null) {
        const marker = L.marker([Number(b.lat), Number(b.lng)], {
          icon: this._createBloodBankIcon(b),
          title: b.name
        }).bindPopup(L.popup({ className: 'll-popup', maxWidth: 320, minWidth: 260 }).setContent(this._bloodBankPopupContent(b)));
        allItems.push(marker);
      }
    });

    allItems.forEach((marker, i) => {
      setTimeout(() => {
        if (this.markerLayer) marker.addTo(this.markerLayer);
      }, Math.min(i * 25, 400));
      this.markers.push(marker);
    });

    if (shouldFitBounds && allItems.length > 0) {
      setTimeout(() => this.fitBoundsToMarkers(), Math.min(allItems.length * 25 + 100, 500));
    }
  },

  // -----------------------------------------------
  // User Location Marker
  // -----------------------------------------------
  addUserLocationMarker(lat, lng, label = 'Your Current Location') {
    if (!this.map) return;
    this.userCoords = { lat: Number(lat), lng: Number(lng) };

    if (this.currentUserMarker) {
      try { this.map.removeLayer(this.currentUserMarker); } catch (e) {}
    }

    this.currentUserMarker = L.marker([lat, lng], {
      icon: this._createUserIcon(),
      title: label,
      zIndexOffset: 1000
    }).addTo(this.map);

    this.currentUserMarker.bindPopup(`
      <div class="ll-popup-content" style="text-align:center">
        <div style="font-weight:800;font-size:1rem;color:var(--primary,#E53935)">📍 ${label}</div>
        <div style="font-size:0.8rem;color:var(--text-secondary,#666);margin-top:4px">
          GPS: ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}
        </div>
      </div>
    `, { className: 'll-popup' });
  },

  // -----------------------------------------------
  // Map / Marker Utilities
  // -----------------------------------------------
  clearMarkers() {
    if (this.markerLayer) {
      this.markerLayer.clearLayers();
    }
    this.markers = [];
  },

  setCenter(coords, zoom) {
    if (!this.map || !coords) return;
    let lat, lng;
    if (Array.isArray(coords)) {
      lat = coords[0];
      lng = coords[1];
    } else if (typeof coords === 'object') {
      lat = coords.lat;
      lng = coords.lng;
    }
    if (lat != null && lng != null) {
      this.map.flyTo([lat, lng], zoom || this.map.getZoom(), {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
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
      padding: [45, 45],
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
        this.userCoords = coords;
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
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        this.userCoords = coords;
        callback(coords);
      },
      () => callback(null),
      { timeout: 8000 }
    );
  },

  // -----------------------------------------------
  // Distance Calculation (Haversine formula in KM)
  // -----------------------------------------------
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius in km
    const dLat = (Number(lat2) - Number(lat1)) * Math.PI / 180;
    const dLng = (Number(lng2) - Number(lng1)) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(Number(lat1) * Math.PI / 180) * Math.cos(Number(lat2) * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  },

  // -----------------------------------------------
  // Location Search & Geocoding
  // -----------------------------------------------
  searchLocation(query, callback) {
    if (!query) { callback(null); return; }
    // Check DemoData predefined city coords first for instant response
    if (typeof DemoData !== 'undefined' && typeof DemoData.getCoordsForCity === 'function') {
      const quickCoords = DemoData.getCoordsForCity(query);
      if (quickCoords && quickCoords.lat !== 20.5937) {
        callback({ lat: quickCoords.lat, lng: quickCoords.lng, name: query });
        return;
      }
    }
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
