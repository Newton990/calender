import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  int _avgCycle = 28;
  int _totalCycles = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPartnerData();
  }

  Future<void> _loadPartnerData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      // In a real app we'd pull full history, here we simulate from shared keys
      _avgCycle = 28; 
      _totalCycles = (prefs.getString('partner_last_period') != null) ? 1 : 0;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));

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
                          "PARTNER ANALYSIS 📊",
                          style: GoogleFonts.outfit(color: const Color(0xFFF06292), fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          "Wellness Reports",
                          style: GoogleFonts.outfit(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF2D3142),
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.sync, color: Color(0xFFF06292)),
                      onPressed: () => _loadPartnerData(),
                    ),
                  ],
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSyncStatus(),
                    const SizedBox(height: 24),
                    _buildCycleSummary(),
                    const SizedBox(height: 32),
                    _sectionTitle("Trends to Watch 🔥"),
                    _buildTrendInsights(),
                    const SizedBox(height: 32),
                    _sectionTitle("Mood Patterns by Phase 🎭"),
                    _buildMoodPatterns(),
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

  Widget _buildSyncStatus() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.teal.withOpacity(0.1),
        borderRadius: BorderRadius.circular(30),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.sync, size: 14, color: Colors.teal),
          const SizedBox(width: 8),
          Text("Last synced: Just now", style: GoogleFonts.outfit(fontSize: 12, color: Colors.teal[700])),
        ],
      ),
    );
  }

  Widget _sectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16, left: 4),
      child: Text(
        title,
        style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: const Color(0xFF2D3142)),
      ),
    );
  }

  Widget _buildCycleSummary() {
    return Row(
      children: [
        Expanded(child: _buildStatBox("Avg Cycle", "$_avgCycle Days", const Color(0xFF4DB6AC))),
        const SizedBox(width: 12),
        Expanded(child: _buildStatBox("Consistency", "Stable", const Color(0xFF0288D1))),
        const SizedBox(width: 12),
        Expanded(child: _buildStatBox("Total Tracked", "$_totalCycles", const Color(0xFF7E57C2))),
      ],
    );
  }

  Widget _buildStatBox(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.4),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.5), width: 1.5),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10)],
      ),
      child: Column(
        children: [
          Text(value, style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
          const SizedBox(height: 4),
          Text(label, textAlign: TextAlign.center, style: GoogleFonts.outfit(fontSize: 10, color: Colors.grey[600], fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildTrendInsights() {
    return AnimatedCard(
      child: Column(
        children: [
          _buildTrendRow("Physical Comfort", "High during Menstrual Phase", 0.8),
          const SizedBox(height: 16),
          _buildTrendRow("Energy Levels", "Peaks during Follicular", 0.6),
          const SizedBox(height: 16),
          _buildTrendRow("Mood Sensitivity", "Higher in Luteal Phase", 0.4),
        ],
      ),
    );
  }

  Widget _buildTrendRow(String label, String detail, double progress) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
                    Text(label, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 13)),
                    Text(detail, style: GoogleFonts.outfit(fontSize: 11, color: Colors.grey[400])),
                  ],
                ),
                const SizedBox(height: 10),
                ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: LinearProgressIndicator(
                    value: progress,
                    backgroundColor: Colors.white.withOpacity(0.2),
                    color: const Color(0xFFF3A8B8),
                    minHeight: 10,
                  ),
                ),
      ],
    );
  }

  Widget _buildMoodPatterns() {
    return SizedBox(
      height: 110,
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: [
          _buildPhaseBox("Menstrual", "🍫 Calve", "Focus: Joy"),
          _buildPhaseBox("Follicular", "✨ Energetic", "Focus: Fun"),
          _buildPhaseBox("Ovulatory", "🔥 Radiant", "Focus: Connect"),
          _buildPhaseBox("Luteal", "☁️ Sensitive", "Focus: Peace"),
        ],
      ),
    );
  }

  Widget _buildPhaseBox(String phase, String mood, String action) {
    return Container(
      width: 140,
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.teal.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(phase, style: GoogleFonts.outfit(fontSize: 10, color: Colors.grey[600], fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(mood, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.teal[700])),
          Text(action, style: GoogleFonts.outfit(fontSize: 11, color: Colors.grey[400])),
        ],
      ),
    );
  }
}
