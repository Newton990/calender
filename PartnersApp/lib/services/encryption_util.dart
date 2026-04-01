import 'package:encrypt/encrypt.dart';

class EncryptionUtil {
  static final Key _key = Key.fromUtf8('32characterslongsecretkey!!');
  static final IV _iv = IV.fromLength(16);

  static final _encrypter = Encrypter(AES(_key));

  /// Encrypts plain text to a Base64 string
  static String encryptText(String text) {
    if (text.isEmpty) return text;
    try {
      final encrypted = _encrypter.encrypt(text, iv: _iv);
      return encrypted.base64;
    } catch (e) {
      print("ENCRYPT: PartnersApp Error encrypting text: $e");
      return text;
    }
  }

  /// Decrypts a Base64 encrypted string back to plain text.
  /// Falls back to original text if decryption fails (for legacy messages).
  static String decryptText(String encryptedBase64) {
    if (encryptedBase64.isEmpty) return encryptedBase64;
    try {
      final decrypted = _encrypter.decrypt64(encryptedBase64, iv: _iv);
      return decrypted;
    } catch (e) {
      // Fallback for unencrypted messages or decryption errors
      print("ENCRYPT: PartnersApp Decryption failed: $e");
      return encryptedBase64;
    }
  }
}
