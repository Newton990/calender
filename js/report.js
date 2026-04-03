document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('New LunaSession');
    if (!currentUser) return;

    const periods = JSON.parse(localStorage.getItem(`periods_${currentUser}`)) || [];
    periods.sort((a, b) => new Date(a) - new Date(b));
    const symptomData = JSON.parse(localStorage.getItem(`symptoms_${currentUser}`)) || {};
    const cycleLength = JSON.parse(localStorage.getItem(`cycleLength_${currentUser}`)) || 28;

    // 1. Cycle Analytics
    const calculateCycleStats = () => {
        if (periods.length < 2) return;

        let totalLength = 0;
        let diffs = [];
        
        for (let i = 1; i < periods.length; i++) {
            const current = window.parseDateLocal(periods[i]);
            const prev = window.parseDateLocal(periods[i-1]);
            const diff = Math.ceil((current - prev) / (1000 * 60 * 60 * 24));
            totalLength += diff;
            diffs.push(diff);
        }

        const avg = Math.round(totalLength / (periods.length - 1));
        document.getElementById('avg-cycle-length').textContent = `${avg} Days`;
        document.getElementById('total-tracked').textContent = periods.length;

        // Consistency Score (Variance check)
        if (diffs.length > 0) {
            const variance = Math.max(...diffs) - Math.min(...diffs);
            let score = "Excellent";
            if (variance > 3) score = "Good";
            if (variance > 7) score = "Irregular";
            document.getElementById('cycle-consistency').textContent = score;
        }
    };

    // 2. Symptom Heatmap
    const generateSymptomHeatmap = () => {
        const counts = {};
        let maxCount = 0;

        Object.values(symptomData).forEach(day => {
            if (day.tags && Array.isArray(day.tags)) {
                day.tags.forEach(s => {
                    counts[s] = (counts[s] || 0) + 1;
                    if (counts[s] > maxCount) maxCount = counts[s];
                });
            }
        });

        const symptomList = document.getElementById('symptom-list');
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

        if (sorted.length === 0) {
            symptomList.innerHTML = '<p style="font-size: 0.9rem; opacity: 0.6;">No symptom data recorded yet.</p>';
            return;
        }

        sorted.forEach(([name, count]) => {
            const percentage = (count / maxCount) * 100;
            const div = document.createElement('div');
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; font-size:0.85rem; margin-bottom: 5px;">
                    <span>${name}</span>
                    <span>${count} times</span>
                </div>
                <div class="chart-placeholder">
                    <div class="chart-bar" style="width: ${percentage}%"></div>
                </div>
            `;
            symptomList.appendChild(div);
        });
    };

    // 3. Mood Patterns
    const generateMoodReport = () => {
        const moodBoard = document.getElementById('mood-phase-report');
        const moodsByPhase = {
            'Menstrual': [],
            'Follicular': [],
            'Ovulatory': [],
            'Luteal': []
        };

        // Simplified phase mapping for report
        Object.entries(symptomData).forEach(([date, data]) => {
            if (data.mood) {
                // Determine phase of that date (rough estimate)
                // In a real app, this would use the calculated phase for that specific date
                // For now, we'll just show the most frequent moods if they exist
                moodsByPhase['Follicular'].push(data.mood); 
            }
        });

        const dominantMood = (arr) => {
            if (arr.length === 0) return "No data";
            return arr.sort((a,b) =>
                arr.filter(v => v===a).length - arr.filter(v => v===b).length
            ).pop();
        };

        ['Menstrual', 'Follicular', 'Ovulatory', 'Luteal'].forEach(phase => {
            const div = document.createElement('div');
            div.className = 'glass stat-box';
            div.style.padding = '15px';
            div.innerHTML = `
                <span style="font-size: 0.8rem; opacity: 0.7; display: block;">${phase}</span>
                <strong style="font-size: 1.1rem; color: var(--primary);">${dominantMood(moodsByPhase[phase])}</strong>
            `;
            moodBoard.appendChild(div);
        });
    };

    // 4. Period History
    const populateHistory = () => {
        const body = document.getElementById('history-body');
        if (periods.length === 0) return;

        const revPeriods = [...periods].reverse();
        revPeriods.forEach((p, idx) => {
            const startDate = window.parseDateLocal(p);
            const duration = JSON.parse(localStorage.getItem(`periodLength_${currentUser}`)) || 5;
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + duration - 1);

            let cycleLen = "--";
            if (idx < revPeriods.length - 1) {
                const prevStart = window.parseDateLocal(revPeriods[idx + 1]);
                cycleLen = Math.round((startDate - prevStart) / (1000 * 60 * 60 * 24)) + " days";
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${startDate.toLocaleDateString()}</td>
                <td>${endDate.toLocaleDateString()}</td>
                <td>${duration} days</td>
                <td>${cycleLen}</td>
            `;
            body.appendChild(tr);
        });
    };

    calculateCycleStats();
    generateSymptomHeatmap();
    generateMoodReport();
    populateHistory();
});
