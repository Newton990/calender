const fs = require('fs');

function updateTheme() {
    let style = fs.readFileSync('style.css', 'utf8');
    
    // Replace primary Pink with Indigo/Purple
    style = style.replace(/--primary: #FF4D6D;/g, '--primary: #6366f1;');
    style = style.replace(/--primary-light: #FF85A1;/g, '--primary-light: #8b5cf6;');
    style = style.replace(/--primary-dark: #C9184A;/g, '--primary-dark: #4338ca;');
    style = style.replace(/--accent: #FFB3C1;/g, '--accent: #e0e7ff;');
    
    // Convert to business colors
    style = style.replace(/--secondary: #FFCC80;/g, '--secondary: #3b82f6;');
    style = style.replace(/--text-main: #2b2d42;/g, '--text-main: #0f172a;');
    style = style.replace(/--text-muted: #595d78;/g, '--text-muted: #64748b;');
    
    // Rounder squares for cards
    style = style.replace(/border-radius: 24px;/g, 'border-radius: 20px;');
    style = style.replace(/border-radius: 32px;/g, 'border-radius: 24px;');
    
    fs.writeFileSync('style.css', style);
    
    let dashboard = fs.readFileSync('dashboard.html', 'utf8');
    
    // Apply blue->purple to dashboard elements
    dashboard = dashboard.replace(/var\(--accent-purple\): #9D4EDE;/g, 'var(--accent-purple): #6366f1;');
    dashboard = dashboard.replace(/linear-gradient\(180deg, #ff6b81, #ff8fa3\)/g, 'linear-gradient(180deg, #3b82f6, #8b5cf6)');
    dashboard = dashboard.replace(/rgba\(255, 107, 129, 0\.1\)/g, 'rgba(59, 130, 246, 0.1)');
    dashboard = dashboard.replace(/linear-gradient\(135deg, #FF4D6D 0%, #C9184A 100%\)/g, 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)');
    
    // Swap logo text to NewLuna or A/NewLuna
    dashboard = dashboard.replace(/❋ NewLuna/g, 'NewLuna');
    dashboard = dashboard.replace(/<div class="logo newluna-logo">A \/ NewLuna<\/div>/g, '<div class="logo font-bold">A / <span style="font-weight:300;">NewLuna</span></div>');
    
    // Add Chart.js script tag before closing head
    if(!dashboard.includes('chart.js')) {
        dashboard = dashboard.replace('</head>', '    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n</head>');
    }
    
    fs.writeFileSync('dashboard.html', dashboard);
    
    console.log("Theme updated successfully via script.");
}

updateTheme();
