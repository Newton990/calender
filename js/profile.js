document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('NewLunaSession');
    if (!currentUser) return;
    
    const nameInput = document.getElementById('profile-name');
    const ageInput = document.getElementById('profile-age');
    const goalSelect = document.getElementById('profile-goal');
    const saveBtn = document.getElementById('save-profile');

    // Load defaults
    const profile = JSON.parse(localStorage.getItem(`profile_${currentUser}`)) || {
        name: currentUser,
        age: '',
        goal: 'track'
    };

    if(nameInput) nameInput.value = profile.name;
    if(ageInput) ageInput.value = profile.age;
    if(goalSelect) goalSelect.value = profile.goal;

    if(saveBtn) {
        saveBtn.addEventListener('click', () => {
            const updatedProfile = {
                name: nameInput.value.trim() || currentUser,
                age: parseInt(ageInput.value) || '',
                goal: goalSelect.value
            };

            localStorage.setItem(`profile_${currentUser}`, JSON.stringify(updatedProfile));
            alert("Profile updated successfully! ❋");
            window.location.href = 'index.html';
        });
    }
});
