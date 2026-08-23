// ============================================
// LIFELINK – Central Configuration
// ============================================
// ✅ No API Key needed! Maps powered by Leaflet + OpenStreetMap (100% free)

const LIFELINK_CONFIG = {
  // Default map center (India)
  defaultCenter: { lat: 20.5937, lng: 78.9629 },
  defaultZoom: 5,

  // App version
  version: '3.0.0'
};

// Safe global fallbacks for Firebase & Demo Mode
window.db = typeof window.db !== 'undefined' ? window.db : null;
window.auth = typeof window.auth !== 'undefined' ? window.auth : null;
window.DEMO_MODE = typeof window.DEMO_MODE !== 'undefined' ? window.DEMO_MODE : true;

// -----------------------------------------------
// Leaflet Map Loader (replaces Google Maps Loader)
// -----------------------------------------------
const LeafletLoader = {
  _loaded: false,
  _loading: false,
  _callbacks: [],

  /**
   * Load Leaflet.js if not already loaded, then call all queued callbacks.
   * Usage: LeafletLoader.load(myCallbackFn);
   */
  load(callback) {
    if (this._loaded) {
      callback();
      return;
    }
    this._callbacks.push(callback);
    if (this._loading) return;

    // Check if Leaflet is already loaded (e.g. via CDN in HTML)
    if (typeof L !== 'undefined') {
      this._loaded = true;
      this._flush();
      console.log('✅ Leaflet.js already loaded');
      return;
    }

    this._loading = true;

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      this._loaded = true;
      this._loading = false;
      this._flush();
      console.log('✅ Leaflet.js loaded successfully (free, no API key!)');
    };
    script.onerror = () => {
      console.error('❌ Failed to load Leaflet.js. Check your internet connection.');
      this._loaded = false;
      this._loading = false;
    };
    document.head.appendChild(script);
  },

  _flush() {
    this._callbacks.forEach(cb => {
      try { cb(); } catch (e) { console.error('Maps callback error:', e); }
    });
    this._callbacks = [];
  },

  /** True if Leaflet is available */
  isReady() {
    return typeof L !== 'undefined';
  }
};

// Backward compatibility – keep GoogleMapsLoader as an alias
const GoogleMapsLoader = LeafletLoader;
