document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('New LunaSession');

    // Elements
    const cycleDayEl = document.getElementById('cycle-day');
    const nextPeriodEl = document.getElementById('next-period');
    const fertileWindowEl = document.getElementById('fertile-window');
    const ovulationEl = document.getElementById('ovulation');
    const hydrationEl = document.getElementById('hydration');
    const partnerNameEl = document.getElementById('partner-name');
    const partnerEmailEl = document.getElementById('partner-email');
    const remindersEl = document.getElementById('reminders');

    // Mock data - in real app, fetch from storage or API
    const mockData = {
        cycleDay: 12,
        nextPeriod: 'May 22',
        fertileWindow: 'Apr 16 - 21',
        ovulation: 'Apr 24',
        hydration: '5 / 8',
        partnerName: 'Alex',
        partnerEmail: 'alex@gmail.com',
        reminders: '- Start vitamins<br>- Buy products<br>- Track symptoms'
    };

    // Populate data
    if (cycleDayEl) cycleDayEl.textContent = `Day ${mockData.cycleDay}`;
    if (nextPeriodEl) nextPeriodEl.textContent = mockData.nextPeriod;
    if (fertileWindowEl) fertileWindowEl.innerHTML = `<b>${mockData.fertileWindow}</b>`;
    if (ovulationEl) ovulationEl.innerHTML = `<b>${mockData.ovulation}</b>`;
    if (hydrationEl) hydrationEl.innerHTML = `<b>${mockData.hydration}</b>`;
    if (partnerNameEl) partnerNameEl.textContent = mockData.partnerName;
    if (partnerEmailEl) partnerEmailEl.textContent = mockData.partnerEmail;
    if (remindersEl) remindersEl.innerHTML = mockData.reminders;

    // Log Period function
    window.logPeriod = () => {
        alert('Period logged! (This would open a logging modal in the full app)');
    };

    console.log('Premium Dashboard loaded for user:', currentUser);
});

        const today = new Date();
        today.setHours(0,0,0,0);
        const ovulationDates = calculateOvulationDatesForMonth(year, month);

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.textContent = day;

            if (date.getTime() === today.getTime()) dayDiv.classList.add('today');
            
            // Highlight selected day
            if (dateString === selectedDateForSymptom) {
                dayDiv.classList.add('active-day');
            }
            
            if (!state.isPregnant) {
                const projectedPeriods = getProjectedPeriodsForMonth(year, month);
                if (isPeriodDate(dateString, projectedPeriods)) {
                    dayDiv.classList.add('period');
                } else if (ovulationDates.includes(dateString)) {
                    dayDiv.classList.add('ovulation', 'predicted');
                } else {
                    // Check for Fertile Window
                    const isFertile = isFertileWindow(dateString, projectedPeriods);
                    if (isFertile) dayDiv.classList.add('fertile');
                }
            }

            if (state.symptoms[dateString]) {
                const data = state.symptoms[dateString];
                // Support both new object format and legacy array format
                const hasNewData = (data.tags && data.tags.length > 0) || data.mood || data.energy || data.flow || data.pain || data.sleep || data.drive;
                const hasLegacyData = Array.isArray(data) && data.length > 0;
                
                if (hasNewData || hasLegacyData) {
                    dayDiv.classList.add('has-symptom');
                }
            }

            dayDiv.addEventListener('click', () => {
                openSymptomModal(dateString);
                renderCalendar(); // Re-render to show highlight
            });
            calendarDays.appendChild(dayDiv);
        }
    }

    function calculateOvulationDatesForMonth(year, month) {
        const projected = getProjectedPeriodsForMonth(year, month);
        if (projected.length === 0) return [];
        let ovulationDates = [];
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);

        for(let period of projected) {
            const pDate = window.parseDateLocal(period);
            if (!pDate) continue;
            const nextPeriod = new Date(pDate);
            nextPeriod.setDate(pDate.getDate() + state.cycleLength);
            const ovulation = new Date(nextPeriod);
            ovulation.setDate(nextPeriod.getDate() - 14);

            if (ovulation >= startOfMonth && ovulation <= endOfMonth) {
                ovulationDates.push(`${ovulation.getFullYear()}-${String(ovulation.getMonth() + 1).padStart(2, '0')}-${String(ovulation.getDate()).padStart(2, '0')}`);
            }
        }
        return [...new Set(ovulationDates)];
    }

    function getProjectedPeriodsForMonth(year, month) {
        if (state.periods.length === 0) return [];
        const lastActual = window.parseDateLocal(state.periods[state.periods.length - 1]);
        if (!lastActual) return [];
        
        const endView = new Date(year, month + 1, 0);
        let projections = [...state.periods];
        let current = new Date(lastActual);
        
        // Project forward for 12 months beyond the last period to be safe
        for (let i = 0; i < 12; i++) {
            current.setDate(current.getDate() + state.cycleLength);
            const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
            if (!projections.includes(dateStr)) projections.push(dateStr);
        }
        return projections;
    }

    function isFertileWindow(dateStr, projectedPeriods = null) {
        const periodsToUse = projectedPeriods || state.periods;
        if (periodsToUse.length === 0) return false;
        const target = window.parseDateLocal(dateStr);
        for (let period of periodsToUse) {
            const pDate = window.parseDateLocal(period);
            const nextPeriod = new Date(pDate);
            nextPeriod.setDate(nextPeriod.getDate() + state.cycleLength);
            const ovulation = new Date(nextPeriod);
            ovulation.setDate(ovulation.getDate() - 14);

            // fertile window is 5 days leading up to ovulation
            const windowStart = new Date(ovulation);
            windowStart.setDate(windowStart.getDate() - 5);
            
            if (target >= windowStart && target <= ovulation) return true;
        }
        return false;
    }

    function isPeriodDate(dateStr, projectedPeriods = null) {
        const target = window.parseDateLocal(dateStr);
        const periodsToUse = projectedPeriods || state.periods;
        return periodsToUse.some(p => {
            const start = window.parseDateLocal(p);
            const end = new Date(start);
            end.setDate(end.getDate() + state.periodLength - 1);
            return target >= start && target <= end;
        });
    }

    function getMoodTip(cycleDay) {
        if (cycleDay <= 5) return "Menstrual phase: Rest and hydrate 💜";
        if (cycleDay <= 13) return "Follicular: Energy rising! Try a light workout 🌸";
        if (cycleDay == 14) return "Ovulation: Confidence is high ✨";
        return "Luteal phase: Mood swings possible, self-care recommended 🌙";
    }

    function updateDashboard() {
        if (state.isPregnant) {
            const lmp = window.parseDateLocal(state.pregnancyStartDate);
            const today = new Date();
            today.setHours(0,0,0,0);
            const diffDays = Math.floor((today - lmp) / (1000 * 60 * 60 * 24));
            const weeks = Math.floor(diffDays / 7) + 1;
            const daysIntoWeek = diffDays % 7;

            if(pregnancyWeekText) pregnancyWeekText.textContent = `Week ${weeks}`;
            if(pregnancyDaysText) pregnancyDaysText.textContent = `Day ${daysIntoWeek}`;
            if(babySizeText) babySizeText.textContent = `Size of a ${babySizes[weeks] || "Watermelon 🍉"}`;
            
            const dueDate = new Date(lmp);
            dueDate.setDate(dueDate.getDate() + 280);
            if(dueDateText) dueDateText.textContent = `Due Date: ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        } else {
            if (state.periods.length === 0) {
                if(heroCountdown) heroCountdown.textContent = 'LOG PERIOD';
                return;
            }
            const lastPeriod = window.parseDateLocal(state.periods[state.periods.length - 1]);
            const nextPeriod = new Date(lastPeriod);
            nextPeriod.setDate(nextPeriod.getDate() + state.cycleLength);
            const today = new Date();
            today.setHours(0,0,0,0);

            if(heroCountdown) {
                const diffTime = nextPeriod - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                heroCountdown.innerText = diffDays <= 0 ? (diffDays === 0 ? "TODAY" : Math.abs(diffDays) + " DAYS LATE") : diffDays + " DAYS LEFT";
            }

            // Cycle Ring & AI Mood Update
            const dayDiff = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1;
            const currentCycleDay = ((dayDiff - 1) % state.cycleLength) + 1;
            
            if (cycleDayText) cycleDayText.innerText = "Day " + currentCycleDay;

            // Animate the SVG ring progress
            const svgRing = document.getElementById('cycle-ring-progress');
            if (svgRing) {
                const circumference = 2 * Math.PI * 108; // r=108 as in HTML
                const percent = currentCycleDay / state.cycleLength;
                const offset = circumference - percent * circumference;
                svgRing.style.strokeDasharray = circumference;
                svgRing.style.strokeDashoffset = offset;
                const totalText = document.querySelector('.ring-content .total-text');
                if (totalText) totalText.textContent = `of ${state.cycleLength}`;
            }

            const aiMoodDisplay = document.getElementById("aiMood");
            if (aiMoodDisplay) {
                aiMoodDisplay.innerText = getMoodTip(currentCycleDay);
            }

            // Update Fertile Window & Ovulation info cards
            const fertileVal = document.getElementById('fertile');
            const ovulationVal = document.getElementById('ovulation');
            if (fertileVal || ovulationVal) {
                const ovulation = new Date(nextPeriod);
                ovulation.setDate(nextPeriod.getDate() - 14);
                const fertileStart = new Date(ovulation);
                fertileStart.setDate(ovulation.getDate() - 5);
                const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (fertileVal) fertileVal.textContent = fmt(fertileStart);
                if (ovulationVal) ovulationVal.textContent = fmt(ovulation);
            }

            calculateAdvancedInsights(lastPeriod, nextPeriod, today);
            calculateAIIntelligence(today);
            renderLunaDailyNote(today);
        }
    }

    function renderLunaDailyNote(today) {
        if (!kindnessMessage || !kindnessTitle) return;
        
        const phase = document.getElementById('cycle-phase-badge')?.textContent || "Follicular";
        kindnessTitle.textContent = "Luna's Daily Note 🌙";
        
        const notes = {
            "Follicular": "Your creativity is blooming! It's a great day to start that project you've been thinking about. I believe in you. ✨",
            "Ovulation": "You're glowing today! Your natural confidence is at its peak. Go out and share your light with the world. 🔥",
            "Luteal": "It's okay to slow down. Your body is preparing for rest, and honoring that is a superpower. You're doing great. 🌙",
            "Menstrual": "Be extra gentle with yourself today. You are strong for listening to what your body needs. I'm right here. 🌸"
        };
        
        for (const [key, note] of Object.entries(notes)) {
            if (phase.includes(key)) {
                kindnessMessage.textContent = `"${note}"`;
                break;
            }
        }
    }

    function renderCycleWheel(lastPeriod) {
        const circle = document.getElementById('cycle-progress-circle');
        const wheelDay = document.getElementById('days-count');
        const wheelPhase = document.getElementById('wheel-phase-text');
        if (!circle) return;

        const today = new Date();
        today.setHours(0,0,0,0);
        const diffDays = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1;
        
        // Cycle is day 1 to cycleLength
        const currentDay = ((diffDays - 1) % state.cycleLength) + 1;
        
        if (wheelDay) wheelDay.textContent = currentDay;
        
        // Circumference for r=95 is roughly 597
        const circumference = 2 * Math.PI * 95;
        const offset = (currentDay / state.cycleLength) * circumference;
        circle.style.strokeDasharray = `${offset} ${circumference}`;

        // Phase label for wheel
        const phaseBadge = document.getElementById('cycle-phase-badge');
        if (wheelPhase && phaseBadge) {
            wheelPhase.textContent = phaseBadge.textContent.replace(' 🩸', '').replace(' ✨', '');
        }
    }

    function calculateAIIntelligence(today) {
        // 1. Confidence Score
        if (state.periods.length >= 2) {
            const score = calculateConfidenceScore();
            if (aiConfidenceArea && aiConfidenceScore) {
                aiConfidenceArea.classList.remove('hidden');
                aiConfidenceScore.textContent = score;
            }
        }

        // 2. Mood Prediction
        const mood = getMoodPrediction(today);
        if (moodInsightEmoji && moodInsightText) {
            moodInsightEmoji.textContent = mood.emoji;
            moodInsightText.textContent = mood.text;
        }
    }

    function calculateConfidenceScore() {
        if (state.periods.length < 2) return "--";
        
        let base = 75; // Starting point for having any data
        const cycleDiffs = [];
        for (let i = state.periods.length - 1; i > 0; i--) {
            const d1 = window.parseDateLocal(state.periods[i]);
            const d2 = window.parseDateLocal(state.periods[i-1]);
            if (!d1 || !d2) continue;
            
            const diff = Math.abs(Math.floor((d1 - d2) / (1000 * 60 * 60 * 24)));
            cycleDiffs.push(Math.abs(diff - state.cycleLength));
        }

        if (cycleDiffs.length === 0) return "--";

        const avgDeviation = cycleDiffs.reduce((a, b) => a + b, 0) / cycleDiffs.length;
        
        // More cycles = more confidence (up to 15 cycles)
        const countBonus = Math.min(state.periods.length * 1.5, 20);
        
        // Regularity penalty: max penalty of 40 if avg deviation is 8+ days
        const regularityPenalty = Math.min(avgDeviation * 5, 40);
        
        return Math.round(Math.min(Math.max(base + countBonus - regularityPenalty, 50), 98));
    }

    function getMoodPrediction(today) {
        // Simple logic based on current phase
        const phase = document.getElementById('cycle-phase-badge')?.textContent || "";
        
        if (phase.includes("Ovulation")) {
            return { emoji: "🔥", text: "Confidence is peaking today! You're likely feeling social and energetic." };
        } else if (phase.includes("Follicular")) {
            return { emoji: "🌱", text: "Rising estrogen is lifting your mood and creativity. Great time for new projects!" };
        } else if (phase.includes("Luteal")) {
            return { emoji: "🌙", text: "Progesterone is rising. You might feel more introverted or crave quiet comfort." };
        } else if (phase.includes("Menstrual")) {
            return { emoji: "🌸", text: "Hormones are at their lowest. Prioritize rest and be gentle with yourself." };
        }
        
        return { emoji: "✨", text: "Log more cycles for personalized emotional trend insights." };
    }

    function calculateAdvancedInsights(lastPeriod, nextPeriod, today) {
        const phaseBadge = document.getElementById('cycle-phase-badge');
        const fertilityText = document.getElementById('fertility-text');
        const alertBox = document.getElementById('irregularity-alert');
        const timeline = document.getElementById('cycle-timeline');

        if (!phaseBadge || !fertilityText) return;

        const cycleLength = state.cycleLength;
        const ovulationDay = new Date(nextPeriod);
        ovulationDay.setDate(ovulationDay.getDate() - 14);

        const diffToOvu = Math.ceil((ovulationDay - today) / (1000 * 60 * 60 * 24));
        const learnMoreLink = document.getElementById('phase-learn-more');
        const isPrivate = JSON.parse(localStorage.getItem(`privateMode_${currentUser}`)) || false;
        
        // 0. Menstrual Phase Check
        const isPeriod = isPeriodDate(today.toISOString().split('T')[0]);

        // 1. Phase Calculation
        if (isPeriod) {
            phaseBadge.textContent = isPrivate ? "Current Phase" : "Menstrual Phase 🩸";
            phaseBadge.style.background = "#ffb3c1";
            fertilityText.textContent = isPrivate ? "Low chance of conception." : "Low fertility. Your body is focusing on renewal.";
            if (learnMoreLink) learnMoreLink.href = "wellness.html#menstrual";
            updateKindnessCorner("Menstrual Phase 🩸");
        } else if (today.getTime() === ovulationDay.getTime()) {
            phaseBadge.textContent = isPrivate ? "Current Phase" : "Ovulation Phase ✨";
            phaseBadge.style.background = "#ffb703";
            fertilityText.textContent = isPrivate ? "High chance of conception." : "Peak fertility! Highest chance of conception. 🔥";
            if (learnMoreLink) learnMoreLink.href = "wellness.html#ovulation";
            updateKindnessCorner("Ovulation Phase ✨");
        } else if (today < ovulationDay) {
            phaseBadge.textContent = isPrivate ? "Current Phase" : "Follicular Phase";
            phaseBadge.style.background = "var(--primary)";
            if (diffToOvu <= 5) {
                fertilityText.textContent = isPrivate ? "Chance of conception: High" : "High fertility! Your fertile window has opened. ✨";
            } else {
                fertilityText.textContent = isPrivate ? "Chance of conception: Low" : "Low fertility. Approaching fertile window soon.";
            }
            if (learnMoreLink) learnMoreLink.href = "wellness.html#follicular";
            updateKindnessCorner("Follicular Phase");
        } else {
            phaseBadge.textContent = isPrivate ? "Current Phase" : "Luteal Phase";
            phaseBadge.style.background = "#43aa8b";
            fertilityText.textContent = isPrivate ? "Low chance of conception." : "Low fertility. Your body is preparing for the next cycle.";
            if (learnMoreLink) learnMoreLink.href = "wellness.html#luteal";
            updateKindnessCorner("Luteal Phase");
        }

        // 2. Irregularity Alert
        if (state.periods.length >= 3) {
            const cycleDiffs = [];
            for (let i = state.periods.length - 1; i > 0; i--) {
                const d1 = new Date(state.periods[i]);
                const d2 = new Date(state.periods[i-1]);
                cycleDiffs.push(Math.floor((d1 - d2) / (1000 * 60 * 60 * 24)));
            }
            const maxDiff = Math.max(...cycleDiffs) - Math.min(...cycleDiffs);
            if (maxDiff > 7 && alertBox) {
                alertBox.classList.remove('hidden');
            } else if (alertBox) {
                alertBox.classList.add('hidden');
            }

            // 3. Timeline visualization
            if (timeline) {
                timeline.innerHTML = '';
                cycleDiffs.slice(0, 5).reverse().forEach(len => {
                    const bar = document.createElement('div');
                    bar.style.flex = "1";
                    bar.style.height = "100%";
                    const heightPercent = Math.min((len / 45) * 100, 100);
                    bar.style.background = len > 35 || len < 21 ? "#f77f00" : "var(--primary)";
                    bar.style.opacity = "0.6";
                    bar.title = `${len} days`;
                    timeline.appendChild(bar);
                });
            }

            // 4. Symptom Patterns
            calculateSymptomPatterns();

            // 5. Phase Tips
            updatePhaseTips(phaseBadge.textContent.replace(' ✨', ''));
        }

        // 6. Update cycle-summary Fertile/Ovulation text (works for any number of periods)
        if (fertileDateText && ovulationDateText) {
            const ovulation = new Date(nextPeriod);
            ovulation.setDate(nextPeriod.getDate() - 14);
            const fertileStart = new Date(ovulation);
            fertileStart.setDate(ovulation.getDate() - 5);
            const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            fertileDateText.innerText = fmt(fertileStart);
            ovulationDateText.innerText = fmt(ovulation);
        }

    }

    function updatePhaseTips(phaseName) {
        const nutText = document.getElementById('tip-nutrition-text');
        const exeText = document.getElementById('tip-exercise-text');
        const selfText = document.getElementById('tip-selfcare-text');

        if (!nutText || !exeText || !selfText) return;

        const phaseBank = {
            "Menstrual Phase": {
                nutrition: "Focus on iron-rich foods like spinach and magnesium-packed dark chocolate. 🍫",
                exercise: "Opt for gentle movement: stretching, yoga, or a light walk. 🧘‍♀️",
                selfcare: "Prioritize rest and use a warm compress for comfort. 🍵"
            },
            "Follicular Phase": {
                nutrition: "Boost energy with fermented foods, lean proteins, and fresh citrus. 🍊",
                exercise: "Great time for HIIT or strength training as energy rises! 🏃‍♀️",
                selfcare: "Plan new projects or socialize—your creativity is peaking. ✨"
            },
            "Ovulation Phase": {
                nutrition: "Choose anti-inflammatory, high-fiber foods to support your gut. 🥗",
                exercise: "Go for high-intensity workouts or a long run today. ⚡",
                selfcare: "Connect with others and treat yourself to something that makes you feel beautiful. 💄"
            },
            "Luteal Phase": {
                nutrition: "Complex carbs like sweet potatoes help stabilize mood and cravings. 🍠",
                exercise: "Try moderate activity like Pilates, hiking, or swimming. 🚣‍♀️",
                selfcare: "Set boundaries and create a cozy evening routine for relaxation. 🌙"
            }
        };

        const currentPhase = phaseBank[phaseName] || phaseBank["Menstrual Phase"];
        
        nutText.textContent = currentPhase.nutrition;
        exeText.textContent = currentPhase.exercise;
        selfText.textContent = currentPhase.selfcare;

        updateKindnessCorner(phaseName);
    }

    function updateKindnessCorner(phaseName) {
        const kindnessIcon = document.getElementById('kindness-icon');
        const kindnessMessage = document.getElementById('kindness-message');
        if (!kindnessIcon || !kindnessMessage) return;

        const messages = {
            "Menstrual Phase 🩸": {
                icon: "🌸",
                text: "You're doing amazing! Your body is working hard—remember to rest and be kind to yourself today. ✨"
            },
            "Follicular Phase": {
                icon: "🌱",
                text: "New beginnings, new energy! You're glowing and ready to take on the world. Dream big! 🚀"
            },
            "Ovulation Phase ✨": {
                icon: "💫",
                text: "You are absolutely radiant! Your confidence is magnetic. Shine bright like the star you are! 🌟"
            },
            "Luteal Phase": {
                icon: "🌙",
                text: "Slow down and listen to your heart. You're strong, capable, and deserve all the cozy moments today. 🧸"
            },
            "Pregnancy": {
                icon: "👶",
                text: "You're growing a little life! You're a superhero in disguise. Take a deep breath and feel the love. ❤️"
            }
        };

        const currentKindness = messages[phaseName] || messages["Follicular Phase"];
        kindnessIcon.textContent = currentKindness.icon;
        kindnessMessage.textContent = currentKindness.text;
    }

    function calculateSymptomPatterns() {
        const patternsContainer = document.getElementById('patterns-container');
        if (!patternsContainer) return;

        const cycleLength = state.cycleLength;
        const periods = state.periods;
        const symptoms = state.symptoms;

        if (periods.length < 2 || Object.keys(symptoms).length < 5) {
            patternsContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">Keep logging symptoms and periods to discover your body's unique patterns! ✨</p>`;
            return;
        }

        const patterns = [];
        const symptomCounts = {
            'luteal': {}, // 7 days before period
            'ovulatory': {} // 3 days around ovulation (approx day 14 before next period)
        };

        // Correlate symptoms with phases
        for (let dateStr in symptoms) {
            const date = new Date(dateStr);
            const data = symptoms[dateStr];
            const tags = (data.tags || []).concat(data.mood ? [data.mood] : []);
            
            // Find which phase this date belongs to
            periods.forEach(p => {
                const periodDate = new Date(p);
                const nextPeriodExpected = new Date(periodDate);
                nextPeriodExpected.setDate(nextPeriodExpected.getDate() + cycleLength);
                
                const diffToNext = (nextPeriodExpected - date) / (1000 * 60 * 60 * 24);
                
                if (diffToNext > 0 && diffToNext <= 7) {
                    tags.forEach(t => {
                        symptomCounts.luteal[t] = (symptomCounts.luteal[t] || 0) + 1;
                    });
                }
                
                const ovuExpected = new Date(nextPeriodExpected);
                ovuExpected.setDate(ovuExpected.getDate() - 14);
                const diffToOvu = Math.abs((date - ovuExpected) / (1000 * 60 * 60 * 24));
                
                if (diffToOvu <= 2) {
                    tags.forEach(t => {
                        symptomCounts.ovulatory[t] = (symptomCounts.ovulatory[t] || 0) + 1;
                    });
                }
            });
        }

        // Generate Insights
        for (let s in symptomCounts.luteal) {
            if (symptomCounts.luteal[s] >= 2) {
                patterns.push({
                    text: `<b>${s.charAt(0).toUpperCase() + s.slice(1)}</b> is common during your <b>Luteal Phase</b> (pre-period).`,
                    icon: '🌙'
                });
            }
        }
        for (let s in symptomCounts.ovulatory) {
            if (symptomCounts.ovulatory[s] >= 2) {
                patterns.push({
                    text: `You often feel <b>${s}</b> during your <b>Ovulation Window</b>.`,
                    icon: '✨'
                });
            }
        }

        if (patterns.length > 0) {
            patternsContainer.innerHTML = patterns.slice(0, 3).map(p => `
                <div style="display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-start; background: rgba(255,255,255,0.3); padding: 10px; border-radius: 8px;">
                    <span style="font-size: 1.2rem;">${p.icon}</span>
                    <p style="font-size: 0.85rem; line-height: 1.4;">${p.text}</p>
                </div>
            `).join('');
        } else {
            patternsContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">Analyzing your logs... patterns will appear here soon! 📈</p>`;
        }
    }

    function applyPregnancyMode() {
        const pregModeCheckbox = document.getElementById("pregMode");
        if (pregModeCheckbox) {
            pregModeCheckbox.checked = state.isPregnant;
        }

        const pregDash = document.getElementById("pregnancyDashboard");
        const cycleDash = document.getElementById("cycleDashboard");

        if (state.isPregnant) {
            document.body.classList.add('pregnancy-mode');
            if(menstrualStats) menstrualStats.classList.add('hidden');
            if(pregnancyStats) pregnancyStats.classList.remove('hidden');
            if(pregnancyBanner) pregnancyBanner.classList.remove('hidden');
            if(menstrualSymptomGrid) menstrualSymptomGrid.classList.add('hidden');
            if(pregnancySymptomGrid) pregnancySymptomGrid.classList.remove('hidden');
            updateKindnessCorner("Pregnancy");
        } else {
            document.body.classList.remove('pregnancy-mode');
            if(menstrualStats) menstrualStats.classList.remove('hidden');
            if(pregnancyStats) pregnancyStats.classList.add('hidden');
            if(pregnancyBanner) pregnancyBanner.classList.add('hidden');
            if(menstrualSymptomGrid) menstrualSymptomGrid.classList.remove('hidden');
            if(pregnancySymptomGrid) pregnancySymptomGrid.classList.add('hidden');
        }
    }

    function calculatePredictionsForDate(dateStr) {
        if(state.isPregnant || state.periods.length === 0) {
            return { menstruation: "Requires period data", ovulation: "Requires period data" };
        }
        const targetDate = window.parseDateLocal(dateStr);
        const [y, m, d] = dateStr.split('-').map(Number);
        const projected = getProjectedPeriodsForMonth(y, m - 1);
        
        let closestPeriodStr = null;
        for (let i = projected.length - 1; i >= 0; i--) {
            if (window.parseDateLocal(projected[i]) <= targetDate) {
                closestPeriodStr = projected[i];
                break;
            }
        }
        if (!closestPeriodStr) {
            // If target is before our first period, we can't predict backwards easily
            return { menstruation: "Too early for prediction", ovulation: "Too early for prediction" };
        }

        const lastPeriod = window.parseDateLocal(closestPeriodStr);
        const nextPeriodStart = new Date(lastPeriod);
        nextPeriodStart.setDate(nextPeriodStart.getDate() + state.cycleLength);
        
        const nextOvulation = new Date(nextPeriodStart);
        nextOvulation.setDate(nextOvulation.getDate() - 14);

        const currentMenstruationStart = new Date(lastPeriod);
        const currentMenstruationEnd = new Date(currentMenstruationStart);
        currentMenstruationEnd.setDate(currentMenstruationEnd.getDate() + state.periodLength - 1);

        const currentOvulation = new Date(currentMenstruationStart);
        currentOvulation.setDate(currentOvulation.getDate() + state.cycleLength - 14);

        let mensStatus = "";
        if (targetDate >= currentMenstruationStart && targetDate <= currentMenstruationEnd) {
            mensStatus = "During Menstruation";
        } else if (targetDate < currentMenstruationStart) {
             mensStatus = "Before Record Start";
        } else {
            const diffMens = Math.round((nextPeriodStart - targetDate) / (1000 * 60 * 60 * 24));
            mensStatus = diffMens === 0 ? "Starts Today" : `In ${diffMens} day(s)`;
        }

        let ovuStatus = "";
        targetDate.setHours(0,0,0,0);
        currentOvulation.setHours(0,0,0,0);
        nextOvulation.setHours(0,0,0,0);

        if (targetDate.getTime() === currentOvulation.getTime() || targetDate.getTime() === nextOvulation.getTime()) {
            ovuStatus = "Predicted Ovulation Day";
        } else {
            let targetOvulation = targetDate < currentOvulation ? currentOvulation : nextOvulation;
            const diffOvu = Math.round((targetOvulation - targetDate) / (1000 * 60 * 60 * 24));
            ovuStatus = diffOvu === 0 ? "Starts Today" : `In ${diffOvu} day(s)`;
        }

        return { menstruation: mensStatus, ovulation: ovuStatus };
    }

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const energyRange = document.getElementById('energy-range');
    const painRange = document.getElementById('pain-range');
    const sleepHours = document.getElementById('sleep-hours');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const flowButtons = document.querySelectorAll('.flow-btn');
    const driveButtons = document.querySelectorAll('.drive-btn');

    function setupAppEventListeners() {
        const quickLogBtn = document.getElementById('quick-log-btn');
        if (quickLogBtn) {
            quickLogBtn.addEventListener('click', () => {
                const now = new Date();
                const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                openSymptomModal(todayStr);
            });
        }
        // ... (existing kick, prev/next month, markPeriodBtn, etc.)
        if(logKickBtn) {
            logKickBtn.addEventListener('click', () => {
                const now = new Date();
                const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                if (!state.symptoms[today]) state.symptoms[today] = { tags: [] };
                if (!state.symptoms[today].tags) state.symptoms[today].tags = [];
                if (!state.symptoms[today].tags.includes('kick')) {
                    state.symptoms[today].tags.push('kick');
                    saveData('symptoms', state.symptoms);
                    renderCalendar();
                    alert("Baby kick logged! ❤️");
                }
            });
        }

        if(prevMonthBtn) prevMonthBtn.addEventListener('click', () => { state.currentMonth.setMonth(state.currentMonth.getMonth() - 1); renderCalendar(); });
        if(nextMonthBtn) nextMonthBtn.addEventListener('click', () => { state.currentMonth.setMonth(state.currentMonth.getMonth() + 1); renderCalendar(); });
        
        if(markPeriodBtn) {
            markPeriodBtn.addEventListener('click', () => {
                if (state.isPregnant) return;
                const now = new Date();
                const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                if (!state.periods.includes(today)) {
                    state.periods.push(today);
                    state.periods.sort();
                    saveData('periods', state.periods);
                    renderCalendar();
                    updateDashboard();
                }
            });
        }

        if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if(overlay) overlay.addEventListener('click', closeModal);
        if(saveSymptomsBtn) saveSymptomsBtn.addEventListener('click', saveSymptoms);
        
        // Tab switching
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const paneId = `tab-${btn.dataset.tab}`;
                const pane = document.getElementById(paneId);
                if (pane) {
                    tabButtons.forEach(b => b.classList.remove('active'));
                    tabPanes.forEach(p => p.classList.add('hidden'));
                    btn.classList.add('active');
                    pane.classList.remove('hidden');
                }
            });
        });

        // Multi-select for generic symptoms
        if (symptomButtons) {
            symptomButtons.forEach(btn => {
                btn.addEventListener('click', () => btn.classList.toggle('active'));
            });
        }

        // Single-select for Mood, Flow, Drive
        function setupSingleSelect(btns) {
            if (!btns) return;
            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    btns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }
        setupSingleSelect(moodButtons);
        setupSingleSelect(flowButtons);
        setupSingleSelect(driveButtons);

        if(togglePeriodBtn) {
            togglePeriodBtn.addEventListener('click', () => {
                if (state.isPregnant) return alert("Cannot edit periods while in Pregnancy Mode.");
                const index = state.periods.indexOf(selectedDateForSymptom);
                if (index > -1) state.periods.splice(index, 1);
                else state.periods.push(selectedDateForSymptom);
                state.periods.sort();
                saveData('periods', state.periods);
                updateTogglePeriodButtonText();
                const predictions = calculatePredictionsForDate(selectedDateForSymptom);
                if(predMenstruationDisplay) predMenstruationDisplay.textContent = predictions.menstruation;
                if(predOvulationDisplay) predOvulationDisplay.textContent = predictions.ovulation;
                renderCalendar();
                updateDashboard();
            });
        }
    }

    // Global askAI for the dashboard quick-box
    window.askAI = function() {
        const q = document.getElementById("question").value;
        const responseArea = document.getElementById("aiResponse");
        
        if (responseArea) {
            responseArea.innerText = "I hear you. Hormonal changes can affect how you feel. Try resting and drinking water today 💜";
            responseArea.style.opacity = '1';
            responseArea.style.animation = 'slideUpFade 0.5s ease';
            document.getElementById("question").value = "";
        }
    };

    // Global sendPartnerMessage for the dashboard widget
    window.sendPartnerMessage = function() {
        const input = document.getElementById("partner-input");
        if (input && input.value.trim() !== "") {
            const text = input.value.trim();
            const btn = event.currentTarget || document.querySelector('.partner-chat button');
            
            // Persistent storage logic
            const messages = JSON.parse(localStorage.getItem(`luna_partner_messages_${currentUser}`)) || [];
            messages.push({
                sender: 'User', // In dashboard, sender is the User
                text: text,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem(`luna_partner_messages_${currentUser}`, JSON.stringify(messages));

            if(btn) {
                const originalText = btn.innerText;
                btn.innerText = "Sent! ✨";
                btn.style.background = "#43aa8b";
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = "";
                }, 2000);
            }
            input.value = "";
        }
    };

    // Global Pregnancy Mode Toggle
    window.togglePregnancy = function() {
        const isChecked = document.getElementById("pregMode").checked;
        state.isPregnant = isChecked;
        
        // Persist
        saveData('isPregnant', state.isPregnant);
        
        // If entering pregnancy mode, set a default start date if none exists
        if (state.isPregnant && !state.pregnancyStartDate) {
            state.pregnancyStartDate = new Date().toISOString().split('T')[0];
            localStorage.setItem(`pregnancyStartDate_${currentUser}`, state.pregnancyStartDate);
        }

        // Apply UI changes
        const pregDash = document.getElementById("pregnancyDashboard");
        const cycleDash = document.getElementById("cycleDashboard");
        
        if (state.isPregnant) {
            if(pregDash) pregDash.style.display = "block";
            if(cycleDash) cycleDash.style.display = "none";
            if(pregnancyBanner) pregnancyBanner.classList.remove('hidden');
        } else {
            if(pregDash) pregDash.style.display = "none";
            if(cycleDash) cycleDash.style.display = "block";
            if(pregnancyBanner) pregnancyBanner.classList.add('hidden');
        }
        
        updateDashboard();
        renderCalendar();
    };

    function openSymptomModal(dateStr) {
        selectedDateForSymptom = dateStr;
        
        // Reset tabs to Emotional
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.add('hidden'));
        
        const defaultTabBtn = Array.from(tabButtons).find(b => b.dataset.tab === 'emotional');
        if(defaultTabBtn) defaultTabBtn.classList.add('active');
        
        const defaultTabPane = document.getElementById('tab-emotional');
        if(defaultTabPane) defaultTabPane.classList.remove('hidden');

        const [y, m, d] = dateStr.split('-').map(Number);
        const displayDate = new Date(y, m - 1, d);
        if(selectedDateDisplay) selectedDateDisplay.textContent = displayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        
        let data = state.symptoms[dateStr] || {};
        // Migrate legacy array data on the fly
        if (Array.isArray(data)) {
            data = { tags: data };
        }
        
        // Reset and Load Mood
        moodButtons.forEach(btn => btn.classList.remove('active'));
        if(data.mood) document.querySelector(`.mood-btn[data-mood="${data.mood}"]`)?.classList.add('active');
        
        // Load Scales
        if(energyRange) energyRange.value = data.energy || 3;
        if(painRange) painRange.value = data.pain || 1;
        if(sleepHours) sleepHours.value = data.sleep || "";

        // Load Flow
        flowButtons.forEach(btn => btn.classList.remove('active'));
        if(data.flow) document.querySelector(`.flow-btn[data-flow="${data.flow}"]`)?.classList.add('active');

        // Load Drive
        driveButtons.forEach(btn => btn.classList.remove('active'));
        if(data.drive) document.querySelector(`.drive-btn[data-drive="${data.drive}"]`)?.classList.add('active');

        // Load Multi-select symptoms
        const activeTags = data.tags || [];
        symptomButtons.forEach(btn => {
            if (activeTags.includes(btn.dataset.symptom)) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        const predictions = calculatePredictionsForDate(dateStr);
        if(predMenstruationDisplay) predMenstruationDisplay.textContent = predictions.menstruation;
        if(predOvulationDisplay) predOvulationDisplay.textContent = predictions.ovulation;
        updateTogglePeriodButtonText();

        if(modal) modal.classList.remove('hidden');
        if(overlay) overlay.classList.remove('hidden');
    }

    function closeModal() {
        if(modal) modal.classList.add('hidden');
        if(overlay) overlay.classList.add('hidden');
    }

    function updateTogglePeriodButtonText() {
        if(!togglePeriodBtn) return;
        if(state.isPregnant) { togglePeriodBtn.style.display = 'none'; return; }
        togglePeriodBtn.style.display = 'block';
        if(state.periods.includes(selectedDateForSymptom)) {
            togglePeriodBtn.textContent = "Unmark Period Start";
            togglePeriodBtn.style.background = "#999";
        } else {
            togglePeriodBtn.textContent = "Mark as Period Start";
            togglePeriodBtn.style.background = "var(--primary-dark)";
        }
    }

    function saveSymptoms() {
        const data = {};
        
        const activeMood = Array.from(moodButtons).find(b => b.classList.contains('active'))?.dataset.mood;
        if(activeMood) data.mood = activeMood;
        
        data.energy = parseInt(energyRange.value);
        data.pain = parseInt(painRange.value);
        if(sleepHours.value) data.sleep = parseFloat(sleepHours.value);
        
        const activeFlow = Array.from(flowButtons).find(b => b.classList.contains('active'))?.dataset.flow;
        if(activeFlow) data.flow = activeFlow;
        
        const activeDrive = Array.from(driveButtons).find(b => b.classList.contains('active'))?.dataset.drive;
        if(activeDrive) data.drive = activeDrive;
        
        data.tags = Array.from(symptomButtons).filter(b => b.classList.contains('active')).map(b => b.dataset.symptom);
        
        if (Object.keys(data).length > 1 || (data.tags && data.tags.length > 0)) {
            state.symptoms[selectedDateForSymptom] = data;
        } else {
            delete state.symptoms[selectedDateForSymptom];
        }

        saveData('symptoms', state.symptoms);
        closeModal();
        renderCalendar();
        updateDashboard();
    }

    initAppFeatures();
});
