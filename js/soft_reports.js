document.addEventListener('DOMContentLoaded', () => {
    initReportsUI();
});

function initReportsUI() {
    const currentUser = localStorage.getItem('NewLunaSession') || 'demo_user';
    
    // 1. Load Data
    const periods = JSON.parse(localStorage.getItem(`periods_${currentUser}`)) || [];
    const cycleLen = JSON.parse(localStorage.getItem(`cycleLength_${currentUser}`)) || 28;
    
    // 2. Update Stats
    updateStats(periods, cycleLen);
    
    // 3. Render Charts
    renderSymptomChart();
    
    // 4. Entrance Animation
    animateBars();
}

function updateStats(periods, cycleLen) {
    const avgValue = document.querySelector('.stat-card:nth-child(1) .stat-value');
    const stabilityValue = document.querySelector('.stat-card:nth-child(2) .stat-value');
    const totalValue = document.querySelector('.stat-card:nth-child(3) .stat-value');

    if (avgValue) avgValue.innerText = cycleLen;
    if (totalValue) totalValue.innerText = periods.length;
    
    // Stability calculation simulation
    if (stabilityValue) {
        const stability = periods.length > 3 ? "92%" : "85%";
        stabilityValue.innerText = stability;
    }
}

function renderSymptomChart() {
    const chart = document.getElementById('symptomChart');
    if (!chart) return;

    const data = [
        { label: "Mood Swings", value: 85 },
        { label: "Fatigue", value: 70 },
        { label: "Cramps", value: 45 },
        { label: "Bloating", value: 30 },
        { label: "Headache", value: 15 }
    ];

    chart.innerHTML = data.map(item => `
        <div class="chart-bar-container">
            <div class="chart-bar-header">
                <span>${item.label}</span>
                <span style="color: #888;">${item.value}%</span>
            </div>
            <div class="chart-bar-track">
                <div class="chart-bar-fill" style="width: 0%;" data-value="${item.value}"></div>
            </div>
        </div>
    `).join('');
}

function animateBars() {
    setTimeout(() => {
        const fills = document.querySelectorAll('.chart-bar-fill');
        fills.forEach(fill => {
            const val = fill.getAttribute('data-value');
            fill.style.width = val + '%';
        });
    }, 300);
}


