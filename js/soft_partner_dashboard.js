document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let partnerId = "partner_123";
    let chatId = null;

    const cycleRing = document.getElementById('partner-ring');
    const daysLeftVal = document.getElementById('days-left-val');
    const supportBtns = document.querySelectorAll('.support-btn');

    firebase.auth().onAuthStateChanged(user => {
        if (!user) return;
        currentUser = user;
        chatId = [user.uid, partnerId].sort().join('_');
        
        loadUserRealtimeState();
    });

    function loadUserRealtimeState() {
        firebase.firestore().collection('users').doc(currentUser.uid)
            .onSnapshot(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    updateCycleProgress(data.periods, data.cycleLength || 28);
                }
            });
    }

    function updateCycleProgress(periods = [], totalCycleDays = 28) {
        if (periods.length === 0) return;
        
        const lastPeriod = new Date(periods[periods.length - 1]);
        const today = new Date();
        const diffDays = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1;
        const currentDay = ((diffDays - 1) % totalCycleDays) + 1;
        const daysLeft = totalCycleDays - currentDay;

        const radius = 80;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (currentDay / totalCycleDays) * circumference;
        
        if (cycleRing) {
            cycleRing.style.strokeDasharray = `${circumference} ${circumference}`;
            cycleRing.style.strokeDashoffset = offset;
        }
        if (daysLeftVal) daysLeftVal.textContent = daysLeft > 0 ? daysLeft : "P";
    }

    // 2. Real-Time Support Actions via Firestore
    supportBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const action = btn.innerText.split(' ').slice(1).join(' '); // Get "Love", "Tea", etc.
            
            // Visual feedback
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<span>✨</span> Sent!`;
            btn.classList.add('sent');
            btn.style.pointerEvents = 'none';

            // Send real Firestore message to shared chat
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
                btn.classList.remove('sent');
                btn.style.pointerEvents = 'auto';
            }, 3000);
        });
    });
});
