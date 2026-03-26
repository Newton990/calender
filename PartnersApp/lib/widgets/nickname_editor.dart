import 'package:flutter/material.dart';

class NicknameEditor extends StatefulWidget {
  final String currentNickname;
  final Function(String) onSave;

  const NicknameEditor({required this.currentNickname, required this.onSave, Key? key}) : super(key: key);

  @override
  _NicknameEditorState createState() => _NicknameEditorState();
}

class _NicknameEditorState extends State<NicknameEditor> {
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.currentNickname);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Set a cute nickname'),
      content: TextField(
        controller: _controller,
        decoration: const InputDecoration(hintText: 'Enter nickname'),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
        ElevatedButton(
          onPressed: () {
            widget.onSave(_controller.text);
            Navigator.pop(context);
          },
          child: const Text('Save'),
        )
      ],
    );
  }
}
