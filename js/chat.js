document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('msg-send-btn');
    const suggestionContainer = document.getElementById('ai-suggestion-chips');

    // 1. Firebase Initial Logic & Test Bridging
    const urlParams = new URLSearchParams(window.location.search);
    let currentUser = null;
    let chatId = null;
    
    // Support Test Mode for end-to-end verification
    const isTestMode = localStorage.getItem('test_chat_mode') === 'true';
    const mockPartnerId = "test_partner_678";

    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            // No user found, redirect to login with return path
            const currentPath = window.location.pathname.split('/').pop() || 'chat.html';
            sessionStorage.setItem('returnUrl', currentPath);
            window.location.replace('login.html');
            return;
        }

        currentUser = user;
        
        // Dynamic Duo Chat ID logic
        if (isTestMode) {
            chatId = "duo_test_channel_2026";
            console.log("Chat: Test Mode Active 🧪");
        } else {
            const partnerId = localStorage.getItem('linkedPartnerId') || mockPartnerId;
            chatId = [currentUser.uid, partnerId].sort().join('_');
        }
        
        const titleEl = document.getElementById('chat-title');
        if (titleEl) titleEl.textContent = "NewLuna Duo ❋";
        
        loadRealtimeLogs();
        listenTypingStatus();
        updateChatBackground();
        fetchUserContextForSuggestions();
    });


    async function addMsg(text, imageUrl = null, audioUrl = null) {
        if (!chatId || !currentUser) return;

        const msgData = {
            chatId,
            senderId: currentUser.uid,
            senderEmail: currentUser.email,
            text,
            status: 'sent',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await firebase.firestore().collection('chats').doc(chatId).collection('messages').add(msgData);
        } catch (e) {
            console.error("Error sending message:", e);
        }
    }

    function renderMsg(msg, docId) {
        const div = document.createElement('div');
        const type = (msg.senderEmail === currentUser.email || msg.senderId === currentUser.uid) ? 'sent' : 'received';
        div.className = `msg ${type}`;
        
        let content = msg.text;
        
        // Status indicator
        let statusHtml = '';
        if (type === 'sent') {
            statusHtml = '<span class="status" style="font-size: 0.7rem; margin-left: 5px; opacity: 0.6;">✔</span>';
        }

        div.innerHTML = `${content} <div class="msg-meta" style="display:inline-block">${statusHtml}</div>`;
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function loadRealtimeLogs() {
        if (!chatId) return;
        firebase.firestore().collection('chats').doc(chatId).collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot(snapshot => {
                chatWindow.innerHTML = '';
                snapshot.forEach(doc => renderMsg(doc.data(), doc.id));
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }, err => {
                console.warn("Chat snapshot error:", err);
            });
    }

    function listenTypingStatus() {
        if (!chatId) return;
        chatInput.addEventListener('input', () => {
            firebase.firestore().collection('chats').doc(chatId).set({ typing: currentUser.uid }, { merge: true });
            clearTimeout(window.typingTimer);
            window.typingTimer = setTimeout(() => {
                firebase.firestore().collection('chats').doc(chatId).set({ typing: null }, { merge: true });
            }, 2000);
        });
    }

    function updateChatBackground() {
        const theme = localStorage.getItem('current_theme') || 'blush';
        const body = document.body;
        if (body.classList.contains('mesh-gradient')) {
            // Background is already set by HTML for premium feel
        }
    }

    async function fetchUserContextForSuggestions() {
        if (!currentUser || !currentUser.uid) return;
        try {
            const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
            if (userDoc.exists) {
                renderAISuggestions(userDoc.data());
            } else {
                renderAISuggestions({}); // Default chips
            }
        } catch (e) {
            renderAISuggestions({});
        }
    }

    function renderAISuggestions(userData) {
        const currentDay = 14; // Default middle cycle for test
        
        suggestionContainer.innerHTML = '';
        let chips = ["Rest well! ❤️", "Got you tea! 🍵", "You glow today! ❋", "Take a breath! 🌙"];

        chips.forEach(text => {
            const chip = document.createElement('div');
            chip.style = "padding: 8px 12px; background: rgba(255,255,255,0.7); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.4); color: var(--text-main); border-radius: 15px; font-size: 0.8rem; cursor: pointer; white-space: nowrap;";
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
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
});
