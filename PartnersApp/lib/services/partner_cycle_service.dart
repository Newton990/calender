class PartnerCycleService {
  final int averageCycleLength;
  final int averagePeriodLength;

  PartnerCycleService({
    this.averageCycleLength = 28,
    this.averagePeriodLength = 5,
  });

  Map<String, String> getPartnerInsights(DateTime lastPeriodDate) {
    final today = DateTime.now();
    final cleanToday = DateTime(today.year, today.month, today.day);
    final cleanLastPeriod = DateTime(lastPeriodDate.year, lastPeriodDate.month, lastPeriodDate.day);
    
    final diffDays = cleanToday.difference(cleanLastPeriod).inDays;
    final currentDay = (diffDays % averageCycleLength) + 1;

    if (currentDay <= averagePeriodLength) {
      return {
        "phase": "Menstrual Phase 🌸",
        "alert": "Period is active",
        "tipTitle": "Empathy & Comfort",
        "tipDesc": "Your partner might have cramps and low energy. A warm tea and some extra rest will go a long way. 🍵",
        "bonusTip": "Offer to handle some chores today. She'll appreciate the extra care! ✨",
      };
    } else if (currentDay < 12) {
      return {
        "phase": "Follicular Phase ✨",
        "alert": "Energy is rising",
        "tipTitle": "Active Support",
        "tipDesc": "She's likely feeling more social and energetic. Great time for a walk or starting a new fun activity together. 🏃‍♀️",
        "bonusTip": "Her creativity is peaking! Ask her about her new ideas. 💡",
      };
    } else if (currentDay >= 12 && currentDay <= 16) {
      return {
        "phase": "Ovulation Phase 🔥",
        "alert": "Peak Fertility Window",
        "tipTitle": "Connection Time",
        "tipDesc": "Confidence and mood are high! Plan a date night or spend quality time connecting. 💖",
        "bonusTip": "She's likely feeling her most radiant. Compliment her! 🌟",
      };
    } else {
      final daysToPeriod = averageCycleLength - currentDay + 1;
      return {
        "phase": "Luteal Phase 🌙",
        "alert": "Period in $daysToPeriod days",
        "tipTitle": "Patience & Care",
        "tipDesc": "Her hormones are shifting. She might feel extra sensitive or tired. Be a listening ear and offer gentle support. 🧸",
        "bonusTip": "Maybe bring some dark chocolate or her favorite comfort snack. 🍫",
      };
    }
  }

  /// Gets a nudge message for the partner based on the cycle day.
  String? getPartnerNudge(DateTime lastPeriodDate) {
    final today = DateTime.now();
    final cleanToday = DateTime(today.year, today.month, today.day);
    final cleanLastPeriod = DateTime(lastPeriodDate.year, lastPeriodDate.month, lastPeriodDate.day);
    
    final diffDays = cleanToday.difference(cleanLastPeriod).inDays;
    final currentDay = (diffDays % averageCycleLength) + 1;

    if (currentDay > 22 && currentDay < 28) {
      return "Your partner's PMS might be starting soon. Send a sweet note or bring some comfort home? 🌙";
    } else if (currentDay >= 12 && currentDay <= 15) {
      return "It's a high fertility day. Plan something special for your connection time! ✨";
    }
    return null;
  }

  /// Pregnancy insights for partners
  Map<String, String> getPregnancyInsights(int weeks) {
    final Map<int, Map<String, String>> pregnancyTips = {
      4: {
        'title': 'The Journey Begins! 🌱',
        'desc': 'She might not even know yet, but her body is working hard. Be extra supportive and patient.',
        'bonus': 'Buy some ginger tea just in case morning sickness starts early.'
      },
      8: {
        'title': 'Tiny but Mighty 🍓',
        'desc': 'Baby is the size of a raspberry! Her hormone levels are peaking, which can lead to fatigue.',
        'bonus': 'Take over more household chores this week so she can rest.'
      },
      12: {
        'title': 'Second Trimester Near 🍋',
        'desc': 'The "glow" is coming soon. Her energy levels might start to stabilize.',
        'bonus': 'Plan a low-key date night to celebrate this milestone.'
      },
      16: {
        'title': 'Feeling the Flutters 🥑',
        'desc': 'Baby is moving! It might feel like butterflies to her.',
        'bonus': 'Ask her how the baby is moving today.'
      },
      20: {
        'title': 'Halfway Point! 🍌',
        'desc': 'You are halfway there. Baby can hear sounds now!',
        'bonus': 'Talk to the baby bump. Research shows they recognize voices!'
      },
      28: {
        'title': 'Third Trimester 🍆',
        'desc': 'Her back might be aching as baby grows. She might be feeling more breathless.',
        'bonus': 'Offer a back rub or a foot massage every night.'
      },
      36: {
        'title': 'Final Countdown 🥭',
        'desc': 'The hospital bag should be ready! Baby is almost here.',
        'bonus': 'Keep the car gassed up and your phone charged at all times.'
      },
      40: {
        'title': 'Any Day Now! 🍉',
        'desc': 'Stay close and stay calm. You are going to be a great support team.',
        'bonus': 'Tell her how proud you are of her strength.'
      }
    };

    // Find closest week match
    int closest = 4;
    for (var w in pregnancyTips.keys) {
      if (weeks >= w) closest = w;
      else break;
    }

    return pregnancyTips[closest]!;
  }
}
