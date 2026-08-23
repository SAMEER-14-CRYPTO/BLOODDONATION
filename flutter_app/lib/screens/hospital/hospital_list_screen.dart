import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../providers/theme_provider.dart';
import '../../services/demo_data.dart';
import '../../models/models.dart';
import '../../core/theme/app_theme.dart';
import '../widgets/real_osm_map_widget.dart';
import '../widgets/smooth_button.dart';

class HospitalListScreen extends StatefulWidget {
  const HospitalListScreen({super.key});
  @override
  State<HospitalListScreen> createState() => _HospitalListScreenState();
}

class _HospitalListScreenState extends State<HospitalListScreen> {
  String _searchQuery = '';
  String _selectedBloodGroup = 'All';
  String _selectedCity = 'All';
  final TextEditingController _searchC = TextEditingController();

  final List<String> _cityFilters = [
    'All',
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Bangalore',
    'Hyderabad',
    'Kochi',
    'Mumbai',
    'Delhi',
  ];

  List<HospitalModel> get filteredHospitals {
    var list = DemoData.hospitals;
    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      list = list.where((h) => h.name.toLowerCase().contains(q) || h.address.toLowerCase().contains(q)).toList();
    }
    if (_selectedCity != 'All') {
      final c = _selectedCity.toLowerCase();
      list = list.where((h) => h.address.toLowerCase().contains(c) || h.name.toLowerCase().contains(c)).toList();
    }
    if (_selectedBloodGroup != 'All') {
      list = list.where((h) => (h.bloodAvailability[_selectedBloodGroup] ?? 0) > 0).toList();
    }
    return list;
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

