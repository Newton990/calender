import '../models/app_mode.dart';
import '../models/mood.dart';
import '../models/partner_style.dart';

class LogicEngine {
  static String getUserInsight(AppMode mode, Mood mood) {
    if (mode == AppMode.period) {
      if (mood == Mood.irritated) return "PMS phase – emotions heightened. Be extra kind to yourself today. 🌸";
      if (mood == Mood.sad) return "Low mood – rest is important. A warm bath or quiet time might help. 🕯️";
      return "Stable cycle phase. You're doing great! ✨";
    }

    if (mode == AppMode.trying) {
      return "Fertile window – high conception chance. Focus on connection and joy. 💕";
    }

    if (mode == AppMode.pregnancy) {
      return "Body is adapting – take it slow. Your little one is growing! 🍼";
    }

    return "Looking good! Keep tracking your journey.";
  }

  static String getPartnerAdvice(AppMode mode, Mood mood, PartnerStyle style) {
    if (style == PartnerStyle.masculine) {
      if (mode == AppMode.period && mood == Mood.irritated) {
        return "Avoid arguments today. Give her some extra space and comfort. 🕯️";
      }
      if (mode == AppMode.trying) {
        return "Initiate intimacy today. High chance of success! 💖";
      }
      if (mode == AppMode.pregnancy) {
        return "Assist her with physical tasks. Reduce her daily stress. 🤝";
      }
    } else {
      if (mode == AppMode.period && mood == Mood.irritated) {
        return "She may feel overwhelmed 💜 Be gentle and offer a listening ear.";
      }
      if (mode == AppMode.trying) {
        return "This is a hopeful phase 💕 Support her emotionally and stay connected.";
      }
      if (mode == AppMode.pregnancy) {
        return "She needs comfort and care today. A little pampering goes a long way. 🍼";
      }
    }

    return "Be a supportive partner and stay in sync with her needs. ❤️";
  }
}
