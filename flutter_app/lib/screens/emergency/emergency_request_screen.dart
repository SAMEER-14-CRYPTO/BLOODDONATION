import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/theme_provider.dart';
import '../../utils/theme.dart';
import '../../services/demo_data.dart';
import '../../services/firebase_service.dart';
import '../../models/models.dart';
import '../widgets/real_osm_map_widget.dart';
import '../widgets/smooth_button.dart';

class EmergencyRequestScreen extends StatefulWidget {
  const EmergencyRequestScreen({super.key});
  @override
  State<EmergencyRequestScreen> createState() => _EmergencyRequestScreenState();
}

class _EmergencyRequestScreenState extends State<EmergencyRequestScreen> with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _yourNameC = TextEditingController(text: 'Rahul Sharma');
  final _patientNameC = TextEditingController(text: 'Rajesh Malhotra');
  final _hospitalNameC = TextEditingController(text: 'Apollo Hospitals, Greams Road, Chennai');
  final _cityC = TextEditingController(text: 'Chennai');
  final _phoneC = TextEditingController(text: '+91-9876543210');

  String _selectedBloodGroup = 'O+';
  String _urgencyLevel = 'critical';
  bool _isSubmitting = false;
  bool _isSubmitted = false;

  double _requestLat = 13.0827;
  double _requestLng = 80.2707;

  late AnimationController _animCtrl;
  late Animation<double> _scaleAnim;

  final Map<String, List<double>> _cityCoords = {
    'Rly Kodur': [14.0042, 79.3512],
    'Tirupati': [13.6288, 79.4192],
    'Vijayawada': [16.5062, 80.6480],
    'Visakhapatnam': [17.6868, 83.2185],
    'Guntur': [16.3067, 80.4365],
    'Nellore': [14.4426, 79.9865],
    'Kurnool': [15.8281, 78.0373],
    'Kadapa': [14.4673, 78.8242],
    'Chennai': [13.0827, 80.2707],
    'Coimbatore': [11.0168, 76.9558],
    'Madurai': [9.9252, 78.1198],
    'Trichy': [10.7905, 78.7047],
    'Salem': [11.6643, 78.1460],
    'Vellore': [12.9165, 79.1325],
    'Puducherry': [11.9416, 79.8083],
  };

  final List<String> _hospitalSuggestions = [
    'Apollo Hospitals, Greams Road, Chennai',
    'JIPMER Hospital, Puducherry',
    'Christian Medical College (CMC), Vellore',
    'Madurai Meenakshi Mission Hospital, Madurai',
    'Rajiv Gandhi Govt General Hospital, Chennai',
    'PSG Hospitals, Coimbatore',
    'SVIMS Hospital, Tirupati',
    'NRI General Hospital, Guntur',
    'Apollo Hospitals, Visakhapatnam',
    'Andhra Hospitals, Vijayawada',
    'KIMS Hospital, Nellore',
    'King George Hospital (KGH), Visakhapatnam',
    'Government General Hospital, Kurnool',
    'RIMS Hospital, Kadapa',
  ];

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 500));
    _scaleAnim = CurvedAnimation(parent: _animCtrl, curve: Curves.elasticOut);
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    _yourNameC.dispose();
    _patientNameC.dispose();
    _hospitalNameC.dispose();
    _cityC.dispose();
    _phoneC.dispose();
    super.dispose();
  }

  void _onCityChanged(String cityName) {
    if (_cityCoordinates.containsKey(cityName)) {
      setState(() {
        _cityC.text = cityName;
        _requestLat = _cityCoordinates[cityName]![0];
        _requestLng = _cityCoordinates[cityName]![1];
      });
    }
  }

  Future<void> _submitRequest() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);
    await Future.delayed(const Duration(milliseconds: 900));

    final newReq = EmergencyRequestModel(
      requestId: 'req_${DateTime.now().millisecondsSinceEpoch}',
      requesterId: 'user_current',
      requesterName: _yourNameC.text.trim(),
      patientName: _patientNameC.text.trim(),
      bloodGroup: _selectedBloodGroup,
      hospitalName: _hospitalNameC.text.trim(),
      city: _cityC.text.trim(),
      emergencyLevel: _urgencyLevel.toUpperCase(),
      status: 'active',
      responseCount: 1,
      createdAt: DateTime.now(),
    );

    // Save to Firebase (local store)
    await FirebaseService.saveEmergencyRequest(newReq);

    // Also add to DemoData
    DemoData.requests.insert(0, newReq);

    if (mounted) {
      setState(() {
        _isSubmitting = false;
        _isSubmitted = true;
      });
      _animCtrl.forward();

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('🚨 Emergency alert broadcasted at ${_cityC.text}! Matching donors notified & saved to Firebase.'),
          backgroundColor: const Color(0xFFE53935),
          duration: const Duration(seconds: 4),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Provider.of<ThemeProvider>(context);
    final isDark = theme.isDarkMode;
    final isDesktop = MediaQuery.of(context).size.width > 850;

    final bgColor = isDark ? const Color(0xFF0F0F1A) : const Color(0xFFFAFAFA);
    final cardColor = isDark ? const Color(0xFF1A1A2E) : Colors.white;
    final borderColor = isDark ? const Color(0xFF2A2A3E) : Colors.grey.shade200;
    final textColor = isDark ? Colors.white : const Color(0xFF1E2022);
    final subTextColor = isDark ? const Color(0xFF9E9E9E) : const Color(0xFF666666);
    final inputBg = isDark ? const Color(0xFF0F0F1A) : const Color(0xFFFAFAFA);

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: RichText(
          text: TextSpan(
            text: 'Emergency Blood ',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textColor),
            children: const [
              TextSpan(text: 'Request', style: TextStyle(color: Color(0xFFE53935))),
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
            // Title: Emergency Blood Request
            RichText(
              textAlign: TextAlign.center,
              text: TextSpan(
                text: 'Emergency Blood ',
                style: TextStyle(
                  fontSize: 34,
                  fontWeight: FontWeight.w900,
                  color: textColor,
                  letterSpacing: -0.5,
                ),
                children: const [
                  TextSpan(
                    text: 'Request',
                    style: TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w900),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 4),

            // Breadcrumbs
            Text(
              'Home  /  Emergency Request & Live Broadcast',
              style: TextStyle(fontSize: 13, color: subTextColor, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 28),

            // Success Confirmation Banner if submitted
            if (_isSubmitted)
              ScaleTransition(
                scale: _scaleAnim,
                child: Container(
                  margin: const EdgeInsets.only(bottom: 24),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E2D24) : const Color(0xFFE8F8EE),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFF43A047).withAlpha(120)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 44, height: 44,
                        decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFF43A047)),
                        child: const Icon(Icons.check, color: Colors.white, size: 26),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '🚨 Emergency Alert Active & Saved to Firebase!',
                              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: isDark ? Colors.white : const Color(0xFF1B5E20)),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Broadcast sent to all ${_selectedBloodGroup} donors in ${_cityC.text}. You can track responses in real time below.',
                              style: TextStyle(fontSize: 12, color: isDark ? const Color(0xFFA5D6A7) : const Color(0xFF2E7D32)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

            // Main Content: 2-Column Responsive Layout
            isDesktop
                ? Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(flex: 5, child: _buildFormCard(cardColor, borderColor, textColor, subTextColor, inputBg, isDark)),
                      const SizedBox(width: 28),
                      Expanded(flex: 5, child: _buildRightSideContent(cardColor, borderColor, textColor, subTextColor, isDark)),
                    ],
                  )
                : Column(
                    children: [
                      _buildFormCard(cardColor, borderColor, textColor, subTextColor, inputBg, isDark),
                      const SizedBox(height: 24),
                      _buildRightSideContent(cardColor, borderColor, textColor, subTextColor, isDark),
                    ],
                  ),
          ],
        ),
      ),
    );
  }

  // ── LEFT SIDE: CREATE EMERGENCY REQUEST FORM ──
  Widget _buildFormCard(Color cardColor, Color borderColor, Color textColor, Color subTextColor, Color inputBg, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(color: Colors.black.withAlpha(isDark ? 30 : 6), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Text('🚑', style: TextStyle(fontSize: 22)),
                const SizedBox(width: 8),
                Text(
                  'Create Emergency Request',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textColor),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Your Name
            _label('Your Name *', textColor),
            const SizedBox(height: 6),
            _inputField(_yourNameC, 'Your full name', inputBg, borderColor, isDark, subTextColor),
            const SizedBox(height: 16),

            // Patient Name
            _label('Patient Name *', textColor),
            const SizedBox(height: 6),
            _inputField(_patientNameC, "Patient's full name", inputBg, borderColor, isDark, subTextColor),
            const SizedBox(height: 16),

            // Blood Group & Urgency
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _label('Blood Group Needed *', textColor),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        decoration: BoxDecoration(
                          color: inputBg,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: borderColor),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: _selectedBloodGroup,
                            dropdownColor: cardColor,
                            style: TextStyle(color: textColor, fontWeight: FontWeight.w800),
                            items: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) {
                              return DropdownMenuItem(value: g, child: Text(g));
                            }).toList(),
                            onChanged: (val) {
                              if (val != null) setState(() => _selectedBloodGroup = val);
                            },
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _label('Urgency Level *', textColor),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        decoration: BoxDecoration(
                          color: inputBg,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: borderColor),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: _urgencyLevel,
                            dropdownColor: cardColor,
                            style: TextStyle(color: textColor, fontWeight: FontWeight.w700),
                            items: const [
                              DropdownMenuItem(value: 'critical', child: Text('🔴 Critical')),
                              DropdownMenuItem(value: 'urgent', child: Text('🟠 Urgent')),
                              DropdownMenuItem(value: 'normal', child: Text('🟢 Normal')),
                            ],
                            onChanged: (val) {
                              if (val != null) setState(() => _urgencyLevel = val);
                            },
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Hospital Name with suggestions
            _label('Hospital Name & Ward *', textColor),
            const SizedBox(height: 6),
            _inputField(_hospitalNameC, 'e.g. Apollo Hospital, Greams Road, Chennai', inputBg, borderColor, isDark, subTextColor),
            const SizedBox(height: 8),

            // Quick hospital suggestions
            SizedBox(
              height: 28,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: _hospitalSuggestions.map((h) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: SmoothScaleEffect(
                      onTap: () => setState(() => _hospitalNameC.text = h),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: inputBg,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: borderColor),
                        ),
                        child: Text(
                          h.split(',').first,
                          style: TextStyle(fontSize: 10, color: subTextColor, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 16),

            // City Quick Selector Chips
            _label('City / Location (South India & Pan-India) *', textColor),
            const SizedBox(height: 6),
            SizedBox(
              height: 32,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: _cityCoordinates.keys.map((city) {
                  final isSelected = _cityC.text == city;
                  return Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: SmoothScaleEffect(
                      onTap: () => _onCityChanged(city),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFFE53935) : inputBg,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: isSelected ? const Color(0xFFE53935) : borderColor),
                          boxShadow: isSelected ? [const BoxShadow(color: Color(0x33E53935), blurRadius: 6, offset: Offset(0, 2))] : [],
                        ),
                        child: Text(
                          city,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
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

            Row(
              children: [
                Expanded(child: _inputField(_cityC, 'City', inputBg, borderColor, isDark, subTextColor)),
                const SizedBox(width: 12),
                Expanded(child: _inputField(_phoneC, 'Contact Phone', inputBg, borderColor, isDark, subTextColor, isPhone: true)),
              ],
            ),
            const SizedBox(height: 24),

            // Submit Button with Smooth Animation
            SmoothAnimatedButton(
              onPressed: _isSubmitting ? null : _submitRequest,
              backgroundColor: const Color(0xFFE53935),
              foregroundColor: Colors.white,
              width: double.infinity,
              height: 52,
              borderRadius: 50,
              child: _isSubmitting
                  ? const SizedBox(
                      width: 22, height: 22,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                    )
                  : const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.send_rounded, size: 18, color: Colors.white),
                        SizedBox(width: 8),
                        Text('Broadcast Emergency Request', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white)),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }

  // ── RIGHT SIDE: HOW IT WORKS + DONORS NEAR LOCATION MAP ──
  Widget _buildRightSideContent(Color cardColor, Color borderColor, Color textColor, Color subTextColor, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // How Emergency Requests Work
        Container(
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1A1A2E) : const Color(0xFFFFF7F8),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: const Color(0xFFFFD1D6)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Text('⚡', style: TextStyle(fontSize: 20)),
                  SizedBox(width: 8),
                  Text(
                    'How Emergency Requests Work',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFFE53935)),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              _stepRow('1.', 'Fill in the request form with patient and hospital details', textColor, subTextColor),
              const SizedBox(height: 10),
              _stepRow('2.', 'All matching donors near Chennai / selected city are instantly notified', textColor, subTextColor),
              const SizedBox(height: 10),
              _stepRow('3.', 'Request is securely stored in Firebase and synced to hospital network', textColor, subTextColor),
              const SizedBox(height: 10),
              _stepRow('4.', 'Track donor responses in real-time on live map and dashboard', textColor, subTextColor),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Donors Near Request Location Map
        Row(
          children: [
            const Text('📍', style: TextStyle(fontSize: 18)),
            const SizedBox(width: 6),
            Text(
              'Donors Near $_cityC.text Location',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: textColor),
            ),
          ],
        ),
        const SizedBox(height: 12),

        RealOsmMapWidget(
          key: ValueKey('em_map_${_requestLat}_${_requestLng}_$_selectedBloodGroup'),
          centerLat: _requestLat,
          centerLng: _requestLng,
          initialZoom: 11.0,
          initialBloodGroup: _selectedBloodGroup,
          height: 340,
        ),
      ],
    );
  }

  Widget _stepRow(String num, String text, Color textColor, Color subTextColor) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(num, style: const TextStyle(fontWeight: FontWeight.w900, color: Color(0xFFE53935), fontSize: 13)),
        const SizedBox(width: 8),
        Expanded(
          child: Text(text, style: TextStyle(fontSize: 13, color: textColor, height: 1.4, fontWeight: FontWeight.w500)),
        ),
      ],
    );
  }

  Widget _label(String text, Color textColor) {
    return Text(text, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: textColor));
  }

  Widget _inputField(
    TextEditingController controller,
    String hint,
    Color inputBg,
    Color borderColor,
    bool isDark,
    Color subTextColor, {
    bool isPhone = false,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: isPhone ? TextInputType.phone : TextInputType.text,
      style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontSize: 13),
      validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: subTextColor, fontSize: 13),
        filled: true,
        fillColor: inputBg,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: borderColor)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: borderColor)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE53935), width: 1.5)),
      ),
    );
  }
}