    final hospitals = filteredHospitals;

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: RichText(
          text: TextSpan(
            text: 'Hospital ',
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
                '🏥 HOSPITAL NETWORK · CHENNAI & SOUTH INDIA',
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
                text: 'Hospital ',
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
              'Home  /  Hospitals in Chennai, Tamil Nadu & South India',
              style: TextStyle(fontSize: 13, color: subTextColor, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 20),

            // Quick City Filter Chips
            SizedBox(
              height: 36,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: _cityFilters.map((city) {
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

            // Search Bar & Filter Controls
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: borderColor),
                boxShadow: [
                  BoxShadow(color: Colors.black.withAlpha(isDark ? 30 : 6), blurRadius: 12, offset: const Offset(0, 4)),
                ],
              ),
              child: isDesktop
                  ? Row(
                      children: [
                        Expanded(
                          flex: 5,
                          child: _buildSearchTextField(isDark, borderColor, subTextColor),
                        ),
                        const SizedBox(width: 12),
                        _buildBloodDropdown(isDark, cardColor, borderColor, textColor),
                        const SizedBox(width: 12),
                        SmoothAnimatedButton(
                          onPressed: () => setState(() => _searchQuery = _searchC.text),
                          backgroundColor: const Color(0xFFE53935),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                          borderRadius: 50,
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.search, size: 16),
                              SizedBox(width: 6),
                              Text('Search'),
                            ],
                          ),
                        ),
                        const SizedBox(width: 10),
                        SmoothAnimatedButton(
                          onPressed: () {
                            setState(() {
                              _selectedCity = 'Chennai';
                              _searchC.text = 'Chennai';
                              _searchQuery = 'Chennai';
                            });
                          },
                          backgroundColor: Colors.transparent,
                          foregroundColor: const Color(0xFFE53935),
                          borderSide: const BorderSide(color: Color(0xFFE53935), width: 1.5),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          borderRadius: 50,
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.location_on, size: 16, color: Color(0xFFE53935)),
                              SizedBox(width: 6),
                              Text('Chennai', style: TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w700)),
                            ],
                          ),
                        ),
                      ],
                    )
                  : Column(
                      children: [
                        _buildSearchTextField(isDark, borderColor, subTextColor),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(child: _buildBloodDropdown(isDark, cardColor, borderColor, textColor)),
                            const SizedBox(width: 8),
                            SmoothAnimatedButton(
                              onPressed: () => setState(() => _searchQuery = _searchC.text),
                              backgroundColor: const Color(0xFFE53935),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                              borderRadius: 50,
                              child: const Text('Search'),
                            ),
                          ],
                        ),
                      ],
                    ),
            ),
            const SizedBox(height: 24),

            // Real Interactive OpenStreetMap for Hospitals
            const RealOsmMapWidget(
              height: 380,
              markerType: 'hospitals',
              initialZoom: 5.0,
            ),
            const SizedBox(height: 28),

            // Hospitals Cards List
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                '${hospitals.length} Partner Hospitals Available',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textColor),
              ),
            ),
            const SizedBox(height: 12),

            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: hospitals.length,
              itemBuilder: (context, i) {
                final h = hospitals[i];
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
                                child: const Center(child: Text('🏥', style: TextStyle(fontSize: 22))),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      h.name,
                                      style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: textColor),
                                    ),
                                    const SizedBox(height: 4),
                                    Row(
                                      children: [
                                        const Icon(Icons.location_on, size: 14, color: Color(0xFFE53935)),
                                        const SizedBox(width: 4),
                                        Expanded(
                                          child: Text(h.address, style: TextStyle(fontSize: 12, color: subTextColor)),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 2),
                                    Row(
                                      children: [
                                        const Icon(Icons.phone, size: 14, color: Color(0xFF43A047)),
                                        const SizedBox(width: 4),
                                        Text(h.contact, style: TextStyle(fontSize: 12, color: subTextColor)),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              SmoothAnimatedButton(
                                onPressed: () => launchUrl(Uri.parse('tel:${h.contact}')),
                                backgroundColor: const Color(0xFFE53935),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                borderRadius: 50,
                                child: const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.call, size: 14),
                                    SizedBox(width: 4),
                                    Text('Call', style: TextStyle(fontSize: 12)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          const Divider(height: 1),
                          const SizedBox(height: 12),

                          Text('Live Blood Stock Availability:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: textColor)),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: h.bloodAvailability.entries.map((e) {
                              final available = e.value > 0;
                              return Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: available
                                      ? (isDark ? const Color(0xFF1E2D24) : const Color(0xFFE8F8EE))
                                      : (isDark ? const Color(0xFF2A1A1E) : const Color(0xFFFFEAEA)),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: available ? const Color(0xFF43A047).withAlpha(100) : const Color(0xFFE53935).withAlpha(100),
                                  ),
                                ),
                                child: Text(
                                  '${e.key}: ${e.value} units',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: available ? const Color(0xFF43A047) : const Color(0xFFE53935),
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

  Widget _buildSearchTextField(bool isDark, Color borderColor, Color subTextColor) {
    return TextField(
      controller: _searchC,
      style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontSize: 13),
      onChanged: (v) => setState(() => _searchQuery = v),
      decoration: InputDecoration(
        hintText: 'Search hospital name or city (e.g. Apollo, Chennai, Adyar)...',
        hintStyle: TextStyle(color: subTextColor, fontSize: 13),
        prefixIcon: const Icon(Icons.search, size: 20, color: Color(0xFFE53935)),
        filled: true,
        fillColor: isDark ? const Color(0xFF0F0F1A) : const Color(0xFFFAFAFA),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: borderColor)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: borderColor)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE53935), width: 1.5)),
      ),
    );
  }

  Widget _buildBloodDropdown(bool isDark, Color cardColor, Color borderColor, Color textColor) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF0F0F1A) : const Color(0xFFFAFAFA),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedBloodGroup,
          dropdownColor: cardColor,
          style: TextStyle(color: textColor, fontWeight: FontWeight.w700, fontSize: 13),
          items: ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) {
            return DropdownMenuItem(value: g, child: Text(g == 'All' ? 'All Blood' : '$g Blood'));
          }).toList(),
          onChanged: (val) {
            if (val != null) setState(() => _selectedBloodGroup = val);
          },
        ),
      ),
    );
  }
}
