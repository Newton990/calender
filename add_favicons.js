const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir);

const tagsToAdd = `    <!-- App Icons and Favicon -->
    <link rel="icon" href="favicon.png" type="image/png">
    <link rel="apple-touch-icon" href="logo-192x192.png">
    <meta property="og:image" content="logo-512x512.png">
    <meta name="twitter:image" content="logo-512x512.png">`;

files.forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        
        // Remove existing favicon/icon links if they exist to avoid duplication
        content = content.replace(/<link[^>]+rel="icon"[^>]*>/gi, '');
        content = content.replace(/<link[^>]+rel="shortcut icon"[^>]*>/gi, '');
        content = content.replace(/<link[^>]+rel="apple-touch-icon"[^>]*>/gi, '');
        content = content.replace(/<meta[^>]+property="og:image"[^>]*>/gi, '');
        content = content.replace(/<meta[^>]+name="twitter:image"[^>]*>/gi, '');
        
        // Add new tags before closing </head>
        if (content.includes('</head>')) {
            content = content.replace('</head>', tagsToAdd + '\n</head>');
            fs.writeFileSync(path.join(dir, file), content, 'utf8');
            console.log("Updated " + file);
        }
    }
});
console.log("Finished adding favicons.");
