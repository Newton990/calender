const fs = require('fs');
const path = require('path');

function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item.endsWith('.dart')) {
            updateFile(fullPath);
        }
    }
}

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    content = content.replace(/Color\(0xFFFDF7F9\)/g, 'Color(0xFFF8FAFC)');
    content = content.replace(/Colors\.pinkAccent/g, 'Colors.indigoAccent');
    content = content.replace(/Colors\.pink/g, 'Colors.indigo');
    content = content.replace(/Colors\.teal/g, 'Colors.blue');
    content = content.replace(/Color\(0xFFE57373\)/g, 'Color(0xFF8B5CF6)');
    content = content.replace(/Color\(0xFFF3A8B8\)/g, 'Color(0xFF6366F1)');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

processDirectory(path.join(__dirname, 'NewLuna', 'lib'));
processDirectory(path.join(__dirname, 'PartnersApp', 'lib'));
