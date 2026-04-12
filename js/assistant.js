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

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.innerHTML = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Context helpers moved to SentientAI module

    function detectMood(q) {
        const moods = {
            anxious: ['anxious', 'worried', 'stressed', 'nervous', 'scared'],
            sad: ['sad', 'down', 'unhappy', 'crying', 'depressed', '😔', '😢'],
            irritated: ['irritated', 'angry', 'mad', 'cranky', 'annoyed', '😠', '😡'],
            tired: ['tired', 'exhausted', 'fatigue', 'sleepy', '😴'],
            happy: ['happy', 'great', 'good', 'amazing', 'excited', '😊', '❋']
        };

        for (const [mood, keywords] of Object.entries(moods)) {
            if (keywords.some(k => q.includes(k))) return mood;
        }
        return null;
    }

    function generateAIResponse(query) {
        const q = query.toLowerCase();
        const context = userContext || { nickname: "there", phase: "Follicular", mood: "Calm" };
        
        let response = "";

        // Emotional Intelligence Check
        const isHeartbreakMode = q.includes('breakup') || q.includes('heartbreak') || q.includes('argument') || q.includes('lonely');
        
        if (isHeartbreakMode) {
            response = `I'm so sorry you're hurting, ${context.nickname}. 🕊️ Remember, you're not alone, even at 2am. It's okay to feel this way. With your cycle in the ${context.phase} phase, emotions can sometimes feel even more intense. Want to tell me more about what's on your heart?`;
        } 
        else if (q.includes('mood') || q.includes('feeling')) {
            response = `I see you logged a **${context.mood}** mood recently. In your **${context.phase}** phase, it's very common to feel this way. How can I help you feel more comfortable right now? Maybe a warm tea or some quiet music? 🌸`;
        }
        else if (q.includes('cramp') || q.includes('period') || q.includes('hormone')) {
            response = `Dealing with ${context.phase} phase shifts is tough. 🌿 As your soulful companion, I want to remind you to take it slow. Have you tried a magnesium-rich snack or a light walk? Your health comes first, queen. ❋`;
        }
        else {
            response = `I hear you, ${context.nickname}. ❋ It's interesting you mention that while you're in your **${context.phase}** phase. I'm here to listen and learn with you. What else is on your mind?`;
        }

        return response;
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
