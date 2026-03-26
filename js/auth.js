document.addEventListener('DOMContentLoaded', () => {
    console.log("Auth script loaded and DOMContentLoaded fired.");
    
    // Global Debug Listener
    document.addEventListener('click', (e) => {
        console.log("Global click on:", e.target.id, e.target.className);
    });


    // Simulate Database
    let usersDB = {};
    try {
        const storedUsers = localStorage.getItem('NewLunaUsers');
        if (storedUsers) {
            usersDB = JSON.parse(storedUsers);
        }
    } catch (e) {
        console.error("Auth: Error parsing usersDB:", e);
        usersDB = {};
    }

    function validatePassword(pass) {
        if (pass.length < 8) return "Password must be at least 8 characters long.";
        if (!/\d/.test(pass)) return "Password must contain at least one number.";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Password must contain at least one special character.";
        return null;
    }

    // Signup Action
    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        console.log("Auth: Signup button found.");
        signupBtn.addEventListener('click', () => {
            console.log("Auth: Signup initiated.");
            const userEl = document.getElementById('signup-username');
            const passEl = document.getElementById('signup-password');
            
            if (!userEl || !passEl) {
                console.error("Auth: Signup inputs missing from DOM.");
                return;
            }

            const user = userEl.value.trim();
            const pass = passEl.value.trim();
            
            if (!user || !pass) {
                showError("Please fill all fields.");
                return;
            }

            // Security Check
            const passwordError = validatePassword(pass);
            if (passwordError) {
                showError(passwordError);
                return;
            }

            if (usersDB[user]) {
                showError("Username already exists.");
                return;
            }

            // Create User
            usersDB[user] = { password: pass };
            localStorage.setItem('NewLunaUsers', JSON.stringify(usersDB));
            console.log("Auth: User created successfully.");
            
            // Auto Login
            localStorage.setItem('NewLunaSession', user);
            window.location.replace('index.html');
        });
    }

    // Login Action
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        console.log("Auth: Login button found.");
        loginBtn.addEventListener('click', () => {
            const userEl = document.getElementById('login-username');
            const passEl = document.getElementById('login-password');
            
            if (!userEl || !passEl) {
                console.error("Auth: Login inputs missing from DOM.");
                return;
            }

            const user = userEl.value.trim();
            const pass = passEl.value.trim();

            if (!user || !pass) {
                showError("Please fill all fields.");
                return;
            }

            if (usersDB[user] && usersDB[user].password === pass) {
                localStorage.setItem('NewLunaSession', user);
                window.location.replace('index.html');
            } else {
                showError("Invalid username or password.");
            }
        });
    }

    // Toggle Logic (for login.html dual-form mode)
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form-container');
    const signupForm = document.getElementById('signup-form-container');

    if (showSignup && signupForm && loginForm) {
        showSignup.addEventListener('click', () => {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            const authError = document.getElementById('auth-error');
            if (authError) authError.classList.add('hidden');
        });
    }

    if (showLogin && signupForm && loginForm) {
        showLogin.addEventListener('click', () => {
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            const authError = document.getElementById('auth-error');
            if (authError) authError.classList.add('hidden');
        });
    }

    function showError(msg) {
        const authError = document.getElementById('auth-error');
        if (authError) {
            authError.textContent = msg;
            authError.classList.remove('hidden');
            // Shake effect for feedback
            authError.style.animation = 'none';
            authError.offsetHeight; /* trigger reflow */
            authError.style.animation = 'waterPulse 0.3s ease';
        } else {
            alert(msg);
        }
    }
});
