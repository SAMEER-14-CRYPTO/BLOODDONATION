import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../providers/theme_provider.dart';
import '../../core/theme/app_theme.dart';
import '../widgets/real_osm_map_widget.dart';
import '../widgets/smooth_button.dart';

class BloodBankScreen extends StatefulWidget {
  const BloodBankScreen({super.key});
  @override
  State<BloodBankScreen> createState() => _BloodBankScreenState();
}

class _BloodBankScreenState extends State<BloodBankScreen> {
  String _selectedCity = 'All';
  String _searchQuery = '';
  final TextEditingController _searchC = TextEditingController();

  final List<String> _cities = [
    'All',
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Bangalore',
    'Hyderabad',
    'Mumbai',
    'Delhi',
  ];

  final List<Map<String, dynamic>> _banks = [
    {
      'name': 'Tamil Nadu Blood Transfusion Council',
      'city': 'Chennai',
      'address': '359/1, Anna Salai, Teynampet, Chennai - 600018',
      'phone': '+91-44-24333370',
      'stocks': {'O+': 60, 'A+': 45, 'B+': 42, 'AB+': 18, 'O-': 22, 'A-': 14, 'B-': 12, 'AB-': 7}
    },
    {
      'name': 'Apollo Blood Bank, Chennai',
      'city': 'Chennai',
      'address': '21, Greams Lane, Thousand Lights, Chennai - 600006',
      'phone': '+91-44-28290200',
      'stocks': {'O+': 48, 'A+': 32, 'B+': 36, 'AB+': 14, 'O-': 18, 'A-': 11, 'B-': 9, 'AB-': 5}
    },
    {
      'name': 'KKHTDB Government Blood Bank',
      'city': 'Chennai',
      'address': 'KKHTDB, Kilpauk, Chennai - 600010',
      'phone': '+91-44-26412503',
      'stocks': {'O+': 70, 'A+': 55, 'B+': 50, 'AB+': 20, 'O-': 25, 'A-': 16, 'B-': 13, 'AB-': 8}
    },
    {
      'name': 'Voluntary Blood Bank, Coimbatore',
      'city': 'Coimbatore',
      'address': 'Gandhipuram, Coimbatore - 641012',
      'phone': '+91-422-2301850',
      'stocks': {'O+': 35, 'A+': 24, 'B+': 28, 'AB+': 9, 'O-': 13, 'A-': 8, 'B-': 6, 'AB-': 3}
    },
    {
      'name': 'District Blood Bank, Madurai',
      'city': 'Madurai',
      'address': 'Govt Rajaji Hospital Campus, Madurai - 625020',
      'phone': '+91-452-2532535',
      'stocks': {'O+': 40, 'A+': 28, 'B+': 32, 'AB+': 11, 'O-': 15, 'A-': 9, 'B-': 8, 'AB-': 4}
    },
    {
      'name': 'RV Blood Bank',
      'city': 'Bangalore',
      'address': 'Basavanagudi, Bengaluru, Karnataka 560004',
      'phone': '+91-80-26576985',
      'stocks': {'O+': 32, 'A+': 20, 'B+': 25, 'AB+': 8, 'O-': 10, 'A-': 5, 'B-': 7, 'AB-': 2}
    },
    {
      'name': 'Thalassemia Society Blood Bank',
      'city': 'Hyderabad',
      'address': 'Padmarao Nagar, Secunderabad, Hyderabad - 500025',
      'phone': '+91-40-27803894',
      'stocks': {'O+': 28, 'A+': 18, 'B+': 22, 'AB+': 6, 'O-': 8, 'A-': 4, 'B-': 6, 'AB-': 2}
    },
    {
      'name': 'Indian Red Cross Blood Bank',
      'city': 'Mumbai',
      'address': '1, Red Cross Rd, Mumbai, Maharashtra 400001',
      'phone': '+91-22-23621573',
      'stocks': {'O+': 45, 'A+': 30, 'B+': 38, 'AB+': 12, 'O-': 15, 'A-': 8, 'B-': 10, 'AB-': 4}
    },
    {
      'name': 'Rotary Blood Bank',
      'city': 'Delhi',
      'address': '56-57, Tughlakabad, New Delhi 110062',
      'phone': '+91-11-29960044',
      'stocks': {'O+': 55, 'A+': 40, 'B+': 35, 'AB+': 15, 'O-': 20, 'A-': 12, 'B-': 8, 'AB-': 6}
    },
    {
      'name': 'Prathama Blood Centre',
      'city': 'Ahmedabad',
      'address': 'Satellite Rd, Ahmedabad, Gujarat 380015',
      'phone': '+91-79-26921111',
      'stocks': {'O+': 38, 'A+': 25, 'B+': 30, 'AB+': 10, 'O-': 12, 'A-': 7, 'B-': 9, 'AB-': 3}
    },
  ];

