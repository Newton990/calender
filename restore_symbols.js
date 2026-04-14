const fs = require('fs');
const path = require('path');

const targetDir = 'c:/Users/user/Desktop/calender';
const extensions = ['.html', '.css', '.js'];

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory && !f.includes('node_modules') && !f.includes('.git')) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

walkDir(targetDir, (filePath) => {
    const ext = path.extname(filePath);
    if (extensions.includes(ext)) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('❋')) {
            console.log(`Restoring symbols in: ${filePath}`);
            // Use a regex with the 'u' flag for unicode safety
            const newContent = content.replace(/❋/gu, '❋');
            fs.writeFileSync(filePath, newContent, 'utf8');
        }
    }
});
