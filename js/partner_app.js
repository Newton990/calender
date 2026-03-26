document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('NewLunaSession');
    if (!currentUser) return;

    const cycleDayDisplay = document.getElementById('cycle-day-count');
    const phaseText = document.getElementById('phase-text');
    const progressCircle = document.getElementById('cycle-progress-circle');
    const alertBox = document.getElementById('phase-alert-box');
    const supportTipTitle = document.getElementById('support-tip-title');
    const supportTipDesc = document.getElementById('support-tip-desc');
    const pregCard = document.getElementById('partner-preg-card');

    function updatePartnerDashboard() {
        const periods = JSON.parse(localStorage.getItem(`periods_${currentUser}`)) || [];
        const cycleLen = JSON.parse(localStorage.getItem(`cycleLength_${currentUser}`)) || 28;
        const isPregnant = JSON.parse(localStorage.getItem(`isPregnant_${currentUser}`)) || false;

        if (periods.length === 0) {
            cycleDayDisplay.textContent = "--";
            phaseText.textContent = "No data";
            return;
        }

        const lastPeriod = window.parseDateLocal(periods[periods.length - 1]);
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const diffDays = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1;
        const currentDay = ((diffDays - 1) % cycleLen) + 1;
        
        cycleDayDisplay.textContent = currentDay;
        
        // Circular Progress
        const circumference = 2 * Math.PI * 95;
        const offset = circumference - (currentDay / cycleLen) * circumference;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = offset;

        // Phase Logic & Support Tips
        if (currentDay <= 5) {
            phaseText.textContent = "Menstrual";
            alertBox.textContent = "Period is active 🌸";
            supportTipTitle.textContent = "Empathy & Comfort";
            supportTipDesc.textContent = "Your partner might have cramps and low energy. A warm tea and some extra rest will go a long way.";
        } else if (currentDay > 5 && currentDay < 12) {
            phaseText.textContent = "Follicular";
            alertBox.textContent = "Energy is rising ✨";
            supportTipTitle.textContent = "Active Support";
            supportTipDesc.textContent = "She's likely feeling more social and energetic. Great time for a walk or starting a new fun activity together.";
        } else if (currentDay >= 12 && currentDay <= 16) {
            phaseText.textContent = "Ovulation";
            alertBox.textContent = "Peak Fertility Window 🔥";
            supportTipTitle.textContent = "Connection Time";
            supportTipDesc.textContent = "Confidence and mood are high! Plan a date night or spend quality time connecting.";
        } else {
            phaseText.textContent = "Luteal";
            const daysToPeriod = cycleLen - currentDay + 1;
            alertBox.textContent = `Period in ${daysToPeriod} days 🌙`;
            supportTipTitle.textContent = "Patience & Care";
            supportTipDesc.textContent = "Her hormones are shifting. She might feel extra sensitive or tired. Be a listening ear and offer gentle support.";
        }

        // Pregnancy Mode
        if (isPregnant) {
            pregCard.classList.remove('hidden');
        } else {
            pregCard.classList.add('hidden');
        }
    }

    updatePartnerDashboard();
    window.addEventListener('storage', updatePartnerDashboard);
});
