import 'package:flutter/material.dart';
import 'demo_data.dart';
import '../models/notification_model.dart';

/// Demo Notification Service — No Firebase Cloud Messaging
/// Adds notifications to in-memory DemoData.
class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  /// Initialize notifications (no-op in demo)
  Future<void> initialize() async {}

  /// Get FCM token (returns demo token)
  Future<String?> getToken() async => 'demo_fcm_token';

  /// Subscribe to topic (no-op)
  Future<void> subscribeToTopic(String topic) async {}

  /// Unsubscribe from topic (no-op)
  Future<void> unsubscribeFromTopic(String topic) async {}

  /// Show local notification (adds to DemoData)
  Future<void> showLocalNotification({
    required String title,
    required String body,
    String? payload,
    String? userId,
  }) async {
    debugPrint('📢 Notification: $title - $body');
    if (userId != null) {
      DemoData.notifications.insert(0, NotificationModel(
        id: 'n_${DateTime.now().millisecondsSinceEpoch}',
        userId: userId,
        title: title,
        message: body,
        type: 'system',
      ));
    }
  }

  /// Show emergency notification
  Future<void> showEmergencyNotification({
    required String bloodGroup,
    required String hospital,
    required String distance,
    String? userId,
  }) async {
    await showLocalNotification(
      title: '🚨 Emergency Blood Request',
      body: '$bloodGroup blood required near $hospital. Distance: $distance',
      userId: userId,
    );
  }
}
