const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir);

const firebaseScripts = `    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
    <script src="js/firebase-config.js"></script>\n`;

files.forEach(file => {
    if (file.endsWith('.html') && file !== 'login.html') {
        const filePath = path.join(dir, file);
        let html = fs.readFileSync(filePath, 'utf8');
        
        if (!html.includes('firebase-app-compat.js')) {
            const headEnd = html.indexOf('</head>');
            if (headEnd !== -1) {
                html = html.substring(0, headEnd) + firebaseScripts + html.substring(headEnd);
                fs.writeFileSync(filePath, html, 'utf8');
                console.log(`Injected Firebase into ${file}`);
            }
        }
    }
});
