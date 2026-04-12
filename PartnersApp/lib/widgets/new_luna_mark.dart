import 'package:flutter/material.dart';

class NewLunaMark extends StatelessWidget {
  final double size;
  final Color? color;
  const NewLunaMark({super.key, this.size = 120, this.color});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(size, size),
      painter: NewLunaPainter(color: color),
    );
  }
}

class NewLunaPainter extends CustomPainter {
  final Color? color;
  NewLunaPainter({this.color});

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

    

    
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
