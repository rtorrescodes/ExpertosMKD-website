const fs = require('fs');
const path = require('path');

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      search(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let c = fs.readFileSync(fullPath, 'utf8');
      
      // Fix 1: { params }: { params: { tenant: string } }
      if (c.includes('{ params }: { params: { tenant: string } }')) {
         c = c.replace('{ params }: { params: { tenant: string } }', 'props: { params: Promise<{ tenant: string }> }');
         if (c.includes('export default async')) {
            c = c.replace(/export default async function[^{]+{/, match => match + '\n  const { tenant } = await props.params;');
         } else {
            c = c.replace(/export default function[^{]+{/, match => match + '\n  const { tenant } = require("react").use(props.params);');
         }
         c = c.replace(/params\.tenant/g, 'tenant');
         fs.writeFileSync(fullPath, c);
         console.log('Fixed A', fullPath);
      }
      
      // Fix 2: { params }: { params: { tenant: string, slug: string } }
      else if (c.includes('{ params }: { params: { tenant: string, slug: string } }')) {
         c = c.replace('{ params }: { params: { tenant: string, slug: string } }', 'props: { params: Promise<{ tenant: string, slug: string }> }');
         if (c.includes('export default async')) {
            c = c.replace(/export default async function[^{]+{/, match => match + '\n  const { tenant, slug } = await props.params;');
         }
         c = c.replace(/params\.tenant/g, 'tenant');
         c = c.replace(/params\.slug/g, 'slug');
         fs.writeFileSync(fullPath, c);
         console.log('Fixed B', fullPath);
      }

      // Fix 3: { params }: { params: { tenant: string, id: string } }
      else if (c.includes('{ params }: { params: { tenant: string, id: string } }')) {
         c = c.replace('{ params }: { params: { tenant: string, id: string } }', 'props: { params: Promise<{ tenant: string, id: string }> }');
         if (c.includes('export default async')) {
            c = c.replace(/export default async function[^{]+{/, match => match + '\n  const { tenant, id } = await props.params;');
         }
         c = c.replace(/params\.tenant/g, 'tenant');
         c = c.replace(/params\.id/g, 'id');
         fs.writeFileSync(fullPath, c);
         console.log('Fixed C', fullPath);
      }

      // Fix 4: { params }: { params: { tenant: string, token: string } }
      else if (c.includes('{ params }: { params: { tenant: string, token: string } }')) {
         c = c.replace('{ params }: { params: { tenant: string, token: string } }', 'props: { params: Promise<{ tenant: string, token: string }> }');
         if (c.includes('export default async')) {
            c = c.replace(/export default async function[^{]+{/, match => match + '\n  const { tenant, token } = await props.params;');
         }
         c = c.replace(/params\.tenant/g, 'tenant');
         c = c.replace(/params\.token/g, 'token');
         fs.writeFileSync(fullPath, c);
         console.log('Fixed D', fullPath);
      }
      
      // Fix 5: { params }: { params: any }
      else if (c.includes('{ params }: { params: any }')) {
         c = c.replace('{ params }: { params: any }', 'props: { params: Promise<any> }');
         if (c.includes('export default async')) {
            c = c.replace(/export default async function[^{]+{/, match => match + '\n  const { tenant } = await props.params;');
         } else {
            c = c.replace(/export default function[^{]+{/, match => match + '\n  const { tenant } = require("react").use(props.params);');
         }
         c = c.replace(/params\.tenant/g, 'tenant');
         fs.writeFileSync(fullPath, c);
         console.log('Fixed E', fullPath);
      }
      
      // Layout fixes:
      else if (c.includes('children,') && c.includes('params,')) {
         if (c.includes('params: { tenant: string }')) {
           c = c.replace(/\{\s*children,\s*params,\s*\}:\s*\{\s*children:\s*React\.ReactNode;\s*params:\s*\{\s*tenant:\s*string\s*\}\s*\}/g, 'props: { children: React.ReactNode; params: Promise<{ tenant: string }> }');
           c = c.replace(/export default async function[^{]+{/, match => match + '\n  const { tenant } = await props.params;\n  const children = props.children;');
           c = c.replace(/params\.tenant/g, 'tenant');
           fs.writeFileSync(fullPath, c);
           console.log('Fixed F', fullPath);
         } else if (c.includes('params: { tenant: string, id: string }')) {
           c = c.replace(/\{\s*children,\s*params,\s*\}:\s*\{\s*children:\s*React\.ReactNode;\s*params:\s*\{\s*tenant:\s*string,\s*id:\s*string\s*\}\s*\}/g, 'props: { children: React.ReactNode; params: Promise<{ tenant: string, id: string }> }');
           c = c.replace(/export default async function[^{]+{/, match => match + '\n  const { tenant, id } = await props.params;\n  const children = props.children;');
           c = c.replace(/params\.tenant/g, 'tenant');
           c = c.replace(/params\.id/g, 'id');
           fs.writeFileSync(fullPath, c);
           console.log('Fixed G', fullPath);
         }
      }
    }
  }
}
search('src/app/site');
