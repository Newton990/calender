import 'package:flutter/material.dart';
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
  final TextEditingController _controller = TextEditingController();
  List<ChatMessage> _messages = [];
  List<String> _quickReplies = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final logs = await _messagingService.getLogs();
    final prefs = await SharedPreferences.getInstance();
    
    // Partner context
    final isPregnant = prefs.getBool('partner_is_pregnant') ?? false;
    final lpStr = prefs.getString('partner_last_period');
    int currentDay = 1;
    if (lpStr != null) {
      currentDay = (DateTime.now().difference(DateTime.parse(lpStr)).inDays % 28) + 1;
    }

    setState(() {
      _messages = logs;
      _quickReplies = _messagingService.getQuickReplies(currentDay, isPregnant);
      _isLoading = false;
    });

    // Handle prefill message
    if (widget.prefillMessage != null) {
      _handleSend(widget.prefillMessage);
    }
  }

  Future<void> _handleSend([String? prefill]) async {
    final text = prefill ?? _controller.text.trim();
    if (text.isEmpty) return;

    final msg = ChatMessage(text: text, type: 'sent', timestamp: DateTime.now());
    await _messagingService.saveMessage(msg);

    setState(() {
      _messages.add(msg);
      _controller.clear();
    });

    // Simulated "received" response
    Future.delayed(const Duration(seconds: 4), () async {
      if (mounted) {
        final reply = ChatMessage(text: "Thank you for checking in! ❤️", type: 'received', timestamp: DateTime.now());
        await _messagingService.saveMessage(reply);
        setState(() => _messages.add(reply));
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    return Scaffold(
      backgroundColor: const Color(0xFFF0F4F8),
      appBar: AppBar(
        title: const Text("Message Her", style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.teal,
        elevation: 0,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                return _buildMessageBubble(msg);
              },
            ),
          ),
          _buildQuickReplies(),
          _buildInputArea(),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage msg) {
    final bool isSent = msg.type == 'sent';
    return Align(
      alignment: isSent ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.7),
        decoration: BoxDecoration(
          color: isSent ? Colors.teal[600] : Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [if (!isSent) BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 5)],
        ),
        child: Text(
          msg.text,
          style: TextStyle(
            color: isSent ? Colors.white : Colors.black87,
            fontSize: 14,
          ),
        ),
      ),
    );
  }

  Widget _buildQuickReplies() {
    return Container(
      height: 50,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _quickReplies.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ActionChip(
              label: Text(_quickReplies[index], style: const TextStyle(fontSize: 12, color: Colors.teal)),
              backgroundColor: Colors.teal[50],
              onPressed: () => _handleSend(_quickReplies[index]),
            ),
          );
        },
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.white,
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(color: Colors.grey[100], borderRadius: BorderRadius.circular(24)),
                child: TextField(
                  controller: _controller,
                  onSubmitted: (_) => _handleSend(),
                  decoration: const InputDecoration(hintText: "Send a message...", border: InputBorder.none),
                ),
              ),
            ),
            const SizedBox(width: 8),
            IconButton(
              icon: const Icon(Icons.send, color: Colors.teal),
              onPressed: _handleSend,
            ),
          ],
        ),
      ),
    );
  }
}
