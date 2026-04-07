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

    // Indigo -> Vibrant Rose
    content = content.replace(/0xFF6366F1/g, '0xFFFF758C');
    content = content.replace(/Colors\.indigoAccent/g, 'Colors.pinkAccent');
    content = content.replace(/Colors\.indigo/g, 'Color(0xFFFF758C)');

    // Purple -> Soft bright pink
    content = content.replace(/0xFF8B5CF6/g, '0xFFFF7EB3');

    // Dark Indigo -> Deep Rose
    content = content.replace(/0xFF4338CA/g, '0xFFE85D75');

    // Blue equivalents to Soft Peach
    content = content.replace(/0xFF3B82F6/g, '0xFFFFC3A0');
    content = content.replace(/Colors\.blue/g, 'Color(0xFFFFC3A0)');

    // Background bases (F8FAFC -> FFF5F8)
    content = content.replace(/0xFFF8FAFC/g, '0xFFFFF5F8');

    // Soft Indigo highlight -> Peach
    content = content.replace(/0xFFE0E7FF/g, '0xFFFFDFD3');

    // Reverting "A / NewLuna" to "NewLuna ✨"
    content = content.replace(/A \/ NewLuna/g, 'NewLuna ✨');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

processDirectory(path.join(__dirname, 'NewLuna', 'lib'));
processDirectory(path.join(__dirname, 'PartnersApp', 'lib'));
console.log("Flutter radiant sunrise update complete.");
