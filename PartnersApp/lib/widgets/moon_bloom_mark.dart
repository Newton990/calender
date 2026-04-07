import 'package:flutter/material.dart';

class MoonBloomMark extends StatelessWidget {
  final double size;
  final Color? color;
  const MoonBloomMark({super.key, this.size = 120, this.color});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(size, size),
      painter: MoonBloomPainter(color: color),
    );
  }
}

class MoonBloomPainter extends CustomPainter {
  final Color? color;
  MoonBloomPainter({this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final paint = Paint()
      ..color = color ?? const Color(0xFFFF758C)
      ..style = PaintingStyle.fill;

    // Draw Crescent Moon
    final path = Path();
    path.addOval(Rect.fromCircle(center: center, radius: size.width / 2));
    final subtractPath = Path();
    subtractPath.addOval(Rect.fromCircle(center: Offset(center.dx - (size.width * 0.08), center.dy), radius: (size.width / 2) * 0.9));
    
    final moonPath = Path.combine(PathOperation.difference, path, subtractPath);
    canvas.drawPath(moonPath, paint);

    // Draw Minimalist Flower Stalk
    final stalkPaint = Paint()
      ..color = const Color(0xFF4DB6AC).withOpacity(0.6)
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 0.025;
    
    final stalkPath = Path();
    stalkPath.moveTo(center.dx, center.dy + (size.width * 0.08));
    stalkPath.quadraticBezierTo(center.dx + (size.width * 0.04), center.dy + (size.width * 0.25), center.dx, center.dy + (size.width * 0.4));
    canvas.drawPath(stalkPath, stalkPaint);

    // Draw Small Bloom
    final bloomPaint = Paint()
      ..color = color ?? const Color(0xFFFF758C).withOpacity(0.8)
      ..style = PaintingStyle.fill;
    
    canvas.drawCircle(Offset(center.dx, center.dy + (size.width * 0.06)), size.width * 0.05, bloomPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
