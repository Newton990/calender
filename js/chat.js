document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('msg-send-btn');
    const suggestionContainer = document.getElementById('ai-suggestion-chips');

    // 1. Firebase Initial Logic
    const urlParams = new URLSearchParams(window.location.search);
    const partnerId = "partner_123"; // Mock partner link
    let chatId = null;
    let currentUser = null;

    firebase.auth().onAuthStateChanged(user => {
        if (!user) return;
        currentUser = user;
        chatId = [user.uid, partnerId].sort().join('_');
        
        loadRealtimeLogs();
        listenTypingStatus();
        updateChatBackground();
        fetchUserContextForSuggestions();
        handlePrefill();
    });

    function handlePrefill() {
        const prefill = urlParams.get('prefill');
        const prefillMap = {
            'love': "Thinking of you! ❤️",
            'help': "Can I help with anything? 🤝",
            'flowers': "Sent you virtual flowers! 💐",
            'tea': "I'm making tea. Want a cup? 🍵"
        };
        if (prefill && prefillMap[prefill]) {
            chatInput.value = prefillMap[prefill];
            // Auto-send if it's a quick gesture
            setTimeout(handleSend, 500);
        }
    }

    async function addMsg(text, imageUrl = null, audioUrl = null) {
        if (!chatId || !currentUser) return;

        const msgData = {
            chatId,
            senderId: currentUser.uid,
            senderEmail: currentUser.email,
            text,
            imageUrl,
            audioUrl,
            status: 'sent',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        await firebase.firestore().collection('chats').doc(chatId).collection('messages').add(msgData);
    }

    function renderMsg(msg, docId) {
        const div = document.createElement('div');
        const type = msg.senderId === currentUser.uid ? 'sent' : 'received';
        div.className = `msg ${type}`;
        
        let content = msg.text;
        if (msg.imageUrl) content += `<br><img src="${msg.imageUrl}" style="max-width: 100%; border-radius: 10px; margin-top: 5px;">`;
        
        // Status indicator (Read Receipts)
        let statusHtml = '';
        if (type === 'sent') {
            if (msg.status === 'sent') statusHtml = '<span class="status">✔</span>';
            else if (msg.status === 'delivered') statusHtml = '<span class="status">✔✔</span>';
            else if (msg.status === 'seen') statusHtml = '<span class="status">💖</span>';
        }

        div.innerHTML = `${content} <div class="msg-meta">${statusHtml}</div>`;
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        // Mark as seen if received
        if (type === 'received' && msg.status !== 'seen') {
            firebase.firestore().collection('chats').doc(chatId).collection('messages').doc(docId).update({ status: 'seen' });
        }
    }

    function loadRealtimeLogs() {
        firebase.firestore().collection('chats').doc(chatId).collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot(snapshot => {
                chatWindow.innerHTML = '';
                snapshot.forEach(doc => renderMsg(doc.data(), doc.id));
            });
    }

    function listenTypingStatus() {
        // Shared typing indicator using doc metadata
        firebase.firestore().collection('chats').doc(chatId).onSnapshot(doc => {
            if (doc.exists && doc.data().typing && doc.data().typing !== currentUser.uid) {
                document.getElementById('typing-indicator').classList.remove('hidden');
            } else {
                document.getElementById('typing-indicator').classList.add('hidden');
            }
        });

        chatInput.addEventListener('input', () => {
            firebase.firestore().collection('chats').doc(chatId).set({ typing: currentUser.uid }, { merge: true });
            clearTimeout(window.typingTimer);
            window.typingTimer = setTimeout(() => {
                firebase.firestore().collection('chats').doc(chatId).set({ typing: null }, { merge: true });
            }, 2000);
        });
    }

    function updateChatBackground() {
        const theme = document.body.getAttribute('data-theme') || 'blush';
        const chatContainer = document.querySelector('.chat-wrapper');
        if (chatContainer) {
            chatContainer.style.background = `var(--bg-${theme})`;
            // Add emotion-layered overlay
            chatContainer.classList.add(`chat-mood-${theme}`);
        }
    }

    async function fetchUserContextForSuggestions() {
        if (!currentUser) return;
        const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            renderAISuggestions(userDoc.data());
        }
    }

    function renderAISuggestions(userData) {
        const periods = userData.periods || [];
        const cycleLen = userData.cycleLength || 28;
        
        if (periods.length === 0) return;

        const lastPeriod = new Date(periods[periods.length - 1]);
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
        addMsg(text);
        chatInput.value = '';
        firebase.firestore().collection('chats').doc(chatId).set({ typing: null }, { merge: true });
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    renderAISuggestions();
});
