document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let userContext = null;

    firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) return;
        currentUser = user;
        userContext = await SentientAI.getContext(user);
        
        // Initial Greeting
        const greeting = `Hey ${userContext.nickname}... I'm here. ${userContext.isSensitivePhase ? "I know things can feel a bit heavier today. How are you holding up?" : "How is your day going? ❋"}`;
        addMessage(greeting, 'ai');
    });

    const chatThread = document.getElementById('soft-chat-thread');
    const chatInput = document.getElementById('soft-chat-input');
    const sendBtn = document.getElementById('soft-send-btn');
    const moodDots = document.querySelectorAll('.mood-dot');

    function addMessage(text, type = 'ai') {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}`;
        msgDiv.innerHTML = text;
        chatThread.appendChild(msgDiv);
        chatThread.scrollTop = chatThread.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai typing';
        typingDiv.innerHTML = 'Writing... 🌙';
        typingDiv.id = 'typing-indicator';
        chatThread.appendChild(typingDiv);
        chatThread.scrollTop = chatThread.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        showTypingIndicator();

        // Simulate AI Response
        setTimeout(() => {
            removeTypingIndicator();
            const response = getLunaResponse(text);
            addMessage(response, 'ai');
        }, 1500);
    }

    function getLunaResponse(userInput) {
        const input = userInput.toLowerCase();
        const context = userContext || { nickname: "there", phase: "Follicular", mood: "Calm" };
        
        // Heartbreak / Emotional Distress Mode
        const isHeartbreak = input.includes('breakup') || input.includes('heartbreak') || input.includes('lonely') || input.includes('sad');
        
        if (isHeartbreak) {
            return `I'm holding space for you, ${context.nickname}. 🕊️ It's okay to feel this way. With your cycle in the ${context.phase} phase, emotions can feel like waves. I'm right here with you, even at 2am.`;
        }

        if (input.includes('tired') || input.includes('energy')) {
            return `Low energy is common during your **${context.phase}** phase. 🌙 Try a light stretch or a 10-minute meditation, ${context.nickname}. Your body is working hard!`;
        } else if (input.includes('cramp') || input.includes('pain')) {
            return `I'm sorry you're in pain. 🌿 A warm compress and some ginger tea might help. In your **${context.phase}** phase, being gentle with yourself is the highest form of self-love.`;
        } else if (input.includes('happy') || input.includes('great')) {
            return `That's wonderful to hear, ${context.nickname}! ❋ I'm so glad you're feeling vibrant today. Let's make the most of this **${context.phase}** energy!`;
        } else {
            return `I hear you, ${context.nickname}. ❋ Tell me more about that. I'm here to support you through the **${context.phase}** phase and beyond.`;
        }
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    moodDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const mood = dot.getAttribute('title');
            addMessage(`I'm feeling ${mood.toLowerCase()} right now.`, 'user');
            
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addMessage(`Thank you for sharing your heart. 🌸 Acknowledging how you feel is the first step to wellness.`, 'ai');
            }, 1200);
        });
    });

    // Auto-scroll on load
    chatThread.scrollTop = chatThread.scrollHeight;
});
