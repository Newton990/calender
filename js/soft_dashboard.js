/*
 * NewLuna — Soft Dashboard Engine
 * Powers all live UI elements: cycle ring, hydration, mini calendar,
 * phase insights, kindness corner, partner sync, and reminders.
 */

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('NewLunaSession') || localStorage.getItem('Moon Bloom Session');
    const mockUser = localStorage.getItem('NewLunaSession') || localStorage.getItem('Moon Bloom Session');
    if (!currentUser && !mockUser) {
        window.location.replace('login.html');
        return;
    }

    // ── State ──────────────────────────────────────────────────
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const state = {
        periods:      JSON.parse(localStorage.getItem(`periods_${currentUser}`))     || [],
        cycleLength:  JSON.parse(localStorage.getItem(`cycleLength_${currentUser}`)) || 28,
        periodLength: JSON.parse(localStorage.getItem(`periodLength_${currentUser}`))|| 5,
        water:        JSON.parse(localStorage.getItem(`water_${currentUser}`))       || { date: today.toISOString().split('T')[0], cups: 0 },
        profile:      JSON.parse(localStorage.getItem(`profile_${currentUser}`))     || { name: currentUser },
        partner:      JSON.parse(localStorage.getItem(`partner_${currentUser}`))     || { name: 'Alex' },
        currentMonth: new Date()
    };

    // ── Helpers ────────────────────────────────────────────────
    const el = id => document.getElementById(id);
    const todayStr = today.toISOString().split('T')[0];

    function saveWater() {
        localStorage.setItem(`water_${currentUser}`, JSON.stringify(state.water));
    }

    function savePeriods() {
        localStorage.setItem(`periods_${currentUser}`, JSON.stringify(state.periods));
    }

    // ── Init ───────────────────────────────────────────────────
    function init() {
        refreshWaterDay();
        renderUserInfo();
        renderDate();
        renderCycleStatus();
        renderHydration();
        renderCalendar();
        setupEvents();
    }

    // ── User Info ──────────────────────────────────────────────
    function renderUserInfo() {
        const name = state.profile.name || currentUser.split('@')[0];
        const initial = name[0].toUpperCase();

        if (el('user-name'))            el('user-name').textContent          = name;
        if (el('header-avatar'))        el('header-avatar').textContent      = initial;
        if (el('sidebar-avatar-letter'))el('sidebar-avatar-letter').textContent = initial;
        if (el('sidebar-username'))     el('sidebar-username').textContent   = name;
        if (el('partner-name'))         el('partner-name').textContent       = state.partner.name || 'Alex';
    }

    // ── Date ───────────────────────────────────────────────────
    function renderDate() {
        if (el('current-date')) {
            el('current-date').textContent = today.toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
            });
        }
    }

    // ── Cycle Status ───────────────────────────────────────────
    function renderCycleStatus() {
        if (state.periods.length === 0) {
            if (el('hero-cycle-day'))   el('hero-cycle-day').textContent  = 'Day --';
            if (el('hero-subtitle'))    el('hero-subtitle').textContent   = 'Log your first period to begin tracking';
            if (el('ring-day-num'))     el('ring-day-num').textContent    = '--';
            if (el('next-period-date')) el('next-period-date').textContent = 'N/A';
            if (el('days-pill'))        el('days-pill').textContent       = 'Log data to start';
            return;
        }

        const lastStart = window.parseDateLocal(state.periods[state.periods.length - 1]);
        const dayDiff   = Math.floor((today - lastStart) / 86400000) + 1;
        const cycleDay  = ((dayDiff - 1) % state.cycleLength) + 1;

        // Hero card
        if (el('hero-cycle-day')) el('hero-cycle-day').textContent = `Day ${cycleDay}`;
        if (el('ring-day-num'))   el('ring-day-num').textContent   = cycleDay;

        // Ring progress
        const ring = el('cycle-ring-progress');
        if (ring) {
            const r = 72;
            const circ = 2 * Math.PI * r;
            const pct  = cycleDay / state.cycleLength;
            ring.style.strokeDasharray  = circ;
            ring.style.strokeDashoffset = circ - pct * circ;
        }

        // Next period
        const nextPeriod = new Date(lastStart);
        nextPeriod.setDate(nextPeriod.getDate() + state.cycleLength);

        const daysToNext = Math.ceil((nextPeriod - today) / 86400000);
        const nextLabel  = nextPeriod.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();

        if (el('next-period-date')) el('next-period-date').textContent = nextLabel;
        if (el('next-period-label')) {
            el('next-period-label').textContent = daysToNext <= 0
                ? (daysToNext === 0 ? 'Expected today' : `${Math.abs(daysToNext)} days late`)
                : 'Next predicted period';
        }
        if (el('days-pill')) {
            el('days-pill').textContent = daysToNext <= 0
                ? '🩸 Expected now'
                : `${daysToNext} days away`;
        }

        // Hero subtitle
        if (el('hero-subtitle')) {
            el('hero-subtitle').textContent = daysToNext <= 0
                ? 'Your period may have started'
                : `${daysToNext} days until next cycle`;
        }

        // Ovulation & fertile window
        const ovulationDate = new Date(nextPeriod);
        ovulationDate.setDate(ovulationDate.getDate() - 14);

        const fertileStart = new Date(ovulationDate);
        fertileStart.setDate(fertileStart.getDate() - 5);

        if (el('fertile-window')) {
            el('fertile-window').textContent =
                `${fertileStart.toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${ovulationDate.toLocaleDateString('en-US',{day:'numeric'})}`;
        }
        if (el('ovulation-date')) {
            el('ovulation-date').textContent =
                ovulationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        // Determine phase & render insights
        const phase = getPhase(today, lastStart, nextPeriod, ovulationDate);
        renderPhaseUI(phase);
        renderReminderText(daysToNext);
    }

    // ── Phase Logic ────────────────────────────────────────────
    function getPhase(today, lastStart, nextPeriod, ovulation) {
        const isPeriod = state.periods.some(p => {
            const s = window.parseDateLocal(p);
            const e = new Date(s); e.setDate(e.getDate() + state.periodLength - 1);
            return today >= s && today <= e;
        });
        if (isPeriod) return 'menstrual';

        const daysToOvu = Math.ceil((ovulation - today) / 86400000);
        if (Math.abs(daysToOvu) <= 1) return 'ovulation';
        if (today < ovulation)        return 'follicular';
        return 'luteal';
    }

    const PHASE_DATA = {
        menstrual:  {
            label:      'Menstrual Phase 🩸',
            badge:      'Menstrual Phase',
            badgeColor: '#f48fb1',
            ringLabel:  'Menstrual',
            insight:    'Your body is working hard. Rest, warmth, and iron-rich foods are your best friends right now. 🌸',
            fertility:  'Low fertility window — prioritise rest and gentle self-care.',
            tip:        'Eat iron-rich foods: spinach, lentils, and dark chocolate. Stay warm.',
            kindIcon:   '🌸',
            kindTitle:  "Luna's Care for Today 🌸",
            kindMsg:    '"Be gentle with yourself today. Your body is doing something powerful. Rest is productive. ❋"'
        },
        follicular: {
            label:      'Follicular Phase 🌱',
            badge:      'Follicular Phase',
            badgeColor: '#7e57c2',
            ringLabel:  'Follicular',
            insight:    'Estrogen is rising! Energy and creativity are lifting — a great time to start something new. 🌱',
            fertility:  'Fertility is building. Approaching your window — keep an eye on it!',
            tip:        'Lean proteins, fermented foods, and brightly coloured veggies will fuel your rise.',
            kindIcon:   '🌱',
            kindTitle:  "Luna's Daily Note 🌙",
            kindMsg:    '"New energy, new possibilities. Dream big today — your body is ready to bloom. 🚀"'
        },
        ovulation:  {
            label:      'Ovulation Phase ❋',
            badge:      'Ovulation Day ❋',
            badgeColor: '#ffb300',
            ringLabel:  'Ovulation',
            insight:    'Peak day! You\'re at your most magnetic today. Confidence, charisma, and energy are all maxed out. ⚡',
            fertility:  'Peak fertility! 💖 Highest chance of conception — your body is at its peak.',
            tip:        'Anti-inflammatory foods and high-fibre meals support peak performance today.',
            kindIcon:   '💫',
            kindTitle:  "Luna's Peak Day Note 💫",
            kindMsg:    '"You are absolutely radiant today. Your confidence is magnetic — shine bright, star! 🌟"'
        },
        luteal:     {
            label:      'Luteal Phase 🌙',
            badge:      'Luteal Phase',
            badgeColor: '#4db6ac',
            ringLabel:  'Luteal',
            insight:    'Progesterone is rising. Ease into the week — your body craves comfort, calm, and close connections. 🌙',
            fertility:  'Low fertility. Your body is preparing. Prioritise sleep and boundaries.',
            tip:        'Complex carbs help stabilise mood. Try sweet potato, oats, or brown rice.',
            kindIcon:   '🌙',
            kindTitle:  "Luna's Gentle Note 🌙",
            kindMsg:    '"Slow down and listen to your heart. You\'ve done so much — rest is a reward, not a retreat. 🧸"'
        }
    };

    function renderPhaseUI(phase) {
        const data = PHASE_DATA[phase] || PHASE_DATA.follicular;

        if (el('hero-phase'))      el('hero-phase').textContent           = data.label;
        if (el('ring-phase-label'))el('ring-phase-label').textContent     = data.ringLabel;
        if (el('phase-badge')) {
            el('phase-badge').textContent  = data.badge;
            el('phase-badge').style.background = data.badgeColor;
        }
        if (el('ai-insight-text'))   el('ai-insight-text').textContent   = data.insight;
        if (el('fertility-insight')) el('fertility-insight').textContent  = data.fertility;
        if (el('wellness-tip'))      el('wellness-tip').textContent       = data.tip;
        if (el('kindness-icon'))     el('kindness-icon').textContent      = data.kindIcon;
        if (el('kindness-title'))    el('kindness-title').textContent     = data.kindTitle;
        if (el('kindness-msg'))      el('kindness-msg').textContent       = data.kindMsg;
    }

    function renderReminderText(daysToNext) {
        const reminderEl = el('cycle-reminder-text');
        if (!reminderEl) return;
        if (daysToNext <= 2 && daysToNext >= 0) {
            reminderEl.textContent = `🩸 Period starting in ${daysToNext} day${daysToNext === 1 ? '' : 's'} — prep your essentials!`;
        } else if (daysToNext < 0) {
            reminderEl.textContent = `Your period may have started — log it when ready 🩸`;
        } else {
            reminderEl.textContent = `Your cycle is on track ❋`;
        }
    }

    // ── Hydration ──────────────────────────────────────────────
    function refreshWaterDay() {
        if (state.water.date !== todayStr) {
            state.water = { date: todayStr, cups: 0 };
            saveWater();
        }
    }

    function renderHydration() {
        const cups  = state.water.cups;
        const total = 8;
        const pct   = Math.min((cups / total) * 100, 100);

        if (el('hydration-count')) el('hydration-count').textContent = `${cups} / ${total}`;
        if (el('water-fill'))      el('water-fill').style.width      = `${pct}%`;

        const row = el('water-cups-row');
        if (row) {
            row.innerHTML = Array.from({ length: total }, (_, i) =>
                `<div class="water-cup ${i < cups ? 'filled' : ''}" title="Cup ${i+1}">${i < cups ? '💧' : ''}</div>`
            ).join('');
        }

        // Colour shifts as you hydrate
        const fill = el('water-fill');
        if (fill) {
            if      (cups >= total) fill.style.background = 'linear-gradient(90deg, #43a047, #66bb6a)';
            else if (cups >=     5) fill.style.background = 'linear-gradient(90deg, #4db6ac, #80cbc4)';
            else                    fill.style.background = 'linear-gradient(90deg, #4db6ac, #80cbc4)';
        }
    }

    // ── Mini Calendar ──────────────────────────────────────────
    function renderCalendar() {
        const calEl = el('mini-calendar-days');
        const monthEl = el('mini-month-display');
        if (!calEl) return;

        const year  = state.currentMonth.getFullYear();
        const month = state.currentMonth.getMonth();

        if (monthEl) {
            monthEl.textContent = state.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }

        const firstDay    = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        calEl.innerHTML = '';

        // padding
        for (let i = 0; i < firstDay; i++) {
            const pad = document.createElement('div');
            pad.className = 'mini-day'; pad.style.opacity = '0';
            calEl.appendChild(pad);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
            const dayEl   = document.createElement('div');
            dayEl.className = 'mini-day';
            dayEl.textContent = i;

            if (dateStr === todayStr)         dayEl.classList.add('today');
            if (isPeriodDay(dateStr))         dayEl.classList.add('period');
            else if (isFertileDay(dateStr))   dayEl.classList.add('fertile');

            dayEl.onclick = () => location.href = `tracking.html?date=${dateStr}`;
            calEl.appendChild(dayEl);
        }
    }

    function isPeriodDay(dateStr) {
        const target = window.parseDateLocal(dateStr);
        return state.periods.some(p => {
            const s = window.parseDateLocal(p);
            const e = new Date(s); e.setDate(e.getDate() + state.periodLength - 1);
            return target >= s && target <= e;
        });
    }

    function isFertileDay(dateStr) {
        if (state.periods.length === 0) return false;
        const target   = window.parseDateLocal(dateStr);
        const lastP    = window.parseDateLocal(state.periods[state.periods.length - 1]);
        const nextP    = new Date(lastP); nextP.setDate(nextP.getDate() + state.cycleLength);
        const ovu      = new Date(nextP); ovu.setDate(ovu.getDate() - 14);
        const fertS    = new Date(ovu);   fertS.setDate(ovu.getDate() - 5);
        return target >= fertS && target <= ovu;
    }

    // ── Event Listeners ────────────────────────────────────────
    function setupEvents() {
        // Log Period button
        const logBtn = el('log-period-btn');
        if (logBtn) {
            logBtn.addEventListener('click', () => {
                if (!state.periods.includes(todayStr)) {
                    state.periods.push(todayStr);
                    state.periods.sort((a, b) => new Date(a) - new Date(b));
                    savePeriods();
                    renderCycleStatus();
                    renderCalendar();
                    showToast('Period logged for today! ❤️');
                } else {
                    showToast('Today is already logged! ❋', 'info');
                }
            });
        }

        // Hydration buttons
        const addW = el('add-water');
        const remW = el('remove-water');
        if (addW) {
            addW.addEventListener('click', () => {
                if (state.water.cups < 8) {
                    state.water.cups++;
                    saveWater();
                    renderHydration();
                    if (state.water.cups === 8) showToast('Hydration goal reached! 👑', 'success');
                }
            });
        }
        if (remW) {
            remW.addEventListener('click', () => {
                if (state.water.cups > 0) {
                    state.water.cups--;
                    saveWater();
                    renderHydration();
                }
            });
        }

        // Mini calendar nav
        const prevBtn = el('prev-month');
        const nextBtn = el('next-month');
        if (prevBtn) prevBtn.addEventListener('click', () => {
            state.currentMonth.setMonth(state.currentMonth.getMonth() - 1);
            renderCalendar();
        });
        if (nextBtn) nextBtn.addEventListener('click', () => {
            state.currentMonth.setMonth(state.currentMonth.getMonth() + 1);
            renderCalendar();
        });
    }

    // ── Toast Notifications ────────────────────────────────────
    function showToast(message, type = 'default') {
        const toast = document.createElement('div');
        const colors = {
            default: 'linear-gradient(135deg, #f06292, #ce4993)',
            info:    'linear-gradient(135deg, #7e57c2, #ab47bc)',
            success: 'linear-gradient(135deg, #43a047, #66bb6a)'
        };
        toast.style.cssText = `
            position:fixed; top:24px; right:24px; z-index:99999;
            background:${colors[type] || colors.default};
            color:white; padding:14px 22px; border-radius:16px;
            font-size:.92rem; font-weight:600; font-family:'Outfit',sans-serif;
            box-shadow:0 8px 32px rgba(0,0,0,.18);
            animation: toastIn .35s cubic-bezier(.175,.885,.32,1.275) forwards;
        `;
        toast.textContent = message;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes toastIn { from{opacity:0;transform:translateY(-16px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
            @keyframes toastOut { from{opacity:1} to{opacity:0;transform:translateY(-10px)} }
        `;
        document.head.appendChild(style);
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastOut .3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    init();
});
