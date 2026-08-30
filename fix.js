const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('await props.params') || content.includes('use(props.params)')) return;

  // Replace exact signatures
  content = content.replace(/\{ params \}: \{ params: \{ tenant: string \} \}/g, 'props: any');
  content = content.replace(/\{ params \}: \{ params: \{ tenant: string, slug: string \} \}/g, 'props: any');
  content = content.replace(/\{ params \}: \{ params: \{ tenant: string, handle: string \} \}/g, 'props: any');
  content = content.replace(/\{ params \}: \{ params: \{ tenant: string, id: string \} \}/g, 'props: any');
  content = content.replace(/\{ params \}: \{ params: \{ tenant: string, token: string \} \}/g, 'props: any');
  
  content = content.replace(/\{\s*params\s*\}:\s*\{\s*params:\s*any\s*\}/g, 'props: any');
  content = content.replace(/\{\s*params,\s*\}:\s*\{\s*params:\s*\{\s*tenant:\s*string\s*\}\s*\}/g, 'props: any');
  
  content = content.replace(/children,\s*params\s*\}:\s*\{\s*children:\s*React\.ReactNode;\s*params:\s*\{\s*tenant:\s*string\s*\}\s*\}/g, 'props: any');
  content = content.replace(/children,\s*params\s*\}:\s*\{\s*children:\s*React\.ReactNode;\s*params:\s*\{\s*tenant:\s*string,\s*id:\s*string\s*\}\s*\}/g, 'props: any');

  // Edge cases
  content = content.replace(/\{\n  params,\n\}: \{\n  params: \{ tenant: string \};\n\}/g, 'props: any');
  content = content.replace(/\{\n  children,\n  params\n\}: \{\n  children: React.ReactNode;\n  params: \{ tenant: string \};\n\}/g, 'props: any');

  const isClient = content.includes('use client') || content.includes("'use client'");
  const isAsync = content.includes('export default async function');
  
  if (isClient) {
    content = content.replace(/params\.tenant/g, '(require("react").use(props.params)).tenant');
    content = content.replace(/params\.slug/g, '(require("react").use(props.params)).slug');
    content = content.replace(/params\.handle/g, '(require("react").use(props.params)).handle');
    content = content.replace(/params\.id/g, '(require("react").use(props.params)).id');
    content = content.replace(/params\.token/g, '(require("react").use(props.params)).token');
    
    if (content.includes('props: any')) {
       // Only replace 'children' if we actually had it in the signature we removed.
       // It's safer to just let the script run and manually fix `children` if it breaks layout.
       content = content.replace(/\bchildren\b/g, 'props.children');
    }

  } else if (isAsync) {
    content = content.replace(/params\.tenant/g, '(await props.params).tenant');
    content = content.replace(/params\.slug/g, '(await props.params).slug');
    content = content.replace(/params\.handle/g, '(await props.params).handle');
    content = content.replace(/params\.id/g, '(await props.params).id');
    content = content.replace(/params\.token/g, '(await props.params).token');
    
    if (content.includes('props: any')) {
       content = content.replace(/\bchildren\b/g, 'props.children');
    }
  }

  if (content.includes('{ params }')) {
     console.log('Missed signature in', filePath);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed', filePath);
}

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      search(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('params.tenant') || content.includes('params.slug') || content.includes('params.handle') || content.includes('params.id') || content.includes('params.token')) {
        processFile(fullPath);
      }
    }
  }
}
search('src/app/site');
