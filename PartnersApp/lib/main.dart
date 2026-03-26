import 'package:flutter/material.dart';
import 'screens/login.dart';
import 'screens/dashboard.dart';
import 'screens/partner_feed.dart';
import 'screens/messaging_screen.dart';

void main() {
  runApp(PartnersApp());
}

class PartnersApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Luna Partners',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.teal),
      home: LoginScreen(),
      routes: {
        '/dashboard': (_) => const DashboardScreen(),
        '/feed': (_) => PartnerFeedScreen(),
        '/messages': (_) => const MessagingScreen(),
      },
    );
  }
}
