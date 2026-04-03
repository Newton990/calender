document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('New LunaSession');
    if (!currentUser) return;

    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('msg-send-btn');
    const suggestionContainer = document.getElementById('ai-suggestion-chips');

    // 1. Initial Logic & Schema Simulation
    const urlParams = new URLSearchParams(window.location.search);
    const prefill = urlParams.get('prefill');
    
    // Deterministic ChatID Simulation
    function getChatId(uid1, uid2) {
        return [uid1, uid2].sort().join('_');
    }
    
    const partnerId = "partner_123"; // Mock partner link
    const chatId = getChatId(currentUser, partnerId);

    function addMsg(text, senderId, imageUrl = null, audioUrl = null) {
        const messageId = "msg_" + new Date().getTime();
        const msg = {
            messageId,
            chatId,
            senderId,
            text,
            imageUrl,
            audioUrl,
            timestamp: new Date().getTime()
        };

        // Save to logs (Simulating Firestore subcollection: chats/{chatId}/messages)
        const storageKey = `chats/${chatId}/messages`;
        const messages = JSON.parse(localStorage.getItem(storageKey)) || [];
        messages.push(msg);
        localStorage.setItem(storageKey, JSON.stringify(messages));
        
        renderMsg(msg);
    }

    function renderMsg(msg) {
        const div = document.createElement('div');
        const type = msg.senderId === currentUser ? 'sent' : 'received';
        div.className = `msg ${type}`;
        
        let content = msg.text;
        if (msg.imageUrl) content += `<br><img src="${msg.imageUrl}" style="max-width: 100%; border-radius: 10px; margin-top: 5px;">`;
        if (msg.audioUrl) content += `<br><span style="font-size: 0.8rem; opacity: 0.7;">🎵 Audio message</span>`;
        
        div.innerHTML = content;
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function loadLogs() {
        const storageKey = `chats/${chatId}/messages`;
        const messages = JSON.parse(localStorage.getItem(storageKey)) || [];
        chatWindow.innerHTML = '';
        messages.forEach(renderMsg);
    }

    function renderAISuggestions() {
        const periods = JSON.parse(localStorage.getItem(`periods_${currentUser}`)) || [];
        const cycleLen = JSON.parse(localStorage.getItem(`cycleLength_${currentUser}`)) || 28;
        
        if (periods.length === 0) return;

        const lastPeriod = window.parseDateLocal(periods[periods.length - 1]);
        const today = new Date();
        const diffDays = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1;
        const currentDay = ((diffDays - 1) % cycleLen) + 1;

        suggestionContainer.innerHTML = '';
        
        let chips = [];
        if (currentDay <= 5) {
            chips = ["Rest well! ❤️", "Got you tea! 🍵", "Netflix tonight? 📺"];
        } else if (currentDay >= 12 && currentDay <= 16) {
            chips = ["You glow today! ✨", "Dinner date? 🍷", "Miss you! ❤️"];
        } else {
            chips = ["Take a breath! 🌙", "I'm listening. 👂", "You got this! 💪"];
        }

        chips.forEach(text => {
            const chip = document.createElement('div');
            chip.style = "padding: 8px 12px; background: var(--accent); color: var(--primary-dark); border-radius: 15px; font-size: 0.8rem; cursor: pointer; white-space: nowrap;";
            chip.textContent = text;
            chip.onclick = () => {
                chatInput.value = text;
                handleSend();
            };
            suggestionContainer.appendChild(chip);
        });
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;
        addMsg(text, currentUser);
        chatInput.value = '';
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    loadLogs();
    renderAISuggestions();
    window.addEventListener('storage', loadLogs);
});
