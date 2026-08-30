const fs = require('fs');
const path = require('path');
function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      search(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('redirect("/login")') || content.includes("redirect('/login')")) {
        content = content.replace(/redirect\("\/login"\)/g, 'redirect("/admin/login")');
        content = content.replace(/redirect\('\/login'\)/g, 'redirect("/admin/login")');
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  }
}
search('src');
