const fs = require('fs');
const path = require('path');

const root = __dirname;
const appsDir = path.join(root, 'apps');
const celeritasDir = path.join(appsDir, 'celeritas');

if (!fs.existsSync(appsDir)) fs.mkdirSync(appsDir);
if (!fs.existsSync(celeritasDir)) fs.mkdirSync(celeritasDir);

const packageJsonPath = path.join(root, 'package.json');
const pkg = require(packageJsonPath);

pkg.workspaces = ["apps/*"];
fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));

console.log('Workspaces configured.');
