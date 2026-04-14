document.addEventListener('DOMContentLoaded', () => {
    function showError(message) {
        const errorEl = document.getElementById('auth-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            errorEl.classList.remove('hidden');
            errorEl.style.animation = 'none';
            errorEl.offsetHeight; 
            errorEl.style.animation = 'waterPulse 0.3s ease';
        } else {
            console.error(message);
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

    function setBtnLoading(btn, isLoading) {
        if (typeof window.setLoading === 'function') {
            window.setLoading(btn, isLoading);
        } else {
            if (isLoading) {
                btn.disabled = true;
                btn.classList.add('loading');
                btn.dataset.originalText = btn.textContent;
                btn.textContent = "Processing...";
            } else {
                btn.disabled = false;
                btn.classList.remove('loading');
                if (btn.dataset.originalText) btn.textContent = btn.dataset.originalText;
            }
        }
    }

    // Signup Action
    const signupBtn = document.getElementById('signup-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', async () => {
            const emailEl = document.getElementById('signup-email');
            const passwordEl = document.getElementById('signup-password');
            const nicknameEl = document.getElementById('signup-nickname');

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

                // Success message using the error element (styled for success in common CSS would be better, but keeping current approach for now)
                showError("Verification email sent! Please check your inbox. ✨");
                
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
                    showError("Please verify your email address first. 📧");
                    localStorage.setItem('pendingVerifyEmail', email);
                    setTimeout(() => {
                        window.location.replace('verify.html');
                    }, 2000);
                    return;
                }

                // Session will be picked up by common.js listener
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
                showError(error.message || "Invalid credentials or user not found.");
            } finally {
                setBtnLoading(loginBtn, false);
            }
        });
    }

    // Form switching
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('view-login');
    const signupForm = document.getElementById('view-signup');

    if (showSignup && signupForm && loginForm) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            signupForm.classList.add('active');
            hideError();
        });
    }

    if (showLogin && signupForm && loginForm) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.classList.remove('active');
            loginForm.classList.add('active');
            hideError();
        });
    }

    // Handle URL parameters for initial view
    const urlParams = new URLSearchParams(window.location.search);
    const initialView = urlParams.get('view');
    if (initialView === 'signup' && signupForm && loginForm) {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    } else if (initialView === 'login' && signupForm && loginForm) {
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    }
});


