import 'package:flutter/material.dart';
import '../../utils/theme.dart';

class BloodBankScreen extends StatelessWidget {
  const BloodBankScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final banks = [
      {'name': 'Indian Red Cross Blood Bank', 'address': '1, Red Cross Rd, Mumbai', 'stocks': {'O+': 45, 'A+': 30, 'B+': 38, 'AB+': 12, 'O-': 15, 'A-': 8}},
      {'name': 'Rotary Blood Bank', 'address': '56-57, Tughlakabad, Delhi', 'stocks': {'O+': 55, 'A+': 40, 'B+': 35, 'AB+': 15, 'O-': 20, 'A-': 12}},
      {'name': 'Prathama Blood Centre', 'address': 'Satellite Rd, Ahmedabad', 'stocks': {'O+': 38, 'A+': 25, 'B+': 30, 'AB+': 10, 'O-': 12, 'A-': 7}},
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Blood Banks')),
      body: ListView.builder(padding: const EdgeInsets.all(16), itemCount: banks.length, itemBuilder: (_, i) {
        final b = banks[i];
        final stocks = b['stocks'] as Map<String, int>;
        return Card(margin: const EdgeInsets.only(bottom: 16), child: Padding(padding: const EdgeInsets.all(20), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Container(width: 48, height: 48, decoration: BoxDecoration(color: AppTheme.primary.withAlpha(26), borderRadius: BorderRadius.circular(12)), child: const Center(child: Text('🏦', style: TextStyle(fontSize: 24)))),
            const SizedBox(width: 16),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(b['name'] as String, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
              Text(b['address'] as String, style: TextStyle(fontSize: 13, color: Colors.grey[600])),
            ])),
          ]),
          const SizedBox(height: 16),
          const Text('Stock Status', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
          const SizedBox(height: 12),
          ...stocks.entries.map((e) => Padding(padding: const EdgeInsets.only(bottom: 8), child: Row(children: [
            SizedBox(width: 36, child: Text(e.key, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13))),
            const SizedBox(width: 12),
            Expanded(child: ClipRRect(borderRadius: BorderRadius.circular(4), child: LinearProgressIndicator(value: e.value / 60, minHeight: 8,
              backgroundColor: Colors.grey[200], color: e.value > 30 ? AppTheme.success : e.value > 15 ? AppTheme.warning : AppTheme.primary))),
            const SizedBox(width: 12),
            Text('${e.value}', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.grey[600])),
          ]))),
        ])));
      }),
    );
  }
}
