const fs = require("fs");
const path = require("path");

const workerSrc = path.join(".open-next", "worker.js");
const workerDest = path.join(".open-next", "assets", "_worker.js");
const routesDest = path.join(".open-next", "assets", "_routes.json");

if (fs.existsSync(workerSrc)) {
  fs.copyFileSync(workerSrc, workerDest);
  console.log("✓ Copied .open-next/worker.js -> .open-next/assets/_worker.js for Cloudflare Pages");
} else {
  console.warn("⚠ .open-next/worker.js not found!");
}

const routes = {
  version: 1,
  include: ["/*"],
  exclude: ["/_next/static/*", "/logo*.png", "/favicon.ico", "/robots.txt"],
};

fs.writeFileSync(routesDest, JSON.stringify(routes, null, 2));
console.log("✓ Generated .open-next/assets/_routes.json");
