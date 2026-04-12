const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        let original = content;
        
        content = content.replace(/<title>NewLuna/g, '<title>NewLuna');
        content = content.replace(/>❋ NewLuna</g, '>NewLuna<');
        content = content.replace(/"splash-text">NewLuna</g, '"splash-text">NewLuna<');
        content = content.replace(/<h2>NewLuna<\/h2>/g, '<h2>NewLuna</h2>');
        
        if (content !== original) {
            fs.writeFileSync(path.join(dir, file), content, 'utf8');
        }
    }
});

console.log("HTML sweeping done.");
