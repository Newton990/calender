
import os

filepath = r'c:\Users\user\Desktop\calender\style.css'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    # Remove the mess between the new root and the hidden class
    if ':root {' in line and '--primary: #FF4D6D' in line:
        continue # handled by a rewrite later if needed, but wait
    
    # Let's just do a full rewrite of the first 100 lines to be safe
    # Or define the blocks we want
    pass

# Better approach: find indices
start_mess = -1
end_mess = -1
for i, line in enumerate(lines):
    if i > 15 and '    --primary: #9d4edd;' in line:
        start_mess = i
    if start_mess != -1 and i > start_mess and '}' in line:
        end_mess = i
        break

if start_mess != -1 and end_mess != -1:
    # Remove lines from start_mess-3 (to get the comment and dummy class) to end_mess
    # Wait, indices are tricky. Let's just match content.
    pass

# Actually, I'll just write a script that replaces the whole first section with the correct content.
root_block = """:root {
    --primary: #FF4D6D; /* NewLuna Pink */
    --primary-light: #FF85A1;
    --primary-dark: #C9184A;
    --accent: #FFB3C1;
    --secondary: #FFCC80; /* Orange[100] equivalent */
    --green-light: #C8E6C9; /* Green[100] equivalent */
    --orange-light: #FFE0B2; /* Orange[100] equivalent */
    --bg-light: #F7F4FF; /* Light Lavender Background */
    --bg-gradient: linear-gradient(135deg, #F7F4FF 0%, #FFFFFF 100%);
    --glass-bg: rgba(255, 255, 255, 0.9);
    --glass-border: rgba(255, 255, 255, 0.6);
    --text-main: #2b2d42;
    --text-muted: #595d78;
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    --elevation-card: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.hidden {
    display: none !important;
}

[data-theme="lavender"] {
    --primary: #FF4D6D;
    --primary-light: #FF85A1;
    --primary-dark: #C9184A;
    --accent: #FFB3C1;
    --bg-gradient: linear-gradient(135deg, #F7F4FF 0%, #FFFFFF 100%);
    --bg-light: #F7F4FF;
    --shadow: 0 4px 12px rgba(255, 77, 109, 0.15);
}

[data-theme="peachy"] {
    --primary: #FF85A1;
    --primary-light: #FFB3C1;
    --primary-dark: #FB6F92;
    --accent: #FFE5EC;
    --bg-gradient: linear-gradient(135deg, #FFF5F8 0%, #FFE5EC 100%);
    --bg-light: #FFF5F8;
    --shadow: 0 4px 12px rgba(255, 133, 161, 0.15);
}
"""

# Find where the old themes start or where hidden ends
hidden_end = -1
for i, line in enumerate(lines):
    if '.hidden {' in line:
        for j in range(i, i+10):
            if '}' in lines[j]:
                hidden_end = j
                break
        if hidden_end != -1: break

# If we find [data-theme="sunset"], we keep everything after that
sunset_start = -1
for i, line in enumerate(lines):
    if '[data-theme="sunset"]' in line:
        sunset_start = i
        break

if sunset_start != -1:
    content = root_block + "".join(lines[sunset_start:])
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated style.css")
else:
    print("Could not find sunset theme start")
