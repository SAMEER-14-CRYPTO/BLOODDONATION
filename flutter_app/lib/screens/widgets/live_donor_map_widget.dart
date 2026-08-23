import 'package:flutter/material.dart';
import '../../models/models.dart';
import '../../services/demo_data.dart';
import '../../core/theme/app_theme.dart';
import '../search/donor_detail_screen.dart';

/// Interactive Live Donor Map Widget matching the Web Platform Leaflet map
class LiveDonorMapWidget extends StatefulWidget {
  final String? initialBloodGroup;
  final Function(UserModel)? onDonorSelected;

  const LiveDonorMapWidget({
    super.key,
    this.initialBloodGroup,
    this.onDonorSelected,
  });

  @override
  State<LiveDonorMapWidget> createState() => _LiveDonorMapWidgetState();
}

class _LiveDonorMapWidgetState extends State<LiveDonorMapWidget> {
  String _selectedBloodGroup = 'All';
  UserModel? _highlightedDonor;
  double _zoomLevel = 1.0;
  Offset _panOffset = Offset.zero;

  // India bounding box coordinates
  static const double minLat = 8.0;
  static const double maxLat = 33.0;
  static const double minLng = 68.0;
  static const double maxLng = 89.0;

  // User location (Mumbai)
  static const double userLat = 19.0760;
  static const double userLng = 72.8777;

  @override
  void initState() {
    super.initState();
    if (widget.initialBloodGroup != null) {
      _selectedBloodGroup = widget.initialBloodGroup!;
    }
  }

  List<UserModel> get filteredDonors {
    final donors = DemoData.users.where((u) => u.role == 'donor').toList();
    if (_selectedBloodGroup == 'All') return donors;
    return donors.where((u) => u.bloodGroup == _selectedBloodGroup).toList();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Blood Group Filter Chips
        SizedBox(
          height: 38,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) {
              final isSelected = _selectedBloodGroup == bg;
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: ChoiceChip(
                  label: Text(bg),
                  selected: isSelected,
                  selectedColor: AppTheme.primary,
                  backgroundColor: isDark ? const Color(0xFF1A1A2E) : Colors.grey.shade200,
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : (isDark ? Colors.white70 : Colors.black87),
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                    fontSize: 13,
                  ),
                  side: BorderSide(
                    color: isSelected ? AppTheme.primary : (isDark ? const Color(0xFF2A2A3E) : Colors.transparent),
                  ),
                  onSelected: (val) {
                    if (val) {
                      setState(() {
                        _selectedBloodGroup = bg;
                        _highlightedDonor = null;
                      });
                    }
                  },
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 12),

        // Map Viewport Container
        ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Container(
            height: 380,
            width: double.infinity,
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF0D101D) : const Color(0xFFE8ECEF),
              border: Border.all(color: isDark ? const Color(0xFF2A2A3E) : Colors.grey.shade300),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Stack(
              children: [
                // Interactive Gesture Map Canvas
                GestureDetector(
                  onScaleUpdate: (details) {
                    setState(() {
                      _zoomLevel = (_zoomLevel * details.scale).clamp(0.8, 3.0);
                      _panOffset += details.focalPointDelta;
                    });
                  },
                  child: LayoutBuilder(
                    builder: (context, constraints) {
                      final width = constraints.maxWidth;
                      final height = constraints.maxHeight;

                      return CustomPaint(
                        size: Size(width, height),
                        painter: _MapGridPainter(
                          isDark: isDark,
                          zoom: _zoomLevel,
                          offset: _panOffset,
                        ),
                        child: Stack(
                          children: [
                            // User Location Marker (Blue Pulse)
                            _buildUserMarker(width, height),

                            // Donor Markers (Green = available, Grey = unavailable)
                            ...filteredDonors.map((donor) {
                              final lat = donor.latitude ?? 20.5937;
                              final lng = donor.longitude ?? 78.9629;
                              return _buildDonorMarker(donor, lat, lng, width, height);
                            }),
                          ],
                        ),
                      );
                    },
                  ),
                ),

                // Map Overlay Controls (Zoom +, Zoom -, Reset)
                Positioned(
                  top: 12,
                  right: 12,
                  child: Column(
                    children: [
                      _mapControlButton(
                        icon: Icons.add,
                        onTap: () => setState(() => _zoomLevel = (_zoomLevel + 0.3).clamp(0.8, 3.0)),
                      ),
                      const SizedBox(height: 6),
                      _mapControlButton(
                        icon: Icons.remove,
                        onTap: () => setState(() => _zoomLevel = (_zoomLevel - 0.3).clamp(0.8, 3.0)),
                      ),
                      const SizedBox(height: 6),
                      _mapControlButton(
                        icon: Icons.my_location,
                        onTap: () => setState(() {
                          _zoomLevel = 1.0;
                          _panOffset = Offset.zero;
                        }),
                      ),
                    ],
                  ),
                ),

                // Live Donor Count Badge
                Positioned(
                  top: 12,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xDD191C2E) : Colors.white.withAlpha(230),
                      borderRadius: BorderRadius.circular(50),
                      border: Border.all(color: isDark ? const Color(0xFF2A2A3E) : Colors.grey.shade300),
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
                        const SizedBox(width: 6),
                        Text(
                          '${filteredDonors.length} Donors on Map',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: isDark ? Colors.white : Colors.black87,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Highlighted Donor Preview Card (when pin is tapped)
                if (_highlightedDonor != null)
                  Positioned(
                    bottom: 12,
                    left: 12,
                    right: 12,
                    child: _buildDonorPopupCard(_highlightedDonor!, isDark),
                  ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Map Legend (Matching Web Server)
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _legendItem(const Color(0xFF43A047), 'Available Donors', isDark),
            const SizedBox(width: 16),
            _legendItem(const Color(0xFF9E9E9E), 'Unavailable', isDark),
            const SizedBox(width: 16),
            _legendItem(const Color(0xFF1E88E5), 'Your Location', isDark),
          ],
        ),
      ],
    );
  }

