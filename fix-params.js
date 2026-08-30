const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('const params = await props.params') || content.includes('use(props.params)')) return;

  // Signatures to replace
  content = content.replace(/\{ params \}: \{ params: \{ tenant: string \} \}/g, 'props: any');
  content = content.replace(/\{ params \}: \{ params: \{ tenant: string, slug: string \} \}/g, 'props: any');
  content = content.replace(/\{ params \}: \{ params: \{ tenant: string, handle: string \} \}/g, 'props: any');
  content = content.replace(/\{ params \}: \{ params: \{ tenant: string, id: string \} \}/g, 'props: any');
  content = content.replace(/\{ params \}: \{ params: \{ tenant: string, token: string \} \}/g, 'props: any');
  content = content.replace(/\{\s*params\s*\}:\s*\{\s*params:\s*any\s*\}/g, 'props: any');
  content = content.replace(/\{\s*params,\s*\}:\s*\{\s*params:\s*\{\s*tenant:\s*string\s*\}\s*\}/g, 'props: any');
  content = content.replace(/children,\s*params\s*\}:\s*\{\s*children:\s*React\.ReactNode;\s*params:\s*\{\s*tenant:\s*string\s*\}\s*\}/g, 'props: any');
  content = content.replace(/children,\s*params\s*\}:\s*\{\s*children:\s*React\.ReactNode;\s*params:\s*\{\s*tenant:\s*string,\s*id:\s*string\s*\}\s*\}/g, 'props: any');
  content = content.replace(/\{\n  params,\n\}: \{\n  params: \{ tenant: string \};\n\}/g, 'props: any');
  content = content.replace(/\{\n  children,\n  params\n\}: \{\n  children: React.ReactNode;\n  params: \{ tenant: string \};\n\}/g, 'props: any');

  const isClient = content.includes('use client') || content.includes("'use client'");
  const isAsync = content.includes('export default async function');
  
  if (isClient) {
    const match = content.match(/export default function[^{]+{/);
    if (match) {
      const inject = match[0] + '\n  const params = require("react").use(props.params);\n' + (match[0].includes('props: any') && !content.includes('props.children') ? '  const children = props.children;\n' : '');
      content = content.replace(match[0], inject);
    }
  } else if (isAsync) {
    const match = content.match(/export default async function[^{]+{/);
    if (match) {
      const inject = match[0] + '\n  const params = await props.params;\n' + (match[0].includes('props: any') && !content.includes('props.children') && match[0].includes('Layout') ? '  const children = props.children;\n' : '');
      content = content.replace(match[0], inject);
    }
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
