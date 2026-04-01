import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Get current user
  User? get currentUser => _auth.currentUser;

  // Auth state changes stream
  Stream<User?> get user => _auth.authStateChanges();

  // Sign in with Google (Direct Firebase & GoogleSignIn Implementation)
  Future<User?> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await GoogleSignIn().signIn();
      if (googleUser == null) return null;
      
      final googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final userCred = await _auth.signInWithCredential(credential);
      
      // Ensure user profile exists in Firestore after Google Sign-In
      final userDoc = await _db.collection('users').doc(userCred.user!.uid).get();
      if (!userDoc.exists) {
        await _db.collection('users').doc(userCred.user!.uid).set({
          'uid': userCred.user!.uid,
          'name': userCred.user!.displayName ?? 'Luna Partner',
          'email': userCred.user!.email ?? '',
          'partnerId': '', 
          'createdAt': FieldValue.serverTimestamp(),
          'photoUrl': userCred.user!.photoURL ?? '',
        });
      }
      
      return userCred.user;
    } catch (e) {
      print("AUTH: PartnersApp Google Sign-In Error: $e");
      return null;
    }
  }

  // Sign in with email and password (Direct Firebase Implementation)
  Future<User?> login(String email, String password) async {
    try {
      final cred = await _auth.signInWithEmailAndPassword(email: email, password: password);
      return cred.user;
    } catch (e) {
      print("AUTH: PartnersApp Login Error: $e");
      return null;
    }
  }

  // Register with email and password
  Future<UserCredential?> signUp(String email, String password, String username) async {
    try {
      UserCredential result = await _auth.createUserWithEmailAndPassword(email: email, password: password);
      
      // Create a user profile in Firestore using the requested schema
      await _db.collection('users').doc(result.user!.uid).set({
        'uid': result.user!.uid,
        'name': username,
        'email': email,
        'partnerId': '', // Initialized empty, linked via partner code
        'createdAt': FieldValue.serverTimestamp(),
        'photoUrl': '',
      });
      return result;
    } catch (e) {
      print("AUTH: PartnersApp Signup Error: $e");
      return null;
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }
}
