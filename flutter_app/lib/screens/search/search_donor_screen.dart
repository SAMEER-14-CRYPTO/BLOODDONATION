import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../providers/theme_provider.dart';
import '../../services/demo_data.dart';
import '../../models/models.dart';
import '../../core/theme/app_theme.dart';
import '../widgets/real_osm_map_widget.dart';
import 'donor_detail_screen.dart';

class SearchDonorScreen extends StatefulWidget {
  const SearchDonorScreen({super.key});
  @override
  State<SearchDonorScreen> createState() => _SearchDonorScreenState();
}

class _SearchDonorScreenState extends State<SearchDonorScreen> {
  String _selectedBloodGroup = 'All';
  String _searchQuery = '';
  int _viewMode = 0; // 0 = Both (Map + List), 1 = Map Only, 2 = List Only
  bool _onlyAvailable = false;

  final TextEditingController _searchC = TextEditingController();

  final Map<String, List<double>> _cityCoordinates = {
    'Mumbai': [19.0760, 72.8777],
    'Delhi': [28.6139, 77.2090],
    'Bangalore': [12.9716, 77.5946],
    'Hyderabad': [17.3850, 78.4867],
    'Chennai': [13.0827, 80.2707],
    'Kolkata': [22.5726, 88.3639],
    'Pune': [18.5204, 73.8567],
    'Ahmedabad': [23.0225, 72.5714],
    'Jaipur': [26.9124, 75.7873],
  };

  double _mapLat = 21.5937;
  double _mapLng = 78.9629;
  double _mapZoom = 5.0;

  List<UserModel> get filteredDonors {
    var donors = DemoData.users.where((u) => u.role == 'donor').toList();

    if (_selectedBloodGroup != 'All') {
      donors = donors.where((u) => u.bloodGroup == _selectedBloodGroup).toList();
    }

    if (_onlyAvailable) {
      donors = donors.where((u) => u.availability).toList();
    }

    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      donors = donors.where((u) {
        return u.fullName.toLowerCase().contains(q) ||
            u.city.toLowerCase().contains(q) ||
            u.bloodGroup.toLowerCase().contains(q);
      }).toList();
    }

