import 'package:flutter/material.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F4F8),
      appBar: AppBar(
        title: const Text("Partner Reports", style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.teal,
        elevation: 0,
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.insights, size: 64, color: Colors.teal.withOpacity(0.3)),
            const SizedBox(height: 16),
            const Text(
              "Coming Soon",
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.teal),
            ),
            const SizedBox(height: 8),
            const Text(
              "Synchronized cycle analysis and trends will appear here.",
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
