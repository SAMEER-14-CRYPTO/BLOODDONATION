import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/theme_provider.dart';
import '../../services/demo_data.dart';
import '../../models/models.dart';
import '../../core/theme/app_theme.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});
  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isAvailable = true;

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final theme = Provider.of<ThemeProvider>(context);
    final isDark = theme.isDarkMode;
    final user = auth.user;
    final requests = DemoData.requests;

    final bgColor = isDark ? const Color(0xFF0F0F1A) : const Color(0xFFFAFAFA);
    final cardColor = isDark ? const Color(0xFF1A1A2E) : Colors.white;
    final borderColor = isDark ? const Color(0xFF2A2A3E) : const Color(0xFFE0E0E0);
    final textColor = isDark ? const Color(0xFFE0E0E0) : const Color(0xFF212121);
    final subTextColor = isDark ? const Color(0xFF9E9E9E) : const Color(0xFF757575);

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  center: Alignment(-0.2, -0.3),
                  colors: [Color(0xFFFF4081), Color(0xFFE53935)],
                ),
              ),
              child: const Center(child: Text('🩸', style: TextStyle(fontSize: 16))),
            ),
            const SizedBox(width: 8),
            Text(
              'Donor Dashboard',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18, color: textColor),
            ),
          ],
        ),
        actions: [
          // Theme Toggle Button
          IconButton(
            icon: Text(isDark ? '☀️' : '🌙', style: const TextStyle(fontSize: 20)),
            tooltip: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
            onPressed: () => theme.toggleTheme(),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User Greeting & Availability Banner
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: borderColor),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withAlpha(isDark ? 40 : 8),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 36,
                    backgroundColor: const Color(0xFFFFEAEA),
                    child: Text(
                      user?.fullName.isNotEmpty == true ? user!.fullName.substring(0, 1).toUpperCase() : '🩸',
                      style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Color(0xFFE53935)),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Flexible(
                              child: Text(
                                user?.fullName ?? 'Rahul Sharma',
                                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textColor),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Icon(Icons.verified, size: 18, color: Color(0xFF43A047)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${user?.email ?? "rahul@demo.com"} · ${user?.city ?? "Mumbai"}',
                          style: TextStyle(fontSize: 12, color: subTextColor),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFE53935),
                                borderRadius: BorderRadius.circular(50),
                              ),
                              child: Text(
                                'Blood Group: ${user?.bloodGroup ?? "O+"}',
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 11),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: _isAvailable ? const Color(0xFFE8F8EE) : const Color(0xFFFFEBEE),
                                borderRadius: BorderRadius.circular(50),
                              ),
                              child: Text(
                                _isAvailable ? '🟢 Online' : '⚪ Offline',
                                style: TextStyle(
                                  color: _isAvailable ? const Color(0xFF43A047) : const Color(0xFFE53935),
                                  fontWeight: FontWeight.w800,
                                  fontSize: 11,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Switch(
                    value: _isAvailable,
                    activeColor: const Color(0xFF43A047),
                    onChanged: (v) => setState(() => _isAvailable = v),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Stats Counters Grid
            Row(
              children: [
                _buildStatCard('🩸', '${user?.donationCount ?? 4}', 'Donations', const Color(0xFFE53935), cardColor, borderColor, textColor, subTextColor),
                const SizedBox(width: 12),
                _buildStatCard('❤️', '12', 'Lives Saved', const Color(0xFF43A047), cardColor, borderColor, textColor, subTextColor),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildStatCard('🚨', '${requests.where((r) => r.status == 'active').length}', 'Active Alerts', const Color(0xFFFB8C00), cardColor, borderColor, textColor, subTextColor),
                const SizedBox(width: 12),
                _buildStatCard('🏥', '${DemoData.hospitals.length}', 'Partner Hospitals', const Color(0xFF1E88E5), cardColor, borderColor, textColor, subTextColor),
              ],
            ),
            const SizedBox(height: 24),

            // Quick Action Buttons
            Text('Quick Shortcuts', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textColor)),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.pushNamed(context, '/search'),
                    icon: const Icon(Icons.search),
                    label: const Text('Find Donors'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFE53935),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => Navigator.pushNamed(context, '/emergency'),
                    icon: const Icon(Icons.emergency),
                    label: const Text('Emergency'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFB8C00),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => Navigator.pushNamed(context, '/hospitals'),
                    icon: const Icon(Icons.local_hospital_outlined),
                    label: const Text('Hospital Directory'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: textColor,
                      side: BorderSide(color: borderColor),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => Navigator.pushNamed(context, '/blood-banks'),
                    icon: const Icon(Icons.account_balance_outlined),
                    label: const Text('Blood Banks'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: textColor,
                      side: BorderSide(color: borderColor),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 28),

            // Active Emergency Requests Near You
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Active Urgent Requests', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textColor)),
                TextButton(
                  onPressed: () => Navigator.pushNamed(context, '/emergency'),
                  child: const Text('View All', style: TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w700)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ...requests.take(3).map((r) => Card(
                  color: cardColor,
                  margin: const EdgeInsets.only(bottom: 10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(color: borderColor),
                  ),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: const Color(0xFFE53935),
                      child: Text(r.bloodGroupNeeded, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800)),
                    ),
                    title: Text(r.patientName, style: TextStyle(fontWeight: FontWeight.w800, color: textColor)),
                    subtitle: Text('${r.hospitalName} · ${r.city}', style: TextStyle(color: subTextColor, fontSize: 12)),
                    trailing: ElevatedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Response registered for ${r.patientName}! Contacting hospital...'), backgroundColor: const Color(0xFF43A047)),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF43A047),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      ),
                      child: const Text('Respond', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
                    ),
                  ),
                )),

            const SizedBox(height: 28),
            // Logout
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  auth.logout();
                  Navigator.pushReplacementNamed(context, '/login');
                },
                icon: const Icon(Icons.logout),
                label: const Text('Logout from LifeLink'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE53935),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(
    String icon,
    String value,
    String label,
    Color color,
    Color cardColor,
    Color borderColor,
    Color textColor,
    Color subTextColor,
  ) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: borderColor),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(icon, style: const TextStyle(fontSize: 22)),
            const SizedBox(height: 8),
            Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: color)),
            const SizedBox(height: 2),
            Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: subTextColor)),
          ],
        ),
      ),
    );
  }
}
