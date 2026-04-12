document.addEventListener('DOMContentLoaded', () => {
    let currentUser = null;
    let partnerId = "partner_123"; // Shared constant for demo

    const cycleDayDisplay = document.getElementById('cycle-day-count');
    const phaseText = document.getElementById('phase-text');
    const progressCircle = document.getElementById('cycle-progress-circle');
    const alertBox = document.getElementById('phase-alert-box');
    const supportTipTitle = document.getElementById('support-tip-title');
    const supportTipDesc = document.getElementById('support-tip-desc');
    const pregCard = document.getElementById('partner-preg-card');

    firebase.auth().onAuthStateChanged(user => {
        if (!user) return;
        currentUser = user;
        loadRealtimePartnerState();
    });

    function loadRealtimePartnerState() {
        firebase.firestore().collection('users').doc(currentUser.uid)
            .onSnapshot(doc => {
                if (doc.exists) {
                    updatePartnerDashboard(doc.data());
                }
            });
    }

    function updatePartnerDashboard(userData) {
        const periods = userData.periods || [];
        const cycleLen = userData.cycleLength || 28;
        const isPregnant = userData.isPregnant || false;

        if (periods.length === 0) {
            if(cycleDayDisplay) cycleDayDisplay.textContent = "--";
            if(phaseText) phaseText.textContent = "No data";
            return;
        }

        const lastPeriod = new Date(periods[periods.length - 1]);
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const diffDays = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1;
        const currentDay = ((diffDays - 1) % cycleLen) + 1;
        
        if (cycleDayDisplay) cycleDayDisplay.textContent = currentDay;
        
        // Circular Progress
        if (progressCircle) {
            const circumference = 2 * Math.PI * 95;
            const offset = circumference - (currentDay / cycleLen) * circumference;
            progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
            progressCircle.style.strokeDashoffset = offset;
        }

        // Phase Logic & Support Tips
        let phase = "";
        let alert = "";
        let tipTitle = "";
        let tipDesc = "";

        if (currentDay <= 5) {
            phase = "Menstrual";
            alert = "Period is active 🌸";
            tipTitle = "Empathy & Comfort";
            tipDesc = "Your partner might have cramps and low energy. A warm tea and some extra rest will go a long way.";
        } else if (currentDay > 5 && currentDay < 12) {
            phase = "Follicular";
            alert = "Energy is rising ❋";
            tipTitle = "Active Support";
            tipDesc = "She's likely feeling more social and energetic. Great time for a walk or starting a new fun activity together.";
        } else if (currentDay >= 12 && currentDay <= 16) {
            phase = "Ovulation";
            alert = "Peak Fertility Window 🔥";
            tipTitle = "Connection Time";
            tipDesc = "Confidence and mood are high! Plan a date night or spend quality time connecting.";
        } else {
            phase = "Luteal";
            const daysToPeriod = cycleLen - currentDay + 1;
            alert = `Period in ${daysToPeriod} days 🌙`;
            tipTitle = "Patience & Care";
            tipDesc = "Her hormones are shifting. She might feel extra sensitive or tired. Be a listening ear and offer gentle support.";
        }

        if (phaseText) phaseText.textContent = phase;
        if (alertBox) alertBox.textContent = alert;
        if (supportTipTitle) supportTipTitle.textContent = tipTitle;
        if (supportTipDesc) supportTipDesc.textContent = tipDesc;

        // Pregnancy Mode
        if (pregCard) {
            if (isPregnant) pregCard.classList.remove('hidden');
            else pregCard.classList.add('hidden');
        }
    }
});
