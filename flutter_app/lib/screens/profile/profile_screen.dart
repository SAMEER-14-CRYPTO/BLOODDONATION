import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../utils/theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.user;
    return Scaffold(
      appBar: AppBar(title: const Text('My Profile'), actions: [
        IconButton(icon: const Icon(Icons.edit), onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Edit mode (demo)')))),
      ]),
      body: SingleChildScrollView(padding: const EdgeInsets.all(24), child: Column(children: [
        CircleAvatar(radius: 50, backgroundColor: AppTheme.primary.withAlpha(26), child: Text(user?.fullName.substring(0, 1) ?? '?', style: const TextStyle(fontSize: 36, color: AppTheme.primary, fontWeight: FontWeight.w800))),
        const SizedBox(height: 16),
        Text(user?.fullName ?? '', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
        Text(user?.email ?? '', style: TextStyle(color: Colors.grey[600])),
        const SizedBox(height: 12),
        Container(padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10), decoration: BoxDecoration(color: AppTheme.primary, borderRadius: BorderRadius.circular(50)),
          child: Text(user?.bloodGroup ?? '', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 18))),
        const SizedBox(height: 8),
        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          Icon(Icons.circle, size: 10, color: user?.availability == true ? AppTheme.success : Colors.grey),
          const SizedBox(width: 6),
          Text(user?.availability == true ? 'Available' : 'Unavailable', style: TextStyle(color: Colors.grey[600])),
        ]),
        const SizedBox(height: 24),
        // Toggle availability
        Card(child: SwitchListTile(
          title: const Text('Available for donation', style: TextStyle(fontWeight: FontWeight.w600)),
          subtitle: const Text('Toggle your availability status'),
          value: user?.availability ?? false,
          activeColor: AppTheme.success,
          onChanged: (_) => auth.toggleAvailability(),
        )),
        const SizedBox(height: 16),
        _tile(context, Icons.phone, 'Phone', user?.phone ?? '-'),
        _tile(context, Icons.location_on, 'City', user?.city ?? '-'),
        _tile(context, Icons.person, 'Gender', user?.gender ?? '-'),
        _tile(context, Icons.cake, 'Age', '${user?.age ?? '-'}'),
        _tile(context, Icons.calendar_today, 'Last Donation', user?.lastDonation ?? 'Never'),
        _tile(context, Icons.verified, 'Verified', user?.verified == true ? 'Yes ✓' : 'Pending'),
      ])),
    );
  }

  Widget _tile(BuildContext context, IconData icon, String label, String value) => Container(
    margin: const EdgeInsets.only(bottom: 8), padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(color: Theme.of(context).cardColor, borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.grey.shade200)),
    child: Row(children: [Icon(icon, color: AppTheme.primary, size: 20), const SizedBox(width: 16), Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(label, style: TextStyle(fontSize: 12, color: Colors.grey[500])), Text(value, style: const TextStyle(fontWeight: FontWeight.w600))])]),
  );
}
