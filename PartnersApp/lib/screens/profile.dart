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
                    IconButton(
                      icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF2D3142), size: 20),
                      onPressed: () => Navigator.pop(context),
                    ),
                    Text(
                      "Partner Profile",
                      style: GoogleFonts.outfit(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF2D3142),
                      ),
                    ),
                    const SizedBox(width: 40),
                  ],
                ),
              ),
            ),
            SliverToBoxAdapter(
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
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFFF758C).withOpacity(0.2), width: 3),
            ),
            child: const CircleAvatar(
              radius: 50,
              backgroundColor: Colors.white,
              child: Text("👨‍💻", style: TextStyle(fontSize: 40)),
            ),
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
          InkWell(
            onTap: _showNicknameEditor,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: const Color(0xFFFF758C).withOpacity(0.05),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFFF758C).withOpacity(0.1)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.edit, size: 14, color: Color(0xFFFF758C)),
                  const SizedBox(width: 8),
                  Text(
                    "Editing nickname for her: $_partnerNickname",
                    style: GoogleFonts.outfit(fontSize: 13, color: const Color(0xFFFF758C), fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 12),
            child: Text("NOTIFICATIONS", style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2, color: Colors.grey)),
          ),
          AnimatedCard(
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                SwitchListTile(
                  title: Text("Push Notifications", style: GoogleFonts.outfit(fontWeight: FontWeight.w600)),
                  subtitle: Text("Get alerts for new messages", style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey)),
                  value: _pushNotifications,
                  activeColor: const Color(0xFFFF758C),
                  onChanged: (val) => setState(() => _pushNotifications = val),
                ),
                Divider(color: Colors.white.withOpacity(0.3), indent: 16, endIndent: 16),
                SwitchListTile(
                  title: Text("Cycle Alerts", style: GoogleFonts.outfit(fontWeight: FontWeight.w600)),
                  subtitle: Text("Nudge when major phases shift", style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey)),
                  value: _cycleAlerts,
                  activeColor: const Color(0xFFFF758C),
                  onChanged: (val) => setState(() => _cycleAlerts = val),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSupportSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 12),
            child: Text("SUPPORT", style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2, color: Colors.grey)),
          ),
          AnimatedCard(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Column(
              children: [
                _buildSupportItem(Icons.help_outline, "Help Center"),
                Divider(color: Colors.white.withOpacity(0.3), indent: 16, endIndent: 16),
                _buildSupportItem(Icons.privacy_tip_outlined, "Privacy Policy"),
                Divider(color: Colors.white.withOpacity(0.3), indent: 16, endIndent: 16),
                _buildSupportItem(Icons.info_outline, "About Luna Partners"),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSupportItem(IconData icon, String title) {
    return InkWell(
      onTap: () {},
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(icon, size: 20, color: const Color(0xFF2D3142)),
            const SizedBox(width: 16),
            Text(title, style: GoogleFonts.outfit(fontWeight: FontWeight.w500, color: const Color(0xFF2D3142))),
            const Spacer(),
            const Icon(Icons.chevron_right, size: 20, color: Colors.grey),
          ],
        ),
      ),
    );
  }

  Widget _buildLogoutButton() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: SizedBox(
        width: double.infinity,
        height: 56,
        child: ElevatedButton(
          onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor: Colors.redAccent,
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
              side: const BorderSide(color: Color(0xFFFFEBEE)),
            ),
          ),
          child: Text(
            "Log Out of Account",
            style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ),
      ),
    );
  }

  Widget _buildSupportIdentitySection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 12),
            child: Text("SUPPORT IDENTITY", style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2, color: Colors.grey)),
          ),
          AnimatedCard(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(child: _buildStyleOption("Masculine", PartnerStyle.masculine, Icons.male)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildStyleOption("Feminine", PartnerStyle.feminine, Icons.female)),
                  ],
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: _saveProfile,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF758C),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: Text("Save Identity ✨", style: GoogleFonts.outfit(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
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
          color: isSelected ? const Color(0xFFFF758C) : Colors.white.withOpacity(0.3),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isSelected ? const Color(0xFFFF758C) : Colors.white.withOpacity(0.5)),
        ),
        child: Column(
          children: [
            Icon(icon, color: isSelected ? Colors.white : const Color(0xFFFF758C)),
            const SizedBox(height: 4),
            Text(
              label,
              style: GoogleFonts.outfit(
                fontSize: 12,
                color: isSelected ? Colors.white : const Color(0xFFFF758C),
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