  Widget _buildUserMarker(double w, double h) {
    final pos = _latLngToScreen(userLat, userLng, w, h);
    return Positioned(
      left: pos.dx - 18,
      top: pos.dy - 18,
      child: Tooltip(
        message: 'Your Location (Mumbai)',
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
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDonorMarker(UserModel donor, double lat, double lng, double w, double h) {
    final pos = _latLngToScreen(lat, lng, w, h);
    final isSelected = _highlightedDonor?.uid == donor.uid;
    final isAvailable = donor.availability;
    final color = isAvailable ? const Color(0xFF43A047) : const Color(0xFF9E9E9E);

    return Positioned(
      left: pos.dx - (isSelected ? 24 : 18),
      top: pos.dy - (isSelected ? 44 : 36),
      child: GestureDetector(
        onTap: () {
          setState(() => _highlightedDonor = donor);
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
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                decoration: BoxDecoration(
                  color: isSelected ? AppTheme.primary : color,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: (isSelected ? AppTheme.primary : color).withAlpha(120),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
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
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
              CustomPaint(
                size: const Size(8, 6),
                painter: _TrianglePointerPainter(color: isSelected ? AppTheme.primary : color),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDonorPopupCard(UserModel donor, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1A1A2E) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.primary.withAlpha(100), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(80),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 24,
            backgroundColor: AppTheme.primary.withAlpha(30),
            child: Text(
              donor.bloodGroup,
              style: const TextStyle(
                color: AppTheme.primary,
                fontWeight: FontWeight.w800,
                fontSize: 14,
              ),
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
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: isDark ? Colors.white : Colors.black87,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (donor.verified)
                      const Padding(
                        padding: EdgeInsets.only(left: 4),
                        child: Icon(Icons.verified, size: 15, color: AppTheme.success),
                      ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  '📍 ${donor.city} · ${donor.availability ? "🟢 Available" : "⚪ Busy"}',
                  style: TextStyle(
                    fontSize: 12,
                    color: isDark ? const Color(0xFF9E9E9E) : Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => DonorDetailScreen(donor: donor)),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
              textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
            ),
            child: const Text('Contact'),
          ),
          const SizedBox(width: 4),
          IconButton(
            icon: const Icon(Icons.close, size: 18),
            onPressed: () => setState(() => _highlightedDonor = null),
            color: isDark ? Colors.white54 : Colors.black54,
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
          ),
        ],
      ),
    );
  }

  Widget _mapControlButton({required IconData icon, required VoidCallback onTap}) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Material(
      color: isDark ? const Color(0xFF1A1A2E) : Colors.white,
      borderRadius: BorderRadius.circular(8),
      elevation: 3,
      child: InkWell(
        borderRadius: BorderRadius.circular(8),
        onTap: onTap,
        child: Container(
          width: 34,
          height: 34,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: isDark ? const Color(0xFF2A2A3E) : Colors.grey.shade300),
          ),
          child: Icon(icon, size: 18, color: isDark ? Colors.white : Colors.black87),
        ),
      ),
    );
  }

  Widget _legendItem(Color color, String label, bool isDark) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: color,
            border: Border.all(color: Colors.white, width: 1.5),
          ),
        ),
        const SizedBox(width: 6),
        Text(
          label,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: isDark ? const Color(0xFF9E9E9E) : Colors.grey.shade700,
          ),
        ),
      ],
    );
  }

  Offset _latLngToScreen(double lat, double lng, double width, double height) {
    // Normalization across India bounds with padding
    final normX = (lng - minLng) / (maxLng - minLng);
    final normY = 1.0 - ((lat - minLat) / (maxLat - minLat));

    final centerX = width / 2;
    final centerY = height / 2;

    final rawX = normX * width * 0.85 + width * 0.075;
    final rawY = normY * height * 0.85 + height * 0.075;

    final transformedX = (rawX - centerX) * _zoomLevel + centerX + _panOffset.dx;
    final transformedY = (rawY - centerY) * _zoomLevel + centerY + _panOffset.dy;

    return Offset(transformedX, transformedY);
  }
}

