import 'package:flutter/material.dart';
import '../models/user_model.dart';

class PartnerFeedScreen extends StatelessWidget {
  final List<Map<String, dynamic>> posts = [
    {
      'partner': User(id: 'p1', username: 'partner_a', nickname: 'Partner A'),
      'content': 'Check out our latest product!'
    },
    {
      'partner': User(id: 'p2', username: 'partner_b'),
      'content': 'Exciting news coming soon!'
    },
  ];

  PartnerFeedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Partner Feed')),
      body: ListView.builder(
        itemCount: posts.length,
        itemBuilder: (context, index) {
          final post = posts[index];
          final User partner = post['partner'];
          return Card(
            margin: const EdgeInsets.all(8),
            child: ListTile(
              title: Text(partner.displayName),
              subtitle: Text(post['content']!),
              trailing: const Icon(Icons.more_vert),
            ),
          );
        },
      ),
    );
  }
}
