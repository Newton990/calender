import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/login.dart';
import 'screens/dashboard.dart';
import 'screens/partner_feed.dart';
import 'screens/dashboard.dart';
import 'screens/splash_screen.dart';
import 'screens/messaging_screen.dart';
import 'services/notification_service.dart';

@pragma('vm:entry-point')
Future<void> _fbBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  await NotificationService.firebaseMessagingBackgroundHandler(message);
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  
  // Initialize Push Notifications
  final notificationService = NotificationService();
  FirebaseMessaging.onBackgroundMessage(_fbBackgroundHandler);
  await notificationService.initialize();

  runApp(PartnersApp());
}

class PartnersApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Luna Partners',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFFFDF7F9),
        primaryColor: const Color(0xFFF06292),
        textTheme: GoogleFonts.poppinsTextTheme().copyWith(
          displayLarge: GoogleFonts.outfit(fontWeight: FontWeight.bold),
          headlineLarge: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: const Color(0xFF2D3142)),
        ),
      ),
      home: const SplashScreen(),
      routes: {
        '/dashboard': (_) => const DashboardScreen(),
        '/feed': (_) => PartnerFeedScreen(),
        '/messages': (_) => const MessagingScreen(),
      },
    );
  }
}
