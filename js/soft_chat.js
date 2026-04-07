document.addEventListener('DOMContentLoaded', () => {
    const chatList = document.getElementById('chatList');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const suggestionBar = document.querySelector('.suggestion-bar');

    const partnerId = "partner_123"; // Mock partner link
    let chatId = null;
    let currentUser = null;

    firebase.auth().onAuthStateChanged(user => {
        if (!user) return;
        currentUser = user;
        chatId = [user.uid, partnerId].sort().join('_');
        
        loadRealtimeLogs();
        listenTypingStatus();
        fetchUserContextForSuggestions();
        handlePrefill();
    });

    const urlParams = new URLSearchParams(window.location.search);
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
            setTimeout(handleSend, 500);
        }
    }

    function renderMsg(msg, docId) {
        const isMe = msg.senderId === currentUser.uid;
        const div = document.createElement('div');
        div.className = `message-bubble ${isMe ? 'me' : 'partner'}`;
        
        const timestamp = msg.timestamp ? msg.timestamp.toDate() : new Date();
        const time = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Status indicator (Read Receipts)
        let statusHtml = '';
        if (isMe) {
            if (msg.status === 'sent') statusHtml = '✔';
            else if (msg.status === 'delivered') statusHtml = '✔✔';
            else if (msg.status === 'seen') statusHtml = '💖';
        }

        div.innerHTML = `
            ${msg.text}
            <div class="message-time">${time} • ${statusHtml}</div>
        `;
        
        chatList.appendChild(div);
        chatList.scrollTop = chatList.scrollHeight;

        // Mark as seen if received
        if (!isMe && msg.status !== 'seen') {
            firebase.firestore().collection('chats').doc(chatId).collection('messages').doc(docId).update({ status: 'seen' });
        }
    }

    function loadRealtimeLogs() {
        firebase.firestore().collection('chats').doc(chatId).collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot(snapshot => {
                chatList.innerHTML = '';
                snapshot.forEach(doc => renderMsg(doc.data(), doc.id));
            });
    }

    function listenTypingStatus() {
        const indicator = document.getElementById('typingIndicator');
        firebase.firestore().collection('chats').doc(chatId).onSnapshot(doc => {
            if (doc.exists && doc.data().typing && doc.data().typing !== currentUser.uid) {
                if (indicator) indicator.classList.remove('hidden');
            } else {
                if (indicator) indicator.classList.add('hidden');
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

    async function handleSend() {
        const text = chatInput.value.trim();
        if (!text || !chatId || !currentUser) return;

        const msgData = {
            chatId,
            senderId: currentUser.uid,
            text,
            status: 'sent',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        chatInput.value = '';
        firebase.firestore().collection('chats').doc(chatId).set({ typing: null }, { merge: true });
        
        await firebase.firestore().collection('chats').doc(chatId).collection('messages').add(msgData);
    }

    async function fetchUserContextForSuggestions() {
        if (!currentUser) return;
        const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            initSuggestions(userDoc.data());
        }
    }

    function initSuggestions(userData) {
        const periods = userData.periods || [];
        const cycleLen = userData.cycleLength || 28;
        
        if (periods.length === 0) return;

        const lastPeriod = new Date(periods[periods.length - 1]);
        const today = new Date();
        const diffDays = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1;
        const currentDay = ((diffDays - 1) % cycleLen) + 1;

        let chips = [];
        if (currentDay <= 5) {
            chips = ["❤️ Send Love", "🍵 Offer Tea", "📺 Rest Time"];
        } else if (currentDay >= 12 && currentDay <= 16) {
            chips = ["✨ You Glow", "🍷 Date Night", "❤️ Love You"];
        } else {
            chips = ["🌙 Goodnight", "👂 Listening", "💪 You Got This"];
        }

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

    initSuggestions();
});
