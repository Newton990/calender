document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('NewLunaSession');
    if (!currentUser) return;

    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('msg-send-btn');
    const suggestionContainer = document.getElementById('ai-suggestion-chips');

    // 1. Initial Logic
    const urlParams = new URLSearchParams(window.location.search);
    const prefill = urlParams.get('prefill');
    if (prefill) {
        const texts = {
            'love': "Thinking of you! I love you. ❤️",
            'help': "I'm here for you! How can I help today? 🤝",
            'flowers': "Sending you some virtual flowers! 💐"
        };
        chatInput.value = texts[prefill] || "";
    }

    function addMsg(text, type) {
        const div = document.createElement('div');
        div.className = `msg ${type === 'sent' ? 'sent' : 'received'}`;
        div.textContent = text;
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        
        // Save to log
        const logs = JSON.parse(localStorage.getItem(`chat_logs_${currentUser}`)) || [];
        logs.push({ text, type, time: new Date().getTime() });
        localStorage.setItem(`chat_logs_${currentUser}`, JSON.stringify(logs));
    }

    function loadLogs() {
        const logs = JSON.parse(localStorage.getItem(`chat_logs_${currentUser}`)) || [];
        chatWindow.innerHTML = '';
        logs.forEach(msg => {
            const div = document.createElement('div');
            div.className = `msg ${msg.type === 'sent' ? 'sent' : 'received'}`;
            div.textContent = msg.text;
            chatWindow.appendChild(div);
        });
        chatWindow.scrollTop = chatWindow.scrollHeight;
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
        addMsg(text, 'sent');
        chatInput.value = '';
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    loadLogs();
    renderAISuggestions();
    window.addEventListener('storage', loadLogs);
});
