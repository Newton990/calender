import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widgets/nickname_editor.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String _nickname = "Her";

  void _showNicknameEditor() {
    showDialog(
      context: context,
      builder: (context) => NicknameEditor(
        currentNickname: _nickname,
        onSave: (val) {
          setState(() {
            _nickname = val;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Nickname updated to '$val' ✨")),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F4F8),
      appBar: AppBar(
        title: Text("Settings", style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.teal,
        elevation: 0,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildPersonalizationSection(),
          const SizedBox(height: 24),
          _buildSettingItem(Icons.notifications, "Notifications", "Manage alerts and nudges"),
          _buildSettingItem(Icons.sync, "Sync Settings", "Manage data connection with NewLuna"),
          _buildSettingItem(Icons.lock, "Privacy", "Manage your data and visibility"),
          _buildSettingItem(Icons.help, "Help & Support", "FAQs and contact support"),
        ],
      ),
    );
  }

  Widget _buildPersonalizationSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 8),
          child: Text(
            "PERSONALIZATION",
            style: GoogleFonts.outfit(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: Colors.teal[700],
              letterSpacing: 1.2,
            ),
          ),
        ),
        Card(
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: ListTile(
            leading: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(color: Colors.teal[50], shape: BoxShape.circle),
              child: const Icon(Icons.face_retouching_natural, color: Colors.teal),
            ),
            title: Text("Nickname", style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
            subtitle: Text("Currently: $_nickname", style: GoogleFonts.outfit(fontSize: 12)),
            trailing: const Icon(Icons.edit, size: 20, color: Colors.teal),
            onTap: _showNicknameEditor,
          ),
        ),
      ],
    );
  }

  Widget _buildSettingItem(IconData icon, String title, String subtitle) {
    return Card(
      elevation: 0,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(color: Colors.grey[50], shape: BoxShape.circle),
          child: Icon(icon, color: Colors.teal[400]),
        ),
        title: Text(title, style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle, style: GoogleFonts.outfit(fontSize: 12)),
        trailing: const Icon(Icons.chevron_right, size: 20),
        onTap: () {},
      ),
    );
  }
}
