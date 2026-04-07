document.addEventListener('DOMContentLoaded', () => {
    // 1. Line Chart: Performance Over Time
    const lineCtx = document.getElementById('performanceLineChart');
    if (lineCtx) {
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Energy Level',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: true,
                    backgroundColor: ''rgba(255, 117, 140, 0.2)'', // Indigo 10%
                    borderColor: ''#FF758C'', // Indigo
                    tension: 0.4
                },
                {
                    label: 'Overall Mood',
                    data: [120, 115, 140, 130, 200, 180, 190],
                    fill: false,
                    borderColor: ''#FFC3A0'', // Purple
                    borderDash: [5, 5],
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 12, usePointStyle: true }
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, border: { display: false } }
                }
            }
        });
    }

    // 2. Radar/Circular Chart: Activity Overview
    const radarCtx = document.getElementById('activityRadarChart');
    if (radarCtx) {
        new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['Energy', 'Mood', 'Sleep', 'Hydration', 'Movement', 'Calm'],
                datasets: [{
                    label: 'Current Week',
                    data: [85, 90, 70, 65, 80, 55],
                    fill: true,
                    backgroundColor: ''rgba(255, 117, 140, 0.2)'', // Blue
                    borderColor: ''#FF758C'',
                    pointBackgroundColor: ''#FF758C'',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: ''#FF758C''
                }, {
                    label: 'Previous Week',
                    data: [65, 75, 50, 80, 60, 45],
                    fill: true,
                    backgroundColor: ''rgba(255, 126, 179, 0.2)'', // Purple
                    borderColor: ''#FFC3A0'',
                    pointBackgroundColor: ''#FFC3A0'',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: ''#FFC3A0''
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 12, usePointStyle: true }
                    }
                },
                scales: {
                    r: {
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
});
