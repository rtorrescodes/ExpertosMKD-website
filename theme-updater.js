const fs = require('fs');
const path = require('path');

function replaceColors(content) {
  let c = content;
  // Backgrounds
  c = c.replace(/bg-white/g, 'glass-card border-white/5');
  c = c.replace(/bg-gray-50/g, 'bg-white/5');
  c = c.replace(/bg-gray-100/g, 'bg-white/10');
  c = c.replace(/bg-gray-200/g, 'bg-white/20');
  c = c.replace(/bg-gray-900/g, 'bg-slate-900');
  c = c.replace(/bg-black/g, 'bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20');
  c = c.replace(/hover:bg-gray-50/g, 'hover:bg-white/10');
  c = c.replace(/hover:bg-gray-100/g, 'hover:bg-white/20');
  c = c.replace(/hover:bg-gray-800/g, 'hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-400/40');
  
  // Text colors
  c = c.replace(/text-gray-900/g, 'text-white');
  c = c.replace(/text-gray-800/g, 'text-slate-200');
  c = c.replace(/text-gray-700/g, 'text-slate-300');
  c = c.replace(/text-gray-600/g, 'text-slate-400');
  c = c.replace(/text-gray-500/g, 'text-slate-400');
  c = c.replace(/text-gray-400/g, 'text-slate-500');
  c = c.replace(/text-black/g, 'text-white');
  
  // Borders
  c = c.replace(/border-gray-200/g, 'border-white/10');
  c = c.replace(/border-gray-300/g, 'border-white/10');
  c = c.replace(/divide-gray-200/g, 'divide-white/5');
  c = c.replace(/divide-gray-300/g, 'divide-white/10');
  c = c.replace(/ring-gray-300/g, 'ring-white/10');
  c = c.replace(/ring-gray-500\/10/g, 'ring-white/10');
  c = c.replace(/hover:border-black/g, 'hover:border-cyan-400');
  c = c.replace(/hover:text-black/g, 'hover:text-cyan-400');
  c = c.replace(/focus:border-black/g, 'focus:border-cyan-400 focus:ring-cyan-400');
  
  // Status badges
  c = c.replace(/bg-green-100 text-green-800/g, 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20');
  c = c.replace(/bg-green-50 text-green-700/g, 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20');
  c = c.replace(/bg-yellow-100 text-yellow-800/g, 'bg-amber-500/10 text-amber-400 border border-amber-500/20');
  c = c.replace(/bg-yellow-50 text-yellow-800/g, 'bg-amber-500/10 text-amber-400 border border-amber-500/20');
  c = c.replace(/bg-blue-100 text-blue-800/g, 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20');
  c = c.replace(/bg-blue-50 text-blue-700/g, 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20');
  c = c.replace(/bg-red-100 text-red-800/g, 'bg-rose-500/10 text-rose-400 border border-rose-500/20');
  c = c.replace(/bg-red-50 text-red-700/g, 'bg-rose-500/10 text-rose-400 border border-rose-500/20');
  c = c.replace(/bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600/g, 'bg-white/5 px-2 py-1 text-xs font-medium text-slate-300 border border-white/10');

  // Input styles (inputs need transparent dark background instead of white)
  c = c.replace(/<input type="text"/g, '<input type="text" className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500"');
  c = c.replace(/<input type="number"/g, '<input type="number" className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500"');
  c = c.replace(/<textarea/g, '<textarea className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500"');
  
  return c;
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') && !fullPath.endsWith('TenantSidebar.tsx') && !fullPath.endsWith('TenantHeader.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const newContent = replaceColors(content);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDir('src/components/dashboard');
processDir('src/app/site');
