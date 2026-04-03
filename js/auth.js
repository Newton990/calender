document.addEventListener('DOMContentLoaded', () => {
    console.log("Auth script loaded and DOMContentLoaded fired.");

    // Global Debug Listener
    document.addEventListener('click', (e) => {
        console.log("Global click on:", e.target.id, e.target.className);
    });

    function showError(message) {
        const errorEl = document.getElementById('auth-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
            // Shake effect for feedback
            errorEl.style.animation = 'none';
            errorEl.offsetHeight; /* trigger reflow */
            errorEl.style.animation = 'waterPulse 0.3s ease';
        } else {
            alert(message);
        }
    }

    function hideError() {
        const errorEl = document.getElementById('auth-error');
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
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
        signupBtn.addEventListener('click', async () => {
            console.log("Auth: Signup initiated.");
            const emailEl = document.getElementById('signup-email');
            const methodEl = document.getElementById('auth-method');
            const passwordEl = document.getElementById('signup-password');
            const pinEl = document.getElementById('signup-pin');

            if (!emailEl || !methodEl) {
                console.error("Auth: Signup inputs missing from DOM.");
                return;
            }

            const email = emailEl.value.trim();
            const method = methodEl.value;

            if (!email) {
                showError("Please enter your email.");
                return;
            }

            let authData = { method };

            if (method === 'password') {
                const password = passwordEl ? passwordEl.value.trim() : '';
                if (!password) {
                    showError("Please enter a password.");
                    return;
                }
                // Security Check
                const passwordError = validatePassword(password);
                if (passwordError) {
                    showError(passwordError);
                    return;
                }
                authData.password = password;
            } else if (method === 'pin') {
                const pin = pinEl ? pinEl.value.trim() : '';
                if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
                    showError("Please enter a valid 4-digit PIN.");
                    return;
                }
                authData.pin = pin;
            } else if (method === 'pattern') {
                if (!window.pattern || window.pattern.length < 3) {
                    showError("Please draw a pattern with at least 3 points.");
                    return;
                }
                authData.pattern = window.pattern;
            } else if (method === 'fingerprint') {
                const credential = localStorage.getItem('fingerprintCredential');
                if (!credential) {
                    showError("Please set up fingerprint first.");
                    return;
                }
                authData.fingerprint = JSON.parse(credential);
            }

            try {
                // For Firebase, we still need a password. Use a default one for non-password methods
                const firebasePassword = method === 'password' ? authData.password : 'defaultPassword123!';
                
                const userCredential = await window.createUserWithEmailAndPassword(window.firebaseAuth, email, firebasePassword);
                await window.sendEmailVerification(userCredential.user);
                
                // Store auth method and data
                localStorage.setItem(`authMethod_${email}`, JSON.stringify(authData));
                
                showError("Account created! Please check your email for verification link. You can then log in with your chosen authentication method.");
                // Switch to login form
                const signupForm = document.getElementById('signup-form-container');
                const loginForm = document.getElementById('login-form-container');
                if (signupForm && loginForm) {
                    signupForm.classList.add('hidden');
                    loginForm.classList.remove('hidden');
                }
            } catch (error) {
                console.error("Signup error:", error);
                showError(error.message);
            }
        });
    }

    // Login Action
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        console.log("Auth: Login button found.");
        loginBtn.addEventListener('click', async () => {
            const emailEl = document.getElementById('login-email');

            if (!emailEl) {
                console.error("Auth: Login inputs missing from DOM.");
                return;
            }

            const email = emailEl.value.trim();

            if (!email) {
                showError("Please enter your email.");
                return;
            }

            // Get stored auth method
            const methodData = localStorage.getItem(`authMethod_${email}`);
            if (!methodData) {
                showError("No account found with this email. Please sign up first.");
                return;
            }

            const authData = JSON.parse(methodData);
            const method = authData.method;

            let isAuthenticated = false;

            if (method === 'password') {
                const passwordEl = document.getElementById('login-password');
                const password = passwordEl ? passwordEl.value.trim() : '';
                if (!password) {
                    showError("Please enter your password.");
                    return;
                }
                isAuthenticated = password === authData.password;
            } else if (method === 'pin') {
                const pinEl = document.getElementById('login-pin');
                const pin = pinEl ? pinEl.value.trim() : '';
                if (!pin) {
                    showError("Please enter your PIN.");
                    return;
                }
                isAuthenticated = pin === authData.pin;
            } else if (method === 'pattern') {
                // Simple pattern matching - in real app, use proper algorithm
                isAuthenticated = window.loginPattern && window.loginPattern.length >= 3;
            } else if (method === 'fingerprint') {
                // Fingerprint is handled separately
                showError("Please use the fingerprint button to authenticate.");
                return;
            }

            if (!isAuthenticated) {
                showError("Invalid credentials.");
                return;
            }

            try {
                // Firebase login with default password
                const firebasePassword = method === 'password' ? authData.password : 'defaultPassword123!';
                const userCredential = await window.signInWithEmailAndPassword(window.firebaseAuth, email, firebasePassword);
                if (!userCredential.user.emailVerified) {
                    showError("Please verify your email before logging in.");
                    return;
                }
                localStorage.setItem('New LunaSession', email);
                window.location.replace('index.html');
            } catch (error) {
                console.error("Login error:", error);
                showError("Authentication failed.");
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
