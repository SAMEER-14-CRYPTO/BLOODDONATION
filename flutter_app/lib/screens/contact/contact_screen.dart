import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../providers/theme_provider.dart';

class ContactScreen extends StatefulWidget {
  const ContactScreen({super.key});
  @override
  State<ContactScreen> createState() => _ContactScreenState();
}

class _ContactScreenState extends State<ContactScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameC = TextEditingController();
  final _emailC = TextEditingController();
  final _subjectC = TextEditingController();
  final _messageC = TextEditingController();

  @override
  void dispose() {
    _nameC.dispose();
    _emailC.dispose();
    _subjectC.dispose();
    _messageC.dispose();
    super.dispose();
  }

  void _sendMessage() {
    if (_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Message sent! We'll get back to you soon."),
          backgroundColor: Color(0xFF43A047),
        ),
      );
      _nameC.clear();
      _emailC.clear();
      _subjectC.clear();
      _messageC.clear();
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
            text: 'Contact ',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: textColor),
            children: const [
              TextSpan(text: 'Us', style: TextStyle(color: Color(0xFFE53935))),
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
            // ── Top Page Header (Matching Image 3) ──
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
                      text: 'Contact ',
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.w900,
                        color: textColor,
                        letterSpacing: -0.5,
                      ),
                      children: const [
                        TextSpan(
                          text: 'Us',
                          style: TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w900),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Home  /  Contact',
                    style: TextStyle(fontSize: 13, color: subTextColor, fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            ),

            // ── Main Content Container: 2-Column (Matching Images 3 & 4) ──
            Container(
              constraints: const BoxConstraints(maxWidth: 1000),
              padding: EdgeInsets.symmetric(horizontal: isDesktop ? 40 : 20, vertical: 48),
              child: isDesktop
                  ? Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(flex: 5, child: _buildLeftInfo(cardColor, borderColor, textColor, subTextColor, isDark)),
                        const SizedBox(width: 36),
                        Expanded(flex: 5, child: _buildRightForm(cardColor, borderColor, textColor, subTextColor, inputBg, isDark)),
                      ],
                    )
                  : Column(
                      children: [
                        _buildLeftInfo(cardColor, borderColor, textColor, subTextColor, isDark),
                        const SizedBox(height: 32),
                        _buildRightForm(cardColor, borderColor, textColor, subTextColor, inputBg, isDark),
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

  // ── LEFT: GET IN TOUCH & 4 INFO CARDS (Matching Image 3 & 4) ──
  Widget _buildLeftInfo(Color cardColor, Color borderColor, Color textColor, Color subTextColor, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RichText(
          text: TextSpan(
            text: 'Get In ',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.w900,
              color: textColor,
              letterSpacing: -0.5,
            ),
            children: const [
              TextSpan(
                text: 'Touch',
                style: TextStyle(color: Color(0xFFE53935), fontWeight: FontWeight.w900),
              ),
            ],
          ),
        ),
        const SizedBox(height: 10),
        Text(
          "Have questions, feedback, or partnership inquiries? We'd love to hear from you.",
          style: TextStyle(fontSize: 14, color: subTextColor, height: 1.5),
        ),
        const SizedBox(height: 28),

        // 4 Contact Cards
        _contactCard(
          iconBg: const Color(0xFFFFEAEA),
          iconText: '📧',
          title: 'Email',
          value: 'help@lifelink.com',
          cardColor: cardColor,
          borderColor: borderColor,
          textColor: textColor,
          subTextColor: subTextColor,
          isDark: isDark,
          onTap: () => _launch('mailto:help@lifelink.com'),
        ),
        const SizedBox(height: 12),

        _contactCard(
          iconBg: const Color(0xFFE8F1FF),
          iconText: '📞',
          title: 'Phone',
          value: '1800-123-456 (Toll Free)',
          cardColor: cardColor,
          borderColor: borderColor,
          textColor: textColor,
          subTextColor: subTextColor,
          isDark: isDark,
          onTap: () => _launch('tel:1800123456'),
        ),
        const SizedBox(height: 12),

        _contactCard(
          iconBg: const Color(0xFFE8F8EE),
          iconText: '📍',
          title: 'Address',
          value: 'LifeLink HQ, Mumbai, Maharashtra, India',
          cardColor: cardColor,
          borderColor: borderColor,
          textColor: textColor,
          subTextColor: subTextColor,
          isDark: isDark,
        ),
        const SizedBox(height: 12),

        _contactCard(
          iconBg: const Color(0xFFFFF3E0),
          iconText: '⏰',
          title: 'Hours',
          value: '24/7 Emergency Support',
          cardColor: cardColor,
          borderColor: borderColor,
          textColor: textColor,
          subTextColor: subTextColor,
          isDark: isDark,
        ),
      ],
    );
  }

  Widget _contactCard({
    required Color iconBg,
    required String iconText,
    required String title,
    required String value,
    required Color cardColor,
    required Color borderColor,
    required Color textColor,
    required Color subTextColor,
    required bool isDark,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: borderColor),
          boxShadow: [
            BoxShadow(color: Colors.black.withAlpha(isDark ? 30 : 6), blurRadius: 12, offset: const Offset(0, 3)),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: iconBg,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Text(iconText, style: const TextStyle(fontSize: 20)),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: textColor)),
                  const SizedBox(height: 2),
                  Text(value, style: TextStyle(fontSize: 13, color: subTextColor)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── RIGHT: SEND A MESSAGE FORM (Matching Images 3 & 4) ──
  Widget _buildRightForm(Color cardColor, Color borderColor, Color textColor, Color subTextColor, Color inputBg, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(color: Colors.black.withAlpha(isDark ? 30 : 8), blurRadius: 20, offset: const Offset(0, 6)),
        ],
      ),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Send a Message',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: textColor),
            ),
            const SizedBox(height: 24),

            // Name & Email
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _label('Name *', textColor),
                      const SizedBox(height: 6),
                      _input(_nameC, 'Your name', inputBg, borderColor, isDark, subTextColor),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _label('Email *', textColor),
                      const SizedBox(height: 6),
                      _input(_emailC, 'Your email', inputBg, borderColor, isDark, subTextColor, isEmail: true),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Subject
            _label('Subject *', textColor),
            const SizedBox(height: 6),
            _input(_subjectC, 'Subject', inputBg, borderColor, isDark, subTextColor),
            const SizedBox(height: 16),

            // Message
            _label('Message *', textColor),
            const SizedBox(height: 6),
            TextFormField(
              controller: _messageC,
              maxLines: 5,
              style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontSize: 13),
              validator: (v) => v == null || v.trim().isEmpty ? 'Required' : null,
              decoration: InputDecoration(
                hintText: 'Your message...',
                hintStyle: TextStyle(color: subTextColor, fontSize: 13),
                filled: true,
                fillColor: inputBg,
                contentPadding: const EdgeInsets.all(16),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: borderColor)),
                enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: borderColor)),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE53935), width: 1.5)),
              ),
            ),
            const SizedBox(height: 24),

            // Submit Button (Matching Image 4)
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _sendMessage,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE53935),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
                  elevation: 3,
                ),
                child: const Text(
                  'Send Message',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _label(String text, Color textColor) {
    return Text(text, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: textColor));
  }

  Widget _input(
    TextEditingController controller,
    String hint,
    Color inputBg,
    Color borderColor,
    bool isDark,
    Color subTextColor, {
    bool isEmail = false,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: isEmail ? TextInputType.emailAddress : TextInputType.text,
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

  void _launch(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }
}
