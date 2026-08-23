import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, View, StatusBar, SafeAreaView, BackHandler, 
  ActivityIndicator, Text, TouchableOpacity, Linking, TextInput, Modal, Alert, Platform 
} from 'react-native';
import { WebView } from 'react-native-webview';

// Default connection URL (Local Wi-Fi IP and localhost)
const DEFAULT_URL = 'http://192.168.1.6:3000';

export default function App() {
  const webViewRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_URL);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customInputUrl, setCustomInputUrl] = useState(DEFAULT_URL);

  // Handle Android Hardware Back Button
  useEffect(() => {
    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [canGoBack]);

  // Handle external links (Phone calls, WhatsApp, Map directions, SMS)
  const handleShouldStartLoad = (request) => {
    const { url } = request;
    if (
      url.startsWith('tel:') || 
      url.startsWith('mailto:') || 
      url.startsWith('sms:') || 
      url.startsWith('geo:') || 
      url.includes('wa.me') || 
      url.includes('api.whatsapp.com')
    ) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Unable to open', `Could not open link: ${url}`);
      });
      return false;
    }
    return true;
  };

  const handleReload = () => {
    setHasError(false);
    setLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleSaveCustomUrl = () => {
    let cleanUrl = customInputUrl.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'http://' + cleanUrl;
    }
    setCurrentUrl(cleanUrl);
    setShowConfigModal(false);
    setHasError(false);
    setLoading(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111422" />

      {/* Top Native Control Strip */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Text style={styles.logoIcon}>🩸</Text>
          <Text style={styles.brandText}>Life<Text style={{ color: '#E53935' }}>Link</Text></Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>APP</Text>
          </View>
        </View>
        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={styles.iconBtn} 
            onPress={handleReload}
            title="Reload"
          >
            <Text style={styles.iconText}>🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconBtn} 
            onPress={() => setShowConfigModal(true)}
            title="Settings"
          >
            <Text style={styles.iconText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Spinner */}
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#E53935" />
          <Text style={styles.loaderText}>Connecting to LifeLink Live App…</Text>
        </View>
      )}

      {/* Error Fallback Screen */}
      {hasError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>📡</Text>
          <Text style={styles.errorTitle}>Cannot Connect to LifeLink Server</Text>
          <Text style={styles.errorDesc}>
            Ensure your computer and mobile phone are connected to the same Wi-Fi network.
          </Text>
          <Text style={styles.errorUrl}>Target: {currentUrl}</Text>
          
          <View style={styles.errorBtnRow}>
            <TouchableOpacity style={styles.retryBtn} onPress={handleReload}>
              <Text style={styles.retryBtnText}>🔄 Retry Connection</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.changeIpBtn} onPress={() => setShowConfigModal(true)}>
              <Text style={styles.changeIpBtnText}>⚙️ Change Server IP</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Full Screen 1:1 Web Application */
        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          geolocationEnabled={true}
          mixedContentMode="always"
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => { setLoading(false); setHasError(false); }}
          onError={() => { setLoading(false); setHasError(true); }}
          onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
        />
      )}

      {/* Server Configuration Modal */}
      <Modal visible={showConfigModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>⚙️ LifeLink Server Connection</Text>
            <Text style={styles.modalDesc}>
              Enter your computer's local IP address or web hosting URL:
            </Text>

            <TextInput
              style={styles.modalInput}
              value={customInputUrl}
              onChangeText={setCustomInputUrl}
              placeholder="e.g. http://192.168.1.6:3000"
              placeholderTextColor="#8C90AA"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.presetButtons}>
              <TouchableOpacity 
                style={styles.presetChip}
                onPress={() => setCustomInputUrl('http://192.168.1.6:3000')}
              >
                <Text style={styles.presetChipText}>📍 Wi-Fi (192.168.1.6:3000)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.presetChip}
                onPress={() => setCustomInputUrl('http://localhost:3000')}
              >
                <Text style={styles.presetChipText}>💻 Localhost (3000)</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setShowConfigModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={handleSaveCustomUrl}
              >
                <Text style={styles.saveBtnText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111422',
  },
  topBar: {
    height: 48,
    backgroundColor: '#16192B',
    borderBottomWidth: 1,
    borderBottomColor: '#242942',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoIcon: {
    fontSize: 18,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 160, 71, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(67, 160, 71, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
    marginLeft: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#43A047',
  },
  liveText: {
    color: '#43A047',
    fontSize: 9,
    fontWeight: '900',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 14,
  },
  webview: {
    flex: 1,
    backgroundColor: '#111422',
  },
  loaderOverlay: {
    position: 'absolute',
    top: 48, left: 0, right: 0, bottom: 0,
    backgroundColor: '#111422',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loaderText: {
    color: '#8C90AA',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 14,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#111422',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDesc: {
    color: '#8C90AA',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  errorUrl: {
    color: '#E53935',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 24,
  },
  errorBtnRow: {
    width: '100%',
    gap: 10,
  },
  retryBtn: {
    backgroundColor: '#E53935',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  changeIpBtn: {
    backgroundColor: 'rgba(30, 136, 229, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(30, 136, 229, 0.3)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  changeIpBtnText: {
    color: '#42A5F5',
    fontWeight: '800',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#191C2E',
    borderWidth: 1,
    borderColor: '#242942',
    borderRadius: 20,
    padding: 22,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  modalDesc: {
    fontSize: 12,
    color: '#8C90AA',
    marginBottom: 14,
    lineHeight: 16,
  },
  modalInput: {
    backgroundColor: '#111422',
    borderWidth: 1,
    borderColor: '#242942',
    borderRadius: 12,
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    marginBottom: 12,
  },
  presetButtons: {
    gap: 6,
    marginBottom: 18,
  },
  presetChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  presetChipText: {
    color: '#42A5F5',
    fontSize: 12,
    fontWeight: '600',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#E53935',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
