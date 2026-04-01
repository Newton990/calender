document.addEventListener('DOMContentLoaded', () => {
    const cycleRing = document.getElementById('partner-ring');
    const daysLeftVal = document.getElementById('days-left-val');
    const supportBtns = document.querySelectorAll('.support-btn');

    // 1. Initialize Cycle Progress Ring
    function updateCycleProgress(daysLeft, totalCycleDays = 28) {
        const radius = 80;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (daysLeft / totalCycleDays) * circumference;
        
        cycleRing.style.strokeDasharray = `${circumference} ${circumference}`;
        cycleRing.style.strokeDashoffset = offset;
        daysLeftVal.textContent = daysLeft;
    }

    // 2. Mock Support Action logic
    supportBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.innerText.split(' ').slice(1).join(' '); // Get "Love", "Tea", etc.
            
            // Visual feedback
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<span>✨</span> Sent!`;
            btn.classList.add('sent');
            btn.style.pointerEvents = 'none';

            // Simulate sending to Duo Chat / Shared State
            console.log(`PARTNER_ACTION: Sending ${action} to partner.`);
            
            // Integration with shared_state mock
            const messages = JSON.parse(localStorage.getItem('chats/shared/messages')) || [];
            messages.push({
                senderId: 'partner',
                text: `Sent you ${action}! ❤️`,
                timestamp: new Date().getTime()
            });
            localStorage.setItem('chats/shared/messages', JSON.stringify(messages));

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('sent');
                btn.style.pointerEvents = 'auto';
            }, 3000);
        });
    });

    // 3. Load Sample Data
    const mockDaysLeft = 4;
    updateCycleProgress(mockDaysLeft);

});
