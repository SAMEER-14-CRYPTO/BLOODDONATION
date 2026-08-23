import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/theme_provider.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

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

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: RichText(
          text: TextSpan(
            text: 'About ',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textColor),
            children: const [
              TextSpan(text: 'LifeLink', style: TextStyle(color: Color(0xFFE53935))),
            ],
          ),
        ),
        actions: [
          IconButton(
            icon: Text(isDark ? '☀️' : '🌙', style: const TextStyle(fontSize: 20)),
            tooltip: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
            onPressed: () => theme.toggleTheme(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // ── Top Page Header (Matching Image 1) ──
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 20),
              decoration: BoxDecoration(
                color: cardColor,
                border: Border(bottom: BorderSide(color: borderColor)),
              ),
              child: Column(
                children: [
                  RichText(
                    textAlign: TextAlign.center,
                    text: TextSpan(
                      text: 'About ',
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.w900,
                        color: textColor,
                        letterSpacing: -0.5,
                      ),
                      children: const [
                        TextSpan(
                          text: 'LifeLink',
                          style: TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w900),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Home  /  About',
                    style: TextStyle(fontSize: 13, color: subTextColor, fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            ),

            // ── Main Content Container (Matching Image 1 & 2) ──
            Container(
              constraints: const BoxConstraints(maxWidth: 860),
              padding: EdgeInsets.symmetric(horizontal: isDesktop ? 40 : 20, vertical: 48),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // OUR MISSION Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFEAEA),
                      borderRadius: BorderRadius.circular(50),
                    ),
                    child: const Text(
                      'OUR MISSION',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFFE53935),
                        letterSpacing: 0.8,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Heading: Bridging the Gap Between Donors & Lives
                  RichText(
                    text: TextSpan(
                      text: 'Bridging the Gap Between ',
                      style: TextStyle(
                        fontSize: isDesktop ? 34 : 26,
                        fontWeight: FontWeight.w900,
                        color: textColor,
                        letterSpacing: -0.5,
                        height: 1.25,
                      ),
                      children: const [
                        TextSpan(
                          text: 'Donors &\nLives',
                          style: TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w900),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Mission Paragraphs
                  Text(
                    'LifeLink is a smart blood donor finder platform that connects blood donors, seekers, hospitals, and blood banks in one unified ecosystem. Our mission is to ensure that no one loses their life waiting for blood during an emergency.',
                    style: TextStyle(
                      fontSize: 15,
                      color: subTextColor,
                      height: 1.8,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Founded in 2025, LifeLink uses location-based technology, real-time alerts, and verified donor profiles to create the fastest and most reliable blood donation network. We believe that every drop of blood donated is a step toward saving a life.',
                    style: TextStyle(
                      fontSize: 15,
                      color: subTextColor,
                      height: 1.8,
                    ),
                  ),
                  const SizedBox(height: 48),

                  // ── 3 Value Cards: Vision, Values, Impact (Matching Image 2) ──
                  LayoutBuilder(
                    builder: (context, constraints) {
                      final isWide = constraints.maxWidth > 650;
                      return isWide
                          ? Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Expanded(child: _buildValueCard('🎯', 'Our Vision', 'A world where no one dies due to lack of blood availability during emergencies.', cardColor, borderColor, textColor, subTextColor, isDark)),
                                const SizedBox(width: 16),
                                Expanded(child: _buildValueCard('❤️', 'Our Values', 'Compassion, reliability, transparency, and community-driven healthcare support.', cardColor, borderColor, textColor, subTextColor, isDark)),
                                const SizedBox(width: 16),
                                Expanded(child: _buildValueCard('🤝', 'Our Impact', '12,500+ donors, 3,800+ lives saved, 250+ partner hospitals across 48 cities.', cardColor, borderColor, textColor, subTextColor, isDark)),
                              ],
                            )
                          : Column(
                              children: [
                                _buildValueCard('🎯', 'Our Vision', 'A world where no one dies due to lack of blood availability during emergencies.', cardColor, borderColor, textColor, subTextColor, isDark),
                                const SizedBox(height: 14),
                                _buildValueCard('❤️', 'Our Values', 'Compassion, reliability, transparency, and community-driven healthcare support.', cardColor, borderColor, textColor, subTextColor, isDark),
                                const SizedBox(height: 14),
                                _buildValueCard('🤝', 'Our Impact', '12,500+ donors, 3,800+ lives saved, 250+ partner hospitals across 48 cities.', cardColor, borderColor, textColor, subTextColor, isDark),
                              ],
                            );
                    },
                  ),
                  const SizedBox(height: 60),

                  // ── Team Section (Matching Image 2) ──
                  RichText(
                    text: TextSpan(
                      text: 'Meet Our ',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: textColor,
                        letterSpacing: -0.5,
                      ),
                      children: const [
                        TextSpan(
                          text: 'Team',
                          style: TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w900),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  LayoutBuilder(
                    builder: (context, constraints) {
                      final isWide = constraints.maxWidth > 650;
                      return isWide
                          ? Row(
                              children: [
                                Expanded(child: _buildTeamCard('AK', 'Arun Kumar', 'Founder & CEO', cardColor, borderColor, textColor, subTextColor, isDark)),
                                const SizedBox(width: 16),
                                Expanded(child: _buildTeamCard('SM', 'sameer', 'CTO', cardColor, borderColor, textColor, subTextColor, isDark)),
                                const SizedBox(width: 16),
                                Expanded(child: _buildTeamCard('DR', 'Dr.guruvardhan', 'Medical Advisor', cardColor, borderColor, textColor, subTextColor, isDark)),
                              ],
                            )
                          : Column(
                              children: [
                                _buildTeamCard('AK', 'Arun Kumar', 'Founder & CEO', cardColor, borderColor, textColor, subTextColor, isDark),
                                const SizedBox(height: 14),
                                _buildTeamCard('SM', 'sameer', 'CTO', cardColor, borderColor, textColor, subTextColor, isDark),
                                const SizedBox(height: 14),
                                _buildTeamCard('DR', 'Dr.guruvardhan', 'Medical Advisor', cardColor, borderColor, textColor, subTextColor, isDark),
                              ],
                            );
                    },
                  ),
                  const SizedBox(height: 60),

                  // ── Join Our Mission CTA ──
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 36),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFE53935), Color(0xFFC62828)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: const [
                        BoxShadow(color: Color(0x40E53935), blurRadius: 20, offset: Offset(0, 8)),
                      ],
                    ),
                    child: Column(
                      children: [
                        const Text(
                          'Join Our Mission',
                          style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Become a donor today and help us save more lives.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 14, color: Colors.white70),
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: () => Navigator.pushNamed(context, '/signup'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: const Color(0xFFE53935),
                            padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
                          ),
                          child: const Text('Register Now', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // ── Footer ──
            Container(
              padding: const EdgeInsets.all(28),
              color: const Color(0xFF0F0F1A),
              width: double.infinity,
              child: const Center(
                child: Text('© 2026 LifeLink. All rights reserved.', style: TextStyle(color: Color(0xFF9E9E9E), fontSize: 12)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildValueCard(String icon, String title, String desc, Color cardColor, Color borderColor, Color textColor, Color subTextColor, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(color: Colors.black.withAlpha(isDark ? 30 : 6), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        children: [
          Text(icon, style: const TextStyle(fontSize: 36)),
          const SizedBox(height: 14),
          Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textColor)),
          const SizedBox(height: 8),
          Text(
            desc,
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, color: subTextColor, height: 1.45),
          ),
        ],
      ),
    );
  }

  Widget _buildTeamCard(String initials, String name, String role, Color cardColor, Color borderColor, Color textColor, Color subTextColor, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(color: Colors.black.withAlpha(isDark ? 30 : 6), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isDark ? const Color(0xFF0F0F1A) : const Color(0xFFFFEAEA),
              border: Border.all(color: const Color(0xFFE53935).withAlpha(60), width: 1.5),
            ),
            child: Center(
              child: Text(
                initials,
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFFE53935)),
              ),
            ),
          ),
          const SizedBox(height: 14),
          Text(name, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: textColor)),
          const SizedBox(height: 4),
          Text(role, style: TextStyle(fontSize: 12, color: subTextColor, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
