import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/models.dart';
import '../services/demo_data.dart';

/// LifeLink Firebase Service
/// Full Cloud Firestore + Firebase Authentication integration
/// with automatic offline fallback to local persistent storage.
class FirebaseService {
  static const _donorsKey = 'll_donors';
  static const _requestsKey = 'll_requests';
  static const _usersKey = 'll_users';

  static bool _isFirebaseReady = false;
  static bool get isFirebaseReady => _isFirebaseReady;

  /// Call once at startup
  static Future<void> initialize() async {
    try {
      if (Firebase.apps.isNotEmpty) {
        _isFirebaseReady = true;
        debugPrint('[FirebaseService] 🚀 Firebase is initialized and connected.');
      }
    } catch (e) {
      _isFirebaseReady = false;
      debugPrint('[FirebaseService] ⚠️ Firebase running in offline/local mode: $e');
    }
  }

  // ── Authentication ────────────────────────────────────────────────

  /// Sign up a new user/donor with Firebase Auth & store in Firestore
  static Future<UserModel?> signUp({
    required String email,
    required String password,
    required String fullName,
    required String phone,
    required String bloodGroup,
    required String city,
    String? address,
    String? gender,
    String? dob,
  }) async {
    try {
      if (_isFirebaseReady) {
        final credential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
          email: email,
          password: password,
        );

        final user = UserModel(
          uid: credential.user?.uid ?? 'u_${DateTime.now().millisecondsSinceEpoch}',
          fullName: fullName,
          email: email,
          phone: phone,
          bloodGroup: bloodGroup,
          city: city,
          address: address ?? '',
          gender: gender ?? 'Male',
          dateOfBirth: dob ?? '',
          donorStatus: 'Active',
          verified: true,
          createdAt: DateTime.now(),
        );

        await saveUser(user);
        return user;
      }
    } catch (e) {
      debugPrint('[FirebaseService] FirebaseAuth error (fallback to local): $e');
    }

