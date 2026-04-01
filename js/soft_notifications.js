document.addEventListener('DOMContentLoaded', () => {
    renderNotifications();
});

function getNotifications() {
    return [
        {
            id: 1,
            title: "Hydration Nudge 💧",
            subtitle: "It's time for your hourly sip of water. Keep it up!",
            time: "Just Now",
            icon: "🌊",
            color: "rgba(224, 242, 241, 0.5)"
        },
        {
            id: 2,
            title: "Partner sent a Heart ❤️",
            subtitle: "\"Thinking of you! Have a beautiful afternoon. ✨\"",
            time: "45m ago",
            icon: "💌",
            color: "rgba(252, 228, 236, 0.5)"
        },
        {
            id: 3,
            title: "Cycle Update 🩸",
            subtitle: "Your period is estimated to start in 2 days. Be gentle.",
            time: "3h ago",
            icon: "🗓️",
            color: "rgba(255, 235, 238, 0.5)"
        },
        {
            id: 4,
            title: "Self-Care Tip 🧘‍♀️",
            subtitle: "Luteal phase starts soon. Try some light stretching tonight.",
            time: "Yesterday",
            icon: "✨",
            color: "rgba(243, 229, 245, 0.5)"
        }
    ];
}

function renderNotifications() {
    const list = document.getElementById('notifyList');
    if (!list) return;

    const items = getNotifications();

    list.innerHTML = items.map(item => `
        <div class="notify-card" style="animation: slideUp 0.6s ease-out forwards; opacity: 0;">
            <div class="notify-type-icon" style="background: ${item.color};">
                ${item.icon}
            </div>
            <div class="notify-content">
                <div class="notify-meta">
                    <div class="notify-title">${item.title}</div>
                    <div class="notify-time">${item.time}</div>
                </div>
                <div class="notify-subtitle">${item.subtitle}</div>
            </div>
        </div>
    `).join('');

    // Trigger sequential animations
    const cards = list.querySelectorAll('.notify-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
        }, index * 100);
    });
}



// Add SlideUp Animation Keyframes
const style = document.createElement('style');
style.innerHTML = `
@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
`;
document.head.appendChild(style);
