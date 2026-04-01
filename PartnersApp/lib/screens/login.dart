import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:local_auth/local_auth.dart';
import '../widgets/animated_card.dart';
import 'dashboard.dart';

class LoginScreen extends StatelessWidget {
  final LocalAuthentication auth = LocalAuthentication();

  LoginScreen({super.key});

  Future<void> _loginWithBiometrics(BuildContext context) async {
    bool canCheck = await auth.canCheckBiometrics;
    if (canCheck) {
      bool authenticated = await auth.authenticate(
          localizedReason: 'Login to Partner Portal',
          options: const AuthenticationOptions(biometricOnly: true));
      if (authenticated) {
        Navigator.pushReplacement(
          context, 
          MaterialPageRoute(builder: (_) => const DashboardScreen())
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          color: Color(0xFFFDF7F9),
        ),
        child: Column(
          children: [
            const SizedBox(height: 120),
            // Header
            Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF06292).withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.handshake_rounded, color: Color(0xFFF06292), size: 48),
                ),
                const SizedBox(height: 24),
                Text(
                  "Partner Portal ✨",
                  style: GoogleFonts.outfit(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF2D3142),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  "Providing supportive care in every phase.",
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    color: Colors.grey[600],
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
            const Spacer(),
            // Glassmorphic Auth Portal
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 60),
              child: AnimatedCard(
                child: Column(
                  children: [
                    _buildAuthButton(
                      context,
                      "Fast Access (Biometrics)",
                      Icons.fingerprint_rounded,
                      () => _loginWithBiometrics(context),
                      isPrimary: true,
                    ),
                    const SizedBox(height: 16),
                    _buildAuthButton(
                      context,
                      "Enter Account PIN",
                      Icons.lock_person_outlined,
                      () {},
                      isPrimary: false,
                    ),
                    const SizedBox(height: 16),
                    _buildAuthButton(
                      context,
                      "Standard Email Access",
                      Icons.mail_outline_rounded,
                      () {},
                      isPrimary: false,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAuthButton(BuildContext context, String label, IconData icon, VoidCallback onPressed, {required bool isPrimary}) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: isPrimary ? const Color(0xFFF06292) : Colors.white.withOpacity(0.5),
          foregroundColor: isPrimary ? Colors.white : const Color(0xFF2D3142),
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          side: isPrimary ? null : BorderSide(color: Colors.white.withOpacity(0.5)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 20),
            const SizedBox(width: 12),
            Text(label, style: GoogleFonts.outfit(fontWeight: FontWeight.bold, fontSize: 15)),
          ],
        ),
      ),
    );
  }
}
