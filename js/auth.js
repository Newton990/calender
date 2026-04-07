document.addEventListener('DOMContentLoaded', () => {
    function showError(message) {
        const errorEl = document.getElementById('auth-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
            errorEl.style.animation = 'none';
            errorEl.offsetHeight; 
            errorEl.style.animation = 'waterPulse 0.3s ease';
        } else {
            alert(message);
        }
    }

    function hideError() {
        const errorEl = document.getElementById('auth-error');
        if (errorEl) errorEl.classList.add('hidden');
    }

    // Signup Action
    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            const emailEl = document.getElementById('signup-email');
            const passwordEl = document.getElementById('signup-password');

            if (!emailEl || !passwordEl) return;

            const email = emailEl.value.trim();
            const password = passwordEl.value.trim();

            if (!email || !password) {
                showError("Please enter both email and password.");
                return;
            }

            if (password.length < 6) {
                showError("Password must be at least 6 characters.");
                return;
            }

            // LocalStorage Mock Auth 
            const authData = { method: 'password', password: password };
            localStorage.setItem(`authMethod_${email}`, JSON.stringify(authData));
            
            showError("Account created! You can now log in.");
            
            const signupForm = document.getElementById('signup-form-container');
            const loginForm = document.getElementById('login-form-container');
            if (signupForm && loginForm) {
                signupForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                document.getElementById('login-email').value = email;
            }
        });
    }

    // Login Action
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const emailEl = document.getElementById('login-email');
            const passwordEl = document.getElementById('login-password');

            if (!emailEl || !passwordEl) return;

            const email = emailEl.value.trim();
            const password = passwordEl.value.trim();

            if (!email || !password) {
                showError("Please enter email and password.");
                return;
            }

            const methodData = localStorage.getItem(`authMethod_${email}`);
            if (!methodData) {
                showError("No account found with this email. Please sign up.");
                return;
            }

            const authData = JSON.parse(methodData);
            
            if (password !== authData.password) {
                showError("Invalid credentials.");
                return;
            }

            // Login successful
            localStorage.setItem('New LunaSession', email);
            window.location.replace('dashboard.html');
        });
    }

    // Form switching
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form-container');
    const signupForm = document.getElementById('signup-form-container');

    if (showSignup && signupForm && loginForm) {
        showSignup.addEventListener('click', () => {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            hideError();
        });
    }

    if (showLogin && signupForm && loginForm) {
        showLogin.addEventListener('click', () => {
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            hideError();
        });
    }
});
