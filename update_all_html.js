const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        let original = content;
        
        content = content.replace(/<title>New Luna/g, '<title>A / NewLuna');
        content = content.replace(/>❋ New Luna</g, '>A / NewLuna<');
        content = content.replace(/"splash-text">New Luna</g, '"splash-text">A / NewLuna<');
        content = content.replace(/<h2>New Luna<\/h2>/g, '<h2>A / NewLuna</h2>');
        
        if (content !== original) {
            fs.writeFileSync(path.join(dir, file), content, 'utf8');
        }
    }
});

console.log("HTML sweeping done.");
