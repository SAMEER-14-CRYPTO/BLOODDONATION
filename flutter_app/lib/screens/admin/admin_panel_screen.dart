import 'package:flutter/material.dart';
import '../../services/demo_data.dart';
import '../../utils/theme.dart';

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
      appBar: AppBar(title: const Text('Admin Panel'), actions: [
        IconButton(icon: const Icon(Icons.notifications), onPressed: () {}),
        IconButton(icon: const Icon(Icons.logout), onPressed: () => Navigator.pushReplacementNamed(context, '/login')),
      ]),
      body: SingleChildScrollView(padding: const EdgeInsets.all(16), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Stats
        Row(children: [
          _stat('👥', '${users.length}', 'Donors', AppTheme.primary),
          const SizedBox(width: 12),
          _stat('✓', '${users.where((u) => u.availability).length}', 'Active', AppTheme.success),
        ]),
        const SizedBox(height: 12),
        Row(children: [
          _stat('🚨', '$activeReqs', 'Requests', AppTheme.warning),
          const SizedBox(width: 12),
          _stat('🩸', '${DemoData.donations.length}', 'Donations', AppTheme.info),
        ]),
        const SizedBox(height: 24),

        // User Management
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          const Text('User Management', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
          TextButton(onPressed: () {}, child: const Text('View All')),
        ]),
        const SizedBox(height: 8),
        ...users.take(5).map((u) => Card(margin: const EdgeInsets.only(bottom: 8), child: ListTile(
          leading: CircleAvatar(backgroundColor: AppTheme.primary.withAlpha(26), child: Text(u.fullName.substring(0, 1), style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.w700))),
          title: Row(children: [
            Text(u.fullName, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
            const SizedBox(width: 8),
            Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2), decoration: BoxDecoration(
              color: u.verified ? AppTheme.success.withAlpha(26) : AppTheme.warning.withAlpha(26), borderRadius: BorderRadius.circular(50)),
              child: Text(u.verified ? '✓ Verified' : '⏳ Pending', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: u.verified ? AppTheme.success : AppTheme.warning))),
          ]),
          subtitle: Text('${u.email} · ${u.bloodGroup} · ${u.city}', style: TextStyle(fontSize: 12, color: Colors.grey[600])),
          trailing: PopupMenuButton(itemBuilder: (_) => [
            const PopupMenuItem(value: 'verify', child: Text('Verify')),
            const PopupMenuItem(value: 'delete', child: Text('Remove', style: TextStyle(color: Colors.red))),
          ], onSelected: (v) {
            if (v == 'verify') { setState(() { DemoData.users[DemoData.users.indexOf(u)] = u.copyWith(verified: true); }); ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('User verified!'))); }
            if (v == 'delete') { setState(() { DemoData.users.remove(u); }); ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('User removed'))); }
          }),
        ))),

        const SizedBox(height: 24),
        const Text('Recent Requests', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
        const SizedBox(height: 8),
        ...requests.take(4).map((r) => Card(margin: const EdgeInsets.only(bottom: 8), child: ListTile(
          leading: CircleAvatar(backgroundColor: r.urgencyLevel == 'critical' ? AppTheme.primary : AppTheme.warning, radius: 18,
            child: Text(r.bloodGroupNeeded, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700))),
          title: Text('${r.bloodGroupNeeded} — ${r.patientName}', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
          subtitle: Text('${r.hospitalName} · ${r.responses} responses', style: TextStyle(fontSize: 12, color: Colors.grey[600])),
          trailing: Chip(label: Text(r.status, style: const TextStyle(fontSize: 10)), backgroundColor: r.status == 'active' ? AppTheme.success.withAlpha(26) : Colors.grey.withAlpha(26), padding: EdgeInsets.zero, visualDensity: VisualDensity.compact),
        ))),

        const SizedBox(height: 24),
        // Broadcast
        const Text('Send Broadcast', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
        const SizedBox(height: 12),
        TextField(maxLines: 3, decoration: InputDecoration(hintText: 'Type broadcast message to all donors...', border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)))),
        const SizedBox(height: 12),
        SizedBox(width: double.infinity, child: ElevatedButton.icon(
          onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Broadcast sent to all donors!'))),
          icon: const Icon(Icons.campaign), label: const Text('Send Broadcast'),
        )),
      ])),
    );
  }

  Widget _stat(String icon, String value, String label, Color color) => Expanded(child: Container(
    padding: const EdgeInsets.all(20),
    decoration: BoxDecoration(color: color.withAlpha(26), borderRadius: BorderRadius.circular(16)),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(icon, style: const TextStyle(fontSize: 24)),
      const SizedBox(height: 8),
      Text(value, style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: color)),
      Text(label, style: TextStyle(fontSize: 13, color: Colors.grey[600])),
    ]),
  ));
}
