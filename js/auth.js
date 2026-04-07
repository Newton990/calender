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
        signupBtn.addEventListener('click', async () => {
            const emailEl = document.getElementById('signup-email');
            const passwordEl = document.getElementById('signup-password');
            const nicknameEl = document.getElementById('signup-nickname'); // Expecting this field in HTML

            if (!emailEl || !passwordEl) return;

            const email = emailEl.value.trim();
            const password = passwordEl.value.trim();
            const nickname = nicknameEl ? nicknameEl.value.trim() : "New User";

            if (!email || !password) {
                showError("Please enter both email and password.");
                return;
            }

            try {
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // Create profile in Firestore
                await firebase.firestore().collection('users').doc(user.uid).set({
                    email: email,
                    nickname: nickname,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    mood_boosting_theme: 'blush'
                });

                showError("Account created! Verifying session...");
                localStorage.setItem('New LunaSession', email);
                
                const returnUrl = sessionStorage.getItem('returnUrl');
                if (returnUrl && returnUrl !== 'login.html') {
                    sessionStorage.removeItem('returnUrl');
                    window.location.replace(returnUrl);
                } else {
                    window.location.replace('index.html');
                }
            } catch (error) {
                showError(error.message);
            }
        });
    }

    // Login Action
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const emailEl = document.getElementById('login-email');
            const passwordEl = document.getElementById('login-password');

            if (!emailEl || !passwordEl) return;

            const email = emailEl.value.trim();
            const password = passwordEl.value.trim();

            if (!email || !password) {
                showError("Please enter email and password.");
                return;
            }

            try {
                await firebase.auth().signInWithEmailAndPassword(email, password);
                localStorage.setItem('New LunaSession', email);
                
                const returnUrl = sessionStorage.getItem('returnUrl');
                if (returnUrl && returnUrl !== 'login.html') {
                    sessionStorage.removeItem('returnUrl');
                    window.location.replace(returnUrl);
                } else {
                    window.location.replace('index.html');
                }
            } catch (error) {
                showError("Invalid credentials or user not found.");
            }
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
