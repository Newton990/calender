document.addEventListener('DOMContentLoaded', () => {
    function showError(message) {
        const errorEl = document.getElementById('auth-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block'; // Ensure visibility
            errorEl.classList.remove('hidden'); // Compatibility
            errorEl.style.animation = 'none';
            errorEl.offsetHeight; 
            errorEl.style.animation = 'waterPulse 0.3s ease';
        } else {
            alert(message);
        }
    }

    function hideError() {
        const errorEl = document.getElementById('auth-error');
        if (errorEl) {
            errorEl.style.display = 'none';
            errorEl.classList.add('hidden');
        }
    }

    // Helper for loading state (uses global setLoading if available)
    function setBtnLoading(btn, isLoading) {
        if (typeof window.setLoading === 'function') {
            window.setLoading(btn, isLoading);
        } else {
            if (isLoading) btn.classList.add('loading');
            else btn.classList.remove('loading');
        }
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

            setBtnLoading(signupBtn, true);
            hideError();

            try {
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // Send verification email
                await user.sendEmailVerification();

                // Create profile in Firestore
                await firebase.firestore().collection('users').doc(user.uid).set({
                    email: email,
                    nickname: nickname,
                    emailVerified: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    mood_boosting_theme: 'blush',
                    subscribedToUpdates: true
                });

                showError("Verification email sent! Please check your inbox.");
                
                // Optional: Store email for the verification page to use
                localStorage.setItem('pendingVerifyEmail', email);

                setTimeout(() => {
                    window.location.replace('verify.html');
                }, 2000);
            } catch (error) {
                showError(error.message);
            } finally {
                setBtnLoading(signupBtn, false);
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

            setBtnLoading(loginBtn, true);
            hideError();

            try {
                const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
                const user = userCredential.user;

                if (!user.emailVerified) {
                    showError("Please verify your email address first.");
                    localStorage.setItem('pendingVerifyEmail', email);
                    setTimeout(() => {
                        window.location.replace('verify.html');
                    }, 2000);
                    return;
                }

                localStorage.setItem('NewLunaSession', email);
                
                const returnUrl = sessionStorage.getItem('returnUrl');
                if (returnUrl && returnUrl !== 'login.html') {
                    sessionStorage.removeItem('returnUrl');
                    window.location.replace(returnUrl);
                } else {
                    const layout = localStorage.getItem('current_layout') || 'soft';
                    window.location.replace(layout === 'roma' ? 'dashboard.html' : 'soft_dashboard.html');
                }
            } catch (error) {
                showError("Invalid credentials or user not found.");
            } finally {
                setBtnLoading(loginBtn, false);
            }
        });
    }

    // Form switching (Handled by inline scripts in login.html, but keeping hooks for reliability if present)
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
