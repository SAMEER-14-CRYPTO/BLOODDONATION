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
    'All',
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Trichy',
    'Salem',
    'Tirunelveli',
    'Tirupati',
    'Vijayawada',
    'Visakhapatnam',
    'Guntur',
    'Nellore',
    'Kadapa',
    'Kurnool',
    'Rly Kodur',
  ];

  final List<Map<String, dynamic>> _banks = [
    {
      'name': 'Tamil Nadu State Apex Blood Bank',
      'city': 'Chennai',
      'address': 'Kilpauk Medical College, Chennai, Tamil Nadu - 600010',
      'phone': '+91-44-26432804',
      'stocks': {'O+': 58, 'A+': 40, 'B+': 46, 'AB+': 16, 'O-': 22, 'A-': 12, 'B-': 14, 'AB-': 6}
    },
    {
      'name': 'Indian Red Cross Society Blood Centre',
      'city': 'Chennai',
      'address': '179, Anna Salai, Chennai, Tamil Nadu - 600002',
      'phone': '+91-44-28520068',
      'stocks': {'O+': 48, 'A+': 32, 'B+': 38, 'AB+': 12, 'O-': 18, 'A-': 10, 'B-': 12, 'AB-': 5}
    },
    {
      'name': 'Rotary Central Blood Bank',
      'city': 'Coimbatore',
      'address': 'DB Road, RS Puram, Coimbatore, Tamil Nadu - 641002',
      'phone': '+91-422-2543444',
      'stocks': {'O+': 42, 'A+': 28, 'B+': 34, 'AB+': 11, 'O-': 15, 'A-': 8, 'B-': 10, 'AB-': 4}
    },
    {
      'name': 'Lions Blood Bank & Research Foundation',
      'city': 'Madurai',
      'address': 'Bibi Kulam Road, Madurai, Tamil Nadu - 625002',
      'phone': '+91-452-2337344',
      'stocks': {'O+': 36, 'A+': 24, 'B+': 30, 'AB+': 10, 'O-': 12, 'A-': 6, 'B-': 8, 'AB-': 4}
    },
    {
      'name': 'CMC Voluntary Donor Blood Bank',
      'city': 'Vellore',
      'address': 'Ida Scudder Road, Vellore, Tamil Nadu - 632004',
      'phone': '+91-416-2282000',
      'stocks': {'O+': 40, 'A+': 26, 'B+': 32, 'AB+': 10, 'O-': 14, 'A-': 8, 'B-': 9, 'AB-': 4}
    },
    {
      'name': 'Indian Red Cross Society Blood Centre',
      'city': 'Vijayawada',
      'address': 'Eluru Road, Governorpet, Vijayawada, AP - 520001',
      'phone': '+91-866-2573456',
      'stocks': {'O+': 50, 'A+': 32, 'B+': 38, 'AB+': 13, 'O-': 17, 'A-': 10, 'B-': 11, 'AB-': 5}
    },
    {
      'name': 'SVIMS Blood Bank & Component Centre',
      'city': 'Tirupati',
      'address': 'Alipiri Road, Near SVIMS, Tirupati, AP - 517507',
      'phone': '+91-877-2287777',
      'stocks': {'O+': 45, 'A+': 28, 'B+': 32, 'AB+': 11, 'O-': 15, 'A-': 8, 'B-': 9, 'AB-': 4}
    },
    {
      'name': 'King George Hospital (KGH) Regional Blood Centre',
      'city': 'Visakhapatnam',
      'address': 'Maharanipeta, Visakhapatnam, Andhra Pradesh - 530002',
      'phone': '+91-891-2564900',
      'stocks': {'O+': 52, 'A+': 36, 'B+': 42, 'AB+': 15, 'O-': 19, 'A-': 11, 'B-': 13, 'AB-': 5}
    },
    {
      'name': 'NRI Super Speciality Blood Bank',
      'city': 'Guntur',
      'address': 'Chinakakani, Mangalagiri, Guntur, AP - 522503',
      'phone': '+91-863-2878990',
      'stocks': {'O+': 34, 'A+': 22, 'B+': 26, 'AB+': 9, 'O-': 11, 'A-': 6, 'B-': 7, 'AB-': 3}
    },
    {
      'name': 'Government General Blood Centre',
      'city': 'Nellore',
      'address': 'Grand Trunk Road, Dargamitta, Nellore, AP - 524001',
      'phone': '+91-861-2314567',
      'stocks': {'O+': 28, 'A+': 18, 'B+': 22, 'AB+': 6, 'O-': 9, 'A-': 5, 'B-': 6, 'AB-': 2}
    },
    {
      'name': 'RIMS Regional Blood Bank',
      'city': 'Kadapa',
      'address': 'Putlampalli, Kadapa, Andhra Pradesh - 516004',
      'phone': '+91-8562-252280',
      'stocks': {'O+': 24, 'A+': 15, 'B+': 18, 'AB+': 5, 'O-': 8, 'A-': 4, 'B-': 4, 'AB-': 2}
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
