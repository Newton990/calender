document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('New LunaSession');
    if (!currentUser) return;

    const settingCycle = document.getElementById('setting-cycle');
    const settingPeriod = document.getElementById('setting-period');
    const saveSettingsBtn = document.getElementById('save-settings');

    const pinEnabled = document.getElementById('pin-enabled');
    const pinSetupArea = document.getElementById('pin-setup-area');
    const pinInput = document.getElementById('pin-input');
    const lockType = document.getElementById('lock-type');
    const lockLabel = document.getElementById('lock-label');
    const bioEnabled = document.getElementById('biometric-enabled');
    const privateModeEnabled = document.getElementById('private-mode-enabled');

    const bcEnabled = document.getElementById('bc-reminder-enabled');
    const bcSetupArea = document.getElementById('bc-setup-area');
    const bcTime = document.getElementById('bc-time');

    const medEnabled = document.getElementById('med-reminder-enabled');
    const medSetupArea = document.getElementById('med-setup-area');
    const medTime = document.getElementById('med-time');
    const autoThemeEnabled = document.getElementById('auto-theme-enabled');

    // Load existing settings
    const currentCycle = JSON.parse(localStorage.getItem(`cycleLength_${currentUser}`)) || 28;
    const currentPeriod = JSON.parse(localStorage.getItem(`periodLength_${currentUser}`)) || 5;
    const isPinActive = JSON.parse(localStorage.getItem(`pinEnabled_${currentUser}`)) || false;
    const savedPin = localStorage.getItem(`pinValue_${currentUser}`) || "";
    const savedLockType = localStorage.getItem(`lockType_${currentUser}`) || "pin";
    const isBioActive = JSON.parse(localStorage.getItem(`biometricEnabled_${currentUser}`)) || false;
    const isPrivateMode = JSON.parse(localStorage.getItem(`privateMode_${currentUser}`)) || false;
    
    const isBcActive = JSON.parse(localStorage.getItem(`bcEnabled_${currentUser}`)) || false;
    const isMedActive = JSON.parse(localStorage.getItem(`medEnabled_${currentUser}`)) || false;
    const savedBcTime = localStorage.getItem(`bcTime_${currentUser}`) || "09:00";
    const savedMedTime = localStorage.getItem(`medTime_${currentUser}`) || "20:00";
    const isAutoTheme = JSON.parse(localStorage.getItem(`autoTheme_${currentUser}`)) || false;

    if(settingCycle) settingCycle.value = currentCycle;
    if(settingPeriod) settingPeriod.value = currentPeriod;
    if(pinEnabled) {
        pinEnabled.checked = isPinActive;
        if (isPinActive) pinSetupArea.classList.remove('hidden');
        
        pinEnabled.addEventListener('change', () => {
            if (pinEnabled.checked) pinSetupArea.classList.remove('hidden');
            else pinSetupArea.classList.add('hidden');
        });
    }
    if(pinInput) pinInput.value = savedPin;

    if (lockType) {
        lockType.value = savedLockType;
        if (lockLabel) lockLabel.textContent = savedLockType === 'pin' ? 'Set 4-Digit PIN:' : 'Set Password:';
        if (pinInput) pinInput.maxLength = savedLockType === 'pin' ? 4 : 32;

        lockType.addEventListener('change', () => {
            if (lockLabel) lockLabel.textContent = lockType.value === 'pin' ? 'Set 4-Digit PIN:' : 'Set Password:';
            if (pinInput) {
                pinInput.maxLength = lockType.value === 'pin' ? 4 : 32;
                pinInput.placeholder = lockType.value === 'pin' ? '****' : 'your password';
            }
        });
    }

    if (bioEnabled) bioEnabled.checked = isBioActive;
    if (privateModeEnabled) privateModeEnabled.checked = isPrivateMode;

    if (bcEnabled) {
        bcEnabled.checked = isBcActive;
        if (isBcActive) bcSetupArea.classList.remove('hidden');
        bcEnabled.addEventListener('change', () => {
            if (bcEnabled.checked) bcSetupArea.classList.remove('hidden');
            else bcSetupArea.classList.add('hidden');
        });
    }
    if (bcTime) bcTime.value = savedBcTime;

    if (medEnabled) {
        medEnabled.checked = isMedActive;
        if (isMedActive) medSetupArea.classList.remove('hidden');
        medEnabled.addEventListener('change', () => {
            if (medEnabled.checked) medSetupArea.classList.remove('hidden');
            else medSetupArea.classList.add('hidden');
        });
    }
    if (medTime) medTime.value = savedMedTime;
    if (autoThemeEnabled) autoThemeEnabled.checked = isAutoTheme;

    // Theme Selection Logic
    const themeOptions = document.querySelectorAll('.theme-option');
    let selectedTheme = localStorage.getItem(`theme_${currentUser}`) || 'blush';

    // Set initial active theme
    themeOptions.forEach(opt => {
        if (opt.dataset.theme === selectedTheme) {
            themeOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        }
        
        opt.addEventListener('click', () => {
            themeOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            selectedTheme = opt.dataset.theme;
            
            // Preview theme immediately
            document.body.setAttribute('data-theme', selectedTheme);
        });
    });

    if(saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            const cl = parseInt(settingCycle.value);
            const pl = parseInt(settingPeriod.value);
            
            if (cl >= 20 && cl <= 45 && pl >= 2 && pl <= 10) {
                localStorage.setItem(`cycleLength_${currentUser}`, JSON.stringify(cl));
                localStorage.setItem(`periodLength_${currentUser}`, JSON.stringify(pl));
                localStorage.setItem(`theme_${currentUser}`, selectedTheme);
                localStorage.setItem(`pinEnabled_${currentUser}`, JSON.stringify(pinEnabled.checked));
                localStorage.setItem(`pinValue_${currentUser}`, pinInput.value);
                localStorage.setItem(`lockType_${currentUser}`, lockType.value);
                localStorage.setItem(`biometricEnabled_${currentUser}`, JSON.stringify(bioEnabled.checked));
                localStorage.setItem(`privateMode_${currentUser}`, JSON.stringify(privateModeEnabled.checked));
                
                localStorage.setItem(`bcEnabled_${currentUser}`, JSON.stringify(bcEnabled.checked));
                localStorage.setItem(`bcTime_${currentUser}`, bcTime.value);
                localStorage.setItem(`medEnabled_${currentUser}`, JSON.stringify(medEnabled.checked));
                localStorage.setItem(`medTime_${currentUser}`, medTime.value);
                localStorage.setItem(`autoTheme_${currentUser}`, JSON.stringify(autoThemeEnabled.checked));

                alert("Settings saved successfully! ✨");
                window.location.href = 'index.html';
            } else {
                alert("Please enter a valid cycle length (20-45) and period length (2-10).");
            }
        });
    }
});
