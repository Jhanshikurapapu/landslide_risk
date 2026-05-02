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

    // Swap Tailwind colors from fuchsia/pink to emerald/teal
    content = content.replace(/fuchsia-([0-9]+)/gi, 'emerald-$1');
    content = content.replace(/pink-([0-9]+)/gi, 'teal-$1');
    
    // Swap hex codes
    content = content.replace(/d946ef/gi, '10b981'); // fuchsia-500 -> emerald-500
    content = content.replace(/c026d3/gi, '059669'); // fuchsia-600 -> emerald-600
    content = content.replace(/e879f9/gi, '34d399'); // fuchsia-400 -> emerald-400
    content = content.replace(/f472b6/gi, '2dd4bf'); // pink-400 -> teal-400

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        changedCount++;
        console.log(`Updated theme colors in: ${filePath}`);
    }
}

walkDir(targetDir, swapColors);
console.log(`\nEmerald Theme swap complete! Modified ${changedCount} files.`);
