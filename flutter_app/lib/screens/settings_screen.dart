import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../utils/theme.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});
  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _darkMode = false;
  bool _pushNotifs = true;
  bool _emergencyAlerts = true;
  String _language = 'English';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        _sectionTitle('Appearance'),
        _switchTile('Dark Mode', 'Switch to dark theme', Icons.dark_mode, _darkMode, (v) => setState(() => _darkMode = v)),
        _listTile('Language', _language, Icons.language, () => _showLanguageDialog()),
        const SizedBox(height: 16),
        _sectionTitle('Notifications'),
        _switchTile('Push Notifications', 'Receive push notifications', Icons.notifications, _pushNotifs, (v) => setState(() => _pushNotifs = v)),
        _switchTile('Emergency Alerts', 'Get notified for emergency requests', Icons.emergency, _emergencyAlerts, (v) => setState(() => _emergencyAlerts = v)),
        const SizedBox(height: 16),
        _sectionTitle('Account'),
        _listTile('Edit Profile', 'Update your information', Icons.person, () => Navigator.pushNamed(context, '/profile')),
        _listTile('Donation History', 'View past donations', Icons.history, () {}),
        _listTile('Privacy Policy', 'Read our privacy policy', Icons.privacy_tip, () {}),
        _listTile('Terms of Service', 'Read terms', Icons.description, () {}),
        const SizedBox(height: 16),
        _sectionTitle('About'),
        _listTile('Version', '1.0.0', Icons.info, () {}),
        _listTile('Rate App', 'Rate us on Play Store', Icons.star, () {}),
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: () { Provider.of<AuthProvider>(context, listen: false).logout(); Navigator.pushReplacementNamed(context, '/login'); },
          style: ElevatedButton.styleFrom(backgroundColor: Colors.grey[200], foregroundColor: Colors.red, padding: const EdgeInsets.symmetric(vertical: 16)),
          child: const Text('Logout'),
        ),
      ]),
    );
  }

  Widget _sectionTitle(String title) => Padding(padding: const EdgeInsets.only(bottom: 8), child: Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.primary)));

  Widget _switchTile(String title, String sub, IconData icon, bool value, Function(bool) onChanged) => Card(
    margin: const EdgeInsets.only(bottom: 8),
    child: SwitchListTile(title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
      subtitle: Text(sub, style: TextStyle(fontSize: 13, color: Colors.grey[600])),
      secondary: Icon(icon, color: AppTheme.primary),
      value: value, activeColor: AppTheme.primary, onChanged: onChanged),
  );

  Widget _listTile(String title, String sub, IconData icon, VoidCallback onTap) => Card(
    margin: const EdgeInsets.only(bottom: 8),
    child: ListTile(leading: Icon(icon, color: AppTheme.primary),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
      subtitle: Text(sub, style: TextStyle(fontSize: 13, color: Colors.grey[600])),
      trailing: const Icon(Icons.chevron_right), onTap: onTap),
  );

  void _showLanguageDialog() {
    showDialog(context: context, builder: (_) => SimpleDialog(title: const Text('Select Language'), children:
      ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi'].map((l) => SimpleDialogOption(
        onPressed: () { setState(() => _language = l); Navigator.pop(context); },
        child: Text(l, style: TextStyle(fontWeight: _language == l ? FontWeight.w700 : FontWeight.normal)),
      )).toList()));
  }
}
