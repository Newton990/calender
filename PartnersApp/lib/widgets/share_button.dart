import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';

class ShareAppButton extends StatelessWidget {
  final String appName;
  final String appLink; // Play Store / App Store / website link

  const ShareAppButton({required this.appName, required this.appLink, Key? key}) : super(key: key);

  void _shareApp() {
    Share.share(
      'Check out $appName! Download here: $appLink',
      subject: 'Join me on $appName',
    );
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: _shareApp,
      icon: const Icon(Icons.share),
      label: Text('Share $appName'),
    );
  }
}
