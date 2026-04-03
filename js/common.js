// Global Helpers
window.parseDateLocal = function(str) {
    if (!str) return null;
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
};

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('New LunaSession');
    
    // 0. Theme Initialization
    if (currentUser) {
        const activeTheme = localStorage.getItem(`theme_${currentUser}`) || 'default';
        if (activeTheme !== 'default') {
            document.body.setAttribute('data-theme', activeTheme);
        }
    }

    const path = window.location.pathname;
    const isAuthPage = path.includes('login.html') || path.includes('register.html');

    // 1. Auth Guard
    if (!currentUser && !isAuthPage) {
        window.location.replace('login.html');
        return;
    }
    if (currentUser && isAuthPage) {
        window.location.replace('index.html');
        return;
    }

    // 1.1 Layout Variant Guard (Soft vs Roma)
    const layout = localStorage.getItem('current_layout') || 'roma';
    const softPages = {
        'index.html': 'soft_dashboard.html',
        'assistant.html': 'soft_assistant.html',
        'partner_dashboard.html': 'soft_partner_dashboard.html'
    };
    const romaPages = {
        'soft_dashboard.html': 'index.html',
        'soft_assistant.html': 'assistant.html',
        'soft_partner_dashboard.html': 'partner_dashboard.html'
    };

    if (layout === 'soft') {
        const target = softPages[path.split('/').pop()];
        if (target) window.location.replace(target);
    } else {
        const target = romaPages[path.split('/').pop()];
        if (target) window.location.replace(target);
    }

    // 1.2 Onboarding Check
    if (currentUser && !localStorage.getItem(`onboardingComplete_${currentUser}`)) {
        if (path.includes('index.html') || path === '/' || path === '') {
            setTimeout(showOnboarding, 1000);
        }
    }

    function showOnboarding() {
        const overlay = document.createElement('div');
        overlay.id = 'onboarding-overlay';
        overlay.style = 'position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(157, 78, 221, 0.95); z-index:9999; display:flex; align-items:center; justify-content:center; color:white; padding: 30px; text-align:center;';
        
        overlay.innerHTML = `
            <div style="max-width: 400px; animation: fadeIn 0.5s ease;">
                <h1 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 20px;">Welcome to New Luna 🌸</h1>
                <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px;">Let's customize your journey. Are you here to track your cycle, prepare for pregnancy, or follow your baby's growth?</p>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button class="onboard-choice btn-primary" style="background: white; color: var(--primary); width:100%; border:none; padding:15px; border-radius:12px; font-weight:600; cursor:pointer;" data-mode="standard">Track My Cycle</button>
                    <button class="onboard-choice btn-primary" style="background: rgba(255,255,255,0.2); border: 2px solid white; width:100%; padding:15px; border-radius:12px; font-weight:600; color:white; cursor:pointer;" data-mode="preg">Pregnancy Journey</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelectorAll('.onboard-choice').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                localStorage.setItem(`onboardingComplete_${currentUser}`, 'true');
                if (mode === 'preg') {
                    window.location.href = 'pregnancy.html';
                } else {
                    document.body.removeChild(overlay);
                }
            });
        });
    }

    // 1.5. Privacy Lock (PIN/Security Guard)
    if (currentUser && !isAuthPage) {
        const isPinEnabled = JSON.parse(localStorage.getItem(`pinEnabled_${currentUser}`)) || false;
        const correctPin = localStorage.getItem(`pinValue_${currentUser}`);
        const lockType = localStorage.getItem(`lockType_${currentUser}`) || 'pin';
        const biometricEnabled = JSON.parse(localStorage.getItem(`biometricEnabled_${currentUser}`)) || false;
        
        // Use session storage to track if verified in this browser session
        const isVerified = sessionStorage.getItem(`New LunaUnlocked_${currentUser}`) === 'true';

        if (isPinEnabled && correctPin && !isVerified) {
            const lockOverlay = document.createElement('div');
            lockOverlay.id = 'pin-lock-screen';
            lockOverlay.innerHTML = `
                <div class="app-container" style="position:fixed; top:0; left:0; width:100%; height:100%; z-index:9999; background: var(--bg-light); display:flex; align-items:center; justify-content:center; backdrop-filter: blur(20px);">
                    <div class="glass" style="padding: 40px; text-align:center; max-width: 400px; width: 90%;">
                        <div class="logo" style="font-size: 2.22rem; margin-bottom: 20px;">New Luna</div>
                        <h2 style="font-family: 'Playfair Display', serif; margin-bottom: 5px;">${lockType === 'pin' ? 'Private Access' : 'Security Check'}</h2>
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 25px;">Please enter your ${lockType === 'pin' ? '4-digit PIN' : 'Password'}</p>
                        
                        <div style="margin-bottom: 20px;">
                            <input type="${lockType === 'pin' ? 'password' : 'text'}" id="pin-digit-entry" 
                                   maxlength="${lockType === 'pin' ? 4 : 32}" 
                                   style="width: 100%; text-align:center; font-size: 1.5rem; padding: 12px; border-radius: 12px; border: 1px solid var(--glass-border); background: white;" 
                                   placeholder="${lockType === 'pin' ? '****' : 'your password'}"
                                   autofocus>
                        </div>
                        
                        <button id="unlock-submit-btn" class="btn-primary" style="width: 100%; margin-top: 10px;">Unlock ✨</button>
                        
                        ${biometricEnabled ? `
                        <button id="biometric-unlock-btn" style="margin-top: 20px; background:none; border:none; color:var(--primary); cursor:pointer; font-size: 0.85rem; display: flex; align-items:center; justify-content:center; gap: 8px; width: 100%;">
                            <span>🛡️ Use Biometrics</span>
                        </button>
                        ` : ''}
                        
                        <p id="pin-error" style="color: #e74c3c; font-size: 0.8rem; margin-top: 15px;" class="hidden">Incorrect security code. Try again.</p>
                        <p style="font-size: 0.75rem; margin-top: 30px; opacity: 0.5;">Your data stays encrypted on this device.</p>
                    </div>
                </div>
            `;
            document.body.appendChild(lockOverlay);

            const pinInput = document.getElementById('pin-digit-entry');
            const pinError = document.getElementById('pin-error');
            const submitBtn = document.getElementById('unlock-submit-btn');
            const bioBtn = document.getElementById('biometric-unlock-btn');

            const performUnlock = () => {
                if (pinInput.value === correctPin) {
                    sessionStorage.setItem(`New LunaUnlocked_${currentUser}`, 'true');
                    lockOverlay.remove();
                } else {
                    pinError.classList.remove('hidden');
                    pinInput.value = '';
                    pinInput.focus();
                }
            };

            submitBtn.addEventListener('click', performUnlock);
            pinInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') performUnlock(); });

            if (bioBtn) {
                bioBtn.addEventListener('click', async () => {
                    if (window.confirm("Simulating Biometric Unlock (FaceID/Fingerprint)... Proceed?")) {
                        sessionStorage.setItem(`New LunaUnlocked_${currentUser}`, 'true');
                        lockOverlay.remove();
                    }
                });
            }

            // Auto-submit for PIN if 4 digits
            if (lockType === 'pin') {
                pinInput.addEventListener('input', () => {
                    if (pinInput.value.length === 4) performUnlock();
                    else pinError.classList.add('hidden');
                });
            }
        }
    }

    // 2. Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .catch(err => console.log('Service Worker registration failed:', err));
    }

    // 3. Inject Global Header
    const headerContainer = document.getElementById('global-header');
    if (headerContainer && currentUser) {
        const isPregnancyMode = JSON.parse(localStorage.getItem(`isPregnant_${currentUser}`)) || false;
        const profile = JSON.parse(localStorage.getItem(`profile_${currentUser}`)) || { name: currentUser };
        
        const path = window.location.pathname;
        // 3. Inject Global Header (Flutter AppBar Style)
        headerContainer.innerHTML = `
            <header class="top-bar">
                <div class="logo">
                    <h1>New Luna</h1>
                </div>
                <div class="app-bar-actions">
                    <span id="notif-btn" title="Notifications">🔔</span>
                </div>
            </header>
        `;

        // 3.2. Inject Global Bottom Nav (Flutter Style)
        let bottomNav = document.getElementById('global-bottom-nav');
        if (!bottomNav) {
            const existingNav = document.querySelector('.bottom-nav');
            if (existingNav) {
                bottomNav = existingNav;
                bottomNav.id = 'global-bottom-nav';
            } else {
                bottomNav = document.createElement('nav');
                bottomNav.id = 'global-bottom-nav';
                bottomNav.className = 'bottom-nav';
                document.body.appendChild(bottomNav);
            }
        }

        const tabs = [
            { id: 'today', label: 'Today', icon: '🏠', url: 'index.html' },
            { id: 'calendar', label: 'Calendar', icon: '📅', url: 'calendar.html' },
            { id: 'assistant', label: 'AI', icon: '🤖', url: 'assistant.html' },
            { id: 'partner', label: 'Partner', icon: '❤️', url: 'partner.html' },
            { id: 'profile', label: 'Profile', icon: '👤', url: 'profile.html' }
        ];

        bottomNav.innerHTML = tabs.map(tab => {
            const isActive = path.includes(tab.url) || (tab.id === 'today' && (path.endsWith('/') || path === ''));
            return `
                <a href="${tab.url}" class="nav-item ${isActive ? 'active' : ''}" style="color: ${isActive ? 'var(--primary)' : '#666'};">
                    <span class="nav-icon">${tab.icon}</span>
                    <span>${tab.label}</span>
                </a>
            `;
        }).join('');

        // Re-attach quick-log logic if needed (it's in dashboard.js usually)

        // Update Date
        const dateHeader = document.getElementById('current-date-header');
        if (dateHeader) {
            dateHeader.textContent = new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
            });
        }

        // Logout logic
        const logoutBtn = document.getElementById('global-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm("Are you sure you want to logout?")) {
                    localStorage.removeItem('New LunaSession');
                    window.location.replace('login.html');
                }
            });
        }
    }

    // 4. Hydration System & Hourly Reminders
    if (currentUser) {
        const today = new Date().toISOString().split('T')[0];
        let waterData = JSON.parse(localStorage.getItem(`water_${currentUser}`)) || { date: today, cups: 0 };
        
        // Reset water if it's a new day
        if (waterData.date !== today) {
            waterData = { date: today, cups: 0 };
            localStorage.setItem(`water_${currentUser}`, JSON.stringify(waterData));
        }

        const waterDisplay = document.getElementById('water-count');
        const waterProgress = document.getElementById('water-progress-fill');
        const addWaterBtn = document.getElementById('add-water');
        const removeWaterBtn = document.getElementById('remove-water');

        function updateWaterUI() {
            if (!waterDisplay || !waterProgress) return;
            const emojiBank = ["💧", "🥤", "🧊", "🌊", "💎", "✨", "🌸", "👑"];
            const currentEmoji = emojiBank[Math.min(waterData.cups, emojiBank.length - 1)];
            
            waterDisplay.innerHTML = `${currentEmoji} ${waterData.cups} / 8`;
            const fillPercent = Math.min((waterData.cups / 8) * 100, 100);
            waterProgress.style.width = `${fillPercent}%`;
            
            // Add a small pulse animation if adding water
            waterProgress.classList.add('water-pulse');
            setTimeout(() => waterProgress.classList.remove('water-pulse'), 500);

            if (waterData.cups >= 8) {
                waterProgress.style.background = "linear-gradient(90deg, #43aa8b, #4cc9f0)";
                waterDisplay.innerHTML = `👑 ${waterData.cups} / 8 - Hydration Queen!`;
            } else {
                waterProgress.style.background = "#4cc9f0";
            }
        }

        if (addWaterBtn) {
            addWaterBtn.addEventListener('click', () => {
                waterData.cups++;
                localStorage.setItem(`water_${currentUser}`, JSON.stringify(waterData));
                updateWaterUI();
            });
        }

        if (removeWaterBtn) {
            removeWaterBtn.addEventListener('click', () => {
                if (waterData.cups > 0) {
                    waterData.cups--;
                    localStorage.setItem(`water_${currentUser}`, JSON.stringify(waterData));
                    updateWaterUI();
                }
            });
        }

        updateWaterUI();

        // Hourly Reminders
        if ("Notification" in window) {
            if (Notification.permission === "default") {
                Notification.requestPermission();
            }

            function sendReminder() {
                if (Notification.permission === "granted" && waterData.cups < 8) {
                    new Notification("New Luna Hydration 💧", {
                        body: "It's time to drink water! Stay hydrated. ✨",
                        icon: "https://cdn-icons-png.flaticon.com/512/2913/2913501.png"
                    });
                }
            }

            // Check every hour. To avoid spam, we track the last reminder time.
            let lastReminderTime = localStorage.getItem(`lastWaterReminder_${currentUser}`);
            const checkReminder = () => {
                const now = Date.now();
                const oneHour = 60 * 60 * 1000;
                if (!lastReminderTime || (now - lastReminderTime >= oneHour)) {
                    sendReminder();
                    lastReminderTime = now;
                    localStorage.setItem(`lastWaterReminder_${currentUser}`, now);
                }
            };
            
            setInterval(checkReminder, 60000); // Check every minute
            checkReminder(); // Initial check
        }
    }

    // 5. Wellness & Cycle Reminders
    if (currentUser && !isAuthPage) {
        // Cycle Reminders
        if ("Notification" in window && Notification.permission === "granted") {
            const periods = JSON.parse(localStorage.getItem(`periods_${currentUser}`)) || [];
            if (periods.length > 0) {
                const lastPeriod = new Date(periods[periods.length - 1]);
                const cycleLength = JSON.parse(localStorage.getItem(`cycleLength_${currentUser}`)) || 28;
                
                const nextPeriod = new Date(lastPeriod);
                nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
                
                const today = new Date();
                const diffDays = Math.round((nextPeriod - today) / (1000 * 60 * 60 * 24));

                // Notify 2 days before
                if (diffDays === 2) {
                    const lastReminder = localStorage.getItem(`periodReminderSent_${currentUser}`);
                    if (lastReminder !== today.toDateString()) {
                        new Notification("New Luna Update 🌸", {
                            body: "Your period is starting soon! Take a breath and prioritize your comfort today. ✨",
                            icon: "https://cdn-icons-png.flaticon.com/512/2913/2913501.png"
                        });
                        localStorage.setItem(`periodReminderSent_${currentUser}`, today.toDateString());
                    }
                }

                // Ovulation Reminder (approx day 14 before next period)
                const ovulationDay = new Date(nextPeriod);
                ovulationDay.setDate(ovulationDay.getDate() - 14);
                if (ovulationDay.toDateString() === today.toDateString()) {
                    const lastOvuReminder = localStorage.getItem(`ovuReminderSent_${currentUser}`);
                    if (lastOvuReminder !== today.toDateString()) {
                        new Notification("New Luna Wellness ✨", {
                            body: "Today is your peak ovulation day! Sending you extra radiant energy. ⚡💖",
                            icon: "https://cdn-icons-png.flaticon.com/512/2913/2913501.png"
                        });
                        localStorage.setItem(`ovuReminderSent_${currentUser}`, today.toDateString());
                    }
                }
            }
        }

        // New: Birth Control & Medication Reminders
        const checkScheduledReminders = () => {
            const now = new Date();
            const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const todayStr = now.toDateString();

            if ("Notification" in window && Notification.permission === "granted") {
                // Birth Control
                const bcEnabled = JSON.parse(localStorage.getItem(`bcEnabled_${currentUser}`)) || false;
                const bcTime = localStorage.getItem(`bcTime_${currentUser}`);
                if (bcEnabled && bcTime === currentTimeStr) {
                    const lastBc = localStorage.getItem(`bcSent_${currentUser}`);
                    if (lastBc !== todayStr) {
                        new Notification("New Luna Care 💊", {
                            body: "Time for your self-care routine! Don't forget your pill. ✨",
                            icon: "https://cdn-icons-png.flaticon.com/512/2913/2913501.png"
                        });
                        localStorage.setItem(`bcSent_${currentUser}`, todayStr);
                    }
                }

                // Medication
                const medEnabled = JSON.parse(localStorage.getItem(`medEnabled_${currentUser}`)) || false;
                const medTime = localStorage.getItem(`medTime_${currentUser}`);
                if (medEnabled && medTime === currentTimeStr) {
                    const lastMed = localStorage.getItem(`medSent_${currentUser}`);
                    if (lastMed !== todayStr) {
                        new Notification("New Luna Support 🌿", {
                            body: "A gentle nudge for your medication. You're doing great! ❤️",
                            icon: "https://cdn-icons-png.flaticon.com/512/2913/2913501.png"
                        });
                        localStorage.setItem(`medSent_${currentUser}`, todayStr);
                    }
                }
            }
        };
        setInterval(checkScheduledReminders, 30000); // Check every 30s
        checkScheduledReminders();
    }

    // 2. Partner Nudge System (Simulated Duo Experience)
    function checkPartnerNudges() {
        if (!currentUser) return;

        const periods = JSON.parse(localStorage.getItem(`periods_${currentUser}`)) || [];
        const cycleLen = JSON.parse(localStorage.getItem(`cycleLength_${currentUser}`)) || 28;
        
        if (periods.length === 0) return;

        const lastPeriod = window.parseDateLocal(periods[periods.length - 1]);
        const today = new Date();
        const diffDays = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1;
        const currentDay = ((diffDays - 1) % cycleLen) + 1;

        const lastNudge = sessionStorage.getItem(`lastNudgeShowed_${currentUser}`);
        if (lastNudge === 'true') return;

        let nudgeMsg = "";
        if (currentDay > 22 && currentDay < 28) {
            nudgeMsg = "Your partner's PMS might be starting. Send a sweet note? 🍫";
        } else if (currentDay >= 12 && currentDay <= 15) {
            nudgeMsg = "It's a high fertility day. Plan something special! ✨";
        }

        if (nudgeMsg) {
            setTimeout(() => {
                const toast = document.createElement('div');
                toast.style = "position:fixed; top:20px; right:20px; background:var(--primary-dark); color:white; padding:15px 25px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.2); z-index:10000; font-size:0.9rem; animation: slideIn 0.5s ease; cursor:pointer;";
                toast.innerHTML = `<strong>Duo Partner Alert 💬</strong><br>${nudgeMsg}`;
                toast.onclick = () => window.location.href = 'chat.html';
                document.body.appendChild(toast);
                sessionStorage.setItem(`lastNudgeShowed_${currentUser}`, 'true');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.style.opacity = '0';
                        toast.style.transition = 'opacity 0.5s';
                        setTimeout(() => toast.remove(), 500);
                    }
                }, 4500);
            }, 3000);
        }
    }

    if (path.includes('partner_app.html') || path.includes('chat.html')) {
        checkPartnerNudges();
    }

    // 6. Page Fade-In
    document.body.classList.add('page-loaded');
});