class _TrianglePointerPainter extends CustomPainter {
  final Color color;
  _TrianglePointerPainter({required this.color});

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

class _MapGridPainter extends CustomPainter {
  final bool isDark;
  final double zoom;
  final Offset offset;

  _MapGridPainter({required this.isDark, required this.zoom, required this.offset});

  @override
  void paint(Canvas canvas, Size size) {
    final gridPaint = Paint()
      ..color = isDark ? const Color(0xFF1A1A2E).withAlpha(80) : Colors.grey.shade300.withAlpha(120)
      ..strokeWidth = 1.0;

    // Background India outline styling
    final landPaint = Paint()
      ..color = isDark ? const Color(0xFF141829) : Colors.white
      ..style = PaintingStyle.fill;

    // Draw stylized India territory polygon
    final indiaPath = Path()
      ..moveTo(size.width * 0.35, size.height * 0.12) // Kashmir
      ..lineTo(size.width * 0.48, size.height * 0.15) // Punjab/Himachal
      ..lineTo(size.width * 0.72, size.height * 0.28) // Northeast
      ..lineTo(size.width * 0.85, size.height * 0.32) // Assam
      ..lineTo(size.width * 0.75, size.height * 0.45) // Bengal
      ..lineTo(size.width * 0.65, size.height * 0.65) // Andhra/Odisha
      ..lineTo(size.width * 0.50, size.height * 0.90) // Tamil Nadu / Kanyakumari
      ..lineTo(size.width * 0.38, size.height * 0.75) // Kerala / Karnataka
      ..lineTo(size.width * 0.30, size.height * 0.55) // Maharashtra / Goa
      ..lineTo(size.width * 0.20, size.height * 0.42) // Gujarat
      ..lineTo(size.width * 0.25, size.height * 0.28) // Rajasthan
      ..close();

    canvas.save();
    final center = Offset(size.width / 2, size.height / 2);
    canvas.translate(center.dx + offset.dx, center.dy + offset.dy);
    canvas.scale(zoom);
    canvas.translate(-center.dx, -center.dy);

    canvas.drawPath(indiaPath, landPaint);

    // Grid lines
    for (double x = 0; x < size.width; x += 40) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }
    for (double y = 0; y < size.height; y += 40) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _MapGridPainter oldDelegate) =>
      oldDelegate.zoom != zoom || oldDelegate.offset != offset || oldDelegate.isDark != isDark;
}
