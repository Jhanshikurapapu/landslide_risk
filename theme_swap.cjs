const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

let changedCount = 0;

function swapColors(filePath) {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.css') && !filePath.endsWith('.html')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Swap Tailwind colors
    content = content.replace(/blue-([0-9]+)/g, 'fuchsia-$1');
    content = content.replace(/cyan-([0-9]+)/g, 'pink-$1');
    
    // Convert hardcoded hex colors related to the old theme
    content = content.replace(/3b82f6/gi, 'd946ef'); // blue-500 -> fuchsia-500
    content = content.replace(/2563eb/gi, 'c026d3'); // blue-600 -> fuchsia-600
    content = content.replace(/60a5fa/gi, 'e879f9'); // blue-400 -> fuchsia-400
    content = content.replace(/22d3ee/gi, 'f472b6'); // cyan-400 -> pink-400

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        changedCount++;
        console.log(`Updated theme colors in: ${filePath}`);
    }
}

walkDir(targetDir, swapColors);
console.log(`\nTheme swap complete! Modified ${changedCount} files.`);
