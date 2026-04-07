const fs = require('fs');
const path = require('path');

const stylePath = path.join(__dirname, 'style.css');
if (fs.existsSync(stylePath)) {
    let css = fs.readFileSync(stylePath, 'utf8');

    // 1. Rebuild the Theme Definitions
    // We search for the area after :root and .hidden
    const themesStart = css.indexOf('[data-theme="lavender"]');
    const themesEnd = css.indexOf('* {', themesStart);

    if (themesStart !== -1 && themesEnd !== -1) {
        const newThemes = `[data-theme="blush"] {
    --primary: #FFB3C1;
    --bg-light: #FFFDF5;
    --card-bg: #FFE5EC;
    --accent: #FFD1DC;
}

[data-theme="calm"] {
    --primary: #9D4EDD;
    --bg-light: #F7F4FF;
    --card-bg: #E6E6FA; /* Lavender Calm */
    --accent: #E0AAFF;
}

[data-theme="glow"] {
    --primary: #FF8C69; /* Soft Coral */
    --bg-light: #FFFDF5;
    --card-bg: #FFDAB9; /* Warm Peach Glow */
    --accent: #FFC3A0;
}

[data-theme="health"] {
    --primary: #43AA8B;
    --bg-light: #F0FFF4;
    --card-bg: #98FF98; /* Mint Green */
    --accent: #D7F9E9;
}

[data-theme="deep"] {
    --primary: #7209B7;
    --bg-light: #2E004B; /* Midnight Violet */
    --card-bg: #915F6D; /* Dusty Plum */
    --accent: #3C096C;
    --text-main: #FFFFFF;
    --text-muted: #E6E6FA;
}

/* Extra Mood Utility Layers */
.emotion-ivory { background-color: #FFFDF5 !important; }
.emotion-blush { background-color: #FFD1DC !important; color: #2E004B !important; }
.emotion-coral { background-color: #FF8C69 !important; color: white !important; }
.emotion-lavender { background-color: #E6E6FA !important; }
.emotion-mint { background-color: #98FF98 !important; }

`;
        css = css.substring(0, themesStart) + newThemes + css.substring(themesEnd);
        fs.writeFileSync(stylePath, css, 'utf8');
        console.log("Updated style.css themes.");
    } else {
        console.log("Could not find theme block to replace.");
    }
}
