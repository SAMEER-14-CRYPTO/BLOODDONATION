import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../models/models.dart';
import '../../services/demo_data.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/theme_provider.dart';
import '../search/donor_detail_screen.dart';

/// Real OpenStreetMap / CartoDB Tile Map Engine for Flutter
/// Dynamically matches the app theme (Light / Dark) seamlessly.
class RealOsmMapWidget extends StatefulWidget {
  final String? initialBloodGroup;
  final Function(UserModel)? onDonorSelected;
  final double? centerLat;
  final double? centerLng;
  final double initialZoom;
  final bool showFilters;
  final double height;
  final String markerType; // 'donors', 'hospitals', 'bloodbanks'

  const RealOsmMapWidget({
    super.key,
    this.initialBloodGroup,
    this.onDonorSelected,
    this.centerLat,
    this.centerLng,
    this.initialZoom = 5.0,
    this.showFilters = true,
    this.height = 420.0,
    this.markerType = 'donors',
  });

  @override
  State<RealOsmMapWidget> createState() => _RealOsmMapWidgetState();
}

class _RealOsmMapWidgetState extends State<RealOsmMapWidget> with SingleTickerProviderStateMixin {
  late double _centerLat;
  late double _centerLng;
  late double _zoom;

  double _userLat = 13.0827;
  double _userLng = 80.2707;
  String _userLocationName = 'Chennai, TN';

  String _selectedBloodGroup = 'All';
  UserModel? _selectedDonor;
  HospitalModel? _selectedHospital;
  Map<String, dynamic>? _selectedBloodBank;

  bool _isLocating = false;

  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  Offset _dragOffset = Offset.zero;

  final List<Map<String, dynamic>> _cities = [
    {'name': 'South India', 'lat': 13.0827, 'lng': 79.8877, 'zoom': 6.5},
    {'name': 'Chennai', 'lat': 13.0827, 'lng': 80.2707, 'zoom': 11.5},
    {'name': 'Tirupati', 'lat': 13.6288, 'lng': 79.4192, 'zoom': 12.0},
    {'name': 'Coimbatore', 'lat': 11.0168, 'lng': 76.9558, 'zoom': 11.5},
    {'name': 'Vijayawada', 'lat': 16.5062, 'lng': 80.6480, 'zoom': 12.0},
    {'name': 'Visakhapatnam', 'lat': 17.6868, 'lng': 83.2185, 'zoom': 11.5},
    {'name': 'Madurai', 'lat': 9.9252, 'lng': 78.1198, 'zoom': 12.0},
    {'name': 'Guntur', 'lat': 16.3067, 'lng': 80.4365, 'zoom': 12.0},
    {'name': 'Nellore', 'lat': 14.4426, 'lng': 79.9865, 'zoom': 12.0},
    {'name': 'Kadapa', 'lat': 14.4673, 'lng': 78.8242, 'zoom': 12.0},
    {'name': 'Rly Kodur', 'lat': 14.0042, 'lng': 79.3512, 'zoom': 13.0},
  ];

  final List<Map<String, dynamic>> _bloodBanks = [
    {
      'name': 'Tamil Nadu State Apex Blood Bank',
      'city': 'Chennai',
      'address': 'Kilpauk, Chennai, Tamil Nadu',
      'phone': '+91-44-26432804',
      'lat': 13.0843,
      'lng': 80.2399,
      'stocks': {'O+': 58, 'A+': 40, 'B+': 46, 'AB+': 16, 'O-': 22, 'A-': 12}
    },
    {
      'name': 'Indian Red Cross Society Blood Centre',
      'city': 'Chennai',
      'address': '179, Anna Salai, Chennai',
      'phone': '+91-44-28520068',
      'lat': 13.0580,
      'lng': 80.2579,
      'stocks': {'O+': 48, 'A+': 32, 'B+': 38, 'AB+': 12, 'O-': 18, 'A-': 10}
    },
    {
      'name': 'SVIMS Blood Bank & Component Centre',
      'city': 'Tirupati',
      'address': 'Alipiri Road, Tirupati, AP',
      'phone': '+91-877-2287777',
      'lat': 13.6350,
      'lng': 79.4200,
      'stocks': {'O+': 45, 'A+': 28, 'B+': 32, 'AB+': 11, 'O-': 15, 'A-': 8}
    },
    {
      'name': 'Red Cross Blood Bank, Vijayawada',
      'city': 'Vijayawada',
      'address': 'Eluru Road, Vijayawada, AP',
      'phone': '+91-866-2573456',
      'lat': 16.5101,
      'lng': 80.6320,
      'stocks': {'O+': 50, 'A+': 32, 'B+': 38, 'AB+': 13, 'O-': 17, 'A-': 10}
    },
  ];

