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
import 'package:google_fonts/google_fonts.dart';
import '../widgets/new_luna_mark.dart';
import 'notifications.dart';
import 'partner_wellness.dart';
import '../widgets/animated_card.dart';

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
  int _partnerWaterIntake = 0;
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

      _partnerWaterIntake = prefs.getInt('partner_water_intake') ?? 0;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    final _isPregnant = _currentMode == AppMode.pregnancy;
    if (_isPregnant && _pregnancyStartDate != null) {
      return _buildPregnancyDashboard();
    }

    final insights = _partnerService.getPartnerInsights(_partnerLastPeriod!);
    final nudge = _partnerService.getPartnerNudge(_partnerLastPeriod!);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          color: Color(0xFFFFF5F8),
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
                    Row(
                      children: [
                        const NewLunaMark(size: 40),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "NewLuna ✨",
                              style: GoogleFonts.outfit(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.5,
                                color: const Color(0xFF2D3142),
                              ),
                            ),
                            Text(
                              "PARTNERS",
                              style: GoogleFonts.outfit(color: const Color(0xFFFF758C), fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                            ),
                          ],
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.notifications_none_rounded, color: Color(0xFF2D3142)),
                          onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsScreen())),
                        ),
                        IconButton(
                          icon: const Icon(Icons.sync, color: Color(0xFFFF758C)),
                          onPressed: () async {
                            await PartnerSyncService().pullPartnerData();
                            _loadPartnerData();
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Column(
                children: [
                  if (nudge != null) _buildNudgeAlert(nudge),
                  _buildCycleWheel(insights, _partnerLastPeriod!),
                  _buildSupportTipCard(insights),
                  _buildPartnerAdviceCard(),
                  _buildQuickLoveActions(),
                  const SizedBox(height: 40),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Text('Tools & Management', 
                      style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: const Color(0xFF2D3142))),
                  ),
                  _buildActionGrid(),
                  _buildPartnerWaterTracker(),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ],
        ),
      ),
  }

  Widget _buildPregnancyDashboard() {
    final diffDays = DateTime.now().difference(_pregnancyStartDate!).inDays;
    final weeks = (diffDays / 7).floor();
    final daysIntoWeek = diffDays % 7;
    final insights = _partnerService.getPregnancyInsights(weeks);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          color: Color(0xFFFFF5F8),
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
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: const Color(0xFFE0F2F1), borderRadius: BorderRadius.circular(12)),
                          child: Text("● Pregnancy Journey", style: GoogleFonts.outfit(color: Color(0xFFFFC3A0)[600], fontSize: 11, fontWeight: FontWeight.bold)),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          "The Journey ✨",
                          style: GoogleFonts.outfit(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF2D3142),
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.sync, color: Color(0xFFFFC3A0)),
                      onPressed: () async {
                        await PartnerSyncService().pullPartnerData();
                        if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Journey data updated! ✨")));
                      },
                    ),
                  ],
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Column(
                children: [
                  _buildPregnancyStatusCard(weeks, daysIntoWeek, insights['title']!),
                  _buildSupportTipCard({
                    'tipTitle': 'Partner Support Tip',
                    'tipDesc': insights['desc']!,
                    'bonusTip': insights['bonus'],
                  }),
                  const SizedBox(height: 32),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Text('Quick Actions', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.bold, color: const Color(0xFF2D3142))),
                  ),
                  _buildActionGrid(),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPregnancyStatusCard(int weeks, int days, String title) {
    return AnimatedCard(
      gradientColors: [const Color(0xFFB2DFDB), const Color(0xFF80CBC4)],
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), shape: BoxShape.circle),
            child: const Icon(Icons.child_care, color: Colors.white, size: 32),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Week $weeks, Day $days", style: GoogleFonts.outfit(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(title, style: GoogleFonts.outfit(color: Colors.white.withOpacity(0.9), fontSize: 16, fontWeight: FontWeight.w500)),
              ],
            ),
          ),
        ],
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

    return AnimatedCard(
      child: Column(
        children: [
          Text("Her Progress", 
            style: GoogleFonts.outfit(fontSize: 16, color: Colors.grey[600], fontWeight: FontWeight.bold)),
          const SizedBox(height: 20),
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 180,
                height: 180,
                child: CircularProgressIndicator(
                  value: percent,
                  strokeWidth: 10,
                  backgroundColor: const Color(0xFFFFDFD3),
                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFFF758C)),
                  strokeCap: StrokeCap.round,
                ),
              ),
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                   Text("Day", style: GoogleFonts.outfit(color: Colors.grey, fontSize: 14)),
                  Text("$currentDay", 
                    style: GoogleFonts.outfit(fontSize: 56, fontWeight: FontWeight.bold, color: const Color(0xFF2D3142))),
                ],
              ),
            ],
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFFFFDFD3),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Text(
              insights['phase']!,
              style: GoogleFonts.outfit(color: const Color(0xFFE85D75), fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            insights['alert']!,
            style: GoogleFonts.outfit(color: Colors.grey[600], fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _buildPartnerWaterTracker() {
    final double percent = (_partnerWaterIntake / 8).clamp(0.0, 1.0);
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFE3F2FD).withOpacity(0.5),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF2196F3).withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Partner's Hydration 💧", 
                style: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: const Color(0xFF1976D2))),
              Text("$_partnerWaterIntake / 8 Cups", 
                style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 12, color: const Color(0xFF1976D2))),
            ],
          ),
          const SizedBox(height: 12),
          LinearProgressIndicator(
            value: percent,
            backgroundColor: Colors.white,
            valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF2196F3)),
            borderRadius: BorderRadius.circular(6),
            minHeight: 8,
          ),
        ],
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
      side: BorderSide(color: Color(0xFFFFC3A0).withOpacity(0.2)),
      onPressed: () {
        Navigator.push(context, MaterialPageRoute(builder: (_) => MessagingScreen(prefillMessage: prefill)));
      },
    );
  }

  Widget _buildSupportTipCard(Map<String, dynamic> insights) {
    return AnimatedCard(
      gradientColors: [const Color(0xFFFF758C), const Color(0xFFFF7EB3)],
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.lightbulb, color: Colors.white, size: 28),
              const SizedBox(width: 12),
              Text(
                insights['tipTitle']!,
                style: GoogleFonts.outfit(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            insights['tipDesc']!,
            style: GoogleFonts.outfit(color: Colors.white.withOpacity(0.9), fontSize: 15, height: 1.5),
          ),
          if (insights['bonusTip'] != null) ...[
            const Divider(color: Colors.white30, height: 32),
             Text(
               "LUNA TIP",
               style: GoogleFonts.outfit(color: Colors.white.withOpacity(0.6), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.5),
            ),
            const SizedBox(height: 8),
            Text(
              insights['bonusTip']!,
              style: GoogleFonts.outfit(color: Colors.white, fontSize: 14, fontStyle: FontStyle.italic),
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
        borderRadius: BorderRadius.circular(20),
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
                decoration: BoxDecoration(color: Color(0xFFFFC3A0).withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                child: const Text("88%", style: TextStyle(color: Color(0xFFFFC3A0), fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: LinearProgressIndicator(
                  value: 0.88,
                  backgroundColor: Color(0xFFFFC3A0).withOpacity(0.1),
                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFFFC3A0)),
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
          _buildActionItem(Icons.favorite, "Wellness", Color(0xFFFF758C), () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const PartnerWellnessScreen()));
          }),
          _buildActionItem(Icons.rss_feed, "Partner Feed", Colors.orange, () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => PartnerFeedScreen()));
          }),
        _buildActionItem(Icons.message, "Messages", Color(0xFFFFC3A0), () {
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
        borderRadius: BorderRadius.circular(20),
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
