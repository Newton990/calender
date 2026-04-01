document.addEventListener('DOMContentLoaded', () => {
    initExploreUI();
});

function initExploreUI() {
    // 1. Cycle-Synced Content Logic (Simulated)
    const currentDay = localStorage.getItem('cycle_day') || 14;
    const bannerSubtitle = document.querySelector('.section-subtitle');
    
    if (bannerSubtitle) {
        if (currentDay >= 12 && currentDay <= 16) {
            bannerSubtitle.innerText = "You're in your Fertile Window. Focus on energy and connection! ✨";
        } else if (currentDay >= 21) {
            bannerSubtitle.innerText = "Luteal phase is here. Prioritize restful movement and warming foods. 🍵";
        } else {
            bannerSubtitle.innerText = "Sync your life with your flow. Discover what your body needs today.";
        }
    }

    // 2. Category Interaction
    const categories = document.querySelectorAll('.category-card');
    categories.forEach(card => {
        card.onclick = () => {
            handleHaptic();
            // Highlight effect
            categories.forEach(c => c.style.border = '1px solid rgba(255,182,193,0.2)');
            card.style.border = '1px solid var(--soft-pink)';
            card.style.background = 'rgba(255, 255, 255, 0.6)';
        };
    });

    // 3. Trending Items
    const trends = document.querySelectorAll('.trending-card');
    trends.forEach(trend => {
        trend.onclick = () => {
            handleHaptic();
            trend.style.transform = 'scale(0.98)';
            setTimeout(() => trend.style.transform = 'scale(1)', 100);
        };
    });
}

function handleHaptic() {
    if (window.navigator.vibrate) {
        window.navigator.vibrate(10);
    }
}


