document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('NewLunaSession');
    if (!currentUser) return;

    // Elements
    const modeSelector = document.getElementById('mode-selector-area');
    const ttcArea = document.getElementById('ttc-area');
    const pregArea = document.getElementById('pregnancy-area');
    const setupOverlay = document.getElementById('setup-overlay');
    
    const btnSetTtc = document.getElementById('btn-set-ttc');
    const btnSetPreg = document.getElementById('btn-set-pregnant');
    const btnConfirmSetup = document.getElementById('confirm-setup');
    const btnCancelSetup = document.getElementById('cancel-setup');
    const btnReset = document.getElementById('reset-journey');

    // State
    let journeyState = JSON.parse(localStorage.getItem(`journeyState_${currentUser}`)) || { type: null }; // 'ttc' or 'preg'
    const pregnancyStart = localStorage.getItem(`pregnancyStartDate_${currentUser}`);

    const updateUI = () => {
        modeSelector.classList.add('hidden');
        ttcArea.classList.add('hidden');
        pregArea.classList.add('hidden');

        if (!journeyState.type) {
            modeSelector.classList.remove('hidden');
        } else if (journeyState.type === 'ttc') {
            ttcArea.classList.remove('hidden');
            renderTtcDashboard();
        } else if (journeyState.type === 'preg') {
            pregArea.classList.remove('hidden');
            renderPregDashboard();
        }
    };

    const renderTtcDashboard = () => {
        // Mocking TTC logic based on average period data
        const periods = JSON.parse(localStorage.getItem(`periods_${currentUser}`)) || [];
        periods.sort((a, b) => new Date(a) - new Date(b));
        const cycleLen = JSON.parse(localStorage.getItem(`cycleLength_${currentUser}`)) || 28;
        
        const status = document.getElementById('ttc-fertility-status');
        const countdown = document.getElementById('ttc-ovu-countdown');

        if (periods.length === 0) {
            status.textContent = "Start Tracking";
            countdown.textContent = "Log a period to see fertility.";
            return;
        }

        const lastPeriod = window.parseDateLocal(periods[periods.length - 1]);
        const ovulation = new Date(lastPeriod);
        ovulation.setDate(ovulation.getDate() + (cycleLen - 14));
        
        const today = new Date();
        const diff = Math.round((ovulation - today) / (1000 * 60 * 60 * 24));

        if (diff < 0) {
            status.textContent = "Post-Ovulation";
            countdown.textContent = "Next window calculation pending.";
        } else if (diff <= 3) {
            status.textContent = "Peak Fertility 🔥";
            countdown.textContent = diff === 0 ? "Ovulation is Today!" : `Ovulation in ${diff} days`;
        } else if (diff <= 7) {
            status.textContent = "High Fertility ✨";
            countdown.textContent = `Ovulation in ${diff} days`;
        } else {
            status.textContent = "Low Fertility";
            countdown.textContent = `Ovulation in ${diff} days`;
        }
    };

    const renderPregDashboard = () => {
        if (!pregnancyStart) return;
        const start = window.parseDateLocal(pregnancyStart);
        const today = new Date();
        const diffMs = today - start;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        const weeks = Math.floor(diffDays / 7);
        const days = diffDays % 7;

        document.getElementById('preg-week-display').textContent = `Week ${weeks}, Day ${days}`;
        
        // Due Date calculation (LMP + 280 days)
        const dueDate = new Date(start);
        dueDate.setDate(dueDate.getDate() + 280);
        document.getElementById('preg-due-date').textContent = `Due Date: ${dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

        // Progress Bar
        const progress = Math.min((diffDays / 280) * 100, 100);
        document.getElementById('preg-progress-bar').style.width = `${progress}%`;

        // Size Comparisons
        const sizes = [
            { week: 4, name: "Poppy Seed", emoji: "🌱" },
            { week: 5, name: "Apple Seed", emoji: "🍏" },
            { week: 6, name: "Sweet Pea", emoji: "🟢" },
            { week: 7, name: "Blueberry", emoji: "🫐" },
            { week: 8, name: "Raspberry", emoji: "🍓" },
            { week: 9, name: "Cherry", emoji: "🍒" },
            { week: 10, name: "Strawberry", emoji: "🍓" },
            { week: 11, name: "Fig", emoji: "🫐" },
            { week: 12, name: "Lime", emoji: "🍋" },
            { week: 13, name: "Lemon", emoji: "🍋" },
            { week: 14, name: "Nectarine", emoji: "🍑" },
            { week: 15, name: "Pear", emoji: "🍐" },
            { week: 16, name: "Avocado", emoji: "🥑" },
            { week: 20, name: "Banana", emoji: "🍌" },
            { week: 24, name: "Corn", emoji: "🌽" },
            { week: 28, name: "Eggplant", emoji: "🍆" },
            { week: 32, name: "Squash", emoji: "🎃" },
            { week: 36, name: "Papaya", emoji: "🥭" },
            { week: 40, name: "Watermelon", emoji: "🍉" }
        ];

        let currentSize = sizes[0];
        for (const s of sizes) {
            if (weeks >= s.week) currentSize = s;
        }

        document.getElementById('baby-size-emoji').textContent = currentSize.emoji;
        document.getElementById('baby-size-name').textContent = currentSize.name;
    };

    // Event Listeners
    btnSetTtc.addEventListener('click', () => {
        journeyState.type = 'ttc';
        localStorage.setItem(`journeyState_${currentUser}`, JSON.stringify(journeyState));
        updateUI();
    });

    btnSetPreg.addEventListener('click', () => {
        setupOverlay.classList.remove('hidden');
    });

    btnCancelSetup.addEventListener('click', () => {
        setupOverlay.classList.add('hidden');
    });

    btnConfirmSetup.addEventListener('click', () => {
        const date = document.getElementById('setup-date').value;
        if (!date) return alert("Please select a date.");
        
        journeyState.type = 'preg';
        localStorage.setItem(`journeyState_${currentUser}`, JSON.stringify(journeyState));
        localStorage.setItem(`pregnancyStartDate_${currentUser}`, date);
        localStorage.setItem(`isPregnant_${currentUser}`, JSON.stringify(true));
        
        setupOverlay.classList.add('hidden');
        updateUI();
    });

    btnReset.addEventListener('click', () => {
        if (confirm("Reset your journey progress? This will clear TTC/Pregnancy settings.")) {
            localStorage.removeItem(`journeyState_${currentUser}`);
            localStorage.removeItem(`pregnancyStartDate_${currentUser}`);
            localStorage.setItem(`isPregnant_${currentUser}`, JSON.stringify(false));
            journeyState = { type: null };
            updateUI();
        }
    });

    // Fertility Logging
    const saveFertilityBtn = document.getElementById('save-fertility');
    if (saveFertilityBtn) {
        saveFertilityBtn.addEventListener('click', () => {
            const bbt = document.getElementById('bbt-input').value;
            const mucus = document.getElementById('mucus-input').value;
            const date = new Date().toISOString().split('T')[0];
            
            const fertilityLogs = JSON.parse(localStorage.getItem(`fertilityLogs_${currentUser}`)) || {};
            fertilityLogs[date] = { bbt, mucus };
            localStorage.setItem(`fertilityLogs_${currentUser}`, JSON.stringify(fertilityLogs));
            
            alert("Daily fertility data saved! ✨");
        });
    }

    updateUI();
});
