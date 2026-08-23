import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import '../../providers/theme_provider.dart';
import '../../providers/auth_provider.dart';
import '../../models/models.dart';
import '../../services/demo_data.dart';
import '../../services/firebase_service.dart';

/// Become a Donor Screen
/// Collects donor registration data and saves to Firebase / demo store.
class BecomeDonorScreen extends StatefulWidget {
  const BecomeDonorScreen({super.key});
  @override
  State<BecomeDonorScreen> createState() => _BecomeDonorScreenState();
}

class _BecomeDonorScreenState extends State<BecomeDonorScreen>
    with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _nameC = TextEditingController();
  final _emailC = TextEditingController();
  final _phoneC = TextEditingController();
  final _dobC = TextEditingController();
  final _addressC = TextEditingController();
  final _cityC = TextEditingController();

  String _bloodGroup = 'O+';
  String _gender = 'Male';
  bool _isLoading = false;
  bool _success = false;

  late final AnimationController _successCtrl;
  late final Animation<double> _scaleAnim;
  late final AnimationController _fadeCtrl;
  late final Animation<double> _fadeAnim;

  final _bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  final _genders = ['Male', 'Female', 'Other'];

  @override
  void initState() {
    super.initState();
    _successCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 600));
    _scaleAnim = CurvedAnimation(parent: _successCtrl, curve: Curves.elasticOut);
    _fadeCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 400));
    _fadeAnim = CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeIn);
    _fadeCtrl.forward();

    // Pre-fill from logged-in user
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final user = auth.user;
      if (user != null) {
        _nameC.text = user.fullName;
        _emailC.text = user.email;
        _phoneC.text = user.phone;
        _cityC.text = user.city;
        setState(() {
          _bloodGroup = user.bloodGroup;
          _gender = user.gender;
        });
      }
    });
  }

  @override
  void dispose() {
    _successCtrl.dispose();
    _fadeCtrl.dispose();
    _nameC.dispose();
    _emailC.dispose();
    _phoneC.dispose();
    _dobC.dispose();
    _addressC.dispose();
    _cityC.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    await Future.delayed(const Duration(milliseconds: 1200)); // Simulate network

    final donor = UserModel(
      uid: const Uuid().v4(),
      fullName: _nameC.text.trim(),
      email: _emailC.text.trim(),
      phone: _phoneC.text.trim(),
      bloodGroup: _bloodGroup,
      gender: _gender,
      dateOfBirth: _dobC.text.trim(),
      city: _cityC.text.trim(),
      address: _addressC.text.trim(),
      donorStatus: 'Active',
      verified: false,
      createdAt: DateTime.now(),
    );

    // Save to Firebase (local store)
    await FirebaseService.saveDonorRegistration(donor);

    // Also add to in-memory demo list
    DemoData.users.add(donor);

    if (mounted) {
      setState(() {
        _isLoading = false;
        _success = true;
      });
      _successCtrl.forward();
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Provider.of<ThemeProvider>(context);
    final isDark = theme.isDarkMode;
    final bgColor = isDark ? const Color(0xFF0F0F1A) : const Color(0xFFFAFAFA);
    final cardColor = isDark ? const Color(0xFF1A1A2E) : Colors.white;
    final borderColor = isDark ? const Color(0xFF2A2A3E) : const Color(0xFFE0E0E0);
    final textColor = isDark ? const Color(0xFFE0E0E0) : const Color(0xFF212121);
    final subTextColor = isDark ? const Color(0xFF9E9E9E) : const Color(0xFF757575);
    final inputBg = isDark ? const Color(0xFF0F0F1A) : const Color(0xFFF5F5F5);

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        leading: _AnimatedBackButton(isDark: isDark, textColor: textColor),
        title: Row(
          children: [
            Container(
              width: 30, height: 30,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(colors: [Color(0xFFFF4081), Color(0xFFE53935)]),
              ),
              child: const Center(child: Text('🩸', style: TextStyle(fontSize: 16))),
            ),
            const SizedBox(width: 8),
            Text('Become a Donor', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textColor)),
          ],
        ),
      ),
      body: _success ? _buildSuccessView(isDark, cardColor, textColor) : _buildForm(isDark, bgColor, cardColor, borderColor, textColor, subTextColor, inputBg),
    );
  }

  // ── SUCCESS STATE ──
  Widget _buildSuccessView(bool isDark, Color cardColor, Color textColor) {
    return Center(
      child: ScaleTransition(
        scale: _scaleAnim,
        child: Container(
          margin: const EdgeInsets.all(32),
          padding: const EdgeInsets.all(40),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(28),
            border: Border.all(color: isDark ? const Color(0xFF2A2A3E) : const Color(0xFFE0E0E0)),
            boxShadow: [BoxShadow(color: const Color(0xFFE53935).withAlpha(40), blurRadius: 40, offset: const Offset(0, 12))],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 80, height: 80,
                decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFE8F8EE)),
                child: const Center(child: Icon(Icons.check_rounded, size: 48, color: Color(0xFF43A047))),
              ),
              const SizedBox(height: 24),
              Text('Registration Successful!', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: textColor)),
              const SizedBox(height: 12),
              Text(
                'Thank you for registering as a blood donor.\nYour profile has been saved and you will be matched with those in need.',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 14, color: Color(0xFF757575), height: 1.6),
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(12),
                margin: const EdgeInsets.only(top: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFEAEA),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('🩸', style: TextStyle(fontSize: 20)),
                    const SizedBox(width: 8),
                    Text('Blood Group: $_bloodGroup', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFFE53935))),
                  ],
                ),
              ),
              const SizedBox(height: 28),
              _PressableButton(
                onTap: () => Navigator.pop(context),
                color: const Color(0xFFE53935),
                child: const Text('Back to Home', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 15)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── FORM VIEW ──
  Widget _buildForm(bool isDark, Color bgColor, Color cardColor, Color borderColor, Color textColor, Color subTextColor, Color inputBg) {
    return FadeTransition(
      opacity: _fadeAnim,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFE53935), Color(0xFFC62828)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('🩸 Register as Blood Donor', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white)),
                    SizedBox(height: 6),
                    Text('Your registration can save up to 3 lives.\nAll fields are securely stored.', style: TextStyle(color: Colors.white70, height: 1.5, fontSize: 13)),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              _sectionLabel('Personal Information', textColor),
              const SizedBox(height: 12),

              _buildInput(label: 'Full Name', controller: _nameC, icon: Icons.person_outline, hint: 'Your full name', isDark: isDark, textColor: textColor, inputBg: inputBg, borderColor: borderColor, validator: (v) => v!.isEmpty ? 'Required' : null),
              const SizedBox(height: 14),
              _buildInput(label: 'Email Address', controller: _emailC, icon: Icons.email_outlined, hint: 'your@email.com', isDark: isDark, textColor: textColor, inputBg: inputBg, borderColor: borderColor, keyboardType: TextInputType.emailAddress, validator: (v) => (v != null && v.contains('@')) ? null : 'Valid email required'),
              const SizedBox(height: 14),
              _buildInput(label: 'Phone Number', controller: _phoneC, icon: Icons.phone_outlined, hint: '+91-9876543210', isDark: isDark, textColor: textColor, inputBg: inputBg, borderColor: borderColor, keyboardType: TextInputType.phone, validator: (v) => v!.isEmpty ? 'Required' : null),
              const SizedBox(height: 14),
              _buildInput(label: 'Date of Birth', controller: _dobC, icon: Icons.cake_outlined, hint: 'YYYY-MM-DD', isDark: isDark, textColor: textColor, inputBg: inputBg, borderColor: borderColor, validator: (v) => v!.isEmpty ? 'Required' : null),
              const SizedBox(height: 24),

              _sectionLabel('Location', textColor),
              const SizedBox(height: 12),
              _buildInput(label: 'City', controller: _cityC, icon: Icons.location_city_outlined, hint: 'e.g. Chennai', isDark: isDark, textColor: textColor, inputBg: inputBg, borderColor: borderColor, validator: (v) => v!.isEmpty ? 'Required' : null),
              const SizedBox(height: 14),
              _buildInput(label: 'Address', controller: _addressC, icon: Icons.home_outlined, hint: 'Your full address', isDark: isDark, textColor: textColor, inputBg: inputBg, borderColor: borderColor, maxLines: 2),
              const SizedBox(height: 24),

              _sectionLabel('Medical Information', textColor),
              const SizedBox(height: 12),

              // Blood Group Grid
              Text('Blood Group', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textColor)),
              const SizedBox(height: 10),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: _bloodGroups.map((bg) {
                  final selected = bg == _bloodGroup;
                  return _AnimatedBloodChip(
                    label: bg,
                    selected: selected,
                    isDark: isDark,
                    cardColor: cardColor,
                    borderColor: borderColor,
                    onTap: () => setState(() => _bloodGroup = bg),
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),

              // Gender
              Text('Gender', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: textColor)),
              const SizedBox(height: 10),
              Row(
                children: _genders.map((g) {
                  final selected = g == _gender;
                  return Padding(
                    padding: const EdgeInsets.only(right: 10),
                    child: GestureDetector(
                      onTap: () => setState(() => _gender = g),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                        decoration: BoxDecoration(
                          color: selected ? const Color(0xFFE53935) : (isDark ? const Color(0xFF1A1A2E) : Colors.white),
                          borderRadius: BorderRadius.circular(50),
                          border: Border.all(color: selected ? const Color(0xFFE53935) : borderColor),
                        ),
                        child: Text(g, style: TextStyle(fontWeight: FontWeight.w700, color: selected ? Colors.white : textColor, fontSize: 13)),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 32),

              // Submit button
              _PressableButton(
                onTap: _isLoading ? null : _submit,
                color: const Color(0xFFE53935),
                child: _isLoading
                    ? const SizedBox(
                        width: 22, height: 22,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                      )
                    : const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.volunteer_activism, color: Colors.white, size: 20),
                          SizedBox(width: 10),
                          Text('Register as Donor', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16)),
                        ],
                      ),
              ),
              const SizedBox(height: 16),
              Center(
                child: Text(
                  '🔒 Your data is securely stored and never shared without consent.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 11, color: subTextColor),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sectionLabel(String label, Color textColor) {
    return Row(
      children: [
        Container(width: 4, height: 18, decoration: BoxDecoration(color: const Color(0xFFE53935), borderRadius: BorderRadius.circular(2))),
        const SizedBox(width: 8),
        Text(label, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: textColor)),
      ],
    );
  }

  Widget _buildInput({
    required String label,
    required TextEditingController controller,
    required IconData icon,
    required String hint,
    required bool isDark,
    required Color textColor,
    required Color inputBg,
    required Color borderColor,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: textColor)),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          maxLines: maxLines,
          validator: validator,
          style: TextStyle(color: textColor, fontSize: 14),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(color: isDark ? const Color(0xFF4A4A6A) : const Color(0xFFBBBBBB), fontSize: 13),
            prefixIcon: Icon(icon, size: 18, color: isDark ? const Color(0xFF9E9E9E) : const Color(0xFF757575)),
            filled: true,
            fillColor: inputBg,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: borderColor)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: borderColor)),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE53935), width: 2)),
            errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.red)),
          ),
        ),
      ],
    );
  }
}