  List<Map<String, dynamic>> get filteredBanks {
    return _banks.where((b) {
      final matchesCity = _selectedCity == 'All' || b['city'] == _selectedCity;
      final matchesSearch = _searchQuery.isEmpty ||
          b['name'].toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
          b['address'].toString().toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCity && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Provider.of<ThemeProvider>(context);
    final isDark = theme.isDarkMode;
    final isDesktop = MediaQuery.of(context).size.width > 800;

    final bgColor = isDark ? const Color(0xFF0F0F1A) : const Color(0xFFFAFAFA);
    final cardColor = isDark ? const Color(0xFF1A1A2E) : Colors.white;
    final borderColor = isDark ? const Color(0xFF2A2A3E) : Colors.grey.shade200;
    final textColor = isDark ? Colors.white : const Color(0xFF1E2022);
    final subTextColor = isDark ? const Color(0xFF9E9E9E) : const Color(0xFF666666);

    final banks = filteredBanks;

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: RichText(
          text: TextSpan(
            text: 'Blood Banks ',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textColor),
            children: const [
              TextSpan(text: 'Directory', style: TextStyle(color: Color(0xFFE53935))),
            ],
          ),
        ),
        actions: [
          SmoothScaleEffect(
            onTap: () => theme.toggleTheme(),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Text(isDark ? '☀️' : '🌙', style: const TextStyle(fontSize: 20)),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: isDesktop ? 60 : 16, vertical: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Header Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF2A1A1E) : const Color(0xFFFFEAEA),
                borderRadius: BorderRadius.circular(50),
              ),
              child: const Text(
                '🩸 BLOOD STORAGE NETWORK · CHENNAI & SOUTH INDIA',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFFE53935),
                  letterSpacing: 0.5,
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Title
            RichText(
              textAlign: TextAlign.center,
              text: TextSpan(
                text: 'Blood Banks ',
                style: TextStyle(
                  fontSize: 34,
                  fontWeight: FontWeight.w900,
                  color: textColor,
                  letterSpacing: -0.5,
                ),
                children: const [
                  TextSpan(
                    text: 'Directory',
                    style: TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w900),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 4),

            // Breadcrumbs
            Text(
              'Home  /  Blood Banks & Transfusion Centres in South India',
              style: TextStyle(fontSize: 13, color: subTextColor, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 20),

            // Quick City Filters
            SizedBox(
              height: 36,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: _cities.map((city) {
                  final isSelected = _selectedCity == city;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: SmoothScaleEffect(
                      onTap: () => setState(() => _selectedCity = city),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFFE53935) : cardColor,
                          borderRadius: BorderRadius.circular(50),
                          border: Border.all(color: isSelected ? const Color(0xFFE53935) : borderColor),
                          boxShadow: isSelected ? [const BoxShadow(color: Color(0x33E53935), blurRadius: 8, offset: Offset(0, 2))] : [],
                        ),
                        child: Text(
                          city,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                            color: isSelected ? Colors.white : (isDark ? const Color(0xFF9E9E9E) : const Color(0xFF4A4A4A)),
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 16),

            // Search Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: borderColor),
              ),
              child: TextField(
                controller: _searchC,
                style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontSize: 13),
                onChanged: (v) => setState(() => _searchQuery = v),
                decoration: InputDecoration(
                  hintText: 'Search blood banks by name or location in Chennai...',
                  hintStyle: TextStyle(color: subTextColor, fontSize: 13),
                  prefixIcon: const Icon(Icons.search, size: 20, color: Color(0xFFE53935)),
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Map
            const RealOsmMapWidget(
              height: 380,
              markerType: 'bloodbanks',
              initialZoom: 5.0,
            ),
            const SizedBox(height: 28),

            // List of Blood Banks
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                '${banks.length} Verified Blood Banks',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textColor),
              ),
            ),
            const SizedBox(height: 12),

            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: banks.length,
              itemBuilder: (context, i) {
                final b = banks[i];
                final stocks = b['stocks'] as Map<String, dynamic>;
                return SmoothScaleEffect(
                  onTap: () {},
                  child: Card(
                    color: cardColor,
                    margin: const EdgeInsets.only(bottom: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                      side: BorderSide(color: borderColor),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 46, height: 46,
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF2A1A1E) : const Color(0xFFFFEAEA),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Center(child: Text('🩸', style: TextStyle(fontSize: 22))),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      b['name'],
                                      style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: textColor),
                                    ),
                                    const SizedBox(height: 4),
                                    Row(
                                      children: [
                                        const Icon(Icons.location_on, size: 14, color: Color(0xFFE53935)),
                                        const SizedBox(width: 4),
                                        Expanded(
                                          child: Text(b['address'], style: TextStyle(fontSize: 12, color: subTextColor)),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 2),
                                    Row(
                                      children: [
                                        const Icon(Icons.phone, size: 14, color: Color(0xFF43A047)),
                                        const SizedBox(width: 4),
                                        Text(b['phone'], style: TextStyle(fontSize: 12, color: subTextColor)),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              SmoothAnimatedButton(
                                onPressed: () => launchUrl(Uri.parse('tel:${b['phone']}')),
                                backgroundColor: const Color(0xFFE53935),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                borderRadius: 50,
                                child: const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.call, size: 14),
                                    SizedBox(width: 4),
                                    Text('Contact', style: TextStyle(fontSize: 12)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          const Divider(height: 1),
                          const SizedBox(height: 12),

                          Text('Units In Stock:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: textColor)),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: stocks.entries.map((e) {
                              return Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF1E2D24) : const Color(0xFFE8F8EE),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: const Color(0xFF43A047).withAlpha(100)),
                                ),
                                child: Text(
                                  '${e.key}: ${e.value} units',
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFF43A047),
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
