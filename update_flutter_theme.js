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

    // Color Replacements (Pink/Teal to Indigo/Purple)

    // Primary Pinks -> Indigo
    content = content.replace(/0xFFFF4D6D/g, '0xFF6366F1');
    content = content.replace(/0xFFF06292/g, '0xFF6366F1'); 
    
    // Light Pinks -> Purple Gradient End
    content = content.replace(/0xFFFF6B81/g, '0xFF8B5CF6');
    content = content.replace(/0xFFF48FB1/g, '0xFF8B5CF6');
    
    // Accents/Teals -> Blue
    content = content.replace(/0xFF48CAE4/g, '0xFF3B82F6');
    content = content.replace(/0xFF4CC9F0/g, '0xFF3B82F6');
    content = content.replace(/0xFF0077B6/g, '0xFF4338CA');

    // Muted Pinks
    content = content.replace(/0xFFFFB3C1/g, '0xFFE0E7FF');

    // Radius Refinements (32/24 -> 20 rounded square aesthetic)
    content = content.replace(/BorderRadius\.circular\(32\)/g, 'BorderRadius.circular(20)');
    content = content.replace(/BorderRadius\.circular\(24\)/g, 'BorderRadius.circular(20)');
    content = content.replace(/BorderRadius\.circular\(30\)/g, 'BorderRadius.circular(20)');
    
    // Text replacements for Splash and MoonBloomMark
    content = content.replace(/NewLuna/g, 'NewLuna');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

processDirectory(path.join(__dirname, 'NewLuna', 'lib'));
processDirectory(path.join(__dirname, 'PartnersApp', 'lib'));

// Explicitly handle moon_bloom_mark.dart logo string injection if NewLuna didn't catch
const markPath = path.join(__dirname, 'NewLuna', 'lib', 'widgets', 'moon_bloom_mark.dart');
if (fs.existsSync(markPath)) {
    let markContent = fs.readFileSync(markPath, 'utf8');
    markContent = markContent.replace(/Text\('A \/ NewLuna',/g, "Text('NewLuna',");
    // Ensure flower icons are swapped to a modern shape if found
    markContent = markContent.replace(/'❋'/g, "'❋'");
    fs.writeFileSync(markPath, markContent, 'utf8');
}

const splashPath = path.join(__dirname, 'NewLuna', 'lib', 'screens', 'splash_screen.dart');
if (fs.existsSync(splashPath)) {
    let splashContent = fs.readFileSync(splashPath, 'utf8');
    splashContent = splashContent.replace(/'❋'/g, "'❋'");
    fs.writeFileSync(splashPath, splashContent, 'utf8');
}

const partnersSplashPath = path.join(__dirname, 'PartnersApp', 'lib', 'screens', 'splash_screen.dart');
if (fs.existsSync(partnersSplashPath)) {
    let splashContent = fs.readFileSync(partnersSplashPath, 'utf8');
    splashContent = splashContent.replace(/'❋'/g, "'❋'");
    fs.writeFileSync(partnersSplashPath, splashContent, 'utf8');
}

console.log("Flutter theme transition complete.");
