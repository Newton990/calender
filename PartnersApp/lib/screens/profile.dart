import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/partner_style.dart';
import '../widgets/nickname_editor.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _partnerNickname = "Luna User";
  bool _pushNotifications = true;
  bool _cycleAlerts = true;
  PartnerStyle _selectedStyle = PartnerStyle.masculine;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      final styleIndex = prefs.getInt('partner_style') ?? 0;
      _selectedStyle = PartnerStyle.values[styleIndex];
    });
  }

  Future<void> _saveProfile() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('partner_style', _selectedStyle.index);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Partner Style updated! ✨")),
    );
  }

  void _showNicknameEditor() {
    showDialog(
      context: context,
      builder: (context) => NicknameEditor(
        currentNickname: _partnerNickname,
        onSave: (val) => setState(() => _partnerNickname = val),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        title: Text("Partner Profile", style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: const Color(0xFF2D3142),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildHeader(),
            const SizedBox(height: 24),
            _buildSettingsSection(),
            const SizedBox(height: 32),
            _buildSupportIdentitySection(),
            const SizedBox(height: 32),
            _buildSupportSection(),
            const SizedBox(height: 48),
            _buildLogoutButton(),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: const EdgeInsets.all(32),
      child: Column(
        children: [
          CircleAvatar(
            radius: 50,
            backgroundColor: const Color(0xFFE0F2F1),
            child: Text("👨‍💻", style: const TextStyle(fontSize: 40)),
          ),
          const SizedBox(height: 16),
          Text(
            "Alex Johnson",
            style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.bold, color: const Color(0xFF2D3142)),
          ),
          Text(
            "Partner ID: LP-990-21",
            style: GoogleFonts.outfit(fontSize: 14, color: Colors.grey[500]),
          ),
          const SizedBox(height: 24),
          OutlinedButton.icon(
            onPressed: _showNicknameEditor,
            icon: const Icon(Icons.edit, size: 16),
            label: Text("Editing nickname for her: $_partnerNickname"),
            style: OutlinedButton.styleFrom(
              foregroundColor: const Color(0xFF008080),
              side: const BorderSide(color: Color(0xFF008080)),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsSection() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
      child: Column(
        children: [
          SwitchListTile(
            title: Text("Push Notifications", style: GoogleFonts.outfit(fontWeight: FontWeight.w600)),
            subtitle: Text("Get alerts for new messages", style: GoogleFonts.outfit(fontSize: 12)),
            value: _pushNotifications,
            activeColor: const Color(0xFF008080),
            onChanged: (val) => setState(() => _pushNotifications = val),
          ),
          const Divider(indent: 16, endIndent: 16),
          SwitchListTile(
            title: Text("Cycle Alerts", style: GoogleFonts.outfit(fontWeight: FontWeight.w600)),
            subtitle: Text("Nudge when major phases shift", style: GoogleFonts.outfit(fontSize: 12)),
            value: _cycleAlerts,
            activeColor: const Color(0xFF008080),
            onChanged: (val) => setState(() => _cycleAlerts = val),
          ),
        ],
      ),
    );
  }

  Widget _buildSupportSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("SUPPORT", style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2, color: Colors.grey)),
          const SizedBox(height: 12),
          _buildSupportItem(Icons.help_outline, "Help Center"),
          _buildSupportItem(Icons.privacy_tip_outlined, "Privacy Policy"),
          _buildSupportItem(Icons.info_outline, "About Luna Partners"),
        ],
      ),
    );
  }

  Widget _buildSupportItem(IconData icon, String title) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey[600]),
          const SizedBox(width: 16),
          Text(title, style: GoogleFonts.outfit(fontWeight: FontWeight.w500)),
          const Spacer(),
          const Icon(Icons.chevron_right, size: 20, color: Colors.grey),
        ],
      ),
    );
  }

  Widget _buildLogoutButton() {
    return TextButton(
      onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
      child: Text(
        "Disconnect Account",
        style: GoogleFonts.outfit(color: Colors.redAccent, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildSupportIdentitySection() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("SUPPORT IDENTITY", style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2, color: Colors.grey)),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(child: _buildStyleOption("Masculine", PartnerStyle.masculine, Icons.male)),
              const SizedBox(width: 12),
              Expanded(child: _buildStyleOption("Feminine", PartnerStyle.feminine, Icons.female)),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _saveProfile,
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF008080), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
              child: const Text("Save Identity", style: TextStyle(color: Colors.white)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStyleOption(String label, PartnerStyle style, IconData icon) {
    final isSelected = _selectedStyle == style;
    return InkWell(
      onTap: () => setState(() => _selectedStyle = style),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF008080) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? const Color(0xFF008080) : Colors.grey[200]!),
        ),
        child: Column(
          children: [
            Icon(icon, color: isSelected ? Colors.white : const Color(0xFF008080)),
            const SizedBox(height: 4),
            Text(label, style: TextStyle(fontSize: 12, color: isSelected ? Colors.white : const Color(0xFF008080), fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
