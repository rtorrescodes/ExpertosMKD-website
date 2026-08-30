const fs = require('fs');

let c = fs.readFileSync('src/app/site/layout.tsx', 'utf8');
c = c.replace('className="antialiased min-h-screen"', 'className="antialiased min-h-screen bg-gray-50 text-gray-900"');
fs.writeFileSync('src/app/site/layout.tsx', c);

let c2 = fs.readFileSync('src/app/hub/layout.tsx', 'utf8');
c2 = c2.replace('className="antialiased min-h-screen"', 'className="antialiased min-h-screen bg-gray-50 text-gray-900"');
fs.writeFileSync('src/app/hub/layout.tsx', c2);
