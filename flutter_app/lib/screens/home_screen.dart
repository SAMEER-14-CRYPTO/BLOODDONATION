import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/donor_provider.dart';
import '../services/demo_data.dart';
import '../utils/theme.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.user;

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _buildHome(user),
          _buildSearch(),
          _buildEmergency(),
          _buildProfile(user),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.search), selectedIcon: Icon(Icons.search), label: 'Search'),
          NavigationDestination(icon: Icon(Icons.emergency_outlined), selectedIcon: Icon(Icons.emergency), label: 'Emergency'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }

  Widget _buildHome(user) {
    final requests = DemoData.requests.where((r) => r.status == 'active').toList();
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Hello, ${user?.fullName?.split(' ').first ?? 'User'} 👋', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
                const SizedBox(height: 4),
                Text('Ready to save lives today?', style: TextStyle(color: Colors.grey[600])),
              ]),
              Row(children: [
                IconButton(icon: const Icon(Icons.notifications_outlined), onPressed: () => Navigator.pushNamed(context, '/notifications')),
                CircleAvatar(backgroundColor: AppTheme.primary.withAlpha(26), child: Text(user?.fullName?.substring(0, 1) ?? '?', style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.w700))),
              ]),
            ]),
            const SizedBox(height: 24),
            // Stats cards
            Row(children: [
              _statCard('🩸', '3', 'Donations', AppTheme.primary),
              const SizedBox(width: 12),
              _statCard('❤️', '2', 'Lives Saved', AppTheme.success),
              const SizedBox(width: 12),
              _statCard('📨', '${requests.length}', 'Active', AppTheme.warning),
            ]),
            const SizedBox(height: 24),
            // Quick Actions
            const Text('Quick Actions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
            const SizedBox(height: 12),
            Row(children: [
              _actionCard('🔍', 'Find\nDonors', () => setState(() => _currentIndex = 1)),
              const SizedBox(width: 12),
              _actionCard('🚨', 'Emergency\nRequest', () => setState(() => _currentIndex = 2)),
              const SizedBox(width: 12),
              _actionCard('🏥', 'Hospitals', () => Navigator.pushNamed(context, '/hospitals')),
              const SizedBox(width: 12),
              _actionCard('🏦', 'Blood\nBanks', () => Navigator.pushNamed(context, '/blood-banks')),
            ]),
            const SizedBox(height: 24),
            // Active Requests
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              const Text('Active Emergency Requests', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
              TextButton(onPressed: () => setState(() => _currentIndex = 2), child: const Text('See all')),
            ]),
            ...requests.take(3).map((r) => Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: ListTile(
                leading: CircleAvatar(backgroundColor: r.urgencyLevel == 'critical' ? AppTheme.primary : AppTheme.warning, child: Text(r.bloodGroupNeeded, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w700))),
                title: Text(r.patientName, style: const TextStyle(fontWeight: FontWeight.w600)),
                subtitle: Text('${r.hospitalName} · ${r.location}', style: TextStyle(fontSize: 13, color: Colors.grey[600])),
                trailing: Chip(label: Text(r.urgencyLevel, style: const TextStyle(fontSize: 11, color: Colors.white)), backgroundColor: r.urgencyLevel == 'critical' ? AppTheme.primary : AppTheme.warning, padding: EdgeInsets.zero),
              ),
            )),
          ],
        ),
      ),
    );
  }

  Widget _statCard(String icon, String value, String label, Color color) {
    return Expanded(child: Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: color.withAlpha(26), borderRadius: BorderRadius.circular(16)),
      child: Column(children: [
        Text(icon, style: const TextStyle(fontSize: 24)),
        const SizedBox(height: 8),
        Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: color)),
        Text(label, style: TextStyle(fontSize: 12, color: Colors.grey[600])),
      ]),
    ));
  }

  Widget _actionCard(String icon, String label, VoidCallback onTap) {
    return Expanded(child: GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 20),
        decoration: BoxDecoration(color: Theme.of(context).cardColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.grey.shade200)),
        child: Column(children: [
          Text(icon, style: const TextStyle(fontSize: 28)),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600), textAlign: TextAlign.center),
        ]),
      ),
    ));
  }

  Widget _buildSearch() {
    final donors = DemoData.users.where((u) => u.role == 'donor').toList();
    return SafeArea(child: Padding(
      padding: const EdgeInsets.all(20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('Find Donors', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
        const SizedBox(height: 16),
        TextField(decoration: InputDecoration(hintText: 'Search by city...', prefixIcon: const Icon(Icons.search), border: OutlineInputBorder(borderRadius: BorderRadius.circular(50)))),
        const SizedBox(height: 16),
        SizedBox(height: 40, child: ListView(scrollDirection: Axis.horizontal, children: ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => Padding(
          padding: const EdgeInsets.only(right: 8),
          child: FilterChip(label: Text(g), selected: false, onSelected: (_) {}),
        )).toList())),
        const SizedBox(height: 16),
        Expanded(child: ListView.builder(
          itemCount: donors.length,
          itemBuilder: (_, i) {
            final d = donors[i];
            return Card(margin: const EdgeInsets.only(bottom: 12), child: ListTile(
              leading: CircleAvatar(backgroundColor: AppTheme.primary.withAlpha(26), child: Text(d.bloodGroup, style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.w700, fontSize: 13))),
              title: Row(children: [Text(d.fullName, style: const TextStyle(fontWeight: FontWeight.w600)), if (d.verified) const Padding(padding: EdgeInsets.only(left: 6), child: Icon(Icons.verified, size: 16, color: AppTheme.success))]),
              subtitle: Text('${d.city} · ${d.gender} · ${d.age} yrs', style: TextStyle(fontSize: 13, color: Colors.grey[600])),
              trailing: Container(width: 8, height: 8, decoration: BoxDecoration(shape: BoxShape.circle, color: d.availability ? AppTheme.success : Colors.grey)),
            ));
          },
        )),
      ]),
    ));
  }

  Widget _buildEmergency() {
    return SafeArea(child: SingleChildScrollView(padding: const EdgeInsets.all(20), child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('🚨 Emergency Request', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800)),
        const SizedBox(height: 8),
        Text('Alert matching donors instantly', style: TextStyle(color: Colors.grey[600])),
        const SizedBox(height: 24),
        TextFormField(decoration: const InputDecoration(labelText: 'Patient Name')),
        const SizedBox(height: 14),
        DropdownButtonFormField<String>(decoration: const InputDecoration(labelText: 'Blood Group Needed'), items: ['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((g) => DropdownMenuItem(value: g, child: Text(g))).toList(), onChanged: (_) {}),
        const SizedBox(height: 14),
        TextFormField(decoration: const InputDecoration(labelText: 'Hospital Name')),
        const SizedBox(height: 14),
        TextFormField(decoration: const InputDecoration(labelText: 'Location / City')),
        const SizedBox(height: 14),
        DropdownButtonFormField<String>(value: 'critical', decoration: const InputDecoration(labelText: 'Urgency Level'), items: ['normal','urgent','critical'].map((g) => DropdownMenuItem(value: g, child: Text(g.toUpperCase()))).toList(), onChanged: (_) {}),
        const SizedBox(height: 24),
        SizedBox(width: double.infinity, child: ElevatedButton.icon(
          onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('🚨 Emergency request sent! Notifying donors...'))),
          icon: const Icon(Icons.emergency), label: const Text('Submit Emergency Request'),
          style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
        )),
      ],
    )));
  }

  Widget _buildProfile(user) {
    return SafeArea(child: SingleChildScrollView(padding: const EdgeInsets.all(20), child: Column(children: [
      const SizedBox(height: 20),
      CircleAvatar(radius: 50, backgroundColor: AppTheme.primary.withAlpha(26), child: Text(user?.fullName?.substring(0, 1) ?? '?', style: const TextStyle(fontSize: 36, color: AppTheme.primary, fontWeight: FontWeight.w800))),
      const SizedBox(height: 16),
      Text(user?.fullName ?? 'User', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
      const SizedBox(height: 4),
      Text(user?.email ?? '', style: TextStyle(color: Colors.grey[600])),
      const SizedBox(height: 12),
      Container(padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8), decoration: BoxDecoration(color: AppTheme.primary, borderRadius: BorderRadius.circular(50)), child: Text(user?.bloodGroup ?? 'N/A', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700))),
      const SizedBox(height: 24),
      _profileTile(Icons.phone, 'Phone', user?.phone ?? '-'),
      _profileTile(Icons.location_on, 'City', user?.city ?? '-'),
      _profileTile(Icons.person, 'Gender', user?.gender ?? '-'),
      _profileTile(Icons.cake, 'Age', '${user?.age ?? '-'}'),
      _profileTile(Icons.calendar_today, 'Last Donation', user?.lastDonation ?? 'Never'),
      const SizedBox(height: 24),
      SizedBox(width: double.infinity, child: OutlinedButton(onPressed: () => Navigator.pushNamed(context, '/settings'), child: const Text('Settings'))),
      const SizedBox(height: 12),
      SizedBox(width: double.infinity, child: ElevatedButton(
        onPressed: () { Provider.of<AuthProvider>(context, listen: false).logout(); Navigator.pushReplacementNamed(context, '/login'); },
        style: ElevatedButton.styleFrom(backgroundColor: Colors.grey[200], foregroundColor: Colors.grey[800]),
        child: const Text('Logout'),
      )),
    ])));
  }

  Widget _profileTile(IconData icon, String label, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Theme.of(context).cardColor, borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.grey.shade200)),
      child: Row(children: [
        Icon(icon, color: AppTheme.primary, size: 20),
        const SizedBox(width: 16),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(label, style: TextStyle(fontSize: 12, color: Colors.grey[500])),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
        ]),
      ]),
    );
  }
}