    return donors;
  }

  void _onCityChipTap(String city) {
    if (_cityCoordinates.containsKey(city)) {
      setState(() {
        _searchC.text = city;
        _searchQuery = city;
        _mapLat = _cityCoordinates[city]![0];
        _mapLng = _cityCoordinates[city]![1];
        _mapZoom = 11.5;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Provider.of<ThemeProvider>(context);
    final isDark = theme.isDarkMode;

    final bgColor = isDark ? const Color(0xFF0F0F1A) : const Color(0xFFFAFAFA);
    final cardColor = isDark ? const Color(0xFF1A1A2E) : Colors.white;
    final borderColor = isDark ? const Color(0xFF2A2A3E) : Colors.grey.shade200;
    final textColor = isDark ? Colors.white : const Color(0xFF1E2022);
    final subTextColor = isDark ? const Color(0xFF9E9E9E) : const Color(0xFF666666);
    final inputBg = isDark ? const Color(0xFF1A1A2E) : Colors.white;

    final donors = filteredDonors;

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: RichText(
          text: TextSpan(
            text: 'Find ',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textColor),
            children: const [
              TextSpan(text: 'Donors', style: TextStyle(color: Color(0xFFE53935))),
            ],
          ),
        ),
        actions: [
          IconButton(
            icon: Text(isDark ? '☀️' : '🌙', style: const TextStyle(fontSize: 20)),
            onPressed: () => theme.toggleTheme(),
          ),
          // View Mode Selector (Map / List / Both)
          Container(
            margin: const EdgeInsets.only(right: 12),
            decoration: BoxDecoration(
              color: inputBg,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: borderColor),
            ),
            child: Row(
              children: [
                _viewIconButton(Icons.dashboard_outlined, 0, 'Both', isDark, subTextColor),
                _viewIconButton(Icons.map_outlined, 1, 'Map', isDark, subTextColor),
                _viewIconButton(Icons.view_list_outlined, 2, 'List', isDark, subTextColor),
              ],
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Filter Header
          Container(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
            decoration: BoxDecoration(
              color: cardColor,
              border: Border(bottom: BorderSide(color: borderColor)),
            ),
            child: Column(
              children: [
                // Search Bar
                TextField(
                  controller: _searchC,
                  style: TextStyle(color: textColor, fontSize: 13),
                  onChanged: (v) {
                    setState(() => _searchQuery = v.trim());
                    for (final entry in _cityCoordinates.entries) {
                      if (entry.key.toLowerCase() == v.trim().toLowerCase()) {
                        _mapLat = entry.value[0];
                        _mapLng = entry.value[1];
                        _mapZoom = 11.5;
                        break;
                      }
                    }
                  },
                  decoration: InputDecoration(
                    hintText: 'Search donor name, city (e.g. Mumbai, Delhi)...',
                    hintStyle: TextStyle(color: subTextColor, fontSize: 13),
                    prefixIcon: Icon(Icons.search, color: subTextColor),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: Icon(Icons.clear, color: subTextColor, size: 18),
                            onPressed: () {
                              _searchC.clear();
                              setState(() => _searchQuery = '');
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: isDark ? const Color(0xFF0F0F1A) : const Color(0xFFF5F7FA),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(50), borderSide: BorderSide(color: borderColor)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(50), borderSide: BorderSide(color: borderColor)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  ),
                ),
                const SizedBox(height: 10),

                // City Chips
                SizedBox(
                  height: 30,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: _cityCoordinates.keys.map((c) {
                      final isSelected = _searchQuery.toLowerCase() == c.toLowerCase();
                      return Padding(
                        padding: const EdgeInsets.only(right: 6),
                        child: InkWell(
                          onTap: () => _onCityChipTap(c),
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: isSelected ? const Color(0xFFE53935) : (isDark ? const Color(0xFF0F0F1A) : const Color(0xFFF5F7FA)),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: isSelected ? const Color(0xFFE53935) : borderColor),
                            ),
                            child: Text(
                              c,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                color: isSelected ? Colors.white : subTextColor,
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 10),

                // Blood Group Pills + Only Available Toggle
                Row(
                  children: [
                    Expanded(
                      child: SizedBox(
                        height: 34,
                        child: ListView(
                          scrollDirection: Axis.horizontal,
                          children: ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) {
                            final isSelected = _selectedBloodGroup == bg;
                            return Padding(
                              padding: const EdgeInsets.only(right: 6),
                              child: ChoiceChip(
                                label: Text(bg),
                                selected: isSelected,
                                selectedColor: const Color(0xFFE53935),
                                backgroundColor: isDark ? const Color(0xFF0F0F1A) : const Color(0xFFF5F7FA),
                                labelStyle: TextStyle(
                                  fontSize: 11,
                                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                                  color: isSelected ? Colors.white : subTextColor,
                                ),
                                side: BorderSide(
                                  color: isSelected ? const Color(0xFFE53935) : borderColor,
                                ),
                                onSelected: (val) {
                                  if (val) setState(() => _selectedBloodGroup = bg);
                                },
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                    InkWell(
                      onTap: () => setState(() => _onlyAvailable = !_onlyAvailable),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: _onlyAvailable ? const Color(0xFF43A047).withAlpha(30) : (isDark ? const Color(0xFF0F0F1A) : const Color(0xFFF5F7FA)),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: _onlyAvailable ? const Color(0xFF43A047) : borderColor),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.circle, size: 8, color: _onlyAvailable ? const Color(0xFF43A047) : Colors.grey),
                            const SizedBox(width: 4),
                            Text(
                              'Online',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: _onlyAvailable ? const Color(0xFF43A047) : subTextColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Main View
          Expanded(
            child: _viewMode == 1
                ? _buildMapOnly()
                : (_viewMode == 2 ? _buildListOnly(donors, cardColor, borderColor, textColor, subTextColor) : _buildBothView(donors, cardColor, borderColor, textColor, subTextColor)),
          ),
        ],
      ),
    );
  }

  Widget _viewIconButton(IconData icon, int mode, String tooltip, bool isDark, Color subTextColor) {
    final isSelected = _viewMode == mode;
    return Tooltip(
      message: tooltip,
      child: InkWell(
        onTap: () => setState(() => _viewMode = mode),
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFFE53935) : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, size: 18, color: isSelected ? Colors.white : subTextColor),
        ),
      ),
    );
  }

  Widget _buildMapOnly() {
    return RealOsmMapWidget(
      key: ValueKey('map_only_${_mapLat}_${_mapLng}_$_selectedBloodGroup'),
      centerLat: _mapLat,
      centerLng: _mapLng,
      initialZoom: _mapZoom,
      initialBloodGroup: _selectedBloodGroup,
      showFilters: false,
      height: double.infinity,
    );
  }

  Widget _buildListOnly(List<UserModel> donors, Color cardColor, Color borderColor, Color textColor, Color subTextColor) {
    if (donors.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('🔍', style: TextStyle(fontSize: 48)),
            const SizedBox(height: 12),
            Text('No matching donors found', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: textColor)),
            const SizedBox(height: 4),
            Text('Try selecting a different blood group or city', style: TextStyle(fontSize: 12, color: subTextColor)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: donors.length,
      itemBuilder: (context, i) => _buildDonorListCard(donors[i], cardColor, borderColor, textColor, subTextColor),
    );
  }

  Widget _buildBothView(List<UserModel> donors, Color cardColor, Color borderColor, Color textColor, Color subTextColor) {
    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
            child: RealOsmMapWidget(
              key: ValueKey('split_map_${_mapLat}_${_mapLng}_$_selectedBloodGroup'),
              centerLat: _mapLat,
              centerLng: _mapLng,
              initialZoom: _mapZoom,
              initialBloodGroup: _selectedBloodGroup,
              showFilters: false,
              height: 280,
            ),
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('${donors.length} Donors Found', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: textColor)),
                Text('Tap pin or card to contact', style: TextStyle(fontSize: 11, color: subTextColor)),
              ],
            ),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.all(16),
          sliver: SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, i) => _buildDonorListCard(donors[i], cardColor, borderColor, textColor, subTextColor),
              childCount: donors.length,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDonorListCard(UserModel d, Color cardColor, Color borderColor, Color textColor, Color subTextColor) {
    return Card(
      color: cardColor,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: borderColor),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => DonorDetailScreen(donor: d))),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: const Color(0xFFFFEAEA),
                child: Text(
                  d.bloodGroup,
                  style: const TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w900, fontSize: 14),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            d.fullName,
                            style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: textColor),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        if (d.verified)
                          const Padding(
                            padding: EdgeInsets.only(left: 6),
                            child: Icon(Icons.verified, size: 15, color: Color(0xFF43A047)),
                          ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '📍 ${d.city} · ${d.gender} · ${d.age} yrs',
                      style: TextStyle(fontSize: 12, color: subTextColor),
                    ),
                  ],
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: const Icon(Icons.phone, color: Color(0xFF43A047), size: 22),
                    onPressed: () => _callPhone(d.phone),
                  ),
                  Container(
                    width: 9,
                    height: 9,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: d.availability ? const Color(0xFF43A047) : Colors.grey,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _callPhone(String phone) async {
    final clean = phone.replaceAll(RegExp(r'[^\d+]'), '');
    final uri = Uri.parse('tel:$clean');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }
}
