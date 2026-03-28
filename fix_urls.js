const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const newContent = content.replace(/http:\/\/localhost:4000/g, 'http://129.159.236.176:4000');
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir('d:\\STACKX\\New folder\\git\\StackX\\admin\\src');
replaceInDir('d:\\STACKX\\New folder\\git\\StackX\\frontend\\src');
console.log('All hardcoded URLs have been successfully updated to the Production IP!');
