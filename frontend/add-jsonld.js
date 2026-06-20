const fs = require('fs');
const path = require('path');

const pages = [
  { file: 'src/app/about/page.tsx', key: 'about' },
  { file: 'src/app/services/page.tsx', key: 'services' },
  { file: 'src/app/portfolio/page.tsx', key: 'portfolio' },
  { file: 'src/app/careers/page.tsx', key: 'careers' },
  { file: 'src/app/contact/page.tsx', key: 'contact' },
  { file: 'src/app/testimonials/page.tsx', key: 'testimonials' },
  { file: 'src/app/case-studies/page.tsx', key: 'case-studies' },
  { file: 'src/app/blog/page.tsx', key: 'blog' },
  { file: 'src/app/privacy-policy/page.tsx', key: 'privacy-policy' },
  { file: 'src/app/terms-of-service/page.tsx', key: 'terms-of-service' },
];

pages.forEach(({ file, key }) => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('PageJsonLd')) {
    console.log(`Skipping ${file}, already has PageJsonLd`);
    return;
  }

  // Add import
  const importStatement = `import PageJsonLd from "@/components/seo/PageJsonLd";\n`;
  
  // Find the first import and add our import right after it
  const firstImportMatch = content.match(/import .* from .*;\n/);
  if (firstImportMatch) {
    content = content.replace(firstImportMatch[0], firstImportMatch[0] + importStatement);
  } else {
    content = importStatement + content;
  }

  // Now wrap the return in fragments and add PageJsonLd
  // This is a bit tricky because return could be return <Component /> or return ( ... )
  // Let's use a regex to find the return statement of the export default function
  const functionRegex = /export default function\s+\w+\s*\([^)]*\)\s*\{([\s\S]*?)return\s+([^;]+);/m;
  const match = content.match(functionRegex);
  
  if (match) {
    const returnBody = match[2].trim();
    // if returnBody starts with < and doesn't start with <>, we need to wrap it
    // if it starts with ( we wrap the inside
    let newReturn = `return (\n    <>\n      <PageJsonLd pageKey="${key}" />\n      ${returnBody}\n    </>\n  );`;
    
    if (returnBody.startsWith('(')) {
       // It's wrapped in parens, strip them and wrap in fragment
       const inner = returnBody.substring(1, returnBody.length - 1).trim();
       if (inner.startsWith('<>')) {
           // already a fragment, just inject inside the fragment
           newReturn = `return (\n    <>\n      <PageJsonLd pageKey="${key}" />\n      ${inner.substring(2)}\n  );`;
       } else {
           newReturn = `return (\n    <>\n      <PageJsonLd pageKey="${key}" />\n      ${inner}\n    </>\n  );`;
       }
    }
    
    content = content.replace(functionRegex, `export default function ${match[0].split('(')[0].split(' ')[3]}() {${match[1]}return ` + newReturn.substring(7));
    // Actually replace is safer this way:
    content = content.substring(0, match.index) + 
              content.substring(match.index).replace(match[0], `export default function ${match[0].split('(')[0].split(' ')[3]}() {${match[1]}${newReturn}`);
              
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`Could not find return in ${file}`);
  }
});
