class AuthService {
  // Simplified auth service for Partners App
  bool _isLoggedIn = false;

  bool get isLoggedIn => _isLoggedIn;

  Future<bool> login(String partnerId, String accessToken) async {
    // Mock authentication logic
    await Future.delayed(const Duration(seconds: 1));
    if (partnerId.isNotEmpty && accessToken.length > 5) {
      _isLoggedIn = true;
      return true;
    }
    return false;
  }

  void logout() {
    _isLoggedIn = false;
  }
}
