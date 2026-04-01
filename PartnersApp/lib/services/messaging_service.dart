import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'encryption_util.dart';

class ChatMessage {
  final String messageId;
  final String chatId;
  final String senderId;
  final String text;
  final String? imageUrl;
  final String? audioUrl;
  final DateTime timestamp;

  ChatMessage({
    required this.messageId,
    required this.chatId,
    required this.senderId,
    required this.text,
    this.imageUrl,
    this.audioUrl,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
    'messageId': messageId,
    'chatId': chatId,
    'senderId': senderId,
    'text': text,
    'imageUrl': imageUrl,
    'audioUrl': audioUrl,
    'timestamp': Timestamp.fromDate(timestamp),
  };

  factory ChatMessage.fromFirestore(DocumentSnapshot doc) {
    Map data = doc.data() as Map;
    final rawText = data['text'] ?? '';
    // Automatically decrypt if it looks like Base64 or is flagged as encrypted
    final decryptedText = EncryptionUtil.decryptText(rawText);

    return ChatMessage(
      messageId: doc.id,
      chatId: data['chatId'] ?? '',
      senderId: data['senderId'] ?? '',
      text: decryptedText,
      imageUrl: data['imageUrl'],
      audioUrl: data['audioUrl'],
      timestamp: (data['timestamp'] as Timestamp? ?? Timestamp.now()).toDate(),
    );
  }
}

class MessagingService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  /// Deterministic chatId generation: sort UIDs to ensure consistency between both partners.
  String getChatId(String uid1, String uid2) {
    List<String> ids = [uid1, uid2];
    ids.sort();
    return ids.join('_');
  }

  /// Sends a message from the partner side to the nested 'messages' subcollection: chats/{chatId}/messages
  Future<void> sendMessage({
    required String chatId,
    required String receiverId,
    required String text,
    String? imageUrl,
    String? audioUrl,
  }) async {
    final user = _auth.currentUser;
    if (user == null) return;

    // 1. Encrypt the text before sending to Firestore
    final encryptedText = EncryptionUtil.encryptText(text);

    await _db
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add({
      'chatId': chatId,
      'senderId': user.uid,
      'receiverId': receiverId,
      'text': encryptedText,
      'imageUrl': imageUrl,
      'audioUrl': audioUrl,
      'timestamp': FieldValue.serverTimestamp(),
      'isEncrypted': true,
    });
  }

  /// Real-time stream of messages from the subcollection for the partner view
  Stream<List<ChatMessage>> getMessagesStream(String chatId) {
    return _db
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('timestamp', descending: true)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((doc) => ChatMessage.fromFirestore(doc)).toList());
  }

  /// Quick replies for the partner to send supportive messages
  List<String> getQuickReplies(int currentDay, bool isPregnant) {
    if (isPregnant) {
      return ["How are you feeling? ❤️", "Need anything from the store? 🍎", "I'm thinking of you! ✨"];
    }

    if (currentDay <= 5) {
      return ["Thinking of you! ❤️", "Got you tea! 🍵", "Netflix tonight? 📺"];
    } else if (currentDay >= 12 && currentDay <= 16) {
      return ["You glow today! ✨", "Dinner tonight? 🍷", "I love you! ❤️"];
    } else {
      return ["Take a breath! 🌙", "I'm here to listen. 👂", "You got this! 💪"];
    }
  }
}
