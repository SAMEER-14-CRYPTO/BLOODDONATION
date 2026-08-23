import 'package:flutter/material.dart';
import '../../services/demo_data.dart';
import '../../core/theme/app_theme.dart';

class AdminPanelScreen extends StatefulWidget {
  const AdminPanelScreen({super.key});
  @override
  State<AdminPanelScreen> createState() => _AdminPanelScreenState();
}

class _AdminPanelScreenState extends State<AdminPanelScreen> {
  @override
  Widget build(BuildContext context) {
    final users = DemoData.users.where((u) => u.role == 'donor').toList();
    final requests = DemoData.requests;
    final activeReqs = requests.where((r) => r.status == 'active').length;

    return Scaffold(
      appBar: AppBar(
        title: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('🛡️ ', style: TextStyle(fontSize: 18)),
            Text('Admin Command Center', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: AppTheme.primary),
            onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Stats Grid
            Row(
              children: [
                _statCard('👥', '${users.length}', 'Registered Donors', AppTheme.primary),
                const SizedBox(width: 12),
                _statCard('✓', '${users.where((u) => u.availability).length}', 'Available Now', AppTheme.success),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _statCard('🚨', '$activeReqs', 'Active Alerts', const Color(0xFFFB8C00)),
                const SizedBox(width: 12),
                _statCard('🏥', '${DemoData.hospitals.length}', 'Partner Hospitals', const Color(0xFF1E88E5)),
              ],
            ),
            const SizedBox(height: 24),

            // Donor Verification Management
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Donor Verification Queue', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white)),
                Text('${users.length} Total', style: const TextStyle(color: Color(0xFF9E9E9E), fontSize: 12)),
              ],
            ),
            const SizedBox(height: 10),
            ...users.take(5).map((u) {
              return Card(
                color: const Color(0xFF1A1A2E),
                margin: const EdgeInsets.only(bottom: 8),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: const BorderSide(color: Color(0xFF2A2A3E)),
                ),
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                  leading: CircleAvatar(
                    backgroundColor: AppTheme.primary.withAlpha(30),
                    child: Text(
                      u.fullName.isNotEmpty ? u.fullName.substring(0, 1) : '?',
                      style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.w800),
                    ),
                  ),
                  title: Row(
                    children: [
                      Flexible(
                        child: Text(u.fullName, style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 14), overflow: TextOverflow.ellipsis),
                      ),
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: u.verified ? AppTheme.success.withAlpha(30) : Colors.orange.withAlpha(30),
                          borderRadius: BorderRadius.circular(50),
                        ),
                        child: Text(
                          u.verified ? '✓ Verified' : '⏳ Pending',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: u.verified ? AppTheme.success : Colors.orange),
                        ),
                      ),
                    ],
                  ),
                  subtitle: Text(
                    '${u.email} · ${u.bloodGroup} · ${u.city}',
                    style: const TextStyle(fontSize: 12, color: Color(0xFF9E9E9E)),
                  ),
                  trailing: PopupMenuButton<String>(
                    color: const Color(0xFF1A1A2E),
                    icon: const Icon(Icons.more_vert, color: Colors.white70),
                    itemBuilder: (_) => [
                      const PopupMenuItem(value: 'verify', child: Text('Verify Donor', style: TextStyle(color: AppTheme.success))),
                      const PopupMenuItem(value: 'toggle', child: Text('Toggle Availability', style: TextStyle(color: Colors.white))),
                      const PopupMenuItem(value: 'delete', child: Text('Remove', style: TextStyle(color: Colors.red))),
                    ],
                    onSelected: (v) {
                      if (v == 'verify') {
                        setState(() {
                          final idx = DemoData.users.indexOf(u);
                          if (idx != -1) {
                            DemoData.users[idx] = u.copyWith(verified: true);
                          }
                        });
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Donor verified successfully!')));
                      } else if (v == 'delete') {
                        setState(() {
                          DemoData.users.remove(u);
                        });
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('User removed.')));
                      }
                    },
                  ),
                ),
              );
            }),

            const SizedBox(height: 24),
            // Send Broadcast Notification
            const Text('📢 Global Broadcast Alert', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white)),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1A1A2E),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF2A2A3E)),
              ),
              child: Column(
                children: [
                  TextField(
                    maxLines: 2,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Type critical broadcast notification to all donors...',
                      hintStyle: const TextStyle(color: Color(0xFF9E9E9E)),
                      filled: true,
                      fillColor: const Color(0xFF0F0F1A),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF2A2A3E))),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('📢 Broadcast message dispatched to all active donors!'), backgroundColor: AppTheme.primary),
                        );
                      },
                      icon: const Icon(Icons.campaign),
                      label: const Text('Send Broadcast Alert'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _statCard(String icon, String value, String label, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1A1A2E),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF2A2A3E)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(icon, style: const TextStyle(fontSize: 22)),
            const SizedBox(height: 8),
            Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: color)),
            const SizedBox(height: 2),
            Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF9E9E9E))),
          ],
        ),
      ),
    );
  }
}
