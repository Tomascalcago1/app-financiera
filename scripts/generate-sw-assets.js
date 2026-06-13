import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const swFile = path.resolve(distDir, 'sw.js');

function getFilesRecursively(dir) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const res = path.resolve(dir, item.name);
    if (item.isDirectory()) {
      files = [...files, ...getFilesRecursively(res)];
    } else {
      files.push(res);
    }
  }
  return files;
}

if (!fs.existsSync(distDir)) {
  console.error('Directory "dist" does not exist. Run "npm run build" first.');
  process.exit(1);
}

const allFiles = getFilesRecursively(distDir);
const criticalAssets = ['/', '/index.html', '/favicon.svg', '/manifest.json', '/icons.svg'];
const nonCriticalAssets = [];

allFiles.forEach(file => {
  const relativePath = path.relative(distDir, file).replace(/\\/g, '/');
  
  // Avoid caching the service worker itself
  if (relativePath === 'sw.js') return;
  // Do not cache .map files
  if (relativePath.endsWith('.map')) return;
  // Exclude SEO/Crawler utility files and big og-image from PWA cache to save mobile resources
  if (
    relativePath === 'robots.txt' ||
    relativePath === 'sitemap.xml' ||
    relativePath === 'og-image.png'
  ) {
    return;
  }
  
  // Exclude non-latin font files to save bandwidth and prevent install failures
  if (
    relativePath.includes('cyrillic') ||
    relativePath.includes('greek') ||
    relativePath.includes('vietnamese') ||
    relativePath.includes('devanagari')
  ) {
    return;
  }

  const pathWithSlash = '/' + relativePath;

  // Classify as critical vs non-critical
  const isCritical = 
    relativePath === 'favicon.svg' ||
    relativePath === 'manifest.json' ||
    relativePath === 'icons.svg' ||
    relativePath === 'index.html' ||
    relativePath.includes('assets/index-') ||
    relativePath.includes('assets/vendor-react-') ||
    relativePath.includes('assets/vendor-vercel-') ||
    relativePath.includes('assets/rolldown-runtime-') ||
    relativePath.includes('inter-latin-') ||
    relativePath.includes('inter-latin-ext-');

  if (isCritical) {
    if (!criticalAssets.includes(pathWithSlash)) {
      criticalAssets.push(pathWithSlash);
    }
  } else {
    nonCriticalAssets.push(pathWithSlash);
  }
});

if (fs.existsSync(swFile)) {
  let swContent = fs.readFileSync(swFile, 'utf8');

  // Replace CRITICAL_ASSETS array
  const criticalString = JSON.stringify(criticalAssets, null, 2);
  swContent = swContent.replace(
    /const CRITICAL_ASSETS = \[[^]*?\];/g,
    `const CRITICAL_ASSETS = ${criticalString};`
  );

  // Replace NON_CRITICAL_ASSETS array
  const nonCriticalString = JSON.stringify(nonCriticalAssets, null, 2);
  swContent = swContent.replace(
    /const NON_CRITICAL_ASSETS = \[[^]*?\];/g,
    `const NON_CRITICAL_ASSETS = ${nonCriticalString};`
  );

  // Replace CACHE_NAME with a build timestamp to bust cache
  const buildTimestamp = Date.now();
  swContent = swContent.replace(
    /const CACHE_NAME = 'valia-cache-v\d+';/g,
    `const CACHE_NAME = 'valia-cache-b${buildTimestamp}';`
  );

  fs.writeFileSync(swFile, swContent, 'utf8');
  console.log(`SW: Successfully injected ${criticalAssets.length} critical and ${nonCriticalAssets.length} non-critical assets into sw.js. Updated CACHE_NAME with timestamp ${buildTimestamp}.`);
} else {
  console.error('dist/sw.js not found!');
}
