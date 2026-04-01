import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'dart:async';

class NotificationService {
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;
  
  Timer? _hourlyReminderTimer;

  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  /// Initialize Firebase Messaging and setup handlers
  Future<void> initialize() async {
    // 1. Request Permission
    NotificationSettings settings = await _fcm.requestPermission(
      alert: true,
      badge: true,
      provisional: false,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      print('PUSH: PartnersApp User granted permission');
      
      // 2. Get FCM Token
      String? token = await _fcm.getToken();
      if (token != null) {
        await _updateUserToken(token);
      }
    }

    // 3. Setup Listeners
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('PUSH: PartnersApp Received foreground message: ${message.notification?.title}');
    });

    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print('PUSH: PartnersApp Notification opened app');
    });

    // 4. Start Hourly Partner Nudges
    scheduleHourlyPartnerNudges();
  }

  /// User-requested: Schedule reminders every 60 minutes
  void scheduleHourlyPartnerNudges() {
    _hourlyReminderTimer?.cancel();
    
    _hourlyReminderTimer = Timer.periodic(const Duration(hours: 1), (timer) {
      _triggerPartnerNudge();
    });
    
    print("PUSH: PartnersApp Hourly Nudges scheduled every 60 minutes.");
  }

  void _triggerPartnerNudge() {
    // In a real app, this would use flutter_local_notifications
    // Here we simulate the nudge for the "Soft" experience
    print("PUSH: High-fidelity Partner Nudge triggered: Check in on her/him! A kind word goes a long way. ✨");
  }

  /// Update the fcmToken in the user's Firestore document
  Future<void> _updateUserToken(String token) async {
    final user = _auth.currentUser;
    if (user == null) return;

    await _db.collection('users').doc(user.uid).update({
      'fcmToken': token,
    }).catchError((e) => print("PUSH: PartnersApp Error updating token: $e"));
  }

  static Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
    print("PUSH: PartnersApp Handling a background message: ${message.messageId}");
  }

  void dispose() {
    _hourlyReminderTimer?.cancel();
  }
}
