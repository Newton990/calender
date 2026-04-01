import 'package:shared_preferences/shared_preferences.dart';
import 'dart:io';

class ChatMessage {
  final String text;
  final String type; // 'sent' or 'received'
  final DateTime timestamp;

  ChatMessage({required this.text, required this.type, required this.timestamp});

  Map<String, dynamic> toJson() => {
    'text': text,
    'type': type,
    'timestamp': timestamp.toIso8601String(),
  };

  factory ChatMessage.fromJson(Map<String, dynamic> json) => ChatMessage(
    text: json['text'],
    type: json['type'],
    timestamp: DateTime.parse(json['timestamp']),
  );
}

  // In a real app, this would be your Firebase Firestore collection 
  static const String _sharedPath = 'c:/Users/user/Desktop/calender/shared_chat.json';

  Future<List<ChatMessage>> getLogs() async {
    try {
      final file = File(_sharedPath);
      if (!file.existsSync()) return [];
      final content = await file.readAsString();
      final List<dynamic> list = jsonDecode(content);
      return list.map((s) => ChatMessage.fromJson(s)).toList();
    } catch (e) {
      print("Chat Sync Error: $e");
      return [];
    }
  }

  Future<void> saveMessage(ChatMessage msg) async {
    try {
      final logs = await getLogs();
      logs.add(msg);
      final file = File(_sharedPath);
      await file.writeAsString(jsonEncode(logs.map((m) => m.toJson()).toList()));
    } catch (e) {
      print("Chat Save Error: $e");
    }
  }

  List<String> getQuickReplies(int currentDay, bool isPregnant) {
    if (isPregnant) {
      return ["How are you feeling? ❤️", "Need anything from the store? 🍎", "I'm thinking of you! ✨"];
    }

    if (currentDay <= 5) {
      return ["Thinking of you! ❤️", "Got you tea! 🍵", "Netflix tonight? 📺"];
    } else if (currentDay >= 12 && currentDay <= 16) {
      return ["You glow today! ✨", "Dinner date tonight? 🍷", "I love you! ❤️"];
    } else {
      return ["Take a breath! 🌙", "I'm here to listen. 👂", "You got this! 💪"];
    }
  }
}
