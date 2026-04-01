import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/animated_card.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  List<Map<String, String>> _getPartnerAlerts() {
    return [
      {'title': 'She just logged a craving 🍫', 'subtitle': '"Chocolate sounds amazing right now!"', 'time': 'Just now', 'icon': '🌙', 'color': '0xFFF06292'},
      {'title': 'Mood Update: Low Energy ☁️', 'subtitle': 'Luteal phase starts soon. Be gentle ✨', 'time': '2h ago', 'icon': '🕯️', 'color': '0xFF4DB6AC'},
      {'title': 'Duo Milestone: 1 Month! 🥂', 'subtitle': 'You\'ve been tracking together for 30 days.', 'time': '5h ago', 'icon': '✨', 'color': '0xFFFFA000'},
      {'title': 'Cycle Nudge ⏱️', 'subtitle': 'Her fertile window opens in 3 days.', 'time': 'Yesterday', 'icon': '🗓️', 'color': '0xFFF3A8B8'},
    ];
  }

  @override
  Widget build(BuildContext context) {
    final alerts = _getPartnerAlerts();

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          color: Color(0xFFFDF7F9),
        ),
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 60, 24, 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "PARTNER UPDATES 🌙",
                          style: GoogleFonts.outfit(color: const Color(0xFFF06292), fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          "Partner Nudges",
                          style: GoogleFonts.outfit(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF2D3142),
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF2D3142), size: 20),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: _buildHourlyNudgeBanner(),
            ),
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final alert = alerts[index];
                    return _buildAlertCard(alert);
                  },
                  childCount: alerts.length,
                ),
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
    );
  }

  Widget _buildHourlyNudgeBanner() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFFF06292).withOpacity(0.05),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFF06292).withOpacity(0.1)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(color: Color(0xFFF06292), shape: BoxShape.circle),
              child: const Icon(Icons.favorite_rounded, color: Colors.white, size: 16),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Active Partner Nudges", style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 14)),
                  Text("Reminding you to check in every hour.", style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey[600])),
                ],
              ),
            ),
            const Icon(Icons.check_circle_outline, color: Color(0xFFF06292), size: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildAlertCard(Map<String, String> alert) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: AnimatedCard(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: Color(int.parse(alert['color']!)).withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              alignment: Alignment.center,
              child: Text(alert['icon']!, style: const TextStyle(fontSize: 24)),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          alert['title']!,
                          style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 15, color: const Color(0xFF2D3142)),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Text(
                        alert['time']!,
                        style: GoogleFonts.outfit(fontSize: 10, color: Colors.grey[400], fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    alert['subtitle']!,
                    style: GoogleFonts.outfit(fontSize: 13, color: Colors.grey[600], height: 1.4),
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
