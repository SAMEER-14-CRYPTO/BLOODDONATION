import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/auth_provider.dart';
import '../providers/theme_provider.dart';
import '../services/demo_data.dart';
import '../models/models.dart';
import '../core/theme/app_theme.dart';
import 'widgets/real_osm_map_widget.dart';
import 'widgets/smooth_button.dart';
import 'search/search_donor_screen.dart';
import 'emergency/emergency_request_screen.dart';
import 'dashboard/dashboard_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final theme = Provider.of<ThemeProvider>(context);
    final isDark = theme.isDarkMode;
    final user = auth.user;

    final bgColor = isDark ? const Color(0xFF0F0F1A) : const Color(0xFFFAFAFA);
    final navBg = isDark ? const Color(0xFF0F0F1A) : Colors.white;
    final borderCol = isDark ? const Color(0xFF2A2A3E) : const Color(0xFFE0E0E0);

    return Scaffold(
      backgroundColor: bgColor,
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _buildHomeTab(user, isDark, theme),
          const SearchDonorScreen(),
          const EmergencyRequestScreen(),
          const DashboardScreen(),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: navBg,
          border: Border(top: BorderSide(color: borderCol, width: 1)),
          boxShadow: [
            BoxShadow(color: Colors.black.withAlpha(isDark ? 40 : 10), blurRadius: 10, offset: const Offset(0, -2)),
          ],
        ),
        child: NavigationBar(
          backgroundColor: navBg,
          indicatorColor: isDark ? const Color(0xFF2A1A1E) : const Color(0xFFFFEAEA),
          selectedIndex: _currentIndex,
          onDestinationSelected: (i) => setState(() => _currentIndex = i),
          destinations: [
            NavigationDestination(
              icon: Icon(Icons.home_outlined, color: isDark ? const Color(0xFF9E9E9E) : null),
              selectedIcon: const Icon(Icons.home, color: Color(0xFFE53935)),
              label: 'Home',
            ),
            NavigationDestination(
              icon: Icon(Icons.search_outlined, color: isDark ? const Color(0xFF9E9E9E) : null),
              selectedIcon: const Icon(Icons.search, color: Color(0xFFE53935)),
              label: 'Find Donors',
            ),
            NavigationDestination(
              icon: Icon(Icons.emergency_outlined, color: isDark ? const Color(0xFF9E9E9E) : null),
              selectedIcon: const Icon(Icons.emergency, color: Color(0xFFE53935)),
              label: 'Emergency',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline, color: isDark ? const Color(0xFF9E9E9E) : null),
              selectedIcon: const Icon(Icons.person, color: Color(0xFFE53935)),
              label: 'Profile',
            ),
          ],
          labelTextStyle: WidgetStateProperty.resolveWith((states) {
            return TextStyle(
              fontSize: 11,
              fontWeight: states.contains(WidgetState.selected) ? FontWeight.w700 : FontWeight.w500,
              color: states.contains(WidgetState.selected)
                  ? const Color(0xFFE53935)
                  : (isDark ? const Color(0xFF9E9E9E) : const Color(0xFF757575)),
            );
          }),
        ),
      ),
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // TAB 1: HOME PAGE
  // ══════════════════════════════════════════════════════════════════
  Widget _buildHomeTab(UserModel? user, bool isDark, ThemeProvider theme) {
    final requests = DemoData.requests.where((r) => r.status == 'active').toList();
    final isDesktop = MediaQuery.of(context).size.width > 800;

    // Theme colors matching web CSS exactly
    final bgColor = isDark ? const Color(0xFF0F0F1A) : const Color(0xFFFAFAFA);
    final cardColor = isDark ? const Color(0xFF1A1A2E) : Colors.white;
    final borderColor = isDark ? const Color(0xFF2A2A3E) : const Color(0xFFE0E0E0);
    final textColor = isDark ? const Color(0xFFE0E0E0) : const Color(0xFF212121);
    final subTextColor = isDark ? const Color(0xFF9E9E9E) : const Color(0xFF757575);

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // ── 1. TOP NAVBAR ──
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF0F0F1A).withAlpha(235) : Colors.white.withAlpha(235),
              border: Border(bottom: BorderSide(color: borderColor, width: 1)),
              boxShadow: [
                BoxShadow(color: Colors.black.withAlpha(isDark ? 60 : 8), blurRadius: 12, offset: const Offset(0, 2)),
              ],
            ),
            child: Row(
              children: [
                // Brand Logo
                SmoothScaleEffect(
                  onTap: () => setState(() => _currentIndex = 0),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 34,
                        height: 34,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            center: Alignment(-0.2, -0.3),
                            colors: [Color(0xFFFF4081), Color(0xFFE53935)],
                          ),
                        ),
                        child: const Center(child: Text('🩸', style: TextStyle(fontSize: 18))),
                      ),
                      const SizedBox(width: 8),
                      RichText(
                        text: TextSpan(
                          text: 'Life',
                          style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: textColor),
                          children: const [
                            TextSpan(text: 'Link', style: TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w900)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 24),

                // Center Navigation Links
                if (isDesktop)
                  Expanded(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _navLinkPill('Home', true, () => setState(() => _currentIndex = 0), isDark),
                        _navLinkPill('Find Donors', false, () => setState(() => _currentIndex = 1), isDark),
                        _navLinkPill('Emergency', false, () => setState(() => _currentIndex = 2), isDark),
                        _navLinkPill('Hospitals', false, () => Navigator.pushNamed(context, '/hospitals'), isDark),
                        _navLinkPill('Blood Banks', false, () => Navigator.pushNamed(context, '/blood-banks'), isDark),
                        _navLinkPill('About', false, () => Navigator.pushNamed(context, '/about'), isDark),
                        _navLinkPill('Contact', false, () => Navigator.pushNamed(context, '/contact'), isDark),
                      ],
                    ),
                  )
                else
                  const Spacer(),

                // Theme Toggle & Dashboard Button with smooth feedback
                SmoothScaleEffect(
                  onTap: () => theme.toggleTheme(),
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isDark ? bgColor : const Color(0xFFF5F5F5),
                      border: Border.all(color: borderColor),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withAlpha(isDark ? 30 : 10),
                          blurRadius: 6,
                        ),
                      ],
                    ),
                    child: Center(
                      child: Text(isDark ? '☀️' : '🌙', style: const TextStyle(fontSize: 18)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                SmoothAnimatedButton(
                  onPressed: () => Navigator.pushNamed(context, '/dashboard'),
                  backgroundColor: const Color(0xFFE53935),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                  borderRadius: 50,
                  child: const Text('Dashboard', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                ),
              ],
            ),
          ),

          // ── 2. HERO SECTION ──
          Container(
            padding: EdgeInsets.symmetric(
              horizontal: isDesktop ? 60 : 20,
              vertical: isDesktop ? 48 : 28,
            ),
            decoration: BoxDecoration(
              color: bgColor,
              gradient: isDark
                  ? null
                  : const RadialGradient(
                      center: Alignment(0.7, -0.3),
                      radius: 1.2,
                      colors: [Color(0xFFFFF0F2), Color(0xFFFAFAFA)],
                    ),
            ),
            child: isDesktop
                ? Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Expanded(flex: 5, child: _buildHeroLeftContent(isDark, textColor, subTextColor)),
                      const SizedBox(width: 48),
                      Expanded(flex: 4, child: _buildHeroRightVisual(isDark, cardColor, borderColor, textColor, subTextColor)),
                    ],
                  )
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildHeroLeftContent(isDark, textColor, subTextColor),
                      const SizedBox(height: 32),
                      _buildHeroRightVisual(isDark, cardColor, borderColor, textColor, subTextColor),
                    ],
                  ),
          ),

          // ── 3. FEATURES SECTION ──
          Container(
            padding: EdgeInsets.symmetric(horizontal: isDesktop ? 60 : 20, vertical: 48),
            color: bgColor,
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF2A1A1E) : const Color(0xFFFFEAEA),
                    borderRadius: BorderRadius.circular(50),
                  ),
                  child: const Text(
                    'FEATURES',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Color(0xFFE53935), letterSpacing: 0.8),
                  ),
                ),
                const SizedBox(height: 12),
                RichText(
                  textAlign: TextAlign.center,
                  text: TextSpan(
                    text: 'Why Choose ',
                    style: TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: textColor, letterSpacing: -0.5),
                    children: const [
                      TextSpan(text: 'LifeLink', style: TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w900)),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Advanced features designed to make blood donation seamless and life-saving.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 14, color: subTextColor),
                ),
                const SizedBox(height: 36),
                LayoutBuilder(
                  builder: (context, constraints) {
                    final crossAxisCount = constraints.maxWidth > 900 ? 3 : (constraints.maxWidth > 600 ? 2 : 1);
                    return GridView.count(
                      crossAxisCount: crossAxisCount,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 20,
                      mainAxisSpacing: 20,
                      childAspectRatio: isDesktop ? 1.35 : 1.45,
                      children: [
                        _buildFeatureCard(iconBg: isDark ? const Color(0xFF2A1A1E) : const Color(0xFFFFEAEA), iconText: '📍', title: 'Location-Based Search', description: 'Find donors near you using GPS-powered proximity search and distance filtering.', isDark: isDark, textColor: textColor, subTextColor: subTextColor, cardColor: cardColor, borderColor: borderColor),
                        _buildFeatureCard(iconBg: isDark ? const Color(0xFF1A1A2E) : const Color(0xFFE8F1FF), iconText: '⚡', title: 'Instant Alerts', description: 'Emergency notifications reach matching donors within seconds of a request.', isDark: isDark, textColor: textColor, subTextColor: subTextColor, cardColor: cardColor, borderColor: borderColor),
                        _buildFeatureCard(iconBg: isDark ? const Color(0xFF1A2A1E) : const Color(0xFFE8F8EE), iconText: '✓', title: 'Verified Donors', description: 'Every donor is verified to ensure safety, trust, and reliability.', isDark: isDark, textColor: textColor, subTextColor: subTextColor, cardColor: cardColor, borderColor: borderColor),
                        _buildFeatureCard(iconBg: isDark ? const Color(0xFF2A1A1E) : const Color(0xFFFFEAEA), iconText: '🏥', title: 'Hospital Network', description: 'Access our partner hospital directory with real-time blood stock data across South India & India.', isDark: isDark, textColor: textColor, subTextColor: subTextColor, cardColor: cardColor, borderColor: borderColor),
                        _buildFeatureCard(iconBg: isDark ? const Color(0xFF1A1A2E) : const Color(0xFFE8F1FF), iconText: '💬', title: 'Direct Communication', description: 'Call or message donors directly. No middlemen, no delays.', isDark: isDark, textColor: textColor, subTextColor: subTextColor, cardColor: cardColor, borderColor: borderColor),
                        _buildFeatureCard(iconBg: isDark ? const Color(0xFF2A1A1E) : const Color(0xFFFFEAEA), iconText: '📊', title: 'Smart Analytics', description: 'Track donations, view history, and get reminders for your next donation.', isDark: isDark, textColor: textColor, subTextColor: subTextColor, cardColor: cardColor, borderColor: borderColor),
                      ],
                    );
                  },
                ),
              ],
            ),
          ),

          // ── 4. REAL OPENSTREETMAP LIVE DONOR MAP SECTION ──
          Container(
            padding: EdgeInsets.symmetric(horizontal: isDesktop ? 60 : 20, vertical: 32),
            color: cardColor,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                            decoration: BoxDecoration(
                              color: isDark ? const Color(0xFF2A1A1E) : const Color(0xFFFFEAEA),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Text('📍 Live Donor & Hospital Map', style: TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w700, fontSize: 11)),
                          ),
                          const SizedBox(height: 6),
                          Text('Donors & Hospitals in Chennai & Across India', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: textColor)),
                          const SizedBox(height: 2),
                          Text(
                            'Real-time locations of registered donors & South Indian hospitals. Click any pin to view details.',
                            style: TextStyle(fontSize: 13, color: subTextColor),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    SmoothAnimatedButton(
                      onPressed: () => setState(() => _currentIndex = 1),
                      backgroundColor: const Color(0xFFE53935),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                      borderRadius: 50,
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.search, size: 16),
                          SizedBox(width: 6),
                          Text('Search by Location'),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                const RealOsmMapWidget(height: 420, initialZoom: 5.0),
              ],
            ),
          ),

          // ── 5. BLOOD GROUPS MATCH SECTION ──
          Container(
            padding: EdgeInsets.symmetric(horizontal: isDesktop ? 60 : 20, vertical: 36),
            color: bgColor,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('🩸 Find Your Blood Match', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: textColor)),
                const SizedBox(height: 4),
                Text('Select a blood group to find available donors instantly.', style: TextStyle(color: subTextColor, fontSize: 13)),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) {
                    return SmoothScaleEffect(
                      onTap: () => setState(() => _currentIndex = 1),
                      child: Container(
                        width: 80,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: cardColor,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: borderColor),
                          boxShadow: [
                            BoxShadow(color: Colors.black.withAlpha(isDark ? 30 : 5), blurRadius: 8, offset: const Offset(0, 2)),
                          ],
                        ),
                        child: Column(
                          children: [
                            Text(bg, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFFE53935))),
                            const SizedBox(height: 2),
                            Text('Type', style: TextStyle(fontSize: 11, color: subTextColor)),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),

          // ── 6. ACTIVE EMERGENCY REQUESTS ──
          Container(
            padding: EdgeInsets.symmetric(horizontal: isDesktop ? 60 : 20, vertical: 32),
            color: cardColor,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('🚨 Urgent Blood Requests', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: textColor)),
                    SmoothScaleEffect(
                      onTap: () => setState(() => _currentIndex = 2),
                      child: const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        child: Text('View All Alerts', style: TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w700)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                ...requests.take(4).map((r) => _buildUrgentCard(r, isDark, cardColor, borderColor, textColor, subTextColor)),
              ],
            ),
          ),

          // ── 7. STATS BAR ──
          Container(
            padding: const EdgeInsets.symmetric(vertical: 48),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFE53935), Color(0xFFC62828)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _statBarItem('12,500+', 'Registered Donors'),
                _statBarItem('3,800+', 'Lives Saved'),
                _statBarItem('250+', 'Partner Hospitals'),
                _statBarItem('48+', 'Cities Covered'),
              ],
            ),
          ),

          // ── 8. FOOTER ──
          Container(
            padding: const EdgeInsets.all(32),
            color: const Color(0xFF1A1A2E),
            child: Column(
              children: [
                RichText(
                  text: const TextSpan(
                    text: '🩸 Life',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
                    children: [TextSpan(text: 'Link', style: TextStyle(color: Color(0xFFE53935)))],
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Smart Blood Donor Finder platform connecting donors, seekers & hospitals across South India & nationwide.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Color(0xFF9E9E9E), fontSize: 12),
                ),
                const SizedBox(height: 16),
                const Text('© 2026 LifeLink. All rights reserved.', style: TextStyle(color: Color(0xFF535670), fontSize: 11)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ── HERO LEFT CONTENT ──
  Widget _buildHeroLeftContent(bool isDark, Color textColor, Color subTextColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF2A1A1E) : const Color(0xFFFFEAEA),
            borderRadius: BorderRadius.circular(50),
          ),
          child: const Text(
            '🚑 #1 BLOOD DONOR PLATFORM',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFFE53935), letterSpacing: 0.5),
          ),
        ),
        const SizedBox(height: 16),
        RichText(
          text: TextSpan(
            text: 'Every Drop ',
            style: TextStyle(
              fontSize: 42,
              fontWeight: FontWeight.w900,
              color: textColor,
              height: 1.15,
              letterSpacing: -0.8,
            ),
            children: const [
              TextSpan(text: 'Saves', style: TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w900)),
              TextSpan(text: ' a\nLife'),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'Connect with verified blood donors near you in seconds. LifeLink uses smart matching and real-time alerts to ensure no one waits for blood during emergencies.',
          style: TextStyle(fontSize: 15, color: subTextColor, height: 1.5),
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            // Find Donors Now with smooth animation
            SmoothAnimatedButton(
              onPressed: () => setState(() => _currentIndex = 1),
              backgroundColor: const Color(0xFFE53935),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 16),
              borderRadius: 50,
              child: const Text('Find Donors Now', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
            ),
            const SizedBox(width: 14),
            // Become a Donor with smooth animation & direct navigation to /become-donor
            SmoothAnimatedButton(
              onPressed: () => Navigator.pushNamed(context, '/become-donor'),
              backgroundColor: Colors.transparent,
              foregroundColor: const Color(0xFFE53935),
              borderSide: const BorderSide(color: Color(0xFFE53935), width: 1.8),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              borderRadius: 50,
              child: const Text('Become a Donor', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFFE53935))),
            ),
          ],
        ),
        const SizedBox(height: 36),
        Row(
          children: [
            _heroStatItem('12,500+', 'REGISTERED DONORS', textColor, subTextColor),
            const SizedBox(width: 28),
            _heroStatItem('3,800+', 'LIVES SAVED', textColor, subTextColor),
            const SizedBox(width: 28),
            _heroStatItem('250+', 'PARTNER HOSPITALS', textColor, subTextColor),
          ],
        ),
      ],
    );
  }

  // ── HERO RIGHT VISUAL ──
  Widget _buildHeroRightVisual(bool isDark, Color cardColor, Color borderColor, Color textColor, Color subTextColor) {
    return Center(
      child: SizedBox(
        width: 360,
        height: 340,
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Center Pink Gradient Container
            Container(
              width: 320,
              height: 300,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFFFE0E4), Color(0xFFFFCCD3)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(32),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFE53935).withAlpha(isDark ? 50 : 30),
                    blurRadius: 30,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: RadialGradient(colors: [Color(0xFFFF4081), Color(0xFFE53935)]),
                    ),
                    child: const Center(child: Text('🩸', style: TextStyle(fontSize: 38))),
                  ),
                  const SizedBox(height: 12),
                  const Text('LifeLink', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Color(0xFFE53935))),
                  const SizedBox(height: 4),
                  const Text('Donate Blood, Save Lives', style: TextStyle(fontSize: 12, color: Color(0xFF757575), fontWeight: FontWeight.w600)),
                ],
              ),
            ),

            // Top-Left Floating Card: Request Fulfilled
            Positioned(
              top: 10,
              left: 0,
              child: SmoothScaleEffect(
                onTap: () {},
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: cardColor,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: borderColor),
                    boxShadow: [BoxShadow(color: Colors.black.withAlpha(isDark ? 60 : 15), blurRadius: 16, offset: const Offset(0, 4))],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isDark ? const Color(0xFF1A2A1E) : const Color(0xFFE8F8EE),
                        ),
                        child: const Center(child: Text('✓', style: TextStyle(color: Color(0xFF43A047), fontWeight: FontWeight.w900))),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Request Fulfilled', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: textColor)),
                          Text('O+ blood delivered (Chennai)', style: TextStyle(fontSize: 10, color: subTextColor)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // Bottom-Right Floating Card: Urgent: A- Needed
            Positioned(
              bottom: 10,
              right: 0,
              child: SmoothScaleEffect(
                onTap: () => setState(() => _currentIndex = 2),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: cardColor,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: borderColor),
                    boxShadow: [BoxShadow(color: Colors.black.withAlpha(isDark ? 60 : 15), blurRadius: 16, offset: const Offset(0, 4))],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isDark ? const Color(0xFF2A2A1E) : const Color(0xFFFFF3E0),
                        ),
                        child: const Center(child: Text('🔔', style: TextStyle(fontSize: 14))),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Urgent: A+ Needed', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: textColor)),
                          Text('Apollo Greams Rd, Chennai', style: TextStyle(fontSize: 10, color: subTextColor)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── FEATURE CARD ──
  Widget _buildFeatureCard({
    required Color iconBg,
    required String iconText,
    required String title,
    required String description,
    required bool isDark,
    required Color textColor,
    required Color subTextColor,
    required Color cardColor,
    required Color borderColor,
  }) {
    return SmoothScaleEffect(
      onTap: () {},
      child: Container(
        padding: const EdgeInsets.all(22),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: borderColor),
          boxShadow: [
            BoxShadow(color: Colors.black.withAlpha(isDark ? 30 : 8), blurRadius: 16, offset: const Offset(0, 4)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(color: iconBg, borderRadius: BorderRadius.circular(12)),
              child: Center(child: Text(iconText, style: const TextStyle(fontSize: 20))),
            ),
            const SizedBox(height: 14),
            Text(title, textAlign: TextAlign.center, style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: textColor)),
            const SizedBox(height: 8),
            Text(description, textAlign: TextAlign.center, style: TextStyle(fontSize: 13, color: subTextColor, height: 1.4)),
          ],
        ),
      ),
    );
  }

  Widget _heroStatItem(String number, String label, Color textColor, Color subTextColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(number, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Color(0xFFE53935), letterSpacing: -0.5)),
        const SizedBox(height: 2),
        Text(label, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: subTextColor, letterSpacing: 0.5)),
      ],
    );
  }

  Widget _statBarItem(String number, String label) {
    return Column(
      children: [
        Text(number, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Colors.white)),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 12, color: Colors.white.withAlpha(220))),
      ],
    );
  }

  Widget _navLinkPill(String label, bool isActive, VoidCallback onTap, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: SmoothScaleEffect(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: isActive ? (isDark ? const Color(0xFF2A1A1E) : const Color(0xFFFFEAEA)) : Colors.transparent,
            borderRadius: BorderRadius.circular(50),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: isActive ? FontWeight.w800 : FontWeight.w600,
              color: isActive
                  ? const Color(0xFFE53935)
                  : (isDark ? const Color(0xFF9E9E9E) : const Color(0xFF757575)),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildUrgentCard(EmergencyRequestModel r, bool isDark, Color cardColor, Color borderColor, Color textColor, Color subTextColor) {
    return SmoothScaleEffect(
      onTap: () => setState(() => _currentIndex = 2),
      child: Card(
        color: cardColor,
        margin: const EdgeInsets.only(bottom: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: borderColor),
        ),
        child: ListTile(
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          leading: CircleAvatar(
            backgroundColor: const Color(0xFFE53935),
            child: Text(r.bloodGroupNeeded, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 13)),
          ),
          title: Text(r.patientName, style: TextStyle(fontWeight: FontWeight.w800, color: textColor)),
          subtitle: Text('${r.hospitalName} · ${r.city}', style: TextStyle(color: subTextColor, fontSize: 12)),
          trailing: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF2A1A1E) : const Color(0xFFFFEAEA),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text('CRITICAL', style: TextStyle(color: Color(0xFFE53935), fontSize: 10, fontWeight: FontWeight.w800)),
          ),
        ),
      ),
    );
  }
}
