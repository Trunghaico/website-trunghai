const fs = require("fs");
const path = require("path");

const openNextDir = path.join(process.cwd(), ".open-next");
const workerSrc = path.join(openNextDir, "worker.js");
const workerDest = path.join(openNextDir, "_worker.js");
const assetsDir = path.join(openNextDir, "assets");
const routesDest = path.join(openNextDir, "_routes.json");

// 1. Copy worker.js to _worker.js in .open-next (preserves all relative imports to ./cloudflare, ./middleware, etc.)
if (fs.existsSync(workerSrc)) {
  fs.copyFileSync(workerSrc, workerDest);
  console.log("✓ Created .open-next/_worker.js");
} else {
  console.warn("⚠ .open-next/worker.js not found!");
}

// 2. Copy static assets from .open-next/assets to .open-next root so Cloudflare Pages serves them
if (fs.existsSync(assetsDir)) {
  const items = fs.readdirSync(assetsDir);
  for (const item of items) {
    if (item === "_worker.js") continue;
    const srcPath = path.join(assetsDir, item);
    const destPath = path.join(openNextDir, item);
    fs.cpSync(srcPath, destPath, { recursive: true });
  }
  console.log("✓ Synced static assets from .open-next/assets to .open-next root");
}

// 3. Generate _routes.json to route dynamic paths to _worker.js and static files to CDN
const routes = {
  version: 1,
  include: ["/*"],
  exclude: ["/_next/static/*", "/logo*.png", "/favicon.ico", "/robots.txt"],
};

fs.writeFileSync(routesDest, JSON.stringify(routes, null, 2));
console.log("✓ Generated .open-next/_routes.json");
