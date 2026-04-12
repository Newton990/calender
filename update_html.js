const fs = require('fs');

try {
    const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && !f.startsWith('soft_'));

    const splashHTML = `
    <!-- Animated Splash Screen -->
    <div class="splash-overlay">
        <div class="splash-content">
            <div class="splash-icon">❋</div>
            <div class="splash-text">NewLuna</div>
        </div>
    </div>
`;

    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        
        if (!content.includes('splash-overlay')) {
            content = content.replace(/(<body[^>]*>)/i, '$1' + splashHTML);
        }
        
        content = content.replace(/<div class="logo">Luna<\/div>/gi, '<div class="logo newluna-logo">❋ NewLuna</div>');
        content = content.replace(/<h1 class="logo auth-title">NewLuna<\/h1>/gi, '<h1 class="logo auth-title newluna-logo">❋ NewLuna</h1>');
        content = content.replace(/<h2[^>]*>Luna<\/h2>/gi, '<h2 class="newluna-logo">❋ NewLuna</h2>');
        
        content = content.replace(/Luna \|/gi, 'NewLuna |');
        content = content.replace(/\| Premium Dashboard/gi, '| NewLuna');
        content = content.replace(/NewLuna \|/gi, 'NewLuna |');

        fs.writeFileSync(file, content, 'utf8');
    });
    console.log('HTML files successfully updated.');

    if (fs.existsSync('./js')) {
        const jsFiles = fs.readdirSync('./js').filter(f => f.endsWith('.js') && !f.startsWith('soft_'));
        jsFiles.forEach(file => {
            let content = fs.readFileSync('./js/' + file, 'utf8');
            const regex = /window\.onload\s*=\s*\(\)\s*=>\s*\{[\s\S]*?document\.body\.style\.opacity[\s\S]*?\};/g;
            content = content.replace(regex, '');
            fs.writeFileSync('./js/' + file, content, 'utf8');
        });
        console.log('JS files successfully updated.');
    }
} catch (e) {
    console.error(e);
}
