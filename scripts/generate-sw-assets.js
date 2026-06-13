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
const assetsToCache = ['/', '/index.html'];

allFiles.forEach(file => {
  const relativePath = path.relative(distDir, file).replace(/\\/g, '/');
  // Avoid caching the service worker itself
  if (relativePath === 'sw.js') return;
  // Do not cache .map files if there are any
  if (relativePath.endsWith('.map')) return;
  
  assetsToCache.push('/' + relativePath);
});

if (fs.existsSync(swFile)) {
  let swContent = fs.readFileSync(swFile, 'utf8');

  // Replace ASSETS_TO_CACHE array
  const assetsString = JSON.stringify(assetsToCache, null, 2);
  swContent = swContent.replace(
    /const ASSETS_TO_CACHE = \[[^]*?\];/g,
    `const ASSETS_TO_CACHE = ${assetsString};`
  );

  // Replace CACHE_NAME with a build timestamp to bust cache
  const buildTimestamp = Date.now();
  swContent = swContent.replace(
    /const CACHE_NAME = 'valia-cache-v\d+';/g,
    `const CACHE_NAME = 'valia-cache-b${buildTimestamp}';`
  );

  fs.writeFileSync(swFile, swContent, 'utf8');
  console.log(`SW: Successfully injected ${assetsToCache.length} assets into sw.js and updated CACHE_NAME with timestamp ${buildTimestamp}.`);
} else {
  console.error('dist/sw.js not found!');
}
