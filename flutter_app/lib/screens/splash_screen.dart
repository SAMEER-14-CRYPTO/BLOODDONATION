import 'package:flutter/material.dart';
import '../utils/theme.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 1500));
    _scaleAnim = Tween<double>(begin: 0.5, end: 1.0).animate(CurvedAnimation(parent: _controller, curve: Curves.elasticOut));
    _fadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(CurvedAnimation(parent: _controller, curve: const Interval(0.3, 1.0)));
    _controller.forward();
    Future.delayed(const Duration(milliseconds: 1600), () {
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/login');
      }
    });
  }

  @override
  void dispose() { _controller.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [AppTheme.primary, AppTheme.primaryDark]),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ScaleTransition(
              scale: _scaleAnim,
              child: Container(
                width: 120, height: 120,
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(30), boxShadow: [BoxShadow(color: Colors.black.withAlpha(51), blurRadius: 30, offset: const Offset(0, 10))]),
                child: const Center(child: Text('🩸', style: TextStyle(fontSize: 60))),
              ),
            ),
            const SizedBox(height: 24),
            FadeTransition(
              opacity: _fadeAnim,
              child: const Column(children: [
                Text('LifeLink', style: TextStyle(fontSize: 36, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: -1)),
                SizedBox(height: 8),
                Text('Smart Blood Donor Finder', style: TextStyle(fontSize: 16, color: Colors.white70, fontWeight: FontWeight.w500)),
              ]),
            ),
          ],
        ),
      ),
    );
  }
}
