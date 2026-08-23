import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '../constants/theme';

export default function InteractiveMap({ 
  markers = [], 
  center = { lat: 13.0827, lng: 79.8877 }, 
  zoom = 7, 
  height = 280,
  focusedMarker = null
}) {
  const webViewRef = useRef(null);
  const markersJSON = JSON.stringify(markers);

  useEffect(() => {
    if (focusedMarker && focusedMarker.lat && focusedMarker.lng && webViewRef.current) {
      const jsCode = `
        if (window.focusMarker) {
          window.focusMarker(${focusedMarker.lat}, ${focusedMarker.lng}, "${focusedMarker.name || ''}");
        }
        true;
      `;
      webViewRef.current.injectJavaScript(jsCode);
    }
  }, [focusedMarker]);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map {
            margin: 0; padding: 0; width: 100%; height: 100%;
            background-color: #111422;
          }
          .leaflet-tile-pane {
            filter: brightness(0.85) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
          }
          .custom-pin {
            display: flex; align-items: center; justify-content: center;
            border-radius: 50%; color: #fff; font-weight: 800; font-family: sans-serif;
            font-size: 11px; box-shadow: 0 2px 8px rgba(0,0,0,0.5); border: 2px solid #fff;
          }
          .pin-donor { background: #E53935; width: 30px; height: 30px; }
          .pin-hospital { background: #1E88E5; width: 30px; height: 30px; font-size: 14px; }
          .pin-bank { background: #7B1FA2; width: 30px; height: 30px; font-size: 14px; }
          .leaflet-popup-content-wrapper {
            background: #191C2E; color: #fff; border-radius: 12px; border: 1px solid #242942;
            font-family: sans-serif;
          }
          .leaflet-popup-tip { background: #191C2E; }
          .popup-title { font-weight: 800; font-size: 13px; margin-bottom: 2px; color: #E53935; }
          .popup-sub { font-size: 11px; color: #8C90AA; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', { zoomControl: true, attributionControl: false })
            .setView([${center.lat}, ${center.lng}], ${zoom});

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map);

          const markersData = ${markersJSON};
          const markerMap = {};

          markersData.forEach(m => {
            if (m.lat && m.lng) {
              let className = 'pin-donor';
              let iconHtml = m.bloodGroup || '🩸';
              if (m.type === 'hospital') { className = 'pin-hospital'; iconHtml = '🏥'; }
              if (m.type === 'bloodbank') { className = 'pin-bank'; iconHtml = '🏦'; }

              const customIcon = L.divIcon({
                className: 'custom-pin ' + className,
                html: iconHtml,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -15]
              });

              const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(map);
              marker.bindPopup(
                '<div class="popup-title">' + (m.name || m.displayName || 'Location') + '</div>' +
                '<div class="popup-sub">📍 ' + (m.address || m.city || '') + '</div>' +
                (m.contact || m.phone ? '<div class="popup-sub">📞 ' + (m.contact || m.phone) + '</div>' : '')
              );

              const key = m.lat + '_' + m.lng;
              markerMap[key] = marker;
            }
          });

          window.focusMarker = function(lat, lng, name) {
            map.flyTo([lat, lng], 13, { duration: 1.2 });
            const key = lat + '_' + lng;
            if (markerMap[key]) {
              setTimeout(() => { markerMap[key].openPopup(); }, 600);
            }
          };
        </script>
      </body>
    </html>
  `;

  return (
    <View style={[styles.mapContainer, { height }]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.cardDark,
    marginBottom: 16,
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  loader: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.bgDark,
  }
});
