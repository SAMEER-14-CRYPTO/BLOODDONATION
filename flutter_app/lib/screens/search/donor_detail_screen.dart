import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_theme.dart';
import '../../models/models.dart';

class DonorDetailScreen extends StatelessWidget {
  final UserModel donor;
  const DonorDetailScreen({super.key, required this.donor});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Donor Profile', style: TextStyle(fontWeight: FontWeight.w800)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            CircleAvatar(
              radius: 48,
              backgroundColor: AppTheme.primary.withAlpha(35),
              child: Text(
                donor.fullName.isNotEmpty ? donor.fullName.substring(0, 1).toUpperCase() : '?',
                style: const TextStyle(fontSize: 36, color: AppTheme.primary, fontWeight: FontWeight.w900),
              ),
            ),
            const SizedBox(height: 14),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Flexible(
                  child: Text(donor.fullName, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
                ),
                if (donor.verified)
                  const Padding(
                    padding: EdgeInsets.only(left: 6),
                    child: Icon(Icons.verified, color: AppTheme.success, size: 20),
                  ),
              ],
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              decoration: BoxDecoration(
                color: AppTheme.primary,
                borderRadius: BorderRadius.circular(50),
              ),
              child: Text(
                'Blood Group: ${donor.bloodGroup}',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16),
              ),
            ),
            const SizedBox(height: 24),
            _infoTile(Icons.location_on, 'City & Area', donor.city.isNotEmpty ? donor.city : 'Mumbai'),
            _infoTile(Icons.person, 'Gender', donor.gender.isNotEmpty ? donor.gender : 'Male'),
            _infoTile(Icons.cake, 'Age', '${donor.age > 0 ? donor.age : 26} years'),
            _infoTile(Icons.phone, 'Contact Phone', donor.phone.isNotEmpty ? donor.phone : '+91-9876543210'),
            _infoTile(Icons.calendar_today, 'Last Donation', donor.lastDonation ?? '3 months ago'),
            _infoTile(
              Icons.circle,
              'Availability Status',
              donor.availability ? '🟢 Available for immediate donation' : '⚪ Busy / Inactive',
            ),
            const SizedBox(height: 28),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _call(donor.phone),
                    icon: const Icon(Icons.phone),
                    label: const Text('Call Donor'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.success,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _sms(donor.phone),
                    icon: const Icon(Icons.chat_bubble_outline),
                    label: const Text('Send Message'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primary,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoTile(IconData icon, String label, String value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A2E),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF2A2A3E)),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppTheme.primary, size: 20),
          const SizedBox(width: 14),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF9E9E9E))),
              const SizedBox(height: 2),
              Text(value, style: const TextStyle(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 13)),
            ],
          ),
        ],
      ),
    );
  }

  void _call(String phone) async {
    final clean = phone.replaceAll(RegExp(r'[^\d+]'), '');
    final uri = Uri.parse('tel:$clean');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  void _sms(String phone) async {
    final clean = phone.replaceAll(RegExp(r'[^\d+]'), '');
    final uri = Uri.parse('sms:$clean?body=Hi, I found your profile on LifeLink. Urgently need blood donation.');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }
}
