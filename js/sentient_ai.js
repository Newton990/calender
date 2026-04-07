/**
 * Sentient AI Context Engine
 * Aggregates user state for emotionally intelligent responses.
 */
const SentientAI = {
    async getContext(user) {
        if (!user) return null;

        // 1. Basic Profile
        const profile = JSON.parse(localStorage.getItem(`profile_${user.email}`)) || { nickname: "New Luna User" };
        
        // 2. Cycle Phase
        const periods = JSON.parse(localStorage.getItem(`periods_${user.email}`)) || [];
        const cycleLength = JSON.parse(localStorage.getItem(`cycleLength_${user.email}`)) || 28;
        const phase = this._calculatePhase(periods, cycleLength);

        // 3. Latest Mood
        const symptoms = JSON.parse(localStorage.getItem(`symptoms_${user.email}`)) || {};
        const latestMood = this._getLatestMood(symptoms);

        // 4. Recent Chat Sentiment (Optional: Could fetch last 3 messages from Firestore)
        // For now, simpler sync from local session
        const chatSnippet = "Stable";

        return {
            nickname: profile.nickname,
            phase: phase,
            mood: latestMood,
            sentiment: chatSnippet,
            isSensitivePhase: (phase === 'Luteal' || phase === 'Menstrual')
        };
    },

    _calculatePhase(periods, cycleLength) {
        if (periods.length === 0) return "Unknown";
        const lastPeriod = window.parseDateLocal(periods[periods.length - 1]);
        const today = new Date();
        const diff = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
        
        if (diff < 5) return "Menstrual";
        if (diff < 12) return "Follicular";
        if (diff < 16) return "Ovulation";
        return "Luteal";
    },

    _getLatestMood(symptoms) {
        const dates = Object.keys(symptoms).sort().reverse();
        for (let date of dates) {
            if (symptoms[date].mood) return symptoms[date].mood;
        }
        return "Calm";
    }
};
