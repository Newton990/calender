class User {
  String id;
  String username;
  String nickname; // Optional: their cute nickname for you

  User({required this.id, required this.username, this.nickname = ''});
  
  String get displayName => nickname.isNotEmpty ? nickname : username;
}
