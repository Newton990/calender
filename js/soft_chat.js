document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('New LunaSession') || 'demo_user';
    
    const chatList = document.getElementById('chatList');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const suggestionBar = document.querySelector('.suggestion-bar');

    const partnerId = "partner_123"; // Mock partner link
    const chatId = [currentUser, partnerId].sort().join('_');

    function renderMsg(msg) {
        const isMe = msg.senderId === currentUser;
        const div = document.createElement('div');
        div.className = `message-bubble ${isMe ? 'me' : 'partner'}`;
        
        const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        div.innerHTML = `
            ${msg.text}
            <div class="message-time">${time}${isMe ? ' • SENT' : ''}</div>
        `;
        
        chatList.appendChild(div);
        chatList.scrollTop = chatList.scrollHeight;
    }

    function loadLogs() {
        const storageKey = `chats/${chatId}/messages`;
        const messages = JSON.parse(localStorage.getItem(storageKey)) || [];
        chatList.innerHTML = '';
        
        // Initial Mock Message if empty
        if (messages.length === 0) {
            const mock = {
                senderId: partnerId,
                text: "Hi! How are you feeling today? I saw you might be starting your luteal phase soon. ❤️",
                timestamp: new Date().getTime() - 600000
            };
            messages.push(mock);
        }
        
        messages.forEach(renderMsg);
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        const msg = {
            messageId: "msg_" + new Date().getTime(),
            chatId,
            senderId: currentUser,
            text,
            timestamp: new Date().getTime()
        };

        // Save to logs
        const storageKey = `chats/${chatId}/messages`;
        const messages = JSON.parse(localStorage.getItem(storageKey)) || [];
        messages.push(msg);
        localStorage.setItem(storageKey, JSON.stringify(messages));
        
        renderMsg(msg);
        chatInput.value = '';
        
        // Mock partner reply after 2 seconds
        setTimeout(() => {
            const reply = {
                messageId: "msg_reply_" + new Date().getTime(),
                chatId,
                senderId: partnerId,
                text: "I'm right here if you need anything. ✨",
                timestamp: new Date().getTime()
            };
            messages.push(reply);
            localStorage.setItem(storageKey, JSON.stringify(messages));
            renderMsg(reply);
        }, 2000);
    }

    function initSuggestions() {
        // Mock suggestions for Soft UI
        const chips = ["❤️ Send Love", "🤝 Can I help?", "💐 Flowers", "🌙 Goodnight"];
        suggestionBar.innerHTML = '';
        
        chips.forEach(text => {
            const chip = document.createElement('div');
            chip.className = 'suggestion-chip';
            chip.textContent = text;
            chip.onclick = () => {
                chatInput.value = text;
                handleSend();
            };
            suggestionBar.appendChild(chip);
        });
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    loadLogs();
    initSuggestions();
});
