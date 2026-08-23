import 'package:flutter/material.dart';

/// LifeLink Design System – Full Material 3 Theme
/// Matches the website's CSS design system: #E53935 primary, Inter font,
/// rounded cards, professional healthcare aesthetic.
class AppTheme {
  AppTheme._();

  // ── Brand Colors ──
  static const Color primary = Color(0xFFE53935);
  static const Color primaryDark = Color(0xFFC62828);
  static const Color primaryLight = Color(0xFFEF5350);
  static const Color primaryGlow = Color(0x40E53935);
  static const Color accent = Color(0xFFFF7043);

  // ── Semantic Colors ──
  static const Color success = Color(0xFF43A047);
  static const Color warning = Color(0xFFFB8C00);
  static const Color info = Color(0xFF1E88E5);
  static const Color danger = Color(0xFFE53935);

  // ── Neutral Colors ──
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color border = Color(0xFFE0E0E0);
  static const Color background = Color(0xFFFAFAFA);
  static const Color surface = Color(0xFFFFFFFF);

  // ── Dark Theme Colors (Matching web CSS variables) ──
  static const Color darkBackground = Color(0xFF0F0F1A);
  static const Color darkSurface = Color(0xFF1A1A2E);
  static const Color darkBorder = Color(0xFF2A2A3E);
  static const Color darkCard = Color(0xFF1A1A2E);
  static const Color darkInput = Color(0xFF0F0F1A);
  static const Color darkTextSecondary = Color(0xFF9E9E9E);

