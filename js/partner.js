document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('New LunaSession');
    if (!currentUser) return;

    const moodDisplay = document.getElementById('partner-mood');
    const driveDisplay = document.getElementById('partner-drive');
    const symptomsDisplay = document.getElementById('partner-symptoms');
    const chancePercent = document.getElementById('chance-percent');
    const chanceBar = document.getElementById('chance-bar');
    const chanceLogic = document.getElementById('chance-logic');

    const adviceTextDisplay = document.getElementById('advice-text');

    function partnerAdvice(cycleDay) {
        if (cycleDay > 20) {
            return "Your partner may feel sensitive today. A supportive message could help.";
        }
        if (cycleDay < 5) {
            return "She may be on her period. Comfort and rest can help.";
        }
        return "Everything looks normal today.";
    }

    function updatePartnerInsights() {
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        const periods = JSON.parse(localStorage.getItem(`periods_${currentUser}`)) || [];
        periods.sort((a, b) => new Date(a) - new Date(b));
        
        const symptomsBank = JSON.parse(localStorage.getItem(`symptoms_${currentUser}`)) || {};
        const cycleLen = JSON.parse(localStorage.getItem(`cycleLength_${currentUser}`)) || 28;
        const isPregnant = JSON.parse(localStorage.getItem(`isPregnant_${currentUser}`)) || false;

        const todayData = symptomsBank[todayStr] || {};

        // 1. Mood & Drive
        if(moodDisplay) moodDisplay.textContent = todayData.mood ? todayData.mood.charAt(0).toUpperCase() + todayData.mood.slice(1) : "Not logged";
        if(driveDisplay) driveDisplay.textContent = todayData.drive ? todayData.drive.toUpperCase() : "Not logged";

        // 2. Symptoms
        if(symptomsDisplay) {
            const tags = todayData.tags || [];
            if (tags.length > 0) {
                symptomsDisplay.innerHTML = tags.map(t => `<span class="glass" style="padding: 2px 8px; font-size: 0.75rem; background: var(--accent); color: var(--primary-dark); border-radius: 8px;">${t}</span>`).join('');
            } else {
                symptomsDisplay.innerHTML = '<span style="opacity: 0.5;">None logged</span>';
            }
        }

        // 3. Pregnancy Chances
        if (isPregnant) {
            if(chancePercent) chancePercent.textContent = "N/A";
            if(chanceBar) chanceBar.style.width = "0%";
            if(chanceLogic) chanceLogic.textContent = "Currently Pregnant 👶";
            return;
        }

        if (periods.length === 0) {
            if(chancePercent) chancePercent.textContent = "0%";
            if(chanceLogic) chanceLogic.textContent = "Log periods to see";
            return;
        }

        // Simple Peak Probability Logic
        const lastPeriod = window.parseDateLocal(periods[periods.length - 1]);
        const nextPeriod = new Date(lastPeriod);
        nextPeriod.setDate(nextPeriod.getDate() + cycleLen);
        const ovulation = new Date(nextPeriod);
        ovulation.setDate(ovulation.getDate() - 14);
        
        const diff = Math.round((ovulation - now) / (1000 * 60 * 60 * 24));
        
        let percent = 0;
        let logicText = "Low chance today";

        if (diff === 0) { percent = 33; logicText = "Peak Fertility! 🔥"; }
        else if (diff === 1 || diff === -1) { percent = 28; logicText = "High Fertility ✨"; }
        else if (diff === 2 || diff === 3) { percent = 20; logicText = "Fertile Window Open"; }
        else if (diff > 3 && diff <= 5) { percent = 10; logicText = "Fertile Window Starting"; }
        
        if(chancePercent) chancePercent.textContent = `${percent}%`;
        if(chanceBar) chanceBar.style.width = `${(percent / 33) * 100}%`;
        if(chanceLogic) chanceLogic.textContent = logicText;

        renderCycleWheel(lastPeriod, cycleLen);
    }

    function renderCycleWheel(lastPeriod, cycleLen) {
        const circle = document.getElementById('cycle-progress-circle');
        const wheelDay = document.getElementById('days-count');
        const wheelPhase = document.getElementById('wheel-phase-text');
        if (!circle) return;

        const today = new Date();
        today.setHours(0,0,0,0);
        const diffDays = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1;
        const currentDay = ((diffDays - 1) % cycleLen) + 1;
        
        if (wheelDay) wheelDay.textContent = currentDay;
        const circumference = 2 * Math.PI * 95;
        const offset = (currentDay / cycleLen) * circumference;
        circle.style.strokeDasharray = `${offset} ${circumference}`;
        
        if (adviceTextDisplay) {
            adviceTextDisplay.textContent = partnerAdvice(currentDay);
        }

        // Simple phase logic for partner
        if (wheelPhase) {
             const ovulation = new Date(lastPeriod);
             ovulation.setDate(ovulation.getDate() + cycleLen - 14);
             const today = new Date();
             if (currentDay <= 5) wheelPhase.textContent = "Menstrual Phase";
             else if (currentDay > 5 && currentDay < 12) wheelPhase.textContent = "Follicular Phase";
             else if (currentDay >= 12 && currentDay <= 16) wheelPhase.textContent = "Ovulation Window";
             else wheelPhase.textContent = "Luteal Phase";
        }
    }

    // --- Full Partner Chat System ---
    window.sendMessage = function() {
        const input = document.getElementById("chatInput");
        const message = input.value;
        if (!message || message.trim() === "") return;

        // Visual append (from user snippet)
        const messagesDisplay = document.getElementById("messages");
        const msgBox = document.createElement("p");
        msgBox.innerText = "You: " + message;
        
        // Maintain premium styling for the bubble
        msgBox.style.alignSelf = "flex-end";
        msgBox.style.maxWidth = "80%";
        msgBox.style.padding = "12px 18px";
        msgBox.style.background = "var(--primary)";
        msgBox.style.color = "white";
        msgBox.style.borderRadius = "20px 20px 0 20px";
        msgBox.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)";
        msgBox.style.animation = "messagePop 0.3s ease";
        msgBox.style.margin = "0";
        
        if (messagesDisplay.querySelector('p[style*="text-align: center"]')) {
            messagesDisplay.innerHTML = ""; // Clear "No messages" text
        }
        messagesDisplay.appendChild(msgBox);
        messagesDisplay.scrollTop = messagesDisplay.scrollHeight;

        // Persist so the Dashboard side can see it
        const messages = JSON.parse(localStorage.getItem(`luna_partner_messages_${currentUser}`)) || [];
        messages.push({
            sender: 'Partner',
            text: message,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(`luna_partner_messages_${currentUser}`, JSON.stringify(messages));

        input.value = "";
    };

    function renderMessages() {
        const messagesDisplay = document.getElementById('messages');
        if (!messagesDisplay) return;
        
        const messages = JSON.parse(localStorage.getItem(`luna_partner_messages_${currentUser}`)) || [];
        if (messages.length === 0) return;

        messagesDisplay.innerHTML = messages.map(msg => {
            const isMe = msg.sender === 'Partner';
            const prefix = isMe ? "You: " : "Partner: ";
            const align = isMe ? 'flex-end' : 'flex-start';
            const bg = isMe ? 'var(--primary)' : '#FCE4EC';
            const color = isMe ? 'white' : 'var(--text-main)';
            const radius = isMe ? '20px 20px 2px 20px' : '20px 20px 20px 2px';

            return `
                <div style="align-self: ${align}; max-width: 85%; padding: 10px 16px; background: ${bg}; color: ${color}; border-radius: ${radius}; box-shadow: 0 2px 5px rgba(0,0,0,0.05); animation: messagePop 0.3s ease; margin-bottom: 5px;">
                    <p style="font-size: 0.95rem; line-height: 1.4; margin: 0;">${prefix}${msg.text}</p>
                </div>
            `;
        }).join('');
        messagesDisplay.scrollTop = messagesDisplay.scrollHeight;
    }

    // Handle incoming messages from the dashboard in real-time
    window.addEventListener('storage', (e) => {
        if (e.key === `luna_partner_messages_${currentUser}`) {
            renderMessages();
        }
        if (e.key === `periods_${currentUser}` || e.key === `isPregnant_${currentUser}`) {
            updatePartnerInsights();
        }
    });

    updatePartnerInsights();
    renderMessages();
});
