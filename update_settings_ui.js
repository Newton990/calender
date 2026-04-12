const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, 'settings.html');
if (fs.existsSync(settingsPath)) {
    let html = fs.readFileSync(settingsPath, 'utf8');

    const themeLabel = '<label style="font-weight: 600; display: block; margin-bottom: 10px;">Mood-Boosting Themes ❋</label>';
    const themeGridStart = '<div class="theme-grid">';
    const themeGridEnd = '</div>';

    const startIndex = html.indexOf(themeLabel);
    const gridStartIndex = html.indexOf(themeGridStart, startIndex);
    const gridEndIndex = html.indexOf(themeGridEnd, gridStartIndex) + themeGridEnd.length;

    if (startIndex !== -1 && gridStartIndex !== -1 && gridEndIndex !== -1) {
        const newThemeSection = `                <label style="font-weight: 600; display: block; margin-bottom: 10px;">Mood-Boosting Themes ❋</label>
                <div class="glass" style="padding: 15px; margin-bottom: 20px; background: rgba(255,255,255,0.2);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0;">
                        <div>
                            <span style="font-size: 0.95rem; font-weight: 600;">Automated Mood Switching 🧠</span>
                            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Let NewLuna adjust colors to support your current mood log.</p>
                        </div>
                        <input type="checkbox" id="auto-theme-enabled" style="width: 20px; height: 20px; accent-color: var(--primary);">
                    </div>
                </div>

                <div class="theme-grid">
                    <div class="theme-option active" data-theme="blush">
                        <div class="color-swatch" style="background: #FFD1DC;"></div>
                        <span>Blush</span>
                    </div>
                    <div class="theme-option" data-theme="calm">
                        <div class="color-swatch" style="background: #E6E6FA;"></div>
                        <span>Calm</span>
                    </div>
                    <div class="theme-option" data-theme="glow">
                        <div class="color-swatch" style="background: #FF8C69;"></div>
                        <span>Glow</span>
                    </div>
                    <div class="theme-option" data-theme="health">
                        <div class="color-swatch" style="background: #98FF98;"></div>
                        <span>Health</span>
                    </div>
                    <div class="theme-option" data-theme="deep">
                        <div class="color-swatch" style="background: #2E004B;"></div>
                        <span>Deep</span>
                    </div>
                </div>`;

        html = html.substring(0, startIndex) + newThemeSection + html.substring(gridEndIndex);
        fs.writeFileSync(settingsPath, html, 'utf8');
        console.log("Updated settings.html themes and toggle.");
    } else {
        console.log("Could not find theme block in settings.html.");
    }
}
