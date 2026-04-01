document.addEventListener('DOMContentLoaded', () => {
    initPregnancyUI();
});

function initPregnancyUI() {
    const startDateStr = localStorage.getItem('pregnancy_start_date');
    if (!startDateStr) {
        // Fallback or demo mode: 12 weeks pregnant
        updateDisplay(12, 3);
        return;
    }

    const startDate = new Date(startDateStr);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const weeks = Math.floor(diffDays / 7);
    const daysIntoWeek = diffDays % 7;

    updateDisplay(weeks, daysIntoWeek);
}

function updateDisplay(weeks, days) {
    const weekDisplay = document.getElementById('weekDisplay');
    const dayDisplay = document.getElementById('dayDisplay');
    const sizePill = document.getElementById('sizePill');
    const ring = document.getElementById('progressRing');
    const insightText = document.getElementById('insightText');

    if (weekDisplay) weekDisplay.innerText = weeks;
    if (dayDisplay) dayDisplay.innerText = `Day ${days}`;

    // Update Progress Ring
    // Progress within the 40-week journey
    const totalProgress = (weeks / 40);
    // clip-path logic for the ring
    // Simplified: For the CSS implementation, we use a percentage-based approach if using SVG, 
    // but here we can just update a custom property for a conic-gradient or similar if needed.
    // Let's use a simpler visual for the Soft UI.

    // Baby Size Logic
    const sizes = [
        "Poppy Seed", "Peppercorn", "Lentil", "Blueberry", "Raspberry", 
        "Olive", "Prune", "Lime", "Pea Pod", "Lemon", 
        "Apricot", "Peach", "Apple", "Avocado", "Pear", 
        "Sweet Potato", "Mango", "Banana", "Tomato", "Grapefruit",
        "Pomegranate", "Papaya", "Corn", "Squash", "Cauliflower",
        "Eggplant", "Cucumber", "Butternut Squash", "Pineapple", "Cantaloupe",
        "Honeydew", "Kale", "Celery", "Romaine Lettuce", "Coconut",
        "Winter Melon", "Pumpkin", "Watermelon", "Jackfruit"
    ];

    const currentSize = sizes[weeks - 1] || "Fruit";
    const emojis = ["🫐", "🍋", "🍎", "🥑", "🍐", "🍑", "🍊", "🥬", "🍍", "🥥", "🍉"];
    const emoji = emojis[weeks % emojis.length];

    if (sizePill) sizePill.innerText = `Baby is the size of a ${currentSize} ${emoji}`;

    // Insights Logic
    const insights = [
        "Welcome to the journey! Your body is already doing amazing work.",
        "Your baby is a tiny ball of cells right now, moving into their new home.",
        "Energy levels might dip as your body builds a support system. Rest is key.",
        "Morning sickness might appear. Small, frequent snacks can help.",
        "A milestone! The heart is starting to beat.",
        "Tiny limbs are forming. You're halfway through the first trimester!",
        "Baby's facial features are coming together. You're doing great.",
        "The second trimester is near! Energy often returns during this phase.",
        "Baby is moving more, though you might not feel it yet.",
        "Focus on hydration and gentle movement today.",
        "You're in the second trimester! Time for some glow. ✨",
        "Baby's hearing is developing. Soft music or talking can be soothing."
    ];

    if (insightText) insightText.innerText = insights[weeks % insights.length] || insights[0];
}


