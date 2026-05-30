import 'package:flutter/material.dart';
import '../../services/demo_data.dart';
import '../../utils/theme.dart';

class SearchDonorScreen extends StatelessWidget {
  const SearchDonorScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final donors = DemoData.users.where((u) => u.role == 'donor').toList();
    return Scaffold(
      appBar: AppBar(title: const Text('Search Donors')),
      body: Column(children: [
        Padding(padding: const EdgeInsets.all(16), child: TextField(
          decoration: InputDecoration(hintText: 'Search by name or city...', prefixIcon: const Icon(Icons.search), border: OutlineInputBorder(borderRadius: BorderRadius.circular(50))),
        )),
        SizedBox(height: 40, child: ListView(scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 16), children: ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => Padding(padding: const EdgeInsets.only(right: 8), child: ChoiceChip(label: Text(g), selected: g == 'All', onSelected: (_) {}))).toList())),
        const SizedBox(height: 8),
        Expanded(child: ListView.builder(padding: const EdgeInsets.all(16), itemCount: donors.length, itemBuilder: (_, i) {
          final d = donors[i];
          return Card(margin: const EdgeInsets.only(bottom: 12), child: InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => DonorDetailScreen(donor: d))),
            child: Padding(padding: const EdgeInsets.all(16), child: Row(children: [
              CircleAvatar(radius: 28, backgroundColor: AppTheme.primary.withAlpha(26), child: Text(d.bloodGroup, style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.w700))),
              const SizedBox(width: 16),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [Text(d.fullName, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16)), if (d.verified) const Padding(padding: EdgeInsets.only(left: 6), child: Icon(Icons.verified, size: 16, color: AppTheme.success))]),
                const SizedBox(height: 4),
                Text('📍 ${d.city} · ${d.gender} · ${d.age} yrs', style: TextStyle(fontSize: 13, color: Colors.grey[600])),
              ])),
              Column(children: [
                Container(width: 10, height: 10, decoration: BoxDecoration(shape: BoxShape.circle, color: d.availability ? AppTheme.success : Colors.grey)),
                const SizedBox(height: 4),
                Text(d.availability ? 'Online' : 'Offline', style: TextStyle(fontSize: 10, color: Colors.grey[500])),
              ]),
            ])),
          ));
        })),
      ]),
    );
  }
}

class DonorDetailScreen extends StatelessWidget {
  final dynamic donor;
  const DonorDetailScreen({super.key, required this.donor});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Donor Profile')),
      body: SingleChildScrollView(padding: const EdgeInsets.all(24), child: Column(children: [
        CircleAvatar(radius: 50, backgroundColor: AppTheme.primary.withAlpha(26), child: Text(donor.fullName.substring(0, 1), style: const TextStyle(fontSize: 36, color: AppTheme.primary, fontWeight: FontWeight.w800))),
        const SizedBox(height: 16),
        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          Text(donor.fullName, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800)),
          if (donor.verified) const Padding(padding: EdgeInsets.only(left: 8), child: Icon(Icons.verified, color: AppTheme.success)),
        ]),
        const SizedBox(height: 8),
        Container(padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8), decoration: BoxDecoration(color: AppTheme.primary, borderRadius: BorderRadius.circular(50)), child: Text(donor.bloodGroup, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 18))),
        const SizedBox(height: 24),
        _tile(Icons.location_on, 'City', donor.city),
        _tile(Icons.person, 'Gender', donor.gender),
        _tile(Icons.cake, 'Age', '${donor.age} years'),
        _tile(Icons.phone, 'Phone', donor.phone),
        _tile(Icons.calendar_today, 'Last Donation', donor.lastDonation ?? 'N/A'),
        _tile(Icons.circle, 'Status', donor.availability ? 'Available' : 'Unavailable'),
        const SizedBox(height: 24),
        Row(children: [
          Expanded(child: ElevatedButton.icon(onPressed: () {}, icon: const Icon(Icons.phone), label: const Text('Call'))),
          const SizedBox(width: 12),
          Expanded(child: OutlinedButton.icon(onPressed: () {}, icon: const Icon(Icons.message), label: const Text('Message'))),
        ]),
      ])),
    );
  }

  Widget _tile(IconData icon, String label, String value) => Container(
    margin: const EdgeInsets.only(bottom: 8), padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(color: Colors.grey[50], borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.grey.shade200)),
    child: Row(children: [Icon(icon, color: AppTheme.primary, size: 20), const SizedBox(width: 16), Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(label, style: TextStyle(fontSize: 12, color: Colors.grey[500])), Text(value, style: const TextStyle(fontWeight: FontWeight.w600))])]),
  );
}
