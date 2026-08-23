// File generated for LifeLink Firebase integration.
// Project: LIFELINK APP (lifelink-app-9315f)
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
///
/// Example:
/// ```dart
/// import 'firebase_options.dart';
/// // ...
/// await Firebase.initializeApp(
///   options: DefaultFirebaseOptions.currentPlatform,
/// );
/// ```
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        return ios;
      case TargetPlatform.windows:
        return windows;
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        return web;
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyCkw1YvaS98nyeSnUrHtBzUfz9wYkRFhbo',
    appId: '1:59407098111:web:df65e13d249cf26e67ecca',
    messagingSenderId: '59407098111',
    projectId: 'lifelink-app-9315f',
    authDomain: 'lifelink-app-9315f.firebaseapp.com',
    storageBucket: 'lifelink-app-9315f.firebasestorage.app',
    measurementId: 'G-DWZ6KX9GT5',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyCkw1YvaS98nyeSnUrHtBzUfz9wYkRFhbo',
    appId: '1:59407098111:android:df65e13d249cf26e67ecca',
    messagingSenderId: '59407098111',
    projectId: 'lifelink-app-9315f',
    storageBucket: 'lifelink-app-9315f.firebasestorage.app',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyCkw1YvaS98nyeSnUrHtBzUfz9wYkRFhbo',
    appId: '1:59407098111:ios:df65e13d249cf26e67ecca',
    messagingSenderId: '59407098111',
    projectId: 'lifelink-app-9315f',
    storageBucket: 'lifelink-app-9315f.firebasestorage.app',
    iosBundleId: 'com.lifelink.bloodlife',
  );

  static const FirebaseOptions windows = FirebaseOptions(
    apiKey: 'AIzaSyCkw1YvaS98nyeSnUrHtBzUfz9wYkRFhbo',
    appId: '1:59407098111:web:df65e13d249cf26e67ecca',
    messagingSenderId: '59407098111',
    projectId: 'lifelink-app-9315f',
    authDomain: 'lifelink-app-9315f.firebaseapp.com',
    storageBucket: 'lifelink-app-9315f.firebasestorage.app',
  );
}
