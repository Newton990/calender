import '../models/app_mode.dart';
import '../models/mood.dart';
import '../models/partner_style.dart';

class LogicEngine {
  static String getUserInsight(AppMode mode, Mood mood) {
    if (mode == AppMode.period) {
      if (mood == Mood.irritated) return "She might be feeling extra sensitive today. 🕊️ A little extra patience goes a long way.";
      if (mood == Mood.sad) return "She's feeling a bit low. 🕯️ Your presence and a listening ear are her best medicine right now.";
      return "She's in a stable phase. ✨ A great time for a date night or a deep conversation.";
    }

    if (mode == AppMode.trying) {
      return "Fertile window – high hope! 💕 Support her emotionally and stay connected.";
    }

    if (mode == AppMode.pregnancy) {
      return "She's growing a miracle! 🍼 Help her with the little things today.";
    }

    return "Stay in sync with her rhythm. You're doing great, Partner! ✨";
  }

  static Map<String, int> getThemeColors(Mood mood) {
    switch (mood) {
      case Mood.happy:
        return {
          'primary': 0xFFFF8C69, // Soft Coral
          'card': 0xFFFFD1DC,    // Blush Pink
          'accent': 0xFFFFDAB9,  // Peach Glow
          'bg': 0xFFFFFDF5       // Creamy Ivory
        };
      case Mood.sad:
      case Mood.irritated:
        return {
          'primary': 0xFF7209B7, // Midnight Violet
          'card': 0xFF915F6D,    // Dusty Plum
          'accent': 0xFF3C096C,
          'bg': 0xFF2E004B       // Darker Background
        };
      case Mood.neutral:
      default:
        return {
          'primary': 0xFFFF8C69,
          'card': 0xFFFFD1DC,
          'accent': 0xFFE6E6FA, // Lavender
          'bg': 0xFFFFFDF5
        };
    }
  }

  static String getPartnerAdvice(AppMode mode, Mood mood, PartnerStyle style) {
    if (style == PartnerStyle.masculine) {
      if (mode == AppMode.period && mood == Mood.irritated) {
        return "Avoid arguments today. Give her some extra space and comfort. 🕯️ She's in a sensitive phase.";
      }
      if (mode == AppMode.trying) {
        return "Initiate intimacy today. High chance of success! 💖 Be romantic and present.";
      }
      if (mode == AppMode.pregnancy) {
        return "Assist her with physical tasks. Reduce her daily stress. 🤝 She needs your strength.";
      }
    } else {
      if (mode == AppMode.period && mood == Mood.irritated) {
        return "She may feel overwhelmed 💜 Be gentle and offer a listening ear. A small treat might brighten her day.";
      }
      if (mode == AppMode.trying) {
        return "This is a hopeful phase 💕 Support her emotionally and stay connected in the journey.";
      }
      if (mode == AppMode.pregnancy) {
        return "She needs comfort and care today. A little pampering goes a long way. 🍼 Celebrate her!";
      }
    }

    return "Be a soulful partner and stay in sync with her emotional needs. ❤️";
  }
}
