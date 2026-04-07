const fs = require('fs');
const path = require('path');

const dir = __dirname;

// 1. Update style.css
const stylePath = path.join(dir, 'style.css');
if (fs.existsSync(stylePath)) {
    let css = fs.readFileSync(stylePath, 'utf8');
    css = css.replace(/--primary: #6366f1;/g, '--primary: #FF758C; /* Vibrant Rose */');
    css = css.replace(/--primary-light: #8b5cf6;.*/g, '--primary-light: #FF7EB3; /* Soft Pink */');
    css = css.replace(/--primary-dark: #4338ca;/g, '--primary-dark: #E85D75;');
    css = css.replace(/--accent: #e0e7ff;/g, '--accent: #FFDFD3; /* Peach */');
    css = css.replace(/--secondary: #3b82f6;.*/g, '--secondary: #FFAAA5; /* Pastel Coral */');
    css = css.replace(/background: #f8fafc;.*/g, 'background: #FFF5F8; /* Soft Rose Base */');
    fs.writeFileSync(stylePath, css, 'utf8');
}

// 2. Update dashboard.html text
const dashPath = path.join(dir, 'dashboard.html');
if (fs.existsSync(dashPath)) {
    let dash = fs.readFileSync(dashPath, 'utf8');
    dash = dash.replace(/>A \/ NewLuna</g, '>NewLuna ✨<');
    dash = dash.replace(/Business Performance/g, 'Wellness Tracking');
    dash = dash.replace(/System and User Activity/g, 'Personal energy and mood logging');
    fs.writeFileSync(dashPath, dash, 'utf8');
}

// 3. Update all other HTML files to "NewLuna ✨"
const files = fs.readdirSync(dir);
files.forEach(file => {
    if (file.endsWith('.html') && file !== 'dashboard.html') {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        content = content.replace(/>A \/ NewLuna</g, '>NewLuna ✨<');
        content = content.replace(/<title>A \/ NewLuna<\/title>/g, '<title>NewLuna ✨</title>');
        if (content !== original) fs.writeFileSync(filePath, content, 'utf8');
    }
});

// 4. Update the charts in js/business_charts.js to Wellness ones
const chartsPath = path.join(dir, 'js', 'business_charts.js');
if (fs.existsSync(chartsPath)) {
    let js = fs.readFileSync(chartsPath, 'utf8');
    // Line chart
    js = js.replace(/'System Load'/g, "'Energy Level'");
    js = js.replace(/'Active Users'/g, "'Overall Mood'");
    js = js.replace(/rgba\(99, 102, 241, 0.2\)/g, "'rgba(255, 117, 140, 0.2)'"); // Rose light
    js = js.replace(/rgb\(99, 102, 241\)/g, "'#FF758C'"); // Rose
    js = js.replace(/rgb\(139, 92, 246\)/g, "'#FFC3A0'"); // Peach
    
    // Radar charts
    js = js.replace(/'Tasks', 'Messages', 'Reviews', 'Sales', 'Meetings', 'Support'/g, "'Energy', 'Mood', 'Sleep', 'Hydration', 'Movement', 'Calm'");
    
    // Blue dataset -> Vibrant Rose
    js = js.replace(/rgba\(59, 130, 246, 0.2\)/g, "'rgba(255, 117, 140, 0.2)'");
    js = js.replace(/rgb\(59, 130, 246\)/g, "'#FF758C'");
    
    // Purple dataset -> Soft bright pink
    js = js.replace(/rgba\(139, 92, 246, 0.2\)/g, "'rgba(255, 126, 179, 0.2)'");
    js = js.replace(/rgb\(139, 92, 246\)/g, "'#FF7EB3'");
    
    fs.writeFileSync(chartsPath, js, 'utf8');
}

console.log("Web wellness update complete.");