  // ── Gradients ──
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primary, primaryDark],
  );

  static const LinearGradient heroGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFFE53935), Color(0xFFB71C1C)],
  );

  // ── Shadows ──
  static List<BoxShadow> get cardShadow => [
    BoxShadow(
      color: Colors.black.withOpacity(0.08),
      blurRadius: 24,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> get cardShadowLg => [
    BoxShadow(
      color: Colors.black.withOpacity(0.12),
      blurRadius: 40,
      offset: const Offset(0, 8),
    ),
  ];

  // ── Border Radius ──
  static const double radiusSm = 8.0;
  static const double radiusMd = 12.0;
  static const double radiusLg = 16.0;
  static const double radiusXl = 20.0;
  static const double radiusRound = 50.0;

  // ── Spacing ──
  static const double spacingXs = 4.0;
  static const double spacingSm = 8.0;
  static const double spacingMd = 16.0;
  static const double spacingLg = 24.0;
  static const double spacingXl = 32.0;
  static const double spacingXxl = 48.0;

  // ═══════════════════════════════════════════
  // LIGHT THEME
  // ═══════════════════════════════════════════
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    fontFamily: 'Inter',
    brightness: Brightness.light,
    colorScheme: ColorScheme.fromSeed(
      seedColor: primary,
      primary: primary,
      secondary: accent,
      surface: surface,
      error: danger,
      brightness: Brightness.light,
    ),
    scaffoldBackgroundColor: background,

    // ── AppBar ──
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: textPrimary,
      elevation: 0,
      scrolledUnderElevation: 1,
      centerTitle: true,
      titleTextStyle: TextStyle(
        fontFamily: 'Inter',
        fontSize: 18,
        fontWeight: FontWeight.w700,
        color: textPrimary,
      ),
      iconTheme: IconThemeData(color: textPrimary),
    ),

    // ── Cards ──
    cardTheme: CardThemeData(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusLg),
        side: const BorderSide(color: border, width: 1),
      ),
      color: Colors.white,
      surfaceTintColor: Colors.transparent,
      margin: EdgeInsets.zero,
    ),

    // ── Elevated Button ──
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primary,
        foregroundColor: Colors.white,
        disabledBackgroundColor: primary.withAlpha(128),
        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusRound),
        ),
        elevation: 0,
        textStyle: const TextStyle(
          fontFamily: 'Inter',
          fontWeight: FontWeight.w600,
          fontSize: 16,
        ),
      ),
    ),

    // ── Outlined Button ──
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: primary,
        side: const BorderSide(color: primary, width: 2),
        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusRound),
        ),
        textStyle: const TextStyle(
          fontFamily: 'Inter',
          fontWeight: FontWeight.w600,
          fontSize: 16,
        ),
      ),
    ),

    // ── Text Button ──
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: primary,
        textStyle: const TextStyle(
          fontFamily: 'Inter',
          fontWeight: FontWeight.w600,
          fontSize: 14,
        ),
      ),
    ),

    // ── Input Fields ──
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: const Color(0xFFF5F5F5),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: const BorderSide(color: primary, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: const BorderSide(color: danger, width: 1),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: const BorderSide(color: danger, width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      hintStyle: TextStyle(color: Colors.grey[400], fontWeight: FontWeight.w400),
      labelStyle: const TextStyle(color: textSecondary, fontWeight: FontWeight.w500),
      prefixIconColor: textSecondary,
    ),

    // ── Bottom Nav Bar ──
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: Colors.white,
      indicatorColor: primaryGlow,
      surfaceTintColor: Colors.transparent,
      elevation: 8,
      height: 68,
      labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return const TextStyle(
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: primary,
          );
        }
        return TextStyle(
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: Colors.grey[600],
        );
      }),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return const IconThemeData(color: primary, size: 24);
        }
        return IconThemeData(color: Colors.grey[600], size: 24);
      }),
    ),

    // ── Chips ──
    chipTheme: ChipThemeData(
      backgroundColor: const Color(0xFFF5F5F5),
      selectedColor: primaryGlow,
      labelStyle: const TextStyle(
        fontFamily: 'Inter',
        fontSize: 13,
        fontWeight: FontWeight.w500,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusRound),
      ),
      side: BorderSide.none,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
    ),

    // ── Divider ──
    dividerTheme: const DividerThemeData(
      color: border,
      thickness: 1,
      space: 1,
    ),

    // ── Dialog ──
    dialogTheme: DialogThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusXl),
      ),
      titleTextStyle: const TextStyle(
        fontFamily: 'Inter',
        fontSize: 20,
        fontWeight: FontWeight.w700,
        color: textPrimary,
      ),
    ),

    // ── Snackbar ──
    snackBarTheme: SnackBarThemeData(
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusMd),
      ),
      backgroundColor: textPrimary,
    ),

    // ── Text Theme ──
    textTheme: const TextTheme(
      displayLarge: TextStyle(fontFamily: 'Inter', fontSize: 32, fontWeight: FontWeight.w800, letterSpacing: -0.5),
      displayMedium: TextStyle(fontFamily: 'Inter', fontSize: 28, fontWeight: FontWeight.w800, letterSpacing: -0.5),
      displaySmall: TextStyle(fontFamily: 'Inter', fontSize: 24, fontWeight: FontWeight.w700),
      headlineMedium: TextStyle(fontFamily: 'Inter', fontSize: 20, fontWeight: FontWeight.w700),
      headlineSmall: TextStyle(fontFamily: 'Inter', fontSize: 18, fontWeight: FontWeight.w600),
      titleLarge: TextStyle(fontFamily: 'Inter', fontSize: 16, fontWeight: FontWeight.w600),
      titleMedium: TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w600),
      bodyLarge: TextStyle(fontFamily: 'Inter', fontSize: 16, fontWeight: FontWeight.w400),
      bodyMedium: TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w400),
      bodySmall: TextStyle(fontFamily: 'Inter', fontSize: 12, fontWeight: FontWeight.w400),
      labelLarge: TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w600),
    ),
  );

  // ═══════════════════════════════════════════
  // DARK THEME (Matching blooddonation-theta.vercel.app)
  // ═══════════════════════════════════════════
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    fontFamily: 'Inter',
    brightness: Brightness.dark,
    colorScheme: ColorScheme.fromSeed(
      seedColor: primary,
      primary: primary,
      secondary: accent,
      surface: darkSurface,
      error: danger,
      brightness: Brightness.dark,
    ),
    scaffoldBackgroundColor: darkBackground,
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xEB0F0F1A),
      foregroundColor: Colors.white,
      elevation: 0,
      scrolledUnderElevation: 1,
      centerTitle: true,
      titleTextStyle: TextStyle(
        fontFamily: 'Inter',
        fontSize: 18,
        fontWeight: FontWeight.w700,
        color: Colors.white,
      ),
      iconTheme: IconThemeData(color: Colors.white),
    ),
    cardTheme: CardThemeData(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusLg),
        side: const BorderSide(color: darkBorder, width: 1),
      ),
      color: darkCard,
      surfaceTintColor: Colors.transparent,
      margin: EdgeInsets.zero,
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: darkInput,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: const BorderSide(color: darkBorder, width: 1),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: const BorderSide(color: darkBorder, width: 1),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusMd),
        borderSide: const BorderSide(color: primary, width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      hintStyle: const TextStyle(color: Color(0xFF535670)),
      labelStyle: const TextStyle(color: darkTextSecondary),
      prefixIconColor: darkTextSecondary,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primary,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusRound),
        ),
        elevation: 0,
        textStyle: const TextStyle(
          fontFamily: 'Inter',
          fontWeight: FontWeight.w700,
          fontSize: 15,
        ),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: Colors.white,
        side: const BorderSide(color: primary, width: 1.5),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusRound),
        ),
        textStyle: const TextStyle(
          fontFamily: 'Inter',
          fontWeight: FontWeight.w600,
          fontSize: 14,
        ),
      ),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: darkBackground,
      indicatorColor: const Color(0xFF2A1A1E),
      surfaceTintColor: Colors.transparent,
      elevation: 12,
      height: 68,
      labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return const TextStyle(
            fontFamily: 'Inter',
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: primary,
          );
        }
        return const TextStyle(
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: darkTextSecondary,
        );
      }),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return const IconThemeData(color: primary, size: 24);
        }
        return const IconThemeData(color: darkTextSecondary, size: 24);
      }),
    ),
    dividerTheme: const DividerThemeData(
      color: darkBorder,
      thickness: 1,
      space: 1,
    ),
    snackBarTheme: SnackBarThemeData(
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusMd),
      ),
      backgroundColor: darkSurface,
      contentTextStyle: const TextStyle(color: Colors.white),
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(fontFamily: 'Inter', fontSize: 32, fontWeight: FontWeight.w800, letterSpacing: -0.5, color: Colors.white),
      displayMedium: TextStyle(fontFamily: 'Inter', fontSize: 28, fontWeight: FontWeight.w800, letterSpacing: -0.5, color: Colors.white),
      displaySmall: TextStyle(fontFamily: 'Inter', fontSize: 24, fontWeight: FontWeight.w700, color: Colors.white),
      headlineMedium: TextStyle(fontFamily: 'Inter', fontSize: 20, fontWeight: FontWeight.w700, color: Colors.white),
      headlineSmall: TextStyle(fontFamily: 'Inter', fontSize: 18, fontWeight: FontWeight.w600, color: Colors.white),
      titleLarge: TextStyle(fontFamily: 'Inter', fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white),
      titleMedium: TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white),
      bodyLarge: TextStyle(fontFamily: 'Inter', fontSize: 16, fontWeight: FontWeight.w400, color: Color(0xFFE0E0E0)),
      bodyMedium: TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w400, color: darkTextSecondary),
      bodySmall: TextStyle(fontFamily: 'Inter', fontSize: 12, fontWeight: FontWeight.w400, color: darkTextSecondary),
      labelLarge: TextStyle(fontFamily: 'Inter', fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white),
    ),
  );
}
