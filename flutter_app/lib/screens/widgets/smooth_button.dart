import 'package:flutter/material.dart';

/// SmoothAnimatedButton provides a premium micro-interaction on tap:
/// - Subtle downscale to 0.95 with smooth deceleration
/// - Elastic spring back on release
/// - Animated glow / shadow elevation
/// - Hover elevation on desktop / web
class SmoothAnimatedButton extends StatefulWidget {
  final VoidCallback? onPressed;
  final Widget child;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final BorderSide? borderSide;
  final EdgeInsetsGeometry? padding;
  final double borderRadius;
  final double? width;
  final double? height;
  final List<BoxShadow>? customShadow;
  final Gradient? gradient;

  const SmoothAnimatedButton({
    super.key,
    required this.onPressed,
    required this.child,
    this.backgroundColor,
    this.foregroundColor,
    this.borderSide,
    this.padding,
    this.borderRadius = 50.0,
    this.width,
    this.height,
    this.customShadow,
    this.gradient,
  });

  @override
  State<SmoothAnimatedButton> createState() => _SmoothAnimatedButtonState();
}

class _SmoothAnimatedButtonState extends State<SmoothAnimatedButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  bool _isHovered = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 140),
      reverseDuration: const Duration(milliseconds: 240),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOutQuad,
        reverseCurve: Curves.elasticOut,
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleTapDown(TapDownDetails details) {
    if (widget.onPressed != null) {
      _controller.forward();
    }
  }

  void _handleTapUp(TapUpDetails details) {
    if (widget.onPressed != null) {
      _controller.reverse();
      widget.onPressed!();
    }
  }

  void _handleTapCancel() {
    if (widget.onPressed != null) {
      _controller.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEnabled = widget.onPressed != null;
    final bg = widget.backgroundColor ?? const Color(0xFFE53935);
    final fg = widget.foregroundColor ?? Colors.white;

    return MouseRegion(
      cursor: isEnabled ? SystemMouseCursors.click : SystemMouseCursors.forbidden,
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTapDown: _handleTapDown,
        onTapUp: _handleTapUp,
        onTapCancel: _handleTapCancel,
        behavior: HitTestBehavior.opaque,
        child: AnimatedBuilder(
          animation: _scaleAnimation,
          builder: (context, child) {
            return Transform.scale(
              scale: _scaleAnimation.value * (_isHovered && !_controller.isAnimating && _controller.value == 0 ? 1.02 : 1.0),
              child: child,
            );
          },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            curve: Curves.easeOut,
            width: widget.width,
            height: widget.height,
            padding: widget.padding ?? const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            decoration: BoxDecoration(
              color: widget.gradient == null
                  ? (isEnabled ? bg : bg.withAlpha(120))
                  : null,
              gradient: widget.gradient,
              borderRadius: BorderRadius.circular(widget.borderRadius),
              border: widget.borderSide != null
                  ? Border.fromBorderSide(widget.borderSide!)
                  : null,
              boxShadow: widget.customShadow ??
                  (isEnabled && bg != Colors.transparent
                      ? [
                          BoxShadow(
                            color: (widget.gradient != null ? const Color(0xFFE53935) : bg).withAlpha(_isHovered ? 80 : 45),
                            blurRadius: _isHovered ? 20 : 12,
                            offset: Offset(0, _isHovered ? 6 : 3),
                          ),
                        ]
                      : []),
            ),
            child: DefaultTextStyle(
              style: TextStyle(
                color: fg,
                fontFamily: 'Inter',
                fontWeight: FontWeight.w700,
                fontSize: 14,
              ),
              child: IconTheme(
                data: IconThemeData(color: fg, size: 18),
                child: Center(
                  child: widget.child,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// SmoothScaleEffect wraps any widget (like a chip, card or icon button)
/// to apply a smooth scale animation on click.
class SmoothScaleEffect extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final double scaleDownTo;
  final Duration duration;

  const SmoothScaleEffect({
    super.key,
    required this.child,
    required this.onTap,
    this.scaleDownTo = 0.94,
    this.duration = const Duration(milliseconds: 120),
  });

  @override
  State<SmoothScaleEffect> createState() => _SmoothScaleEffectState();
}

class _SmoothScaleEffectState extends State<SmoothScaleEffect>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: widget.duration,
      reverseDuration: const Duration(milliseconds: 220),
    );
    _scale = Tween<double>(begin: 1.0, end: widget.scaleDownTo).animate(
      CurvedAnimation(
        parent: _ctrl,
        curve: Curves.easeInOut,
        reverseCurve: Curves.elasticOut,
      ),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: widget.onTap != null ? SystemMouseCursors.click : SystemMouseCursors.basic,
      child: GestureDetector(
        onTapDown: (_) {
          if (widget.onTap != null) _ctrl.forward();
        },
        onTapUp: (_) {
          if (widget.onTap != null) {
            _ctrl.reverse();
            widget.onTap!();
          }
        },
        onTapCancel: () {
          if (widget.onTap != null) _ctrl.reverse();
        },
        behavior: HitTestBehavior.opaque,
        child: ScaleTransition(
          scale: _scale,
          child: widget.child,
        ),
      ),
    );
  }
}
