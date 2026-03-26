import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

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

class MessagingService {
  static const String _logKey = 'chat_logs_main_user';

  Future<List<ChatMessage>> getLogs() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_logKey) ?? [];
    return list.map((s) => ChatMessage.fromJson(jsonDecode(s))).toList();
  }

  Future<void> saveMessage(ChatMessage msg) async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_logKey) ?? [];
    list.add(jsonEncode(msg.toJson()));
    await prefs.setStringList(_logKey, list);
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
