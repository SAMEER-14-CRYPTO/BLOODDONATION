import 'package:flutter/material.dart';
import '../utils/theme.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});
  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _currentPage = 0;

  final _pages = [
    {'icon': '🔍', 'title': 'Find Donors Nearby', 'desc': 'Locate verified blood donors near you using GPS-powered search and smart matching.'},
    {'icon': '🚨', 'title': 'Emergency Alerts', 'desc': 'Send instant emergency requests to matching donors and get responses in minutes.'},
    {'icon': '❤️', 'title': 'Save Lives Together', 'desc': 'Join thousands of donors and help create a world where no one waits for blood.'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Skip button
            Align(
              alignment: Alignment.topRight,
              child: TextButton(
                onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                child: const Text('Skip', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.w600)),
              ),
            ),
            // Pages
            Expanded(
              child: PageView.builder(
                controller: _controller,
                onPageChanged: (i) => setState(() => _currentPage = i),
                itemCount: _pages.length,
                itemBuilder: (context, index) {
                  final page = _pages[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 40),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 160, height: 160,
                          decoration: BoxDecoration(color: AppTheme.primary.withAlpha(26), borderRadius: BorderRadius.circular(40)),
                          child: Center(child: Text(page['icon']!, style: const TextStyle(fontSize: 70))),
                        ),
                        const SizedBox(height: 40),
                        Text(page['title']!, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800), textAlign: TextAlign.center),
                        const SizedBox(height: 16),
                        Text(page['desc']!, style: TextStyle(fontSize: 16, color: Colors.grey[600], height: 1.6), textAlign: TextAlign.center),
                      ],
                    ),
                  );
                },
              ),
            ),
            // Indicators + Button
            Padding(
              padding: const EdgeInsets.all(32),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(children: List.generate(3, (i) => AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    margin: const EdgeInsets.only(right: 8),
                    width: _currentPage == i ? 32 : 10, height: 10,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(5),
                      color: _currentPage == i ? AppTheme.primary : Colors.grey[300],
                    ),
                  ))),
                  ElevatedButton(
                    onPressed: () {
                      if (_currentPage < 2) {
                        _controller.nextPage(duration: const Duration(milliseconds: 400), curve: Curves.easeInOut);
                      } else {
                        Navigator.pushReplacementNamed(context, '/login');
                      }
                    },
                    style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16)),
                    child: Text(_currentPage < 2 ? 'Next' : 'Get Started'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
