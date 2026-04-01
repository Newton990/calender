import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:io';

class PartnerSyncService {

  static const String _sharedPath = 'c:/Users/user/Desktop/calender/shared_state.json';

  /// Pulls the user's cycle and pregnancy data for the partner dashboard (Simulated)
  Future<void> pullPartnerData() async {
    try {
      final file = File(_sharedPath);
      if (!file.existsSync()) return;
      final content = await file.readAsString();
      final Map<String, dynamic> data = jsonDecode(content);
      
      final prefs = await SharedPreferences.getInstance();
      
      // Update partner keys
      if (data['period_dates'] != null) {
        final List<String> dates = List<String>.from(data['period_dates']);
        if (dates.isNotEmpty) {
          await prefs.setString('partner_last_period', dates.last);
        }
      }
      await prefs.setBool('partner_is_pregnant', data['is_pregnant'] ?? false);
      if (data['pregnancy_start_date'] != null) {
        await prefs.setString('partner_pregnancy_start_date', data['pregnancy_start_date']);
      }
      if (data['water_intake'] != null) {
        await prefs.setInt('partner_water_intake', data['water_intake']);
      }

      // Sync wellness logs for reports
      if (data['wellness_logs'] != null) {
        final List<String> wellness = List<String>.from(data['wellness_logs']);
        await prefs.setStringList('partner_wellness_logs', wellness);
      }
      
      print("SYNC: PartnerApp pulled latest shared data (Cycle & Wellness).");
    } catch (e) {
      print("SYNC Partner Pull Error: $e");
    }
  }
}
