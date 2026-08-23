import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '../constants/theme';

export default function WebViewScreen() {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading LifeLink Portal…</Text>
        </View>
      )}
      <WebView
        source={{ uri: 'https://blooddonation-three.vercel.app/' }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgDark,
    zIndex: 10,
  },
  loadingText: {
    color: Colors.textMuted,
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
  },
});
