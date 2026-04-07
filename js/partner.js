document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let partnerId = "partner_123"; // Shared constant for demo
    let chatId = null;

    const moodDisplay = document.getElementById('partner-mood');
    const driveDisplay = document.getElementById('partner-drive');
    const symptomsDisplay = document.getElementById('partner-symptoms');
    const chancePercent = document.getElementById('chance-percent');
    const chanceBar = document.getElementById('chance-bar');
    const chanceLogic = document.getElementById('chance-logic');
    const adviceTextDisplay = document.getElementById('advice-text');

    firebase.auth().onAuthStateChanged(user => {
        if (!user) return;
        currentUser = user;
        chatId = [user.uid, partnerId].sort().join('_');
        
        loadUserRealtimeState();
        loadRealtimeMessages();
        listenTypingStatus();
    });

    function loadUserRealtimeState() {
        firebase.firestore().collection('users').doc(currentUser.uid)
            .onSnapshot(doc => {
                if (doc.exists) {
                    updatePartnerInsights(doc.data());
                }
            });
    }

    function updatePartnerInsights(userData) {
        const symptoms = userData.symptoms || {};
        const periods = userData.periods || [];
        const isPregnant = userData.isPregnant || false;
        const cycleLen = userData.cycleLength || 28;

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const todayData = symptoms[todayStr] || {};

        // 1. Mood & Drive
        if(moodDisplay) moodDisplay.textContent = todayData.mood || "Not logged";
        if(driveDisplay) driveDisplay.textContent = todayData.drive || "Not logged";

        // 2. Symptoms
        if(symptomsDisplay) {
            const tags = todayData.tags || [];
            symptomsDisplay.innerHTML = tags.length > 0 
                ? tags.map(t => `<span class="glass-tag" style="display:inline-block; margin:2px; padding:4px 8px; background:var(--accent); border-radius:10px; font-size:0.8rem;">${t}</span>`).join('')
                : '<span style="opacity: 0.5;">None logged today</span>';
        }

        // 3. Cycle & Advice
        if (periods.length > 0) {
            const lastPeriod = new Date(periods[periods.length - 1]);
            const diffDays = Math.floor((now - lastPeriod) / (1000 * 60 * 60 * 24)) + 1;
            const currentDay = ((diffDays - 1) % cycleLen) + 1;
            
            renderCycleWheel(lastPeriod, cycleLen, currentDay);
            
            const mood = todayData.mood || 'neutral';
            const phase = currentDay <= 5 ? 'Menstrual' : currentDay <= 12 ? 'Follicular' : currentDay <= 16 ? 'Ovulation' : 'Luteal';
            
            if (adviceTextDisplay) {
                adviceTextDisplay.innerHTML = `She's in her <b>${phase}</b> phase and feeling <b>${mood}</b>. <br><br><i>Soulful Insight:</i> Focus on being her safe space today. A little extra patience and a warm gesture will go a long way. 🕊️`;
            }

            // Pregnancy Chances (Mock Simple Logic)
            if (isPregnant) {
                 if(chancePercent) chancePercent.textContent = "N/A";
                 if(chanceLogic) chanceLogic.textContent = "Currently Pregnant 🍼";
            } else {
                 let percent = (currentDay >= 12 && currentDay <= 16) ? "High" : "Low";
                 if(chancePercent) chancePercent.textContent = percent;
                 if(chanceLogic) chanceLogic.textContent = percent === "High" ? "Peak Fertility Window ✨" : "Outside Fertile Window";
            }
        }
    }

    function renderCycleWheel(lastPeriod, cycleLen, currentDay) {
        const circle = document.getElementById('cycle-progress-circle');
        const wheelDay = document.getElementById('days-count');
        const wheelPhase = document.getElementById('wheel-phase-text');
        if (!circle) return;

        if (wheelDay) wheelDay.textContent = currentDay;
        const circumference = 2 * Math.PI * 95;
        const offset = circumference - (currentDay / cycleLen) * circumference;
        circle.style.strokeDashoffset = offset;
        
        if (wheelPhase) {
             if (currentDay <= 5) wheelPhase.textContent = "Menstrual Phase";
             else if (currentDay <= 12) wheelPhase.textContent = "Follicular Phase";
             else if (currentDay <= 16) wheelPhase.textContent = "Ovulation Window";
             else wheelPhase.textContent = "Luteal Phase";
        }
    }

    // --- Unified Chat System ---
    window.sendMessage = async function() {
        const input = document.getElementById("chatInput");
        const text = input.value.trim();
        if (!text || !chatId) return;

        input.value = "";
        await firebase.firestore().collection('chats').doc(chatId).collection('messages').add({
            chatId,
            senderId: 'partner',
            text,
            status: 'sent',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    };

    function loadRealtimeMessages() {
        const messagesDisplay = document.getElementById('messages');
        if (!messagesDisplay) return;

        firebase.firestore().collection('chats').doc(chatId).collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot(snapshot => {
                messagesDisplay.innerHTML = '';
                snapshot.forEach(doc => {
                    renderSingleMessage(doc.data(), doc.id);
                });
            });
    }

    function renderSingleMessage(msg, docId) {
        const messagesDisplay = document.getElementById('messages');
        const isMe = msg.senderId === 'partner';
        const align = isMe ? 'flex-end' : 'flex-start';
        const bg = isMe ? 'var(--primary)' : 'rgba(255,255,255,0.8)';
        const color = isMe ? 'white' : 'var(--text-main)';
        const radius = isMe ? '20px 20px 2px 20px' : '20px 20px 20px 2px';

        const div = document.createElement('div');
        div.style = `align-self: ${align}; max-width: 85%; padding: 10px 16px; background: ${bg}; color: ${color}; border-radius: ${radius}; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 8px;`;
        div.innerHTML = `<p style="font-size: 0.95rem; line-height: 1.4; margin:0;">${msg.text}</p>`;
        
        messagesDisplay.appendChild(div);
        messagesDisplay.scrollTop = messagesDisplay.scrollHeight;

        if (!isMe && msg.status !== 'seen') {
            firebase.firestore().collection('chats').doc(chatId).collection('messages').doc(docId).update({ status: 'seen' });
        }
    }

    function listenTypingStatus() {
        firebase.firestore().collection('chats').doc(chatId).onSnapshot(doc => {
            if (doc.exists && doc.data().typing && doc.data().typing !== 'partner') {
                // Could show a "Partner is typing..." toast or text
            }
        });
    }

    // --- Support Actions ---
    const supportBtns = document.querySelectorAll('.support-btn');
    supportBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const action = btn.innerText.split(' ').pop(); // Get "Love", "Tea", etc.
            const originalHTML = btn.innerHTML;
            
            btn.innerHTML = `✨ Sent!`;
            btn.style.pointerEvents = 'none';

            if (chatId) {
                await firebase.firestore().collection('chats').doc(chatId).collection('messages').add({
                    chatId,
                    senderId: 'partner',
                    text: `Sent you ${action}! ❤️`,
                    status: 'sent',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.pointerEvents = 'auto';
            }, 2000);
        });
    });
});
