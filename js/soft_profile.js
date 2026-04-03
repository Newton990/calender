document.addEventListener('DOMContentLoaded', () => {
    initProfileUI();
});

function initProfileUI() {
    const currentUser = localStorage.getItem('New LunaSession') || 'demo_user';
    
    // 1. Load Profile
    const profile = JSON.parse(localStorage.getItem(`profile_${currentUser}`)) || {
        name: "Luna User",
        age: 25,
        goal: "Track Cycle"
    };

    const nameInput = document.querySelector('input[type="text"]');
    const ageInput = document.querySelector('input[type="number"]');
    
    if (nameInput) nameInput.value = profile.name;
    if (ageInput) ageInput.value = profile.age;

    // 2. Goal Selection
    const goalBtns = document.querySelectorAll('.goal-btn');
    goalBtns.forEach(btn => {
        if (btn.innerText === profile.goal) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }

        btn.onclick = () => {
            goalBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            handleHaptic();
        };
    });

    // 3. Save Logic
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.onclick = () => {
            const updatedProfile = {
                name: nameInput.value,
                age: ageInput.value,
                goal: document.querySelector('.goal-btn.active').innerText
            };
            
            localStorage.setItem(`profile_${currentUser}`, JSON.stringify(updatedProfile));
            
            // Show premium success feedback
            saveBtn.innerText = "Updated Successfully! ✨";
            saveBtn.style.background = "#4DB6AC";
            
            setTimeout(() => {
                saveBtn.innerText = "Save Profile ✨";
                saveBtn.style.background = "var(--soft-pink)";
            }, 2000);
            
            handleHaptic();
        };
    }
}

function handleHaptic() {
    // Simulate premium haptic feedback
    if (window.navigator.vibrate) {
        window.navigator.vibrate(10);
    }
}


