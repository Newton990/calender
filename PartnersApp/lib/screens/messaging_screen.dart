import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/messaging_service.dart';

class MessagingScreen extends StatefulWidget {
  final String? prefillMessage;
  const MessagingScreen({super.key, this.prefillMessage});

  @override
  State<MessagingScreen> createState() => _MessagingScreenState();
}

class _MessagingScreenState extends State<MessagingScreen> {
  final MessagingService _messagingService = MessagingService();
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final TextEditingController _controller = TextEditingController();
  
  String? _chatId;
  String? _partnerId;
  List<String> _quickReplies = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initializeChat();
    if (widget.prefillMessage != null) {
      _controller.text = widget.prefillMessage!;
    }
  }

  Future<void> _initializeChat() async {
    final user = _auth.currentUser;
    if (user == null) return;

    try {
      // 1. Get current partner profile to find the user they are linked to
      final userDoc = await _db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        _partnerId = userDoc.data()?['partnerId'];
      }

      // If no partner linked yet, we use a placeholder or handle the empty state
      final linkedUserId = _partnerId ?? "user_sync_pending";
      _chatId = _messagingService.getChatId(user.uid, linkedUserId);

      // 2. Load quick replies from partner status data
      final prefs = await SharedPreferences.getInstance();
      final isPregnant = prefs.getBool('partner_is_pregnant') ?? false;
      final lpStr = prefs.getString('partner_last_period');
      
      int currentDay = 1;
      if (lpStr != null) {
        currentDay = (DateTime.now().difference(DateTime.parse(lpStr)).inDays % 28) + 1;
      }
      
      _quickReplies = _messagingService.getQuickReplies(currentDay, isPregnant);
    } catch (e) {
      print("PARTNER CHAT INIT ERROR: $e");
    }

    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _handleSend([String? prefill]) async {
    final text = prefill ?? _controller.text.trim();
    if (text.isEmpty || _chatId == null || _partnerId == null) return;

    await _messagingService.sendMessage(
      chatId: _chatId!,
      receiverId: _partnerId!,
      text: text,
    );
    
    _controller.clear();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          color: Color(0xFFFDF7F9),
        ),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 60, 24, 20),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF2D3142), size: 20),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "SECURE DUO CHAT 🔒",
                        style: GoogleFonts.outfit(color: const Color(0xFFF06292), fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "Message Her",
                        style: GoogleFonts.outfit(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF2D3142),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Expanded(
              child: StreamBuilder<List<ChatMessage>>(
                stream: _messagingService.getMessagesStream(_chatId!),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  final messages = snapshot.data ?? [];
                  return ListView.builder(
                    reverse: true,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    itemCount: messages.length,
                    itemBuilder: (context, index) {
                      final msg = messages[index];
                      return _buildMessageBubble(msg);
                    },
                  );
                },
              ),
            ),
            _buildQuickRepliesArea(),
            _buildInputArea(),
          ],
        ),
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage msg) {
    bool isMe = msg.senderId == _auth.currentUser?.uid;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Align(
        alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
          decoration: BoxDecoration(
            color: isMe ? const Color(0xFFF06292) : Colors.white.withOpacity(0.4),
            borderRadius: BorderRadius.only(
              topLeft: const Radius.circular(24),
              topRight: const Radius.circular(24),
              bottomLeft: Radius.circular(isMe ? 24 : 8),
              bottomRight: Radius.circular(isMe ? 8 : 24),
            ),
            border: isMe ? null : Border.all(color: Colors.white.withOpacity(0.5), width: 1.5),
            boxShadow: [
              BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4))
            ],
          ),
          child: Column(
            crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
            children: [
              Text(
                msg.text,
                style: GoogleFonts.outfit(
                  color: isMe ? Colors.white : const Color(0xFF2D3142),
                  fontSize: 15,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                "Read",
                style: GoogleFonts.outfit(
                  color: isMe ? Colors.white70 : Colors.grey[400],
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickRepliesArea() {
    if (_quickReplies.isEmpty) return const SizedBox.shrink();
    return Container(
      height: 60,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _quickReplies.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.only(right: 10),
            child: ActionChip(
              label: Text(_quickReplies[index], style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w500)),
              backgroundColor: Colors.white.withOpacity(0.8),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide(color: Colors.teal.withOpacity(0.1))),
              onPressed: () => _handleSend(_quickReplies[index]),
            ),
          );
        },
      ),
    );
  }

  Widget _buildInputArea() {
    return SafeArea(
      child: Container(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
        child: Row(
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 2))
                  ],
                ),
                child: TextField(
                  controller: _controller,
                  onSubmitted: (_) => _handleSend(),
                  decoration: InputDecoration(
                    hintText: "Send a supportive note...",
                    hintStyle: GoogleFonts.outfit(color: Colors.grey[400]),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            GestureDetector(
              onTap: _handleSend,
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(colors: [Color(0xFF4DB6AC), Color(0xFF009688)]),
                  shape: BoxShape.circle,
                  boxShadow: [BoxShadow(color: Color(0xFF009688), blurRadius: 8, offset: Offset(0, 3))],
                ),
                child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
