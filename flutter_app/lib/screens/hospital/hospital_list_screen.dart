import 'package:flutter/material.dart';
import '../../services/demo_data.dart';
import '../../utils/theme.dart';

class HospitalListScreen extends StatelessWidget {
  const HospitalListScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final hospitals = DemoData.hospitals;
    return Scaffold(
      appBar: AppBar(title: const Text('Hospitals')),
      body: ListView.builder(padding: const EdgeInsets.all(16), itemCount: hospitals.length, itemBuilder: (_, i) {
        final h = hospitals[i];
        return Card(margin: const EdgeInsets.only(bottom: 16), child: Padding(padding: const EdgeInsets.all(20), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Container(width: 48, height: 48, decoration: BoxDecoration(color: AppTheme.primary.withAlpha(26), borderRadius: BorderRadius.circular(12)), child: const Center(child: Text('🏥', style: TextStyle(fontSize: 24)))),
            const SizedBox(width: 16),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(h.name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16)),
              Text(h.address, style: TextStyle(fontSize: 13, color: Colors.grey[600])),
            ])),
            IconButton(icon: const Icon(Icons.phone, color: AppTheme.primary), onPressed: () {}),
          ]),
          const SizedBox(height: 16),
          const Text('Blood Availability', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
          const SizedBox(height: 8),
          Wrap(spacing: 8, runSpacing: 8, children: h.bloodAvailability.entries.map((e) => Chip(
            label: Text('${e.key}: ${e.value}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
            backgroundColor: e.value > 10 ? AppTheme.success.withAlpha(26) : e.value > 0 ? AppTheme.warning.withAlpha(26) : AppTheme.primary.withAlpha(26),
            padding: EdgeInsets.zero, visualDensity: VisualDensity.compact,
          )).toList()),
        ])));
      }),
    );
  }
}
