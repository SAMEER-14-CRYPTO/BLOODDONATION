import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../utils/theme.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  int _activeTab = 0; // 0 = Login, 1 = Forgot Password
  final _emailC = TextEditingController(text: 'rahul@demo.com');
  final _passC = TextEditingController(text: 'demo123');
  final _forgotEmailC = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _emailC.dispose();
    _passC.dispose();
    _forgotEmailC.dispose();
    super.dispose();
  }

  void _handleLogin() async {
    if (_formKey.currentState!.validate()) {
      final auth = Provider.of<AuthProvider>(context, listen: false);
      final success = await auth.login(_emailC.text.trim(), _passC.text.trim());
      if (success && mounted) {
        Navigator.pushReplacementNamed(context, auth.isAdmin ? '/admin' : '/home');
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(auth.errorMessage ?? 'Invalid email or password.'),
            backgroundColor: const Color(0xFFE53935),
          ),
        );
      }
    }
  }

  void _loginAsDemoDonor() async {
    setState(() {
      _emailC.text = 'rahul@demo.com';
      _passC.text = 'demo123';
    });
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.login('rahul@demo.com', 'demo123');
    if (success && mounted) {
      Navigator.pushReplacementNamed(context, '/home');
    }
  }

  void _loginAsDemoAdmin() async {
    setState(() {
      _emailC.text = 'admin@lifelink.com';
      _passC.text = 'admin123';
    });
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.login('admin@lifelink.com', 'admin123');
    if (success && mounted) {
      Navigator.pushReplacementNamed(context, '/admin');
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF0F0F1A),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: Container(
              constraints: const BoxConstraints(maxWidth: 440),
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 36),
              decoration: BoxDecoration(
                color: const Color(0xFF1A1A2E),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: const Color(0xFF2A2A3E), width: 1.2),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x66000000),
                    blurRadius: 35,
                    offset: Offset(0, 15),
                  ),
                ],
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Top Glowing 3D Droplet Icon
                    Center(
                      child: Container(
                        width: 52,
                        height: 52,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            center: Alignment(-0.2, -0.3),
                            radius: 0.8,
                            colors: [
                              Color(0xFFFF4081),
                              Color(0xFFE53935),
                              Color(0xFFC2185B),
                            ],
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Color(0x66E53935),
                              blurRadius: 18,
                              offset: Offset(0, 4),
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Text(
                            '🩸',
                            style: TextStyle(fontSize: 26),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),

                    // Welcome Back Heading
                    const Text(
                      'Welcome Back',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 6),

                    // Subtitle
                    const Text(
                      'Login to your LifeLink account',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: Color(0xFF9E9E9E),
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                    const SizedBox(height: 28),

                    // Login / Forgot Password Pill Switcher (Matching Image 1)
                    Container(
                      height: 50,
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F0F1A),
                        borderRadius: BorderRadius.circular(50),
                        border: Border.all(color: const Color(0xFF2A2A3E)),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () => setState(() => _activeTab = 0),
                              child: Container(
                                decoration: BoxDecoration(
                                  color: _activeTab == 0 ? const Color(0xFFE53935) : Colors.transparent,
                                  borderRadius: BorderRadius.circular(50),
                                  boxShadow: _activeTab == 0
                                      ? const [
                                          BoxShadow(
                                            color: Color(0x66E53935),
                                            blurRadius: 12,
                                            offset: Offset(0, 3),
                                          ),
                                        ]
                                      : null,
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  'Login',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    color: _activeTab == 0 ? Colors.white : const Color(0xFF9E9E9E),
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Expanded(
                            child: GestureDetector(
                              onTap: () => setState(() => _activeTab = 1),
                              child: Container(
                                decoration: BoxDecoration(
                                  color: _activeTab == 1 ? const Color(0xFFE53935) : Colors.transparent,
                                  borderRadius: BorderRadius.circular(50),
                                  boxShadow: _activeTab == 1
                                      ? const [
                                          BoxShadow(
                                            color: Color(0x66E53935),
                                            blurRadius: 12,
                                            offset: Offset(0, 3),
                                          ),
                                        ]
                                      : null,
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  'Forgot Password',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    color: _activeTab == 1 ? Colors.white : const Color(0xFF9E9E9E),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    if (_activeTab == 0) ...[
                      // Email Address Label & Input
                      const Text(
                        'Email Address',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _emailC,
                        keyboardType: TextInputType.emailAddress,
                        style: const TextStyle(color: Colors.white, fontSize: 14),
                        decoration: InputDecoration(
                          hintText: 'you@email.com',
                          hintStyle: const TextStyle(color: Color(0xFF494C63), fontSize: 14),
                          filled: true,
                          fillColor: const Color(0xFF0F0F1A),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Color(0xFF2A2A3E)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Color(0xFF2A2A3E)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Color(0xFFE53935), width: 1.5),
                          ),
                        ),
                        validator: (v) => v == null || v.trim().isEmpty ? 'Please enter email' : null,
                      ),
                      const SizedBox(height: 18),

                      // Password Label & Input
                      const Text(
                        'Password',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _passC,
                        obscureText: true,
                        style: const TextStyle(color: Colors.white, fontSize: 14),
                        decoration: InputDecoration(
                          hintText: 'Enter your password',
                          hintStyle: const TextStyle(color: Color(0xFF494C63), fontSize: 14),
                          filled: true,
                          fillColor: const Color(0xFF0F0F1A),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Color(0xFF2A2A3E)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Color(0xFF2A2A3E)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Color(0xFFE53935), width: 1.5),
                          ),
                        ),
                        validator: (v) => v == null || v.trim().isEmpty ? 'Please enter password' : null,
                      ),
                      const SizedBox(height: 24),

                      // Primary Red Login Button (Matching Image 1 & 2)
                      Container(
                        height: 52,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(50),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x66E53935),
                              blurRadius: 16,
                              offset: Offset(0, 6),
                            ),
                          ],
                        ),
                        child: ElevatedButton(
                          onPressed: auth.isLoading ? null : _handleLogin,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFE53935),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(50),
                            ),
                            elevation: 0,
                          ),
                          child: auth.isLoading
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                                )
                              : const Text(
                                  'Login',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                    letterSpacing: 0.2,
                                  ),
                                ),
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Register Link
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            "Don't have an account? ",
                            style: TextStyle(color: Color(0xFF9E9E9E), fontSize: 13),
                          ),
                          GestureDetector(
                            onTap: () => Navigator.pushNamed(context, '/signup'),
                            child: const Text(
                              'Register here',
                              style: TextStyle(
                                color: Color(0xFFE53935),
                                fontWeight: FontWeight.w700,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 28),

                      // Divider & DEMO LOGIN Title (Matching Image 2)
                      Container(
                        height: 1,
                        color: const Color(0xFF2A2A3E),
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        'DEMO LOGIN',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.2,
                          color: Color(0xFF535670),
                        ),
                      ),
                      const SizedBox(height: 14),

                      // Demo Login Buttons: Donor Login & Admin Login (Matching Image 2)
                      Row(
                        children: [
                          Expanded(
                            child: InkWell(
                              onTap: _loginAsDemoDonor,
                              borderRadius: BorderRadius.circular(50),
                              child: Container(
                                height: 46,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF0F0F1A),
                                  borderRadius: BorderRadius.circular(50),
                                  border: Border.all(color: const Color(0xFFE53935), width: 1.3),
                                ),
                                alignment: Alignment.center,
                                child: const Text(
                                  'Donor Login',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: InkWell(
                              onTap: _loginAsDemoAdmin,
                              borderRadius: BorderRadius.circular(50),
                              child: Container(
                                height: 46,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF0F0F1A),
                                  borderRadius: BorderRadius.circular(50),
                                  border: Border.all(color: const Color(0xFFE53935), width: 1.3),
                                ),
                                alignment: Alignment.center,
                                child: const Text(
                                  'Admin Login',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w700,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ] else ...[
                      // Forgot Password View
                      const Text(
                        'Email Address',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white),
                      ),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _forgotEmailC,
                        style: const TextStyle(color: Colors.white, fontSize: 14),
                        decoration: InputDecoration(
                          hintText: 'Enter your registered email',
                          hintStyle: const TextStyle(color: Color(0xFF494C63), fontSize: 14),
                          filled: true,
                          fillColor: const Color(0xFF0F0F1A),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Color(0xFF2A2A3E)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Color(0xFFE53935), width: 1.5),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Password reset instructions sent to your email.'),
                              backgroundColor: Color(0xFF43A047),
                            ),
                          );
                          setState(() => _activeTab = 0);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFE53935),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
                        ),
                        child: const Text('Send Reset Link', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                      ),
                      const SizedBox(height: 16),
                      Center(
                        child: TextButton(
                          onPressed: () => setState(() => _activeTab = 0),
                          child: const Text('Back to Login', style: TextStyle(color: Color(0xFF9E9E9E))),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
