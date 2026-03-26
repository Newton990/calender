class Partnership {
  final String userId;
  final String partnerId;
  final String nicknameForPartner;
  final String nicknameFromPartner;

  Partnership({
    required this.userId,
    required this.partnerId,
    required this.nicknameForPartner,
    required this.nicknameFromPartner,
  });

  factory Partnership.fromJson(Map<String, dynamic> json) {
    return Partnership(
      userId: json['userId'],
      partnerId: json['partnerId'],
      nicknameForPartner: json['nicknameForPartner'],
      nicknameFromPartner: json['nicknameFromPartner'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'partnerId': partnerId,
      'nicknameForPartner': nicknameForPartner,
      'nicknameFromPartner': nicknameFromPartner,
    };
  }

  /// Returns the nickname the current user has for the partner.
  String getNickname(String currentUserId) {
    if (currentUserId == userId) {
      return nicknameForPartner;
    } else {
      return nicknameFromPartner;
    }
  }
}
