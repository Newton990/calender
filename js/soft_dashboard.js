/* 
   New Luna Soft Dashboard - Business Logic
   Connects the standard Luna data model to the Soft Dashboard UI.
*/

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('New LunaSession');
    if (!currentUser) {
        window.location.replace('login.html');
        return;
    }

    // State
    const state = {
        periods: JSON.parse(localStorage.getItem(`periods_${currentUser}`)) || [],
        cycleLength: JSON.parse(localStorage.getItem(`cycleLength_${currentUser}`)) || 28,
        periodLength: JSON.parse(localStorage.getItem(`periodLength_${currentUser}`)) || 5,
        water: JSON.parse(localStorage.getItem(`water_${currentUser}`)) || { date: new Date().toISOString().split('T')[0], cups: 0 },
        profile: JSON.parse(localStorage.getItem(`profile_${currentUser}`)) || { name: currentUser }
    };

    // UI Elements
    const elements = {
        userName: document.getElementById('user-name'),
        userAvatar: document.getElementById('user-avatar'),
        currentDate: document.getElementById('current-date'),
        cycleDay: document.getElementById('cycle-day'),
        cycleRing: document.getElementById('cycle-ring-progress'),
        nextPeriodDate: document.getElementById('next-period-date'),
        nextPeriodLabel: document.getElementById('next-period-label'),
        fertileWindow: document.getElementById('fertile-window'),
        ovulationDate: document.getElementById('ovulation-date'),
        hydrationCount: document.getElementById('hydration-count'),
        hydrationProgress: document.getElementById('hydration-progress'),
        addWaterBtn: document.getElementById('add-water'),
        removeWaterBtn: document.getElementById('remove-water'),
        logPeriodBtn: document.getElementById('log-period-btn')
    };

    function init() {
        updateUserInfo();
        updateCycleStatus();
        updateHydrationUI();
        setupEventListeners();
    }

    function updateUserInfo() {
        if (elements.userName) elements.userName.textContent = state.profile.name || "User";
        if (elements.userAvatar) elements.userAvatar.textContent = (state.profile.name || "U")[0].toUpperCase();
        if (elements.currentDate) {
            elements.currentDate.textContent = new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    }

    function updateCycleStatus() {
        if (state.periods.length === 0) {
            if (elements.cycleDay) elements.cycleDay.textContent = "--";
            if (elements.nextPeriodDate) elements.nextPeriodDate.textContent = "Log Data";
            return;
        }

        const today = new Date();
        today.setHours(0,0,0,0);

        // Last Period
        const lastPeriodStart = window.parseDateLocal(state.periods[state.periods.length - 1]);
        const dayDiff = Math.floor((today - lastPeriodStart) / (1000 * 60 * 60 * 24)) + 1;
        const currentDay = ((dayDiff - 1) % state.cycleLength) + 1;

        if (elements.cycleDay) elements.cycleDay.textContent = currentDay;

        // Ring Progress
        if (elements.cycleRing) {
            const circumference = 2 * Math.PI * 90; // r=90 in SVG
            const percent = currentDay / state.cycleLength;
            const offset = circumference - percent * circumference;
            elements.cycleRing.style.strokeDasharray = circumference;
            elements.cycleRing.style.strokeDashoffset = offset;
        }

        // Predictions
        const nextPeriodStart = new Date(lastPeriodStart);
        nextPeriodStart.setDate(nextPeriodStart.getDate() + state.cycleLength);
        
        if (elements.nextPeriodDate) {
            elements.nextPeriodDate.textContent = nextPeriodStart.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            }).toUpperCase();
        }

        const ovulation = new Date(nextPeriodStart);
        ovulation.setDate(nextPeriodStart.getDate() - 14);
        
        const fertileStart = new Date(ovulation);
        fertileStart.setDate(ovulation.getDate() - 5);

        if (elements.fertileWindow) {
            elements.fertileWindow.textContent = `${fertileStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${ovulation.toLocaleDateString('en-US', { day: 'numeric' })}`;
        }

        if (elements.ovulationDate) {
            elements.ovulationDate.textContent = ovulation.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        
        // Days until next period for label
        const diffTime = nextPeriodStart - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (elements.nextPeriodLabel) {
            elements.nextPeriodLabel.textContent = diffDays <= 0 ? "Period Today" : `${diffDays} Days to Next Period`;
        }
    }

    function updateHydrationUI() {
        const todayStr = new Date().toISOString().split('T')[0];
        if (state.water.date !== todayStr) {
            state.water = { date: todayStr, cups: 0 };
            localStorage.setItem(`water_${currentUser}`, JSON.stringify(state.water));
        }

        if (elements.hydrationCount) elements.hydrationCount.textContent = `${state.water.cups} / 8`;
    }

    function setupEventListeners() {
        if (elements.addWaterBtn) {
            elements.addWaterBtn.addEventListener('click', () => {
                state.water.cups++;
                localStorage.setItem(`water_${currentUser}`, JSON.stringify(state.water));
                updateHydrationUI();
            });
        }

        if (elements.removeWaterBtn) {
            elements.removeWaterBtn.addEventListener('click', () => {
                if (state.water.cups > 0) {
                    state.water.cups--;
                    localStorage.setItem(`water_${currentUser}`, JSON.stringify(state.water));
                    updateHydrationUI();
                }
            });
        }

        if (elements.logPeriodBtn) {
            elements.logPeriodBtn.addEventListener('click', () => {
                const today = new Date().toISOString().split('T')[0];
                if (!state.periods.includes(today)) {
                    state.periods.push(today);
                    state.periods.sort((a,b) => new Date(a) - new Date(b));
                    localStorage.setItem(`periods_${currentUser}`, JSON.stringify(state.periods));
                    updateCycleStatus();
                    alert("Period logged for today! ✨");
                } else {
                    alert("Today is already logged! 🌸");
                }
            });
        }
    }

    init();
});