    // Local persistent fallback
    final user = UserModel(
      uid: 'u_${DateTime.now().millisecondsSinceEpoch}',
      fullName: fullName,
      email: email,
      phone: phone,
      bloodGroup: bloodGroup,
      city: city,
      address: address ?? '',
      gender: gender ?? 'Male',
      dateOfBirth: dob ?? '',
      donorStatus: 'Active',
      verified: true,
      createdAt: DateTime.now(),
    );
    await saveUser(user);
    DemoData.users.add(user);
    return user;
  }

  /// Sign in with Email and Password
  static Future<UserModel?> signIn({
    required String email,
    required String password,
  }) async {
    try {
      if (_isFirebaseReady) {
        final credential = await FirebaseAuth.instance.signInWithEmailAndPassword(
          email: email,
          password: password,
        );
        if (credential.user != null) {
          final doc = await FirebaseFirestore.instance.collection('users').doc(credential.user!.uid).get();
          if (doc.exists && doc.data() != null) {
            return UserModel.fromMap(doc.data()!, doc.id);
          }
        }
      }
    } catch (e) {
      debugPrint('[FirebaseService] FirebaseAuth signIn error (fallback to local): $e');
    }

    // Check demo data
    try {
      return DemoData.users.firstWhere((u) => u.email.toLowerCase() == email.toLowerCase());
    } catch (_) {
      return null;
    }
  }

  /// Sign Out
  static Future<void> signOut() async {
    try {
      if (_isFirebaseReady) {
        await FirebaseAuth.instance.signOut();
      }
    } catch (e) {
      debugPrint('[FirebaseService] SignOut error: $e');
    }
  }

  // ── Donors (Firestore Collection: 'donors') ───────────────────────

  /// Save a new donor registration
  static Future<bool> saveDonorRegistration(UserModel donor) async {
    final map = donor.toMap();

    // 1. Try Cloud Firestore
    if (_isFirebaseReady) {
      try {
        await FirebaseFirestore.instance
            .collection('donors')
            .doc(donor.uid)
            .set(map, SetOptions(merge: true));
        debugPrint('[FirebaseService] ✅ Donor saved to Cloud Firestore: ${donor.fullName}');
      } catch (e) {
        debugPrint('[FirebaseService] Firestore donor save error: $e');
      }
    }

    // 2. Persistent Local Storage
    try {
      final prefs = await SharedPreferences.getInstance();
      final existing = prefs.getStringList(_donorsKey) ?? [];
      existing.add(jsonEncode({'uid': donor.uid, ...map}));
      await prefs.setStringList(_donorsKey, existing);
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Get all registered donors from Firestore / Local store
  static Future<List<UserModel>> getAllDonors() async {
    if (_isFirebaseReady) {
      try {
        final snap = await FirebaseFirestore.instance.collection('donors').get();
        if (snap.docs.isNotEmpty) {
          return snap.docs.map((doc) => UserModel.fromMap(doc.data(), doc.id)).toList();
        }
      } catch (e) {
        debugPrint('[FirebaseService] Error reading donors from Firestore: $e');
      }
    }

    // Fallback to local store + DemoData
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getStringList(_donorsKey) ?? [];
      final local = raw.map((s) {
        final map = jsonDecode(s) as Map<String, dynamic>;
        return UserModel.fromMap(map, map['uid'] ?? 'u_local');
      }).toList();
      return [...DemoData.users, ...local];
    } catch (e) {
      return DemoData.users;
    }
  }

  // ── Emergency Requests (Firestore Collection: 'emergency_requests') ─

  /// Save an emergency request
  static Future<bool> saveEmergencyRequest(EmergencyRequestModel req) async {
    final map = req.toMap();

    // 1. Try Cloud Firestore
    if (_isFirebaseReady) {
      try {
        await FirebaseFirestore.instance
            .collection('emergency_requests')
            .doc(req.requestId)
            .set(map, SetOptions(merge: true));
        debugPrint('[FirebaseService] ✅ Emergency request saved to Cloud Firestore: ${req.requestId}');
      } catch (e) {
        debugPrint('[FirebaseService] Firestore emergency request error: $e');
      }
    }

    // 2. Persistent Local Storage
    try {
      final prefs = await SharedPreferences.getInstance();
      final existing = prefs.getStringList(_requestsKey) ?? [];
      existing.add(jsonEncode({'requestId': req.requestId, ...map}));
      await prefs.setStringList(_requestsKey, existing);
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Get all emergency requests
  static Future<List<EmergencyRequestModel>> getAllRequests() async {
    if (_isFirebaseReady) {
      try {
        final snap = await FirebaseFirestore.instance
            .collection('emergency_requests')
            .orderBy('createdAt', descending: true)
            .get();
        if (snap.docs.isNotEmpty) {
          return snap.docs.map((doc) => EmergencyRequestModel.fromMap(doc.data(), doc.id)).toList();
        }
      } catch (e) {
        debugPrint('[FirebaseService] Error reading requests from Firestore: $e');
      }
    }

    // Fallback to local store + DemoData
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getStringList(_requestsKey) ?? [];
      final local = raw.map((s) {
        final map = jsonDecode(s) as Map<String, dynamic>;
        return EmergencyRequestModel.fromMap(map, map['requestId'] ?? 'req_local');
      }).toList();
      return [...DemoData.requests, ...local];
    } catch (e) {
      return DemoData.requests;
    }
  }

  // ── Users (Firestore Collection: 'users') ─────────────────────────

  static Future<void> saveUser(UserModel user) async {
    if (_isFirebaseReady) {
      try {
        await FirebaseFirestore.instance
            .collection('users')
            .doc(user.uid)
            .set(user.toMap(), SetOptions(merge: true));
      } catch (e) {
        debugPrint('[FirebaseService] Save user error: $e');
      }
    }
  }
}