// ── Animated Blood Group Chip ──
class _AnimatedBloodChip extends StatefulWidget {
  final String label;
  final bool selected;
  final bool isDark;
  final Color cardColor;
  final Color borderColor;
  final VoidCallback onTap;
  const _AnimatedBloodChip({required this.label, required this.selected, required this.isDark, required this.cardColor, required this.borderColor, required this.onTap});
  @override
  State<_AnimatedBloodChip> createState() => _AnimatedBloodChipState();
}

class _AnimatedBloodChipState extends State<_AnimatedBloodChip> with SingleTickerProviderStateMixin {
  late AnimationController _c;
  @override
  void initState() { super.initState(); _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 150), lowerBound: 0.95, upperBound: 1.0, value: 1.0); }
  @override
  void dispose() { _c.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _c.reverse(),
      onTapUp: (_) { _c.forward(); widget.onTap(); },
      onTapCancel: () => _c.forward(),
      child: ScaleTransition(
        scale: _c,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          width: 68, height: 68,
          decoration: BoxDecoration(
            color: widget.selected ? const Color(0xFFE53935) : widget.cardColor,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: widget.selected ? const Color(0xFFE53935) : widget.borderColor, width: widget.selected ? 2 : 1),
            boxShadow: widget.selected ? [const BoxShadow(color: Color(0x40E53935), blurRadius: 12, offset: Offset(0, 4))] : [],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(widget.label, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: widget.selected ? Colors.white : const Color(0xFFE53935))),
              Text('Type', style: TextStyle(fontSize: 9, color: widget.selected ? Colors.white70 : const Color(0xFF9E9E9E))),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Pressable Button with scale animation ──
class _PressableButton extends StatefulWidget {
  final VoidCallback? onTap;
  final Color color;
  final Widget child;
  const _PressableButton({required this.onTap, required this.color, required this.child});
  @override
  State<_PressableButton> createState() => _PressableButtonState();
}

class _PressableButtonState extends State<_PressableButton> with SingleTickerProviderStateMixin {
  late AnimationController _c;
  @override
  void initState() { super.initState(); _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 120), lowerBound: 0.96, upperBound: 1.0, value: 1.0); }
  @override
  void dispose() { _c.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) { if (widget.onTap != null) _c.reverse(); },
      onTapUp: (_) { _c.forward(); widget.onTap?.call(); },
      onTapCancel: () => _c.forward(),
      child: ScaleTransition(
        scale: _c,
        child: Container(
          width: double.infinity,
          height: 54,
          decoration: BoxDecoration(
            color: widget.onTap == null ? widget.color.withAlpha(150) : widget.color,
            borderRadius: BorderRadius.circular(50),
            boxShadow: widget.onTap != null ? [BoxShadow(color: widget.color.withAlpha(80), blurRadius: 16, offset: const Offset(0, 6))] : [],
          ),
          child: Center(child: widget.child),
        ),
      ),
    );
  }
}

// ── Animated back button ──
class _AnimatedBackButton extends StatefulWidget {
  final bool isDark;
  final Color textColor;
  const _AnimatedBackButton({required this.isDark, required this.textColor});
  @override
  State<_AnimatedBackButton> createState() => _AnimatedBackButtonState();
}

class _AnimatedBackButtonState extends State<_AnimatedBackButton> with SingleTickerProviderStateMixin {
  late AnimationController _c;
  @override
  void initState() { super.initState(); _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 120), lowerBound: 0.85, upperBound: 1.0, value: 1.0); }
  @override
  void dispose() { _c.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _c.reverse(),
      onTapUp: (_) { _c.forward(); Navigator.maybePop(context); },
      onTapCancel: () => _c.forward(),
      child: ScaleTransition(
        scale: _c,
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Icon(Icons.arrow_back_ios_new_rounded, color: widget.textColor, size: 20),
        ),
      ),
    );
  }
}
