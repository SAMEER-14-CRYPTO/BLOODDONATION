/// Notification model representing inside-app notification (no Firebase dependency)
class NotificationModel {
  final String id;
  final String userId;
  final String title;
  final String message;
  final String type; // 'emergency', 'reminder', 'success', 'system'
  final bool read;
  final Map<String, dynamic>? data;
  final DateTime createdAt;

  NotificationModel({
    required this.id,
    required this.userId,
    this.title = '',
    required this.message,
    this.type = 'system',
    this.read = false,
    this.data,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory NotificationModel.fromMap(Map<String, dynamic> map, String id) {
    return NotificationModel(
      id: id,
      userId: map['userId'] ?? '',
      title: map['title'] ?? '',
      message: map['message'] ?? '',
      type: map['type'] ?? 'system',
      read: map['read'] ?? false,
      data: map['data'] != null ? Map<String, dynamic>.from(map['data']) : null,
      createdAt: _parseDateTime(map['createdAt']) ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'title': title,
      'message': message,
      'type': type,
      'read': read,
      'data': data,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  Map<String, dynamic> toFirestore() => toMap();

  static DateTime? _parseDateTime(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    if (value is String) return DateTime.tryParse(value);
    return null;
  }
}
