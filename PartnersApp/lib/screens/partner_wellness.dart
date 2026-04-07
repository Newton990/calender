import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class PartnerWellnessScreen extends StatelessWidget {
  const PartnerWellnessScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFFFE6EB), Colors.white],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              expandedHeight: 150,
              pinned: true,
              backgroundColor: Colors.transparent,
              elevation: 0,
              flexibleSpace: FlexibleSpaceBar(
                centerTitle: true,
                title: Text(
                  "Support Center ✨",
                  style: GoogleFonts.playfairDisplay(
                    color: const Color(0xFF2D3142),
                    fontWeight: FontWeight.bold,
                    fontSize: 22,
                  ),
                ),
                background: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFFFFE6EB), Colors.white],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ),
                  ),
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 10),
                    Center(
                      child: Text(
                        "How to be the best partner today.",
                        style: GoogleFonts.poppins(
                          color: Colors.grey[600],
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                    _sectionTitle("Support Academy 🎓"),
                    _buildSupportAcademy(),
                    const SizedBox(height: 32),
                    _sectionTitle("Quick Care Tips 🌿"),
                    _buildCareGrid(),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _sectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 8, bottom: 16),
      child: Text(
        title,
        style: GoogleFonts.poppins(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: const Color(0xFF2D3142),
        ),
      ),
    );
  }

  Widget _buildSupportAcademy() {
    return Column(
      children: [
        _buildSupportTile(
          "Menstrual Phase 🌸",
          "Focus on: Comfort and Empathy",
          "Offer a warm tea, handle more of the chores, and be extra patient. She might be feeling low energy and in pain. 🍵",
          const Color(0xFFFFDFD3),
        ),
        _buildSupportTile(
          "Follicular Phase ✨",
          "Focus on: Adventure and Ideas",
          "She's likely feeling social and energetic! Plan a walk or ask her about those new ideas she's been having. 🏃‍♀️",
          const Color(0xFFFF7EB3),
        ),
        _buildSupportTile(
          "Ovulation Phase 🔥",
          "Focus on: Connection and Appreciation",
          "Confidence is high! Plan a nice date night and tell her how radiant she looks today. 💖",
          const Color(0xFFFFB703),
        ),
        _buildSupportTile(
          "Luteal Phase 🌙",
          "Focus on: Patience and Stability",
          "Hormones are shifting. She might be sensitive or tired. Bring home some favorite snacks and be a calm presence. 🍫",
          const Color(0xFF43AA8B),
        ),
      ],
    );
  }

  Widget _buildSupportTile(String title, String subtitle, String advice, Color accentColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.9),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ExpansionTile(
        title: Text(title, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, color: accentColor)),
        subtitle: Text(subtitle, style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600])),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Text(
              advice,
              style: GoogleFonts.poppins(fontSize: 14, color: Colors.black87, height: 1.5),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCareGrid() {
    return Column(
      children: [
        _buildCareCard(
          "The 'Little Things' 🌸",
          "A sweet text during the day, her favorite chocolate, or just listening without trying to 'fix' things goes a long way.",
          const Color(0xFFB39DDB),
        ),
        const SizedBox(height: 16),
        _buildCareCard(
          "Physical Comfort 🧘‍♀️",
          "Back rubs, foot massages, or making sure the heating pad is ready. Small physical gestures show you care.",
          const Color(0xFFFF8FA3),
        ),
      ],
    );
  }

  Widget _buildCareCard(String title, String content, Color accent) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [accent.withOpacity(0.7), accent]),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 8),
          Text(content, style: GoogleFonts.poppins(color: Colors.white.withOpacity(0.9), fontSize: 13, height: 1.4)),
        ],
      ),
    );
  }
}
