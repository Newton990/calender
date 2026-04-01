import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class PartnerFeedScreen extends StatelessWidget {
  const PartnerFeedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> feedItems = [
      {
        'type': 'Tip',
        'title': 'Daily Support Tip',
        'content': 'She might be feeling a bit more tired today as her energy levels naturally dip. Maybe offer to handle dinner? 🍲',
        'icon': '💡'
      },
      {
        'type': 'Insight',
        'title': 'Cycle Phase Insight',
        'content': 'Entering the Luteal phase. Soft lighting and a cozy environment can make a big difference tonight. 🌙',
        'icon': '✨'
      },
      {
        'type': 'Activity',
        'title': 'Connection Activity',
        'content': 'A 10-minute walk together could be the perfect way to reconnect and decompress. 👟',
        'icon': '🤝'
      }
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF0F4F8),
      appBar: AppBar(
        title: Text("Support Feed", style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: Colors.teal[800],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: feedItems.length,
        itemBuilder: (context, index) {
          final item = feedItems[index];
          return _buildFeedCard(item);
        },
      ),
    );
  }

  Widget _buildFeedCard(Map<String, String> item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.teal.withOpacity(0.05),
            blurRadius: 20,
            offset: const Offset(0, 10),
          )
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.teal[50],
                    shape: BoxShape.circle,
                  ),
                  child: Text(item['icon']!, style: const TextStyle(fontSize: 20)),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item['type']!.toUpperCase(),
                      style: GoogleFonts.outfit(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.teal,
                        letterSpacing: 1.2,
                      ),
                    ),
                    Text(
                      item['title']!,
                      style: GoogleFonts.outfit(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.teal[900],
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              item['content']!,
              style: GoogleFonts.outfit(
                fontSize: 14,
                color: Colors.grey[700],
                height: 1.5,
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                _buildActionBtn("Learn More", Icons.arrow_forward),
                const SizedBox(width: 12),
                _buildActionBtn("Share", Icons.share_outlined),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionBtn(String label, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.teal.withOpacity(0.1)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: Colors.teal),
          const SizedBox(width: 6),
          Text(
            label,
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Colors.teal,
            ),
          ),
        ],
      ),
    );
  }
}
