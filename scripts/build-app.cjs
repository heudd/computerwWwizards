const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = process.env.APP;
if (!app) {
  console.error('APP env not set');
  process.exit(1);
}

const appDir = path.join(__dirname, '..', 'apps', app);
const distDir = path.join(appDir, 'dist');
const rootDistDir = path.join(__dirname, '..', 'dist', app);

console.log(`Building app: ${app}`);
const result = spawnSync('pnpm', ['build'], { cwd: appDir, stdio: 'inherit' });
if (result.status !== 0) {
  console.error('Build failed');
  process.exit(result.status);
}

if (!fs.existsSync(distDir)) {
  console.error('No dist folder found after build');
  process.exit(1);
}

fs.rmSync(rootDistDir, { recursive: true, force: true });
fs.mkdirSync(rootDistDir, { recursive: true });

// Copy dist to root/dist/app
function copyRecursive(src, dest) {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
copyRecursive(distDir, rootDistDir);
console.log(`Copied ${distDir} to ${rootDistDir}`);
