document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('NewLunaSession');
    if (!currentUser) return;

    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const suggestions = document.getElementById('suggestions');
    const voiceBtn = document.getElementById('voice-btn');

    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            voiceBtn.textContent = '🛑';
            voiceBtn.style.color = 'var(--primary)';
            addMessage("<i>Listening... (Simulation)</i>", 'user');
            setTimeout(() => {
                voiceBtn.textContent = '🎤';
                voiceBtn.style.color = '';
                addMessage("I'm sorry, I couldn't hear you clearly. Could you try typing that for me? 🌸", 'ai');
            }, 2000);
        });
    }

    // Load cycle context for "AI" smarts
    const stats = {
        periods: JSON.parse(localStorage.getItem(`periods_${currentUser}`)) || [],
        cycleLength: JSON.parse(localStorage.getItem(`cycleLength_${currentUser}`)) || 28,
        isPregnant: JSON.parse(localStorage.getItem(`isPregnant_${currentUser}`)) || false
    };

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.innerHTML = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getCyclePhase() {
        if (stats.isPregnant) return "Pregnancy";
        if (stats.periods.length === 0) return "Unknown";
        
        const lastPeriod = window.parseDateLocal(stats.periods[stats.periods.length - 1]);
        const today = new Date();
        const diff = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
        
        if (diff < 5) return "Menstrual";
        if (diff < 12) return "Follicular";
        if (diff < 16) return "Ovulation";
        return "Luteal";
    }

    function detectMood(q) {
        const moods = {
            anxious: ['anxious', 'worried', 'stressed', 'nervous', 'scared'],
            sad: ['sad', 'down', 'unhappy', 'crying', 'depressed', '😔', '😢'],
            irritated: ['irritated', 'angry', 'mad', 'cranky', 'annoyed', '😠', '😡'],
            tired: ['tired', 'exhausted', 'fatigue', 'sleepy', '😴'],
            happy: ['happy', 'great', 'good', 'amazing', 'excited', '😊', '✨']
        };

        for (const [mood, keywords] of Object.entries(moods)) {
            if (keywords.some(k => q.includes(k))) return mood;
        }
        return null;
    }

    function generateAIResponse(query) {
        const q = query.toLowerCase();
        const phase = getCyclePhase();
        const mood = detectMood(q);

        let response = {
            acknowledgment: "",
            validation: "",
            action: "",
            reinforcement: ""
        };

        // --- Core Knowledge Base & Empathetic Logic ---

        // 1. Anxiety / Stress / Mood Support
        if (mood === 'anxious' || q.includes('worry')) {
            response.acknowledgment = "I can hear that you're feeling a bit anxious today. 😔";
            response.validation = phase === 'Luteal' || phase === 'Menstrual' 
                ? "It's completely natural—hormonal shifts in your " + phase + " phase can often make us feel more sensitive or on edge."
                : "It's okay to feel this way; our bodies and minds go through so much every day.";
            response.action = "Try focusing on your breath for just 2 minutes, or maybe some gentle stretching. It helps quiet the noise.";
            response.reinforcement = "You're doing great, and this feeling will pass. I'm right here with you. 💛";
        }
        
        // 2. Tired / Fatigue
        else if (mood === 'tired' || q.includes('energy')) {
            response.acknowledgment = "I see you're feeling a little drained today. 😴";
            response.validation = phase === 'Luteal' 
                ? "Your metabolism actually speeds up during the Luteal phase, which can leave you feeling extra tired. Your body is working hard!"
                : "Rest is a productive activity too. Your body is telling you it needs a little recharge.";
            response.action = "Maybe try a short 15-minute power nap or an extra glass of water with lemon for a natural boost.";
            response.reinforcement = "Be gentle with yourself today. You deserve the rest! ✨";
        }

        // 3. Cramps / Pain
        else if (q.includes('cramp') || q.includes('pain') || q.includes('hurt')) {
            response.acknowledgment = "I'm so sorry you're dealing with cramps right now. 😔";
            response.validation = "Cramps can be so disruptive, and it's frustrating when they get in the way of your day.";
            response.action = "A warm compress or some ginger tea can really help relax those muscles. Gentle movements like 'child's pose' are also great.";
            response.reinforcement = "Hang in there—you're so strong, and this discomfort is only temporary. 💪💛";
        }

        // 4. Period / Cycle Predictions
        else if (q.includes('late') || q.includes('when') || q.includes('period')) {
            const periods = stats.periods;
            if (periods.length > 0) {
                response.acknowledgment = "Let me check your cycle history for you... 🔍";
                response.validation = "It looks like you're right on track based on your typical " + stats.cycleLength + "-day cycle. However, small shifts due to stress or travel are totally normal!";
                response.action = "Keep logging your moods—it helps me give you even more accurate insights!";
                response.reinforcement = "Your body has its own unique rhythm, and you're doing an amazing job listening to it. ✨";
            } else {
                response.acknowledgment = "I'd love to help with that! 🌸";
                response.validation = "Since we don't have much history logged yet, my predictions are still learning about you.";
                response.action = "Try to mark your last few period start dates in the calendar to get things started.";
                response.reinforcement = "Every piece of data helps us understand your beautiful rhythm better. 💛";
            }
        }

        // 5. Cravings / Food
        else if (q.includes('crav') || q.includes('eat') || q.includes('chocolate')) {
            response.acknowledgment = "Aha, those cravings are talking! 🍫";
            response.validation = "During the " + phase + " phase, your body might crave more calories or specific treats. It's not just you—it's biology!";
            response.action = "Go ahead and enjoy that treat, or try some dark chocolate and magnesium-rich nuts for a balanced boost.";
            response.reinforcement = "Listening to your body's needs is a form of self-love. Enjoy every bite! ✨";
        }

        // Fallback / General Conversation
        else {
            response.acknowledgment = "That's a great question! I'm listening. ✨";
            response.validation = "It's so important to stay curious about our health and how we feel.";
            response.action = "While I'm still learning, focusing on hydration and mindful rest is always a winning strategy.";
            response.reinforcement = "Is there anything else on your mind? I'm here to support you in any way I can. 💛";
        }

        // Combine for a natural, flowing response
        return `${response.acknowledgment}<br><br>${response.validation}<br><br>${response.action}<br><br>${response.reinforcement}`;
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        // Show "typing"
        const typing = document.createElement('div');
        typing.classList.add('message', 'ai');
        typing.textContent = '...';
        chatMessages.appendChild(typing);

        setTimeout(() => {
            chatMessages.removeChild(typing);
            const response = generateAIResponse(text);
            addMessage(response, 'ai');
        }, 800);
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    if(suggestions) {
        suggestions.addEventListener('click', (e) => {
            if (e.target.classList.contains('chip')) {
                chatInput.value = e.target.textContent;
                handleSend();
            }
        });
    }
});
