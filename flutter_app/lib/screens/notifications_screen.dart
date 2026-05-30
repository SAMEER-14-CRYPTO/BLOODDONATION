import 'package:flutter/material.dart';
import '../services/demo_data.dart';
import '../utils/theme.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final notifs = DemoData.notifications;
    return Scaffold(
      appBar: AppBar(title: const Text('Notifications'), actions: [
        TextButton(onPressed: () {}, child: const Text('Clear All')),
      ]),
      body: ListView.builder(padding: const EdgeInsets.all(16), itemCount: notifs.length, itemBuilder: (_, i) {
        final n = notifs[i];
        IconData icon;
        Color color;
        switch (n.type) {
          case 'emergency': icon = Icons.emergency; color = AppTheme.primary; break;
          case 'reminder': icon = Icons.alarm; color = AppTheme.warning; break;
          case 'success': icon = Icons.check_circle; color = AppTheme.success; break;
          default: icon = Icons.info; color = AppTheme.info;
        }
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: CircleAvatar(backgroundColor: color.withAlpha(26), child: Icon(icon, color: color, size: 20)),
            title: Text(n.message, style: TextStyle(fontWeight: n.read ? FontWeight.normal : FontWeight.w600, fontSize: 14)),
            subtitle: Text(_timeAgo(n.createdAt), style: TextStyle(fontSize: 12, color: Colors.grey[500])),
            trailing: n.read ? null : Container(width: 8, height: 8, decoration: const BoxDecoration(shape: BoxShape.circle, color: AppTheme.primary)),
          ),
        );
      }),
    );
  }

  String _timeAgo(DateTime date) {
    final diff = DateTime.now().difference(date);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }
}
