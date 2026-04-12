const fs = require('fs');

try {
    const jsFiles = fs.readdirSync('./js').filter(f => f.endsWith('.js'));
    jsFiles.forEach(file => {
        let content = fs.readFileSync('./js/' + file, 'utf8');
        
        // User-facing text replacements
        content = content.replace(/NewLuna 🌸/g, 'NewLuna ❋');
        content = content.replace(/Welcome to NewLuna/g, 'Welcome to NewLuna');
        content = content.replace(/"NewLuna"/g, '"NewLuna"');
        content = content.replace(/>NewLuna</g, '>NewLuna<');
        content = content.replace(/NewLuna Hydration/g, 'NewLuna Hydration');
        content = content.replace(/NewLuna Update/g, 'NewLuna Update');
        content = content.replace(/NewLuna Wellness/g, 'NewLuna Wellness');
        content = content.replace(/NewLuna Care/g, 'NewLuna Care');
        content = content.replace(/NewLuna Support/g, 'NewLuna Support');
        
        // Assistant
        content = content.replace(/Talk to Luna 🌙/g, 'Talk to NewLuna ❋');
        content = content.replace(/Hi! I'm Luna/g, "Hi! I'm NewLuna");
        content = content.replace(/How are you feeling\? Tell Luna\.\.\./g, 'How are you feeling? Tell NewLuna...');
        content = content.replace(/Luna's Daily Note 🌙/g, 'NewLuna\'s Daily Note ❋');
        content = content.replace(/Luna's Daily Note/g, 'NewLuna\'s Daily Note');
        content = content.replace(/Luna AI Tip/g, 'NewLuna AI Tip');
        
        // General
        content = content.replace(/'Luna'/g, "'NewLuna'");
        content = content.replace(/"Luna"/g, '"NewLuna"');
        content = content.replace(/Luna User/g, 'NewLuna User');
        
        fs.writeFileSync('./js/' + file, content, 'utf8');
    });
    console.log('JS text replaced.');
} catch (e) {
    console.error(e);
}