  @override
  void initState() {
    super.initState();
    _centerLat = widget.centerLat ?? 21.5937;
    _centerLng = widget.centerLng ?? 78.9629;
    _zoom = widget.initialZoom;

    if (widget.initialBloodGroup != null) {
      _selectedBloodGroup = widget.initialBloodGroup!;
    }

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 0.8, end: 1.3).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  List<UserModel> get _donors {
    final list = DemoData.users.where((u) => u.role == 'donor').toList();
    if (_selectedBloodGroup == 'All') return list;
    return list.where((u) => u.bloodGroup == _selectedBloodGroup).toList();
  }

  void _flyTo(double lat, double lng, double zoom, {String? locationName}) {
    setState(() {
      _centerLat = lat;
      _centerLng = lng;
      _zoom = zoom;
      _dragOffset = Offset.zero;
      if (locationName != null) {
        _userLocationName = locationName;
      }
    });
  }

  void _detectLocation() {
    setState(() => _isLocating = true);
    Future.delayed(const Duration(milliseconds: 600), () {
      if (mounted) {
        setState(() {
          _isLocating = false;
          _userLat = 19.0760;
          _userLng = 72.8777;
          _userLocationName = 'Your Location (Mumbai)';
          _centerLat = 19.0760;
          _centerLng = 72.8777;
          _zoom = 11.5;
          _dragOffset = Offset.zero;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('📍 Location detected: Mumbai, India (GPS active)'),
            backgroundColor: Color(0xFF1E88E5),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Provider.of<ThemeProvider>(context);
    final isDark = theme.isDarkMode;

    final containerBg = isDark ? const Color(0xFF0F121F) : const Color(0xFFF0F2F5);
    final borderCol = isDark ? const Color(0xFF2A2A3E) : Colors.grey.shade300;
    final pillBg = isDark ? const Color(0xFF1A1A2E) : Colors.white;
    final pillText = isDark ? const Color(0xFF9E9E9E) : const Color(0xFF555555);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.showFilters) ...[
          // City Quick Jump Bar
          SizedBox(
            height: 34,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _cities.length,
              itemBuilder: (context, i) {
                final city = _cities[i];
                final isSelected = (_centerLat - (city['lat'] as double)).abs() < 0.1 &&
                    (_centerLng - (city['lng'] as double)).abs() < 0.1;
                return Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: InkWell(
                    onTap: () => _flyTo(city['lat'], city['lng'], city['zoom'], locationName: city['name']),
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFFE53935) : pillBg,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: isSelected ? const Color(0xFFE53935) : borderCol),
                      ),
                      child: Text(
                        city['name'],
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                          color: isSelected ? Colors.white : pillText,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 10),

          // Blood Group Filter Chips
          if (widget.markerType == 'donors') ...[
            SizedBox(
              height: 36,
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
                      backgroundColor: pillBg,
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.white : pillText,
                        fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                        fontSize: 12,
                      ),
                      side: BorderSide(
                        color: isSelected ? const Color(0xFFE53935) : borderCol,
                      ),
                      onSelected: (val) {
                        if (val) {
                          setState(() {
                            _selectedBloodGroup = bg;
                            _selectedDonor = null;
                          });
                        }
                      },
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 10),
          ],
        ],

        // Real OpenStreetMap Viewport (Follows app theme)
        ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Container(
            height: widget.height,
            width: double.infinity,
            decoration: BoxDecoration(
              color: containerBg,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: borderCol, width: 1.5),
            ),
            child: Stack(
              clipBehavior: Clip.hardEdge,
              children: [
                // Real Tile Layer + Gesture Handling
                GestureDetector(
                  onPanUpdate: (details) {
                    setState(() {
                      _dragOffset += details.delta;
                    });
                  },
                  onPanEnd: (details) {
                    final int zInt = _zoom.floor().clamp(1, 18);
                    final double scale = math.pow(2.0, _zoom - zInt).toDouble();
                    final double deltaTileX = -_dragOffset.dx / (256.0 * scale);
                    final double deltaTileY = -_dragOffset.dy / (256.0 * scale);

                    final double curTileX = _lngToTileX(_centerLng, zInt);
                    final double curTileY = _latToTileY(_centerLat, zInt);

                    setState(() {
                      _centerLng = _tileXToLng(curTileX + deltaTileX, zInt);
                      _centerLat = _tileYToLat(curTileY + deltaTileY, zInt);
                      _dragOffset = Offset.zero;
                    });
                  },
                  child: LayoutBuilder(
                    builder: (context, constraints) {
                      final width = constraints.maxWidth;
                      final height = constraints.maxHeight;

                      return Stack(
                        children: [
                          _buildTileGrid(width, height, isDark),
                          _buildUserRadiusHalo(width, height),
                          _buildUserLocationMarker(width, height),

                          // Markers based on markerType
                          if (widget.markerType == 'donors')
                            ..._donors.map((d) {
                              final lat = d.latitude ?? 20.0;
                              final lng = d.longitude ?? 78.0;
                              return _buildDonorPin(d, lat, lng, width, height);
                            })
                          else if (widget.markerType == 'hospitals')
                            ...DemoData.hospitals.map((h) {
                              final lat = h.latitude ?? 19.0760;
                              final lng = h.longitude ?? 72.8777;
                              return _buildHospitalPin(h, lat, lng, width, height);
                            })
                          else if (widget.markerType == 'bloodbanks')
                            ..._bloodBanks.map((b) {
                              final lat = b['lat'] as double;
                              final lng = b['lng'] as double;
                              return _buildBloodBankPin(b, lat, lng, width, height);
                            }),
                        ],
                      );
                    },
                  ),
                ),

                // Top Floating Status Header
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xE6191C2E) : const Color(0xF2FFFFFF),
                      borderRadius: BorderRadius.circular(50),
                      border: Border.all(color: borderCol),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withAlpha(isDark ? 60 : 15), blurRadius: 10),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppTheme.success,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          widget.markerType == 'donors'
                              ? '${_donors.length} Donors Live'
                              : (widget.markerType == 'hospitals'
                                  ? '${DemoData.hospitals.length} Hospitals Live'
                                  : '${_bloodBanks.length} Blood Banks Live'),
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: isDark ? Colors.white : const Color(0xFF1E2022),
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          '· $_userLocationName',
                          style: TextStyle(fontSize: 11, color: isDark ? const Color(0xFF9E9E9E) : const Color(0xFF757575)),
                        ),
                      ],
                    ),
                  ),
                ),

                // Map Navigation Controls (+ / - / GPS)
                Positioned(
                  top: 12,
                  right: 12,
                  child: Column(
                    children: [
                      _mapCtrlButton(
                        icon: Icons.add,
                        tooltip: 'Zoom In',
                        isDark: isDark,
                        onTap: () => setState(() => _zoom = (_zoom + 1.0).clamp(3.0, 18.0)),
                      ),
                      const SizedBox(height: 6),
                      _mapCtrlButton(
                        icon: Icons.remove,
                        tooltip: 'Zoom Out',
                        isDark: isDark,
                        onTap: () => setState(() => _zoom = (_zoom - 1.0).clamp(3.0, 18.0)),
                      ),
                      const SizedBox(height: 6),
                      _mapCtrlButton(
                        icon: _isLocating ? Icons.hourglass_top : Icons.my_location,
                        tooltip: 'My Location (GPS)',
                        iconColor: const Color(0xFF1E88E5),
                        isDark: isDark,
                        onTap: _detectLocation,
                      ),
                    ],
                  ),
                ),

                // Selected Info Card (Donor, Hospital, or Blood Bank)
                if (_selectedDonor != null)
                  Positioned(
                    bottom: 12,
                    left: 12,
                    right: 12,
                    child: _buildDonorCard(_selectedDonor!, isDark),
                  ),
                if (_selectedHospital != null)
                  Positioned(
                    bottom: 12,
                    left: 12,
                    right: 12,
                    child: _buildHospitalCard(_selectedHospital!, isDark),
                  ),
                if (_selectedBloodBank != null)
                  Positioned(
                    bottom: 12,
                    left: 12,
                    right: 12,
                    child: _buildBloodBankCard(_selectedBloodBank!, isDark),
                  ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Map Legend
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (widget.markerType == 'donors') ...[
              _legendBadge(const Color(0xFF43A047), 'Available Donor', isDark),
              const SizedBox(width: 14),
              _legendBadge(const Color(0xFF9E9E9E), 'Unavailable', isDark),
            ] else if (widget.markerType == 'hospitals') ...[
              _legendBadge(const Color(0xFF1E88E5), 'Partner Hospital', isDark),
            ] else ...[
              _legendBadge(const Color(0xFFE53935), 'Blood Bank', isDark),
            ],
            const SizedBox(width: 14),
            _legendBadge(const Color(0xFF1E88E5), 'Your Location', isDark),
          ],
        ),
      ],
    );
  }

  // ── 1. TILE GRID RENDERER (Clean Light / Dark tiles matching theme) ──
  Widget _buildTileGrid(double screenWidth, double screenHeight, bool isDark) {
    final int zoomInt = _zoom.floor().clamp(1, 18);
    final double zoomFraction = _zoom - zoomInt;
    final double tileScale = math.pow(2.0, zoomFraction).toDouble();
    const double baseTileSize = 256.0;
    final double scaledTileSize = baseTileSize * tileScale;

    final double centerTileX = _lngToTileX(_centerLng, zoomInt);
    final double centerTileY = _latToTileY(_centerLat, zoomInt);

    final double screenCenterX = screenWidth / 2.0 + _dragOffset.dx;
    final double screenCenterY = screenHeight / 2.0 + _dragOffset.dy;

    final int minTileX = (centerTileX - (screenCenterX / scaledTileSize) - 1).floor();
    final int maxTileX = (centerTileX + ((screenWidth - screenCenterX) / scaledTileSize) + 1).ceil();
    final int minTileY = (centerTileY - (screenCenterY / scaledTileSize) - 1).floor();
    final int maxTileY = (centerTileY + ((screenHeight - screenCenterY) / scaledTileSize) + 1).ceil();

    final List<Widget> tileWidgets = [];
    final int numTilesAtZoom = 1 << zoomInt;

    for (int tx = minTileX; tx <= maxTileX; tx++) {
      for (int ty = minTileY; ty <= maxTileY; ty++) {
        if (ty < 0 || ty >= numTilesAtZoom) continue;
        final int wrappedTx = (tx % numTilesAtZoom + numTilesAtZoom) % numTilesAtZoom;

        final double left = screenCenterX + (tx - centerTileX) * scaledTileSize;
        final double top = screenCenterY + (ty - centerTileY) * scaledTileSize;

        // In light theme: CartoDB Voyager / OSM light tiles. In dark theme: CartoDB Dark Matter tiles.
        final String tileUrl = isDark
            ? 'https://basemaps.cartocdn.com/dark_all/$zoomInt/$wrappedTx/$ty.png'
            : 'https://basemaps.cartocdn.com/rastertiles/voyager/$zoomInt/$wrappedTx/$ty.png';

        tileWidgets.add(
          Positioned(
            left: left,
            top: top,
            width: scaledTileSize + 0.5,
            height: scaledTileSize + 0.5,
            child: Image.network(
              tileUrl,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                color: isDark ? const Color(0xFF141829) : const Color(0xFFE8ECEF),
                child: Center(
                  child: Icon(Icons.map_outlined, color: isDark ? const Color(0xFF2A2A3E) : Colors.grey.shade400, size: 20),
                ),
              ),
            ),
          ),
        );
      }
    }

    return Stack(children: tileWidgets);
  }

  // ── 2. USER LOCATION & RADAR ──
  Widget _buildUserRadiusHalo(double w, double h) {
    final pos = _getScreenPosition(_userLat, _userLng, w, h);
    return Positioned(
      left: pos.dx - 50,
      top: pos.dy - 50,
      child: IgnorePointer(
        child: Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: const Color(0xFF1E88E5).withAlpha(20),
            border: Border.all(color: const Color(0xFF1E88E5).withAlpha(60), width: 1.5),
          ),
        ),
      ),
    );
  }

  Widget _buildUserLocationMarker(double w, double h) {
    final pos = _getScreenPosition(_userLat, _userLng, w, h);
    return Positioned(
      left: pos.dx - 18,
      top: pos.dy - 18,
      child: Tooltip(
        message: 'Your Location: $_userLocationName',
        child: AnimatedBuilder(
          animation: _pulseAnimation,
          builder: (context, child) {
            return Transform.scale(
              scale: _pulseAnimation.value,
              child: Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF1E88E5).withAlpha(45),
                  border: Border.all(color: const Color(0xFF1E88E5), width: 2),
                ),
                child: Center(
                  child: Container(
                    width: 14,
                    height: 14,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Color(0xFF1E88E5),
                      boxShadow: [
                        BoxShadow(color: Color(0xFF1E88E5), blurRadius: 8),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  // ── 3. DONOR PINS ──
  Widget _buildDonorPin(UserModel donor, double lat, double lng, double w, double h) {
    final pos = _getScreenPosition(lat, lng, w, h);
    final isSelected = _selectedDonor?.uid == donor.uid;
    final isAvailable = donor.availability;
    final color = isAvailable ? const Color(0xFF43A047) : const Color(0xFF9E9E9E);

    return Positioned(
      left: pos.dx - (isSelected ? 26 : 20),
      top: pos.dy - (isSelected ? 48 : 38),
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedDonor = donor;
            _selectedHospital = null;
            _selectedBloodBank = null;
          });
          if (widget.onDonorSelected != null) {
            widget.onDonorSelected!(donor);
          }
        },
        child: AnimatedScale(
          scale: isSelected ? 1.25 : 1.0,
          duration: const Duration(milliseconds: 200),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
                decoration: BoxDecoration(
                  color: isSelected ? const Color(0xFFE53935) : color,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: (isSelected ? const Color(0xFFE53935) : color).withAlpha(140),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('🩸', style: TextStyle(fontSize: 10)),
                    const SizedBox(width: 2),
                    Text(
                      donor.bloodGroup,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ),
              ),
              CustomPaint(
                size: const Size(8, 6),
                painter: _PinPointerPainter(color: isSelected ? const Color(0xFFE53935) : color),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── 4. HOSPITAL PINS ──
  Widget _buildHospitalPin(HospitalModel hospital, double lat, double lng, double w, double h) {
    final pos = _getScreenPosition(lat, lng, w, h);
    final isSelected = _selectedHospital?.id == hospital.id;

    return Positioned(
      left: pos.dx - 22,
      top: pos.dy - 44,
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedHospital = hospital;
            _selectedDonor = null;
            _selectedBloodBank = null;
          });
        },
        child: AnimatedScale(
          scale: isSelected ? 1.2 : 1.0,
          duration: const Duration(milliseconds: 200),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: const Color(0xFF1E88E5),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                  boxShadow: const [
                    BoxShadow(color: Color(0x661E88E5), blurRadius: 10, offset: Offset(0, 4)),
                  ],
                ),
                child: const Center(child: Text('🏥', style: TextStyle(fontSize: 18))),
              ),
              CustomPaint(
                size: const Size(8, 6),
                painter: _PinPointerPainter(color: const Color(0xFF1E88E5)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── 5. BLOOD BANK PINS ──
  Widget _buildBloodBankPin(Map<String, dynamic> bank, double lat, double lng, double w, double h) {
    final pos = _getScreenPosition(lat, lng, w, h);
    final isSelected = _selectedBloodBank?['name'] == bank['name'];

    return Positioned(
      left: pos.dx - 22,
      top: pos.dy - 44,
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedBloodBank = bank;
            _selectedDonor = null;
            _selectedHospital = null;
          });
        },
        child: AnimatedScale(
          scale: isSelected ? 1.2 : 1.0,
          duration: const Duration(milliseconds: 200),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: const Color(0xFFE53935),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                  boxShadow: const [
                    BoxShadow(color: Color(0x66E53935), blurRadius: 10, offset: Offset(0, 4)),
                  ],
                ),
                child: const Center(child: Text('🩸', style: TextStyle(fontSize: 18))),
              ),
              CustomPaint(
                size: const Size(8, 6),
                painter: _PinPointerPainter(color: const Color(0xFFE53935)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── 6. POPUP CARDS ──
  Widget _buildDonorCard(UserModel donor, bool isDark) {
    final distanceKm = _calculateDistance(_userLat, _userLng, donor.latitude ?? 20.0, donor.longitude ?? 78.0);
    final cardBg = isDark ? const Color(0xFF1A1A2E) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF1E2022);
    final subText = isDark ? const Color(0xFF9E9E9E) : const Color(0xFF666666);

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE53935).withAlpha(120), width: 1.5),
        boxShadow: const [
          BoxShadow(color: Colors.black26, blurRadius: 16, offset: Offset(0, 6)),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 24,
            backgroundColor: const Color(0xFFFFEAEA),
            child: Text(
              donor.bloodGroup,
              style: const TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w900, fontSize: 15),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        donor.fullName,
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: textColor),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (donor.verified)
                      const Padding(
                        padding: EdgeInsets.only(left: 4),
                        child: Icon(Icons.verified, size: 15, color: Color(0xFF43A047)),
                      ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  '📍 ${donor.city} · $distanceKm km away',
                  style: TextStyle(fontSize: 12, color: subText, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => DonorDetailScreen(donor: donor)),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFE53935),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
            ),
            child: const Text('Contact', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
          ),
          IconButton(
            icon: Icon(Icons.close, size: 18, color: subText),
            onPressed: () => setState(() => _selectedDonor = null),
          ),
        ],
      ),
    );
  }

  Widget _buildHospitalCard(HospitalModel hospital, bool isDark) {
    final cardBg = isDark ? const Color(0xFF1A1A2E) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF1E2022);
    final subText = isDark ? const Color(0xFF9E9E9E) : const Color(0xFF666666);
    final chipBg = isDark ? const Color(0xFF0F0F1A) : const Color(0xFFF0F4F8);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFF1E88E5).withAlpha(150), width: 1.5),
        boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 16, offset: Offset(0, 6))],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: const Color(0xFF1E88E5).withAlpha(35),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Center(child: Text('🏥', style: TextStyle(fontSize: 18))),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(hospital.name, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: textColor)),
                    Text(hospital.address, style: TextStyle(fontSize: 11, color: subText)),
                  ],
                ),
              ),
              IconButton(
                icon: Icon(Icons.close, size: 18, color: subText),
                onPressed: () => setState(() => _selectedHospital = null),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: hospital.bloodAvailability.entries.map((e) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: chipBg,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: isDark ? const Color(0xFF2A2A3E) : Colors.grey.shade300),
                ),
                child: Text('${e.key}: ${e.value} units', style: TextStyle(color: textColor, fontSize: 11, fontWeight: FontWeight.w700)),
              );
            }).toList(),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => _call(hospital.contact),
              icon: const Icon(Icons.phone, size: 16),
              label: Text('Call Hospital (${hospital.contact})'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1E88E5),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 10),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBloodBankCard(Map<String, dynamic> bank, bool isDark) {
    final stocks = bank['stocks'] as Map<String, int>;
    final cardBg = isDark ? const Color(0xFF1A1A2E) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF1E2022);
    final subText = isDark ? const Color(0xFF9E9E9E) : const Color(0xFF666666);
    final chipBg = isDark ? const Color(0xFF0F0F1A) : const Color(0xFFF0F4F8);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE53935).withAlpha(150), width: 1.5),
        boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 16, offset: Offset(0, 6))],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: const Color(0xFFE53935).withAlpha(35),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Center(child: Text('🩸', style: TextStyle(fontSize: 18))),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(bank['name'] as String, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: textColor)),
                    Text(bank['address'] as String, style: TextStyle(fontSize: 11, color: subText)),
                  ],
                ),
              ),
              IconButton(
                icon: Icon(Icons.close, size: 18, color: subText),
                onPressed: () => setState(() => _selectedBloodBank = null),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: stocks.entries.map((e) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: chipBg,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: isDark ? const Color(0xFF2A2A3E) : Colors.grey.shade300),
                ),
                child: Text('${e.key}: ${e.value} units', style: TextStyle(color: textColor, fontSize: 11, fontWeight: FontWeight.w700)),
              );
            }).toList(),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => _call(bank['phone'] as String),
              icon: const Icon(Icons.phone, size: 16),
              label: Text('Call Blood Bank (${bank['phone']})'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE53935),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 10),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _mapCtrlButton({
    required IconData icon,
    required String tooltip,
    required VoidCallback onTap,
    required bool isDark,
    Color? iconColor,
  }) {
    final btnBg = isDark ? const Color(0xFF1A1A2E) : Colors.white;
    final borderCol = isDark ? const Color(0xFF2A2A3E) : Colors.grey.shade300;

    return Material(
      color: btnBg,
      borderRadius: BorderRadius.circular(10),
      elevation: 4,
      child: InkWell(
        borderRadius: BorderRadius.circular(10),
        onTap: onTap,
        child: Tooltip(
          message: tooltip,
          child: Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: borderCol),
            ),
            child: Icon(icon, size: 18, color: iconColor ?? (isDark ? Colors.white : const Color(0xFF1E2022))),
          ),
        ),
      ),
    );
  }

  Widget _legendBadge(Color color, String label, bool isDark) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 9,
          height: 9,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: color,
            border: Border.all(color: Colors.white, width: 1.5),
          ),
        ),
        const SizedBox(width: 6),
        Text(
          label,
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: isDark ? const Color(0xFF9E9E9E) : const Color(0xFF757575)),
        ),
      ],
    );
  }

  Offset _getScreenPosition(double lat, double lng, double screenW, double screenH) {
    final int zoomInt = _zoom.floor().clamp(1, 18);
    final double zoomFraction = _zoom - zoomInt;
    final double tileScale = math.pow(2.0, zoomFraction).toDouble();
    const double baseTileSize = 256.0;
    final double scaledTileSize = baseTileSize * tileScale;

    final double centerTileX = _lngToTileX(_centerLng, zoomInt);
    final double centerTileY = _latToTileY(_centerLat, zoomInt);

    final double markerTileX = _lngToTileX(lng, zoomInt);
    final double markerTileY = _latToTileY(lat, zoomInt);

    final double screenCenterX = screenW / 2.0 + _dragOffset.dx;
    final double screenCenterY = screenH / 2.0 + _dragOffset.dy;

    final double x = screenCenterX + (markerTileX - centerTileX) * scaledTileSize;
    final double y = screenCenterY + (markerTileY - centerTileY) * scaledTileSize;

    return Offset(x, y);
  }

  double _lngToTileX(double lng, int z) => (lng + 180.0) / 360.0 * (1 << z);

  double _latToTileY(double lat, int z) {
    final latRad = lat * math.pi / 180.0;
    return (1.0 - math.log(math.tan(latRad) + 1.0 / math.cos(latRad)) / math.pi) / 2.0 * (1 << z);
  }

  double _tileXToLng(double tx, int z) => tx / (1 << z) * 360.0 - 180.0;

  double _tileYToLat(double ty, int z) {
    final n = math.pi - 2.0 * math.pi * ty / (1 << z);
    return 180.0 / math.pi * math.atan(0.5 * (math.exp(n) - math.exp(-n)));
  }

  String _calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    const double earthRadiusKm = 6371.0;
    final double dLat = (lat2 - lat1) * math.pi / 180.0;
    final double dLon = (lon2 - lon1) * math.pi / 180.0;

    final double a = math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(lat1 * math.pi / 180.0) * math.cos(lat2 * math.pi / 180.0) *
            math.sin(dLon / 2) * math.sin(dLon / 2);
    final double c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
    return (earthRadiusKm * c).toStringAsFixed(1);
  }

  void _call(String phone) async {
    final clean = phone.replaceAll(RegExp(r'[^\d+]'), '');
    final uri = Uri.parse('tel:$clean');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }
}

class _PinPointerPainter extends CustomPainter {
  final Color color;
  _PinPointerPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color;
    final path = Path()
      ..moveTo(0, 0)
      ..lineTo(size.width, 0)
      ..lineTo(size.width / 2, size.height)
      ..close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
