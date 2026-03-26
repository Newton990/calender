import 'package:flutter/material.dart';
import 'package:local_auth/local_auth.dart';
import 'dashboard.dart';

class LoginScreen extends StatelessWidget {
  final LocalAuthentication auth = LocalAuthentication();

  Future<void> _loginWithBiometrics(BuildContext context) async {
    bool canCheck = await auth.canCheckBiometrics;
    if (canCheck) {
      bool authenticated = await auth.authenticate(
          localizedReason: 'Login to Luna Partners',
          options: const AuthenticationOptions(biometricOnly: true));
      if (authenticated) Navigator.pushReplacementNamed(context, '/dashboard');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          const Text('Luna Partners Login', style: TextStyle(fontSize: 24)),
          const SizedBox(height: 20),
          ElevatedButton(onPressed: () {}, child: const Text('Password')),
          ElevatedButton(onPressed: () {}, child: const Text('PIN')),
          ElevatedButton(onPressed: () {}, child: const Text('Pattern')),
          ElevatedButton(onPressed: () => _loginWithBiometrics(context), child: const Text('Biometrics')),
        ]),
      ),
    );
  }
}
