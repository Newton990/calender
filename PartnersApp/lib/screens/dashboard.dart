import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/partner_cycle_service.dart';
import '../services/sync_service.dart';
import 'partner_feed.dart';
import 'messaging_screen.dart';
import 'reports.dart';
import 'settings.dart';
import '../widgets/share_button.dart';
import '../models/mood.dart';
import '../models/partner_style.dart';
import '../models/app_mode.dart';
import '../services/logic_engine.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final PartnerCycleService _partnerService = PartnerCycleService();
  DateTime? _partnerLastPeriod;
  DateTime? _pregnancyStartDate;
  AppMode _currentMode = AppMode.period;
  Mood _userMood = Mood.neutral;
  PartnerStyle _partnerStyle = PartnerStyle.masculine;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPartnerData();
  }

  Future<void> _loadPartnerData() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      final lpStr = prefs.getString('partner_last_period');
      if (lpStr != null) {
        _partnerLastPeriod = DateTime.parse(lpStr);
      } else {
        // Mock data for demonstration: last period was 24 days ago
        _partnerLastPeriod = DateTime.now().subtract(const Duration(days: 24));
      }

      final _isPregnant = prefs.getBool('partner_is_pregnant') ?? false;
      _currentMode = _isPregnant ? AppMode.pregnancy : AppMode.period;
      
      _partnerStyle = PartnerStyle.values[prefs.getInt('partner_style') ?? 0];
      
      // Fetch user mood from shared sync
      final wellness = prefs.getStringList('partner_wellness_logs') ?? [];
      if (wellness.contains('irritated')) {
        _userMood = Mood.irritated;
      } else if (wellness.contains('sad')) {
        _userMood = Mood.sad;
      } else {
        _userMood = Mood.neutral;
      }
      
      final psStr = prefs.getString('partner_pregnancy_start_date');
      if (psStr != null) {
        _pregnancyStartDate = DateTime.parse(psStr);
      } else if (_isPregnant) {
        // Mock if pregnant but no date
        _pregnancyStartDate = DateTime.now().subtract(const Duration(days: 84)); // Week 12
      }

      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    if (_isPregnant && _pregnancyStartDate != null) {
      return _buildPregnancyDashboard();
    }

    final insights = _partnerService.getPartnerInsights(_partnerLastPeriod!);
    final nudge = _partnerService.getPartnerNudge(_partnerLastPeriod!);

    return Scaffold(
      backgroundColor: const Color(0xFFF0F4F8),
      appBar: AppBar(
        title: const Text('Partner Dashboard', style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.teal,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.sync, color: Colors.white),
            onPressed: () async {
              await PartnerSyncService().pullPartnerData();
              if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Dashboard updated! ✨")));
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (nudge != null) _buildNudgeAlert(nudge),
            const SizedBox(height: 12),
            _buildCycleWheel(insights, _partnerLastPeriod!),
            const SizedBox(height: 16),
            _buildSupportTipCard(insights),
            const SizedBox(height: 24),
            _buildPartnerAdviceCard(),
            const SizedBox(height: 24),
            _buildDuoHarmonyCard(),
            const SizedBox(height: 24),
            _buildQuickLoveActions(),
            const SizedBox(height: 32),
            const Text('Tools & Management', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildActionGrid(),
            const SizedBox(height: 32),
            const Center(
              child: ShareAppButton(
                appName: 'Luna Partners',
                appLink: 'https://example.com/partners-download',
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPregnancyDashboard() {
    final diffDays = DateTime.now().difference(_pregnancyStartDate!).inDays;
    final weeks = (diffDays / 7).floor();
    final daysIntoWeek = diffDays % 7;
    final insights = _partnerService.getPregnancyInsights(weeks);

    return Scaffold(
      backgroundColor: const Color(0xFFE0F2F1),
      appBar: AppBar(
        title: const Text('Pregnancy Journey', style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.teal[600],
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.sync, color: Colors.white),
            onPressed: () async {
              await PartnerSyncService().pullPartnerData();
              if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Journey data updated! ✨")));
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildPregnancyStatusCard(weeks, daysIntoWeek, insights['title']!),
            const SizedBox(height: 16),
            _buildSupportTipCard({
              'tipTitle': 'Partner Support Tip',
              'tipDesc': insights['desc']!,
              'bonusTip': insights['bonus'],
            }),
            const SizedBox(height: 24),
            const Text('Quick Actions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildActionGrid(),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildPregnancyStatusCard(int weeks, int days, String title) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: Colors.teal.withOpacity(0.1), shape: BoxShape.circle),
                  child: const Icon(Icons.child_care, color: Colors.teal, size: 32),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Week $weeks, Day $days", style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text(title, style: TextStyle(color: Colors.teal[700], fontSize: 16, fontWeight: FontWeight.w500)),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNudgeAlert(String message) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.amber.withOpacity(0.15),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.amber.withOpacity(0.5)),
      ),
      child: Row(
        children: [
          const Icon(Icons.notifications_active, color: Colors.amber, size: 28),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.brown),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCycleWheel(Map<String, String> insights, DateTime lastPeriod) {
    final today = DateTime.now();
    final diffDays = today.difference(lastPeriod).inDays;
    final currentDay = (diffDays % 28) + 1; // Assuming 28 for visual
    final percent = currentDay / 28;

    return Center(
      child: Container(
        padding: const EdgeInsets.all(24),
        margin: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 15, offset: const Offset(0, 5))],
        ),
        child: Column(
          children: [
            const Text("Your Partner is in", style: TextStyle(fontSize: 14, color: Colors.grey, fontWeight: FontWeight.w500)),
            const SizedBox(height: 16),
            Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 180,
                  height: 180,
                  child: CircularProgressIndicator(
                    value: percent,
                    strokeWidth: 12,
                    backgroundColor: Colors.teal.withOpacity(0.1),
                    valueColor: const AlwaysStoppedAnimation<Color>(Colors.teal),
                  ),
                ),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text("$currentDay", style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: Colors.teal)),
                    const Text("DAY", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 2)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.teal.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                insights['phase']!,
                style: const TextStyle(color: Colors.teal, fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              insights['alert']!,
              style: TextStyle(color: Colors.teal.withOpacity(0.7), fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickLoveActions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Send a gesture of support:', style: TextStyle(fontSize: 14, color: Colors.grey, fontStyle: FontStyle.italic)),
        const SizedBox(height: 12),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _buildLoveChip("❤️ Send Love", "Thinking of you always! ❤️"),
              const SizedBox(width: 10),
              _buildLoveChip("🤝 Can I help?", "Is there anything I can do to help today? 🤝"),
              const SizedBox(width: 10),
              _buildLoveChip("💐 Flowers", "Sent you some virtual flowers! 💐"),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildLoveChip(String label, String prefill) {
    return ActionChip(
      label: Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
      backgroundColor: Colors.white,
      side: BorderSide(color: Colors.teal.withOpacity(0.2)),
      onPressed: () {
        Navigator.push(context, MaterialPageRoute(builder: (_) => MessagingScreen(prefillMessage: prefill)));
      },
    );
  }

  Widget _buildSupportTipCard(Map<String, dynamic> insights) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [Colors.teal[400]!, Colors.teal[800]!], begin: Alignment.topLeft, end: Alignment.bottomRight),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.teal.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.lightbulb_outline, color: Colors.white, size: 24),
              const SizedBox(width: 8),
              Text(
                insights['tipTitle']!,
                style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            insights['tipDesc']!,
            style: const TextStyle(color: Colors.white, fontSize: 15, height: 1.4),
          ),
          if (insights['bonusTip'] != null) ...[
            const Divider(color: Colors.white24, height: 24),
            Text(
              "PRO TIP",
              style: TextStyle(color: Colors.teal[100], fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1),
            ),
            const SizedBox(height: 4),
            Text(
              insights['bonusTip']!,
              style: const TextStyle(color: Colors.white, fontSize: 14, fontStyle: FontStyle.italic),
            ),
          ],
        ],
      ),
    );
  }
  Widget _buildDuoHarmonyCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 15, offset: const Offset(0, 5))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Duo Harmony", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF2D3142))),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: Colors.teal.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                child: const Text("88%", style: TextStyle(color: Colors.teal, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: LinearProgressIndicator(
                  value: 0.88,
                  backgroundColor: Colors.teal.withOpacity(0.1),
                  valueColor: const AlwaysStoppedAnimation<Color>(Colors.teal),
                  borderRadius: BorderRadius.circular(10),
                  minHeight: 8,
                ),
              ),
              const SizedBox(width: 12),
              const Icon(Icons.favorite, color: Colors.pinkAccent, size: 16),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            "You've sent 3 love gestures this week! Your connection is staying strong and synchronized. ✨",
            style: TextStyle(fontSize: 13, color: Colors.grey, height: 1.4),
          ),
        ],
      ),
    );
  }

  Widget _buildActionGrid() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.3,
      children: [
        _buildActionItem(Icons.rss_feed, "Partner Feed", Colors.orange, () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => PartnerFeedScreen()));
        }),
        _buildActionItem(Icons.message, "Messages", Colors.blue, () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const MessagingScreen()));
        }),
        _buildActionItem(Icons.calendar_month, "Reports", Colors.green, () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const ReportsScreen()));
        }),
        _buildActionItem(Icons.settings, "Settings", Colors.blueGrey, () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const SettingsScreen()));
        }),
      ],
    );
  }

  Widget _buildActionItem(IconData icon, String label, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 8),
            Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }

  Widget _buildPartnerAdviceCard() {
    final advice = LogicEngine.getPartnerAdvice(_currentMode, _userMood, _partnerStyle);
    
    return Container(
      padding: const EdgeInsets.all(20),
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: _partnerStyle == PartnerStyle.masculine 
          ? [const Color(0xFF2D3142), const Color(0xFF4F5D75)] 
          : [const Color(0xFF7E57C2), const Color(0xFF9575CD)]),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.psychology, color: Colors.white, size: 24),
              const SizedBox(width: 12),
              Text("Guidance for You", style: GoogleFonts.outfit(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            advice,
            style: GoogleFonts.outfit(color: Colors.white.withOpacity(0.9), fontSize: 15, height: 1.5),
          ),
        ],
      ),
    );
  }
}
