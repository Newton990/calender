import 'package:flutter/material.dart';
import '../widgets/share_button.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Partner Profile')),
      body: Center(
        child: Column(
          children: [
            const SizedBox(height: 40),
            const CircleAvatar(radius: 60, backgroundColor: Colors.deepPurple),
            const SizedBox(height: 20),
            const Text('Partner Entity Name', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const Text('ID: PART-12345', style: TextStyle(color: Colors.grey)),
            const Padding(
              padding: EdgeInsets.all(24.0),
              child: Text(
                'This is the official profile for the partner entity. All activities and agreements are tracked here.',
                textAlign: TextAlign.center,
              ),
            ),
            const ShareAppButton(
              appName: 'Luna Partners',
              appLink: 'https://example.com/partners-download', // replace with real link
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
              child: const Text('Disconnect', style: TextStyle(color: Colors.white)),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
