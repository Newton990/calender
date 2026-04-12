const fs = require('fs');
const path = require('path');

const loginPath = path.join(__dirname, 'login.html');
if (fs.existsSync(loginPath)) {
    let html = fs.readFileSync(loginPath, 'utf8');

    // 1. Remove legacy script block
    const scriptStart = html.indexOf('<script>', html.indexOf('js/auth.js'));
    const scriptEnd = html.lastIndexOf('</script>') + 9;
    if (scriptStart !== -1 && scriptEnd !== -1) {
        html = html.substring(0, scriptStart) + html.substring(scriptEnd);
    }

    // 2. Add Firebase JS SDKs if not already present
    if (!html.includes('firebase-app-compat.js')) {
        const headEnd = html.indexOf('</head>');
        const firebaseScripts = `    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
    <script src="js/firebase-config.js"></script>\n`;
        html = html.substring(0, headEnd) + firebaseScripts + html.substring(headEnd);
    }

    // 3. Ensure nickname field is in signup
    if (!html.includes('signup-nickname')) {
        const signupEmail = html.indexOf('id="signup-email"');
        const lineStart = html.lastIndexOf('<input', signupEmail);
        html = html.substring(0, lineStart) + '<input type="text" id="signup-nickname" class="auth-input" placeholder="Your Nickname ❋">\n                ' + html.substring(lineStart);
    }

    fs.writeFileSync(loginPath, html, 'utf8');
    console.log("Cleaned up login.html and injected Firebase.");
}
