document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('NewLunaSession');
    if (!currentUser) {
        window.location.replace('login.html');
        return;
    }

    // --- State ---
    const state = {
        periods: JSON.parse(localStorage.getItem(`periods_${currentUser}`)) || [],
        cycleLength: JSON.parse(localStorage.getItem(`cycleLength_${currentUser}`)) || 28,
        periodLength: JSON.parse(localStorage.getItem(`periodLength_${currentUser}`)) || 5,
        symptoms: JSON.parse(localStorage.getItem(`symptoms_${currentUser}`)) || {},
        isPregnant: JSON.parse(localStorage.getItem(`isPregnant_${currentUser}`)) || false,
        pregnancyStartDate: localStorage.getItem(`pregnancyStartDate_${currentUser}`) || null,
        currentMonth: new Date()
    };

    // --- Elements ---
    const elements = {
        // Stats/Header
        cycleDay: document.getElementById('cycleDay') || document.getElementById('cycle-day'),
        daysLeft: document.getElementById('daysLeft') || document.getElementById('next-period'),
        fertileWindow: document.getElementById('fertile-window') || document.getElementById('fertile'),
        ovulation: document.getElementById('ovulation-date') || document.getElementById('ovulation'),
        hydration: document.getElementById('hydration-count') || document.getElementById('hydrationLevel') || document.getElementById('hydration'),
        
        // Ring
        cycleRingProgress: document.getElementById('cycle-ring-progress'),
        
        // AI/Insights
        aiMood: document.getElementById('aiMood') || document.getElementById('mood-insight-text'),
        aiMoodEmoji: document.getElementById('mood-insight-emoji'),
        aiConfidenceScore: document.getElementById('ai-confidence-score'),
        aiConfidenceArea: document.getElementById('ai-confidence-area'),
        
        // Phase/Tips
        phaseBadge: document.getElementById('cycle-phase-badge'),
        fertilityText: document.getElementById('fertility-text'),
        nutritionTip: document.getElementById('tip-nutrition-text'),
        exerciseTip: document.getElementById('tip-exercise-text'),
        selfcareTip: document.getElementById('tip-selfcare-text'),
        
        // Kindness
        kindnessIcon: document.getElementById('kindness-icon'),
        kindnessTitle: document.getElementById('kindness-title'),
        kindnessMessage: document.getElementById('kindness-message'),
        
        // Pregnancy
        pregDash: document.getElementById('pregnancyDashboard'),
        cycleDash: document.getElementById('cycleDashboard'),
        pregWeek: document.getElementById('pregnancy-week-text'),
        babySize: document.getElementById('baby-size'),
        pregDays: document.getElementById('pregnancy-days'),
        dueDate: document.getElementById('due-date-display'),
        
        // Calendar
        calendarDays: document.getElementById('calendarDays') || document.getElementById('calendar-days'),
        monthYear: document.getElementById('monthYear') || document.getElementById('month-display'),
        
        // Modal
        modal: document.getElementById('symptom-modal') || document.getElementById('logPeriodModal'),
        closeModalBtn: document.getElementById('close-modal') || document.getElementById('closePeriodModal'),
        saveSymptomsBtn: document.getElementById('save-symptoms') || document.getElementById('submitPeriodBtn'),
    };

    // --- Helpers ---
    function saveData(key, value) {
        localStorage.setItem(`${key}_${currentUser}`, JSON.stringify(value));
    }

    // --- Initialization ---
    function initApp() {
        updateDashboard();
        renderCalendar();
        setupEventListeners();
        console.log('Premium Dashboard initialized for:', currentUser);
    }

    function updateDashboard() {
        const today = new Date();
        today.setHours(0,0,0,0);

        if (state.isPregnant) {
            applyPregnancyUI(today);
        } else {
            applyCycleUI(today);
        }
        
        calculateAIIntelligence(today);
    }

    function applyPregnancyUI(today) {
        if (elements.pregDash) elements.pregDash.style.display = 'block';
        if (elements.cycleDash) elements.cycleDash.style.display = 'none';

        const lmp = window.parseDateLocal(state.pregnancyStartDate);
        if (!lmp) return;

        const diffDays = Math.floor((today - lmp) / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diffDays / 7) + 1;
        const daysIntoWeek = diffDays % 7;

        if (elements.pregWeek) elements.pregWeek.textContent = `Week ${weeks}`;
        if (elements.pregDays) elements.pregDays.textContent = `Day ${daysIntoWeek} of this week`;
        
        const babySizes = { 1: "Seed", 4: "Poppy Seed", 8: "Raspberry 🍓", 12: "Lime", 16: "Avocado", 20: "Banana", 24: "Corn", 28: "Eggplant", 32: "Squash", 36: "Papaya", 40: "Watermelon 🍉" };
        if (elements.babySize) elements.babySize.textContent = `Size of a ${babySizes[weeks] || (weeks > 40 ? "Interstellar Traveler 👨‍🚀" : "Pea 🫛")}`;
        
        const dueDate = new Date(lmp);
        dueDate.setDate(dueDate.getDate() + 280);
        if (elements.dueDate) elements.dueDate.textContent = `Due Date: ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        
        updateKindnessCorner("Pregnancy");
    }

    function applyCycleUI(today) {
        if (elements.pregDash) elements.pregDash.style.display = 'none';
        if (elements.cycleDash) elements.cycleDash.style.display = 'block';

        if (state.periods.length === 0) {
            if (elements.cycleDay) elements.cycleDay.textContent = "--";
            if (elements.daysLeft) elements.daysLeft.textContent = "Log Period Start";
            return;
        }

        const lastPeriod = window.parseDateLocal(state.periods[state.periods.length - 1]);
        const dayDiff = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1;
        const currentCycleDay = ((dayDiff - 1) % state.cycleLength) + 1;
        
        if (elements.cycleDay) elements.cycleDay.textContent = `Day ${currentCycleDay}`;

        // Next Period Countdown
        const nextPeriod = new Date(lastPeriod);
        nextPeriod.setDate(nextPeriod.getDate() + state.cycleLength);
        const diffTime = nextPeriod - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (elements.daysLeft) {
            elements.daysLeft.textContent = diffDays <= 0 ? (diffDays === 0 ? "TODAY" : Math.abs(diffDays) + " DAYS LATE") : `${diffDays} days to next cycle`;
        }

        // Ring Progress
        if (elements.cycleRingProgress) {
            const circumference = 2 * Math.PI * 108; 
            const percent = currentCycleDay / state.cycleLength;
            const offset = circumference - percent * circumference;
            elements.cycleRingProgress.style.strokeDasharray = circumference;
            elements.cycleRingProgress.style.strokeDashoffset = offset;
        }

        // Phase Insights
        calculateAdvancedInsights(lastPeriod, nextPeriod, today);
    }

    function calculateAdvancedInsights(lastPeriod, nextPeriod, today) {
        const ovulationDay = new Date(nextPeriod);
        ovulationDay.setDate(ovulationDay.getDate() - 14);
        const isPeriod = isPeriodDate(today.toISOString().split('T')[0]);

        let phase = "";
        if (isPeriod) {
            phase = "Menstrual Phase 🩸";
            if (elements.phaseBadge) {
                elements.phaseBadge.textContent = phase;
                elements.phaseBadge.style.background = "#ffb3c1";
            }
            if (elements.fertilityText) elements.fertilityText.textContent = "Low fertility. Focus on rest.";
        } else if (today.toDateString() === ovulationDay.toDateString()) {
            phase = "Ovulation Phase ❋";
            if (elements.phaseBadge) {
                elements.phaseBadge.textContent = phase;
                elements.phaseBadge.style.background = "#ffb703";
            }
            if (elements.fertilityText) elements.fertilityText.textContent = "Peak fertility! 💖";
        } else if (today < ovulationDay) {
            phase = "Follicular Phase";
            if (elements.phaseBadge) {
                elements.phaseBadge.textContent = phase;
                elements.phaseBadge.style.background = "#8b5cf6";
            }
            const diffOvu = Math.ceil((ovulationDay - today) / (1000 * 60 * 60 * 24));
            if (elements.fertilityText) elements.fertilityText.textContent = diffOvu <= 5 ? "High fertility window! ❋" : "Low fertility. Approaching window.";
        } else {
            phase = "Luteal Phase";
            if (elements.phaseBadge) {
                elements.phaseBadge.textContent = phase;
                elements.phaseBadge.style.background = "#43aa8b";
            }
            if (elements.fertilityText) elements.fertilityText.textContent = "Low fertility. Body is preparing.";
        }

        updatePhaseTips(phase);
        updateKindnessCorner(phase);

        // Update card dates
        const fertStart = new Date(ovulationDay);
        fertStart.setDate(fertStart.getDate() - 5);
        if (elements.fertileWindow) elements.fertileWindow.textContent = `${fertStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${ovulationDay.toLocaleDateString('en-US', { day: 'numeric' })}`;
        if (elements.ovulation) elements.ovulation.textContent = ovulationDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function updatePhaseTips(phase) {
        const tips = {
            "Menstrual Phase 🩸": { n: "Iron-rich foods & Magnesium. 🍫", e: "Gentle yoga or light walk. 🧘‍♀️", s: "Heat pad & early bedtime. 🍵" },
            "Follicular Phase": { n: "Lean protein & fermented foods. 🍊", e: "Good time for HIIT or cardio! 🏃‍♀️", s: "Start new creative projects. ❋" },
            "Ovulation Phase ❋": { n: "Anti-inflammatory, high-fiber. 🥗", e: "Peak energy: Heavy weights or run. ⚡", s: "Connect with friends. 💄" },
            "Luteal Phase": { n: "Complex carbs to stabilize mood. 🍠", e: "Pilates or moderate hiking. 🚣‍♀️", s: "Prioritize sleep & boundaries. 🌙" }
        };
        const current = tips[phase] || tips["Follicular Phase"];
        if (elements.nutritionTip) elements.nutritionTip.textContent = current.n;
        if (elements.exerciseTip) elements.exerciseTip.textContent = current.e;
        if (elements.selfcareTip) elements.selfcareTip.textContent = current.s;
    }

    function updateKindnessCorner(phase) {
        const messages = {
            "Menstrual Phase 🩸": { i: "🌸", t: "Your body is working hard. Be gentle with yourself. ❋" },
            "Follicular Phase": { i: "🌱", t: "New beginnings, new energy! Dream big today. 🚀" },
            "Ovulation Phase ❋": { i: "💫", t: "You are absolutely radiant! Your confidence is magnetic. 🌟" },
            "Luteal Phase": { i: "🌙", t: "Slow down and listen to your heart. You're doing great. 🧸" },
            "Pregnancy": { i: "👶", t: "You're growing a life! Superhero mode active. ❤️" }
        };
        const msg = messages[phase] || messages["Follicular Phase"];
        if (elements.kindnessIcon) elements.kindnessIcon.textContent = msg.i;
        if (elements.kindnessMessage) elements.kindnessMessage.textContent = msg.t;
    }

    function calculateAIIntelligence(today) {
        const phase = elements.phaseBadge?.textContent || "Follicular Phase";
        const predictions = {
            "Ovulation": { e: "🔥", t: "Confidence is peaking! You're likely feeling social." },
            "Follicular": { e: "🌱", t: "Estrogen rising! Mood and creativity are lifting." },
            "Luteal": { e: "🌙", t: "Progesterone rising. Calm and quiet comfort recommended." },
            "Menstrual": { e: "🌸", t: "Hormones at lowest. Prioritize rest and grace." }
        };
        
        let pred = { e: "❋", t: "Log more data for deeper AI insights." };
        for (let k in predictions) {
            if (phase.includes(k)) { pred = predictions[k]; break; }
        }

        if (elements.aiMoodEmoji) elements.aiMoodEmoji.textContent = pred.e;
        if (elements.aiMood) elements.aiMood.textContent = pred.t;
        
        if (state.periods.length >= 2 && elements.aiConfidenceArea) {
            elements.aiConfidenceArea.classList.remove('hidden');
            if (elements.aiConfidenceScore) elements.aiConfidenceScore.textContent = "95";
        }
    }

    function isPeriodDate(dateStr) {
        const target = window.parseDateLocal(dateStr);
        return state.periods.some(p => {
            const start = window.parseDateLocal(p);
            const end = new Date(start);
            end.setDate(end.getDate() + state.periodLength - 1);
            return target >= start && target <= end;
        });
    }

    function renderCalendar() {
        if (!elements.calendarDays) return;
        elements.calendarDays.innerHTML = '';
        
        const year = state.currentMonth.getFullYear();
        const month = state.currentMonth.getMonth();
        if (elements.monthYear) elements.monthYear.textContent = state.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const todayStr = new Date().toISOString().split('T')[0];

        // Padding
        for (let i = 0; i < firstDay; i++) {
            const pad = document.createElement('div');
            pad.className = 'mini-day';
            pad.style.opacity = '0';
            elements.calendarDays.appendChild(pad);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayDiv = document.createElement('div');
            dayDiv.className = 'mini-day';
            dayDiv.textContent = i;

            if (dateStr === todayStr) dayDiv.classList.add('active');
            if (isPeriodDate(dateStr)) dayDiv.style.background = "rgba(255, 77, 109, 0.4)";
            
            dayDiv.onclick = () => openSymptomModal(dateStr);
            elements.calendarDays.appendChild(dayDiv);
        }
    }

    function setupEventListeners() {
        // Hydration Logic
        const addWater = document.getElementById('add-water');
        const remWater = document.getElementById('remove-water');
        if (addWater) addWater.onclick = () => { window.dispatchEvent(new CustomEvent('updateWater', { detail: 1 })); };
        if (remWater) remWater.onclick = () => { window.dispatchEvent(new CustomEvent('updateWater', { detail: -1 })); };

        // Log Period
        const logBtn = document.getElementById('mark-period-btn') || document.getElementById('log-period-btn');
        if (logBtn) {
            logBtn.onclick = () => {
                const today = new Date().toISOString().split('T')[0];
                if (!state.periods.includes(today)) {
                    state.periods.push(today);
                    state.periods.sort();
                    saveData('periods', state.periods);
                    updateDashboard();
                    renderCalendar();
                    alert("Period logged for today! ❤️");
                } else {
                    alert("Today is already logged! ❋");
                }
            };
        }

        // Month Nav
        const prevMonth = document.getElementById('prev-month');
        const nextMonth = document.getElementById('next-month');
        if (prevMonth) prevMonth.onclick = () => { state.currentMonth.setMonth(state.currentMonth.getMonth() - 1); renderCalendar(); };
        if (nextMonth) nextMonth.onclick = () => { state.currentMonth.setMonth(state.currentMonth.getMonth() + 1); renderCalendar(); };

        // Quick log in topbar
        const quickLog = document.getElementById('quick-log-btn');
        if (quickLog) quickLog.onclick = () => openSymptomModal(new Date().toISOString().split('T')[0]);
    }

    function openSymptomModal(dateStr) {
        // Simplified for this version
        const show = confirm(`Would you like to log symptoms for ${dateStr}?`);
        if (show) {
            alert("Symptom logging modal would open here. ❋");
        }
    }

    window.togglePregnancy = function() {
        const isChecked = document.getElementById("pregMode").checked;
        state.isPregnant = isChecked;
        saveData('isPregnant', state.isPregnant);
        if (state.isPregnant && !state.pregnancyStartDate) {
            state.pregnancyStartDate = new Date().toISOString().split('T')[0];
            localStorage.setItem(`pregnancyStartDate_${currentUser}`, state.pregnancyStartDate);
        }
        updateDashboard();
        renderCalendar();
    };

    initApp();
});
