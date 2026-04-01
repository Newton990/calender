const fs = require('fs');

try {
    const jsFiles = fs.readdirSync('./js').filter(f => f.endsWith('.js'));
    jsFiles.forEach(file => {
        let content = fs.readFileSync('./js/' + file, 'utf8');
        
        // User-facing text replacements
        content = content.replace(/NewLuna 🌸/g, 'Moon Bloom ❋');
        content = content.replace(/Welcome to NewLuna/g, 'Welcome to Moon Bloom');
        content = content.replace(/"NewLuna"/g, '"Moon Bloom"');
        content = content.replace(/>NewLuna</g, '>Moon Bloom<');
        content = content.replace(/NewLuna Hydration/g, 'Moon Bloom Hydration');
        content = content.replace(/NewLuna Update/g, 'Moon Bloom Update');
        content = content.replace(/NewLuna Wellness/g, 'Moon Bloom Wellness');
        content = content.replace(/NewLuna Care/g, 'Moon Bloom Care');
        content = content.replace(/NewLuna Support/g, 'Moon Bloom Support');
        
        // Assistant
        content = content.replace(/Talk to Luna 🌙/g, 'Talk to Moon Bloom ❋');
        content = content.replace(/Hi! I'm Luna/g, "Hi! I'm Moon Bloom");
        content = content.replace(/How are you feeling\? Tell Luna\.\.\./g, 'How are you feeling? Tell Moon Bloom...');
        content = content.replace(/Luna's Daily Note 🌙/g, 'Moon Bloom\'s Daily Note ❋');
        content = content.replace(/Luna's Daily Note/g, 'Moon Bloom\'s Daily Note');
        content = content.replace(/Luna AI Tip/g, 'Moon Bloom AI Tip');
        
        // General
        content = content.replace(/'Luna'/g, "'Moon Bloom'");
        content = content.replace(/"Luna"/g, '"Moon Bloom"');
        content = content.replace(/Luna User/g, 'Moon Bloom User');
        
        fs.writeFileSync('./js/' + file, content, 'utf8');
    });
    console.log('JS text replaced.');
} catch (e) {
    console.error(e);
}
