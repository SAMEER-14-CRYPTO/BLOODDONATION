import 'package:flutter/material.dart';
import '../../utils/theme.dart';

class EmergencyRequestScreen extends StatelessWidget {
  const EmergencyRequestScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Emergency Request')),
      body: SingleChildScrollView(padding: const EdgeInsets.all(24), child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Container(padding: const EdgeInsets.all(20), decoration: BoxDecoration(color: AppTheme.primary.withAlpha(26), borderRadius: BorderRadius.circular(16)),
          child: const Row(children: [Text('🚨', style: TextStyle(fontSize: 32)), SizedBox(width: 16), Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Emergency Request', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16)), SizedBox(height: 4), Text('Fill the form to alert nearby donors instantly', style: TextStyle(fontSize: 13))]))]),
        ),
        const SizedBox(height: 24),
        TextFormField(decoration: const InputDecoration(labelText: 'Patient Name *', prefixIcon: Icon(Icons.person_outline))),
        const SizedBox(height: 14),
        DropdownButtonFormField<String>(decoration: const InputDecoration(labelText: 'Blood Group Needed *', prefixIcon: Icon(Icons.bloodtype)), items: ['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((g) => DropdownMenuItem(value: g, child: Text(g))).toList(), onChanged: (_) {}),
        const SizedBox(height: 14),
        TextFormField(decoration: const InputDecoration(labelText: 'Hospital Name *', prefixIcon: Icon(Icons.local_hospital_outlined))),
        const SizedBox(height: 14),
        TextFormField(decoration: const InputDecoration(labelText: 'Location / City *', prefixIcon: Icon(Icons.location_on_outlined))),
        const SizedBox(height: 14),
        DropdownButtonFormField<String>(value: 'critical', decoration: const InputDecoration(labelText: 'Urgency Level', prefixIcon: Icon(Icons.warning_outlined)),
          items: [DropdownMenuItem(value: 'normal', child: Text('Normal')), DropdownMenuItem(value: 'urgent', child: Text('Urgent')), DropdownMenuItem(value: 'critical', child: Text('Critical'))], onChanged: (_) {}),
        const SizedBox(height: 14),
        TextFormField(maxLines: 3, decoration: const InputDecoration(labelText: 'Additional Notes', prefixIcon: Icon(Icons.note_outlined))),
        const SizedBox(height: 28),
        ElevatedButton.icon(
          onPressed: () { ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('🚨 Emergency request submitted! Notifying donors...'))); Navigator.pop(context); },
          icon: const Icon(Icons.emergency), label: const Text('Submit Emergency Request'),
          style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16), backgroundColor: AppTheme.primary),
        ),
      ])),
    );
  }
}
